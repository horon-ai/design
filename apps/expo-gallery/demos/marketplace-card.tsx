import { StyleSheet, View } from "react-native";
import { CheckCircle, ShieldCheck } from "phosphor-react-native";
import { MarketplaceCard } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Solid and glass cards with chips, rating and install count, plus a bare one. */
export default function MarketplaceCardDemo() {
  return (
    <View style={styles.stack}>
      <MarketplaceCard
        initials="GH"
        name="GitHub"
        author="by Horon"
        description="Read repositories, open pull requests and follow releases across the workspace."
        chips={[
          { id: "official", label: "Official", icon: <ShieldCheck size={12} /> },
          { id: "oauth", label: "OAuth", icon: <CheckCircle size={12} /> },
        ]}
        score="4.8"
        installs="12k installs"
        onInstall={() => undefined}
      />
      <MarketplaceCard
        initials="LN"
        name="Linear"
        author="by Horon"
        description="Open issues and update projects from a run."
        chips={[{ id: "official", label: "Official" }]}
        score="4.6"
        onInstall={() => undefined}
        installLabel="Add Linear"
      />
      <MarketplaceCard initials="FG" name="Figma" installs="980 installs" />
      <Backdrop>
        <MarketplaceCard
          initials="NT"
          name="Notion"
          author="by Horon"
          description="Search pages and append notes to a database."
          chips={[{ id: "beta", label: "Beta" }]}
          score="4.2"
          installs="2.1k installs"
          surface="glass"
          onInstall={() => undefined}
        />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16, maxWidth: 440 },
});
