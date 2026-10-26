import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntegrationRow } from "@horon-ai/react";
import { CalendarBlank, ChatCircle, EnvelopeSimple } from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/IntegrationRow",
  component: IntegrationRow,
  decorators: [onBackdrop],
  args: { icon: <EnvelopeSimple />, name: "Gmail", detail: "alpoxdev@gmail.com · Read, draft", status: "connected" },
} satisfies Meta<typeof IntegrationRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: (args) => (
    <div className="flex w-110 flex-col gap-3">
      <IntegrationRow {...args} />
      <IntegrationRow
        icon={<CalendarBlank />}
        name="Google Calendar"
        detail="Access expired 2 days ago"
        status="reconnect"
      />
      <IntegrationRow icon={<ChatCircle />} name="Slack" detail="Post updates to a channel" status="not-connected" />
    </div>
  ),
};
