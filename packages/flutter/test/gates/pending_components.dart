/// Components that exist in [reactComponentsPath] but have no
/// `lib/src/components/<slug>.dart` file yet.
///
/// The parity gate asserts `reactSlugs == implementedSlugs ∪ pendingComponents`,
/// so this list is a ledger, not an exemption: every component todo deletes its
/// own slug from here in the same change that adds the component file, its
/// barrel export and its gallery section. `test/gates_final/pending_empty_test.dart`
/// asserts this list is empty once the last component lands.
const List<String> pendingComponents = <String>[];
