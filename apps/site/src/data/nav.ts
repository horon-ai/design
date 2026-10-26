export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const primaryNav: NavItem[] = [
  { label: "Get Started", href: "/get-started" },
  { label: "Foundations", href: "/foundations" },
  { label: "Components", href: "/components" },
  { label: "Mascot", href: "/mascot" },
  { label: "Updates", href: "/updates" },
];

export const foundationsNav: NavItem[] = [
  { label: "Overview", href: "/foundations" },
  { label: "Design Token", href: "/foundations/tokens" },
  { label: "Color", href: "/foundations/color" },
  { label: "Typography", href: "/foundations/typography" },
  { label: "Spacing", href: "/foundations/spacing" },
  { label: "Radius", href: "/foundations/radius" },
  { label: "Glass", href: "/foundations/glass" },
];

export const externalLinks = [
  { label: "Storybook", href: "https://storybook.horon.ai" },
  { label: "GitHub", href: "https://github.com/horon-ai/design" },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
