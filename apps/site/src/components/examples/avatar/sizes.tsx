import { Avatar } from "@horon-ai/react";

const sizes = ["sm", "md", "lg", "xl"] as const;

export default function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      {sizes.map((size) => (
        <span key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>MY</Avatar>
          <span className="text-caption text-text-secondary">{size}</span>
        </span>
      ))}
    </div>
  );
}
