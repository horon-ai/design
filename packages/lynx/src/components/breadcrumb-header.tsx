import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { BreadcrumbItem } from "./breadcrumb";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/**
 * The native surface React spread onto a `header` element. Lynx has no `header`,
 * so the pill is a `view` and only the members a caller uses are declared.
 */
type PortedHeaderProps = {
  /** Element id, so a host or the gallery can address the native node. */
  id?: string;
  /** Inline style, merged onto the pill's own. */
  style?: CSSProperties;
};

/** One crumb of {@link BreadcrumbHeader}; the last crumb in `crumbs` is the current page. */
export type BreadcrumbHeaderCrumb = {
  /** Crumb text; also its key, so crumbs should have distinct labels. */
  label: string;
  /** Marks the crumb as a link target; ignored for the last (current) crumb, which stays text. */
  href?: string;
  /** Leading 20px ink tile, such as the workspace initial. */
  tile?: ReactNode;
};

/** Props of {@link BreadcrumbHeader}. */
export type BreadcrumbHeaderProps = Omit<PortedHeaderProps, "className"> & {
  // React spread `ComponentProps<"header">` here; Lynx has no header element, so only `id` and `style` carry over.
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
 * The two icon buttons (36px) are only rendered when their handlers are passed. React composed a `nav`
 * and an ordered list around `BreadcrumbItem`s; Lynx has no list elements, so the trail is a
 * `scroll-view` row of the same crumbs, with a 14px caret between entries and the `BreadcrumbItem`'s
 * own selected/current treatment on the last one. On `glass` a {@link LiquidGlass} layer sits under the
 * content, so the header must be placed over imagery.
 *
 * @example
 * ```tsx
 * import { BreadcrumbHeader } from "@horon-ai/lynx";
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
    <view
      className={cn(
        "relative flex h-[52px] flex-row items-center gap-2 overflow-hidden rounded-full p-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" ? <LiquidGlass /> : null}
      <view className="relative min-w-0 flex-1" accessibility-element accessibility-label="Breadcrumb">
        {/* Crumbs are navigation targets: an over-wide trail scrolls inside the pill
         * instead of truncating a label the reader may need to tap. */}
        <scroll-view
          scroll-orientation="horizontal"
          scroll-bar-enable={false}
          className="relative w-full"
          style={{ maxWidth: "100%" }}
        >
          <view className="relative flex flex-row items-center gap-1.5">
            {crumbs.map((crumb, index) => {
              const current = index === crumbs.length - 1;
              return (
                <view key={crumb.label} className={cn("flex flex-row items-center gap-1.5", current && "min-w-0")}>
                  {index > 0 ? (
                    <view className="flex shrink-0" accessibility-elements-hidden>
                      <Icon name="CaretRight" size={14} color="text-secondary" />
                    </view>
                  ) : null}
                  <BreadcrumbItem
                    current={current}
                    tile={crumb.tile}
                    href={crumb.href}
                    className={current ? "min-w-0" : undefined}
                  >
                    <text
                      className={cn(
                        "min-w-0 truncate text-label-md",
                        current ? "text-text-primary" : "text-text-secondary",
                      )}
                    >
                      {crumb.label}
                    </text>
                  </BreadcrumbItem>
                </view>
              );
            })}
          </view>
        </scroll-view>
      </view>
      {onSearch ? (
        <IconButton
          icon={<Icon name="MagnifyingGlass" size={18} color="text-primary" />}
          label={searchLabel}
          onClick={onSearch}
          className="relative size-9"
        />
      ) : null}
      {onMore ? (
        <IconButton
          icon={<Icon name="DotsThree" weight="bold" size={18} color="text-primary" />}
          label={moreLabel}
          onClick={onMore}
          className="relative size-9"
        />
      ) : null}
    </view>
  );
}
