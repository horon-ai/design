import { useSyncExternalStore } from "react";

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

/** The active color scheme; `light` on the server and before hydration. */
export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, readIsDark, () => false) ? "dark" : "light";
}
