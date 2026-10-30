import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';
import 'pending_components.dart';

/// The React package is the source of truth for which components exist. This
/// gate keeps the Flutter port honest while it is being built: the React slug
/// set (`packages/react/src/components`, 81 files) must equal the implemented
/// component files plus the pending ledger.
///
/// The ledger is seeded with every slug and shrinks as components land. During
/// the parallel waves each lane lands a file whose slug stays in the ledger
/// until the integrator runs, so this suite deliberately does NOT assert that a
/// ledger slug has no file. `scripts/integrate.mjs` rewrites the ledger from
/// the directory listing (a slug with a file comes out, a catalog slug without
/// one goes in), and `test/gates_final/pending_empty_test.dart` still enforces
/// an empty ledger at the end. It lives outside `test/gates` because the ledger
/// is legitimately non-empty until then.
///
/// Because the ledger is the only list of missing components, an empty
/// component directory is legitimate here: parity still fails if a React
/// component is neither a file nor a ledger entry.
void main() {
  test('parity: every React component has a Flutter file', () {
    final reactSlugs = reactComponentSlugs();
    final implemented = implementedComponentSlugs();
    final covered = <String>{...implemented, ...pendingComponents};
    // The numbers the evidence file quotes; `flutter test -r expanded` prints them.
    // ignore: avoid_print
    print('parity: react=${reactSlugs.length} implemented=${implemented.length} pending=${pendingComponents.length}');

    final missing = (reactSlugs.difference(covered).toList()..sort());
    final extra = (covered.difference(reactSlugs).toList()..sort());

    expect(
      missing,
      isEmpty,
      reason:
          'React components with no Flutter file and no ledger entry: $missing. '
          'Add lib/src/components/<slug>.dart or list the slug in pendingComponents.',
    );
    expect(
      extra,
      isEmpty,
      reason:
          'Slugs that are neither React components nor React components with a Flutter file: $extra. '
          'React is the source of truth; remove the stale entry.',
    );
  });

  test('parity: the pending ledger has no duplicates', () {
    final duplicates = <String>{};
    final seen = <String>{};
    for (final slug in pendingComponents) {
      if (!seen.add(slug)) duplicates.add(slug);
    }
    expect(duplicates, isEmpty, reason: 'pendingComponents repeats: ${duplicates.toList()..sort()}');
  });

  test('parity: the React component source is readable', () {
    // A gate that cannot find React must fail, not pass over an empty set.
    expect(Directory(reactComponentsPath).existsSync(), isTrue);
    expect(reactComponentSlugs(), isNotEmpty);
  });
}
