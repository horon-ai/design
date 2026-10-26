import { Avatar } from "@horon-ai/react";

export default function AvatarDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} size={size}>
            MY
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} type="bot" size={size} live />
        ))}
      </div>
    </div>
  );
}
