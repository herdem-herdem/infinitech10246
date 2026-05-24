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

type ContactPayload = {
  name: string;
  email: string;
  message: string;
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
  if (pathname === "/humans.txt") return true;
  if (pathname === "/llms.txt") return true;
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

function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

async function maybeHandleContactApi(request: Request, env: unknown): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  if (pathname !== "/api/contact") return null;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse({ ok: false, error: "invalid_content_type" }, { status: 415 });
  }

  const data = (await request.json().catch(() => null)) as Partial<ContactPayload> | null;
  const name = (data?.name || "").toString().trim();
  const email = (data?.email || "").toString().trim();
  const message = (data?.message || "").toString().trim();

  if (!name || !email || !message) {
    return jsonResponse({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const emailPayload = {
    from: "Infinitech Website <noreply@infinitech10246.com>",
    to: "10246.infinitech@gmail.com",
    reply_to: `${name} <${email}>`,
    subject: `Yeni İletişim Mesajı - ${name}`,
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d; color: #ffffff; padding: 32px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #f5a524; font-size: 28px; margin: 0; letter-spacing: 0.2em;">INFINITECH</h1>
              <p style="color: #888; font-size: 12px; margin-top: 4px; letter-spacing: 0.3em;">TEAM #10246 &middot; YENİ MESAJ</p>
            </div>
            <hr style="border-color: #f5a52433; margin-bottom: 24px;" />
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #f5a524; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; width: 80px;">İsim</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #f5a524; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">E-posta</td>
                <td style="padding: 8px 0; color: #ffffff;"><a href="mailto:${email}" style="color: #f5a524;">${email}</a></td>
              </tr>
            </table>
            <hr style="border-color: #f5a52433; margin: 20px 0;" />
            <div>
              <p style="color: #f5a524; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px;">Mesaj</p>
              <p style="color: #cccccc; line-height: 1.7; white-space: pre-wrap;">${message}</p>
            </div>
            <hr style="border-color: #f5a52433; margin-top: 24px;" />
            <p style="color: #555; font-size: 11px; text-align: center; margin-top: 16px;">Bu e-posta otomatik olarak gönderilmiştir.</p>
          </div>
        `,
  };

  const apiKey = (env as any)?.RESEND_API_KEY;
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    return jsonResponse({ ok: false, error: "missing_resend_api_key" }, { status: 500 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    return jsonResponse({ ok: false, error: "resend_error", details }, { status: 502 });
  }

  return jsonResponse({ ok: true }, { status: 200 });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const assetResponse = await maybeServePagesAsset(request, env);
      if (assetResponse) return assetResponse;

      const contactApiResponse = await maybeHandleContactApi(request, env);
      if (contactApiResponse) return contactApiResponse;

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
