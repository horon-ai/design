# web-component-parity - Work Plan

## TL;DR (For humans)

**Who this is for and what changes for them:** 사람이든 에이전트든 `@horon/web`을 가져다 화면을 만들 때, 지금은 없는 shadcn/shadcnuikit 컴포넌트를 직접 짜야 했습니다. 작업이 끝나면 아코디언·콤보박스·드롭다운·표·캘린더·차트 같은 표준 컴포넌트가 전부 들어 있어 골라 쓰기만 하면 됩니다.

**What you'll get:** 지금 빠진 49개 컴포넌트가 기존 컴포넌트와 똑같은 규칙(색·모서리·글자·유리)으로 추가됩니다. 각각 스토리북에서 바로 확인할 수 있습니다.

**Why this approach:** 새 컴포넌트마다 그 컴포넌트가 쓰는 표준 라이브러리(캘린더는 date-picker, 표는 TanStack 등)를 붙이고, 색·모서리·유리는 이미 있는 디자인 토큰만 씁니다. 그래서 컴포넌트가 늘어도 화면이 제각각이 되지 않습니다.

**What it will NOT do:** 페이지 섹션 블록(히어로·가격표 등)은 넣지 않습니다. 기존 26개 컴포넌트를 다시 디자인하지 않습니다. 네이티브(앱) 쪽은 건드리지 않습니다.

**Effort:** XL
**Risk:** Medium - 컴포넌트 수가 많고 외부 라이브러리 10개를 새로 붙입니다.
**Decisions to sanity-check:** sonner를 기존 toast와 별도로 추가, 무거운 것(data-table·chart·sidebar·resizable·carousel·calendar·date-picker)까지 전부 포함.

Your next move: codex-chatgpt-web 검토에서 FAIL 0을 확인한 뒤 `/ulw-execute --ship`. Full execution detail follows below.

---

> TL;DR (machine): XL, medium risk. Add 49 missing shadcn/shadcnuikit components to @horon/web (17 Base UI + 23 markup + 9 external-lib), each with barrel export + story, styled with existing tokens; gates green.

## Scope

### Affected user and ideal state
**Affected user:** a web developer (and an agent) consuming `@horon/web` who expects the shadcn/shadcnuikit component vocabulary to exist; and the Storybook reviewer who inspects each component.

| Row | Statement | Reason |
| --- | --- | --- |
| IS-1 | Every base shadcn/ui component and every shadcnuikit component category exists in `@horon/web`, importable from the barrel and subpath. | A missing component forces a consumer to hand-roll it and drift from the design system. |
| IS-2 | Every added component uses only the canvas-derived tokens/utilities (no raw hex/rgb), matching the existing radius/typography/color/glass rules. | A hardcoded color or radius breaks the single-source design system. |
| IS-3 | Every component has a Storybook story under `Web/<Pascal>` and passes `apps/storybook/test/exports.test.ts`. | The repo's own gate; without it the component is unverifiable. |
| IS-4 | Every floating component (menu, popover, dialog, sheet, toast, drawer, hover card, command) reuses `.glass-strong`/`.liquid-glass`, not a new surface. | Consistency with the canvas floating-chrome rule. |
| IS-5 | The whole set typechecks, lints, builds Storybook, and renders without error. | A half-added set is worse than none. |

| Row | Statement | Reason | Closed by |
| --- | --- | --- | --- |
| GAP-1 | 49 components missing from web (union of base shadcn/ui 61 + shadcnuikit 52 + canvas 05 Cases 50, minus the existing 26). | The user asked for "빠진거 싹다". | todos 2-50 |
| GAP-2 | External libraries not installed. | calendar/date-picker/carousel/chart/command/data-table/resizable/sonner/input-otp need them. | todo 1 |
| GAP-3 | No story/barrel entry for the missing components. | exports.test.ts fails without them. | todos 2-50 (each carries both) |


### Canvas 05 Cases coverage (proof the 49 close every canvas case)
The canvas `05 Cases` board lists 50 categories; 19 already map to existing components, and the 31 below are closed by this plan's todos.

| Canvas case | Closed by | Canvas case | Closed by |
| --- | --- | --- | --- |
| Button group | 24 ButtonGroup | Accordion | 2 Accordion |
| Field | 10 Field | Breadcrumb | 22 Breadcrumb |
| Item | 29 Item | Pagination | 35 Pagination |
| File upload | 40 FileUpload | Stepper | 38 Stepper |
| Slider | 16 Slider | Navigation menu | 13 NavigationMenu |
| Toggle | 17 Toggle | Collapsible | 5 Collapsible |
| Native select | 34 NativeSelect | Scroll area | 15 ScrollArea |
| Combobox | 6 Combobox | Dropdown menu | 9 DropdownMenu |
| Autocomplete | 4 Autocomplete | Popover | 14 Popover |
| Hover card | 11 HoverCard | Command | 46 Command |
| Context menu | 12 Menubar/7 ContextMenu | Menubar | 12 Menubar |
| Alert dialog | 3 AlertDialog | Drawer | 8 Drawer |
| Table | 39 Table | Data table | 47 DataTable |
| Calendar | 42 Calendar | Carousel | 44 Carousel |
| Code block | 25 CodeBlock | Bubble | 23 Bubble |
| Attachment | 21 Attachment | | |

(Existing already cover: Button, Input, Textarea, Checkbox, Radio group, Switch, Select, Badge, Avatar, Progress, Spinner, Skeleton, Toast, Empty, Tabs, Separator, Tooltip, Sheet, Card.)

### Export-collision guard
Two shadcn items export the same name: `Toaster` exists in both the Base UI `toast` component and the `sonner` component. The plan renames the sonner wrapper's export to `SonnerToaster`. Todo 1 also strengthens `apps/storybook/test/exports.test.ts` with a duplicate-value-export check so a future collision fails the gate instead of silently shadowing.

### Must have
- 49 new component files under `packages/web/src/components/`, each with a barrel export and a Storybook story.
- The 10 third-party libraries the shadcn standard uses for these components.
- `bun run typecheck`, `bun run lint`, `bun test`, `bun run build:storybook` all exit 0.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- shadcnuikit blocks / page sections (/blocks), page builder, templates, examples, illustrations.
- Redesigning the existing 26 components.
- New design tokens beyond what a component needs (chart colors already exist as `--chart-1..5`).
- Any change to `packages/tokens` values.
- Native (`@horon/app`) parity - this plan is web-only.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Per todo: `bun run --filter @horon/web typecheck` and `bun run --filter @horon/web lint` exit 0; the component's story renders in a Storybook build.
- Whole-set gate after all todos: `bun run typecheck && bun run lint && bun test && bun run build:storybook` exit 0, plus `apps/storybook/test/exports.test.ts` green (barrel + named export + story for every component).
- Design-consistency gate: a grep over `packages/web/src/components/` finds zero raw hex/rgb/oklch literals.
- Render gate: every new `Web/*` story is rendered light+dark in a headless browser and screenshotted (reuse the harness pattern from the previous session under `.omo/evidence/ulw/`).

## Execution strategy
- One worktree per wave is unnecessary; the work is one cohesive deliverable, so run in the main worktree with per-file isolation.
- Parallel background workers: split the 49 component todos into disjoint file sets (no two workers touch the same file; the barrel `index.ts` is the one shared file - serialize its edits by having each worker add only its own line via a scripted append, or have the lead own the barrel and apply all lines at integration).
- Waves: Wave 0 (todo 1, deps) -> Wave 1 (todos 2-18, Base UI) -> Wave 2 (todos 19-41, markup) -> Wave 3 (todos 42-50, external libs) -> Final verification wave.
- Every worker prompt must name: the exact component file path, the primitive/lib import, the exact export names, the token-only styling rule, and the three gate commands.

## Todos

- [x] 1. Install the shadcn-standard third-party dependencies for the external-library components
  - References: packages/web/package.json (dependencies block); shadcn docs list react-day-picker + date-fns (calendar/date-picker), embla-carousel-react (carousel), recharts (chart), cmdk (command), @tanstack/react-table (data-table), react-resizable-panels (resizable), sonner (sonner), input-otp (input-otp), and react-hook-form (form, shadcn's Form bridge).
  - Action: add those packages to packages/web/package.json dependencies and run `bun install` at the repo root; strengthen `apps/storybook/test/exports.test.ts` with a duplicate-value-export check (collect every value export name across all component files and assert no name appears twice, so a collision like sonner's `Toaster` vs toast's `Toaster` fails the gate instead of silently shadowing).
  - Acceptance: `bun install` exits 0; every listed package resolves from packages/web; the new duplicate-export assertion is present in exports.test.ts and passes on the current tree.
  - QA (happy): `cd packages/web && bun -e "require.resolve('cmdk'); require.resolve('embla-carousel-react'); require.resolve('recharts'); require.resolve('react-day-picker'); require.resolve('@tanstack/react-table'); require.resolve('react-resizable-panels'); require.resolve('sonner'); require.resolve('input-otp'); require.resolve('react-hook-form'); require.resolve('date-fns')"` exits 0.
  - QA (failure): (a) removing a dep makes the corresponding component import fail typecheck; (b) temporarily adding a second component that exports an existing name (e.g. `Toaster`) makes the strengthened exports test fail with a duplicate-export assertion.
  - Commit: `chore(web): add shadcn-standard component dependencies`.
  - Recommended task executor category: quick - mechanical dependency edit.

- [x] 2. Add the Accordion component on @base-ui/react/accordion
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/accordion"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/accordion.tsx (new); apps/storybook/stories/web/Accordion.stories.tsx (new, title "Web/Accordion"); packages/web/src/index.ts (+1 export line).
  - Exports: Accordion, AccordionItem, AccordionTrigger, AccordionPanel.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Accordion component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 3. Add the AlertDialog component on @base-ui/react/alert-dialog
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/alert-dialog"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/alert-dialog.tsx (new); apps/storybook/stories/web/AlertDialog.stories.tsx (new, title "Web/AlertDialog"); packages/web/src/index.ts (+1 export line).
  - Exports: AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add AlertDialog component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 4. Add the Autocomplete component on @base-ui/react/autocomplete
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/autocomplete"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/autocomplete.tsx (new); apps/storybook/stories/web/Autocomplete.stories.tsx (new, title "Web/Autocomplete"); packages/web/src/index.ts (+1 export line).
  - Exports: Autocomplete, AutocompleteInput, AutocompleteList, AutocompleteItem, AutocompleteEmpty.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Autocomplete component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 5. Add the Collapsible component on @base-ui/react/collapsible
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/collapsible"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/collapsible.tsx (new); apps/storybook/stories/web/Collapsible.stories.tsx (new, title "Web/Collapsible"); packages/web/src/index.ts (+1 export line).
  - Exports: Collapsible, CollapsibleTrigger, CollapsiblePanel.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Collapsible component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 6. Add the Combobox component on @base-ui/react/combobox
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/combobox"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/combobox.tsx (new); apps/storybook/stories/web/Combobox.stories.tsx (new, title "Web/Combobox"); packages/web/src/index.ts (+1 export line).
  - Exports: Combobox, ComboboxInput, ComboboxList, ComboboxItem, ComboboxEmpty, ComboboxChips, ComboboxChip.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Combobox component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 7. Add the ContextMenu component on @base-ui/react/context-menu
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/context-menu"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/context-menu.tsx (new); apps/storybook/stories/web/ContextMenu.stories.tsx (new, title "Web/ContextMenu"); packages/web/src/index.ts (+1 export line).
  - Exports: ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuLabel.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add ContextMenu component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 8. Add the Drawer component on @base-ui/react/drawer
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/drawer"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/drawer.tsx (new); apps/storybook/stories/web/Drawer.stories.tsx (new, title "Web/Drawer"); packages/web/src/index.ts (+1 export line).
  - Exports: Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Drawer component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 9. Add the DropdownMenu component on @base-ui/react/menu
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/menu"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/dropdown-menu.tsx (new); apps/storybook/stories/web/DropdownMenu.stories.tsx (new, title "Web/DropdownMenu"); packages/web/src/index.ts (+1 export line).
  - Exports: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add DropdownMenu component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 10. Add the Field component on @base-ui/react/field
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/field"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/field.tsx (new); apps/storybook/stories/web/Field.stories.tsx (new, title "Web/Field"); packages/web/src/index.ts (+1 export line).
  - Exports: Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Field component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 11. Add the HoverCard component on @base-ui/react/preview-card
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/preview-card"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/hover-card.tsx (new); apps/storybook/stories/web/HoverCard.stories.tsx (new, title "Web/HoverCard"); packages/web/src/index.ts (+1 export line).
  - Exports: HoverCard, HoverCardTrigger, HoverCardContent.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add HoverCard component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 12. Add the Menubar component on @base-ui/react/menubar
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/menubar"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/menubar.tsx (new); apps/storybook/stories/web/Menubar.stories.tsx (new, title "Web/Menubar"); packages/web/src/index.ts (+1 export line).
  - Exports: Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Menubar component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 13. Add the NavigationMenu component on @base-ui/react/navigation-menu
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/navigation-menu"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/navigation-menu.tsx (new); apps/storybook/stories/web/NavigationMenu.stories.tsx (new, title "Web/NavigationMenu"); packages/web/src/index.ts (+1 export line).
  - Exports: NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add NavigationMenu component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 14. Add the Popover component on @base-ui/react/popover
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/popover"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/popover.tsx (new); apps/storybook/stories/web/Popover.stories.tsx (new, title "Web/Popover"); packages/web/src/index.ts (+1 export line).
  - Exports: Popover, PopoverTrigger, PopoverContent, PopoverAnchor.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Popover component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 15. Add the ScrollArea component on @base-ui/react/scroll-area
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/scroll-area"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/scroll-area.tsx (new); apps/storybook/stories/web/ScrollArea.stories.tsx (new, title "Web/ScrollArea"); packages/web/src/index.ts (+1 export line).
  - Exports: ScrollArea, ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaCorner.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add ScrollArea component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 16. Add the Slider component on @base-ui/react/slider
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/slider"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/slider.tsx (new); apps/storybook/stories/web/Slider.stories.tsx (new, title "Web/Slider"); packages/web/src/index.ts (+1 export line).
  - Exports: Slider, SliderTrack, SliderIndicator, SliderThumb, SliderValue.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Slider component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 17. Add the Toggle component on @base-ui/react/toggle
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/toggle"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/toggle.tsx (new); apps/storybook/stories/web/Toggle.stories.tsx (new, title "Web/Toggle"); packages/web/src/index.ts (+1 export line).
  - Exports: Toggle.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add Toggle component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 18. Add the ToggleGroup component on @base-ui/react/toggle-group
  - References: packages/web/src/components/select.tsx and dialog.tsx (primitive-part pattern: `import { X as XPrimitive } from "@base-ui/react/toggle-group"`, one thin function per part with `data-slot`, grouped named export); packages/web/src/components/dialog.tsx ("use client" for interactive, glass-strong popup); apps/storybook/stories/web/Badge.stories.tsx (story shape); packages/web/src/index.ts (barrel, alphabetical).
  - Files: packages/web/src/components/toggle-group.tsx (new); apps/storybook/stories/web/ToggleGroup.stories.tsx (new, title "Web/ToggleGroup"); packages/web/src/index.ts (+1 export line).
  - Exports: ToggleGroup, ToggleGroupItem.
  - Acceptance: the listed named exports exist; every rendered node carries a kebab-case `data-slot`; interactive components start with `"use client"`; styling uses token utilities only (no raw hex/rgb); radius `rounded-md`/`rounded-sm`; floating popups use `glass-strong`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; the story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if the barrel line, a named value export, or the PascalCase story is missing.
  - Commit: `feat(web): add ToggleGroup component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 19. Add the Alert component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/alert.tsx (new); apps/storybook/stories/web/Alert.stories.tsx (new, title "Web/Alert"); packages/web/src/index.ts (+1 export line).
  - Exports: Alert, AlertTitle, AlertDescription.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Alert component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 20. Add the AspectRatio component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/aspect-ratio.tsx (new); apps/storybook/stories/web/AspectRatio.stories.tsx (new, title "Web/AspectRatio"); packages/web/src/index.ts (+1 export line).
  - Exports: AspectRatio.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add AspectRatio component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 21. Add the Attachment component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/attachment.tsx (new); apps/storybook/stories/web/Attachment.stories.tsx (new, title "Web/Attachment"); packages/web/src/index.ts (+1 export line).
  - Exports: Attachment, AttachmentMedia, AttachmentContent, AttachmentTitle, AttachmentDescription, AttachmentActions.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Attachment component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 22. Add the Breadcrumb component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/breadcrumb.tsx (new); apps/storybook/stories/web/Breadcrumb.stories.tsx (new, title "Web/Breadcrumb"); packages/web/src/index.ts (+1 export line).
  - Exports: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Breadcrumb component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 23. Add the Bubble component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/bubble.tsx (new); apps/storybook/stories/web/Bubble.stories.tsx (new, title "Web/Bubble"); packages/web/src/index.ts (+1 export line).
  - Exports: Bubble, BubbleContent, BubbleGroup.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Bubble component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 24. Add the ButtonGroup component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/button-group.tsx (new); apps/storybook/stories/web/ButtonGroup.stories.tsx (new, title "Web/ButtonGroup"); packages/web/src/index.ts (+1 export line).
  - Exports: ButtonGroup, ButtonGroupSeparator, ButtonGroupText.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add ButtonGroup component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 25. Add the CodeBlock component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/code-block.tsx (new); apps/storybook/stories/web/CodeBlock.stories.tsx (new, title "Web/CodeBlock"); packages/web/src/index.ts (+1 export line).
  - Exports: CodeBlock, CodeBlockHeader, CodeBlockContent, CodeBlockCopyButton.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add CodeBlock component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 26. Add the Direction component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/direction.tsx (new); apps/storybook/stories/web/Direction.stories.tsx (new, title "Web/Direction"); packages/web/src/index.ts (+1 export line).
  - Exports: DirectionProvider.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Direction component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 27. Add the Form component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/form.tsx (new); apps/storybook/stories/web/Form.stories.tsx (new, title "Web/Form"); packages/web/src/index.ts (+1 export line).
  - Exports: Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription (react-hook-form bridge).
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Form component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 28. Add the InputGroup component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/input-group.tsx (new); apps/storybook/stories/web/InputGroup.stories.tsx (new, title "Web/InputGroup"); packages/web/src/index.ts (+1 export line).
  - Exports: InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add InputGroup component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 29. Add the Item component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/item.tsx (new); apps/storybook/stories/web/Item.stories.tsx (new, title "Web/Item"); packages/web/src/index.ts (+1 export line).
  - Exports: Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemGroup, ItemSeparator.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Item component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 30. Add the Kbd component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/kbd.tsx (new); apps/storybook/stories/web/Kbd.stories.tsx (new, title "Web/Kbd"); packages/web/src/index.ts (+1 export line).
  - Exports: Kbd, KbdGroup.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Kbd component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 31. Add the Marker component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/marker.tsx (new); apps/storybook/stories/web/Marker.stories.tsx (new, title "Web/Marker"); packages/web/src/index.ts (+1 export line).
  - Exports: Marker, MarkerIcon, MarkerContent.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Marker component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 32. Add the Message component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/message.tsx (new); apps/storybook/stories/web/Message.stories.tsx (new, title "Web/Message"); packages/web/src/index.ts (+1 export line).
  - Exports: Message, MessageAvatar, MessageContent, MessageHeader, MessageFooter.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Message component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 33. Add the MessageScroller component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/message-scroller.tsx (new); apps/storybook/stories/web/MessageScroller.stories.tsx (new, title "Web/MessageScroller"); packages/web/src/index.ts (+1 export line).
  - Exports: MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, MessageScrollerButton.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add MessageScroller component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 34. Add the NativeSelect component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/native-select.tsx (new); apps/storybook/stories/web/NativeSelect.stories.tsx (new, title "Web/NativeSelect"); packages/web/src/index.ts (+1 export line).
  - Exports: NativeSelect.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add NativeSelect component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 35. Add the Pagination component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/pagination.tsx (new); apps/storybook/stories/web/Pagination.stories.tsx (new, title "Web/Pagination"); packages/web/src/index.ts (+1 export line).
  - Exports: Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Pagination component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 36. Add the Questionnaire component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/questionnaire.tsx (new); apps/storybook/stories/web/Questionnaire.stories.tsx (new, title "Web/Questionnaire"); packages/web/src/index.ts (+1 export line).
  - Exports: Questionnaire, QuestionnaireItem, QuestionnaireOptions, QuestionnaireOption, QuestionnaireProgress.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Questionnaire component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 37. Add the Sidebar component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/sidebar.tsx (new); apps/storybook/stories/web/Sidebar.stories.tsx (new, title "Web/Sidebar"); packages/web/src/index.ts (+1 export line).
  - Exports: Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarInset.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Sidebar component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 38. Add the Stepper component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/stepper.tsx (new); apps/storybook/stories/web/Stepper.stories.tsx (new, title "Web/Stepper"); packages/web/src/index.ts (+1 export line).
  - Exports: Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperSeparator.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Stepper component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 39. Add the Table component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/table.tsx (new); apps/storybook/stories/web/Table.stories.tsx (new, title "Web/Table"); packages/web/src/index.ts (+1 export line).
  - Exports: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Table component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 40. Add the FileUpload component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/file-upload.tsx (new); apps/storybook/stories/web/FileUpload.stories.tsx (new, title "Web/FileUpload"); packages/web/src/index.ts (+1 export line).
  - Exports: FileUpload, FileUploadDropzone, FileUploadList, FileUploadItem, FileUploadTrigger.
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add FileUpload component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 41. Add the Typography component (markup/composite)
  - References: packages/web/src/components/card.tsx and list.tsx (multi-part markup pattern, `cn` from "cn", `data-slot` per node); packages/web/src/components/button.tsx (cva variants if needed); apps/storybook/stories/web/Card.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/typography.tsx (new); apps/storybook/stories/web/Typography.stories.tsx (new, title "Web/Typography"); packages/web/src/index.ts (+1 export line).
  - Exports: Typography heading/lead/muted/inline-code/list styles (a prose wrapper).
  - Acceptance: the listed named exports exist; every node has `data-slot`; token utilities only (no raw hex/rgb); radius from theme.css; floating surfaces use `glass-strong`; for `form` use react-hook-form (add to deps if absent) as the shadcn form does.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook`.
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Typography component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 42. Add the Calendar component on react-day-picker + date-fns
  - References: the shadcn Calendar source shape (styled wrapper around react-day-picker + date-fns); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/calendar.tsx (new); apps/storybook/stories/web/Calendar.stories.tsx (new, title "Web/Calendar"); packages/web/src/index.ts (+1 export line).
  - Exports: Calendar.
  - Acceptance: wraps react-day-picker + date-fns with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts react-day-picker + date-fns).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Calendar component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 43. Add the DatePicker component on react-day-picker + @base-ui/react/popover
  - References: the shadcn DatePicker source shape (styled wrapper around react-day-picker + @base-ui/react/popover); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/date-picker.tsx (new); apps/storybook/stories/web/DatePicker.stories.tsx (new, title "Web/DatePicker"); packages/web/src/index.ts (+1 export line).
  - Exports: DatePicker, DateRangePicker.
  - Acceptance: wraps react-day-picker + @base-ui/react/popover with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts react-day-picker + @base-ui/react/popover).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add DatePicker component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 44. Add the Carousel component on embla-carousel-react
  - References: the shadcn Carousel source shape (styled wrapper around embla-carousel-react); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/carousel.tsx (new); apps/storybook/stories/web/Carousel.stories.tsx (new, title "Web/Carousel"); packages/web/src/index.ts (+1 export line).
  - Exports: Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext.
  - Acceptance: wraps embla-carousel-react with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts embla-carousel-react).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Carousel component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 45. Add the Chart component on recharts
  - References: the shadcn Chart source shape (styled wrapper around recharts); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/chart.tsx (new); apps/storybook/stories/web/Chart.stories.tsx (new, title "Web/Chart"); packages/web/src/index.ts (+1 export line).
  - Exports: ChartContainer, ChartTooltip, ChartLegend, ChartTooltipContent.
  - Acceptance: wraps recharts with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts recharts).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Chart component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 46. Add the Command component on cmdk
  - References: the shadcn Command source shape (styled wrapper around cmdk); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/command.tsx (new); apps/storybook/stories/web/Command.stories.tsx (new, title "Web/Command"); packages/web/src/index.ts (+1 export line).
  - Exports: Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut.
  - Acceptance: wraps cmdk with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts cmdk).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Command component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 47. Add the DataTable component on @tanstack/react-table
  - References: the shadcn DataTable source shape (styled wrapper around @tanstack/react-table); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/data-table.tsx (new); apps/storybook/stories/web/DataTable.stories.tsx (new, title "Web/DataTable"); packages/web/src/index.ts (+1 export line).
  - Exports: DataTable (column defs, sorting, filtering, pagination, row selection, column visibility).
  - Acceptance: wraps @tanstack/react-table with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts @tanstack/react-table).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add DataTable component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 48. Add the Resizable component on react-resizable-panels
  - References: the shadcn Resizable source shape (styled wrapper around react-resizable-panels); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/resizable.tsx (new); apps/storybook/stories/web/Resizable.stories.tsx (new, title "Web/Resizable"); packages/web/src/index.ts (+1 export line).
  - Exports: ResizablePanelGroup, ResizablePanel, ResizableHandle.
  - Acceptance: wraps react-resizable-panels with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts react-resizable-panels).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Resizable component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 49. Add the Sonner component on sonner
  - References: the shadcn Sonner source shape (styled wrapper around sonner); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/sonner.tsx (new); apps/storybook/stories/web/Sonner.stories.tsx (new, title "Web/Sonner"); packages/web/src/index.ts (+1 export line).
  - Exports: SonnerToaster (NOT `Toaster` - that name is already exported by toast.tsx:219; the sonner wrapper must use a distinct name to avoid a duplicate value export).
  - Acceptance: wraps sonner with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts sonner).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add Sonner component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

- [x] 50. Add the InputOtp component on input-otp
  - References: the shadcn InputOtp source shape (styled wrapper around input-otp); packages/web/src/components/select.tsx (popup/portal pattern); packages/tokens/theme.css (`--chart-1..5` exist for chart); apps/storybook/stories/web/Select.stories.tsx (story shape); packages/web/src/index.ts (barrel).
  - Files: packages/web/src/components/input-otp.tsx (new); apps/storybook/stories/web/InputOtp.stories.tsx (new, title "Web/InputOtp"); packages/web/src/index.ts (+1 export line).
  - Exports: InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator.
  - Acceptance: wraps input-otp with token utilities only (no raw hex/rgb); every node has `data-slot`; floating popups use `glass-strong`; for `chart` map the recharts theme to `--chart-1..5`.
  - QA (happy): `bun run typecheck && bun run lint` exit 0; story renders in `bun run build:storybook` (interactive story actually mounts input-otp).
  - QA (failure): `bun test apps/storybook/test/exports.test.ts` fails if barrel/story/export missing.
  - Commit: `feat(web): add InputOtp component`.
  - Recommended task executor category: visual-engineering - new UI component matching house style.

## Final verification wave
- [x] F1. Plan compliance audit - every GAP row closed, every todo's file exists, barrel+story present for all 49, no scope creep. (Recommended task executor category: unspecified-high)
- [x] F2. Code quality review - read every new component: data-slot present, "use client" only where interactive, cva where variants exist, token utilities only, glass on floating surfaces. (Recommended task executor category: unspecified-high)
- [x] F3. Real manual QA - build Storybook, serve it, render every new Web/* story in light and dark, screenshot; for floating components (menu, dropdown, popover, dialog, alert-dialog, drawer, sheet, command, combobox, context-menu, menubar, hover-card) actually OPEN the popup and screenshot it; exercise one keyboard path (focus + arrow/enter) and one error state (aria-invalid / disabled); confirm no console error and no layout break. (Recommended task executor category: visual-engineering)
- [x] F4. Ideal-state fidelity - map every IS row to delivered evidence 1:1; any shortfall becomes a new `- [ ] N.` row, never a note. (Recommended task executor category: unspecified-high)

## Commit strategy
- One commit per component todo (message `feat(web): add <Name> component`), plus `chore(web): add shadcn-standard component dependencies` for todo 1.
- Commit each component only after its typecheck+lint pass; never carry verified units into a later omnibus commit.
- Final: a merge/summary commit only if the plan is executed on a branch.

## Success criteria

| IS row | Delivering todo(s) | Proving QA scenario | Evidence path |
| --- | --- | --- | --- |
| IS-1 | 1-50 | `bun test apps/storybook/test/exports.test.ts` green + every component importable from the barrel | `.omo/evidence/ulw/<sid>/F1/*` |
| IS-2 | 2-50 | grep finds zero raw hex/rgb/oklch in `packages/web/src/components/` | `.omo/evidence/ulw/<sid>/F2/raw-color-scan.log` |
| IS-3 | 2-50 | exports test green; every story present | `.omo/evidence/ulw/<sid>/F1/exports-test.log` |
| IS-4 | 2-50 | F3 render shows floating components on glass-strong; grep shows no new surface class | `.omo/evidence/ulw/<sid>/F3/shots/*` |
| IS-5 | 1-50 | `bun run typecheck && bun run lint && bun test && bun run build:storybook` exit 0 | `.omo/evidence/ulw/<sid>/F3/gates.log` |
