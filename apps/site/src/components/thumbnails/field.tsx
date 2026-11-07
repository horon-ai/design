import { Field, FieldDescription, FieldLabel, Input } from "@horon-ai/react";

export default function FieldThumbnail() {
  return (
    <Field className="w-72">
      <FieldLabel>Bot name</FieldLabel>
      <Input className="w-full" defaultValue="Chief of staff" />
      <FieldDescription>Shown in chat and notifications.</FieldDescription>
    </Field>
  );
}
