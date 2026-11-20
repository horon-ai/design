import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Animated,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { CheckCircle, Info, WarningCircle, X } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";
import type { ControlSize } from "../lib/size";

/**
 * Toast severity, which picks the leading icon and its colour: `neutral` (info icon, secondary text),
 * `success` (check, brand colour) or `danger` (warning, danger colour). Any other toast type falls back
 * to `neutral`.
 */
export type ToastTone = "neutral" | "success" | "danger";

/** Toast rungs: `sm` 320pt, `md` 360pt and `lg` 400pt wide cards. */
export type ToastSize = ControlSize;

const MAX_WIDTH: Record<ToastSize, number> = { sm: 320, md: 360, lg: 400 };
const PADDING_X: Record<ToastSize, number> = { sm: spacing["3"], md: spacing["4"], lg: spacing["5"] };
const PADDING_Y: Record<ToastSize, number> = { sm: spacing["2.5"], md: spacing["3.5"], lg: spacing["4"] };
const GAP: Record<ToastSize, number> = { sm: spacing["2"], md: spacing["3"], lg: spacing["3.5"] };
const CONTENT_GAP: Record<ToastSize, number> = { sm: 2, md: 2, lg: spacing["1"] };
const ICON: Record<ToastSize, number> = { sm: 16, md: 20, lg: 24 };
const CLOSE_ICON: Record<ToastSize, number> = { sm: 14, md: 16, lg: 20 };
const TITLE: Record<ToastSize, "label-md" | "label-lg"> = { sm: "label-md", md: "label-lg", lg: "label-lg" };
const DESCRIPTION: Record<ToastSize, "body-sm" | "body-md"> = { sm: "body-sm", md: "body-sm", lg: "body-md" };

/**
 * One queued toast. Created by `useToast().add`, rendered by {@link Toaster}; it is internal because
 * react kept the same shape inside Base UI's manager instead of exporting it.
 */
type ToastRecord = {
  /** Stable identity of this toast, returned by `add` and accepted by `close`. */
  id: string;
  /** Bold first line. */
  title?: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Severity; an unknown value paints as `neutral`. */
  type?: string;
};

/** Options accepted by `useToast().add`: the two text lines plus the severity and lifetime. */
type ToastAddOptions = {
  /** Bold first line. */
  title?: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Severity, one of {@link ToastTone} or a string that falls back to `neutral`. */
  type?: string;
  /** Milliseconds before the toast dismisses itself. @default 5000 */
  timeout?: number;
};

/** The manager shape `useToast` returns, mirroring the members components use. */
export type ToastManager = {
  /** Live queue the viewport renders, oldest first. */
  toasts: ToastRecord[];
  /** Queues a toast and returns its id. */
  add: (options: ToastAddOptions) => string;
  /** Dismisses one toast by id. */
  close: (id: string) => void;
};

/** How long a toast stays up when `add` passes no `timeout`, Base UI's provider default. */
const DEFAULT_TIMEOUT = 5000;

/**
 * How many cards the viewport paints at once. Base UI's provider caps the stack at 3 and marks the rest
 * as limited instead of dropping them, so the oldest stay queued but leave the screen.
 */
const MAX_VISIBLE = 3;

/**
 * The toast queue, owned by the module rather than a React context.
 *
 * React's `Toaster` mounted a Base UI provider and `useToast` read it from context. A React Native app
 * mounts its `Toaster` once at the root, but a toast is often raised from a deep handler that would have
 * to thread the provider down; the queue therefore lives here: every `add` mutates this list and notifies
 * the subscribers, so `useToast()` works anywhere in the tree and never throws for a missing provider. A
 * `Toaster` only renders the queue; it does not own or reset it.
 */
let toasts: ToastRecord[] = [];
const listeners = new Set<() => void>();
let nextId = 0;

const emit = () => {
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): ToastRecord[] => toasts;

/** Drops one toast by id; an unknown id is a no-op, like Base UI's `close`. */
const remove = (id: string) => {
  if (!toasts.some((toast) => toast.id === id)) return;
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
};

/** Reads the words a screen reader should announce for one toast. */
const spoken = (toast: ToastRecord): string => {
  const lines: string[] = [];
  if (typeof toast.title === "string" || typeof toast.title === "number") lines.push(String(toast.title));
  if (typeof toast.description === "string" || typeof toast.description === "number")
    lines.push(String(toast.description));
  return lines.join(". ");
};

/**
 * Queues a toast on the module store and schedules its dismissal.
 *
 * The queue is visual only — a toast that appears off-screen is silent to a screen reader — so the two
 * text lines are also announced through `AccessibilityInfo.announceForAccessibility`, which is react's
 * `role="status"` live region on the web.
 */
const addToast = (options: ToastAddOptions): string => {
  nextId += 1;
  const id = `toast-${nextId}`;
  const record: ToastRecord = { id, title: options.title, description: options.description, type: options.type };
  toasts = [...toasts, record];
  emit();
  const text = spoken(record);
  if (text.length > 0) AccessibilityInfo.announceForAccessibility(text);
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;
  if (timeout > 0) setTimeout(() => remove(id), timeout);
  return id;
};

const isTone = (value: string | undefined): value is ToastTone =>
  value === "neutral" || value === "success" || value === "danger";

/** The 6px card radius react draws for every toast, `rounded-lg`. */
const CARD_RADIUS = radius.sm;

/** One toast card: icon, title and description, and the close control. */
function ToastCard({
  toast,
  size,
  surface,
}: {
  /** The queue entry this card paints. */
  toast: ToastRecord;
  /** Card rung shared by every toast in this viewport. */
  size: ToastSize;
  /** `glass` paints the card on the veil; `solid` gives it a surface fill, a border and the popover shadow. */
  surface: "solid" | "glass";
}) {
  const theme = useHoronTheme();
  const [rise] = useState(() => new Animated.Value(0));
  const tone = isTone(toast.type) ? toast.type : "neutral";

  useEffect(() => {
    if (theme.reducedMotion) {
      rise.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(rise, {
      toValue: 1,
      duration: duration.popIn + 20,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [theme.reducedMotion, rise]);

  const iconColor =
    tone === "success"
      ? theme.color("text-brand")
      : tone === "danger"
        ? theme.color("text-danger")
        : theme.color("text-secondary");
  const glyph =
    tone === "success" ? (
      <CheckCircle size={ICON[size]} color={iconColor} />
    ) : tone === "danger" ? (
      <WarningCircle size={ICON[size]} color={iconColor} />
    ) : (
      <Info size={ICON[size]} color={iconColor} />
    );

  const card: Animated.WithAnimatedValue<ViewStyle> = {
    maxWidth: MAX_WIDTH[size],
    gap: GAP[size],
    paddingHorizontal: PADDING_X[size],
    paddingVertical: PADDING_Y[size],
    borderRadius: CARD_RADIUS,
    opacity: rise,
    transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  };

  const body = (
    <>
      <View style={styles.icon}>{glyph}</View>
      <View style={[styles.content, { gap: CONTENT_GAP[size] }]}>
        {toast.title === undefined ? null : (
          <HoronText variant={TITLE[size]}>{toast.title}</HoronText>
        )}
        {toast.description === undefined ? null : (
          <HoronText variant={DESCRIPTION[size]} tone="text-secondary">
            {toast.description}
          </HoronText>
        )}
      </View>
      <HoronPressable
        role="button"
        accessibilityLabel="Close"
        onPress={() => remove(toast.id)}
        haptic="none"
        hitSlop={touchSlop(theme.touch, CLOSE_ICON[size])}
        style={({ pressed }) => [
          styles.close,
          { minHeight: theme.touch ? 44 : undefined, minWidth: theme.touch ? 44 : undefined },
          pressed && { opacity: 0.7 },
        ]}
      >
        <X size={CLOSE_ICON[size]} color={theme.color("text-secondary")} />
      </HoronPressable>
    </>
  );

  const solidFill: ViewStyle = {
    backgroundColor: theme.color("bg-surface"),
    borderWidth: 1,
    borderColor: theme.color("border-default"),
    boxShadow: shadow.popover,
  };

  return (
    <Animated.View style={[styles.stackItem, card]}>
      {surface === "glass" ? null : <View style={[StyleSheet.absoluteFill, styles.radius, solidFill]} />}
      {surface === "glass" ? (
        <GlassSurface
          material="veil"
          radius={CARD_RADIUS}
          style={[StyleSheet.absoluteFill, styles.radius]}
          pointerEvents="none"
        />
      ) : null}
      {body}
    </Animated.View>
  );
}

/** Renders the live toast queue; the newest toast sits at the bottom of the stack, like react's. */
function ToastList({ size, surface }: { size: ToastSize; surface: "solid" | "glass" }) {
  const queue = useSyncExternalStore(subscribe, getSnapshot, getSnapshot).slice(-MAX_VISIBLE);
  return (
    <>
      {queue.map((toast) => (
        <ToastCard key={toast.id} toast={toast} size={size} surface={surface} />
      ))}
    </>
  );
}

/** Props of {@link Toaster}: the app subtree it wraps plus the size and surface every toast shares. */
export type ToasterProps = {
  /** The app subtree; the toast viewport paints over it. */
  children?: ReactNode;
  /** Toast size: `sm` 320pt, `md` 360pt (default), `lg` 400pt; applies to every toast this viewport shows. @default "md" */
  size?: ToastSize;
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` puts it on the veil.
   * Applies to every toast this viewport shows. @default "solid"
   */
  surface?: "solid" | "glass";
  /** Layout of the viewport, merged after its own. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma `Toast` (62:307): a 360pt card, solid or the veil. Wrap the app once; call
 * `useToast().add({ title, description, type: "success" })` to show one.
 *
 * React portals toasts to a fixed bottom-right viewport that stacks upward. A React Native app has one
 * window, so the viewport is a bottom-docked `View` painted after the children, padded by the safe-area
 * bottom inset so the stack clears the home indicator. Each card rises 16pt into place and its two lines
 * are announced through `AccessibilityInfo`; the close control drops it from the queue, and the timeout
 * `add` sets drops it too.
 *
 * @example
 * ```tsx
 * <Toaster size="md" surface="solid">
 *   <SaveButton />
 * </Toaster>
 *
 * function SaveButton() {
 *   const toast = useToast();
 *   return (
 *     <Button onPress={() => toast.add({ title: "Saved", description: "All changes stored.", type: "success" })}>
 *       Save
 *     </Button>
 *   );
 * }
 * ```
 */
export function Toaster({ children, size = "md", surface = "solid", style }: ToasterProps) {
  const insets = useInsets();
  return (
    <View style={styles.root}>
      {children}
      <View
        pointerEvents="box-none"
        style={[
          styles.viewport,
          { paddingBottom: insets.bottom + spacing["6"], paddingHorizontal: spacing["6"] },
          style,
        ]}
      >
        <ToastList size={size} surface={surface} />
      </View>
    </View>
  );
}

/**
 * The toast manager: `add({ title, description, type })` queues a toast and returns its id, `close(id)`
 * dismisses one, and `toasts` is the live list the viewport renders. It reads the module queue, so it
 * works anywhere in the tree.
 */
export const useToast = (): ToastManager => {
  const toastsList = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const add = useCallback((options: ToastAddOptions) => addToast(options), []);
  const close = useCallback((id: string) => remove(id), []);
  return { toasts: toastsList, add, close };
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  viewport: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "flex-end",
    gap: spacing["3"],
  },
  stackItem: { width: "100%", flexDirection: "row", alignItems: "flex-start" },
  radius: { borderRadius: CARD_RADIUS, borderCurve: "continuous" },
  card: { flexDirection: "row", alignItems: "flex-start", width: "100%" },
  icon: { flexShrink: 0, alignItems: "flex-start" },
  content: { flex: 1, minWidth: 0, flexDirection: "column" },
  close: { flexShrink: 0, alignItems: "center", justifyContent: "center" },
});
