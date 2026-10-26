import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';

/// Component code reads colour, spacing and radius from the generated tokens,
/// never from a literal. A `Color(0xFF…)` inside a component is a value that
/// the token pipeline cannot see, so it silently survives a theme change and
/// drifts from the web build.
///
/// The scan is limited to `lib/src/components/**`. `lib/src/tokens/**` is where
/// literals are allowed to exist: it holds the generated and hand-written
/// constants that everything else reads. `Colors.transparent` is allowed
/// because it is the absence of colour, not a palette value.
void main() {
  final patterns = <String, RegExp>{
    'Color(0x…': RegExp(r'\bColor\(\s*0x'),
    'Colors.<name>': RegExp(r'\bColors\.(?!transparent\b)[A-Za-z_]\w*'),
    'EdgeInsets.all(<digit>)': RegExp(r'\bEdgeInsets\.all\(\s*\d'),
    'BorderRadius.circular(<digit>)': RegExp(r'\bBorderRadius\.circular\(\s*\d'),
  };

  test('raw literals: components read tokens instead of literals', () {
    final hits = <String>[];

    for (final entry in componentFilesBySlug().entries) {
      final source = stripComments(entry.value.readAsStringSync());
      final lines = source.split('\n');
      for (var index = 0; index < lines.length; index++) {
        for (final pattern in patterns.entries) {
          if (pattern.value.hasMatch(lines[index])) {
            hits.add('${entry.key}.dart:${index + 1}: ${pattern.key} -> ${lines[index].trim()}');
          }
        }
      }
    }

    expect(
      hits,
      isEmpty,
      reason:
          'Raw design literals in components: $hits. '
          'Read the value from HoronThemeData or lib/src/tokens instead.',
    );
  });

  test('raw literals: the patterns catch their own targets', () {
    // A regex typo would make the gate above pass forever.
    expect(patterns['Color(0x…']!.hasMatch('color: Color(0xFF000000)'), isTrue);
    expect(patterns['Colors.<name>']!.hasMatch('color: Colors.white'), isTrue);
    expect(patterns['Colors.<name>']!.hasMatch('color: Colors.transparent'), isFalse);
    expect(patterns['EdgeInsets.all(<digit>)']!.hasMatch('padding: EdgeInsets.all(8)'), isTrue);
    expect(patterns['EdgeInsets.all(<digit>)']!.hasMatch('padding: EdgeInsets.all(HoronSpacing.sm)'), isFalse);
    expect(patterns['BorderRadius.circular(<digit>)']!.hasMatch('BorderRadius.circular(12)'), isTrue);
  });

  test('raw literals: comments and strings are not flagged', () {
    expect(stripComments('// Color(0xFF000000)\nfinal x = 1;'), isNot(contains('Color(')));
    expect(stripComments("const url = 'http://example.com';\n"), contains('http://example.com'));
  });
}
