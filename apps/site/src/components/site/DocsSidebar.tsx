/**
 * The docs section sidebar.
 *
 * Desktop (`lg` and up) is the library `Sidebar` (plain surface, the layout's own
 * color), sticky in the docs frame's first column under the header and scrolling on its own: one
 * `SidebarGroup` per block, one `SidebarItem` per entry. Below `lg`
 * the same blocks collapse under a single `SidebarGroup` disclosure so the
 * navigation does not push the page title down.
 *
 * It is an island because the group labels and the open/closed state need
 * `useLocale()` and the library Collapsible's client behaviour.
 */
import { Fragment, useLayoutEffect, useRef } from "react";

import { Sidebar, SidebarGroup, SidebarItem } from "@horon-ai/react";

import { componentGroups, componentsInGroup } from "@/data/components";
import { foundationsNav, isActive, lynxDocsNav, primaryNav, reactDocsNav, type NavGroup } from "@/data/nav";
import { siteHref } from "@/lib/urls";
import { pick, type Locale, type Localized } from "@/i18n";
import { docsMessages } from "@/i18n/messages/docs";
import { useLocale } from "@/i18n/react";

export interface DocsSidebarProps {
  /** The page's top-level section: `foundations`, `components`, or a docs page. */
  section: string;
  /** Normalized `Astro.url.pathname` without the trailing slash. */
  currentPath: string;
}

interface DocsSidebarEntry {
  label: Localized;
  href: string;
  current: boolean;
}

interface DocsSidebarBlock {
  key: string;
  /** Omitted for a block that reads as a continuation, such as the Foundations list. */
  label?: Localized;
  entries: DocsSidebarEntry[];
}

/** A docs nav group rendered as one labelled sidebar block, matched by exact path. */
function sidebarBlock(group: NavGroup, currentPath: string): DocsSidebarBlock {
  return {
    key: group.key,
    label: group.label,
    entries: group.items.map((item) => ({
      label: item.label,
      href: item.href,
      current: currentPath === item.href,
    })),
  };
}

/**
 * The one place the docs layout reads the site data modules. Labels are
 * `Localized` and stay untouched here so the components pick per render; the
 * `current` flag is the only computed value. The Foundations list and the
 * Develop section match on an exact path: `/develop` and `/develop/react`
 * both head their section, so a prefix match would highlight the index on
 * every child page.
 */
export function docsSidebarBlocks(section: string, currentPath: string): DocsSidebarBlock[] {
  if (section === "foundations") {
    return [
      {
        key: "foundations",
        entries: foundationsNav.map((item) => ({
          label: item.label,
          href: item.href,
          current: item.href === "/foundations" ? currentPath === "/foundations" : isActive(currentPath, item.href),
        })),
      },
    ];
  }

  if (section === "develop") {
    return [
      {
        key: "overview",
        entries: [{ label: docsMessages.overview, href: "/develop", current: currentPath === "/develop" }],
      },
      ...[...reactDocsNav, ...lynxDocsNav].map((group) => sidebarBlock(group, currentPath)),
    ];
  }

  if (section === "components") {
    return [
      {
        key: "overview",
        entries: [{ label: docsMessages.overview, href: "/components", current: currentPath === "/components" }],
      },
      ...componentGroups.map((group) => ({
        key: group.id,
        label: group.title,
        entries: componentsInGroup(group.id).map((component) => ({
          label: component.title,
          href: `/components/${component.slug}`,
          current: currentPath === `/components/${component.slug}`,
        })),
      })),
    ];
  }

  return [
    {
      key: "docs",
      label: docsMessages.docs,
      entries: primaryNav.map((item) => ({
        label: item.label,
        href: item.href,
        current: isActive(currentPath, item.href),
      })),
    },
  ];
}

/** Where the desktop sidebar's scroll offset is kept between page loads, one value per section. */
const scrollKey = (section: string) => `docs-sidebar-scroll:${section}`;

export default function DocsSidebar({ section, currentPath }: DocsSidebarProps) {
  const locale: Locale = useLocale();
  const blocks = docsSidebarBlocks(section, currentPath);
  const label = pick(docsMessages.sectionNav, locale);
  const scroller = useRef<HTMLDivElement>(null);

  // Every docs link is a full page load, so the sidebar remounts at the top. Put it back where the
  // reader left it; on a first visit to the section, bring the current entry into view instead.
  useLayoutEffect(() => {
    const element = scroller.current;
    if (!element) return undefined;
    const saved = sessionStorage.getItem(scrollKey(section));
    if (saved !== null) {
      element.scrollTop = Number(saved);
    } else {
      // Scroll only this column, never the page, so the entry sits mid-column.
      const current = element.querySelector<HTMLElement>("[aria-current='page']");
      if (current) {
        const offset = current.getBoundingClientRect().top - element.getBoundingClientRect().top;
        element.scrollTop += offset - (element.clientHeight - current.offsetHeight) / 2;
      }
    }
    const save = () => sessionStorage.setItem(scrollKey(section), String(element.scrollTop));
    element.addEventListener("scroll", save, { passive: true });
    return () => element.removeEventListener("scroll", save);
  }, [section]);

  const renderEntries = (block: DocsSidebarBlock) =>
    block.entries.map((entry) => (
      <SidebarItem key={entry.href} href={siteHref(entry.href)} current={entry.current}>
        {pick(entry.label, locale)}
      </SidebarItem>
    ));

  const renderBlock = (block: DocsSidebarBlock, defaultOpen: boolean) =>
    block.label ? (
      <SidebarGroup key={block.key} label={pick(block.label, locale)} defaultOpen={defaultOpen}>
        {renderEntries(block)}
      </SidebarGroup>
    ) : (
      <Fragment key={block.key}>{renderEntries(block)}</Fragment>
    );

  return (
    <>
      <div
        ref={scroller}
        className="hidden lg:sticky lg:top-(--site-header-h) lg:block lg:h-[calc(100dvh-var(--site-header-h))] lg:w-60 lg:shrink-0 lg:overflow-y-auto lg:pl-[env(safe-area-inset-left)]"
      >
        <Sidebar aria-label={label} surface="plain" className="min-h-full w-full border-r-0">
          {blocks.map((block) => renderBlock(block, true))}
        </Sidebar>
      </div>

      {/* Below `lg` the section list is one disclosure above the page title. The
       * trigger has 10px of its own inline padding, so the nav gutter is the article
       * gutter (1.25rem, 1.5rem from md) minus 10px: the label then starts on the
       * breadcrumb's left edge. The narrow range trades 4px of vertical padding for
       * the title. */}
      <nav aria-label={label} className="px-2.5 pt-2 pb-0 md:px-3.5 md:pt-3 md:pb-1 lg:hidden">
        <SidebarGroup label={pick(docsMessages.tocLabel, locale)} defaultOpen={false}>
          {blocks.map((block) =>
            renderBlock(
              block,
              block.entries.some((entry) => entry.current),
            ),
          )}
        </SidebarGroup>
      </nav>
    </>
  );
}
