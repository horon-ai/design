import { LiquidGlass, McpServerRow, MenuItem, MenuSeparator } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Rows() {
  return (
    <div className="min-w-100">
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
        statusLabel="Needs auth"
        statusTone="warning"
      />
    </div>
  );
}

export default function McpServerRowDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="w-full max-w-190 overflow-x-auto rounded-2xl border border-border-default bg-bg-surface px-5">
          <Rows />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-caption text-text-secondary">Glass</p>
        <Backdrop className="flex-col">
          <div className="relative w-full max-w-190 overflow-clip rounded-2xl bg-glass-thick px-5">
            <LiquidGlass />
            <div className="relative overflow-x-auto">
              <Rows />
            </div>
          </div>
        </Backdrop>
      </div>
    </div>
  );
}
