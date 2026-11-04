import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function FieldDemo() {
  return (
    <Backdrop className="flex-col">
      <div className="flex flex-wrap items-start justify-center gap-4">
        <Field className="w-56" size="sm">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" size="sm" defaultValue="Small" />
          <FieldDescription>Small field.</FieldDescription>
        </Field>
        <Field className="w-56">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" defaultValue="Medium" />
          <FieldDescription>Medium field.</FieldDescription>
        </Field>
        <Field className="w-56" size="lg">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" size="lg" defaultValue="Large" />
          <FieldDescription>Large field.</FieldDescription>
        </Field>
      </div>
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
