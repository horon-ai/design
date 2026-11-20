import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { DateField, HoronText, type DateRange } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function DateFieldDemo() {
  const [day, setDay] = useState<Date | null>(new Date(2026, 9, 20));
  const [range, setRange] = useState<DateRange>({ start: new Date(2026, 9, 20), end: new Date(2026, 9, 24) });
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Three sizes</HoronText>
      <DateField locale="en-US" size="sm" value={day} onValueChange={setDay} />
      <DateField locale="en-US" size="md" value={day} onValueChange={setDay} />
      <DateField locale="en-US" size="lg" value={day} onValueChange={setDay} />

      <HoronText variant="label-md">Placeholder, range and custom format</HoronText>
      <DateField locale="en-US" value={null} onValueChange={setDay} placeholder="Pick a date" />
      <DateField locale="en-US" mode="range" value={range} onValueChange={setRange} />
      <DateField
        locale="en-US"
        value={day}
        onValueChange={setDay}
        format={(value) => (value instanceof Date ? value.toISOString().slice(0, 10) : "range")}
      />

      <HoronText variant="label-md">States</HoronText>
      <DateField locale="en-US" value={null} invalid onValueChange={setDay} />
      <DateField locale="en-US" value={day} disabled onValueChange={setDay} />

      <HoronText variant="label-md">Surfaces</HoronText>
      <DateField locale="en-US" surface="solid-on-page" value={day} onValueChange={setDay} />
      <Backdrop>
        <DateField locale="en-US" surface="glass" value={day} onValueChange={setDay} />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
