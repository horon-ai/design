import { HoronGlyph, HoronIcon } from "@horon-ai/react";

export default function HoronIconThumbnail() {
  return (
    <div className="flex items-center gap-6 text-text-primary">
      <HoronIcon size={28} />
      <HoronGlyph name="sparkles" size={24} />
      <HoronGlyph name="bot" size={24} />
      <HoronGlyph name="search" size={24} />
      <HoronGlyph name="folder" size={24} />
    </div>
  );
}
