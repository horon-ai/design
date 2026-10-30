import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 표본을 테마가 적용된 화면 가운데에 놓습니다. [width]를 주면 그 폭만큼만 자리를 냅니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: sized)),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(Scaffold)));

const List<HoronPickerItem> _times = <HoronPickerItem>[
  HoronPickerItem(value: '09:00', label: Text('09:00')),
  HoronPickerItem(value: '12:30', label: Text('12:30')),
  HoronPickerItem(value: '18:00', label: Text('18:00')),
];

const List<HoronWeekday> _days = <HoronWeekday>[
  HoronWeekday(value: 'mon', label: 'M', name: 'Monday'),
  HoronWeekday(value: 'tue', label: 'T', name: 'Tuesday'),
  HoronWeekday(value: 'wed', label: 'W', name: 'Wednesday'),
  HoronWeekday(value: 'thu', label: 'T', name: 'Thursday'),
  HoronWeekday(value: 'fri', label: 'F', name: 'Friday'),
  HoronWeekday(value: 'sat', label: 'S', name: 'Saturday'),
  HoronWeekday(value: 'sun', label: 'S', name: 'Sunday'),
];

Finder _trigger() => find.byKey(const Key('horon-picker-trigger'));

BoxDecoration _triggerDecoration(WidgetTester tester) =>
    tester.widget<DecoratedBox>(find.descendant(of: _trigger(), matching: find.byType(DecoratedBox)).first).decoration
        as BoxDecoration;

Finder _weekday(String value) => find.byKey(ValueKey<String>('horon-weekday-$value'));

BoxDecoration _weekdayDecoration(WidgetTester tester, String value) =>
    tester
            .widget<AnimatedContainer>(find.descendant(of: _weekday(value), matching: find.byType(AnimatedContainer)))
            .decoration!
        as BoxDecoration;

TextStyle _weekdayStyle(WidgetTester tester, String label, String value) =>
    tester.widget<Text>(find.descendant(of: _weekday(value), matching: find.text(label))).style!;

void main() {
  testWidgets('the picker renders in light and dark on both surfaces', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final bool glass in <bool>[true, false]) {
        await tester.pumpWidget(
          _host(
            HoronPickerField(items: _times, value: '09:00', glass: glass),
            brightness: brightness,
          ),
        );
        expect(tester.takeException(), isNull, reason: '$brightness glass=$glass');
      }
    }
  });

  testWidgets('the glass picker is a 40px tall, 160px wide field with the md radius', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronPickerField(items: _times, value: '09:00')));
    final HoronThemeData theme = _theme(tester);
    final BoxDecoration decoration = _triggerDecoration(tester);

    expect(tester.getSize(_trigger()), const Size(160, 40), reason: 'w-40 h-10');
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.md, reason: 'rounded-md');
    expect(decoration.border!.top.color, theme.colors.glassRimStrong, reason: 'border-glass-rim-strong');
    expect(
      tester.widget<HoronLiquidGlass>(find.descendant(of: _trigger(), matching: find.byType(HoronLiquidGlass))).tier,
      HoronGlassTier.regular,
      reason: 'bg-glass-regular',
    );

    final Finder icons = find.descendant(of: _trigger(), matching: find.byType(Icon));
    expect(tester.getSize(icons.at(0)).width, theme.space.step(4), reason: '[&>svg]:size-4 (IconTheme)');
    expect(tester.getSize(icons.at(1)).width, theme.space.step(3.5), reason: 'size-3.5');
    expect(tester.widget<Icon>(icons.at(1)).icon, Icons.keyboard_arrow_down);

    final DefaultTextStyle value = tester.widget<DefaultTextStyle>(find.byKey(const Key('horon-picker-value')));
    expect(value.style.fontSize, theme.text.bodySm.fontSize, reason: 'text-body-sm');
    expect(value.style.color, theme.colors.textPrimary);
  });

  testWidgets('an inset picker paints the 4% ink and skips the glass', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronPickerField(items: _times, value: '09:00', glass: false)));
    final HoronThemeData theme = _theme(tester);

    expect(_triggerDecoration(tester).color, theme.colors.overlayInk4, reason: 'bg-overlay-ink-4');
    expect(find.descendant(of: _trigger(), matching: find.byType(HoronLiquidGlass)), findsNothing);
  });

  testWidgets('tapping the field opens the list and picking a value reports it', (WidgetTester tester) async {
    final List<String?> changes = <String?>[];
    await tester.pumpWidget(_host(HoronPickerField(items: _times, defaultValue: '09:00', onChanged: changes.add)));

    await tester.tap(_trigger());
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey<String>('horon-picker-item-18:00')), findsOneWidget);
    expect(find.byIcon(Icons.check), findsOneWidget, reason: '고른 줄에만 체크가 붙습니다');

    await tester.tap(find.byKey(const ValueKey<String>('horon-picker-item-18:00')));
    await tester.pumpAndSettle();

    expect(changes, <String?>['18:00']);
    expect(tester.widget<Text>(find.text('18:00')).data, '18:00', reason: '필드가 고른 값을 보여 줍니다');

    // 다시 열면 체크가 새 값으로 옮겨 갑니다.
    await tester.tap(_trigger());
    await tester.pumpAndSettle();
    expect(find.byIcon(Icons.check), findsOneWidget);
    final Finder checkedRow = find.ancestor(of: find.byIcon(Icons.check), matching: find.byType(Row));
    expect(
      find.descendant(of: checkedRow, matching: find.text('18:00')),
      findsOneWidget,
      reason: '체크는 18:00 줄에 있습니다',
    );
  });

  testWidgets('the weekday picker is 36px round toggles that report display order', (WidgetTester tester) async {
    final List<List<String>> changes = <List<String>>[];
    await tester.pumpWidget(
      _host(HoronWeekdayPicker(days: _days, defaultValue: const <String>['mon', 'wed'], onChanged: changes.add)),
    );
    final HoronThemeData theme = _theme(tester);

    expect(tester.getSize(_weekday('mon')), Size(theme.space.step(9), theme.space.step(9)), reason: 'size-9');
    expect(_weekdayDecoration(tester, 'mon').shape, BoxShape.circle, reason: 'rounded-full');
    expect(
      _weekdayDecoration(tester, 'mon').color,
      theme.colors.interactivePrimary,
      reason: 'data-pressed:bg-interactive-primary',
    );
    expect(_weekdayStyle(tester, 'M', 'mon').color, theme.colors.textInverse, reason: 'data-pressed:text-text-inverse');
    expect(_weekdayDecoration(tester, 'tue').color, theme.colors.overlayInk6, reason: 'bg-overlay-ink-6');
    expect(_weekdayStyle(tester, 'T', 'tue').color, theme.colors.textSecondary);
    expect(_weekdayStyle(tester, 'T', 'tue').fontSize, theme.text.labelMd.fontSize, reason: 'text-label-md');

    await tester.tap(_weekday('tue'));
    await tester.pumpAndSettle();
    expect(changes.single, <String>['mon', 'tue', 'wed'], reason: '표시 순서대로 돌려줍니다');

    await tester.tap(_weekday('mon'));
    await tester.pumpAndSettle();
    expect(changes.last, <String>['tue', 'wed'], reason: '다시 누르면 꺼집니다');
  });

  testWidgets('the schedule card is a 380px thick-glass panel with 18 padding and 14 gaps', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _host(
        HoronScheduleCard(
          title: const Text('Morning digest'),
          nextRun: const Text('Tomorrow, 09:00'),
          children: <Widget>[
            HoronScheduleSection(
              label: const Text('Repeat'),
              children: <Widget>[HoronPickerField(items: _times, value: '09:00', glass: false)],
            ),
          ],
        ),
      ),
    );
    final HoronThemeData theme = _theme(tester);
    final Finder surface = find.byKey(const Key('horon-schedule-card-surface'));
    final BoxDecoration decoration = tester.widget<DecoratedBox>(surface).decoration as BoxDecoration;

    expect(tester.getSize(surface).width, 380, reason: 'w-95');
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.xl, reason: 'rounded-xl');
    expect(decoration.border!.top.color, theme.colors.glassRimStrong);
    expect(
      tester.widget<Padding>(find.descendant(of: surface, matching: find.byType(Padding)).first).padding,
      EdgeInsets.all(theme.space.step(4.5)),
      reason: 'p-4.5',
    );
    final Column column = tester.widget<Column>(find.descendant(of: surface, matching: find.byType(Column)).first);
    expect(column.spacing, theme.space.s3_5, reason: 'gap-3.5');

    // 제목 줄의 반복 아이콘 18px, 다음 실행 줄의 달력 아이콘 16px.
    expect(tester.widget<Icon>(find.byIcon(Icons.repeat)).size, theme.space.step(4.5));
    expect(tester.widget<Icon>(find.byIcon(Icons.calendar_today_outlined)).size, theme.space.step(4));

    final Container nextRun = tester.widget<Container>(find.byKey(const Key('horon-schedule-card-next-run')));
    expect((nextRun.decoration! as BoxDecoration).color, theme.colors.accentSky500_16, reason: 'bg-accent-sky-500-16');
    expect(
      (nextRun.decoration! as BoxDecoration).borderRadius,
      BorderRadius.circular(theme.radius.md),
      reason: 'rounded-md',
    );
    expect(
      nextRun.padding,
      EdgeInsets.symmetric(horizontal: theme.space.s3, vertical: theme.space.s2_5),
      reason: 'px-3 py-2.5',
    );

    // 섹션 캡션은 caption + 보조 색입니다.
    final DefaultTextStyle caption = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Repeat'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(caption.style.fontSize, theme.text.caption.fontSize, reason: 'text-caption');
    expect(caption.style.color, theme.colors.textSecondary);
  });

  testWidgets('a narrow card shrinks instead of overflowing', (WidgetTester tester) async {
    for (final double width in <double>[320, 390]) {
      await tester.pumpWidget(
        _host(
          HoronScheduleCard(
            title: const Text('Morning digest with a long title that has to fit'),
            nextRun: const Text('Tomorrow, 09:00'),
            children: <Widget>[
              HoronWeekdayPicker(days: _days, value: const <String>['mon', 'tue']),
            ],
          ),
          width: width,
        ),
      );
      expect(tester.takeException(), isNull, reason: '폭 $width에서 예외가 없어야 합니다');
      expect(
        tester.getSize(find.byKey(const Key('horon-schedule-card-surface'))).width,
        width,
        reason: '부모가 좁으면 카드도 그 폭을 따릅니다',
      );
    }
  });

  testWidgets('the weekday row wraps at phone width instead of scrolling sideways', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronWeekdayPicker(days: _days), width: 320));
    final double wide = tester.getSize(find.byType(Wrap)).height;
    expect(wide, tester.getSize(_weekday('mon')).height, reason: '한 줄일 때 높이는 토글 하나입니다');

    await tester.pumpWidget(_host(HoronWeekdayPicker(days: _days), width: 160));
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(Wrap)).height, greaterThan(wide), reason: '좁으면 36px 토글이 다음 줄로 넘어갑니다');
  });
}
