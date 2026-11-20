import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { CaretDown, Check } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { controlHeight, DISABLED_OPACITY, TOUCH_TARGET, touchSlop, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";
import { fieldSizeClass, fieldTextClass, type InputSurface } from "./input";
import { inputGroupSegmentClass, useInputGroup } from "./input-group";

/** Field height and text rung of a `field` select: 32/40/48pt with 14/16/18pt text. */
export type SelectSize = ControlSize;

/** One choice in the list. */
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
 * What asked for the popup to open or close, mirroring the `reason` on Base UI's change details.
 * React Native can tell its three open-state gestures apart: a trigger tap, a scrim tap and a row pick.
 */
export type SelectOpenChangeReason = "trigger-press" | "outside-press" | "item-press";

/**
 * Details of an open-state request, the React Native counterpart of Base UI's
 * `Select.Root.ChangeEventDetails`. The native event Base UI also carries has no React Native
 * equivalent, since a tap arrives as a plain press with no browser event to hand on.
 */
export type SelectOpenChangeEventDetails = {
  /** What asked for the change. */
  reason: SelectOpenChangeReason;
  /** Keeps the popup where it is: an uncontrolled select then drops the request. */
  cancel: () => void;
  /** Whether `cancel` has been called. */
  isCanceled: boolean;
};

/** Props for {@link Select}, one flat object like the React trigger's own members plus Base UI's. */
export type SelectProps = {
  /** Choices in the popup, in display order. */
  items: SelectItemData[];
  /**
   * Text shown in the trigger before a choice is made.
   * @default "Select"
   */
  placeholder?: ReactNode;
  /**
   * Field height and text rung for `variant="field"`; a `chip` trigger keeps its fixed 32pt,
   * `label-md` size and still uses `size` for its popup rows, and a `segment` takes the enclosing
   * `InputGroup` size instead.
   * @default "md"
   */
  size?: SelectSize;
  /**
   * Fill of the field and of its popup; `glass` also switches the popup to the veil. A `chip` uses it
   * for the popup only, since the chip has its own subtle fill.
   * @default "solid"
   */
  surface?: InputSurface;
  /** Paints the danger border and marks the trigger invalid for assistive tech. */
  invalid?: boolean;
  /**
   * `chip` is the Paper filter chip: a 32pt ink-tint pill sized to its label. `segment` is the tinted
   * prefix or suffix of an `InputGroup`; it takes the group's size and disabled state.
   * @default "field"
   */
  variant?: "field" | "chip" | "segment";
  /**
   * Draws the caret at the right of the trigger; set it to false when the trigger supplies its own icon.
   * @default true
   */
  showIndicator?: boolean;
  /** Outer layout of the trigger, appended last. */
  style?: StyleProp<ViewStyle>;
  /** Accessible name of the trigger. */
  "aria-label"?: string;
  /** Value the caller owns. Passing it makes the select controlled. */
  value?: string | null;
  /** Value chosen at first render when the caller does not own it. */
  defaultValue?: string | null;
  /** Fires with the chosen value when a row is picked. */
  onValueChange?: (value: string) => void;
  /**
   * Whether the popup is open. Passing it makes the popup controlled: every tap then reports the
   * requested state through `onOpenChange`, and the popup moves only when this prop does.
   */
  open?: boolean;
  /**
   * Whether the popup is open at first render, when the caller does not own the state.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Fires with the requested state and why, before an uncontrolled popup moves. Calling
   * `eventDetails.cancel()` keeps it where it is.
   */
  onOpenChange?: (open: boolean, eventDetails?: SelectOpenChangeEventDetails) => void;
  /** Fires with the settled state once the popup has painted open or closed. */
  onOpenChangeComplete?: (open: boolean) => void;
  /**
   * Lets the popup open for browsing while keeping a row pick from changing the value, without the
   * dimmed look and the disabled announcement `disabled` gives. The chosen value still shows.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the open popup blocks the page behind it. `true` paints the scrim that swallows taps and
   * closes on them; `false` keeps the page reachable, so the popup closes on the trigger or a row.
   * @default true
   */
  modal?: boolean;
  /**
   * Turns a row's value into the text the trigger shows once it is chosen, taking the place of the
   * item's `selectedLabel` and `label`, as Base UI's `itemToStringLabel` does.
   */
  itemToStringLabel?: (item: string) => string;
  /**
   * Decides whether a row's value is the chosen one, for the selected marking and the trigger's label.
   * Use it when the caller's value is written differently from the item's, such as in another case.
   * @default Object.is
   */
  isItemEqualToValue?: (item: string, value: string) => boolean;
  /** Blocks the trigger and the popup, dims the trigger and announces it as disabled. */
  disabled?: boolean;
  /** Marks the select as required by a form. Accepted for call-site parity; React Native has no form submission. */
  required?: boolean;
  /** Form field name. Accepted for call-site parity; React Native has no form submission. */
  name?: string;
  /** Element id of the trigger, for parity with the web trigger's `id`. */
  id?: string;
};

/** One row's height, padding, gap and text rung per field rung. */
const ROW: Record<SelectSize, ViewStyle> = {
  sm: { minHeight: controlHeight.sm, gap: spacing["2"], paddingHorizontal: spacing["2.5"] },
  md: { minHeight: controlHeight.md, gap: spacing["2.5"], paddingHorizontal: spacing["3"] },
  lg: { minHeight: controlHeight.lg, gap: spacing["3"], paddingHorizontal: spacing["4"] },
};

const ROW_TEXT: Record<SelectSize, TextStyleName> = { sm: "label-sm", md: "label-md", lg: "label-lg" };

/** React sized the check through `[&_svg]:size-4|5`. */
const CHECK: Record<SelectSize, number> = { sm: 16, md: 16, lg: 20 };

/** Caret glyph size per rung, taken from the trigger's own text step. */
const CARET: Record<SelectSize, number> = { sm: 16, md: 16, lg: 20 };

/** The chip's fixed rung, react's `h-8 rounded-full px-3 text-label-md`. */
const CHIP_HEIGHT = 32;

/** A measured box on screen, in window coordinates, the anchor of a popup. */
type AnchorRect = { x: number; y: number; width: number; height: number };

/** Renders a row or trigger label: words ride the component's type token, elements sit as they are. */
function Slot({
  value,
  variant,
  tone,
  numberOfLines = 1,
}: {
  value: ReactNode;
  variant: TextStyleName;
  tone: ColorToken;
  numberOfLines?: number;
}) {
  if (typeof value === "string" || typeof value === "number") {
    return (
      <HoronText variant={variant} tone={tone} numberOfLines={numberOfLines}>
        {value}
      </HoronText>
    );
  }
  return <>{value}</>;
}

/**
 * Figma `Select` (58:162) trigger with the `Select list` (88:495) popup: a field with the same text
 * rung as `Input` (14/16/18) and a 16/20pt caret; the surface never changes the text size. The popup
 * is the veil, 20pt radius, 40pt rows; the chosen row is 6% ink with a check. `variant="chip"` keeps
 * its single 32pt chip size; `variant="segment"` follows its `InputGroup`.
 *
 * React portalled the popup and positioned it with Base UI; React Native has no portal, so the list
 * opens in a `Modal` anchored to the trigger's measured box (4pt below it, at its start edge, at
 * least as wide as it, flipped above when the bottom has no room) and a scrim closes it on an outside
 * tap unless `modal` is false. Rows are tapped rather than highlighted with the keyboard; the trigger
 * announces itself as a `combobox` with its expanded state, and every row as a `button` with its
 * selected state. The open state is owned here or, with `open`, by the caller, who hears every
 * request through `onOpenChange` and can cancel it.
 *
 * @example
 * ```tsx
 * import { Select } from "@horon-ai/expo";
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
  invalid,
  variant = "field",
  showIndicator = true,
  style,
  "aria-label": ariaLabel,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onOpenChangeComplete,
  readOnly = false,
  modal = true,
  itemToStringLabel,
  isItemEqualToValue = Object.is,
  disabled: ownDisabled,
  required: _required,
  name: _name,
  id: _id,
}: SelectProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const window = useWindowDimensions();
  const group = useInputGroup();
  const segment = variant === "segment";
  const field = variant === "field";
  const size = segment && group ? group.size : ownSize;
  const popupSurface = segment && group ? group.surface : surface;
  const disabled = ownDisabled ?? (segment ? group?.disabled : undefined) ?? false;

  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState({ width: 0, height: 0 });
  const trigger = useRef<ComponentRef<typeof View>>(null);

  const open = controlledOpen === undefined ? uncontrolledOpen : controlledOpen;
  const value = controlledValue === undefined ? internalValue : controlledValue;
  const current = value === null ? null : (items.find((entry) => isItemEqualToValue(entry.value, value)) ?? null);
  const formatted = itemToStringLabel !== undefined && value !== null ? itemToStringLabel(value) : null;
  const shown = formatted ?? (current ? (current.selectedLabel ?? current.label) : placeholder);
  const isPlaceholder = formatted === null && !current;

  // Base UI fired `onOpenChange` before moving and let its details cancel the move; the same order
  // keeps a caller's guard working. A controlled popup never moves on its own, only reports.
  const requestOpen = (next: boolean, reason: SelectOpenChangeReason) => {
    const details: SelectOpenChangeEventDetails = {
      reason,
      isCanceled: false,
      cancel() {
        details.isCanceled = true;
      },
    };
    onOpenChange?.(next, details);
    if (details.isCanceled) return;
    if (controlledOpen === undefined) setUncontrolledOpen(next);
  };

  // The settled state follows the change: a React Native `Modal` mounts and unmounts in one commit,
  // so there is no exit transition to outlast. The first render is not a change.
  const settledOpen = useRef(open);
  useEffect(() => {
    if (settledOpen.current === open) return;
    settledOpen.current = open;
    onOpenChangeComplete?.(open);
  }, [open, onOpenChangeComplete]);

  const choose = (item: SelectItemData) => {
    if (disabled || readOnly || item.disabled) return;
    if (controlledValue === undefined) setInternalValue(item.value);
    onValueChange?.(item.value);
    requestOpen(false, "item-press");
  };

  const measure = () => {
    trigger.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));
  };

  // The popup is at least as wide as its trigger and never wider than the window; its height is
  // whatever the rows take, capped at 320pt, so the flip above the trigger is decided from the last
  // measured box and re-decided once the first frame reports the real one.
  const rowHeight = theme.touch ? TOUCH_TARGET : controlHeight[size];
  const estimatedHeight = Math.min(items.length * (rowHeight + spacing["0.5"]) + spacing["3"], 320);
  const popupHeight = panel.height > 0 ? panel.height : estimatedHeight;
  const popupWidth = Math.max(anchor?.width ?? 0, panel.width, 160);
  const below = (anchor?.y ?? 0) + (anchor?.height ?? 0) + spacing["1"];
  const fitsBelow = anchor ? below + popupHeight <= window.height - insets.bottom - spacing["2"] : true;
  const popupTop = anchor
    ? fitsBelow
      ? below
      : Math.max(insets.top + spacing["2"], anchor.y - spacing["1"] - popupHeight)
    : 0;
  const popupLeft = anchor
    ? Math.max(spacing["2"], Math.min(anchor.x, window.width - popupWidth - spacing["2"]))
    : spacing["4"];

  const [fade] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!open) return;
    fade.setValue(theme.reducedMotion ? 1 : 0);
    if (theme.reducedMotion) return;
    Animated.timing(fade, { toValue: 1, duration: duration.popIn, easing: easing.outQuint, useNativeDriver: true }).start();
  }, [open, theme.reducedMotion, fade]);

  // The field box paints its fill and hairline itself; a glass field leaves both to the veil.
  const fieldPaint: ViewStyle | null =
    field && surface !== "glass"
      ? {
          backgroundColor: theme.color(disabled ? "bg-subtle" : surface === "solid" ? "bg-surface" : "bg-default"),
          borderWidth: 1,
          borderColor: theme.color(invalid ? "border-danger" : "border-default"),
        }
      : null;

  return (
    <>
      <View
        ref={trigger}
        collapsable={false}
        onLayout={measure}
        style={[styles.anchor, segment ? styles.anchorStretch : styles.anchorTop]}
      >
      <HoronPressable
        role="combobox"
        accessibilityLabel={ariaLabel}
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        haptic="selection"
        onPress={() => {
          if (disabled) return;
          measure();
          requestOpen(!open, "trigger-press");
        }}
        hitSlop={theme.touch ? touchSlop(true, field ? controlHeight[size] : CHIP_HEIGHT) : undefined}
        style={({ pressed }) => [
          styles.trigger,
          field && styles.fieldTrigger,
          field && fieldSizeClass[size],
          fieldPaint,
          field && surface === "glass" && disabled && { opacity: 0.6 },
          field && surface !== "glass" && pressed && !disabled && !invalid && { borderColor: theme.color("border-strong") },
          segment && inputGroupSegmentClass[size].container,
          segment && { backgroundColor: theme.color("overlay-ink-4") },
          !field && !segment && styles.chip,
          !field &&
            !segment && {
              minHeight: CHIP_HEIGHT,
              backgroundColor: theme.color(pressed && !disabled ? "overlay-ink-8" : "bg-subtle"),
              opacity: disabled ? DISABLED_OPACITY : 1,
            },
          !field && !segment && theme.touch && { minHeight: TOUCH_TARGET },
          disabled && (field || segment) && { opacity: DISABLED_OPACITY },
          style,
        ]}
      >
        {({ pressed }) => (
          <>
            {field && surface === "glass" ? (
              <GlassSurface material="veil" radius={radius.md} pressed={pressed} style={StyleSheet.absoluteFill} />
            ) : null}
            <View style={styles.triggerText}>
              <Slot
                value={shown}
                variant={segment ? inputGroupSegmentClass[size].text : field ? fieldTextClass[size] : "label-md"}
                tone={disabled ? "text-disabled" : isPlaceholder ? "text-placeholder" : "text-primary"}
              />
            </View>
            {showIndicator ? (
              <View style={[styles.caret, { transform: [{ rotate: open ? "180deg" : "0deg" }] }]}>
                <CaretDown size={CARET[size]} color={theme.color("text-secondary")} />
              </View>
            ) : null}
          </>
        )}
      </HoronPressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => requestOpen(false, "outside-press")}
      >
        <View style={styles.modalRoot}>
          <HoronPressable
            haptic="none"
            style={StyleSheet.absoluteFill}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onPress={modal ? () => requestOpen(false, "outside-press") : undefined}
            pointerEvents={modal ? "auto" : "none"}
          />
          <Animated.View
            accessibilityViewIsModal
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              if (width === panel.width && height === panel.height) return;
              setPanel({ width, height });
            }}
            style={[
              styles.popup,
              {
                opacity: fade,
                left: popupLeft,
                top: popupTop,
                width: popupWidth,
                maxHeight: Math.min(320, window.height / 2),
              },
            ]}
          >
            {popupSurface === "glass" ? (
              <GlassSurface material="veil" radius={radius.xl} style={StyleSheet.absoluteFill} />
            ) : (
              <View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  {
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: theme.color("border-default"),
                    backgroundColor: theme.color("bg-surface"),
                  },
                ]}
              />
            )}
            <View role="list" accessibilityLabel={ariaLabel} style={styles.list}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {items.map((item) => {
                  const selected = value !== null && isItemEqualToValue(item.value, value);
                  return (
                    <HoronPressable
                      key={item.value}
                      role="button"
                      haptic="selection"
                      disabled={item.disabled}
                      accessibilityState={{ selected, disabled: !!item.disabled }}
                      onPress={() => choose(item)}
                      style={({ pressed }) => [
                        styles.row,
                        ROW[size],
                        theme.touch && { minHeight: TOUCH_TARGET },
                        {
                          backgroundColor:
                            selected || (pressed && !item.disabled) ? theme.color("overlay-ink-6") : "transparent",
                          opacity: item.disabled ? DISABLED_OPACITY : 1,
                        },
                      ]}
                    >
                      <View style={styles.rowLabel}>
                        <Slot value={item.label} variant={ROW_TEXT[size]} tone="text-primary" />
                      </View>
                      {selected ? <Check size={CHECK[size]} color={theme.color("text-primary")} /> : null}
                    </HoronPressable>
                  );
                })}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  anchor: { maxWidth: "100%" },
  anchorTop: { alignSelf: "flex-start" },
  anchorStretch: { alignSelf: "stretch" },
  trigger: { flexDirection: "row", alignItems: "center", borderRadius: radius.md, borderCurve: "continuous" },
  fieldTrigger: { width: 240, maxWidth: "100%" },
  chip: { gap: spacing["1"], paddingHorizontal: spacing["3"], borderRadius: radius.full },
  triggerText: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center" },
  caret: { flexShrink: 0, alignItems: "center", justifyContent: "center" },
  modalRoot: { flex: 1 },
  popup: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: radius.xl,
    boxShadow: shadow.popover,
  },
  list: { flexDirection: "column" },
  listContent: { padding: spacing["1.5"], gap: spacing["0.5"] },
  row: { flexDirection: "row", alignItems: "center", borderRadius: radius.md },
  rowLabel: { flex: 1, minWidth: 0 },
});
