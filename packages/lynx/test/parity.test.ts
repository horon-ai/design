/**
 * The React parity gate: every `@horon-ai/react` component must have a Lynx
 * counterpart with the same value exports, the same exported type names and the
 * same string-literal union values.
 *
 * Everything here is a text scan of the two source trees. The test never imports
 * the Lynx barrel or `@lynx-js/react`, because those need the Lynx runtime and a
 * plain `bun test` has none; reading the files keeps the gate runnable in the
 * root `bun test` and independent of the toolchain under test.
 *
 * Unported slugs live in `test/pending.ts`. While that ledger is non-empty the
 * gate passes as long as the set of React slugs with no Lynx file is exactly the
 * ledger — that is what lets the root suite stay green mid-migration — and it
 * still prints `missing: <n>` and `pending: <n>` so the progress is visible. A
 * ported slug that drifts from React fails regardless.
 */
import { describe, expect, test } from "bun:test";

import { listTsx, stringUnions, typeExports, valueExports } from "../../../test/export-scan";
import { pendingComponents } from "./pending";

const reactDir = `${import.meta.dir}/../../react/src/components`;
const lynxDir = `${import.meta.dir}/../src/components`;
const reactBarrel = `${import.meta.dir}/../../react/src/index.ts`;
const lynxBarrel = `${import.meta.dir}/../src/index.ts`;

/** Slugs reachable only through a subpath in React; they are not part of the barrel comparison. */
const SUBPATH_ONLY = new Set(["chart"]);

/**
 * Barrel exports React has that Lynx deliberately does not: the desktop cursor
 * trail is DOM-only (`document`, `requestAnimationFrame`, pointer events), so it
 * cannot exist on Lynx at all. Listed here with the reason so the exclusion is
 * explicit rather than a silent gap.
 */
const EXCLUDED_EXPORTS = new Map([
  ["mountCursorGhost", "DOM-only: needs document, pointer events and requestAnimationFrame"],
  ["CursorGhostOptions", "DOM-only: the option type of mountCursorGhost"],
]);

const reactSlugs = listTsx(reactDir);
const lynxSlugs = listTsx(lynxDir);
const missing = reactSlugs.filter((slug) => !lynxSlugs.includes(slug));
const pending = [...pendingComponents].toSorted();
const ported = reactSlugs.filter((slug) => lynxSlugs.includes(slug));

const source = (dir: string, slug: string) => Bun.file(`${dir}/${slug}.tsx`).text();

describe("@horon-ai/lynx ↔ @horon-ai/react parity", () => {
  test("the React package has components to compare", () => {
    expect(reactSlugs.length).toBeGreaterThan(0);
  });

  test("the unported set is exactly the pending ledger", () => {
    console.log(`missing: ${missing.length}`);
    console.log(`pending: ${pending.length}`);
    if (missing.length > 0) console.log(`  ${missing.join("\n  ")}`);
    expect(missing).toEqual(pending);
  });

  test("every ported slug exports the same value names as React", async () => {
    const differences = (
      await Promise.all(
        ported.map(async (slug) => {
          const [react, lynx] = await Promise.all([source(reactDir, slug), source(lynxDir, slug)]);
          const reactNames = valueExports(react);
          const lynxNames = valueExports(lynx);
          const absent = reactNames.filter((name) => !lynxNames.includes(name));
          const extra = lynxNames.filter((name) => !reactNames.includes(name));
          return [
            ...absent.map((name) => `${slug}: missing value ${name}`),
            ...extra.map((name) => `${slug}: extra value ${name}`),
          ];
        }),
      )
    ).flat();
    if (differences.length > 0) console.log(`  ${differences.join("\n  ")}`);
    expect(differences).toEqual([]);
  });

  test("every ported slug exports the same type names as React", async () => {
    const differences = (
      await Promise.all(
        ported.map(async (slug) => {
          const [react, lynx] = await Promise.all([source(reactDir, slug), source(lynxDir, slug)]);
          const lynxTypes = typeExports(lynx);
          return typeExports(react)
            .filter((name) => !lynxTypes.includes(name))
            .map((name) => `${slug}: missing type ${name}`);
        }),
      )
    ).flat();
    if (differences.length > 0) console.log(`  ${differences.join("\n  ")}`);
    expect(differences).toEqual([]);
  });

  test("every string-literal union in a ported slug has the same literals", async () => {
    const differences = (
      await Promise.all(
        ported.map(async (slug) => {
          const [react, lynx] = await Promise.all([source(reactDir, slug), source(lynxDir, slug)]);
          const lynxUnions = stringUnions(lynx);
          const found: string[] = [];
          for (const [name, literals] of stringUnions(react)) {
            const lynxLiterals = lynxUnions.get(name);
            if (!lynxLiterals) {
              found.push(`${slug}: missing union ${name} (${literals.join(" | ")})`);
              continue;
            }
            if (lynxLiterals.join("|") !== literals.join("|")) {
              found.push(`${slug}: ${name} is [${lynxLiterals.join(", ")}] but React has [${literals.join(", ")}]`);
            }
          }
          return found;
        }),
      )
    ).flat();
    if (differences.length > 0) console.log(`  ${differences.join("\n  ")}`);
    expect(differences).toEqual([]);
  });

  test("the barrel exports every React name except the DOM-only cursor ghost", async () => {
    const [react, lynx] = await Promise.all([Bun.file(reactBarrel).text(), Bun.file(lynxBarrel).text()]);
    const reactNames = [...valueExports(react), ...typeExports(react)];
    const lynxNames = new Set([...valueExports(lynx), ...typeExports(lynx)]);
    const absent = reactNames.filter((name) => !lynxNames.has(name) && !EXCLUDED_EXPORTS.has(name));
    if (absent.length > 0) console.log(`  absent from the Lynx barrel: ${absent.join(", ")}`);
    expect(absent).toEqual([]);
  });

  test("every component file the React barrel re-exports is also re-exported by Lynx once ported", async () => {
    const lynx = await Bun.file(lynxBarrel).text();
    const absent = ported.filter((slug) => !SUBPATH_ONLY.has(slug) && !lynx.includes(`./components/${slug}"`));
    if (absent.length > 0) console.log(`  missing barrel line: ${absent.join(", ")}`);
    expect(absent).toEqual([]);
  });
});
