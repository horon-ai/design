import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, Select, type SelectItemData } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

const COUNTRIES: SelectItemData[] = [
  { value: "kr", label: "South Korea", selectedLabel: "+82" },
  { value: "jp", label: "Japan", selectedLabel: "+81" },
  { value: "us", label: "United States", selectedLabel: "+1" },
  { value: "gb", label: "United Kingdom", selectedLabel: "+44", disabled: true },
];

export default function SelectDemo() {
  const [country, setCountry] = useState<string | null>("kr");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Field · three sizes</HoronText>
      <Select aria-label="Country" size="sm" items={COUNTRIES} defaultValue="jp" />
      <Select aria-label="Country" size="md" items={COUNTRIES} defaultValue="kr" />
      <Select aria-label="Country" size="lg" items={COUNTRIES} placeholder="Pick a country" />

      <HoronText variant="label-md">Controlled, with its chosen label</HoronText>
      <Select aria-label="Country" items={COUNTRIES} value={country} onValueChange={setCountry} />
      <HoronText variant="caption" tone="text-secondary">
        value: {country ?? "none"}
      </HoronText>

      <HoronText variant="label-md">States</HoronText>
      <Select aria-label="Country" items={COUNTRIES} invalid />
      <Select aria-label="Country" items={COUNTRIES} disabled defaultValue="kr" />
      <Select aria-label="Country" items={COUNTRIES} showIndicator={false} placeholder="No caret" />

      <HoronText variant="label-md">Chip variant</HoronText>
      <View style={styles.row}>
        <Select aria-label="Filter country" variant="chip" items={COUNTRIES} placeholder="Country" />
        <Select aria-label="Filter size" variant="chip" items={COUNTRIES} defaultValue="jp" />
      </View>

      <HoronText variant="label-md">Surfaces</HoronText>
      <Select aria-label="Country" items={COUNTRIES} surface="solid-on-page" defaultValue="kr" />
      <Backdrop>
        <Select aria-label="Country" items={COUNTRIES} surface="glass" defaultValue="jp" />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
