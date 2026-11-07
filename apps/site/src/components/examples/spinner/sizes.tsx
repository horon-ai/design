import { Spinner } from "@horon-ai/react";

export default function SpinnerSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <span key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} label={`Loading ${size}`} />
          <span className="text-caption text-text-secondary">{size}</span>
        </span>
      ))}
    </div>
  );
}
