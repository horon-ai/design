import { describe, expect, test } from "bun:test";

const componentsDir = `${import.meta.dir}/../src/components`;
const barrelPath = `${import.meta.dir}/../src/index.ts`;

const react: Record<string, unknown> = await import("../src/index");

/**
 * Components reachable only through `@horon-ai/react/components/<name>`.
 * `chart` is one because `recharts` assigns onto `Object.prototype` while it
 * loads, so importing it from the entry point kills every consumer whose
 * window runs with Tauri's `freezePrototype: true` (the desktop app does).
 */
const subpathOnly = ["chart"];

const listFiles = (dir: string, pattern: string): string[] => [...new Bun.Glob(pattern).scanSync(dir)].toSorted();

const withoutExtension = (file: string) => file.replace(/\.tsx$/, "");

const valueExports = (source: string): string[] => {
  const names = new Set<string>();
  for (const block of source.match(/export\s*\{[^}]*\}/g) ?? []) {
    const inner = block.replace(/^export\s*\{/, "").replace(/\}\s*$/, "");
    for (const raw of inner.split(",")) {
      const entry = raw.trim();
      if (!entry || entry.startsWith("type ")) continue;
      const match = entry.match(/^([A-Za-z0-9_$]+)(?:\s+as\s+([A-Za-z0-9_$]+))?$/);
      if (match) names.add(match[2] ?? match[1]);
    }
  }
  const declaration = /export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z0-9_$]+)/g;
  for (const match of source.matchAll(declaration)) names.add(match[1]);
  return [...names];
};

const files = listFiles(componentsDir, "*.tsx");
const barrelFiles = files.filter((file) => !subpathOnly.includes(withoutExtension(file)));

describe("@horon-ai/react export coverage", () => {
  test("has components to cover", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  test("every component file is re-exported from the entry point", async () => {
    const barrel = await Bun.file(barrelPath).text();
    for (const file of barrelFiles) {
      expect(barrel).toContain(`./components/${withoutExtension(file)}`);
    }
    for (const name of subpathOnly) {
      expect(barrel).not.toContain(`./components/${name}"`);
    }
  });

  test("every component value export is importable by name from the entry point", async () => {
    const sources = await Promise.all(barrelFiles.map((file) => Bun.file(`${componentsDir}/${file}`).text()));
    for (const source of sources) {
      const names = valueExports(source);
      expect(names.length).toBeGreaterThan(0);
      for (const name of names) {
        expect(react[name]).toBeDefined();
      }
    }
  });

  test("no component value export name is duplicated across files", async () => {
    const sources = await Promise.all(files.map((file) => Bun.file(`${componentsDir}/${file}`).text()));
    const owners = new Map<string, string[]>();
    for (const [index, file] of files.entries()) {
      for (const name of valueExports(sources[index])) {
        const list = owners.get(name) ?? [];
        list.push(file);
        owners.set(name, list);
      }
    }
    const duplicates = [...owners.entries()]
      .filter(([, list]) => list.length > 1)
      .map(([name, list]) => `${name}: ${list.join(", ")}`);
    expect(duplicates).toEqual([]);
  });
});
