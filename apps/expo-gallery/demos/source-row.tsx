import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FilePdf, FileText } from "phosphor-react-native";
import { HoronText, SourceRow } from "@horon-ai/expo";

export default function SourceRowDemo() {
  const [retries, setRetries] = useState(0);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Cards · ready, indexing, failed
      </HoronText>
      <SourceRow
        status="ready"
        icon={<FilePdf />}
        name="Q3 board deck.pdf"
        detail="24 pages · 96 chunks"
      />
      <SourceRow
        status="indexing"
        icon={<FilePdf />}
        name="Q4 launch brief.pdf"
        detail="42 pages · embedding"
        progress={68}
      />
      <SourceRow
        status="failed"
        icon={<FileText />}
        name="pricing-notes.txt"
        detail="Embedding failed · retry"
        onRetry={() => setRetries((count) => count + 1)}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        List · stacked with the hairline divider
      </HoronText>
      <View>
        <SourceRow
          variant="list"
          status="ready"
          icon={<FileText />}
          name="tokens.md"
          detail="8 pages · 32 chunks"
        />
        <SourceRow
          variant="list"
          status="indexing"
          icon={<FilePdf />}
          name="research-notes.pdf"
          detail="9 of 12 pages read"
          progress={12}
        />
        <SourceRow
          variant="list"
          status="failed"
          icon={<FilePdf />}
          name="broken-scan.pdf"
          detail="Parse failed · password protected"
          onRetry={() => setRetries((count) => count + 1)}
        />
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        Custom stages
      </HoronText>
      <SourceRow
        status="indexing"
        icon={<FileText />}
        name="manual.md"
        detail="Chunking"
        progress={40}
        stages={["done", "active", "todo", "todo"]}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        retries pressed {retries} times
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
