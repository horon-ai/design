import { Button, CommandPalette } from "@horon-ai/react";
import { Folder, Plus } from "@phosphor-icons/react";
import { useState } from "react";

const groups = [
  {
    label: "Bots",
    items: [
      { value: "chief", label: "Chief of staff", meta: "Horon HQ", tile: "C" },
      { value: "inbox", label: "Inbox Manager", meta: "Horon HQ", tile: "I" },
    ],
  },
  {
    label: "Actions",
    items: [
      { value: "new-bot", label: "New bot", tile: <Plus />, tileClassName: "bg-overlay-ink-5 text-text-primary" },
      { value: "new-project", label: "New project", tile: <Folder />, tileClassName: "bg-overlay-ink-5 text-text-primary" },
    ],
  },
];

export default function CommandPaletteBasic() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="solid" onClick={() => setOpen(true)}>
        Search
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        placeholder="Search bots and actions"
        hints={[
          ["↑↓", "Move"],
          ["↵", "Open"],
        ]}
      />
    </>
  );
}
