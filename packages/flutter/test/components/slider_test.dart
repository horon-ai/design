import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: sized)),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronSlider)));

Finder _track() => find.descendant(of: find.byType(HoronSlider), matching: find.byType(DecoratedBox)).first;

Finder _thumb() => find.descendant(of: find.byType(HoronSlider), matching: find.byType(Container));

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(HoronSlider(value: 40, onChanged: (_) {}), brightness: brightness));
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the React slider is 220 wide, 20 tall, with a 6px track and 18px thumb', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronSlider(value: 40, onChanged: (_) {})));
    expect(tester.getSize(find.byType(HoronSlider)), const Size(220, 20), reason: 'w-55 h-5');
    expect(tester.getSize(_track()).height, 6, reason: 'h-1.5');
    expect(tester.getSize(_thumb()), const Size(18, 18), reason: 'size-[18px]');
  });

  testWidgets('the fill follows the value and the thumb carries the hairline and shadow', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronSlider(value: 25, onChanged: (_) {})));
    final HoronColors colors = _theme(tester).colors;

    expect(
      tester.widget<FractionallySizedBox>(find.byType(FractionallySizedBox)).widthFactor,
      0.25,
      reason: '25 / 100',
    );
    final BoxDecoration track = tester.widget<DecoratedBox>(_track()).decoration as BoxDecoration;
    expect(track.color, colors.overlayInk8, reason: 'bg-overlay-ink-8');

    final Container thumb = tester.widget<Container>(_thumb());
    final BoxDecoration thumbDecoration = thumb.decoration! as BoxDecoration;
    expect(thumbDecoration.color, colors.bgDefault, reason: 'bg-bg-default');
    expect(thumbDecoration.border!.top.color, colors.borderDefault, reason: 'border-border-default');
    expect(thumbDecoration.boxShadow!.single.color, colors.overlayInk12, reason: 'shadow-[0_1px_3px_#0000001f]');
  });

  testWidgets('tapping and dragging report the new value within min and max', (WidgetTester tester) async {
    final List<double> changes = <double>[];
    await tester.pumpWidget(_host(HoronSlider(value: 0, onChanged: changes.add)));

    final Rect rect = tester.getRect(find.byType(HoronSlider));
    await tester.tapAt(Offset(rect.right - 20, rect.center.dy));
    await tester.pumpAndSettle();
    expect(changes.single, greaterThan(90), reason: '오른쪽 끝을 누르면 최댓값에 가까워집니다');
    expect(changes.single, lessThanOrEqualTo(100));

    changes.clear();
    await tester.drag(find.byType(HoronSlider), const Offset(40, 0));
    await tester.pumpAndSettle();
    expect(changes, isNotEmpty, reason: '끌면 계속 새 값을 올립니다');
    expect(changes.first, lessThan(changes.last));
    expect(changes.every((double value) => value >= 0 && value <= 100), isTrue);
  });

  testWidgets('the slider shrinks below its desktop width instead of overflowing', (WidgetTester tester) async {
    for (final (double hostWidth, double expected) in <(double, double)>[(200, 200), (1024, 220)]) {
      await tester.pumpWidget(_host(HoronSlider(value: 100, onChanged: (_) {}), width: hostWidth));
      expect(tester.takeException(), isNull, reason: '폭 $hostWidth에서 예외가 없어야 합니다');
      // 부모가 폭을 꽉 잡으면 위젯 상자는 부모 폭이고, 트랙만 220에서 멈춥니다.
      expect(tester.getSize(_track()).width, expected, reason: '폭 $hostWidth에서의 트랙 폭');
    }
  });

  testWidgets('a disabled slider dims and reports nothing', (WidgetTester tester) async {
    final List<double> changes = <double>[];
    await tester.pumpWidget(_host(HoronSlider(value: 30, enabled: false, onChanged: changes.add)));

    await tester.tapAt(tester.getRect(find.byType(HoronSlider)).center);
    await tester.pumpAndSettle();

    expect(changes, isEmpty);
    expect(
      tester.widget<Opacity>(find.descendant(of: find.byType(HoronSlider), matching: find.byType(Opacity))).opacity,
      0.4,
      reason: 'data-disabled:opacity-40',
    );
  });

  testWidgets('the accessible name is the React aria-label', (WidgetTester tester) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    await tester.pumpWidget(_host(HoronSlider(value: 30, semanticLabel: '볼륨', onChanged: (_) {})));
    expect(find.bySemanticsLabel('볼륨'), findsOneWidget);
    handle.dispose();
  });
}
