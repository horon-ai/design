import { Combobox, type ComboboxItemData } from "../../src/components/combobox";

import { Backdrop } from "./backdrop";

const bots: ComboboxItemData[] = [
  { value: "chief", label: "Chief of staff" },
  { value: "researcher", label: "Researcher" },
  { value: "writer", label: "Writer" },
  { value: "triage", label: "Inbox triage", keywords: ["email", "gmail"] },
  { value: "analyst", label: "Data analyst" },
  { value: "recruiter", label: "Recruiter", disabled: true },
];

/** The three rungs, a chosen field, both multi-select states and the invalid border. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col items-center gap-3">
      <view className="flex flex-row flex-wrap items-end justify-center gap-3">
        <Combobox aria-label="Bot" items={bots} surface={surface} size="sm" placeholder="Small" />
        <Combobox aria-label="Bot" items={bots} surface={surface} placeholder="Medium" />
        <Combobox aria-label="Bot" items={bots} surface={surface} size="lg" placeholder="Large" />
      </view>
      <Combobox aria-label="Bot" items={bots} surface={surface} placeholder="Search a bot" defaultValue="writer" />
      <Combobox
        aria-label="Bots"
        items={bots}
        surface={surface}
        multiple
        placeholder="Add bots"
        defaultValue={["chief"]}
      />
      <Combobox aria-label="Bots" items={bots} surface={surface} multiple placeholder="Add bots" />
      <Combobox aria-label="Bot" items={bots} surface={surface} invalid placeholder="Search a bot" />
    </view>
  );
}

/** Solid and glass fields; tap one to open the searchable list. */
export default function ComboboxDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex w-full flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
