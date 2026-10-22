import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/calendar.dart';

/// `calendar`의 그리드 배치·선택 강조·월 이동을 확인합니다.
///
/// 칸은 [ValueKey]로 찾습니다. React의 `data-day` 속성과 같은 자리이고, 글자로 찾으면
/// 이웃 달의 같은 숫자(예: 10월 1일과 11월 1일)가 섞입니다.
void main() {
  Future<void> pumpCalendar(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SingleChildScrollView(child: child)),
        ),
      ),
    );
  }

  /// 달력 안에서 `calendar-`로 시작하는 키를 트리 순서대로 모읍니다.
  ///
  /// 트리 순서는 화면 순서와 같으므로, 이 목록에서 날짜 칸의 위치가 곧 그리드에서의
  /// 위치입니다.
  List<String> calendarKeys(WidgetTester tester) {
    return tester
        .widgetList<Widget>(
          find.descendant(
            of: find.byType(HoronCalendar),
            matching: find.byWidgetPredicate(
              (Widget widget) =>
                  widget.key is ValueKey<String> && (widget.key! as ValueKey<String>).value.startsWith('calendar-'),
            ),
          ),
        )
        .map((Widget widget) => (widget.key! as ValueKey<String>).value)
        .toList();
  }

  /// 이번 달 날짜 칸의 키에서 일(day) 번호만 뽑습니다.
  List<int> dayNumbers(WidgetTester tester) {
    return <int>[
      for (final String key in calendarKeys(tester))
        if (key.startsWith('calendar-day-')) int.parse(key.split('-').last),
    ];
  }

  /// 앞·뒤 빈 칸(이웃 달 포함)의 수입니다.
  ({int leading, int trailing}) blankCounts(WidgetTester tester) {
    final List<String> keys = calendarKeys(tester);
    final int first = keys.indexWhere((String key) => key.startsWith('calendar-day-'));
    final int last = keys.lastIndexWhere((String key) => key.startsWith('calendar-day-'));
    return (leading: first, trailing: keys.length - 1 - last);
  }

  /// 하루 칸이 그린 배경색입니다.
  Color dayBackground(WidgetTester tester, String key) {
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byKey(ValueKey<String>(key)), matching: find.byType(DecoratedBox)).first,
    );
    return (box.decoration as BoxDecoration).color ?? const Color(0x00000000);
  }

  /// 하루 칸의 모서리입니다.
  BorderRadius dayRadius(WidgetTester tester, String key) {
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byKey(ValueKey<String>(key)), matching: find.byType(DecoratedBox)).first,
    );
    return (box.decoration as BoxDecoration).borderRadius! as BorderRadius;
  }

  group('그리드 배치', () {
    test('2026년 10월은 1일부터 31일까지, 앞 3칸·뒤 1칸을 그린다', () {
      // 2026-10-01은 목요일입니다. 월요일 시작이면 앞에 월·화·수 3칸이 비고,
      // 31일 뒤에 11월 1일(일요일) 한 칸이 남습니다. 3 + 31 + 1 = 35 = 5주.
      final HoronCalendarGrid grid = HoronCalendarGrid.of(DateTime(2026, 10));

      expect(grid.month, DateTime(2026, 10));
      expect(grid.daysInMonth, 31);
      expect(grid.leadingBlanks, 3);
      expect(grid.trailingBlanks, 1);
      expect(grid.weekCount, 5);
      expect(grid.cellCount, 35);

      // 칸이 가리키는 날짜도 확인합니다. 첫 칸은 9월 28일, 마지막 칸은 11월 1일입니다.
      expect(grid.dateAt(0), DateTime(2026, 9, 28));
      expect(grid.dateAt(3), DateTime(2026, 10, 1));
      expect(grid.dateAt(33), DateTime(2026, 10, 31));
      expect(grid.dateAt(34), DateTime(2026, 11, 1));
    });

    testWidgets('2026년 10월 그리드가 1..31을 그리고 앞·뒤 칸 수가 맞다', (WidgetTester tester) async {
      await pumpCalendar(tester, HoronCalendar(initialMonth: DateTime(2026, 10), today: DateTime(2026, 10, 15)));

      expect(dayNumbers(tester), <int>[for (int day = 1; day <= 31; day++) day]);
      expect(blankCounts(tester), (leading: 3, trailing: 1));
      expect(calendarKeys(tester).where((String key) => key.startsWith('calendar-outside-')).length, 4);
      expect(find.text('October 2026'), findsOneWidget);
    });

    testWidgets('주 시작일을 일요일로 바꾸면 앞 칸 수가 달라진다', (WidgetTester tester) async {
      await pumpCalendar(
        tester,
        HoronCalendar(initialMonth: DateTime(2026, 10), today: DateTime(2026, 10, 15), firstDayOfWeek: DateTime.sunday),
      );

      expect(dayNumbers(tester), <int>[for (int day = 1; day <= 31; day++) day]);
      expect(blankCounts(tester), (leading: 4, trailing: 0));
      // 요일 머리글도 일요일부터 시작합니다.
      expect(find.text('Su'), findsOneWidget);
    });

    testWidgets('showOutsideDays가 거짓이면 이웃 달 칸이 빈 칸이 된다', (WidgetTester tester) async {
      await pumpCalendar(
        tester,
        HoronCalendar(initialMonth: DateTime(2026, 10), today: DateTime(2026, 10, 15), showOutsideDays: false),
      );

      final List<String> keys = calendarKeys(tester);
      expect(keys.where((String key) => key.startsWith('calendar-outside-')), isEmpty);
      expect(keys.where((String key) => key.startsWith('calendar-blank-')).length, 4);
      expect(dayNumbers(tester), <int>[for (int day = 1; day <= 31; day++) day]);
    });

    test('한 칸의 폭이 React의 --cell-size(32)이다', () {
      // 생성 토큰의 8px 눈금 한 단계입니다.
      expect(HoronSpace.s8, 32);
    });
  });

  group('실패 경로', () {
    testWidgets('윤년 2월(2028)이 29일로 그려지고 그리드가 깨지지 않는다', (WidgetTester tester) async {
      await pumpCalendar(tester, HoronCalendar(initialMonth: DateTime(2028, 2), today: DateTime(2028, 2, 10)));

      expect(tester.takeException(), isNull);
      expect(dayNumbers(tester), <int>[for (int day = 1; day <= 29; day++) day]);
      // 2028-02-01은 화요일이라 월요일 시작이면 앞 1칸, 29일 뒤 5칸입니다.
      expect(blankCounts(tester), (leading: 1, trailing: 5));
      expect(HoronCalendarGrid.of(DateTime(2028, 2)).daysInMonth, 29);
    });

    testWidgets('31일이 없는 달(2026년 4월)이 30일로 그려진다', (WidgetTester tester) async {
      await pumpCalendar(tester, HoronCalendar(initialMonth: DateTime(2026, 4), today: DateTime(2026, 4, 10)));

      expect(tester.takeException(), isNull);
      expect(dayNumbers(tester), <int>[for (int day = 1; day <= 30; day++) day]);
      expect(HoronCalendarGrid.of(DateTime(2026, 4)).daysInMonth, 30);
      expect(find.text('April 2026'), findsOneWidget);
    });

    testWidgets('12월에서 다음 달로 넘기면 다음 해 1월이 된다', (WidgetTester tester) async {
      await pumpCalendar(tester, HoronCalendar(initialMonth: DateTime(2026, 12), today: DateTime(2026, 12, 10)));

      await tester.tap(find.byKey(HoronCalendar.nextMonthKey));
      await tester.pumpAndSettle();

      expect(find.text('January 2027'), findsOneWidget);
      expect(dayNumbers(tester).first, 1);
    });

    test('잘못된 주 시작일은 단언에서 멈춘다', () {
      expect(() => HoronCalendarGrid.of(DateTime(2026, 10), firstDayOfWeek: 0), throwsAssertionError);
      expect(() => HoronCalendarGrid.of(DateTime(2026, 10), firstDayOfWeek: 8), throwsAssertionError);
    });
  });

  group('선택과 강조', () {
    testWidgets('단일 선택이 primary로 칠해지고 다시 누르면 풀린다', (WidgetTester tester) async {
      DateTime? picked;
      await pumpCalendar(
        tester,
        HoronCalendar(
          initialMonth: DateTime(2026, 10),
          today: DateTime(2026, 10, 15),
          onSelected: (DateTime? date) => picked = date,
        ),
      );

      const String key = 'calendar-day-0-2026-10-08';
      await tester.tap(find.byKey(const ValueKey<String>(key)));
      await tester.pumpAndSettle();

      expect(picked, DateTime(2026, 10, 8));
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronCalendar))).colorScheme;
      expect(dayBackground(tester, key), scheme.primary);

      await tester.tap(find.byKey(const ValueKey<String>(key)));
      await tester.pumpAndSettle();
      expect(picked, isNull);
    });

    testWidgets('오늘 칸이 accent 배경으로 강조된다', (WidgetTester tester) async {
      await pumpCalendar(tester, HoronCalendar(initialMonth: DateTime(2026, 10), today: DateTime(2026, 10, 15)));

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronCalendar))).colorScheme;
      expect(dayBackground(tester, 'calendar-day-0-2026-10-15'), scheme.surfaceContainerHighest);
      expect(dayBackground(tester, 'calendar-day-0-2026-10-16'), isNot(scheme.surfaceContainerHighest));
    });

    testWidgets('범위 선택이 시작·끝을 primary, 사이를 accent로 칠한다', (WidgetTester tester) async {
      await pumpCalendar(
        tester,
        HoronCalendar.range(
          initialMonth: DateTime(2026, 10),
          today: DateTime(2026, 10, 15),
          range: HoronDateRange(from: DateTime(2026, 10, 5), to: DateTime(2026, 10, 9)),
        ),
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronCalendar))).colorScheme;
      expect(dayBackground(tester, 'calendar-day-0-2026-10-05'), scheme.primary);
      expect(dayBackground(tester, 'calendar-day-0-2026-10-09'), scheme.primary);
      expect(dayBackground(tester, 'calendar-day-0-2026-10-07'), scheme.surfaceContainerHighest);

      // 시작 칸은 왼쪽 모서리만, 끝 칸은 오른쪽 모서리만 둥급니다.
      expect(dayRadius(tester, 'calendar-day-0-2026-10-05').topLeft.x, HoronRadius.md);
      expect(dayRadius(tester, 'calendar-day-0-2026-10-05').topRight.x, 0);
      expect(dayRadius(tester, 'calendar-day-0-2026-10-09').topRight.x, HoronRadius.md);
      expect(dayRadius(tester, 'calendar-day-0-2026-10-09').topLeft.x, 0);
      expect(dayRadius(tester, 'calendar-day-0-2026-10-07'), BorderRadius.zero);
    });

    testWidgets('범위를 두 번 눌러 고르면 시작과 끝이 채워진다', (WidgetTester tester) async {
      final List<HoronDateRange?> picked = <HoronDateRange?>[];
      await pumpCalendar(
        tester,
        HoronCalendar.range(
          initialMonth: DateTime(2026, 10),
          today: DateTime(2026, 10, 15),
          onRangeSelected: picked.add,
        ),
      );

      await tester.tap(find.byKey(const ValueKey<String>('calendar-day-0-2026-10-12')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey<String>('calendar-day-0-2026-10-19')));
      await tester.pumpAndSettle();

      expect(picked.first, HoronDateRange(from: DateTime(2026, 10, 12)));
      expect(picked.last, HoronDateRange(from: DateTime(2026, 10, 12), to: DateTime(2026, 10, 19)));
    });

    testWidgets('두 번째로 고른 날이 앞서면 새 시작이 된다', (WidgetTester tester) async {
      final List<HoronDateRange?> picked = <HoronDateRange?>[];
      await pumpCalendar(
        tester,
        HoronCalendar.range(
          initialMonth: DateTime(2026, 10),
          today: DateTime(2026, 10, 15),
          range: HoronDateRange(from: DateTime(2026, 10, 20)),
          onRangeSelected: picked.add,
        ),
      );

      await tester.tap(find.byKey(const ValueKey<String>('calendar-day-0-2026-10-06')));
      await tester.pumpAndSettle();

      expect(picked.single, HoronDateRange(from: DateTime(2026, 10, 6)));
    });
  });

  group('월 이동', () {
    testWidgets('이전·다음 버튼이 달을 넘긴다', (WidgetTester tester) async {
      final List<DateTime> months = <DateTime>[];
      await pumpCalendar(
        tester,
        HoronCalendar(initialMonth: DateTime(2026, 10), today: DateTime(2026, 10, 15), onMonthChanged: months.add),
      );

      await tester.tap(find.byKey(HoronCalendar.nextMonthKey));
      await tester.pumpAndSettle();
      expect(find.text('November 2026'), findsOneWidget);

      await tester.tap(find.byKey(HoronCalendar.previousMonthKey));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(HoronCalendar.previousMonthKey));
      await tester.pumpAndSettle();
      expect(find.text('September 2026'), findsOneWidget);
      expect(months, <DateTime>[DateTime(2026, 11), DateTime(2026, 10), DateTime(2026, 9)]);
    });

    testWidgets('두 달을 나란히 그리면 달마다 그리드가 하나씩 있다', (WidgetTester tester) async {
      await pumpCalendar(
        tester,
        HoronCalendar.range(initialMonth: DateTime(2026, 10), today: DateTime(2026, 10, 15), months: 2),
      );

      expect(find.text('October 2026 – November 2026'), findsOneWidget);
      expect(dayNumbers(tester).where((int day) => day == 1).length, 2);
      expect(calendarKeys(tester).where((String key) => key.startsWith('calendar-day-1-')).length, 30);
    });
  });

  for (final Brightness brightness in Brightness.values) {
    testWidgets('${brightness.name}: 두 밝기에서 예외 없이 그려진다', (WidgetTester tester) async {
      await pumpCalendar(
        tester,
        HoronCalendar(initialMonth: DateTime(2026, 10), today: DateTime(2026, 10, 15), selected: DateTime(2026, 10, 3)),
        brightness: brightness,
      );

      expect(tester.takeException(), isNull);
      expect(dayNumbers(tester), hasLength(31));
    });
  }
}
