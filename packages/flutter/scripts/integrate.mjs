#!/usr/bin/env node
// 통합 스크립트: 구현된 컴포넌트를 배럴·미구현 원장·갤러리 등록부·섹션 표에 연결합니다.
//
// 세 파일은 컴포넌트 레인이 손대지 않고 이 스크립트만 고칩니다. 그래야 슬러그가
// 빠지거나 순서가 어긋나는 일이 없고, 몇 번을 다시 돌려도 결과가 같습니다.
//
//   node scripts/integrate.mjs          # 쓰기
//   node scripts/integrate.mjs --check  # 쓰지 않고 누락만 보고 (있으면 exit 1)
//
// `chart`만 예외입니다. `fl_chart`가 모든 앱 번들에 실리지 않도록 배럴에서 빼고
// `package:horon_ui/chart.dart` 하위 경로로만 엽니다.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(PKG, "..", "..");
const CATALOG = join(REPO, "apps/site/src/data/components.ts");
const BARREL = join(PKG, "lib/horon_ui.dart");
const PENDING = join(PKG, "test/gates/pending_components.dart");
const REGISTRY = join(PKG, "example/lib/gallery/registry.dart");
const SECTION_BUILDER = join(PKG, "example/lib/gallery/section_builder.dart");

const CHECK = process.argv.includes("--check");
const GROUP_ORDER = ["inputs", "display", "navigation", "overlays", "layout"];
const BARREL_EXCEPTIONS = new Set(["chart"]);

const catalogSource = await readFile(CATALOG, "utf8");
const catalog = new Map();
for (const m of catalogSource.matchAll(/\{ slug: "([^"]+)", title: "([^"]+)", group: "([a-z]+)"/g)) {
  catalog.set(m[1].replaceAll("-", "_"), { title: m[2], group: m[3], order: catalog.size });
}
if (catalog.size !== 75) throw new Error(`catalog has ${catalog.size} entries, expected 75`);

const implemented = (await readdir(join(PKG, "lib/src/components")))
  .filter((f) => f.endsWith(".dart"))
  .map((f) => f.replace(/\.dart$/, ""))
  .sort();

const unknown = implemented.filter((s) => !catalog.has(s));
if (unknown.length) throw new Error(`components not in the React catalog: ${unknown.join(",")}`);

const missing = [];
for (const slug of implemented) {
  if (!existsSync(join(PKG, `test/components/${slug}_test.dart`))) missing.push(`test/components/${slug}_test.dart`);
  if (!existsSync(join(PKG, `example/lib/gallery/sections/${slug}.dart`)))
    missing.push(`example/lib/gallery/sections/${slug}.dart`);
}
if (missing.length) {
  console.error(`MISSING FILES (${missing.length}):\n  ${missing.join("\n  ")}`);
  process.exitCode = 1;
}

// 섹션 클래스 이름은 파일에서 직접 읽습니다. 규칙을 스크립트에 복제하지 않습니다.
const sectionClass = new Map();
for (const slug of implemented) {
  const file = join(PKG, `example/lib/gallery/sections/${slug}.dart`);
  if (!existsSync(file)) continue;
  const m = /class (Horon[A-Za-z0-9]*GallerySection) extends/.exec(await readFile(file, "utf8"));
  if (!m) {
    console.error(`NO SECTION CLASS in ${slug}.dart`);
    process.exitCode = 1;
    continue;
  }
  sectionClass.set(slug, m[1]);
}

// 배럴: 컴포넌트 export를 정렬해 넣고 chart는 뺍니다.
{
  const source = await readFile(BARREL, "utf8");
  const marker = "export 'src/contracts/horon_strings.dart';";
  const header = source.slice(0, source.indexOf(marker));
  const componentExports = implemented
    .filter((s) => !BARREL_EXCEPTIONS.has(s))
    .map((s) => `export 'src/components/${s}.dart';`);
  const rest = source
    .split("\n")
    .filter((line) => line.startsWith("export 'src/") && !line.startsWith("export 'src/components/"));
  const next = `${header + componentExports.join("\n")}\n${rest.join("\n")}`;
  if (!CHECK) await writeFile(BARREL, next.endsWith("\n") ? next : `${next}\n`);
}

// 미구현 원장: 구현된 슬러그를 지웁니다.
{
  const source = await readFile(PENDING, "utf8");
  const kept = [...source.matchAll(/'([a-z0-9_]+)'/g)]
    .map((m) => m[1])
    .filter((slug) => !implemented.includes(slug));
  const head = source.slice(0, source.indexOf("const List<String> pendingComponents"));
  const body =
    kept.length === 0
      ? "const List<String> pendingComponents = <String>[];\n"
      : `const List<String> pendingComponents = <String>[\n${kept.map((s) => `  '${s}',`).join("\n")}\n];\n`;
  if (!CHECK) await writeFile(PENDING, head + body);
}

// 갤러리 등록부: 그룹 순서 → 카탈로그 순서.
{
  const source = await readFile(REGISTRY, "utf8");
  const head = source.slice(0, source.indexOf("const List<GallerySection> gallerySections"));
  const ordered = implemented.slice().sort((a, b) => {
    const ga = GROUP_ORDER.indexOf(catalog.get(a).group);
    const gb = GROUP_ORDER.indexOf(catalog.get(b).group);
    return ga !== gb ? ga - gb : catalog.get(a).order - catalog.get(b).order;
  });
  const entries = ordered.map((s) => {
    const title = catalog.get(s).title.replaceAll("'", "\\'");
    const group = catalog.get(s).group;
    const oneLine = `  GallerySection(slug: '${s}', title: '${title}', group: '${group}'),`;
    // `analysis_options.yaml`의 page_width는 120입니다. 그보다 긴 줄을 그대로 쓰면
    // `dart format --set-exit-if-changed`가 실패하므로 처음부터 여러 줄로 씁니다.
    if (oneLine.length <= 120) return oneLine;
    return `  GallerySection(\n    slug: '${s}',\n    title: '${title}',\n    group: '${group}',\n  ),`;
  });
  const body =
    entries.length === 0
      ? "const List<GallerySection> gallerySections = <GallerySection>[];\n"
      : `const List<GallerySection> gallerySections = <GallerySection>[\n${entries.join("\n")}\n];\n`;
  if (!CHECK) await writeFile(REGISTRY, head + body);
}

// 섹션 표: 셸이 본문을 그리려면 슬러그 → 위젯 연결이 있어야 합니다.
{
  const slugs = implemented.filter((s) => sectionClass.has(s));
  const imports = slugs.map((s) => `import 'sections/${s}.dart';`);
  const entries = slugs.map((s) => `  '${s}': ${sectionClass.get(s)}.new,`);
  const body = `// 슬러그를 갤러리 섹션 위젯으로 바꾸는 표입니다.
//
// 셸은 \`sectionBuilder\`가 없으면 \`notImplemented\` 자리표시자를 그립니다. 그래서
// 섹션 파일이 있어도 앱 진입점이 이 값을 넘기지 않으면 화면에는 하나도 나오지
// 않습니다. 이 파일이 그 연결을 소유합니다.
//
// 이 파일은 \`scripts/integrate.mjs\`가 만듭니다. 손으로 고치지 않습니다.
// 표에 없는 슬러그는 \`null\`을 돌려주고 셸이 자리표시자를 그립니다.

import 'package:flutter/widgets.dart';

import 'registry.dart';
${imports.join("\n")}

/// 섹션 위젯을 슬러그로 찾습니다.
///
/// 등록되지 않은 슬러그면 \`null\`을 돌려주고, 셸이 자리표시자를 그립니다.
Widget? gallerySectionFor(BuildContext context, GallerySection section) =>
    _builders[section.slug]?.call();

/// 슬러그별 섹션 생성자입니다.
const Map<String, Widget Function()> _builders = <String, Widget Function()>{
${entries.join("\n")}
};

/// 이 표가 알고 있는 슬러그입니다.
///
/// 갤러리 렌더 확인 테스트가 이 목록을 순회합니다. 등록부가 아직 비어 있어도
/// 섹션 위젯 자체는 전부 그려 볼 수 있습니다.
Set<String> get gallerySectionBuilderSlugs => _builders.keys.toSet();
`;
  if (!CHECK) await writeFile(SECTION_BUILDER, body);
}

const counts = GROUP_ORDER.map((g) => `${g}=${implemented.filter((s) => catalog.get(s).group === g).length}`);
console.log(
  `implemented=${implemented.length} pending=${75 - implemented.length} section_widgets=${sectionClass.size} ${counts.join(" ")}`,
);
if (CHECK) console.log("(--check: 아무것도 쓰지 않았습니다)");
