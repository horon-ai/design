/**
 * Canonical link target for one site path.
 *
 * Cloudflare Pages serves a directory page at `<path>/` and answers the bare
 * `<path>` with a 308 to the slashed form, so a link without the slash pays a
 * redirect on every internal navigation and the sitemap advertises a URL that
 * is not the final one. Rendering every internal page link through `siteHref`
 * makes the markup agree with what the host serves, and the browser goes
 * straight to the page.
 *
 * Files (`/llms.txt`, `/sitemap.xml`), external URLs and in-page anchors carry
 * no directory of their own and come back untouched.
 */
export function siteHref(href: string): string {
  if (!href.startsWith("/")) return href;
  const [path, hash] = href.split("#");
  if (path === "/" || /\.[a-z0-9]+$/i.test(path)) return href;
  const base = path.endsWith("/") ? path : `${path}/`;
  return hash === undefined ? base : `${base}#${hash}`;
}
