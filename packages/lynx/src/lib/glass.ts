import { detectOs, detectRuntime, readNavigator } from "./platform";

/**
 * Whether this host can filter the backdrop through `<blur-view>`.
 *
 * Lynx 4.0 ships the element for iOS, Android, HarmonyOS and the web engine,
 * where it becomes a CSS `backdrop-filter`. The Clay renderer behind the desktop
 * shells (macOS, Windows) has no `<blur-view>` yet, so those hosts keep the
 * frost fill instead.
 *
 * The check is a host question, not a design one: `HoronProvider` adds
 * `.horon-glass-blur` from it so the glass tiers read their real translucent
 * value on engines that can filter and their frost degrade on engines that
 * cannot.
 *
 * @returns `true` where `<blur-view>` blurs, `false` on the Clay desktop shells.
 */
export function supportsBackdropBlur(): boolean {
  const hints = readNavigator();
  if (detectRuntime(hints) === "web") return true;
  const os = detectOs(hints);
  return os !== "macos" && os !== "windows";
}
