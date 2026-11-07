import { realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";

import { withLynxConfig } from "@lynx-js/react/testing-library/rstest-config";
import { defineConfig } from "@rstest/core";

/**
 * `preact` here is the npm alias of `@lynx-js/internal-preact`. bun's isolated
 * store links that alias into this package and into `@lynx-js/react`, but not
 * into internal-preact's own folder, so its `hooks` and `jsx-runtime` builds
 * cannot resolve their bare `preact` import when the bundler follows them to
 * their real path. Pinning `preact` to the real package folder fixes every
 * subpath at once.
 */
const preactRoot = dirname(realpathSync(createRequire(import.meta.url).resolve("preact/package.json")));

/**
 * Render tests use the ReactLynx testing library, which runs components on a
 * JSDOM-backed element API. `withLynxConfig` reuses `lynx.config.ts`, so the
 * Tailwind pipeline and the JSX transform under test are the ones the gallery
 * builds with.
 *
 * Only `*.rstest.tsx` files are collected: the root `bun test` owns the plain
 * `*.test.ts` files (parity, tokens, generated-file drift) and must not pick
 * these up.
 */
export default defineConfig({
  extends: withLynxConfig(),
  include: ["test/render/**/*.rstest.tsx"],
  resolve: {
    alias: {
      preact: preactRoot,
    },
  },
  // Parallel runs in one checkout would share `dist/.rstest-temp`; set
  // `RSTEST_DIST` to give each run its own build folder.
  output: {
    distPath: { root: process.env.RSTEST_DIST ?? "dist" },
  },
});
