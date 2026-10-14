---
slug: web-component-parity
status: plan-written-review-in-progress
intent: clear
review_required: true
plan_path: .omo/plans/web-component-parity.md
plan_sha256: 1cb21b69ecf0bae79b156528867b5839f407a35aef63decf852ebde5dfb1206e
review_round_id: round-3
review_round_limit: 5
pending-action: await plan-reviewer + codex review; fix until FAIL 0; then /ulw-execute --ship
review:
  plan_reviewer:
    status: in_flight
    workspace_root: null
    runtime_home: null
    target: .omo/plans/web-component-parity.md
    round_id: null
    plan_sha256: null
    launch_id: null
    session: null
    result: null
approach: Add every missing base shadcn/ui + shadcnuikit component to @horon/web (packages/web), each as a component file + barrel export + Storybook story, styled only with the existing canvas-derived tokens/utilities so the whole set stays design-consistent; install the shadcn-standard third-party libs where the component requires them.
---

# Draft: web-component-parity

## Affected user and ideal state

- Affected users: (1) a web developer consuming `@horon/web` who assembles screens and expects the shadcn/shadcnuikit component vocabulary to exist; (2) an agent/designer generating UI from this library; (3) the Storybook reviewer who inspects every component.
- IS-1 | Every base shadcn/ui component and every shadcnuikit component category exists in `@horon/web`, importable from the barrel and subpath. | reason: the library claims to be the shadcn layer; a missing component forces a consumer to hand-roll it and drift from the design system.
- IS-2 | Every added component uses only the canvas-derived tokens and utilities (no raw hex/rgb), matching the existing radius/typography/color/glass rules. | reason: "디자인 통일성" - a component that hardcodes a color or radius breaks the single-source design system.
- IS-3 | Every component has a Storybook story under `Web/<Pascal>` and passes `apps/storybook/test/exports.test.ts` (barrel + named value export + story). | reason: the repo's own gate; without it the component is unverifiable.
- IS-4 | Every component renders in light and dark and, where it floats (menus, popovers, dialogs, sheets, toasts, drawers, hover cards, command), uses the existing `.glass-strong`/`.liquid-glass` glass, not a new surface. | reason: consistency with the canvas floating-chrome rule.
- IS-5 | The whole set typechecks, lints, builds Storybook, and renders without error. | reason: a half-added set is worse than none.

## Components (topology ledger)

One cohesive deliverable (component parity) with independently-failing sub-items, grouped by dependency:

- C1 | base-UI-backed components (17): accordion, alert-dialog, autocomplete, collapsible, combobox, context-menu, drawer, dropdown-menu, field, hover-card, menubar, navigation-menu, popover, scroll-area, slider, toggle, toggle-group | active
- C2 | markup/composite components, no new dep (22): alert, aspect-ratio, attachment, breadcrumb, bubble, button-group, code-block, direction, form, input-group, item, kbd, marker, message, message-scroller, native-select, pagination, questionnaire, sidebar, stepper, table, typography | active
- C3 | external-library components (9): calendar (react-day-picker), date-picker (calendar+popover), carousel (embla), chart (recharts), command (cmdk), data-table (@tanstack/react-table), resizable (react-resizable-panels), sonner (sonner), input-otp (input-otp) | active
- C4 | dependency + shared infra setup | active

## Open assumptions (announced defaults)

- assumption: how to treat borderline "non-visual" registry items (direction = RTL provider, form = react-hook-form wrapper, typography = styles page, marker/message/message-scroller/questionnaire = new chat primitives) | adopted default: include all of them, because the user said "빠진거 싹다" and "기본 shadcn/ui 뿐만 아니라" | reversible: yes (drop any).
- assumption: which third-party libraries | adopted default: the shadcn-standard set the user approved (react-day-picker+date-fns, embla-carousel-react, recharts, cmdk, @tanstack/react-table, react-resizable-panels, sonner, input-otp) | reversible: yes.
- assumption: sonner vs the existing `toast` | adopted default: keep both (they are distinct shadcn items); sonner is the newer one | reversible: yes.
- assumption: heavy components included | adopted default: include data-table, chart, sidebar, resizable, carousel, calendar, date-picker | reversible: yes.

## Findings (cited - path:lines)

- Existing components: 26 files in `packages/web/src/components/` (avatar…tooltip).
- Canvas `02 Components` masters = 20, all already present in web (verified 2026-10-14 earlier this session).
- Canvas `05 Cases` categories = 50; 31 missing from web.
- shadcnuikit.com/components = 52 component categories (fetched registry.json + /components page); 33 missing from web. shadcnuikit blocks are a separate section (/blocks) - OUT of scope.
- Base shadcn/ui registry = 61 components; union of base + shadcnuikit + canvas05 minus existing = 49 missing (see plan).
- Conventions: components import `@base-ui/react/<primitive>` (aliased XPrimitive) and `cn` from `"cn"`; every node has `data-slot`; cva + `VariantProps` for variants; `"use client"` only for interactive; grouped named `export {}`; barrel `packages/web/src/index.ts` alphabetical `export *`; story `apps/storybook/stories/web/<Pascal>.stories.tsx` title `Web/<Pascal>` (explore report, file:line cited).
- Hard gate: `apps/storybook/test/exports.test.ts:63-93` requires every component file re-exported from the barrel, every named value export importable, and one PascalCase story per component.
- Styling: radius sm 8 / md 12 / lg 14 / xl 20 px; token utilities bg-primary, bg-card, border-input, bg-muted, text-muted-foreground, ring-ring; glass `.glass`/`.glass-strong`/`.liquid-glass` (`packages/web/src/styles/globals.css`).
- Base UI ^1.9.0 provides: accordion, alert-dialog, autocomplete, checkbox, checkbox-group, collapsible, combobox, context-menu, dialog, drawer, field, fieldset, filter-dropdown, form, input, menubar, meter, navigation-menu, number-field, otp-field, popover, preview-card, progress, radio, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, toggle-group, toolbar, tooltip.

## Decisions (with rationale)

- D1: Build each new component on the matching Base UI primitive where one exists; otherwise plain markup; use the shadcn-standard third-party library only where the component requires it (user-approved).
- D2: Style with the existing tokens/utilities only; no new tokens unless a component genuinely needs one (e.g. chart colors already exist as `--chart-1..5`).
- D3: Every component lands with its barrel export + story in the same todo, so the exports test stays green after each todo.
- D4: `sonner` is added alongside the existing Base UI `toast` (distinct shadcn items).
- D5: shadcnuikit "blocks" (hero, pricing, etc.) are OUT of scope - the request names `/components`.

## Scope IN

- 49 missing components across C1/C2/C3, each: component file + barrel export + story + gates green.

## Scope OUT (Must NOT have)

- shadcnuikit blocks / page sections (/blocks), page builder, templates, examples, illustrations.
- Redesigning existing 26 components.
- New design tokens beyond what a component needs (chart colors already exist).
- Any change to `packages/tokens` values (canvas port is done) except adding a token only if a component truly requires it, recorded explicitly.
- Native (@horon/app) parity - this plan is web-only.

## Open questions

- none (dependencies and heavy-inclusion answered by the user).

## Approval gate

status: awaiting-approval

- Operating contract §8: ulw-plan entry auto-passes approval; the user's request already authorized "계획 바로 작성 -> codex 검토 fail 0 -> /ulw-execute 바로 진행".
- Next action: write `.omo/plans/web-component-parity.md`, run plan-reviewer, then codex-chatgpt-web review until 0 FAIL, then `/ulw-execute --ship`.
