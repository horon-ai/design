import { ToolPermissions } from "@horon-ai/react";

export default function ToolPermissionsDemo() {
  return (
    <div className="flex w-full justify-center">
      <ToolPermissions
        title="Read-only"
        tools={[
          { name: "list_issues", description: "List issues in a project or cycle", defaultValue: "allow" },
          { name: "get_issue", description: "Read one issue with its comments", defaultValue: "ask" },
          { name: "search_documents", description: "Full-text search across documents", defaultValue: "off" },
        ]}
      />
    </div>
  );
}
