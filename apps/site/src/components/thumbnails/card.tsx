import { Badge, Card } from "@horon-ai/react";

export default function CardThumbnail() {
  return (
    <Card
      className="w-80"
      title="Inbox Manager"
      description="6 emails need you. Drafts are ready for review."
    >
      <div className="flex items-center gap-2">
        <Badge tone="brand" dot>
          Live
        </Badge>
        <span className="text-caption text-text-secondary">Updated 2m ago</span>
      </div>
    </Card>
  );
}
