import { InputGroup, InputGroupSegment } from "@horon-ai/react";

export default function InputGroupStates() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <InputGroup
        className="w-full max-w-80"
        invalid
        defaultValue="12"
        suffix={<InputGroupSegment>per month</InputGroupSegment>}
        aria-label="Seats, invalid"
      />
      <InputGroup
        className="w-full max-w-80"
        disabled
        placeholder="Phone number"
        prefix={<InputGroupSegment>+82</InputGroupSegment>}
        aria-label="Phone number, disabled"
      />
      <InputGroup
        className="w-full max-w-80"
        surface="glass"
        invalid
        defaultValue="12"
        suffix={<InputGroupSegment>per month</InputGroupSegment>}
        aria-label="Seats on glass, invalid"
      />
    </div>
  );
}
