import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "@horon/web/components/aspect-ratio";

const meta = {
  title: "Web/AspectRatio",
  component: AspectRatio,
  parameters: { layout: "centered" },
  argTypes: {
    ratio: { control: { type: "number" } },
  },
  args: { ratio: 16 / 9 },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[420px]">
      <AspectRatio {...args} className="rounded-md border border-border bg-muted">
        <div className="flex size-full items-center justify-center text-[13px] text-muted-foreground">16 / 9</div>
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-[280px]">
      <AspectRatio ratio={1} className="rounded-md border border-border bg-muted">
        <div className="flex size-full items-center justify-center text-[13px] text-muted-foreground">1 / 1</div>
      </AspectRatio>
    </div>
  ),
};

export const Ratios: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <div className="w-32">
        <AspectRatio ratio={4 / 3} className="rounded-md border border-border bg-muted" />
        <p className="mt-2 text-center text-[12px] text-muted-foreground">4 / 3</p>
      </div>
      <div className="w-32">
        <AspectRatio ratio={3 / 4} className="rounded-md border border-border bg-muted" />
        <p className="mt-2 text-center text-[12px] text-muted-foreground">3 / 4</p>
      </div>
      <div className="w-32">
        <AspectRatio ratio={9 / 16} className="rounded-md border border-border bg-muted" />
        <p className="mt-2 text-center text-[12px] text-muted-foreground">9 / 16</p>
      </div>
    </div>
  ),
};
