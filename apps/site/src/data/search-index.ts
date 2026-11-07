/**
 * The command palette index. Built from the catalog and navigation modules so
 * every listed route stays in sync with them. Titles and groups are
 * `Localized`; the consumer picks a locale before matching and rendering, so a
 * Korean query never matches against English-only strings.
 */
import type { Localized } from "@/i18n";
import { componentGroups, components } from "@/data/components";
import { developNav, foundationsNav, primaryNav } from "@/data/nav";
import { siteHref } from "@/lib/urls";

export interface SearchEntry {
  title: Localized;
  href: string;
  group: Localized;
}

const groupTitles = new Map(componentGroups.map((group) => [group.id, group.title] as const));

const docPages = primaryNav.filter(
  (item) => item.href !== "/foundations" && item.href !== "/components",
);

export const searchIndex: SearchEntry[] = [
  ...components.map((component) => ({
    title: component.title,
    href: siteHref(`/components/${component.slug}`),
    group: groupTitles.get(component.group) ?? { ko: "", en: "" },
  })),
  ...foundationsNav.map((item) => ({
    title: item.label,
    href: siteHref(item.href),
    group: { ko: "Foundations", en: "Foundations" },
  })),
  ...developNav.map((item) => ({
    title: item.label,
    href: siteHref(item.href),
    group: { ko: "Develop", en: "Develop" },
  })),
  ...docPages.map((item) => ({
    title: item.label,
    href: siteHref(item.href),
    group: { ko: "Docs", en: "Docs" },
  })),
];
