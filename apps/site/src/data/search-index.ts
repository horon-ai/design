import { componentGroups, components } from "@/data/components";
import { foundationsNav, primaryNav } from "@/data/nav";

export interface SearchEntry {
  title: string;
  href: string;
  group: string;
}

const groupTitles = new Map(componentGroups.map((group) => [group.id, group.title]));

const docPages = primaryNav.filter(
  (item) => item.href !== "/foundations" && item.href !== "/components",
);

export const searchIndex: SearchEntry[] = [
  ...components.map((component) => ({
    title: component.title,
    href: `/components/${component.slug}`,
    group: groupTitles.get(component.group) ?? "",
  })),
  ...foundationsNav.map((item) => ({ title: item.label, href: item.href, group: "Foundations" })),
  ...docPages.map((item) => ({ title: item.label, href: item.href, group: "Docs" })),
];
