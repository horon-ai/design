import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Robot } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export type AvatarProps = {
  /** `initials` (default), `bot` (robot on the brand tint) or `image`. */
  type?: "initials" | "bot" | "image";
  size?: AvatarSize;
  /** Image URL for `type="image"`; initials show while it loads or if it fails. */
  src?: string;
  alt?: string;
  /** Initials, or any fallback content. */
  children?: ReactNode;
  /** Shows the live status dot at the bottom right. */
  live?: boolean;
  className?: string;
};

const sizeClass: Record<AvatarSize, string> = {
  sm: "size-6 text-label-sm",
  md: "size-8 text-label-md",
  lg: "size-10 text-label-lg",
  xl: "size-14 text-title-sm",
};

const botIconClass: Record<AvatarSize, string> = {
  sm: "size-[13px]",
  md: "size-[18px]",
  lg: "size-[22px]",
  xl: "size-[31px]",
};

/** Live dot outer size: Figma dot diameter (10, 11, 13, 18) plus its 2px centered white stroke. */
const liveClass: Record<AvatarSize, string> = {
  sm: "size-3",
  md: "size-[13px]",
  lg: "size-[15px]",
  xl: "size-5",
};

const typeClass = {
  initials: "bg-bg-subtle text-text-secondary",
  bot: "bg-bg-brand text-text-brand",
  image: "bg-sky-200 text-text-secondary",
} as const;

/** Figma `Avatar` (61:347): Initials, Bot and Image in four sizes, with an optional live dot. */
export function Avatar({ type = "initials", size = "md", src, alt = "", children, live, className }: AvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <BaseAvatar.Root
        className={cn(
          "inline-flex items-center justify-center overflow-clip rounded-full select-none",
          sizeClass[size],
          typeClass[type],
        )}
      >
        {type === "bot" ? (
          <Robot aria-hidden className={botIconClass[size]} />
        ) : (
          <>
            {type === "image" && src && <BaseAvatar.Image src={src} alt={alt} className="size-full object-cover" />}
            <BaseAvatar.Fallback>{children}</BaseAvatar.Fallback>
          </>
        )}
      </BaseAvatar.Root>
      {live && (
        <span
          aria-hidden
          className={cn(
            "absolute -right-0.5 -bottom-0.5 animate-live-pulse rounded-full border-2 border-bg-default bg-status-live text-status-live",
            liveClass[size],
          )}
        />
      )}
    </span>
  );
}
