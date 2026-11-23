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

import { IconContext } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useIconContext } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";

/** The mounted node a `View` ref points at, which is what `measureInWindow` is called on. */
type ViewInstance = HostInstance;

/** A view's box on the screen, as `measureInWindow` reports it. All values are points. */
type AnchorRect = { x: number; y: number; width: number; height: number };

/** What {@link Menu} publishes: the open state and the trigger box the popup is anchored to. */
type MenuSet = {
  /** Whether the popup is mounted. */
  open: boolean;
  /** Asks the root to show or hide the popup; a controlled root reports it instead of moving. */
  setOpen: (next: boolean) => void;
  /** The trigger's measured box, captured when the popup opens. */
  anchor: AnchorRect | null;
  /** Records the trigger's box; the trigger calls it from `measureInWindow`. */
  setAnchor: (rect: AnchorRect) => void;
};

const MenuContext = createContext<MenuSet>({
  open: false,
  setOpen: () => undefined,
  anchor: null,
  setAnchor: () => undefined,
});

const SurfaceContext = createContext<MenuSurface>("glass");

/** Props of {@link Menu}: the controlled or uncontrolled open state plus the parts it wraps. */
type MenuProps = {
  /** Controlled state. While set the root reports changes through `onOpenChange` and keeps no state of its own. */
  open?: boolean;
  /** State at first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called with the requested state on every trigger, item or scrim press. */
  onOpenChange?: (open: boolean) => void;
  /** Accepted for call-site parity with Base UI's `Menu.Root`; a React Native `Modal` is always modal. */
  modal?: boolean;
  /** The trigger and the popup. */
  children?: ReactNode;
};

/**
 * Visual treatment of the popup.
 *
 * - `glass` — the Figma `Menu` on the veil: 20pt corners, 40pt rows, 220pt wide.
 * - `solid` — the Account / Workspace menu that opens over glass chrome: opaque fill, 18pt corners,
 *   the popover shadow, 36pt rows, 256pt wide.
 * - `paper` — the Paper workspace switcher: default fill, a 1pt default border, 14pt corners, a soft
 *   shadow, 304pt wide, 36pt rows.
 */
export type MenuSurface = "glass" | "solid" | "paper";

/**
 * Radius, border, fill and shadow of the popup per {@link MenuSurface}, as the class names the web
 * build reads. React Native has no class names, so this record is kept for call-site parity and the
 * component reads the same decisions from {@link SURFACE}.
 */
export const menuPopupClass = {
  glass: "rounded-xl veil-overlay",
  solid: "rounded-xl bg-glass-fill-solid shadow-popover",
  paper: "rounded-lg border border-border-default bg-bg-default shadow-[0_12px_32px_#0A142424]",
} as const;

/** The popup geometry {@link MenuContent} draws per surface: width, corner radius and row inset. */
const SURFACE: Record<MenuSurface, { width: number; corner: number; rowInset: number }> = {
  glass: { width: 220, corner: radius.xl, rowInset: spacing["3"] },
  solid: { width: 256, corner: 18, rowInset: spacing["2.5"] },
  paper: { width: 304, corner: radius.lg, rowInset: spacing["2.5"] },
};

/**
 * Root of a menu; owns open state and the trigger box the popup is anchored to.
 *
 * Base UI's `Menu.Root` on the web, where a portal plus a positioner place the popup. React Native has
 * neither, so the root keeps the state and publishes it, and {@link MenuContent} places itself from the
 * trigger's `measureInWindow` box. A controlled root never moves its own state.
 *
 * @example
 * ```tsx
 * <Menu>
 *   <MenuTrigger render={<Button variant="solid" />}>Account</MenuTrigger>
 *   <MenuContent align="end">
 *     <MenuLabel>Workspaces</MenuLabel>
 *     <MenuItem icon={<GearSix />} trailing="⌘," onClick={openSettings}>
 *       Settings
 *     </MenuItem>
 *   </MenuContent>
 * </Menu>
 * ```
 */
export function Menu({ open: openProp, defaultOpen = false, onOpenChange, modal: _modal, children }: MenuProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const value = useMemo(() => ({ open, setOpen, anchor, setAnchor }), [open, setOpen, anchor]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/** Props of {@link MenuTrigger}. */
type MenuTriggerProps = {
  /**
   * An element to carry the press behaviour, react's `render` prop. React Native cannot swap elements,
   * so the element is cloned with an `onPress` handler inside a measuring wrapper.
   */
  render?: ReactElement;
  /** Content of the built-in pressable surface, used when `render` is absent. */
  children?: ReactNode;
  /** Blocks the trigger; the menu cannot be opened. */
  disabled?: boolean;
  /** Accessible name of the trigger, replacing the one its content would give it. */
  accessibilityLabel?: string;
  /** Accessible name of the trigger, `aria-label` spelling for parity with react. */
  "aria-label"?: string;
  /** Layout of the trigger wrapper. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The element that opens the menu.
 *
 * Base UI gives its trigger the expanded state and the popup link. React Native has no portal, so the
 * trigger is a measuring wrapper that captures the box {@link MenuContent} anchors to, and the press
 * goes to the caller's element through `render` (cloned with `onPress`) or to a bare pressable view. It
 * announces itself as a `button` with `expanded` following the menu.
 */
export function MenuTrigger({
  render,
  children,
  disabled,
  accessibilityLabel,
  "aria-label": ariaLabel,
  style,
}: MenuTriggerProps) {
  const { open, setOpen, setAnchor } = useContext(MenuContext);
  const [frame, setFrame] = useState<ViewInstance | null>(null);
  const name = accessibilityLabel ?? ariaLabel;

  // The menu opens on the press itself; the measured box only decides where the popup paints, so a
  // host that cannot measure (a test renderer, a headless tree) still gets a working menu.
  const toggle = () => {
    setOpen(!open);
    frame?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));
  };

  const press = { onPress: toggle, accessibilityLabel: name, accessibilityState: { disabled: !!disabled, expanded: open } };
  return (
    <View ref={setFrame} style={[disabled && { opacity: DISABLED_OPACITY }, style]} collapsable={false} accessible={false}>
      {isValidElement<PressableProps>(render) ? (
        withPress(render, press, children)
      ) : (
        <HoronPressable role="button" disabled={disabled} pressScale style={styles.trigger} {...press}>
          {typeof children === "string" || typeof children === "number" ? (
            <HoronText variant="label-lg">{children}</HoronText>
          ) : (
            children
          )}
        </HoronPressable>
      )}
    </View>
  );
}

/** The placement vocabulary of the popup, the same words Base UI's positioner takes. */
type MenuSide = "top" | "bottom" | "left" | "right" | "inline-start" | "inline-end";
type MenuAlign = "start" | "center" | "end";

/** Props for {@link MenuContent}: the surface variant and the placement offsets. */
export type MenuContentProps = {
  /**
   * `glass` is the Figma `Menu` on the veil (20pt corners, 40pt rows).
   * `solid` is the Account / Workspace menu over glass chrome (opaque fill, 18pt corners, 36pt rows).
   * `paper` is the Paper workspace switcher (default fill, 1pt border, 14pt corners, 304pt wide).
   * @default "solid"
   */
  surface?: MenuSurface;
  /** Preferred side of the anchor the popup opens on; flips when the popup does not fit. */
  side?: MenuSide;
  /** Alignment of the popup against the anchor.
   * @default "start" */
  align?: MenuAlign;
  /** Gap in points between the anchor and the popup.
   * @default 8 */
  sideOffset?: number;
  /** Offset in points along the alignment axis. */
  alignOffset?: number;
  /** Layout of the popup, merged after its placement. */
  style?: StyleProp<ViewStyle>;
  /** Native id of the popup, so a host can address it (`id` on the web). */
  id?: string;
  /** The rows of the menu, usually {@link MenuItem} parts. */
  children?: ReactNode;
};

/** The physical side a requested `side` resolves to; the inline pair maps to left and right (LTR). */
function physicalSide(side: MenuSide | undefined): "top" | "bottom" | "left" | "right" {
  if (side === "top" || side === "left" || side === "right") return side;
  if (side === "inline-start") return "left";
  if (side === "inline-end") return "right";
  return "bottom";
}

/**
 * The popup's box on the screen, from the trigger's measured box.
 *
 * Base UI's positioner runs floating-ui; React Native has none, so the four sides are resolved here:
 * the requested side is used when the popup fits, flipped to the opposite side when it does not, and
 * the result is clamped inside the window so a 304pt `paper` menu still fits a narrow screen.
 */
function place(
  anchor: AnchorRect,
  panel: { width: number; height: number },
  window: { width: number; height: number },
  side: MenuSide | undefined,
  align: MenuAlign,
  sideOffset: number,
  alignOffset = 0,
): { left: number; top: number } {
  const requested = physicalSide(side);
  const fits: Record<"top" | "bottom" | "left" | "right", boolean> = {
    bottom: anchor.y + anchor.height + sideOffset + panel.height <= window.height,
    top: anchor.y - sideOffset - panel.height >= 0,
    right: anchor.x + anchor.width + sideOffset + panel.width <= window.width,
    left: anchor.x - sideOffset - panel.width >= 0,
  };
  const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
  const resolved = !fits[requested] && fits[opposite[requested]] ? opposite[requested] : requested;

  if (resolved === "top" || resolved === "bottom") {
    const top =
      resolved === "bottom" ? anchor.y + anchor.height + sideOffset : anchor.y - sideOffset - panel.height;
    const aligned =
      align === "center"
        ? anchor.x + anchor.width / 2 - panel.width / 2
        : align === "end"
          ? anchor.x + anchor.width - panel.width
          : anchor.x;
    return {
      top,
      left: Math.min(Math.max(spacing["4"], aligned + alignOffset), Math.max(spacing["4"], window.width - panel.width - spacing["4"])),
    };
  }
  const left = resolved === "right" ? anchor.x + anchor.width + sideOffset : anchor.x - sideOffset - panel.width;
  const aligned =
    align === "center"
      ? anchor.y + anchor.height / 2 - panel.height / 2
      : align === "end"
        ? anchor.y + anchor.height - panel.height
        : anchor.y;
  return {
    left,
    top: Math.min(Math.max(0, aligned + alignOffset), Math.max(0, window.height - panel.height)),
  };
}

/**
 * Figma `Menus and popovers` (88:495): `Menu`, `Account menu` and `Workspace menu`.
 *
 * React portals the popup to the body and lets Base UI position and dismiss it. Here a transparent
 * `Modal` holds a full-screen dismiss layer and the popup, placed from the trigger's `measureInWindow`
 * box: the popup still escapes an `overflow: hidden` ancestor, the Android back button closes it through
 * `onRequestClose`, and a press on the layer behind it dismisses it like an outside click. A press inside
 * the popup is swallowed so it never reaches that layer. The popup caps at the window minus 32pt.
 */
export function MenuContent({
  surface = "solid",
  side,
  align = "start",
  sideOffset = 8,
  alignOffset,
  style,
  id,
  children,
}: MenuContentProps) {
  const theme = useHoronTheme();
  const window = useWindowDimensions();
  const { open, setOpen, anchor } = useContext(MenuContext);
  const [panel, setPanel] = useState({ width: 0, height: 0 });
  const [progress] = useState(() => new Animated.Value(0));
  const close = useCallback(() => setOpen(false), [setOpen]);

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
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [open, theme.reducedMotion, progress]);

  if (!open) return null;

  const geometry = SURFACE[surface];
  const measured = panel.width > 0 && panel.height > 0;
  // Without a measured trigger (a host that cannot answer `measureInWindow`) the popup centres in the
  // window instead of painting at the origin.
  const box: AnchorRect = anchor ?? {
    x: window.width / 2 - geometry.width / 2,
    y: window.height / 2,
    width: geometry.width,
    height: 0,
  };
  const position = place(box, panel, window, side, align, sideOffset, alignOffset);

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
          onPress={close}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          nativeID={id}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            if (width === panel.width && height === panel.height) return;
            setPanel({ width, height });
          }}
          style={[
            styles.popup,
            {
              left: position.left,
              top: position.top,
              width: geometry.width,
              maxWidth: window.width - spacing["8"],
              borderRadius: geometry.corner,
              opacity: measured ? progress : 0,
              transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
            },
            surface === "solid" && {
              backgroundColor: theme.color("glass-fill-solid"),
              boxShadow: shadow.popover,
            },
            surface === "paper" && {
              backgroundColor: theme.color("bg-default"),
              borderWidth: 1,
              borderColor: theme.color("border-default"),
              boxShadow: `0 12px 32px 0 ${theme.color("overlay-ink-14")}`,
            },
            style,
          ]}
        >
          {surface === "glass" ? (
            <GlassSurface material="veil" radius={geometry.corner} style={StyleSheet.absoluteFill} pointerEvents="none" />
          ) : null}
          <SurfaceContext.Provider value={surface}>
            <View style={styles.rows}>{children}</View>
          </SurfaceContext.Provider>
        </Animated.View>
      </View>
    </Modal>
  );
}

/** Props for {@link MenuItem}: optional leading icon, description line and trailing hint. */
export type MenuItemProps = {
  /** 18pt leading icon, or a 28pt workspace tile. */
  icon?: ReactNode;
  /** Caption under the label, such as "3 members". Grows the row to 48pt. */
  description?: ReactNode;
  /** Right side: a shortcut such as "⌘C", or a check. */
  trailing?: ReactNode;
  /** Paints the label and icon in the danger colour; pair it with `onClick` or `disabled` for a destructive command. */
  danger?: boolean;
  /** Current choice drawn on the brand tint (Paper workspace switcher). */
  selected?: boolean;
  /** Blocks the row and paints it faint; a press does nothing. @default false */
  disabled?: boolean;
  /** Whether a press closes the menu in addition to calling `onClick`. @default true */
  closeOnClick?: boolean;
  /** Called when the row is pressed, before the menu closes. */
  onClick?: () => void;
  /** Accessible name of the row, replacing the one the label would give it. */
  label?: string;
  /** Layout of the row, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** Native id of the row, so a host can address it (`id` on the web). */
  id?: string;
  /** The row label. */
  children?: ReactNode;
};

/**
 * One row of a {@link MenuContent}: icon, label, optional description and trailing hint.
 *
 * It is Base UI's `Menu.Item` on the web, so a press closes the menu, `disabled` blocks it and the arrow
 * keys highlight it. A phone has no arrow keys, so the row announces itself as a `button` with the
 * disabled state, paints the pressed fill react draws on hover, and closes the menu on press unless
 * `closeOnClick` is false.
 */
export function MenuItem({
  icon,
  description,
  trailing,
  danger,
  selected,
  disabled = false,
  closeOnClick = true,
  onClick,
  label,
  style,
  id,
  children,
}: MenuItemProps) {
  const theme = useHoronTheme();
  const surface = useContext(SurfaceContext);
  const { setOpen } = useContext(MenuContext);
  const labelTone = danger ? "text-danger" : "text-primary";
  const iconTone = danger ? "text-danger" : surface === "glass" ? "text-secondary" : "text-primary";
  const iconContext = useIconContext({ color: theme.color(iconTone) });

  return (
    <HoronPressable
      role="button"
      nativeID={id}
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        if (closeOnClick) setOpen(false);
        onClick?.();
      }}
      style={({ pressed }) => [
        styles.item,
        {
          paddingHorizontal: SURFACE[surface].rowInset,
          minHeight: description ? 48 : 44,
          backgroundColor: selected
            ? theme.color("bg-brand")
            : pressed
              ? theme.color("overlay-ink-6")
              : undefined,
        },
        disabled && { opacity: DISABLED_OPACITY },
        style,
      ]}
    >
      {icon === undefined ? null : (
        <View style={styles.itemIcon}>
          <IconContext.Provider value={iconContext}>{icon}</IconContext.Provider>
        </View>
      )}
      <View style={styles.itemText}>
        <HoronText variant="label-md" tone={labelTone} numberOfLines={1}>
          {children}
        </HoronText>
        {description ? (
          <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
            {description}
          </HoronText>
        ) : null}
      </View>
      {trailing ? <View style={styles.itemTrailing}>{trailing}</View> : null}
    </HoronPressable>
  );
}

/**
 * A rule between groups of items, drawn full width inside the popup's own inset. Its wrapper adds
 * 12pt on glass and 16pt on solid and paper, so on those the line lines up with the row padding.
 *
 * Part of {@link MenuContent}. It renders as Base UI's `Menu.Separator` on the web, so it is hidden from
 * assistive technology and, with `vertical`, splits two groups that sit side by side.
 */
export function MenuSeparator({
  orientation = "horizontal",
  style,
  ...props
}: {
  /**
   * `horizontal` separates stacked rows with a 1pt line across the popup; `vertical` draws a 16pt
   * column rule instead, for splitting two groups that sit side by side.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /** Layout of the rule's wrapper. */
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useHoronTheme();
  const surface = useContext(SurfaceContext);
  const vertical = orientation === "vertical";
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { paddingHorizontal: surface === "glass" ? spacing["1.5"] : spacing["2.5"] },
        vertical ? styles.ruleVertical : styles.ruleHorizontal,
        style,
      ]}
      {...props}
    >
      <View
        style={[
          vertical ? styles.ruleVerticalLine : styles.ruleHorizontalLine,
          { backgroundColor: theme.color("overlay-ink-8") },
        ]}
      />
    </View>
  );
}

/** A caption heading for a group of items, such as "Workspaces" or the account email. */
export function MenuLabel({
  style,
  children,
  ...props
}: {
  /** Layout of the caption. */
  style?: StyleProp<ViewStyle>;
  /** The caption text, such as "Workspaces". */
  children?: ReactNode;
}) {
  return (
    <View style={[styles.label, style]} {...props}>
      <HoronText variant="caption" tone="text-secondary">
        {children}
      </HoronText>
    </View>
  );
}

/** A 28pt rounded tile for a workspace initial, used as a `MenuItem` icon. */
export function MenuTile({
  style,
  children,
  ...props
}: {
  /** Layout of the tile. */
  style?: StyleProp<ViewStyle>;
  /** The workspace initial. */
  children?: ReactNode;
}) {
  const theme = useHoronTheme();
  return (
    <View style={[styles.tile, { backgroundColor: theme.color("interactive-primary") }, style]} {...props}>
      <HoronText variant="label-sm" tone="interactive-on-primary">
        {children}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1 },
  trigger: { flexDirection: "row", alignItems: "center" },
  popup: {
    position: "absolute",
    overflow: "hidden",
    borderCurve: "continuous",
    padding: spacing["1.5"],
  },
  rows: { gap: 2, flexDirection: "column" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2.5"],
    borderRadius: radius.sm,
    width: "100%",
  },
  itemIcon: { flexShrink: 0 },
  itemText: { flex: 1, minWidth: 0 },
  itemTrailing: { flexShrink: 0, alignItems: "center", justifyContent: "center" },
  ruleHorizontal: { flexDirection: "row", paddingVertical: spacing["1"] },
  ruleHorizontalLine: { height: 1, flex: 1 },
  ruleVertical: { height: 16, alignItems: "center" },
  ruleVerticalLine: { width: 1, alignSelf: "stretch" },
  label: {
    paddingHorizontal: spacing["2.5"],
    paddingTop: spacing["2"],
    paddingBottom: spacing["1"],
  },
  tile: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
});
