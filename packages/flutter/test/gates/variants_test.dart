import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';

/// The variant vocabulary is part of the design system's contract: a caller
/// porting a screen must find the same names React offers.
///
/// The rebuilt React set declares its vocabularies as TypeScript literals, not
/// cva blocks:
///
///  * a union, `export type ButtonSize = "sm" | "md" | "lg";`
///  * a string-literal array, `export const iconNames = ["plus", ...] as const;`
///
/// Each of those must have exactly one public Dart enum with an identical value
/// set, and every public Dart enum must match one of them (a bijection by value
/// set). Names are normalized first: kebab-case becomes camelCase, numeric keys
/// become `level<n>`, and a reserved word such as `default` is spelled
/// `defaultValue`. The Dart enum's own name is free (`HoronIconName` and
/// `HoronIcons` are the same vocabulary); only the values are compared.
///
/// A private enum (`_Foo`) is an implementation detail with free-form values
/// and is ignored. A component with no React vocabulary and no public enum
/// passes; one with a public enum and no React vocabulary fails, because it has
/// invented a variant React does not have. Pending components are skipped: they
/// have no Dart file yet and the parity gate tracks them.
void main() {
  test('variants: every component matches its React vocabularies one to one', () {
    final failures = <String>[];
    for (final slug in (implementedComponentSlugs().toList()..sort())) {
      final dartSource = componentFilesBySlug()[slug]!.readAsStringSync();
      failures.addAll(compareVocabularies(slug, reactUnionTypes(slug), dartEnums(dartSource)));
    }
    expect(
      failures,
      isEmpty,
      reason:
          'Variant vocabulary drifted from React: $failures. '
          'Give each React union or as-const array one public Horon enum with the same values '
          '(kebab-case to camelCase, numbers to level<n>, reserved words spelled <key>Value).',
    );
  });

  test('variants: the React union parser reads real declarations', () {
    // Guards against a parser that quietly returns nothing for every file and
    // lets the gate above pass over an empty comparison.
    final button = reactUnionTypes('button');
    expect(button['ButtonVariant'], <String>{'primary', 'glass', 'danger', 'link'});
    expect(button['ButtonSize'], <String>{'sm', 'md', 'lg'});
    expect(button.keys, isNot(contains('ButtonProps')), reason: 'Omit<ComponentProps<...>> is not a literal union');

    expect(reactUnionTypes('badge')['BadgeTone'], <String>{'neutral', 'brand', 'danger', 'solid'});

    final icon = reactUnionTypes('horon_icon');
    expect(icon['iconNames'], isNotNull, reason: 'the as-const string array is a vocabulary');
    expect(icon['iconNames'], contains('plus'));
    expect(icon['iconNames']!.length, greaterThan(20));
    expect(icon.keys, isNot(contains('HoronIconName')), reason: '(typeof iconNames)[number] is not a literal union');
  });

  test('variants: only string literals count', () {
    const source = '''
export type Mixed = "a" | Foo;
export type Pure = "a" | 'b-c'
  | "default";
export type Leading =
  | "x"
  | "y";
export type Mapped = Record<Size, string>;
export type Props = Omit<ComponentProps<"button">, "className"> & { size?: "sm" | "lg" };
// export type Commented = "z";
export const tones = ["one", "two-words",] as const;
export const loose = ["no", "const"];
''';
    final parsed = parseReactUnionTypes(source);
    expect(parsed.keys.toSet(), <String>{'Pure', 'Leading', 'tones'});
    expect(parsed['Pure'], <String>{'a', 'bC', 'defaultValue'});
    expect(parsed['Leading'], <String>{'x', 'y'});
    expect(parsed['tones'], <String>{'one', 'twoWords'});
  });

  test('variants: the comparison catches each kind of drift', () {
    final union = <String, Set<String>>{
      'ButtonSize': <String>{'sm', 'md'},
    };
    final enums = <String, List<String>>{
      'HoronButtonSize': <String>['sm', 'md'],
    };
    expect(compareVocabularies('x', union, enums), isEmpty);
    expect(compareVocabularies('x', <String, Set<String>>{}, <String, List<String>>{}), isEmpty);
    expect(
      compareVocabularies('x', <String, Set<String>>{}, <String, List<String>>{
        '_Free': <String>['a'],
      }),
      isEmpty,
    );

    expect(compareVocabularies('ghost', <String, Set<String>>{}, enums), anyElement(contains('ghost')));
    expect(compareVocabularies('x', union, <String, List<String>>{}), anyElement(contains('ButtonSize')));
    expect(
      compareVocabularies('x', union, <String, List<String>>{
        'HoronButtonSize': <String>['sm', 'lg'],
      }),
      isNotEmpty,
    );
    expect(
      compareVocabularies('x', union, <String, List<String>>{
        'HoronA': <String>['sm', 'md'],
        'HoronB': <String>['md', 'sm'],
      }),
      anyElement(contains('exactly one')),
    );
  });
}

/// Compares the React vocabularies of one component with its Dart enums and
/// returns one message per mismatch (empty when the two sides agree).
///
/// Vocabularies are matched by value set, not by name, and counted: two React
/// unions with the same values need two Dart enums.
List<String> compareVocabularies(
  String slug,
  Map<String, Set<String>> reactVocabularies,
  Map<String, List<String>> dartEnumValues,
) {
  final failures = <String>[];
  final publicEnums = <String, Set<String>>{
    for (final entry in dartEnumValues.entries)
      if (entry.key.startsWith('Horon')) entry.key: entry.value.toSet(),
  };

  if (reactVocabularies.isEmpty) {
    if (publicEnums.isNotEmpty) {
      failures.add(
        '$slug: React declares no literal union or as-const array, but $slug.dart declares public '
        'enums ${publicEnums.keys.toList()..sort()}. Make them private (_Name) or add the union to React.',
      );
    }
    return failures;
  }

  String keyOf(Set<String> values) => (values.toList()..sort()).join('|');
  final enumsByValues = <String, List<String>>{};
  for (final entry in publicEnums.entries) {
    enumsByValues.putIfAbsent(keyOf(entry.value), () => <String>[]).add(entry.key);
  }
  final reactByValues = <String, List<String>>{};
  for (final entry in reactVocabularies.entries) {
    reactByValues.putIfAbsent(keyOf(entry.value), () => <String>[]).add(entry.key);
  }

  for (final entry in reactVocabularies.entries) {
    final matches = enumsByValues[keyOf(entry.value)] ?? const <String>[];
    final sameReact = reactByValues[keyOf(entry.value)]!.length;
    if (matches.isEmpty) {
      failures.add(
        '$slug: React ${entry.key} ${(entry.value.toList()..sort())} has no public Dart enum with exactly '
        'those values',
      );
    } else if (matches.length != sameReact) {
      failures.add(
        '$slug: React ${entry.key} needs exactly one Dart enum with its values, found $matches '
        'for $sameReact React vocabularies',
      );
    }
  }
  for (final entry in publicEnums.entries) {
    if (!reactByValues.containsKey(keyOf(entry.value))) {
      failures.add(
        '$slug: Dart enum ${entry.key} ${(entry.value.toList()..sort())} matches no React union or as-const array',
      );
    }
  }
  return failures;
}
