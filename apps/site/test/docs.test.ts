/**
 * Guards the reference docs: the source extractor reads the library correctly,
 * and every component that ships a `src/data/docs/<slug>.ts` satisfies the
 * content contract the page renders.
 *
 * `bun test` has no `import.meta.glob`, so the docs are found with `Bun.Glob`
 * and imported one by one; the paths come from this file, never from the
 * working directory, because the root test run starts at the repository root.
 */
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";

import { components } from "../src/data/components";
import { componentApi, flutterClasses, reactImport } from "../src/lib/api";
import { validateDoc, type ComponentDoc } from "../src/lib/component-docs";

const siteDir = `${import.meta.dir}/..`;
const docsDir = `${siteDir}/src/data/docs`;
const examplesDir = `${siteDir}/src/components/examples`;

/** One TypeScript program over the whole library costs a few seconds on first use. */
const TIMEOUT = 30_000;

const files = (dir: string, pattern: string): string[] =>
  existsSync(dir) ? [...new Bun.Glob(pattern).scanSync(dir)].toSorted() : [];

const withoutExtension = (file: string): string => file.replace(/\.[jt]sx?$/, "");

/** The example files on disk for one component. */
const exampleIds = (slug: string): string[] => files(`${examplesDir}/${slug}`, "*.tsx").map(withoutExtension);

/** Own props whose type the extractor spelled as a string-literal union. */
const ownUnionProps = (slug: string): string[] =>
  componentApi(slug).flatMap((entry) =>
    entry.props
      .filter((row) => /^"(?:[^"\\]|\\.)*"(?: \| "(?:[^"\\]|\\.)*")+$/.test(row.type))
      .map((row) => row.name),
  );

/** Narrows an imported module's `doc` export before the validator looks at it. */
function isComponentDoc(value: unknown): value is ComponentDoc {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<ComponentDoc>;
  return (
    typeof candidate.slug === "string" &&
    typeof candidate.anatomy === "object" &&
    Array.isArray(candidate.properties) &&
    Array.isArray(candidate.guidelines) &&
    Array.isArray(candidate.specification) &&
    Array.isArray(candidate.examples) &&
    typeof candidate.accessibility === "object"
  );
}

async function loadDoc(slug: string): Promise<ComponentDoc | undefined> {
  const file = `${docsDir}/${slug}.ts`;
  if (!existsSync(file)) return undefined;
  // The specifier is assembled from the catalog at run time and the doc files
  // arrive one lane at a time, so no static import can name them.
  const loaded: unknown = await import(Bun.pathToFileURL(file).href);
  const doc = typeof loaded === "object" && loaded !== null && "doc" in loaded ? loaded.doc : undefined;
  return isComponentDoc(doc) ? doc : undefined;
}

describe("extractor", () => {
  test("button api", { timeout: TIMEOUT }, () => {
    const [button] = componentApi("button");

    expect(button?.name).toBe("Button");

    const variant = button?.props.find((row) => row.name === "variant");
    expect(variant?.type).toContain('"primary"');
    expect(variant?.type).toContain('"link"');
    expect(variant?.defaultValue).toBe('"primary"');
    expect(variant?.description.length).toBeGreaterThan(0);

    expect(button?.props.some((row) => row.name === "size" && row.optional)).toBe(true);
    expect(button?.props.some((row) => row.name === "children")).toBe(false);

    const sources = (button?.inherited ?? []).map((group) => group.source);
    expect(sources.some((source) => source.startsWith("Base UI") || source === "HTML attributes")).toBe(true);
    expect((button?.inherited ?? []).every((group) => group.count > 0)).toBe(true);
  });

  test("reactImport", { timeout: TIMEOUT }, () => {
    const line = reactImport("button");
    expect(line).toContain("Button");
    expect(line).toContain('"@horon-ai/react"');
    // Re-bound primitives (`export const Dialog = BaseDialog.Root`) are imports a reader needs too.
    const dialog = reactImport("dialog");
    for (const name of ["Dialog", "DialogTrigger", "DialogClose", "DialogContent"]) {
      expect(dialog).toContain(name);
    }
  });

  test("own props that shadow inherited ones stay in the table", { timeout: TIMEOUT }, () => {
    const slider = componentApi("slider").flatMap((entry) => entry.props.map((row) => row.name));
    expect(slider).toContain("aria-label");
  });

  test("imported and nested aliases expand to their literals", { timeout: TIMEOUT }, () => {
    const size = componentApi("settings-list")
      .flatMap((entry) => entry.props)
      .find((row) => row.name === "size");
    expect(size?.type).toBe('"sm" | "md" | "lg" | "compact"');
  });

  test("flutterClasses", { timeout: TIMEOUT }, () => {
    expect(flutterClasses("button")).toContain("HoronButton");
    // Dart files are snake_case, slugs are kebab-case.
    expect(flutterClasses("icon-button")).toContain("HoronIconButton");
    expect(flutterClasses("not-a-real-component")).toEqual([]);
  });
});

describe("component docs", () => {
  for (const component of components) {
    test(`doc ${component.slug}`, { timeout: TIMEOUT }, async () => {
      const doc = await loadDoc(component.slug);
      if (doc === undefined) {
        throw new Error(`missing src/data/docs/${component.slug}.ts`);
      }

      expect(doc.slug).toBe(component.slug);

      // A doc is only meaningful next to a component the extractor can read.
      const api = componentApi(component.slug);
      expect(api.length).toBeGreaterThanOrEqual(1);
      const hasOwnProp = api.some((entry) => entry.props.length > 0);
      const takesNoProps = api.every((entry) => entry.props.length === 0 && entry.inherited.length === 0);
      expect(hasOwnProp || takesNoProps).toBe(true);

      expect(validateDoc(doc, exampleIds(component.slug), ownUnionProps(component.slug))).toEqual([]);
    });
  }
});
