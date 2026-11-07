import { Button } from "@horon-ai/react";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
