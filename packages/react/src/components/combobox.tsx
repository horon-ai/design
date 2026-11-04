import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { CaretDown, Check, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useRef, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldSizeClass, fieldTextClass, type InputSurface } from "./input";
import { inputGroupSegmentClass, useInputGroup } from "./input-group";

export type ComboboxSize = ControlSize;

export type ComboboxItemData = {
  value: string;
  /** Row text and the text the search matches. */
  label: string;
  /** Shorter text shown once chosen, such as `+82` for "+82 South Korea". */
  selectedLabel?: string;
  /** Secondary text on the right of the row, such as a dial code. */
  trailing?: ReactNode;
  /** Extra search terms that are not shown, such as `KR` or `Korea`. */
  keywords?: readonly string[];
  disabled?: boolean;
};

type ComboboxBaseProps = {
  items: readonly ComboboxItemData[];
  placeholder?: string;
  /** Placeholder of the search box inside the popup (`segment` variant). */
  searchPlaceholder?: string;
  /** Shown in the popup when nothing matches the search. */
  emptyLabel?: ReactNode;
  size?: ComboboxSize;
  surface?: InputSurface;
  /**
   * `field` is a searchable field (the default). `segment` is the tinted prefix or suffix of an
   * `InputGroup`: a button that opens a popup with the search box on top, taking the group's size.
   */
  variant?: "field" | "segment";
  invalid?: boolean;
  disabled?: boolean;
  /** Form field name; the submitted value is the item `value`. */
  name?: string;
  className?: string;
  "aria-label"?: string;
};

export type ComboboxSingleProps = ComboboxBaseProps & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

export type ComboboxMultipleProps = ComboboxBaseProps & {
  /** Chosen items show as removable chips in the field. */
  multiple: true;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
};

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const itemClass: Record<ComboboxSize, string> = {
  sm: "h-8 gap-2 px-2.5 text-label-sm [&_svg]:size-4",
  md: "h-10 gap-2.5 px-3 text-label-md [&_svg]:size-4.5",
  lg: "h-12 gap-3 px-4 text-label-lg [&_svg]:size-5",
};

const chipClass: Record<ComboboxSize, string> = {
  sm: "h-5 gap-0.5 pr-0.5 pl-1.5 text-label-sm [&_svg]:size-3",
  md: "h-6 gap-1 pr-1 pl-2 text-label-sm [&_svg]:size-3.5",
  lg: "h-7 gap-1 pr-1 pl-2.5 text-label-md [&_svg]:size-4",
};

/** Multiple chips wrap, so the field grows from its rung height instead of fixing it. */
const multiFieldClass: Record<ComboboxSize, string> = {
  sm: "min-h-8 flex-wrap gap-1 px-2 py-1 [&_svg]:size-4",
  md: "min-h-10 flex-wrap gap-1.5 px-2.5 py-1.5 [&_svg]:size-4",
  lg: "min-h-12 flex-wrap gap-2 px-3 py-2 [&_svg]:size-5",
};

/** The popup follows the field's surface (a segment takes its group's): glass is the veil, every solid kind is solid. */
const popupClass = "relative max-h-80 min-w-(--anchor-width) motion-popup overflow-clip rounded-xl p-1.5 outline-none";
const popupSurfaceClass = (surface: InputSurface) =>
  surface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-popover";

const findItem = (items: readonly ComboboxItemData[], value: string | null | undefined) =>
  value == null ? null : (items.find((item) => item.value === value) ?? null);

const shortLabel = (item: ComboboxItemData) => item.selectedLabel ?? item.label;

/**
 * Search and choose: a field you type into to narrow the list, then pick one item or, with
 * `multiple`, several items shown as chips. The popup matches `Select`: the veil, rows with
 * a check. `variant="segment"` puts it in an `InputGroup`, such as a country code before a
 * phone number.
 */
export function Combobox(props: ComboboxProps) {
  const {
    items,
    placeholder = "Search",
    searchPlaceholder = "Search",
    emptyLabel = "No results",
    size: ownSize = "md",
    surface = "solid",
    variant = "field",
    invalid,
    disabled,
    name,
    className,
    "aria-label": ariaLabel,
  } = props;
  const group = useInputGroup();
  const segment = variant === "segment";
  const size = segment && group ? group.size : ownSize;
  const popupSurface = segment && group ? group.surface : surface;
  const anchor = useRef<HTMLDivElement>(null);

  const list = (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        anchor={segment ? undefined : anchor}
        sideOffset={4}
        align="start"
        className="z-50 outline-none"
      >
        <BaseCombobox.Popup
          className={cn(popupClass, popupSurfaceClass(popupSurface), segment && "flex w-64 flex-col gap-1")}
        >
          {segment && (
            <div className={cn(fieldBoxClass.base, fieldBoxClass.solid, fieldSizeClass[size], "shrink-0")}>
              <MagnifyingGlass aria-hidden className="relative shrink-0 text-text-secondary" />
              <BaseCombobox.Input
                placeholder={searchPlaceholder}
                className={cn("relative", fieldBoxClass.text, fieldTextClass[size])}
              />
            </div>
          )}
          <BaseCombobox.Empty
            className={cn(
              "relative px-3 text-text-secondary empty:hidden",
              size === "lg" ? "py-3 text-body-md" : "py-2 text-body-sm",
            )}
          >
            {emptyLabel}
          </BaseCombobox.Empty>
          <BaseCombobox.List className="relative flex max-h-64 flex-col gap-0.5 overflow-y-auto">
            {(item: ComboboxItemData) => (
              <BaseCombobox.Item
                key={item.value}
                value={item}
                disabled={item.disabled}
                className={cn(
                  "flex shrink-0 cursor-pointer items-center rounded-md text-text-primary motion-colors outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-40 data-highlighted:bg-overlay-ink-6 data-selected:bg-overlay-ink-6",
                  itemClass[size],
                )}
              >
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.trailing && <span className="shrink-0 text-text-secondary">{item.trailing}</span>}
                <BaseCombobox.ItemIndicator className="flex shrink-0 text-text-primary">
                  <Check />
                </BaseCombobox.ItemIndicator>
              </BaseCombobox.Item>
            )}
          </BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );

  const shared = {
    items,
    name,
    disabled: disabled ?? (segment ? group?.disabled : undefined),
    itemToStringLabel: shortLabel,
    itemToStringValue: (item: ComboboxItemData) => item.value,
    isItemEqualToValue: (item: ComboboxItemData, value: ComboboxItemData) => item.value === value.value,
    filter: (item: ComboboxItemData, query: string) => {
      const needle = query.trim().toLowerCase();
      if (!needle) return true;
      return [item.label, item.value, ...(item.keywords ?? [])].some((text) => text.toLowerCase().includes(needle));
    },
  };

  const body = (
    <>
      {segment ? (
        <BaseCombobox.Trigger
          aria-label={ariaLabel}
          className={cn(
            inputGroupSegmentClass[size],
            "group cursor-pointer text-left outline-none data-disabled:cursor-not-allowed data-disabled:text-text-disabled",
            className,
          )}
        >
          <BaseCombobox.Value>
            {(value: ComboboxItemData | ComboboxItemData[] | null) => {
              const chosen = Array.isArray(value) ? value : value ? [value] : [];
              return chosen.length ? (
                <span className="truncate">{chosen.map(shortLabel).join(", ")}</span>
              ) : (
                <span className="text-text-placeholder">{placeholder}</span>
              );
            }}
          </BaseCombobox.Value>
          <CaretDown
            aria-hidden
            className="shrink-0 transition-transform duration-200 ease-out-quint group-data-popup-open:rotate-180"
          />
        </BaseCombobox.Trigger>
      ) : props.multiple ? (
        <BaseCombobox.Chips
          ref={anchor}
          data-invalid={invalid ? "" : undefined}
          className={cn(
            fieldBoxClass.base,
            fieldBoxClass[surface],
            multiFieldClass[size],
            "w-72 cursor-text data-disabled:cursor-not-allowed",
            className,
          )}
        >
          <BaseCombobox.Value>
            {(value: ComboboxItemData[]) => (
              <>
                {value.map((item) => (
                  <BaseCombobox.Chip
                    key={item.value}
                    className={cn(
                      "relative flex shrink-0 items-center rounded-full bg-overlay-ink-6 text-text-primary outline-none data-highlighted:bg-overlay-ink-12",
                      chipClass[size],
                    )}
                  >
                    {shortLabel(item)}
                    <BaseCombobox.ChipRemove
                      aria-label={`Remove ${item.label}`}
                      className="flex cursor-pointer rounded-full p-0.5 text-text-secondary hover:bg-overlay-ink-10 hover:text-text-primary"
                    >
                      <X />
                    </BaseCombobox.ChipRemove>
                  </BaseCombobox.Chip>
                ))}
                <BaseCombobox.Input
                  aria-label={ariaLabel}
                  aria-invalid={invalid || undefined}
                  placeholder={value.length ? undefined : placeholder}
                  className={cn("relative min-w-16", fieldBoxClass.text, fieldTextClass[size])}
                />
              </>
            )}
          </BaseCombobox.Value>
        </BaseCombobox.Chips>
      ) : (
        <BaseCombobox.InputGroup
          ref={anchor}
          data-invalid={invalid ? "" : undefined}
          className={cn(fieldBoxClass.base, fieldBoxClass[surface], fieldSizeClass[size], "w-60", className)}
        >
          <MagnifyingGlass aria-hidden className="relative shrink-0 text-text-secondary" />
          <BaseCombobox.Input
            aria-label={ariaLabel}
            aria-invalid={invalid || undefined}
            placeholder={placeholder}
            className={cn("relative", fieldBoxClass.text, fieldTextClass[size])}
          />
          <BaseCombobox.Trigger
            aria-label="Show options"
            className="group relative flex shrink-0 cursor-pointer text-text-secondary outline-none"
          >
            <CaretDown
              aria-hidden
              className="transition-transform duration-200 ease-out-quint group-data-popup-open:rotate-180"
            />
          </BaseCombobox.Trigger>
        </BaseCombobox.InputGroup>
      )}
      {list}
    </>
  );

  if (props.multiple) {
    const toItems = (values: readonly string[] | undefined) =>
      values?.map((value) => findItem(items, value)).filter((item) => item !== null);
    return (
      <BaseCombobox.Root
        {...shared}
        multiple
        value={toItems(props.value)}
        defaultValue={toItems(props.defaultValue)}
        onValueChange={(next) => props.onValueChange?.(next.map((item) => item.value))}
      >
        {body}
      </BaseCombobox.Root>
    );
  }
  return (
    <BaseCombobox.Root
      {...shared}
      value={props.value === undefined ? undefined : findItem(items, props.value)}
      defaultValue={props.defaultValue === undefined ? undefined : findItem(items, props.defaultValue)}
      onValueChange={(next) => props.onValueChange?.(next?.value ?? null)}
    >
      {body}
    </BaseCombobox.Root>
  );
}
