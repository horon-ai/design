import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@horon-ai/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

/** Type one or two characters: the message appears and the field below makes room for it. */
function LiveField({ surface }: { surface?: "glass" }) {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && value.length < 3;
  return (
    <Field className="w-64" invalid={invalid}>
      <FieldLabel>Handle</FieldLabel>
      <Input
        className="w-full"
        surface={surface}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Two letters is too short"
      />
      <FieldError match={invalid}>Use at least 3 characters.</FieldError>
    </Field>
  );
}

function Fields({ surface }: { surface?: "glass" }) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <Field className="w-64" size="sm">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} size="sm" defaultValue="Small" />
          <FieldDescription>Small field.</FieldDescription>
        </Field>
        <Field className="w-64">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} defaultValue="Medium" />
          <FieldDescription>Medium field.</FieldDescription>
        </Field>
        <Field className="w-64" size="lg">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} size="lg" defaultValue="Large" />
          <FieldDescription>Large field.</FieldDescription>
        </Field>
      </div>
      <div className="flex flex-col gap-4">
        <Field className="w-64">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} defaultValue="Chief of staff" />
          <FieldDescription>Shown in chat and notifications.</FieldDescription>
        </Field>
        <Field className="w-64" invalid>
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} defaultValue="Inbox Manager" />
          <FieldError match>Name is already used by another bot.</FieldError>
        </Field>
        <LiveField surface={surface} />
      </div>
    </>
  );
}

export default function FieldDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex flex-wrap items-start justify-center gap-8">
          <Fields />
        </div>
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <div className="flex flex-wrap items-start justify-center gap-8">
          <Fields surface="glass" />
        </div>
      </Backdrop>
    </div>
  );
}
