// Cloudflare Pages Functions (advanced mode) module entrypoint.
//
// We keep this as a tiny, stable shim so the "real" worker code can live in
// `./server.js` (which is also referenced by TanStack Start's server chunk graph).
export { default } from "./server.js";
export * from "./server.js";

