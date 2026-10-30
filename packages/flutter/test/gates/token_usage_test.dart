import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

import 'gate_sources.dart';

/// Components and gallery sections read design values through the theme groups
/// (`theme.colors.textPrimary`, `theme.space.s4`, `theme.radius.md`, ...). A
/// name that the generated tokens do not expose is a compile error at best and,
/// when a lane guessed a name from the web CSS, a missing token at worst. This
/// gate reads the names the token and theme files really declare and fails on
/// any other `<receiver>.colors.<name>`, `.text.<name>`, `.glass.<name>`,
/// `.space.<name>`, `.radius.<name>` or `.shadows.<name>` access.
///
/// Group to declaring class:
///
///     colors  -> HoronColors       lib/src/tokens/horon_tokens.g.dart
///     text    -> HoronTextStyles   lib/src/tokens/horon_tokens.g.dart
///     glass   -> HoronGlassTokens  lib/src/tokens/horon_tokens.g.dart
///     space   -> HoronSpaceSpec    lib/src/theme/horon_theme.dart
///     radius  -> HoronRadiusSpec   lib/src/theme/horon_theme.dart
///     shadows -> HoronShadowSpec   lib/src/theme/horon_theme.dart
///
/// Two group names are also Flutter members. The scan ignores `x.text.<name>`
/// when `x` is a text controller or editing value (`controller.text.isEmpty` is
/// a `String` member), and `x.colors.<name>` / `x.shadows.<name>` when `<name>`
/// is a `List` member (`gradient.colors.first`). Those are not theme reads.
const Map<String, ({String file, String type})> tokenGroups = <String, ({String file, String type})>{
  'colors': (file: 'lib/src/tokens/horon_tokens.g.dart', type: 'HoronColors'),
  'text': (file: 'lib/src/tokens/horon_tokens.g.dart', type: 'HoronTextStyles'),
  'glass': (file: 'lib/src/tokens/horon_tokens.g.dart', type: 'HoronGlassTokens'),
  'space': (file: 'lib/src/theme/horon_theme.dart', type: 'HoronSpaceSpec'),
  'radius': (file: 'lib/src/theme/horon_theme.dart', type: 'HoronRadiusSpec'),
  'shadows': (file: 'lib/src/theme/horon_theme.dart', type: 'HoronShadowSpec'),
};

const String _gallerySectionsPath = 'example/lib/gallery/sections';

/// `List` and `String` members that follow `.colors`, `.shadows` or `.text` on
/// a Flutter type that is not a theme group.
const Set<String> _foreignMembers = <String>{
  'first',
  'last',
  'length',
  'isEmpty',
  'isNotEmpty',
  'single',
  'map',
  'where',
  'toList',
  'toSet',
  'any',
  'every',
  'contains',
  'indexOf',
  'reversed',
  'trim',
  'split',
  'substring',
  'startsWith',
  'endsWith',
  'toString',
  'hashCode',
  'runtimeType',
  'characters',
  'codeUnits',
  'toLowerCase',
  'toUpperCase',
  'replaceAll',
};

/// Members the class [typeName] declares, read from [source] with comments
/// stripped. Fields, getters, methods and static members count; constructors
/// and private names do not.
Set<String> declaredMembers(String source, String typeName) {
  final code = stripComments(source);
  final header = RegExp('\\bclass\\s+$typeName\\b[^{]*\\{').firstMatch(code);
  if (header == null) return <String>{};
  // Keep only the class body's own level: parameter lists collapse to "()" and
  // method bodies disappear, so default values and expressions are not read.
  final body = StringBuffer();
  var depth = 0;
  for (var index = header.end; index < code.length; index++) {
    final char = code[index];
    if (char == '{' || char == '(' || char == '[') {
      if (depth == 0 && char != '{') body.write(char);
      depth++;
      continue;
    }
    if (char == '}' || char == ')' || char == ']') {
      if (depth == 0) break;
      depth--;
      if (depth == 0 && char != '}') body.write(char);
      continue;
    }
    if (depth == 0) body.write(char);
  }
  final flat = body.toString();
  final members = <String>{};
  for (final match in RegExp(r'\bget\s+([A-Za-z]\w*)').allMatches(flat)) {
    members.add(match.group(1)!);
  }
  for (final match in RegExp(r'\b([a-z]\w*)\s*(?:;|=(?!=)|\(\))').allMatches(flat)) {
    members.add(match.group(1)!);
  }
  members.removeAll(<String>{'const', 'final', 'static', 'get', 'return', 'factory', 'late', 'required', 'this'});
  return members;
}

/// Each `.group.name` access in [source] with comments stripped. The receiver
/// may be anything; its identifier (if any) is kept for the foreign-member rule.
List<({String group, String name, int line, String receiver})> tokenAccesses(String source) {
  final code = stripComments(source);
  final accesses = <({String group, String name, int line, String receiver})>[];
  final pattern = RegExp(r'([A-Za-z_]\w*)?\s*\.\s*(colors|text|glass|space|radius|shadows)\s*\.\s*([A-Za-z_]\w*)');
  for (final match in pattern.allMatches(code)) {
    accesses.add((
      group: match.group(2)!,
      name: match.group(3)!,
      line: '\n'.allMatches(code.substring(0, match.start)).length + 1,
      receiver: match.group(1) ?? '',
    ));
  }
  return accesses;
}

bool _isForeign(String group, String name, String receiver) {
  if (group == 'text') {
    return RegExp(r'(controller|value|editing|field)$', caseSensitive: false).hasMatch(receiver) ||
        _foreignMembers.contains(name);
  }
  if (group == 'colors' || group == 'shadows') return _foreignMembers.contains(name);
  return false;
}

Map<String, Set<String>> exposedTokenMembers() => <String, Set<String>>{
  for (final entry in tokenGroups.entries)
    entry.key: declaredMembers(File(entry.value.file).readAsStringSync(), entry.value.type),
};

List<File> _scannedFiles() => <File>[
  for (final path in <String>[flutterComponentsPath, _gallerySectionsPath])
    if (Directory(path).existsSync())
      for (final entity in Directory(path).listSync(recursive: true))
        if (entity is File && entity.path.endsWith('.dart')) entity,
];

void main() {
  test('tokens: components and gallery sections read only names the tokens expose', () {
    final exposed = exposedTokenMembers();
    final unknown = <String>[];
    for (final file in _scannedFiles()) {
      for (final access in tokenAccesses(file.readAsStringSync())) {
        if (_isForeign(access.group, access.name, access.receiver)) continue;
        if (!exposed[access.group]!.contains(access.name)) {
          unknown.add('${file.path}:${access.line}: .${access.group}.${access.name}');
        }
      }
    }
    expect(
      unknown,
      isEmpty,
      reason:
          'Token names the generated tokens do not expose: $unknown. '
          'Look the name up in lib/src/tokens/horon_tokens.g.dart or lib/src/theme/horon_theme.dart.',
    );
  });

  test('tokens: the extracted member sets are not empty', () {
    // A parser that reads nothing would make the gate above pass forever.
    final exposed = exposedTokenMembers();
    for (final entry in exposed.entries) {
      expect(
        entry.value,
        isNotEmpty,
        reason: 'No members extracted for .${entry.key} (${tokenGroups[entry.key]!.type})',
      );
    }
    expect(exposed['colors'], containsAll(<String>['textPrimary', 'bgDefault', 'interactivePrimary']));
    expect(exposed['space'], containsAll(<String>['s4', 'step']));
    expect(exposed['radius'], containsAll(<String>['md', 'full']));
    expect(exposed['shadows'], containsAll(<String>['popover', 'palette']));
  });

  test('tokens: the access scan finds names and ignores comments and foreign receivers', () {
    const source = '''
// theme.colors.fromAComment
final a = theme.colors.textPrimary;
final b = HoronTheme.of(context).space.s4;
final c = controller.text.isEmpty;
final d = gradient.colors.first;
final e = theme.colors.notAToken;
''';
    final found = tokenAccesses(source);
    expect(found.map((access) => '${access.group}.${access.name}'), <String>[
      'colors.textPrimary',
      'space.s4',
      'text.isEmpty',
      'colors.first',
      'colors.notAToken',
    ]);
    expect(found.where((access) => !_isForeign(access.group, access.name, access.receiver)).length, 3);
    expect(found.last.line, 6);
    final members = declaredMembers(
      'class HoronSpaceSpec {\n  const HoronSpaceSpec({this.s1 = 4});\n  final double s1;\n'
          '  double get big => s1 * 2;\n  double step(double units) => units * s1;\n}\n',
      'HoronSpaceSpec',
    );
    expect(members, <String>{'s1', 'big', 'step'});
  });
}
