import { FilterBar, type FilterBarItem } from "@horon-ai/react";
import { useState } from "react";

const items: FilterBarItem[] = [
  { value: "all", label: "All", count: 12 },
  { value: "agents", label: "Agents", count: 4 },
  { value: "skills", label: "Skills", count: 6 },
  { value: "archived", label: "Archived", count: 2 },
];

export default function FilterBarControlled() {
  const [scope, setScope] = useState("agents");
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-3">
      <FilterBar aria-label="Scope" items={items} value={scope} onValueChange={setScope} />
      <p className="text-caption text-text-secondary">Showing: {scope}</p>
    </div>
  );
}
