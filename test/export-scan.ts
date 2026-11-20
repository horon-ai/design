/**
 * Text scans of a component source tree, shared by the React parity gates of
 * `@horon-ai/lynx` and `@horon-ai/expo`. They read files instead of importing
 * them, because the ports need their own runtimes and a plain `bun test` has none.
 */

export const listTsx = (dir: string): string[] =>
  [...new Bun.Glob("*.tsx").scanSync(dir)].map((file) => file.replace(/\.tsx$/, "")).toSorted();

/** Value export names declared in one source file, the same reading `exports.test.ts` uses. */
export const valueExports = (source: string): string[] => {
  const names = new Set<string>();
  for (const block of source.match(/export\s*\{[^}]*\}/g) ?? []) {
    const inner = block.replace(/^export\s*\{/, "").replace(/\}\s*$/, "");
    for (const raw of inner.split(",")) {
      const entry = raw.trim();
      if (!entry || entry.startsWith("type ")) continue;
      const match = /^([A-Za-z0-9_$]+)(?:\s+as\s+([A-Za-z0-9_$]+))?$/.exec(entry);
      if (match) names.add(match[2] ?? match[1]);
    }
  }
  for (const match of source.matchAll(/export\s+(?:async\s+)?(?:function|const|let|var|class)\s+([A-Za-z0-9_$]+)/g))
    names.add(match[1]);
  return [...names].toSorted();
};

/** Exported type names, including `export type X = …` and `export type { X }`. */
export const typeExports = (source: string): string[] => {
  const names = new Set<string>();
  for (const match of source.matchAll(/export\s+type\s+([A-Za-z0-9_$]+)/g)) names.add(match[1]);
  for (const block of source.match(/export\s+type\s*\{[^}]*\}/g) ?? []) {
    const inner = block.replace(/^export\s+type\s*\{/, "").replace(/\}\s*$/, "");
    for (const raw of inner.split(",")) {
      const entry = raw.trim();
      if (!entry) continue;
      const match = /^([A-Za-z0-9_$]+)(?:\s+as\s+([A-Za-z0-9_$]+))?$/.exec(entry);
      if (match) names.add(match[2] ?? match[1]);
    }
  }
  return [...names].toSorted();
};

/**
 * Every `export type X = "a" | "b" | …` in a file, as a name → sorted literal set.
 * A union that spans lines is read whole: the right-hand side runs until the
 * first `;` at depth 0, and only members that are string literals count, so an
 * object-shaped member (`{ variable: string }`) is skipped instead of breaking the
 * comparison.
 */
export const stringUnions = (source: string): Map<string, string[]> => {
  const unions = new Map<string, string[]>();
  for (const match of source.matchAll(/export\s+type\s+([A-Za-z0-9_$]+)\s*=\s*/g)) {
    const name = match[1];
    const start = match.index + match[0].length;
    let depth = 0;
    let end = start;
    for (; end < source.length; end += 1) {
      const char = source[end];
      if (char === "{" || char === "(" || char === "[") depth += 1;
      else if (char === "}" || char === ")" || char === "]") depth -= 1;
      else if (char === ";" && depth === 0) break;
    }
    const body = source.slice(start, end);
    // Only a plain union of string literals is comparable. A prop object type,
    // or one built from `Omit<ComponentProps<"div">, "title">`, also carries
    // literals, but those name DOM attributes rather than a design variant, so
    // requiring them would compare the wrong thing.
    const parts = body.split("|").map((part) => part.trim());
    if (parts.length === 0 || !parts.every((part) => /^(['"]).*\1$/s.test(part))) continue;
    const literals = parts.map((part) => part.slice(1, -1)).toSorted();
    unions.set(name, literals);
  }
  return unions;
};
