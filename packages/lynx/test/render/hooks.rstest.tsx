import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { expect, test } from "@rstest/core";

import { useActiveIndicator } from "../../src/hooks/use-active-indicator";
import { useColorScheme } from "../../src/hooks/use-color-scheme";
import { useCopyToClipboard } from "../../src/hooks/use-copy-to-clipboard";
import { useDevice } from "../../src/hooks/use-device";
import { useHotkey } from "../../src/hooks/use-hotkey";
import { useMediaQuery } from "../../src/hooks/use-media-query";
import { usePlatform } from "../../src/hooks/use-platform";
import { useReducedMotion } from "../../src/hooks/use-reduced-motion";
import { HoronProvider } from "../../src/provider";

/**
 * The background-thread globals the hooks read: `SystemInfo` for the viewport
 * and OS, `lynx.__globalProps`/`lynx.getJSModule` for the host hints and the
 * resize event. The testing environment owns both and resets them between tests,
 * so each case installs what it needs.
 */
type BackgroundGlobal = {
  SystemInfo: { platform: string; pixelWidth: number; pixelHeight: number; pixelRatio: number };
  lynx: {
    __globalProps: Record<string, string | undefined>;
    getJSModule: (name: "GlobalEventEmitter") => {
      trigger: (event: string, params: Record<string, unknown>) => void;
    };
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/**
 * Narrows the injected test environment down to the two globals these cases
 * touch. Anything else (a missing environment, a shape change) fails the case
 * loudly instead of reading `undefined` further down.
 */
const isBackgroundGlobal = (value: unknown): value is BackgroundGlobal => {
  if (!isRecord(value)) return false;
  return isRecord(value.SystemInfo) && isRecord(value.lynx);
};

const host = (): BackgroundGlobal => {
  const environment = Reflect.get(globalThis, "lynxTestingEnv");
  const background = isRecord(environment) ? environment.backgroundThread : undefined;
  const global = isRecord(background) ? background.globalThis : undefined;
  if (!isBackgroundGlobal(global)) throw new Error("the Lynx testing environment is not installed");
  return global;
};

/** Installs the OS, the CSS-px viewport (`pixelWidth / pixelRatio`) and the host props one case needs. */
function installHost(platform: string, width: number, props: Record<string, string | undefined> = {}) {
  const background = host();
  Object.assign(background.SystemInfo, { pixelHeight: 1600, pixelRatio: 2, pixelWidth: width * 2, platform });
  background.lynx.__globalProps = props;
}

/** Lets the hook's `setTimeout`/effect work run, still inside `act` so the re-render is committed. */
const settle = (ms = 30) =>
  act(async () => {
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, ms);
    await promise;
  });

/** Reads a probe's text from a live tree. */
function readText(view: { container: Element }, selector: string): string | null | undefined {
  return view.container.querySelector(selector)?.textContent;
}

/**
 * Mounts one probe, reads its text and unmounts it. A fresh tree is what makes
 * the next host state visible: `usePlatform` memoizes for the life of the mount
 * and the provider resolves `scheme="system"` once.
 */
function mountAndRead(element: Parameters<typeof render>[0], selector: string) {
  const view = render(element);
  const text = readText(view, selector);
  view.unmount();
  return text;
}

// --- Probe components -------------------------------------------------------------------------

function SchemeProbe() {
  return <text id="scheme">{useColorScheme()}</text>;
}

function MotionProbe() {
  return <text id="motion">{String(useReducedMotion())}</text>;
}

function PlatformProbe() {
  const { os, runtime, modKey } = usePlatform();
  return <text id="platform">{`${os}/${runtime}/${modKey}`}</text>;
}

function DeviceProbe() {
  const { type, input, keyboardHints } = useDevice();
  return <text id="device">{`${type}/${input}/${keyboardHints}`}</text>;
}

function MediaProbe() {
  const compact = useMediaQuery("(max-width: 767px)");
  const dark = useMediaQuery("(prefers-color-scheme: dark)");
  return <text id="media">{`${compact}/${dark}`}</text>;
}

function CompactProbe() {
  return <text id="media">{String(useMediaQuery("(max-width: 767px)"))}</text>;
}

function CompactFallbackProbe() {
  return <text id="fallback">{String(useMediaQuery("(max-width: 767px)", true))}</text>;
}

function IndicatorProbe() {
  const { rect, animate, bindTrack, bindItem } = useActiveIndicator(1);
  return (
    <view id="track" bindlayoutchange={bindTrack}>
      <view id="item-0" {...bindItem(0)}>
        <text>one</text>
      </view>
      <view id="item-1" {...bindItem(1)}>
        <text>two</text>
      </view>
      <view
        id="indicator"
        style={{
          height: `${rect?.height ?? 0}px`,
          left: `${rect?.left ?? 0}px`,
          opacity: rect ? 1 : 0,
          top: `${rect?.top ?? 0}px`,
          width: `${rect?.width ?? 0}px`,
        }}
      />
      <text id="state">{rect ? `${rect.left}x${rect.width}` : "none"}</text>
      <text id="animate">{String(animate)}</text>
    </view>
  );
}

function UnmeasuredIndicatorProbe() {
  const { rect, bindTrack, bindItem } = useActiveIndicator(0);
  return (
    <view id="track" bindlayoutchange={bindTrack}>
      <view id="item-0" {...bindItem(0)}>
        <text>only</text>
      </view>
      <view
        id="indicator"
        style={{ left: `${rect?.left ?? 0}px`, opacity: rect ? 1 : 0, width: `${rect?.width ?? 0}px` }}
      />
      <text id="state">{rect ? "placed" : "none"}</text>
    </view>
  );
}

/** Each probe reports what `copy()` returned next to the hook's own flags on one tap. */
function useCopyProbe(resetMs?: number) {
  const { copied, copy, supported } = useCopyToClipboard(resetMs);
  const [result, setResult] = useState("none");
  return {
    tap: () => setResult(String(copy("hello"))),
    text: `${supported}/${copied}/${result}`,
  };
}

function CopyProbe() {
  const { tap, text } = useCopyProbe();
  return (
    <view id="copy" bindtap={tap}>
      <text id="state">{text}</text>
    </view>
  );
}

function FastCopyProbe() {
  const { tap, text } = useCopyProbe(20);
  return (
    <view id="copy" bindtap={tap}>
      <text id="state">{text}</text>
    </view>
  );
}

function ShortcutProbe({ enabled }: { enabled: boolean }) {
  const [hits, setHits] = useState(0);
  const binding = useHotkey("Mod+K", () => setHits((count) => count + 1), { enabled });
  return (
    <view id="shortcut" {...binding}>
      <text id="hits">{`${hits}/${typeof binding.bindkeydown}`}</text>
    </view>
  );
}

// --- useColorScheme / useReducedMotion -------------------------------------------------------

test("useColorScheme follows the provider instead of an OS preference", () => {
  installHost("macOS", 1440);

  const { container, rerender } = render(
    <HoronProvider scheme="dark">
      <SchemeProbe />
    </HoronProvider>,
  );
  expect(readText({ container }, "#scheme")).toBe("dark");

  rerender(
    <HoronProvider scheme="light">
      <SchemeProbe />
    </HoronProvider>,
  );
  expect(readText({ container }, "#scheme")).toBe("light");

  // `system` resolves from the host hint rather than the OS.
  host().lynx.__globalProps = { scheme: "dark" };
  const system = render(
    <HoronProvider scheme="system">
      <SchemeProbe />
    </HoronProvider>,
  );
  expect(readText(system, "#scheme")).toBe("dark");

  // With no host hint it falls back to light instead of guessing. The provider
  // resolves `system` once per mount, so the previous tree has to be gone first.
  system.unmount();
  host().lynx.__globalProps = {};
  const fallback = render(
    <HoronProvider scheme="system">
      <SchemeProbe />
    </HoronProvider>,
  );
  expect(readText(fallback, "#scheme")).toBe("light");
});

test("useReducedMotion reads the provider flag", () => {
  installHost("macOS", 1440);

  const { container, rerender } = render(
    <HoronProvider reducedMotion>
      <MotionProbe />
    </HoronProvider>,
  );
  expect(readText({ container }, "#motion")).toBe("true");

  rerender(
    <HoronProvider reducedMotion={false}>
      <MotionProbe />
    </HoronProvider>,
  );
  expect(readText({ container }, "#motion")).toBe("false");
});

// --- usePlatform / useDevice -----------------------------------------------------------------

test("usePlatform reports the host's OS, runtime and the key behind Mod", () => {
  installHost("windows", 1440, { os: "windows", platform: "windows", runtime: "lynx-web" });
  expect(mountAndRead(<PlatformProbe />, "#platform")).toBe("windows/web/ctrl");

  installHost("macOS", 1440, { platform: "macOS" });
  expect(mountAndRead(<PlatformProbe />, "#platform")).toBe("macos/desktop/meta");

  // No host hint and no recognised `SystemInfo.platform` reports the neutral case.
  installHost("Harmony", 1440);
  expect(mountAndRead(<PlatformProbe />, "#platform")).toBe("unknown/desktop/meta");
});

test("useDevice classifies the layout and the input behind it", () => {
  installHost("iOS", 390, { platform: "iOS" });
  expect(mountAndRead(<DeviceProbe />, "#device")).toBe("mobile/touch/false");

  installHost("iOS", 1024, { platform: "iOS" });
  expect(mountAndRead(<DeviceProbe />, "#device")).toBe("tablet/touch/false");

  installHost("macOS", 1440, { platform: "macOS" });
  expect(mountAndRead(<DeviceProbe />, "#device")).toBe("desktop/pointer/true");
});

// --- useMediaQuery ---------------------------------------------------------------------------

test("useMediaQuery answers width from SystemInfo and motion/scheme from the provider", () => {
  installHost("macOS", 390, { platform: "macOS" });
  expect(
    mountAndRead(
      <HoronProvider scheme="dark">
        <MediaProbe />
      </HoronProvider>,
      "#media",
    ),
  ).toBe("true/true");

  installHost("macOS", 1440, { platform: "macOS" });
  expect(
    mountAndRead(
      <HoronProvider scheme="light">
        <MediaProbe />
      </HoronProvider>,
      "#media",
    ),
  ).toBe("false/false");
});

test("useMediaQuery re-evaluates on the engine's resize event and falls back to serverValue without dimensions", async () => {
  installHost("macOS", 1440, { platform: "macOS" });

  const { container } = render(<CompactProbe />);
  expect(readText({ container }, "#media")).toBe("false");

  // The hook subscribes through the GlobalEventEmitter; a narrower viewport must flip the answer.
  const background = host();
  const emitter = background.lynx.getJSModule("GlobalEventEmitter");
  background.SystemInfo.pixelWidth = 600 * 2;
  await act(async () => {
    emitter.trigger("onWindowResize", {});
  });
  expect(readText({ container }, "#media")).toBe("true");

  // Without dimensions (a plain Bun test, no engine) the caller's fallback is reported.
  background.SystemInfo.pixelRatio = 0;
  const fallback = render(<CompactFallbackProbe />);
  expect(readText(fallback, "#fallback")).toBe("true");
});

// --- useActiveIndicator ----------------------------------------------------------------------

test("useActiveIndicator places the indicator from the active item's layoutchange reading", async () => {
  installHost("macOS", 1440, { platform: "macOS" });

  const { container } = render(<IndicatorProbe />);
  const indicator = () => container.querySelector<HTMLElement>("#indicator")!;

  // Before any layout event the track has no measurement, so nothing is drawn.
  expect(readText({ container }, "#state")).toBe("none");
  expect(indicator().style.width).toBe("0px");
  expect(indicator().style.opacity).toBe("0");

  // The inactive item's box is ignored, so the track alone still draws nothing.
  fireEvent.layoutchange(container.querySelector("#track")!, { detail: { height: 48, left: 20, top: 10, width: 300 } });
  fireEvent.layoutchange(container.querySelector("#item-0")!, {
    detail: { height: 48, left: 20, top: 10, width: 100 },
  });
  expect(readText({ container }, "#state")).toBe("none");

  // The active item's box is rebased onto the track origin: 170-20 left, 140 wide.
  fireEvent.layoutchange(container.querySelector("#item-1")!, {
    detail: { height: 36, left: 170, top: 16, width: 140 },
  });
  expect(readText({ container }, "#state")).toBe("150x140");
  expect(indicator().style.left).toBe("150px");
  expect(indicator().style.top).toBe("6px");
  expect(indicator().style.width).toBe("140px");
  expect(indicator().style.height).toBe("36px");
  expect(indicator().style.opacity).toBe("1");

  // `animate` turns on one frame after the first placement so the indicator lands instead of sliding from 0,0.
  expect(readText({ container }, "#animate")).toBe("false");
  await settle();
  expect(readText({ container }, "#animate")).toBe("true");
});

test("useActiveIndicator hides the indicator while the active item has no measurement", () => {
  installHost("macOS", 1440, { platform: "macOS" });

  const { container } = render(<UnmeasuredIndicatorProbe />);
  // Only the track reported; no item has a box, so the indicator stays hidden at zero size.
  fireEvent.layoutchange(container.querySelector("#track")!, { detail: { height: 48, left: 0, top: 0, width: 320 } });

  const indicator = container.querySelector<HTMLElement>("#indicator")!;
  expect(readText({ container }, "#state")).toBe("none");
  expect(indicator.style.left).toBe("0px");
  expect(indicator.style.width).toBe("0px");
  expect(indicator.style.opacity).toBe("0");
});

// --- useCopyToClipboard ----------------------------------------------------------------------

test("useCopyToClipboard reports unsupported and refuses to copy when the engine has no clipboard", () => {
  installHost("iOS", 390, { platform: "iOS" });

  const { container } = render(<CopyProbe />);
  expect(readText({ container }, "#state")).toBe("false/false/none");

  fireEvent.tap(container.querySelector("#copy")!);
  // copy() returns false and no confirmation appears, so a caller can hide the affordance instead of
  // showing a button that does nothing.
  expect(readText({ container }, "#state")).toBe("false/false/false");
});

test("useCopyToClipboard writes and self-clears when the browser engine exposes a clipboard", async () => {
  installHost("macOS", 1440, { platform: "macOS", runtime: "lynx-web" });

  const written: string[] = [];
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (text: string) => {
        written.push(text);
      },
    },
  });

  try {
    const { container } = render(<FastCopyProbe />);
    expect(readText({ container }, "#state")).toBe("true/false/none");

    fireEvent.tap(container.querySelector("#copy")!);
    await settle(5);
    expect(written).toEqual(["hello"]);
    expect(readText({ container }, "#state")).toBe("true/true/true");

    // `resetMs` clears the confirmation; the failure direction is that it never sticks around forever.
    await settle(40);
    expect(readText({ container }, "#state")).toBe("true/false/true");
  } finally {
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

// --- useHotkey -------------------------------------------------------------------------------

test("useHotkey returns a bindkeydown binding that runs the handler only for a matching shortcut", () => {
  installHost("windows", 1440, { os: "windows", platform: "windows", runtime: "lynx-web" });

  const { container, rerender } = render(<ShortcutProbe enabled />);
  expect(readText({ container }, "#hits")).toBe("0/function");

  fireEvent.keydown(container.querySelector("#shortcut")!, { ctrlKey: true, key: "k" });
  expect(readText({ container }, "#hits")).toBe("1/function");

  // Windows means Ctrl is Mod, so ⌘/meta is not this shortcut.
  fireEvent.keydown(container.querySelector("#shortcut")!, { key: "k", metaKey: true });
  expect(readText({ container }, "#hits")).toBe("1/function");

  // A different key does nothing either.
  fireEvent.keydown(container.querySelector("#shortcut")!, { ctrlKey: true, key: "j" });
  expect(readText({ container }, "#hits")).toBe("1/function");

  // `enabled: false` detaches the shortcut even though the binding is still spread on the node.
  rerender(<ShortcutProbe enabled={false} />);
  fireEvent.keydown(container.querySelector("#shortcut")!, { ctrlKey: true, key: "k" });
  expect(readText({ container }, "#hits")).toBe("1/function");
});
