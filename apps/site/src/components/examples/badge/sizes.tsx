import { Badge } from "@horon-ai/react";

export default function BadgeSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge size="sm" tone="brand" dot>
          Small
        </Badge>
        <Badge size="sm">3 drafts</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge size="md" tone="brand" dot>
          Medium
        </Badge>
        <Badge size="md">3 drafts</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge size="lg" tone="brand" dot>
          Large
        </Badge>
        <Badge size="lg">3 drafts</Badge>
      </div>
    </div>
  );
}
