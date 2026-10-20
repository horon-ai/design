import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Text } from "@horon/app";
import { Empty } from "@horon/app/components/Empty";

const meta = {
  title: "App/Empty",
  component: Empty,
  parameters: { layout: "padded" },
  args: { title: "No projects yet" },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Empty title="No projects yet" />,
};

export const WithDescription: Story = {
  render: () => (
    <Empty
      title="No projects yet"
      description="Create your first project to get started. You can always invite teammates later."
      action={<Button>New project</Button>}
      style={{ width: 420 }}
    />
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Empty
      title="Inbox zero"
      description="You have read everything. Nice work."
      icon={<Text variant="subtitle">✓</Text>}
      style={{ width: 420 }}
    />
  ),
};
