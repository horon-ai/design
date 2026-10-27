import { describe, expect, test } from "bun:test";

import { components } from "../src/data/components";

const componentsDir = `${import.meta.dir}/../../../packages/react/src/components`;
const demosDir = `${import.meta.dir}/../src/components/demos`;

const listFiles = (dir: string, pattern: string): string[] => [...new Bun.Glob(pattern).scanSync(dir)].toSorted();

const withoutExtension = (file: string) => file.replace(/\.tsx$/, "");

const componentSlugs = listFiles(componentsDir, "*.tsx").map(withoutExtension);
const demoSlugs = listFiles(demosDir, "*.tsx").map(withoutExtension);
const catalogSlugs = components.map((component) => component.slug);

describe("docs site coverage", () => {
  test("the library ships components to cover", () => {
    expect(componentSlugs.length).toBeGreaterThan(0);
  });

  test("every component has a live preview", () => {
    for (const slug of componentSlugs) {
      expect(demoSlugs).toContain(slug);
    }
  });

  test("every component has a catalog entry", () => {
    for (const slug of componentSlugs) {
      expect(catalogSlugs).toContain(slug);
    }
  });

  test("every catalog entry maps to a component the library ships", () => {
    for (const slug of catalogSlugs) {
      expect(componentSlugs).toContain(slug);
    }
  });
});
