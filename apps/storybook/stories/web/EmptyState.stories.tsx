import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, EmptyState } from "@horon-ai/react";

function Mascot({ pose }: { pose: string }) {
  const src = new URL(`../../../../assets/horon-mascot-${pose}.png`, import.meta.url).href;
  return (
    <span
      aria-hidden
      className="block size-full bg-contain bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${JSON.stringify(src)})` }}
    />
  );
}

const meta = { title: "Web/EmptyState", component: EmptyState } satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoBots: Story = {
  args: {
    illustration: <Mascot pose="welcome" />,
    title: "Meet your first bot",
    description: "Give it a role and a task. It keeps working after you close the laptop.",
    action: <Button>Create a bot</Button>,
  },
};

export const NoResults: Story = {
  args: {
    illustration: <Mascot pose="search" />,
    title: "Nothing matches",
    description: "Try another name or clear the filter.",
    action: <Button>Clear filter</Button>,
  },
};

export const Error: Story = {
  args: {
    illustration: <Mascot pose="error" />,
    title: "Something went wrong",
    description: "We could not load your bots. Check the connection and try again.",
    action: <Button variant="glass">Try again</Button>,
  },
};
