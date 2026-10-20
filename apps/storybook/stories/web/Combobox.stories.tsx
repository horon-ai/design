import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@horon/web/components/combobox";

const frameworks = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt", "SolidStart"];

const meta = {
  title: "Web/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Combobox items={frameworks}>
      <ComboboxInput className="w-64" placeholder="Select a framework" />
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
      </ComboboxList>
    </Combobox>
  ),
};

function MultipleCombobox() {
  const [value, setValue] = React.useState<string[]>(["React", "Vue"]);
  return (
    <Combobox multiple items={frameworks} value={value} onValueChange={setValue}>
      <ComboboxChips className="w-72">
        {value.map((item) => (
          <ComboboxChip key={item}>{item}</ComboboxChip>
        ))}
        <ComboboxInput
          className="h-6 flex-1 border-0 bg-transparent px-0 focus-within:ring-0"
          placeholder="Add a framework"
        />
      </ComboboxChips>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
      </ComboboxList>
    </Combobox>
  );
}

export const Multiple: Story = {
  render: () => <MultipleCombobox />,
};
