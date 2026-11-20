import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { primitives } from "@horon-ai/tokens";
import { DocumentExtractPanel, ExtractHighlight, HoronText, type ExtractGroup } from "@horon-ai/expo";

const groups: ExtractGroup[] = [
  {
    id: "vendor",
    label: "Vendor",
    fields: [
      { id: "name", label: "Name", value: "Northwind Supply", type: "Text" },
      { id: "invoice", label: "Invoice", value: "INV-0424", type: "Text" },
    ],
  },
  {
    id: "terms",
    label: "Terms",
    fields: [
      { id: "due", label: "Due", value: "Oct 24, 2026", type: "Date", status: "check" },
      { id: "total", label: "Total", value: "$4,180.00", type: "Money", status: "check" },
      {
        id: "lines",
        label: "Lines",
        type: "Table",
        columns: [
          { label: "Item", width: 120 },
          { label: "Qty", align: "end", width: 40 },
          { label: "Amount", align: "end", width: 80 },
        ],
        rows: [
          ["Paper stock", "12", "$960.00"],
          ["Printing", "1", "$3,220.00"],
        ],
      },
    ],
  },
];

/** A sheet with highlighted reads, flagged rows, a table and the Fields / JSON / Schema views. */
export default function DocumentExtractPanelDemo() {
  const [accepted, setAccepted] = useState(false);
  return (
    <View style={styles.stack}>
      <DocumentExtractPanel
        fileName="invoice-0424.pdf"
        pageLabel="1 / 2"
        groups={groups}
        bot={{ initial: "R", name: "Researcher", elapsed: "12s" }}
        onOpenFile={() => undefined}
        onExtract={() => setAccepted(false)}
        onAcceptAll={() => setAccepted(true)}
        sheet={
          <View style={styles.sheet}>
            <HoronText variant="title-md" style={styles.sheetTitle}>
              Northwind Supply
            </HoronText>
            <HoronText variant="body-sm" style={styles.sheetBody}>
              Invoice INV-0424 · due Oct 24, 2026
            </HoronText>
            <ExtractHighlight>
              <HoronText variant="body-sm" style={styles.sheetBody}>
                Northwind Supply
              </HoronText>
            </ExtractHighlight>
            <ExtractHighlight tone="brand">
              <HoronText variant="body-sm" style={styles.sheetBody}>
                $4,180.00
              </HoronText>
            </ExtractHighlight>
            <ExtractHighlight tone="neutral">
              <HoronText variant="caption" style={styles.sheetBody}>
                Reads fine, needs a glance
              </HoronText>
            </ExtractHighlight>
            <ExtractHighlight tone="ink">
              <HoronText variant="caption" style={styles.sheetBody}>
                Ink note for the reviewer
              </HoronText>
            </ExtractHighlight>
          </View>
        }
      />
      {accepted ? (
        <HoronText variant="caption" tone="text-secondary">
          every row accepted
        </HoronText>
      ) : null}
      <DocumentExtractPanel
        fileName="receipt.png"
        groups={[groups[0]]}
        defaultZoom={100}
        sheet={<HoronText variant="body-sm">Receipt</HoronText>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20 },
  sheet: { gap: 10 },
  sheetTitle: { color: primitives["neutral-900"] },
  sheetBody: { color: primitives["neutral-900"] },
});
