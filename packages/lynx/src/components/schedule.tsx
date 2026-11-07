import { useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import type { LayoutChangeLike } from "../hooks";
import { cn } from "../lib/cn";
import { readViewport } from "../lib/media";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

/**
 * Field size of a picker, on the shared control scale: `sm` 32px, `md` 40px, `lg` 48px.
 */
export type PickerFieldSize = ControlSize;

/**
 * Props for {@link PickerField}.
 *
 * React forwarded Base UI's select root, which is why its type was closed over `Select.Root`'s
 * members. Lynx has no root to forward to, so the controlled and uncontrolled selection members
 * (`value`, `defaultValue`, `onValueChange`) are spelled out here with the same names and defaults.
 */
export type PickerFieldProps = {
  /** Choices in the popup; `value` is what `onValueChange` returns, `label` is what the row and trigger show. */
  items: {
    /** Value reported when the item is picked. */
    value: string;
    /** Text shown on the trigger and in the popup row. */
    label: ReactNode;
  }[];
  /** Selected value in controlled mode. */
  value?: string;
  /** Starting value in uncontrolled mode. */
  defaultValue?: string;
  /** Fires with the newly selected value, or `null` when the choice is cleared, after a pick. */
  onValueChange?: (value: string | null) => void;
  /** Leading icon, 16px on `sm` and `md` and 20px on `lg`; the Time field uses a clock. */
  icon?: ReactNode;
  /**
   * `solid` (default) is the opaque surface field with a default border, `glass` the veil field,
   * `inset` the 4% ink field inside the schedule card.
   * @default "solid"
   */
  surface?: "solid" | "glass" | "inset";
  /**
   * Field size: `sm` 32px, `md` 40px (default), `lg` 48px; scales width, icon and menu rows.
   * @default "md"
   */
  size?: PickerFieldSize;
  /** Accessible name of the trigger when no visible label is associated with it. */
  "aria-label"?: string;
  /** Classes merged onto the trigger. */
  className?: string;
};

/** The Figma widths (144/160/176px) are the maximum: the field shrinks with a narrow card instead of pushing past it. */
const triggerSizeClass: Record<PickerFieldSize, string> = {
  sm: "flex h-8 w-[144px] max-w-full flex-row items-center gap-1.5 px-3",
  md: "flex h-10 w-[160px] max-w-full flex-row items-center gap-2 px-3.5",
  lg: "flex h-12 w-[176px] max-w-full flex-row items-center gap-2.5 px-5",
};

/** React sized the glyph through `[&>svg]`; `<Icon>` takes the px number instead. */
const triggerIconSize: Record<PickerFieldSize, number> = { sm: 16, md: 16, lg: 20 };

/** The same text rungs as `Input` and `Select` (14/16/18), so a picker and a field line up in a form row. */
const valueSizeClass: Record<PickerFieldSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

/** The trigger's box on the page, measured by `bindlayoutchange`; all values in CSS px. */
type AnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Reads the box a `layoutchange` event reports, relative to the LynxView viewport. */
const boxOf = (event: LayoutChangeLike): AnchorRect => {
  const box = event.detail ?? event.params ?? {};
  return {
    left: typeof box.left === "number" ? box.left : 0,
    top: typeof box.top === "number" ? box.top : 0,
    width: typeof box.width === "number" ? box.width : 0,
    height: typeof box.height === "number" ? box.height : 0,
  };
};

/** The popup's own box, measured after it paints, so it can be kept inside the viewport. */
type PanelSize = { width: number; height: number };

/**
 * The popup's inline position, computed from the trigger's box.
 *
 * Base UI's positioner did this on React; Lynx has no floating-ui, so the popup opens 8px under the
 * trigger, at its start edge and at least as wide as the trigger, flips above when the bottom has no
 * room and slides left when its measured width would cross the viewport. A zero viewport (a plain
 * render test) keeps the requested side, because no collision can be judged.
 */
function popupPlacement(anchor: AnchorRect, panel: PanelSize): CSSProperties {
  const viewport = readViewport();
  const known = viewport.width > 0 && viewport.height > 0;
  const gap = 8;

  const below = anchor.top + anchor.height + gap;
  const fitsBelow = !known || below + panel.height <= viewport.height;
  const top = fitsBelow ? below : Math.max(8, anchor.top - gap - panel.height);

  let left = anchor.left;
  if (known && panel.width > 0) left = Math.max(8, Math.min(left, viewport.width - panel.width - 8));

  return { top, left, minWidth: anchor.width };
}

const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/** Lynx has no hover, so react's hover border becomes the pressed border. */
const triggerFocusClass = "active:border-border-strong";

/**
 * Figma `Time field` (Routine schedule 110:765): a 160px picker on the same 32/40/48px and 14/16/18 text rungs as `Input`.
 *
 * React portalled the popup to the body and let Base UI position it; Lynx has neither, so the popup
 * is a `position: fixed` view painted in place, anchored to the trigger's `layoutchange` box, at
 * least as wide as the trigger and closed by a transparent full-viewport backdrop. The caret rotates
 * while it is open, and the field never grows past its rung width but shrinks with a narrow parent.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { PickerField } from "@horon-ai/lynx";
 *
 * function Example() {
 *   const [time, setTime] = useState("09:00");
 *   return (
 *     <PickerField
 *       aria-label="Start time"
 *       value={time}
 *       onValueChange={(next) => setTime(next ?? time)}
 *       items={[
 *         { value: "09:00", label: "9:00 AM" },
 *         { value: "10:00", label: "10:00 AM" },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function PickerField({
  items,
  icon,
  surface = "solid",
  size = "md",
  className,
  "aria-label": ariaLabel,
  value: controlledValue,
  defaultValue,
  onValueChange,
}: PickerFieldProps) {
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState<PanelSize>({ width: 0, height: 0 });

  const value = controlledValue === undefined ? internalValue : controlledValue;
  const current = items.find((item) => item.value === value) ?? null;
  const chosen = current ? current.label : null;

  const choose = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  };

  return (
    <>
      <view
        className={cn(
          "relative max-w-full min-w-0 rounded-md motion-colors",
          triggerSizeClass[size],
          surface === "glass" ? "veil-field" : surface === "inset" ? "bg-overlay-ink-4" : "border border-border-default bg-bg-surface",
          surface !== "glass" && triggerFocusClass,
          className,
        )}
        bindtap={() => setOpen(!open)}
        bindlayoutchange={(event: LayoutChangeLike) => setAnchor(boxOf(event))}
        accessibility-element
        accessibility-traits="button"
        accessibility-label={ariaLabel}
        accessibility-role-description="select"
        accessibility-value={open ? "expanded" : "collapsed"}
      >
        <view className="relative flex shrink-0 flex-row items-center" accessibility-elements-hidden>
          {icon ?? <Icon name="Clock" size={triggerIconSize[size]} color="text-secondary" />}
        </view>
        {chosen === null ? (
          <view className="relative flex min-w-0 flex-1 flex-row items-center" />
        ) : isPlainText(chosen) ? (
          <text className={cn("relative min-w-0 flex-1 truncate text-text-primary", valueSizeClass[size])}>{chosen}</text>
        ) : (
          <view className="relative flex min-w-0 flex-1 flex-row items-center overflow-hidden">{chosen}</view>
        )}
        <view
          className="relative flex shrink-0 flex-row items-center"
          accessibility-elements-hidden
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transitionProperty: "transform",
            transitionDuration: "200ms",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Icon name="CaretDown" size={triggerIconSize[size]} color="text-secondary" />
        </view>
      </view>

      {open && anchor ? (
        <>
          <view
            className="fixed"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            bindtap={() => setOpen(false)}
            accessibility-element={false}
          />
          <view
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden rounded-xl motion-popup max-w-[calc(100vw-2rem)]",
              size === "sm" ? "p-1" : size === "lg" ? "p-2" : "p-1.5",
              surface === "solid" ? "border border-border-default bg-bg-surface shadow-popover" : "veil-overlay",
            )}
            style={popupPlacement(anchor, panel)}
            bindlayoutchange={(event: LayoutChangeLike) => {
              const box = boxOf(event);
              setPanel((previous) =>
                previous.width === box.width && previous.height === box.height ? previous : { width: box.width, height: box.height },
              );
            }}
            accessibility-element
            accessibility-role-description="listbox"
          >
            <scroll-view scroll-orientation="vertical" scroll-bar-enable={false} style={{ maxHeight: "288px" }}>
              <view className="relative flex flex-col gap-0.5">
                {items.map((item) => {
                  const selected = item.value === value;
                  return (
                    <view
                      key={item.value}
                      className={cn(
                        "flex flex-row items-center rounded-md motion-colors active:bg-overlay-ink-6",
                        size === "sm" ? "h-8 gap-2 px-2.5" : size === "lg" ? "h-12 gap-3 px-4" : "h-10 gap-2.5 px-3",
                        selected && "bg-overlay-ink-6",
                      )}
                      bindtap={() => choose(item.value)}
                      accessibility-element
                      accessibility-traits="button"
                      accessibility-value={selected ? "selected" : undefined}
                    >
                      {isPlainText(item.label) ? (
                        <text
                          className={cn(
                            "min-w-0 flex-1 truncate text-text-primary",
                            size === "sm" ? "text-label-sm" : size === "lg" ? "text-label-lg" : "text-label-md",
                          )}
                        >
                          {item.label}
                        </text>
                      ) : (
                        <view className="flex min-w-0 flex-1 flex-row items-center overflow-hidden">{item.label}</view>
                      )}
                      {selected ? (
                        <Icon name="Check" size={triggerIconSize[size]} color="text-primary" className="animate-pop-in" />
                      ) : null}
                    </view>
                  );
                })}
              </view>
            </scroll-view>
          </view>
        </>
      ) : null}
    </>
  );
}

/**
 * Day circle size: `sm` 32px, `md` 36px, `lg` 44px.
 */
export type WeekdayPickerSize = ControlSize;

/**
 * Props for {@link WeekdayPicker}. It is a multiple-selection toggle group, so `value` and
 * `onValueChange` carry an array of day values.
 */
export type WeekdayPickerProps = {
  /** One entry per day, in display order. */
  days: {
    /** Value that goes into `value` and `onValueChange`. */
    value: string;
    /** Short text on the circle, such as "M". */
    label: string;
    /** Accessible name of the toggle, such as "Monday". */
    name: string;
  }[];
  /** Selected day values in controlled mode. */
  value?: string[];
  /** Selected day values at first render in uncontrolled mode. */
  defaultValue?: string[];
  /** Fires with the complete next selection whenever a day is toggled on or off. */
  onValueChange?: (value: string[]) => void;
  /**
   * Day circle size: `sm` 32px, `md` 36px (default), `lg` 44px.
   * @default "md"
   */
  size?: WeekdayPickerSize;
  /** Accessible name of the group. */
  "aria-label"?: string;
  /** Classes merged onto the wrapping flex row. */
  className?: string;
};

const weekdayGroupSizeClass: Record<WeekdayPickerSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

/** The Figma day circle (32/36/44px) never shrinks; the group wraps instead, so the targets keep their size. */
const weekdayToggleSizeClass: Record<WeekdayPickerSize, string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-11",
};

const weekdayTextSizeClass: Record<WeekdayPickerSize, string> = {
  sm: "text-label-sm",
  md: "text-label-md",
  lg: "text-label-lg",
};

/**
 * Figma `Weekday picker` (110:765): 36px round toggles, ink when on and 6% ink when off.
 *
 * Toggling one day does not close the group; each press reports the whole next selection. The
 * group wraps instead of shrinking its circles, so touch targets stay at least 32px. It is
 * multiple-selection, so several days can be on at once. React read Base UI's `data-pressed`; Lynx
 * reads the same state from its own selection set.
 *
 * @example
 * ```tsx
 * import { WeekdayPicker } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <WeekdayPicker
 *       aria-label="Repeat on"
 *       defaultValue={["mon", "wed", "fri"]}
 *       days={[
 *         { value: "mon", label: "M", name: "Monday" },
 *         { value: "tue", label: "T", name: "Tuesday" },
 *         { value: "wed", label: "W", name: "Wednesday" },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function WeekdayPicker({
  days,
  value: controlledValue,
  defaultValue,
  onValueChange,
  size = "md",
  className,
  ...props
}: WeekdayPickerProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
  const selected = controlledValue === undefined ? internalValue : controlledValue;

  const toggle = (day: string) => {
    const next = selected.includes(day) ? selected.filter((entry) => entry !== day) : [...selected, day];
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <view
      className={cn("flex flex-row flex-wrap items-center", weekdayGroupSizeClass[size], className)}
      accessibility-element
      accessibility-role-description="group"
      accessibility-label={props["aria-label"] ?? "Days"}
    >
      {days.map((day) => {
        const on = selected.includes(day.value);
        return (
          <view
            key={day.value}
            className={cn(
              "flex shrink-0 flex-row items-center justify-center rounded-full motion-press",
              weekdayToggleSizeClass[size],
              on ? "bg-interactive-primary" : "bg-overlay-ink-6",
            )}
            bindtap={() => toggle(day.value)}
            accessibility-element
            accessibility-traits="button"
            accessibility-label={day.name}
            accessibility-value={on ? "selected" : "not selected"}
          >
            <text className={cn(weekdayTextSizeClass[size], on ? "text-interactive-on-primary" : "text-text-secondary")}>
              {day.label}
            </text>
          </view>
        );
      })}
    </view>
  );
}

/**
 * Props for {@link ScheduleCard}. The card is a plain section: it lays out what you pass and
 * draws the frame, header and next-run strip around it.
 */
export type ScheduleCardProps = {
  /** Header title next to the repeat icon. */
  title: ReactNode;
  /** The "Next run" line at the bottom; without it the strip is not rendered. */
  nextRun?: ReactNode;
  /** Body of the card, usually a stack of `ScheduleSection` blocks and pickers. */
  children: ReactNode;
  /**
   * Card size: `sm` 340px, `md` 380px (default), `lg` 420px; scales padding, gaps and text.
   * @default "md"
   */
  size?: ControlSize;
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Classes merged onto the card. */
  className?: string;
};

/** The Figma card widths (340/380/420px) are the maximum: on a narrow screen the card folds to the column width. */
const cardSizeClass: Record<ControlSize, string> = {
  sm: "w-full max-w-[340px] gap-3 p-4",
  md: "w-full max-w-[380px] gap-4 p-5",
  lg: "w-full max-w-[420px] gap-4 p-5",
};

const cardHeaderSizeClass: Record<ControlSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

const cardIconSize: Record<ControlSize, number> = { sm: 16, md: 16, lg: 20 };

const cardTitleSizeClass: Record<ControlSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const nextRunSizeClass: Record<ControlSize, string> = {
  sm: "gap-1.5 px-2.5 py-2",
  md: "gap-2 px-3 py-2",
  lg: "gap-2.5 px-3.5 py-3",
};

const nextRunTextSizeClass: Record<ControlSize, string> = {
  sm: "text-label-md",
  md: "text-label-md",
  lg: "text-label-lg",
};

const nextRunIconSize: Record<ControlSize, number> = { sm: 14, md: 16, lg: 20 };

/**
 * Figma `Routine schedule card` (110:765): a 380px card, 20px padding, 16px gaps, solid or thick glass.
 *
 * Compose it from `ScheduleSection` blocks holding `WeekdayPicker`, `PickerField` or `Input`
 * controls. On a narrow column the card folds to the available width instead of overflowing. The
 * glass layer is the card's first child, so it paints behind the header and body; the host has
 * `overflow-hidden` so the layer's frost fill is clipped to the card's radius.
 *
 * @example
 * ```tsx
 * import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <ScheduleCard title="Morning digest" nextRun="Next run tomorrow at 9:00 AM">
 *       <ScheduleSection label="Repeat">
 *         <PickerField
 *           aria-label="Repeat"
 *           surface="inset"
 *           items={[
 *             { value: "daily", label: "Daily" },
 *             { value: "weekly", label: "Weekly" },
 *           ]}
 *         />
 *       </ScheduleSection>
 *       <ScheduleSection label="Days">
 *         <WeekdayPicker days={[{ value: "mon", label: "M", name: "Monday" }]} />
 *       </ScheduleSection>
 *     </ScheduleCard>
 *   );
 * }
 * ```
 */
export function ScheduleCard({ title, nextRun, children, size = "md", surface = "solid", className }: ScheduleCardProps) {
  return (
    <view
      className={cn(
        "relative flex flex-col items-stretch overflow-hidden rounded-xl",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        cardSizeClass[size],
        className,
      )}
      accessibility-element
    >
      {surface === "glass" && <LiquidGlass />}
      <view className={cn("relative flex flex-row items-center", cardHeaderSizeClass[size])}>
        <view className="flex shrink-0" accessibility-elements-hidden>
          <Icon name="Repeat" size={cardIconSize[size]} color="text-primary" />
        </view>
        {isPlainText(title) ? (
          <text
            className={cn("min-w-0 flex-1 text-text-primary", cardTitleSizeClass[size])}
            accessibility-traits="header"
          >
            {title}
          </text>
        ) : (
          <view className="flex min-w-0 flex-1 flex-row items-center overflow-hidden">{title}</view>
        )}
      </view>
      {children}
      {nextRun ? (
        <view
          className={cn("relative flex flex-row items-center rounded-md bg-accent-sky-500-16", nextRunSizeClass[size])}
        >
          <view className="flex shrink-0" accessibility-elements-hidden>
            <Icon name="CalendarBlank" size={nextRunIconSize[size]} color="text-primary" />
          </view>
          {isPlainText(nextRun) ? (
            <text className={cn("text-text-primary", nextRunTextSizeClass[size])}>{nextRun}</text>
          ) : (
            <view className="flex min-w-0 flex-1 flex-row items-center">{nextRun}</view>
          )}
        </view>
      ) : null}
    </view>
  );
}

/** Vertical gap between a section's caption and its control, per size. */
const sectionSizeClass: Record<ControlSize, string> = {
  sm: "gap-1",
  md: "gap-2",
  lg: "gap-2",
};

const sectionLabelSizeClass: Record<ControlSize, string> = {
  sm: "text-caption",
  md: "text-caption",
  lg: "text-label-sm",
};

/**
 * A captioned block inside the schedule card, such as "Repeat" or "Days". Renders the caption in
 * secondary text above its children, so a card body becomes a stack of labelled controls.
 */
export function ScheduleSection({
  label,
  children,
  /** Matches the size of the controls inside the section. */
  size = "md",
  className,
}: {
  /** Caption above the control, in secondary text. */
  label: ReactNode;
  /** The control the caption belongs to. */
  children: ReactNode;
  /**
   * Matches the size of the controls inside the section; scales the caption rung and the caption gap.
   * @default "md"
   */
  size?: ControlSize;
  /** Classes merged onto the block. */
  className?: string;
}) {
  return (
    <view className={cn("relative flex min-w-0 flex-col", sectionSizeClass[size], className)}>
      {isPlainText(label) ? (
        <text className={cn("text-text-secondary", sectionLabelSizeClass[size])}>{label}</text>
      ) : (
        <view className="flex flex-row items-center">{label}</view>
      )}
      {children}
    </view>
  );
}
