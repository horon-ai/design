import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpKbd(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

BoxDecoration _chip(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronKbd),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return box.decoration as BoxDecoration;
}

void main() {
  testWidgets('kbd: the chip is 6% ink at the xs radius', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: 'K'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronKbd)));
    final BoxDecoration decoration = _chip(tester);

    expect(decoration.color, theme.colors.overlayInk6);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, closeTo(theme.radius.xs, 0.01));
    expect(theme.radius.xs, 6);
  });

  testWidgets('kbd: the label is caption text in the secondary colour with leading-none', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: '⌘K'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronKbd)));
    final TextStyle style = tester.widget<Text>(find.text('⌘K')).style!;

    expect(style.fontSize, theme.text.caption.fontSize);
    expect(style.color, theme.colors.textSecondary);
    // `leading-none` — 줄 높이를 1.0으로 덮습니다.
    expect(style.height, 1);
  });

  testWidgets('kbd: the three sizes are 16, 20 and 24 tall', (WidgetTester tester) async {
    final Map<HoronKbdSize, double> expected = <HoronKbdSize, double>{
      HoronKbdSize.sm: 16,
      HoronKbdSize.md: 20,
      HoronKbdSize.lg: 24,
    };
    for (final MapEntry<HoronKbdSize, double> entry in expected.entries) {
      await pumpKbd(tester, HoronKbd(label: 'K', size: entry.key));
      expect(tester.getSize(find.byType(HoronKbd)).height, entry.value, reason: entry.key.name);
    }
  });

  testWidgets('kbd: an icon sits in front at 12px', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: '⌘K', icon: Icon(Icons.keyboard_command_key)));
    final IconThemeData iconTheme = IconTheme.of(tester.element(find.byIcon(Icons.keyboard_command_key)));

    expect(find.byIcon(Icons.keyboard_command_key), findsOneWidget);
    expect(iconTheme.size, 12);
  });

  testWidgets('kbd: background and foreground override the token colours', (WidgetTester tester) async {
    const HoronThemeData theme = HoronThemeData.light;

    // bot_instructions_panel의 Run 버튼이 쓰는 조합입니다.
    await pumpKbd(
      tester,
      HoronKbd(label: 'Run', background: theme.colors.bgSurface6, foreground: theme.colors.textInverse),
    );
    expect(_chip(tester).color, theme.colors.bgSurface6, reason: 'background가 bg-overlay-ink-6을 덮습니다');
    expect(tester.widget<Text>(find.text('Run')).style?.color, theme.colors.textInverse);

    // 아이콘도 같은 글자색을 따릅니다.
    await pumpKbd(
      tester,
      HoronKbd(label: 'Run', icon: const Icon(Icons.play_arrow), foreground: theme.colors.textInverse),
    );
    expect(IconTheme.of(tester.element(find.byIcon(Icons.play_arrow))).color, theme.colors.textInverse);
  });

  testWidgets('kbd: without overrides the token colours stay', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: 'K'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronKbd)));

    expect(_chip(tester).color, theme.colors.overlayInk6, reason: 'bg-overlay-ink-6 기본값');
    expect(
      tester.widget<Text>(find.text('K')).style?.color,
      theme.colors.textSecondary,
      reason: 'text-text-secondary 기본값',
    );
  });

  testWidgets('kbd: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpKbd(tester, const HoronKbd(label: 'Esc'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Esc'), findsOneWidget);
    }
  });

  testWidgets('kbd: a missing label and child asserts', (WidgetTester tester) async {
    expect(() => HoronKbd(), throwsA(isA<AssertionError>()));
  });
}
