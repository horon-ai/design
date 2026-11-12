import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { CaretDown, Check, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useRef, type ReactNode } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldSizeClass, fieldTextClass, type InputSurface } from "./input";
import { inputGroupSegmentClass, useInputGroup } from "./input-group";

/** Height and text rung, shared with the other controls: `sm` 32px, `md` 40px, `lg` 48px. */
export type ComboboxSize = ControlSize;

/** One option in the list; the `value` is what the field reports and submits. */
export type ComboboxItemData = {
  /** Stable identity, reported by `value` / `onValueChange` and submitted with the form. */
  value: string;
  /** Row text and the text the search matches. */
  label: string;
  /** Shorter text shown once chosen, such as `+82` for "+82 South Korea". */
  selectedLabel?: string;
  /** Secondary text on the right of the row, such as a dial code. */
  trailing?: ReactNode;
  /** Extra search terms that are not shown, such as `KR` or `Korea`. */
  keywords?: readonly string[];
  /** Dims the row to 40% and makes it unselectable. */
  disabled?: boolean;
};

/** Props shared by both value modes; `multiple` selects the mode in {@link ComboboxProps}. */
type ComboboxBaseProps = {
  /** Options in list order, in the shape of {@link ComboboxItemData}. */
  items: readonly ComboboxItemData[];
  /** Text while nothing is chosen, and the field's `aria-label` in the `field` variant. @default "Search" */
  placeholder?: string;
  /** Placeholder of the search box inside the popup (`segment` variant). @default "Search" */
  searchPlaceholder?: string;
  /** Shown in the popup when nothing matches the search. @default "No results" */
  emptyLabel?: ReactNode;
  /** Rung of the field, rows and chips. @default "md" */
  size?: ComboboxSize;
  /** Surface of the field; the popup follows it. @default "solid" */
  surface?: InputSurface;
  /**
   * `field` is a searchable field (the default). `segment` is the tinted prefix or suffix of an
   * `InputGroup`: a button that opens a popup with the search box on top, taking the group's size.
   * @default "field"
   */
  variant?: "field" | "segment";
  /** Turns the field or chips border danger red and sets `aria-invalid`; a `segment` trigger gets neither, because the wrapping `InputGroup` owns that border. */
  invalid?: boolean;
  /** Blocks the field; in a `segment` it also inherits `disabled` from the wrapping `InputGroup`. */
  disabled?: boolean;
  /** Form field name; the submitted value is the item `value`. */
  name?: string;
  /** Extra classes on the field or trigger, merged after the surface and size classes. */
  className?: string;
  /** Accessible name of the text field or segment trigger; the placeholder covers it in the `field` variant. */
  "aria-label"?: string;
};

/** Single-select combobox: `value` / `onValueChange` carry one item `value` or `null`. */
export type ComboboxSingleProps = ComboboxBaseProps & {
  /** Single-select mode; the default when the prop is omitted. */
  multiple?: false;
  /** Controlled choice, as an item `value`; `null` means nothing is chosen. */
  value?: string | null;
  /** Starting choice of the uncontrolled field. */
  defaultValue?: string | null;
  /** Fires with the picked item `value`, or `null` when the field is cleared. */
  onValueChange?: (value: string | null) => void;
};

/** Multi-select combobox: the chosen items show as removable chips and the value is an array of item `value`s. */
export type ComboboxMultipleProps = ComboboxBaseProps & {
  /** Chosen items show as removable chips in the field. */
  multiple: true;
  /** Controlled selection, in the order chosen. */
  value?: readonly string[];
  /** Starting selection of the uncontrolled field. */
  defaultValue?: readonly string[];
  /** Fires with the full next selection as item `value`s, in the order chosen. */
  onValueChange?: (value: string[]) => void;
};

/**
 * Props for {@link Combobox}, a discriminated union on `multiple`: without it the field is single-select
 * and its value is `string | null`; with `multiple: true` it is multi-select and its value is `readonly string[]`.
 * Narrow on `props.multiple` before reading `value` or `onValueChange`.
 */
export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const itemClass: Record<ComboboxSize, string> = {
  sm: "h-8 gap-2 px-2.5 text-label-sm [&_svg]:size-4",
  md: "h-10 gap-2.5 px-3 text-label-md [&_svg]:size-4",
  lg: "h-12 gap-3 px-4 text-label-lg [&_svg]:size-5",
};

const chipClass: Record<ComboboxSize, string> = {
  sm: "h-5 gap-0.5 pr-0.5 pl-1.5 text-label-sm [&_svg]:size-3",
  md: "h-6 gap-1 pr-1 pl-2 text-label-sm [&_svg]:size-3.5",
  lg: "h-7 gap-1 pr-1 pl-2.5 text-label-md [&_svg]:size-4",
};

/** Multiple chips wrap, so the field grows from its rung height instead of fixing it. */
const multiFieldClass: Record<ComboboxSize, string> = {
  sm: "min-h-8 flex-wrap gap-1 px-2 py-1",
  md: "min-h-10 flex-wrap gap-1.5 px-2.5 py-1.5",
  lg: "min-h-12 flex-wrap gap-2 px-3 py-2",
};

/** The popup follows the field's surface (a segment takes its group's): glass is the veil, every solid kind is solid. */
const popupClass =
  "relative max-h-80 min-w-(--anchor-width) max-w-[calc(100vw-2rem)] motion-popup overflow-clip rounded-xl p-1.5 outline-none";
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
 *
 * Filtering is a case-insensitive substring match over each item's `label`, `value` and `keywords`,
 * with the query trimmed first; a blank query keeps every item. The chosen item's `selectedLabel`
 * (falling back to `label`) is what the field shows, while the form and `onValueChange` carry `value`.
 * The popup portals to the body, opens 4px below the field and is at least as wide as it; the list scrolls
 * past 256px and the panel caps at 320px. In `segment` form the popup is a 256px column with its own search
 * box on top; on `multiple` the field grows and wraps as chips fill it instead of fixing its height.
 *
 * @example
 * ```tsx
 * const [country, setCountry] = useState<string | null>("+82");
 *
 * <Combobox
 *   aria-label="Country code"
 *   value={country}
 *   onValueChange={setCountry}
 *   items={[
 *     { value: "+82", label: "+82 South Korea", keywords: ["KR", "Korea"] },
 *     { value: "+1", label: "+1 United States", keywords: ["US"] },
 *   ]}
 * />
 * ```
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
          className={cn(
            popupClass,
            popupSurfaceClass(popupSurface),
            segment && "flex w-64 max-w-[calc(100vw-2rem)] flex-col gap-1",
          )}
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
            "w-60 max-w-full cursor-text data-disabled:cursor-not-allowed",
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
                      "relative flex shrink-0 animate-pop-in items-center rounded-full bg-overlay-ink-6 text-text-primary outline-none data-highlighted:bg-overlay-ink-12",
                      chipClass[size],
                    )}
                  >
                    {shortLabel(item)}
                    <BaseCombobox.ChipRemove
                      aria-label={`Remove ${item.label}`}
                      className="flex cursor-pointer rounded-full p-0.5 text-text-secondary hover:bg-overlay-ink-10 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
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
          className={cn(fieldBoxClass.base, fieldBoxClass[surface], fieldSizeClass[size], "w-60 max-w-full", className)}
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
