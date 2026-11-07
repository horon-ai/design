import { useSyncExternalStore } from "react";

/** The two schemes the `.dark` class switch can report. */
export type ColorScheme = "light" | "dark";

const noop = () => {};

/**
 * The theme is stored as the `.dark` class on <html> (the site's ThemeToggle
 * writes it), so that class is the only source — `prefers-color-scheme` is not
 * consulted.
 */
function subscribe(onChange: () => void): () => void {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") return noop;
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function readIsDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/**
 * The active color scheme; `light` on the server and before hydration.
 *
 * The `.dark` class on <html> is the only source, watched with a `MutationObserver`, so a toggle anywhere on the
 * page re-renders every caller. `prefers-color-scheme` is deliberately ignored: the theme is an explicit switch,
 * not an OS follow. A server render reports `light` until the class is read on the client.
 *
 * @returns `dark` while the root element carries the `.dark` class, `light` otherwise.
 *
 * @example
 * ```tsx
 * import { useColorScheme } from "@horon-ai/react";
 *
 * function ThemeToggle() {
 *   const scheme = useColorScheme();
 *   return (
 *     <Button variant="ghost" onClick={() => document.documentElement.classList.toggle("dark")}>
 *       {scheme === "dark" ? "Light" : "Dark"}
 *     </Button>
 *   );
 * }
 * ```
 */
export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, readIsDark, () => false) ? "dark" : "light";
}
