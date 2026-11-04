import type { Localized } from "@/i18n";

/**
 * Substitutes `{name}` placeholders in both locales.
 *
 * Pages that put token data inside a sentence (counts, px values, colors) keep
 * the sentence in one message and fill the data in at render time, so the
 * English adaptation can reorder the sentence without the page splitting it.
 * A placeholder with no value is left untouched, which makes a missing value
 * visible in review instead of silently rendering "undefined".
 */
export function fill(entry: Localized, values: Record<string, string | number>): Localized {
  const apply = (text: string) =>
    text.replace(/\{(\w+)\}/g, (match, key: string) =>
      Object.hasOwn(values, key) ? String(values[key]) : match,
    );

  return { ko: apply(entry.ko), en: apply(entry.en) };
}
