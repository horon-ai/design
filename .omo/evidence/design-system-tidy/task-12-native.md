# Task 12 — Add an Expo native app that consumes @horon/app

Worktree: `/Users/alpox/dev/horon-ai/design-wt/design-system-tidy-t12`
Branch: `ds-tidy-t12`
Date: 2026-10-13

Goal: scaffold `apps/native` (Expo, TypeScript) with a minimal screen rendering
`@horon/app` components under the app theme, wire the monorepo (metro
`watchFolders`), load the Geist font so `fontFamily.native.sans` resolves at
runtime, and prove a NATIVE iOS render (mandatory gate).

## Commands and outputs

### 1. Install (worktree root)

```
$ bun install
bun install v1.4.2 (744846f84)

Checked 928 installs across 1043 packages (no changes) [23.00ms]
```

exit 0.

### 2. App typecheck

```
$ cd apps/native && bunx tsc --noEmit
```

exit 0, no diagnostics.

### 3. Root typecheck (turbo)

```
$ bun run typecheck
 • Packages in scope: @horon/app, @horon/native, @horon/playground, @horon/storybook, @horon/tokens, @horon/web
 • Running typecheck in 6 packages
@horon/native:typecheck: $ tsc --noEmit
 Tasks:    6 successful, 6 total
 Time:    709ms
```

exit 0, 6/6 packages (including `@horon/native`).

### 4. Native render (mandatory gate)

```
$ cd apps/native && bunx expo start --ios
Expo Autolinking module resolution enabled
Starting Metro Bundler

› Opening exp://192.168.0.37:8082 on iPhone 17 Pro
```

Target simulator: `iPhone 17 Pro` (iOS 26.5, `CFEB0B65-6593-444E-832A-2B6E66F29926`), booted.
Expo Go `57.0.9` installed in the simulator; the app launched through it.

Screenshot captured from the simulator (NATIVE, not a web export):

```
$ xcrun simctl io booted screenshot .omo/evidence/design-system-tidy/screenshots/native-render.png
Detected file type from extension: PNG
Wrote screenshot to: .../.omo/evidence/design-system-tidy/screenshots/native-render.png
```

Screenshot: `.omo/evidence/design-system-tidy/screenshots/native-render.png`

What the screenshot shows (all rendered by `@horon/app` on iOS):
- Header: `Text variant="title"` "Horon Native" + `Badge variant="secondary"` "Expo".
- "Sign in" `Card` with `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`.
- `Input` (Email placeholder), `Button` (default "Continue", outline "Cancel", ghost "Skip"),
  `Spinner` + "Working…", `Badge` variants default/secondary/outline/success/warning/danger,
  footer `Button` size="sm" variant="secondary" "Details" and variant="link" "Learn more".
- "Font check" `Card`: "Geist renders this line (Geist)." and `Font.isLoaded("Geist") = true`.

**Gate verdict: PASSED** — a native simulator screenshot was captured showing
`@horon/app` components under the app theme.

### 5. No local reimplementation

```
$ grep -rn "@horon/app" apps/native --include=*.tsx --include=*.ts --include=*.js
apps/native/App.tsx:28:} from "@horon/app"

$ grep -rnE "export (function|const) (Button|Card|Input|Badge|Spinner|Text|Stack|VStack|HStack)" apps/native
NONE
```

Every component (`Badge, Button, Card, CardContent, CardDescription, CardFooter,
CardHeader, CardTitle, HStack, Input, Spinner, Text, ThemeProvider, VStack,
useTheme`) is imported from `@horon/app`. Nothing is reimplemented locally.

### 6. Font load

`App.tsx` loads the Geist faces with `useFonts` from `@expo-google-fonts/geist`
(`Geist_400Regular`, `Geist_500Medium`, `Geist_600SemiBold`, `Geist_700Bold`) and
registers them under the family `"Geist"`. `fontFamily.native.sans` (from
`@horon/tokens/native`) resolves to `"Geist"`, which is loaded at runtime — the
screenshot prints `Font.isLoaded("Geist") = true` and renders the Geist line.

## Notes

- `metro.config.js` sets `watchFolders` to the workspace root and forces a single
  copy of `react`/`react-native`/`react-dom` to resolve from the app.
- `apps/native/.gitignore` ignores `.expo/`, `ios/`, `android/`, `expo-env.d.ts`.
- A stale `expo start` from the previous worker was holding port 8081 and was
  terminated; the current server runs on 8082.
