import { useRef, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";
import type { NodesRef } from "@lynx-js/types/background";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { readViewport } from "../lib/media";
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
  /** Text while nothing is chosen, and the text the closed field shows. @default "Search" */
  placeholder?: string;
  /** Placeholder of the search box inside the popup. @default "Search" */
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
  /** Turns the field or chips border danger red; a `segment` trigger gets neither, because the wrapping `InputGroup` owns that border. */
  invalid?: boolean;
  /** Blocks the field; in a `segment` it also inherits `disabled` from the wrapping `InputGroup`. */
  disabled?: boolean;
  /** Form field name, kept for call-site parity: Lynx has no form submission, so it is inert. */
  name?: string;
  /** Extra classes on the field or trigger, merged after the surface and size classes. */
  className?: string;
  /** Accessible name of the field or segment trigger; the placeholder covers it in the `field` variant. */
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
  sm: "h-8 gap-2 px-2.5",
  md: "h-10 gap-2.5 px-3",
  lg: "h-12 gap-3 px-4",
};

const itemTextClass: Record<ComboboxSize, string> = {
  sm: "text-label-sm",
  md: "text-label-md",
  lg: "text-label-lg",
};

const chipClass: Record<ComboboxSize, string> = {
  sm: "h-5 gap-0.5 pr-0.5 pl-1.5",
  md: "h-6 gap-1 pr-1 pl-2",
  lg: "h-7 gap-1 pr-1 pl-2.5",
};

const chipTextClass: Record<ComboboxSize, string> = {
  sm: "text-label-sm",
  md: "text-label-sm",
  lg: "text-label-md",
};

const chipIconSize: Record<ComboboxSize, number> = { sm: 12, md: 14, lg: 16 };

/** Text rung of the field's own label, matching the input rung it replaces. */
const fieldTextSizeClass: Record<ComboboxSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

/** Multiple chips wrap, so the field grows from its rung height instead of fixing it. */
const multiFieldClass: Record<ComboboxSize, string> = {
  sm: "min-h-8 flex-wrap gap-1 px-2 py-1",
  md: "min-h-10 flex-wrap gap-1.5 px-2.5 py-1.5",
  lg: "min-h-12 flex-wrap gap-2 px-3 py-2",
};

/** The popup follows the field's surface (a segment takes its group's): glass is the veil, every solid kind is solid. */
const popupClass = "relative max-h-80 overflow-hidden rounded-xl p-1.5 motion-popup";

const popupSurfaceClass = (surface: InputSurface) =>
  surface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-popover";

/** Lynx's engine paints the placeholder from this variable, since `placeholder:` utilities cannot run. */
const PLACEHOLDER_CLASS = "[--placeholder-color:var(--color-text-placeholder)]";

const findItem = (items: readonly ComboboxItemData[], value: string | null | undefined) =>
  value == null ? null : (items.find((item) => item.value === value) ?? null);

const shortLabel = (item: ComboboxItemData) => item.selectedLabel ?? item.label;

/** Text slots take a string so the component can put the token classes on a `<text>`. */
const slotText = (value: ReactNode, className: string): ReactNode =>
  typeof value === "string" || typeof value === "number" ? <text className={className}>{value}</text> : value;

/** The field's box on the page, measured by `bindlayoutchange`; all values in CSS px. */
type AnchorBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** The only part of a Lynx input event a field reads. */
type LynxTextEvent = { detail: { value: string } };
type LynxLayoutEvent = { detail?: Partial<AnchorBox>; params?: Partial<AnchorBox> };

/** Reads the box a `layoutchange` event reports, relative to the LynxView viewport. */
const boxOf = (event: LynxLayoutEvent): AnchorBox => {
  const box = event.detail ?? event.params ?? {};
  return {
    left: typeof box.left === "number" ? box.left : 0,
    top: typeof box.top === "number" ? box.top : 0,
    width: typeof box.width === "number" ? box.width : 0,
    height: typeof box.height === "number" ? box.height : 0,
  };
};

/** The popup's fixed placement: 4px under the field, flipped above it when it would overflow. */
function popupPlacement(anchor: AnchorBox, width: number): CSSProperties {
  const viewport = readViewport();
  const below = anchor.top + anchor.height + 4;
  const panel = 320;
  if (viewport.height > 0 && below + panel > viewport.height && anchor.top - 4 - panel >= 0) {
    return { left: anchor.left, bottom: viewport.height - anchor.top + 4, width };
  }
  return { left: anchor.left, top: below, width };
}

/**
 * Search and choose from a fixed option list: tap the field to open the list, type in the popup's
 * search box to narrow it, then pick one item or, with `multiple`, several items shown as chips.
 * `variant="segment"` puts the same control in an `InputGroup`, such as a country code before a
 * phone number.
 *
 * Filtering is a case-insensitive substring match over each item's `label`, `value` and `keywords`,
 * with the query trimmed first; a blank query keeps every item. The chosen item's `selectedLabel`
 * (falling back to `label`) is what the field shows, while `onValueChange` carries `value`.
 *
 * React's field was itself the search input, driven by Base UI's controlled combobox; a Lynx
 * `<input>` has no controlled `value` and writing the selection back is a native-only call, so the
 * closed field is a pressable box showing the chosen label, and the search box lives at the top of
 * the popup for both variants. The popup is a `position: fixed` view painted in place (no portal),
 * anchored to the field's measured box, 4px below it, dismissed by a transparent full-viewport
 * backdrop and by picking a row. The list scrolls past 256px and the panel caps at 320px; the
 * `segment` column is 256px wide. Keyboard movement is not available on Lynx, so rows are tapped;
 * a single-select pick closes the popup and a multi-select pick keeps it open, clearing both the
 * query and the search field so the visible text and the unfiltered list agree. On `multiple` the
 * field grows and wraps as chips fill it instead of fixing its height.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { Combobox } from "@horon-ai/lynx";
 *
 * function CountryCode() {
 *   const [country, setCountry] = useState<string | null>("+82");
 *
 *   return (
 *     <Combobox
 *       aria-label="Country code"
 *       value={country}
 *       onValueChange={setCountry}
 *       items={[
 *         { value: "+82", label: "+82 South Korea", keywords: ["KR", "Korea"] },
 *         { value: "+1", label: "+1 United States", keywords: ["US"] },
 *       ]}
 *     />
 *   );
 * }
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
    name: _name,
    className,
    "aria-label": ariaLabel,
  } = props;
  const group = useInputGroup();
  const segment = variant === "segment";
  const size = segment && group ? group.size : ownSize;
  const popupSurface = segment && group ? group.surface : surface;
  const isDisabled = disabled ?? (segment ? (group?.disabled ?? false) : false);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorBox | null>(null);
  const [innerSingle, setInnerSingle] = useState<string | null>(props.multiple ? null : (props.defaultValue ?? null));
  const [innerMulti, setInnerMulti] = useState<readonly string[]>(props.multiple ? (props.defaultValue ?? []) : []);
  const searchInput = useRef<NodesRef | null>(null);

  const singleValue = props.multiple ? null : props.value !== undefined ? props.value : innerSingle;
  const chosenSingle = props.multiple ? null : findItem(items, singleValue);
  const chosenMulti = props.multiple
    ? (props.value ?? innerMulti)
        .map((value) => findItem(items, value))
        .filter((item): item is ComboboxItemData => item !== null)
    : [];
  const selectedValues: readonly string[] = props.multiple
    ? (props.value ?? innerMulti)
    : singleValue === null
      ? []
      : [singleValue];

  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? items.filter((item) =>
        [item.label, item.value, ...(item.keywords ?? [])].some((text) => text.toLowerCase().includes(needle)),
      )
    : items;

  // React let Base UI size the popup from its anchor; without floating-ui the same box is
  // recomputed here: the field's width (256px for a segment column), capped below the viewport.
  const popupCap = readViewport().width > 0 ? readViewport().width - 32 : 0;
  const popupPreferred = segment ? 256 : Math.max(anchor?.width ?? 240, 240);
  const popupStyleWidth = popupCap > 0 ? Math.min(popupPreferred, popupCap) : popupPreferred;

  const openPopup = () => {
    if (isDisabled) return;
    setOpen(true);
  };

  /**
   * Empties the query and the native search field. A Lynx `<input>` keeps its own text, so dropping the
   * query state alone would leave the old text in the field while the list showed every item; both are
   * cleared together so the typed text and the filtered list always agree.
   */
  const clearQuery = () => {
    setQuery("");
    const element = searchInput.current;
    if (!element) return;
    try {
      element.invoke({ method: "setValue", params: { value: "" } }).exec();
    } catch {
      // The render-test element API has no native methods; the empty query state is the observable.
    }
  };

  const closePopup = () => {
    setOpen(false);
    clearQuery();
  };

  const choose = (item: ComboboxItemData) => {
    if (item.disabled) return;
    if (props.multiple) {
      const current = props.value ?? innerMulti;
      const next = current.includes(item.value)
        ? current.filter((value) => value !== item.value)
        : [...current, item.value];
      if (props.value === undefined) setInnerMulti(next);
      props.onValueChange?.([...next]);
      // The popup stays open, so the search field is emptied with the query rather than left stale.
      clearQuery();
      return;
    }
    if (props.value === undefined) setInnerSingle(item.value);
    props.onValueChange?.(item.value);
    closePopup();
  };

  const removeValue = (value: string) => {
    if (!props.multiple) return;
    const current = props.value ?? innerMulti;
    const next = current.filter((entry) => entry !== value);
    if (props.value === undefined) setInnerMulti(next);
    props.onValueChange?.([...next]);
  };

  const layout = (event: LynxLayoutEvent) => setAnchor(boxOf(event));

  const searchBox = (
    <view className={cn(fieldBoxClass.base, fieldBoxClass.solid, fieldSizeClass[size], "shrink-0")}>
      <view className="relative flex shrink-0 flex-row items-center">
        <Icon name="MagnifyingGlass" size={size === "lg" ? 20 : 16} color="text-secondary" />
      </view>
      <input
        ref={searchInput}
        className={cn("relative", fieldBoxClass.text, fieldTextClass[size], PLACEHOLDER_CLASS)}
        placeholder={searchPlaceholder}
        bindinput={(event: LynxTextEvent) => setQuery(event.detail.value)}
      />
    </view>
  );

  const list =
    open && anchor ? (
      <>
        <view
          className="fixed"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          bindtap={closePopup}
          accessibility-element={false}
        />
        <view
          className={cn(
            "fixed z-50 flex flex-col",
            popupClass,
            popupSurfaceClass(popupSurface),
            segment && "gap-1",
            className,
          )}
          style={popupPlacement(anchor, popupStyleWidth)}
        >
          {searchBox}
          {filtered.length === 0 ? (
            <view className={cn("relative px-3", size === "lg" ? "py-3" : "py-2")}>
              {slotText(emptyLabel, cn(size === "lg" ? "text-body-md" : "text-body-sm", "text-text-secondary"))}
            </view>
          ) : (
            <scroll-view scroll-orientation="vertical" scroll-bar-enable={false} style={{ maxHeight: "256px" }}>
              <view className="relative flex flex-col gap-0.5">
                {filtered.map((item) => {
                  const selected = selectedValues.includes(item.value);
                  return (
                    <view
                      key={item.value}
                      className={cn(
                        "relative flex flex-row items-center rounded-md motion-colors",
                        itemClass[size],
                        item.disabled ? "opacity-40" : "active:bg-overlay-ink-6",
                        selected && "bg-overlay-ink-6",
                      )}
                      bindtap={() => choose(item)}
                      accessibility-element
                      accessibility-traits={item.disabled ? "disabled" : selected ? "selected" : "button"}
                      accessibility-label={item.label}
                    >
                      <text className={cn("min-w-0 flex-1 truncate text-text-primary", itemTextClass[size])}>
                        {item.label}
                      </text>
                      {item.trailing ? (
                        <view className="flex shrink-0 flex-row items-center">
                          {slotText(item.trailing, "text-text-secondary")}
                        </view>
                      ) : null}
                      {selected ? (
                        <view className="flex shrink-0 flex-row items-center">
                          <Icon name="Check" size={size === "lg" ? 20 : 16} color="text-primary" />
                        </view>
                      ) : null}
                    </view>
                  );
                })}
              </view>
            </scroll-view>
          )}
        </view>
      </>
    ) : null;

  const caret = (
    <view className="relative flex shrink-0 flex-row items-center">
      <view style={open ? { transform: "rotate(180deg)" } : undefined}>
        <Icon name="CaretDown" size={16} color="text-secondary" />
      </view>
    </view>
  );

  if (segment) {
    const chosen = props.multiple
      ? chosenMulti.map(shortLabel).join(", ")
      : chosenSingle
        ? shortLabel(chosenSingle)
        : "";
    const trigger = (
      <view
        className={cn(inputGroupSegmentClass[size], "cursor-pointer text-left", isDisabled && "opacity-40", className)}
        bindtap={openPopup}
        bindlayoutchange={layout}
        accessibility-element
        accessibility-traits={isDisabled ? "disabled" : "button"}
        accessibility-role-description="button"
        accessibility-label={ariaLabel}
        accessibility-value={open ? "expanded" : "collapsed"}
      >
        <text
          className={cn(
            "min-w-0 flex-1 truncate",
            fieldTextSizeClass[size],
            chosen ? "text-text-primary" : "text-text-placeholder",
          )}
        >
          {chosen || placeholder}
        </text>
        {caret}
      </view>
    );

    return (
      <>
        {trigger}
        {list}
      </>
    );
  }

  const field = (
    <view
      className={cn(
        fieldBoxClass.base,
        fieldBoxClass[surface],
        props.multiple ? multiFieldClass[size] : fieldSizeClass[size],
        "w-60 max-w-full",
        props.multiple && "cursor-text",
        invalid && "border-border-danger",
        isDisabled && "opacity-60",
        className,
      )}
      bindtap={openPopup}
      bindlayoutchange={layout}
      accessibility-element
      accessibility-traits={isDisabled ? "disabled" : "button"}
      accessibility-label={ariaLabel}
      accessibility-value={open ? "expanded" : "collapsed"}
    >
      {props.multiple ? null : (
        <view className="relative flex shrink-0 flex-row items-center">
          <Icon name="MagnifyingGlass" size={size === "lg" ? 20 : 16} color="text-secondary" />
        </view>
      )}
      {props.multiple
        ? chosenMulti.map((item) => (
            <view
              key={item.value}
              className={cn(
                "relative flex shrink-0 flex-row items-center rounded-full bg-overlay-ink-6",
                chipClass[size],
              )}
            >
              <text className={cn("text-text-primary", chipTextClass[size])}>{shortLabel(item)}</text>
              <view
                className="flex flex-row items-center rounded-full p-0.5"
                catchtap={() => removeValue(item.value)}
                accessibility-element
                accessibility-traits="button"
                accessibility-label={`Remove ${item.label}`}
              >
                <Icon name="X" size={chipIconSize[size]} color="text-secondary" />
              </view>
            </view>
          ))
        : null}
      {props.multiple && chosenMulti.length > 0 ? null : (
        <text
          className={cn(
            "min-w-0 flex-1 truncate",
            fieldTextSizeClass[size],
            chosenSingle ? "text-text-primary" : "text-text-placeholder",
          )}
        >
          {chosenSingle ? shortLabel(chosenSingle) : placeholder}
        </text>
      )}
      {props.multiple ? null : caret}
    </view>
  );

  return (
    <>
      {field}
      {list}
    </>
  );
}
