import { StyleSheet, View } from "react-native";
import { Copy, Share, Trash } from "phosphor-react-native";
import { Button, HoronText, IconButton, Tooltip, TooltipProvider, useHoronTheme } from "@horon-ai/expo";

export default function TooltipDemo() {
  const theme = useHoronTheme();
  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Tooltip</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        React opens the bubble on hover and focus; a phone opens it on a tap (or a long press) and closes it
        on the next tap. A `TooltipProvider` shares the open delay across the group.
      </HoronText>
      <TooltipProvider delay={300}>
        <View style={styles.row}>
          <Tooltip label="Copy link" side="top">
            <IconButton icon={<Copy size={20} />} label="Copy link" />
          </Tooltip>
          <Tooltip label="Share with the team" side="bottom">
            <IconButton icon={<Share size={20} />} label="Share" />
          </Tooltip>
          <Tooltip label="Delete forever" side="right">
            <IconButton icon={<Trash size={20} color={theme.color("text-danger")} />} label="Delete" />
          </Tooltip>
        </View>
      </TooltipProvider>
      <Tooltip label="A tooltip also wraps a whole button" side="top">
        <Button variant="solid">Hover me</Button>
      </Tooltip>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
});
