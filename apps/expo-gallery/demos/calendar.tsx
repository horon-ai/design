import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, DateField, HoronText, type DateRange } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function CalendarDemo() {
  const [day, setDay] = useState<Date | null>(new Date(2026, 10, 20));
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Single mode · three sizes</HoronText>
      <Calendar size="sm" value={day} onValueChange={setDay} />
      <Calendar size="md" value={day} onValueChange={setDay} />
      <Calendar size="lg" value={day} onValueChange={setDay} />

      <HoronText variant="label-md">Range mode, week starting Monday</HoronText>
      <Calendar mode="range" weekStartsOn={1} value={range} onValueChange={setRange} />

      <HoronText variant="label-md">Popover variant and surfaces</HoronText>
      <Calendar variant="popover" value={day} onValueChange={setDay} />
      <View style={styles.row}>
        <Calendar surface="flat" value={day} onValueChange={setDay} />
      </View>
      <Backdrop>
        <Calendar surface="glass" value={day} onValueChange={setDay} />
      </Backdrop>

      <HoronText variant="label-md">Disabled days and highlighted week</HoronText>
      <Calendar
        value={day}
        onValueChange={setDay}
        isDateDisabled={(date) => date.getDay() === 0 || date.getDay() === 6}
        highlight={[new Date(2026, 10, 16), new Date(2026, 10, 17), new Date(2026, 10, 18)]}
      />

      <HoronText variant="label-md">Date field · three sizes</HoronText>
      <DateField size="sm" value={day} onValueChange={setDay} />
      <DateField size="md" value={day} onValueChange={setDay} />
      <DateField size="lg" value={day} onValueChange={setDay} placeholder="Pick a date" />

      <HoronText variant="label-md">Date field states and surfaces</HoronText>
      <DateField value={null} invalid onValueChange={setDay} />
      <DateField value={day} disabled onValueChange={setDay} />
      <DateField mode="range" value={range} onValueChange={setRange} />
      <Backdrop>
        <DateField surface="glass" value={day} onValueChange={setDay} />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { alignItems: "flex-start" },
});
