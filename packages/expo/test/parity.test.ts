/**
 * The React parity gate: every `@horon-ai/react` component must have an Expo
 * counterpart with the same value exports, the same exported type names and the
 * same string-literal union values.
 *
 * Everything here is a text scan of the two source trees. The test never imports
 * the Expo barrel, because React Native needs Metro or jest-expo and a plain
 * `bun test` has neither.
 *
 * Unported slugs live in `test/pending.ts`, which `scripts/integrate.ts`
 * rewrites. The gate passes while the set of React slugs with no Expo file is
 * exactly that ledger; a ported slug that drifts from React fails regardless.
 */
import { describe, expect, test } from "bun:test";

import { listTsx, stringUnions, typeExports, valueExports } from "../../../test/export-scan";
import { pendingComponents } from "./pending";

const reactDir = `${import.meta.dir}/../../react/src/components`;
const expoDir = `${import.meta.dir}/../src/components`;
const reactBarrel = `${import.meta.dir}/../../react/src/index.ts`;
const expoBarrel = `${import.meta.dir}/../src/index.ts`;

/**
 * Barrel exports React has that Expo deliberately does not, each with the reason
 * and what replaces it, so the exclusion is explicit rather than a silent gap.
 */
const EXCLUDED_EXPORTS = new Map([
  ["mountCursorGhost", "DOM-only desktop cursor trail: needs document, pointer events and requestAnimationFrame"],
  ["CursorGhostOptions", "The option type of mountCursorGhost"],
  ["cn", "Merges Tailwind class names; React Native has no class names. Compose style arrays instead"],
  ["ClassValue", "The argument type of cn"],
]);

const reactSlugs = listTsx(reactDir);
const expoSlugs = listTsx(expoDir);
const missing = reactSlugs.filter((slug) => !expoSlugs.includes(slug));
const ported = reactSlugs.filter((slug) => expoSlugs.includes(slug));

const source = (dir: string, slug: string) => Bun.file(`${dir}/${slug}.tsx`).text();

/** Runs `check` over every ported slug and collects its findings. */
async function eachPorted(check: (slug: string, react: string, expo: string) => string[]): Promise<string[]> {
  const found = await Promise.all(
    ported.map(async (slug) => check(slug, await source(reactDir, slug), await source(expoDir, slug))),
  );
  const differences = found.flat();
  if (differences.length > 0) console.log(`  ${differences.join("\n  ")}`);
  return differences;
}

describe("@horon-ai/expo ↔ @horon-ai/react parity", () => {
  test("the unported set is exactly the pending ledger", () => {
    console.log(`ported: ${ported.length}/${reactSlugs.length}`);
    expect(missing).toEqual([...pendingComponents].toSorted());
  });

  test("every ported slug exports the same value names as React", async () => {
    const differences = await eachPorted((slug, react, expo) => {
      const reactNames = valueExports(react);
      const expoNames = valueExports(expo);
      return [
        ...reactNames.filter((name) => !expoNames.includes(name)).map((name) => `${slug}: missing value ${name}`),
        ...expoNames.filter((name) => !reactNames.includes(name)).map((name) => `${slug}: extra value ${name}`),
      ];
    });
    expect(differences).toEqual([]);
  });

  test("every ported slug exports the same type names as React", async () => {
    const differences = await eachPorted((slug, react, expo) => {
      const expoTypes = typeExports(expo);
      return typeExports(react)
        .filter((name) => !expoTypes.includes(name))
        .map((name) => `${slug}: missing type ${name}`);
    });
    expect(differences).toEqual([]);
  });

  test("every string-literal union in a ported slug has the same literals", async () => {
    const differences = await eachPorted((slug, react, expo) => {
      const expoUnions = stringUnions(expo);
      const found: string[] = [];
      for (const [name, literals] of stringUnions(react)) {
        const expoLiterals = expoUnions.get(name);
        if (!expoLiterals) found.push(`${slug}: missing union ${name} (${literals.join(" | ")})`);
        else if (expoLiterals.join("|") !== literals.join("|"))
          found.push(`${slug}: ${name} is [${expoLiterals.join(", ")}] but React has [${literals.join(", ")}]`);
      }
      return found;
    });
    expect(differences).toEqual([]);
  });

  test("the barrel exports every React name except the documented exclusions", async () => {
    const [react, expo] = await Promise.all([Bun.file(reactBarrel).text(), Bun.file(expoBarrel).text()]);
    const expoNames = new Set([...valueExports(expo), ...typeExports(expo)]);
    const absent = [...valueExports(react), ...typeExports(react)].filter(
      (name) => !expoNames.has(name) && !EXCLUDED_EXPORTS.has(name),
    );
    expect(absent).toEqual([]);
  });
});
