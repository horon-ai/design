import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';
import 'pending_components.dart';

/// The React package is the source of truth for which components exist. This
/// gate keeps the Flutter port honest while it is being built: the React slug
/// set must equal the implemented component files plus the pending ledger.
///
/// It is incremental on purpose. Every component todo deletes its own slug from
/// `pending_components.dart` in the same change that adds
/// `lib/src/components/<slug>.dart`, so the gate is green after every todo and
/// cannot silently drift from React. `test/gates_final/pending_empty_test.dart`
/// asserts the ledger is empty once the last component lands; it lives outside
/// `test/gates` because the ledger is legitimately non-empty until then.
///
/// Barrel exception: `chart` is exported from the package's `chart.dart`
/// subpath only, never from `lib/horon_ui.dart`. `fl_chart` would otherwise be
/// part of every app bundle that imports the design system, the same reason the
/// React package keeps `chart` off its entry point. This gate still requires a
/// `chart` component file and a gallery section for it; only the barrel export
/// differs.
void main() {
  test('parity: every React component has a Flutter file', () {
    final reactSlugs = reactComponentSlugs();
    final implemented = implementedComponentSlugs();
    final covered = <String>{...implemented, ...pendingComponents};

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

  test('parity: the pending ledger lists only unimplemented components', () {
    final implemented = implementedComponentSlugs();
    final stale = (pendingComponents.where(implemented.contains).toList()..sort());
    expect(
      stale,
      isEmpty,
      reason:
          'These slugs have a component file and are still listed as pending: $stale. '
          'Delete them from pendingComponents in the change that adds the file.',
    );
  });

  test('parity: the React component source is readable', () {
    // A gate that cannot find React must fail, not pass over an empty set.
    expect(Directory(reactComponentsPath).existsSync(), isTrue);
    expect(reactComponentSlugs(), isNotEmpty);
  });
}
