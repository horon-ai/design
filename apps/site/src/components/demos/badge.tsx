import { Badge } from "@horon-ai/react";

export default function BadgeDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge size="sm" dot>
          Small
        </Badge>
        <Badge dot>Medium</Badge>
        <Badge size="lg" dot>
          Large
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge dot>Draft</Badge>
        <Badge dot tone="brand">
          ON
        </Badge>
        <Badge dot tone="danger">
          Failed
        </Badge>
        <Badge tone="solid">New</Badge>
      </div>
    </div>
  );
}
