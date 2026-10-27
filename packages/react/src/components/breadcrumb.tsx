import { CaretRight } from "@phosphor-icons/react";
import { Children, type ComponentProps, type ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type BreadcrumbProps = Omit<ComponentProps<"nav">, "className"> & {
  /** `glass` wraps the crumbs in a regular-glass tray. Omitted keeps them bare. */
  surface?: "glass";
  className?: string;
};

/** Figma `Breadcrumb` (110:948): crumbs 6px apart with 14px carets; the last crumb is the current page. */
export function Breadcrumb({
  surface,
  className,
  children,
  "aria-label": ariaLabel = "Breadcrumb",
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(surface === "glass" && "relative w-fit overflow-clip rounded-xl bg-glass-regular px-4 py-3.5", className)}
      {...props}
    >
      {surface === "glass" && <LiquidGlass tier="regular" />}
      <ol className="relative flex items-center gap-1.5">
        {Children.map(children, (item, index) => (
          <>
            {index > 0 && (
              <li aria-hidden className="flex">
                <CaretRight className="size-3.5 text-text-secondary" />
              </li>
            )}
            <li className="flex">{item}</li>
          </>
        ))}
      </ol>
    </nav>
  );
}

export type BreadcrumbItemProps = Omit<ComponentProps<"a">, "className"> & {
  /** Marks the current page: primary text and `aria-current`. */
  current?: boolean;
  /** Leading 20px ink tile, such as the workspace initial. */
  tile?: ReactNode;
  className?: string;
};

export function BreadcrumbItem({ current, tile, href, className, children, ...props }: BreadcrumbItemProps) {
  const Element = href && !current ? "a" : "span";
  return (
    <Element
      href={Element === "a" ? href : undefined}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-sm py-1 pr-2 pl-1.5 text-label-md whitespace-nowrap motion-colors",
        current ? "text-text-primary" : "text-text-secondary",
        Element === "a" && "hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      {tile && (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-xs bg-interactive-primary text-label-sm text-text-inverse">
          {tile}
        </span>
      )}
      {children}
    </Element>
  );
}
