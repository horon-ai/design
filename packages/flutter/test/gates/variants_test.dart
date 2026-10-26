import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';

/// The variant vocabulary is part of the design system's contract: a caller
/// porting a screen must find the same names React offers, so a React
/// `size="icon-sm"` must have a Flutter counterpart rather than an invented
/// synonym.
///
/// The comparison is on names only. React's cva keys are normalized to Dart
/// identifiers first (kebab-case becomes camelCase, numeric keys become
/// `level<n>`, and a reserved word such as `default` is spelled `defaultValue`
/// because Dart rejects it as an identifier). The union of a component's React
/// variant option keys must equal the union of the values of its public enums.
///
/// Components with no `variants:` block in React have nothing to compare and
/// pass with an empty list. Pending components are skipped: they have no Dart
/// file yet, and the parity gate already tracks them.
void main() {
  test('variants: every component exposes its React variant names', () {
    final failures = <String>[];

    for (final slug in (implementedComponentSlugs().toList()..sort())) {
      final reactFile = reactComponentFile(slug);
      final groups = reactVariantGroups(reactFile.readAsStringSync());
      if (groups.isEmpty) continue;

      final reactNames = <String>{for (final values in groups.values) ...values};

      final dartFile = componentFilesBySlug()[slug]!;
      final enums = dartEnums(dartFile.readAsStringSync());
      final variantEnums = <String, List<String>>{
        for (final entry in enums.entries)
          if (entry.key.startsWith('Horon') && entry.value.isNotEmpty) entry.key: entry.value,
      };

      if (variantEnums.isEmpty) {
        failures.add(
          '$slug: React declares variant options ${reactNames.toList()..sort()} '
          'but $slug.dart declares no public enum',
        );
        continue;
      }

      final dartNames = <String>{for (final values in variantEnums.values) ...values};
      final missing = (reactNames.difference(dartNames).toList()..sort());
      final extra = (dartNames.difference(reactNames).toList()..sort());

      if (missing.isNotEmpty) {
        failures.add('$slug: React variant names with no Dart enum value: $missing');
      }
      if (extra.isNotEmpty) {
        failures.add('$slug: Dart enum values with no React variant: $extra');
      }
    }

    expect(
      failures,
      isEmpty,
      reason:
          'Variant vocabulary drifted from React: $failures. '
          'Use the React option names (kebab-case to camelCase, numbers to level<n>, '
          'reserved words spelled <key>Value).',
    );
  });

  test('variants: the React variant parser reads real keys', () {
    // Guards against a parser that quietly returns nothing for every file and
    // lets the gate above pass over an empty comparison. `button` has two
    // groups (variant, size) with eight sizes including `icon-xs`.
    final groups = reactVariantGroups(reactComponentFile('button').readAsStringSync());
    expect(groups.keys.toSet(), <String>{'variant', 'size'});
    expect(groups['variant'], <String>{'defaultValue', 'outline', 'secondary', 'ghost', 'destructive', 'link'});
    expect(groups['size'], <String>{'defaultValue', 'xs', 'sm', 'lg', 'icon', 'iconXs', 'iconSm', 'iconLg'});
  });

  test('variants: numeric keys become level<n>', () {
    final groups = reactVariantGroups(reactComponentFile('typography').readAsStringSync());
    expect(groups['level'], <String>{'level1', 'level2', 'level3', 'level4'});
  });
}
