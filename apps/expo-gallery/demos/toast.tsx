import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HoronPressable, HoronText, Toaster, useToast, useHoronTheme } from "@horon-ai/expo";

/** Raises one toast of each tone, the way a screen reports an action. */
function ToastButtons() {
  const toast = useToast();
  return (
    <View style={styles.row}>
      <Button
        variant="solid"
        onPress={() => toast.add({ title: "Saved", description: "All changes stored.", type: "success" })}
      >
        Success
      </Button>
      <Button
        variant="solid"
        onPress={() => toast.add({ title: "Heads up", description: "Two bots are still running." })}
      >
        Neutral
      </Button>
      <Button
        variant="solid"
        onPress={() =>
          toast.add({ title: "Upload failed", description: "The file was larger than 20 MB.", type: "danger" })
        }
      >
        Danger
      </Button>
      <Button
        variant="solid"
        onPress={() => toast.add({ title: "Stays up", description: "This one has a 0ms timeout.", timeout: 0 })}
      >
        Sticky
      </Button>
    </View>
  );
}

/** One viewport per size and surface, each with its own trigger row. */
function ToasterSection({ size, surface }: { size: "sm" | "md" | "lg"; surface: "solid" | "glass" }) {
  return (
    <View style={styles.section}>
      <HoronText variant="label-md">
        {size} · {surface}
      </HoronText>
      <Toaster size={size} surface={surface}>
        <ToastButtons />
      </Toaster>
    </View>
  );
}

export default function ToastDemo() {
  const theme = useHoronTheme();
  const [cleared, setCleared] = useState(0);
  const toast = useToast();
  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Toast</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        Toasts stack up from the bottom-right viewport, padded by the safe-area bottom inset, and each one
        is announced through `AccessibilityInfo`.
      </HoronText>
      <ToasterSection size="md" surface="solid" />
      <ToasterSection size="sm" surface="glass" />
      <ToasterSection size="lg" surface="solid" />
      <View style={styles.row}>
        <HoronPressable
          role="button"
          onPress={() => {
            toast.toasts.forEach((entry) => toast.close(entry.id));
            setCleared((value) => value + 1);
          }}
          style={[styles.clear, { borderColor: theme.color("border-default") }]}
        >
          <HoronText variant="label-md">Clear all ({cleared})</HoronText>
        </HoronPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  section: { gap: 8, borderWidth: 1, borderRadius: 14, padding: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
  clear: { borderWidth: 1, borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 10 },
});
