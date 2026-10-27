import { CaretRight, DotsThree, MagnifyingGlass } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
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
  className?: string;
};

const crumbClass =
  "flex items-center gap-1.5 rounded-sm py-1 pr-2 pl-1.5 text-label-md whitespace-nowrap motion-colors";

/** Paper `Header with breadcrumb`: a 52px regular-glass pill with a crumb row, search and more buttons. */
export function BreadcrumbHeader({
  crumbs,
  onSearch,
  onMore,
  searchLabel = "Search",
  moreLabel = "More",
  className,
  ...props
}: BreadcrumbHeaderProps) {
  return (
    <header
      className={cn("relative flex h-13 items-center gap-2 overflow-clip rounded-full bg-glass-regular p-2", className)}
      {...props}
    >
      <LiquidGlass tier="regular" />
      <nav aria-label="Breadcrumb" className="relative min-w-0 flex-1 overflow-clip">
        <ol className="flex items-center gap-1.5">
          {crumbs.map((crumb, index) => {
            const current = index === crumbs.length - 1;
            const Element = crumb.href && !current ? "a" : "span";
            return (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <CaretRight aria-hidden className="size-3.5 shrink-0 text-text-secondary" />}
                <Element
                  href={Element === "a" ? crumb.href : undefined}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    crumbClass,
                    current ? "text-text-primary" : "text-text-secondary",
                    Element === "a" &&
                      "hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand",
                  )}
                >
                  {crumb.tile && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-xs bg-interactive-primary text-label-sm text-text-inverse">
                      {crumb.tile}
                    </span>
                  )}
                  {crumb.label}
                </Element>
              </li>
            );
          })}
        </ol>
      </nav>
      <IconButton icon={<MagnifyingGlass />} label={searchLabel} onClick={onSearch} className="relative size-9 [&_svg]:size-4.5" />
      <IconButton icon={<DotsThree weight="bold" />} label={moreLabel} onClick={onMore} className="relative size-9 [&_svg]:size-4.5" />
    </header>
  );
}
