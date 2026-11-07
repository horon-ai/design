import type { AstroComponentFactory } from "astro/runtime/server/index.js";

const modules = import.meta.glob<{ default: AstroComponentFactory }>("../components/demo-wrappers/*.astro", {
  eager: true,
});

const wrappers = new Map<string, AstroComponentFactory>();

for (const [path, module] of Object.entries(modules)) {
  const name = path
    .split("/")
    .pop()
    ?.replace(/\.astro$/, "");
  if (name) wrappers.set(name, module.default);
}

const exampleModules = import.meta.glob<{ default: AstroComponentFactory }>(
  "../components/example-wrappers/*/*.astro",
  { eager: true },
);

/** Keyed by `<slug>/<id>`, the same value a stage writes to `data-demo`. */
const exampleWrappers = new Map<string, AstroComponentFactory>();

for (const [path, module] of Object.entries(exampleModules)) {
  const [slug, id] = path
    .split("/")
    .slice(-2)
    .map((segment) => segment.replace(/\.astro$/, ""));
  if (id && slug) exampleWrappers.set(`${slug}/${id}`, module.default);
}

export function resolveDemoName(slug: string): string | undefined {
  return wrappers.has(slug) ? slug : undefined;
}

export function getDemo(name: string | undefined): AstroComponentFactory | undefined {
  return name ? wrappers.get(name) : undefined;
}

/** The island for one reference example, generated from `src/components/examples/<slug>/<id>.tsx`. */
export function getExample(slug: string, id: string): AstroComponentFactory | undefined {
  return exampleWrappers.get(`${slug}/${id}`);
}

export function demoCount(): number {
  return wrappers.size;
}

export function exampleCount(): number {
  return exampleWrappers.size;
}
