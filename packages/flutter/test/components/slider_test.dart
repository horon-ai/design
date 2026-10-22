import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/slider.dart';

/// 슬라이더의 범위·눈금·방향·비활성을 확인합니다.
///
/// 값은 호출자가 소유하므로, 넘어오는 값이 언제나 [HoronSlider.min]과
/// [HoronSlider.max] 사이인지, [HoronSlider.divisions]가 있으면 눈금에 맞는지를
/// 여기서 확인합니다. 범위를 벗어난 값이 썸을 트랙 밖으로 밀지 않는지도 봅니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(child: SizedBox(width: 200, child: child)),
    ),
  );

  /// 트랙에서 [fraction] 위치의 전역 좌표입니다.
  Offset pointAt(WidgetTester tester, double fraction) {
    final Rect track = tester.getRect(find.byKey(HoronSlider.trackKey));
    const double inset = HoronSlider.thumbDiameter / 2;
    final double travel = track.width - HoronSlider.thumbDiameter;
    return Offset(track.left + inset + travel * fraction, track.center.dy);
  }

  HoronSliderPainter probe(WidgetTester tester) =>
      tester.widget<CustomPaint>(find.byKey(HoronSlider.trackKey)).painter! as HoronSliderPainter;

  group('모양', () {
    testWidgets('트랙은 두께 6이고 썸은 지름 16에 테두리 2다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSlider(value: 50, onChanged: (_) {})));

      expect(HoronSlider.trackThickness, 6);
      expect(HoronSlider.thumbDiameter, 16);
      expect(HoronSlider.thumbBorderWidth, 2);
      expect(tester.getSize(find.byKey(HoronSlider.trackKey)).height, HoronSlider.thumbDiameter);
    });

    testWidgets('값 표시는 정수를 소수점 없이 쓴다', (WidgetTester tester) async {
      expect(formatSliderValue(40), '40');
      expect(formatSliderValue(2.5), '2.5');
      expect(formatSliderValue(0.30000000000000004), '0.3');

      await tester.pumpWidget(harness(HoronSlider(value: 40, showValue: true, onChanged: (_) {})));
      expect(find.text('40'), findsOneWidget);
    });

    testWidgets('라이트와 다크 모두 그려진다', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        await tester.pumpWidget(harness(HoronSlider(value: 50, onChanged: (_) {}), brightness: brightness));
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);
        expect(find.byKey(HoronSlider.trackKey), findsOneWidget);
      }
    });
  });

  group('값과 범위', () {
    testWidgets('범위를 벗어난 값은 양 끝에 붙는다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSlider(value: -50, min: 0, max: 100, onChanged: (_) {})));
      expect(probe(tester).fraction, 0, reason: 'min보다 작은 값이 트랙 안에 그려졌습니다');

      await tester.pumpWidget(harness(HoronSlider(value: 150, min: 0, max: 100, onChanged: (_) {})));
      expect(probe(tester).fraction, 1, reason: 'max보다 큰 값이 트랙 안에 그려졌습니다');
    });

    testWidgets('트랙 왼쪽을 누르면 min, 오른쪽을 누르면 max를 넘긴다', (WidgetTester tester) async {
      final List<double> seen = <double>[];
      await tester.pumpWidget(harness(HoronSlider(value: 50, onChanged: seen.add)));

      await tester.tapAt(pointAt(tester, 0));
      await tester.pump();
      expect(seen.last, 0, reason: '왼쪽 끝이 min이 아닙니다');

      await tester.tapAt(pointAt(tester, 1));
      await tester.pump();
      expect(seen.last, 100, reason: '오른쪽 끝이 max가 아닙니다');
    });

    testWidgets('끌어서 범위를 넘어가도 값은 min과 max 사이에 머문다', (WidgetTester tester) async {
      final List<double> seen = <double>[];
      await tester.pumpWidget(harness(HoronSlider(value: 50, min: 0, max: 100, onChanged: seen.add)));

      final TestGesture right = await tester.startGesture(pointAt(tester, 0.5));
      await right.moveTo(pointAt(tester, 0.5) + const Offset(400, 0));
      await right.up();
      await tester.pump();

      expect(seen, isNotEmpty);
      expect(seen.every((double value) => value >= 0 && value <= 100), isTrue, reason: '범위를 벗어난 값: $seen');
      expect(seen.last, 100);

      final TestGesture left = await tester.startGesture(pointAt(tester, 0.5));
      await left.moveTo(pointAt(tester, 0.5) - const Offset(400, 0));
      await left.up();
      await tester.pump();
      expect(seen.last, 0);
    });

    testWidgets('눈금이 있으면 가장 가까운 눈금으로 반올림한다', (WidgetTester tester) async {
      final List<double> seen = <double>[];
      await tester.pumpWidget(harness(HoronSlider(value: 0, min: 0, max: 100, divisions: 4, onChanged: seen.add)));

      await tester.tapAt(pointAt(tester, 0.4));
      await tester.pump();

      expect(seen.last, 50, reason: '25 단위 눈금의 가운데는 50입니다');
      expect(seen.last % 25, 0);
    });

    testWidgets('min과 max가 같으면 그 값만 넘긴다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronSlider(value: 5, min: 5, max: 5, onChanged: (_) {})));
      expect(tester.takeException(), isNull);

      final List<double> seen = <double>[];
      await tester.pumpWidget(harness(HoronSlider(value: 5, min: 5, max: 5, onChanged: seen.add)));
      await tester.tapAt(pointAt(tester, 0.7));
      await tester.pump();
      expect(seen, <double>[5]);
    });
  });

  group('방향', () {
    testWidgets('세로는 아래가 min, 위가 max다', (WidgetTester tester) async {
      final List<double> seen = <double>[];
      await tester.pumpWidget(
        MaterialApp(
          theme: horonTheme(Brightness.light),
          home: Scaffold(
            body: Center(
              child: SizedBox(
                height: 200,
                child: HoronSlider(value: 50, orientation: Axis.vertical, onChanged: seen.add),
              ),
            ),
          ),
        ),
      );

      final Rect track = tester.getRect(find.byKey(HoronSlider.trackKey));
      expect(track.width, HoronSlider.thumbDiameter);

      await tester.tapAt(Offset(track.center.dx, track.bottom - HoronSlider.thumbDiameter / 2));
      await tester.pump();
      expect(seen.last, 0, reason: '세로 슬라이더의 아래 끝이 min이 아닙니다');

      await tester.tapAt(Offset(track.center.dx, track.top + HoronSlider.thumbDiameter / 2));
      await tester.pump();
      expect(seen.last, 100, reason: '세로 슬라이더의 위 끝이 max가 아닙니다');
    });
  });

  group('동작', () {
    testWidgets('비활성은 끌어도 값을 넘기지 않는다', (WidgetTester tester) async {
      final List<double> seen = <double>[];
      await tester.pumpWidget(harness(HoronSlider(value: 50, enabled: false, onChanged: seen.add)));

      final TestGesture gesture = await tester.startGesture(pointAt(tester, 0.5));
      await gesture.moveTo(pointAt(tester, 0.9));
      await gesture.up();
      await tester.pump();

      expect(seen, isEmpty, reason: '비활성 슬라이더가 값을 바꿨습니다');
    });

    testWidgets('콜백이 없으면 비활성이고 불투명도 50%다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(const HoronSlider(value: 50)));

      expect(
        tester
            .widget<Opacity>(find.descendant(of: find.byType(HoronSlider), matching: find.byType(Opacity)).first)
            .opacity,
        0.5,
      );
      expect(
        find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.enabled == false),
        findsOneWidget,
      );
    });

    testWidgets('보조 기술이 값과 증감 동작을 알린다', (WidgetTester tester) async {
      final List<double> seen = <double>[];
      await tester.pumpWidget(harness(HoronSlider(value: 50, divisions: 4, semanticsLabel: '볼륨', onChanged: seen.add)));

      expect(
        find.byWidgetPredicate(
          (Widget widget) =>
              widget is Semantics &&
              widget.properties.slider == true &&
              widget.properties.label == '볼륨' &&
              widget.properties.value == '50',
        ),
        findsOneWidget,
      );

      await tester.tapAt(pointAt(tester, 0.75));
      await tester.pump();
      expect(seen.last, 75);
    });
  });
}
