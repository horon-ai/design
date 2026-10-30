import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(body: Center(child: child)),
);

Finder _track() => find.descendant(of: find.byType(HoronSwitch), matching: find.byType(AnimatedContainer)).first;

Finder _thumb() => find.descendant(of: find.byType(HoronSwitch), matching: find.byType(AnimatedContainer)).last;

BoxDecoration _trackDecoration(WidgetTester tester) =>
    tester.widget<AnimatedContainer>(_track()).decoration! as BoxDecoration;

BoxDecoration _thumbDecoration(WidgetTester tester) =>
    tester.widget<AnimatedContainer>(_thumb()).decoration! as BoxDecoration;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(HoronSwitch(value: false, onChanged: (_) {}), brightness: brightness));
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('each size paints the React track and thumb size', (WidgetTester tester) async {
    for (final HoronSwitchSize size in HoronSwitchSize.values) {
      await tester.pumpWidget(_host(HoronSwitch(value: false, size: size, onChanged: (_) {})));
      await tester.pumpAndSettle();
      final (Size track, double thumb) = switch (size) {
        HoronSwitchSize.sm => (const Size(32, 20), 16), // h-5 w-8, size-4
        HoronSwitchSize.compact => (const Size(40, 24), 18), // h-6 w-10, size-[18px]
        HoronSwitchSize.md => (const Size(44, 26), 22), // h-6.5 w-11, size-5.5
      };
      expect(tester.getSize(_track()), track, reason: '$size 트랙');
      expect(tester.getSize(_thumb()), Size(thumb, thumb), reason: '$size 썸');
    }
  });

  testWidgets('the checked state fills the track and moves the thumb to the end', (WidgetTester tester) async {
    final HoronColors colors = HoronThemeData.light.colors;
    await tester.pumpWidget(_host(HoronSwitch(value: false, onChanged: (_) {})));
    expect(_trackDecoration(tester).color, colors.borderStrong, reason: 'bg-border-strong');
    expect(
      tester.widget<AnimatedAlign>(find.byType(AnimatedAlign)).alignment,
      Alignment.centerLeft,
      reason: 'data-checked:translate-x-* 의 시작 위치',
    );

    await tester.pumpWidget(_host(HoronSwitch(value: true, onChanged: (_) {})));
    await tester.pumpAndSettle();
    expect(_trackDecoration(tester).color, colors.interactivePrimary, reason: 'data-checked:bg-interactive-primary');
    expect(
      _thumbDecoration(tester).color,
      colors.interactiveOnPrimary,
      reason: 'data-checked:bg-interactive-on-primary',
    );
    expect(tester.widget<AnimatedAlign>(find.byType(AnimatedAlign)).alignment, Alignment.centerRight);
    expect(
      tester.getTopRight(_thumb()).dx,
      tester.getTopRight(_track()).dx - HoronThemeData.light.space.s0_5,
      reason: '썸이 트랙의 안쪽 여백만큼 안에 붙습니다',
    );
  });

  testWidgets('the thumb is surface coloured in dark mode', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronSwitch(value: true, onChanged: (_) {}), brightness: Brightness.dark));
    await tester.pumpAndSettle();
    expect(_thumbDecoration(tester).color, HoronThemeData.dark.colors.bgDefault, reason: 'dark:bg-bg-default');
  });

  testWidgets('tapping the control or the label toggles the value', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await tester.pumpWidget(_host(HoronSwitch(value: false, label: '알림', onChanged: changes.add)));

    await tester.tapAt(tester.getCenter(_track()));
    await tester.pumpAndSettle();
    expect(changes, <bool>[true], reason: '꺼짐에서 누르면 켜짐을 요청합니다');

    await tester.tap(find.text('알림'));
    await tester.pumpAndSettle();
    expect(changes, <bool>[true, true], reason: 'label도 같은 스위치를 누릅니다');
  });

  testWidgets('a disabled switch dims the track and does not toggle', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await tester.pumpWidget(_host(HoronSwitch(value: false, label: '알림', enabled: false, onChanged: changes.add)));
    await tester.tap(find.byType(HoronSwitch));
    await tester.pumpAndSettle();
    expect(changes, isEmpty);
    expect(
      tester.widget<Opacity>(find.descendant(of: find.byType(HoronSwitch), matching: find.byType(Opacity))).opacity,
      0.4,
      reason: 'data-disabled:opacity-40',
    );
  });

  testWidgets('the label row keeps the 16px gap and lets a long label shrink', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        SizedBox(
          width: 320,
          child: HoronSwitch(value: true, label: '아주 긴 설정 이름이 들어와도 스위치는 밀려나지 않고 라벨만 줄어듭니다', onChanged: (_) {}),
        ),
      ),
    );
    expect(tester.takeException(), isNull);
    final Row row = tester.widget<Row>(find.descendant(of: find.byType(HoronSwitch), matching: find.byType(Row)));
    expect(row.spacing, HoronThemeData.light.space.s4, reason: 'gap-4');
    expect(tester.getSize(_track()).width, HoronThemeData.light.space.step(11), reason: '트랙은 고정 폭입니다');
  });
}
