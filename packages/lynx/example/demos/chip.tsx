import { useState } from "@lynx-js/react";

import { Chip } from "../../src/components/chip";

/** The three rungs mounted selected, so the open check slot is visible at rest. */
function Sizes() {
  return (
    <view className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Chip size="sm" defaultPressed>
        Small
      </Chip>
      <Chip defaultPressed>Medium</Chip>
      <Chip size="lg" defaultPressed>
        Large
      </Chip>
    </view>
  );
}

/** A filter row whose selection is reported in the caption under it. */
function Filters() {
  const [selected, setSelected] = useState("Inbox");
  const chips = ["All", "Inbox", "Drafts"];

  return (
    <view className="flex w-full flex-col items-center gap-3">
      <view className="flex flex-row flex-wrap items-center justify-center gap-2">
        {chips.map((label) => (
          <Chip key={label} pressed={selected === label} onPressedChange={(next) => next && setSelected(label)}>
            {label}
          </Chip>
        ))}
        <Chip disabled>Archive</Chip>
      </view>
      <text className="text-caption text-text-secondary">selected: {selected}</text>
    </view>
  );
}

/**
 * The Chip gallery: the three sizes in their selected state, then a single-select
 * filter row with one disabled chip.
 */
export default function ChipDemo() {
  return (
    <view className="flex w-full flex-col items-center gap-6 p-4">
      <Sizes />
      <Filters />
    </view>
  );
}
