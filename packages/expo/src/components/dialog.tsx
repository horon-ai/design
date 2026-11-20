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
import { HoronPressable } from "../lib/press";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/** The open state {@link Dialog} publishes to the parts below it. */
type DialogSet = {
  /** Whether the surface is mounted. */
  open: boolean;
  /** Asks the root to show or hide the surface; a controlled root reports it instead of moving. */
  setOpen: (next: boolean) => void;
};

const DialogContext = createContext<DialogSet>({ open: false, setOpen: () => undefined });

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

/** Props of {@link Dialog}: the controlled or uncontrolled open state plus the parts it wraps. */
type DialogProps = {
  /** Controlled state. While set the root reports changes through `onOpenChange` and keeps no state of its own. */
  open?: boolean;
  /** State at first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called with the requested state on every trigger, close control or scrim press. */
  onOpenChange?: (open: boolean) => void;
  /** Accepted for call-site parity with Base UI's modal dialogs; a React Native `Modal` is always modal. */
  modal?: boolean;
  /** The trigger and content that make up the dialog. */
  children?: ReactNode;
};

/**
 * State holder for a dialog: give it `open` / `onOpenChange` to control it, or neither plus a
 * `defaultOpen` to leave it uncontrolled. It renders nothing itself; the parts below supply the surface.
 *
 * Base UI's `Dialog.Root` on the web; React Native has no equivalent primitive, so the root owns the
 * state itself and publishes it through a context. A controlled root never moves its own state — it only
 * reports through `onOpenChange`, exactly like react's root.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogTrigger render={<Button />}>Rename bot</DialogTrigger>
 *   <DialogContent
 *     title="Rename bot"
 *     description="The new name shows up everywhere the bot is mentioned."
 *   >
 *     <DialogFooter>
 *       <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export function Dialog({ open: openProp, defaultOpen = false, onOpenChange, modal: _modal, children }: DialogProps) {
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

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

/** Props shared by {@link DialogTrigger} and {@link DialogClose}. */
type DialogPressProps = {
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

/** Clones a caller's element with the press handler, or wraps the children in a pressable view. */
function DialogPress({ render, children, style, accessibilityLabel, onPress }: DialogPressProps & { onPress: () => void }) {
  if (isValidElement<PressableProps>(render))
    return withPress(render, { onPress, accessibilityLabel }, children);
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
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
 * The control that opens the dialog. React made the caller's element the trigger through Base UI's
 * `render`; React Native clones that element with the press handler, so the surface stays the caller's.
 */
export function DialogTrigger({ render, children, style, accessibilityLabel }: DialogPressProps) {
  const { setOpen } = useContext(DialogContext);
  return (
    <DialogPress
      render={render}
      style={style}
      accessibilityLabel={accessibilityLabel}
      onPress={() => setOpen(true)}
    >
      {children}
    </DialogPress>
  );
}

/**
 * The control that closes the dialog: it sets the dialog's open state to false, so a controlled dialog
 * also sees `onOpenChange`.
 */
export function DialogClose({ render, children, style, accessibilityLabel }: DialogPressProps) {
  const { setOpen } = useContext(DialogContext);
  return (
    <DialogPress
      render={render}
      style={style}
      accessibilityLabel={accessibilityLabel}
      onPress={() => setOpen(false)}
    >
      {children}
    </DialogPress>
  );
}

/** Props for {@link DialogContent}: the heading, description and surface choices. */
export type DialogContentProps = {
  /** Heading rendered as the popup's `title-md` title, which also names the dialog for assistive tech. */
  title: ReactNode;
  /** Optional `body-md` secondary paragraph under the title. */
  description?: ReactNode;
  /** Label for the close button; hides it when `null`. @default "Close" */
  closeLabel?: string | null;
  /** Identifies the close control, for an app that finds that control by id (`data-slot` on the web). */
  closeSlot?: string;
  /** Tile or icon set before the title (Paper settings modals). */
  leading?: ReactNode;
  /**
   * `glass` places the panel on the veil. `solid` is the Paper workspace dialog: the opaque surface
   * fill, 20pt corners and the palette shadow, with no glass layer.
   * @default "solid"
   */
  surface?: "glass" | "solid";
  /** Layout of the panel, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The body under the description. */
  children?: ReactNode;
};

/**
 * Figma `Dialog on scrim` (63:329): the scrim ink at 32% alpha and a 420pt panel, 24pt padding, a
 * `title-md` heading with a 32pt close target and a `body-md` description.
 *
 * Part of {@link Dialog}. React portals it to the body over a blurred scrim and centres it in a fixed
 * viewport with 16pt gutters; here an RN `Modal` (transparent) holds the scrim and the centred panel, so
 * it paints above the app and the Android back button closes it through `onRequestClose`. The scrim keeps
 * react's 32% ink alpha as its own fill view so it does not dim the panel, and presses on it close the
 * dialog, like Base UI's outside press. The panel caps at the window height minus 32pt and scrolls its own
 * content; the close control and the scrim are the two ways out, plus whatever the caller wires to `open`.
 */
export function DialogContent({
  title,
  description,
  closeLabel = "Close",
  closeSlot,
  leading,
  surface = "solid",
  style,
  children,
}: DialogContentProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const { open, setOpen } = useContext(DialogContext);
  const progress = usePopIn(open);
  const close = useCallback(() => setOpen(false), [setOpen]);

  if (!open) return null;

  const glass = surface === "glass";
  const panelStyle: StyleProp<ViewStyle> = [
    styles.panel,
    !glass && { backgroundColor: theme.color("bg-surface"), boxShadow: shadow.palette },
    style,
  ];
  const body = (
    <>
      <View style={[styles.header, { gap: leading ? spacing["3.5"] : spacing["2"] }]}>
        {leading}
        <HoronText variant="title-md" role="heading" style={styles.flex}>
          {title}
        </HoronText>
        {closeLabel === null ? null : (
          <HoronPressable
            role="button"
            accessibilityLabel={closeLabel}
            nativeID={closeSlot}
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
      {description ? (
        <HoronText variant="body-md" tone="text-secondary">
          {description}
        </HoronText>
      ) : null}
      {children}
    </>
  );

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
            panelStyle,
            {
              opacity: progress,
              transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
            },
          ]}
        >
          {glass ? (
            <GlassSurface material="veil" radius={radius.xl} style={styles.glassPanel}>
              <ScrollView
                contentContainerStyle={styles.body}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {body}
              </ScrollView>
            </GlassSurface>
          ) : (
            <ScrollView
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {body}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

/**
 * The action row: secondary first, the primary action at the right edge, 8pt apart. `width: "100%"`
 * is what right-aligns it — the panel stacks children at their content width.
 *
 * Part of {@link Dialog}. Renders a plain view, so it can also close a `BottomSheet` body with the same rhythm.
 */
export function DialogFooter({
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
    maxWidth: 420,
    maxHeight: "100%",
    borderRadius: radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  glassPanel: { width: "100%" },
  body: { padding: spacing["6"], gap: spacing["4"], alignItems: "stretch" },
  header: { flexDirection: "row", alignItems: "flex-start", width: "100%" },
  flex: { flex: 1, minWidth: 0 },
  close: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    marginTop: -spacing["1"],
    marginRight: -spacing["2"],
  },
  footer: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: spacing["2"], width: "100%" },
});
