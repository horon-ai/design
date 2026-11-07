import { useMemo, useState } from "@lynx-js/react";

import { LiquidGlass } from "../src/components/liquid-glass";
import { detectOs, detectRuntime, readNavigator } from "../src/lib/platform";
import { HoronProvider, type ColorScheme, type ThemePlatform } from "../src/provider";
import { registry } from "./registry.g";

/** Reads the demo, scheme and platform hints the host page passes in `globalProps`. */
const readHostProps = () => {
  if (typeof lynx === "undefined") return { demo: "", scheme: "", platform: "" };
  const { demo, scheme, platform } = lynx.__globalProps ?? {};
  return { demo: demo ?? "", scheme: scheme ?? "", platform: platform ?? "" };
};

const isPlatform = (value: string): value is ThemePlatform => value === "desktop" || value === "mobile" || value === "web";

/**
 * The type board a host gets when it does not pass one: phones read the mobile
 * board, native desktop shells (LynxExplorer on macOS/Windows) the desktop one,
 * and the browser engine stays on web.
 */
const nativeBoard = (): ThemePlatform => {
  const hints = readNavigator();
  if (detectRuntime(hints) === "web") return "web";
  const os = detectOs(hints);
  return os === "ios" || os === "android" ? "mobile" : "desktop";
};

/** A glass pill used for every switch in the gallery chrome. */
function Pill({ label, onTap }: { label: string; onTap: () => void }) {
  return (
    <view
      className="relative flex flex-row items-center overflow-hidden rounded-full bg-glass-regular px-3 py-1"
      bindtap={onTap}
      accessibility-element
      accessibility-traits="button"
      accessibility-label={label}
    >
      <LiquidGlass />
      <text className="text-label-sm text-text-primary">{label}</text>
    </view>
  );
}

/**
 * The gallery app: the registered demos behind a list, with a theme switch and a
 * platform switch.
 *
 * The host page passes `?demo=<slug>` through `<lynx-view>`'s `globalProps`, which
 * opens that demo directly; a slug that is not registered renders
 * `not found: <slug>` instead of an empty screen.
 */
export function Gallery() {
  const host = useMemo(readHostProps, []);
  const [scheme, setScheme] = useState<ColorScheme>(host.scheme === "dark" ? "dark" : "light");
  const [platform, setPlatform] = useState<ThemePlatform>(isPlatform(host.platform) ? host.platform : nativeBoard());
  const [selected, setSelected] = useState(host.demo);

  const entry = registry.find((item) => item.slug === selected);
  const Demo = entry?.Demo;

  return (
    <HoronProvider scheme={scheme} platform={platform}>
      <view className="flex flex-col w-full h-full">
        <view className="flex flex-row items-center justify-between border-b border-border-default px-4 py-3">
          <text className="text-title-sm text-text-primary">Horon Lynx</text>
          <view className="flex flex-row items-center gap-2">
            <Pill label={scheme === "dark" ? "Light" : "Dark"} onTap={() => setScheme(scheme === "dark" ? "light" : "dark")} />
            <Pill label={platform} onTap={() => setPlatform(platform === "mobile" ? "desktop" : "mobile")} />
          </view>
        </view>

        {selected && !entry ? (
          <view className="flex items-center justify-center p-8">
            <text className="text-body-md text-text-danger">not found: {selected}</text>
          </view>
        ) : null}

        {Demo ? (
          <view className="flex flex-col w-full">
            <view className="flex flex-row items-center justify-between border-b border-border-default px-4 py-2">
              <text className="text-label-md text-text-secondary">{selected}</text>
              <view
                className="rounded-sm px-2 py-1"
                bindtap={() => setSelected("")}
                accessibility-element
                accessibility-traits="button"
                accessibility-label="Back to the demo list"
              >
                <text className="text-label-sm text-text-secondary">back</text>
              </view>
            </view>
            <view className="flex flex-col w-full p-4">
              <Demo />
            </view>
          </view>
        ) : null}

        {!selected ? (
          <view className="flex flex-col w-full p-2">
            {registry.map((item) => (
              <view
                key={item.slug}
                className="flex flex-row items-center justify-between rounded-md px-3 py-2 motion-colors"
                bindtap={() => setSelected(item.slug)}
                accessibility-element
                accessibility-traits="button"
                accessibility-label={item.slug}
              >
                <text className="text-label-md text-text-primary">{item.slug}</text>
                <text className="text-caption text-text-secondary">open</text>
              </view>
            ))}
          </view>
        ) : null}
      </view>
    </HoronProvider>
  );
}
