import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@horon-ai/react";
import { useState } from "react";

export default function FieldValidation() {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && value.length < 3;

  return (
    <div className="flex w-full max-w-64 flex-col gap-4">
      <Field invalid={invalid}>
        <FieldLabel htmlFor="field-validation-handle">Handle</FieldLabel>
        <Input
          id="field-validation-handle"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Two letters is too short"
        />
        {invalid ? (
          <FieldError match>Use at least 3 characters.</FieldError>
        ) : (
          <FieldDescription>Short, lowercase, no spaces.</FieldDescription>
        )}
      </Field>
      <Field>
        <FieldLabel htmlFor="field-validation-team">Team</FieldLabel>
        <Input id="field-validation-team" defaultValue="Research" />
        <FieldDescription>This field stays put while the one above grows.</FieldDescription>
      </Field>
    </div>
  );
}
