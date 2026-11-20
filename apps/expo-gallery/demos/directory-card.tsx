import { StyleSheet, View } from "react-native";
import { Folder, Globe, HardDrive, NotionLogo } from "phosphor-react-native";
import { DirectoryCard } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Solid and glass cards, with and without the add action, short and long copy. */
export default function DirectoryCardDemo() {
  return (
    <View style={styles.stack}>
      <DirectoryCard
        icon={<Folder />}
        name="Product"
        description="Specs, research and launch notes."
        onAdd={() => undefined}
        addLabel="Connect folder"
      />
      <DirectoryCard
        icon={<Globe />}
        name="Websites"
        description="A description long enough that the card clips it to one line instead of growing."
        onAdd={() => undefined}
      />
      <DirectoryCard icon={<HardDrive />} name="Local drives" />
      <Backdrop>
        <DirectoryCard
          icon={<NotionLogo />}
          name="Notion"
          description="Synced pages and databases."
          surface="glass"
          onAdd={() => undefined}
          addLabel="Connect Notion"
        />
        <DirectoryCard icon={<Folder />} name="Shared drives" surface="glass" />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12, maxWidth: 480 },
});
