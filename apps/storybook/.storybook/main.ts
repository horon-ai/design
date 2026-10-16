import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * Storybook renders BOTH component layers:
 *  - @horon/web  -> DOM components (shadcn/ui on Base UI)
 *  - @horon/app      -> React Native components, aliased to react-native-web
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
    viteConfig.resolve.alias = Object.assign({}, viteConfig.resolve.alias, { "react-native": "react-native-web" });
    viteConfig.resolve.dedupe = [...(viteConfig.resolve.dedupe ?? []), "react", "react-dom", "react-native-web"];
    viteConfig.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ...(viteConfig.resolve.extensions ?? []),
    ];
    viteConfig.optimizeDeps = {
      ...viteConfig.optimizeDeps,
      include: [...(viteConfig.optimizeDeps?.include ?? []), "react-native-web"],
    };

    return viteConfig;
  },
};

export default config;
