import { Image, View, type StyleProp, type ViewStyle } from "react-native";
import { Text } from "../primitives/Text";
import { useTheme } from "../theme";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  src?: string;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ViewStyle>;
};

const SIZES: Record<AvatarSize, number> = { sm: 28, md: 36, lg: 48 };

function initials(name?: string) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = "md", style }: AvatarProps) {
  const t = useTheme();
  const dimension = SIZES[size];

  return (
    <View
      style={[
        {
          width: dimension,
          height: dimension,
          borderRadius: t.radius.full,
          backgroundColor: t.colors.secondary,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        style,
      ]}
    >
      {src ? (
        <Image source={{ uri: src }} accessibilityLabel={name} style={{ width: "100%", height: "100%" }} />
      ) : (
        <Text
          style={{
            color: t.colors["secondary-foreground"],
            fontSize: dimension * 0.38,
            fontWeight: t.fontWeight.semibold,
          }}
        >
          {initials(name)}
        </Text>
      )}
    </View>
  );
}
