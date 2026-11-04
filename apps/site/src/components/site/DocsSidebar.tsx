/**
 * The docs section sidebar.
 *
 * Desktop (`lg` and up) is the library `Sidebar` (plain surface, the layout's own
 * color) fixed to the left edge under the header and scrolling on its own: one
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
import { foundationsNav, isActive, primaryNav } from "@/data/nav";
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

/**
 * The one place the docs layout reads the site data modules. Labels are
 * `Localized` and stay untouched here so the components pick per render; the
 * `current` flag is the only computed value, and it mirrors the old sidebar's
 * rules (the Foundations overview is exact-match only, everything else uses
 * `isActive`).
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
      <SidebarItem key={entry.href} href={entry.href} current={entry.current}>
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
        className="hidden lg:fixed lg:top-19 lg:bottom-0 lg:left-0 lg:z-10 lg:block lg:w-60 lg:overflow-y-auto"
      >
        <Sidebar aria-label={label} surface="plain" className="min-h-full w-full">
          {blocks.map((block) => renderBlock(block, true))}
        </Sidebar>
      </div>

      <nav aria-label={label} className="px-4 pt-3 pb-1 md:px-6 lg:hidden">
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
