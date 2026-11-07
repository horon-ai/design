import { McpServerRow } from "@horon-ai/react";

export default function McpServerRowTones() {
  return (
    <div className="w-full rounded-2xl border border-border-default bg-bg-surface px-5">
      <McpServerRow
        name="Linear"
        initials="LI"
        description="Read and update issues."
        statusLabel="Connected"
        statusTone="connected"
        meta={["12 tools"]}
      />
      <McpServerRow
        name="Sentry"
        initials="SE"
        description="Read issues and release health."
        statusLabel="Needs auth"
        statusTone="warning"
        meta={["OAuth token expired"]}
      />
      <McpServerRow
        name="Notion"
        initials="NO"
        description="Search and edit pages."
        statusLabel="Idle"
        statusTone="neutral"
        meta={["Never used"]}
      />
    </div>
  );
}
