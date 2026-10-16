import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@horon/web/components/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@horon/web/components/button-group";
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon } from "lucide-react";

const meta = {
  title: "Web/ButtonGroup",
  component: ButtonGroup,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">
        <ChevronLeftIcon />
        Back
      </Button>
      <Button variant="outline">Next</Button>
      <Button variant="outline">
        Forward
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">
        <MinusIcon />
        Undo
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline">
        Redo
        <PlusIcon />
      </Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Total</ButtonGroupText>
      <Button variant="outline">$120</Button>
      <Button>Checkout</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  ),
};
