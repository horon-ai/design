import { BreadcrumbHeader } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

const crumbs = [
  { label: "Horon HQ", tile: "H", href: "#" },
  { label: "Q4 hiring", href: "#" },
  { label: "Chief of staff" },
];

export default function BreadcrumbHeaderSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <BreadcrumbHeader className="w-full max-w-180" surface="solid" crumbs={crumbs} onSearch={() => undefined} onMore={() => undefined} />
      <Backdrop className="flex-col">
        <BreadcrumbHeader
          className="w-full max-w-180"
          surface="glass"
          crumbs={crumbs}
          onSearch={() => undefined}
          onMore={() => undefined}
        />
      </Backdrop>
    </div>
  );
}
