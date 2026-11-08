import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx wrapper can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
};

/** Severity of the strip: `info` tints the rim and icon brand, `danger` uses the danger rim and role="alert". */
export type BannerTone = "info" | "danger";
/** Size token shared with the form controls; the rendered heights are documented on {@link Banner}. */
export type BannerSize = ControlSize;
/** `solid` paints the raised surface, `glass` layers the glass material for use over imagery. */
export type BannerSurface = "solid" | "glass";

/** Props for {@link Banner}: the tone, size and surface of the strip plus its optional trailing action. */
export type BannerProps = Omit<PortedElementProps["div"], "className"> & {
  /** Severity; also picks the icon and the ARIA role. @default "info" */
  tone?: BannerTone;
  /** Trailing underlined action, such as a link or a dismiss button. */
  action?: ReactNode;
  /** Banner size: `sm` 32px minimum, `md` the Figma 48px strip (default), `lg` 56px; scales icon, text and padding. @default "md" */
  size?: BannerSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: BannerSurface;
  /** Extra classes merged onto the strip, for margins or width overrides. */
  className?: string;
  /** The message; it wraps inside the strip and is read as one line. */
  children?: ReactNode;
};

const sizeClass: Record<BannerSize, string> = {
  sm: "gap-2 px-3 py-2",
  md: "gap-3 px-4 py-2.5",
  lg: "gap-3 px-5 py-3",
};

/** React sized the icon through `[&_svg]:size-*`; Lynx's `<Icon>` takes the px number instead. */
const iconSize: Record<BannerSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
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

const solidEdgeClass: Record<BannerTone, string> = {
  info: "border-border-brand",
  danger: "border-border-danger",
};

const iconColor: Record<BannerTone, "text-brand" | "text-danger"> = {
  info: "text-brand",
  danger: "text-danger",
};

/**
 * Figma `Banner` (62:318): a strip with a tinted rim, 16px icon and an underlined action. The tone sets the
 * announcement role — `danger` is `alert` (announced immediately), `info` is `status` — exposed through the
 * Lynx accessibility attributes instead of the DOM `role`.
 *
 * React tinted the glass rim through the `--glass-edge` variable and hovered the trailing action
 * through `[&_a]`/`[&_button]` selectors. Lynx's `LiquidGlass` does not read `--glass-edge`, so the
 * tone rim is drawn on the host, and there are no hover states on touch; a string action is rendered
 * in an underlined `<text>` so it keeps the Figma treatment, while a node action keeps its own styling.
 *
 * @example
 * ```tsx
 * <Banner tone="danger" action="Review">
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
  style,
}: BannerProps) {
  return (
    <view
      className={cn(
        "motion-rise relative flex flex-row items-center overflow-hidden rounded-md",
        sizeClass[size],
        toneClass[tone],
        surface === "glass"
          ? cn("border border-transparent bg-glass-regular", solidEdgeClass[tone])
          : cn("border border-border-default bg-bg-surface", solidEdgeClass[tone]),
        className,
      )}
      style={style}
      accessibility-element
      accessibility-role-description={tone === "danger" ? "alert" : "status"}
    >
      {surface === "glass" && <LiquidGlass />}
      <view className="relative flex shrink-0 flex-row items-center">
        <Icon name={tone === "danger" ? "WarningCircle" : "Info"} size={iconSize[size]} color={iconColor[tone]} />
      </view>
      <view className="relative min-w-0 flex-1">
        {typeof children === "string" || typeof children === "number" ? (
          <text className={cn("text-text-primary", textSizeClass[size])}>{children}</text>
        ) : (
          children
        )}
      </view>
      {action ? (
        <view className={cn("relative shrink-0 whitespace-nowrap", actionSizeClass[size])}>
          {typeof action === "string" || typeof action === "number" ? (
            <text className={cn("text-text-primary underline", actionSizeClass[size])}>{action}</text>
          ) : (
            action
          )}
        </view>
      ) : null}
    </view>
  );
}
