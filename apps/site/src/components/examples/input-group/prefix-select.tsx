import { InputGroup, Select, type SelectItemData } from "@horon-ai/react";

const dialCodes: SelectItemData[] = [
  { value: "KR", label: "+82 South Korea", selectedLabel: "+82" },
  { value: "US", label: "+1 United States", selectedLabel: "+1" },
  { value: "JP", label: "+81 Japan", selectedLabel: "+81" },
  { value: "GB", label: "+44 United Kingdom", selectedLabel: "+44" },
];

export default function InputGroupPrefixSelect() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <InputGroup
        className="w-full max-w-80"
        placeholder="Phone number"
        prefix={<Select variant="segment" aria-label="Country code" items={dialCodes} defaultValue="KR" />}
      />
      <div className="flex w-full flex-wrap items-end justify-center gap-3">
        <InputGroup
          className="w-52"
          size="sm"
          placeholder="Small"
          prefix={<Select variant="segment" aria-label="Country code, small" items={dialCodes} defaultValue="KR" />}
        />
        <InputGroup
          className="w-52"
          size="lg"
          placeholder="Large"
          prefix={<Select variant="segment" aria-label="Country code, large" items={dialCodes} defaultValue="KR" />}
        />
      </div>
    </div>
  );
}
