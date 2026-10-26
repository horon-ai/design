import { Button, CommandPalette, Kbd } from "@horon-ai/react";
import { Folder, Plus } from "@phosphor-icons/react";
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
  { label: "Actions", items: [{ value: "new", label: "New bot", tile: <Plus />, hint: <Kbd>⌘N</Kbd> }] },
];

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="glass" onClick={() => setOpen(true)}>
        Search ⌘K
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        placeholder="Search bots, projects and routines"
        hints={[
          ["↑↓", "Move"],
          ["↵", "Open"],
        ]}
      />
    </>
  );
}
