import { CaretRight, DotsThree, MagnifyingGlass } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { BreadcrumbItem } from "./breadcrumb";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/** One crumb of {@link BreadcrumbHeader}; the last crumb in `crumbs` is the current page. */
export type BreadcrumbHeaderCrumb = {
  /** Crumb text; also its React key, so crumbs should have distinct labels. */
  label: string;
  /** Makes the crumb a link; ignored for the last (current) crumb, which stays text. */
  href?: string;
  /** Leading 20px ink tile, such as the workspace initial. */
  tile?: ReactNode;
};

/** Props of {@link BreadcrumbHeader}. */
export type BreadcrumbHeaderProps = Omit<ComponentProps<"header">, "className"> & {
  /** Crumbs in order; the last one is the current page. */
  crumbs: BreadcrumbHeaderCrumb[];
  /** Adds the search icon button; without it the button is not rendered at all. */
  onSearch?: () => void;
  /** Adds the "more" (three dots) icon button; without it the button is not rendered at all. */
  onMore?: () => void;
  /** Accessible label of the search button. @default "Search" */
  searchLabel?: string;
  /** Accessible label of the more button. @default "More" */
  moreLabel?: string;
  /** `solid` (default) on the page, `glass` over imagery and glass panels. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes merged onto the header. */
  className?: string;
};

/**
 * Paper `Header with breadcrumb`: a 52px regular-glass pill with a crumb row, search and more buttons.
 *
 * The crumb trail scrolls sideways inside the pill instead of truncating; only the last crumb truncates.
 * The two icon buttons (36px) are only rendered when their handlers are passed. On `glass` a
 * {@link LiquidGlass} layer sits under the content, so the header must be placed over imagery.
 *
 * @example
 * ```tsx
 * import { BreadcrumbHeader } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <BreadcrumbHeader
 *       crumbs={[{ label: "H", tile: "H", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Horon" }]}
 *       onSearch={() => {}}
 *       onMore={() => {}}
 *     />
 *   );
 * }
 * ```
 */
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
      <nav aria-label="Breadcrumb" className="relative min-w-0 flex-1 overflow-x-auto">
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
