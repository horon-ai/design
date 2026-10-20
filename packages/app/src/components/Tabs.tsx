import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { Text } from "../primitives/Text";
import { useTheme } from "../theme";

export type TabItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type TabsVariant = "segmented" | "underline";

export type TabsProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  items: TabItem[];
  variant?: TabsVariant;
  style?: StyleProp<ViewStyle>;
};

export function Tabs({ value, onValueChange, items, variant = "segmented", style }: TabsProps) {
  const t = useTheme();
  const isSegmented = variant === "segmented";

  return (
    <View
      accessibilityRole="tablist"
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          ...(isSegmented
            ? {
                gap: 2,
                padding: 2,
                borderRadius: t.radius.md,
                backgroundColor: t.colors.muted,
                alignSelf: "flex-start",
              }
            : { gap: t.space[4], borderBottomWidth: 1, borderColor: t.colors.border }),
        },
        style,
      ]}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: item.disabled }}
            aria-selected={active}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            onPress={() => onValueChange?.(item.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: t.space[3],
              paddingVertical: isSegmented ? t.space[1.5] : t.space[2],
              borderRadius: isSegmented ? t.radius.sm : 0,
              backgroundColor: isSegmented && active ? t.colors.card : "transparent",
              borderBottomWidth: isSegmented ? 0 : 2,
              borderColor: active ? t.colors.primary : "transparent",
              marginBottom: isSegmented ? 0 : -1,
              opacity: item.disabled ? 0.5 : 1,
              ...((isSegmented && active ? t.shadow.sm.native.ios : {}) as ViewStyle),
            }}
          >
            <Text
              style={{
                fontSize: t.fontSize.sm,
                fontWeight: active ? t.fontWeight.semibold : t.fontWeight.medium,
                color: active ? t.colors.foreground : t.colors["muted-foreground"],
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
