import { StyleSheet, View } from "react-native";
import { Button, ModalClose, ModalContent, ModalFooter, ModalTrigger, Modal, HoronText } from "@horon-ai/expo";

/** One modal, wired the way a settings screen saves a longer form. */
function WorkspaceModal({ size, surface }: { size: "sm" | "md" | "lg"; surface: "solid" | "glass" }) {
  return (
    <Modal>
      <ModalTrigger render={<Button variant="solid" />}>
        {size} · {surface}
      </ModalTrigger>
      <ModalContent
        title={`Rename workspace (${size})`}
        description="This changes the name for every member."
        size={size}
        surface={surface}
        footer={
          <ModalFooter>
            <ModalClose render={<Button variant="solid" />}>Cancel</ModalClose>
            <ModalClose>Save</ModalClose>
          </ModalFooter>
        }
      >
        <HoronText variant="body-sm" tone="text-secondary">
          Only this body scrolls once the panel reaches the window height; the header and the footer stay
          put. The close control, the scrim and the Android back button all dismiss it.
        </HoronText>
      </ModalContent>
    </Modal>
  );
}

export default function ModalDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="title-sm">Modal</HoronText>
      <HoronText variant="body-sm" tone="text-secondary">
        Three widths, two surfaces. The panel pads itself by the safe-area insets and caps at the window
        height minus 32pt.
      </HoronText>
      <WorkspaceModal size="sm" surface="solid" />
      <WorkspaceModal size="md" surface="solid" />
      <WorkspaceModal size="lg" surface="glass" />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
