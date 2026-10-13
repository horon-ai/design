# design-system-tidy - Work Plan

## TL;DR (For humans)

<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**Who this is for and what changes for them:** 민열님(작성자), 웹 개발자, 네이티브 개발자, 그리고 pen 캔버스/다른 에이전트. 지금은 임시 회색 팔레트 위에 컴포넌트가 6개(웹)·5개(앱)뿐이라, 이후 팔레트를 바꾸면 다 뜯어고쳐야 합니다. 작업 후에는 확정 Horon 팔레트(sand 중성 + gold 액센트 + 잉크 primary)를 단일 소스로 쓰고, 웹·앱·pen이 그 한 곳에서 색·간격·모션을 받습니다.

**What you'll get:** (1) 정본 토큰 — 확정 팔레트 + glass + 모션 + RN이 실제로 먹는 폰트·그림자, (2) 깔끔한 저장소 — 이름 정리, RN 앱(Expo)으로 네이티브 증명, 토큰이 어긋나면 실패하는 가드 + 최소 CI, (3) 웹·앱 양쪽에 v1 컴포넌트 세트(Textarea, List, Avatar, Progress, Skeleton, Toast, Tabs, Dialog, Sheet, Select, Switch, Tooltip, Chip 등)를 진입점에서 바로 import.

**Why this approach:** 팔레트를 먼저 바로잡아야 컴포넌트를 나중에 다시 손대지 않습니다. 그래서 토큰(정본) → 정리·가드레일 → 컴포넌트 순으로 갑니다. `design/packages/tokens`를 정본으로 삼는 이유는 웹·앱·스토리북·플레이그라운드가 이미 이걸 import하고 있어 변경 범위가 가장 작기 때문입니다.

**What it will NOT do:** 다른 저장소(core/, web/)를 수정하거나 pen 캔버스를 다시 칠하지 않습니다. 웹↔앱 import 경계는 그대로 둡니다. 값을 임시로 두는 "1단계 축소"를 하지 않습니다.

**Effort:** Large

**Risk:** Medium - 팔레트 이관이 기존 6+5 컴포넌트의 색을 바꾸고, Expo 앱 추가와 RN 그림자/폰트 매핑에 플랫폼 차이가 있습니다.

**Decisions I made for you:** 정본=design/packages/tokens(변경 최소) · 팔레트 값은 core/web/pen에서 읽기만 해서 이관 · glass는 chrome 변형 + 자체 foreground 보유 · primary=잉크·gold=액센트(기존 메모리 결정) · 폰트·그림자는 web/native로 분리 · v1 목록=리서치 F6 · native 앱=Expo · 드리프트 가드+CI 추가. 각각 되돌릴 수 있습니다.

Your next move: 실행은 별도 세션의 `/ulw-execute design-system-tidy`로 시작합니다. 상세는 아래.

---

> TL;DR (machine): Large / Medium - canonicalize @horon/tokens (Horon sand+gold+ink palette, glass, motion, RN font+shadow), tidy repo + add Expo native app + token-drift guard + CI, then fill the v1 component set into @horon/web and @horon/app.

## Scope

### Affected user and ideal state

**Affected user:** 민열님(작성자), 웹 개발자(@horon/web 소비), 네이티브 개발자(@horon/app 소비), pen 캔버스/다른 에이전트(토큰 어휘 소비). 오늘은 각자 임시값 위에서 작업하고, 작업 후에는 하나의 정본에서 파생됩니다.

| Row    | Statement                                                                                                                                                   | Reason                                                                                                                  | Closed by |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------- |
| IS-1   | 토큰 정본 하나에서 이 모노레포의 웹·앱·스토리북·플레이그라운드가 파생되고, pen 캔버스가 소비할 수 있는 공유 어휘를 제공한다; 팔레트 변경이 웹·앱에 전파된다 | 리서치 1번 블로커 = 4벌 토큰, 정본 없음 (SYNTHESIS F5). core 제품 저장소는 값이 테스트로 고정돼 있어 범위 밖(별도 결정) | -         |
| IS-2   | 팔레트가 확정 Horon(sand 중성 + gold 액센트 + 잉크 primary), 라이트/다크                                                                                    | 지금은 shadcn 중립 임시값, 브랜드색 없음                                                                                | -         |
| IS-3   | 토큰이 RN 완전체: hex 색, RN 폰트 패밀리, 플랫폼별 그림자, + motion/glass                                                                                   | fontFamily/shadow가 CSS 모양이고 motion/glass 없음                                                                      | -         |
| IS-4   | v1 컴포넌트 세트가 웹·앱 진입점에서 import된다                                                                                                              | 웹 6·앱 5만 구현                                                                                                        | -         |
| IS-5   | 저장소가 깨끗하고 드리프트에 안전: 이름 드리프트·잔여물 없음, README 정확, 토큰 드리프트 가드 존재                                                          | '손봐야 할 곳'에 정리 포함                                                                                              | -         |
| IS-6   | glass 표면이 접근성 규칙을 지킨다: 자체 foreground로 4.5:1 이상, prefers-reduced-transparency·no-backdrop-filter 강등 제공                                  | SYNTHESIS F3/F9 - 대비 실패와 강등은 접근성 버그                                                                        | -         |
| GAP-1  | tokens.ts가 중립 임시 팔레트                                                                                                                                | 이 시스템의 목적이 Horon 룩                                                                                             | 1, 2, 7   |
| GAP-2  | glass 토큰 부재(pen 상수뿐)                                                                                                                                 | glass=chrome 변형, 자체 foreground 필요 (F3)                                                                            | 3, 7, 8   |
| GAP-3  | design에 motion 토큰 부재                                                                                                                                   | 컴포넌트 타이밍 일관성                                                                                                  | 4, 7, 8   |
| GAP-4  | fontFamily가 CSS 스택 문자열                                                                                                                                | RN은 단일 패밀리명 필요                                                                                                 | 5, 7, 8   |
| GAP-5  | shadow가 CSS 모양                                                                                                                                           | RN은 iOS/Android 분기 필요                                                                                              | 6, 7, 8   |
| GAP-6  | v1 컴포넌트 세트가 미구현(목표 ~50 중 웹 6·앱 5)                                                                                                            | 라이브러리가 아직 못 씀                                                                                                 | 16-24     |
| GAP-7  | apps/native 없음                                                                                                                                            | @horon/app RN 미증명                                                                                                    | 12        |
| GAP-8  | 스토리 폴더 이름 universal != @horon/app                                                                                                                    | 리네임 후 이름 드리프트                                                                                                 | 10        |
| GAP-9  | 토큰->theme.css 드리프트 가드·CI 없음                                                                                                                       | 생성기가 조용히 낡음                                                                                                    | 13, 14    |
| GAP-10 | 빌드 산출물이 추적되고 .omo/evidence가 무시되지 않음                                                                                                        | 저장소 위생                                                                                                             | 11        |
| GAP-11 | README가 정본 토큰·apps/native·가드를 반영하지 않음                                                                                                         | 문서 낡음                                                                                                               | 15        |

### Must have

- `design/packages/tokens`가 유일한 정본이며, 확정 Horon 팔레트(sand/gold/ink)·glass·motion을 담는다.
- `theme.css`가 토큰 소스에서 자동 생성되고, 웹이 이를 소비한다.
- `@horon/tokens/native`가 RN이 그대로 쓰는 값(hex 색, RN 폰트, 플랫폼별 그림자, 숫자 모션)을 낸다.
- `apps/native`(Expo)가 `@horon/app`을 소비해 네이티브 렌더를 증명한다.
- `@horon/web`·`@horon/app`이 v1 세트를 진입점에서 export한다.
- 토큰 드리프트 가드 테스트 + 루트 `test` 스크립트 + 최소 CI.
- README가 새 구조·팔레트·경계를 정확히 설명한다.

### Must NOT have (guardrails, anti-slop, scope boundaries)

- 다른 저장소(`/Users/alpox/dev/horon-ai/core`, `/horon-ai/web`, `/horon-ai/horon-ai`)를 수정하지 않는다. 읽기만 한다.
- pen 캔버스(.pen)를 직접 읽거나 수정하지 않는다(암호화; Pencil MCP만). 재팔레트하지 않는다.
- 웹↔앱 import 경계(`no-restricted-imports`)를 바꾸지 않는다.
- v1 목록 밖 컴포넌트(차트·캐러셀·데이터테이블 등 "soon/later")를 만들지 않는다.
- 값·컴포넌트를 "나중"으로 미루는 축소를 하지 않는다.
- 테스트를 약화·스킵하거나 타입/린트 오류를 억제하지 않는다.

## Verification strategy

> Zero human intervention - all verification is agent-executed.

- Test decision: tests-after, `bun test` (Bun 내장). 토큰 값/생성물 정합성은 스냅샷·재생성-무변경 검사, 컴포넌트는 Storybook 빌드 + 실제 렌더 증거.
- Evidence: `.omo/evidence/design-system-tidy/task-<N>-<slug>.md` (명령·출력·스크린샷 경로).
- 렌더 증거: 웹은 빌드한 Storybook을 헤드리스(Chrome backend)로, 네이티브는 iOS 시뮬레이터(Expo)에서 스크린샷. 네이티브 렌더는 필수 관문이다 - 시뮬레이터가 없으면 통과가 아니라 BLOCKED로 보고한다(토큰 단언으로 대체하지 않는다).

## Execution strategy

### Parallel execution waves

- **Wave 1 — Tokens (A):** 1-9. 정본 팔레트·glass·motion·폰트·그림자·생성기. (1→2→3→4→5→6 직렬 - 3-6이 scales.ts/tokens.ts를 공유하는 단일 파일이라 병렬 금지, 7-9는 1-6 후)
- **Wave 2 — Hygiene (C):** 10-15. 이름·산출물·native 앱·가드·CI·README. (10,11,12,15 병렬; 13은 1-9 후; 14는 13 후)
- **Wave 3 — Components (B):** 16-24. 웹/앱 v1 세트 + 진입점. (웹 16-19, 앱 20-23, 진입점 24는 그 후)
- **Final wave:** F1-F4.

### Dependency matrix

| Todo | Depends on | Blocks     | Can parallelize with |
| ---- | ---------- | ---------- | -------------------- |
| 1    | -          | 2,7        | 10,11,15             |
| 2    | 1          | 3,4,5,6    | 10,11,15             |
| 3    | 2          | 4,7,8      | 10,11,15             |
| 4    | 3          | 5,7,8      | 10,11,15             |
| 5    | 4          | 6,7,8      | 10,11,15             |
| 6    | 5          | 7,8        | 10,11,15             |
| 7    | 1-6        | 8,13,16-24 | 10,11,12,15          |
| 8    | 3-6        | 12,13      | 10,11,15             |
| 9    | 7          | 16-24      | 10,11,15             |
| 10   | -          | F2         | 11,12,15,1-9         |
| 11   | -          | F2         | 10,12,15,1-9         |
| 12   | 8          | F3         | 10,11,15,13,14       |
| 13   | 7,8        | 14,F1      | 12,15                |
| 14   | 13         | F1         | 15                   |
| 15   | -          | F2         | 10,11,12,13,14       |
| 16   | 9          | 24         | 17,18,19,20-23       |
| 17   | 9          | 24         | 16,18,19,20-23       |
| 18   | 9          | 24         | 16,17,19,20-23       |
| 19   | 9          | 24         | 16,17,18,20-23       |
| 20   | 8,9        | 24         | 16-19,21-23          |
| 21   | 8,9        | 24         | 16-19,20,22,23       |
| 22   | 8,9        | 24         | 16-19,20,21,23       |
| 23   | 8,9        | 24         | 16-19,20,21,22       |
| 24   | 16-23      | F1         | -                    |

## Todos

> Implementation + Test = ONE todo. Never separate.

- [x] 1. Encode the raw Horon palette into the tokens package
     What to do / Must NOT do: create `packages/tokens/src/palette.ts` holding the raw primitive ramps as the single encoded copy: the **sand monochrome** ramp (12 solid + 6 alpha, light+dark) read from `core/packages/tokens/src/palette.ts` (the `gray` hue), a **gold** accent ramp, and **status** ramps (success/warning/danger/info). Encode the ramps as **OKLCH strings** - the existing pipeline (`packages/tokens/src/color.ts` `oklchToHex`) throws on non-OKLCH input, so convert the core hex ramps to OKLCH as you encode them (do NOT copy raw hex). Do NOT edit the core/web repos; read them read-only. Do NOT change existing semantic names yet.
     Closes: GAP-1
     Parallelization: Wave 1 | Blocked by: - | Blocks: 2,7
     References: `core/packages/tokens/src/palette.ts` (sand/gray 12+6), `/Users/alpox/dev/horon-ai/web/src/app/globals.css:68-100` (gold `#e0921f`, brand-\* set), `.omo/ulw-research/20261014-041133/SYNTHESIS.md` F5/F9.
     Acceptance criteria (agent-executable): `packages/tokens/src/palette.ts` exists, exports named ramps, and `bun -e 'import("./packages/tokens/src/palette.ts").then(m=>{for(const [k,v] of Object.entries(m.PALETTE)) if(!v.light?.solid?.length) throw new Error(k)})'` exits 0; every ramp value parses via `parseOklch` (assert in the same command).
     QA scenarios: happy - import and print `PALETTE.sand.light.solid.length` (expect 12); failure - confirm no core/web file mtime changed (`git -C /Users/alpox/dev/horon-ai/core status --porcelain` empty). Evidence `.omo/evidence/design-system-tidy/task-1-palette.md`.
     Recommended task executor category: deep-low - reads sibling repos read-only and encodes ramps
     Commit: Y | feat(tokens): add raw Horon palette (sand/gold/status)

- [x] 2. Rewrite the semantic color layer to the Horon palette
     What to do / Must NOT do: in `packages/tokens/src/tokens.ts`, remap the semantic tokens to the palette: surface/text/border all from the **sand** ramp; `primary` = **ink** (near-black light / near-white dark) per the recorded decision; `accent`/`ring` = **gold**; status colors muted. Keep the existing semantic token NAMES (background/foreground/card/muted/border/input/ring/primary/...) so nothing downstream breaks. Light + dark.
     Closes: GAP-1
     Parallelization: Wave 1 | Blocked by: 1 | Blocks: 3,4,5,6
     References: `packages/tokens/src/tokens.ts` (current neutral values), `packages/tokens/src/palette.ts` (new), memory decision: primary=ink, gold=accent only.
     Acceptance criteria: `bun run --filter @horon/tokens build` exits 0; `grep -c 'oklch\\|#' packages/tokens/theme.css` shows colors; assert `native.colors.light.ring` is the gold accent and `native.colors.light.primary` is the ink value, compared against `palette.ts` gold/ink entries (not a hardcoded neutral); `bun run typecheck` passes.
     QA scenarios: happy - print light/dark primary+ring+accent hex, confirm ink primary and gold ring; failure - confirm every prior semantic name still exists (diff the key set). Evidence `.omo/evidence/design-system-tidy/task-2-semantic.md`.
     Recommended task executor category: deep-low - semantic remapping with downstream constraints
     Commit: Y | feat(tokens): map semantics to the Horon sand/gold/ink palette

- [x] 3. Add glass tokens (chrome variant, self-owned foreground)
     What to do / Must NOT do: add the glass COLOR tokens `glass-fill`, `glass-fill-strong`, `glass-border`, `glass-foreground` to `tokens.ts` (colors only), light+dark; put the non-color `glass-blur` radius in `scales.ts` (NOT the color map, which runs through `oklchToHex`); add the degradation-ladder values (frost, solid) as color variants. Glass must OWN its foreground (do not inherit theme `foreground`). Do NOT apply glass to content surfaces.
     Closes: GAP-2
     Parallelization: Wave 1 | Blocked by: 2 | Blocks: 4,7,8
     References: SYNTHESIS F3 (`--glass-foreground` requirement), F8/F9 (glass=solid map, degradation ladder); pen `glass-fill #FFFFFF66`, `glass-fill-strong #FFFFFFB3`, `glass-border #FFFFFFCC`.
     Acceptance criteria: `tokens.ts` exports the glass names; `bun -e 'import("./packages/tokens/src/native.ts").then(m=>{if(!m.colors.light["glass-foreground"]) throw new Error("no glass-fg")})'` exits 0.
     QA scenarios: happy - compute WCAG contrast of `glass-foreground` composited over REPRESENTATIVE real content backdrops (light card, dark card, and a busy/image backdrop), not a single designated fill, and confirm >= 4.5:1 in light+dark; failure - force the degradation modes (`prefers-reduced-transparency: reduce` -> frost; `@supports not (backdrop-filter)` -> solid) and confirm the surface stays legible. Evidence `.omo/evidence/design-system-tidy/task-3-glass.md`.
     Recommended task executor category: deep-low - accessibility-critical foreground decision
     Commit: Y | feat(tokens): add glass tokens with self-owned foreground

- [x] 4. Add motion tokens
     What to do / Must NOT do: add `duration` and `easing` scales to `packages/tokens/src/scales.ts`, mirroring `core/packages/tokens/src/scales.ts` DURATION/EASING. `duration` = numeric ms. `easing` = BOTH forms: web keeps the CSS strings (`ease`, `cubic-bezier(...)`); native exposes each key as a **bezier control-point tuple `[x1,y1,x2,y2]`** (map `ease`->[0.25,0.1,0.25,1], `ease-in`->[0.42,0,1,1], `ease-out`->[0,0,0.58,1], `ease-in-out`->[0.42,0,0.58,1]; named core beziers keep their points) so RN's `Easing.bezier(...)` consumes it. Do NOT emit a CSS string into the native slot. Do NOT invent new timings beyond the core set.
     Closes: GAP-3
     Parallelization: Wave 1 | Blocked by: 3 | Blocks: 5,7,8
     References: `core/packages/tokens/src/scales.ts` DURATION (50-300ms) + EASING (cubic-beziers).
     Acceptance criteria: `scales.ts` exports `duration`/`easing`; `bun -e 'import("./packages/tokens/src/scales.ts").then(m=>{if(!m.duration.normal) throw new Error(); for(const k of Object.keys(m.easing.native)) if(!Array.isArray(m.easing.native[k])||m.easing.native[k].length!==4) throw new Error(k)})'` exits 0 (every native easing is a 4-tuple).
     QA scenarios: happy - print duration+easing keys; failure - confirm values match core (diff). Evidence `.omo/evidence/design-system-tidy/task-4-motion.md`.
     Recommended task executor category: quick - mechanical mirror of the core motion scale
     Commit: Y | feat(tokens): add motion tokens

- [x] 5. Split fontFamily into web + native
     What to do / Must NOT do: change `fontFamily` to `{ web: {sans, mono}, native: {sans, mono} }` in `scales.ts`; `web.sans` keeps the CSS stack, `native.sans` becomes a single RN family name (e.g. `Geist`). Update every consumer in the same todo: `packages/app/src/primitives/Text.tsx`, `packages/app/src/theme/index.tsx`, `packages/tokens/src/css.ts`. Do NOT leave a CSS string in the native slot.
     Closes: GAP-4
     Parallelization: Wave 1 | Blocked by: 4 | Blocks: 6,7,8
     References: `packages/tokens/src/scales.ts` (current `fontFamily`), `packages/app/src/theme/index.tsx` (consumer).
     Acceptance criteria: `bun -e 'import("./packages/tokens/src/scales.ts").then(m=>{if(m.fontFamily.native.sans.includes(" ")) throw new Error("not a family name")})'` exits 0; `bun run typecheck` passes across the workspace (consumers updated).
     QA scenarios: happy - print both; failure - confirm native.sans has no comma/space-stack. Evidence `.omo/evidence/design-system-tidy/task-5-font.md`.
     Recommended task executor category: quick - small, well-defined shape change
     Commit: Y | feat(tokens): split fontFamily for web and native

- [x] 6. Reshape shadow for web + native
     What to do / Must NOT do: change `shadow` to `{ web: <css string>, native: { ios: {shadowOffset,shadowOpacity,shadowRadius,shadowColor}, android: {elevation} } }` in `scales.ts` for sm/md/lg. Update every consumer (`packages/tokens/src/css.ts`, `packages/app/src/theme/index.tsx`) in the same todo, and add `bun run typecheck` to the acceptance criteria. Do NOT keep only the CSS shape.
     Closes: GAP-5
     Parallelization: Wave 1 | Blocked by: 5 | Blocks: 7,8
     References: `packages/tokens/src/scales.ts` (current `shadow`), RN shadow/elevation platform split.
     Acceptance criteria: `bun -e 'import("./packages/tokens/src/scales.ts").then(m=>{if(!m.shadow.md.native.ios||!m.shadow.md.native.android) throw new Error()})'` exits 0.
     QA scenarios: happy - print web string + ios/android objects; failure - confirm no shape is missing a platform. Evidence `.omo/evidence/design-system-tidy/task-6-shadow.md`.
     Recommended task executor category: deep-low - platform-specific RN mapping
     Commit: Y | feat(tokens): reshape shadow for web and native

- [x] 7. Extend the CSS generator and regenerate theme.css
     What to do / Must NOT do: update `packages/tokens/src/css.ts` to emit the new `--color-*` (palette/semantic), `--glass-*`, `--font-*`, `--shadow-*`, motion vars, plus the `@media (prefers-reduced-transparency: reduce)` and `@supports not (backdrop-filter)` fallbacks for glass. Run `bun run --filter @horon/tokens build` to regenerate `theme.css`. Do NOT hand-edit `theme.css`.
     Closes: GAP-1,GAP-2,GAP-3,GAP-4,GAP-5
     Parallelization: Wave 1 | Blocked by: 1-6 | Blocks: 8,13,16-24
     References: `packages/tokens/src/css.ts`, `packages/tokens/theme.css`, SYNTHESIS F9 (mandatory fallbacks).
     Acceptance criteria: `bun run --filter @horon/tokens build` exits 0; `theme.css` contains `--glass-foreground`, a motion var, and a `prefers-reduced-transparency` block.
     QA scenarios: happy - grep the new vars in theme.css; failure - confirm regeneration is deterministic (run twice, no diff). Evidence `.omo/evidence/design-system-tidy/task-7-css.md`.
     Recommended task executor category: deep-low - generator change plus a11y fallbacks
     Commit: Y | feat(tokens): generate glass/motion/font/shadow CSS

- [x] 8. Export the new tokens from the native entry point
     What to do / Must NOT do: update `packages/tokens/src/native.ts` to export a `glass` aggregate object (glass colors as hex + `glass-blur` from scales), `duration` as numbers and `easing` as bezier tuples, `fontFamily.native`, and `shadow.native`, so `@horon/app` can consume them. Do NOT break existing exports.
     Closes: GAP-2,GAP-3,GAP-4,GAP-5
     Parallelization: Wave 1 | Blocked by: 3-6 | Blocks: 12,13
     References: `packages/tokens/src/native.ts`, `packages/app/src/theme/index.tsx`.
     Acceptance criteria: `bun -e 'import("./packages/tokens/src/native.ts").then(m=>{for(const k of ["glass","duration","easing","fontFamily","shadow"]) if(!(k in m)) throw new Error(k)})'` exits 0.
     QA scenarios: happy - print glass hex + duration numbers; failure - confirm app theme still typechecks. Evidence `.omo/evidence/design-system-tidy/task-8-native.md`.
     Recommended task executor category: deep-low - keeps the native consumer contract intact
     Commit: Y | feat(tokens): export glass/motion/font/shadow for native

- [x] 9. Wire the web globals to the new tokens and add glass utilities
     What to do / Must NOT do: ensure `packages/web/src/styles/globals.css` consumes `@horon/tokens/theme.css` and exposes the glass surface utility/classes (`glass`, `glass-strong`) and motion utilities. Do NOT redefine palette values in the CSS (single source is the generator).
     Closes: GAP-2
     Parallelization: Wave 1 | Blocked by: 7 | Blocks: 16-24
     References: `packages/web/src/styles/globals.css`, `packages/tokens/theme.css`.
     Acceptance criteria: `bunx turbo build --filter=@horon/playground` exits 0; globals.css imports theme.css and defines a `.glass` class.
     QA scenarios: happy - build playground and screenshot a glass element; failure - confirm no raw hex palette values re-declared. Evidence `.omo/evidence/design-system-tidy/task-9-webglobals.md`.
     Recommended task executor category: visual-engineering - Tailwind v4 utilities and glass surface styling
     Commit: Y | feat(web): consume glass/motion tokens in globals.css

- [x] 10. Fix the story folder naming drift
      What to do / Must NOT do: rename `apps/storybook/stories/universal` to `apps/storybook/stories/app` and update story titles `Universal/*` to `App/*`. Do NOT change story content.
      Closes: GAP-8
      Parallelization: Wave 2 | Blocked by: - | Blocks: F2
      References: `apps/storybook/stories/universal/*`, `apps/storybook/.storybook/main.ts`.
      Acceptance criteria: no path contains `stories/universal`; `grep -rn "Universal/" apps/storybook/stories` returns nothing.
      QA scenarios: happy - `bun run build:storybook` exits 0 and the App/\* stories appear; failure - confirm no dangling import. Evidence `.omo/evidence/design-system-tidy/task-10-rename.md`.
      Recommended task executor category: quick - folder rename plus title strings
      Commit: Y | chore(storybook): rename universal stories to app

- [x] 11. Clean stray artifacts and settle `.omo` handling
      What to do / Must NOT do: remove tracked build outputs (`apps/playground/dist`, `apps/storybook/storybook-static`) if present; add `.omo/evidence/` to `.gitignore` while keeping `.omo/plans` and `.omo/drafts` tracked; confirm `.gitignore` covers dist/storybook-static/.turbo. Do NOT delete the `.omo/ulw-research` trail.
      Closes: GAP-10
      Parallelization: Wave 2 | Blocked by: - | Blocks: F2
      References: `.gitignore`, repo root.
      Acceptance criteria: `git status --porcelain --ignored | grep -c dist` shows ignored; `.gitignore` has an `.omo/evidence` line.
      QA scenarios: happy - `git status --short` shows no build outputs; failure - confirm `.omo/ulw-research` still present. Evidence `.omo/evidence/design-system-tidy/task-11-artifacts.md`.
      Recommended task executor category: quick - gitignore and artifact cleanup
      Commit: Y | chore: ignore build outputs and evidence

- [x] 12. Add an Expo native app that consumes @horon/app
      What to do / Must NOT do: scaffold `apps/native` (Expo, TypeScript) with a minimal screen rendering `@horon/app` components (Button, Card, Input, Badge, Spinner) under the app theme; wire the monorepo (metro watchFolders); register and LOAD the Geist font file via `expo-font` (or `@expo-google-fonts/geist`) so `fontFamily.native.sans` resolves at runtime. Do NOT duplicate component logic; import from `@horon/app`. Do NOT add an app that can't typecheck.
      Closes: GAP-7
      Parallelization: Wave 2 | Blocked by: 8 | Blocks: F3
      References: `packages/app/src/index.ts`, `packages/app/src/theme/index.tsx`, `packages/tokens/src/native.ts`; Expo docs.
      Acceptance criteria: `bunx tsc --noEmit` in `apps/native` exits 0; the screen imports from `@horon/app`; the app boots in an iOS simulator (`cd apps/native && bunx expo start --ios`) and a NATIVE screenshot is captured; the loaded font family resolves (assert via `Font.isLoaded`/the rendered screen). If no simulator is available, this todo is BLOCKED and reported - it is NOT passed by a token assertion.
      QA scenarios: happy - boot the app in an iOS simulator (`cd apps/native && bunx expo start --ios`) and screenshot the NATIVE screen (not the web export), so the platform shadow/font path is exercised; failure - grep the app for local component reimplementation (none allowed); if no simulator is available, assert the platform token values in a test and record the limitation. Evidence `.omo/evidence/design-system-tidy/task-12-native.md` + simulator screenshot or assertion output.
      Recommended task executor category: deep-low - Expo scaffold plus monorepo metro wiring
      Commit: Y | feat(native): add Expo app consuming @horon/app

- [x] 13. Add the token-drift guard test
      What to do / Must NOT do: add a test that regenerates `theme.css` from source and asserts zero diff (so the generator can never go stale), plus a value-snapshot test for the palette. Add a root `test` script running it. Do NOT weaken or skip.
      Closes: GAP-9
      Parallelization: Wave 2 | Blocked by: 7,8 | Blocks: 14,F1
      References: `packages/tokens/scripts/build.ts`, `packages/tokens/theme.css`.
      Acceptance criteria: `bun test` exits 0; deliberately editing theme.css makes it fail.
      QA scenarios: happy - `bun test` passes; failure - mutate theme.css by one char, confirm the test fails, revert. Evidence `.omo/evidence/design-system-tidy/task-13-guard.md`.
      Recommended task executor category: deep-low - a test that must fail on mutation
      Commit: Y | test(tokens): guard theme.css against drift

- [x] 14. Add minimal CI
      What to do / Must NOT do: add `.github/workflows/ci.yml` running install, lint, typecheck, test, and build on push/PR using Bun. Do NOT add deploy steps.
      Closes: GAP-9
      Parallelization: Wave 2 | Blocked by: 13 | Blocks: F1
      References: repo scripts (`package.json`), turbo tasks.
      Acceptance criteria: `bunx --bun js-yaml .github/workflows/ci.yml` parses the YAML without error; the steps mirror the root scripts; `bun run lint && bun run typecheck && bun test && bun run build` all exit 0 locally.
      QA scenarios: happy - run the four commands locally; failure - confirm the workflow has no secrets/deploy. Evidence `.omo/evidence/design-system-tidy/task-14-ci.md`.
      Recommended task executor category: quick - a single workflow file
      Commit: Y | ci: add lint/typecheck/test/build workflow

- [x] 15. Update the README for the new structure and palette
      What to do / Must NOT do: update `README.md` to describe the canonical tokens, the Horon palette, glass/motion, `apps/native`, and the drift guard. Do NOT document features that do not exist.
      Closes: GAP-11
      Parallelization: Wave 2 | Blocked by: - | Blocks: F2
      References: `README.md`, the finished tokens/components.
      Acceptance criteria: README mentions `apps/native`, the palette, and the guard; commands match `package.json`.
      QA scenarios: happy - every command in README runs; failure - confirm no stale path. Evidence `.omo/evidence/design-system-tidy/task-15-readme.md`.
      Recommended task executor category: writing - documentation prose
      Commit: Y | docs: update README for the canonical token system

- [x] 16. Web form controls: textarea, checkbox, radio-group, switch
      What to do / Must NOT do: vendor/build these into `packages/web/src/components/` on Base UI + Tailwind v4, styled with the new tokens; add stories under `stories/web`. Do NOT edit `packages/web/src/index.ts` - todo 24 owns the barrel. Do NOT restyle with raw hex.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 9 | Blocks: 24
      References: `packages/web/src/components/button.tsx` (pattern), shadcn base registry, `packages/web/src/index.ts`.
      Acceptance criteria: components render in Storybook; `bun run typecheck` passes; each exported from the entry point.
      QA scenarios: happy - screenshot each variant; failure - keyboard/focus and disabled states captured. Evidence `.omo/evidence/design-system-tidy/task-16-web-forms.md`.
      Recommended task executor category: visual-engineering - Base UI components styled with tokens
      Commit: Y | feat(web): add textarea/checkbox/radio-group/switch

- [x] 17. Web overlays: dialog, sheet, tooltip, select
      What to do / Must NOT do: vendor/build these (Base UI dialog/popover/select primitives), glass styling for the floating chrome (dialog/sheet/tooltip/select list), stories (do NOT edit `packages/web/src/index.ts` - todo 24 owns the barrel). Do NOT use glass on content surfaces.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 9 | Blocks: 24
      References: `packages/web/src/styles/globals.css` (glass), shadcn base registry.
      Acceptance criteria: open/close works in Storybook; focus trap + Escape; typecheck passes.
      QA scenarios: happy - open dialog/sheet/select and screenshot; failure - Escape/backdrop-close captured. Evidence `.omo/evidence/design-system-tidy/task-17-web-overlays.md`.
      Recommended task executor category: visual-engineering - overlay chrome with glass styling
      Commit: Y | feat(web): add dialog/sheet/tooltip/select

- [x] 18. Web feedback: progress, skeleton, toast, empty
      What to do / Must NOT do: build these + stories (no entry-point edit; todo 24 owns the barrel). Async feedback is v1 (an agent that looks frozen reads as broken). Do NOT add "soon/later" components.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 9 | Blocks: 24
      References: SYNTHESIS F6 (async feedback = v1).
      Acceptance criteria: render + typecheck; toast is dismissible.
      QA scenarios: happy - screenshot progress/skeleton/toast/empty; failure - toast auto-dismiss + manual dismiss. Evidence `.omo/evidence/design-system-tidy/task-18-web-feedback.md`.
      Recommended task executor category: visual-engineering - async feedback components
      Commit: Y | feat(web): add progress/skeleton/toast/empty

- [x] 19. Web navigation/data: tabs, list, avatar, chip
      What to do / Must NOT do: build these + stories (no entry-point edit; todo 24 owns the barrel). Do NOT build table/chart (later).
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 9 | Blocks: 24
      References: `packages/web/src/index.ts`, shadcn base registry.
      Acceptance criteria: render + typecheck + exported.
      QA scenarios: happy - screenshot tabs/list/avatar/chip; failure - tab keyboard nav captured. Evidence `.omo/evidence/design-system-tidy/task-19-web-nav.md`.
      Recommended task executor category: visual-engineering - navigation and data display
      Commit: Y | feat(web): add tabs/list/avatar/chip

- [ ] 20. App form controls: Textarea, Switch, Checkbox, Radio
      What to do / Must NOT do: build RN versions in `packages/app/src/components/`, using `@horon/tokens/native` values and the existing primitives; do NOT edit `packages/app/src/index.ts` - todo 24 owns the barrel. Do NOT use DOM/CSS.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 8,9 | Blocks: 24
      References: `packages/app/src/components/Input.tsx` (pattern), `packages/app/src/primitives/*`.
      Acceptance criteria: typecheck passes; render via Storybook (react-native-web) or the Expo app.
      QA scenarios: happy - screenshot each in Storybook; failure - disabled/checked states captured. Evidence `.omo/evidence/design-system-tidy/task-20-app-forms.md`.
      Recommended task executor category: deep-low - React Native components on shared tokens
      Commit: Y | feat(app): add Textarea/Switch/Checkbox/Radio

- [ ] 21. App overlays: Dialog, Sheet, Select, Tooltip
      What to do / Must NOT do: RN modal/sheet/select/tooltip using `Modal`/`Pressable` primitives + tokens (no entry-point edit; todo 24 owns the barrel). Do NOT use DOM APIs.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 8,9 | Blocks: 24
      References: `packages/app/src/primitives/Pressable.tsx`, tokens glass.
      Acceptance criteria: typecheck; open/close works.
      QA scenarios: happy - screenshot open dialog/sheet; failure - backdrop/back-button close. Evidence `.omo/evidence/design-system-tidy/task-21-app-overlays.md`.
      Recommended task executor category: deep-low - RN modal/sheet primitives
      Commit: Y | feat(app): add Dialog/Sheet/Select/Tooltip

- [ ] 22. App feedback: Progress, Skeleton, Toast, Empty
      What to do / Must NOT do: build RN versions (no entry-point edit; todo 24 owns the barrel). Do NOT add later-tier components.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 8,9 | Blocks: 24
      References: `packages/app/src/components/Spinner.tsx` (pattern).
      Acceptance criteria: typecheck; render.
      QA scenarios: happy - screenshot progress/skeleton/toast/empty; failure - toast dismiss. Evidence `.omo/evidence/design-system-tidy/task-22-app-feedback.md`.
      Recommended task executor category: deep-low - RN async feedback
      Commit: Y | feat(app): add Progress/Skeleton/Toast/Empty

- [ ] 23. App navigation/data: Tabs, List, Avatar, Chip
      What to do / Must NOT do: build RN versions (no entry-point edit; todo 24 owns the barrel). Do NOT build table/chart.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 8,9 | Blocks: 24
      References: `packages/app/src/index.ts`.
      Acceptance criteria: typecheck; render.
      QA scenarios: happy - screenshot tabs/list/avatar/chip; failure - tab switch state. Evidence `.omo/evidence/design-system-tidy/task-23-app-nav.md`.
      Recommended task executor category: deep-low - RN navigation and data display
      Commit: Y | feat(app): add Tabs/List/Avatar/Chip

- [ ] 24. Export the full v1 set from both entry points and add Storybook coverage
      What to do / Must NOT do: ensure every new component is exported from `packages/web/src/index.ts` and `packages/app/src/index.ts`, and that each has a story. Do NOT leave an unexported component.
      Closes: GAP-6
      Parallelization: Wave 3 | Blocked by: 16-23 | Blocks: F1
      References: both `index.ts` files, `apps/storybook/stories/**`.
      Acceptance criteria: `bun run typecheck && bun run build:storybook` exit 0; a test/script asserts each component file is exported.
      QA scenarios: happy - import every component by name from each entry point; failure - confirm a missing export fails the check. Evidence `.omo/evidence/design-system-tidy/task-24-exports.md`.
      Recommended task executor category: unspecified-low - barrel exports plus story coverage
      Commit: Y | feat: export the v1 component set from both entry points

- [x] 25. Fix the fresh-install storybook build (react-native-web link for @horon/app)
      What to do / Must NOT do: make build:storybook pass from a FRESH install. Root cause: @horon/app does not depend on react-native-web, so a fresh bun install does not link it into packages/app/node_modules; the storybook vite alias (react-native -> react-native-web) then fails to resolve for files under packages/app and react-docgen parses the real (Flow) react-native, failing the build. Fix by making react-native-web resolvable from @horon/app (add it to @horon/app devDependencies and/or an optional peerDependency). Do NOT weaken the alias or globally skip docgen.
      Closes: verification-enabler (no GAP row)
      Parallelization: Wave 2 | Blocked by: 3-6 | Blocks: F2
      References: packages/app/package.json, apps/storybook/.storybook/main.ts (vite alias), packages/app/src/primitives/Text.tsx.
      Acceptance criteria: from the wave1 worktree, `rm -rf packages/app/node_modules && bun install && bun run build:storybook` exits 0.
      QA scenarios: happy - fresh install + build:storybook exit 0; failure - confirm no Flow docgen errors from the real react-native. Evidence .omo/evidence/design-system-tidy/task-25-storybook-build.md.
      Recommended task executor category: quick - dependency/link fix
      Commit: Y | fix(app): make react-native-web resolvable for the storybook build

## Final verification wave

> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.

- [ ] F1. Plan compliance audit
- [ ] F2. Code quality review
- [ ] F3. Real manual QA
- [ ] F4. Ideal-state fidelity

> Review note (known risk): codex-chatgpt-web 계획 검토는 상한(초회+재검토=2회)에 도달했다. 라운드2 FAIL 4건(엔트리 barrel 단일 소유자화, 폰트 파일 로딩, glass 실배경·강등 대비, 네이티브 렌더 필수화)은 반영했으나 3차 codex 검증은 하지 않았다. plan-reviewer 고정밀 리뷰는 라운드1 [OKAY].

## Commit strategy

- Conventional commits per todo, one unit each; no commit bundles unrelated todos.
- Order: tokens (1-9) → hygiene (10-15) → components (16-24) → final fixes.
- Do not commit build outputs; commit the regenerated `theme.css` (it is the shipped artifact).

## Success criteria

> One row per IS row. The plan is complete only when every IS row has a delivering todo and a proving QA scenario; F4 checks the delivered behavior against these rows 1:1, and a shortfall becomes new `- [ ] N.` rows, never a note.

| IS   | Delivering todo(s) | Proving QA scenario                                                                             | Evidence            |
| ---- | ------------------ | ----------------------------------------------------------------------------------------------- | ------------------- |
| IS-1 | 1,2,7,8,9          | regenerate theme.css twice, no diff; app+web derive from the same source                        | task-7, task-9      |
| IS-2 | 1,2                | print light/dark primary(ink)+ring(gold)+sand surfaces                                          | task-2              |
| IS-3 | 3,4,5,6,7,8        | native entry prints glass hex, motion numbers, RN font, per-platform shadow                     | task-3,4,5,6,8      |
| IS-4 | 16-24              | import every v1 component from both entry points; Storybook renders each                        | task-16..24         |
| IS-5 | 10,11,13,14,15     | no naming drift; drift guard fails on mutation; CI green; every README command runs             | task-10,11,13,14,15 |
| IS-6 | 3,7,9              | glass contrast >= 4.5:1 and a prefers-reduced-transparency / no-backdrop-filter fallback exists | task-3, task-7      |
