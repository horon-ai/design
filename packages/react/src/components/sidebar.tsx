import { Collapsible } from "@base-ui/react/collapsible";
import { CaretDown, CaretLeft, CaretUpDown } from "@phosphor-icons/react";
import { Children, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

type DivProps = Omit<ComponentProps<"div">, "className"> & { className?: string };
type ButtonProps = Omit<ComponentProps<"button">, "className"> & { className?: string };

/** Figma `Sidebar` (Panels 88:808): a 280px thick-glass column, 24px radius, 16/12/12px padding. */
export function Sidebar({
  className,
  children,
  ...props
}: Omit<ComponentProps<"nav">, "className"> & { className?: string }) {
  return (
    <nav
      className={cn(
        "relative flex w-70 flex-col items-stretch gap-0.5 overflow-clip rounded-[24px] border border-glass-rim-strong bg-glass-thick px-3 pt-4 pb-3",
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

/** Header: workspace switch (tile, name, up-down caret) and the 28px collapse button. 10px gap below. */
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
    <div className={cn("relative mb-2.5 flex h-9 items-center gap-1.5", className)}>
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
      {icon && <span className="flex shrink-0 [&>svg]:size-4.5">{icon}</span>}
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

/** Figma `Tree`: nested sidebar items, 18px in, joined to the parent by curved connectors. */
export function SidebarTree({ children, className }: { children: ReactNode; className?: string }) {
  const count = Children.count(children);
  const height = ROW / 2 + (count - 1) * (ROW + GAP) + 0.75;
  return (
    <div className={cn("relative flex items-start pl-4.5", className)}>
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

/** Figma sidebar `Account`: 75% surface card (95% while its menu is open), 36px sky avatar tile. */
export function SidebarAccount({ initials, name, email, className, ...props }: SidebarAccountProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg bg-bg-surface-75 py-2 pr-2.5 pl-2 text-left data-popup-open:bg-bg-surface-95",
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
      <CaretUpDown aria-hidden className="size-4 shrink-0 text-text-secondary" />
    </button>
  );
}

export type { DivProps as SidebarDivProps };
