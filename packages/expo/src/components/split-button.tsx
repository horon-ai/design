import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretDown } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { easing } from "../lib/motion";
import { controlHeight, DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";
import { Menu, MenuContent, MenuTrigger } from "./menu";

/**
 * Props of {@link SplitButton}: the label, the icon and the menu the split pill
 * adds, plus the disabled lock both halves share.
 */
export type SplitButtonProps = {
  /** Primary action label, rendered at `label-md` inside the left half. */
  children: ReactNode;
  /** 16pt leading icon. */
  icon?: ReactNode;
  /** Menu items (`MenuItem`, `MenuSeparator`) opened by the caret. Without it the pill is a single full-round button. */
  menu?: ReactNode;
  /** Accessible name of the caret trigger. @default "More actions" */
  menuLabel?: string;
  /** Dims the whole pill to 40% and blocks both halves. @default false */
  disabled?: boolean;
  /** Runs when the left half is pressed. */
  onPress?: () => void;
  /** The react call site's handler name; runs from `onPress`, so either may be passed. */
  onClick?: () => void;
  /** Outer layout, merged onto the pill container. */
  style?: StyleProp<ViewStyle>;
};

/** The caret's turn while the menu is open, react's 200ms quint rotation. */
const TURN = 200;

/**
 * Paper `Split button` (1VGK-0): one primary pill on `Button`'s 32pt rung (44pt
 * on a touch screen), two hit areas split by a 1x18 bar.
 *
 * The container owns the primary fill, the 0.97 press scale and the 40%
 * disabled dim, so both halves stay one pill; the caret opens the caller's
 * `menu` items in a `MenuContent` aligned to the end. Without `menu` there is no
 * divider or caret and the button keeps a full round shape. The carets turns
 * over while its menu is open; Reduce Motion leaves it pointing down.
 *
 * @example
 * ```tsx
 * import { MenuItem, SplitButton } from "@horon-ai/expo";
 *
 * function Publish() {
 *   return (
 *     <SplitButton
 *       menuLabel="Publish options"
 *       onClick={() => publishNow()}
 *       menu={<MenuItem onClick={() => schedulePublish()}>Schedule</MenuItem>}
 *     >
 *       Publish
 *     </SplitButton>
 *   );
 * }
 * ```
 */
export function SplitButton({
  children,
  icon,
  menu,
  menuLabel = "More actions",
  disabled = false,
  onPress,
  onClick,
  style,
}: SplitButtonProps) {
  const theme = useHoronTheme();
  const height = theme.touch ? 44 : controlHeight.sm;
  const [open, setOpen] = useState(false);
  const [turn] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      turn.setValue(open ? 1 : 0);
      return undefined;
    }
    const rotate = Animated.timing(turn, {
      toValue: open ? 1 : 0,
      duration: TURN,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    rotate.start();
    return () => {
      rotate.stop();
    };
  }, [open, theme.reducedMotion, turn]);

  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });

  return (
    <View
      style={[styles.root, { height, backgroundColor: theme.color("interactive-primary") }, disabled && { opacity: DISABLED_OPACITY }, style]}
    >
      <View style={styles.row}>
        <HoronPressable
          haptic="light"
          pressScale
          role="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={() => {
            onPress?.();
            onClick?.();
          }}
          style={[
            styles.half,
            {
              gap: spacing["1.5"],
              paddingLeft: spacing["3"],
              paddingRight: menu === undefined ? spacing["3"] : spacing["2"],
            },
          ]}
        >
          {icon === undefined ? null : <View style={styles.icon}>{icon}</View>}
          <HoronText variant="label-md" tone="interactive-on-primary" numberOfLines={1}>
            {children}
          </HoronText>
        </HoronPressable>
        {menu === undefined ? null : (
          <Menu onOpenChange={setOpen}>
            <View style={[styles.divider, { backgroundColor: theme.color("interactive-on-primary") }]} />
            <MenuTrigger disabled={disabled} aria-label={menuLabel} accessibilityLabel={menuLabel}>
              <Animated.View style={[styles.caret, { transform: [{ rotate }] }]}>
                <CaretDown size={14} color={theme.color("interactive-on-primary")} />
              </Animated.View>
            </MenuTrigger>
            <MenuContent align="end">{menu}</MenuContent>
          </Menu>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: "flex-start",
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  row: { flexDirection: "row", height: "100%", alignItems: "center" },
  half: { height: "100%", flexDirection: "row", alignItems: "center" },
  icon: { flexShrink: 0 },
  divider: { height: 18, width: 1, flexShrink: 0, opacity: 0.25 },
  caret: { paddingLeft: spacing["2"], paddingRight: spacing["4"], height: "100%", justifyContent: "center" },
});
