import { Avatar } from "@horon-ai/react";

export default function AvatarThumbnail() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="xl" type="bot" live />
      <Avatar size="xl" tone="sky">
        MY
      </Avatar>
      <Avatar size="xl">AK</Avatar>
    </div>
  );
}
