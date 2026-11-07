import { McpServerRow, MenuItem, MenuSeparator } from "@horon-ai/react";

export default function McpServerRowRows() {
  return (
    <div className="w-full rounded-2xl border border-border-default bg-bg-surface px-5">
      <McpServerRow
        name="Linear"
        tags={["Official"]}
        brandTags={["All devices"]}
        description="Read and update issues, projects and cycles."
        meta={["12 tools", "Last used today", "v1.4"]}
        menu={
          <>
            <MenuItem>View tools</MenuItem>
            <MenuSeparator />
            <MenuItem danger>Remove</MenuItem>
          </>
        }
      />
      <McpServerRow
        name="Notion"
        tags={["Official"]}
        description="Search and edit pages and databases."
        meta={["8 tools", "Last used yesterday"]}
        menu={<MenuItem>View tools</MenuItem>}
      />
      <McpServerRow
        name="Sentry"
        tags={["Community"]}
        description="Read issues and release health."
        meta={["6 tools", "Never used", "v0.6"]}
      />
    </div>
  );
}
