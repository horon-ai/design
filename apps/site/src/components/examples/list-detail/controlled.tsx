import { ListDetail, ListDetailHeader, ListDetailMeta } from "@horon-ai/react";
import { useState } from "react";

const groups = [
  {
    id: "sources",
    label: "SOURCES",
    items: [
      { id: "readme", title: "README.md", meta: "2.1 KB" },
      { id: "spec", title: "spec.md", meta: "8.4 KB" },
      { id: "notes", title: "notes.md", meta: "512 B" },
    ],
  },
];

const sizes: Record<string, string> = { readme: "2.1 KB", spec: "8.4 KB", notes: "512 B" };

export default function ListDetailControlled() {
  const [selected, setSelected] = useState("spec");
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-caption text-text-secondary">Selected: {selected}</p>
      <ListDetail value={selected} onValueChange={setSelected} groups={groups}>
        {(item) => (
          <>
            <ListDetailHeader title={item.title} description="Indexed 4 minutes ago" />
            <ListDetailMeta
              items={[
                { id: "size", label: "Size", value: sizes[item.id] ?? "unknown" },
                { id: "chunks", label: "Chunks", value: "42" },
              ]}
            />
          </>
        )}
      </ListDetail>
    </div>
  );
}
