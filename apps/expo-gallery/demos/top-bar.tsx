import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CaretLeft, DotsThree, Plus } from "phosphor-react-native";
import { Button, HoronText, IconButton, TopBar, useHoronTheme } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function TopBarDemo() {
  const theme = useHoronTheme();
  const [live, setLive] = useState(true);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · title, subtitle and both icon buttons
      </HoronText>
      <TopBar
        title="Research bot"
        subtitle="12 tasks today"
        live
        onBack={() => undefined}
        onMore={() => undefined}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · read-only, title only and live toggled
      </HoronText>
      <TopBar title="Sources" />
      <TopBar title="Workspace" subtitle="Private" live={live} />
      <Button variant="solid" size="sm" onPress={() => setLive((value) => !value)}>
        {live ? "Hide live dot" : "Show live dot"}
      </Button>
      <Backdrop>
        <TopBar
          surface="glass"
          title="Glass bar"
          subtitle="Regular glass over imagery"
          live
          onBack={() => undefined}
          onMore={() => undefined}
        />
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        A long title truncates to one line
      </HoronText>
      <TopBar
        title="A very long bot name that will not fit the bar at a phone width"
        subtitle="Subtitle"
        onBack={() => undefined}
      />
      <View style={styles.row}>
        <IconButton icon={<CaretLeft />} label="Back" />
        <IconButton icon={<DotsThree weight="bold" />} label="More" />
        <IconButton icon={<Plus />} label="New" variant="primary" />
      </View>
      <HoronText variant="caption" tone="text-secondary">
        live dot {live ? "on" : "off"} · line {theme.color("border-default")}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
});
