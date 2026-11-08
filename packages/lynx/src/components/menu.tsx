import { createContext, useContext, useMemo, useState, type ReactNode } from "@lynx-js/react";

import type { CSSProperties } from "@lynx-js/types";

import type { LayoutChangeLike } from "../hooks";
import { readViewport } from "../lib/media";
import { cn } from "../lib/cn";

/** Props of {@link Menu}: the open state Base UI's `Menu.Root` owns. */
type MenuProps = {
  /** Controlled open state. Passing it makes the menu controlled. */
  open?: boolean;
  /** Open state at first render when the caller does not own it. @default false */
  defaultOpen?: boolean;
  /** Fires with the next open state whenever a trigger or an item asks to change it. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Accepted for call-site parity with Base UI's `modal` prop. Lynx paints the
   * backdrop itself and has no scroll lock, so the value changes nothing.
   */
  modal?: boolean;
  /** The trigger and the popup. */
  children?: ReactNode;
};

/**
 * Visual treatment of the popup.
 *
 * - `glass` — the Figma `Menu` on the veil: 20px radius, 40px rows, 220px wide.
 * - `solid` — the Account / Workspace menu that opens over glass chrome: opaque fill, 18px radius, `shadow-popover`, 36px rows, 256px wide.
 * - `paper` — the Paper workspace switcher: default fill, 1px default border, 14px radius, `0 12 32` shadow, 304px wide, 36px rows.
 */
export type MenuSurface = "glass" | "solid" | "paper";

/** The trigger's box on the page, measured by `bindlayoutchange`; all values in CSS px. */
type AnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: AnchorRect | null;
  setAnchor: (rect: AnchorRect) => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);
const SurfaceContext = createContext<MenuSurface>("glass");

const useMenuContext = (part: string): MenuContextValue => {
  const context = useContext(MenuContext);
  if (!context) throw new Error(`<${part}> must be rendered inside <Menu>`);
  return context;
};

/** Reads the box a `layoutchange` event reports, relative to the LynxView viewport. */
const boxOf = (event: LayoutChangeLike): AnchorRect => {
  const box = event.detail ?? event.params ?? {};
  return {
    left: typeof box.left === "number" ? box.left : 0,
    top: typeof box.top === "number" ? box.top : 0,
    width: typeof box.width === "number" ? box.width : 0,
    height: typeof box.height === "number" ? box.height : 0,
  };
};

/**
 * Root of a menu; owns open state and publishes the trigger's measured box.
 *
 * Base UI's `Menu.Root` on React; on Lynx it is a context provider instead of a
 * re-export, because the popup is a fixed view painted in place rather than a
 * portal and the trigger's box has to be shared with it. It accepts the same
 * `open`, `defaultOpen`, `onOpenChange` and `modal` props.
 */
export function Menu({ open: controlledOpen, defaultOpen = false, onOpenChange, modal: _modal, children }: MenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const open = controlledOpen ?? uncontrolledOpen;

  const value = useMemo<MenuContextValue>(
    () => ({
      open,
      setOpen: (next: boolean) => {
        if (controlledOpen === undefined) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      anchor,
      setAnchor,
    }),
    [open, controlledOpen, onOpenChange, anchor],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/** Props of {@link MenuTrigger}: the element that opens the menu and the box it reports. */
type MenuTriggerProps = {
  /** Extra classes for the measuring wrapper around the trigger. */
  className?: string;
  /** The trigger's visible content: a label, an icon or a composed row. */
  children?: ReactNode;
  /** Blocks the trigger; the menu cannot be opened. @default false */
  disabled?: boolean;
  /** Accessible name of the trigger, replacing the one its content would give it. */
  "accessibility-label"?: string;
  /** Accessible hint that names the control, mirroring React's `aria-haspopup` intent. */
  "accessibility-role-description"?: string;
};

/**
 * The element that opens the menu. Base UI gives its trigger `aria-haspopup` and
 * the expanded state; on Lynx the trigger is a `view` wrapper that carries the
 * press binding, the expanded accessibility state and the `layoutchange`
 * measurement the popup is anchored to.
 *
 * React made the caller's own element the trigger through `render`, adding no
 * wrapper node; Lynx has no element swapping for host nodes, so one measuring
 * wrapper is added here and a caller that needs its own button styling puts it
 * inside (see {@link WorkspaceMenu}).
 *
 * Part of {@link MenuContent}.
 */
export function MenuTrigger({
  className,
  children,
  disabled = false,
  "accessibility-label": accessibilityLabel,
  "accessibility-role-description": accessibilityRoleDescription,
}: MenuTriggerProps) {
  const { open, setOpen, setAnchor } = useMenuContext("MenuTrigger");

  return (
    <view
      className={cn("flex flex-row items-center", disabled && "opacity-40", className)}
      bindtap={() => {
        if (disabled) return;
        setOpen(!open);
      }}
      bindlayoutchange={(event: LayoutChangeLike) => setAnchor(boxOf(event))}
      accessibility-element
      accessibility-traits="button"
      accessibility-label={accessibilityLabel}
      accessibility-role-description={accessibilityRoleDescription ?? "button"}
      accessibility-value={open ? "expanded" : "collapsed"}
    >
      {children}
    </view>
  );
}

/** The placement vocabulary of the popup, so the two axes keep React's own indexed-access spelling. */
type MenuPosition = {
  /**
   * Which side of the anchor the popup prefers, in Base UI's full vocabulary. `inline-start` and
   * `inline-end` are the logical sides of a flow-relative anchor: Lynx lays this popup out LTR only,
   * so they resolve to `left` and `right` and an RTL host is not honoured.
   */
  side: "top" | "bottom" | "left" | "right" | "inline-start" | "inline-end";
  /** How the popup lines up on the other axis. */
  align: "start" | "center" | "end";
};

/** The physical side a requested `side` resolves to; the inline pair maps to left and right (LTR only). */
function physicalSide(side: MenuPosition["side"] | undefined): "top" | "bottom" | "left" | "right" {
  if (side === "top" || side === "left" || side === "right") return side;
  if (side === "inline-start") return "left";
  if (side === "inline-end") return "right";
  return "bottom";
}

/** Props for {@link MenuContent}: the surface variant and the popup placement. */
export type MenuContentProps = {
  /**
   * `glass` is the Figma `Menu` on the veil (20px radius, 40px rows).
   * `solid` is the Account / Workspace menu that opens over glass chrome
   * (opaque fill, 18px radius, soft shadow, 36px rows).
   * `paper` is the Paper workspace switcher: default fill, 1px default border, 14px radius,
   * 0 12 32 shadow, 304px wide, 36px rows.
   * @default "solid"
   */
  surface?: MenuSurface;
  /**
   * Preferred side of the anchor the popup opens on; flips when it does not fit. `inline-start` and
   * `inline-end` resolve to `left` and `right`, because this popup is laid out LTR only.
   * @default "bottom"
   */
  side?: MenuPosition["side"];
  /** Alignment of the popup against the anchor.
   * @default "start" */
  align?: MenuPosition["align"];
  /** Gap in px between the anchor and the popup.
   * @default 8 */
  sideOffset?: number;
  /** Offset in px along the alignment axis.
   * @default 0 */
  alignOffset?: number;
  /** Extra classes merged onto the popup. */
  className?: string;
  /** Inline style, merged onto the popup's own placement. */
  style?: CSSProperties;
  /** Element id of the popup, so a host can address it. */
  id?: string;
  /** The rows of the menu, usually {@link MenuItem} parts. */
  children?: ReactNode;
};

/**
 * Radius, border, fill and shadow of the popup per {@link MenuSurface}. Width is
 * not part of this map; `MenuContent` applies it directly (220px glass, 304px
 * paper, 256px solid).
 */
export const menuPopupClass = {
  glass: "rounded-xl veil-overlay",
  solid: "rounded-[18px] bg-glass-fill-solid shadow-popover",
  paper: "rounded-[14px] border border-border-default bg-bg-default shadow-[0_12px_32px_#0A142424]",
} as const;

/** The popup's own box, measured after it paints, so `center`/`end` can be exact. */
type PanelSize = { width: number; height: number };

/** A Lynx inline style takes lengths as px strings; a bare number is dropped by the element engine. */
function px(value: number): string {
  return `${value}px`;
}

/**
 * The popup's inline position, computed from the trigger's box.
 *
 * Base UI's positioner does this on React; Lynx has no floating-ui, so the four
 * sides are resolved here: the requested side is used when the panel fits, and
 * flipped to the opposite side when it does not. A zero viewport (a plain render
 * test, where `SystemInfo` reports nothing) keeps the requested side, because no
 * collision can be judged.
 */
function popupPlacement(
  anchor: AnchorRect,
  panel: PanelSize,
  side: MenuContentProps["side"],
  align: MenuContentProps["align"],
  sideOffset: number,
  alignOffset: number,
): CSSProperties {
  const viewport = readViewport();
  const known = viewport.width > 0 && viewport.height > 0;

  const fitsBottom = !known || anchor.top + anchor.height + sideOffset + panel.height <= viewport.height;
  const fitsTop = !known || anchor.top - sideOffset - panel.height >= 0;
  const fitsRight = !known || anchor.left + anchor.width + sideOffset + panel.width <= viewport.width;
  const fitsLeft = !known || anchor.left - sideOffset - panel.width >= 0;

  const requested = physicalSide(side);
  let resolved = requested;
  if (requested === "bottom" && !fitsBottom && fitsTop) resolved = "top";
  else if (requested === "top" && !fitsTop && fitsBottom) resolved = "bottom";
  else if (requested === "right" && !fitsRight && fitsLeft) resolved = "left";
  else if (requested === "left" && !fitsLeft && fitsRight) resolved = "right";

  // Only the axis keys the placement actually sets are written: a key present with `undefined`
  // makes Lynx drop the whole style object, which would leave the popup unpositioned.
  const startLeft = align === "center" ? anchor.left + anchor.width / 2 - panel.width / 2 + alignOffset : anchor.left + alignOffset;
  const endRight = viewport.width - anchor.left - anchor.width + alignOffset;
  const startTop = align === "center" ? anchor.top + anchor.height / 2 - panel.height / 2 + alignOffset : anchor.top + alignOffset;
  const endBottom = anchor.top + anchor.height - panel.height - alignOffset;

  // Lengths are written as px strings: Lynx applies an inline style object key by key, and a bare
  // number is dropped by the element engine, leaving the popup unpositioned.
  if (resolved === "top") {
    const bottom = px(viewport.height - anchor.top + sideOffset);
    return align === "end" ? { bottom, right: px(endRight) } : { bottom, left: px(startLeft) };
  }
  if (resolved === "left") {
    return { right: px(viewport.width - anchor.left + sideOffset), top: px(align === "end" ? endBottom : startTop) };
  }
  if (resolved === "right") {
    return { left: px(anchor.left + anchor.width + sideOffset), top: px(align === "end" ? endBottom : startTop) };
  }
  const top = px(anchor.top + anchor.height + sideOffset);
  return align === "end" ? { top, right: px(endRight) } : { top, left: px(startLeft) };
}

/**
 * The popup, anchored to the trigger's measured box.
 *
 * Figma `Menus and popovers` (88:495): `Menu`, `Account menu` and `Workspace menu`.
 * React portals it to `document.body` and lets Base UI position and dismiss it;
 * Lynx has neither, so the popup is a `position: fixed` view painted in place,
 * placed from the trigger's `layoutchange` box and closed by a transparent
 * full-viewport backdrop behind it. Because the popup is fixed it still escapes
 * an `overflow: hidden` ancestor, and the backdrop is what makes an outside tap
 * dismiss the menu. Its width stays capped below the viewport so the 304px
 * `paper` menu fits a 320px screen.
 *
 * Keyboard navigation and focus return are not available on Lynx; the rows are
 * tapped, and every item is announced as a button.
 *
 * @example
 * ```tsx
 * <Menu>
 *   <MenuTrigger>
 *     <text className="text-label-md text-text-primary">Account</text>
 *   </MenuTrigger>
 *   <MenuContent align="end">
 *     <MenuLabel>Workspaces</MenuLabel>
 *     <MenuItem icon={<Icon name="GearSix" />} trailing="⌘," onClick={openSettings}>
 *       Settings
 *     </MenuItem>
 *     <MenuSeparator />
 *     <MenuItem icon={<Icon name="Trash" />} danger onClick={remove}>
 *       Delete
 *     </MenuItem>
 *   </MenuContent>
 * </Menu>
 * ```
 */
export function MenuContent({
  surface = "solid",
  side = "bottom",
  align = "start",
  sideOffset = 8,
  alignOffset = 0,
  className,
  style,
  id,
  children,
}: MenuContentProps) {
  const { open, setOpen, anchor } = useMenuContext("MenuContent");
  const [panel, setPanel] = useState<PanelSize>({ width: 0, height: 0 });

  if (!open || !anchor) return null;

  const placement = popupPlacement(anchor, panel, side, align, sideOffset, alignOffset);

  return (
    <>
      <view
        className="fixed"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        bindtap={() => setOpen(false)}
        accessibility-element={false}
      />
      <view
        className={cn(
          "fixed z-50 flex flex-col gap-0.5 overflow-hidden p-1.5 motion-popup",
          surface === "glass" ? "w-[220px]" : surface === "paper" ? "w-[304px]" : "w-[256px]",
          "max-w-[calc(100vw-2rem)]",
          menuPopupClass[surface],
          className,
        )}
        style={{ ...placement, ...style }}
        id={id}
        bindlayoutchange={(event: LayoutChangeLike) => {
          const box = boxOf(event);
          setPanel((previous) =>
            previous.width === box.width && previous.height === box.height ? previous : { width: box.width, height: box.height },
          );
        }}
      >
        <SurfaceContext.Provider value={surface}>{children}</SurfaceContext.Provider>
      </view>
    </>
  );
}

/** Props for {@link MenuItem}: optional leading icon, description line and trailing shortcut. */
export type MenuItemProps = {
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
  /** Blocks the row and dims it; a tap does nothing and the menu stays open. @default false */
  disabled?: boolean;
  /**
   * Whether a tap closes the menu in addition to calling `onClick`.
   * @default true
   */
  closeOnClick?: boolean;
  /** Called when the row is tapped; the menu then closes unless `closeOnClick` is false. */
  onClick?: () => void;
  /** Text used for the accessible name; falls back to the rendered label. */
  label?: string;
  /** Extra classes merged onto the row. */
  className?: string;
  /** Inline style, merged onto the row's own. */
  style?: CSSProperties;
  /** Element id of the row, so a host can address it. */
  id?: string;
  /** The row's label. */
  children?: ReactNode;
};

/**
 * One row of a {@link MenuContent}: icon, label, optional description and trailing
 * shortcut. It closes the menu on tap, is disabled through `disabled` and paints
 * the pressed state with `active:` instead of Base UI's keyboard highlight.
 *
 * Part of {@link MenuContent}.
 */
export function MenuItem({
  icon,
  description,
  trailing,
  danger,
  selected,
  disabled = false,
  closeOnClick = true,
  onClick,
  label,
  className,
  style,
  id,
  children,
}: MenuItemProps) {
  const surface = useContext(SurfaceContext);
  const { setOpen } = useMenuContext("MenuItem");

  return (
    <view
      className={cn(
        "relative flex w-full flex-row items-center gap-2.5 motion-colors active:bg-overlay-ink-6",
        surface === "glass" ? "rounded-md px-3" : "rounded-[10px] px-2.5",
        description ? "h-12" : surface === "glass" ? "h-10" : "h-9",
        selected && "bg-bg-brand active:bg-bg-brand",
        disabled && "opacity-40",
        className,
      )}
      style={style}
      id={id}
      bindtap={() => {
        if (disabled) return;
        if (closeOnClick) setOpen(false);
        onClick?.();
      }}
      accessibility-element
      accessibility-traits={disabled ? "disabled" : "button"}
      accessibility-label={label}
    >
      {icon ? (
        <view className={cn("flex shrink-0 flex-row items-center", danger ? "text-text-danger" : surface === "glass" ? "text-text-secondary" : "text-text-primary")}>
          {icon}
        </view>
      ) : null}
      <view className="flex min-w-0 flex-1 flex-col">
        <text className={cn("text-label-md", danger ? "text-text-danger" : "text-text-primary")}>{children}</text>
        {description ? <text className="text-caption text-text-secondary">{description}</text> : null}
      </view>
      {trailing ? <view className="flex shrink-0 flex-row items-center">{trailing}</view> : null}
    </view>
  );
}

/** Props of {@link MenuSeparator}: which way the rule runs, and extra classes on its wrapper. */
type MenuSeparatorProps = {
  /**
   * `horizontal` (the default) separates stacked rows with a 1px line across the popup; `vertical`
   * draws a 16px column rule instead, for splitting two groups that sit side by side.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /** Extra classes merged onto the rule's wrapper. */
  className?: string;
  /** Inline style, merged onto the rule's own. */
  style?: CSSProperties;
};

/**
 * A 1px rule between groups of items, drawn full width inside the popup's own
 * `p-1.5` inset. Its wrapper adds `px-1.5` on glass and `px-2.5` on solid and
 * paper, so the line starts 12px from the popup edge on glass and 16px on the
 * others: on solid and paper it lines up with the row padding (`px-2.5`), while
 * the glass rows are inset further (`px-3`) and the rule runs wider than they do.
 *
 * Part of {@link MenuContent}.
 */
export function MenuSeparator({ orientation = "horizontal", className, style }: MenuSeparatorProps) {
  const surface = useContext(SurfaceContext);
  const vertical = orientation === "vertical";
  return (
    <view
      className={cn(
        "relative flex flex-row",
        vertical ? "h-4 items-center" : "py-1",
        surface === "glass" ? "px-1.5" : "px-2.5",
        className,
      )}
      style={style}
      accessibility-element={false}
      accessibility-role-description="separator"
    >
      <view className={cn("bg-overlay-ink-8", vertical ? "h-full w-px" : "h-px flex-1")} />
    </view>
  );
}

/** Props of {@link MenuLabel}: extra classes and the caption itself. */
type MenuLabelProps = {
  /** Extra classes merged onto the caption. */
  className?: string;
  /** The caption text, such as "Workspaces" or the account email. */
  children?: ReactNode;
};

/** A caption heading for a group of items, such as "Workspaces" or the account email. */
export function MenuLabel({ className, children }: MenuLabelProps) {
  return (
    <view className={cn("relative px-2.5 pt-2 pb-1", className)}>
      <text className="text-caption text-text-secondary">{children}</text>
    </view>
  );
}

/** Props of {@link MenuTile}: extra classes and the initial drawn inside. */
type MenuTileProps = {
  /** Extra classes merged onto the tile. */
  className?: string;
  /** The workspace initial. */
  children?: ReactNode;
};

/** A 28px rounded tile for a workspace initial, used as a `MenuItem` icon. */
export function MenuTile({ className, children }: MenuTileProps) {
  return (
    <view
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-sm bg-interactive-primary",
        className,
      )}
    >
      <text className="text-label-sm text-text-inverse">{children}</text>
    </view>
  );
}
