import { Plus } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/** Props for {@link DirectoryCard}: the tile icon and copy, plus an optional add action. */
export type DirectoryCardProps = Omit<ComponentProps<"div">, "children"> & {
  /** 20px icon shown in inverse on the 40px tile. */
  icon: ReactNode;
  /** Tile label, `label-md` primary text on one truncated line. */
  name: ReactNode;
  /** One line; longer text is clamped. */
  description?: ReactNode;
  /** Adds an `IconButton` with a plus when set; the card shows no button without it. */
  onAdd?: () => void;
  /** Accessible name of the add button (`aria-label`), since it shows only a plus icon. @default "Add" */
  addLabel?: string;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: "solid" | "glass";
};

/**
 * Paper `Directory card` (Settings 1VJJ-0): 40px tile, name and one-line description, plus an add button.
 *
 * The `glass` surface paints the thick glass fill and mounts a `LiquidGlass` layer behind the content, so
 * it belongs only over imagery or a glass panel. The add button inherits the same surface, which keeps the
 * two materials matched.
 *
 * @example
 * ```tsx
 * <DirectoryCard
 *   icon={<Folder />}
 *   name="Product"
 *   description="Specs, research and launch notes."
 *   onAdd={() => openFolderPicker()}
 *   addLabel="Connect folder"
 * />
 * ```
 */
export function DirectoryCard({
  icon,
  name,
  description,
  onAdd,
  addLabel = "Add",
  surface = "solid",
  className,
  ...props
}: DirectoryCardProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 overflow-clip rounded-2xl py-3 pr-3 pl-3",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-500 text-neutral-50 [&>svg]:size-5">
        {icon}
      </span>
      <span className="relative flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-label-md text-text-primary">{name}</span>
        {description && <span className="line-clamp-1 text-caption text-text-secondary">{description}</span>}
      </span>
      {onAdd && (
        <IconButton
          variant={surface === "glass" ? "glass" : "solid"}
          size="sm"
          label={addLabel}
          icon={<Plus aria-hidden />}
          onClick={onAdd}
        />
      )}
    </div>
  );
}
