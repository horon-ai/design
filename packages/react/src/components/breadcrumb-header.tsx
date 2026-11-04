import { CaretRight, DotsThree, MagnifyingGlass } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { BreadcrumbItem } from "./breadcrumb";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

export type BreadcrumbHeaderCrumb = {
  label: string;
  href?: string;
  /** Leading 20px ink tile, such as the workspace initial. */
  tile?: ReactNode;
};

export type BreadcrumbHeaderProps = Omit<ComponentProps<"header">, "className"> & {
  /** Crumbs in order; the last one is the current page. */
  crumbs: BreadcrumbHeaderCrumb[];
  onSearch?: () => void;
  onMore?: () => void;
  searchLabel?: string;
  moreLabel?: string;
  /** `solid` (default) on the page, `glass` over imagery and glass panels. */
  surface?: "solid" | "glass";
  className?: string;
};

/** Paper `Header with breadcrumb`: a 52px regular-glass pill with a crumb row, search and more buttons. */
export function BreadcrumbHeader({
  crumbs,
  onSearch,
  onMore,
  searchLabel = "Search",
  moreLabel = "More",
  surface = "solid",
  className,
  ...props
}: BreadcrumbHeaderProps) {
  return (
    <header
      className={cn(
        "relative flex h-13 items-center gap-2 overflow-clip rounded-full p-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <nav aria-label="Breadcrumb" className="relative min-w-0 flex-1 overflow-clip">
        <ol className="flex items-center gap-1.5">
          {crumbs.map((crumb, index) => {
            const current = index === crumbs.length - 1;
            return (
              <li key={crumb.label} className={cn("flex items-center gap-1.5", current && "min-w-0")}>
                {index > 0 && <CaretRight aria-hidden className="size-3.5 shrink-0 text-text-secondary" />}
                <BreadcrumbItem
                  current={current}
                  tile={crumb.tile}
                  href={crumb.href}
                  className={current ? "min-w-0" : undefined}
                >
                  <span className="min-w-0 truncate">{crumb.label}</span>
                </BreadcrumbItem>
              </li>
            );
          })}
        </ol>
      </nav>
      {onSearch && (
        <IconButton
          icon={<MagnifyingGlass />}
          label={searchLabel}
          onClick={onSearch}
          className="relative size-9 [&_svg]:size-4.5"
        />
      )}
      {onMore && (
        <IconButton
          icon={<DotsThree weight="bold" />}
          label={moreLabel}
          onClick={onMore}
          className="relative size-9 [&_svg]:size-4.5"
        />
      )}
    </header>
  );
}
