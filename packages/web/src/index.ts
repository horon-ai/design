// Single entry point for the web package.
// Web code imports components from "@horon/web" (or a subpath) and never from
// "@horon/app" — that boundary is enforced by eslint (see eslint.config.js).
export * from "./components/badge"
export * from "./components/button"
export * from "./components/card"
export * from "./components/input"
export * from "./components/label"
export * from "./components/separator"
export { cn } from "./lib/utils"
