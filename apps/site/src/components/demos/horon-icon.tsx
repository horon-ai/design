import { HoronGlyph, HoronIcon, iconNames } from "@horon-ai/react";

const sizes = [16, 20, 24] as const;
const tones = ["text-text-primary", "text-text-secondary", "text-text-brand"] as const;

export default function HoronIconDemo() {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-center gap-5 text-text-primary">
        <HoronIcon size={16} />
        <HoronIcon size={24} />
        <HoronIcon size={32} />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">16 / 20 / 24</p>
        <div className="flex flex-wrap items-center gap-6">
          {tones.map((tone) => (
            <div key={tone} className={`flex items-center gap-3 ${tone}`}>
              {sizes.map((size) => (
                <HoronGlyph key={size} name="sparkles" size={size} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2 p-0">
        {iconNames.map((name) => (
          <li
            key={name}
            className="motion-colors flex flex-col items-center gap-2 rounded-lg px-2 py-3 text-text-primary hover:bg-bg-subtle"
          >
            <HoronGlyph name={name} size={24} />
            <span className="max-w-full truncate font-mono text-caption text-text-secondary">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
