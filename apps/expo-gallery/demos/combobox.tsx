import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Combobox, HoronText, type ComboboxItemData } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

const COUNTRIES: ComboboxItemData[] = [
  { value: "+82", label: "+82 South Korea", selectedLabel: "+82", keywords: ["KR", "Korea"] },
  { value: "+81", label: "+81 Japan", selectedLabel: "+81", keywords: ["JP"], trailing: "JP" },
  { value: "+1", label: "+1 United States", selectedLabel: "+1", keywords: ["US"], trailing: "US" },
  { value: "+44", label: "+44 United Kingdom", selectedLabel: "+44", keywords: ["UK", "GB"], disabled: true },
];

export default function ComboboxDemo() {
  const [single, setSingle] = useState<string | null>("+82");
  const [multi, setMulti] = useState<readonly string[]>(["+82"]);
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Single select, searchable</HoronText>
      <Combobox aria-label="Country code" items={COUNTRIES} value={single} onValueChange={setSingle} />
      <HoronText variant="caption" tone="text-secondary">
        value: {single ?? "none"}
      </HoronText>

      <HoronText variant="label-md">Sizes</HoronText>
      <Combobox aria-label="Country code" size="sm" items={COUNTRIES} />
      <Combobox aria-label="Country code" size="md" items={COUNTRIES} />
      <Combobox aria-label="Country code" size="lg" items={COUNTRIES} />

      <HoronText variant="label-md">Multiple, with removable chips</HoronText>
      <Combobox aria-label="Country codes" multiple items={COUNTRIES} value={multi} onValueChange={setMulti} />
      <HoronText variant="caption" tone="text-secondary">
        value: {multi.join(", ") || "none"}
      </HoronText>

      <HoronText variant="label-md">States</HoronText>
      <Combobox aria-label="Country code" items={COUNTRIES} invalid />
      <Combobox aria-label="Country code" items={COUNTRIES} disabled defaultValue="+82" />

      <HoronText variant="label-md">Surfaces</HoronText>
      <Combobox aria-label="Country code" items={COUNTRIES} surface="solid-on-page" />
      <Backdrop>
        <Combobox aria-label="Country code" items={COUNTRIES} surface="glass" defaultValue="+81" />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
