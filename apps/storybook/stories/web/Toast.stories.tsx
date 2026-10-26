import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Toaster, useToast } from "@horon-ai/react";

import { onBackdrop } from "../support";

function Triggers() {
  const toast = useToast();
  return (
    <div className="flex gap-2">
      <Button
        variant="glass"
        onClick={() => toast.add({ title: "Saved", description: "The routine runs every morning at 8." })}
      >
        Neutral
      </Button>
      <Button
        variant="glass"
        onClick={() =>
          toast.add({ type: "success", title: "Sent to the team", description: "Q3 board deck v5 is in #board." })
        }
      >
        Success
      </Button>
      <Button
        variant="glass"
        onClick={() =>
          toast.add({
            type: "danger",
            title: "Couldn't reach Gmail",
            description: "Reconnect to keep Inbox Manager running.",
          })
        }
      >
        Danger
      </Button>
    </div>
  );
}

const meta = {
  title: "Web/Toast",
  component: Toaster,
  decorators: [onBackdrop],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toaster>
      <Triggers />
    </Toaster>
  ),
};
