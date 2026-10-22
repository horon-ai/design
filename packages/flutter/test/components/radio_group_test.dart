import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 라디오 그룹의 링·점 모양과 단일 선택을 확인합니다.
///
/// React는 18px 원(`size-[18px] border-2`) 안에 10px 점(`size-2.5`)을 얹습니다.
/// 이 테스트는 링과 점을 **각각 다른 페인터**로 찾아 지름을 따로 확인하고, 점의
/// 중심이 링의 중심과 같은지도 봅니다. 점을 링의 채움으로 그리면 이 검사가
/// 실패합니다.
void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  Widget groupOf({
    required List<String> values,
    String? value,
    ValueChanged<String>? onChanged,
    bool invalid = false,
    bool enabled = true,
    String? semanticLabel,
  }) => HoronRadioGroup<String>(
    value: value,
    onChanged: onChanged,
    invalid: invalid,
    enabled: enabled,
    semanticsLabel: semanticLabel,
    children: <Widget>[for (final String option in values) HoronRadioGroupItem(value: option, label: option)],
  );

  HoronRadioRingPainter ringPainterAt(WidgetTester tester, int index) =>
      tester.widget<CustomPaint>(find.byKey(HoronRadioGroupItem.ringKey).at(index)).painter! as HoronRadioRingPainter;

  /// 페인터를 정사각 픽셀로 찍어 잉크가 있는 칸을 돌려줍니다.
  Future<List<List<bool>>> inkMask(CustomPainter painter, int side) async {
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

  /// 가운데 줄에서 잉크가 칠해진 x 구간 목록입니다.
  List<List<int>> runsAtMiddleRow(List<List<bool>> mask) {
    final List<bool> row = mask[mask.length ~/ 2];
    final List<List<int>> runs = <List<int>>[];
    int? start;
    for (int x = 0; x < row.length; x++) {
      if (row[x] && start == null) start = x;
      if (!row[x] && start != null) {
        runs.add(<int>[start, x - 1]);
        start = null;
      }
    }
    if (start != null) runs.add(<int>[start, row.length - 1]);
    return runs;
  }

  group('모양', () {
    testWidgets('링은 18px이고 선 두께 2, 점은 지름 10이다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(groupOf(values: <String>['a', 'b'], value: 'a')));

      expect(HoronRadioGroupItem.diameter, 18);
      expect(HoronRadioGroupItem.ringWidth, 2);
      expect(HoronRadioGroupItem.dotDiameter, 10);

      final Finder rings = find.byKey(HoronRadioGroupItem.ringKey);
      expect(rings, findsNWidgets(2));
      expect(tester.getSize(rings.first), const Size.square(18));

      final Finder dots = find.byKey(HoronRadioGroupItem.dotKey);
      expect(dots, findsOneWidget, reason: '선택된 항목에만 점이 있어야 합니다');
      expect(tester.getSize(dots), const Size.square(10));
      expect(tester.getCenter(dots), tester.getCenter(rings.first), reason: '점이 링의 가운데에 있지 않습니다');
    });

    testWidgets('미선택 항목에는 점이 없다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(groupOf(values: <String>['a', 'b'])));

      expect(find.byKey(HoronRadioGroupItem.ringKey), findsNWidgets(2));
      expect(find.byKey(HoronRadioGroupItem.dotKey), findsNothing);
    });

    testWidgets('선택된 링은 primary, 미선택 링은 input이다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(groupOf(values: <String>['a', 'b'], value: 'a')));

      expect(ringPainterAt(tester, 0).color, HoronLightColors.primary);
      expect(ringPainterAt(tester, 1).color, HoronLightColors.input);
    });

    testWidgets('오류는 미선택 링을 destructive로 칠한다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(groupOf(values: <String>['a', 'b'], value: 'a', invalid: true)));

      expect(ringPainterAt(tester, 0).color, HoronLightColors.primary, reason: '선택된 링은 primary가 이깁니다');
      expect(ringPainterAt(tester, 1).color, HoronLightColors.destructive);
    });
  });

  group('링과 점을 따로 그린다', () {
    test('선택된 링은 테두리만 그리고 가운데를 비운다', () async {
      // 18px 링을 두 배로 키워 픽셀에서 두께를 잴 수 있게 합니다.
      final List<List<bool>> mask = await inkMask(
        const HoronRadioRingPainter(color: Color(0xFF000000), diameter: 36, ringWidth: 4),
        36,
      );

      expect(runsAtMiddleRow(mask), hasLength(2), reason: '링이 안쪽까지 칠해졌습니다');
      expect(mask[18][18], isFalse, reason: '링의 가운데가 칠해졌습니다');

      final List<int> leftRun = runsAtMiddleRow(mask).first;
      expect(leftRun[1] - leftRun[0] + 1, closeTo(4, 2), reason: '링의 선 두께가 2px(2배 4)가 아닙니다');
    });

    test('점은 링 지름의 절반이 안 되게 따로 그린다', () async {
      final List<List<bool>> mask = await inkMask(
        const HoronRadioDotPainter(color: Color(0xFF000000), diameter: 20),
        20,
      );

      final List<List<int>> runs = runsAtMiddleRow(mask);
      expect(runs, hasLength(1), reason: '점이 한 덩어리로 칠해지지 않았습니다');
      expect(runs.single[1] - runs.single[0] + 1, closeTo(20, 2), reason: '점의 지름이 10px(2배 20)가 아닙니다');
    });

    test('링과 점 사이에는 틈이 남는다', () async {
      // 같은 캔버스에 링과 점을 따로 그려 두 도형이 붙지 않는지 확인합니다.
      final List<List<bool>> ring = await inkMask(
        const HoronRadioRingPainter(color: Color(0xFF000000), diameter: 36, ringWidth: 4),
        36,
      );
      final List<List<bool>> dot = await inkMask(
        const HoronRadioDotPainter(color: Color(0xFF000000), diameter: 20),
        36,
      );

      // 36px 캔버스에서 링의 안쪽 가장자리는 중심에서 16px, 점의 가장자리는 10px이다.
      expect(ring[18][2], isTrue, reason: '링의 왼쪽 테두리가 없습니다');
      expect(dot[18][2], isFalse, reason: '점이 링의 테두리까지 닿았습니다');
      expect(dot[18][18], isTrue, reason: '점의 가운데가 비었습니다');
      expect(ring[18][18], isFalse, reason: '링의 가운데가 칠해졌습니다');
    });
  });

  group('단일 선택', () {
    testWidgets('한 항목을 고르면 그 값만 선택된다', (WidgetTester tester) async {
      final List<String> seen = <String>[];
      String? value;
      late StateSetter setState;
      await tester.pumpWidget(
        StatefulBuilder(
          builder: (BuildContext context, StateSetter setter) {
            setState = setter;
            return harness(
              groupOf(
                values: <String>['a', 'b', 'c'],
                value: value,
                onChanged: (String next) {
                  seen.add(next);
                  setState(() => value = next);
                },
              ),
            );
          },
        ),
      );

      expect(find.byKey(HoronRadioGroupItem.dotKey), findsNothing, reason: '처음에는 아무것도 선택되지 않습니다');

      await tester.tap(find.text('b'));
      await tester.pumpAndSettle();

      expect(seen, <String>['b']);
      expect(find.byKey(HoronRadioGroupItem.dotKey), findsOneWidget, reason: '선택은 하나여야 합니다');
      expect(
        tester.getCenter(find.byKey(HoronRadioGroupItem.dotKey)),
        tester.getCenter(find.byKey(HoronRadioGroupItem.ringKey).at(1)),
      );

      await tester.tap(find.text('c'));
      await tester.pumpAndSettle();

      expect(seen, <String>['b', 'c']);
      expect(find.byKey(HoronRadioGroupItem.dotKey), findsOneWidget, reason: '선택은 하나여야 합니다');
      expect(
        tester.getCenter(find.byKey(HoronRadioGroupItem.dotKey)),
        tester.getCenter(find.byKey(HoronRadioGroupItem.ringKey).at(2)),
      );
      expect(ringPainterAt(tester, 1).color, HoronLightColors.input, reason: '이전 선택이 남았습니다');
    });

    testWidgets('선택된 항목만 checked로 알려진다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(groupOf(values: <String>['a', 'b'], value: 'a')));

      expect(
        find.byWidgetPredicate(
          (Widget widget) =>
              widget is Semantics &&
              widget.properties.inMutuallyExclusiveGroup == true &&
              widget.properties.checked == true,
        ),
        findsOneWidget,
      );
    });
  });

  group('동작', () {
    testWidgets('비활성 그룹은 눌러도 값을 넘기지 않는다', (WidgetTester tester) async {
      final List<String> seen = <String>[];
      await tester.pumpWidget(
        harness(groupOf(values: <String>['a', 'b'], value: 'a', enabled: false, onChanged: seen.add)),
      );

      await tester.tap(find.text('b'), warnIfMissed: false);
      await tester.pumpAndSettle();

      expect(seen, isEmpty, reason: '비활성 라디오 그룹이 값을 바꿨습니다');
      expect(find.byKey(HoronRadioGroupItem.dotKey), findsOneWidget);
      expect(
        tester.getCenter(find.byKey(HoronRadioGroupItem.dotKey)),
        tester.getCenter(find.byKey(HoronRadioGroupItem.ringKey).first),
      );
    });

    testWidgets('콜백이 없으면 그룹 전체가 비활성이다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(groupOf(values: <String>['a'])));

      expect(
        find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.enabled == false),
        findsWidgets,
      );
    });

    testWidgets('그룹 밖의 항목은 누름에 반응하지 않는다', (WidgetTester tester) async {
      await tester.pumpWidget(harness(const HoronRadioGroupItem(value: 'a', label: 'a')));

      expect(find.byKey(HoronRadioGroupItem.ringKey), findsOneWidget);

      await tester.tap(find.text('a'), warnIfMissed: false);
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull);
      expect(find.byKey(HoronRadioGroupItem.dotKey), findsNothing);
    });
  });

  group('라벨과 밝기', () {
    testWidgets('보조 기술이 그룹 이름과 항목 이름을 읽는다', (WidgetTester tester) async {
      await tester.pumpWidget(
        harness(
          HoronRadioGroup<String>(
            value: 'a',
            onChanged: (_) {},
            semanticsLabel: '배송 방식',
            children: const <Widget>[
              HoronRadioGroupItem(value: 'a', label: '빠른 배송'),
              HoronRadioGroupItem(value: 'b', label: '일반 배송'),
            ],
          ),
        ),
      );

      expect(find.text('빠른 배송'), findsOneWidget);
      expect(find.text('일반 배송'), findsOneWidget);
      expect(
        find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.label == '배송 방식'),
        findsOneWidget,
      );
    });

    testWidgets('라이트와 다크가 각자의 primary로 링을 칠한다', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        await tester.pumpWidget(
          MaterialApp(
            key: ValueKey<Brightness>(brightness),
            theme: horonTheme(brightness),
            home: Scaffold(
              body: Center(
                child: groupOf(values: <String>['a', 'b'], value: 'a'),
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        expect(tester.takeException(), isNull);

        expect(Theme.of(tester.element(find.byType(HoronRadioGroup<String>))).brightness, brightness);
        expect(
          ringPainterAt(tester, 0).color,
          brightness == Brightness.dark ? HoronDarkColors.primary : HoronLightColors.primary,
        );
      }
    });
  });
}
