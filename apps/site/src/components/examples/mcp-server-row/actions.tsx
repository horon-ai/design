import { McpServerRow, MenuItem, MenuSeparator } from "@horon-ai/react";

export default function McpServerRowActions() {
  return (
    <div className="w-full rounded-2xl border border-border-default bg-bg-surface px-5">
      <McpServerRow
        name="Linear"
        tags={["Official"]}
        description="Read and update issues, projects and cycles."
        meta={["12 tools", "OAuth"]}
        configureLabel="Settings"
        onConfigure={() => undefined}
        menu={
          <>
            <MenuItem>View tools</MenuItem>
            <MenuItem>Copy config</MenuItem>
            <MenuSeparator />
            <MenuItem danger>Remove</MenuItem>
          </>
        }
        menuLabel="Server actions"
      />
    </div>
  );
}
