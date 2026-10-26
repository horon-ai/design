import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@horon-ai/react";

import { onBackdrop } from "../support";

const meta = {
  title: "Web/Field",
  component: Field,
  decorators: [onBackdrop],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel>Bot name</FieldLabel>
      <Input className="w-full" defaultValue="Chief of staff" />
      <FieldDescription>Shown in chat and notifications.</FieldDescription>
    </Field>
  ),
};

export const Error: Story = {
  render: () => (
    <Field className="w-80" invalid>
      <FieldLabel>Bot name</FieldLabel>
      <Input className="w-full" defaultValue="Inbox Manager" />
      <FieldError match>Name is already used by another bot.</FieldError>
    </Field>
  ),
};
