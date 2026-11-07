/**
 * The host data the gallery passes through `<lynx-view>`'s `globalProps`.
 *
 * Lynx documents `lynx.__globalProps` as an interface each app extends itself,
 * so this is where the fields this package reads are named: the demo to open, the
 * scheme and platform switches, and the runtime hints `detectOs`/`detectRuntime`
 * consult. Every field is optional because a native host may pass none.
 */
import type { SystemInfo as LynxSystemInfo } from "@lynx-js/types";

declare module "@lynx-js/types" {
  interface GlobalProps {
    /** Gallery: the slug to open on first paint. */
    demo?: string;
    /** Gallery: `light` or `dark`, which `scheme="system"` resolves to. */
    scheme?: string;
    /** Gallery: `web`, `desktop` or `mobile`, the type board to start on. */
    platform?: string;
    /** Host: `lynx-web` for the browser engine; anything else is a native shell. */
    runtime?: string;
    /** Host: an explicit OS name, which wins over `SystemInfo.platform`. */
    os?: string;
  }
}

/** Keeps the import in use so this file stays a module; the augmentation above needs one. */
export type LynxSystemInfoShape = LynxSystemInfo;
