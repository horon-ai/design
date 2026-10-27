import { ToolPermissions } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function ToolPermissionsDemo() {
  return (
    <Backdrop>
      <ToolPermissions
        title="Read-only"
        className="rounded-2xl bg-glass-thick p-2"
        tools={[
          { name: "list_issues", description: "List issues in a project or cycle", defaultValue: "allow" },
          { name: "get_issue", description: "Read one issue with its comments", defaultValue: "ask" },
          { name: "search_documents", description: "Full-text search across documents", defaultValue: "off" },
        ]}
      />
    </Backdrop>
  );
}
