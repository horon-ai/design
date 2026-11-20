import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GithubLogo, GoogleDriveLogo, NotionLogo, SlackLogo } from "phosphor-react-native";
import { HoronText, IntegrationRow } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

const services = [
  { id: "slack", name: "Slack", icon: <SlackLogo />, detail: "horon.slack.com · 4 scopes" },
  { id: "github", name: "GitHub", icon: <GithubLogo />, detail: "horon-ai · read and write" },
  { id: "notion", name: "Notion", icon: <NotionLogo />, detail: "Token expired on Oct 12" },
  { id: "drive", name: "Google Drive", icon: <GoogleDriveLogo />, detail: "Files, folders and shared drives" },
];

/** All three states on both surfaces, with the action reporting which service it touched. */
export default function IntegrationRowDemo() {
  const [last, setLast] = useState("nothing yet");
  return (
    <View style={styles.stack}>
      <View style={styles.list}>
        <IntegrationRow
          icon={services[0].icon}
          name={services[0].name}
          detail={services[0].detail}
          status="connected"
        />
        <IntegrationRow
          icon={services[1].icon}
          name={services[1].name}
          detail={services[1].detail}
          status="connected"
        />
        <IntegrationRow
          icon={services[2].icon}
          name={services[2].name}
          detail={services[2].detail}
          status="reconnect"
          onAction={() => setLast("reconnect Notion")}
        />
      </View>
      <View style={styles.list}>
        <IntegrationRow
          icon={services[3].icon}
          name={services[3].name}
          detail={services[3].detail}
          status="not-connected"
          connectLabel="Link Drive"
          onAction={() => setLast("connect Drive")}
        />
        <IntegrationRow icon={<GithubLogo />} name="GitHub" status="not-connected" />
      </View>
      <Backdrop>
        <View style={styles.list}>
          <IntegrationRow
            icon={<NotionLogo />}
            name="Notion"
            detail="horon.notion.so · 2 scopes"
            status="connected"
            surface="glass"
          />
          <IntegrationRow
            icon={<SlackLogo />}
            name="Slack"
            status="reconnect"
            surface="glass"
            onAction={() => setLast("reconnect Slack")}
          />
          <IntegrationRow
            icon={<GoogleDriveLogo />}
            name="Google Drive"
            status="not-connected"
            surface="glass"
            onAction={() => setLast("connect Drive")}
          />
        </View>
      </Backdrop>
      <HoronText variant="caption" tone="text-secondary">
        last action: {last}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  list: { gap: 12, maxWidth: 480 },
});
