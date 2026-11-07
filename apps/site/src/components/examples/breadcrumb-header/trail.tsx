import { BreadcrumbHeader } from "@horon-ai/react";

export default function BreadcrumbHeaderTrail() {
  return (
    <BreadcrumbHeader
      className="w-full max-w-80"
      crumbs={[
        { label: "Horon HQ", tile: "H", href: "#" },
        { label: "Projects", href: "#" },
        { label: "Q4 hiring", href: "#" },
        { label: "Interview notes for the chief of staff" },
      ]}
      onSearch={() => undefined}
    />
  );
}
