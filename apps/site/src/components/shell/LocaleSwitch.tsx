import { IconButton, MenuItem, MenuLabel, SegmentedControl } from "@horon-ai/react";
import { Check, Translate } from "@phosphor-icons/react";

import { localeLabels, locales, pick, setLocale } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { shellMessages as m } from "./messages";

/**
 * Header language control: a two-segment switch. It only calls `setLocale`, so
 * the URL, scroll position and page state stay where they are.
 */
export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <SegmentedControl
      className={className}
      size="sm"
      aria-label={pick(m.language, locale)}
      value={locale}
      onValueChange={(value) => setLocale(value === "en" ? "en" : "ko")}
      items={locales.map((value) => ({
        value,
        label: value === "ko" ? localeLabels.ko : localeLabels.en,
      }))}
    />
  );
}

/**
 * Below `sm` the segmented track does not fit next to the logo, search and
 * menu buttons, so the header keeps one icon button that flips the locale.
 */
export function LocaleButton({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <IconButton
      variant="ghost"
      icon={<Translate />}
      label={pick(m.language, locale)}
      className={className}
      onClick={() => setLocale(locale === "ko" ? "en" : "ko")}
    />
  );
}

/**
 * The same choice inside the mobile menu, where a segmented track does not fit
 * next to the logo and the icon buttons.
 */
export function LocaleMenuItems() {
  const locale = useLocale();
  return (
    <>
      <MenuLabel>{pick(m.language, locale)}</MenuLabel>
      {locales.map((value) => (
        <MenuItem
          key={value}
          selected={locale === value}
          trailing={locale === value ? <Check /> : undefined}
          onClick={() => setLocale(value)}
        >
          {value === "ko" ? localeLabels.ko : localeLabels.en}
        </MenuItem>
      ))}
    </>
  );
}
