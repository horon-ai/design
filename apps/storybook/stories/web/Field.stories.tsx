import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@horon/web/components/field"
import { Input } from "@horon/web/components/input"

const meta = {
  title: "Web/Field",
  component: Field,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="field-name">Display name</FieldLabel>
      <Input id="field-name" placeholder="Ada Lovelace" />
      <FieldDescription>This is how others will see you.</FieldDescription>
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field className="w-72">
      <FieldLabel htmlFor="field-email">Email</FieldLabel>
      <Input id="field-email" defaultValue="not-an-email" aria-invalid />
      <FieldDescription>We only use this to reach you.</FieldDescription>
      <FieldError match>Enter a valid email address.</FieldError>
    </Field>
  ),
}

export const Grouped: Story = {
  render: () => (
    <FieldSet className="w-72">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-first">First name</FieldLabel>
          <Input id="field-first" placeholder="Ada" />
        </Field>
        <Field>
          <FieldLabel htmlFor="field-last">Last name</FieldLabel>
          <Input id="field-last" placeholder="Lovelace" />
          <FieldDescription>As it appears on your ID.</FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}
