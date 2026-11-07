import { Star } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { LiquidGlass } from "./liquid-glass";

/** Props for {@link MarketplaceCard}: identity, copy, capability chips and the install action. */
export type MarketplaceCardProps = Omit<ComponentProps<"div">, "children"> & {
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
    /** Stable key for this chip; also its React key. */
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
  /** Renders the Install button in the footer when set; receives the native click event. */
  onInstall?: () => void;
  /** Text of the Install button.
   * @default "Install" */
  installLabel?: string;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. */
  surface?: "solid" | "glass";
};

/**
 * Paper `Marketplace card` (Settings 1VMY-0): solid or thick glass column with tile header, description, chips and a footer with rating and Install.
 *
 * The card is a plain `div`, so any extra native attribute (`data-*`, `id`,
 * `onClick`) passes through. With `surface="glass"` it paints a `LiquidGlass`
 * layer and every child is positioned to stay above it.
 *
 * @example
 * ```tsx
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
  ...props
}: MarketplaceCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 overflow-clip rounded-xl p-4",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <div className="relative flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-neutral-900 text-label-md text-neutral-50"
        >
          {initials}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-label-md text-text-primary">{name}</span>
          {author && <span className="truncate text-caption text-text-secondary">{author}</span>}
        </span>
      </div>
      {description && <p className="relative text-body-sm text-text-secondary">{description}</p>}
      {chips && chips.length > 0 && (
        <div className="relative flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex h-5.5 items-center gap-1 rounded-full bg-overlay-ink-6 px-2 text-label-sm text-text-secondary [&_svg]:size-3"
            >
              {chip.icon}
              {chip.label}
            </span>
          ))}
        </div>
      )}
      <div className="relative flex items-center gap-1.5 border-t border-border-default pt-3">
        {score && (
          <>
            <Star aria-hidden weight="fill" className="size-3.5 text-mascot-gold" />
            <span className="text-label-sm text-text-primary">{score}</span>
          </>
        )}
        {score && installs && (
          <span aria-hidden className="text-caption text-text-placeholder">
            ·
          </span>
        )}
        {installs && <span className="text-caption text-text-secondary">{installs}</span>}
        <span className="flex-1" />
        {onInstall && (
          <Button variant="solid" size="sm" onClick={onInstall}>
            {installLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
