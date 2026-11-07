import { Composer } from "@horon-ai/react";
import { useRef, useState } from "react";

export default function ComposerControlled() {
  const [draft, setDraft] = useState("Summarise this week's standups");
  const [sent, setSent] = useState<{ id: number; text: string }[]>([]);
  const nextId = useRef(0);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Composer
        className="w-full max-w-97.5"
        placeholder="Ask Chief of staff"
        value={draft}
        onValueChange={setDraft}
        onSubmit={(text) => {
          nextId.current += 1;
          setSent((current) => [...current, { id: nextId.current, text }]);
        }}
      />
      {sent.length > 0 && (
        <ul className="flex w-full max-w-97.5 flex-col gap-1">
          {sent.map((entry) => (
            <li key={entry.id} className="text-caption text-text-secondary">
              Sent: {entry.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
