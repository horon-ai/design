import { useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import type { LayoutChangeLike } from "../hooks";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { readViewport } from "../lib/media";
import type { ControlSize } from "../lib/size";
import { fieldBoxClass, fieldSizeClass, fieldTextClass, type InputSurface } from "./input";
import { inputGroupSegmentClass, useInputGroup } from "./input-group";

/** Field height and text rung of a `field` select: 32/40/48px with 14/16/18px text. */
export type SelectSize = ControlSize;

/**
 * One choice in the list.
 */
export type SelectItemData = {
  /** Value reported on selection. */
  value: string;
  /** Text shown both in the trigger and in the popup row. */
  label: ReactNode;
  /** Shorter text for the trigger once chosen, such as `+82` for "+82 South Korea". */
  selectedLabel?: ReactNode;
  /** Dims the row and blocks picking it. */
  disabled?: boolean;
};

/**
 * The selection members react forwarded to Base UI's select root. Lynx has no root to forward to, so the
 * members a caller actually uses are declared here and handed to the trigger and the popup.
 */
type PortedSelectAttributes = {
  /** Value the caller owns. Passing it makes the select controlled. */
  value?: string | null;
  /** Value chosen at first render when the caller does not own it. */
  defaultValue?: string | null;
  /** Fires with the chosen value when a row is picked. */
  onValueChange?: (value: string) => void;
  /** Blocks the trigger and the popup, dims the trigger and announces it as disabled. */
  disabled?: boolean;
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Marks the field as required by a form. Accepted for call-site parity; Lynx has no form submission. */
  required?: boolean;
  /** Element id of the trigger, so a host or the gallery can address the native node. */
  id?: string;
};

/**
 * Props for {@link Select}. React's type was `Omit<ComponentProps<typeof BaseSelect.Root>,
 * "items" | "children">` intersected with the trigger's own members, so the shape stays one flat object.
 */
export type SelectProps = Omit<PortedSelectAttributes, "items" | "children"> & {
  /** Choices in the popup, in display order. */
  items: SelectItemData[];
  /**
   * Text shown in the trigger before a choice is made.
   * @default "Select"
   */
  placeholder?: ReactNode;
  /**
   * Field height and text rung for `variant="field"`; a `chip` trigger keeps its fixed 32px,
   * `label-md` size and still uses `size` for its popup rows, and a `segment` takes the enclosing
   * `InputGroup` size instead.
   * @default "md"
   */
  size?: SelectSize;
  /**
   * Fill of the field and of its popup; `glass` also switches the popup to the veil. A `chip` uses
   * it for the popup only, since the chip has its own subtle fill.
   * @default "solid"
   */
  surface?: InputSurface;
  /** Paints the danger border and announces the trigger as invalid. */
  invalid?: boolean;
  /**
   * `chip` is the Paper filter chip: a 32px bg-subtle pill, 12px padding, 13/18 medium, sized to its label.
   * `segment` is the tinted prefix or suffix of an `InputGroup`; it takes the group's size and disabled state.
   * @default "field"
   */
  variant?: "field" | "chip" | "segment";
  /**
   * Draws the caret at the right of the trigger; set it to false when the trigger supplies its own
   * icon.
   * @default true
   */
  showIndicator?: boolean;
  /** Classes merged onto the trigger. */
  className?: string;
  /** Accessible name of the trigger. */
  "aria-label"?: string;
};

/** One row's height, padding, gap and text rung per field rung. */
const rowClass: Record<SelectSize, string> = {
  sm: "flex h-8 flex-row items-center gap-2 rounded-md px-2.5",
  md: "flex h-10 flex-row items-center gap-2.5 rounded-md px-3",
  lg: "flex h-12 flex-row items-center gap-3 rounded-md px-4",
};

/** The row label's own text rung; Lynx text does not inherit the row's. */
const rowTextClass: Record<SelectSize, string> = {
  sm: "text-label-sm",
  md: "text-label-md",
  lg: "text-label-lg",
};

/** React sized the check through `[&_svg]:size-4|5`; `<Icon>` takes px. */
const checkSize: Record<SelectSize, number> = { sm: 16, md: 16, lg: 20 };

/** Caret glyph size per rung, taken from the trigger's own text step. */
const caretSize: Record<SelectSize, number> = { sm: 16, md: 16, lg: 20 };

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
 * Base UI's positioner did this on React; Lynx has no floating-ui, so the popup opens 4px under the
 * trigger, at its start edge and at least as wide as the trigger, flips above when the bottom has no
 * room and slides left when its measured width would cross the viewport. A zero viewport (a plain
 * render test, where `SystemInfo` reports nothing) keeps the requested side, because no collision can
 * be judged.
 */
function popupPlacement(anchor: AnchorRect, panel: PanelSize): CSSProperties {
  const viewport = readViewport();
  const known = viewport.width > 0 && viewport.height > 0;
  const gap = 4;

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
 * Figma `Select` (58:162) trigger with the `Select list` (88:495) popup: a field with the
 * same text rung as `Input` (14/16/18) and a 16/20px caret; the surface never changes the
 * text size. The popup is the veil (`veil-overlay`), 20px radius, 40px rows; the chosen row
 * is 6% ink with a check. `variant="chip"` keeps its single 32px chip size;
 * `variant="segment"` follows its `InputGroup`.
 *
 * React portalled the popup and positioned it with Base UI; Lynx has neither, so the popup is a
 * `position: fixed` view painted in place, anchored to the trigger's `layoutchange` box, at least as
 * wide as the trigger and closed by a transparent full-viewport backdrop. Rows are tapped rather than
 * highlighted with the keyboard, and every row announces itself as a button.
 *
 * @example
 * ```tsx
 * import { Select } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <Select
 *       aria-label="Country"
 *       defaultValue="kr"
 *       items={[
 *         { value: "kr", label: "South Korea", selectedLabel: "+82" },
 *         { value: "jp", label: "Japan", selectedLabel: "+81" },
 *         { value: "us", label: "United States", disabled: true },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function Select({
  items,
  placeholder = "Select",
  size: ownSize = "md",
  surface = "solid",
  invalid = false,
  variant = "field",
  showIndicator = true,
  className,
  "aria-label": ariaLabel,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  disabled: ownDisabled,
  name: _name,
  required: _required,
  id,
}: SelectProps) {
  const group = useInputGroup();
  const segment = variant === "segment";
  const field = variant === "field";
  const size = segment && group ? group.size : ownSize;
  const popupSurface = segment && group ? group.surface : surface;
  const disabled = ownDisabled ?? (segment ? group?.disabled : undefined) ?? false;

  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState<PanelSize>({ width: 0, height: 0 });

  const value = controlledValue === undefined ? internalValue : controlledValue;
  const current = items.find((entry) => entry.value === value) ?? null;
  const shown = current ? (current.selectedLabel ?? current.label) : placeholder;
  const isPlaceholder = !current;

  const choose = (item: SelectItemData) => {
    if (disabled || item.disabled) return;
    if (controlledValue === undefined) setInternalValue(item.value);
    onValueChange?.(item.value);
    setOpen(false);
  };

  const placement = anchor ? popupPlacement(anchor, panel) : null;

  return (
    <>
      <view
        className={cn(
          field
            ? cn(
                fieldBoxClass.base,
                fieldBoxClass[surface],
                fieldSizeClass[size],
                "w-60 max-w-full",
                surface !== "glass" && triggerFocusClass,
                // React's field box repainted its fill and border for `data-disabled`; Lynx has no such
                // selector, so the disabled box is chosen here, as in `Input`.
                disabled && (surface === "glass" ? "opacity-60" : "border-border-default bg-bg-subtle"),
                invalid && "border-border-danger",
              )
            : segment
              ? cn(inputGroupSegmentClass[size], "flex-row text-left")
              : cn("relative flex h-8 flex-row items-center gap-1 rounded-full bg-bg-subtle px-3", !disabled && "active:bg-overlay-ink-8"),
          "motion-colors",
          className,
        )}
        bindtap={() => {
          if (disabled) return;
          setOpen(!open);
        }}
        bindlayoutchange={(event: LayoutChangeLike) => setAnchor(boxOf(event))}
        accessibility-element
        accessibility-traits={disabled ? "disabled" : "button"}
        accessibility-label={ariaLabel}
        accessibility-role-description="select"
        accessibility-value={open ? "expanded" : "collapsed"}
        {...(id === undefined ? {} : { id })}
      >
        {isPlainText(shown) ? (
          <text
            className={cn(
              "relative min-w-0 flex-1 overflow-hidden",
              field || segment ? fieldTextClass[size] : "text-label-md",
              disabled ? "text-text-disabled" : isPlaceholder ? "text-text-placeholder" : "text-text-primary",
            )}
          >
            {shown}
          </text>
        ) : (
          <view className="relative flex min-w-0 flex-1 flex-row items-center overflow-hidden">{shown}</view>
        )}
        {showIndicator ? (
          <view
            className="relative flex shrink-0 flex-row items-center"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transitionProperty: "transform",
              transitionDuration: "200ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            accessibility-elements-hidden
          >
            <Icon name="CaretDown" size={caretSize[size]} color="text-secondary" />
          </view>
        ) : null}
      </view>

      {open && placement ? (
        <>
          <view
            className="fixed"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            bindtap={() => setOpen(false)}
            accessibility-element={false}
          />
          <view
            className={cn(
              "fixed z-50 flex flex-col gap-0.5 overflow-hidden rounded-xl p-1.5 motion-popup max-w-[calc(100vw-2rem)]",
              popupSurface === "glass" ? "veil-overlay" : "border border-border-default bg-bg-surface shadow-popover",
            )}
            style={placement}
            bindlayoutchange={(event: LayoutChangeLike) => {
              const box = boxOf(event);
              setPanel((previous) =>
                previous.width === box.width && previous.height === box.height ? previous : { width: box.width, height: box.height },
              );
            }}
            accessibility-element
            accessibility-role-description="listbox"
          >
            {items.map((item) => {
              const selected = item.value === value;
              return (
                <view
                  key={item.value}
                  className={cn(
                    rowClass[size],
                    "motion-colors",
                    item.disabled ? "opacity-40" : "active:bg-overlay-ink-6",
                    selected && !item.disabled && "bg-overlay-ink-6",
                  )}
                  bindtap={() => choose(item)}
                  accessibility-element
                  accessibility-traits={item.disabled ? "disabled" : "button"}
                  accessibility-value={selected ? "selected" : undefined}
                >
                  {isPlainText(item.label) ? (
                    <text className={cn("min-w-0 flex-1 overflow-hidden text-text-primary", rowTextClass[size])}>{item.label}</text>
                  ) : (
                    <view className="flex min-w-0 flex-1 flex-row items-center overflow-hidden">{item.label}</view>
                  )}
                  {selected ? <Icon name="Check" size={checkSize[size]} color="text-primary" /> : null}
                </view>
              );
            })}
          </view>
        </>
      ) : null}
    </>
  );
}
