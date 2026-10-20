import { View, type ViewProps } from "react-native";

export type BoxProps = ViewProps;

/** Layout container. A react-native `View` (a `div` on web). */
export function Box({ style, ...rest }: BoxProps) {
  return <View {...rest} style={style} />;
}
