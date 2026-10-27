import { Avatar } from "@horon-ai/react";

const sizes = ["sm", "md", "lg", "xl"] as const;

export default function AvatarDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} size={size}>
            MY
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} type="bot" size={size} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} type="bot" size={size} live />
        ))}
      </div>
      <div className="flex items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} type="image" size={size} src="/mascots/horon-mascot-face.webp" alt="Horon">
            H
          </Avatar>
        ))}
      </div>
    </div>
  );
}
