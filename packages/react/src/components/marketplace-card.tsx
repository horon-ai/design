import { Star } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { LiquidGlass } from "./liquid-glass";

export type MarketplaceCardProps = Omit<ComponentProps<"div">, "children"> & {
  /** Two-letter initials shown on the 40px ink tile. */
  initials: string;
  name: ReactNode;
  author?: ReactNode;
  description?: ReactNode;
  /** Capability chips, each with an optional 11px icon. */
  chips?: { id: string; label: ReactNode; icon?: ReactNode }[];
  score?: ReactNode;
  installs?: ReactNode;
  onInstall?: () => void;
  installLabel?: string;
};

/** Paper `Marketplace card` (Settings 1VMY-0): thick glass column with tile header, description, chips and a footer with rating and Install. */
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
  className,
  ...props
}: MarketplaceCardProps) {
  return (
    <div
      className={cn("relative flex flex-col gap-3 overflow-clip rounded-[20px] bg-glass-thick p-4", className)}
      {...props}
    >
      <LiquidGlass tier="thick" />
      <div className="relative flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-neutral-900 text-label-md text-neutral-50"
        >
          {initials}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-label-md text-text-primary">{name}</span>
          {author && <span className="truncate text-[12px]/[16px] text-text-placeholder">{author}</span>}
        </span>
      </div>
      {description && <p className="relative text-[13px]/[18px] text-text-secondary">{description}</p>}
      {chips && chips.length > 0 && (
        <div className="relative flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip.id}
              className="inline-flex h-5.5 items-center gap-1 rounded-full bg-overlay-ink-6 px-2 text-label-sm text-text-secondary [&_svg]:size-2.75"
            >
              {chip.icon}
              {chip.label}
            </span>
          ))}
        </div>
      )}
      <div className="relative flex items-center gap-1.5 border-t border-border-default pt-2.5">
        {score && (
          <>
            <Star aria-hidden weight="fill" className="size-3.25 text-mascot-gold" />
            <span className="text-label-sm text-text-primary">{score}</span>
          </>
        )}
        {installs && <span className="text-[12px]/[16px] text-text-placeholder">· {installs}</span>}
        <span className="flex-1" />
        <Button variant="glass" size="sm" onClick={onInstall}>
          {installLabel}
        </Button>
      </div>
    </div>
  );
}
