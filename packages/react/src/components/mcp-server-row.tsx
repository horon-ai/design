import { DotsThree, GearSix } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";

const pillClass = "inline-flex h-5.5 items-center rounded-full px-2 text-[12px]/[16px] font-medium";

/** Suffixes repeated values with their occurrence so duplicate tags never share a React key. */
const withKeys = (values: string[] | undefined) => {
  const seen = new Map<string, number>();
  return (values ?? []).map((value) => {
    const count = seen.get(value) ?? 0;
    seen.set(value, count + 1);
    return { value, key: count === 0 ? value : `${value}#${count}` };
  });
};

export type McpServerRowProps = Omit<ComponentProps<"div">, "className" | "title"> & {
  /** Server name; its first two letters fill the 40px tile unless `initials` is set. */
  name: string;
  initials?: string;
  /** Tags next to the name, such as "Official". */
  tags?: string[];
  /** Tags tinted brand, such as "All devices". */
  brandTags?: string[];
  description?: ReactNode;
  /** Meta line, joined by "·". */
  meta?: string[];
  statusLabel?: ReactNode;
  configureLabel?: ReactNode;
  onConfigure?: () => void;
  /** Overflow menu items (`MenuItem`). Hides the overflow button when absent. */
  menu?: ReactNode;
  menuLabel?: string;
  className?: string;
};

/** Paper `MCP server row` (1VHS-0): a divided row with a 40px tile, tags, a status pill and two actions. */
export function McpServerRow({
  name,
  initials,
  tags,
  brandTags,
  description,
  meta,
  statusLabel = "Connected",
  configureLabel = "Configure",
  onConfigure,
  menu,
  menuLabel = "More",
  className,
  ...props
}: McpServerRowProps) {
  return (
    <div
      className={cn("flex items-center gap-3.5 border-b border-border-default py-4 last:border-b-0", className)}
      {...props}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-interactive-primary text-[14px]/[20px] font-semibold text-interactive-on-primary">
        {initials ?? name.slice(0, 2).toUpperCase()}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px]/[20px] font-semibold text-text-primary">{name}</span>
          {withKeys(tags).map(({ value, key }) => (
            <span key={key} className={cn(pillClass, "bg-overlay-ink-6 text-text-secondary dark:bg-bg-surface-6")}>
              {value}
            </span>
          ))}
          {withKeys(brandTags).map(({ value, key }) => (
            <span key={key} className={cn(pillClass, "bg-accent-sky-500-18 text-text-brand")}>
              {value}
            </span>
          ))}
        </div>
        {description && <span className="text-[13px]/[18px] text-text-secondary">{description}</span>}
        {meta && meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[12px]/[16px] text-text-placeholder">
            {withKeys(meta).map(({ value, key }, i) => (
              <span key={key} className="inline-flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>·</span>}
                {value}
              </span>
            ))}
          </div>
        )}
      </div>
      <span className={cn(pillClass, "shrink-0 bg-accent-sky-500-18 text-text-brand")}>{statusLabel}</span>
      <Button variant="glass" size="sm" icon={<GearSix aria-hidden className="size-3.5" />} onClick={onConfigure}>
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
