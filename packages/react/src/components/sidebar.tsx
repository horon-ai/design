import { Collapsible } from "@base-ui/react/collapsible";
import { CaretDown, CaretLeft, CaretRight, CaretUpDown, DotsThree, PlusCircle } from "@phosphor-icons/react";
import {
  Children,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

type DivProps = Omit<ComponentProps<"div">, "className"> & { className?: string };
type ButtonProps = Omit<ComponentProps<"button">, "className"> & { className?: string };

export type SidebarProps = Omit<ComponentProps<"nav">, "className"> & {
  className?: string;
  /**
   * `glass` (default) is the thick-glass column. `photo` is the Paper app sidebar: the Horon photo
   * on #EEF3F8 under a 55% white veil, with the thick glass kept for dark mode.
   */
  surface?: "glass" | "photo";
  /**
   * Drag the right edge to change the width, from the `md` breakpoint (768px) up.
   * Below `md` the handle is hidden and the sidebar keeps its fixed 280px width.
   */
  resizable?: boolean;
  /** Starting width in px when `resizable`. Double-clicking the handle returns to it. */
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  /** Called with the clamped width as it changes, during a drag too. */
  onWidthChange?: (width: number) => void;
  resizeLabel?: string;
};

const RESIZE_STEP = 16;

function clamp(value: number, min: number, max: number): number {
  return Math.round(Math.min(max, Math.max(min, value)));
}

/**
 * Figma `Sidebar` (88:848): a 280px thick-glass column with a 1px right border, 16/12/12px padding.
 * With `resizable`, an 8px handle on the right edge drags the width between `minWidth` and `maxWidth`.
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
  ...props
}: SidebarProps) {
  const [width, setWidth] = useState(() => clamp(defaultWidth, minWidth, maxWidth));
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; width: number } | null>(null);

  const resize = (next: number) => {
    const clamped = clamp(next, minWidth, maxWidth);
    if (clamped === width) return;
    setWidth(clamped);
    onWidthChange?.(clamped);
  };

  // Keep the col-resize cursor and stop text selection while the pointer is off the handle mid-drag.
  useEffect(() => {
    if (!dragging) return undefined;
    const root = document.documentElement.style;
    const previous = { cursor: root.cursor, userSelect: root.userSelect };
    root.cursor = "col-resize";
    root.userSelect = "none";
    return () => {
      root.cursor = previous.cursor;
      root.userSelect = previous.userSelect;
    };
  }, [dragging]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, width };
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    resize(drag.current.width + event.clientX - drag.current.x);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = {
      ArrowLeft: width - RESIZE_STEP,
      ArrowRight: width + RESIZE_STEP,
      Home: minWidth,
      End: maxWidth,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    resize(next);
  };

  return (
    <nav
      className={cn(
        "relative flex w-70 flex-col items-stretch gap-0.5 overflow-clip border-r border-border-default bg-glass-thick px-3 pt-4 pb-3",
        surface === "photo" && "bg-sidebar-photo dark:bg-glass-thick dark:bg-none",
        resizable && "md:w-(--sidebar-width)",
        className,
      )}
      style={resizable ? ({ ...style, "--sidebar-width": `${width}px` } as CSSProperties) : style}
      {...props}
    >
      {surface === "photo" ? null : <LiquidGlass tier="thick" />}
      {children}
      {resizable && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={resizeLabel}
          aria-valuenow={width}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          tabIndex={0}
          data-dragging={dragging || undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onKeyDown={onKeyDown}
          onDoubleClick={() => resize(defaultWidth)}
          className="group/resize absolute inset-y-0 right-0 z-10 hidden w-2 cursor-col-resize touch-none outline-none md:block"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 right-0 w-0.5 transition-colors duration-150 group-hover/resize:bg-overlay-ink-16 group-focus-visible/resize:bg-text-brand group-data-dragging/resize:bg-text-brand"
          />
        </div>
      )}
    </nav>
  );
}

export type SidebarHeaderProps = {
  /** Workspace initial shown on the 28px ink tile. */
  initial: ReactNode;
  name: ReactNode;
  /** Props for the workspace switch button, such as a `MenuTrigger` render target. */
  switchProps?: ButtonProps;
  /** Replaces the default switch, such as a `WorkspaceMenu` whose trigger is a `SidebarWorkspaceSwitch`. */
  switchSlot?: ReactNode;
  onCollapse?: () => void;
  collapseLabel?: string;
  className?: string;
};

export type SidebarWorkspaceSwitchProps = Omit<ButtonProps, "name"> & { initial: ReactNode; name: ReactNode };

/** The workspace switch button: 28px ink tile, name and up-down caret. Highlights while its menu is open. */
export function SidebarWorkspaceSwitch({ initial, name, className, ...props }: SidebarWorkspaceSwitchProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded-[10px] pr-1 pl-2 text-left motion-colors hover:bg-overlay-ink-6 data-popup-open:bg-overlay-ink-6",
        "focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-interactive-primary text-label-md text-text-inverse">
        {initial}
      </span>
      <span className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{name}</span>
      <CaretUpDown aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
    </button>
  );
}

/** Header: workspace switch (tile, name, up-down caret) and an optional 28px collapse button. 10px gap below. */
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
    <div className={cn("relative mb-2.5 flex h-9 items-center gap-1.5", className)}>
      {switchSlot ?? <SidebarWorkspaceSwitch {...switchProps} name={name} initial={initial} />}
      {onCollapse && (
        <button
          type="button"
          aria-label={collapseLabel}
          onClick={onCollapse}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-secondary focus-visible:outline-2 focus-visible:outline-text-brand"
        >
          <CaretLeft aria-hidden className="size-4" />
        </button>
      )}
    </div>
  );
}

export type SidebarItemProps = ButtonProps & {
  /** 18px icon, or a `SidebarProjectTile`. */
  icon?: ReactNode;
  /** Count on the right, such as unread items. */
  count?: ReactNode;
  /** Trailing 7px red dot for attention. */
  attention?: boolean;
  current?: boolean;
};

/** Figma sidebar `Item`: 32px row, 12px radius, 10px gap; the current item is 6% ink. */
export function SidebarItem({ icon, count, attention, current, className, children, ...props }: SidebarItemProps) {
  return (
    <button
      type="button"
      aria-current={current ? "page" : undefined}
      className={cn(
        "relative flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-left text-label-md text-text-primary",
        "motion-colors",
        current ? "bg-overlay-ink-6" : "hover:bg-overlay-ink-4",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      {icon && (
        <span data-slot="icon" className="flex shrink-0 [&>svg]:size-4.5">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {count !== undefined && <span className="shrink-0 text-body-sm text-text-secondary">{count}</span>}
      {attention && <span aria-label="Needs attention" className="size-[7px] shrink-0 rounded-full bg-text-danger" />}
    </button>
  );
}

/** A 22px rounded tile with a 14px inverse icon, for project rows. Set the fill with `className`. */
export function SidebarProjectTile({
  className,
  ...props
}: Omit<ComponentProps<"span">, "className"> & { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-5.5 items-center justify-center rounded-xs bg-interactive-primary text-text-inverse [&>svg]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

export type SidebarGroupProps = {
  label: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
};

/** A collapsible group: 28px label in secondary text with a 14px caret, 14px above. */
export function SidebarGroup({ label, defaultOpen = true, children, className }: SidebarGroupProps) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen} className={cn("relative mt-3.5 flex flex-col gap-0.5", className)}>
      <Collapsible.Trigger className="group flex h-7 w-fit cursor-pointer items-center gap-1 px-2.5 text-label-md text-text-secondary focus-visible:outline-2 focus-visible:outline-text-brand">
        {label}
        <CaretDown
          aria-hidden
          className="size-3.5 transition-transform duration-200 ease-out-quint group-not-data-panel-open:-rotate-90 group-data-panel-open:rotate-0"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="flex motion-collapse flex-col gap-0.5">{children}</Collapsible.Panel>
    </Collapsible.Root>
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

/** Figma `Tree`: nested sidebar items with 16px icons, 20px in, joined to the parent by curved connectors. */
export function SidebarTree({ children, className }: { children: ReactNode; className?: string }) {
  const count = Children.count(children);
  const height = ROW / 2 + (count - 1) * (ROW + GAP) + 0.75;
  return (
    <div className={cn("relative flex items-start pl-5 [&_[data-slot=icon]>svg]:size-4", className)}>
      <svg
        aria-hidden
        width="16"
        height={height}
        viewBox={`0 0 16 ${height}`}
        fill="none"
        className="shrink-0 overflow-visible"
      >
        <path d={branchesPath(count)} strokeWidth="1.5" className="stroke-overlay-ink-16" />
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</div>
    </div>
  );
}

/** Pushes the account card to the bottom. */
export function SidebarSpacer() {
  return <div aria-hidden className="min-h-px flex-1" />;
}

export type SidebarAccountProps = ButtonProps & {
  initials: ReactNode;
  name: ReactNode;
  email?: ReactNode;
};

/** Figma sidebar `Account`: a 54px row with a 36px sky avatar tile and an up-down caret. */
export function SidebarAccount({ initials, name, email, className, ...props }: SidebarAccountProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2 pr-2 pl-1.5 text-left motion-colors hover:bg-overlay-ink-4 data-popup-open:bg-overlay-ink-6",
        "focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-sky-200 text-label-md text-surface-ink">
        {initials}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-label-md text-text-primary">{name}</span>
        {email && <span className="truncate text-caption text-text-secondary">{email}</span>}
      </span>
      <CaretUpDown aria-hidden className="size-4 shrink-0 text-text-primary" />
    </button>
  );
}

export type SidebarProjectProps = {
  /** A `SidebarProjectTile`. */
  icon: ReactNode;
  label: ReactNode;
  current?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * The project's "More" control, such as a `MenuTrigger` whose render target is
   * `<SidebarProjectMore />`. It replaces the chevron while the row is hovered or its menu is open.
   */
  actions?: ReactNode;
  /** Chats and documents in the project, shown in a `SidebarTree` when open. */
  children?: ReactNode;
  className?: string;
};

/**
 * Figma sidebar project row (88:848, Menu=Project 314:12407): tile, name and a
 * 14px chevron (down when open). Hovering the row, or opening its menu, shows the
 * 16px "More" button in place of the chevron, on a 6% ink row.
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
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn("flex flex-col gap-0.5", className)}
    >
      <div
        className={cn(
          "group/project relative flex h-8 items-center rounded-md has-data-popup-open:bg-overlay-ink-6",
          "motion-colors",
          current ? "bg-overlay-ink-6" : "hover:bg-overlay-ink-6",
        )}
      >
        <Collapsible.Trigger
          aria-current={current ? "page" : undefined}
          className={cn(
            "group/trigger flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-left text-label-md text-text-primary",
            "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
          )}
        >
          <span data-slot="icon" className="flex shrink-0">
            {icon}
          </span>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {hasChildren && (
            <span
              aria-hidden
              className={cn(
                "flex size-3.5 shrink-0 [&>svg]:size-3.5",
                actions !== undefined && "group-hover/project:invisible group-has-data-popup-open/project:invisible",
              )}
            >
              <CaretRight className="transition-transform duration-200 ease-out-quint group-data-panel-open/trigger:rotate-90" />
            </span>
          )}
        </Collapsible.Trigger>
        {actions !== undefined && (
          <span className="absolute right-2.5 flex opacity-0 transition-opacity duration-150 group-focus-within/project:opacity-100 group-hover/project:opacity-100 group-has-data-popup-open/project:opacity-100">
            {actions}
          </span>
        )}
      </div>
      {hasChildren && (
        <Collapsible.Panel className="motion-collapse">
          <SidebarTree>{children}</SidebarTree>
        </Collapsible.Panel>
      )}
    </Collapsible.Root>
  );
}

export type SidebarProjectMoreProps = ButtonProps & { label?: string };

/** The 16px "More" button of a project row. */
export function SidebarProjectMore({ label = "Project actions", className, ...props }: SidebarProjectMoreProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex size-4 cursor-pointer items-center justify-center rounded-xs text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      <DotsThree aria-hidden className="size-4" />
    </button>
  );
}

export type SidebarAddButtonProps = ButtonProps & { icon?: ReactNode };

/**
 * Figma `Add project`: a 36px button with a 1px inside dashed border (4/3 dash,
 * 20% ink), label then a 16px plus-circle, 12px above. The border is an SVG rect
 * so the dash matches; its 2px stroke is clipped to the inner 1px.
 */
const addIcon = <PlusCircle />;

export function SidebarAddButton({ icon = addIcon, className, children, ...props }: SidebarAddButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative mt-2 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] text-label-md text-text-secondary motion-colors hover:bg-overlay-ink-4",
        "focus-visible:outline-2 focus-visible:outline-text-brand [&>[data-slot=icon]]:size-4",
        className,
      )}
      {...props}
    >
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full text-overlay-ink-20">
        <rect
          width="100%"
          height="100%"
          rx="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      </svg>
      {children}
      <span data-slot="icon" className="flex [&>svg]:size-4">
        {icon}
      </span>
    </button>
  );
}

export type { DivProps as SidebarDivProps };
