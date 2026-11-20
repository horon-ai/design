import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

/**
 * Puts a press handler and its accessible name on a caller's element, react's `render` prop. React Native
 * cannot swap elements, so the element is cloned instead of wrapped; the handler wins over any the caller
 * had, because the trigger is what opens the surface.
 */
function withPress(element: ReactElement<PressableProps>, press: PressableProps, children?: ReactNode) {
  // Base UI's `render` put the trigger's children inside the rendered element; a bare clone would drop
  // them, and an element the caller wrote without children (a `Button`) would paint empty.
  return cloneElement(element, children === undefined ? press : { ...press, children });
}

import { CaretRight } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";

/** The open state {@link BottomSheet} publishes to the parts below it. */
type SheetSet = {
  /** Whether the sheet is mounted. */
  open: boolean;
  /** Asks the root to show or hide the sheet; a controlled root reports it instead of moving. */
  setOpen: (next: boolean) => void;
};

const SheetContext = createContext<SheetSet>({ open: false, setOpen: () => undefined });

/** Props of {@link BottomSheet}: the controlled or uncontrolled open state plus the parts it wraps. */
type BottomSheetProps = {
  /** Controlled state. While set the root reports changes through `onOpenChange` and keeps no state of its own. */
  open?: boolean;
  /** State at first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called with the requested state on a trigger, a close control, the scrim or a downward drag. */
  onOpenChange?: (open: boolean) => void;
  /** Accepted for call-site parity with Base UI's drawer; a React Native `Modal` is always modal. */
  modal?: boolean;
  /** The trigger and content that make up the sheet. */
  children?: ReactNode;
};

/**
 * Root of the bottom sheet: owns the open state and the drag dismissal. Wrap a
 * {@link BottomSheetTrigger} and a {@link BottomSheetContent}; the sheet is only mounted while open.
 *
 * Base UI's `Drawer.Root` on the web. React Native has no drawer primitive, so the root keeps the
 * state and publishes it through a context; the drag lives on the sheet's grabber, in
 * {@link BottomSheetContent}, and reports through the same `setOpen`.
 *
 * @example
 * ```tsx
 * <BottomSheet>
 *   <BottomSheetTrigger render={<Button variant="solid" />}>Open sheet</BottomSheetTrigger>
 *   <BottomSheetContent title="Reminder" floating>
 *     <HoronText tone="text-secondary">Every weekday at 9:00</HoronText>
 *     <BottomSheetActions>
 *       <BottomSheetAction>Cancel</BottomSheetAction>
 *       <BottomSheetAction variant="primary">Save</BottomSheetAction>
 *     </BottomSheetActions>
 *   </BottomSheetContent>
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal: _modal,
  children,
}: BottomSheetProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

/** Props shared by {@link BottomSheetTrigger} and {@link BottomSheetClose}. */
type SheetPressProps = {
  /**
   * An element to carry the press behaviour, react's `render` prop. React Native cannot swap elements,
   * so the element is cloned with an `onPress` handler instead of being replaced.
   */
  render?: ReactElement;
  /** Content of the built-in pressable surface, used when `render` is absent. */
  children?: ReactNode;
  /** Layout of the built-in pressable surface. */
  style?: StyleProp<ViewStyle>;
  /** Accessible name of the built-in pressable surface, when its content names nothing. */
  accessibilityLabel?: string;
};

/** The element that opens the sheet, with the press behaviour put on `render` when one is given. */
export function BottomSheetTrigger({ render, children, style, accessibilityLabel }: SheetPressProps) {
  const { setOpen } = useContext(SheetContext);
  if (isValidElement<PressableProps>(render))
    return withPress(render, { onPress: () => setOpen(true), accessibilityLabel }, children);
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => setOpen(true)}
      pressScale
      style={style}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <HoronText variant="label-lg">{children}</HoronText>
      ) : (
        children
      )}
    </HoronPressable>
  );
}

/** A close control for the sheet body; it also dismisses on the scrim and on a downward drag of the grabber. */
export function BottomSheetClose({ render, children, style, accessibilityLabel }: SheetPressProps) {
  const { setOpen } = useContext(SheetContext);
  if (isValidElement<PressableProps>(render))
    return withPress(render, { onPress: () => setOpen(false), accessibilityLabel }, children);
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => setOpen(false)}
      pressScale
      style={style}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <HoronText variant="label-lg">{children}</HoronText>
      ) : (
        children
      )}
    </HoronPressable>
  );
}

/** Props of {@link BottomSheetContent}. */
export type BottomSheetContentProps = {
  /** Sheet title, rendered in the sheet's title slot above the children. */
  title: ReactNode;
  /**
   * `panel` is the Figma panel sheet (374pt max, `label-lg` title). `detail` is the Paper detail sheet:
   * full width, 18pt rhythm, a caller-built header (tile, title, description) set flush left.
   * @default "panel"
   */
  variant?: "panel" | "detail";
  /**
   * `glass` places the sheet on the veil; `solid` is the Paper workspace sheet: the opaque surface fill,
   * 20pt top corners, 8/24/16 padding.
   * @default "solid"
   */
  surface?: "glass" | "solid";
  /**
   * Draws the dimmed scrim behind the sheet. Paper's floating panel sheet has none.
   * @default true
   */
  backdrop?: boolean;
  /**
   * Insets the sheet 16pt from the sides and bottom edge (Paper's 358pt panel sheet) instead of docking
   * it full width. The safe-area inset of the bottom edge is added on top either way.
   * @default false
   */
  floating?: boolean;
  /** Layout of the sheet, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The sheet body under the title. */
  children?: ReactNode;
};

/** How far the grabber must travel down before the sheet dismisses, in points. */
const DRAG_DISMISS_THRESHOLD = 72;

/**
 * Figma `Bottom sheet` (Panels 88:808): the veil with 32pt top corners, a 36x5 grabber and a `label-lg`
 * title. There is no close button: the sheet closes on the scrim, on a downward drag of the grabber, on
 * the Android back button, or through the caller's own bottom action row.
 *
 * React portals it above the page and lets Base UI slide it and own the drag. Here an RN `Modal`
 * (transparent) holds the scrim and the bottom-docked sheet, so it paints above the app, the back button
 * closes it through `onRequestClose`, and a scrim press dismisses it like an outside press. The grabber
 * drags with a `PanResponder`: a downward pull past 72pt closes the sheet and a shorter one springs back.
 * The sheet is capped at the window height minus 32pt, pads its own bottom by the safe-area inset, and
 * scrolls its body.
 */
export function BottomSheetContent({
  title,
  variant = "panel",
  surface = "solid",
  backdrop = true,
  floating = false,
  style,
  children,
}: BottomSheetContentProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const { open, setOpen } = useContext(SheetContext);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const [slide] = useState(() => new Animated.Value(0));
  const [drag] = useState(() => new Animated.Value(0));
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!open) {
      slide.setValue(0);
      drag.setValue(0);
      return undefined;
    }
    if (theme.reducedMotion) {
      slide.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(slide, {
      toValue: 1,
      duration: duration.slide + 120,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [open, theme.reducedMotion, slide, drag]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderGrant: () => setDragging(true),
        onPanResponderMove: (_event, gesture) => drag.setValue(Math.max(0, gesture.dy)),
        onPanResponderRelease: (_event, gesture) => {
          setDragging(false);
          if (gesture.dy >= DRAG_DISMISS_THRESHOLD) {
            close();
            return;
          }
          Animated.timing(drag, {
            toValue: 0,
            duration: duration.slide,
            easing: easing.outQuint,
            useNativeDriver: true,
          }).start();
        },
      }),
    [close, drag],
  );

  if (!open) return null;

  const detail = variant === "detail";
  const glass = surface === "glass";
  const translateY = Animated.add(
    slide.interpolate({ inputRange: [0, 1], outputRange: [360, 0] }),
    drag,
  );
  const cornerRadius = floating || detail ? radius.xl : radius["2xl"] * 2;

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={styles.host} accessibilityViewIsModal>
        <HoronPressable
          haptic="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={backdrop ? close : undefined}
          style={[styles.scrim, backdrop ? { backgroundColor: theme.color("bg-scrim"), opacity: 0.32 } : undefined]}
        />
        <View
          pointerEvents="box-none"
          style={[
            styles.viewport,
            floating ? { paddingHorizontal: spacing["4"], paddingBottom: spacing["4"] } : undefined,
          ]}
        >
          <Animated.View
            style={[
              styles.frame,
              {
                borderRadius: cornerRadius,
                transform: [{ translateY }],
                maxWidth: floating || detail ? "100%" : 374,
                paddingBottom: insets.bottom + (detail ? 24 : floating ? spacing["3"] : spacing["6"]),
              },
              glass
                ? undefined
                : { backgroundColor: theme.color("bg-surface"), boxShadow: `0 -8px 32px 0 ${theme.color("overlay-ink-8")}` },
              style,
            ]}
          >
            {glass ? (
              <GlassSurface
                material="veil"
                radius={cornerRadius}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
            ) : null}
            <View style={styles.grabberZone} {...pan.panHandlers} accessibilityElementsHidden>
              <View style={[styles.grabber, { backgroundColor: theme.color("overlay-ink-20") }]} />
            </View>
            <ScrollView
              style={styles.body}
              contentContainerStyle={[styles.bodyContent, { gap: detail ? 18 : floating ? spacing["3"] : spacing["1"] }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={!dragging}
            >
              <View style={[styles.titleRow, detail ? styles.titleRowDetail : null]}>
                <View style={styles.titleText}>
                  <HoronText variant={detail ? "body-md" : "label-lg"} role="heading">
                    {title}
                  </HoronText>
                </View>
              </View>
              {children}
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

/** Props of {@link BottomSheetRow}. */
export type BottomSheetRowProps = {
  /** Leading icon rendered at 20pt in the secondary text colour. */
  icon?: ReactNode;
  /** Current value on the right, such as "On" or "Weekdays". */
  value?: string | number;
  /** Layout of the row, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The row label. */
  children?: ReactNode;
  /** Blocks the row and paints it faint; a press does nothing. */
  disabled?: boolean;
  /** Called when the row is pressed. */
  onPress?: PressableProps["onPress"];
  /** Accessible name of the row, when its content names nothing. */
  accessibilityLabel?: string;
};

/** A 48pt settings row: 20pt icon, label, value and a 16pt caret. Part of {@link BottomSheetContent}. */
export function BottomSheetRow({
  icon,
  value,
  style,
  children,
  disabled,
  onPress,
  accessibilityLabel,
}: BottomSheetRowProps) {
  const theme = useHoronTheme();
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: theme.color("overlay-ink-4") },
        disabled && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      {icon ? <View style={styles.rowIcon}>{icon}</View> : null}
      <View style={styles.rowLabel}>
        <HoronText variant="label-md" numberOfLines={1}>
          {children}
        </HoronText>
      </View>
      {value === undefined ? null : (
        <HoronText variant="body-sm" tone="text-secondary">
          {value}
        </HoronText>
      )}
      <CaretRight size={16} color={theme.color("text-secondary")} />
    </HoronPressable>
  );
}

/**
 * The action row: secondary first, the primary action at the right edge, 8pt apart. Wraps onto a
 * second line when the sheet is too narrow. Part of {@link BottomSheetContent}.
 */
export function BottomSheetActions({
  style,
  children,
}: {
  /** Layout of the row, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The action pills. */
  children?: ReactNode;
}) {
  return <View style={[styles.actions, style]}>{children}</View>;
}

/** Props of {@link BottomSheetAction}. */
export type BottomSheetActionProps = {
  /**
   * `primary` is the filled brand pill, `secondary` the 6% ink pill.
   * @default "secondary"
   */
  variant?: "primary" | "secondary";
  /** Layout of the pill, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The pill label. */
  children?: ReactNode;
  /** Blocks the pill and paints it faint; a press does nothing. */
  disabled?: boolean;
  /** Called when the pill is pressed. */
  onPress?: PressableProps["onPress"];
  /** Accessible name of the pill, when its label alone is not enough. */
  accessibilityLabel?: string;
};

/** The sheet's 44pt pill actions: `secondary` is 6% ink, `primary` is ink. Part of {@link BottomSheetActions}. */
export function BottomSheetAction({
  variant = "secondary",
  style,
  children,
  disabled,
  onPress,
  accessibilityLabel,
}: BottomSheetActionProps) {
  const theme = useHoronTheme();
  const primary = variant === "primary";
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      pressScale
      style={({ pressed }) => [
        styles.action,
        {
          backgroundColor: theme.color(
            primary
              ? pressed
                ? "interactive-primary-pressed"
                : "interactive-primary"
              : pressed
                ? "overlay-ink-10"
                : "overlay-ink-6",
          ),
        },
        disabled && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      <HoronText variant="label-md" tone={primary ? "interactive-on-primary" : "text-primary"} numberOfLines={1}>
        {children}
      </HoronText>
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, justifyContent: "flex-end" },
  scrim: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  viewport: { width: "100%", alignItems: "center" },
  frame: {
    width: "100%",
    maxHeight: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderCurve: "continuous",
    paddingTop: spacing["2"],
    paddingHorizontal: spacing["4"],
  },
  body: { flexShrink: 1 },
  bodyContent: { paddingTop: spacing["2"] },
  grabberZone: { alignSelf: "stretch", alignItems: "center", paddingVertical: spacing["1"] },
  grabber: { height: 5, width: 36, borderRadius: 3 },
  titleRow: { flexDirection: "row", gap: spacing["2"], alignItems: "center", paddingTop: spacing["2.5"], paddingBottom: spacing["2"], paddingLeft: spacing["2"] },
  titleRowDetail: { alignItems: "flex-start", paddingLeft: 0 },
  titleText: { flex: 1, minWidth: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    paddingHorizontal: spacing["2"],
    borderRadius: radius.sm,
    minHeight: 48,
  },
  rowLabel: { flex: 1, minWidth: 0 },
  rowIcon: { flexShrink: 0 },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing["2"],
    paddingTop: spacing["3"],
    width: "100%",
  },
  action: {
    minHeight: 44,
    minWidth: 100,
    paddingHorizontal: spacing["4"],
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
