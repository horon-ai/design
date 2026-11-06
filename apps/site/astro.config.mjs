import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// The public documentation site (design.horon.ai). It renders @horon-ai/react
// components as live React islands and reads every visual value from
// @horon-ai/tokens, so the docs and the library can never drift apart.
export default defineConfig({
  site: "https://design.horon.ai",
  // Cloudflare Pages serves each page at `<path>/` and 308s the bare path, so the
  // slashed form is the canonical one here too: dev and build agree with the host,
  // and `Astro.url.pathname` always carries the slash the canonical link emits.
  trailingSlash: "always",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
