import { Select as BaseSelect } from "@base-ui/react/select";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { CalendarBlank, CaretDown, Check, Clock, Repeat } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

export type PickerFieldSize = ControlSize;

export type PickerFieldProps = {
  items: { value: string; label: ReactNode }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  /** Leading 16px icon; the Time field uses a clock. */
  icon?: ReactNode;
  /**
   * `solid` (default) is the opaque surface field with a default border, `glass` the veil field,
   * `inset` the 4% ink field inside the schedule card.
   */
  surface?: "solid" | "glass" | "inset";
  /** Field size: `sm` 32px, `md` 40px (default), `lg` 48px; scales width, icon and menu rows. */
  size?: PickerFieldSize;
  "aria-label"?: string;
  className?: string;
};

const triggerSizeClass: Record<PickerFieldSize, string> = {
  sm: "h-8 w-36 gap-1.5 px-2.5",
  md: "h-10 w-40 gap-2 px-3",
  lg: "h-12 w-44 gap-2.5 px-3.5",
};

const triggerIconSizeClass: Record<PickerFieldSize, string> = {
  sm: "[&>svg]:size-4",
  md: "[&>svg]:size-4",
  lg: "[&>svg]:size-5",
};

const valueSizeClass: Record<PickerFieldSize, string> = {
  sm: "text-body-sm",
  md: "text-body-sm",
  lg: "text-body-md",
};

const caretSizeClass: Record<PickerFieldSize, string> = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
};

const popupSizeClass: Record<PickerFieldSize, string> = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

const itemSizeClass: Record<PickerFieldSize, string> = {
  sm: "h-8 gap-2 px-2.5 text-label-md",
  md: "h-10 gap-2.5 px-3 text-label-md",
  lg: "h-12 gap-3 px-3.5 text-label-lg",
};

const itemIndicatorSizeClass: Record<PickerFieldSize, string> = {
  sm: "[&_svg]:size-4",
  md: "[&_svg]:size-4.5",
  lg: "[&_svg]:size-5",
};

/** Figma `Time field` (Routine schedule 110:765): a 160px, 40px-high picker with body-sm value and a 14px caret. */
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
          "relative flex cursor-pointer items-center rounded-md text-left motion-colors outline-none",
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
              "relative max-h-72 min-w-(--anchor-width) motion-popup overflow-y-auto rounded-xl outline-none",
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
                    <Check />
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

export type WeekdayPickerSize = ControlSize;

export type WeekdayPickerProps = {
  /** One entry per day, in display order. */
  days: { value: string; label: string; name: string }[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Day circle size: `sm` 32px, `md` 36px (default), `lg` 44px. */
  size?: WeekdayPickerSize;
  "aria-label"?: string;
  className?: string;
};

const weekdayGroupSizeClass: Record<WeekdayPickerSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

const weekdayToggleSizeClass: Record<WeekdayPickerSize, string> = {
  sm: "size-8 text-label-sm",
  md: "size-9 text-label-md",
  lg: "size-11 text-label-lg",
};

/** Figma `Weekday picker` (110:765): 36px round toggles, ink when on and 6% ink when off. */
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
      className={cn("flex items-center", weekdayGroupSizeClass[size], className)}
    >
      {days.map((day) => (
        <Toggle
          key={day.value}
          value={day.value}
          aria-label={day.name}
          className={cn(
            "flex shrink-0 motion-press cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 text-text-secondary outline-none data-pressed:bg-interactive-primary data-pressed:text-text-inverse",
            weekdayToggleSizeClass[size],
          )}
        >
          {day.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

export type ScheduleCardProps = {
  title: ReactNode;
  /** The "Next run" line at the bottom. */
  nextRun?: ReactNode;
  children: ReactNode;
  /** Card size: `sm` 340px, `md` 380px (default), `lg` 420px; scales padding, gaps and text. */
  size?: ControlSize;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. */
  surface?: "solid" | "glass";
  className?: string;
};

const cardSizeClass: Record<ControlSize, string> = {
  sm: "w-85 gap-3 p-3.5",
  md: "w-95 gap-3.5 p-4.5",
  lg: "w-105 gap-4 p-5",
};

const cardHeaderSizeClass: Record<ControlSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

const cardIconSizeClass: Record<ControlSize, string> = {
  sm: "size-4",
  md: "size-4.5",
  lg: "size-5",
};

const cardTitleSizeClass: Record<ControlSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const nextRunSizeClass: Record<ControlSize, string> = {
  sm: "gap-1.5 px-2.5 py-2 text-label-md",
  md: "gap-2 px-3 py-2.5 text-label-md",
  lg: "gap-2.5 px-3.5 py-3 text-label-lg",
};

const nextRunIconSizeClass: Record<ControlSize, string> = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-4.5",
};

/** Figma `Routine schedule card` (110:765): a 380px card, 18px padding, 14px gaps, solid or thick glass. */
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

/** A captioned block inside the schedule card, such as "Repeat" or "Days". */
const sectionSizeClass: Record<ControlSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

const sectionLabelSizeClass: Record<ControlSize, string> = {
  sm: "text-caption",
  md: "text-caption",
  lg: "text-label-sm",
};

export function ScheduleSection({
  label,
  children,
  /** Matches the size of the controls inside the section. */
  size = "md",
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  size?: ControlSize;
  className?: string;
}) {
  return (
    <div className={cn("relative flex min-w-0 flex-col", sectionSizeClass[size], className)}>
      <span className={cn("text-text-secondary", sectionLabelSizeClass[size])}>{label}</span>
      {children}
    </div>
  );
}
