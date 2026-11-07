import { TextareaField } from "@horon-ai/react";

export default function TextareaFieldThumbnail() {
  return (
    <TextareaField
      className="w-80"
      label="Instructions"
      hint="Optional"
      defaultValue="Skip newsletters and only flag mail that needs a reply."
      description="The bot reads this before every task."
      maxLength={240}
    />
  );
}
