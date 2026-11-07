import { InputGroup, InputGroupSegment } from "@horon-ai/react";

export default function InputGroupFixedText() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <InputGroup
        className="w-full max-w-80"
        prefix={<InputGroupSegment>https://</InputGroupSegment>}
        placeholder="horon.ai"
        aria-label="Website"
      />
      <InputGroup
        className="w-full max-w-80"
        suffix={<InputGroupSegment>per month</InputGroupSegment>}
        placeholder="20"
        aria-label="Seats"
      />
      <div className="flex w-full flex-wrap items-end justify-center gap-3">
        <InputGroup
          className="w-44"
          size="sm"
          prefix={<InputGroupSegment>#</InputGroupSegment>}
          placeholder="Small"
          aria-label="Channel, small"
        />
        <InputGroup
          className="w-44"
          size="lg"
          prefix={<InputGroupSegment>#</InputGroupSegment>}
          placeholder="Large"
          aria-label="Channel, large"
        />
      </div>
    </div>
  );
}
