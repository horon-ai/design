import { Badge } from "@horon-ai/react";

export default function BadgeThumbnail() {
  return (
    <div className="flex items-center gap-3">
      <Badge size="lg" tone="brand" dot>
        Live
      </Badge>
      <Badge size="lg" tone="neutral" dot>
        Draft
      </Badge>
      <Badge size="lg" tone="danger" dot>
        Failed
      </Badge>
    </div>
  );
}
