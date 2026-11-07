import { Avatar } from "@horon-ai/react";

export default function AvatarTone() {
  return (
    <div className="flex items-center gap-6">
      <span className="flex flex-col items-center gap-2">
        <Avatar size="lg">MY</Avatar>
        <span className="text-caption text-text-secondary">neutral</span>
      </span>
      <span className="flex flex-col items-center gap-2">
        <Avatar size="lg" tone="sky">
          MY
        </Avatar>
        <span className="text-caption text-text-secondary">sky</span>
      </span>
    </div>
  );
}
