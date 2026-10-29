import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';

/// Every public class and enum under `lib/src/components` must carry the
/// `Horon` prefix.
///
/// This is a compile-blocker, not a style preference. `package:flutter/material.dart`
/// already exports `Card`, `Chip`, `Switch`, `Slider`, `Tooltip`, `Drawer`,
/// `Dialog`, `Badge`, `Stepper`, `Table` and `Form`, and `List` shadows
/// `dart:core`'s. A component class without the prefix collides with those at
/// the call site and stops the mobile app from compiling. Matching a component
/// to its React counterpart is the file slug's job, not the class name's.
/// Class and enum names declared in [source], comments stripped. Public and
/// private alike; the caller decides what to do with an underscore.
List<String> declaredTypeNames(String source) {
  final code = stripComments(source);
  return <String>[
    for (final match in RegExp(
      r'^\s*(?:abstract\s+|final\s+|sealed\s+|base\s+|interface\s+|mixin\s+)*class\s+([A-Za-z_]\w*)',
      multiLine: true,
    ).allMatches(code))
      match.group(1)!,
    for (final match in RegExp(r'^\s*enum\s+([A-Za-z_]\w*)', multiLine: true).allMatches(code)) match.group(1)!,
  ];
}

/// Every `.dart` file the component directory lists, independent of the
/// slug-keyed map the scan uses. The self-check compares the two.
List<File> listedComponentFiles() {
  final directory = Directory(flutterComponentsPath);
  if (!directory.existsSync()) return <File>[];
  return <File>[
    for (final entity in directory.listSync(recursive: true))
      if (entity is File && entity.path.endsWith('.dart')) entity,
  ];
}

void main() {
  final declarations = <String, String>{}; // name -> slug
  final violations = <String>[];

  setUpAll(() {
    for (final entry in componentFilesBySlug().entries) {
      for (final name in declaredTypeNames(entry.value.readAsStringSync())) {
        declarations[name] = entry.key;
        if (name.startsWith('_')) continue; // private declarations are internal
        if (!name.startsWith('Horon')) violations.add('${entry.key}.dart: $name');
      }
    }
  });

  test('naming: every public component class and enum starts with Horon', () {
    expect(
      violations..sort(),
      isEmpty,
      reason:
          'These declarations collide with material.dart or dart:core: $violations. '
          'Prefix them with Horon (for example Card becomes HoronCard).',
    );
  });

  test('naming: the scan saw every file the component directory lists', () {
    // An empty directory is legitimate while the ledger still lists every
    // slug; parity covers emptiness. What must never happen is a file on disk
    // that the scan skipped, because that file would escape the prefix check.
    final listed = (listedComponentFiles().map((file) => file.path).toList()..sort());
    final scanned = (componentFilesBySlug().values.map((file) => file.path).toList()..sort());
    expect(scanned, listed, reason: 'The scan skipped files the directory lists.');
  });

  test('naming: every landed component class is covered by the scan', () {
    // A landed file that declares no class or enum at all is not a component.
    final bare = <String>[
      for (final entry in componentFilesBySlug().entries)
        if (declaredTypeNames(entry.value.readAsStringSync()).isEmpty) '${entry.key}.dart',
    ]..sort();
    expect(bare, isEmpty, reason: 'These files declare no class or enum, so the scan cannot judge them: $bare');
    for (final slug in componentFilesBySlug().keys) {
      expect(declarations.values, contains(slug), reason: '$slug.dart was not reached by the scan');
    }
  });

  test('naming: the scan mechanism finds and flags declarations', () {
    // A regex typo would make the gates above pass forever.
    const sample = '''
// class CommentedOut {}
class Card extends StatelessWidget {}
final class HoronButton {}
abstract class _Private {}
enum Size { sm }
enum HoronSize { sm }
''';
    final names = declaredTypeNames(sample);
    expect(names, <String>['Card', 'HoronButton', '_Private', 'Size', 'HoronSize']);
    expect(names.where((name) => !name.startsWith('_') && !name.startsWith('Horon')), <String>['Card', 'Size']);
  });
}
