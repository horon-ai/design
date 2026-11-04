import { BreadcrumbHeader } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function BreadcrumbHeaderDemo() {
  return (
    <Backdrop className="flex-col">
      <BreadcrumbHeader
        surface="glass"
        className="w-full max-w-180"
        crumbs={[
          { label: "Horon HQ", tile: "H", href: "#" },
          { label: "Q4 hiring", href: "#" },
          { label: "Chief of staff" },
        ]}
      />
      <BreadcrumbHeader
        surface="glass"
        className="w-full max-w-97.5"
        crumbs={[{ label: "Horon HQ", tile: "H", href: "#" }, { label: "Settings" }]}
      />
      <BreadcrumbHeader
        className="w-full max-w-180"
        crumbs={[
          { label: "Horon HQ", tile: "H", href: "#" },
          { label: "Q4 hiring", href: "#" },
          { label: "Chief of staff" },
        ]}
      />
    </Backdrop>
  );
}
