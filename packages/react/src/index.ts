/**
 * Horon Design System for React.
 *
 * The package holds the 84 Horon components ported from the Figma `Horon` file. Behaviour and
 * accessibility come from Base UI (`@base-ui/react`); layout and colour come from Tailwind CSS v4
 * utilities whose values are the `@horon-ai/tokens` variables, so class names such as `text-label-md`
 * or `bg-glass-regular` are the design tokens themselves. TypeScript source ships as-is, with no
 * build output, so the consuming bundler compiles it.
 *
 * Import everything from the barrel, or one component from its subpath:
 *
 * - `import { Button, Card, Input } from "@horon-ai/react"` re-exports every component and its prop types.
 * - `import { Button } from "@horon-ai/react/components/button"` resolves to the same source file
 *   through the `./components/*` export map, which keeps a bundle to the components it uses.
 * - `import { cn } from "@horon-ai/react"` is the tailwind-merge helper that understands the token
 *   names, so a caller class overrides a component default.
 * - `import { mountCursorGhost } ...` / `import "@horon-ai/react/cursor-ghost"` adds the desktop
 *   cursor trail outside React.
 * - `import { usePlatform, useDevice, useHotkey } from "@horon-ai/react"` reads the OS, the browser or
 *   desktop shell and the input device, and binds a `Mod+K`-style shortcut. The hooks are barrel-only,
 *   with no subpath, and the same `lib/platform` helpers (`formatShortcut`, `matchesShortcut`, `isModKey`)
 *   are exported so a caller's shortcut draws and matches the keys the components use.
 *
 * Import `@horon-ai/react/globals.css` once in the app entry stylesheet: it brings in Tailwind CSS v4,
 * Pretendard, Geist Mono, the generated token theme and the liquid-glass layer styles. Add an `@source`
 * line beside it that points at the package `src` folder so Tailwind scans the component sources (see
 * the README for the exact line). Then set `class="dark"` on an ancestor for the dark palette, and
 * `data-platform="desktop"` or `data-platform="mobile"` to switch the typography board.
 *
 * @packageDocumentation
 */
export * from "./components/agent-activity";
export * from "./components/agent-lane";
export * from "./components/agent-lanes-timeline";
export * from "./components/agent-panel";
export * from "./components/agent-steering-panel";
export * from "./components/approval-card";
export * from "./components/avatar";
export * from "./components/badge";
export * from "./components/banner";
export * from "./components/bot-instructions-panel";
export * from "./components/bot-list-row";
export * from "./components/bot-memory-panel";
export * from "./components/bottom-sheet";
export * from "./components/breadcrumb";
export * from "./components/breadcrumb-header";
export * from "./components/button";
export * from "./components/calendar";
export * from "./components/card";
export * from "./components/chat-bubble";
export * from "./components/chat-controls";
export * from "./components/checkbox";
export * from "./components/chip";
export * from "./components/choice-card";
export * from "./components/code-panel";
export * from "./components/command-palette";
export * from "./components/combobox";
export * from "./components/composer";
export * from "./components/data-table";
export * from "./components/date-field";
export * from "./components/dialog";
export * from "./components/directory-card";
export * from "./components/document-extract-panel";
export * from "./components/empty-state";
export * from "./components/field";
export * from "./components/file-drop";
export * from "./components/filter-bar";
export * from "./components/flue-background";
export * from "./components/horon-icon";
export * from "./components/horon-wordmark";
export * from "./components/icon-button";
export * from "./components/input";
export * from "./components/input-group";
export * from "./components/integration-row";
export * from "./components/kbd";
export * from "./components/knowledge-base-panel";
export * from "./components/liquid-glass";
export * from "./components/list-detail";
export * from "./components/marketplace-card";
export * from "./components/mcp-server-row";
export * from "./components/menu";
export * from "./components/modal";
export * from "./components/message-extras";
export * from "./components/orchestrator-panel";
export * from "./components/page-header";
export * from "./components/plan-card";
export * from "./components/plan-step";
export * from "./components/plugin-row";
export * from "./components/progress";
export * from "./components/radio-group";
export * from "./components/research-run-panel";
export * from "./components/schedule";
export * from "./components/segmented-control";
export * from "./components/select";
export * from "./components/settings-list";
export * from "./components/slider";
export * from "./components/sidebar";
export * from "./components/skeleton";
export * from "./components/source-row";
export * from "./components/spinner";
export * from "./components/split-button";
export * from "./components/switch";
export * from "./components/tab-bar";
export * from "./components/tabs";
export * from "./components/task-row";
export * from "./components/textarea";
export * from "./components/textarea-field";
export * from "./components/toast";
export * from "./components/tool-call";
export * from "./components/tool-calls-header";
export * from "./components/tool-permissions";
export * from "./components/tooltip";
export * from "./components/top-bar";
export * from "./components/usage-meter";
export * from "./components/workspace-menu";
export * from "./hooks";
export { cn, type ClassValue } from "./lib/cn";
export { mountCursorGhost, type CursorGhostOptions } from "./lib/cursor-ghost";
export {
  detectOs,
  detectRuntime,
  formatShortcut,
  isModKey,
  matchesShortcut,
  type Os,
  type PlatformInput,
  type Runtime,
  type RuntimeWindow,
  type ShortcutEvent,
} from "./lib/platform";
