/**
 * Render and interaction tests for the Expo components, run by jest-expo with
 * React Native Testing Library. They live in `test/render/*.jest.tsx` so the
 * repository's `bun test` (which collects `*.test.ts`) never picks them up.
 *
 * bun installs every package under `node_modules/.bun/<name>@<version>/`, so
 * the transform allow-list matches that directory name instead of the usual
 * `node_modules/<name>` segment. The same isolated layout means a workspace
 * source outside this package (`@horon-ai/tokens`) cannot find the
 * `@babel/runtime` helpers Babel injects into it, so they resolve from here.
 */
const transpiled = [
  "react-native",
  "@react-native",
  "react-native-svg",
  "react-native-safe-area-context",
  "phosphor-react-native",
  "expo",
  "@expo",
  "expo-[a-z-]+",
  "jest-expo",
  "@testing-library",
].join("|");

module.exports = {
  preset: "jest-expo/ios",
  testMatch: ["<rootDir>/test/render/**/*.jest.tsx"],
  transformIgnorePatterns: [`/node_modules/\\.bun/(?!(${transpiled}))`],
  moduleNameMapper: { "^@babel/runtime/(.*)$": "<rootDir>/node_modules/@babel/runtime/$1" },
};
