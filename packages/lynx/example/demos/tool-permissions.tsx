import { ToolPermissions } from "../../src/components/tool-permissions";

/**
 * The read-only tool set from the site demo: one row per tool with its starting
 * permission, so the Allow / Ask / Off segments and "Allow all" can be exercised.
 */
export default function ToolPermissionsDemo() {
  return (
    <view className="flex w-full flex-row justify-center p-4">
      <ToolPermissions
        title="Read-only"
        tools={[
          { name: "list_issues", description: "List issues in a project or cycle", defaultValue: "allow" },
          { name: "get_issue", description: "Read one issue with its comments", defaultValue: "ask" },
          { name: "search_documents", description: "Full-text search across documents", defaultValue: "off" },
        ]}
      />
    </view>
  );
}
