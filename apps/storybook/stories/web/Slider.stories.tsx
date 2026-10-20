import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider, SliderIndicator, SliderThumb, SliderTrack, SliderValue } from "@horon/web/components/slider";

const meta = {
  title: "Web/Slider",
  component: Slider,
  parameters: { layout: "centered" },
  args: { defaultValue: 40 },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { defaultValue: 40, className: "w-72" },
  render: (args) => (
    <Slider {...args}>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Volume" />
      </SliderTrack>
      <SliderValue />
    </Slider>
  ),
};

export const Range: Story = {
  args: { defaultValue: [25, 75], className: "w-72" },
  render: (args) => (
    <Slider {...args}>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb index={0} aria-label="Minimum price" />
        <SliderThumb index={1} aria-label="Maximum price" />
      </SliderTrack>
      <SliderValue />
    </Slider>
  ),
};

export const Steps: Story = {
  args: { defaultValue: 60, min: 0, max: 100, step: 20, className: "w-72" },
  render: (args) => (
    <Slider {...args}>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Budget" />
      </SliderTrack>
      <SliderValue />
    </Slider>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: 30, disabled: true, className: "w-72" },
  render: (args) => (
    <Slider {...args}>
      <SliderTrack>
        <SliderIndicator />
        <SliderThumb aria-label="Volume" />
      </SliderTrack>
      <SliderValue />
    </Slider>
  ),
};
