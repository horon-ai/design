import { FlueBackground } from "@horon-ai/react";

export default function FlueBackgroundDefault() {
  return (
    <div className="relative isolate min-h-96 w-full overflow-hidden rounded-xl border border-border-default bg-bg-default">
      <FlueBackground />
      <div className="relative flex flex-col gap-2 p-8 text-text-primary">
        <p className="text-label-lg font-semibold">Morning sky</p>
        <p className="max-w-90 text-body-sm text-text-secondary">
          The plume drifts on its own and bends as the pointer passes, without taking a single click.
        </p>
      </div>
    </div>
  );
}
