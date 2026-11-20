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
  Modal as RNModal,
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

import { X } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/** The open state {@link Modal} publishes to the parts below it. */
type ModalSet = {
  /** Whether the surface is mounted. */
  open: boolean;
  /** Asks the root to show or hide the surface; a controlled root reports it instead of moving. */
  setOpen: (next: boolean) => void;
};

const ModalContext = createContext<ModalSet>({ open: false, setOpen: () => undefined });

/** The entrance `motion-popup` plays on the web: fade in while growing from 95% to full size. */
function usePopIn(visible: boolean) {
  const theme = useHoronTheme();
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      progress.setValue(0);
      return undefined;
    }
    if (theme.reducedMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.spring,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [visible, theme.reducedMotion, progress]);

  return progress;
}

/** Props of {@link Modal}: the controlled or uncontrolled open state plus the parts it wraps. */
type ModalProps = {
  /** Controlled state. While set the root reports changes through `onOpenChange` and keeps no state of its own. */
  open?: boolean;
  /** State at first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called with the requested state on every trigger, close control or scrim press. */
  onOpenChange?: (open: boolean) => void;
  /** Accepted for call-site parity with Base UI's modal dialogs; a React Native `Modal` is always modal. */
  modal?: boolean;
  /** The trigger and content that make up the modal. */
  children?: ReactNode;
};

/**
 * Root of a modal; owns open state. Base UI's `Dialog.Root` on the web; React Native has no dialog
 * primitive, so the root keeps the state and publishes it to the parts through a context.
 *
 * @example
 * ```tsx
 * <Modal>
 *   <ModalTrigger render={<Button variant="solid" />}>Rename workspace</ModalTrigger>
 *   <ModalContent title="Rename workspace" footer={<ModalFooter>…</ModalFooter>}>
 *     <Input aria-label="Workspace name" defaultValue="Horon" />
 *   </ModalContent>
 * </Modal>
 * ```
 */
export function Modal({ open: openProp, defaultOpen = false, onOpenChange, modal: _modal, children }: ModalProps) {
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

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

/**
 * The element that opens the modal. React made the caller's element the trigger through Base UI's
 * `render`; React Native clones that element with the press handler instead of adding a wrapper node.
 */
export function ModalTrigger({
  render,
  children,
  style,
  accessibilityLabel,
}: {
  /**
   * An element to carry the press behaviour, react's `render` prop. It is cloned with an `onPress`
   * handler so the surface stays the caller's.
   */
  render?: ReactElement;
  /** Content of the built-in pressable surface, used when `render` is absent. */
  children?: ReactNode;
  /** Layout of the built-in pressable surface. */
  style?: StyleProp<ViewStyle>;
  /** Accessible name of the built-in pressable surface, when its content names nothing. */
  accessibilityLabel?: string;
}) {
  const { setOpen } = useContext(ModalContext);
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

/**
 * A control that closes the modal when pressed. Any button-like element can be its child; a controlled
 * modal also sees `onOpenChange(false)`.
 */
export function ModalClose({
  render,
  children,
  style,
  accessibilityLabel,
}: {
  /** An element to carry the press behaviour, react's `render` prop. */
  render?: ReactElement;
  /** Content of the built-in pressable surface, used when `render` is absent. */
  children?: ReactNode;
  /** Layout of the built-in pressable surface. */
  style?: StyleProp<ViewStyle>;
  /** Accessible name of the built-in pressable surface, when its content names nothing. */
  accessibilityLabel?: string;
}) {
  const { setOpen } = useContext(ModalContext);
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

/**
 * Width step of the modal popup.
 *
 * - `sm` — 400pt, for a short form.
 * - `md` — 560pt, the default reading width.
 * - `lg` — 720pt, for a wide editor or table.
 */
export type ModalSize = "sm" | "md" | "lg";

/**
 * Surface of the modal popup.
 *
 * - `solid` — the opaque page fill with a soft drop shadow.
 * - `glass` — the veil material, for a modal that floats over content.
 */
export type ModalSurface = "solid" | "glass";

const WIDTH: Record<ModalSize, number> = { sm: 400, md: 560, lg: 720 };

/** Props for {@link ModalContent}: title and description, the size and surface, and an optional footer. */
export type ModalContentProps = {
  /** Modal heading, rendered as the popup's title, which also names the dialog for assistive tech. */
  title: ReactNode;
  /** Supporting line under the title. */
  description?: ReactNode;
  /** Width: `sm` 400pt, `md` 560pt (default), `lg` 720pt. Never wider than the window minus 32pt.
   * @default "md" */
  size?: ModalSize;
  /** `solid` (default) is the opaque page fill with a soft drop shadow; `glass` is the veil.
   * @default "solid" */
  surface?: ModalSurface;
  /** Tile or icon before the title. */
  leading?: ReactNode;
  /** Label for the close button; hides it when `null`.
   * @default "Close" */
  closeLabel?: string | null;
  /** {@link ModalFooter}, kept below the scrolling body. */
  footer?: ReactNode;
  /** Layout of the popup, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The body under the header. */
  children?: ReactNode;
};

/**
 * A modal for work that needs a form or a longer read, where `Dialog` is a short confirmation. It has
 * three fixed parts: a header (title, description and close), a body that scrolls on its own once the
 * modal reaches the window height, and a footer whose actions sit at the right. 24pt padding, 20pt
 * corners, 32% scrim.
 *
 * React portals it to the body and lets Base UI trap focus, close on Escape and restore focus to the
 * trigger. Here an RN `Modal` (transparent) carries the scrim and the centred popup, the Android back
 * button closes it through `onRequestClose`, a scrim press closes it like an outside click, and the
 * panel pads itself by the safe-area insets of a full-screen surface. Only the body scrolls: the header
 * and footer stay put.
 */
export function ModalContent({
  title,
  description,
  size = "md",
  surface = "solid",
  leading,
  closeLabel = "Close",
  footer,
  style,
  children,
}: ModalContentProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const { open, setOpen } = useContext(ModalContext);
  const progress = usePopIn(open);
  const close = useCallback(() => setOpen(false), [setOpen]);

  if (!open) return null;

  const glass = surface === "glass";
  const content = (
    <>
      <View style={[styles.header, { gap: leading ? spacing["3.5"] : spacing["2"] }]}>
        {leading}
        <View style={styles.headerText}>
          <HoronText variant="title-md" role="heading">
            {title}
          </HoronText>
          {description ? (
            <HoronText variant="body-md" tone="text-secondary">
              {description}
            </HoronText>
          ) : null}
        </View>
        {closeLabel === null ? null : (
          <HoronPressable
            role="button"
            accessibilityLabel={closeLabel}
            onPress={close}
            pressScale
            hitSlop={touchSlop(theme.touch, 32)}
            style={({ pressed }) => [
              styles.close,
              { minHeight: theme.touch ? TOUCH_TARGET : undefined, minWidth: theme.touch ? TOUCH_TARGET : undefined },
              pressed && { backgroundColor: theme.color("overlay-ink-6") },
            ]}
          >
            <X size={16} color={theme.color("text-secondary")} />
          </HoronPressable>
        )}
      </View>
      <ScrollView
        style={styles.bodyScroll}
        contentContainerStyle={[styles.body, { paddingBottom: footer ? spacing["2"] : spacing["6"] }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {footer}
    </>
  );

  return (
    <RNModal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      onRequestClose={close}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={[styles.host, { paddingTop: insets.top + spacing["4"], paddingBottom: insets.bottom + spacing["4"] }]}
        accessibilityViewIsModal
      >
        <HoronPressable
          haptic="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={close}
          style={[styles.scrim, { backgroundColor: theme.color("bg-scrim") }]}
        />
        <Animated.View
          style={[
            styles.panel,
            { maxWidth: WIDTH[size] },
            !glass && { backgroundColor: theme.color("bg-surface"), boxShadow: shadow.palette },
            { opacity: progress },
            { transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] },
            style,
          ]}
        >
          {glass ? (
            <GlassSurface material="veil" radius={radius.xl} style={styles.glassClip}>
              {content}
            </GlassSurface>
          ) : (
            content
          )}
        </Animated.View>
      </View>
    </RNModal>
  );
}

/** The modal's action row: actions at the right, secondary first and primary last, 8pt apart, 24pt padding. */
export function ModalFooter({
  style,
  children,
  ...props
}: {
  /** Layout of the row, merged after the alignment and gap. */
  style?: StyleProp<ViewStyle>;
  /** The actions, secondary first and the primary last. */
  children?: ReactNode;
}) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing["4"] },
  scrim: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.32 },
  panel: {
    width: "100%",
    maxHeight: "100%",
    flexDirection: "column",
    borderRadius: radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  glassClip: { flexDirection: "column", flexShrink: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing["6"],
    paddingTop: spacing["6"],
    paddingBottom: spacing["4"],
    flexShrink: 0,
  },
  headerText: { flex: 1, minWidth: 0, gap: spacing["1"] },
  close: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    marginTop: -spacing["1"],
    marginRight: -spacing["2"],
  },
  bodyScroll: { flexShrink: 1 },
  body: { paddingHorizontal: spacing["6"], gap: spacing["4"] },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing["2"],
    paddingHorizontal: spacing["6"],
    paddingTop: spacing["4"],
    paddingBottom: spacing["6"],
    flexShrink: 0,
  },
});
