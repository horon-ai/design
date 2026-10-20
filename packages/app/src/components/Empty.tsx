import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { Text } from "../primitives/Text";
import { useTheme } from "../theme";

export type EmptyProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Empty({ title, description, icon, action, style }: EmptyProps) {
  const t = useTheme();

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          gap: t.space[3],
          paddingVertical: t.space[8],
          paddingHorizontal: t.space[6],
          borderRadius: t.radius.xl,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: t.colors.border,
          alignSelf: "stretch",
        },
        style,
      ]}
    >
      {icon ? (
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: t.radius.full,
            backgroundColor: t.colors.muted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
      ) : null}
      <Text variant="subtitle" style={{ textAlign: "center" }}>
        {title}
      </Text>
      {description ? (
        <Text variant="bodySm" tone="muted" style={{ textAlign: "center", maxWidth: 320 }}>
          {description}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: t.space[1] }}>{action}</View> : null}
    </View>
  );
}
