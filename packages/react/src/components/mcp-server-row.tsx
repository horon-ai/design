import { DotsThree, GearSix } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";

const pillClass = "inline-flex h-5.5 items-center rounded-full px-2 text-label-sm";

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

/** Suffixes repeated values with their occurrence so duplicate tags never share a React key. */
const withKeys = (values: string[] | undefined) => {
  const seen = new Map<string, number>();
  return (values ?? []).map((value) => {
    const count = seen.get(value) ?? 0;
    seen.set(value, count + 1);
    return { value, key: count === 0 ? value : `${value}#${count}` };
  });
};

/** Props for {@link McpServerRow}: the server identity, its tags and status, and the two actions. */
export type McpServerRowProps = Omit<ComponentProps<"div">, "className" | "title"> & {
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
  /** Extra classes on the row `div`, merged after the built-in ones. */
  className?: string;
};

/**
 * Paper `MCP server row` (1VHS-0): a divided row with a 40px tile, tags, a status pill and two actions.
 *
 * A row of a settings list rather than a card: it draws only a bottom border and
 * drops it on the last child. The main cluster wraps (`basis-40`) so the row stays
 * usable in a narrow column; its overflow menu opens from the row and portals to
 * `document.body`.
 *
 * @example
 * ```tsx
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
  ...props
}: McpServerRowProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-3.5 gap-y-3 border-b border-border-default py-4 last:border-b-0",
        className,
      )}
      {...props}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sky-500 text-label-md text-neutral-50">
        {initials ?? name.slice(0, 2).toUpperCase()}
      </span>
      <div className="flex min-w-0 grow basis-40 flex-col gap-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="max-w-full min-w-0 truncate text-label-md text-text-primary">{name}</span>
          {withKeys(tags).map(({ value, key }) => (
            <span key={key} className={cn(pillClass, "bg-overlay-ink-6 text-text-secondary")}>
              {value}
            </span>
          ))}
          {withKeys(brandTags).map(({ value, key }) => (
            <span key={key} className={cn(pillClass, "bg-accent-sky-500-18 text-text-brand")}>
              {value}
            </span>
          ))}
        </div>
        {description && <span className="text-body-sm wrap-break-word text-text-secondary">{description}</span>}
        {meta && meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-label-sm text-text-secondary">
            {withKeys(meta).map(({ value, key }, i) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>·</span>}
                {value}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className={cn(pillClass, "shrink-0 gap-1.5", statusToneClass[statusTone].pill)}>
        <span aria-hidden className={cn("size-1.5 rounded-full", statusToneClass[statusTone].dot)} />
        {statusLabel}
      </span>
      <Button variant="solid" size="sm" icon={<GearSix aria-hidden className="size-3.5" />} onClick={onConfigure}>
        {configureLabel}
      </Button>
      {menu && (
        <Menu>
          <MenuTrigger
            render={<IconButton label={menuLabel} variant="ghost" size="sm" icon={<DotsThree aria-hidden />} />}
          />
          <MenuContent align="end">{menu}</MenuContent>
        </Menu>
      )}
    </div>
  );
}
