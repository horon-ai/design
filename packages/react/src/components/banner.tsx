import { Info, WarningCircle } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type BannerTone = "info" | "danger";

export type BannerProps = Omit<ComponentProps<"div">, "className"> & {
  tone?: BannerTone;
  /** Trailing underlined action, such as a link or button. */
  action?: ReactNode;
  className?: string;
};

const toneClass: Record<BannerTone, string> = {
  info: "border-border-brand text-text-brand",
  danger: "border-border-danger text-text-danger",
};

/** Figma `Banner` (62:318): a regular-glass strip with a tinted rim, 18px icon and an underlined action. */
export function Banner({ tone = "info", action, className, children, ...props }: BannerProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "relative flex animate-[tab-panel-in_220ms_var(--ease-out-quint)] items-center gap-3 overflow-clip rounded-md border bg-glass-regular px-4 py-3",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      <LiquidGlass tier="regular" />
      <span className="relative flex shrink-0 [&_svg]:size-4.5">
        {tone === "danger" ? <WarningCircle /> : <Info />}
      </span>
      <p className="relative min-w-0 flex-1 text-body-md">{children}</p>
      {action && (
        <span className="relative shrink-0 text-label-lg leading-5 whitespace-nowrap underline [&_a]:cursor-pointer [&_button]:cursor-pointer">
          {action}
        </span>
      )}
    </div>
  );
}
