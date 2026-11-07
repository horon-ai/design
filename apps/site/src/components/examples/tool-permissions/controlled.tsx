import { ToolPermissions, type ToolPermission } from "@horon-ai/react";
import { useState } from "react";

const tools = [
  { name: "read_file", description: "Open a file in the workspace", defaultValue: "allow" as const },
  { name: "write_file", description: "Create or replace a file", defaultValue: "ask" as const },
  { name: "delete_file", description: "Remove a file for good", defaultValue: "off" as const },
];

export default function ToolPermissionsControlled() {
  const [values, setValues] = useState<Record<string, ToolPermission>>({
    read_file: "allow",
    write_file: "ask",
    delete_file: "off",
  });

  const allowed = tools.filter((tool) => values[tool.name] === "allow").map((tool) => tool.name);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ToolPermissions title="File access" tools={tools} values={values} onValuesChange={setValues} />
      <p className="text-caption text-text-secondary">
        {allowed.length === 0 ? "No tool runs without asking" : `No prompt for: ${allowed.join(", ")}`}
      </p>
    </div>
  );
}
