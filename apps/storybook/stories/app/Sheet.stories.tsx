import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Stack, Text } from "@horon/app";
import { Sheet, SheetDescription, SheetHeader, SheetTitle } from "@horon/app/components/Sheet";

const meta = {
  title: "App/Sheet",
  component: Sheet,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  args: { open: true, side: "right", children: null },
  render: () => (
    <Sheet open side="right">
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>Refine the results shown in the table.</SheetDescription>
      </SheetHeader>
      <Stack gap={2}>
        <Text>Status: Active</Text>
        <Text>Owner: Anyone</Text>
        <Text>Updated: Last 30 days</Text>
      </Stack>
      <Button>Apply filters</Button>
    </Sheet>
  ),
};

export const Bottom: Story = {
  args: { open: true, side: "bottom", children: null },
  render: () => (
    <Sheet open side="bottom">
      <SheetHeader>
        <SheetTitle>Share</SheetTitle>
        <SheetDescription>Choose how to share this document.</SheetDescription>
      </SheetHeader>
      <Stack gap={2}>
        <Button variant="outline">Copy link</Button>
        <Button variant="outline">Email</Button>
      </Stack>
    </Sheet>
  ),
};

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open sheet</Button>
      <Sheet open={open} onOpenChange={setOpen} side="right">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Manage your alerts.</SheetDescription>
        </SheetHeader>
        <Button variant="outline" onPress={() => setOpen(false)}>
          Close
        </Button>
      </Sheet>
    </>
  );
}

export const Interactive: Story = {
  args: { open: false, children: null },
  render: () => <SheetDemo />,
};
