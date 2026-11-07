import { useState } from "@lynx-js/react";

import { Field, FieldDescription, FieldError, FieldLabel } from "../../src/components/field";
import { Input } from "../../src/components/input";

import { Backdrop } from "./backdrop";

/** Type one or two characters: the message appears and the field below makes room for it. */
function LiveField({ surface }: { surface?: "glass" }) {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && value.length < 3;
  return (
    <Field className="w-full" invalid={invalid}>
      <FieldLabel>Handle</FieldLabel>
      <Input className="w-full" surface={surface} value={value} onChange={setValue} placeholder="Two letters is too short" />
      <FieldError match={invalid}>Use at least 3 characters.</FieldError>
    </Field>
  );
}

function Fields({ surface }: { surface?: "glass" }) {
  return (
    <>
      <view className="flex w-full max-w-64 min-w-0 flex-col gap-4">
        <Field className="w-full" size="sm">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} size="sm" defaultValue="Small" />
          <FieldDescription>Small field.</FieldDescription>
        </Field>
        <Field className="w-full">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} defaultValue="Medium" />
          <FieldDescription>Medium field.</FieldDescription>
        </Field>
        <Field className="w-full" size="lg">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} size="lg" defaultValue="Large" />
          <FieldDescription>Large field.</FieldDescription>
        </Field>
      </view>
      <view className="flex w-full max-w-64 min-w-0 flex-col gap-4">
        <Field className="w-full">
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} defaultValue="Chief of staff" />
          <FieldDescription>Shown in chat and notifications.</FieldDescription>
        </Field>
        <Field className="w-full" invalid>
          <FieldLabel>Bot name</FieldLabel>
          <Input className="w-full" surface={surface} defaultValue="Inbox Manager" />
          <FieldError match>Name is already used by another bot.</FieldError>
        </Field>
        <LiveField surface={surface} />
      </view>
    </>
  );
}

export default function FieldDemo() {
  return (
    <view className="flex w-full flex-col gap-6">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex w-full min-w-0 flex-row flex-wrap items-start justify-center gap-8">
          <Fields />
        </view>
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <view className="flex w-full min-w-0 flex-row flex-wrap items-start justify-center gap-8">
          <Fields surface="glass" />
        </view>
      </Backdrop>
    </view>
  );
}
