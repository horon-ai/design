#!/usr/bin/env node
// React 컴포넌트에서 Flutter 포팅 브리프를 뽑는 스크립트입니다.
//
// React가 정본입니다. 이 스크립트는 정본을 읽어 슬러그마다 한 장의 브리프를
// 만들고, 컴포넌트를 레인으로 나눌 때 쓸 행렬(matrix.json)을 함께 씁니다.
// 브리프는 사람과 레인이 읽는 계약이고, 게이트(test/gates/)는 같은 규칙을
// 직접 검사합니다.
//
//   node scripts/extract-spec.mjs            # .omo/evidence/flutter-rebuild/spec/ 아래에 씁니다
//   node scripts/extract-spec.mjs --out DIR  # 다른 위치에 씁니다
//
// 경로는 packages/flutter 기준입니다(`../react/src/components`).

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(PKG, "..", "..");
const REACT = join(REPO, "packages/react/src/components");
const CATALOG = join(REPO, "apps/site/src/data/components.ts");
const outFlag = process.argv.indexOf("--out");
const OUT = outFlag > 0 ? resolve(process.argv[outFlag + 1]) : join(REPO, ".omo/evidence/flutter-rebuild/spec");

/** JS/TS 주석을 지웁니다. 문자열은 보존합니다. */
function stripComments(source) {
  let out = "";
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    if (c === "/" && source[i + 1] === "/") {
      const end = source.indexOf("\n", i);
      i = end < 0 ? source.length : end;
      continue;
    }
    if (c === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end < 0 ? source.length : end + 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const end = endOfString(source, i);
      out += source.slice(i, end);
      i = end;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

function endOfString(source, start) {
  const quote = source[start];
  let i = start + 1;
  while (i < source.length) {
    if (source[i] === "\\") {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i + 1;
    i++;
  }
  return source.length;
}

function matchingDelimiter(source, start, open, close) {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (c === '"' || c === "'" || c === "`") {
      i = endOfString(source, i) - 1;
      continue;
    }
    if (c === open) depth++;
    else if (c === close) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const RESERVED = new Set([
  "assert", "break", "case", "catch", "class", "const", "continue", "default", "do", "else", "enum",
  "extends", "false", "final", "finally", "for", "if", "in", "is", "new", "null", "rethrow", "return",
  "super", "switch", "this", "throw", "true", "try", "var", "void", "while", "with",
]);

/** React cva 키를 Dart 식별자로 바꿉니다. 게이트의 normalizeVariantKey 와 같은 규칙입니다. */
export function normalizeVariantKey(key) {
  const bare = key.replace(/^["']|["']$/g, "");
  if (/^\d+$/.test(bare)) return `level${bare}`;
  const camel = bare
    .split("-")
    .map((part, index) => (index === 0 || part === "" ? part : part[0].toUpperCase() + part.slice(1)))
    .join("");
  return RESERVED.has(camel) ? `${camel}Value` : camel;
}

/** `variants: { ... }` 블록의 그룹/옵션을 뽑습니다. */
export function variantGroups(source) {
  const code = stripComments(source);
  const groups = new Map();
  const opener = /(?<![A-Za-z0-9_$])variants\s*:\s*\{/g;
  let match;
  while ((match = opener.exec(code)) !== null) {
    const open = match.index + match[0].length - 1;
    const close = matchingDelimiter(code, open, "{", "}");
    if (close < 0) break;
    collectGroups(code.slice(open + 1, close), groups);
    opener.lastIndex = close + 1;
  }
  return groups;
}

function collectGroups(block, groups) {
  const keyPattern = /(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_$-]+))\s*:/y;
  let depth = 0;
  let group = null;
  let i = 0;
  while (i < block.length) {
    const c = block[i];
    if (c === "{") {
      depth++;
      i++;
      continue;
    }
    if (c === "}") {
      depth--;
      i++;
      continue;
    }
    if (depth <= 1) {
      keyPattern.lastIndex = i;
      const key = keyPattern.exec(block);
      if (key && key.index === i) {
        const name = key[1] ?? key[2] ?? key[3];
        if (depth === 0) {
          group = name;
          if (!groups.has(name)) groups.set(name, []);
        } else if (group) {
          if (!groups.has(group)) groups.set(group, []);
          groups.get(group).push(normalizeVariantKey(name));
        }
        i = keyPattern.lastIndex;
        continue;
      }
    }
    i++;
  }
  for (const [name, options] of groups) groups.set(name, [...new Set(options)]);
}

/** `export type X = "a" | "b"` 유니온을 찾습니다. 리터럴 멤버만 봅니다(객체 타입은 제외). */
export function unionTypes(source) {
  const code = stripComments(source);
  const unions = new Map();
  for (const m of code.matchAll(/export\s+type\s+([A-Za-z0-9_]+)\s*=\s*([^;]+);/g)) {
    const rhs = m[2].trim();
    // 문자열 리터럴과 "|" 만으로 이루어진 유니온만 받습니다. `Omit<...>` 같은 타입은 제외합니다.
    if (!/^("[^"]+"\s*\|?\s*)+$/.test(rhs)) continue;
    const members = [...rhs.matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    if (!members.length) continue;
    unions.set(m[1], [...new Set(members)]);
  }
  return unions;
}

const exportsOf = (code) => [...code.matchAll(/export\s+(?:async\s+)?(?:function|const|class)\s+([A-Za-z0-9_]+)/g)].map((m) => m[1]);
const slotsOf = (code) => [...new Set([...code.matchAll(/data-slot="([^"]+)"/g)].map((m) => m[1]))];
const importsOf = (code) =>
  [...new Set([...code.matchAll(/from\s+"([^".][^"]*)"/g)].map((m) => m[1]).filter((m) => !m.startsWith("@/") && !m.startsWith("../")))];
const responsiveOf = (code) => {
  const tokens = [...new Set([...code.matchAll(/(?:^|[\s"'`])((?:sm|md|lg|xl|2xl):[a-z0-9[\].%()/_-]+)/g)].map((m) => m[1]))];
  const containers = [...new Set([...code.matchAll(/@(?:container|\[[^\]]*\]):[a-z0-9[\].%()/_-]+/g)].map((m) => m[0]))];
  return { tokens, containers };
};
const semanticTokensOf = (code) => {
  const found = new Set();
  const pattern = /\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|decoration|shadow)-(?!\[)([a-z][a-z0-9-]*)/g;
  for (const m of code.matchAll(pattern)) found.add(`${m[0].startsWith("text") ? "text" : m[0].split("-")[0]}-${m[1]}`);
  return [...found].sort();
};

const pascal = (snake) => snake.split("_").filter(Boolean).map((p) => p[0].toUpperCase() + p.slice(1)).join("");

const catalogSource = await readFile(CATALOG, "utf8");
const catalog = new Map();
for (const m of catalogSource.matchAll(/slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*group:\s*"([a-z]+)"/g)) {
  catalog.set(m[1].replaceAll("-", "_"), { title: m[2], group: m[3] });
}

const files = (await readdir(REACT)).filter((f) => f.endsWith(".tsx")).sort();
await mkdir(OUT, { recursive: true });
const matrix = [];
const problems = [];

for (const file of files) {
  const slug = file.replace(/\.tsx$/, "").replaceAll("-", "_");
  const source = await readFile(join(REACT, file), "utf8");
  const code = stripComments(source);
  const entry = catalog.get(slug);
  if (!entry) problems.push(`${slug}: not in apps/site/src/data/components.ts`);
  const groups = variantGroups(source);
  const unions = unionTypes(source);
  const variantNames = [...new Set([...groups.values()].flat().concat([...unions.values()].flat()))].sort();
  const exportsList = exportsOf(code);
  const slots = slotsOf(code);
  const deps = importsOf(code);
  const { tokens: responsive, containers } = responsiveOf(code);
  const classTokens = semanticTokensOf(code);
  const pascalSlug = pascal(slug);

  const lines = [
    `# ${entry?.title ?? pascalSlug} (\`${slug}\`)`,
    "",
    `- 그룹: ${entry?.group ?? "MISSING"}`,
    `- React 정본: \`packages/react/src/components/${file}\` (${source.split("\n").length}줄)`,
    `- Flutter 클래스 이름: \`Horon${pascalSlug}\``,
    "",
    "## React export",
    exportsList.length ? exportsList.map((e) => `- \`${e}\``).join("\n") : "- (값 export 없음)",
    "",
    "## variant 어휘 (React 유니온 → Dart enum)",
    unions.size
      ? [...unions.entries()].map(([name, members]) => `- \`${name}\`: ${members.map((o) => `\`${normalizeVariantKey(o)}\``).join(", ")}`).join("\n")
      : groups.size
        ? [...groups.entries()].map(([group, options]) => `- cva \`${group}\`: ${options.map((o) => `\`${o}\``).join(", ")}`).join("\n")
        : "- (유니온·cva 없음 → enum 불필요)",
    "",
    unions.size
      ? `게이트는 각 유니온마다 값 집합이 정확히 같은 public enum을 하나씩 요구합니다. 합집합: ${variantNames.join(', ')}`
      : groups.size ? `게이트가 요구하는 enum 값 합집합: ${variantNames.map((v) => `\`${v}\``).join(", ")}` : "",
    "",
    "## data-slot",
    slots.length ? slots.map((s) => `- \`${s}\``).join("\n") : "- (없음)",
    "",
    "## 바깥 의존성",
    deps.length ? deps.map((d) => `- \`${d}\``).join("\n") : "- (없음)",
    "",
    "## 반응형",
    responsive.length || containers.length
      ? [...responsive.map((r) => `- \`${r}\``), ...containers.map((c) => `- \`${c}\``)].join("\n")
      : "- (반응형 클래스 없음 → 폭에 따라 스스로 흐르게)",
    "",
    "## 시맨틱 토큰 클래스",
    classTokens.length ? classTokens.map((t) => `- \`${t}\``).join("\n") : "- (없음)",
    "",
    "## 산출물 체크리스트",
    `- [ ] \`lib/src/components/${slug}.dart\` — \`class Horon${pascalSlug}\``,
    `- [ ] \`test/components/${slug}_test.dart\``,
    `- [ ] \`example/lib/gallery/sections/${slug}.dart\` — \`class Horon${pascalSlug}GallerySection\``,
    unions.size || groups.size ? `- [ ] enum: ${variantNames.join(", ")}` : "- [ ] enum 없음(정본에 유니온·variants 없음)",
    responsive.length ? "- [ ] 반응형: React가 md/lg에서 바꾸는 배치를 Flutter 폭으로 재현" : "- [ ] 반응형: 폭이 줄면 줄바꿈·축소",
    "",
  ];
  await writeFile(join(OUT, `${slug}.md`), lines.join("\n"));
  matrix.push({
    slug,
    title: entry?.title ?? pascalSlug,
    group: entry?.group ?? "MISSING",
    loc: source.split("\n").length,
    variants: Object.fromEntries(groups),
    unions: Object.fromEntries(unions),
    slots,
    deps,
    responsiveClasses: responsive.length,
    dartClass: `Horon${pascalSlug}`,
  });
}

matrix.sort((a, b) => b.loc - a.loc);
await writeFile(join(OUT, "index.json"), `${JSON.stringify({ generatedFrom: "origin/main", count: matrix.length, components: matrix }, null, 2)}\n`);

const total = matrix.reduce((sum, m) => sum + m.loc, 0);
const byGroup = {};
for (const m of matrix) byGroup[m.group] = (byGroup[m.group] ?? 0) + 1;
const noVariants = matrix.filter((m) => Object.keys(m.variants).length === 0).length;
console.log(`components=${matrix.length} totalLoc=${total} groups=${JSON.stringify(byGroup)} noVariants=${noVariants}`);
console.log(`많은 줄 수: ${matrix.slice(0, 12).map((m) => `${m.slug}:${m.loc}`).join(" ")}`);
if (problems.length) {
  console.error(`PROBLEMS (${problems.length}):\n  ${problems.join("\n  ")}`);
  process.exitCode = 1;
}
