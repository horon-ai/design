import { Avatar } from "@horon-ai/react";

export default function AvatarTypes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-3">
        <Avatar size="lg">MY</Avatar>
        <span className="text-body-sm text-text-secondary">Initials for a person</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar size="lg" type="bot" />
        <span className="text-body-sm text-text-secondary">Bot icon for an agent</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar size="lg" type="image" src="/mascots/horon-mascot-face.webp" alt="Horon mascot">
          H
        </Avatar>
        <span className="text-body-sm text-text-secondary">Photo with initials as fallback</span>
      </div>
    </div>
  );
}
