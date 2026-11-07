/**
 * Slugs that exist in `@horon-ai/react` but have no Lynx component yet.
 *
 * This is the Flutter package's ledger pattern: the parity gate compares the
 * React component directory against the Lynx one and requires the difference to
 * be exactly this list. `scripts/integrate.ts` rewrites the list from the two
 * directories, so the gate turns green as the port fills in instead of staying
 * red for the whole migration, and the ledger cannot drift from the sources.
 *
 * 44 of 84 React slugs are still unported.
 */
export const pendingComponents: readonly string[] = [
  "agent-activity",
  "agent-lane",
  "agent-lanes-timeline",
  "agent-panel",
  "agent-steering-panel",
  "approval-card",
  "bot-instructions-panel",
  "bot-list-row",
  "bot-memory-panel",
  "breadcrumb-header",
  "chat-controls",
  "choice-card",
  "combobox",
  "command-palette",
  "composer",
  "data-table",
  "date-field",
  "directory-card",
  "document-extract-panel",
  "file-drop",
  "flue-background",
  "integration-row",
  "knowledge-base-panel",
  "list-detail",
  "marketplace-card",
  "mcp-server-row",
  "message-extras",
  "orchestrator-panel",
  "page-header",
  "plan-card",
  "plan-step",
  "plugin-row",
  "research-run-panel",
  "schedule",
  "select",
  "settings-list",
  "sidebar",
  "source-row",
  "split-button",
  "task-row",
  "tool-call",
  "tool-calls-header",
  "tool-permissions",
  "top-bar",
];
