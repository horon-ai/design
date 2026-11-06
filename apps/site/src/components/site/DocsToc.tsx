/**
 * The page table of contents.
 *
 * Headings come from the rendered article, so this has to be an island: it
 * collects `article .prose-docs h2, h3` (demo stages excluded, the same
 * selector the old inline script used), lists them as library link buttons,
 * and tracks the section in view with an IntersectionObserver. With fewer than
 * two headings there is nothing worth listing, so it renders nothing. The
 * column itself belongs to `DocsLayout`, which keeps it on every docs page so
 * the text never moves when the list is empty.
 *
 * The heading list is derived from the document instead of being copied into
 * state: `useSyncExternalStore` reads it during render (the server snapshot is
 * `null`) and the only state left is the section in view, which the observer
 * callback sets.
 *
 * The desktop column owns the "On this page" label. `inline` renders the same
 * list as one `SidebarGroup` disclosure instead, for the layout's block under
 * the page title below `xl`; the disclosure carries the label there.
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { Button, SidebarGroup } from "@horon-ai/react";

import { pick, type Locale } from "@/i18n";
import { docsMessages } from "@/i18n/messages/docs";
import { useLocale } from "@/i18n/react";

const HEADING_SELECTOR = "article .prose-docs h2:not(.demo-stage *), article .prose-docs h3:not(.demo-stage *)";

/** Top margin of the reading band; keep it in sync with the observer below. */
const BAND_TOP = 80;

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Heading text for one locale. `<T>` renders both locales as sibling spans and
 * hides one with CSS, so `textContent` would return both; walk the tree and
 * drop the halves marked for the other locale.
 */
function readHeadingText(node: Node, locale: Locale): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (!(node instanceof HTMLElement) || node.getAttribute("aria-hidden") === "true") return "";
  const text = Array.from(node.childNodes)
    .map((child) => readHeadingText(child, locale))
    .join("");
  const marked = node.getAttribute("data-locale-text");
  return marked === null || marked === locale ? text : "";
}

function collectHeadings(locale: Locale): TocItem[] {
  return Array.from(document.querySelectorAll<HTMLElement>(HEADING_SELECTOR)).map((heading, index) => {
    if (!heading.id) heading.id = `section-${index + 1}`;
    return {
      id: heading.id,
      text: readHeadingText(heading, locale).replace(/\s+/g, " ").trim(),
      level: heading.tagName === "H3" ? 3 : 2,
    };
  });
}

/**
 * One collection per locale. The cache keeps the snapshot referentially stable,
 * which `useSyncExternalStore` requires to avoid a render loop.
 */
let collected: { locale: Locale; items: TocItem[] } | null = null;
const NO_HEADINGS: TocItem[] = [];

function readHeadings(locale: Locale): TocItem[] {
  if (typeof document === "undefined") return NO_HEADINGS;
  if (collected === null || collected.locale !== locale) {
    collected = { locale, items: collectHeadings(locale) };
  }
  return collected.items;
}

/**
 * The headings only change when the locale changes, and that re-renders this
 * component through `useLocale()`, so there is no external subscription.
 */
function subscribe(): () => void {
  return () => {};
}

export default function DocsToc({ inline = false }: { inline?: boolean }) {
  const locale = useLocale();
  const getSnapshot = useCallback(() => readHeadings(locale), [locale]);
  const getServerSnapshot = useCallback(() => null, []);
  // `null` until the client reads the article, so the empty column keeps its
  // width before hydration and the text does not jump when the links appear.
  const items = useSyncExternalStore<TocItem[] | null>(subscribe, getSnapshot, getServerSnapshot);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (items === null || items.length < 2) return undefined;

    const sync = () => {
      let next = items[0]?.id ?? "";
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element !== null && element.getBoundingClientRect().top <= BAND_TOP) next = item.id;
      }
      setActiveId(next);
    };

    // The margins take px and % only; mixing units throws and unmounts the island.
    const observer = new IntersectionObserver(sync, { rootMargin: "-80px 0px -70% 0px" });
    for (const item of items) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items === null || items.length < 2) return null;

  const list = (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.id}>
          <Button
            variant="link"
            href={`#${item.id}`}
            aria-current={item.id === activeId ? "true" : undefined}
            className={["justify-start text-left whitespace-normal", item.level === 3 && "ml-3"]
              .filter(Boolean)
              .join(" ")}
          >
            {item.text}
          </Button>
        </li>
      ))}
    </ul>
  );

  // Below `md` the layout's sticky column is hidden by design and there is no other way
  // to reach the page list, so the same list appears as a disclosure under the title.
  // `SidebarGroup` already owns the caret, the collapse motion and the label style, so no
  // new component is needed here. The trigger uses the list's own accessible name
  // ("Sections on this page"): the section drawer above the title is labelled "목차", and
  // two identical triggers one above the other would be indistinguishable. The spacing
  // lives inside this branch, so a page with fewer than two headings adds no gap.
  if (inline) {
    return (
      <nav aria-label={pick(docsMessages.tocNav, locale)} className="mt-6 min-w-0 md:hidden">
        <SidebarGroup label={pick(docsMessages.tocNav, locale)} defaultOpen={false}>
          {list}
        </SidebarGroup>
      </nav>
    );
  }

  return (
    <>
      <p className="mb-3 text-caption text-text-secondary">{pick(docsMessages.tocLabel, locale)}</p>
      <nav aria-label={pick(docsMessages.tocNav, locale)}>{list}</nav>
    </>
  );
}
