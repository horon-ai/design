import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FileText, Gear } from "phosphor-react-native";
import {
  Button,
  HoronText,
  ListDetail,
  ListDetailFiles,
  ListDetailFooter,
  ListDetailHeader,
  ListDetailInstructions,
  ListDetailMeta,
} from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

const GROUPS = [
  {
    id: "sources",
    label: "Sources",
    items: [
      { id: "readme", title: "README.md", meta: "2.1 KB" },
      { id: "guide", title: "guide.md", meta: "8.4 KB" },
    ],
  },
  {
    id: "images",
    label: "Images",
    items: [{ id: "diagram", title: "diagram.png", meta: "412 KB" }],
  },
];

/** The solid and glass shells, the detail pieces and the controlled selection. */
export default function ListDetailDemo() {
  const [controlled, setControlled] = useState("guide");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · uncontrolled, the first row is selected
      </HoronText>
      <ListDetail groups={GROUPS}>
        {(item) => (
          <>
            <ListDetailHeader icon={<FileText size={20} />} title={item.title} description="Indexed 4 minutes ago" />
            <ListDetailMeta
              items={[
                { id: "chunks", label: "Chunks", value: 42 },
                { id: "tokens", label: "Tokens", value: "18.2k" },
                { id: "updated", label: "Updated", value: "Today" },
                { id: "owner", label: "Owner", value: "Horon" },
              ]}
            />
            <ListDetailInstructions defaultValue={"---\ntitle: Weekly digest\n---\nSummarise the week."} />
            <ListDetailFiles>
              <Button variant="solid" size="sm">
                README.md
              </Button>
              <Button variant="solid" size="sm">
                guide.md
              </Button>
            </ListDetailFiles>
            <ListDetailFooter>
              <Button variant="solid" size="sm">
                Reindex
              </Button>
              <View style={styles.spring} />
              <Button variant="link">Open</Button>
            </ListDetailFooter>
          </>
        )}
      </ListDetail>

      <HoronText variant="label-sm" tone="text-secondary">
        Solid · controlled selection
      </HoronText>
      <ListDetail groups={GROUPS} value={controlled} onValueChange={setControlled}>
        {(item) => <ListDetailHeader icon={<Gear size={20} />} title={item.title} description={item.meta} />}
      </ListDetail>

      <Backdrop>
        <ListDetail groups={GROUPS} surface="glass">
          {(item) => <ListDetailHeader title={item.title} description="Thick glass shell over imagery" />}
        </ListDetail>
      </Backdrop>
      <HoronText variant="caption" tone="text-secondary">
        selected {controlled}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  spring: { flex: 1 },
});
