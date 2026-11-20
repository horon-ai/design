import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FileText, Image } from "phosphor-react-native";
import { Chip, HoronText } from "@horon-ai/expo";

/** The three rungs, uncontrolled and controlled toggles, an icon child and the disabled chip. */
export default function ChipDemo() {
  const [documents, setDocuments] = useState(true);
  const [images, setImages] = useState(false);

  return (
    <View style={styles.stack}>
      <View style={styles.row}>
        <Chip size="sm">Small</Chip>
        <Chip size="md">Medium</Chip>
        <Chip size="lg">Large</Chip>
      </View>
      <View style={styles.row}>
        <Chip defaultPressed>Documents</Chip>
        <Chip>Images</Chip>
        <Chip>
          <FileText size={14} /> Files
        </Chip>
        <Chip disabled>Archived</Chip>
      </View>
      <View style={styles.row}>
        <Chip pressed={documents} onPressedChange={setDocuments}>
          Documents
        </Chip>
        <Chip pressed={images} onPressedChange={setImages}>
          <Image size={14} /> Images
        </Chip>
      </View>
      <HoronText tone="text-secondary">
        documents {documents ? "on" : "off"} · images {images ? "on" : "off"}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
});
