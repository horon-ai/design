import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Plus } from "phosphor-react-native";
import { HoronText, Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Pill and underline lists in three rungs, with icons, counts and a disabled tab. */
export default function TabsDemo() {
  const [pill, setPill] = useState("general");
  const [underline, setUnderline] = useState("general");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Pill · controlled selection, an icon and a count
      </HoronText>
      <Tabs value={pill} onValueChange={setPill}>
        <TabsList>
          <TabsTab value="general" icon={<Plus />}>
            General
          </TabsTab>
          <TabsTab value="billing" count={3}>
            Billing
          </TabsTab>
          <TabsTab value="advanced" disabled>
            Advanced
          </TabsTab>
        </TabsList>
        <TabsPanel value="general">General settings</TabsPanel>
        <TabsPanel value="billing">Three open invoices</TabsPanel>
        <TabsPanel value="advanced">Only on the business plan</TabsPanel>
      </Tabs>

      <HoronText variant="label-sm" tone="text-secondary">
        Pill · sm and lg rungs, uncontrolled
      </HoronText>
      <Tabs defaultValue="alpha" size="sm">
        <TabsList>
          <TabsTab value="alpha">Alpha</TabsTab>
          <TabsTab value="beta" count={2}>
            Beta
          </TabsTab>
        </TabsList>
        <TabsPanel value="alpha">Alpha panel</TabsPanel>
        <TabsPanel value="beta">Beta panel</TabsPanel>
      </Tabs>
      <Tabs defaultValue="alpha" size="lg">
        <TabsList>
          <TabsTab value="alpha">Alpha</TabsTab>
          <TabsTab value="beta">Beta</TabsTab>
        </TabsList>
        <TabsPanel value="alpha">Alpha panel</TabsPanel>
        <TabsPanel value="beta">Beta panel</TabsPanel>
      </Tabs>

      <HoronText variant="label-sm" tone="text-secondary">
        Underline · the document variant, with a kept panel
      </HoronText>
      <Tabs value={underline} onValueChange={setUnderline}>
        <TabsList variant="underline">
          <TabsTab value="general">General</TabsTab>
          <TabsTab value="billing" count={3}>
            Billing
          </TabsTab>
        </TabsList>
        <TabsPanel value="general">General settings</TabsPanel>
        <TabsPanel value="billing">Three open invoices</TabsPanel>
      </Tabs>
      <Tabs defaultValue="a">
        <TabsList variant="underline">
          <TabsTab value="a">Kept panel</TabsTab>
          <TabsTab value="b">Second</TabsTab>
        </TabsList>
        <TabsPanel value="a" keepMounted>
          This panel stays mounted while another tab is active.
        </TabsPanel>
        <TabsPanel value="b">Second panel</TabsPanel>
      </Tabs>

      <Backdrop>
        <Tabs defaultValue="general">
          <TabsList surface="glass">
            <TabsTab value="general">General</TabsTab>
            <TabsTab value="billing" count={3}>
              Billing
            </TabsTab>
          </TabsList>
          <TabsPanel value="general">Glass tray</TabsPanel>
          <TabsPanel value="billing">Glass tray, second tab</TabsPanel>
        </Tabs>
      </Backdrop>
      <HoronText variant="caption" tone="text-secondary">
        selected {pill} / {underline}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
