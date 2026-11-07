import { Menu as BaseMenu } from "@base-ui/react/menu";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";

type WithClass<T> = Omit<T, "className"> & {
  /** Extra classes merged onto the element the part renders. */
  className?: string;
};

/**
 * Visual treatment of the popup.
 *
 * - `glass` — the Figma `Menu` on the veil: 20px radius, 40px rows, 220px wide.
 * - `solid` — the Account / Workspace menu that opens over glass chrome: opaque fill, 18px radius, `shadow-popover`, 36px rows, 256px wide.
 * - `paper` — the Paper workspace switcher: default fill, 1px default border, 14px radius, `0 12 32` shadow, 304px wide, 36px rows.
 */
export type MenuSurface = "glass" | "solid" | "paper";

const SurfaceContext = createContext<MenuSurface>("glass");

/**
 * Root of a menu; owns open state and the trigger/popup pair. Re-exported from
 * Base UI's `Menu.Root`, so it accepts `open`, `defaultOpen`, `onOpenChange` and
 * `modal`.
 */
export const Menu = BaseMenu.Root;

/**
 * The element that opens the menu. Base UI gives it `aria-haspopup` and the
 * expanded state; use `render` to make an existing button the trigger.
 *
 * Part of {@link MenuContent}.
 */
export const MenuTrigger = BaseMenu.Trigger;

/** Props for {@link MenuContent}: the surface variant and the Base UI positioner offsets. */
export type MenuContentProps = WithClass<ComponentProps<typeof BaseMenu.Popup>> & {
  /**
   * `glass` is the Figma `Menu` on the veil (20px radius, 40px rows).
   * `solid` is the Account / Workspace menu that opens over glass chrome
   * (opaque fill, 18px radius, soft shadow, 36px rows).
   * `paper` is the Paper workspace switcher: default fill, 1px default border, 14px radius,
   * 0 12 32 shadow, 304px wide, 36px rows.
   * @default "solid"
   */
  surface?: MenuSurface;
  /** Preferred side of the anchor the popup opens on; flips when it does not fit. */
  side?: ComponentProps<typeof BaseMenu.Positioner>["side"];
  /** Alignment of the popup against the anchor.
   * @default "start" */
  align?: ComponentProps<typeof BaseMenu.Positioner>["align"];
  /** Gap in px between the anchor and the popup.
   * @default 8 */
  sideOffset?: number;
  /** Offset in px along the alignment axis. */
  alignOffset?: number;
};

/**
 * Radius, border, fill and shadow of the popup per {@link MenuSurface}. Width is
 * not part of this map; `MenuContent` applies it directly (`w-55` glass, `w-76`
 * paper, `w-64` solid).
 */
export const menuPopupClass = {
  glass: "rounded-xl veil-overlay",
  solid: "rounded-[18px] bg-glass-fill-solid shadow-popover",
  paper: "rounded-[14px] border border-border-default bg-bg-default shadow-[0_12px_32px_#0A142424]",
} as const;

/**
 * Figma `Menus and popovers` (88:495): `Menu`, `Account menu` and `Workspace menu`.
 *
 * The popup portals to `document.body` through `BaseMenu.Portal`, so it escapes
 * any `overflow: hidden` ancestor and always paints above the page at `z-50`.
 * Base UI handles keyboard navigation, focus return to the trigger and dismissal;
 * the surface prop only changes the look. Its width is capped at the viewport
 * minus 32px so the 304px `paper` menu still fits a 320px screen.
 *
 * @example
 * ```tsx
 * <Menu>
 *   <MenuTrigger render={<Button variant="solid" />}>Account</MenuTrigger>
 *   <MenuContent align="end">
 *     <MenuLabel>Workspaces</MenuLabel>
 *     <MenuItem icon={<GearSix />} trailing="⌘," onClick={openSettings}>
 *       Settings
 *     </MenuItem>
 *     <MenuSeparator />
 *     <MenuItem icon={<Trash />} danger onClick={remove}>
 *       Delete
 *     </MenuItem>
 *   </MenuContent>
 * </Menu>
 * ```
 */
export function MenuContent({
  surface = "solid",
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
            // The 304px paper menu is wider than a 320px viewport allows once the
            // positioner offsets it; this cap keeps the popup on screen.
            "max-w-[calc(100vw-2rem)]",
            menuPopupClass[surface],
            className,
          )}
          {...props}
        >
          <SurfaceContext value={surface}>{children}</SurfaceContext>
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

/** Props for {@link MenuItem}: optional leading icon, description line and trailing shortcut. */
export type MenuItemProps = WithClass<ComponentProps<typeof BaseMenu.Item>> & {
  /** 18px leading icon, or a 28px workspace tile. */
  icon?: ReactNode;
  /** Caption under the label, such as "3 members". Grows the row to 48px. */
  description?: ReactNode;
  /** Right side: a shortcut such as "⌘C", or a check. */
  trailing?: ReactNode;
  /** Paints the label and icon in `text-text-danger`; pair it with `onClick` or `disabled` for a destructive command. */
  danger?: boolean;
  /** Current choice drawn on the brand tint (Paper workspace switcher). */
  selected?: boolean;
};

/**
 * One row of a {@link MenuContent}: icon, label, optional description and trailing
 * shortcut. It is a Base UI `Menu.Item`, so it closes the menu on click, is
 * disabled through `disabled` and highlighted with the arrow keys.
 *
 * Part of {@link MenuContent}.
 */
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
        description ? "h-12" : surface === "glass" ? "h-10" : "h-9",
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
        <span className={cn("truncate text-label-md", danger ? "text-text-danger" : "text-text-primary")}>
          {children}
        </span>
        {description && <span className="truncate text-caption text-text-secondary">{description}</span>}
      </span>
      {trailing && (
        <span className="flex shrink-0 text-caption text-text-secondary [&>svg]:size-4 [&>svg]:text-text-primary">
          {trailing}
        </span>
      )}
    </BaseMenu.Item>
  );
}

/**
 * A 1px rule between groups of items, drawn full width inside the popup's own
 * `p-1.5` inset. Its wrapper adds `px-1.5` on glass and `px-2.5` on solid and
 * paper, so the line starts 12px from the popup edge on glass and 16px on the
 * others: on solid and paper it lines up with the row padding (`px-2.5`), while
 * the glass rows are inset further (`px-3`) and the rule runs wider than they do.
 *
 * It renders as a Base UI `Menu.Separator`, so it is hidden from the keyboard.
 *
 * Part of {@link MenuContent}.
 */
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
