/**
 * Site navigation. `href` values are locale-independent: there is one URL per
 * page and no `/en` routes. Labels and descriptions are `Localized` pairs so
 * the shell can render them through `pick()` or `<T m={...} />`.
 */
import type { Localized } from "@/i18n";

export interface NavItem {
  label: Localized;
  href: string;
  description?: Localized;
  /** Shown as a dropdown in the header instead of a plain link. */
  children?: NavItem[];
}

export const developNav: NavItem[] = [
  { label: { ko: "React", en: "React" }, href: "/develop/react" },
  { label: { ko: "Flutter", en: "Flutter" }, href: "/develop/flutter" },
];

export const primaryNav: NavItem[] = [
  { label: { ko: "Get Started", en: "Get Started" }, href: "/get-started" },
  { label: { ko: "Foundations", en: "Foundations" }, href: "/foundations" },
  { label: { ko: "Components", en: "Components" }, href: "/components" },
  { label: { ko: "Develop", en: "Develop" }, href: "/develop", children: developNav },
  { label: { ko: "Mascot", en: "Mascot" }, href: "/mascot" },
  { label: { ko: "Updates", en: "Updates" }, href: "/updates" },
];

export const foundationsNav: NavItem[] = [
  { label: { ko: "Overview", en: "Overview" }, href: "/foundations" },
  { label: { ko: "Design Token", en: "Design Token" }, href: "/foundations/tokens" },
  { label: { ko: "Color", en: "Color" }, href: "/foundations/color" },
  { label: { ko: "Typography", en: "Typography" }, href: "/foundations/typography" },
  { label: { ko: "Spacing", en: "Spacing" }, href: "/foundations/spacing" },
  { label: { ko: "Radius", en: "Radius" }, href: "/foundations/radius" },
  { label: { ko: "Glass", en: "Glass" }, href: "/foundations/glass" },
];

export const externalLinks: { label: Localized; href: string }[] = [
  { label: { ko: "GitHub", en: "GitHub" }, href: "https://github.com/horon-ai/design" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
