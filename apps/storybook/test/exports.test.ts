import { describe, expect, test } from "bun:test";

const repoRoot = `${import.meta.dir}/../../..`;

const web = await import("@horon-ai/react");

type Layer = {
  label: string;
  componentsDir: string;
  barrelPath: string;
  storiesDir: string;
  overviewPath: string;
  namespace: Record<string, unknown>;
  /**
   * Components reachable only through `@horon-ai/react/components/<name>`.
   * `chart` is one because `recharts` assigns onto `Object.prototype` while it
   * loads, so importing it from the entry point kills every consumer whose
   * window runs with Tauri's `freezePrototype: true` (the desktop app does).
   */
  subpathOnly: string[];
};

const layers: Layer[] = [
  {
    label: "@horon-ai/react",
    componentsDir: `${repoRoot}/packages/react/src/components`,
    barrelPath: `${repoRoot}/packages/react/src/index.ts`,
    storiesDir: `${repoRoot}/apps/storybook/stories/web`,
    overviewPath: `${repoRoot}/apps/storybook/stories/overview/Web.stories.tsx`,
    namespace: web,
    subpathOnly: ["chart"],
  },
];

const listFiles = (dir: string, pattern: string) => [...new Bun.Glob(pattern).scanSync(dir)].toSorted();

const withoutExtension = (file: string) => file.replace(/\.tsx$/, "");

const pascalCase = (name: string) =>
  name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

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

for (const layer of layers) {
  const files = listFiles(layer.componentsDir, "*.tsx");
  const storyFiles = listFiles(layer.storiesDir, "*.stories.tsx");
  const barrelFiles = files.filter((file) => !layer.subpathOnly.includes(withoutExtension(file)));

  describe(`${layer.label} export coverage`, () => {
    test("has components to cover", () => {
      expect(files.length).toBeGreaterThan(0);
    });

    test("every component file is re-exported from the entry point", async () => {
      const barrel = await Bun.file(layer.barrelPath).text();
      for (const file of barrelFiles) {
        expect(barrel).toContain(`./components/${withoutExtension(file)}`);
      }
      for (const name of layer.subpathOnly) {
        expect(barrel).not.toContain(`./components/${name}"`);
      }
    });

    test("every component value export is importable by name from the entry point", async () => {
      const sources = await Promise.all(barrelFiles.map((file) => Bun.file(`${layer.componentsDir}/${file}`).text()));
      for (const source of sources) {
        const names = valueExports(source);
        expect(names.length).toBeGreaterThan(0);
        for (const name of names) {
          expect(layer.namespace[name]).toBeDefined();
        }
      }
    });

    test("every component has a story", () => {
      for (const file of files) {
        expect(storyFiles).toContain(`${pascalCase(withoutExtension(file))}.stories.tsx`);
      }
    });

    test("every component is listed on the layer overview page", async () => {
      const overview = await Bun.file(layer.overviewPath).text();
      for (const file of files) {
        expect(overview).toContain(`data-component="${pascalCase(withoutExtension(file))}"`);
      }
    });

    test("no component value export name is duplicated across files", async () => {
      const owners = new Map<string, string[]>();
      const sources = await Promise.all(files.map((file) => Bun.file(`${layer.componentsDir}/${file}`).text()));
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
}
