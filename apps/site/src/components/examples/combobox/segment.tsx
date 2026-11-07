import { Combobox, InputGroup, type ComboboxItemData } from "@horon-ai/react";

const countries: ComboboxItemData[] = [
  { value: "KR", label: "South Korea", selectedLabel: "+82", trailing: "+82", keywords: ["한국", "+82"] },
  { value: "US", label: "United States", selectedLabel: "+1", trailing: "+1", keywords: ["USA", "+1"] },
  { value: "JP", label: "Japan", selectedLabel: "+81", trailing: "+81", keywords: ["일본", "+81"] },
  { value: "GB", label: "United Kingdom", selectedLabel: "+44", trailing: "+44", keywords: ["UK", "+44"] },
];

export default function ComboboxSegment() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <InputGroup
        className="w-full max-w-80"
        placeholder="Phone number"
        prefix={
          <Combobox
            variant="segment"
            aria-label="Country code"
            items={countries}
            defaultValue="KR"
            searchPlaceholder="Search countries"
          />
        }
      />
      <InputGroup
        className="w-full max-w-80"
        size="lg"
        placeholder="Phone number, large"
        prefix={
          <Combobox
            variant="segment"
            aria-label="Country code, large"
            items={countries}
            searchPlaceholder="Search countries"
          />
        }
      />
    </div>
  );
}
