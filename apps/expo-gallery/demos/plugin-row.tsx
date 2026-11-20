import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CreditCard, Database } from "phosphor-react-native";
import { HoronText, MenuItem, MenuSeparator, PluginRow } from "@horon-ai/expo";

/** Update-ready and up-to-date rows, a verified author, chips, and switches the demo owns. */
export default function PluginRowDemo() {
  const [enabled, setEnabled] = useState({ stripe: true, postgres: false });
  const [last, setLast] = useState("nothing yet");
  return (
    <View style={styles.stack}>
      <PluginRow
        initials="ST"
        name="Stripe"
        version="2.4.1"
        updateBadge="Update ready"
        author="Stripe"
        verified
        chips={[
          { id: "payments", label: "Payments", icon: <CreditCard size={11} /> },
          { id: "refunds", label: "Refunds" },
        ]}
        enabled={enabled.stripe}
        onEnabledChange={(next) => setEnabled((previous) => ({ ...previous, stripe: next }))}
        onUpdate={() => setLast("update Stripe")}
        menu={
          <>
            <MenuItem onClick={() => setLast("check Stripe")}>Check for updates</MenuItem>
            <MenuSeparator />
            <MenuItem danger onClick={() => setLast("uninstall Stripe")}>
              Uninstall
            </MenuItem>
          </>
        }
      />
      <PluginRow
        initials="PG"
        name="Postgres"
        version="1.0.2"
        author="Horon"
        verified
        chips={[{ id: "sql", label: "SQL", icon: <Database size={11} /> }]}
        enabled={enabled.postgres}
        onEnabledChange={(next) => setEnabled((previous) => ({ ...previous, postgres: next }))}
        menu={<MenuItem onClick={() => setLast("uninstall Postgres")}>Uninstall</MenuItem>}
      />
      <PluginRow
        initials="NT"
        name="Notion export"
        version="0.9.0"
        author="Community"
        toggleLabel="Enable Notion export"
        style={{ borderBottomWidth: 0 }}
      />
      <PluginRow initials="FS" name="Filesystem" version="3.1.0" author="Horon" verified />
      <HoronText variant="caption" tone="text-secondary">
        last action: {last}
      </HoronText>
      <View style={styles.note}>
        <PluginRow
          initials="SL"
          name="Slack bridge"
          version="0.4.0"
          updateBadge="Update ready"
          author="Horon"
          verified
          onUpdate={() => setLast("update Slack bridge")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { maxWidth: 560 },
  note: { borderBottomWidth: 1 },
});
