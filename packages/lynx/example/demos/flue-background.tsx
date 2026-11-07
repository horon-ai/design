import type { ReactNode } from "@lynx-js/react";

import { FlueBackground } from "../../src/components/flue-background";
import { LiquidGlass } from "../../src/components/liquid-glass";

/** One framed scene: the smoke behind a host that owns the radius, with content painted above it. */
function Scene({ children, height }: { children: ReactNode; height: string }) {
  return (
    <view className={`relative overflow-hidden rounded-xl border border-border-default ${height}`}>
      <FlueBackground />
      <view className="relative flex h-full flex-col p-6">{children}</view>
    </view>
  );
}

/**
 * The three places Flue is used, each in the light palette: the default panel, the sidebar column under
 * its thick glass tint, and the sign-in screen behind a centred glass card.
 */
export default function FlueBackgroundDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Default</text>
        <Scene height="h-[220px]">
          <text className="text-title-sm text-text-primary">Workspace</text>
          <text className="mt-1 text-body-sm text-text-secondary">
            The plume drifts up from the ground and breathes on its own.
          </text>
        </Scene>
      </view>

      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Sidebar under thick glass</text>
        <view className="relative h-[260px] w-[240px] overflow-hidden rounded-xl border border-border-default">
          <FlueBackground variant="sidebar" />
          <view className="relative flex h-full flex-col gap-1 p-4">
            <text className="text-label-md text-text-primary">Inbox</text>
            <text className="text-label-md text-text-secondary">Agents</text>
            <text className="text-label-md text-text-secondary">Routines</text>
            <text className="text-label-md text-text-secondary">Settings</text>
          </view>
        </view>
      </view>

      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Auth screen</text>
        <view className="relative h-[320px] w-full overflow-hidden rounded-xl border border-border-default">
          <FlueBackground variant="auth" config={{ speed: 0.5 }} />
          <view className="relative flex h-full flex-col items-center justify-center gap-4 p-6">
            <view className="relative flex w-full max-w-[320px] flex-col overflow-hidden rounded-xl bg-glass-thick p-5">
              <LiquidGlass />
              <text className="relative text-label-lg text-text-primary">Sign in to Horon</text>
              <text className="relative mt-1 text-body-sm text-text-secondary">
                The smoke frames the card and stops short of the navy end of the ramp.
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  );
}
