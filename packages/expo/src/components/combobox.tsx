import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { CaretDown, Check, MagnifyingGlass, X } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { FIELD_MAX_FONT_SCALE, useFieldText } from "../lib/field-text";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { controlHeight, DISABLED_OPACITY, TOUCH_TARGET, touchSlop, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";
import { fieldBoxClass, fieldSizeClass, fieldTextClass, type InputSurface } from "./input";
import { inputGroupSegmentClass, useInputGroup } from "./input-group";

/** Height and text rung, shared with the other controls: `sm` 32pt, `md` 40pt, `lg` 48pt. */
export type ComboboxSize = ControlSize;

/** One option in the list; the `value` is what the field reports. */
export type ComboboxItemData = {
  /** Stable identity, reported by `value` / `onValueChange`. */
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
  /**
   * Text while nothing is chosen, and the field's accessible name in the `field` variant.
   * @default "Search"
   */
  placeholder?: string;
  /**
   * Placeholder of the search box inside the popup (`segment` variant).
   * @default "Search"
   */
  searchPlaceholder?: string;
  /**
   * Shown in the popup when nothing matches the search.
   * @default "No results"
   */
  emptyLabel?: ReactNode;
  /**
   * Rung of the field, rows and chips.
   * @default "md"
   */
  size?: ComboboxSize;
  /**
   * Surface of the field; the popup follows it.
   * @default "solid"
   */
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
  /** Form field name, kept for call-site parity: React Native has no form submission, so it is inert. */
  name?: string;
  /** Outer layout of the field or trigger, appended last. */
  style?: StyleProp<ViewStyle>;
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
 * Props for {@link Combobox}, a discriminated union on `multiple`: without it the field is
 * single-select and its value is `string | null`; with `multiple: true` it is multi-select and its
 * value is `readonly string[]`. Narrow on `props.multiple` before reading `value` or `onValueChange`.
 */
export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

/** One row's height, padding, gap and text rung per field rung. */
const ROW: Record<ComboboxSize, ViewStyle> = {
  sm: { minHeight: controlHeight.sm, gap: spacing["2"], paddingHorizontal: spacing["2.5"] },
  md: { minHeight: controlHeight.md, gap: spacing["2.5"], paddingHorizontal: spacing["3"] },
  lg: { minHeight: controlHeight.lg, gap: spacing["3"], paddingHorizontal: spacing["4"] },
};

const ROW_TEXT: Record<ComboboxSize, TextStyleName> = { sm: "label-sm", md: "label-md", lg: "label-lg" };

/** Chips are one rung below the field, react's `chipClass`. */
const CHIP: Record<ComboboxSize, { height: number; paddingLeft: number; paddingRight: number; gap: number }> = {
  sm: { height: 20, paddingLeft: spacing["1.5"], paddingRight: spacing["0.5"], gap: spacing["0.5"] },
  md: { height: 24, paddingLeft: spacing["2"], paddingRight: spacing["1"], gap: spacing["1"] },
  lg: { height: 28, paddingLeft: spacing["2.5"], paddingRight: spacing["1"], gap: spacing["1"] },
};

const CHIP_TEXT: Record<ComboboxSize, TextStyleName> = { sm: "label-sm", md: "label-sm", lg: "label-md" };
const CHECK: Record<ComboboxSize, number> = { sm: 16, md: 16, lg: 20 };
const CHIP_ICON: Record<ComboboxSize, number> = { sm: 12, md: 14, lg: 16 };

/** Multiple chips wrap, so the field grows from its rung height instead of fixing it. */
const MULTI_FIELD: Record<ComboboxSize, ViewStyle> = {
  sm: { minHeight: controlHeight.sm, flexWrap: "wrap", gap: spacing["1"], paddingHorizontal: spacing["2"], paddingVertical: spacing["1"] },
  md: {
    minHeight: controlHeight.md,
    flexWrap: "wrap",
    gap: spacing["1.5"],
    paddingHorizontal: spacing["2.5"],
    paddingVertical: spacing["1.5"],
  },
  lg: { minHeight: controlHeight.lg, flexWrap: "wrap", gap: spacing["2"], paddingHorizontal: spacing["3"], paddingVertical: spacing["2"] },
};

/** One option's box on the screen, from `measureInWindow`; all values are points. */
type AnchorRect = { x: number; y: number; width: number; height: number };

const findItem = (items: readonly ComboboxItemData[], value: string | null | undefined) =>
  value == null ? null : (items.find((item) => item.value === value) ?? null);

const shortLabel = (item: ComboboxItemData) => item.selectedLabel ?? item.label;

/** Whether an item still matches the trimmed, case-insensitive query. */
const matches = (item: ComboboxItemData, needle: string) =>
  !needle || [item.label, item.value, ...(item.keywords ?? [])].some((text) => text.toLowerCase().includes(needle));

/**
 * Search and choose: a field you type into to narrow the list, then pick one item or, with
 * `multiple`, several items shown as chips. The popup matches `Select`: the veil, rows with a check.
 * `variant="segment"` puts it in an `InputGroup`, such as a country code before a phone number.
 *
 * Filtering is a case-insensitive substring match over each item's `label`, `value` and `keywords`,
 * with the query trimmed first; a blank query keeps every item. The chosen item's `selectedLabel`
 * (falling back to `label`) is what the field shows, while `onValueChange` carries `value`.
 *
 * React's popup was portalled and positioned by Base UI; React Native opens it in a `Modal`
 * anchored 4pt under the field and at least as wide as it, with the list scrolling past 256pt and
 * the panel capping at 320pt. A `segment` trigger opens a 256pt column with its own search box,
 * since the trigger carries no text field of its own. Rows are tapped rather than highlighted with
 * the keyboard: a single-select pick closes the popup, a multi-select pick keeps it open and clears
 * the query so the unfiltered list stays visible.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Combobox } from "@horon-ai/expo";
 *
 * function CountryCode() {
 *   const [country, setCountry] = useState<string | null>("+82");
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
    style,
    "aria-label": ariaLabel,
  } = props;
  const theme = useHoronTheme();
  const insets = useInsets();
  const window = useWindowDimensions();
  const group = useInputGroup();
  const segment = variant === "segment";
  const size = segment && group ? group.size : ownSize;
  const popupSurface = segment && group ? group.surface : surface;
  const blocked = disabled ?? (segment ? (group?.disabled ?? false) : false);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState({ width: 0, height: 0 });
  const [innerSingle, setInnerSingle] = useState<string | null>(props.multiple ? null : (props.defaultValue ?? null));
  const [innerMulti, setInnerMulti] = useState<readonly string[]>(props.multiple ? (props.defaultValue ?? []) : []);
  const anchorRef = useRef<ComponentRef<typeof View>>(null);

  const singleValue = props.multiple ? null : props.value !== undefined ? props.value : innerSingle;
  const chosenSingle = props.multiple ? null : findItem(items, singleValue);
  const chosenMulti = props.multiple
    ? (props.value ?? innerMulti)
        .map((value) => findItem(items, value))
        .filter((item): item is ComboboxItemData => item !== null)
    : [];
  const needle = query.trim().toLowerCase();
  const filtered = items.filter((item) => matches(item, needle));

  const painted = segment ? null : surface === "glass" ? null : fieldBoxClass[surface];
  const borderToken: ColorToken = invalid
    ? "border-danger"
    : painted?.border ?? "border-default";

  const measure = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));
  };

  const openPopup = () => {
    if (blocked) return;
    measure();
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
    setQuery("");
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
      // The popup stays open, so the query is cleared to keep the visible text and the list in step.
      setQuery("");
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

  const [fade] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!open) return;
    if (theme.reducedMotion) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: duration.popIn, easing: easing.outQuint, useNativeDriver: true }).start();
  }, [open, theme.reducedMotion, fade]);

  // The popup is at least as wide as the field and never wider than the window minus its margins;
  // a segment trigger has no text field, so its column keeps react's fixed 256pt.
  const popupWidth = segment
    ? Math.min(256, window.width - spacing["8"])
    : Math.max(anchor?.width ?? 0, panel.width, 240);
  const estimated = Math.min(filtered.length * (TOUCH_TARGET + spacing["0.5"]) + spacing["3"] + (segment ? 48 : 0), 320);
  const popupHeight = panel.height > 0 ? panel.height : estimated;
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

  const fieldTextStyle = useFieldText(fieldTextClass[size]);
  const rowHeight = theme.touch ? TOUCH_TARGET : controlHeight[size];

  const fieldTrigger = ({ pressed }: PressableStateCallbackType) =>
    [
      fieldBoxClass.base,
      fieldSizeClass[size],
      { width: 240, maxWidth: "100%" },
      painted ? { backgroundColor: theme.color(blocked ? painted.disabledBackground : painted.background) } : null,
      { borderColor: theme.color(borderToken) },
      surface === "glass" && blocked && { opacity: 0.6 },
      surface !== "glass" && pressed && !blocked && !invalid && { borderColor: theme.color("border-strong") },
      blocked && { opacity: DISABLED_OPACITY },
      style,
    ] as StyleProp<ViewStyle>;

  const chipRow = (item: ComboboxItemData) => (
    <View
      key={item.value}
      style={[
        styles.chip,
        {
          height: CHIP[size].height,
          paddingLeft: CHIP[size].paddingLeft,
          paddingRight: CHIP[size].paddingRight,
          gap: CHIP[size].gap,
          backgroundColor: theme.color("overlay-ink-6"),
        },
      ]}
    >
      <HoronText variant={CHIP_TEXT[size]}>{shortLabel(item)}</HoronText>
      <HoronPressable
        role="button"
        accessibilityLabel={`Remove ${item.label}`}
        hitSlop={touchSlop(theme.touch, CHIP[size].height, CHIP[size].height)}
        onPress={() => removeValue(item.value)}
        style={({ pressed }) => [
          styles.chipRemove,
          { backgroundColor: pressed ? theme.color("overlay-ink-10") : "transparent" },
        ]}
      >
        <X size={CHIP_ICON[size]} color={theme.color("text-secondary")} />
      </HoronPressable>
    </View>
  );

  return (
    <>
      <View
        ref={anchorRef}
        collapsable={false}
        onLayout={measure}
        style={[styles.anchor, segment ? styles.anchorStretch : styles.anchorTop]}
      >
        {segment ? (
          <HoronPressable
            role="button"
            accessibilityLabel={ariaLabel}
            accessibilityState={{ disabled: blocked, expanded: open }}
            disabled={blocked}
            haptic="selection"
            onPress={() => (open ? closePopup() : openPopup())}
            hitSlop={touchSlop(theme.touch, controlHeight[size])}
            style={({ pressed }) => [
              inputGroupSegmentClass[size].container,
              { backgroundColor: theme.color("overlay-ink-4") },
              blocked && { opacity: DISABLED_OPACITY },
              pressed && !blocked && { backgroundColor: theme.color("overlay-ink-8") },
              style,
            ]}
          >
            <View style={styles.triggerText}>
              {chosenMulti.length ? (
                <HoronText variant={inputGroupSegmentClass[size].text} numberOfLines={1}>
                  {chosenMulti.map(shortLabel).join(", ")}
                </HoronText>
              ) : (
                <HoronText variant={inputGroupSegmentClass[size].text} tone="text-placeholder" numberOfLines={1}>
                  {placeholder}
                </HoronText>
              )}
            </View>
            <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
              <CaretDown size={size === "lg" ? 20 : 16} color={theme.color("text-secondary")} />
            </View>
          </HoronPressable>
        ) : props.multiple ? (
          <HoronPressable
            role="combobox"
            accessibilityLabel={ariaLabel}
            accessibilityState={{ disabled: blocked, expanded: open }}
            disabled={blocked}
            haptic="selection"
            onPress={openPopup}
            style={({ pressed }) => [
              fieldBoxClass.base,
              MULTI_FIELD[size],
              theme.touch && { minHeight: TOUCH_TARGET },
              { width: 240, maxWidth: "100%" },
              painted ? { backgroundColor: theme.color(blocked ? painted.disabledBackground : painted.background) } : null,
              { borderColor: theme.color(borderToken) },
              surface === "glass" && blocked && { opacity: 0.6 },
              surface !== "glass" && pressed && !blocked && !invalid && { borderColor: theme.color("border-strong") },
              blocked && { opacity: DISABLED_OPACITY },
              style,
            ]}
          >
            {surface === "glass" ? (
              <GlassSurface material="veil" radius={radius.md} style={StyleSheet.absoluteFill} />
            ) : null}
            {chosenMulti.map(chipRow)}
            <TextInput
              accessibilityLabel={ariaLabel}
              placeholder={chosenMulti.length ? undefined : placeholder}
              placeholderTextColor={theme.color("text-placeholder")}
              editable={!blocked}
              value={query}
              onChangeText={setQuery}
              onFocus={openPopup}
              maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}
              style={[fieldBoxClass.text, fieldTextStyle, { minWidth: 64, color: theme.color("text-primary") }]}
            />
          </HoronPressable>
        ) : (
          <HoronPressable
            role="combobox"
            accessibilityLabel={ariaLabel}
            accessibilityState={{ disabled: blocked, expanded: open }}
            disabled={blocked}
            haptic="selection"
            onPress={openPopup}
            style={fieldTrigger}
          >
            {({ pressed }) => (
              <>
                {surface === "glass" ? (
                  <GlassSurface material="veil" radius={radius.md} pressed={pressed} style={StyleSheet.absoluteFill} />
                ) : null}
                <MagnifyingGlass size={size === "lg" ? 20 : 16} color={theme.color("text-secondary")} />
                {/* The field itself is the search box, as in react: while the popup is shut it shows
                    the chosen label, and the first keystroke opens the list on the typed query. */}
                <TextInput
                  accessibilityLabel={ariaLabel}
                  placeholder={chosenSingle || query ? undefined : placeholder}
                  placeholderTextColor={theme.color("text-placeholder")}
                  editable={!blocked}
                  value={!open && chosenSingle ? shortLabel(chosenSingle) : query}
                  onChangeText={(text) => {
                    setQuery(text);
                    if (!open) openPopup();
                  }}
                  onFocus={openPopup}
                  maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}
                  style={[fieldBoxClass.text, fieldTextStyle, { color: theme.color("text-primary") }]}
                />
                <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
                  <CaretDown size={size === "lg" ? 20 : 16} color={theme.color("text-secondary")} />
                </View>
              </>
            )}
          </HoronPressable>
        )}
      </View>

      <Modal
        visible={open}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closePopup}
      >
        <View style={styles.modalRoot}>
          <HoronPressable
            haptic="none"
            style={StyleSheet.absoluteFill}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onPress={closePopup}
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
                gap: segment ? spacing["1"] : 0,
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
            {segment ? (
              <View
                style={[
                  fieldBoxClass.base,
                  fieldSizeClass[size],
                  {
                    backgroundColor: theme.color("bg-surface"),
                    borderColor: theme.color("border-default"),
                  },
                ]}
              >
                <MagnifyingGlass size={size === "lg" ? 20 : 16} color={theme.color("text-secondary")} />
                <TextInput
                  accessibilityLabel={searchPlaceholder}
                  placeholder={searchPlaceholder}
                  placeholderTextColor={theme.color("text-placeholder")}
                  value={query}
                  onChangeText={setQuery}
                  maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE}
                  style={[fieldBoxClass.text, fieldTextStyle, { color: theme.color("text-primary") }]}
                />
              </View>
            ) : null}
            <ScrollView
              role="list"
              accessibilityLabel={ariaLabel}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              {filtered.length === 0 ? (
                <View style={[styles.row, ROW[size], { minHeight: rowHeight }]}>
                  <HoronText variant={size === "lg" ? "body-md" : "body-sm"} tone="text-secondary">
                    {typeof emptyLabel === "string" || typeof emptyLabel === "number" ? emptyLabel : "No results"}
                  </HoronText>
                </View>
              ) : (
                filtered.map((item) => {
                  const selected = props.multiple
                    ? (props.value ?? innerMulti).includes(item.value)
                    : item.value === singleValue;
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
                        { minHeight: rowHeight },
                        {
                          backgroundColor: selected || pressed ? theme.color("overlay-ink-6") : "transparent",
                          opacity: item.disabled ? DISABLED_OPACITY : 1,
                        },
                      ]}
                    >
                      <HoronText variant={ROW_TEXT[size]} numberOfLines={1} style={styles.rowLabel}>
                        {item.label}
                      </HoronText>
                      {item.trailing ? (
                        <HoronText variant={ROW_TEXT[size]} tone="text-secondary">
                          {item.trailing}
                        </HoronText>
                      ) : null}
                      {selected ? <Check size={CHECK[size]} color={theme.color("text-primary")} /> : null}
                    </HoronPressable>
                  );
                })
              )}
            </ScrollView>
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
  triggerText: { flexShrink: 1, minWidth: 0 },
  chip: { flexDirection: "row", alignItems: "center", borderRadius: radius.full },
  chipRemove: { alignItems: "center", justifyContent: "center", borderRadius: radius.full, padding: spacing["0.5"] },
  modalRoot: { flex: 1 },
  popup: { position: "absolute", overflow: "hidden", borderRadius: radius.xl, boxShadow: shadow.popover },
  listContent: { padding: spacing["1.5"], gap: spacing["0.5"] },
  row: { flexDirection: "row", alignItems: "center", borderRadius: radius.md, paddingHorizontal: spacing["3"] },
  rowLabel: { flex: 1, minWidth: 0 },
});
