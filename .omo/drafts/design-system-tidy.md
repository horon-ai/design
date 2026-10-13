---
slug: design-system-tidy
status: approved-planning
intent: unclear
review_required: true
plan_path: .omo/plans/design-system-tidy.md
plan_sha256: f301f415f7a7607f4421fc400947cdad69d1f7c42a26b1a7bda8a923d1b08371
review_round_id: null
review_round_limit: 5
pending-action: handoff complete - execution starts separately via /ulw-execute design-system-tidy
review:
  plan_reviewer:
    status: round-1-OKAY (round-2 spawn refused by harness plan gate)
    workspace_root: /Users/alpox/dev/horon-ai/design
    runtime_home: null
    target: .omo/plans/design-system-tidy.md
    round_id: r1
    plan_sha256: 58cfb7e7d43183c8c5d4b57bc8aa8b2c3fc2d440917ff16b5ed2b4523e98d751
    launch_id: r1-launch-1
    session: st_01a136e1
    verdict: OKAY
    note_fixed: "IS-1 pen wording softened in the final plan"
    result: "OKAY - executability, references, QA scenarios, and IS fidelity all verified; the one note (IS-1 pen wording) was fixed in the final plan."
  round2:
    status: refused-by-harness
    reason: "plan-reviewer is plan-gated and the gate closed after round 1; spawn denied. Per skill fallback the parent self-reviewed the changed sections directly and recorded this reason."
    plan_sha256: b7d9b9922449a6c2d936121ac69159129b004e10343cccdf8216041eabf93ded
  codex_review:
    round1: "FAIL x4 - native easing spec missing; pen step missing; shared-file parallel conflict; Expo verified via web. Folded."
    round2: "FAIL x4 - web entry-point barrel parallel writers; RN font file not loaded; glass contrast only on a designated backdrop; native render skippable. All 4 folded. codex cap (2) reached, no 3rd pass."
    cap: "reached (initial + 1 re-review = 2)"
approach: "A->C->B. (A) make design/packages/tokens the canonical base - absorb the Horon sand/gold/ink palette, add glass + motion tokens, make fontFamily/shadow RN-consumable, regenerate theme.css; (C) repo hygiene + guardrails - fix story folder naming, clean artifacts, add apps/native (Expo) to prove @horon/app, add a token-drift guard + test script + minimal CI, accurate README; (B) fill the v1 component set into @horon/web and @horon/app, exported from the entry points."
---

# Draft: design-system-tidy

## Affected user and ideal state

People this output touches (each uses it today and after):

- **민열님 (design-system author)** - builds components here; after: builds on one correct token base with no rework.
- **Web app developer** consuming `@horon/web` - after: correct Horon palette + a real v1 component set importable from `@horon/web`.
- **Native app developer** consuming `@horon/app` - after: RN-usable tokens (hex color, RN font family, per-platform shadow) + components.
- **Downstream agents / pen canvas** consuming the token vocabulary - after: one shared vocabulary (sand/gold/glass/motion) instead of 4 parallel sets.

IS-1 | One canonical token source; web, app, and pen all derive from it; a palette change propagates everywhere | reason: the research's #1 blocker is 4 parallel token systems with no source of truth (.omo/ulw-research/20261014-041133/SYNTHESIS.md F5)
IS-2 | The palette is the decided Horon one (sand monochrome backbone + gold accent + ink primary), light + dark | reason: tokens.ts is currently a shadcn neutral placeholder, primary ~#171717 near-black, no brand color
IS-3 | Tokens are RN-complete: color as hex, fontFamily as an RN family, shadow as per-platform, plus motion + glass tokens | reason: fontFamily/shadow are CSS-shaped today and there are no motion/glass tokens
IS-4 | The library exposes the v1 component set from the single web and app entry points | reason: ~44 of ~50 categories are unimplemented (web=6, app=5)
IS-5 | The repo is clean and drift-proof: no naming drift, no stray artifacts, accurate README, and a guard that fails on token drift | reason: "손봐야 할 곳" includes hygiene

GAP-1 | tokens.ts holds a neutral placeholder palette, not the Horon sand/gold/ink palette | reason: this design system's whole point is the Horon look | closed by: (pending)
GAP-2 | No glass tokens exist anywhere (grep for glass returns only pen `_render.js` constants) | reason: glass is decided as a chrome variant and must own `--glass-foreground` (SYNTHESIS F3) | closed by: (pending)
GAP-3 | No motion tokens in design (core has DURATION/EASING) | reason: components need consistent timing/easing | closed by: (pending)
GAP-4 | `fontFamily.sans` is a CSS stack string (`'Geist Variable', ui-sans-serif, ...`) - unusable in RN | reason: RN needs a single family name with a bundled font file | closed by: (pending)
GAP-5 | `shadow` is `{x,y,blur,spread,opacity,color}` - CSS-shaped, not RN (iOS shadowOffset/Opacity/Radius vs Android elevation) | reason: RN cannot consume the current shape | closed by: (pending)
GAP-6 | ~44 of ~50 component categories unimplemented (@horon/web=6, @horon/app=5+primitives) | reason: a library you cannot build with is not yet useful | closed by: (pending)
GAP-7 | No `apps/native`; the RN side has no app to prove `@horon/app` | reason: README foreshadows it; RN support is unproven end-to-end | closed by: (pending)
GAP-8 | Story folders are named `universal` while the package is now `@horon/app` | reason: naming drift after the rename | closed by: (pending)
GAP-9 | No guard/CI preventing `tokens.ts` -> `theme.css` drift; no test script at the root | reason: the generator can silently go stale | closed by: (pending)

## Components (topology ledger)

- C1 tokens-canonical | design/packages/tokens is the one source; Horon palette (sand+gold+ink) absorbed; theme.css regenerated | active | packages/tokens/src/tokens.ts
- C2 tokens-native-complete | glass + motion tokens added; fontFamily + shadow made RN-consumable | active | packages/tokens/src/scales.ts
- C3 web-components | v1 set vendored/built into @horon/web, exported from the entry point | active | packages/web/src/index.ts
- C4 app-components | v1 set built into @horon/app, exported from the entry point | active | packages/app/src/index.ts
- C5 native-app | apps/native (Expo) consumes @horon/app and proves RN rendering | active | apps/ (absent)
- C6 repo-hygiene | naming drift fixed, artifacts cleaned, README accurate, drift guard added | active | repo root

## Open assumptions (announced defaults)

Confirmed by the examples-first round: user chose the full A->C->B scope.

- A1 | design/packages/tokens is the canonical token base for THIS monorepo (web/app/storybook/playground/pen); core/packages/tokens stays read-only and is NOT absorbed | rationale: least churn; core values are pinned by its own tests so cross-repo sync is out of scope (separate decision) | reversible: yes
- A2 | Palette source = the decided Horon palette (sand monochrome backbone + gold accent + ink primary), values read from core/packages/tokens (sand ramps) and horon-ai/web globals (gold #e0921f) and the pen canvas vars, then encoded into design tokens | rationale: the design decision is already recorded in memory; those repos are read-only sources | reversible: yes
- A3 | glass tokens: --glass-fill, --glass-fill-strong, --glass-border, --glass-foreground, plus a degradation ladder (glass->frost->solid) | rationale: glass is a chrome variant and must own its foreground (SYNTHESIS F3) | reversible: yes
- A4 | motion tokens: duration + easing scale, mirroring core DURATION/EASING | rationale: components need consistent timing; design has none today | reversible: yes
- A5 | fontFamily splits into fontFamily.web (CSS stack) and fontFamily.native (RN family name); the font file is bundled in apps/native via expo-font | rationale: one string cannot serve both | reversible: yes
- A6 | shadow exposes a CSS shadow string (web) and per-platform RN objects (iOS shadowOffset/Opacity/Radius, Android elevation) | rationale: RN cannot consume the current CSS shape | reversible: yes
- A7 | v1 component list = Composer/Textarea, List, Avatar, Progress, Skeleton, Toast, Empty, Tabs, Dialog, Sheet, Select, Switch, Checkbox, Radio, Tooltip, Chip (F6 v1 plus checkbox/radio) | rationale: product-first order backed by uibowl counts | reversible: yes
- A8 | apps/native = Expo (official RN framework) consuming @horon/app | rationale: proves RN end-to-end; Expo is the research-recommended framework | reversible: yes
- A9 | token-drift guard = a test that regenerates theme.css and asserts no diff, wired to a root test script + minimal CI | rationale: the generator can silently go stale | reversible: yes
- A10 | keep the .omo/ research trail in the repo; do not delete it | rationale: it is the design record | reversible: yes

## Findings (cited - path:lines)

- packages/tokens/src/tokens.ts - neutral shadcn palette; `--primary: oklch(0.205 0 0)` (~#171717); success/warning present; no brand color; no glass.
- packages/tokens/src/scales.ts - `fontFamily.sans` is a CSS stack string; `shadow` is `{x,y,blur,spread,opacity,color}`; no motion; no glass.
- packages/web/src/styles/globals.css - imports `@horon/tokens/theme.css` (already wired to tokens).
- packages/web/src/components - 6 files (badge, button, card, input, label, separator). packages/app/src/components - 5 (badge, button, card, input, spinner) + primitives.
- apps/storybook/stories/{universal,web,Foundations} - `universal` folder name drifts from `@horon/app`.
- .gitignore - ignores dist/, storybook-static/, .turbo/; `.omo/` is NOT ignored (research/loop artifacts would be committed).
- README.md - states no native app yet.
- .omo/ulw-research/20261014-041133/SYNTHESIS.md - 4 token systems (F5); glass-as-chrome rule + `--glass-foreground` (F3,F8,F9); v1 build order (F6); stack Base UI->shadcn->tokens (F7).
- .omo/ulw-loop/01a13655-75d5-7539-bfd5-26687001158d/brief.md - pen canvas: 98 vars, sand+gold+glass, 0 reusable components.

## Decisions (with rationale)

- Scope = A->C->B (user-chosen in the examples-first round).
- Canonical base = design/packages/tokens (least churn; already the import target).
- Palette = decided Horon palette; exact values pulled read-only from core/packages/tokens + horon-ai/web globals + pen canvas, then encoded here.
- glass is a chrome variant only; it carries its own --glass-foreground.
- RN completeness (font/shadow/motion) is in scope now, not deferred.

## Scope IN

- (A) tokens: Horon palette, glass tokens, motion tokens, RN-consumable fontFamily + shadow, regenerated theme.css, web globals consuming it.
- (C) hygiene: story folder naming, artifact/.omo handling, apps/native (Expo), token-drift guard + test script + minimal CI, README accuracy.
- (B) components: the v1 set in @horon/web (Base UI) and @horon/app (RN), exported from the entry points.

## Scope OUT (Must NOT have)

- Must NOT re-palette the pen canvas or edit other repos (`/Users/alpox/dev/horon-ai/core`, `/horon-ai/web`).
- Must NOT change the web<->app import boundary (already enforced).
- Must NOT reduce the ideal state to a "phase 1" subset silently.

## Open questions

- (examples-first round) Which candidate scope is closest?

## Plan consultant findings (folded)

Ran one plan-consultant gap analysis (2026-10-14). Folded fixes:

- BLOCKER: IS-1 was unreachable under the core-immutable constraint -> narrowed IS-1 to the design monorepo + pen; core sync recorded as out of scope (a separate decision).
- BLOCKER: palette must be OKLCH (the pipeline throws on hex) -> T1 now converts core hex ramps to OKLCH and asserts `parseOklch`.
- BLOCKER: fontFamily/shadow shape change broke consumers -> T5/T6 now update `Text.tsx`, `theme/index.tsx`, `css.ts` and add `bun run typecheck`.
- NOTE: GAP-6 reworded to the v1 subset; GAP-10 (artifacts) and GAP-11 (README) added so todos 11/15 map correctly.
- NOTE: `glass-blur` moved to `scales.ts`; T3 QA now computes WCAG contrast; IS-6 added for accessibility.
- NOTE: T8 now defines the `glass` aggregate object; T2 AC strengthened; matrix rows 1/2 no longer claim 12; T12/T14 got exact commands.

## Approval gate

status: approved (user approved 2026-10-14, review included); plan written; plan-consultant folded; plan-reviewer round r1 dispatched.

<!-- When exploration is exhausted and unknowns are answered, set status: awaiting-approval. -->
<!-- That durable record is the loop guard: on a later turn read it and resume at the gate instead of re-running exploration. -->
