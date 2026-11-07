import { InputGroup, Select, type SelectItemData } from "@horon-ai/react";

const currencies: SelectItemData[] = [
  { value: "KRW", label: "KRW" },
  { value: "USD", label: "USD" },
  { value: "JPY", label: "JPY" },
];

export default function InputGroupSuffixSelect() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <InputGroup
        className="w-full max-w-80"
        type="number"
        placeholder="Amount"
        suffix={<Select variant="segment" aria-label="Currency" items={currencies} defaultValue="KRW" />}
      />
      <InputGroup
        className="w-full max-w-80"
        defaultValue="250"
        type="number"
        suffix={<Select variant="segment" aria-label="Currency, monthly budget" items={currencies} defaultValue="USD" />}
      />
    </div>
  );
}
