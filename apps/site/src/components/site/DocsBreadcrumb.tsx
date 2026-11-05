/**
 * The docs breadcrumb, rendered through the library `Breadcrumb` and
 * `BreadcrumbItem`.
 *
 * It is a hydrated island for two reasons: Astro hands a framework component's
 * slot content to React as one HTML blob (multiple `BreadcrumbItem` children
 * would collapse into a single `<li>`), and the crumb labels are `Localized`,
 * so they have to be picked again when the header language button changes.
 *
 * The trail grows with the page title: a component page reaches four crumbs, and
 * a long title does not fit a 320px row. Below `sm` only Home and the current
 * page render, so the reader still sees where the page sits and can reach the
 * section from the menu; the trail's own scroll would otherwise start with the
 * current page off-screen. From `sm` up the full trail renders exactly as before.
 */
import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

import { pick, type Localized } from "@/i18n";
import { docsMessages } from "@/i18n/messages/docs";
import { useLocale } from "@/i18n/react";

export interface DocsBreadcrumbProps {
  items: { label: Localized; href: string }[];
}

export default function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  const locale = useLocale();
  const last = items.length - 1;
  const label = pick(docsMessages.breadcrumb, locale);
  const compact = items.length > 2 ? [items[0], items[last]] : items;

  return (
    <>
      <Breadcrumb aria-label={label} className="mb-4 sm:hidden">
        {compact.map((item, index) => (
          <BreadcrumbItem key={item.href} href={item.href} current={index === compact.length - 1}>
            {pick(item.label, locale)}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Breadcrumb aria-label={label} className="mb-4 hidden sm:grid">
        {items.map((item, index) => (
          <BreadcrumbItem key={item.href} href={item.href} current={index === last}>
            {pick(item.label, locale)}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </>
  );
}
