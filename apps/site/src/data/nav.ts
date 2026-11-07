/**
 * Site navigation. `href` values are locale-independent: there is one URL per
 * page and no `/en` routes. Labels and descriptions are `Localized` pairs so
 * the shell can render them through `pick()` or `<T m={...} />`.
 */
import type { Localized } from "@/i18n";
import { reactHooks } from "@/data/react-hooks";

export interface NavItem {
  label: Localized;
  href: string;
  description?: Localized;
  /** Shown as a dropdown in the header instead of a plain link. */
  children?: NavItem[];
}

export const developNav: NavItem[] = [
  { label: { ko: "React", en: "React" }, href: "/develop/react" },
  { label: { ko: "Lynx", en: "Lynx" }, href: "/develop/lynx" },
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

/** A labelled block of the docs sidebar. */
export interface NavGroup {
  key: string;
  label: Localized;
  items: NavItem[];
}

/** Sidebar of the React docs section, in reading order. */
export const reactDocsNav: NavGroup[] = [
  {
    key: "react-start",
    label: { ko: "React · 시작하기", en: "React · Getting started" },
    items: [
      { label: { ko: "소개", en: "Introduction" }, href: "/develop/react" },
      { label: { ko: "설치", en: "Installation" }, href: "/develop/react/installation" },
      { label: { ko: "스타일", en: "Styling" }, href: "/develop/react/styling" },
      { label: { ko: "테마", en: "Theming" }, href: "/develop/react/theming" },
      { label: { ko: "아이콘", en: "Icons" }, href: "/develop/react/icons" },
    ],
  },
  {
    key: "react-concepts",
    label: { ko: "React · 개념", en: "React · Concepts" },
    items: [
      { label: { ko: "가져오기", en: "Imports" }, href: "/develop/react/imports" },
      { label: { ko: "유리 표면", en: "Liquid glass" }, href: "/develop/react/liquid-glass" },
      { label: { ko: "모션", en: "Motion" }, href: "/develop/react/motion" },
      { label: { ko: "플랫폼과 단축키", en: "Platform and shortcuts" }, href: "/develop/react/platform" },
      { label: { ko: "커서 잔상", en: "Cursor ghost" }, href: "/develop/react/cursor-ghost" },
    ],
  },
  {
    key: "react-hooks",
    label: { ko: "React · 훅", en: "React · Hooks" },
    items: reactHooks.map((hook) => ({
      label: { ko: hook.name, en: hook.name },
      href: `/develop/react/hooks/${hook.slug}`,
    })),
  },
  {
    key: "react-contributing",
    label: { ko: "React · 기여", en: "React · Contributing" },
    items: [{ label: { ko: "저장소에서 개발", en: "Working in the repo" }, href: "/develop/react/contributing" }],
  },
];

/** Sidebar of the Lynx docs section, in reading order. */
export const lynxDocsNav: NavGroup[] = [
  {
    key: "lynx-start",
    label: { ko: "Lynx · 시작하기", en: "Lynx · Getting started" },
    items: [
      { label: { ko: "소개", en: "Introduction" }, href: "/develop/lynx" },
      { label: { ko: "설치", en: "Installation" }, href: "/develop/lynx/installation" },
      { label: { ko: "테마와 플랫폼", en: "Theme and platform" }, href: "/develop/lynx/theming" },
    ],
  },
  {
    key: "lynx-concepts",
    label: { ko: "Lynx · 개념", en: "Lynx · Concepts" },
    items: [
      { label: { ko: "유리 표면", en: "Liquid glass" }, href: "/develop/lynx/liquid-glass" },
      { label: { ko: "React와 다른 점", en: "Differences from React" }, href: "/develop/lynx/differences" },
      { label: { ko: "갤러리 실행", en: "Running the gallery" }, href: "/develop/lynx/gallery" },
    ],
  },
];

/** Breadcrumb shared by every page under `/develop/react`. */
export function reactBreadcrumb(title: Localized, href: string): { label: Localized; href: string }[] {
  return [
    { label: { ko: "Develop", en: "Develop" }, href: "/develop" },
    { label: { ko: "React", en: "React" }, href: "/develop/react" },
    { label: title, href },
  ];
}

/** Breadcrumb shared by every page under `/develop/lynx`. */
export function lynxBreadcrumb(title: Localized, href: string): { label: Localized; href: string }[] {
  return [
    { label: { ko: "Develop", en: "Develop" }, href: "/develop" },
    { label: { ko: "Lynx", en: "Lynx" }, href: "/develop/lynx" },
    { label: title, href },
  ];
}

export const externalLinks: { label: Localized; href: string }[] = [
  { label: { ko: "GitHub", en: "GitHub" }, href: "https://github.com/horon-ai/design" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
