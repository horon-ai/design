import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDown, Check } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { fieldBoxClass, type InputSurface } from "./input";
import { LiquidGlass } from "./liquid-glass";

export type SelectItemData = { value: string; label: ReactNode; disabled?: boolean };

export type SelectProps = Omit<ComponentProps<typeof BaseSelect.Root>, "items" | "children"> & {
  items: SelectItemData[];
  placeholder?: ReactNode;
  surface?: InputSurface;
  invalid?: boolean;
  className?: string;
  "aria-label"?: string;
};

/**
 * Figma `Select` (58:162) trigger with the `Select list` (88:495) popup: a 40px
 * field with a 16px caret; Solid uses the 18px body-lg value, Glass body-md.
 * The popup is thick glass, 20px radius, 40px rows; the chosen row is 6% ink with a check.
 */
export function Select({
  items,
  placeholder = "Select",
  surface = "glass",
  invalid,
  className,
  "aria-label": ariaLabel,
  ...props
}: SelectProps) {
  return (
    <BaseSelect.Root items={items} {...props}>
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        data-invalid={invalid ? "" : undefined}
        className={cn(
          fieldBoxClass.base,
          fieldBoxClass[surface],
          "group h-10 w-60 cursor-pointer text-left data-disabled:cursor-not-allowed",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
          className,
        )}
      >
        {surface === "glass" && <LiquidGlass tier="regular" />}
        <BaseSelect.Value
          placeholder={placeholder}
          className={cn(
            "relative min-w-0 flex-1 truncate text-text-primary group-data-disabled:text-text-disabled data-placeholder:text-text-placeholder",
            surface === "solid" ? "text-body-lg" : "text-body-md",
          )}
        />
        <BaseSelect.Icon className="relative flex shrink-0 text-text-secondary [&_svg]:size-4">
          <CaretDown />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={8} alignItemWithTrigger={false} className="z-50 outline-none">
          <BaseSelect.Popup className="relative min-w-(--anchor-width) origin-(--transform-origin) overflow-clip rounded-xl border border-glass-rim-strong bg-glass-thick p-1.5 transition-[scale,opacity] duration-100 outline-none data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <LiquidGlass tier="thick" />
            <BaseSelect.List className="relative flex flex-col gap-0.5">
              {items.map((item) => (
                <BaseSelect.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className="flex h-10 cursor-pointer items-center gap-2.5 rounded-md px-3 text-label-md text-text-primary outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:bg-overlay-ink-6 data-selected:bg-overlay-ink-6"
                >
                  <BaseSelect.ItemText className="min-w-0 flex-1">{item.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="flex shrink-0 text-text-primary [&_svg]:size-4.5">
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
