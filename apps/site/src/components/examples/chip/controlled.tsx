import { Chip } from "@horon-ai/react";
import { useState } from "react";

const tags = ["Design", "Engineering", "Research", "Support"];

export default function ChipControlled() {
  const [selected, setSelected] = useState<string[]>(["Design", "Research"]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tags.map((tag) => (
          <Chip
            key={tag}
            pressed={selected.includes(tag)}
            onPressedChange={(pressed) =>
              setSelected((current) => (pressed ? [...current, tag] : current.filter((entry) => entry !== tag)))
            }
          >
            {tag}
          </Chip>
        ))}
      </div>
      <p className="text-caption text-text-secondary">
        {selected.length === 0 ? "No tags selected" : `Selected: ${selected.join(", ")}`}
      </p>
    </div>
  );
}
