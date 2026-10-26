import { Select as BaseSelect } from "@base-ui/react/select";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { CalendarBlank, CaretDown, Check, Clock, Repeat } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type PickerFieldProps = {
  items: { value: string; label: ReactNode }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  /** Leading 16px icon; the Time field uses a clock. */
  icon?: ReactNode;
  /** `glass` is the standalone Time field, `inset` the 4% ink field inside the schedule card. */
  surface?: "glass" | "inset";
  "aria-label"?: string;
  className?: string;
};

/** Figma `Time field` (Routine schedule 110:765): a 160px, 40px-high picker with body-sm value and a 14px caret. */
export function PickerField({
  items,
  icon,
  surface = "glass",
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
          "relative flex h-10 w-40 cursor-pointer items-center gap-2 rounded-md px-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
          surface === "glass" ? "overflow-clip border border-glass-rim-strong bg-glass-regular" : "bg-overlay-ink-4",
          className,
        )}
      >
        {surface === "glass" && <LiquidGlass tier="regular" />}
        <span className="relative flex shrink-0 text-text-secondary [&>svg]:size-4">{icon ?? <Clock />}</span>
        <BaseSelect.Value className="relative min-w-0 flex-1 truncate text-body-sm text-text-primary" />
        <CaretDown aria-hidden className="relative size-3.5 shrink-0 text-text-secondary" />
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={8} alignItemWithTrigger={false} className="z-50 outline-none">
          <BaseSelect.Popup className="relative max-h-72 min-w-(--anchor-width) overflow-y-auto rounded-xl border border-glass-rim-strong bg-glass-thick p-1.5 outline-none">
            <LiquidGlass tier="thick" />
            <BaseSelect.List className="relative flex flex-col gap-0.5">
              {items.map((item) => (
                <BaseSelect.Item
                  key={item.value}
                  value={item.value}
                  className="flex h-10 cursor-pointer items-center gap-2.5 rounded-md px-3 text-label-md text-text-primary outline-none select-none data-highlighted:bg-overlay-ink-6 data-selected:bg-overlay-ink-6"
                >
                  <BaseSelect.ItemText className="min-w-0 flex-1">{item.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="flex shrink-0 [&_svg]:size-4.5">
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

export type WeekdayPickerProps = {
  /** One entry per day, in display order. */
  days: { value: string; label: string; name: string }[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  "aria-label"?: string;
  className?: string;
};

/** Figma `Weekday picker` (110:765): 36px round toggles, ink when on and 6% ink when off. */
export function WeekdayPicker({ days, value, defaultValue, onValueChange, className, ...props }: WeekdayPickerProps) {
  return (
    <ToggleGroup
      multiple
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next)}
      aria-label={props["aria-label"] ?? "Days"}
      className={cn("flex items-center gap-1.5", className)}
    >
      {days.map((day) => (
        <Toggle
          key={day.value}
          value={day.value}
          aria-label={day.name}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-overlay-ink-6 text-label-md text-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-pressed:bg-interactive-primary data-pressed:text-text-inverse"
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
  className?: string;
};

/** Figma `Routine schedule card` (110:765): a 380px thick-glass card, 18px padding, 14px gaps. */
export function ScheduleCard({ title, nextRun, children, className }: ScheduleCardProps) {
  return (
    <section
      className={cn(
        "relative flex w-95 flex-col items-stretch gap-3.5 overflow-clip rounded-xl border border-glass-rim-strong bg-glass-thick p-4.5",
        className,
      )}
    >
      <LiquidGlass tier="thick" />
      <div className="relative flex items-center gap-2.5">
        <Repeat aria-hidden className="size-4.5 shrink-0 text-text-primary" />
        <h3 className="min-w-0 flex-1 text-label-lg text-text-primary">{title}</h3>
      </div>
      {children}
      {nextRun && (
        <div className="relative flex items-center gap-2 rounded-md bg-accent-sky-500-16 px-3 py-2.5 text-label-md text-text-primary">
          <CalendarBlank aria-hidden className="size-4 shrink-0" />
          {nextRun}
        </div>
      )}
    </section>
  );
}

/** A captioned block inside the schedule card, such as "Repeat" or "Days". */
export function ScheduleSection({
  label,
  children,
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-caption text-text-secondary">{label}</span>
      {children}
    </div>
  );
}
