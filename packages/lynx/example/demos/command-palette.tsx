import { useState } from "@lynx-js/react";

import { Button } from "../../src/components/button";
import { CommandPalette, type CommandGroup } from "../../src/components/command-palette";
import { Icon } from "../../src/icons";
import { Kbd } from "../../src/components/kbd";
import { formatShortcut } from "../../src/lib/platform";
import { usePlatform } from "../../src/hooks/use-platform";

import { Backdrop } from "./backdrop";

const groups: CommandGroup[] = [
  {
    label: "Bots",
    items: [
      { value: "chief", label: "Chief of staff", meta: "Horon HQ", tile: "C" },
      {
        value: "inbox",
        label: "Inbox Manager",
        meta: "Horon HQ",
        tile: "I",
        tileClassName: "bg-accent-sky-500-90",
      },
    ],
  },
  {
    label: "Projects",
    items: [
      { value: "q4", label: "Q4 hiring", tile: <Icon name="Folder" size={16} color="text-primary" /> },
    ],
  },
  {
    label: "Actions",
    items: [
      {
        value: "new",
        label: "New bot",
        tile: <Icon name="Plus" size={16} color="text-primary" />,
        hint: <Kbd keys="Mod+N" />,
      },
    ],
  },
];

const hints: [string, string][] = [
  ["↑↓", "Move"],
  ["↵", "Open"],
];

/** Solid and glass palettes behind their own trigger, with grouped rows and key hints. */
export default function CommandPaletteDemo() {
  const [solidOpen, setSolidOpen] = useState(false);
  const [glassOpen, setGlassOpen] = useState(false);
  const { os } = usePlatform();
  const shortcut = formatShortcut("Mod+K", os);

  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col items-center gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Button variant="solid" onClick={() => setSolidOpen(true)}>
          {`Search ${shortcut}`}
        </Button>
        <CommandPalette
          surface="solid"
          open={solidOpen}
          onOpenChange={setSolidOpen}
          groups={groups}
          placeholder="Search bots, projects and routines"
          hints={hints}
        />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Button variant="glass" onClick={() => setGlassOpen(true)}>
          {`Search ${shortcut}`}
        </Button>
        <CommandPalette
          surface="glass"
          open={glassOpen}
          onOpenChange={setGlassOpen}
          groups={groups}
          placeholder="Search bots, projects and routines"
          hints={hints}
        />
      </Backdrop>
    </view>
  );
}
