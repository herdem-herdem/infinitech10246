// Cloudflare Pages Functions (advanced mode) module entrypoint.
//
// This FILE must be named `_worker.js` and placed in the Pages output directory root.
// We keep the actual module graph in `./_worker/` so it can import its own chunks.
export { default } from "./_worker/server.js";
export * from "./_worker/server.js";
