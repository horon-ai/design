import { Combobox, InputGroup, Select, type ComboboxItemData } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

const countries: ComboboxItemData[] = [
  { value: "KR", label: "South Korea", selectedLabel: "+82", trailing: "+82", keywords: ["+82", "한국"] },
  { value: "US", label: "United States", selectedLabel: "+1", trailing: "+1", keywords: ["+1", "USA"] },
  { value: "JP", label: "Japan", selectedLabel: "+81", trailing: "+81", keywords: ["+81", "일본"] },
  { value: "GB", label: "United Kingdom", selectedLabel: "+44", trailing: "+44", keywords: ["+44", "UK"] },
  { value: "DE", label: "Germany", selectedLabel: "+49", trailing: "+49", keywords: ["+49"] },
  { value: "SG", label: "Singapore", selectedLabel: "+65", trailing: "+65", keywords: ["+65"] },
];

const dialCodes = countries.map((country) => ({
  value: country.value,
  label: `${country.selectedLabel} ${country.label}`,
  selectedLabel: country.selectedLabel,
}));

const currencies = [
  { value: "KRW", label: "KRW" },
  { value: "USD", label: "USD" },
  { value: "JPY", label: "JPY" },
];

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-wrap items-end justify-center gap-3">
        <InputGroup
          className="w-52"
          surface={surface}
          size="sm"
          placeholder="Small"
          prefix={<Select variant="segment" aria-label="Country code" items={dialCodes} defaultValue="KR" />}
        />
        <InputGroup
          className="w-52"
          surface={surface}
          placeholder="Medium"
          prefix={<Select variant="segment" aria-label="Country code" items={dialCodes} defaultValue="KR" />}
        />
        <InputGroup
          className="w-52"
          surface={surface}
          size="lg"
          placeholder="Large"
          prefix={<Select variant="segment" aria-label="Country code" items={dialCodes} defaultValue="KR" />}
        />
      </div>
      <InputGroup
        className="w-80"
        surface={surface}
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
        className="w-80"
        surface={surface}
        placeholder="Amount"
        suffix={<Select variant="segment" aria-label="Currency" items={currencies} defaultValue="KRW" />}
      />
      <InputGroup
        className="w-80"
        surface={surface}
        invalid
        defaultValue="12"
        suffix={<Select variant="segment" aria-label="Currency" items={currencies} defaultValue="KRW" />}
      />
      <InputGroup
        className="w-80"
        surface={surface}
        disabled
        placeholder="Phone number"
        prefix={<Select variant="segment" aria-label="Country code" items={dialCodes} defaultValue="KR" />}
      />
    </div>
  );
}

export default function InputGroupDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
