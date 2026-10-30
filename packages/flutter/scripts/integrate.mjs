#!/usr/bin/env node
// 통합 스크립트: 구현된 컴포넌트를 배럴·미구현 원장·갤러리 등록부·섹션 표에 연결합니다.
//
// 세 파일은 컴포넌트 레인이 손대지 않고 이 스크립트만 고칩니다. 그래야 슬러그가
// 빠지거나 순서가 어긋나는 일이 없고, 몇 번을 다시 돌려도 결과가 같습니다.
//
//   node scripts/integrate.mjs          # 쓰기
//   node scripts/integrate.mjs --check  # 쓰지 않고 누락만 보고 (있으면 exit 1)
//
// 카탈로그(`apps/site/src/data/components.ts`)는 81개 항목이 여섯 그룹에 나뉘어 있고,
// 항목 하나가 여러 줄에 걸칩니다. 컴포넌트가 하나도 없는 상태(재작성 직전)도
// 정상입니다. 그때는 배럴에 컴포넌트 export가 없고, 등록부와 섹션 표가 비며,
// 미구현 원장에 81개 슬러그가 전부 들어갑니다.
//
// 원장은 디렉터리 목록에서 다시 씁니다. 파일이 있는 슬러그는 빠지고, 파일이 없는
// 카탈로그 슬러그는 들어갑니다.

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
const GROUP_ORDER = ["inputs", "display", "navigation", "overlays", "conversation", "agents"];
const CATALOG_SIZE = 81;
const COMPONENTS_DIR = join(PKG, "lib/src/components");
const SECTIONS_DIR = join(PKG, "example/lib/gallery/sections");
const OVERLAY_DIR = join(PKG, "lib/src/overlay");

/** 디렉터리가 없으면 빈 목록입니다. 재작성 직전에는 디렉터리가 비어 있습니다. */
const listDart = async (dir) => (existsSync(dir) ? (await readdir(dir)).filter((f) => f.endsWith(".dart")) : []);

const catalogSource = await readFile(CATALOG, "utf8");
const catalog = new Map();
// 항목은 여러 줄에 걸쳐 `slug`, `title`, `group` 키를 차례로 씁니다.
// `componentGroups`의 항목은 `id` 키로 시작하므로 겹치지 않습니다.
for (const m of catalogSource.matchAll(/\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*group:\s*"([a-z]+)"/g)) {
  catalog.set(m[1].replaceAll("-", "_"), { title: m[2], group: m[3], order: catalog.size });
}
if (catalog.size !== CATALOG_SIZE) throw new Error(`catalog has ${catalog.size} entries, expected ${CATALOG_SIZE}`);
const badGroups = [...catalog].filter(([, c]) => !GROUP_ORDER.includes(c.group)).map(([slug, c]) => `${slug}:${c.group}`);
if (badGroups.length) throw new Error(`catalog entries in unknown groups: ${badGroups.join(",")}`);

const implemented = (await listDart(COMPONENTS_DIR)).map((f) => f.replace(/\.dart$/, "")).sort();

const unknown = implemented.filter((s) => !catalog.has(s));
if (unknown.length) throw new Error(`components not in the React catalog: ${unknown.join(",")}`);

const missing = [];
for (const slug of implemented) {
  if (!existsSync(join(PKG, `test/components/${slug}_test.dart`))) missing.push(`test/components/${slug}_test.dart`);
  if (!existsSync(join(SECTIONS_DIR, `${slug}.dart`))) missing.push(`example/lib/gallery/sections/${slug}.dart`);
}
if (missing.length) {
  console.error(`MISSING FILES (${missing.length}):\n  ${missing.join("\n  ")}`);
  process.exitCode = 1;
}

// 섹션 클래스 이름은 파일에서 직접 읽습니다. 규칙을 스크립트에 복제하지 않습니다.
const sectionClass = new Map();
for (const slug of implemented) {
  const file = join(SECTIONS_DIR, `${slug}.dart`);
  if (!existsSync(file)) continue;
  const m = /class (Horon[A-Za-z0-9]*GallerySection) extends/.exec(await readFile(file, "utf8"));
  if (!m) {
    console.error(`NO SECTION CLASS in ${slug}.dart`);
    process.exitCode = 1;
    continue;
  }
  sectionClass.set(slug, m[1]);
}

// 배럴: 컴포넌트 export를 정렬해 넣습니다. 컴포넌트가 없으면 그 목록이 빕니다.
{
  const source = await readFile(BARREL, "utf8");
  // 헤더는 첫 `export 'src/` 줄 앞까지입니다. 예전에는 `contracts` 줄을 표식으로
  // 썼는데, 정렬을 도입하면서 그 줄이 첫 export가 아니게 되어 헤더가 이전
  // export 블록을 통째로 포함했고, 다시 돌리자 배럴이 중복됐습니다.
  const firstExport = source.search(/^export 'src\//m);
  if (firstExport < 0) throw new Error("barrel has no `export 'src/` line");
  const header = source.slice(0, firstExport);
  const componentExports = implemented.map((s) => `export 'src/components/${s}.dart';`);
  // `src/overlay/`는 컴포넌트가 아니지만 앱이 직접 쓰는 표면입니다
  // (`showHoronModal`, `HoronModalSurface`, 오버레이 위치 계산). 그래서 배럴에
  // 넣습니다.
  const overlayExports = (await listDart(OVERLAY_DIR))
    .map((f) => `export 'src/overlay/${f}';`);
  const rest = source
    .split("\n")
    .filter(
      (line) =>
        line.startsWith("export 'src/") &&
        !line.startsWith("export 'src/components/") &&
        !line.startsWith("export 'src/overlay/"),
    );
  // `directives_ordering`는 같은 묶음의 export를 경로 순으로 정렬합니다.
  // 컴포넌트·overlay·나머지를 모두 합쳐 한 번에 정렬해야 lint를 통과합니다.
  const sorted = [...componentExports, ...overlayExports, ...rest].sort();
  const next = `${header + sorted.join("\n")}`;
  if (!CHECK) await writeFile(BARREL, next.endsWith("\n") ? next : `${next}\n`);
}

// 미구현 원장: 디렉터리 목록에서 다시 씁니다. 파일이 없는 카탈로그 슬러그는 카탈로그
// 순서로 들어가고, 파일이 있는 슬러그는 빠집니다.
{
  const source = await readFile(PENDING, "utf8");
  const kept = [...catalog.keys()].filter((slug) => !implemented.includes(slug));
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
  const builders = entries.length === 0 ? "" : `${entries.join("\n")}\n`;
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
${imports.length === 0 ? "" : `${imports.join("\n")}\n`}
/// 섹션 위젯을 슬러그로 찾습니다.
///
/// 등록되지 않은 슬러그면 \`null\`을 돌려주고, 셸이 자리표시자를 그립니다.
Widget? gallerySectionFor(BuildContext context, GallerySection section) =>
    _builders[section.slug]?.call();

/// 슬러그별 섹션 생성자입니다.
const Map<String, Widget Function()> _builders = <String, Widget Function()>{
${builders}};

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
  `catalog=${catalog.size} implemented=${implemented.length} pending=${catalog.size - implemented.length} section_widgets=${sectionClass.size} ${counts.join(" ")}`,
);
if (CHECK) console.log("(--check: 아무것도 쓰지 않았습니다)");

// 마지막 단계: 통합이 만진 파일의 모양을 CI와 같은 도구로 맞춥니다.
//
// 하위 경로 import를 지우면 import 블록에 빈 줄이 남고, 여러 줄로 쓴
// `GallerySection(...)`은 손으로 맞추기 어렵습니다. `dart format`이 CI의 포맷
// 검사와 같은 도구이므로 여기서 한 번 돌립니다.
if (!CHECK) {
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync("dart", ["format", "lib", "test", "example"], {
    cwd: PKG,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error("dart format failed; run it by hand before committing");
    process.exitCode = 1;
  }
}
