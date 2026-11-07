import { Card } from "@horon-ai/react";

export default function CardSelected() {
  return (
    <div className="flex w-full flex-wrap items-start justify-center gap-4">
      <Card
        interactive
        selected
        render={<button type="button" />}
        className="w-full max-w-64"
        title="Chief of staff"
        description="Morning brief is ready."
      />
      <Card
        interactive
        render={<button type="button" />}
        className="w-full max-w-64"
        title="Research assistant"
        description="Three sources summarized."
      />
    </div>
  );
}
