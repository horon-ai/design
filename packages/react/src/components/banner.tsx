import { Info, WarningCircle } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

export type BannerTone = "info" | "danger";
export type BannerSize = ControlSize;
export type BannerSurface = "solid" | "glass";

export type BannerProps = Omit<ComponentProps<"div">, "className"> & {
  tone?: BannerTone;
  /** Trailing underlined action, such as a link or button. */
  action?: ReactNode;
  /** Banner size: `sm` 32px minimum, `md` the Figma 48px strip (default), `lg` 56px; scales icon, text and padding. */
  size?: BannerSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. */
  surface?: BannerSurface;
  className?: string;
};

const sizeClass: Record<BannerSize, string> = {
  sm: "gap-2 px-3 py-2",
  md: "gap-3 px-4 py-3",
  lg: "gap-3 px-5 py-3.5",
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

/** Figma `Banner` (62:318): a strip with a tinted rim, 18px icon and an underlined action. */
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
        "relative flex animate-[tab-panel-in_220ms_var(--ease-out-quint)] items-center overflow-clip rounded-md",
        sizeClass[size],
        toneClass[tone],
        surface === "glass"
          ? cn("bg-glass-regular", glassEdgeClass[tone])
          : cn("border border-border-default bg-bg-surface", solidEdgeClass[tone]),
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <span className={cn("relative flex shrink-0", iconSizeClass[size])}>
        {tone === "danger" ? <WarningCircle /> : <Info />}
      </span>
      <p className={cn("relative min-w-0 flex-1", textSizeClass[size])}>{children}</p>
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
