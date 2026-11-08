import { useState } from "@lynx-js/react";

import { Select, type SelectItemData } from "../../src/components/select";

import { Backdrop } from "./backdrop";

const items: SelectItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage" },
];

function Fields({ surface, onChange }: { surface: "solid" | "glass"; onChange: (value: string) => void }) {
  return (
    <>
      <view className="flex flex-row flex-wrap items-end justify-center gap-3">
        <Select
          aria-label="Bot"
          items={items}
          surface={surface}
          size="sm"
          placeholder="Small"
          className="w-44"
          onValueChange={onChange}
        />
        <Select
          aria-label="Bot"
          items={items}
          surface={surface}
          placeholder="Medium"
          className="w-44"
          onValueChange={onChange}
        />
        <Select
          aria-label="Bot"
          items={items}
          surface={surface}
          size="lg"
          placeholder="Large"
          className="w-44"
          onValueChange={onChange}
        />
      </view>
      <Select aria-label="Bot" items={items} surface={surface} placeholder="Select a bot" onValueChange={onChange} />
      <Select
        aria-label="Bot"
        items={items}
        surface={surface === "glass" ? "glass" : "solid-on-page"}
        defaultValue="chief"
        onValueChange={onChange}
      />
    </>
  );
}

/** The field, chip and segment variants: the chip and the segment read their own rung and fill. */
export default function SelectDemo() {
  const [picked, setPicked] = useState("nothing yet");
  return (
    <view className="flex w-full flex-col gap-6">
      <text className="text-caption text-text-secondary">Picked: {picked}</text>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full flex-col items-center gap-4">
          <Fields surface="solid" onChange={setPicked} />
        </view>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <Fields surface="glass" onChange={setPicked} />
        </Backdrop>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Chip and segment</text>
        <view className="flex flex-row flex-wrap items-center justify-center gap-3">
          <Select variant="chip" aria-label="Filter" items={items} placeholder="Filter" onValueChange={setPicked} />
          <Select variant="chip" aria-label="Filter" items={items} defaultValue="writer" onValueChange={setPicked} />
          <Select variant="segment" aria-label="Role" items={items} defaultValue="chief" onValueChange={setPicked} />
          <Select
            variant="segment"
            aria-label="Role"
            items={items}
            defaultValue="chief"
            disabled
            onValueChange={setPicked}
          />
        </view>
      </view>
    </view>
  );
}
