import { Button, IconButton, Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@horon-ai/react";
import { CaretDown, GithubLogo, List } from "@phosphor-icons/react";

import { externalLinks, isActive, primaryNav } from "@/data/nav";
import { siteHref } from "@/lib/urls";
import { pick } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { LocaleMenuItems, LocaleSwitch } from "./LocaleSwitch";
import { shellMessages as m } from "./messages";
import { SearchPalette } from "./SearchPalette";
import { ThemeMenuItems, ThemeToggle } from "./ThemeToggle";

export interface SiteHeaderBarProps {
  /** Current path, passed from Astro; the island has no router. */
  pathname: string;
}

/**
 * Below `sm` the brand lockup, search and menu share 280px of measure at a
 * 320px viewport. The library's 32px rung keeps them on one row; the painted
 * 44px reach (an `after` box) is untouched, and from `sm` up every button keeps
 * its 40px size.
 */
const compactIcon = "size-8 [&_svg]:size-4 sm:size-10 sm:[&_svg]:size-5";

/** The header section links: secondary ink, primary on hover and on the current section. */
const navLinkClass =
  "rounded-md px-3 py-2 text-label-lg text-text-secondary hover:text-text-primary aria-[current=page]:text-text-primary data-[popup-open]:text-text-primary";

const childHrefs = new Set(primaryNav.flatMap((item) => (item.children ?? []).map((child) => child.href)));

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
        {/* Dropdown sections (Develop) list their pages flat, indented under the section. */}
        {primaryNav.flatMap((item) => [item, ...(item.children ?? [])]).map((item) => (
          <MenuItem
            key={item.href}
            selected={isActive(pathname, item.href)}
            className={childHrefs.has(item.href) ? "pl-6" : undefined}
            render={<a href={siteHref(item.href)} aria-current={isActive(pathname, item.href) ? "page" : undefined} />}
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
        <MenuSeparator />
        <ThemeMenuItems />
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
      {/* Plain text links with no track around them: the current section reads by
       * color alone (primary vs secondary), hover darkens the label. */}
      <nav aria-label={pick(m.navLabel, locale)} className="hidden items-center justify-center gap-1 lg:flex">
        {primaryNav.map((item) =>
          item.children ? (
            <Menu key={item.href}>
              <MenuTrigger
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={`inline-flex items-center gap-1 ${navLinkClass}`}
              >
                {pick(item.label, locale)}
                <CaretDown className="size-3" />
              </MenuTrigger>
              <MenuContent align="start">
                {item.children.map((child) => (
                  <MenuItem
                    key={child.href}
                    selected={isActive(pathname, child.href)}
                    render={<a href={siteHref(child.href)} aria-current={isActive(pathname, child.href) ? "page" : undefined} />}
                  >
                    {pick(child.label, locale)}
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
          ) : (
            <Button
              key={item.href}
              variant="link"
              href={siteHref(item.href)}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`no-underline ${navLinkClass}`}
            >
              {pick(item.label, locale)}
            </Button>
          ),
        )}
      </nav>

      {/* One row of equal 40px icon buttons with the language switch set off by a
       * wider gap. GitHub is an icon like search and theme, so every control
       * shares one height and baseline instead of mixing a text link in. */}
      <div className="ml-auto flex items-center gap-3 justify-self-end">
        {/* Below `lg` the header keeps only search and the menu; language,
         * theme and GitHub live inside the menu there. */}
        <LocaleSwitch className="hidden lg:flex" />
        <div className="flex items-center gap-1">
          <SearchPalette className={compactIcon} />
          <ThemeToggle className={`hidden lg:inline-flex ${compactIcon}`} />
          {externalLinks.map((link) => (
            <IconButton
              key={link.href}
              icon={<GithubLogo />}
              label={pick(link.label, locale)}
              nativeButton={false}
              render={<a href={link.href} target="_blank" rel="noreferrer" />}
              className={`hidden lg:inline-flex ${compactIcon}`}
            />
          ))}
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </>
  );
}
