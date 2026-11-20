import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MagnifyingGlass, User } from "phosphor-react-native";
import { HoronText, Input } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function InputDemo() {
  const [query, setQuery] = useState("");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Solid, md, with a leading icon</HoronText>
      <Input
        accessibilityLabel="Search agents"
        icon={<MagnifyingGlass />}
        placeholder="Search agents"
        value={query}
        onChange={setQuery}
      />
      <HoronText variant="caption" tone="text-secondary">
        typed: {query || "—"}
      </HoronText>

      <HoronText variant="label-md">Sizes</HoronText>
      <Input accessibilityLabel="Small field" size="sm" placeholder="sm · 32pt" />
      <Input accessibilityLabel="Medium field" size="md" placeholder="md · 40pt" />
      <Input accessibilityLabel="Large field" size="lg" placeholder="lg · 48pt" />

      <HoronText variant="label-md">States</HoronText>
      <Input accessibilityLabel="Invalid field" invalid placeholder="Invalid" defaultValue="not-an-address" />
      <Input accessibilityLabel="Disabled field" disabled placeholder="Disabled" defaultValue="Locked" />
      <Input accessibilityLabel="Read-only field" readOnly defaultValue="Read-only" icon={<User />} />
      <Input accessibilityLabel="Password field" type="password" placeholder="Password" />
      <Input accessibilityLabel="Search field" type="email" confirmType="search" placeholder="you@example.com" />

      <HoronText variant="label-md">Surfaces</HoronText>
      <Input accessibilityLabel="On-page field" surface="solid-on-page" placeholder="solid-on-page" />
      <Backdrop>
        <Input accessibilityLabel="Glass field" surface="glass" placeholder="glass" icon={<MagnifyingGlass />} />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
