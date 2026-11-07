import { IconButton, MenuItem, MenuLabel } from "@horon-ai/react";
import { Check, Moon, Sun } from "@phosphor-icons/react";

import { pick } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { shellMessages as m } from "./messages";

/** Same key and values the pre-paint script in BaseLayout reads. */
const THEME_STORAGE_KEY = "horon-theme";

function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle("dark", dark);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    /* Private mode can refuse writes; the page still changes theme. */
  }
}

/**
 * Header theme button. The `dark` class on `<html>` is the single source of
 * truth: BaseLayout's inline script applies the stored value before first
 * paint, and the two icons swap through CSS, so the button needs no React state
 * and cannot disagree with the page after hydration.
 *
 * `className` carries the header's narrow-width size rung, so the button keeps
 * the 44px painted reach while its visible box shrinks below `sm`.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <IconButton
      variant="ghost"
      className={className}
      icon={
        <>
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </>
      }
      label={pick(m.theme, locale)}
      onClick={() => {
        applyTheme(!document.documentElement.classList.contains("dark"));
      }}
    />
  );
}

/**
 * The same choice inside the mobile menu. The checkmarks swap through the
 * `dark` class like the header icons, so the items need no React state either.
 */
export function ThemeMenuItems() {
  const locale = useLocale();
  return (
    <>
      <MenuLabel>{pick(m.themeLabel, locale)}</MenuLabel>
      <MenuItem trailing={<Check className="dark:hidden" />} onClick={() => applyTheme(false)}>
        {pick(m.themeLight, locale)}
      </MenuItem>
      <MenuItem trailing={<Check className="hidden dark:block" />} onClick={() => applyTheme(true)}>
        {pick(m.themeDark, locale)}
      </MenuItem>
    </>
  );
}
