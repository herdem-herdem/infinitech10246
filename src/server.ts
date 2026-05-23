import "./lib/error-capture";
if (typeof process === 'undefined') {
  globalThis.process = { env: {} } as any;
} else if (!process.env) {
  process.env = {};
}
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

function looksLikeStaticAssetPath(pathname: string): boolean {
  if (pathname.startsWith("/assets/")) return true;

  // Common "public root" files.
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  return false;
}

async function maybeServePagesAsset(request: Request, env: unknown): Promise<Response | null> {
  const assetsFetcher = (env as any)?.ASSETS;
  if (!assetsFetcher || typeof assetsFetcher.fetch !== "function") return null;

  const { pathname } = new URL(request.url);
  if (!looksLikeStaticAssetPath(pathname)) return null;

  // In Pages Functions "advanced mode", the Function must forward requests to static assets,
  // otherwise no assets will be served.
  // See: https://developers.cloudflare.com/pages/functions/advanced-mode/
  return await assetsFetcher.fetch(request);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const assetResponse = await maybeServePagesAsset(request, env);
      if (assetResponse) return assetResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      
      // Add no-cache headers to HTML responses so browsers always get fresh asset hashes
      const contentType = normalized.headers.get("content-type") ?? "";
      if (contentType.includes("text/html")) {
        const newHeaders = new Headers(normalized.headers);
        newHeaders.set("Cache-Control", "no-cache, no-store, must-revalidate");
        newHeaders.set("Pragma", "no-cache");
        return new Response(normalized.body, {
          status: normalized.status,
          headers: newHeaders,
        });
      }
      
      return normalized;
    } catch (error) {
      console.error(error);
      return new Response(`SSR CRASH: ${error instanceof Error ? error.stack : String(error)}`, {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  },
};
