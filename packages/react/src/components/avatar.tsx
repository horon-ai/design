import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Robot } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";

/** Diameter of the avatar: `sm` 24px, `md` 32px, `lg` 40px, `xl` 56px. */
export type AvatarSize = "sm" | "md" | "lg" | "xl";

/** Props for {@link Avatar}: the avatar type and size, the image source, fallback content and the live dot. */
export type AvatarProps = {
  /** `initials` (default), `bot` (robot on the brand tint) or `image`. @default "initials" */
  type?: "initials" | "bot" | "image";
  /** Diameter token; also scales the initials, the bot icon and the live dot. @default "md" */
  size?: AvatarSize;
  /** Image URL for `type="image"`; initials show while it loads or if it fails. */
  src?: string;
  /** Alternative text for `type="image"`; pass `""` when the name is already shown next to the avatar. @default "" */
  alt?: string;
  /** Initials, or any fallback content. */
  children?: ReactNode;
  /** Shows the live status dot at the bottom right. @default false */
  live?: boolean;
  /** Initials colour: `neutral` (default) or `sky`, the Paper account profile avatar (sky-100 fill, sky-700 text). @default "neutral" */
  tone?: "neutral" | "sky";
  /**
   * Border colour of the live dot, so it matches the surface behind it (glass panels, `bg-subtle`, brand tints).
   * Defaults to `border-bg-surface`.
   * @default "border-bg-surface"
   */
  liveRingClassName?: string;
  /** Extra classes merged onto the wrapper, for positioning or a custom size override. */
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
  sm: "size-2.5",
  md: "size-[11px]",
  lg: "size-[13px]",
  xl: "size-[18px]",
};

const typeClass = {
  initials: "bg-bg-subtle text-text-secondary",
  bot: "bg-bg-brand text-text-brand",
  image: "bg-sky-200 text-text-secondary",
} as const;

/**
 * Figma `Avatar` (61:347): Initials, Bot and Image in four sizes, with an optional live dot. Built on Base UI's
 * avatar primitive, so an image that fails to load falls back to the children instead of a broken icon.
 *
 * @example
 * ```tsx
 * <Avatar type="image" size="lg" src={user.photoUrl} alt="" live>
 *   {initials}
 * </Avatar>
 * ```
 */
export function Avatar({
  type = "initials",
  size = "md",
  src,
  alt = "",
  children,
  live,
  tone = "neutral",
  liveRingClassName = "border-bg-surface",
  className,
}: AvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <BaseAvatar.Root
        className={cn(
          "inline-flex items-center justify-center overflow-clip rounded-full inset-ring-1 inset-ring-overlay-ink-6 select-none",
          sizeClass[size],
          typeClass[type],
          type === "initials" && tone === "sky" && "bg-sky-100 text-sky-700",
        )}
      >
        {type === "bot" ? (
          <Robot aria-hidden className={botIconClass[size]} />
        ) : (
          <>
            {type === "image" && src && (
              <BaseAvatar.Image src={src} alt={alt} className="size-full object-cover motion-fade" />
            )}
            <BaseAvatar.Fallback>{children}</BaseAvatar.Fallback>
          </>
        )}
      </BaseAvatar.Root>
      {live && (
        <span aria-hidden className="absolute -right-px -bottom-px flex animate-pop-in">
          <span
            className={cn(
              "animate-live-pulse rounded-full border-2 bg-status-live text-status-live",
              liveRingClassName,
              liveClass[size],
            )}
          />
        </span>
      )}
    </span>
  );
}
