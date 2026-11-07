import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { defineConfig } from "@lynx-js/rspeedy";

/**
 * The gallery app is built twice from one entry: `main.lynx.bundle` for the
 * Lynx engine (iOS simulator, Android) and `main.web.bundle` for
 * `@lynx-js/web-core`'s `<lynx-view>` in a browser.
 */
export default defineConfig({
  plugins: [pluginReactLynx()],
  environments: {
    lynx: {},
    web: {},
  },
  source: {
    entry: {
      main: "./example/index.tsx",
    },
  },
  output: {
    distPath: {
      root: "./example/dist",
    },
  },
});
