import type { ComponentType } from "react";

/**
 * Catalog thumbnails: one static React component per slug in
 * `components/thumbnails/`. The index renders them without a client directive,
 * so they ship as plain HTML and never hydrate; the interactive demo lives on
 * the detail page only.
 */
const modules = import.meta.glob<{ default: ComponentType }>("../components/thumbnails/*.tsx", { eager: true });

const thumbnails = new Map<string, ComponentType>();

for (const [path, module] of Object.entries(modules)) {
  const slug = path
    .split("/")
    .pop()
    ?.replace(/\.tsx$/, "");
  if (slug) thumbnails.set(slug, module.default);
}

export function getThumbnail(slug: string): ComponentType | undefined {
  return thumbnails.get(slug);
}
