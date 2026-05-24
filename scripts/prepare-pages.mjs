import { copyFile, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const clientDir = path.join(distDir, "client");
const serverDir = path.join(distDir, "server");

const wranglerDeployRedirect = path.join(rootDir, ".wrangler", "deploy", "config.json");

// Cloudflare Pages "advanced mode" looks for a `_worker.js` FILE in the output directory.
// We'll keep the actual module graph in a sibling folder (`_worker/`) and point the entry at it.
const pagesWorkerEntryFile = path.join(clientDir, "_worker.js");
const pagesWorkerDir = path.join(clientDir, "_worker");
const pagesWorkerAssetsDir = path.join(pagesWorkerDir, "assets");

async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDirRecursive({ fromDir, toDir }) {
  if (!(await pathExists(fromDir))) return;
  await mkdir(toDir, { recursive: true });

  const entries = await readdir(fromDir, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(fromDir, entry.name);
    const to = path.join(toDir, entry.name);
    if (entry.isDirectory()) {
      await copyDirRecursive({ fromDir: from, toDir: to });
      continue;
    }
    if (entry.isFile()) {
      await copyFile(from, to);
    }
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
  await rm(pagesWorkerEntryFile, { force: true });
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

  // Pages will load `_worker.js` (module worker entry).
  //
  // IMPORTANT: TanStack Start's SSR chunk graph can include relative imports like:
  //   import { ... } from "../server.js"
  // from inside `_worker/assets/*`.
  // So we must preserve `server.js` at the worker module root for those imports to resolve.
  await copyFile(path.join(serverDir, serverEntryName), path.join(pagesWorkerDir, "server.js"));

  // Minimal module entry that re-exports the actual worker.
  // Keep this file stable regardless of Vite's server entry naming.
  await copyFile(path.join(rootDir, "scripts", "templates", "pages-worker-index.mjs"), pagesWorkerEntryFile);

  // Copy the entire SSR asset graph.
  // Some builds can emit extensionless modules (e.g. "h3-v2") or nested folders.
  await copyDirRecursive({
    fromDir: path.join(serverDir, "assets"),
    toDir: pagesWorkerAssetsDir,
  });
}

await main();
