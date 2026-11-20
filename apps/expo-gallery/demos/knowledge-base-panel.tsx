import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FileDoc, FilePdf, FileText } from "phosphor-react-native";
import { KnowledgeBasePanel, SourceRow } from "@horon-ai/expo";

/** Tabs with counts, indexing progress, ready and failed sources, and the dropzone. */
export default function KnowledgeBasePanelDemo() {
  const [tab, setTab] = useState("all");
  return (
    <View style={styles.stack}>
      <KnowledgeBasePanel
        title="Knowledge base"
        meta="4 sources · 128 chunks · 2 bots"
        tabs={[
          { id: "all", label: "All", count: 4 },
          { id: "documents", label: "Documents", count: 3 },
          { id: "links", label: "Links", count: 1 },
        ]}
        value={tab}
        onValueChange={setTab}
        indexing={2}
        onSettings={() => undefined}
        onAddSource={() => undefined}
        onFiles={() => undefined}
      >
        <SourceRow variant="list" status="ready" icon={<FileText />} name="README.md" detail="8 pages · 32 chunks" />
        <SourceRow variant="list" status="ready" icon={<FilePdf />} name="invoice-0424.pdf" detail="4 pages · 12 chunks" />
        <SourceRow
          variant="list"
          status="indexing"
          icon={<FileDoc />}
          name="spec.docx"
          detail="9 of 12 pages read"
          progress={62}
        />
        <SourceRow
          variant="list"
          status="failed"
          icon={<FilePdf />}
          name="scan.pdf"
          detail="Scanned pages have no text layer"
          onRetry={() => undefined}
        />
      </KnowledgeBasePanel>
      <KnowledgeBasePanel
        title="Notion workspace"
        meta="1 source · 40 chunks"
        tabs={[{ id: "all", label: "All", count: 1 }]}
      >
        <SourceRow variant="list" status="ready" icon={<FileText />} name="Product wiki" detail="40 chunks" />
      </KnowledgeBasePanel>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20 },
});
