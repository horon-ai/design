import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx wrapper can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `header`; on Lynx every block is a `view`. */
  header: { className?: string; style?: CSSProperties; id?: string };
};

/** Curves react writes as Tailwind's `animate-*` tokens; a Lynx style object cannot read those, so they are inline. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_SPRING = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/** Props for {@link TopBar}. */
export type TopBarProps = Omit<PortedElementProps["header"], "className" | "title"> & {
  /** Bar title; truncates to one line and re-runs the fade-in when the text changes. */
  title: ReactNode;
  /** Second line under the title, muted and truncated. */
  subtitle?: ReactNode;
  /** Shows the live status dot on the avatar. */
  live?: boolean;
  /** Renders the back IconButton on the left and calls this on press; hidden when omitted. */
  onBack?: () => void;
  /** Renders the overflow IconButton on the right and calls this on press; hidden when omitted. */
  onMore?: () => void;
  /** Accessible label of the back button. @default "Back" */
  backLabel?: string;
  /** Accessible label of the overflow button. @default "More" */
  moreLabel?: string;
  /** `solid` (default) is an opaque surface bar with a default border; `glass` is the regular glass bar. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes for the bar. */
  className?: string;
};

/** Text slots take a string so the bar can put the type token on its own `<text>`; Lynx does not inherit type. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Paper `Top bar`: back button, bot avatar with a flush live dot, title and subtitle, on solid surface or regular glass.
 *
 * Renders a rounded bar with `rounded-full` corners; the glass variant mounts {@link LiquidGlass}
 * as its first child, so the host clips it and the bar can sit inside a positioned parent. Lynx has no
 * `header` element, so the bar is a `view` announced with the `banner` role, and the title's fade-in is
 * restarted by re-keying the title column the way react's `key` did.
 *
 * @example
 * ```tsx
 * import { TopBar } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <TopBar
 *       title="Research bot"
 *       subtitle="12 tasks today"
 *       live
 *       onBack={() => goBack()}
 *       onMore={() => setMenuOpen(true)}
 *     />
 *   );
 * }
 * ```
 */
export function TopBar({
  title,
  subtitle,
  live,
  onBack,
  onMore,
  backLabel = "Back",
  moreLabel = "More",
  surface = "solid",
  className,
  style,
  id,
}: TopBarProps) {
  const titleKey = typeof title === "string" ? `${title}|${typeof subtitle === "string" ? subtitle : ""}` : undefined;

  return (
    <view
      className={cn(
        "relative z-10 flex flex-row items-center gap-2 overflow-hidden rounded-full p-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
      accessibility-element
      accessibility-role-description="banner"
      {...(id === undefined ? {} : { id })}
    >
      {surface === "glass" && <LiquidGlass />}
      {onBack && <IconButton icon={<Icon name="CaretLeft" />} label={backLabel} onClick={onBack} />}
      <view className="relative flex shrink-0">
        <Avatar type="bot" size="md" />
        {live && (
          <view
            accessibility-elements-hidden
            className="absolute flex"
            style={{
              right: "0px",
              bottom: "0px",
              animationName: "pop-in",
              animationDuration: "220ms",
              animationTimingFunction: EASE_SPRING,
              animationFillMode: "both",
            }}
          >
            <view
              className="size-[9px] rounded-full bg-status-live"
              style={{
                animationName: "live-pulse",
                animationDuration: "2s",
                animationTimingFunction: EASE_OUT_QUINT,
                animationIterationCount: "infinite",
              }}
            />
          </view>
        )}
      </view>
      <view
        key={titleKey}
        className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
        style={{
          animationName: "fade-in",
          animationDuration: "160ms",
          animationTimingFunction: EASE_OUT_QUINT,
          animationFillMode: "both",
        }}
      >
        {isPlainText(title) ? (
          <text
            className="overflow-hidden text-ellipsis whitespace-nowrap text-label-lg text-text-primary"
            text-maxline="1"
          >
            {title}
          </text>
        ) : (
          title
        )}
        {subtitle ? (
          isPlainText(subtitle) ? (
            <text
              className="overflow-hidden text-ellipsis whitespace-nowrap text-caption text-text-secondary"
              text-maxline="1"
            >
              {subtitle}
            </text>
          ) : (
            subtitle
          )
        ) : null}
      </view>
      {onMore && <IconButton icon={<Icon name="DotsThree" weight="bold" />} label={moreLabel} onClick={onMore} />}
    </view>
  );
}
