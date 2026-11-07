import { ToolPermissions } from "@horon-ai/react";

export default function ToolPermissionsThumbnail() {
  return (
    <ToolPermissions
      // The permission control's pill is measured after mount; the pressed segment
      // paints the same 10% ink fill so the chosen option reads in a static tile.
      className="max-w-92 [&_[data-pressed]]:bg-overlay-ink-10"
      title="Read-only"
      tools={[
        { name: "list_issues", description: "List issues in a project", defaultValue: "allow" },
        { name: "get_issue", description: "Read one issue", defaultValue: "ask" },
      ]}
    />
  );
}
