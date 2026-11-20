import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { House, MagnifyingGlass, User } from "phosphor-react-native";
import { HoronText, TabBar } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

const SECTIONS = [
  { value: "home", label: "Home", icon: <House /> },
  { value: "search", label: "Search", icon: <MagnifyingGlass /> },
  { value: "profile", label: "Profile", icon: <User /> },
];

/** The mobile bottom navigation in its three rungs, the flat surface and an over-wide row. */
export default function TabBarDemo() {
  const [tab, setTab] = useState("home");
  const [small, setSmall] = useState("home");
  const [large, setLarge] = useState("search");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        md · the Figma 64x48 tab, glass
      </HoronText>
      <TabBar aria-label="Sections" value={tab} onValueChange={setTab} items={SECTIONS} />
      <HoronText variant="label-sm" tone="text-secondary">
        sm · 56x40 tabs
      </HoronText>
      <TabBar size="sm" aria-label="Sections" value={small} onValueChange={setSmall} items={SECTIONS} />
      <HoronText variant="label-sm" tone="text-secondary">
        lg · 72x56 tabs, flat surface
      </HoronText>
      <TabBar size="lg" surface="flat" aria-label="Sections" value={large} onValueChange={setLarge} items={SECTIONS} />
      <HoronText variant="label-sm" tone="text-secondary">
        An over-wide row scrolls instead of squeezing the icons
      </HoronText>
      <TabBar
        aria-label="Many sections"
        value={tab}
        onValueChange={setTab}
        items={[...SECTIONS, ...SECTIONS.map((item) => ({ ...item, value: `${item.value}-2`, label: `${item.label} 2` }))]}
      />
      <Backdrop>
        <TabBar aria-label="Over imagery" value={tab} onValueChange={setTab} items={SECTIONS} />
      </Backdrop>
      <HoronText variant="caption" tone="text-secondary">
        selected {tab} / {small} / {large}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
