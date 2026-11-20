import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CommandPalette, HoronText, Kbd, type CommandGroup } from "@horon-ai/expo";

const GROUPS: CommandGroup[] = [
  {
    label: "Bots",
    items: [
      { value: "weekly", label: "Weekly digest", meta: "Product", hint: <Kbd>↵</Kbd>, keywords: "summary mail" },
      { value: "inbox", label: "Inbox triage", meta: "Ops", keywords: "mail sort" },
      { value: "research", label: "Research run", meta: "Labs", tile: "R" },
    ],
  },
  {
    label: "Workspaces",
    items: [
      { value: "acme", label: "Acme", meta: "12 members", tile: "A" },
      { value: "labs", label: "Labs", meta: "4 members", tile: "L", keywords: "experiments" },
    ],
  },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Command palette</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        A controlled palette plus the three surfaces. The query filters on label and keywords; pressing a
        row runs its `onSelect` and closes the palette.
      </HoronText>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        trigger={<HoronText variant="label-md">Open palette</HoronText>}
        groups={GROUPS}
        hints={[
          ["↵", "Open"],
          ["esc", "Close"],
        ]}
      />
      <CommandPalette groups={GROUPS} surface="glass" trigger={<HoronText variant="label-md">Open on the veil</HoronText>} />
      <CommandPalette
        groups={GROUPS}
        surface="solid"
        placeholder="Search bots"
        empty="No bot matches that"
        trigger={<HoronText variant="label-md">Search bots</HoronText>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
