import { HoronGlyph, iconNames } from "@horon-ai/react";

export default function HoronIconRegistry() {
  return (
    <ul className="m-0 grid w-full list-none grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2 p-0">
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
  );
}
