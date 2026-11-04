import {
  Button,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@horon-ai/react";
import { List } from "@phosphor-icons/react";

import { externalLinks, isActive, primaryNav } from "@/data/nav";
import { pick } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { LocaleButton, LocaleMenuItems, LocaleSwitch } from "./LocaleSwitch";
import { shellMessages as m } from "./messages";
import { SearchPalette } from "./SearchPalette";
import { ThemeToggle } from "./ThemeToggle";

export interface SiteHeaderBarProps {
  /** Current path, passed from Astro; the island has no router. */
  pathname: string;
}

function MobileMenu({ pathname }: SiteHeaderBarProps) {
  const locale = useLocale();
  return (
    <Menu>
      <MenuTrigger
        render={
          <IconButton
            variant="ghost"
            icon={<List />}
            label={pick(m.menu, locale)}
            className="md:hidden"
          />
        }
      />
      <MenuContent align="end">
        {primaryNav.map((item) => (
          <MenuItem
            key={item.href}
            selected={isActive(pathname, item.href)}
            render={
              <a
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
              />
            }
          >
            {pick(item.label, locale)}
          </MenuItem>
        ))}
        <MenuSeparator />
        {externalLinks.map((link) => (
          <MenuItem
            key={link.href}
            render={<a href={link.href} target="_blank" rel="noreferrer" />}
          >
            {pick(link.label, locale)}
          </MenuItem>
        ))}
        <MenuSeparator />
        <LocaleMenuItems />
      </MenuContent>
    </Menu>
  );
}

/**
 * Everything to the right of the brand lockup: primary sections, GitHub,
 * language switch, search, theme toggle and the mobile menu.
 *
 * The `<header>` element and the brand link are Astro markup in
 * `components/site/Header.astro`; this island renders the fragment that
 * follows them, so it sits inside the header row (Astro islands are
 * `display: contents`).
 */
export function SiteHeaderBar({ pathname }: SiteHeaderBarProps) {
  const locale = useLocale();

  return (
    <>
      <nav
        aria-label={pick(m.navLabel, locale)}
        className="hidden flex-1 items-center justify-center gap-1 md:flex"
      >
        {primaryNav.map((item) => (
          <Button
            key={item.href}
            variant="link"
            href={item.href}
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
          >
            {pick(item.label, locale)}
          </Button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1">
        {externalLinks.map((link) => (
          <Button
            key={link.href}
            variant="link"
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex"
          >
            {pick(link.label, locale)}
          </Button>
        ))}
        <LocaleButton className="sm:hidden" />
        <LocaleSwitch className="hidden sm:flex" />
        <SearchPalette />
        <ThemeToggle />
        <MobileMenu pathname={pathname} />
      </div>
    </>
  );
}
