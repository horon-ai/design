import { StyleSheet, View } from "react-native";
import { Button, EmptyState, HoronIcon, HoronText } from "@horon-ai/expo";

export default function EmptyStateDemo() {
  return (
    <View style={styles.stack}>
      <EmptyState
        illustration={<HoronIcon size={140} />}
        title="Meet your first bot"
        description="Give it a role and a task. It keeps working after you close the laptop."
        action={<Button>Create a bot</Button>}
      />
      <EmptyState title="No results" />
      <EmptyState
        title="Nothing scheduled yet"
        description="Pick a repeat and a time, and the routine will run on its own."
        action={<Button variant="solid">New routine</Button>}
      />
      <HoronText variant="caption" tone="text-secondary">
        The column draws no surface, so it drops into a card, a panel body or an empty table area.
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 24, alignItems: "center" },
});
