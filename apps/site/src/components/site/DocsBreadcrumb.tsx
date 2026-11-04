/**
 * The docs breadcrumb, rendered through the library `Breadcrumb` and
 * `BreadcrumbItem`.
 *
 * It is a hydrated island for two reasons: Astro hands a framework component's
 * slot content to React as one HTML blob (multiple `BreadcrumbItem` children
 * would collapse into a single `<li>`), and the crumb labels are `Localized`,
 * so they have to be picked again when the header language button changes.
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

  return (
    <Breadcrumb aria-label={pick(docsMessages.breadcrumb, locale)} className="mb-4">
      {items.map((item, index) => (
        <BreadcrumbItem key={item.href} href={item.href} current={index === items.length - 1}>
          {pick(item.label, locale)}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}
