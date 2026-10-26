import { Badge } from "@horon-ai/react";

export default function BadgeDemo() {
  return (
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
  );
}
