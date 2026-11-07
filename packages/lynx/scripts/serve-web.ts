/**
 * Serves the gallery in a browser: the host page, the web-core client runtime
 * from `node_modules`, and the built web bundle.
 *
 * `bun run build` must have produced `example/dist/main.web.bundle` first. The
 * host page is served as-is from `example/host`, and the client runtime is
 * streamed out of `@lynx-js/web-core/dist/client_prod/static`, so nothing is
 * copied and a rebuild is picked up on the next request.
 *
 * `PORT` selects the port (default 4610).
 */
const root = `${import.meta.dir}/..`;
const clientStatic = `${root}/node_modules/@lynx-js/web-core/dist/client_prod/static`;
const dist = `${root}/example/dist`;
const host = `${root}/example/host`;

const port = Number(process.env.PORT ?? 4610);

const contentType = (path: string): string => {
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  if (path.endsWith(".wasm")) return "application/wasm";
  if (path.endsWith(".bundle")) return "application/octet-stream";
  if (path.endsWith(".json")) return "application/json; charset=utf-8";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
};

/** Serves one file, or falls through to the caller when it is missing. */
const serveFile = async (path: string): Promise<Response | undefined> => {
  const file = Bun.file(path);
  if (!(await file.exists())) return undefined;
  return new Response(file, { headers: { "content-type": contentType(path) } });
};

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname);

    if (path === "/" || path === "/index.html") return (await serveFile(`${host}/index.html`)) ?? new Response("host page missing", { status: 500 });
    if (path === "/main.web.bundle" || path === "/main.lynx.bundle") {
      return (await serveFile(`${dist}${path}`)) ?? new Response(`run \`bun run build\` first: ${path} is missing`, { status: 404 });
    }
    // Two things live under `/static`: the client runtime, which ships as
    // `client_prod/static`, and whatever rspeedy copied into the bundle's own
    // `static/` folder (images, fonts). The build's files are checked first so a
    // ported component's `<image src="/static/image/…">` resolves.
    if (path.startsWith("/static/")) {
      return (
        (await serveFile(`${dist}${path}`)) ??
        (await serveFile(`${clientStatic}${path.replace("/static", "")}`)) ??
        new Response("not found", { status: 404 })
      );
    }
    return (await serveFile(`${host}${path}`)) ?? new Response("not found", { status: 404 });
  },
});

console.log(`horon lynx gallery: http://127.0.0.1:${server.port}/`);
