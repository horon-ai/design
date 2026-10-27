import { Collapsible } from "@base-ui/react/collapsible";
import { CaretDown, CaretLeft, CaretRight, CaretUpDown, DotsThree, PlusCircle } from "@phosphor-icons/react";
import { Children, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

type DivProps = Omit<ComponentProps<"div">, "className"> & { className?: string };
type ButtonProps = Omit<ComponentProps<"button">, "className"> & { className?: string };

/** Figma `Sidebar` (88:848): a 280px thick-glass column with a 1px right border, 16/12/12px padding. */
export function Sidebar({
  className,
  children,
  ...props
}: Omit<ComponentProps<"nav">, "className"> & { className?: string }) {
  return (
    <nav
      className={cn(
        "relative flex w-70 flex-col items-stretch gap-0.5 overflow-clip border-r border-border-default bg-glass-thick px-3 pt-4 pb-3",
        className,
      )}
      {...props}
    >
      <LiquidGlass tier="thick" />
      {children}
    </nav>
  );
}

export type SidebarHeaderProps = {
  /** Workspace initial shown on the 28px ink tile. */
  initial: ReactNode;
  name: ReactNode;
  /** Props for the workspace switch button, such as a `MenuTrigger` render target. */
  switchProps?: ButtonProps;
  onCollapse?: () => void;
  collapseLabel?: string;
  className?: string;
};

/** Header: workspace switch (tile, name, up-down caret) and an optional 28px collapse button. 10px gap below. */
export function SidebarHeader({
  initial,
  name,
  switchProps,
  onCollapse,
  collapseLabel = "Collapse sidebar",
  className,
}: SidebarHeaderProps) {
  const { className: switchClass, ...switchRest } = switchProps ?? {};
  return (
    <div className={cn("relative mb-3 flex h-9 items-center gap-1.5", className)}>
      <button
        type="button"
        className={cn(
          "flex h-9 min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded-[10px] pr-1 pl-2 text-left hover:bg-overlay-ink-6 data-popup-open:bg-overlay-ink-6",
          "focus-visible:outline-2 focus-visible:outline-text-brand",
          switchClass,
        )}
        {...switchRest}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-interactive-primary text-label-md text-text-inverse">
          {initial}
        </span>
        <span className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{name}</span>
        <CaretUpDown aria-hidden className="size-3.5 shrink-0 text-text-secondary" />
      </button>
      {onCollapse && (
        <button
          type="button"
          aria-label={collapseLabel}
          onClick={onCollapse}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-overlay-ink-8 bg-bg-surface-70 text-text-secondary focus-visible:outline-2 focus-visible:outline-text-brand"
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
    <Collapsible.Root defaultOpen={defaultOpen} className={cn("relative mt-4 flex flex-col gap-0.5", className)}>
      <Collapsible.Trigger className="group flex h-7 w-fit cursor-pointer items-center gap-1 px-2.5 text-label-md text-text-secondary focus-visible:outline-2 focus-visible:outline-text-brand">
        {label}
        <CaretDown
          aria-hidden
          className="size-3.5 transition-transform group-not-data-panel-open:-rotate-90 group-data-panel-open:rotate-0"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="flex flex-col gap-0.5">{children}</Collapsible.Panel>
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
        "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2 pr-2 pl-1.5 text-left hover:bg-overlay-ink-4 data-popup-open:bg-overlay-ink-6",
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
              <CaretRight className="group-data-panel-open/trigger:hidden" />
              <CaretDown className="hidden group-data-panel-open/trigger:block" />
            </span>
          )}
        </Collapsible.Trigger>
        {actions !== undefined && (
          <span className="absolute right-2.5 flex opacity-0 group-focus-within/project:opacity-100 group-hover/project:opacity-100 group-has-data-popup-open/project:opacity-100">
            {actions}
          </span>
        )}
      </div>
      {hasChildren && (
        <Collapsible.Panel>
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
        "relative mt-2.5 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[10px] text-label-md text-text-secondary hover:bg-overlay-ink-4",
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
