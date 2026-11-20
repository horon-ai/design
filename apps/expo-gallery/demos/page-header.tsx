import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MagnifyingGlass } from "phosphor-react-native";
import { HoronText, IconButton, PageHeader, Tabs, TabsList, TabsTab } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** The title row with actions, with and without a back button, plus the filter row and the glass surface. */
export default function PageHeaderDemo() {
  const [filter, setFilter] = useState("all");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · title only and title with a back button
      </HoronText>
      <PageHeader title="Sources" />
      <PageHeader title="Sources" onBack={() => undefined} />
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · trailing actions and a filter row
      </HoronText>
      <PageHeader
        title="Sources"
        onBack={() => undefined}
        backLabel="Back to the workspace"
        actions={<IconButton icon={<MagnifyingGlass />} label="Search sources" />}
      />
      <PageHeader title="Knowledge" actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTab value="all">All</TabsTab>
            <TabsTab value="docs">Docs</TabsTab>
            <TabsTab value="sites">Sites</TabsTab>
          </TabsList>
        </Tabs>
      </PageHeader>
      <Backdrop>
        <PageHeader
          surface="glass"
          title="Glass header"
          onBack={() => undefined}
          actions={<IconButton icon={<MagnifyingGlass />} label="Search" />}
        />
      </Backdrop>
      <HoronText variant="caption" tone="text-secondary">
        filter {filter}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
