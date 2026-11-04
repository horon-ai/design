import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpProgress(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('progress: the track is 240 wide and 6 tall at the pill radius', (WidgetTester tester) async {
    await pumpProgress(tester, const HoronProgress(value: 0.4));
    final Size size = tester.getSize(find.byType(HoronProgress));

    expect(size.width, 240);
    expect(size.height, 6);
  });

  testWidgets('progress: the track is 8% ink and the fill is the primary ink', (WidgetTester tester) async {
    await pumpProgress(tester, const HoronProgress(value: 0.5));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronProgress)));

    final ColoredBox track = tester.widget<ColoredBox>(
      find.descendant(of: find.byType(HoronProgress), matching: find.byType(ColoredBox)).first,
    );
    final ColoredBox fill = tester.widget<ColoredBox>(
      find.descendant(of: find.byType(HoronProgress), matching: find.byType(ColoredBox)).last,
    );

    expect(track.color, theme.colors.overlayInk8);
    expect(fill.color, theme.colors.interactivePrimary);
  });

  testWidgets('progress: the fill follows the value and clamps outside the range', (WidgetTester tester) async {
    for (final (double value, double expected) in <(double, double)>[(0.25, 0.25), (0, 0), (1, 1), (2, 1), (-1, 0)]) {
      await pumpProgress(tester, HoronProgress(value: value));
      final FractionallySizedBox fill = tester.widget<FractionallySizedBox>(find.byType(FractionallySizedBox));
      expect(fill.widthFactor, closeTo(expected, 0.001), reason: 'value $value');
    }
  });

  testWidgets('progress: a custom maximum normalizes the value', (WidgetTester tester) async {
    await pumpProgress(tester, const HoronProgress(value: 3, max: 12));
    final FractionallySizedBox fill = tester.widget<FractionallySizedBox>(find.byType(FractionallySizedBox));
    expect(fill.widthFactor, closeTo(0.25, 0.001));
  });

  testWidgets('progress: an omitted value sweeps a third-width bar', (WidgetTester tester) async {
    // 불확정 막대는 끝없이 도므로 pumpAndSettle 대신 프레임을 직접 넘깁니다.
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(body: Center(child: HoronProgress())),
      ),
    );
    await tester.pump();
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronProgress)));

    // `data-indeterminate:w-1/3` — 채움은 트랙의 3분의 1입니다.
    final FractionallySizedBox fill = tester.widget<FractionallySizedBox>(find.byType(FractionallySizedBox));
    expect(fill.widthFactor, closeTo(1 / 3, 0.001));
    final ColoredBox box = tester.widget<ColoredBox>(
      find.descendant(of: find.byType(HoronProgress), matching: find.byType(ColoredBox)).last,
    );
    expect(box.color, theme.colors.interactivePrimary);

    // `sweep` — 1.4초 동안 왼쪽 바깥에서 오른쪽 바깥으로 흐릅니다.
    // MaterialApp의 화면 전환도 FractionalTranslation을 쓰므로 트리 안으로 좁힙니다.
    final Finder sweep = find.descendant(of: find.byType(HoronProgress), matching: find.byType(FractionalTranslation));
    final FractionalTranslation before = tester.widget<FractionalTranslation>(sweep);
    await tester.pump(const Duration(milliseconds: 700));
    final FractionalTranslation after = tester.widget<FractionalTranslation>(sweep);
    expect(after.translation.dx, greaterThan(before.translation.dx));
  });

  testWidgets('progress: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpProgress(tester, const HoronProgress(value: 0.6), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
