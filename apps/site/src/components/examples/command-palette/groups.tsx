import { Button, CommandPalette, Kbd } from "@horon-ai/react";
import { FileText, Folder, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useState } from "react";

const groups = [
  {
    label: "Projects",
    items: [
      {
        value: "q4-hiring",
        label: "Q4 hiring",
        keywords: "recruiting pipeline",
        meta: "Horon HQ",
        tile: <Folder />,
        tileClassName: "bg-overlay-ink-5 text-text-primary",
        hint: <Kbd keys="Mod+Enter" />,
      },
      {
        value: "board-deck",
        label: "Q3 board deck",
        keywords: "slides deck",
        meta: "Horon HQ",
        tile: <FileText />,
        tileClassName: "bg-accent-sky-500-16 text-text-brand",
      },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        value: "new-bot",
        label: "New bot",
        keywords: "create agent",
        tile: <Plus />,
        tileClassName: "bg-overlay-ink-5 text-text-primary",
        hint: <Kbd keys="Mod+N" />,
      },
      {
        value: "search-docs",
        label: "Search docs",
        keywords: "help manual",
        tile: <MagnifyingGlass />,
        tileClassName: "bg-overlay-ink-5 text-text-primary",
      },
    ],
  },
];

export default function CommandPaletteGroups() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="solid" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        placeholder="Search projects and actions"
        empty="Nothing matches that name."
        hints={[
          ["↑↓", "Move"],
          ["↵", "Open"],
          ["esc", "Close"],
        ]}
      />
    </>
  );
}
