import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no DOM, so the entry
 * lists only what the Lynx wrapper can honour.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
};

/** React sized the tile glyph through `[&>svg]:size-5`; `<Icon>` takes the px number. */
const TILE_ICON_SIZE = 20;

/** Props for {@link DirectoryCard}: the tile icon and copy, plus an optional add action. */
export type DirectoryCardProps = Omit<PortedElementProps["div"], "className"> & {
  /** 20px icon shown in inverse on the 40px tile. */
  icon: ReactNode;
  /** Tile label, `label-md` primary text on one truncated line. */
  name: ReactNode;
  /** One line; longer text is clipped with an ellipsis. */
  description?: ReactNode;
  /** Adds an `IconButton` with a plus when set; the card shows no button without it. */
  onAdd?: () => void;
  /** Accessible name of the add button, since it shows only a plus icon. @default "Add" */
  addLabel?: string;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes for the card. */
  className?: string;
};

/**
 * Paper `Directory card` (Settings 1VJJ-0): 40px tile, name and one-line description, plus an add button.
 *
 * The `glass` surface paints the thick glass fill and mounts a `LiquidGlass` layer behind the content, so
 * it belongs only over imagery or a glass panel. The add button inherits the same surface, which keeps the
 * two materials matched. React clamped the description with `line-clamp-1`; Lynx has no line-clamp, so the
 * one-line rule is `truncate` and the text is clipped with an ellipsis.
 *
 * @example
 * ```tsx
 * import { DirectoryCard, Icon } from "@horon-ai/lynx";
 *
 * <DirectoryCard
 *   icon={<Icon name="Folder" />}
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
  style,
}: DirectoryCardProps) {
  return (
    <view
      className={cn(
        "relative flex flex-row items-center gap-3 overflow-hidden rounded-2xl py-3 pl-3 pr-3",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
    >
      {surface === "glass" && <LiquidGlass />}
      <view className="relative flex size-10 shrink-0 flex-row items-center justify-center rounded-[10px] bg-sky-500">
        {isValidElement<IconProps>(icon) && icon.type === Icon
          ? cloneElement(icon, { size: TILE_ICON_SIZE, color: "interactive-on-primary" })
          : icon}
      </view>
      <view className="relative flex min-w-0 flex-1 flex-col gap-0.5">
        <text className="truncate text-label-md text-text-primary">{name}</text>
        {description ? <text className="truncate text-caption text-text-secondary">{description}</text> : null}
      </view>
      {onAdd ? (
        <IconButton
          variant={surface === "glass" ? "glass" : "solid"}
          size="sm"
          label={addLabel}
          icon={<Icon name="Plus" />}
          onClick={onAdd}
        />
      ) : null}
    </view>
  );
}
