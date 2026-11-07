import { Children, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import sidebarPhoto from "../assets/sidebar-photo.jpg";
import { Icon } from "../icons";
import { useMediaQuery } from "../hooks";
import { cn } from "../lib/cn";
import { useHoronTheme } from "../provider";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React elements this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx `view` can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
  /** React's `nav`; on Lynx the column is a `view` carrying the navigation role. */
  nav: { className?: string; style?: CSSProperties; "aria-label"?: string };
  /** React's `span`; on Lynx a `view`, which needs its colour class on each `<text>` inside. */
  span: { className?: string; style?: CSSProperties };
  /** React's `button`; on Lynx a tappable `view` with the `button` trait. */
  button: {
    className?: string;
    style?: CSSProperties;
    id?: string;
    /** Runs when the row is tapped. */
    onClick?: () => void;
    /** Accessible name when the visible label is not the whole name. */
    "aria-label"?: string;
    /** Marks the row as the current page of a navigation trail. */
    "aria-current"?: "page" | "true" | "false" | boolean;
    /** The visible label. */
    children?: ReactNode;
  };
  /** React's `a`; on Lynx a `view` with the `link` trait, because there is no anchor element. */
  a: {
    className?: string;
    style?: CSSProperties;
    id?: string;
    /** Destination. Accepted for call-site parity; the tap arrives through `onClick`. */
    href?: string;
    /** Target window. Accepted for parity, inert on Lynx. */
    target?: string;
    /** Anchor relationship. Accepted for parity, inert on Lynx. */
    rel?: string;
    /** Runs when the link is tapped. */
    onClick?: () => void;
    /** Accessible name when the visible label is not the whole name. */
    "aria-label"?: string;
    /** Marks the row as the current page of a navigation trail. */
    "aria-current"?: "page" | "true" | "false" | boolean;
  };
};

/** A `div` prop set with an optional `className`, used by the parts that render a plain block. */
type DivProps = Omit<PortedElementProps["div"], "className"> & {
  /** Classes merged onto the element. */
  className?: string;
};
/** A `button` prop set with an optional `className`, used by the parts that render a control. */
type ButtonProps = Omit<PortedElementProps["button"], "className"> & {
  /** Classes merged onto the button. */
  className?: string;
};

/**
 * Props for {@link Sidebar}. Other navigation members (`aria-label`, `id`, handlers) land on the column.
 */
export type SidebarProps = Omit<PortedElementProps["nav"], "className"> & {
  /** Classes merged onto the column. */
  className?: string;
  /**
   * `glass` (default) is the thick-glass column. `photo` is the Paper app sidebar: the Horon photo
   * on the sky ground under a 55% white veil, with the thick glass kept for dark mode. `plain` paints
   * no fill or glass, so the column takes the color of the layout behind it, divided by a 1px border.
   * @default "glass"
   */
  surface?: "glass" | "photo" | "plain";
  /**
   * Drag the right edge to change the width, from the `md` breakpoint (768px) up.
   * Below `md` the handle is hidden and the sidebar keeps its fixed 280px width.
   * @default false
   */
  resizable?: boolean;
  /**
   * Starting width in px when `resizable`. A double tap on the handle is not available on Lynx, so
   * the handle only drags.
   * @default 280
   */
  defaultWidth?: number;
  /**
   * Narrowest width in px the handle can drag to.
   * @default 240
   */
  minWidth?: number;
  /**
   * Widest width in px the handle can drag to.
   * @default 400
   */
  maxWidth?: number;
  /** Called with the clamped width as it changes, during a drag too. */
  onWidthChange?: (width: number) => void;
  /**
   * Accessible name of the resize handle.
   * @default "Resize sidebar"
   */
  resizeLabel?: string;
  /** The column's content; rows, groups and the account card. */
  children?: ReactNode;
};

function clamp(value: number, min: number, max: number): number {
  return Math.round(Math.min(max, Math.max(min, value)));
}

/** The shape a Lynx touch event has; only the page x position is read. */
type TouchLike = { detail?: { x?: number } };

/**
 * Figma `Sidebar` (88:848): a 280px thick-glass column with a 1px right border, 16/12/12px padding.
 * With `resizable`, an 8px handle on the right edge drags the width between `minWidth` and `maxWidth`.
 *
 * Width is uncontrolled: the column keeps its own state, starts at `defaultWidth` and reports every
 * clamped change through `onWidthChange`. React made the handle keyboard operable and put it behind
 * `md`; Lynx has no keyboard on a touch engine, so the handle is touch-only and the breakpoint is
 * read through `useMediaQuery`. `surface="photo"` draws the Paper photo as a real `<image>` with the
 * 55% veil above it, because Lynx cannot attach a background image to a class.
 *
 * @example
 * ```tsx
 * import { Sidebar, SidebarGroup, SidebarHeader, SidebarItem } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <Sidebar resizable onWidthChange={(width) => console.log(width)}>
 *       <SidebarHeader initial="H" name="Horon" onCollapse={() => {}} />
 *       <SidebarGroup label="Workspace">
 *         <SidebarItem current>Home</SidebarItem>
 *         <SidebarItem count={3}>Inbox</SidebarItem>
 *       </SidebarGroup>
 *     </Sidebar>
 *   );
 * }
 * ```
 */
export function Sidebar({
  className,
  style,
  children,
  surface = "glass",
  resizable = false,
  defaultWidth = 280,
  minWidth = 240,
  maxWidth = 400,
  onWidthChange,
  resizeLabel = "Resize sidebar",
  "aria-label": ariaLabel,
}: SidebarProps) {
  const theme = useHoronTheme();
  const wide = useMediaQuery("(min-width: 768px)");
  const [width, setWidth] = useState(() => clamp(defaultWidth, minWidth, maxWidth));
  const [dragging, setDragging] = useState(false);
  // The drag base is state rather than a ref: a touch stream is a handful of events, and reading the
  // values from the render that created the handlers is simpler than mirroring them into a mutable box.
  const [drag, setDrag] = useState<{ x: number; width: number } | null>(null);

  const resize = (next: number) => {
    const clamped = clamp(next, minWidth, maxWidth);
    if (clamped === width) return;
    setWidth(clamped);
    onWidthChange?.(clamped);
  };

  const onStart = (event: TouchLike) => {
    const x = event.detail?.x;
    if (typeof x !== "number") return;
    setDrag({ x, width });
    setDragging(true);
  };

  const onMove = (event: TouchLike) => {
    const x = event.detail?.x;
    if (!drag || typeof x !== "number") return;
    resize(drag.width + x - drag.x);
  };

  const onEnd = () => {
    setDrag(null);
    setDragging(false);
  };

  const showHandle = resizable && wide;
  const appliedWidth = showHandle ? width : undefined;

  return (
    <view
      className={cn(
        // A definite width where there is room; `max-w-full` lets a narrower parent cap the column.
        "relative flex w-[280px] max-w-full min-w-0 flex-col items-stretch gap-0.5 overflow-hidden px-3 pt-4 pb-3",
        surface === "glass" && "bg-glass-thick",
        surface === "plain" && "border-r border-border-default",
        surface === "photo" && (theme.scheme === "dark" ? "bg-glass-thick" : "bg-[#eef3f8]"),
        className,
      )}
      style={{
        ...style,
        ...(appliedWidth === undefined ? {} : { width: `${appliedWidth}px` }),
        ...(showHandle && !dragging ? { transitionProperty: "width", transitionDuration: "200ms" } : {}),
      }}
      accessibility-element
      accessibility-role-description="navigation"
      accessibility-label={ariaLabel}
    >
      {/* `surface="photo"`: the photo keeps its bottom-anchored cover, and the veil sits above it. */}
      {surface === "photo" && theme.scheme !== "dark" ? (
        <view className="absolute inset-0" accessibility-elements-hidden>
          <image src={sidebarPhoto} mode="aspectFill" className="absolute inset-0 size-full" />
          <view className="absolute inset-0 bg-[#ffffff8c]" />
        </view>
      ) : null}
      {surface === "glass" && <LiquidGlass />}
      {children}
      {showHandle ? (
        <view
          className="absolute inset-y-0 right-0 z-10 flex w-2 flex-col items-end"
          accessibility-element
          accessibility-role-description="separator"
          accessibility-label={resizeLabel}
          accessibility-value={String(width)}
          bindtouchstart={onStart}
          bindtouchmove={onMove}
          bindtouchend={onEnd}
          bindtouchcancel={onEnd}
        >
          <view
            className={cn(
              "absolute inset-y-0 right-0 w-0.5 motion-colors",
              dragging ? "bg-text-brand" : "bg-transparent",
            )}
          />
        </view>
      ) : null}
    </view>
  );
}

/**
 * Props for {@link SidebarHeader}. Renders the workspace switch and an optional collapse button in
 * one 36px row.
 */
export type SidebarHeaderProps = {
  /** Workspace initial shown on the 28px ink tile. */
  initial: ReactNode;
  /** Workspace name next to the tile; truncated when the column is narrow. */
  name: ReactNode;
  /** Props for the workspace switch button, such as a menu trigger handle. */
  switchProps?: ButtonProps;
  /** Replaces the default switch, such as a `WorkspaceMenu` whose trigger is a `SidebarWorkspaceSwitch`. */
  switchSlot?: ReactNode;
  /** Shows the collapse button when set; it receives the tap and the caller hides the column. */
  onCollapse?: () => void;
  /**
   * Accessible name of the collapse button.
   * @default "Collapse sidebar"
   */
  collapseLabel?: string;
  /** Classes merged onto the header row. */
  className?: string;
};

/**
 * Props for {@link SidebarWorkspaceSwitch}: every button prop except the visible workspace label,
 * which arrives through `name` instead.
 */
export type SidebarWorkspaceSwitchProps = Omit<ButtonProps, "name"> & {
  /** Workspace initial on the 28px ink tile. */
  initial: ReactNode;
  /** Workspace name, truncated in the row. */
  name: ReactNode;
};

const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/**
 * The workspace switch button: 28px ink tile, name and up-down caret. React highlighted it while its
 * menu was open through `data-popup-open`; Lynx passes that state in as `aria-current`, which the host
 * menu sets, so the row tints while the switcher is open.
 *
 * Part of {@link Sidebar}.
 */
export function SidebarWorkspaceSwitch({ initial, name, className, onClick, ...props }: SidebarWorkspaceSwitchProps) {
  const active = props["aria-current"] === "page" || props["aria-current"] === "true";
  return (
    <view
      className={cn(
        "flex h-9 min-w-0 flex-1 flex-row items-center gap-1.5 rounded-[10px] pr-1 pl-2 motion-colors active:bg-overlay-ink-6",
        active && "bg-overlay-ink-6",
        className,
      )}
      style={props.style}
      bindtap={onClick}
      accessibility-element
      accessibility-traits="button"
      accessibility-label={props["aria-label"]}
      {...(props.id === undefined ? {} : { id: props.id })}
    >
      <view className="flex size-7 shrink-0 flex-row items-center justify-center rounded-sm bg-interactive-primary">
        {isPlainText(initial) ? (
          <text className="text-label-md text-text-inverse">{initial}</text>
        ) : (
          <view className="flex flex-row items-center justify-center">{initial}</view>
        )}
      </view>
      {isPlainText(name) ? (
        <text className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{name}</text>
      ) : (
        <view className="flex min-w-0 flex-1 flex-row items-center overflow-hidden">{name}</view>
      )}
      <view className="flex shrink-0" accessibility-elements-hidden>
        <Icon name="CaretUpDown" size={14} color="text-secondary" />
      </view>
    </view>
  );
}

/**
 * Header: workspace switch (tile, name, up-down caret) and an optional 28px collapse button. 10px gap below.
 *
 * Part of {@link Sidebar}. Pass `switchSlot` when the switch must open a menu; otherwise the built-in
 * `SidebarWorkspaceSwitch` is rendered with `switchProps` spread onto it.
 */
export function SidebarHeader({
  initial,
  name,
  switchProps,
  switchSlot,
  onCollapse,
  collapseLabel = "Collapse sidebar",
  className,
}: SidebarHeaderProps) {
  return (
    <view className={cn("relative mb-2.5 flex h-9 shrink-0 flex-row items-center gap-1.5", className)}>
      {switchSlot ?? <SidebarWorkspaceSwitch {...switchProps} name={name} initial={initial} />}
      {onCollapse ? (
        <view
          className="relative flex size-7 shrink-0 flex-row items-center justify-center rounded-sm text-text-secondary motion-colors active:bg-overlay-ink-10"
          bindtap={onCollapse}
          hit-slop="8px"
          accessibility-element
          accessibility-traits="button"
          accessibility-label={collapseLabel}
        >
          <Icon name="CaretLeft" size={16} color="text-secondary" />
        </view>
      ) : null}
    </view>
  );
}

/**
 * Props every sidebar row shares, whichever role it renders as.
 */
type SidebarItemCommonProps = {
  /** 18px icon, or a `SidebarProjectTile`. Lynx cannot resize a foreign `<svg>`, so pass the size to `<Icon>`. */
  icon?: ReactNode;
  /** Count on the right, such as unread items. */
  count?: ReactNode;
  /** Trailing 7px red dot marking the row for attention; the dot carries an accessible name but no role. */
  attention?: boolean;
  /** Marks the active row: 6% ink fill and the current-page accessibility value. */
  current?: boolean;
  /** Classes merged onto the row. */
  className?: string;
  /** The row label. */
  children?: ReactNode;
};

/**
 * With `href`, the row is announced as a link and takes the link members; without it, a button.
 * The `current` flag adds the current-page accessibility value to either.
 */
export type SidebarItemProps =
  | (SidebarItemCommonProps & {
      /** Destination; setting it makes the row announce itself as a link. */
      href: string;
    } & Omit<PortedElementProps["a"], "className" | "href" | "type">)
  | (SidebarItemCommonProps & {
      /** Leave it out to render a button instead of a link. */
      href?: undefined;
    } & ButtonProps);

/**
 * Figma sidebar `Item`: 32px row, 12px radius, 10px gap; the current item is 6% ink.
 * Pass `href` to announce the row as a link with the same look.
 *
 * Part of {@link Sidebar}.
 */
export function SidebarItem({ icon, count, attention, current, className, children, ...props }: SidebarItemProps) {
  const link = props.href !== undefined;
  const { style, onClick, "aria-label": ariaLabel, "aria-current": _ariaCurrent, id } = props;

  return (
    <view
      className={cn(
        "relative flex h-8 w-full shrink-0 flex-row items-center gap-2.5 rounded-md px-2.5 motion-colors",
        current ? "bg-overlay-ink-6" : "active:bg-overlay-ink-4",
        className,
      )}
      style={style}
      bindtap={onClick}
      accessibility-element
      accessibility-traits={link ? "link" : "button"}
      accessibility-label={ariaLabel}
      accessibility-value={current ? "current page" : undefined}
      {...(id === undefined ? {} : { id })}
    >
      {icon ? (
        <view className="flex shrink-0 flex-row items-center" accessibility-elements-hidden>
          {icon}
        </view>
      ) : null}
      {isPlainText(children) ? (
        <text className="min-w-0 flex-1 truncate text-label-md text-text-primary">{children}</text>
      ) : (
        <view className="flex min-w-0 flex-1 flex-row items-center overflow-hidden">{children}</view>
      )}
      {count !== undefined ? (
        isPlainText(count) ? (
          <text className="shrink-0 text-body-sm text-text-secondary">{count}</text>
        ) : (
          <view className="flex shrink-0 flex-row items-center">{count}</view>
        )
      ) : null}
      {attention ? (
        <view
          className="size-[7px] shrink-0 rounded-full bg-text-danger"
          accessibility-element
          accessibility-label="Needs attention"
        />
      ) : null}
    </view>
  );
}

/**
 * A 22px rounded tile with a 14px inverse icon, for project rows. Set the fill with `className`.
 *
 * Part of {@link Sidebar}. React sized the icon through `[&>svg]:size-3.5`; `<Icon>` takes the px
 * number instead, so the caller passes `size={14}`.
 */
export function SidebarProjectTile({
  className,
  style,
  children,
}: Omit<PortedElementProps["span"], "className"> & {
  /** Classes merged onto the tile; the fill color comes from here. */
  className?: string;
  /** The 14px icon. */
  children?: ReactNode;
}) {
  return (
    <view
      className={cn(
        "flex size-[22px] flex-row items-center justify-center rounded-xs bg-interactive-primary",
        className,
      )}
      style={style}
    >
      {isPlainText(children) ? (
        <text className="text-label-sm text-text-inverse">{children}</text>
      ) : (
        <view className="flex flex-row items-center justify-center">{children}</view>
      )}
    </view>
  );
}

/**
 * Props for {@link SidebarGroup}.
 */
export type SidebarGroupProps = {
  /** Group caption; also the collapsible trigger's label. */
  label: ReactNode;
  /**
   * Whether the group starts expanded.
   * @default true
   */
  defaultOpen?: boolean;
  /** Rows or projects inside the group. */
  children: ReactNode;
  /** Classes merged onto the group. */
  className?: string;
};

/**
 * A collapsible group: 28px label in secondary text with a 14px caret, 14px above.
 *
 * Part of {@link Sidebar}. The group is uncontrolled after mount; the caret rotates from pointing
 * right (collapsed) to down (open). Lynx has no height-measuring panel transition, so the panel is
 * drawn only while open and fades in through the shared motion utility.
 */
export function SidebarGroup({ label, defaultOpen = true, children, className }: SidebarGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <view className={cn("relative mt-3.5 flex shrink-0 flex-col gap-0.5", className)}>
      <view
        className="flex h-7 flex-row items-center gap-1 self-start rounded-sm px-2.5 motion-colors active:bg-overlay-ink-4"
        bindtap={() => setOpen(!open)}
        accessibility-element
        accessibility-traits="button"
        accessibility-value={open ? "expanded" : "collapsed"}
      >
        {isPlainText(label) ? (
          <text className="text-label-md text-text-secondary">{label}</text>
        ) : (
          <view className="flex flex-row items-center">{label}</view>
        )}
        <view
          className="flex"
          accessibility-elements-hidden
          style={{
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transitionProperty: "transform",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Icon name="CaretDown" size={14} color="text-secondary" />
        </view>
      </view>
      {open ? (
        <view className="flex shrink-0 flex-col gap-0.5 motion-fade">{children}</view>
      ) : null}
    </view>
  );
}

const ROW = 32;
const GAP = 2;

/** Connector path of the Figma `Tree`: one 1.5px line with a 9px curve into the middle of each child row. */
function branchesPath(count: number): string {
  const centers = Array.from({ length: count }, (_, index) => ROW / 2 + index * (ROW + GAP));
  const last = centers.at(-1) ?? 0;
  const trunk = `M0.75 0V${last - 9}`;
  const branches = centers.map((center) => {
    const start = center - 9;
    return `M0.75 ${start}C0.75 ${start + 4.909} 4.841 ${center} 9.75 ${center}H13.75`;
  });
  return [trunk, ...branches].join("");
}

/**
 * Figma `Tree`: nested sidebar items with 16px icons, 20px in, joined to the parent by curved connectors.
 *
 * Part of {@link Sidebar}. The connector is one SVG path computed from the child count, so it
 * assumes 32px rows with a 2px gap; pass the child rows directly rather than wrapping them.
 */
// prettier-ignore
export function SidebarTree({ children, className }: {
  /** Child rows; their count and order decide the connector shape. */
  children: ReactNode;
  /** Classes merged onto the tree wrapper. */
  className?: string;
}) {
  const theme = useHoronTheme();
  const count = Children.count(children);
  const height = ROW / 2 + Math.max(0, count - 1) * (ROW + GAP) + 0.75;
  const content = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="${height}" viewBox="0 0 16 ${height}" fill="none"><path d="${branchesPath(count)}" stroke="${theme.color("overlay-ink-16")}" stroke-width="1.5"/></svg>`;

  return (
    // A plain flex row: the connector column, then the rows. React's `pl-5` indent lives on the wrapper.
    // `shrink-0`: the connector column is a fixed 16px box, and without it a squeezed
    // column would let the sibling row list overflow over the next project row.
    <view className={cn("relative flex shrink-0 flex-row items-start pl-5", className)}>
      <view className="shrink-0" style={{ width: "16px", height: `${height}px` }} accessibility-elements-hidden>
        <svg content={content} style={{ width: "16px", height: `${height}px` }} />
      </view>
      <view className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</view>
    </view>
  );
}

/**
 * Pushes the account card to the bottom.
 *
 * Part of {@link Sidebar}; it grows to fill the remaining column height.
 */
export function SidebarSpacer() {
  return <view className="min-h-px flex-1" accessibility-elements-hidden />;
}

/**
 * Props for {@link SidebarAccount}: every button prop plus the identity lines it shows.
 */
export type SidebarAccountProps = ButtonProps & {
  /** Initials on the 36px sky avatar tile. */
  initials: ReactNode;
  /** Account name. */
  name: ReactNode;
  /** Email line under the name. */
  email?: ReactNode;
};

/**
 * Figma sidebar `Account`: a 54px row with a 36px sky avatar tile and an up-down caret.
 *
 * Part of {@link Sidebar}. The row is a button, so pair it with a menu when it should open an
 * account switcher.
 */
export function SidebarAccount({ initials, name, email, className, onClick, ...props }: SidebarAccountProps) {
  return (
    <view
      className={cn(
        "relative flex w-full shrink-0 flex-row items-center gap-2.5 rounded-lg py-2 pr-2 pl-1.5 motion-colors active:bg-overlay-ink-4",
        className,
      )}
      style={props.style}
      bindtap={onClick}
      accessibility-element
      accessibility-traits="button"
      accessibility-label={props["aria-label"]}
      {...(props.id === undefined ? {} : { id: props.id })}
    >
      <view className="flex size-9 shrink-0 flex-row items-center justify-center rounded-[10px] bg-sky-200">
        {isPlainText(initials) ? (
          <text className="text-label-md text-surface-ink">{initials}</text>
        ) : (
          <view className="flex flex-row items-center justify-center">{initials}</view>
        )}
      </view>
      <view className="flex min-w-0 flex-1 flex-col">
        {isPlainText(name) ? (
          <text className="truncate text-label-md text-text-primary">{name}</text>
        ) : (
          <view className="flex min-w-0 flex-row items-center overflow-hidden">{name}</view>
        )}
        {email ? (
          isPlainText(email) ? (
            <text className="truncate text-caption text-text-secondary">{email}</text>
          ) : (
            <view className="flex min-w-0 flex-row items-center overflow-hidden">{email}</view>
          )
        ) : null}
      </view>
      <view className="flex shrink-0" accessibility-elements-hidden>
        <Icon name="CaretUpDown" size={16} color="text-primary" />
      </view>
    </view>
  );
}

/**
 * Props for {@link SidebarProject}.
 */
export type SidebarProjectProps = {
  /** A `SidebarProjectTile`. */
  icon: ReactNode;
  /** Project name; truncated in the row. */
  label: ReactNode;
  /** Marks the active project: 6% ink row and `aria-current="page"`. */
  current?: boolean;
  /**
   * Whether the project starts expanded in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;
  /** Expanded state in controlled mode; pass `onOpenChange` with it. */
  open?: boolean;
  /** Fires with the next expanded state when the row is toggled. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The project's "More" control, such as a `MenuTrigger` around a `SidebarProjectMore`. It replaces
   * the chevron while the project is open.
   */
  actions?: ReactNode;
  /** Chats and documents in the project, shown in a `SidebarTree` when open. */
  children?: ReactNode;
  /** Classes merged onto the project block. */
  className?: string;
};

/**
 * Figma sidebar project row (88:848, Menu=Project 314:12407): tile, name and a
 * 14px chevron (down when open). An open project shows the 16px "More" button in
 * place of the chevron, on a 6% ink row; a collapsed project keeps the chevron.
 *
 * Part of {@link Sidebar}. The expanded state works uncontrolled (`defaultOpen`) or controlled
 * (`open` + `onOpenChange`). A project without children renders no panel and no chevron; the
 * trigger still toggles the open state, and any `actions` stay visible.
 */
export function SidebarProject({
  icon,
  label,
  current,
  defaultOpen = false,
  open,
  onOpenChange,
  actions,
  children,
  className,
}: SidebarProjectProps) {
  const hasChildren = Children.count(children) > 0;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const handleOpenChange = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <view className={cn("flex flex-col gap-0.5", className)}>
      <view
        className={cn(
          "relative flex h-8 shrink-0 flex-row items-center rounded-md motion-colors",
          current ? "bg-overlay-ink-6" : "active:bg-overlay-ink-4",
        )}
      >
        <view
          className="flex h-8 min-w-0 flex-1 flex-row items-center gap-2.5 rounded-md px-2.5"
          bindtap={() => handleOpenChange(!isOpen)}
          accessibility-element
          accessibility-traits="button"
          accessibility-value={current ? "current page" : isOpen ? "expanded" : "collapsed"}
        >
          <view className="flex shrink-0 flex-row items-center">{icon}</view>
          {isPlainText(label) ? (
            <text className="min-w-0 flex-1 truncate text-label-md text-text-primary">{label}</text>
          ) : (
            <view className="flex min-w-0 flex-1 flex-row items-center overflow-hidden">{label}</view>
          )}
          {hasChildren && (actions === undefined || !isOpen) ? (
            <view
              className="flex shrink-0"
              accessibility-elements-hidden
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transitionProperty: "transform",
                transitionDuration: "200ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <Icon name="CaretRight" size={14} color="text-secondary" />
            </view>
          ) : null}
        </view>
        {/* React hid the slot with `invisible` while a closed project kept its chevron; not painting it
         * also keeps the tap away from a control the reader cannot see. */}
        {actions !== undefined && (!hasChildren || isOpen) ? (
          <view className="absolute right-2.5 flex flex-row items-center">{actions}</view>
        ) : null}
      </view>
      {hasChildren && isOpen ? (
        <view className="motion-fade shrink-0">
          <SidebarTree>{children}</SidebarTree>
        </view>
      ) : null}
    </view>
  );
}

/**
 * Props for {@link SidebarProjectMore}: every button prop plus the accessible label.
 */
export type SidebarProjectMoreProps = ButtonProps & {
  /**
   * Accessible name of the button.
   * @default "Project actions"
   */
  label?: string;
};

/**
 * The 16px "More" button of a project row.
 *
 * Part of {@link Sidebar}; its tap target is widened to 44px by `hit-slop` so the small glyph stays
 * easy to hit without moving the painted box.
 */
export function SidebarProjectMore({ label = "Project actions", className, onClick, ...props }: SidebarProjectMoreProps) {
  return (
    <view
      className={cn(
        "relative flex size-4 flex-row items-center justify-center rounded-xs motion-colors active:bg-overlay-ink-6",
        className,
      )}
      style={props.style}
      bindtap={onClick}
      hit-slop="14px"
      accessibility-element
      accessibility-traits="button"
      accessibility-label={label}
      {...(props.id === undefined ? {} : { id: props.id })}
    >
      <Icon name="DotsThree" size={16} color="text-primary" />
    </view>
  );
}

/**
 * Props for {@link SidebarAddButton}: every button prop plus the trailing icon.
 */
export type SidebarAddButtonProps = ButtonProps & {
  /** Icon after the label; defaults to a 16px plus circle. @default a 16px plus-circle (`PlusCircle`) icon */
  icon?: ReactNode;
};

/**
 * Figma `Add project`: a 36px button with a 1px inside dashed border (4/3 dash,
 * 20% ink), label then a 16px plus-circle, 12px above. The border is an SVG rect
 * so the dash matches; its 2px stroke is clipped to the inner 1px.
 *
 * Part of {@link Sidebar}.
 */
export function SidebarAddButton({ icon, className, children, onClick, ...props }: SidebarAddButtonProps) {
  const theme = useHoronTheme();
  const content = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none"><rect width="100%" height="100%" rx="10" stroke="${theme.color("overlay-ink-20")}" stroke-width="2" stroke-dasharray="4 3"/></svg>`;

  return (
    <view
      className={cn(
        "relative mt-2 flex h-9 w-full shrink-0 flex-row items-center justify-center gap-1.5 rounded-[10px] motion-colors active:bg-overlay-ink-4",
        className,
      )}
      style={props.style}
      bindtap={onClick}
      accessibility-element
      accessibility-traits="button"
      accessibility-label={props["aria-label"]}
      {...(props.id === undefined ? {} : { id: props.id })}
    >
      <view className="pointer-events-none absolute inset-0 size-full" accessibility-elements-hidden>
        <svg content={content} style={{ width: "100%", height: "100%" }} />
      </view>
      <view className="relative flex flex-row items-center gap-1.5">
        {isPlainText(children) ? <text className="text-label-md text-text-secondary">{children}</text> : children}
        <view className="flex flex-row items-center" accessibility-elements-hidden>
          {icon ?? <Icon name="PlusCircle" size={16} color="text-secondary" />}
        </view>
      </view>
    </view>
  );
}

/**
 * A block prop set with an optional `className`, exported so callers can type their own sidebar
 * pieces the same way the internal parts do.
 */
export type { DivProps as SidebarDivProps };
