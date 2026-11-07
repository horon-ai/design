import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no DOM, so the entry
 * lists only what the Lynx wrapper can honour.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
};

const pillClass = "flex h-[22px] flex-row items-center rounded-full px-2";

/**
 * Colour of an MCP server's status pill.
 *
 * - `connected` — muted pill with a live dot, the healthy default.
 * - `warning` — danger-tinted pill with a danger dot, for a server that needs attention.
 * - `neutral` — muted pill with a placeholder-coloured dot, for an idle or unknown state.
 */
export type McpServerStatusTone = "connected" | "warning" | "neutral";

const statusToneClass: Record<
  McpServerStatusTone,
  {
    /** Classes of the pill itself: background tint and text colour. */
    pill: string;
    /** Classes of the 6px dot inside the pill: its fill colour. */
    dot: string;
  }
> = {
  connected: { pill: "bg-overlay-ink-6 text-text-primary", dot: "bg-status-live" },
  warning: { pill: "bg-accent-red-500-14 text-text-danger", dot: "bg-text-danger" },
  neutral: { pill: "bg-overlay-ink-6 text-text-secondary", dot: "bg-text-placeholder" },
};

/** Suffixes repeated values with their occurrence so duplicate tags never share a list key. */
const withKeys = (values: string[] | undefined) => {
  const seen = new Map<string, number>();
  return (values ?? []).map((value) => {
    const count = seen.get(value) ?? 0;
    seen.set(value, count + 1);
    return { value, key: count === 0 ? value : `${value}#${count}` };
  });
};

/** Text slots take a string so the token classes can sit on a `<text>`; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/** Props for {@link McpServerRow}: the server identity, its tags and status, and the two actions. */
export type McpServerRowProps = Omit<PortedElementProps["div"], "className"> & {
  /** Server name; its first two letters fill the 40px tile unless `initials` is set. */
  name: string;
  /** Overrides the two-letter tile text derived from `name`; up to two characters read best. */
  initials?: string;
  /** Tags next to the name, such as "Official". */
  tags?: string[];
  /** Tags tinted brand, such as "All devices". */
  brandTags?: string[];
  /** Body line under the tags, in body-sm secondary colour. */
  description?: ReactNode;
  /** Meta line, joined by "·". */
  meta?: string[];
  /** Text inside the status pill.
   * @default "Connected" */
  statusLabel?: ReactNode;
  /** Colour of the status pill: a live dot by default, a danger tint for a warning, a muted dot for a neutral state.
   * @default "connected" */
  statusTone?: McpServerStatusTone;
  /** Text of the Configure button.
   * @default "Configure" */
  configureLabel?: ReactNode;
  /** Fires when the Configure button is clicked; the button always renders, so pass this to make it do anything. */
  onConfigure?: () => void;
  /** Overflow menu items (`MenuItem`). Hides the overflow button when absent. */
  menu?: ReactNode;
  /** Accessible label of the overflow button.
   * @default "More" */
  menuLabel?: string;
  /** Extra classes on the row, merged after the built-in ones. */
  className?: string;
};

/**
 * Paper `MCP server row` (1VHS-0): a divided row with a 40px tile, tags, a status pill and two actions.
 *
 * A row of a settings list rather than a card: it draws only a bottom border. React dropped that border on
 * the last child with `last:border-b-0`; Lynx has no `:last-child`, so the last row of a list takes
 * `className="border-b-0"` itself. The main cluster wraps (`basis-40`) so the row stays usable in a narrow
 * column, and the overflow menu is the package {@link Menu}, which paints its popup as a fixed view in place.
 *
 * @example
 * ```tsx
 * import { McpServerRow, MenuItem } from "@horon-ai/lynx";
 *
 * <McpServerRow
 *   name="Linear"
 *   tags={["Official"]}
 *   description="Read issues and projects."
 *   meta={["12 tools", "OAuth"]}
 *   onConfigure={() => openConfig("linear")}
 *   menu={<MenuItem>Reconnect</MenuItem>}
 * />
 * ```
 */
export function McpServerRow({
  name,
  initials,
  tags,
  brandTags,
  description,
  meta,
  statusLabel = "Connected",
  statusTone = "connected",
  configureLabel = "Configure",
  onConfigure,
  menu,
  menuLabel = "More",
  className,
  style,
}: McpServerRowProps) {
  return (
    <view
      className={cn(
        "flex min-w-0 flex-row flex-wrap items-center gap-x-3.5 gap-y-3 border-b border-border-default py-4",
        className,
      )}
      style={style}
    >
      <view className="flex size-10 shrink-0 flex-row items-center justify-center rounded-[10px] bg-sky-500">
        <text className="text-label-md text-neutral-50">{initials ?? name.slice(0, 2).toUpperCase()}</text>
      </view>
      <view className="flex min-w-0 grow basis-40 flex-col gap-1">
        <view className="flex min-w-0 flex-row flex-wrap items-center gap-2">
          <text className="max-w-full min-w-0 truncate text-label-md text-text-primary">{name}</text>
          {withKeys(tags).map(({ value, key }) => (
            <view key={key} className={cn(pillClass, "bg-overlay-ink-6")}>
              <text className="text-label-sm text-text-secondary">{value}</text>
            </view>
          ))}
          {withKeys(brandTags).map(({ value, key }) => (
            <view key={key} className={cn(pillClass, "bg-accent-sky-500-18")}>
              <text className="text-label-sm text-text-brand">{value}</text>
            </view>
          ))}
        </view>
        {description ? (
          isPlainText(description) ? (
            <text className="text-body-sm text-text-secondary">{description}</text>
          ) : (
            description
          )
        ) : null}
        {meta && meta.length > 0 ? (
          <view className="flex flex-row flex-wrap items-center gap-1.5">
            {withKeys(meta).map(({ value, key }, index) => (
              <view key={key} className="flex flex-row items-center gap-1.5">
                {index > 0 ? <text className="text-label-sm text-text-secondary">·</text> : null}
                <text className="text-label-sm text-text-secondary">{value}</text>
              </view>
            ))}
          </view>
        ) : null}
      </view>
      <view className={cn(pillClass, "shrink-0 gap-1.5", statusToneClass[statusTone].pill)}>
        <view className={cn("size-1.5 rounded-full", statusToneClass[statusTone].dot)} />
        {isPlainText(statusLabel) ? (
          <text
            className={cn(
              "text-label-sm",
              statusTone === "warning" ? "text-text-danger" : statusTone === "neutral" ? "text-text-secondary" : "text-text-primary",
            )}
          >
            {statusLabel}
          </text>
        ) : (
          statusLabel
        )}
      </view>
      <Button variant="solid" size="sm" icon={<Icon name="GearSix" />} onClick={onConfigure}>
        {configureLabel}
      </Button>
      {menu ? (
        <Menu>
          <MenuTrigger>
            <IconButton label={menuLabel} variant="ghost" size="sm" icon={<Icon name="DotsThree" />} />
          </MenuTrigger>
          <MenuContent align="end">{menu}</MenuContent>
        </Menu>
      ) : null}
    </view>
  );
}
