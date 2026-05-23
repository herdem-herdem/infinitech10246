import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const clientDir = path.join(distDir, "client");
const serverDir = path.join(distDir, "server");

const wranglerDeployRedirect = path.join(rootDir, ".wrangler", "deploy", "config.json");

const pagesWorkerDir = path.join(clientDir, "_worker.js");
const pagesWorkerAssetsDir = path.join(pagesWorkerDir, "assets");

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDirFiltered({ fromDir, toDir, filter }) {
  if (!(await pathExists(fromDir))) return;
  await mkdir(toDir, { recursive: true });

  const entries = await readdir(fromDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!filter(entry.name)) continue;
    await copyFile(path.join(fromDir, entry.name), path.join(toDir, entry.name));
  }
}

async function main() {
  // @cloudflare/vite-plugin may create a redirect config at `.wrangler/deploy/config.json`
  // pointing to `dist/client/wrangler.json`. We intentionally delete that generated config
  // for Pages deploys, so keep Wrangler from tripping over a dangling redirect locally.
  await rm(wranglerDeployRedirect, { force: true });

  // Remove build artifacts that are correct for Workers+Assets deployment, but noisy / host-specific for Pages deploys.
  await rm(path.join(clientDir, "wrangler.json"), { force: true });
  await rm(path.join(clientDir, ".assetsignore"), { force: true });

  // Rebuild the Pages Functions "advanced mode" worker directory.
  await rm(pagesWorkerDir, { recursive: true, force: true });
  await mkdir(pagesWorkerAssetsDir, { recursive: true });

  // TanStack Start SSR build output from Vite (server environment).
  const serverEntryCandidates = ["server.js", "index.js"];
  const serverEntryName = (
    await (async () => {
      for (const candidate of serverEntryCandidates) {
        if (await pathExists(path.join(serverDir, candidate))) return candidate;
      }
      return null;
    })()
  );

  if (!serverEntryName) {
    throw new Error(
      `prepare-pages: Could not find server entry in dist/server. Looked for: ${serverEntryCandidates.join(", ")}`,
    );
  }

  // Pages will load `_worker.js/index.js` (module worker entry).
  //
  // IMPORTANT: TanStack Start's SSR chunk graph can include relative imports like:
  //   import { ... } from "../server.js"
  // from inside `_worker.js/assets/*`.
  // So we must preserve `server.js` at the worker root for those imports to resolve.
  await copyFile(path.join(serverDir, serverEntryName), path.join(pagesWorkerDir, "server.js"));

  // Minimal module entry that re-exports the actual worker.
  // Keep this file stable regardless of Vite's server entry naming.
  await mkdir(pagesWorkerDir, { recursive: true });
  await copyFile(
    path.join(rootDir, "scripts", "templates", "pages-worker-index.mjs"),
    path.join(pagesWorkerDir, "index.js"),
  );

  // Copy only JS modules + source maps needed by the Worker runtime.
  await copyDirFiltered({
    fromDir: path.join(serverDir, "assets"),
    toDir: pagesWorkerAssetsDir,
    filter: (name) => /\.(?:js|mjs|cjs|map)$/i.test(name),
  });
}

await main();
