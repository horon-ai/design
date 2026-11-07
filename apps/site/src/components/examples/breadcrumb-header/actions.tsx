import { BreadcrumbHeader } from "@horon-ai/react";

const crumbs = [
  { label: "Horon HQ", tile: "H", href: "#" },
  { label: "Settings" },
];

export default function BreadcrumbHeaderActions() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <BreadcrumbHeader
        className="w-full max-w-97.5"
        crumbs={crumbs}
        onSearch={() => undefined}
        onMore={() => undefined}
      />
      <BreadcrumbHeader className="w-full max-w-97.5" crumbs={crumbs} onSearch={() => undefined} />
      <BreadcrumbHeader className="w-full max-w-97.5" crumbs={crumbs} />
    </div>
  );
}
