---
slug: storybook-overview
status: approved
intent: clear
review_required: true
plan_path: .omo/plans/storybook-overview.md
plan_sha256: b2c273cf677c014a5706f073942aa221ea11f65d91093222231c227753d4687e
review_round_id: r1-2026-10-14
review_round_limit: 5
round_status: plan-reviewer r1 approved (3515f41c); r2 approved (83982e69); a one-line post-approval fix set the current bytes (b2c273cf), covered by direct self-verification
pending-action: none - reviews complete (plan-reviewer approved; codex folded, cap reached); handoff.
review:
  plan_reviewer:
    status: approved
    workspace_root: /Users/alpox/dev/horon-ai/design
    runtime_home: null
    target: .omo/plans/storybook-overview.md
    round_id: r1-2026-10-14
    plan_sha256: 3515f41c10109a31b67d07350de29585313299083d64dd93d51fe150ea13b4de
    launch_id: st_01a13894
    session: st_01a13894
    result: "OKAY (approval) at SHA 3515f41c. Verified every cited path/line; IS-1..IS-5 each map 1:1 to delivering todos + proving QA; no blocking contradiction. Two non-blocking notes: (a) the Button row in Page composition says '6 variants in one row' while Must NOT have says 'one representative state' - the section map is the authority per each todo; (b) the storybook-render-check skill is a memory skill, not a repo file - the procedure is inlined in todo 5 anyway."
    invalidation: "The codex-chatgpt-web plan review (gate 2, run after plan-reviewer) folded eligible findings in two rounds, changing the plan bytes twice (3515f41c -> 73ad9ead -> 83982e69). That invalidates the plan-reviewer approval for the current bytes. plan-reviewer is single-shot in this session (the harness refuses a second round), so per the ulw-plan-authoring skill the changed sections were self-reviewed (see self_review below) and the codex re-review covers them; a fresh plan-reviewer round would require a new ulw-plan session."
  self_review:
    status: done
    scope: "Sections changed after the plan-reviewer approval: Execution strategy waves + dependency matrix, todo 1/2/3/5 wording and QA scenarios, IS-3 row, and the Page composition Select rows."
    method: "Re-read every changed section against the repo: the App Select row and App Select props (packages/app/src/components/Select.tsx:25 defaultOpen false), the App Dialog/Sheet stateful-trigger pattern (apps/storybook/stories/app/Dialog.stories.tsx:44-48, Sheet.stories.tsx:57-61), the web `data-slot` value set (grep of packages/web/src/components), the App layer's absence of `data-slot`, and the build-output path (apps/storybook/storybook-static, single shared dir). Structural grammar re-checked: 5 implementation rows, 4 verifier rows, 5 category lines, headers in template order, all tables column-consistent."
  plan_reviewer_round_2:
    status: approved
    workspace_root: /Users/alpox/dev/horon-ai/design
    runtime_home: null
    target: .omo/plans/storybook-overview.md
    round_id: r2-2026-10-14
    plan_sha256: 83982e69fda29cfde6ee91a9ef9667e61c467592eaf3171c830068fbe13d09d6
    launch_id: st_01a1389e
    session: st_01a1389e
    result: "OKAY (approval). Independently re-verified every cited path/line, the storySort comparator trace (Overview -> Foundations -> App -> Web, within-group order preserved), the 26/21 component counts, the exports.test.ts helpers, and the app Dialog/Sheet demo patterns. One non-blocking correction requested."
    post_approval_fix: "The review's single note identified a value that would make a correct implementation fail QA: data-slot=\"dialog\"/\"sheet\" never appear in the DOM because Base UI's Dialog Root renders no element (only dialog-trigger/sheet-trigger do). Applied the smallest edit: dialog/sheet -> dialog-trigger/sheet-trigger in the required data-slot set (plan SHA 83982e69 -> b2c273cf). Also corrected the App Dialog/Sheet open line refs to Dialog.tsx:13 / Sheet.tsx:16 and made the sidebar header comparison case-insensitive. No scope change; no IS row's proof is weakened. This post-approval edit invalidates r2 for the current bytes; plan-reviewer rounds are exhausted for this session, so the three changed literals were self-verified directly against the repo (grep of packages/web/src/components for the rendered data-slot values; the App component files for the open-prop lines)."
  codex_chatgpt_web:
    round_1:
      status: folded
      findings: "4 FAILs: (1) Select closed vs defaultOpen conflict in the Web section map/todo - eligible, fixed; (2) App Dialog/Sheet 'opening button' under-specified - clarified in round 2; (3) baseline build ran in the same parallel wave as the page builds while build:storybook writes one shared output dir - eligible, fixed by a serial Wave 1 for the baseline plus build serialization; (4) count/bounding-box QA could pass with empty wrappers - eligible, tightened."
      non_blocking: "Per-specimen link to its own story - not required."
    round_2:
      status: cap-reached-findings-folded
    findings: "Round 2 (re-review) PASSed the baseline/build-serialization fix and raised 3 remaining FAILs, all judged eligible and folded: (a) the App layer's Select still said defaultOpen while the App section map says closed -> App Select is now the closed trigger; (b) IS-3 asks for an *opening* button but the App todo delivered a button that opens nothing -> App Dialog/Sheet now render a local useState trigger that actually opens and closes (the existing App/Dialog `DialogDemo` and App/Sheet `SheetDemo` pattern), closed on load; (c) the render assertions could pass on headings alone -> the Web page now asserts a required `data-slot` value set (`button`,`checkbox`,`switch`,`select-trigger`,`tabs`,`progress`,`avatar`,`badge`,`chip`,`input`,`textarea`,`card`,`dialog`,`sheet`,`list`,`menu`,`separator`,`label`,`skeleton`,`spinner`,`empty`,`tooltip-content`) and the App page asserts >=2 non-zero-sized descendants per wrapper (a heading-only wrapper has 1) plus a total element floor, since App components emit no `data-slot`."
    non_blocking: "A per-specimen link to its own story was suggested twice; not required (the sidebar already navigates to each story), so it was not added."
    cap: "The codex-chatgpt-web review cap is two calls (initial + one re-review); both were used. No third call. Post-cap plan changes are covered by self-review of the changed sections (below)."
approach: Add one hand-written "Overview" story per layer (App, Web) that lays out every component of that layer in labelled sections on a single page, put both in a NEW top-level `Overview` group pinned above every other group through parameters.options.storySort, and add a drift-guard test so a new component cannot silently miss the page.
---

# Draft: storybook-overview

## Affected user and ideal state

Affected users (four, and they use the same artifact differently):

- 민열님 and anyone browsing the deployed Storybook (`storybook.horon.ai`) to see what the design system already contains.
- A designer scanning the system for an existing pattern - they read the page visually, so each specimen must carry its component name on screen (the `data-component` attribute is a test hook, not a visible label).
- The design-system maintainer who adds or restyles a component and must keep the inventory honest.
- An engineer implementing a screen, who needs one index of what exists per layer before reaching for a component. (An AI agent is not a distinct user of the rendered page: the machine-readable inventory is `storybook-static/index.json` plus the drift guard, not this React page.)

Today each component lives in its own story under `App/*` and `Web/*`; seeing the whole inventory means opening dozens of stories, and nothing tells you whether the set is complete.

- IS-1 | The Storybook sidebar's first group is `Overview`, and its first item is `App` followed by `Web`; each opens a single page that lays out every component of that layer | the inventory is the thing you reach for first, so it must be the first thing you can click
- IS-2 | Every component of the layer is visible on that page in a representative state, grouped into labelled sections, with its component name visible on screen | a catalog that omits a component, or shows an unnameable specimen, is worse than none because it reads as complete
- IS-3 | Overlay components that cannot sit open on a shared page (Dialog, Sheet) still appear, as a plain trigger button plus a caption | otherwise the page would either cover itself or silently drop those components
- IS-4 | Adding a new component to a layer fails a test until the page names it | prevents silent drift as the system grows (the guard proves the name is present in the page source, not that it renders - rendering is proved by the render QA)
- IS-5 | Existing per-component stories, titles, and the `Foundations` → `App` → `Web` group order are unchanged | nobody's current muscle memory or deep links break
- GAP-1 | No page renders a whole layer's components; the closest thing is `apps/playground/src/App.tsx`, a hand-written showcase in a different app | IS-1, IS-2
- GAP-2 | The sidebar has no ordering configuration, so the new group would land in file-discovery order (not at the top) | IS-1
- GAP-3 | Dialog/Sheet portal a full-screen overlay, so a naive "render everything" page is impossible; the App layer's Dialog/Sheet have no trigger component and require `open` | IS-3
- GAP-4 | `apps/storybook/test/exports.test.ts` checks barrel exports and per-component story coverage, but nothing checks that an inventory page stays complete | IS-4

## Components (topology ledger)

| id  | outcome (one line)                                                      | status | evidence path                                   |
| --- | ----------------------------------------------------------------------- | ------ | ----------------------------------------------- |
| C1  | `Overview/Web` story renders every `@horon/web` component on one page   | active | apps/storybook/stories/overview/Web.stories.tsx |
| C2  | `Overview/App` story renders every `@horon/app` component on one page   | active | apps/storybook/stories/overview/App.stories.tsx |
| C3  | The `Overview` group sits above every other sidebar group               | active | apps/storybook/.storybook/preview.tsx           |
| C4  | A test fails when a component is missing from its layer's overview page | active | apps/storybook/test/exports.test.ts             |

## Open assumptions (announced defaults)

| assumption          | adopted default                                                                                                                                  | rationale                                                                                                                                                                                       | reversible?                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| "맨 위에" placement | RESOLVED (user, 2026-10-14): a new top-level group above everything; titles `Overview/App` and `Overview/Web`                                    |                                                                                                                                                                                                 | the request asks for two pages, one per layer, and the user wants both reachable at the very top of the sidebar; the recommended "first child inside each group" option was declined | yes |
| Gallery depth       | one representative rendering per component, not every variant/state                                                                              | "모든 컴포넌트가 정리되어있는" reads as a curated inventory; the per-component stories already hold the full variant detail                                                                     | yes                                                                                                                                                                                  |
| Drift guard         | add a test asserting the overview page names every component file                                                                                | the repo already enforces export and story coverage in the same test file; without a guard a new component silently never appears                                                               | yes                                                                                                                                                                                  |
| Sidebar config      | add `parameters.options.storySort` to `preview.tsx`, with `order: ['Overview', ['App', 'Web'], 'Foundations', 'App', 'Web']`                     | required to pin the new Overview group above everything; the trailing App/Web entries preserve today's within-group order. Verified by running the installed comparator against the real titles | yes                                                                                                                                                                                  |
| Overlay handling    | Dialog and Sheet render as a trigger plus caption; Menu, Tooltip, Select, Toast render in place (open/inline)                                    | one page cannot hold two full-screen portalled overlays                                                                                                                                         | yes                                                                                                                                                                                  |
| App layer markup    | the App gallery uses plain `div` wrappers for section chrome (it renders through react-native-web) and `@horon/app` primitives for the specimens | matches how existing App stories already mix `div` and RN components                                                                                                                            | yes                                                                                                                                                                                  |

## Findings (cited - path:lines)

- Storybook app root: `apps/storybook`; config `apps/storybook/.storybook/main.ts` (stories globs `../stories/**/*.mdx` and `../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)`); `apps/storybook/.storybook/preview.tsx` has theme decorators and a `parameters` object with no `options.storySort`.
- Story titles in use: `App/<Name>` (21 component stories plus `App/Typography`), `Web/<Name>` (26 component stories plus `Web/Glass`), and `Foundations/Tokens`. Extra non-component story files already exist (`Web/Glass`, `App/Typography`), so adding `Overview.stories.tsx` matches the existing convention.
- Component files: `packages/web/src/components/*.tsx` = 26 files; `packages/app/src/components/*.tsx` = 21 files.
- Overlay render facts: web `Dialog`/`Sheet`/`Select`/`Tooltip` are Base UI roots accepting `defaultOpen` (see `apps/storybook/stories/web/{Dialog,Sheet,Select,Tooltip}.stories.tsx`); web `Toast` needs `<Toaster>` plus `toast.add(...)` (`apps/storybook/stories/web/Toast.stories.tsx`); web `Menu`, `GlassSurface`, `LiquidGlass`, `List`, `Empty`, `Separator`, `Label` are plain elements. App `Dialog`/`Sheet` take a required `open` prop (`packages/app/src/components/Dialog.tsx:18`, `Sheet.tsx:22`); app `Select` and `Tooltip` take `defaultOpen` (`Select.tsx:25`, `Tooltip.tsx:12`); app `Toast` renders inline (`packages/app/src/components/Toast.tsx:31`).
- Coverage test: `apps/storybook/test/exports.test.ts` - `type Layer` (`:12-18`), `layers` (`:20-35`), `listFiles` (`:37`), `withoutExtension` (`:40`), `pascalCase` (`:42`), `files` scan of the components dir only (`:65-66`), `describe` (`:69`), and the four tests at `:70`, `:74`, `:81`, `:92`. The story test asserts `expect(storyFiles).toContain(...)` (`:92-94`). Verified: adding `Overview.stories.tsx` cannot fail any of them - `files` scans only the components dir (`:66`), the story assertion uses `toContain` (`:93`), and the file has no exact-count, reverse-direction, or title-uniqueness assertion. `Overview` titles are unused, so no duplicate-title warning. Note the guard's coverage boundary: it scans only `packages/*/src/components/*.tsx`, so primitives (e.g. `@horon/app`'s `Text`) are outside it.
- Story file counts: `stories/web/` 27 (26 component stories + `Glass.stories.tsx`, which has no matching component), `stories/app/` 22 (21 + `Typography.stories.tsx`), plus `Foundations.stories.tsx`. No `.mdx` files exist under `stories/`.
- Gates: `.github/workflows/ci.yml` runs `bun run lint`, `bun run typecheck`, `bun test`, `bun run build` (`:25`,`:28`,`:31`,`:34`). `apps/storybook/package.json` has no `lint` script and no eslint config, so `turbo lint` skips it. `bun run typecheck` runs `apps/storybook`'s `tsc --noEmit` (tsconfig includes `.storybook`, `stories`, `test`). Storybook static build is `bun run build:storybook` (turbo filter `@horon/storybook`), which CI does NOT run - so a story that throws at render breaks the public deploy, not CI; the plan makes `build:storybook` an explicit acceptance command.
- Integration branch is `dev` (the repo's only branch and default); a `dev` push is the deploy trigger. Repo docs (`README.md:150`, `apps/storybook/wrangler.toml:2`) still name `horon-storybook.pages.dev`; the live custom domain `storybook.horon.ai` returns 200 and is the URL in the deploy memory.
- No browser-automation dependency exists in the repo (no playwright/puppeteer/`@storybook/test`). The render QA uses only Bun builtins (`Bun.WebView`, `Bun.serve`), so the "no new dependencies" guardrail holds.
- Deploy: `dev` push → Cloudflare Pages auto-build (`build_command: bun install && bun run build:storybook`, output `apps/storybook/storybook-static`), live at `storybook.horon.ai`.
- Sidebar order today (empirical): built the static Storybook and read the manager sidebar in a headless WebView - the group order is **FOUNDATIONS → APP → WEB**, and `storybook-static/index.json` lists entries in the same order. There is no `storySort` configured, so the default comparator (`sortStoriesCommon` with `fileNameOrder`) yields file-discovery order.
- **plan-consultant 결과(2026-10-14, 반영 완료):** BLOCKER 6건을 반영했다 — (1) 초안 `approach:`가 폐기된 설계를 서술 → 새 최상위 그룹으로 정정, (2) IS-1이 거절된 안을 그대로 서술 → 최상위 그룹 기준으로 재작성, (3) GAP-2가 "알파벳순"이라 사실과 반대 → 발견 순서로 정정, (4) 디자이너가 쓸 화면에 보이는 컴포넌트 이름 요구 추가(IS-2·페이지 구성), (5) 렌더 QA 씨임(빈 페이지가 통과할 수 없게) 명시, (6) 통합 브랜치가 `dev`임을 Commit strategy에 명시. NOTE 반영: 기준선 `index.json` 캡처를 todo 3에 추가, `exports.test.ts` 인용 줄번호 정정(`:12-18`,`:20-35`,`:37`,`:40`,`:42`,`:65-66`,`:69`,`:70`,`:74`,`:81`,`:92`), `Layer`에 `overviewPath` 필드 추가 필요 명시, App `Text`는 primitive라 마커 제외 명시, App 페이지에 react-native-web 캡션 추가, bounding box 단언 추가, 죽은 `['Overview','*']` 항목 제거.
- **Resolved placement (user, 2026-10-14):** the two pages live in a NEW top-level group above everything - titles `Overview/App` and `Overview/Web` - so the sidebar becomes OVERVIEW (App, Web) → FOUNDATIONS (Tokens) → APP (…) → WEB (…). The recommended alternative (first child inside each of App and Web) was declined.
- `storySort` is applied at index-build time: `apps/storybook/node_modules/storybook/dist/core-server/index.js` `getIndexAndStats()` calls `this.sortStories(indexEntries, getStorySortParameter(previewCode))`, and `sortStories` delegates to `sortStoriesV7`. So editing `preview.tsx` reorders the static `index.json` and therefore the sidebar. The preview also rejects a per-story `storySort` (`checkStorySort`: "The storySort option parameter can only be set globally"), confirming it is read from the global preview parameters.
- `order` semantics (verified by extracting the installed comparator from `storybook/dist/_browser-chunks/chunk-M6YZR3ZW.js` and running it against the real titles): a string names a sibling; the array immediately after a string scopes its children; `'*'` is the wildcard slot for unlisted siblings; an unlisted sibling with no wildcard sorts to the end; and when neither side is listed the default `method: "configure"` returns 0, so within-group order is preserved rather than alphabetized. With `['Overview', ['App', 'Web'], 'Foundations', 'App', 'Web']` the simulated result is exactly `Overview/App, Overview/Web, Foundations/Tokens`, then the existing `App/...` and `Web/...` groups in their current order (verified byte-identical to the longer variant with trailing `['Overview','*']` scopes, which are dead entries now that no `App/Overview` exists).
- No existing whole-layer catalog page: `stories/` has no `.mdx`; `Foundations.stories.tsx` renders tokens only; the largest per-story import is 4 modules (`stories/web/Dialog.stories.tsx`). Building the two pages is not duplicative. The nearest precedent for the page shape is `apps/playground/src/App.tsx`, a hand-written `<section>`-per-topic showcase consuming `@horon/web` - a different app, so it is a style reference only.

## Decisions (with rationale)

0. **Non-blocking review notes (not folded into the plan; the plan file is frozen at the approved SHA).** (a) `## Page composition`'s Button row says "6 variants in one row" while `Must NOT have` says "one representative state" - the section map is the authority each todo defers to. (b) `storybook-render-check` is a memory skill, not a repo file; todo 5 inlines its procedure. Both were judged non-blocking by plan-reviewer and by the convergence contract an edit would invalidate the approved round.

1. One hand-written `.stories.tsx` per layer, titled `Overview/App` and `Overview/Web` - a new top-level `Overview` group placed above `Foundations` - each with a single story (export name `All`). Rejected: an MDX docs page, and an auto page using the Docs `<Stories include>` block — the hand-written page gives a compact curated catalog and full control over the overlay problem, and leaves the existing story/MDX setup untouched.
2. Pin with `parameters.options.storySort = { order: ['Overview', ['App', 'Web'], 'Foundations', 'App', 'Web'] }` in `apps/storybook/.storybook/preview.tsx`. Verified against the installed 10.6.2 comparator and the real titles: this puts the new `Overview` group above `Foundations` with `App` before `Web` inside it, keeps `Foundations → App → Web` for the component groups, and leaves every existing within-group position unchanged.
3. Drift guard added to the existing per-layer `describe` in `apps/storybook/test/exports.test.ts`: assert the layer's overview source contains `data-component="<PascalName>"` for every component file. Reuses the file's existing `pascalCase`, `withoutExtension`, and `files` helpers.
4. Overlay handling on the page: `Dialog` and `Sheet` render a trigger button plus a one-line caption; `Menu`, `Tooltip` (`defaultOpen`), `Select` (`defaultOpen`), and `Toast` (trigger button, since it is manager-based) render in place. Nothing portals a full-screen overlay on the page.
5. App layer page uses plain `div` section wrappers and `@horon/app` primitives (`Stack`, `HStack`, `Text`) for specimens, with fixed widths where the component needs one (List 420, Card 420, Select 260, Tabs, Empty 420), mirroring the existing App stories.

## Scope IN

- `apps/storybook/stories/overview/Web.stories.tsx` (new) — title `Overview/Web`, one story rendering all 26 web components in labelled sections.
- `apps/storybook/stories/overview/App.stories.tsx` (new) — title `Overview/App`, one story rendering all 21 app components in labelled sections.
- `apps/storybook/.storybook/preview.tsx` — add `parameters.options.storySort`.
- `apps/storybook/test/exports.test.ts` — add one drift-guard test per layer.

## Scope OUT (Must NOT have)

- No edits to any file under `packages/web/src` or `packages/app/src`.
- No edits to any existing `*.stories.tsx` file.
- No new dependencies; no change to the Storybook framework, addons, or `main.ts` globs.
- No MDX docs page.
- No removal, rename, or retitle of any existing story or group.
- No reordering of the App / Foundations / Web groups beyond inserting the new `Overview` group above them.

## Page composition (section map, decided)

Each specimen is wrapped in `<div data-component="<PascalName>">` so the drift-guard test can find it. Sections are labelled with a heading; the label text is free, the `data-component` value is exact.

Web page sections (26):

| Section      | Components                                                                           | Representative state                                                                                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons      | Button                                                                               | all six variants in a wrap row                                                                                                                                                                                                                           |
| Forms        | Input, Textarea, Label, Select, Checkbox, RadioGroup, Switch                         | Input default/disabled/invalid; Textarea default/filled; Label + Input pair; Select closed trigger (`defaultValue="apple"`); Checkbox unchecked/checked/indeterminate/disabled; RadioGroup three options with one selected; Switch on/off/small/disabled |
| Data display | Avatar, Badge, Chip, Card, List, Empty, Progress, Skeleton, Spinner, Separator, Tabs | Avatar sizes; Badge variants; Chip variants; Card full; List three rows; Empty with icon+description+action; Progress 60% and indeterminate; Skeleton three lines; Spinner default; Separator horizontal; Tabs three tabs first active                   |
| Overlays     | Dialog, Sheet, Menu, Tooltip, Toast                                                  | Dialog and Sheet as trigger + caption; Menu rendered inline; Tooltip `defaultOpen`; Toast as a trigger button inside `<Toaster>`                                                                                                                         |
| Glass        | GlassSurface, LiquidGlass                                                            | both on a gradient stage so the glass reads                                                                                                                                                                                                              |

App page sections (21 + Typography):

| Section            | Components                                                                | Representative state                                                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons            | Button                                                                    | all six variants                                                                                                                                                                                                  |
| Forms              | Input, Textarea, Checkbox, Switch, Radio, Select                          | Input default/invalid/disabled; Textarea default/filled; Checkbox checked/unchecked/indeterminate/disabled; Switch on/off/disabled; RadioGroup four options one selected; Select closed trigger (value + options) |
| Data display       | Avatar, Badge, Chip, Card, List, Empty, Progress, Skeleton, Spinner, Tabs | Avatar initials; Badge variants; Chip states; Card full; List three rows; Empty with action; Progress 60% with label; Skeleton lines; Spinner with label; Tabs segmented                                          |
| Overlays           | Dialog, Sheet, Tooltip, Toast                                             | Dialog and Sheet as trigger + caption; Tooltip `defaultOpen`; Toast variants rendered inline                                                                                                                      |
| Typography (extra) | Text                                                                      | the variant scale (mirrors `App/Typography`)                                                                                                                                                                      |

## Open questions

None. The placement fork ("맨 위에") was resolved by the user on 2026-10-14: a new top-level group above everything, holding `Overview/App` and `Overview/Web`.

The gallery-depth default (one representative state per component rather than every variant) is announced in the brief and left reversible; the per-component stories keep the full variant detail.

## Approval gate

status: approved
approval: user approved on 2026-10-14; placement fork resolved to a new top-level Overview group (titles `Overview/App`, `Overview/Web`)
approach: Two new hand-written stories (`Overview/App`, `Overview/Web`) each render one layer's full component set in labelled sections; a new top-level `Overview` group is pinned above everything via `storySort`; `exports.test.ts` gains a per-layer drift guard so a new component cannot silently miss its page.
next-workflow-action: scaffold `.omo/plans/storybook-overview.md`, run plan-consultant gap analysis, APPEND the todo batches, fill the human TL;DR, then run the plan-reviewer high-accuracy review (review_required: true).
