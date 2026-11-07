/**
 * Loads the per-component reference docs for the page.
 *
 * Kept apart from `component-docs.ts` because this is the only piece that needs
 * a bundler: `import.meta.glob` is Vite-only, and `bun test` imports the model
 * module directly.
 */
import type { ComponentDoc } from "./component-docs";

const modules = import.meta.glob<{ doc: ComponentDoc }>("../data/docs/*.ts", { eager: true });

const docs = new Map<string, ComponentDoc>();

for (const [path, module] of Object.entries(modules)) {
  const slug = path
    .split("/")
    .pop()
    ?.replace(/\.ts$/, "");
  if (slug && module.doc) docs.set(slug, module.doc);
}

/** The reference doc for `slug`, or `undefined` when that component has none yet. */
export function docBySlug(slug: string | undefined): ComponentDoc | undefined {
  return slug ? docs.get(slug) : undefined;
}
