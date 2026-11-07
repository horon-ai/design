import { Checkbox, Field, FieldDescription, FieldLabel } from "@horon-ai/react";

export default function CheckboxList() {
  return (
    <Field className="w-full max-w-80">
      <FieldLabel>Send me</FieldLabel>
      <div className="flex flex-col gap-3">
        <Checkbox label="Morning brief" defaultChecked />
        <Checkbox label="Weekly report" defaultChecked />
        <Checkbox label="Product updates" />
        <Checkbox label="Research digest" disabled />
      </div>
      <FieldDescription>Each one arrives on its own schedule.</FieldDescription>
    </Field>
  );
}
