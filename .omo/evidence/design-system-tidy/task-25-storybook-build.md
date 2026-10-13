# Task 25 — make `react-native-web` resolvable so a fresh install builds Storybook

Worktree: `/Users/alpox/dev/horon-ai/design-wt/design-system-tidy-t25`
Branch: `ds-tidy-t25`
Date: 2026-10-13

## Problem

From a fresh `bun install`, `bun run build:storybook` FAILED. Root cause: `@horon/app`
did not depend on `react-native-web`, so a fresh install never linked it into
`packages/app/node_modules`. Bun 1.4 installs per-workspace `node_modules`, so
`react-native-web` (declared only by `@horon/storybook`) lived only in
`apps/storybook/node_modules`. The storybook vite alias `react-native -> react-native-web`
then failed to resolve for files under `packages/app`, and `react-docgen` parsed the real
(Flow) `react-native` and threw.

Confirmed pre-fix: `packages/app/node_modules/` had `react-native` but NO `react-native-web`.

## Fix (only source change)

Add `react-native-web` to `@horon/app` devDependencies so a fresh install links it into
`packages/app/node_modules`. No other source file touched — the storybook alias was not
weakened, docgen was not globally skipped, `apps/storybook/.storybook/main.ts` and
`packages/tokens` were not edited.

```diff
diff --git a/packages/app/package.json b/packages/app/package.json
index 4f9dbe1..2cba5e0 100644
--- a/packages/app/package.json
+++ b/packages/app/package.json
@@ -31,6 +31,7 @@
 		"globals": "^17",
 		"react": "^19.3.0",
 		"react-native": "^0.87.1",
+		"react-native-web": "^0.21.4",
 		"typescript": "~6.0.2",
 		"typescript-eslint": "^8"
 	}
```

Lockfile diff is the matching single line in `bun.lock`:

```diff
diff --git a/bun.lock b/bun.lock
@@ -78,6 +78,7 @@
         "globals": "^17",
         "react": "^19.3.0",
         "react-native": "^0.87.1",
+        "react-native-web": "^0.21.4",
         "typescript": "~6.0.2",
         "typescript-eslint": "^8",
       },
```

## Acceptance (run in order)

### 1) Edit `packages/app/package.json`

Applied (diff above).

### 2) Fresh install links `react-native-web` into `packages/app/node_modules`

```
$ rm -rf packages/app/node_modules
react-native-web present after rm? NO

$ bun install
bun install v1.4.2 (744846f84)

Checked 694 installs across 812 packages (no changes) [18.00ms]
[exit=0]
react-native-web present after install? YES
readlink: ../../../node_modules/.bun/react-native-web@0.21.4+6f4b9a1cfb20c0ae/node_modules/react-native-web
```

### 3) `bun run build:storybook` exits 0 (no Flow docgen errors)

```
$ bun run build:storybook
$ turbo build-storybook --filter=@horon/storybook
...
@horon/storybook:build-storybook: ✓ 2365 modules transformed.
@horon/storybook:build-storybook: │  Vite ✓ built in 1.14s
@horon/storybook:build-storybook: ◇  Output directory:
@horon/storybook:build-storybook: │  /Users/alpox/dev/horon-ai/design-wt/design-system-tidy-t25/apps/storybook/storybook-static
@horon/storybook:build-storybook: └  Storybook build completed successfully

 Tasks:    2 successful, 2 total
[exit=0]
```

A direct (turbo-cache-bypassing) `storybook build` in `apps/storybook` was also run to prove a
genuine uncached build: `✓ 2365 modules transformed.` → `Storybook build completed successfully`
→ `[exit=0]`. Log scan for `docgen|Flow|error|Cannot find|Failed` returned no matches (only
benign Vite `MODULE_LEVEL_DIRECTIVE` / `chunk size` warnings and a Node `DEP0205` deprecation).

### 4) `storybook-static/index.json` contains app-layer story ids

The `@horon/app` (React Native → react-native-web) stories are titled `Universal/*`; their ids
are the `universal-*` family (Storybook ids derive from the title, not the package name, so no
id literally begins with `app-`):

```
"id":"universal-button--playground"
"id":"universal-button--sizes"
"id":"universal-button--states"
"id":"universal-button--variants"
"id":"universal-card--default"
"id":"universal-typography--scale"
"id":"universal-typography--tones"
```

Full id set (12 entries): `foundations-tokens--colors`, `foundations-tokens--scales`,
`universal-button--{playground,sizes,states,variants}`, `universal-card--default`,
`universal-typography--{scale,tones}`, `web-button--{playground,variants,with-icon}`.
The 7 `universal-*` ids are the `@horon/app` stories (imports from `@horon/app` in
`stories/universal/*.stories.tsx`) and prove the react-native-web path now builds.

## Adversarial check — only `packages/app/package.json` + lockfile changed

```
$ git status --porcelain
 M bun.lock
 M packages/app/package.json
```

`/Users/alpox/dev/horon-ai/core` and `/Users/alpox/dev/horon-ai/web` were not modified.

## Files

- Changed (source): `packages/app/package.json`
- Changed (lockfile): `bun.lock`
- Evidence: `.omo/evidence/design-system-tidy/task-25-storybook-build.md`
