import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/**
 * Connection state of an integration:
 *
 * - `connected`: sky tile, a live-dot "Connected" pill and no button.
 * - `reconnect`: dark-sky tile, a red outline on the row, danger text in `detail` and a danger action button.
 * - `not-connected`: subtle tile, secondary text and the primary "Connect" button.
 */
export type IntegrationStatus = "connected" | "reconnect" | "not-connected";

/** Props of {@link IntegrationRow}: the service, its connection state and the one action. */
export type IntegrationRowProps = {
  /** 20px icon shown in inverse on the 40px tile. */
  icon: ReactNode;
  /** Service name on the first line, truncated with an ellipsis. */
  name: ReactNode;
  /** Account and scopes, or the reason a reconnect is needed. */
  detail?: ReactNode;
  /** Drives the tile fill, the pill or button on the right and the row's danger border. */
  status: IntegrationStatus;
  /** Called when the button is pressed; connected rows have no button, so it never fires then. */
  onAction?: () => void;
  /** Pill text for `connected`. @default "Connected" */
  connectedLabel?: string;
  /** Button text for `reconnect`. @default "Reconnect" */
  reconnectLabel?: string;
  /** Button text for `not-connected`. @default "Connect" */
  connectLabel?: string;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass row. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes for the row. */
  className?: string;
};

const tileClass: Record<IntegrationStatus, string> = {
  connected: "bg-sky-500",
  reconnect: "bg-sky-700",
  "not-connected": "bg-bg-subtle",
};

/** Colour of the tile glyph: inverse on the sky tiles, secondary on the subtle one. */
const tileIconColor: Record<IntegrationStatus, IconProps["color"]> = {
  connected: "interactive-on-primary",
  reconnect: "interactive-on-primary",
  "not-connected": "text-secondary",
};

/** The tile is 40px and React sized its glyph through `[&>svg]:size-5`; `<Icon>` takes the px number. */
const TILE_ICON_SIZE = 20;

/**
 * Figma `Integration row` (Integrations 110:883): 40px tile, status pill on the right, solid or thick glass.
 *
 * A one-line service row: 40px rounded tile with the icon, a name and an optional detail line that share a
 * `basis-40` column so the row wraps on narrow widths, and one action slot on the right. React mounted the
 * pill and the button together and stacked them through a `motion-swap` grid so they crossfaded; Lynx has no
 * `:last-child`/`[data-hidden]` matching and no overlapping grid area, so only the control the status asks
 * for is rendered, which keeps the row free of a dead control all the same. `glass` adds a `LiquidGlass`
 * layer; its danger outline is drawn on the host because Lynx's glass layer does not read `--glass-edge`.
 *
 * @example
 * ```tsx
 * import { Icon, IntegrationRow } from "@horon-ai/lynx";
 *
 * function Slack() {
 *   return (
 *     <IntegrationRow
 *       icon={<Icon name="SlackLogo" />}
 *       name="Slack"
 *       detail="horon.slack.com · 4 scopes"
 *       status="reconnect"
 *       onAction={() => reconnect("slack")}
 *     />
 *   );
 * }
 * ```
 */
export function IntegrationRow({
  icon,
  name,
  detail,
  status,
  onAction,
  connectedLabel = "Connected",
  reconnectLabel = "Reconnect",
  connectLabel = "Connect",
  surface = "solid",
  className,
}: IntegrationRowProps) {
  const isConnected = status === "connected";

  return (
    <view
      className={cn(
        "relative flex min-w-0 flex-row flex-wrap items-center gap-x-3 gap-y-2 overflow-hidden rounded-2xl py-3 pr-3.5 pl-3",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        status === "reconnect" && "border border-border-danger",
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <view
        className={cn(
          "relative flex size-10 shrink-0 flex-row items-center justify-center rounded-[10px] motion-colors",
          surface === "glass" && status === "not-connected" ? "bg-overlay-ink-6" : tileClass[status],
        )}
      >
        {isValidElement<IconProps>(icon) && icon.type === Icon
          ? cloneElement(icon, { size: TILE_ICON_SIZE, color: tileIconColor[status] })
          : icon}
      </view>
      <view className="relative flex min-w-0 grow basis-40 flex-col gap-0.5">
        <text className="truncate text-label-md text-text-primary">{name}</text>
        {detail ? (
          <text className={cn("truncate text-caption", status === "reconnect" ? "text-text-danger" : "text-text-secondary")}>
            {detail}
          </text>
        ) : null}
      </view>
      <view className="relative flex shrink-0 flex-row items-center">
        {isConnected ? (
          <view className="flex h-[30px] flex-row items-center justify-center gap-1.5 rounded-full bg-accent-sky-500-18 px-3">
            <view className="size-1.5 rounded-full bg-status-live" />
            <text className="text-label-sm whitespace-nowrap text-text-primary">{connectedLabel}</text>
          </view>
        ) : (
          <view
            className={cn(
              "flex h-[30px] flex-row items-center justify-center gap-1.5 rounded-full px-3 motion-press",
              status === "reconnect" ? "bg-accent-red-500-14" : "bg-interactive-primary",
            )}
            bindtap={onAction}
            accessibility-element
            accessibility-traits="button"
          >
            {status === "not-connected" ? <Icon name="Plug" size={14} color="text-primary" /> : null}
            <text
              className={cn(
                "text-label-sm whitespace-nowrap",
                status === "reconnect" ? "text-text-danger" : "text-text-inverse",
              )}
            >
              {status === "reconnect" ? reconnectLabel : connectLabel}
            </text>
          </view>
        )}
      </view>
    </view>
  );
}
