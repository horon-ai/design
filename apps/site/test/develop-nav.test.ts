import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";

import { flutterDocsNav, reactDocsNav } from "../src/data/nav";
import { reactHooks } from "../src/data/react-hooks";

const pagesDir = `${import.meta.dir}/../src/pages`;
const hooksDir = `${import.meta.dir}/../../../packages/react/src/hooks`;

const navItems = [...reactDocsNav, ...flutterDocsNav].flatMap((group) => group.items);
const hookSlugs = reactHooks.map((hook) => hook.slug);
const hookSources = [...new Bun.Glob("*.ts").scanSync(hooksDir)]
  .filter((file) => file !== "index.ts")
  .map((file) => file.replace(/\.ts$/, ""))
  .toSorted();

/** The page source a sidebar href renders, with hooks sharing one dynamic route. */
const pageSource = (href: string) => {
  if (href === "/develop/react") return `${pagesDir}/develop/react.astro`;
  if (href.startsWith("/develop/react/hooks/")) return `${pagesDir}/develop/react/hooks/[slug].astro`;
  return `${pagesDir}${href}.astro`;
};

describe("develop docs navigation", () => {
  test("every sidebar entry has a page source", () => {
    for (const item of navItems) {
      expect(existsSync(pageSource(item.href))).toBe(true);
      if (item.href.startsWith("/develop/react/hooks/")) {
        expect(hookSlugs).toContain(item.href.slice("/develop/react/hooks/".length));
      }
    }
  });

  test("the hook pages cover exactly the hooks the library ships", () => {
    expect(hookSlugs.toSorted()).toEqual(hookSources);
  });

  test("no href is listed twice", () => {
    const hrefs = navItems.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
