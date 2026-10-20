import type { AstroComponentFactory } from "astro/runtime/server/index.js";

const modules = import.meta.glob<{ default: AstroComponentFactory }>("../components/demo-wrappers/*.astro", {
  eager: true,
});

const wrappers = new Map<string, AstroComponentFactory>();

for (const [path, module] of Object.entries(modules)) {
  const name = path.split("/").pop()?.replace(/\.astro$/, "");
  if (name) wrappers.set(name, module.default);
}

export function resolveDemoName(slug: string, demo?: string): string | undefined {
  const candidate = demo ?? slug;
  if (wrappers.has(candidate)) return candidate;
  return demo && wrappers.has(demo) ? demo : undefined;
}

export function getDemo(name: string | undefined): AstroComponentFactory | undefined {
  return name ? wrappers.get(name) : undefined;
}

export function demoCount(): number {
  return wrappers.size;
}
