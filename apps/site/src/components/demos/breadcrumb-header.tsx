import { BreadcrumbHeader } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <BreadcrumbHeader
        surface={surface}
        className="w-full max-w-180"
        crumbs={[
          { label: "Horon HQ", tile: "H", href: "#" },
          { label: "Q4 hiring", href: "#" },
          { label: "Chief of staff" },
        ]}
      />
      <BreadcrumbHeader
        surface={surface}
        className="w-full max-w-97.5"
        crumbs={[{ label: "Horon HQ", tile: "H", href: "#" }, { label: "Settings" }]}
      />
    </div>
  );
}

export default function BreadcrumbHeaderDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
