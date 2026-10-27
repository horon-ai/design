import { Plus } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

type WithClass<T> = Omit<T, "className"> & { className?: string };

/** Figma `Data table` (192:9046): a solid surface card, 20px radius, 1px default border. */
export function DataTable({ className, ...props }: WithClass<ComponentProps<"div">>) {
  return (
    <div
      className={cn("flex flex-col overflow-clip rounded-xl border border-border-default bg-bg-surface", className)}
      {...props}
    />
  );
}

export type DataTableHeaderProps = {
  /** 16px icon on the 26px brand tile. */
  icon?: ReactNode;
  title: ReactNode;
  /** Trailing 16px icon buttons. */
  actions?: ReactNode;
  className?: string;
};

export function DataTableHeader({ icon, title, actions, className }: DataTableHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3 px-6 py-4.5", className)}>
      {icon && (
        <span className="flex size-6.5 shrink-0 items-center justify-center rounded-[7px] bg-bg-brand text-text-brand [&>svg]:size-4">
          {icon}
        </span>
      )}
      <h3 className="min-w-0 flex-1 truncate text-label-lg text-text-primary">{title}</h3>
      {actions && <div className="flex items-center gap-3 text-text-secondary [&_svg]:size-4">{actions}</div>}
    </div>
  );
}

export function DataTableTable({ className, ...props }: WithClass<ComponentProps<"table">>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-left", className)} {...props} />
    </div>
  );
}

/** Header cell: 52px, 14px icon and label-md secondary text. */
export function DataTableHead({
  icon,
  className,
  children,
  ...props
}: WithClass<ComponentProps<"th">> & { icon?: ReactNode }) {
  return (
    <th
      className={cn(
        "font-normal h-13 border-y border-border-default pr-3 align-middle first:pl-6 last:pr-6 [&_svg]:size-3.5",
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-2 text-label-md whitespace-nowrap text-text-secondary">
        {icon}
        {children}
      </span>
    </th>
  );
}

export function DataTableRow({ className, ...props }: WithClass<ComponentProps<"tr">>) {
  return <tr className={cn("border-b border-border-default", className)} {...props} />;
}

/** Body cell: 52px; body-sm secondary text unless the content sets its own. */
export function DataTableCell({ className, ...props }: WithClass<ComponentProps<"td">>) {
  return (
    <td
      className={cn("h-13 pr-3 align-middle text-body-sm text-text-secondary first:pl-6 last:pr-6", className)}
      {...props}
    />
  );
}

/** The 24px ink logo tile with a label-sm initial, beside a label-lg name. */
export function DataTableItem({ logo, children }: { logo: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-surface-ink text-label-sm text-text-on-ink">
        {logo}
      </span>
      <span className="truncate text-label-lg text-text-primary">{children}</span>
    </span>
  );
}

/** Figma `Table tag`: brand (sky tint) or neutral (subtle) label, 8px radius. */
export function DataTableTag({
  tone = "brand",
  className,
  ...props
}: WithClass<ComponentProps<"span">> & { tone?: "brand" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-sm px-2.5 py-[3px] text-label-md whitespace-nowrap",
        tone === "brand" ? "bg-bg-brand text-text-brand" : "bg-bg-subtle text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

export type DataTableFooterProps = { onAdd?: () => void; addLabel?: string; hint?: ReactNode; className?: string };

/** Footer: "Add row" with a 16px plus and a caption hint on the right. */
export function DataTableFooter({ onAdd, addLabel = "Add row", hint, className }: DataTableFooterProps) {
  return (
    <div className={cn("flex items-center gap-2 px-6 pt-3.5 pb-4", className)}>
      <button
        type="button"
        onClick={onAdd}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-label-md text-text-secondary motion-colors focus-visible:outline-2 focus-visible:outline-text-brand"
      >
        <Plus aria-hidden className="size-4" />
        {addLabel}
      </button>
      {hint && <span className="shrink-0 text-caption text-text-secondary">{hint}</span>}
    </div>
  );
}
