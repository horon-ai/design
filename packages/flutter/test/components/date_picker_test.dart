import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `date_picker`의 트리거·팝업·단일·범위 선택을 확인합니다.
///
/// 팝업은 `OverlayPortal`로 열리므로 테스트 트리에도 그대로 나타납니다. 트리거의
/// 글자와 달력 칸의 키로 판정합니다.
void main() {
  /// 2026년 10월을 고정한 테스트입니다. 오늘을 넘겨 실행 날짜에 흔들리지 않게 합니다.
  final DateTime today = DateTime(2026, 10, 15);

  Future<void> pumpPicker(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(body: Center(child: child)),
      ),
    );
  }

  /// 달력 팝업이 열려 있는지 여부입니다.
  bool popupOpen(WidgetTester tester) => find.byType(HoronCalendar).evaluate().isNotEmpty;

  group('단일 선택', () {
    testWidgets('아무것도 고르지 않으면 안내 문구를 보여 준다', (WidgetTester tester) async {
      await pumpPicker(tester, HoronDatePicker(placeholder: 'Pick a date', today: today, initialMonth: today));

      expect(find.text('Pick a date'), findsOneWidget);
      expect(popupOpen(tester), isFalse);
    });

    testWidgets('트리거를 누르면 달력이 열리고, 날짜를 고르면 닫히며 값이 바뀐다', (WidgetTester tester) async {
      final List<DateTime?> changes = <DateTime?>[];
      await pumpPicker(
        tester,
        HoronDatePicker(placeholder: 'Pick a date', today: today, initialMonth: today, onValueChanged: changes.add),
      );

      await tester.tap(find.text('Pick a date'));
      await tester.pumpAndSettle();

      expect(popupOpen(tester), isTrue);
      expect(find.text('October 2026'), findsOneWidget);

      await tester.tap(find.byKey(const ValueKey<String>('calendar-day-0-2026-10-08')));
      await tester.pumpAndSettle();

      expect(changes, <DateTime?>[DateTime(2026, 10, 8)]);
      expect(popupOpen(tester), isFalse);
      expect(find.text('October 8, 2026'), findsOneWidget);
    });

    testWidgets('값이 있으면 트리거가 그 날짜의 달로 열린다', (WidgetTester tester) async {
      await pumpPicker(tester, HoronDatePicker(value: DateTime(2027, 3, 4), placeholder: 'Pick a date', today: today));

      expect(find.text('March 4, 2027'), findsOneWidget);

      await tester.tap(find.text('March 4, 2027'));
      await tester.pumpAndSettle();

      expect(find.text('March 2027'), findsOneWidget);
    });

    testWidgets('트리거 높이가 37이고 폭이 React의 w-60(240)이다', (WidgetTester tester) async {
      await pumpPicker(tester, HoronDatePicker(placeholder: 'Pick a date', today: today));

      final Size size = tester.getSize(find.byType(HoronDatePicker));
      expect(size.height, 37);
      expect(size.width, 240);
    });

    testWidgets('비활성 트리거는 눌러도 열리지 않는다', (WidgetTester tester) async {
      await pumpPicker(tester, HoronDatePicker(placeholder: 'Pick a date', today: today, disabled: true));

      await tester.tap(find.text('Pick a date'), warnIfMissed: false);
      await tester.pumpAndSettle();

      expect(popupOpen(tester), isFalse);
    });

    testWidgets('바깥을 누르면 팝업이 닫힌다', (WidgetTester tester) async {
      await pumpPicker(tester, HoronDatePicker(placeholder: 'Pick a date', today: today, initialMonth: today));

      await tester.tap(find.text('Pick a date'));
      await tester.pumpAndSettle();
      expect(popupOpen(tester), isTrue);

      // 트리거에서 멀리 떨어진 자리를 누릅니다.
      await tester.tapAt(const Offset(20, 20));
      await tester.pumpAndSettle();
      expect(popupOpen(tester), isFalse);
    });
  });

  group('범위 선택', () {
    testWidgets('두 날짜를 차례로 고르면 시작 – 끝을 보여 주고 닫힌다', (WidgetTester tester) async {
      final List<HoronDateRange?> changes = <HoronDateRange?>[];
      await pumpPicker(
        tester,
        HoronDateRangePicker(
          placeholder: 'Pick a date range',
          today: today,
          initialMonth: today,
          numberOfMonths: 1,
          onValueChanged: changes.add,
        ),
      );

      await tester.tap(find.text('Pick a date range'));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey<String>('calendar-day-0-2026-10-05')));
      await tester.pumpAndSettle();

      // 첫 날짜만 고른 상태에서는 팝업이 열려 있어야 합니다.
      expect(popupOpen(tester), isTrue);
      expect(changes.single, HoronDateRange(from: DateTime(2026, 10, 5)));
      expect(find.text('October 5, 2026'), findsOneWidget);

      await tester.tap(find.byKey(const ValueKey<String>('calendar-day-0-2026-10-09')));
      await tester.pumpAndSettle();

      expect(popupOpen(tester), isFalse);
      expect(changes.last, HoronDateRange(from: DateTime(2026, 10, 5), to: DateTime(2026, 10, 9)));
      expect(find.text('October 5, 2026 – October 9, 2026'), findsOneWidget);
    });

    testWidgets('기본값이 두 달이고 트리거 폭이 React의 w-72(288)이다', (WidgetTester tester) async {
      await pumpPicker(
        tester,
        HoronDateRangePicker(placeholder: 'Pick a date range', today: today, initialMonth: today),
      );

      expect(tester.getSize(find.byType(HoronDateRangePicker)).width, 288);

      await tester.tap(find.text('Pick a date range'));
      await tester.pumpAndSettle();

      expect(find.text('October 2026 – November 2026'), findsOneWidget);
    });

    testWidgets('값이 제어 모드면 트리거가 그 범위를 보여 준다', (WidgetTester tester) async {
      await pumpPicker(
        tester,
        HoronDateRangePicker(
          value: HoronDateRange(from: DateTime(2026, 10, 5), to: DateTime(2026, 10, 9)),
          placeholder: 'Pick a date range',
          today: today,
        ),
      );

      expect(find.text('October 5, 2026 – October 9, 2026'), findsOneWidget);
    });

    testWidgets('시작만 있는 범위는 시작만 보여 준다', (WidgetTester tester) async {
      await pumpPicker(
        tester,
        HoronDateRangePicker(
          value: HoronDateRange(from: DateTime(2026, 10, 5)),
          placeholder: 'Pick a date range',
          today: today,
        ),
      );

      expect(find.text('October 5, 2026'), findsOneWidget);
    });
  });

  group('실패 경로', () {
    testWidgets('placeholder 없이 값도 없으면 트리거가 비어 있고 예외가 없다', (WidgetTester tester) async {
      await pumpPicker(tester, HoronDatePicker(today: today));

      expect(tester.takeException(), isNull);
      expect(find.byType(HoronDatePicker), findsOneWidget);
    });

    testWidgets('두 달 범위에서 이전 달로 넘겨도 그리드가 깨지지 않는다', (WidgetTester tester) async {
      await pumpPicker(
        tester,
        HoronDateRangePicker(placeholder: 'Pick a date range', today: today, initialMonth: DateTime(2026, 1)),
      );

      await tester.tap(find.text('Pick a date range'));
      await tester.pumpAndSettle();

      await tester.tap(find.bySemanticsLabel('Previous'));
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
      expect(find.text('December 2025 – January 2026'), findsOneWidget);
    });

    testWidgets('좁은 화면에서 두 달 팝업이 넘치지 않는다', (WidgetTester tester) async {
      // 360 폭의 기기에서 두 달짜리 패널은 480이 넘습니다. 그대로 두면 `RenderFlex
      // overflowed`가 나므로 패널 폭을 화면에 맞추고 내용을 가로로 스크롤합니다.
      tester.view.physicalSize = const Size(360, 640);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.reset);

      await pumpPicker(
        tester,
        HoronDateRangePicker(placeholder: 'Pick a date range', today: today, initialMonth: today),
      );

      await tester.tap(find.text('Pick a date range'));
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
      expect(popupOpen(tester), isTrue);
      final Rect panel = tester.getRect(find.byKey(HoronDatePicker.panelKey));
      expect(panel.width, lessThanOrEqualTo(360));
      expect(panel.right, lessThanOrEqualTo(360));
      // 달 이름 캡션은 폭이 0으로 줄지 않습니다(가로 스크롤이 폭을 무한으로 줄 때의 증상).
      expect(tester.getSize(find.text('October 2026 – November 2026')).width, greaterThan(0));
    });

    test('달 이름 없이도 날짜를 쓸 수 있다', () {
      expect(formatHoronDate(DateTime(2026, 10, 5), <String>[]), '10 5, 2026');
      expect(
        formatHoronDate(DateTime(2026, 10, 5), const <String>[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]),
        'October 5, 2026',
      );
    });
  });

  for (final Brightness brightness in Brightness.values) {
    testWidgets('${brightness.name}: 두 밝기에서 팝업이 열린다', (WidgetTester tester) async {
      await pumpPicker(
        tester,
        HoronDatePicker(placeholder: 'Pick a date', today: today, initialMonth: today),
        brightness: brightness,
      );

      await tester.tap(find.text('Pick a date'));
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
      expect(popupOpen(tester), isTrue);
    });
  }
}
