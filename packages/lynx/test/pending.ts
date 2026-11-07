/**
 * Slugs that exist in `@horon-ai/react` but have no Lynx component yet.
 *
 * This is the Flutter package's ledger pattern: the parity gate compares the
 * React component directory against the Lynx one and requires the difference to
 * be exactly this list. `scripts/integrate.ts` rewrites the list from the two
 * directories, so the gate turns green as the port fills in instead of staying
 * red for the whole migration, and the ledger cannot drift from the sources.
 *
 * 12 of 84 React slugs are still unported.
 */
export const pendingComponents: readonly string[] = [
  "agent-activity",
  "agent-lane",
  "agent-lanes-timeline",
  "agent-panel",
  "agent-steering-panel",
  "orchestrator-panel",
  "research-run-panel",
  "schedule",
  "sidebar",
  "tool-call",
  "tool-calls-header",
  "tool-permissions",
];
