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
void main() {
  final declarations = <String, String>{}; // name -> file
  final violations = <String>[];

  setUpAll(() {
    for (final entry in componentFilesBySlug().entries) {
      final source = stripComments(entry.value.readAsStringSync());
      final names = <String>[
        for (final match in RegExp(
          r'^\s*(?:abstract\s+|final\s+|sealed\s+|base\s+|interface\s+|mixin\s+)*class\s+([A-Za-z_]\w*)',
          multiLine: true,
        ).allMatches(source))
          match.group(1)!,
        for (final match in RegExp(r'^\s*enum\s+([A-Za-z_]\w*)', multiLine: true).allMatches(source)) match.group(1)!,
      ];
      for (final name in names) {
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

  test('naming: the component directory was scanned', () {
    // A gate that silently reads zero files would pass forever. The directory
    // legitimately does not exist before the first component lands; once it
    // does, every file in it must be readable Dart source.
    final files = componentFilesBySlug();
    if (!Directory(flutterComponentsPath).existsSync()) return;
    expect(files, isNotEmpty, reason: 'No .dart files under $flutterComponentsPath.');
  });
}
