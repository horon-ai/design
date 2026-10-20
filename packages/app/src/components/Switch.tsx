import { useEffect, useState } from "react";
import { Animated, Easing, Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { duration, easing } from "@horon-ai/tokens/native";
import { useTheme } from "../theme";

export type SwitchProps = Omit<PressableProps, "onPress" | "style" | "children" | "disabled"> & {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const TRACK_WIDTH = 44;
const THUMB_SIZE = 20;
const TRACK_PADDING = 2;

export function Switch({ value = false, onValueChange, disabled = false, style, ...rest }: SwitchProps) {
  const t = useTheme();
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: duration.fast,
      easing: Easing.bezier(...easing["in-out"]),
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [TRACK_PADDING, TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING],
  });
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [t.colors.input, t.colors.primary],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      aria-checked={value}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      {...rest}
      style={[{ alignSelf: "flex-start", opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: THUMB_SIZE + TRACK_PADDING * 2,
          borderRadius: t.radius.full,
          backgroundColor,
          justifyContent: "center",
          paddingHorizontal: TRACK_PADDING,
        }}
      >
        <Animated.View
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: t.radius.full,
            backgroundColor: t.colors.background,
            transform: [{ translateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
