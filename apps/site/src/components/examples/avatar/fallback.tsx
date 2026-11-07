import { Avatar } from "@horon-ai/react";

export default function AvatarFallback() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <Avatar type="image" size="lg" src="/mascots/not-a-real-mascot.webp">
          MY
        </Avatar>
        <Avatar type="image" size="lg" src="/mascots/not-a-real-mascot.webp" tone="sky">
          MY
        </Avatar>
      </div>
      <p className="max-w-80 text-center text-body-sm text-text-secondary">
        The address does not resolve, so both avatars keep their initials.
      </p>
    </div>
  );
}
