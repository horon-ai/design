/**
 * React binding for the locale stored on `<html data-locale>`.
 *
 * `useSyncExternalStore` keeps the server snapshot at the canonical locale so
 * hydration matches the statically rendered Korean text; the client snapshot
 * immediately reflects the pre-paint locale, so English visitors see the
 * English strings without a flicker of Korean inside an island.
 */

import { useSyncExternalStore } from "react";

import { defaultLocale, LOCALE_EVENT, readLocale, type Locale } from "./index";

function subscribe(onStoreChange: () => void): () => void {
  document.addEventListener(LOCALE_EVENT, onStoreChange);
  return () => document.removeEventListener(LOCALE_EVENT, onStoreChange);
}

// Module-level so their identity stays stable across renders.
const getSnapshot = () => readLocale();
const getServerSnapshot = () => defaultLocale;

/** The locale the page is currently rendering; re-renders the island on switch. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
