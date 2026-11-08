import { Children, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React elements this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx wrapper can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `nav`; on Lynx the tray is a `view` carrying the same accessibility label. */
  nav: { accessibilityLabel?: string; style?: CSSProperties };
  /** React's `a`; on Lynx a tappable `view` with the `link` trait. */
  a: { accessibilityLabel?: string; style?: CSSProperties };
};

/** Tray material behind a {@link Breadcrumb} trail: `glass` is the regular glass tray, `solid` the opaque one. */
export type BreadcrumbSurface = "glass" | "solid";

/** The DOM accessibility attributes this port keeps as explicit props. */
type AccessibleTrail = {
  /** Spoken name of the trail; react read it from the `nav`'s `aria-label`. @default Breadcrumb */
  "aria-label"?: string;
};

/** Props of {@link Breadcrumb}. */
export type BreadcrumbProps = Omit<PortedElementProps["nav"], "className"> &
  AccessibleTrail & {
    /** `glass` wraps the crumbs in a regular-glass tray, `solid` in an opaque tray. Omitted keeps them bare. */
    surface?: BreadcrumbSurface;
    /** Extra classes merged onto the navigation element. */
    className?: string;
    /** The crumbs, each a {@link BreadcrumbItem}; caret separators are inserted between them. */
    children?: ReactNode;
  };

/**
 * Figma `Breadcrumb` (110:948): crumbs 6px apart with 14px carets; the last crumb is the current page.
 *
 * React rendered a `<nav aria-label>` holding an ordered list and inserted an `aria-hidden` caret
 * between entries. Lynx has no `<nav>`/`<ol>`, so the tray is a `view` (`accessibility-traits="navigation"`)
 * and the crumbs sit in a row; the caret between entries keeps `<Icon name="CaretRight" />` and is
 * hidden from assistive technology. The tray still shrinks below its trail's min-content and the trail
 * scrolls horizontally rather than truncating labels the reader may need to tap.
 *
 * @example
 * ```tsx
 * import { Breadcrumb, BreadcrumbItem } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <Breadcrumb surface="solid">
 *       <BreadcrumbItem href="/" tile="H">Home</BreadcrumbItem>
 *       <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
 *       <BreadcrumbItem current>Horon</BreadcrumbItem>
 *     </Breadcrumb>
 *   );
 * }
 * ```
 */
export function Breadcrumb({
  surface,
  className,
  children,
  "aria-label": ariaLabel = "Breadcrumb",
  style,
}: BreadcrumbProps) {
  return (
    <view
      className={cn(
        "flex w-full min-w-0 flex-col items-start",
        surface === "glass" && "relative overflow-hidden rounded-xl bg-glass-regular px-4 py-3.5",
        surface === "solid" && "relative rounded-xl border border-border-default bg-bg-surface px-4 py-3.5",
        className,
      )}
      style={style}
      accessibility-element
      accessibility-label={ariaLabel}
    >
      {surface === "glass" && <LiquidGlass />}
      {/* Crumbs are navigation targets: an over-wide trail scrolls inside the tray
       * instead of truncating a label the reader may need to tap. */}
      <scroll-view
        scroll-orientation="horizontal"
        className="relative w-full"
        style={{ maxWidth: "100%" }}
        scroll-bar-enable={false}
      >
        <view className="relative flex flex-row items-center gap-1.5">
          {Children.map(children, (item, index) => (
            <view className="flex shrink-0 flex-row items-center gap-1.5">
              {index > 0 ? (
                <view className="flex shrink-0" accessibility-elements-hidden>
                  <Icon name="CaretRight" size={14} color="text-secondary" />
                </view>
              ) : null}
              <view className="flex shrink-0">{item}</view>
            </view>
          ))}
        </view>
      </scroll-view>
    </view>
  );
}

/** Props of {@link BreadcrumbItem}. */
export type BreadcrumbItemProps = Omit<PortedElementProps["a"], "className"> & {
  /** Marks the current page: primary text and the `selected` accessibility trait. */
  current?: boolean;
  /** Leading 20px ink tile, such as the workspace initial. */
  tile?: ReactNode;
  /** Extra classes merged onto the crumb element. */
  className?: string;
  /**
   * Destination of the crumb. Lynx has no anchor or router, so `href` is kept as the
   * identifying value (and as the accessible hint) while the host performs the
   * navigation in {@link BreadcrumbItemProps.onTap}.
   */
  href?: string;
  /** Called when a crumb that is not the current page is tapped. */
  onTap?: () => void;
  /** The crumb label. */
  children?: ReactNode;
};

/**
 * One crumb of {@link Breadcrumb}: tappable when `href` is set and the crumb is not current,
 * otherwise a static span-equivalent. The current crumb renders primary text and the `selected`
 * trait, matching react's `aria-current="page"`.
 *
 * @example
 * ```tsx
 * <BreadcrumbItem href="/projects" onTap={() => navigate("/projects")}>Projects</BreadcrumbItem>
 * ```
 */
export function BreadcrumbItem({ current, tile, href, onTap, className, children }: BreadcrumbItemProps) {
  const tappable = Boolean(href) && !current;

  return (
    <view
      className={cn(
        "motion-colors flex flex-row items-center gap-1.5 whitespace-nowrap rounded-sm py-1 pl-1.5 pr-1.5",
        current ? "text-text-primary" : "text-text-secondary",
        tappable && "active:opacity-70",
        className,
      )}
      bindtap={tappable ? onTap : undefined}
      accessibility-element={tappable}
      accessibility-traits={current ? "selected" : tappable ? "link" : undefined}
      accessibility-label={tappable ? href : undefined}
    >
      {tile ? (
        <view className="flex size-5 shrink-0 items-center justify-center rounded-xs bg-interactive-primary">
          <text className="text-center text-label-sm text-text-inverse">{tile}</text>
        </view>
      ) : null}
      <text className={cn("text-label-md", current ? "text-text-primary" : "text-text-secondary")}>{children}</text>
    </view>
  );
}
