import { Menu as BaseMenu } from "@base-ui/react/menu";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

type WithClass<T> = Omit<T, "className"> & { className?: string };

export type MenuSurface = "glass" | "solid" | "paper";

const SurfaceContext = createContext<MenuSurface>("glass");

export const Menu = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;

export type MenuContentProps = WithClass<ComponentProps<typeof BaseMenu.Popup>> & {
  /**
   * `glass` is the Figma `Menu` (thick glass, 20px radius, 40px rows).
   * `solid` is the Account / Workspace menu that opens over glass chrome
   * (opaque fill, 18px radius, soft shadow, 36px rows).
   * `paper` is the Paper workspace switcher: default fill, 1px default border, 14px radius,
   * 0 12 32 shadow, 304px wide, 36px rows.
   */
  surface?: MenuSurface;
  side?: ComponentProps<typeof BaseMenu.Positioner>["side"];
  align?: ComponentProps<typeof BaseMenu.Positioner>["align"];
  sideOffset?: number;
  alignOffset?: number;
};

export const menuPopupClass = {
  glass: "rounded-xl bg-glass-thick",
  solid: "rounded-[18px] bg-glass-fill-solid shadow-popover",
  paper: "rounded-[14px] border border-border-default bg-bg-default shadow-[0_12px_32px_#0A142424]",
} as const;

/** Figma `Menus and popovers` (88:495): `Menu`, `Account menu` and `Workspace menu`. */
export function MenuContent({
  surface = "glass",
  side,
  align = "start",
  sideOffset = 8,
  alignOffset,
  className,
  children,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="z-50 outline-none"
      >
        <BaseMenu.Popup
          className={cn(
            "relative flex motion-popup flex-col gap-0.5 overflow-clip p-1.5 outline-none",
            surface === "glass" ? "w-55" : surface === "paper" ? "w-76" : "w-64",
            menuPopupClass[surface],
            className,
          )}
          {...props}
        >
          {surface === "paper" ? null : <LiquidGlass tier="thick" />}
          <SurfaceContext value={surface}>{children}</SurfaceContext>
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export type MenuItemProps = WithClass<ComponentProps<typeof BaseMenu.Item>> & {
  /** 18px leading icon, or a 28px workspace tile. */
  icon?: ReactNode;
  /** Caption under the label, such as "3 members". */
  description?: ReactNode;
  /** Right side: a shortcut such as "⌘C", or a check. */
  trailing?: ReactNode;
  danger?: boolean;
  /** Current choice drawn on the brand tint (Paper workspace switcher). */
  selected?: boolean;
};

export function MenuItem({
  icon,
  description,
  trailing,
  danger,
  selected,
  className,
  children,
  ...props
}: MenuItemProps) {
  const surface = useContext(SurfaceContext);
  return (
    <BaseMenu.Item
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2.5 motion-colors outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:bg-overlay-ink-6",
        surface === "glass" ? "rounded-md px-3" : "rounded-[10px] px-2.5",
        description ? "h-11.5 pl-2" : surface === "glass" ? "h-10" : "h-9",
        selected && "bg-bg-brand data-highlighted:bg-bg-brand",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            "flex shrink-0 [&>svg]:size-4.5",
            danger ? "text-text-danger" : surface === "glass" ? "text-text-secondary" : "text-text-primary",
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("text-label-md", danger ? "text-text-danger" : "text-text-primary")}>{children}</span>
        {description && <span className="text-caption text-text-secondary">{description}</span>}
      </span>
      {trailing && (
        <span className="flex shrink-0 text-caption text-text-secondary [&>svg]:size-4 [&>svg]:text-text-primary">
          {trailing}
        </span>
      )}
    </BaseMenu.Item>
  );
}

export function MenuSeparator({ className, ...props }: WithClass<ComponentProps<typeof BaseMenu.Separator>>) {
  const surface = useContext(SurfaceContext);
  return (
    <BaseMenu.Separator
      className={cn("relative flex py-1", surface === "glass" ? "px-1.5" : "px-2.5", className)}
      {...props}
      render={(separatorProps) => (
        <div {...separatorProps}>
          <span className="h-px flex-1 bg-overlay-ink-8" />
        </div>
      )}
    />
  );
}

/** A caption heading for a group of items, such as "Workspaces" or the account email. */
export function MenuLabel({ className, ...props }: WithClass<ComponentProps<"div">>) {
  return <div className={cn("relative px-2.5 pt-2 pb-1 text-caption text-text-secondary", className)} {...props} />;
}

/** A 28px rounded tile for a workspace initial, used as a `MenuItem` icon. */
export function MenuTile({ className, ...props }: WithClass<ComponentProps<"span">>) {
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-sm bg-interactive-primary text-label-sm text-text-inverse",
        className,
      )}
      {...props}
    />
  );
}
