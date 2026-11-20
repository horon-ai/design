import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FileDrop, HoronText, type FileDropFile } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function FileDropDemo() {
  const [files, setFiles] = useState<FileDropFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const report = (picked: FileDropFile[]) => {
    setFiles(picked);
    setUploading(true);
    setTimeout(() => setUploading(false), 1200);
  };

  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Solid target</HoronText>
      <FileDrop
        label={files.length ? `${files.length} file(s) picked` : "Tap to choose PDFs or images"}
        accept=".pdf,image/*"
        multiple
        uploading={uploading}
        onFiles={report}
      />
      <HoronText variant="caption" tone="text-secondary">
        {files.length > 0
          ? files.map((file) => file.name).join(", ")
          : "A tap opens the system document picker; the picked files arrive through onFiles."}
      </HoronText>

      <HoronText variant="label-md">Rejected, disabled and uploading</HoronText>
      <FileDrop label="Rejected upload" rejected onFiles={report} />
      <FileDrop label="Disabled" disabled onFiles={report} />
      <FileDrop label="Upload in progress" uploading onFiles={report} />

      <HoronText variant="label-md">Glass target over imagery</HoronText>
      <Backdrop>
        <FileDrop label="Drop a contract here" surface="glass" accept=".pdf" onFiles={report} />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
