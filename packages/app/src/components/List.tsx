import { Children, Fragment, type ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Divider } from "../primitives/Divider";
import { Text } from "../primitives/Text";
import { useTheme } from "../theme";

export type ListProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function List({ children, style }: ListProps) {
  const t = useTheme();

  return (
    <View
      style={[
        {
          borderRadius: t.radius.lg,
          borderWidth: 1,
          borderColor: t.colors.border,
          backgroundColor: t.colors.card,
          overflow: "hidden",
          alignSelf: "stretch",
        },
        style,
      ]}
    >
      {Children.map(children, (row, index) => (
        <Fragment>
          {index > 0 ? <Divider /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

export type ListItemProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ListItem({ title, subtitle, leading, trailing, onPress, disabled = false, style }: ListItemProps) {
  const t = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      aria-disabled={disabled}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: t.space[3],
          paddingHorizontal: t.space[4],
          paddingVertical: t.space[3],
          backgroundColor: pressed && onPress ? t.colors.muted : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {leading}
      <View style={{ flex: 1, gap: t.space[0.5] }}>
        <Text
          style={{
            color: t.colors.foreground,
            fontSize: t.fontSize.sm,
            fontWeight: t.fontWeight.medium,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}
