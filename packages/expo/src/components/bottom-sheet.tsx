import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Animated,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type KeyboardEvent,
  type LayoutChangeEvent,
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
import { radius, spacing, veil } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";

/** Default maximum width on wider screens, matching {@link Modal}'s `md` reading width while staying wider than every portrait phone. */
const DEFAULT_MAX_WIDTH = 560;

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
 *   <BottomSheetContent title="Reminder">
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
   * `panel` is the docked panel sheet (`label-lg` title, 4pt rhythm). `detail` is the detail sheet:
   * 18pt rhythm with a caller-built header (tile, title, description) set flush left.
   * @default "panel"
   */
  variant?: "panel" | "detail";
  /**
   * `glass` places the sheet on the veil; `solid` is the opaque surface fill. Both dock flush to the
   * bottom edge (and left/right edges when the screen is narrower than `maxWidth`) with 20pt top
   * corners and pad their bottom content by the safe-area inset.
   * @default "solid"
   */
  surface?: "glass" | "solid";
  /**
   * Draws the dimmed scrim behind the sheet. Pressing outside still dismisses the sheet when `false`.
   * @default true
   */
  backdrop?: boolean;
  /**
   * Maximum sheet width on wider screens (tablets, landscape phones, desktop web). When the viewport is
   * wider than `maxWidth`, the sheet stays horizontally centred and docked to the bottom edge; when
   * narrower, it fills 100% width flush to the left and right edges. Pass `"none"` to span full width
   * at every screen size.
   * @default 560
   */
  maxWidth?: number | "none";
  /** Layout of the sheet, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The sheet body under the title. */
  children?: ReactNode;
};

/** How far the grabber must travel down before the sheet dismisses, in points. */
const DRAG_DISMISS_THRESHOLD = 72;

/** True for text a slot can set in its own type token; a node keeps its own layout. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** Reads the live keyboard frame when a sheet mounts while the keyboard is already open. */
function readCurrentKeyboard(): { height: number; screenY: number | null } {
  if (!Keyboard.isVisible?.()) return { height: 0, screenY: null };
  const metrics = Keyboard.metrics?.();
  if (!metrics || metrics.height <= 0) return { height: 0, screenY: null };
  return {
    height: metrics.height,
    screenY: typeof metrics.screenY === "number" ? metrics.screenY : null,
  };
}

/**
 * Tracks the software keyboard while the sheet modal is mounted so the scrollable body clears the
 * keyboard while the sheet frame stays docked to bottom 0, without double-padding the bottom
 * safe-area inset or double-offsetting when Android `adjustResize` already shrinks the modal host.
 */
function useKeyboardInset(reducedMotion: boolean) {
  const [keyboard, setKeyboard] = useState(readCurrentKeyboard);
  const [hostBottom, setHostBottom] = useState<number | null>(null);
  const hostRef = useRef<ComponentRef<typeof View>>(null);

  useEffect(() => {
    const handleShow = (event: KeyboardEvent) => {
      if (!reducedMotion && Platform.OS === "ios") {
        Keyboard.scheduleLayoutAnimation?.(event);
      }
      const height = Math.max(0, event.endCoordinates?.height ?? 0);
      const screenY = typeof event.endCoordinates?.screenY === "number" ? event.endCoordinates.screenY : null;
      setKeyboard({ height, screenY });
    };
    const handleHide = (event: KeyboardEvent) => {
      if (!reducedMotion && Platform.OS === "ios") {
        Keyboard.scheduleLayoutAnimation?.(event);
      }
      setKeyboard({ height: 0, screenY: null });
    };

    const showEvents =
      Platform.OS === "ios"
        ? (["keyboardWillShow", "keyboardDidShow"] as const)
        : (["keyboardDidShow"] as const);
    const hideEvents =
      Platform.OS === "ios"
        ? (["keyboardWillHide", "keyboardDidHide"] as const)
        : (["keyboardDidHide"] as const);

    const subscriptions = [
      ...showEvents.map((name) => Keyboard.addListener(name, handleShow)),
      ...hideEvents.map((name) => Keyboard.addListener(name, handleHide)),
    ];
    return () => {
      for (const subscription of subscriptions) subscription.remove();
    };
  }, [reducedMotion]);

  const onHostLayout = useCallback((event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    if (height <= 0) return;
    if (typeof hostRef.current?.measureInWindow === "function") {
      hostRef.current.measureInWindow((_wx, wy, _ww, wh) => {
        if (wh > 0) setHostBottom(wy + wh);
        else setHostBottom(y + height);
      });
      return;
    }
    setHostBottom(y + height);
  }, []);

  const keyboardHeight = keyboard.height;
  const keyboardOffset =
    keyboardHeight <= 0
      ? 0
      : hostBottom !== null && keyboard.screenY !== null && keyboard.screenY > 0
        ? Math.max(0, hostBottom - keyboard.screenY)
        : keyboardHeight;

  return { hostRef, keyboardHeight, keyboardOffset, onHostLayout };
}

/**
 * Bottom-docked sheet: on screens narrower than `maxWidth` (default 560pt) it docks flush to the
 * left, right and bottom edges; on wider screens (tablets, landscape phones, desktop web) it centres
 * horizontally at `maxWidth` while staying anchored to the bottom edge. Top corners are 20pt
 * continuous, bottom corners are square, and the sheet closes on an outside tap, on a downward drag
 * of the grabber, on the Android back / Escape / VoiceOver escape action, or through the caller's
 * own action row.
 *
 * The sheet background extends to the physical bottom edge while the scrollable content pads its
 * bottom by the safe-area inset (yielding to the keyboard when open so no double padding appears),
 * and the sheet stops below the top safe-area inset.
 */
export function BottomSheetContent(props: BottomSheetContentProps) {
  const { open, setOpen } = useContext(SheetContext);
  const close = useCallback(() => setOpen(false), [setOpen]);
  if (!open) return null;
  return <BottomSheetModal {...props} close={close} />;
}

/** Mounted only while open so slide, drag and keyboard state start clean on every presentation. */
function BottomSheetModal({
  title,
  variant = "panel",
  surface = "solid",
  backdrop = true,
  maxWidth = DEFAULT_MAX_WIDTH,
  style,
  children,
  close,
}: BottomSheetContentProps & { close: () => void }) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [slide] = useState(() => new Animated.Value(0));
  const [drag] = useState(() => new Animated.Value(0));
  const [dragging, setDragging] = useState(false);
  const { hostRef, keyboardHeight, keyboardOffset, onHostLayout } = useKeyboardInset(theme.reducedMotion);

  useEffect(() => {
    if (theme.reducedMotion) {
      slide.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(slide, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [theme.reducedMotion, slide]);

  const snapDragBack = useCallback(() => {
    setDragging(false);
    if (theme.reducedMotion) {
      drag.setValue(0);
      return;
    }
    Animated.timing(drag, {
      toValue: 0,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [drag, theme.reducedMotion]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderGrant: () => setDragging(true),
        onPanResponderMove: (_event, gesture) => drag.setValue(Math.max(0, gesture.dy)),
        onPanResponderRelease: (_event, gesture) => {
          if (gesture.dy >= DRAG_DISMISS_THRESHOLD) {
            setDragging(false);
            close();
            return;
          }
          snapDragBack();
        },
        onPanResponderTerminate: snapDragBack,
      }),
    [close, drag, snapDragBack],
  );

  const detail = variant === "detail";
  const glass = surface === "glass";
  const slideDistance = Math.min(Math.max(Math.round(windowHeight * 0.5), 360), 560);
  const translateY = Animated.add(
    slide.interpolate({ inputRange: [0, 1], outputRange: [slideDistance, 0] }),
    drag,
  );
  const resolvedMaxWidth = maxWidth === "none" ? undefined : Math.max(0, maxWidth);
  const sideGap =
    resolvedMaxWidth !== undefined && windowWidth > resolvedMaxWidth
      ? (windowWidth - resolvedMaxWidth) / 2
      : 0;
  // Side safe-area insets only apply where the sheet actually reaches the screen's side notch zone;
  // when centred inside a wider viewport, the outer gap already clears the notch.
  const leftSafeInset = Math.max(0, insets.left - sideGap);
  const rightSafeInset = Math.max(0, insets.right - sideGap);
  // Keep the sheet frame anchored at bottom 0 even while the keyboard is open; clear the keyboard
  // inside the scrollable content container without stacking `insets.bottom` on top of the keyboard.
  const bottomInset =
    keyboardHeight > 0
      ? Math.max(keyboardOffset, Math.max(0, insets.bottom - keyboardHeight))
      : insets.bottom;
  const baseBottomPadding = glass ? spacing["5"] : spacing["6"];
  const accessibleTitle = isPlainText(title) ? String(title) : undefined;
  const ringColor = glass ? veil.scheme[theme.scheme].ring : theme.color("border-default");
  const shadowColor = veil.scheme[theme.scheme].overlayShadow;

  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        ref={hostRef}
        onLayout={onHostLayout}
        onAccessibilityEscape={close}
        style={[
          styles.host,
          {
            paddingTop: Math.max(insets.top + spacing["4"], spacing["8"]),
          },
        ]}
        accessibilityViewIsModal
      >
        <HoronPressable
          haptic="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={close}
          style={[styles.scrim, backdrop ? { backgroundColor: theme.color("bg-scrim"), opacity: 0.32 } : undefined]}
        />
        <View pointerEvents="box-none" style={styles.viewport}>
          <Animated.View
            role="dialog"
            accessibilityLabel={accessibleTitle}
            style={[
              styles.frame,
              resolvedMaxWidth !== undefined ? { maxWidth: resolvedMaxWidth } : undefined,
              { transform: [{ translateY }] },
              glass
                ? theme.glass === "native"
                  ? undefined
                  : { boxShadow: `0 -8px 32px 0 ${shadowColor}` }
                : {
                    backgroundColor: theme.color("bg-surface"),
                    boxShadow: `0 0 0 ${veil.ringWidth}px ${ringColor}, 0 -8px 32px 0 ${shadowColor}`,
                  },
              style,
            ]}
          >
            {glass ? (
              <GlassSurface
                material="veil"
                style={[
                  theme.glass === "native" ? StyleSheet.absoluteFill : styles.frostFill,
                  styles.glassCorners,
                ]}
                pointerEvents="none"
              />
            ) : null}
            <View
              style={styles.grabberZone}
              hitSlop={GRABBER_HIT_SLOP}
              {...pan.panHandlers}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <View style={[styles.grabber, { backgroundColor: theme.color("overlay-ink-20") }]} />
            </View>
            <ScrollView
              style={styles.body}
              contentContainerStyle={[
                styles.bodyContent,
                {
                  gap: detail ? 18 : spacing["1"],
                  paddingLeft: spacing["4"] + leftSafeInset,
                  paddingRight: spacing["4"] + rightSafeInset,
                  paddingBottom: bottomInset + baseBottomPadding,
                },
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={!dragging}
            >
              <View style={[styles.titleRow, detail ? styles.titleRowDetail : null]}>
                <View style={styles.titleText}>
                  {isPlainText(title) ? (
                    <HoronText variant={detail ? "body-md" : "label-lg"} role="heading">
                      {title}
                    </HoronText>
                  ) : (
                    title
                  )}
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

/** Widens the visual 5pt grabber strip to a 45pt vertical touch target without inflating header height. */
const GRABBER_HIT_SLOP = { top: spacing["4"], bottom: spacing["4"] } as const;

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    marginBottom: 0,
    paddingBottom: 0,
  },
  scrim: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  viewport: {
    width: "100%",
    maxHeight: "100%",
    flexShrink: 1,
    alignItems: "center",
    marginBottom: 0,
    paddingBottom: 0,
  },
  frame: {
    width: "100%",
    alignSelf: "center",
    maxHeight: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderCurve: "continuous",
    marginBottom: 0,
    paddingTop: spacing["2"],
    paddingBottom: 0,
  },
  // In frost fallback mode `GlassSurface` draws a 1pt ring on every side; nudging only the bottom
  // edge below the frame clip keeps top and side curves flush while removing the bottom seam.
  frostFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -veil.ringWidth,
  },
  glassCorners: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  body: { flexShrink: 1, minHeight: 0 },
  bodyContent: { paddingTop: spacing["2"] },
  grabberZone: { alignSelf: "stretch", alignItems: "center", paddingVertical: spacing["1"] },
  grabber: { height: 5, width: 36, borderRadius: radius.full },
  titleRow: {
    flexDirection: "row",
    gap: spacing["2"],
    alignItems: "center",
    paddingTop: spacing["2.5"],
    paddingBottom: spacing["2"],
    paddingLeft: spacing["2"],
  },
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
