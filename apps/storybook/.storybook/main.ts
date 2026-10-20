import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook renders the single web component layer:
 *  - @horon-ai/react -> DOM components (shadcn/ui on Base UI)
 */
const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: { disableTelemetry: true },
  async viteFinal(viteConfig) {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];

    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.dedupe = [...(viteConfig.resolve.dedupe ?? []), "react", "react-dom"];

    return viteConfig;
  },
};

export default config;
