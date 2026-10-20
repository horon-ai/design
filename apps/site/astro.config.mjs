import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// The public documentation site (design.horon.ai). It renders @horon-ai/react
// components as live React islands and reads every visual value from
// @horon-ai/tokens, so the docs and the library can never drift apart.
export default defineConfig({
  site: "https://design.horon.ai",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },
});
