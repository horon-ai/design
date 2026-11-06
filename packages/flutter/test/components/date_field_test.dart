import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpField(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 360, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

/// 필드를 화면 위쪽이나 아래쪽에 붙여, 달력이 열릴 자리를 정합니다.
Future<void> pumpAnchoredField(WidgetTester tester, {required Alignment alignment}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(Brightness.light),
      home: Scaffold(
        body: Align(
          alignment: alignment,
          child: const SizedBox(width: 360, child: HoronDateField(placeholder: '날짜 선택')),
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('date field: the placeholder shows when there is no value', (WidgetTester tester) async {
    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택'));
    expect(find.text('날짜 선택'), findsOneWidget);
  });

  testWidgets('date field: a value is formatted through the caller formatter', (WidgetTester tester) async {
    DateTime? picked;
    await pumpField(
      tester,
      HoronDateField(
        value: DateTime(2026, 10, 29),
        formatDate: (DateTime date) => '2026-10-29',
        onValueChange: (DateTime? date) => picked = date,
      ),
    );
    expect(find.text('2026-10-29'), findsOneWidget);
    expect(picked, isNull);
  });

  testWidgets('date field: tapping opens the calendar', (WidgetTester tester) async {
    await pumpField(tester, HoronDateField(value: DateTime(2026, 10, 29), onValueChange: (_) {}));
    await tester.tap(find.byType(HoronDateField));
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsWidgets);
  });

  testWidgets('date field: hovering the solid field raises the border to border-strong', (WidgetTester tester) async {
    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDateField)));

    BoxDecoration fieldBox(WidgetTester tester) =>
        tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first).decoration! as BoxDecoration;

    expect(fieldBox(tester).border!.top.color, theme.colors.borderDefault);
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: tester.getCenter(find.byType(HoronFieldBox)));
    await tester.pumpAndSettle();
    expect(
      fieldBox(tester).border!.top.color,
      theme.colors.borderStrong,
      reason: 'hover:enabled:not-data-invalid:border-border-strong',
    );
    await pointer.removePointer();
    await tester.pumpAndSettle();

    // 유리 표면은 React도 hover 규칙에서 빼고, veil-field가 hover 테두리를 그리지 않습니다.
    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택', surface: HoronSurface.glass));
    final TestGesture glassPointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await glassPointer.addPointer(location: tester.getCenter(find.byType(HoronFieldBox)));
    await tester.pumpAndSettle();
    expect(
      tester.widget<HoronVeil>(find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(HoronVeil))).kind,
      HoronVeilKind.field,
    );
    await glassPointer.removePointer();
    await tester.pumpAndSettle();
  });

  testWidgets('date field: a disabled field does not open', (WidgetTester tester) async {
    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택', disabled: true));
    await tester.tap(find.byType(HoronDateField));
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsNothing);
  });

  testWidgets('date field: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpField(tester, const HoronDateField(placeholder: '날짜 선택'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('date field: the calendar opens 4px below the field', (WidgetTester tester) async {
    await pumpAnchoredField(tester, alignment: Alignment.topCenter);
    await tester.tap(find.byKey(const Key('horon-date-field-trigger')));
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(find.byKey(const Key('horon-date-field-surface')));
    final Rect calendar = tester.getRect(find.byType(HoronCalendar));
    // `sideOffset={4}`: 필드 아래 4px, 필드 왼쪽에 맞춥니다.
    expect(calendar.top - field.bottom, moreOrLessEquals(4, epsilon: 0.5));
    expect(calendar.left, moreOrLessEquals(field.left, epsilon: 0.5));
  });

  testWidgets('date field: the calendar flips above when there is no room below', (WidgetTester tester) async {
    await pumpAnchoredField(tester, alignment: Alignment.bottomCenter);
    await tester.tap(find.byKey(const Key('horon-date-field-trigger')));
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(find.byKey(const Key('horon-date-field-surface')));
    final Rect calendar = tester.getRect(find.byType(HoronCalendar));
    // 뒤집혀도 트리거에서 같은 4px만큼 떨어집니다.
    expect(field.top - calendar.bottom, moreOrLessEquals(4, epsilon: 0.5));
    expect(calendar.bottom, lessThan(field.top));
  });

  testWidgets('date field: the calendar flips above on partial room below', (WidgetTester tester) async {
    // 800x600 화면에서 필드가 y=400에 있어 아래에는 152px만 남습니다. 달력 자연
    // 높이(294)는 들어가지 않지만 위에는 392px가 있어, 아래로 열지 않고 위로
    // 뒤집혀야 합니다.
    tester.view.physicalSize = const Size(800, 600);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Stack(
            children: <Widget>[
              const Positioned(left: 20, top: 400, width: 280, child: HoronDateField(placeholder: '날짜 선택')),
            ],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('horon-date-field-trigger')));
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(find.byKey(const Key('horon-date-field-surface')));
    final Rect calendar = tester.getRect(find.byType(HoronCalendar));
    expect(field.top, moreOrLessEquals(400, epsilon: 0.5));
    // `sideOffset={4}`: 뒤집혀도 트리거에서 4px만 떨어집니다. 화면 여백 상수와는
    // 별개이고, 배치가 화면 여백에 닿기 전에 4px을 지킵니다.
    expect(field.top - calendar.bottom, moreOrLessEquals(4, epsilon: 0.5));
    // 잘리지 않은 자연 높이입니다. 아래에 남아 있던 152px보다 큽니다.
    expect(calendar.height, greaterThan(152));
    // 달력을 담는 스크롤 뷰포트가 달력보다 짧지 않아야 합니다.
    final Rect viewport = tester.getRect(
      find.ancestor(of: find.byType(HoronCalendar), matching: find.byType(SingleChildScrollView)).first,
    );
    expect(viewport.height, moreOrLessEquals(calendar.height, epsilon: 0.5));
  });

  testWidgets('date field: a glass field is the veil and hands the calendar its glass surface', (
    WidgetTester tester,
  ) async {
    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택', surface: HoronSurface.glass));
    final HoronVeil veil = tester.widget<HoronVeil>(
      find.descendant(of: find.byKey(const Key('horon-date-field-surface')), matching: find.byType(HoronVeil)),
    );
    expect(veil.kind, HoronVeilKind.field, reason: 'glass 트리거는 veil-field입니다');
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: '유리 레이어를 겹치지 않습니다');

    await tester.tap(find.byKey(const Key('horon-date-field-trigger')));
    await tester.pumpAndSettle();
    expect(tester.widget<HoronCalendar>(find.byType(HoronCalendar)).surface, HoronCalendarSurface.glass);
  });

  testWidgets('date field: escape and an outside tap close the calendar', (WidgetTester tester) async {
    await pumpAnchoredField(tester, alignment: Alignment.topCenter);

    await tester.tap(find.byKey(const Key('horon-date-field-trigger')));
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsNothing);

    await tester.tap(find.byKey(const Key('horon-date-field-trigger')));
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsOneWidget);

    await tester.tapAt(const Offset(20, 500));
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsNothing);
  });

  testWidgets('date field: the calendar stays on screen when neither side has room', (WidgetTester tester) async {
    // 360 높이에서 가운데 선 필드는 위아래 어느 쪽에도 달력 높이만 한 자리가
    // 없습니다. 예전 구현은 달력을 502까지 그려 화면 밖으로 내보냈습니다.
    tester.view.physicalSize = const Size(640, 360);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);

    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택'));
    await tester.tap(find.byKey(const Key('horon-date-field-trigger')));
    await tester.pumpAndSettle();

    final Finder scroll = find.ancestor(of: find.byType(HoronCalendar), matching: find.byType(SingleChildScrollView));
    final Rect popup = tester.getRect(scroll.first);
    expect(popup.top, greaterThanOrEqualTo(0));
    expect(popup.bottom, lessThanOrEqualTo(360));

    // 줄어든 패널 안에서 달력이 스크롤되어 끝까지 볼 수 있습니다.
    final Rect calendar = tester.getRect(find.byType(HoronCalendar));
    expect(calendar.top, greaterThanOrEqualTo(0));
    await tester.drag(scroll.first, const Offset(0, -400));
    await tester.pumpAndSettle();
    expect(tester.getRect(find.byType(HoronCalendar)).bottom, lessThanOrEqualTo(popup.bottom + 0.5));
  });
}
