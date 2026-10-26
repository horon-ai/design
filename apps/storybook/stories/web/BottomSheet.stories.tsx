import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BottomSheet,
  BottomSheetAction,
  BottomSheetActions,
  BottomSheetContent,
  BottomSheetRow,
  BottomSheetTrigger,
  Button,
} from "@horon-ai/react";
import { Bell, CalendarBlank, EnvelopeSimple, GearSix } from "@phosphor-icons/react";

const meta = { title: "Web/BottomSheet", component: BottomSheet } satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <BottomSheet>
      <BottomSheetTrigger render={<Button />}>Open sheet</BottomSheetTrigger>
      <BottomSheetContent title="Chief of staff">
        <BottomSheetRow icon={<Bell />} value="On">
          Notifications
        </BottomSheetRow>
        <BottomSheetRow icon={<CalendarBlank />} value="Weekdays">
          Schedule
        </BottomSheetRow>
        <BottomSheetRow icon={<EnvelopeSimple />} value="Email">
          Reports to
        </BottomSheetRow>
        <BottomSheetRow icon={<GearSix />}>Bot settings</BottomSheetRow>
        <BottomSheetActions>
          <BottomSheetAction>Pause</BottomSheetAction>
          <BottomSheetAction variant="primary">Open chat</BottomSheetAction>
        </BottomSheetActions>
      </BottomSheetContent>
    </BottomSheet>
  ),
};
