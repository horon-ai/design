import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View, type ViewProps, type ViewStyle } from "react-native";
import { Text } from "../primitives/Text";
import { useTheme } from "../theme";

export type SheetSide = "right" | "left" | "bottom" | "top";

export type SheetProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: SheetSide;
  children: ReactNode;
};

export function Sheet({ open, onOpenChange, side = "right", children }: SheetProps) {
  const t = useTheme();
  const close = () => onOpenChange?.(false);
  const isHorizontal = side === "left" || side === "right";

  const panel: ViewStyle = {
    backgroundColor: t.colors.card,
    borderColor: t.colors.border,
    padding: t.space[5],
    gap: t.space[4],
    ...t.shadow.lg.native.ios,
    ...t.shadow.lg.native.android,
    ...(side === "right" ? { height: "100%", width: 320, borderLeftWidth: 1 } : {}),
    ...(side === "left" ? { height: "100%", width: 320, borderRightWidth: 1 } : {}),
    ...(side === "bottom" ? { width: "100%", maxHeight: "80%", borderTopWidth: 1 } : {}),
    ...(side === "top" ? { width: "100%", maxHeight: "80%", borderBottomWidth: 1 } : {}),
  };

  const justify = side === "left" || side === "top" ? "flex-start" : "flex-end";

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
      <View
        style={{
          flex: 1,
          flexDirection: isHorizontal ? "row" : "column",
          justifyContent: justify,
        }}
      >
        <Pressable
          accessibilityLabel="Close sheet"
          onPress={close}
          style={[StyleSheet.absoluteFill, { backgroundColor: t.colors.foreground, opacity: 0.45 }]}
        />
        <View style={panel}>{children}</View>
      </View>
    </Modal>
  );
}

export function SheetHeader({ style, ...rest }: ViewProps) {
  const t = useTheme();
  return <View {...rest} style={[{ gap: t.space[1.5] }, style]} />;
}

export function SheetTitle({ children, ...rest }: React.ComponentProps<typeof Text>) {
  return (
    <Text variant="subtitle" {...rest}>
      {children}
    </Text>
  );
}

export function SheetDescription({ children, ...rest }: React.ComponentProps<typeof Text>) {
  return (
    <Text variant="bodySm" tone="muted" {...rest}>
      {children}
    </Text>
  );
}
