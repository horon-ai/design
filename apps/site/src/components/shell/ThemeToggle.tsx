import { IconButton } from "@horon-ai/react";
import { Moon, Sun } from "@phosphor-icons/react";

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
