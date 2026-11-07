import { McpServerRow, MenuItem, MenuSeparator } from "@horon-ai/react";

export default function McpServerRowThumbnail() {
  return (
    <div className="w-[330px] rounded-xl border border-border-default bg-bg-surface px-4">
      <McpServerRow
        name="Linear"
        tags={["Official"]}
        description="Issues, projects and cycles."
        meta={["12 tools", "Last used today"]}
        menu={
          <>
            <MenuItem>View tools</MenuItem>
            <MenuSeparator />
            <MenuItem danger>Remove</MenuItem>
          </>
        }
      />
    </div>
  );
}
