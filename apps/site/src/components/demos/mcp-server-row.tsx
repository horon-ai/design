import { McpServerRow, MenuItem, MenuSeparator } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function McpServerRowDemo() {
  return (
    <Backdrop className="flex-col">
      <div className="w-full max-w-190 rounded-2xl bg-glass-thick px-5">
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
      </div>
    </Backdrop>
  );
}
