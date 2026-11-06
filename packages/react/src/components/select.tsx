import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDown, Check } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldSizeClass, fieldTextClass, type InputSurface } from "./input";
import { inputGroupSegmentClass, useInputGroup } from "./input-group";

export type SelectSize = ControlSize;
export type SelectItemData = {
  value: string;
  label: ReactNode;
  /** Shorter text for the trigger once chosen, such as `+82` for "+82 South Korea". */
  selectedLabel?: ReactNode;
  disabled?: boolean;
};

export type SelectProps = Omit<ComponentProps<typeof BaseSelect.Root>, "items" | "children"> & {
  items: SelectItemData[];
  placeholder?: ReactNode;
  size?: SelectSize;
  surface?: InputSurface;
  invalid?: boolean;
  /**
   * `chip` is the Paper filter chip: a 32px bg-subtle pill, 12px padding, 13/18 medium, sized to its label.
   * `segment` is the tinted prefix or suffix of an `InputGroup`; it takes the group's size and disabled state.
   */
  variant?: "field" | "chip" | "segment";
  showIndicator?: boolean;
  className?: string;
  "aria-label"?: string;
};

const itemClass: Record<SelectSize, string> = {
  sm: "h-8 gap-2 px-2.5 text-label-sm",
  md: "h-10 gap-2.5 px-3 text-label-md",
  lg: "h-12 gap-3 px-4 text-label-lg",
};

const itemIconClass: Record<SelectSize, string> = {
  sm: "[&_svg]:size-4",
  md: "[&_svg]:size-4",
  lg: "[&_svg]:size-5",
};

/** The field box rings on `:focus-within` (`fieldBoxClass.base`); a chip or segment is the focused element itself, so it carries its own `focus-visible` ring. */
const triggerFocusClass = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand";

/**
 * Figma `Select` (58:162) trigger with the `Select list` (88:495) popup: a field with the
 * same text rung as `Input` (14/16/18) and a 16/20px caret; the surface never changes the
 * text size. The popup is the veil (`veil-overlay`), 20px radius, 40px rows; the chosen row
 * is 6% ink with a check. `variant="chip"` keeps its single 32px chip size;
 * `variant="segment"` follows its `InputGroup`.
 */
export function Select({
  items,
  placeholder = "Select",
  size: ownSize = "md",
  surface = "solid",
  invalid,
  variant = "field",
  showIndicator = true,
  disabled,
  className,
  "aria-label": ariaLabel,
  ...props
}: SelectProps) {
  const group = useInputGroup();
  const segment = variant === "segment";
  const field = variant === "field";
  const size = segment && group ? group.size : ownSize;
  const popupSurface = segment && group ? group.surface : surface;
  return (
    <BaseSelect.Root items={items} disabled={disabled ?? (segment ? group?.disabled : undefined)} {...props}>
      <BaseSelect.Trigger
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        data-invalid={invalid ? "" : undefined}
        className={cn(
          field
            ? cn(
                fieldBoxClass.base,
                fieldBoxClass[surface],
                fieldSizeClass[size],
                "w-60 max-w-full",
                surface !== "glass" && "hover:not-data-disabled:not-data-invalid:border-border-strong",
              )
            : segment
              ? cn(inputGroupSegmentClass[size], "text-left data-disabled:text-text-disabled", triggerFocusClass)
              : cn(
                  "relative inline-flex h-8 items-center gap-1 rounded-full bg-bg-subtle px-3 text-label-md hover:not-data-disabled:bg-overlay-ink-8",
                  triggerFocusClass,
                ),
          "group cursor-pointer text-left motion-colors data-disabled:cursor-not-allowed",
          className,
        )}
      >
        <BaseSelect.Value
          className={cn(
            "relative min-w-0 truncate data-placeholder:text-text-placeholder",
            segment ? "" : "flex-1 text-text-primary group-data-disabled:text-text-disabled",
            field ? fieldTextClass[size] : "",
          )}
        >
          {(value: string | null) => {
            const item = items.find((entry) => entry.value === value);
            return item ? (item.selectedLabel ?? item.label) : placeholder;
          }}
        </BaseSelect.Value>
        {showIndicator ? (
          <BaseSelect.Icon
            className={cn(
              "relative flex shrink-0 text-text-secondary transition-transform duration-200 ease-out-quint group-data-popup-open:rotate-180",
              variant === "chip" && "[&_svg]:size-4",
            )}
          >
            <CaretDown />
          </BaseSelect.Icon>
        ) : null}
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} alignItemWithTrigger={false} className="z-50 outline-none">
          <BaseSelect.Popup
            className={cn(
              "relative max-w-[calc(100vw-2rem)] min-w-(--anchor-width) motion-popup overflow-clip rounded-xl p-1.5 outline-none",
              popupSurface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-popover",
            )}
          >
            <BaseSelect.List className="relative flex flex-col gap-0.5">
              {items.map((item) => (
                <BaseSelect.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className={cn(
                    "flex cursor-pointer items-center rounded-md text-text-primary motion-colors outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:bg-overlay-ink-6 data-selected:bg-overlay-ink-6",
                    itemClass[size],
                  )}
                >
                  <BaseSelect.ItemText className="min-w-0 flex-1">{item.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className={cn("flex shrink-0 text-text-primary", itemIconClass[size])}>
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
