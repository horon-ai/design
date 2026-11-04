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
  {
    label: "Projects",
    items: [
      {
        value: "q4",
        label: "Q4 hiring",
        tile: <Folder />,
        tileClassName: "bg-overlay-ink-5 text-text-primary",
      },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        value: "new",
        label: "New bot",
        tile: <Plus />,
        tileClassName: "bg-overlay-ink-5 text-text-primary",
        hint: <Kbd>⌘N</Kbd>,
      },
    ],
  },
];

const hints: [string, string][] = [
  ["↑↓", "Move"],
  ["↵", "Open"],
];

export default function CommandPaletteDemo() {
  const [glassOpen, setGlassOpen] = useState(false);
  const [solidOpen, setSolidOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="glass" onClick={() => setGlassOpen(true)}>
        Search ⌘K
      </Button>
      <Button variant="solid" onClick={() => setSolidOpen(true)}>
        Search (solid)
      </Button>
      <CommandPalette
        surface="glass"
        open={glassOpen}
        onOpenChange={setGlassOpen}
        groups={groups}
        placeholder="Search bots, projects and routines"
        hints={hints}
      />
      <CommandPalette
        open={solidOpen}
        onOpenChange={setSolidOpen}
        groups={groups}
        placeholder="Search bots, projects and routines"
        hints={hints}
      />
    </div>
  );
}
