import type { ReactNode } from "@lynx-js/react";

import { cn } from "../lib/cn";
import { Avatar } from "./avatar";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Lynx has no
 * `<button>`, so only the members a caller actually uses are declared.
 */
type PortedElementProps = {
  /** React's `button`; on Lynx the row is a `view` and `onClick` becomes `bindtap`. */
  button: {
    /** Called when the row is tapped. */
    onClick?: () => void;
    /** Element id, so a host or the gallery can address the native node. */
    id?: string;
  };
};

/** Props for {@link BotListRow}: the bot name, last-activity time and preview, the live and selected states. */
export type BotListRowProps = Omit<PortedElementProps["button"], "className"> & {
  /** Bot display name, truncated with an ellipsis when it does not fit. */
  name: ReactNode;
  /** Last activity time, such as "8:41 AM". */
  time?: ReactNode;
  /** One-line preview of the latest activity. */
  preview?: ReactNode;
  /** Running bots show the live dot on the avatar. */
  live?: boolean;
  /** The row for the bot currently open in the panel; paints the 10% ink selected fill and announces itself as selected. */
  selected?: boolean;
  /** Extra classes merged onto the row, for margins or width overrides. */
  className?: string;
};

/** A text slot takes a string so the token classes can sit on a `<text>`; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Bot list row` (64:456): a flat 12px-padded row; pressed 5% ink, selected 10% ink.
 *
 * Lynx has no `<button>`, so the row is a `view` whose whole area is the tap target
 * (`bindtap`); the accessible name still comes from its text content (name, time and
 * preview). React's `hover:` fill becomes `active:`, the touch equivalent, and
 * `aria-pressed` becomes `accessibility-traits="selected"` plus
 * `accessibility-value`.
 *
 * @example
 * ```tsx
 * import { BotListRow } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return <BotListRow name="Researcher" time="8:41 AM" preview="Pulled the Q3 numbers" live selected />;
 * }
 * ```
 */
export function BotListRow({ name, time, preview, live, selected, className, onClick, id }: BotListRowProps) {
  return (
    <view
      className={cn(
        "flex w-full min-w-0 flex-row items-center gap-3 rounded-lg p-3 motion-press",
        selected ? "bg-overlay-ink-10" : "active:bg-overlay-ink-5",
        className,
      )}
      bindtap={onClick}
      accessibility-element
      accessibility-traits={selected ? "selected" : "button"}
      accessibility-value={selected ? "true" : "false"}
      {...(id === undefined ? {} : { id })}
    >
      <Avatar type="bot" size="lg" live={live} />
      <view className="flex min-w-0 flex-1 flex-col gap-0.5">
        <view className="flex min-w-0 flex-row items-center gap-2">
          <view className="min-w-0 flex-1">
            {isPlainText(name) ? <text className="truncate text-label-lg text-text-primary">{name}</text> : name}
          </view>
          {time ? (
            <view className="shrink-0">
              {isPlainText(time) ? (
                <text className="whitespace-nowrap text-caption text-text-secondary">{time}</text>
              ) : (
                time
              )}
            </view>
          ) : null}
        </view>
        {preview ? (
          isPlainText(preview) ? (
            <text className="truncate text-body-sm text-text-secondary">{preview}</text>
          ) : (
            preview
          )
        ) : null}
      </view>
    </view>
  );
}
