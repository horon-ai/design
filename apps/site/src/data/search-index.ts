/**
 * The command palette index. Built from the catalog and navigation modules so
 * every listed route stays in sync with them. Titles and groups are
 * `Localized`; the consumer picks a locale before matching and rendering, so a
 * Korean query never matches against English-only strings.
 */
import type { Localized } from "@/i18n";
import { componentGroups, components } from "@/data/components";
import { foundationsNav, primaryNav } from "@/data/nav";

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
    href: `/components/${component.slug}`,
    group: groupTitles.get(component.group) ?? { ko: "", en: "" },
  })),
  ...foundationsNav.map((item) => ({
    title: item.label,
    href: item.href,
    group: { ko: "Foundations", en: "Foundations" },
  })),
  ...docPages.map((item) => ({
    title: item.label,
    href: item.href,
    group: { ko: "Docs", en: "Docs" },
  })),
];
