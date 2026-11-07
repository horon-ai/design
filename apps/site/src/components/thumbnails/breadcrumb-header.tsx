import { BreadcrumbHeader } from "@horon-ai/react";

export default function BreadcrumbHeaderThumbnail() {
  return (
    <BreadcrumbHeader
      className="w-80"
      onSearch={() => undefined}
      onMore={() => undefined}
      crumbs={[{ label: "Horon HQ", tile: "H", href: "#" }, { label: "Settings" }]}
    />
  );
}
