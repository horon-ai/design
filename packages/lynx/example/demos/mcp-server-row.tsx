import { McpServerRow } from "../../src/components/mcp-server-row";
import { MenuItem, MenuSeparator } from "../../src/components/menu";
import { LiquidGlass } from "../../src/components/liquid-glass";
import { Backdrop } from "./backdrop";

/** Three servers: a full one with a menu, a plain one, and one flagged for re-authentication. */
function Rows() {
  return (
    <view className="flex w-full flex-col">
      <McpServerRow
        name="Linear"
        tags={["Official"]}
        brandTags={["All devices"]}
        description="Read and update issues, projects and cycles."
        meta={["12 tools", "Last used today", "v1.4"]}
        menu={
          <view className="flex flex-col">
            <MenuItem>View tools</MenuItem>
            <MenuSeparator />
            <MenuItem danger>Remove</MenuItem>
          </view>
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
        className="border-b-0"
        name="Sentry"
        tags={["Community"]}
        description="Read issues and release health."
        meta={["6 tools", "Never used", "v0.6"]}
        statusLabel="Needs auth"
        statusTone="warning"
      />
    </view>
  );
}

/** The list on a solid card and again on the thick glass panel, mirroring the site demo. */
export default function McpServerRowDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="w-full max-w-[760px] rounded-2xl border border-border-default bg-bg-surface px-5">
          <Rows />
        </view>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <view className="relative w-full max-w-[760px] overflow-hidden rounded-2xl bg-glass-thick px-5">
            <LiquidGlass />
            <view className="relative flex w-full flex-col">
              <Rows />
            </view>
          </view>
        </Backdrop>
      </view>
    </view>
  );
}
