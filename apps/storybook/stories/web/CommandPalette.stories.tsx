import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, CommandPalette, Kbd } from "@horon-ai/react";
import { ArrowElbowDownLeft, Folder, Plus, Repeat } from "@phosphor-icons/react";
import { useState } from "react";

const groups = [
  {
    label: "Bots",
    items: [
      {
        value: "chief",
        label: "Chief of staff",
        meta: "Horon HQ",
        tile: "C",
        tileClassName: "bg-interactive-primary text-text-inverse",
        hint: (
          <Kbd>
            Open <ArrowElbowDownLeft />
          </Kbd>
        ),
      },
      {
        value: "inbox",
        label: "Inbox Manager",
        meta: "Horon HQ",
        tile: "I",
        tileClassName: "bg-sky-500 text-text-inverse",
      },
    ],
  },
  { label: "Projects", items: [{ value: "q4", label: "Q4 hiring", tile: <Folder /> }] },
  {
    label: "Actions",
    items: [
      { value: "new", label: "New bot", tile: <Plus />, hint: <Kbd>⌘N</Kbd> },
      { value: "routine", label: "Run routine", tile: <Repeat />, hint: <Kbd>⌘R</Kbd> },
    ],
  },
];

const meta = { title: "Web/CommandPalette", component: CommandPalette, args: { groups } } satisfies Meta<
  typeof CommandPalette
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="glass" onClick={() => setOpen(true)}>
          Search ⌘K
        </Button>
        <CommandPalette
          {...args}
          open={open}
          onOpenChange={setOpen}
          placeholder="Search bots, projects and routines"
          hints={[
            ["↑↓", "Move"],
            ["↵", "Open"],
          ]}
        />
      </>
    );
  },
};
