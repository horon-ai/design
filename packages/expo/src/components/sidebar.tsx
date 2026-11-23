import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type GestureResponderEvent, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { CaretDown, CaretLeft, CaretRight, CaretUpDown, DotsThree, PlusCircle } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { DEFAULT_ICON_STROKE_WIDTH } from "../lib/icon";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronText } from "../lib/text";

/** Props for {@link Sidebar}. React spread the `nav` element's props; React Native keeps the surface and the resize controls. */
export type SidebarProps = {
  /**
   * `glass` (default) is the thick-glass column. `photo` is the Paper app sidebar: the Horon photo
   * on the sky ground under a 55% white veil, with the thick glass kept for dark mode. `plain` paints no
   * fill or glass, so the column takes the color of the layout behind it, divided by a 1pt border.
   * @default "glass"
   */
  surface?: "glass" | "photo" | "plain";
  /**
   * Drag the right edge to change the width, from the `md` breakpoint (768pt) up.
   * Below `md` the handle is hidden and the sidebar keeps its fixed 280pt width.
   * @default false
   */
  resizable?: boolean;
  /**
   * Starting width in pt when `resizable`. React returned to it on a double click; a phone has no
   * such gesture, so the handle only drags and this is the width the column opens at.
   * @default 280
   */
  defaultWidth?: number;
  /**
   * Narrowest width in pt the handle can drag to.
   * @default 240
   */
  minWidth?: number;
  /**
   * Widest width in pt the handle can drag to.
   * @default 400
   */
  maxWidth?: number;
  /** Called with the clamped width as it changes, during a drag too. */
  onWidthChange?: (width: number) => void;
  /**
   * Accessible name of the resize handle.
   * @default "Resize sidebar"
   */
  resizeLabel?: string;
  /** Spoken name of the navigation landmark; React read it from the `nav`'s `aria-label`. */
  "aria-label"?: string;
  /** Outer layout, merged onto the column. */
  style?: StyleProp<ViewStyle>;
  /** The column's content: rows, groups and the account card. */
  children?: ReactNode;
};

/** Clamps a width between the column's limits, in whole points. */
function clamp(value: number, min: number, max: number): number {
  return Math.round(Math.min(max, Math.max(min, value)));
}

/** True for text a slot can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Sidebar` (88:848): a 280pt thick-glass column with a 1pt right border, 16/12/12pt padding.
 * With `resizable`, an 8pt handle on the right edge drags the width between `minWidth` and `maxWidth`.
 *
 * Width is uncontrolled: the column keeps its own state, starts at `defaultWidth` and reports every
 * clamped change through `onWidthChange`. The column is a left-edge surface, so it pads itself by the
 * left, top and bottom safe-area insets. React resized with a pointer drag plus arrow keys and a
 * double click; React Native has neither a keyboard nor a double click on a touch screen, so the
 * handle drags only (its 8pt strip is widened to a 44pt touch target, and it is announced as an
 * adjustable separator with its value, minimum and maximum).
 *
 * `surface="photo"` paints the sky ground of the Paper sidebar under the 55% white veil, because a
 * photo asset is not part of this package's allowed imports; the thick glass still paints in dark mode.
 *
 * @example
 * ```tsx
 * import { Sidebar, SidebarGroup, SidebarHeader, SidebarItem } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <Sidebar resizable onWidthChange={(width) => console.log(width)}>
 *       <SidebarHeader initial="H" name="Horon" onCollapse={() => {}} />
 *       <SidebarGroup label="Workspace">
 *         <SidebarItem current>Home</SidebarItem>
 *         <SidebarItem count={3}>Inbox</SidebarItem>
 *       </SidebarGroup>
 *     </Sidebar>
 *   );
 * }
 * ```
 */
export function Sidebar({
  surface = "glass",
  resizable = false,
  defaultWidth = 280,
  minWidth = 240,
  maxWidth = 400,
  onWidthChange,
  resizeLabel = "Resize sidebar",
  "aria-label": ariaLabel,
  style,
  children,
}: SidebarProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const [width, setWidth] = useState(() => clamp(defaultWidth, minWidth, maxWidth));
  const [dragging, setDragging] = useState(false);
  // The width the drag applies to, so every move is measured against a fixed base instead of the
  // width the previous move already changed.
  const base = useRef({ x: 0, width: 0 });

  const resize = (next: number) => {
    const clamped = clamp(next, minWidth, maxWidth);
    if (clamped === width) return;
    setWidth(clamped);
    onWidthChange?.(clamped);
  };

  const start = (event: GestureResponderEvent) => {
    base.current = { x: event.nativeEvent.pageX, width };
    setDragging(true);
  };
  const move = (event: GestureResponderEvent) => {
    if (!dragging) return;
    resize(base.current.width + event.nativeEvent.pageX - base.current.x);
  };
  const end = () => {
    setDragging(false);
  };

  const paint: ViewStyle =
    surface === "glass"
      ? { backgroundColor: theme.color("glass-thick") }
      : surface === "photo"
        ? { backgroundColor: theme.color(theme.scheme === "dark" ? "glass-thick" : "bg-brand") }
        : { borderRightWidth: 1, borderColor: theme.color("border-default") };

  return (
    <View
      role="navigation"
      accessibilityLabel={ariaLabel}
      style={[
        styles.column,
        {
          gap: spacing["0.5"],
          paddingLeft: insets.left + spacing["3"],
          paddingTop: insets.top + spacing["4"],
          paddingRight: spacing["3"],
          paddingBottom: insets.bottom + spacing["3"],
          width: resizable ? width : 280,
        },
        paint,
        style,
      ]}
    >
      {surface === "glass" ? (
        <GlassSurface tier="thick" radius={0} style={StyleSheet.absoluteFill} />
      ) : null}
      {surface === "photo" && theme.scheme !== "dark" ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[StyleSheet.absoluteFill, { backgroundColor: theme.color("interactive-on-primary"), opacity: 0.55 }]}
        />
      ) : null}
      {children}
      {resizable ? (
        <View
          role="separator"
          accessibilityLabel={resizeLabel}
          accessibilityState={{ busy: dragging }}
          accessibilityValue={{ min: minWidth, max: maxWidth, now: width, text: `${width} points` }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={start}
          onResponderMove={move}
          onResponderRelease={end}
          onResponderTerminate={end}
          hitSlop={{ left: TOUCH_TARGET / 2, right: TOUCH_TARGET / 2 }}
          style={styles.handle}
        >
          <View
            style={[
              styles.rail,
              { backgroundColor: dragging ? theme.color("text-brand") : undefined },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

/** Props for {@link SidebarHeader}. Renders the workspace switch and an optional collapse button in one 36pt row. */
export type SidebarHeaderProps = {
  /** Workspace initial shown on the 28pt ink tile. */
  initial: ReactNode;
  /** Workspace name next to the tile; truncated when the column is narrow. */
  name: ReactNode;
  /** Props for the workspace switch button, such as the pressed state of an open menu. */
  switchProps?: SidebarWorkspaceSwitchProps;
  /** Replaces the default switch, such as a workspace menu whose trigger is a {@link SidebarWorkspaceSwitch}. */
  switchSlot?: ReactNode;
  /** Shows the collapse button when set; it receives the press and the caller hides the column. */
  onCollapse?: () => void;
  /**
   * Accessible name of the collapse button.
   * @default "Collapse sidebar"
   */
  collapseLabel?: string;
};

/**
 * Header: workspace switch (tile, name, up-down caret) and an optional 28pt collapse button. 10pt gap below.
 *
 * Part of {@link Sidebar}. Pass `switchSlot` when the switch must open a menu; otherwise the built-in
 * {@link SidebarWorkspaceSwitch} is rendered and takes the press through its own `onPress`.
 *
 * @example
 * ```tsx
 * <SidebarHeader initial="H" name="Horon" onCollapse={() => setOpen(false)} />
 * ```
 */
export function SidebarHeader({
  initial,
  name,
  switchProps,
  switchSlot,
  onCollapse,
  collapseLabel = "Collapse sidebar",
}: SidebarHeaderProps) {
  const theme = useHoronTheme();
  return (
    <View style={styles.header}>
      {switchSlot ?? <SidebarWorkspaceSwitch {...switchProps} initial={initial} name={name} />}
      {onCollapse ? (
        <HoronPressable
          role="button"
          accessibilityLabel={collapseLabel}
          onPress={onCollapse}
          hitSlop={touchSlop(theme.touch, 28, 28)}
          style={[styles.collapse, { borderRadius: radius.sm }]}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.collapse,
                { borderRadius: radius.sm, backgroundColor: pressed ? theme.color("overlay-ink-10") : undefined },
              ]}
            >
              <CaretLeft size={16} color={theme.color("text-secondary")} />
            </View>
          )}
        </HoronPressable>
      ) : null}
    </View>
  );
}

/** Props for {@link SidebarWorkspaceSwitch}: the workspace identity the row shows. */
export type SidebarWorkspaceSwitchProps = {
  /** Workspace initial on the 28pt ink tile. */
  initial: ReactNode;
  /** Workspace name, truncated in the row. */
  name: ReactNode;
  /** Runs when the row is pressed, usually to open the workspace menu. */
  onPress?: () => void;
  /** Marks the row as the current page of a navigation trail. */
  "aria-current"?: "page" | "true" | "false" | boolean;
  /** Accessible name when the workspace name alone is not the whole name. */
  "aria-label"?: string;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The workspace switch button: 28pt ink tile, name and up-down caret. React highlighted it while its
 * menu was open through `data-popup-open`; the port tints the row while `aria-current` marks it.
 *
 * Part of {@link Sidebar}.
 */
export function SidebarWorkspaceSwitch({
  initial,
  name,
  onPress,
  "aria-current": current,
  "aria-label": ariaLabel,
  style,
}: SidebarWorkspaceSwitchProps) {
  const theme = useHoronTheme();
  const active = current === "page" || current === true || current === "true";
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={ariaLabel}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[
        styles.switchRow,
        {
          gap: spacing["1.5"],
          borderRadius: radius.md,
          paddingLeft: spacing["2"],
          paddingRight: spacing["1"],
          minHeight: theme.touch ? TOUCH_TARGET : 36,
          backgroundColor: active ? theme.color("overlay-ink-6") : undefined,
        },
        style,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.switchRow,
            styles.switchInner,
            {
              gap: spacing["1.5"],
              backgroundColor: pressed && !active ? theme.color("overlay-ink-6") : undefined,
            },
          ]}
        >
          <View style={[styles.switchTile, { backgroundColor: theme.color("interactive-primary"), borderRadius: radius.sm }]}>
            {isPlainText(initial) ? (
              <HoronText variant="label-md" tone="text-inverse">
                {initial}
              </HoronText>
            ) : (
              initial
            )}
          </View>
          {isPlainText(name) ? (
            <HoronText variant="label-lg" tone="text-primary" numberOfLines={1} style={styles.fill}>
              {name}
            </HoronText>
          ) : (
            <View style={styles.fill}>{name}</View>
          )}
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <CaretUpDown size={14} color={theme.color("text-secondary")} />
          </View>
        </View>
      )}
    </HoronPressable>
  );
}

/** Props every sidebar row shares, whichever role it renders as. */
type SidebarItemCommonProps = {
  /** 18pt icon, or a `SidebarProjectTile`. Set the glyph's own size, as react sized it through CSS. */
  icon?: ReactNode;
  /** Count on the right, such as unread items. */
  count?: ReactNode;
  /** Trailing 7pt red dot marking the row for attention; the dot carries an accessible name but no role. */
  attention?: boolean;
  /** Marks the active row: 6% ink fill and the selected accessibility state. */
  current?: boolean;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
  /** The row label. */
  children?: ReactNode;
};

/**
 * With `href`, the row is announced as a link and takes the link members; without it, a button.
 * The `current` flag adds the selected state to either.
 */
export type SidebarItemProps = SidebarItemCommonProps & {
  /** Destination; setting it makes the row announce itself as a link. React navigated from the anchor. */
  href?: string;
  /** Runs when the row is pressed. */
  onPress?: () => void;
  /** The react call site's handler name; runs from `onPress`, so both may be passed. */
  onClick?: () => void;
  /** Accessible name when the visible label is not the whole name. */
  "aria-label"?: string;
};

/**
 * Figma sidebar `Item`: 32pt row, 12pt radius, 10pt gap; the current item is 6% ink.
 * Pass `href` to announce the row as a link with the same look.
 *
 * Part of {@link Sidebar}. A 32pt row is half a thumb, so under the touch rung the row grows to the
 * 44pt floor while its inset stays, which keeps the tree connector in step.
 *
 * @example
 * ```tsx
 * <SidebarItem icon={<House size={18} />} current>
 *   Home
 * </SidebarItem>
 * ```
 */
export function SidebarItem({
  icon,
  count,
  attention,
  current,
  href,
  onPress,
  onClick,
  "aria-label": ariaLabel,
  style,
  children,
}: SidebarItemProps) {
  const theme = useHoronTheme();
  const link = href !== undefined;
  return (
    <HoronPressable
      role={link ? "link" : "button"}
      accessibilityLabel={ariaLabel}
      accessibilityState={{ selected: current }}
      onPress={() => {
        onPress?.();
        onClick?.();
      }}
      style={[
        styles.item,
        {
          gap: spacing["2.5"],
          borderRadius: radius.md,
          paddingHorizontal: spacing["2.5"],
          height: theme.touch ? TOUCH_TARGET : 32,
        },
        style,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.item,
            styles.fill,
            {
              gap: spacing["2.5"],
              backgroundColor: current ? theme.color("overlay-ink-6") : pressed ? theme.color("overlay-ink-4") : undefined,
            },
          ]}
        >
          {icon ? (
            <View style={styles.iconSlot} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {icon}
            </View>
          ) : null}
          {isPlainText(children) ? (
            <HoronText variant="label-md" tone="text-primary" numberOfLines={1} style={styles.fill}>
              {children}
            </HoronText>
          ) : (
            <View style={styles.fill}>{children}</View>
          )}
          {count !== undefined ? (
            isPlainText(count) ? (
              <HoronText variant="body-sm" tone="text-secondary">
                {count}
              </HoronText>
            ) : (
              count
            )
          ) : null}
          {attention ? (
            <View
              accessible
              accessibilityLabel="Needs attention"
              style={[styles.attentionDot, { backgroundColor: theme.color("text-danger") }]}
            />
          ) : null}
        </View>
      )}
    </HoronPressable>
  );
}

/**
 * A 22pt rounded tile with a 14pt inverse icon, for project rows.
 *
 * Part of {@link Sidebar}. React sized the icon through CSS; pass the glyph's own `size={14}`.
 */
export function SidebarProjectTile({
  children,
  style,
}: {
  /** The 14pt icon, or its letter. */
  children?: ReactNode;
  /** Layout merged onto the tile. */
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useHoronTheme();
  return (
    <View style={[styles.projectTile, { backgroundColor: theme.color("interactive-primary"), borderRadius: radius.xs }, style]}>
      {isPlainText(children) ? (
        <HoronText variant="label-sm" tone="text-inverse">
          {children}
        </HoronText>
      ) : (
        children
      )}
    </View>
  );
}

/** Props for {@link SidebarGroup}. */
export type SidebarGroupProps = {
  /** Group caption; also the collapsible trigger's label. */
  label: ReactNode;
  /**
   * Whether the group starts expanded.
   * @default true
   */
  defaultOpen?: boolean;
  /** Rows or projects inside the group. */
  children: ReactNode;
};

/**
 * A collapsible group: a 28pt label in secondary text with a 14pt caret, 14pt above.
 *
 * Part of {@link Sidebar}. The group is uncontrolled after mount. The caret rotates from pointing
 * right (collapsed) to down (open) over 200ms, in place under reduced motion, and the panel paints
 * only while open because a phone cannot measure a collapsed height cheaply.
 *
 * @example
 * ```tsx
 * <SidebarGroup label="Workspace" defaultOpen>
 *   <SidebarItem>Home</SidebarItem>
 * </SidebarGroup>
 * ```
 */
export function SidebarGroup({ label, defaultOpen = true, children }: SidebarGroupProps) {
  const theme = useHoronTheme();
  const [open, setOpen] = useState(defaultOpen);
  const [rotate] = useState(() => new Animated.Value(defaultOpen ? 1 : 0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rotate.setValue(open ? 1 : 0);
      return;
    }
    Animated.timing(rotate, {
      toValue: open ? 1 : 0,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [open, theme.reducedMotion, rotate]);

  return (
    <View style={[styles.group, { gap: spacing["0.5"] }]}>
      <HoronPressable
        role="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((value) => !value)}
        style={[styles.groupTrigger, { gap: spacing["1"], borderRadius: radius.sm, paddingHorizontal: spacing["2.5"] }]}
      >
        {({ pressed }) => (
          <View
            style={[
              styles.groupTrigger,
              styles.groupInner,
              { gap: spacing["1"], backgroundColor: pressed ? theme.color("overlay-ink-4") : undefined },
            ]}
          >
            {isPlainText(label) ? (
              <HoronText variant="label-md" tone="text-secondary">
                {label}
              </HoronText>
            ) : (
              label
            )}
            <Animated.View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={{
                transform: [
                  { rotate: rotate.interpolate({ inputRange: [0, 1], outputRange: ["-90deg", "0deg"] }) },
                ],
              }}
            >
              <CaretDown size={14} color={theme.color("text-secondary")} />
            </Animated.View>
          </View>
        )}
      </HoronPressable>
      {open ? <View style={styles.groupPanel}>{children}</View> : null}
    </View>
  );
}

/** Fixed 32pt row step and 2pt gap the Figma `Tree` connector is drawn against. */
const ROW = 32;
const GAP = 2;
/** Row height when the touch rung forces every row to the 44pt floor, matching `SidebarItem`. */
const TOUCH_ROW = 44;

/** Connector path of the Figma `Tree`: one 1.5pt line with a 9pt curve into the middle of each child row. */
function branchesPath(count: number, row: number): string {
  const centers = Array.from({ length: count }, (_, index) => row / 2 + index * (row + GAP));
  const last = centers.at(-1) ?? 0;
  const trunk = `M0.75 0V${last - 9}`;
  const branches = centers.map((center) => {
    const start = center - 9;
    return `M0.75 ${start}C0.75 ${start + 4.909} 4.841 ${center} 9.75 ${center}H13.75`;
  });
  return [trunk, ...branches].join("");
}

/**
 * Figma `Tree`: nested sidebar items with 16pt icons, 20pt in, joined to the parent by curved connectors.
 *
 * Part of {@link Sidebar}. The connector is one SVG path computed from the child count, so it
 * assumes 32pt rows with a 2pt gap; pass the child rows directly rather than wrapping them. The
 * path is recomputed at the touch row height so its branches keep landing in each row's middle.
 *
 * @example
 * ```tsx
 * <SidebarTree>
 *   <SidebarItem>Chats</SidebarItem>
 *   <SidebarItem>Files</SidebarItem>
 * </SidebarTree>
 * ```
 */
export function SidebarTree({ children }: SidebarTreeProps) {
  const theme = useHoronTheme();
  const count = Children.count(children);
  const row = theme.touch ? TOUCH_ROW : ROW;
  const height = row / 2 + Math.max(0, count - 1) * (row + GAP) + 0.75;
  return (
    <View style={[styles.tree, { gap: spacing["0.5"] }]}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ width: 16, height }}
      >
        <Svg width={16} height={height} viewBox={`0 0 16 ${height}`} fill="none">
          <Path
            d={branchesPath(count, row)}
            strokeWidth={DEFAULT_ICON_STROKE_WIDTH}
            stroke={theme.color("overlay-ink-16")}
          />
        </Svg>
      </View>
      <View style={[styles.treeRows, { gap: spacing["0.5"] }]}>{children}</View>
    </View>
  );
}

/** Props for {@link SidebarTree}: the child rows whose count and order draw the connector. */
export type SidebarTreeProps = {
  /** Child rows; their count and order decide the connector shape. */
  children: ReactNode;
};

/**
 * Pushes the account card to the bottom.
 *
 * Part of {@link Sidebar}; it grows to fill the remaining column height.
 */
export function SidebarSpacer() {
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.spacer} />;
}

/** Props for {@link SidebarAccount}: the identity lines it shows and the press that opens the switcher. */
export type SidebarAccountProps = {
  /** Initials on the 36pt sky avatar tile. */
  initials: ReactNode;
  /** Account name. */
  name: ReactNode;
  /** Email line under the name. */
  email?: ReactNode;
  /** Runs when the row is pressed. */
  onPress?: () => void;
  /** The react call site's handler name; runs from `onPress`, so both may be passed. */
  onClick?: () => void;
  /** Accessible name when the two lines alone are not the whole name. */
  "aria-label"?: string;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Figma sidebar `Account`: a 54pt row with a 36pt sky avatar tile and an up-down caret.
 *
 * Part of {@link Sidebar}. The row is a button, so pair it with a menu when it should open an
 * account switcher.
 *
 * @example
 * ```tsx
 * <SidebarAccount initials="MJ" name="Min-yeol" email="mj@horon.ai" onPress={openMenu} />
 * ```
 */
export function SidebarAccount({
  initials,
  name,
  email,
  onPress,
  onClick,
  "aria-label": ariaLabel,
  style,
}: SidebarAccountProps) {
  const theme = useHoronTheme();
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={ariaLabel}
      onPress={() => {
        onPress?.();
        onClick?.();
      }}
      style={[styles.account, { gap: spacing["2.5"], borderRadius: radius.lg, paddingVertical: spacing["2"] }, style]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.account,
            styles.fill,
            {
              gap: spacing["2.5"],
              borderRadius: radius.lg,
              backgroundColor: pressed ? theme.color("overlay-ink-4") : undefined,
            },
          ]}
        >
          <View
            style={[
              styles.accountTile,
              { borderRadius: radius.md, backgroundColor: primitives["sky-200"] },
            ]}
          >
            {isPlainText(initials) ? (
              <HoronText variant="label-md" tone="surface-ink">
                {initials}
              </HoronText>
            ) : (
              initials
            )}
          </View>
          <View style={styles.accountCopy}>
            {isPlainText(name) ? (
              <HoronText variant="label-md" tone="text-primary" numberOfLines={1}>
                {name}
              </HoronText>
            ) : (
              name
            )}
            {email ? (
              isPlainText(email) ? (
                <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                  {email}
                </HoronText>
              ) : (
                email
              )
            ) : null}
          </View>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <CaretUpDown size={16} color={theme.color("text-primary")} />
          </View>
        </View>
      )}
    </HoronPressable>
  );
}

/** Props for {@link SidebarProject}. */
export type SidebarProjectProps = {
  /** A {@link SidebarProjectTile}. */
  icon: ReactNode;
  /** Project name; truncated in the row. */
  label: ReactNode;
  /** Marks the active project: a 6% ink row and the selected accessibility state. */
  current?: boolean;
  /**
   * Whether the project starts expanded in uncontrolled mode.
   * @default false
   */
  defaultOpen?: boolean;
  /** Expanded state in controlled mode; pass `onOpenChange` with it. */
  open?: boolean;
  /** Fires with the next expanded state when the row is toggled. */
  onOpenChange?: (open: boolean) => void;
  /**
   * The project's "More" control, such as a menu trigger around a {@link SidebarProjectMore}.
   * It replaces the chevron while the project is open.
   */
  actions?: ReactNode;
  /** Chats and documents in the project, shown in a {@link SidebarTree} when open. */
  children?: ReactNode;
};

/**
 * Figma sidebar project row (88:848, Menu=Project 314:12407): tile, name and a 14pt chevron
 * (down when open). An open project shows the 16pt "More" control in place of the chevron, on a
 * 6% ink row; a collapsed project keeps the chevron.
 *
 * Part of {@link Sidebar}. The expanded state works uncontrolled (`defaultOpen`) or controlled
 * (`open` + `onOpenChange`). A project without children renders no panel and no chevron; the trigger
 * still toggles the open state, and any `actions` stay visible. The chevron turns over 200ms, in
 * place under reduced motion.
 *
 * @example
 * ```tsx
 * <SidebarProject icon={<SidebarProjectTile>H</SidebarProjectTile>} label="Horon" defaultOpen>
 *   <SidebarItem>Chats</SidebarItem>
 * </SidebarProject>
 * ```
 */
export function SidebarProject({
  icon,
  label,
  current,
  defaultOpen = false,
  open,
  onOpenChange,
  actions,
  children,
}: SidebarProjectProps) {
  const theme = useHoronTheme();
  const hasChildren = Children.count(children) > 0;
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const [rotate] = useState(() => new Animated.Value(isOpen ? 1 : 0));

  const change = (next: boolean) => {
    setInner(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (theme.reducedMotion) {
      rotate.setValue(isOpen ? 1 : 0);
      return;
    }
    Animated.timing(rotate, {
      toValue: isOpen ? 1 : 0,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [isOpen, theme.reducedMotion, rotate]);

  return (
    <View style={[styles.project, { gap: spacing["0.5"] }]}>
      <View
        style={[
          styles.projectRow,
          {
            borderRadius: radius.md,
            backgroundColor: current ? theme.color("overlay-ink-6") : undefined,
          },
        ]}
      >
        <HoronPressable
          role="button"
          accessibilityState={{ selected: current, expanded: isOpen }}
          onPress={() => change(!isOpen)}
          style={[
            styles.projectTrigger,
            {
              gap: spacing["2.5"],
              borderRadius: radius.md,
              paddingHorizontal: spacing["2.5"],
              height: theme.touch ? TOUCH_TARGET : 32,
            },
          ]}
        >
          {({ pressed }) => (
            <View
              style={[
                styles.projectTrigger,
                styles.fill,
                {
                  gap: spacing["2.5"],
                  backgroundColor: !current && pressed ? theme.color("overlay-ink-4") : undefined,
                },
              ]}
            >
              {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
              {isPlainText(label) ? (
                <HoronText variant="label-md" tone="text-primary" numberOfLines={1} style={styles.fill}>
                  {label}
                </HoronText>
              ) : (
                <View style={styles.fill}>{label}</View>
              )}
              {hasChildren ? (
                <Animated.View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  style={[
                    styles.chevron,
                    { opacity: actions !== undefined && isOpen ? 0 : 1 },
                    {
                      transform: [
                        { rotate: rotate.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "90deg"] }) },
                      ],
                    },
                  ]}
                >
                  <CaretRight size={14} color={theme.color("text-secondary")} />
                </Animated.View>
              ) : null}
            </View>
          )}
        </HoronPressable>
        {actions !== undefined ? (
          <View style={[styles.projectActions, { opacity: !hasChildren || isOpen ? 1 : 0 }]}>{actions}</View>
        ) : null}
      </View>
      {hasChildren && isOpen ? <SidebarTree>{children}</SidebarTree> : null}
    </View>
  );
}

/** Props for {@link SidebarProjectMore}: the accessible label of the small "More" button. */
export type SidebarProjectMoreProps = {
  /**
   * Accessible name of the button.
   * @default "Project actions"
   */
  label?: string;
  /** Runs when the button is pressed. */
  onPress?: () => void;
  /** The react call site's handler name; runs from `onPress`, so both may be passed. */
  onClick?: () => void;
  /** Outer layout, merged onto the button. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The 16pt "More" button of a project row.
 *
 * Part of {@link Sidebar}; its 44pt tap target is a `hitSlop` around the small glyph, so the glyph
 * keeps its painted size and the press stays easy to hit.
 */
export function SidebarProjectMore({ label = "Project actions", onPress, onClick, style }: SidebarProjectMoreProps) {
  const theme = useHoronTheme();
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={label}
      onPress={() => {
        onPress?.();
        onClick?.();
      }}
      hitSlop={touchSlop(theme.touch, 16, 16)}
      style={[styles.projectMore, { borderRadius: radius.xs }, style]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.projectMore,
            { borderRadius: radius.xs, backgroundColor: pressed ? theme.color("overlay-ink-6") : undefined },
          ]}
        >
          <DotsThree size={16} color={theme.color("text-primary")} />
        </View>
      )}
    </HoronPressable>
  );
}

/** Props for {@link SidebarAddButton}: the trailing icon and the press. */
export type SidebarAddButtonProps = {
  /** Icon after the label; defaults to a 16pt plus circle. @default a 16px plus-circle (`PlusCircle`) icon */
  icon?: ReactNode;
  /** Runs when the button is pressed. */
  onPress?: () => void;
  /** The react call site's handler name; runs from `onPress`, so both may be passed. */
  onClick?: () => void;
  /** Outer layout, merged onto the button. */
  style?: StyleProp<ViewStyle>;
  /** The visible label. */
  children?: ReactNode;
};

/** Default trailing icon of {@link SidebarAddButton}. */
const addIcon = <PlusCircle />;

/**
 * Figma `Add project`: a 36pt button with a 1pt inside dashed border (4/3 dash, 20% ink), label
 * then a 16pt plus-circle, 12pt above.
 *
 * Part of {@link Sidebar}. React drew the dash with an SVG rect so the 4/3 rhythm matched; the port
 * paints the same dashed rect through `react-native-svg`, so the dash and its radius stay the same.
 *
 * @example
 * ```tsx
 * <SidebarAddButton onPress={createProject}>New project</SidebarAddButton>
 * ```
 */
export function SidebarAddButton({ icon = addIcon, onPress, onClick, style, children }: SidebarAddButtonProps) {
  const theme = useHoronTheme();
  return (
    <HoronPressable
      role="button"
      onPress={() => {
        onPress?.();
        onClick?.();
      }}
      style={[styles.add, { borderRadius: radius.md }, style]}
    >
      {({ pressed }) => (
        <View style={[styles.add, styles.fill, { borderRadius: radius.md }]}>
          <Svg pointerEvents="none" width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Rect
              x={0.5}
              y={0.5}
              width="99%"
              height="99%"
              rx={radius.md}
              fill="none"
              stroke={theme.color("overlay-ink-20")}
              strokeWidth={1}
              strokeDasharray={[4, 3]}
            />
          </Svg>
          <View style={[StyleSheet.absoluteFill, { borderRadius: radius.md, backgroundColor: pressed ? theme.color("overlay-ink-4") : undefined }]} />
          <View style={[styles.addInner, { gap: spacing["1.5"] }]}>
            {isPlainText(children) ? (
              <HoronText variant="label-md" tone="text-secondary">
                {children}
              </HoronText>
            ) : (
              children
            )}
            <View style={styles.iconSlot} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              {icon}
            </View>
          </View>
        </View>
      )}
    </HoronPressable>
  );
}

/** A block prop set, kept so callers type their sidebar pieces the same way. */
export type SidebarDivProps = {
  /** Layout merged onto the block. */
  style?: StyleProp<ViewStyle>;
  /** The block's content. */
  children?: ReactNode;
};

const styles = StyleSheet.create({
  column: {
    position: "relative",
    flexDirection: "column",
    alignItems: "stretch",
    overflow: "hidden",
    maxWidth: "100%",
    minWidth: 0,
  },
  handle: { position: "absolute", top: 0, bottom: 0, right: 0, width: 8, justifyContent: "center" },
  rail: { position: "absolute", top: 0, bottom: 0, right: 0, width: 2 },
  header: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"], marginBottom: spacing["2.5"] },
  switchRow: { flexDirection: "row", alignItems: "center", flex: 1, minWidth: 0 },
  switchInner: { flex: 1, minWidth: 0, paddingVertical: spacing["1"] },
  switchTile: { width: 28, height: 28, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  fill: { flex: 1, minWidth: 0 },
  collapse: { width: 28, height: 28, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  item: { flexDirection: "row", alignItems: "center", width: "100%" },
  iconSlot: { flexShrink: 0, alignItems: "center" },
  attentionDot: { width: 7, height: 7, borderRadius: radius.full, flexShrink: 0 },
  projectTile: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  group: { flexDirection: "column", marginTop: spacing["3.5"], flexShrink: 0 },
  groupTrigger: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", height: 28 },
  groupInner: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing["1"] },
  groupPanel: { flexDirection: "column", gap: spacing["0.5"] },
  tree: { flexDirection: "row", alignItems: "flex-start", paddingLeft: spacing["5"], flexShrink: 0 },
  treeRows: { flex: 1, minWidth: 0, flexDirection: "column" },
  spacer: { flex: 1, minHeight: 1 },
  account: { flexDirection: "row", alignItems: "center", width: "100%" },
  accountTile: { width: 36, height: 36, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  accountCopy: { flex: 1, minWidth: 0, flexDirection: "column" },
  project: { flexDirection: "column" },
  projectRow: { position: "relative", flexDirection: "row", alignItems: "center" },
  projectTrigger: { flexDirection: "row", alignItems: "center", flex: 1, minWidth: 0 },
  chevron: { flexShrink: 0 },
  projectActions: { position: "absolute", right: spacing["2.5"], flexDirection: "row" },
  projectMore: { width: 16, height: 16, alignItems: "center", justifyContent: "center" },
  add: { marginTop: spacing["2"], height: 36, width: "100%", alignItems: "center", justifyContent: "center" },
  addInner: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
});
