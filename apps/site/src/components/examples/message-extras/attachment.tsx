import { Attachment } from "@horon-ai/react";

export default function MessageExtrasAttachment() {
  return (
    <div className="flex w-full max-w-90 flex-col gap-3">
      <Attachment name="Q3 board deck v5.pdf" detail="PDF · 2.4 MB" onRemove={() => undefined} />
      <Attachment name="weekly-recap.md" detail="Markdown · 12 KB" />
      <Attachment name="board-room.png" detail="PNG · 840 KB" onRemove={() => undefined} />
    </div>
  );
}
