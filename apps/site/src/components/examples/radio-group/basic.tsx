import { Field, FieldDescription, FieldLabel, Radio, RadioGroup } from "@horon-ai/react";

export default function RadioGroupBasic() {
  return (
    <Field className="w-full max-w-64">
      <FieldLabel>Where should reports go?</FieldLabel>
      <RadioGroup defaultValue="email" aria-label="Report channel">
        <Radio value="email" label="Email" />
        <Radio value="slack" label="Slack DM" />
        <Radio value="none" label="Do not report" />
      </RadioGroup>
      <FieldDescription>You can change this later in settings.</FieldDescription>
    </Field>
  );
}
