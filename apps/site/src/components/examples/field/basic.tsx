import { Field, FieldDescription, FieldLabel, Input } from "@horon-ai/react";

export default function FieldBasic() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="field-basic-name">Bot name</FieldLabel>
        <Input id="field-basic-name" defaultValue="Chief of staff" />
        <FieldDescription>Shown in chat and notifications.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="field-basic-email">Email</FieldLabel>
        <Input id="field-basic-email" type="email" placeholder="you@horon.ai" />
        <FieldDescription>We only use it to sign you in.</FieldDescription>
      </Field>
    </div>
  );
}
