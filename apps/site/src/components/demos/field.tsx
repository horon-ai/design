import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function FieldDemo() {
  return (
    <Backdrop className="flex-col">
      <Field className="w-80">
        <FieldLabel>Bot name</FieldLabel>
        <Input className="w-full" defaultValue="Chief of staff" />
        <FieldDescription>Shown in chat and notifications.</FieldDescription>
      </Field>
      <Field className="w-80" invalid>
        <FieldLabel>Bot name</FieldLabel>
        <Input className="w-full" defaultValue="Inbox Manager" />
        <FieldError match>Name is already used by another bot.</FieldError>
      </Field>
    </Backdrop>
  );
}
