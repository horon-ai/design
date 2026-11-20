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
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  View,
  useWindowDimensions,
  type HostInstance,
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

import Svg, { Path } from "react-native-svg";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { HoronText } from "../lib/text";

/** The mounted node a `View` ref points at, which is what `measureInWindow` is called on. */
type ViewInstance = HostInstance;

/** A view's box on the screen, as `measureInWindow` reports it. All values are points. */
type AnchorRect = { x: number; y: number; width: number; height: number };

/** The four sides a bubble can sit on. */
type TooltipSide = "top" | "bottom" | "left" | "right";

/**
 * Props for {@link Tooltip}.
 */
export type TooltipProps = {
  /** The element the bubble describes. It becomes the pressable trigger. */
  children: ReactElement;
  /** Bubble content; keep it to a short phrase because the bubble caps at 256pt. */
  label: ReactNode;
  /** Preferred side of the trigger; it flips when there is no room. @default "top" */
  side?: TooltipSide;
  /** Delay in milliseconds before the bubble opens; the provider's delay when omitted. */
  delay?: number;
};

/** What {@link TooltipProvider} shares with its bubbles: how long a tap waits before the bubble shows. */
type TooltipTimings = {
  /** Milliseconds before a bubble opens when the tooltip itself passes no `delay`. */
  delay: number;
  /** Milliseconds before a bubble closes; `0` closes on the same tick. */
  closeDelay: number;
};

/** Base UI's provider default: a 600ms hover delay and an immediate close. */
const DEFAULT_DELAY = 600;

const TooltipTimingContext = createContext<TooltipTimings>({ delay: DEFAULT_DELAY, closeDelay: 0 });

/** The arrow is react's 10x6 triangle path, drawn through `react-native-svg`. */
const ARROW_WIDTH = 10;
const ARROW_HEIGHT = 6;

/** The gap between the trigger's edge and the bubble, react's `sideOffset`. */
const GAP = 6;

/** The bubble's height before it is measured, so an unmeasured bubble still clears the middle. */
const PANEL_GUESS = 32;

/**
 * The bubble's box, from the trigger's measured box.
 *
 * Base UI's positioner runs floating-ui; React Native has none, so the four sides are resolved here:
 * the requested side is used when the bubble fits, flipped to the opposite side when it does not, then
 * centred on the other axis and clamped inside the window.
 */
function place(
  anchor: AnchorRect,
  panel: { width: number; height: number },
  window: { width: number; height: number },
  side: TooltipSide,
): { side: TooltipSide; left: number; top: number } {
  const fits: Record<TooltipSide, boolean> = {
    top: anchor.y - GAP - panel.height >= 0,
    bottom: anchor.y + anchor.height + GAP + panel.height <= window.height,
    left: anchor.x - GAP - panel.width >= 0,
    right: anchor.x + anchor.width + GAP + panel.width <= window.width,
  };
  const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
  const resolved = !fits[side] && fits[opposite[side]] ? opposite[side] : side;

  const centredLeft = anchor.x + anchor.width / 2 - panel.width / 2;
  const centredTop = anchor.y + anchor.height / 2 - panel.height / 2;
  const clampLeft = (value: number) =>
    Math.min(Math.max(spacing["2"], value), Math.max(spacing["2"], window.width - panel.width - spacing["2"]));
  const clampTop = (value: number) => Math.min(Math.max(0, value), Math.max(0, window.height - panel.height));

  if (resolved === "bottom") return { side: resolved, top: anchor.y + anchor.height + GAP, left: clampLeft(centredLeft) };
  if (resolved === "left") return { side: resolved, left: anchor.x - GAP - panel.width, top: clampTop(centredTop) };
  if (resolved === "right") return { side: resolved, left: anchor.x + anchor.width + GAP, top: clampTop(centredTop) };
  return { side: resolved, top: anchor.y - GAP - panel.height, left: clampLeft(centredLeft) };
}

/** The arrow's offset per side: on the edge facing the trigger, centred on the bubble. */
function arrowStyle(side: TooltipSide): StyleProp<ViewStyle> {
  if (side === "bottom")
    return { top: -ARROW_HEIGHT, left: "50%", marginLeft: -ARROW_WIDTH / 2, transform: [{ rotate: "180deg" }] };
  if (side === "left")
    return { right: -ARROW_WIDTH + 2, top: "50%", marginTop: -ARROW_HEIGHT / 2, transform: [{ rotate: "90deg" }] };
  if (side === "right")
    return { left: -ARROW_WIDTH + 2, top: "50%", marginTop: -ARROW_HEIGHT / 2, transform: [{ rotate: "-90deg" }] };
  return { bottom: -ARROW_HEIGHT, left: "50%", marginLeft: -ARROW_WIDTH / 2 };
}

/**
 * Figma `Tooltip` (62:282): an ink bubble, 10/6pt padding, 8pt corners, with a 10x6 arrow.
 *
 * React opens the bubble on hover and on keyboard focus and lets Base UI place it. A phone has neither
 * hover nor focus, so a tap (or a long press) on the trigger opens the bubble and a tap anywhere closes
 * it: the bubble lives in a transparent `Modal` with a full-screen dismiss layer, the Android back
 * button closes it through `onRequestClose`, and `measureInWindow` anchors the bubble 6pt from the
 * trigger on the resolved side with the arrow turned toward it. The bubble caps at 256pt, and the hint
 * text on the trigger also carries the label for assistive technology.
 *
 * @example
 * ```tsx
 * <Tooltip label="Copy link" side="top">
 *   <IconButton icon={<Copy />} label="Copy link" />
 * </Tooltip>
 * ```
 */
export function Tooltip({ children, label, side = "top", delay }: TooltipProps) {
  const theme = useHoronTheme();
  const window = useWindowDimensions();
  const timings = useContext(TooltipTimingContext);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState({ width: 0, height: 0 });
  const [frame, setFrame] = useState<ViewInstance | null>(null);
  const cancelPending = useRef<(() => void) | null>(null);
  const [progress] = useState(() => new Animated.Value(0));
  const wait = delay ?? timings.delay;
  const hint = typeof label === "string" ? label : undefined;

  useEffect(() => {
    if (!open) {
      progress.setValue(0);
      return undefined;
    }
    if (theme.reducedMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: duration.fadeIn,
      easing: easing.out,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [open, theme.reducedMotion, progress]);

  useEffect(() => () => cancelPending.current?.(), []);

  const close = useCallback(() => {
    cancelPending.current?.();
    cancelPending.current = null;
    setOpen(false);
  }, []);

  // The bubble opens from the tap itself; the measured box only decides where it paints, so a host that
  // cannot measure (a test renderer, a headless tree) still gets a working bubble.
  const show = () => {
    frame?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));
    cancelPending.current?.();
    cancelPending.current = null;
    if (wait <= 0) {
      setOpen(true);
      return;
    }
    // A tap is the intent itself on a touch screen; the delay only spaces out repeated glances.
    const timer = setTimeout(() => {
      cancelPending.current = null;
      setOpen(true);
    }, wait);
    cancelPending.current = () => clearTimeout(timer);
  };

  // Without a measured trigger the bubble sits over the middle of the window instead of at the origin.
  const box: AnchorRect = anchor ?? {
    x: window.width / 2,
    y: window.height / 2 - PANEL_GUESS / 2,
    width: 0,
    height: 0,
  };
  const position = open ? place(box, panel, window, side) : null;
  const trigger = isValidElement<PressableProps>(children) ? (
    // `show` and `close` only read the pending timer from inside the press handler, never during render.
    // eslint-disable-next-line react/refs
    withPress(children, { onPress: show, onLongPress: show, accessibilityHint: hint })
  ) : (
    children
  );

  return (
    <View ref={setFrame} collapsable={false}>
      {trigger}
      {position ? (
        <Modal
          transparent
          visible
          animationType="none"
          statusBarTranslucent
          onRequestClose={close}
          supportedOrientations={["portrait", "landscape"]}
        >
          <View style={styles.host}>
            <HoronPressable
              haptic="none"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              onPress={close}
              style={StyleSheet.absoluteFill}
            />
            <Animated.View
              accessible
              accessibilityRole="summary"
              onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                if (width === panel.width && height === panel.height) return;
                setPanel({ width, height });
              }}
              style={[
                styles.bubble,
                {
                  left: position.left,
                  top: position.top,
                  opacity: panel.width > 0 ? progress : 0,
                  transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
                  backgroundColor: theme.color("interactive-primary"),
                },
              ]}
            >
              <HoronText variant="label-sm" tone="interactive-on-primary">
                {label}
              </HoronText>
              <View style={arrowStyle(position.side)} pointerEvents="none">
                <Svg width={ARROW_WIDTH} height={ARROW_HEIGHT} viewBox="0 0 10 6">
                  <Path d="M0.67 1.5h8.66L5 6z" fill={theme.color("interactive-primary")} />
                </Svg>
              </View>
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

/**
 * Shares an open delay across a group of tooltips, react's `TooltipProvider`.
 *
 * A touch device has no hover, so a tap is the intent to see the bubble; this provider carries the
 * delay a bubble waits before it appears and the delay before it closes, for every
 * {@link Tooltip} below it.
 *
 * @example
 * ```tsx
 * <TooltipProvider delay={300} closeDelay={100}>
 *   <Tooltip label="Copy link"><IconButton icon={<Copy />} label="Copy link" /></Tooltip>
 * </TooltipProvider>
 * ```
 */
export function TooltipProvider({
  children,
  delay = DEFAULT_DELAY,
  closeDelay = 0,
}: {
  /** The tooltips that share these timings. */
  children?: ReactNode;
  /** Milliseconds before a bubble opens. @default 600 */
  delay?: number;
  /** Milliseconds before a bubble closes. @default 0 */
  closeDelay?: number;
}) {
  const value = useMemo<TooltipTimings>(() => ({ delay, closeDelay }), [delay, closeDelay]);
  return <TooltipTimingContext.Provider value={value}>{children}</TooltipTimingContext.Provider>;
}

const styles = StyleSheet.create({
  host: { flex: 1 },
  bubble: {
    position: "absolute",
    maxWidth: 256,
    flexDirection: "row",
    paddingHorizontal: spacing["2.5"],
    paddingVertical: spacing["1.5"],
    borderRadius: radius.sm,
    borderCurve: "continuous",
  },
});
