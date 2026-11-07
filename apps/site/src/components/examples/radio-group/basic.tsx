import { Radio, RadioGroup } from "@horon-ai/react";
import { useId } from "react";

// RadioGroup is already a labelled radiogroup; a Field around it would hand one id to every radio.
export default function RadioGroupBasic() {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <p id={labelId} className="text-label-md text-text-primary">
        Where should reports go?
      </p>
      <RadioGroup defaultValue="email" aria-labelledby={labelId} aria-describedby={descriptionId}>
        <Radio value="email" label="Email" />
        <Radio value="slack" label="Slack DM" />
        <Radio value="none" label="Do not report" />
      </RadioGroup>
      <p id={descriptionId} className="text-body-sm text-text-secondary">
        You can change this later in settings.
      </p>
    </div>
  );
}
