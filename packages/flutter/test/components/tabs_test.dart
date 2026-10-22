import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronTabs]를 화면 가운데에 띄웁니다.
Future<void> pumpTabs(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

/// 탭 셋과 내용 셋을 가진 묶음입니다.
Widget tabsFixture({
  HoronTabsVariant variant = HoronTabsVariant.defaultValue,
  bool vertical = false,
  String? value,
  ValueChanged<String>? onValueChanged,
  bool disableSecond = false,
}) {
  return HoronTabs(
    value: value,
    initialValue: 'one',
    vertical: vertical,
    onValueChanged: onValueChanged,
    children: <Widget>[
      HoronTabsList(
        variant: variant,
        children: <Widget>[
          const HoronTabsTrigger(value: 'one', label: 'One'),
          HoronTabsTrigger(value: 'two', label: 'Two', disabled: disableSecond),
          const HoronTabsTrigger(value: 'three', label: 'Three'),
        ],
      ),
      const HoronTabsContent(value: 'one', child: Text('first panel')),
      const HoronTabsContent(value: 'two', child: Text('second panel')),
      const HoronTabsContent(value: 'three', child: Text('third panel')),
    ],
  );
}

/// 목록 표면의 장식을 읽습니다.
BoxDecoration listDecoration(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronTabsList),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return box.decoration as BoxDecoration;
}

void main() {
  testWidgets('tabs: the default variant fills the list and shows the first panel', (WidgetTester tester) async {
    await pumpTabs(tester, tabsFixture());

    expect(find.text('first panel'), findsOneWidget);
    expect(find.text('second panel'), findsNothing);

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronTabsList))).colorScheme;
    // `bg-muted`
    expect(listDecoration(tester).color, scheme.surfaceContainerHighest);
    // `rounded-sm`
    expect(listDecoration(tester).borderRadius, BorderRadius.circular(HoronRadius.sm));
  });

  testWidgets('tabs: tapping a trigger swaps the panel and reports the value', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpTabs(tester, tabsFixture(onValueChanged: changes.add));

    await tester.tap(find.text('Two'));
    await tester.pumpAndSettle();

    expect(changes, <String>['two']);
    expect(find.text('second panel'), findsOneWidget);
    expect(find.text('first panel'), findsNothing);
  });

  testWidgets('tabs: the line variant draws an underline indicator and no fill', (WidgetTester tester) async {
    await pumpTabs(tester, tabsFixture(variant: HoronTabsVariant.line));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronTabsList))).colorScheme;
    // `data-[variant=line]:bg-transparent`와 `data-[variant=line]:rounded-none`
    expect(listDecoration(tester).color, Colors.transparent);
    expect(listDecoration(tester).borderRadius, BorderRadius.zero);

    // 선택된 탭에만 `after:h-0.5` 인디케이터가 붙습니다.
    expect(find.byKey(HoronTabsTrigger.indicatorKeyFor('one')), findsOneWidget);
    expect(find.byKey(HoronTabsTrigger.indicatorKeyFor('two')), findsNothing);

    final Rect indicator = tester.getRect(find.byKey(HoronTabsTrigger.indicatorKeyFor('one')));
    expect(indicator.height, closeTo(HoronSpace.s0_5, 0.01));

    final DecoratedBox line = tester.widget<DecoratedBox>(
      find.descendant(of: find.byKey(HoronTabsTrigger.indicatorKeyFor('one')), matching: find.byType(DecoratedBox)),
    );
    // `after:bg-foreground`
    expect((line.decoration as BoxDecoration).color, scheme.onSurface);

    // 인디케이터는 트리거 아래쪽 바깥에 놓입니다(`after:bottom-[-5px]`).
    expect(indicator.top, greaterThan(tester.getRect(find.text('One')).bottom));

    await tester.tap(find.text('Two'));
    await tester.pumpAndSettle();
    expect(find.byKey(HoronTabsTrigger.indicatorKeyFor('one')), findsNothing);
    expect(find.byKey(HoronTabsTrigger.indicatorKeyFor('two')), findsOneWidget);
  });

  testWidgets('tabs: vertical orientation stacks the triggers and puts the panel beside them', (
    WidgetTester tester,
  ) async {
    await pumpTabs(tester, tabsFixture(vertical: true));

    final Rect one = tester.getRect(find.text('One'));
    final Rect two = tester.getRect(find.text('Two'));
    final Rect three = tester.getRect(find.text('Three'));

    // 같은 열에 위에서 아래로 쌓이고, 트리거가 `w-full`이라 글자가 같은 x에서 시작합니다.
    expect(one.left, closeTo(two.left, 0.5));
    expect(two.left, closeTo(three.left, 0.5));
    expect(one.center.dy, lessThan(two.center.dy));
    expect(two.center.dy, lessThan(three.center.dy));

    // 내용은 목록 오른쪽에 옵니다(`data-vertical:flex-row`의 반대 축).
    expect(
      tester.getRect(find.text('first panel')).left,
      greaterThan(tester.getRect(find.byType(HoronTabsList)).right),
    );
  });

  testWidgets('tabs: horizontal orientation keeps the triggers in one row above the panel', (
    WidgetTester tester,
  ) async {
    await pumpTabs(tester, tabsFixture());

    final Rect one = tester.getRect(find.text('One'));
    final Rect three = tester.getRect(find.text('Three'));

    expect(one.center.dy, closeTo(three.center.dy, 0.5));
    expect(one.center.dx, lessThan(three.center.dx));
    expect(
      tester.getRect(find.text('first panel')).top,
      greaterThan(tester.getRect(find.byType(HoronTabsList)).bottom),
    );
  });

  testWidgets('tabs: a disabled trigger does not select and reads 50% opacity', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpTabs(tester, tabsFixture(onValueChanged: changes.add, disableSecond: true));

    await tester.tap(find.text('Two'), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(changes, isEmpty, reason: '비활성 탭이 값을 바꿨습니다');
    expect(find.text('first panel'), findsOneWidget);
    expect(find.byWidgetPredicate((Widget widget) => widget is Opacity && widget.opacity == 0.5), findsOneWidget);
  });

  testWidgets('tabs: a controlled group follows the owner, not its own taps', (WidgetTester tester) async {
    await pumpTabs(tester, tabsFixture(value: 'one', onValueChanged: (String _) {}));

    await tester.tap(find.text('Two'));
    await tester.pumpAndSettle();
    expect(find.text('first panel'), findsOneWidget, reason: '소유자가 값을 바꾸지 않았습니다');

    await pumpTabs(tester, tabsFixture(value: 'three', onValueChanged: (String _) {}));
    expect(find.text('third panel'), findsOneWidget);
  });

  testWidgets('tabs: both brightnesses render both variants', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronTabsVariant variant in HoronTabsVariant.values) {
        await pumpTabs(tester, tabsFixture(variant: variant), brightness: brightness);
        expect(tester.takeException(), isNull, reason: '${brightness.name}/${variant.name}');
      }
    }
  });

  test('tabs: the public variant enum matches the React cva keys', () {
    expect(HoronTabsVariant.values.map((HoronTabsVariant value) => value.name).toSet(), <String>{
      'defaultValue',
      'line',
    });
  });
}
