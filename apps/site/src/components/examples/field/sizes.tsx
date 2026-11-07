import { Field, FieldDescription, FieldLabel, Input } from "@horon-ai/react";

export default function FieldSizes() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-8">
      <Field className="w-56" size="sm">
        <FieldLabel htmlFor="field-size-sm">Small field</FieldLabel>
        <Input id="field-size-sm" size="sm" defaultValue="Small" />
        <FieldDescription>6px gap, caption help.</FieldDescription>
      </Field>
      <Field className="w-56" size="md">
        <FieldLabel htmlFor="field-size-md">Medium field</FieldLabel>
        <Input id="field-size-md" defaultValue="Medium" />
        <FieldDescription>8px gap, caption help.</FieldDescription>
      </Field>
      <Field className="w-56" size="lg">
        <FieldLabel htmlFor="field-size-lg">Large field</FieldLabel>
        <Input id="field-size-lg" size="lg" defaultValue="Large" />
        <FieldDescription>10px gap, body-sm help.</FieldDescription>
      </Field>
    </div>
  );
}
