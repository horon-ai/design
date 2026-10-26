import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputGroup } from "@horon-ai/react";
import { CaretDown } from "@phosphor-icons/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/InputGroup",
  component: InputGroup,
  decorators: [onBackdrop],
  args: { className: "w-80" },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Prefix: Story = {
  args: {
    placeholder: "Phone number",
    prefix: (
      <>
        +82 <CaretDown />
      </>
    ),
  },
};

export const Suffix: Story = {
  args: {
    placeholder: "Amount",
    suffix: (
      <>
        KRW <CaretDown />
      </>
    ),
  },
};

export const Error: Story = { args: { ...Prefix.args, invalid: true, defaultValue: "10 1234 5678" } };
export const Disabled: Story = { args: { ...Prefix.args, disabled: true } };
