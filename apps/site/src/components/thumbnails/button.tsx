import { Button } from "@horon-ai/react";

export default function ButtonThumbnail() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button size="lg">Approve</Button>
      <Button size="lg" variant="solid">
        Cancel
      </Button>
    </div>
  );
}
