/// Components that exist in [reactComponentsPath] but have no
/// `lib/src/components/<slug>.dart` file yet.
///
/// The parity gate asserts `reactSlugs == implementedSlugs ∪ pendingComponents`,
/// so this list is a ledger, not an exemption. Lanes do not edit it: while the
/// waves run, a landed file may still be listed here. `scripts/integrate.mjs`
/// rewrites it from the directory listing (a slug with a file comes out, a
/// catalog slug without one goes in). `test/gates_final/pending_empty_test.dart`
/// asserts this list is empty once the last component lands.
const List<String> pendingComponents = <String>[
  'data_table',
  'sidebar',
  'menu',
  'command_palette',
  'workspace_menu',
  'chat_controls',
  'message_extras',
  'agent_activity',
  'agent_panel',
  'task_row',
  'agent_lane',
  'tool_call',
  'source_row',
  'orchestrator_panel',
  'knowledge_base_panel',
  'agent_steering_panel',
  'agent_lanes_timeline',
  'bot_instructions_panel',
  'document_extract_panel',
  'bot_memory_panel',
  'research_run_panel',
];
