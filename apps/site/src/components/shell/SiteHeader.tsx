import { Button, IconButton, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { List } from "@phosphor-icons/react";

import { externalLinks, isActive, primaryNav } from "@/data/nav";
import { siteHref } from "@/lib/urls";
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

/**
 * Below `sm` the brand lockup, the language button, search, theme and menu have
 * to share 280px of measure at a 320px viewport. The library's 32px rung keeps
 * them all on one row; the painted 44px reach (an `after` box) is untouched, and
 * from `sm` up every button keeps its 40px size.
 */
const compactIcon = "size-8 [&_svg]:size-4 sm:size-10 sm:[&_svg]:size-5";

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
            className={`lg:hidden ${compactIcon}`}
          />
        }
      />
      <MenuContent align="end">
        {primaryNav.map((item) => (
          <MenuItem
            key={item.href}
            selected={isActive(pathname, item.href)}
            render={<a href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} />}
          >
            {pick(item.label, locale)}
          </MenuItem>
        ))}
        <MenuSeparator />
        {externalLinks.map((link) => (
          <MenuItem key={link.href} render={<a href={link.href} target="_blank" rel="noreferrer" />}>
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
      <nav aria-label={pick(m.navLabel, locale)} className="hidden flex-1 items-center justify-center lg:flex">
        <div className="flex items-center gap-0.5 rounded-full border border-glass-border bg-glass-fill-strong p-1">
          {primaryNav.map((item) => (
            <Button
              key={item.href}
              variant="link"
              href={siteHref(item.href)}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className="rounded-full px-3.5 py-2 leading-[18px] hover:bg-glass-fill"
            >
              {pick(item.label, locale)}
            </Button>
          ))}
        </div>
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
        <LocaleButton className={`sm:hidden ${compactIcon}`} />
        <LocaleSwitch className="hidden sm:flex" />
        <SearchPalette className={compactIcon} />
        <ThemeToggle className={compactIcon} />
        <MobileMenu pathname={pathname} />
      </div>
    </>
  );
}
