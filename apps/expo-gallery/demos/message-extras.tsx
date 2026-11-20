import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ArrowClockwise, Copy, PencilSimple } from "phosphor-react-native";
import {
  Attachment,
  CodeBlock,
  DateSeparator,
  HoronText,
  MessageActions,
} from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function MessageExtrasDemo() {
  const [pressed, setPressed] = useState("none");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Date separator
      </HoronText>
      <DateSeparator>Today</DateSeparator>
      <HoronText variant="label-sm" tone="text-secondary">
        Message actions · solid and glass
      </HoronText>
      <MessageActions
        actions={[
          { label: "Copy", icon: <Copy />, onClick: () => setPressed("Copy") },
          { label: "Regenerate", icon: <ArrowClockwise />, onClick: () => setPressed("Regenerate") },
          { label: "Edit", icon: <PencilSimple />, onClick: () => setPressed("Edit") },
        ]}
      />
      <Backdrop>
        <MessageActions
          surface="glass"
          actions={[
            { label: "Copy", icon: <Copy />, onClick: () => setPressed("Copy") },
            { label: "Regenerate", icon: <ArrowClockwise />, onClick: () => setPressed("Regenerate") },
          ]}
        />
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        Attachment · file, detail, removable
      </HoronText>
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => setPressed("Remove")} />
      <Attachment name="brand-tokens.json" detail="JSON · 12 KB" />
      <HoronText variant="label-sm" tone="text-secondary">
        Code block · copy reads Copied for 1.5s
      </HoronText>
      <CodeBlock language="bash" code={"horon routine run weekly-report\nhoron sources sync"} />
      <HoronText variant="label-sm" tone="text-secondary">
        last action: {pressed}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
