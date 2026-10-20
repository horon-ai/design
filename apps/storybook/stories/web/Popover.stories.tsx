import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover, PopoverContent, PopoverTrigger } from "@horon/web/components/popover";
import { Button } from "@horon/web/components/button";
import { Input } from "@horon/web/components/input";
import { Label } from "@horon/web/components/label";

const meta = {
  title: "Web/Popover",
  component: Popover,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function DimensionsPopover({ defaultOpen = false }: { defaultOpen?: boolean }) {
  return (
    <Popover defaultOpen={defaultOpen}>
      <PopoverTrigger render={<Button variant="outline" />}>Set dimensions</PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="popover-width">Width</Label>
            <Input id="popover-width" defaultValue="320" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="popover-height">Height</Label>
            <Input id="popover-height" defaultValue="180" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const Playground: Story = {
  render: () => <DimensionsPopover />,
};

export const Open: Story = {
  render: () => <DimensionsPopover defaultOpen />,
};
