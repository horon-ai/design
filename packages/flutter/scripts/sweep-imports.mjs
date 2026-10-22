#!/usr/bin/env node
// 배럴이 컴포넌트를 내보내기 시작하면, 그 컴포넌트를 `src/components/<slug>.dart`
// 하위 경로로 import하던 테스트와 갤러리 섹션은 `unnecessary_import`로 실패합니다
// (`dart analyze --fatal-infos`는 info도 실패로 봅니다).
//
// 이 스크립트는 그 중복 import만 지웁니다. 두 가지를 지킵니다.
//
// 1. 같은 파일이 배럴을 import할 때만 지웁니다. 배럴을 쓰지 않는 파일에서
//    하위 경로 import는 유일한 import이므로 지우면 컴파일이 깨집니다
//    (2026-10-22에 그렇게 150건을 깨뜨린 뒤 고친 규칙입니다).
// 2. `chart`는 배럴에 없습니다(`fl_chart` 번들 방지). 하위 경로 import가 남습니다.
//
//   node scripts/sweep-imports.mjs          # 쓰기
//   node scripts/sweep-imports.mjs --check  # 쓰지 않고 남은 개수만 보고 (있으면 exit 1)

import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const BARREL_IMPORT = "import 'package:horon_ui/horon_ui.dart';";
const COMPONENT_IMPORT = /^import 'package:horon_ui\/src\/components\/([a-z0-9_]+)\.dart';$/;

const barrel = await readFile(join(PKG, "lib/horon_ui.dart"), "utf8");
const exported = new Set(
  [...barrel.matchAll(/export 'src\/components\/([a-z0-9_]+)\.dart';/g)].map((m) => m[1]),
);

async function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (entry.name.endsWith(".dart")) out.push(p);
  }
  return out;
}

const files = [
  ...(await walk(join(PKG, "test"))),
  ...(await walk(join(PKG, "example/lib"))),
  ...(await walk(join(PKG, "example/test"))),
];

const touched = [];
for (const file of files) {
  const lines = (await readFile(file, "utf8")).split("\n");
  if (!lines.some((line) => line.trim() === BARREL_IMPORT)) continue;

  const kept = lines.filter((line) => {
    const m = COMPONENT_IMPORT.exec(line.trim());
    return !m || !exported.has(m[1]);
  });
  if (kept.length === lines.length) continue;

  touched.push(relative(PKG, file));
  if (!CHECK) await writeFile(file, kept.join("\n"));
}

console.log(
  `barrel_exports=${exported.size} files_${CHECK ? "to_fix" : "fixed"}=${touched.length}`,
);
if (touched.length) {
  console.log(`  ${touched.slice(0, 10).join("\n  ")}`);
  if (touched.length > 10) console.log(`  ... and ${touched.length - 10} more`);
}
if (CHECK && touched.length) process.exitCode = 1;
