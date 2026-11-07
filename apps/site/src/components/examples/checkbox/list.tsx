import { Checkbox } from "@horon-ai/react";
import { useId } from "react";

// Field wraps exactly one control, so a list of checkboxes is labelled as a group instead.
export default function CheckboxList() {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className="flex w-full max-w-80 flex-col gap-2"
    >
      <p id={labelId} className="text-label-md text-text-primary">
        Send me
      </p>
      <div className="flex flex-col gap-3">
        <Checkbox label="Morning brief" defaultChecked />
        <Checkbox label="Weekly report" defaultChecked />
        <Checkbox label="Product updates" />
        <Checkbox label="Research digest" disabled />
      </div>
      <p id={descriptionId} className="text-body-sm text-text-secondary">
        Each one arrives on its own schedule.
      </p>
    </div>
  );
}
