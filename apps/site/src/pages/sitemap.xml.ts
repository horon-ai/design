import type { APIRoute } from "astro";
import { components } from "@/data/components";
import { foundationsNav } from "@/data/nav";

const pages = ["/", "/get-started", "/foundations", "/components", "/updates", ...foundationsNav.filter((item) => item.href !== "/foundations").map((item) => item.href), ...components.map((component) => `/components/${component.slug}`)];

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? "https://design.horon.ai";
  const urls = pages
    .map((path) => `  <url><loc>${new URL(path, origin).toString()}</loc></url>`)
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
