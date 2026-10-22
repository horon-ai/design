#!/usr/bin/env node
// 배럴이 무언가를 내보내기 시작하면, 같은 심볼을 `package:horon_ui/src/...` 하위
// 경로로도 import하던 파일은 두 가지로 실패합니다.
//
// 1. `implementation_imports` — 다른 패키지의 `lib/src`를 직접 import했습니다.
// 2. `unnecessary_import` — 배럴을 함께 import하면 중복입니다.
//
// 그래서 이 스크립트는 `lib/src/**` 하위 경로 import를 배럴 import로 바꿉니다.
// 처리 규칙은 세 가지입니다.
//
// - 배럴을 이미 import하는 파일: 중복된 `lib/src` import를 지웁니다.
// - 배럴을 import하지 않는 파일: `lib/src` import를 지우고 배럴 import를 넣습니다.
//   넣는 자리는 `directives_ordering`이 요구하는 알파벳 순서입니다.
// - 배럴이 내보내지 않는 하위 경로는 그대로 둡니다. 지금은 `chart`가 유일하고,
//   그것은 `package:horon_ui/chart.dart`로 열리므로 `lib/src` 경로가 아닙니다.
//
//   node scripts/sweep-imports.mjs          # 쓰기
//   node scripts/sweep-imports.mjs --check  # 쓰지 않고 바꿀 파일 수만 보고 (있으면 exit 1)

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const BARREL_IMPORT = "import 'package:horon_ui/horon_ui.dart';";
const SRC_IMPORT = /^import 'package:horon_ui\/src\/(.+\.dart)';$/;

/// 배럴이 내보내는 `src/` 하위 경로입니다.
///
/// `export 'src/theme/horon_theme.dart'` 같은 줄에서 경로만 뽑습니다. 이 목록에
/// 있는 경로를 직접 import하면 `implementation_imports`입니다.
const barrel = await readFile(join(PKG, 'lib/horon_ui.dart'), 'utf8');
const exportedPaths = new Set(
  [...barrel.matchAll(/export 'src\/([^']+)';/g)].map((m) => m[1]),
);

async function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (entry.name.endsWith('.dart')) out.push(p);
  }
  return out;
}

/// `directives_ordering`이 요구하는 자리에 배럴 import를 넣습니다.
function insertBarrel(lines) {
  const barrelName = 'package:horon_ui/horon_ui.dart';
  const packageLines = [];
  let lastDart = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("import 'dart:")) lastDart = i;
    const m = /^import '([^']+)';$/.exec(line);
    if (m && m[1].startsWith('package:')) packageLines.push({ index: i, uri: m[1] });
  }

  for (const entry of packageLines) {
    if (entry.uri > barrelName) {
      lines.splice(entry.index, 0, BARREL_IMPORT);
      return lines;
    }
  }
  if (packageLines.length > 0) {
    lines.splice(packageLines[packageLines.length - 1].index + 1, 0, BARREL_IMPORT);
    return lines;
  }
  lines.splice(lastDart + 1, 0, '', BARREL_IMPORT);
  return lines;
}

const files = [
  ...(await walk(join(PKG, 'test'))),
  ...(await walk(join(PKG, 'example/lib'))),
  ...(await walk(join(PKG, 'example/test'))),
];

const touched = [];
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  const hadBarrel = lines.some((line) => line.trim() === BARREL_IMPORT);

  const kept = lines.filter((line) => {
    const m = SRC_IMPORT.exec(line.trim());
    return !m || !exportedPaths.has(m[1]);
  });
  if (kept.length === lines.length) continue;

  const next = hadBarrel ? kept : insertBarrel(kept);
  touched.push(relative(PKG, file));
  if (!CHECK) await writeFile(file, next.join('\n'));
}

console.log(
  `barrel_exports=${exportedPaths.size} files_${CHECK ? 'to_fix' : 'fixed'}=${touched.length}`,
);
if (touched.length) {
  console.log(`  ${touched.slice(0, 10).join('\n  ')}`);
  if (touched.length > 10) console.log(`  ... and ${touched.length - 10} more`);
}
if (CHECK && touched.length) process.exitCode = 1;
