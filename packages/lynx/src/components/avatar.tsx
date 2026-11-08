import { useEffect, useState, type ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { useHoronTheme } from "../provider";

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
  /** Accessibility text for `type="image"`; pass `""` when the name is already shown next to the avatar. @default "" */
  alt?: string;
  /** Initials, or any fallback content. Text is wrapped in the avatar's own `<text>` so it inherits the size token. */
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

/** The circle diameter per size; the text token rides on the `<text>` element because Lynx does not inherit it. */
const circleClass: Record<AvatarSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-14",
};

const textClass: Record<AvatarSize, string> = {
  sm: "text-label-sm",
  md: "text-label-md",
  lg: "text-label-lg",
  xl: "text-title-sm",
};

/** The bot glyph in px: React's `size-[13px]`, `size-[18px]`, `size-[22px]`, `size-[31px]`. */
const botSize: Record<AvatarSize, number> = { sm: 13, md: 18, lg: 22, xl: 31 };

/** Live dot outer size: Figma dot diameter (10, 11, 13, 18) plus its 2px centered white stroke. */
const liveSize: Record<AvatarSize, string> = { sm: "10px", md: "11px", lg: "13px", xl: "18px" };

/** Background and text tint per avatar type; the `sky` tone overrides the initials pair. */
const typeClass = {
  initials: "bg-bg-subtle",
  bot: "bg-bg-brand",
  image: "bg-sky-200",
} as const;

const typeTextClass = {
  initials: "text-text-secondary",
  bot: "text-text-brand",
  image: "text-text-secondary",
} as const;

/** Figma quint-out for the live pulse and the spring for the pop-in, written out for an inline style. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/**
 * Figma `Avatar` (61:347): Initials, Bot and Image in four sizes, with an optional live dot.
 *
 * React delegated the image/fallback swap to Base UI's avatar primitive; Lynx has no such primitive,
 * so the same behaviour comes from `<image>`'s `bindload`/`binderror`: the initials stay until the
 * picture has loaded, and an image that never loads leaves them in place instead of a broken glyph.
 * React's `inset-ring-1 inset-ring-overlay-ink-6` is Tailwind v4's inset ring, which the v3 preset
 * behind Lynx lacks, so the same 1px inset ring is drawn as a box shadow from the theme's
 * `overlay-ink-6` hex.
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
  live = false,
  tone = "neutral",
  liveRingClassName = "border-bg-surface",
  className,
}: AvatarProps) {
  const theme = useHoronTheme();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // A new source is a new attempt: drop the outcome of the previous one.
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const hasImage = type === "image" && Boolean(src) && !failed;
  const showFallback = !(hasImage && loaded);
  const skyInitials = type === "initials" && tone === "sky";

  return (
    <view className={cn("relative flex shrink-0", className)}>
      <view
        className={cn(
          "flex select-none items-center justify-center overflow-hidden rounded-full",
          circleClass[size],
          typeClass[type],
          skyInitials && "bg-sky-100",
        )}
        style={{ boxShadow: `inset 0 0 0 1px ${theme.color("overlay-ink-6")}` }}
      >
        {type === "bot" ? (
          <Icon name="Robot" size={botSize[size]} weight="regular" color="text-brand" />
        ) : (
          <>
            {hasImage ? (
              <image
                src={src}
                mode="aspectFill"
                className={cn("motion-fade absolute inset-0 size-full", showFallback && "opacity-0")}
                accessibility-element
                accessibility-traits="image"
                accessibility-label={alt === "" ? undefined : alt}
                bindload={() => setLoaded(true)}
                binderror={() => setFailed(true)}
              />
            ) : null}
            {showFallback ? (
              <text className={cn(textClass[size], skyInitials ? "text-sky-700" : typeTextClass[type])}>
                {children}
              </text>
            ) : null}
          </>
        )}
      </view>
      {live ? (
        <view
          accessibility-elements-hidden
          className="absolute flex"
          style={{
            right: "-1px",
            bottom: "-1px",
            animationName: "pop-in",
            animationDuration: "220ms",
            animationTimingFunction: EASE_SPRING,
            animationFillMode: "both",
          }}
        >
          <view
            className={cn("rounded-full border-2 border-solid bg-status-live", liveRingClassName)}
            style={{
              width: liveSize[size],
              height: liveSize[size],
              animationName: "live-pulse",
              animationDuration: "2s",
              animationTimingFunction: EASE_OUT_QUINT,
              animationIterationCount: "infinite",
            }}
          />
        </view>
      ) : null}
    </view>
  );
}
