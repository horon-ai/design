import { Select as BaseSelect } from "@base-ui/react/select";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { CalendarBlank, CaretDown, Check, Clock, Repeat } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

/**
 * Field size of a picker, on the shared control scale: `sm` 32px, `md` 40px, `lg` 48px.
 */
export type PickerFieldSize = ControlSize;

/**
 * Props for {@link PickerField}. The type is closed: it declares no `disabled` or `name` (and no
 * other Base UI `Select.Root` prop), so TypeScript rejects them before they reach the root; `items`
 * is the label list the trigger reads.
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
  sm: "h-8 w-36 max-w-full gap-1.5 px-3",
  md: "h-10 w-40 max-w-full gap-2 px-3.5",
  lg: "h-12 w-44 max-w-full gap-2.5 px-5",
};

const triggerIconSizeClass: Record<PickerFieldSize, string> = {
  sm: "[&>svg]:size-4",
  md: "[&>svg]:size-4",
  lg: "[&>svg]:size-5",
};

/** The same text rungs as `Input` and `Select` (14/16/18), so a picker and a field line up in a form row. */
const valueSizeClass: Record<PickerFieldSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

const caretSizeClass: Record<PickerFieldSize, string> = {
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
};

const popupSizeClass: Record<PickerFieldSize, string> = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

/** The same popup rows as `Select`, so the two pickers share one list style. */
const itemSizeClass: Record<PickerFieldSize, string> = {
  sm: "h-8 gap-2 px-2.5 text-label-sm",
  md: "h-10 gap-2.5 px-3 text-label-md",
  lg: "h-12 gap-3 px-4 text-label-lg",
};

const itemIndicatorSizeClass: Record<PickerFieldSize, string> = {
  sm: "[&_svg]:size-4",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
};

/**
 * Figma `Time field` (Routine schedule 110:765): a 160px picker on the same 32/40/48px and 14/16/18 text rungs as `Input`.
 *
 * The popup is portalled to the body and aligned under the trigger with an 8px offset, so it can
 * escape a scrolling card; the caret rotates while it is open. The field never grows past its
 * rung width but shrinks with a narrow parent.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { PickerField } from "@horon-ai/react";
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
  onValueChange,
  ...props
}: PickerFieldProps) {
  return (
    <BaseSelect.Root items={items} onValueChange={(next) => onValueChange?.(next)} {...props}>
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        className={cn(
          "relative flex max-w-full min-w-0 cursor-pointer items-center rounded-md text-left motion-colors",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-brand",
          triggerSizeClass[size],
          surface === "glass"
            ? "group veil-field"
            : surface === "inset"
              ? "group bg-overlay-ink-4"
              : "group border border-border-default bg-bg-surface",
          className,
        )}
      >
        <span className={cn("relative flex shrink-0 text-text-secondary", triggerIconSizeClass[size])}>
          {icon ?? <Clock />}
        </span>
        <BaseSelect.Value className={cn("relative min-w-0 flex-1 truncate text-text-primary", valueSizeClass[size])} />
        <CaretDown
          aria-hidden
          className={cn(
            "relative shrink-0 text-text-secondary transition-transform duration-200 ease-out-quint group-data-popup-open:rotate-180",
            caretSizeClass[size],
          )}
        />
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={8} alignItemWithTrigger={false} className="z-50 outline-none">
          <BaseSelect.Popup
            className={cn(
              "relative max-h-72 max-w-[calc(100vw-2rem)] min-w-(--anchor-width) motion-popup overflow-y-auto rounded-xl outline-none",
              surface === "solid" ? "border border-border-default bg-bg-surface shadow-popover" : "veil-overlay",
              popupSizeClass[size],
            )}
          >
            <BaseSelect.List className="relative flex flex-col gap-0.5">
              {items.map((item) => (
                <BaseSelect.Item
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "flex cursor-pointer items-center rounded-md text-text-primary motion-colors outline-none select-none data-highlighted:bg-overlay-ink-6 data-selected:bg-overlay-ink-6",
                    itemSizeClass[size],
                  )}
                >
                  <BaseSelect.ItemText className="min-w-0 flex-1">{item.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className={cn("flex shrink-0", itemIndicatorSizeClass[size])}>
                    <Check className="animate-pop-in" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
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
  sm: "size-8 text-label-sm",
  md: "size-9 text-label-md",
  lg: "size-11 text-label-lg",
};

/**
 * Figma `Weekday picker` (110:765): 36px round toggles, ink when on and 6% ink when off.
 *
 * Toggling one day does not close the group; each press reports the whole next selection. The
 * group wraps instead of shrinking its circles, so touch targets stay at least 32px. It is
 * multiple-selection, so several days can be on at once.
 *
 * @example
 * ```tsx
 * import { WeekdayPicker } from "@horon-ai/react";
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
  value,
  defaultValue,
  onValueChange,
  size = "md",
  className,
  ...props
}: WeekdayPickerProps) {
  return (
    <ToggleGroup
      multiple
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next)}
      aria-label={props["aria-label"] ?? "Days"}
      className={cn("flex flex-wrap items-center", weekdayGroupSizeClass[size], className)}
    >
      {days.map((day) => (
        <Toggle
          key={day.value}
          value={day.value}
          aria-label={day.name}
          className={cn(
            "flex shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 text-text-secondary",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
            "data-pressed:bg-interactive-primary data-pressed:text-interactive-on-primary",
            weekdayToggleSizeClass[size],
          )}
        >
          {day.label}
        </Toggle>
      ))}
    </ToggleGroup>
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
  sm: "w-full max-w-85 gap-3 p-4",
  md: "w-full max-w-95 gap-4 p-5",
  lg: "w-full max-w-105 gap-4 p-5",
};

const cardHeaderSizeClass: Record<ControlSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

const cardIconSizeClass: Record<ControlSize, string> = {
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
};

const cardTitleSizeClass: Record<ControlSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const nextRunSizeClass: Record<ControlSize, string> = {
  sm: "gap-1.5 px-2.5 py-2 text-label-md",
  md: "gap-2 px-3 py-2 text-label-md",
  lg: "gap-2.5 px-3.5 py-3 text-label-lg",
};

const nextRunIconSizeClass: Record<ControlSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
};

/**
 * Figma `Routine schedule card` (110:765): a 380px card, 20px padding, 16px gaps, solid or thick glass.
 *
 * Compose it from `ScheduleSection` blocks holding `WeekdayPicker`, `PickerField` or `Input`
 * controls. On a narrow column the card folds to the available width instead of overflowing.
 *
 * @example
 * ```tsx
 * import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "@horon-ai/react";
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
export function ScheduleCard({
  title,
  nextRun,
  children,
  size = "md",
  surface = "solid",
  className,
}: ScheduleCardProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col items-stretch overflow-clip rounded-xl",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        cardSizeClass[size],
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <div className={cn("relative flex items-center", cardHeaderSizeClass[size])}>
        <Repeat aria-hidden className={cn("shrink-0 text-text-primary", cardIconSizeClass[size])} />
        <h3 className={cn("min-w-0 flex-1 text-text-primary", cardTitleSizeClass[size])}>{title}</h3>
      </div>
      {children}
      {nextRun && (
        <div
          className={cn(
            "relative flex items-center rounded-md bg-accent-sky-500-16 text-text-primary",
            nextRunSizeClass[size],
          )}
        >
          <CalendarBlank aria-hidden className={cn("shrink-0", nextRunIconSizeClass[size])} />
          {nextRun}
        </div>
      )}
    </section>
  );
}

/**
 * A captioned block inside the schedule card, such as "Repeat" or "Days"; the caption-to-control gap is `Field`'s.
 */
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
    <div className={cn("relative flex min-w-0 flex-col", sectionSizeClass[size], className)}>
      <span className={cn("text-text-secondary", sectionLabelSizeClass[size])}>{label}</span>
      {children}
    </div>
  );
}
