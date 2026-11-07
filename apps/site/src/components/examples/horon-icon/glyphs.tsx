import { HoronGlyph } from "@horon-ai/react";

const tones = ["text-text-primary", "text-text-secondary", "text-text-brand"] as const;
const sizes = [16, 20, 24] as const;

export default function HoronIconGlyphs() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {tones.map((tone) => (
        <div key={tone} className={`flex items-center gap-3 ${tone}`}>
          {sizes.map((size) => (
            <HoronGlyph key={size} name="sparkles" size={size} />
          ))}
        </div>
      ))}
    </div>
  );
}
