import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/checkbox.dart';

/// 체크박스의 상자 모양·상태 색·표시 도형·값 동작을 확인합니다.
///
/// 체크 표시는 Material `Checkbox`도, `Icon`도 아니라 [HoronCheckMarkPainter]가
/// 직접 그립니다. 그래서 표시가 실제로 그려졌는지는 페인터를 픽셀 격자에 찍어
/// 확인합니다. 페인터 인자만 보는 검사는 대시를 그리지 않아도 통과합니다.
///
/// 픽셀 검사는 `testWidgets`가 아니라 `test`로 돌립니다. `toImage`의 future는
/// 테스트 프레임이 pump되지 않는 위젯 테스트 안에서 끝나지 않을 수 있습니다.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  BoxDecoration boxDecoration(WidgetTester tester) {
    final Container box = tester.widget<Container>(find.byKey(HoronCheckbox.boxKey));
    return box.decoration! as BoxDecoration;
  }

  Color borderColor(WidgetTester tester) => (boxDecoration(tester).border! as Border).top.color;

  /// 페인터를 [side]×[side] 픽셀에 찍어 잉크가 있는 칸을 돌려줍니다.
  Future<List<List<bool>>> inkMask(HoronCheckMarkPainter painter, int side) async {
    final ui.PictureRecorder recorder = ui.PictureRecorder();
    painter.paint(Canvas(recorder), Size.square(side.toDouble()));
    final ui.Image image = await recorder.endRecording().toImage(side, side);
    final ByteData? data = await image.toByteData(format: ui.ImageByteFormat.rawRgba);
    image.dispose();
    expect(data, isNotNull);
    final List<int> bytes = data!.buffer.asUint8List();
    return <List<bool>>[
      for (int y = 0; y < side; y++) <bool>[for (int x = 0; x < side; x++) bytes[(y * side + x) * 4 + 3] > 0],
    ];
  }

  /// [from]~[to] 줄 사이 어디에든 잉크가 있는지 봅니다.
  bool inkBetween(List<List<bool>> mask, int from, int to) {
    for (int y = from; y < to; y++) {
      if (mask[y].contains(true)) return true;
    }
    return false;
  }

  group('상자 모양', () {
    testWidgets('상자는 18px이고 반경은 5다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: false, onChanged: (_) {})));

      expect(tester.getSize(find.byKey(HoronCheckbox.boxKey)), const Size.square(HoronCheckboxMetrics.size));
      expect(HoronCheckbox.radius, HoronCheckboxMetrics.radius);
      expect(boxDecoration(tester).borderRadius, BorderRadius.circular(HoronCheckboxMetrics.radius));
    });

    testWidgets('선택은 primary 채움과 primary 테두리다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: true, onChanged: (_) {})));

      expect(boxDecoration(tester).color, HoronLightColors.primary);
      expect(borderColor(tester), HoronLightColors.primary);
    });

    testWidgets('미선택은 채우지 않고 input 테두리다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: false, onChanged: (_) {})));

      expect(boxDecoration(tester).color, Colors.transparent);
      expect(borderColor(tester), HoronLightColors.input);
      expect(find.byKey(HoronCheckbox.markKey), findsNothing);
    });

    testWidgets('오류는 미선택에서 destructive 테두리다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: false, invalid: true, onChanged: (_) {})));

      expect(borderColor(tester), HoronLightColors.destructive);
    });

    testWidgets('오류라도 선택되면 primary 테두리가 이긴다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: true, invalid: true, onChanged: (_) {})));

      expect(borderColor(tester), HoronLightColors.primary);
    });
  });

  group('표시 도형', () {
    test('불확정은 가운데 가로 대시를 그린다', () async {
      final List<List<bool>> mask = await inkMask(
        const HoronCheckMarkPainter(color: Color(0xFF000000), indeterminate: true, strokeWidth: 2),
        28,
      );

      expect(inkBetween(mask, 0, 9), isFalse, reason: '대시가 위쪽에 그려졌습니다');
      expect(inkBetween(mask, 19, 28), isFalse, reason: '대시가 아래쪽에 그려졌습니다');
      expect(inkBetween(mask, 13, 15), isTrue, reason: '가운데 줄에 대시가 없습니다');

      final List<bool> middle = mask[14];
      expect(middle.take(3).contains(true), isFalse, reason: '대시가 왼쪽 끝까지 닿았습니다');
      expect(middle.skip(25).contains(true), isFalse, reason: '대시가 오른쪽 끝까지 닿았습니다');
      expect(middle.skip(8).take(10).every((bool ink) => ink), isTrue, reason: '대시가 중간에서 끊겼습니다');
    });

    test('선택은 두 선분을 그린다', () async {
      final List<List<bool>> mask = await inkMask(
        const HoronCheckMarkPainter(color: Color(0xFF000000), indeterminate: false, strokeWidth: 2),
        28,
      );

      // lucide Check의 끝점은 y=0.25, 시작점은 y=0.5다. 위쪽 끝에 잉크가 있고
      // 아래쪽으로는 내려가지 않는다.
      expect(inkBetween(mask, 4, 10), isTrue, reason: '체크의 위쪽 끝점이 없습니다');
      expect(inkBetween(mask, 0, 4), isFalse, reason: '체크가 상자 위로 넘쳤습니다');
      expect(inkBetween(mask, 23, 28), isFalse, reason: '체크가 상자 아래로 넘쳤습니다');
    });

    testWidgets('불확정 위젯은 대시 페인터를 달고 시맨틱이 mixed다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: null, onChanged: (_) {})));

      final HoronCheckMarkPainter painter =
          tester.widget<CustomPaint>(find.byKey(HoronCheckbox.markKey)).painter! as HoronCheckMarkPainter;
      expect(painter.indeterminate, isTrue);
      expect(
        find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.mixed == true),
        findsOneWidget,
      );
    });

    testWidgets('선택 위젯은 체크 페인터를 primary-foreground로 단다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: true, onChanged: (_) {})));

      final HoronCheckMarkPainter painter =
          tester.widget<CustomPaint>(find.byKey(HoronCheckbox.markKey)).painter! as HoronCheckMarkPainter;
      expect(painter.indeterminate, isFalse);
      expect(painter.color, HoronLightColors.primaryForeground);
    });
  });

  group('값 동작', () {
    testWidgets('미선택을 누르면 true를 넘긴다', (WidgetTester tester) async {
      final List<bool> seen = <bool>[];
      await tester.pumpWidget(harness(HoronCheckbox(value: false, onChanged: seen.add)));

      await tester.tap(find.byType(HoronCheckbox));
      await tester.pump();

      expect(seen, <bool>[true]);
    });

    testWidgets('선택을 누르면 false를 넘긴다', (WidgetTester tester) async {
      final List<bool> seen = <bool>[];
      await tester.pumpWidget(harness(HoronCheckbox(value: true, onChanged: seen.add)));

      await tester.tap(find.byType(HoronCheckbox));
      await tester.pump();

      expect(seen, <bool>[false]);
    });

    testWidgets('불확정을 누르면 true를 넘긴다', (WidgetTester tester) async {
      final List<bool> seen = <bool>[];
      await tester.pumpWidget(harness(HoronCheckbox(value: null, onChanged: seen.add)));

      await tester.tap(find.byType(HoronCheckbox));
      await tester.pump();

      expect(seen, <bool>[true]);
    });

    testWidgets('비활성은 눌러도 값을 넘기지 않는다', (WidgetTester tester) async {
      final List<bool> seen = <bool>[];
      await tester.pumpWidget(harness(HoronCheckbox(value: false, enabled: false, onChanged: seen.add)));

      await tester.tap(find.byType(HoronCheckbox), warnIfMissed: false);
      await tester.pump();

      expect(seen, isEmpty, reason: '비활성 체크박스가 값을 바꿨습니다');
    });

    testWidgets('콜백이 없으면 눌러도 값이 바뀌지 않고 비활성으로 그린다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(const HoronCheckbox(value: false)));

      await tester.tap(find.byType(HoronCheckbox), warnIfMissed: false);
      await tester.pump();

      expect(tester.takeException(), isNull);
      expect(
        find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.enabled == false),
        findsOneWidget,
      );
    });
  });

  group('라벨과 밝기', () {
    testWidgets('라벨을 그리고 보조 기술이 이름과 선택 상태를 읽는다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(HoronCheckbox(value: true, label: '동의합니다', onChanged: (_) {})));

      expect(find.text('동의합니다'), findsOneWidget);
      expect(
        find.byWidgetPredicate(
          (Widget widget) =>
              widget is Semantics && widget.properties.label == '동의합니다' && widget.properties.checked == true,
        ),
        findsOneWidget,
      );
    });

    testWidgets('라이트와 다크가 각자의 primary로 채운다', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        await tester.pumpWidget(harness(HoronCheckbox(value: true, onChanged: (_) {}), brightness: brightness));
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);

        final Color expected = brightness == Brightness.dark ? HoronDarkColors.primary : HoronLightColors.primary;
        expect(boxDecoration(tester).color, expected);
      }
    });
  });
}
