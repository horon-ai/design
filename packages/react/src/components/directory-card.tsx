import { Plus } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

export type DirectoryCardProps = Omit<ComponentProps<"div">, "children"> & {
  /** 20px icon shown in inverse on the 40px tile. */
  icon: ReactNode;
  name: ReactNode;
  /** One line; longer text is clamped. */
  description?: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
};

/** Paper `Directory card` (Settings 1VJJ-0): thick glass row, 40px tile, name and one-line description, glass add button. */
export function DirectoryCard({
  icon,
  name,
  description,
  onAdd,
  addLabel = "Add",
  className,
  ...props
}: DirectoryCardProps) {
  return (
    <div
      className={cn("relative flex items-center gap-3 overflow-clip rounded-2xl bg-glass-thick py-3 pr-3.5 pl-3", className)}
      {...props}
    >
      <LiquidGlass tier="thick" />
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sky-500 text-text-inverse [&>svg]:size-5">
        {icon}
      </span>
      <span className="relative flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-label-md text-text-primary">{name}</span>
        {description && (
          <span className="line-clamp-1 text-[12px]/[16px] text-text-placeholder">{description}</span>
        )}
      </span>
      <IconButton
        variant="glass"
        size="sm"
        label={addLabel}
        icon={<Plus aria-hidden />}
        onClick={onAdd}
        className="relative [&_svg]:size-3.5"
      />
    </div>
  );
}
