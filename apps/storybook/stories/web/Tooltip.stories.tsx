import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@horon-ai/react/components/tooltip";
import { Button } from "@horon-ai/react/components/button";

const meta = {
  title: "Web/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Open: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
