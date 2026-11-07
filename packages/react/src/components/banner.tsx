import { Info, WarningCircle } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

/** Severity of the strip: `info` tints the rim and icon brand, `danger` uses the danger rim and role="alert". */
export type BannerTone = "info" | "danger";
/** Size token shared with the form controls; the rendered heights are documented on {@link Banner}. */
export type BannerSize = ControlSize;
/** `solid` paints the raised surface, `glass` layers the glass material for use over imagery. */
export type BannerSurface = "solid" | "glass";

/** Props for {@link Banner}: the tone, size and surface of the strip plus its optional trailing action. */
export type BannerProps = Omit<ComponentProps<"div">, "className"> & {
  /** Severity; also picks the icon and the ARIA role. @default "info" */
  tone?: BannerTone;
  /** Trailing underlined action, such as a link or button. */
  action?: ReactNode;
  /** Banner size: `sm` 32px minimum, `md` the Figma 48px strip (default), `lg` 56px; scales icon, text and padding. @default "md" */
  size?: BannerSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: BannerSurface;
  /** Extra classes merged onto the strip, for margins or width overrides. */
  className?: string;
};

const sizeClass: Record<BannerSize, string> = {
  sm: "gap-2 px-3 py-2",
  md: "gap-3 px-4 py-2.5",
  lg: "gap-3 px-5 py-3",
};

const iconSizeClass: Record<BannerSize, string> = {
  sm: "[&_svg]:size-3.5",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
};

const textSizeClass: Record<BannerSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

const actionSizeClass: Record<BannerSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const toneClass: Record<BannerTone, string> = {
  info: "text-text-brand",
  danger: "text-text-danger",
};

const glassEdgeClass: Record<BannerTone, string> = {
  info: "[--glass-edge:var(--color-border-brand)]",
  danger: "[--glass-edge:var(--color-border-danger)]",
};

const solidEdgeClass: Record<BannerTone, string> = {
  info: "border-border-brand",
  danger: "border-border-danger",
};

/**
 * Figma `Banner` (62:318): a strip with a tinted rim, 16px icon and an underlined action. The tone sets the ARIA
 * role — `danger` renders `role="alert"` (announced immediately), `info` renders `role="status"`.
 *
 * @example
 * ```tsx
 * <Banner tone="danger" action={<a href="/settings">Review</a>}>
 *   Your API key expired.
 * </Banner>
 * ```
 */
export function Banner({
  tone = "info",
  action,
  size = "md",
  surface = "solid",
  className,
  children,
  ...props
}: BannerProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "relative flex motion-rise items-center overflow-clip rounded-md",
        sizeClass[size],
        toneClass[tone],
        surface === "glass"
          ? cn("border border-transparent bg-glass-regular", glassEdgeClass[tone])
          : cn("border border-border-default bg-bg-surface", solidEdgeClass[tone]),
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <span className={cn("relative flex shrink-0", iconSizeClass[size])}>
        {tone === "danger" ? <WarningCircle /> : <Info />}
      </span>
      <p className={cn("relative min-w-0 flex-1 text-text-primary", textSizeClass[size])}>{children}</p>
      {action && (
        <span
          className={cn(
            "relative shrink-0 whitespace-nowrap underline [&_a]:cursor-pointer [&_button]:cursor-pointer",
            actionSizeClass[size],
          )}
        >
          {action}
        </span>
      )}
    </div>
  );
}
