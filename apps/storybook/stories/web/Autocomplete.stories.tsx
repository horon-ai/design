import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@horon/web/components/autocomplete"

const frameworks = [
  "React",
  "Vue",
  "Svelte",
  "Solid",
  "Angular",
  "Astro",
  "Qwik",
  "Remix",
]

const meta = {
  title: "Web/Autocomplete",
  component: Autocomplete,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Autocomplete items={frameworks}>
      <AutocompleteInput className="w-64" placeholder="Search frameworks" />
      <AutocompleteList>
        {(item: string) => (
          <AutocompleteItem key={item} value={item}>
            {item}
          </AutocompleteItem>
        )}
        <AutocompleteEmpty>No frameworks found.</AutocompleteEmpty>
      </AutocompleteList>
    </Autocomplete>
  ),
}

export const Selected: Story = {
  render: () => (
    <Autocomplete items={frameworks} defaultValue="Svelte">
      <AutocompleteInput className="w-64" placeholder="Search frameworks" />
      <AutocompleteList>
        {(item: string) => (
          <AutocompleteItem key={item} value={item}>
            {item}
          </AutocompleteItem>
        )}
        <AutocompleteEmpty>No frameworks found.</AutocompleteEmpty>
      </AutocompleteList>
    </Autocomplete>
  ),
}
