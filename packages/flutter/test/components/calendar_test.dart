import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 달력을 테마가 적용된 화면 가운데에 놓습니다. [width]를 주면 그 폭만큼만 자리를 냅니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: sized)),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronCalendar)));

Key _dayKey(int year, int month, int day) => ValueKey<String>('horon-calendar-day-$year-$month-$day');

Finder _surface() => find.byKey(const Key('horon-calendar-surface'));

BoxDecoration _surfaceDecoration(WidgetTester tester) =>
    tester.widget<DecoratedBox>(_surface()).decoration as BoxDecoration;

Finder _dayOf(int year, int month, int day) => find.byKey(_dayKey(year, month, day));

BoxDecoration _dayDecoration(WidgetTester tester, int year, int month, int day) {
  final Finder cell = _dayOf(year, month, day);
  return tester
          .widget<AnimatedContainer>(find.descendant(of: cell, matching: find.byType(AnimatedContainer)))
          .decoration!
      as BoxDecoration;
}

TextStyle _dayStyle(WidgetTester tester, int year, int month, int day) =>
    tester.widget<Text>(find.descendant(of: _dayOf(year, month, day), matching: find.text('$day'))).style!;

final DateTime _month = DateTime(2026, 10);
final DateTime _today = DateTime(2026, 10, 19);

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronCalendar(defaultMonth: _month, today: _today),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull, reason: '$brightness에서 예외가 없어야 합니다');
      expect(find.byKey(const Key('horon-calendar-title')), findsOneWidget);
    }
  });

  testWidgets('the default calendar is a thick-glass plate with the 20 radius and 16 padding', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today)));
    final HoronThemeData theme = _theme(tester);
    final BoxDecoration decoration = _surfaceDecoration(tester);

    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.xl, reason: 'rounded-xl');
    expect(decoration.border, isNull, reason: 'Paper는 호스트 테두리를 그리지 않습니다(가장자리는 유리 레이어가 맡습니다)');
    expect(
      tester.widget<Padding>(find.descendant(of: _surface(), matching: find.byType(Padding)).first).padding,
      EdgeInsets.all(theme.space.s4),
      reason: 'p-4',
    );
    // `size-10` — 날짜 칸은 40px 정사각형입니다.
    expect(tester.getSize(_dayOf(2026, 10, 5)), Size(theme.space.step(10), theme.space.step(10)));
    // `h-6 w-10` — 요일 줄.
    expect(tester.getSize(find.byType(Center).at(0)), isNotNull, reason: '요일 줄이 그려져야 합니다');
    // `text-title-sm text-text-primary` — 기본 변형의 월 제목.
    final Text title = tester.widget<Text>(find.byKey(const Key('horon-calendar-title')));
    expect(title.style!.fontSize, theme.text.titleSm.fontSize);
    expect(title.style!.color, theme.colors.textPrimary);
    expect(title.data, 'October 2026');
  });

  testWidgets('the popover variant swaps the 24 radius, the label-lg title and 32px arrows', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today, popover: true)));
    final HoronThemeData theme = _theme(tester);

    expect((_surfaceDecoration(tester).borderRadius! as BorderRadius).topLeft.x, 24, reason: 'rounded-[24px]');
    expect(
      tester.widget<Padding>(find.descendant(of: _surface(), matching: find.byType(Padding)).first).padding,
      EdgeInsets.all(theme.space.s3_5),
      reason: 'p-3.5',
    );
    final Text title = tester.widget<Text>(find.byKey(const Key('horon-calendar-title')));
    expect(title.style!.fontSize, theme.text.labelLg.fontSize, reason: 'text-label-lg');
    expect(title.style!.color, theme.colors.textPrimary);
    // `size-8` 화살표 버튼과 18px 아이콘.
    expect(
      tester.getSize(find.byKey(const Key('horon-calendar-next'))),
      Size(theme.space.step(8), theme.space.step(8)),
    );
    expect(
      tester
          .widget<Icon>(find.descendant(of: find.byKey(const Key('horon-calendar-next')), matching: find.byType(Icon)))
          .size,
      theme.space.step(4.5),
      reason: 'size-4.5',
    );
  });

  testWidgets('both variants render, so a shape cannot be added without a decision', (WidgetTester tester) async {
    for (final bool popover in <bool>[false, true]) {
      await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today, popover: popover)));
      expect(tester.takeException(), isNull);
      expect(_dayOf(2026, 10, 15), findsOneWidget);
    }
  });

  testWidgets('tapping a day reports it and paints the selected pill', (WidgetTester tester) async {
    final List<DateTime> changes = <DateTime>[];
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today, onValueChange: changes.add)));

    await tester.tap(_dayOf(2026, 10, 14));
    await tester.pumpAndSettle();
    expect(changes, <DateTime>[DateTime(2026, 10, 14)]);

    await tester.pumpWidget(
      _host(
        HoronCalendar(defaultMonth: _month, today: _today, value: DateTime(2026, 10, 14), onValueChange: changes.add),
      ),
    );
    await tester.pumpAndSettle();
    final HoronThemeData theme = _theme(tester);
    expect(
      _dayDecoration(tester, 2026, 10, 14).color,
      theme.colors.interactivePrimary,
      reason: 'rounded-full bg-interactive-primary',
    );
    expect(_dayStyle(tester, 2026, 10, 14).color, theme.colors.textInverse, reason: 'text-text-inverse (#F9FAFB)');
    expect(_dayStyle(tester, 2026, 10, 14).fontSize, theme.text.labelMd.fontSize, reason: 'text-label-md');
  });

  testWidgets('range mode fills the days between the two ends', (WidgetTester tester) async {
    final List<HoronDateRange> changes = <HoronDateRange>[];
    await tester.pumpWidget(
      _host(
        HoronCalendar(
          defaultMonth: _month,
          today: _today,
          range: HoronDateRange(start: DateTime(2026, 10, 12)),
          onRangeChange: changes.add,
        ),
      ),
    );

    await tester.tap(_dayOf(2026, 10, 16));
    await tester.pumpAndSettle();
    expect(changes.single.start, DateTime(2026, 10, 12));
    expect(changes.single.end, DateTime(2026, 10, 16));

    await tester.pumpWidget(
      _host(HoronCalendar(defaultMonth: _month, today: _today, range: changes.single, onRangeChange: changes.add)),
    );
    await tester.pumpAndSettle();
    final HoronThemeData theme = _theme(tester);
    expect(_dayDecoration(tester, 2026, 10, 14).color, theme.colors.overlayInk8, reason: 'bg-overlay-ink-8');
    expect(_dayDecoration(tester, 2026, 10, 14).borderRadius, BorderRadius.zero, reason: '범위 안의 날은 둥글지 않은 띠입니다');
    expect(_dayDecoration(tester, 2026, 10, 12).color, theme.colors.interactivePrimary);
    expect(_dayDecoration(tester, 2026, 10, 16).color, theme.colors.interactivePrimary);

    // 끝이 찬 범위에서 새 날을 누르면 범위를 다시 시작합니다.
    await tester.tap(_dayOf(2026, 10, 20));
    await tester.pumpAndSettle();
    expect(changes.last.start, DateTime(2026, 10, 20));
    expect(changes.last.end, isNull);
  });

  testWidgets('a disabled day does not report and dims to text-disabled', (WidgetTester tester) async {
    final List<DateTime> changes = <DateTime>[];
    await tester.pumpWidget(
      _host(
        HoronCalendar(
          defaultMonth: _month,
          today: _today,
          isDateDisabled: (DateTime date) => date.day == 14,
          onValueChange: changes.add,
        ),
      ),
    );

    await tester.tap(_dayOf(2026, 10, 14));
    await tester.pumpAndSettle();
    expect(changes, isEmpty, reason: 'disabled 날짜는 콜백을 부르지 않습니다');
    expect(_dayStyle(tester, 2026, 10, 14).color, _theme(tester).colors.textDisabled, reason: 'text-text-disabled');
  });

  testWidgets('days outside the month use the disabled colour and today gets the dot', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today)));
    final HoronThemeData theme = _theme(tester);

    // 2026년 10월 1일은 목요일이라 일요일 시작 격자는 9월 27일에서 시작합니다.
    expect(_dayOf(2026, 9, 27), findsOneWidget);
    expect(_dayStyle(tester, 2026, 9, 27).color, theme.colors.textDisabled, reason: 'text-text-disabled (#B0B1B3)');
    expect(_dayStyle(tester, 2026, 9, 27).fontSize, theme.text.labelMd.fontSize, reason: 'text-label-md');
    expect(_dayStyle(tester, 2026, 10, 19).color, theme.colors.textBrand, reason: 'text-text-brand (오늘)');
    expect(_dayStyle(tester, 2026, 10, 19).fontSize, theme.text.labelMd.fontSize);
    expect(find.byKey(const Key('horon-calendar-today-dot-2026-10-19')), findsOneWidget);
    // 고른 날에는 오늘 점을 그리지 않습니다.
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today, value: DateTime(2026, 10, 19))));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('horon-calendar-today-dot-2026-10-19')), findsNothing);
  });

  testWidgets('weekStartsOn moves the grid start', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today, weekStartsOn: 1)));
    expect(_dayOf(2026, 9, 28), findsOneWidget, reason: '월요일 시작이면 9월 28일부터입니다');
    expect(_dayOf(2026, 9, 27), findsNothing);
  });

  testWidgets('the arrows report the new month and a controlled month ignores the tap', (WidgetTester tester) async {
    final List<DateTime> months = <DateTime>[];
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today, onMonthChange: months.add)));

    await tester.tap(find.byKey(const Key('horon-calendar-next')));
    await tester.pumpAndSettle();
    expect(months, <DateTime>[DateTime(2026, 11)]);
    expect(tester.widget<Text>(find.byKey(const Key('horon-calendar-title'))).data, 'November 2026');

    await tester.tap(find.byKey(const Key('horon-calendar-prev')));
    await tester.pumpAndSettle();
    expect(months.last, DateTime(2026, 10));

    months.clear();
    await tester.pumpWidget(_host(HoronCalendar(month: _month, today: _today, onMonthChange: months.add)));
    await tester.tap(find.byKey(const Key('horon-calendar-next')));
    await tester.pumpAndSettle();
    expect(months.single, DateTime(2026, 11));
    expect(
      tester.widget<Text>(find.byKey(const Key('horon-calendar-title'))).data,
      'October 2026',
      reason: 'month를 바깥에서 정하면 스스로 넘어가지 않습니다',
    );
  });

  testWidgets('arrow keys move the focused day and cross the month boundary', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today)));

    await tester.tap(_dayOf(2026, 10, 31));
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pumpAndSettle();

    expect(
      tester.widget<Text>(find.byKey(const Key('horon-calendar-title'))).data,
      'November 2026',
      reason: '10월 31일에서 오른쪽은 11월 1일입니다',
    );
  });

  testWidgets('a narrow box shrinks the day cells instead of overflowing', (WidgetTester tester) async {
    for (final double width in <double>[1024, 390, 320]) {
      await tester.pumpWidget(
        _host(
          HoronCalendar(defaultMonth: _month, today: _today),
          width: width,
        ),
      );
      expect(tester.takeException(), isNull, reason: '폭 $width에서 예외가 없어야 합니다');
      expect(
        tester.getSize(_dayOf(2026, 10, 5)).width,
        _theme(tester).space.step(10),
        reason: '폭 $width에서는 40px 칸이 들어갑니다',
      );
    }

    // 240처럼 칸 일곱 개가 들어가지 않는 폭에서는 칸이 줄어듭니다.
    await tester.pumpWidget(_host(HoronCalendar(defaultMonth: _month, today: _today), width: 240));
    expect(tester.takeException(), isNull);
    expect(tester.getSize(_dayOf(2026, 10, 5)).width, lessThan(_theme(tester).space.step(10)));
    expect(tester.getSize(_surface()).width, lessThanOrEqualTo(240), reason: '유리 판도 부모 폭 안에 머뭅니다');
  });
}
