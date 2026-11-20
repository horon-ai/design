import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Clock } from "phosphor-react-native";
import {
  HoronText,
  PickerField,
  ScheduleCard,
  ScheduleSection,
  WeekdayPicker,
  useHoronTheme,
} from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

const REPEAT = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const TIMES = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "18:30", label: "6:30 PM" },
];

const DAYS = [
  { value: "mon", label: "M", name: "Monday" },
  { value: "tue", label: "T", name: "Tuesday" },
  { value: "wed", label: "W", name: "Wednesday" },
  { value: "thu", label: "T", name: "Thursday" },
  { value: "fri", label: "F", name: "Friday" },
  { value: "sat", label: "S", name: "Saturday" },
  { value: "sun", label: "S", name: "Sunday" },
];

export default function ScheduleDemo() {
  const theme = useHoronTheme();
  const [repeat, setRepeat] = useState("weekly");
  const [time, setTime] = useState("09:00");
  const [days, setDays] = useState<string[]>(["mon", "wed", "fri"]);
  const [glassRepeat, setGlassRepeat] = useState("daily");

  return (
    <View style={styles.stack}>
      <ScheduleCard title="Morning digest" nextRun="Next run tomorrow at 9:00 AM">
        <ScheduleSection label="Repeat">
          <PickerField
            aria-label="Repeat"
            surface="inset"
            items={REPEAT}
            value={repeat}
            onValueChange={(next) => next && setRepeat(next)}
          />
        </ScheduleSection>
        <ScheduleSection label="Time">
          <PickerField
            aria-label="Start time"
            surface="inset"
            icon={<Clock size={16} color={theme.color("text-secondary")} />}
            items={TIMES}
            value={time}
            onValueChange={(next) => next && setTime(next)}
          />
        </ScheduleSection>
        <ScheduleSection label="Days">
          <WeekdayPicker aria-label="Repeat on" days={DAYS} value={days} onValueChange={setDays} />
        </ScheduleSection>
      </ScheduleCard>

      <HoronText variant="label-sm" tone="text-secondary">
        Card sizes · sm and lg, without a next-run strip
      </HoronText>
      <ScheduleCard title="Small" size="sm">
        <ScheduleSection label="Repeat" size="sm">
          <PickerField aria-label="Small repeat" size="sm" items={REPEAT} defaultValue="daily" />
        </ScheduleSection>
      </ScheduleCard>
      <ScheduleCard title="Large" size="lg" nextRun="Next run in 3 hours">
        <ScheduleSection label="Time" size="lg">
          <PickerField aria-label="Large time" size="lg" items={TIMES} defaultValue="18:30" />
        </ScheduleSection>
        <ScheduleSection label="Days" size="lg">
          <WeekdayPicker aria-label="Large days" size="lg" days={DAYS} defaultValue={["sat", "sun"]} />
        </ScheduleSection>
      </ScheduleCard>

      <HoronText variant="label-sm" tone="text-secondary">
        Picker surfaces · solid, glass and inset; day circles at three rungs
      </HoronText>
      <View style={styles.row}>
        <PickerField aria-label="Solid" surface="solid" items={REPEAT} defaultValue="weekly" />
        <PickerField aria-label="Inset" surface="inset" items={REPEAT} defaultValue="monthly" />
        <PickerField aria-label="Small" size="sm" items={REPEAT} defaultValue="daily" />
      </View>
      <WeekdayPicker aria-label="Small days" size="sm" days={DAYS} defaultValue={["mon"]} />
      <WeekdayPicker aria-label="Medium days" size="md" days={DAYS} defaultValue={["tue", "thu"]} />
      <WeekdayPicker aria-label="Large days" size="lg" days={DAYS} defaultValue={["fri"]} />

      <Backdrop>
        <ScheduleCard title="Glass routine" surface="glass" nextRun="Next run Sunday at 6:30 PM">
          <ScheduleSection label="Repeat">
            <PickerField
              aria-label="Glass repeat"
              surface="glass"
              items={REPEAT}
              value={glassRepeat}
              onValueChange={(next) => next && setGlassRepeat(next)}
            />
          </ScheduleSection>
        </ScheduleCard>
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
