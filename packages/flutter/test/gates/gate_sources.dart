import 'dart:io';

/// Shared lookups for the component gates.
///
/// React is the source of truth for which components exist. The gates read the
/// React sources from the file system rather than depending on the package: a
/// Dart package cannot depend on a TypeScript workspace.
///
/// Until the Flutter layer is rebuilt against the web components that were
/// rebuilt from Figma on 2026-10-26, the gates read the frozen copy of the
/// earlier 75 components in `reference/react-components/` (see its README).
/// Paths resolve from the package root, which is `flutter test`'s working
/// directory.
const String reactComponentsPath = 'reference/react-components';
const String flutterComponentsPath = 'lib/src/components';
const String galleryRegistryPath = 'example/lib/gallery/registry.dart';

/// Component slugs of the React package, in the snake_case form used for
/// Flutter file names: `alert-dialog.tsx` becomes `alert_dialog`.
Set<String> reactComponentSlugs() {
  final directory = Directory(reactComponentsPath);
  if (!directory.existsSync()) {
    throw StateError(
      'React component directory not found at "$reactComponentsPath" '
      '(resolved from ${Directory.current.path}).',
    );
  }
  return <String>{
    for (final file in directory.listSync().whereType<File>())
      if (file.path.endsWith('.tsx')) _slugOf(file),
  };
}

/// The React source file of one component.
File reactComponentFile(String slug) {
  final directory = Directory(reactComponentsPath);
  for (final file in directory.listSync().whereType<File>()) {
    if (file.path.endsWith('.tsx') && _slugOf(file) == slug) return file;
  }
  throw StateError('No React source for slug "$slug" under "$reactComponentsPath".');
}

/// Every `.dart` file under `lib/src/components`, keyed by slug.
Map<String, File> componentFilesBySlug() {
  final directory = Directory(flutterComponentsPath);
  if (!directory.existsSync()) return <String, File>{};
  return <String, File>{
    for (final file in directory.listSync(recursive: true).whereType<File>())
      if (file.path.endsWith('.dart')) _baseName(file).replaceAll('.dart', ''): file,
  };
}

/// Slugs that already have a component file.
Set<String> implementedComponentSlugs() => componentFilesBySlug().keys.toSet();

/// The gallery registry's source text. The gate parses it instead of importing
/// it: `example/` is a separate package and a test in the library package
/// cannot import across that boundary.
String galleryRegistrySource() {
  final file = File(galleryRegistryPath);
  if (!file.existsSync()) {
    throw StateError('Gallery registry not found at "$galleryRegistryPath".');
  }
  return file.readAsStringSync();
}

/// Slugs registered in `example/lib/gallery/registry.dart`.
Set<String> gallerySectionSlugs() {
  final source = stripComments(galleryRegistrySource());
  final slugs = <String>{};
  for (final call in RegExp(r'GallerySection\(').allMatches(source)) {
    final close = _matchingDelimiter(source, call.end - 1, '(', ')');
    if (close < 0) continue;
    final arguments = source.substring(call.end, close);
    final slug = RegExp("slug:\\s*'([^']+)'").firstMatch(arguments);
    if (slug != null) slugs.add(slug.group(1)!);
  }
  return slugs;
}

/// `alert_dialog` becomes `AlertDialog`, `button` becomes `Button`.
String pascalCase(String snake) =>
    snake.split('_').where((part) => part.isNotEmpty).map((part) => part[0].toUpperCase() + part.substring(1)).join();

/// Strips `//` and `/* */` comments so a gate judges code, not prose. A doc
/// comment that mentions a forbidden literal is not a violation; a literal in
/// code is. String literals are left untouched, so a `//` inside one survives.
String stripComments(String source) {
  final out = StringBuffer();
  var index = 0;
  while (index < source.length) {
    final char = source[index];
    if (char == '"' || char == "'") {
      final end = _endOfString(source, index);
      out.write(source.substring(index, end));
      index = end;
      continue;
    }
    if (source.startsWith('//', index)) {
      final end = source.indexOf('\n', index);
      if (end < 0) break;
      index = end;
      continue;
    }
    if (source.startsWith('/*', index)) {
      final end = source.indexOf('*/', index + 2);
      index = end < 0 ? source.length : end + 2;
      continue;
    }
    out.write(char);
    index++;
  }
  return out.toString();
}

/// cva variant option keys per variant group, normalized to Dart identifiers.
///
/// `alert.tsx` with `variants: { variant: { default: ..., success: ... } }`
/// becomes `{'variant': {'defaultValue', 'success'}}`. A file with no
/// `variants:` block returns an empty map, which the gate reads as "no variants
/// to match".
Map<String, Set<String>> reactVariantGroups(String source) {
  final code = stripComments(source);
  final groups = <String, Set<String>>{};
  final opener = RegExp(r'(?<![A-Za-z0-9_$])variants\s*:\s*\{');
  var searchFrom = 0;
  while (searchFrom < code.length) {
    final match = opener.firstMatch(code.substring(searchFrom));
    if (match == null) break;
    final open = searchFrom + match.end - 1;
    final close = _matchingDelimiter(code, open, '{', '}');
    if (close < 0) break;
    _collectVariantGroups(code.substring(open + 1, close), groups);
    searchFrom = close + 1;
  }
  return groups;
}

/// Enum values declared in a Dart source, keyed by enum name.
///
/// Only the value list before the first top-level `;` is read, so an enum with
/// fields and members parses the same as a plain one.
Map<String, List<String>> dartEnums(String source) {
  final code = stripComments(source);
  final enums = <String, List<String>>{};
  for (final match in RegExp(r'\benum\s+([A-Za-z_]\w*)\s*\{').allMatches(code)) {
    final open = code.indexOf('{', match.start);
    final close = _matchingDelimiter(code, open, '{', '}');
    if (close < 0) continue;
    enums[match.group(1)!] = _enumValues(code.substring(open + 1, close));
  }
  return enums;
}

/// Maps a React cva key to a Dart enum value name.
///
/// Kebab-case becomes camelCase (`icon-xs` becomes `iconXs`, `inline-start`
/// becomes `inlineStart`) and a numeric key becomes `level<n>` (`1` becomes
/// `level1`). A Dart reserved word cannot be an identifier — `default` is one
/// (`expected_identifier_but_got_keyword`) — so a reserved key is spelled
/// `<key>Value`: React's `default` variant becomes `defaultValue`.
String normalizeVariantKey(String key) {
  final bare = key.replaceAll(RegExp('^["\']|["\']\$'), '');
  if (RegExp(r'^\d+$').hasMatch(bare)) return 'level$bare';
  final camel = bare.split('-').asMap().entries.map((entry) {
    final part = entry.value;
    if (part.isEmpty) return part;
    return entry.key == 0 ? part : part[0].toUpperCase() + part.substring(1);
  }).join();
  return dartReservedWords.contains(camel) ? '${camel}Value' : camel;
}

/// Words that cannot be used as Dart identifiers, which the variant gate must
/// rename before comparing.
const Set<String> dartReservedWords = <String>{
  'assert',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'else',
  'enum',
  'extends',
  'false',
  'final',
  'finally',
  'for',
  'if',
  'in',
  'is',
  'new',
  'null',
  'rethrow',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'true',
  'try',
  'var',
  'void',
  'while',
  'with',
};

/// Reads the body of a `variants: {…}` block. The body is passed without its
/// outer braces, so a variant group key (`variant`, `size`, `level`) sits at
/// depth 0 and its option keys (`default`, `icon-xs`, `1`) at depth 1.
void _collectVariantGroups(String block, Map<String, Set<String>> groups) {
  final keyPattern = RegExp('''(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_\$-]+))\\s*:''');
  var depth = 0;
  var index = 0;
  String? group;
  while (index < block.length) {
    final char = block[index];
    if (char == '{') {
      depth++;
      index++;
      continue;
    }
    if (char == '}') {
      depth--;
      index++;
      continue;
    }
    if (char == '"' || char == "'") {
      final key = keyPattern.matchAsPrefix(block, index);
      if (key != null && depth <= 1) {
        _addVariantKey(key, groups, depth, group);
        group = depth == 0 ? key.group(1) ?? key.group(2) ?? key.group(3)! : group;
        index = key.end;
        continue;
      }
      index = _endOfString(block, index);
      continue;
    }
    if (depth <= 1) {
      final key = keyPattern.matchAsPrefix(block, index);
      if (key != null) {
        _addVariantKey(key, groups, depth, group);
        if (depth == 0) group = key.group(1) ?? key.group(2) ?? key.group(3)!;
        index = key.end;
        continue;
      }
    }
    index++;
  }
}

void _addVariantKey(Match key, Map<String, Set<String>> groups, int depth, String? group) {
  final name = key.group(1) ?? key.group(2) ?? key.group(3)!;
  if (depth == 0) {
    groups.putIfAbsent(name, () => <String>{});
  } else if (group != null) {
    groups[group]!.add(normalizeVariantKey(name));
  }
}

List<String> _enumValues(String body) {
  var depth = 0;
  var index = 0;
  var end = body.length;
  while (index < body.length) {
    final char = body[index];
    if (char == '"' || char == "'") {
      index = _endOfString(body, index);
      continue;
    }
    if (char == '(' || char == '[' || char == '{') depth++;
    if (char == ')' || char == ']' || char == '}') depth--;
    if (char == ';' && depth == 0) {
      end = index;
      break;
    }
    index++;
  }
  final values = <String>[];
  for (final chunk in _splitTopLevel(body.substring(0, end))) {
    final identifier = RegExp(r'^[A-Za-z_]\w*').firstMatch(chunk.trim());
    if (identifier != null) values.add(identifier.group(0)!);
  }
  return values;
}

List<String> _splitTopLevel(String text) {
  final chunks = <String>[];
  final current = StringBuffer();
  var depth = 0;
  var index = 0;
  while (index < text.length) {
    final char = text[index];
    if (char == '"' || char == "'") {
      final end = _endOfString(text, index);
      current.write(text.substring(index, end));
      index = end;
      continue;
    }
    if (char == '(' || char == '[' || char == '{') depth++;
    if (char == ')' || char == ']' || char == '}') depth--;
    if (char == ',' && depth == 0) {
      chunks.add(current.toString());
      current.clear();
      index++;
      continue;
    }
    current.write(char);
    index++;
  }
  chunks.add(current.toString());
  return chunks.where((chunk) => chunk.trim().isNotEmpty).toList();
}

/// Index of the delimiter closing the one at [start], or -1 when unbalanced.
int _matchingDelimiter(String source, int start, String open, String close) {
  var depth = 0;
  var index = start;
  while (index < source.length) {
    final char = source[index];
    if (char == '"' || char == "'") {
      index = _endOfString(source, index);
      continue;
    }
    if (char == open) depth++;
    if (char == close) {
      depth--;
      if (depth == 0) return index;
    }
    index++;
  }
  return -1;
}

int _endOfString(String source, int start) {
  final quote = source[start];
  var index = start + 1;
  while (index < source.length) {
    if (source[index] == r'\') {
      index += 2;
      continue;
    }
    if (source[index] == quote) return index + 1;
    index++;
  }
  return source.length;
}

String _slugOf(File file) => _baseName(file).replaceAll('.tsx', '').replaceAll('-', '_');

String _baseName(File file) => file.uri.pathSegments.last;
