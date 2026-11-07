import { Button, CommandPalette } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../../demo-backdrop";

const groups = [
  {
    label: "Bots",
    items: [
      { value: "chief", label: "Chief of staff", meta: "Horon HQ", tile: "C" },
      { value: "sales", label: "Sales Outbound", meta: "Horon Labs", tile: "S" },
    ],
  },
];

export default function CommandPaletteGlass() {
  const [open, setOpen] = useState(false);
  return (
    <Backdrop>
      <Button variant="glass" onClick={() => setOpen(true)}>
        Search commands
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={groups} surface="glass" placeholder="Search" />
    </Backdrop>
  );
}
