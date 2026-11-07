import { cloneElement, isValidElement, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";
import { primitives } from "@horon-ai/tokens";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no DOM, so the entry
 * lists only what the Lynx wrapper can honour.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
};

/** Text slots take a string so the token classes can sit on a `<text>`; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/** React sized a chip glyph through `[&_svg]:size-3`; `<Icon>` takes the px number. */
const CHIP_ICON_SIZE = 12;

/** The rating star is `text-mascot-gold`; a primitive step, so `<Icon>` takes its hex rather than a token name. */
const MASCOT_GOLD = primitives["mascot-gold"];

/** Props for {@link MarketplaceCard}: identity, copy, capability chips and the install action. */
export type MarketplaceCardProps = Omit<PortedElementProps["div"], "className"> & {
  /** Two-letter initials shown on the 40px ink tile. */
  initials: string;
  /** Card title on the row beside the tile; truncated in one line. */
  name: ReactNode;
  /** Publisher line under the name, in caption colour. */
  author?: ReactNode;
  /** Body copy under the header; any length, wrapped by the paragraph. */
  description?: ReactNode;
  /** Capability chips, each with an optional 12px icon. */
  chips?: {
    /** Stable key for this chip. */
    id: string;
    /** Chip text. */
    label: ReactNode;
    /** Optional leading icon, rendered at 12px by the chip's `[&_svg]:size-3`. */
    icon?: ReactNode;
  }[];
  /** Rating value shown after a filled star, such as "4.8". Hides the star when unset. */
  score?: ReactNode;
  /** Install-count caption, separated from the score by a middle dot when both are set. */
  installs?: ReactNode;
  /** Renders the Install button in the footer when set. */
  onInstall?: () => void;
  /** Text of the Install button.
   * @default "Install" */
  installLabel?: string;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes for the card. */
  className?: string;
};

/**
 * Paper `Marketplace card` (Settings 1VMY-0): solid or thick glass column with tile header, description, chips and a footer with rating and Install.
 *
 * React forwarded every extra native attribute of the card `div`; Lynx has no DOM element under the
 * `view`, so only `style` carries over. With `surface="glass"` the card paints a `LiquidGlass` layer as
 * its first child and every later child is `relative`, so the content stays above it.
 *
 * @example
 * ```tsx
 * import { MarketplaceCard } from "@horon-ai/lynx";
 *
 * <MarketplaceCard
 *   initials="GH"
 *   name="GitHub"
 *   author="by Horon"
 *   description="Read repositories and open pull requests."
 *   chips={[{ id: "official", label: "Official" }]}
 *   score="4.8"
 *   installs="12k installs"
 *   onInstall={() => install("github")}
 * />
 * ```
 */
export function MarketplaceCard({
  initials,
  name,
  author,
  description,
  chips,
  score,
  installs,
  onInstall,
  installLabel = "Install",
  surface = "solid",
  className,
  style,
}: MarketplaceCardProps) {
  return (
    <view
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-xl p-4",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
    >
      {surface === "glass" && <LiquidGlass />}
      <view className="relative flex flex-row items-center gap-3">
        <view className="flex size-10 shrink-0 flex-row items-center justify-center rounded-[10px] bg-neutral-900">
          <text className="text-label-md text-neutral-50">{initials}</text>
        </view>
        <view className="flex min-w-0 flex-col gap-0.5">
          <text className="truncate text-label-md text-text-primary">{name}</text>
          {author ? <text className="truncate text-caption text-text-secondary">{author}</text> : null}
        </view>
      </view>
      {description ? <text className="relative text-body-sm text-text-secondary">{description}</text> : null}
      {chips && chips.length > 0 ? (
        <view className="relative flex flex-row flex-wrap gap-1.5">
          {chips.map((chip) => (
            <view
              key={chip.id}
              className="flex h-[22px] flex-row items-center gap-1 rounded-full bg-overlay-ink-6 px-2"
            >
              {chip.icon
                ? isValidElement<IconProps>(chip.icon) && chip.icon.type === Icon
                  ? cloneElement(chip.icon, { size: CHIP_ICON_SIZE, color: "text-secondary" })
                  : chip.icon
                : null}
              <text className="text-label-sm text-text-secondary">{chip.label}</text>
            </view>
          ))}
        </view>
      ) : null}
      <view className="relative flex flex-row items-center gap-1.5 border-t border-border-default pt-3">
        {score ? (
          <view className="flex flex-row items-center gap-1.5">
            <Icon name="Star" size={14} weight="fill" color={MASCOT_GOLD} />
            {isPlainText(score) ? (
              <text className="text-label-sm text-text-primary">{score}</text>
            ) : (
              score
            )}
          </view>
        ) : null}
        {score && installs ? <text className="text-caption text-text-placeholder">·</text> : null}
        {installs ? (
          isPlainText(installs) ? (
            <text className="text-caption text-text-secondary">{installs}</text>
          ) : (
            installs
          )
        ) : null}
        <view className="flex-1" />
        {onInstall ? (
          <Button variant="solid" size="sm" onClick={onInstall}>
            {installLabel}
          </Button>
        ) : null}
      </view>
    </view>
  );
}
