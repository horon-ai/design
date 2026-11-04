import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

/// 12개짜리 긴 목록입니다. 짧은 화면에서 패널이 줄고 스크롤되는지 봅니다.
const List<HoronPickerItem> _longTimes = <HoronPickerItem>[
  HoronPickerItem(value: '08:00', label: Text('08:00')),
  HoronPickerItem(value: '09:00', label: Text('09:00')),
  HoronPickerItem(value: '10:00', label: Text('10:00')),
  HoronPickerItem(value: '11:00', label: Text('11:00')),
  HoronPickerItem(value: '12:00', label: Text('12:00')),
  HoronPickerItem(value: '13:00', label: Text('13:00')),
  HoronPickerItem(value: '14:00', label: Text('14:00')),
  HoronPickerItem(value: '15:00', label: Text('15:00')),
  HoronPickerItem(value: '16:00', label: Text('16:00')),
  HoronPickerItem(value: '17:00', label: Text('17:00')),
  HoronPickerItem(value: '18:00', label: Text('18:00')),
  HoronPickerItem(value: '19:00', label: Text('19:00')),
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

/// 표본을 화면 위쪽 [top] 자리에 놓습니다. 목록이 아래로 열릴지 위로 뒤집힐지
/// 정하려고 세로 위치를 직접 잡습니다.
Widget _positionedHost(Widget child, {required double top}) {
  return MaterialApp(
    theme: horonTheme(Brightness.light),
    home: Scaffold(
      body: Stack(
        children: <Widget>[Positioned(left: 100, top: top, child: child)],
      ),
    ),
  );
}

Finder _trigger() => find.byKey(const Key('horon-picker-trigger'));

/// 목록 패널입니다. 항목의 가장 가까운 바깥 [DecoratedBox]가 패널 표면입니다.
Finder _panel() => find
    .ancestor(of: find.byKey(const ValueKey<String>('horon-picker-item-09:00')), matching: find.byType(DecoratedBox))
    .first;

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
            HoronPickerField(
              items: _times,
              value: '09:00',
              surface: glass ? HoronPickerSurface.glass : HoronPickerSurface.solid,
            ),
            brightness: brightness,
          ),
        );
        expect(tester.takeException(), isNull, reason: '$brightness glass=$glass');
      }
    }
  });

  testWidgets('the glass picker is a 40px tall, 160px wide veil field with 16px caret and body-md', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(HoronPickerField(items: _times, value: '09:00', surface: HoronPickerSurface.glass)));
    final HoronThemeData theme = _theme(tester);

    expect(tester.getSize(_trigger()), const Size(160, 40), reason: 'w-40 h-10');
    final HoronVeil veil = tester.widget<HoronVeil>(find.descendant(of: _trigger(), matching: find.byType(HoronVeil)));
    expect(veil.kind, HoronVeilKind.field, reason: 'surface="glass"는 veil-field입니다');
    expect(veil.borderRadius!.topLeft.x, theme.radius.md, reason: 'rounded-md');
    expect(find.descendant(of: _trigger(), matching: find.byType(HoronLiquidGlass)), findsNothing);

    final Finder icons = find.descendant(of: _trigger(), matching: find.byType(Icon));
    expect(tester.getSize(icons.at(0)).width, theme.space.step(4), reason: '[&>svg]:size-4 (IconTheme)');
    expect(tester.getSize(icons.at(1)).width, theme.space.step(4), reason: 'size-4');
    expect(tester.widget<Icon>(icons.at(1)).icon, Icons.keyboard_arrow_down);

    final DefaultTextStyle value = tester.widget<DefaultTextStyle>(find.byKey(const Key('horon-picker-value')));
    expect(value.style.fontSize, theme.text.bodyMd.fontSize, reason: 'text-body-md');
    expect(value.style.color, theme.colors.textPrimary);
  });

  testWidgets('an inset picker paints the 4% ink and a solid picker paints bg-surface with a border', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(HoronPickerField(items: _times, value: '09:00', surface: HoronPickerSurface.inset)));
    final HoronThemeData theme = _theme(tester);

    expect(_triggerDecoration(tester).color, theme.colors.overlayInk4, reason: 'bg-overlay-ink-4');
    expect(find.descendant(of: _trigger(), matching: find.byType(HoronLiquidGlass)), findsNothing);

    await tester.pumpWidget(_host(HoronPickerField(items: _times, value: '09:00', surface: HoronPickerSurface.solid)));
    final BoxDecoration solid = _triggerDecoration(tester);
    expect(solid.color, theme.colors.bgSurface, reason: 'bg-bg-surface');
    expect(solid.border!.top.color, theme.colors.borderDefault, reason: 'border-border-default');
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

  testWidgets('the picker list opens 8px below the field and flips above near the bottom', (WidgetTester tester) async {
    await tester.pumpWidget(_positionedHost(HoronPickerField(items: _times, value: '09:00'), top: 200));
    await tester.tap(_trigger());
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(_trigger());
    final Rect below = tester.getRect(_panel());
    expect(below.top, moreOrLessEquals(field.bottom + 8, epsilon: 0.5), reason: 'sideOffset={8}');

    // 화면 아래쪽에서는 남은 자리가 모자라 목록이 필드 위로 뒤집힙니다.
    await tester.pumpWidget(
      _positionedHost(HoronPickerField(key: UniqueKey(), items: _times, value: '09:00'), top: 520),
    );
    await tester.pumpAndSettle();
    await tester.tap(_trigger());
    await tester.pumpAndSettle();

    final Rect nearBottom = tester.getRect(_trigger());
    final Rect above = tester.getRect(_panel());
    expect(above.bottom, moreOrLessEquals(nearBottom.top - 8, epsilon: 0.5), reason: '뒤집혀도 8px을 유지합니다');
    expect(above.bottom, lessThan(nearBottom.top));
    expect(above.top, greaterThanOrEqualTo(8), reason: '화면 위 여백 안에 들어옵니다');
  });

  testWidgets('the picker list stays on screen on a short viewport', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(800, 300);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(_host(HoronPickerField(items: _longTimes, value: '09:00')));
    await tester.tap(_trigger());
    await tester.pumpAndSettle();

    final Rect panel = tester.getRect(_panel());
    expect(panel.top, greaterThanOrEqualTo(0), reason: '패널이 화면 위로 나가지 않습니다');
    expect(panel.bottom, lessThanOrEqualTo(300), reason: '패널이 화면 아래로 나가지 않습니다');

    // 줄어든 패널 안에서 마지막 항목까지 스크롤로 닿습니다.
    final Finder last = find.byKey(const ValueKey<String>('horon-picker-item-19:00'));
    final Finder scrollable = find.descendant(of: _panel(), matching: find.byType(Scrollable)).first;
    await tester.scrollUntilVisible(last, 80, scrollable: scrollable);
    await tester.pumpAndSettle();

    expect(last, findsOneWidget);
    final Rect lastRect = tester.getRect(last);
    expect(lastRect.top, greaterThanOrEqualTo(panel.top));
    expect(lastRect.bottom, lessThanOrEqualTo(panel.bottom));
  });

  testWidgets('escape and an outside tap close the picker list', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronPickerField(items: _times, value: '09:00')));
    final Finder item = find.byKey(const ValueKey<String>('horon-picker-item-12:30'));

    await tester.tap(_trigger());
    await tester.pumpAndSettle();
    expect(item, findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(item, findsNothing, reason: 'Escape가 목록을 닫습니다');

    await tester.tap(_trigger());
    await tester.pumpAndSettle();
    expect(item, findsOneWidget);

    await tester.tapAt(const Offset(700, 560));
    await tester.pumpAndSettle();
    expect(item, findsNothing, reason: '바깥 탭이 목록을 닫습니다');
  });

  testWidgets('a focused picker row picks its value with Enter', (WidgetTester tester) async {
    final List<String?> changes = <String?>[];
    await tester.pumpWidget(_host(HoronPickerField(items: _times, value: '09:00', onChanged: changes.add)));

    await tester.tap(_trigger());
    await tester.pumpAndSettle();

    // 패널이 포커스를 받은 뒤 Tab이 첫 줄로 옮깁니다.
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();

    expect(changes, <String?>['09:00'], reason: '포커스된 줄이 Enter로 골라집니다');
    expect(find.byKey(const ValueKey<String>('horon-picker-item-09:00')), findsNothing, reason: '고르면 목록이 닫힙니다');
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
    expect(
      _weekdayStyle(tester, 'M', 'mon').color,
      theme.colors.interactiveOnPrimary,
      reason: 'data-pressed:text-interactive-on-primary',
    );
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

  testWidgets('the schedule card is a 380px thick-glass panel with 20 padding and 16 gaps', (
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
              children: <Widget>[HoronPickerField(items: _times, value: '09:00', surface: HoronPickerSurface.solid)],
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
      EdgeInsets.all(theme.space.s5),
      reason: 'p-5',
    );
    final Column column = tester.widget<Column>(find.descendant(of: surface, matching: find.byType(Column)).first);
    expect(column.spacing, theme.space.s4, reason: 'gap-4');

    // 제목 줄의 반복 아이콘 16px, 다음 실행 줄의 달력 아이콘 16px.
    expect(tester.widget<Icon>(find.byIcon(Icons.repeat)).size, theme.space.step(4));
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
      EdgeInsets.symmetric(horizontal: theme.space.s3, vertical: theme.space.s2),
      reason: 'px-3 py-2',
    );

    // 섹션 캡션은 caption + 보조 색입니다.
    final DefaultTextStyle caption = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Repeat'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(caption.style.fontSize, theme.text.caption.fontSize, reason: 'text-caption');
    expect(caption.style.color, theme.colors.textSecondary);

    final Column section = tester.widget<Column>(
      find.ancestor(of: find.text('Repeat'), matching: find.byType(Column)).first,
    );
    expect(section.spacing, theme.space.s2, reason: 'gap-2');
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
