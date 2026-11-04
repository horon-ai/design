/**
 * Client-side locale state for the docs site.
 *
 * There is one URL per page and no `/en` routes: the locale lives on
 * `<html lang data-locale>`, is persisted in localStorage, and is applied
 * before the first paint by the script in `./prepaint`. Static Astro text uses
 * `<T m={...} />` (both strings rendered, one hidden by `styles/i18n.css`),
 * React islands read the attribute through `useLocale()` from `./react`.
 */

export type Locale = "ko" | "en";

/** Every locale the site ships, in switch order. Korean is canonical. */
export const locales: readonly Locale[] = ["ko", "en"];

export const defaultLocale: Locale = "ko";

/** Names shown on the language switch, each written in its own language. */
export const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
};

/**
 * BCP 47 tags for the library components that format dates
 * (`Calendar`, `DateField`). `Intl.DateTimeFormat(undefined)` would follow the
 * browser and print Korean months on an English page.
 */
export const localeTags: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
};

/** One phrase in both locales. Korean is the source; English is an adaptation. */
export type Localized = { ko: string; en: string };

/**
 * Declares a module's messages. The identity function exists so messages keep
 * one shape and get checked at the definition site.
 */
export function defineMessages<K extends string>(m: Record<K, Localized>): Record<K, Localized> {
  return m;
}

/**
 * Returns the phrase for `locale`. The parameter is a plain string because it
 * can come from `localStorage`, a meta tag or `data-locale`; anything other than
 * `"en"` falls back to the Korean source.
 */
export function pick(entry: Localized, locale: string): string {
  return locale === "en" ? entry.en : entry.ko;
}

export const LOCALE_STORAGE_KEY = "horon-locale";

/** Dispatched on `document` after `setLocale` has updated the document. */
export const LOCALE_EVENT = "horon:locale";

/** Reads the locale the document currently renders. Server and pre-paint default to Korean. */
export function readLocale(): Locale {
  if (typeof document === "undefined") {
    return defaultLocale;
  }
  return document.documentElement.dataset.locale === "en" ? "en" : defaultLocale;
}

/**
 * Applies `locale` to `<html lang data-locale>`, persists it, and notifies
 * subscribers. React islands re-render through `useLocale()`; `BaseLayout`
 * swaps the document title through the `LOCALE_EVENT` listener.
 */
export function setLocale(locale: Locale): void {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.lang = locale;
  root.dataset.locale = locale;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* Private mode can refuse writes; the in-page locale still applies. */
  }
  document.dispatchEvent(new CustomEvent<Locale>(LOCALE_EVENT, { detail: locale, bubbles: true }));
}
