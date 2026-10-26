import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@horon-ai/react";

const meta = { title: "Web/Dialog", component: Dialog } satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="danger" />}>Delete bot</DialogTrigger>
      <DialogContent
        title="Delete Inbox Manager?"
        description="Its routines and memory are removed. Messages it already sent stay in your inbox."
      >
        <DialogFooter>
          <DialogClose render={<Button variant="glass" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="danger" />}>Delete bot</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
