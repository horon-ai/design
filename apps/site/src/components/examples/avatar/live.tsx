import { Avatar } from "@horon-ai/react";

export default function AvatarLive() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <Avatar size="lg" type="bot" live />
        <Avatar size="lg" live>
          AN
        </Avatar>
      </div>
      <div className="flex items-center gap-4 rounded-xl bg-bg-subtle p-4">
        <Avatar size="lg" type="bot" live liveRingClassName="border-bg-subtle" />
        <span className="text-body-sm text-text-secondary">Ring matched to the surface behind</span>
      </div>
    </div>
  );
}
