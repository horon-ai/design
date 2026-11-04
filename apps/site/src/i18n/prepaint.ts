/**
 * Inline scripts BaseLayout renders with `<script is:inline set:html={...} />`.
 *
 * They are source strings rather than modules because they have to run before
 * the module graph (pre-paint) and because Astro must not bundle or defer them.
 *
 * - `PREPAINT_SCRIPT` goes in `<head>`, after `<title>` and the
 *   `horon:title-en` meta: it applies the stored locale to `<html lang
 *   data-locale>` so `styles/i18n.css` shows the right half of every `<T />`
 *   pair before the first paint.
 * - `LOCALE_RUNTIME_SCRIPT` goes before `</body>`: it keeps the document title
 *   in sync after `setLocale()` dispatches `LOCALE_EVENT`.
 *
 * The two exported cores exist so tests can exercise them without a DOM; the
 * scripts below inline their source. Keep them self-contained: no imports and
 * no module constants, or the inlined copy breaks.
 */

import { LOCALE_EVENT, LOCALE_STORAGE_KEY } from "./index";

/** Meta tag BaseLayout renders when the current page has an English title. */
export const LOCALE_TITLE_META_NAME = "horon:title-en";

/**
 * The slice of `Document` these scripts touch. A real `Document` satisfies it,
 * and so does a plain object in tests, so nothing has to be cast.
 */
export interface LocaleDocument {
  title: string;
  documentElement: { lang: string; dataset: Record<string, string | undefined> };
  querySelector(selector: string): { getAttribute(name: string): string | null } | null;
  addEventListener(type: string, listener: () => void): void;
}

/** Applies the stored locale and, for English, the English title before paint. */
export function applyStoredLocale(
  doc: LocaleDocument,
  readStored: () => string | null,
  titleMetaName: string,
): void {
  let stored: string | null = null;
  try {
    stored = readStored();
  } catch {
    stored = null;
  }
  const locale = stored === "en" ? "en" : "ko";
  const root = doc.documentElement;
  root.lang = locale;
  root.dataset.locale = locale;
  if (!root.dataset.titleKo) {
    root.dataset.titleKo = doc.title;
  }
  if (locale === "en") {
    const meta = doc.querySelector(`meta[name="${titleMetaName}"]`);
    const title = meta === null ? null : meta.getAttribute("content");
    if (title) {
      doc.title = title;
    }
  }
}

/** Wires `LOCALE_EVENT` to the document title and applies the current state. */
export function listenForLocaleChanges(
  doc: LocaleDocument,
  titleMetaName: string,
  eventName: string,
): void {
  const apply = () => {
    const root = doc.documentElement;
    const locale = root.dataset.locale === "en" ? "en" : "ko";
    root.lang = locale;
    if (locale === "ko") {
      if (root.dataset.titleKo) {
        doc.title = root.dataset.titleKo;
      }
      return;
    }
    const meta = doc.querySelector(`meta[name="${titleMetaName}"]`);
    const title = meta === null ? null : meta.getAttribute("content");
    doc.title = title || root.dataset.titleKo || doc.title;
  };
  doc.addEventListener(eventName, apply);
  apply();
}

export const PREPAINT_SCRIPT = `(() => {
  const read = () => {
    try {
      return window.localStorage.getItem("${LOCALE_STORAGE_KEY}");
    } catch {
      return null;
    }
  };
  (${applyStoredLocale.toString()})(document, read, "${LOCALE_TITLE_META_NAME}");
})();`;

export const LOCALE_RUNTIME_SCRIPT = `(() => {
  (${listenForLocaleChanges.toString()})(document, "${LOCALE_TITLE_META_NAME}", "${LOCALE_EVENT}");
})();`;
