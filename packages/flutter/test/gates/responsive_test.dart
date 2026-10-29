import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';

/// The rebuild rule for narrow screens: a control wraps or shrinks, it never
/// scrolls sideways. A horizontal `SingleChildScrollView` inside a component
/// hides part of a control behind a gesture the user cannot discover, and the
/// web components never do it.
///
/// The scan reads comment-free source and looks for a `SingleChildScrollView(`
/// call whose own argument list (not a nested call's) contains
/// `scrollDirection: Axis.horizontal`. It reports file and line.
///
/// Exactly one file is exempt: `lib/src/components/data_table.dart`. A data
/// table's body legitimately scrolls horizontally inside its card (React uses
/// `overflow-x-auto` plus `min-w-max` on the table), and the data-table lane's
/// contract allows it there. Every other component still fails.
const Set<String> horizontalScrollExemptSlugs = <String>{'data_table'};

void main() {
  test('responsive: no component scrolls a control horizontally', () {
    final hits = <String>[];
    for (final entry in componentFilesBySlug().entries) {
      if (horizontalScrollExemptSlugs.contains(entry.key)) continue;
      for (final line in horizontalScrollViewLines(entry.value.readAsStringSync())) {
        hits.add('${entry.value.path}:$line');
      }
    }
    expect(
      hits..sort(),
      isEmpty,
      reason:
          'Horizontal SingleChildScrollView in components: $hits. '
          'Wrap (Wrap, Flexible) or shrink (FittedBox, smaller gaps) instead of scrolling a control.',
    );
  });

  test('responsive: the scan finds a horizontal scroll view and ignores the rest', () {
    const source = '''
// SingleChildScrollView(scrollDirection: Axis.horizontal)
final ok = SingleChildScrollView(child: Text('vertical'));
final alsoOk = SingleChildScrollView(
  scrollDirection: Axis.vertical,
  child: Row(children: const []),
);
final bad = SingleChildScrollView(
  padding: EdgeInsets.zero,
  scrollDirection: Axis.horizontal,
  child: Row(children: const []),
);
final nested = SingleChildScrollView(
  child: ListView(scrollDirection: Axis.horizontal),
);
''';
    expect(horizontalScrollViewLines(source), <int>[9]);
  });

  test('responsive: only the data table is exempt', () {
    expect(horizontalScrollExemptSlugs, <String>{'data_table'});
  });

  test('responsive: the scan covers every file the component directory lists', () {
    // An empty directory is legitimate before the first component lands.
    final listed = Directory(flutterComponentsPath).existsSync()
        ? Directory(flutterComponentsPath).listSync(recursive: true).where((e) => e.path.endsWith('.dart')).length
        : 0;
    expect(componentFilesBySlug().length, listed);
  });
}

/// 1-based lines where a `SingleChildScrollView(` call carries
/// `scrollDirection: Axis.horizontal` in its own argument list.
List<int> horizontalScrollViewLines(String source) {
  final code = stripComments(source);
  final direction = RegExp(r'scrollDirection\s*:\s*Axis\.horizontal');
  final lines = <int>[];
  for (final call in RegExp(r'\bSingleChildScrollView\s*\(').allMatches(code)) {
    final open = call.end - 1;
    var depth = 0;
    var close = code.length;
    for (var index = open; index < code.length; index++) {
      if (code[index] == '(') depth++;
      if (code[index] == ')') {
        depth--;
        if (depth == 0) {
          close = index;
          break;
        }
      }
    }
    // Blank out nested brackets so only the call's own arguments remain, but
    // keep offsets so the line number still points into the file.
    final own = StringBuffer();
    depth = 0;
    for (var index = open + 1; index < close; index++) {
      final char = code[index];
      final opens = char == '(' || char == '[' || char == '{';
      final closes = char == ')' || char == ']' || char == '}';
      if (closes) depth--;
      own.write(depth == 0 || char == '\n' ? char : ' ');
      if (opens) depth++;
    }
    final match = direction.firstMatch(own.toString());
    if (match == null) continue;
    final offset = open + 1 + match.start;
    lines.add('\n'.allMatches(code.substring(0, offset)).length + 1);
  }
  return lines;
}
