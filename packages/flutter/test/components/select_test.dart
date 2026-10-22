import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `select`의 값 표시·열림·닫힘·체크 표시·경계 뒤집기를 확인합니다.
///
/// 모양은 그려진 색과 사각형으로 판정합니다. 팝업은 `CompositedTransformFollower`
/// 안에 있어 위젯 트리 위치가 곧 화면 위치가 아니므로, 위치는
/// [WidgetTester.getRect]가 계산하는 렌더 변환으로 잽니다.
void main() {
  Future<void> pumpSelect(
    WidgetTester tester,
    Widget child, {
    Brightness brightness = Brightness.light,
    Alignment alignment = Alignment.center,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Align(
            alignment: alignment,
            child: SizedBox(width: 240, child: child),
          ),
        ),
      ),
    );
    // MaterialApp은 테마를 AnimatedTheme로 감싸므로 밝기를 바꾼 직후에는 색이
    // 아직 이전 값입니다. 애니메이션이 끝난 뒤에 재야 합니다.
    await tester.pumpAndSettle();
  }

  /// 도시 세 개를 고르는 기본 선택 상자입니다. `jeju`는 고를 수 없습니다.
  HoronSelect<String> selectWith({
    String? value,
    ValueChanged<String>? onChanged,
    bool enabled = true,
    bool invalid = false,
    List<Widget>? items,
    String? placeholder = '도시',
    String? emptyLabel,
  }) {
    return HoronSelect<String>(
      value: value,
      onChanged: onChanged,
      enabled: enabled,
      invalid: invalid,
      children: <Widget>[
        HoronSelectTrigger(child: HoronSelectValue(placeholder: placeholder)),
        HoronSelectContent(
          emptyLabel: emptyLabel,
          children:
              items ??
              const <Widget>[
                HoronSelectItem<String>(value: 'seoul', label: 'Seoul'),
                HoronSelectItem<String>(value: 'busan', label: 'Busan'),
                HoronSelectItem<String>(value: 'jeju', label: 'Jeju', enabled: false),
              ],
        ),
      ],
    );
  }

  testWidgets('select: the trigger shows the placeholder until a value is picked', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpSelect(tester, selectWith(onChanged: changes.add));

    expect(find.text('도시'), findsOneWidget);
    expect(find.text('Seoul'), findsNothing);

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Seoul'));
    await tester.pumpAndSettle();

    // 값이 바뀌면 트리거 표시가 그 값의 글자로 바뀌고 목록은 닫힙니다.
    expect(changes, <String>['seoul']);
    expect(find.text('Seoul'), findsOneWidget);
    expect(find.text('도시'), findsNothing);
    expect(find.byKey(HoronSelect.contentKey), findsNothing);
  });

  testWidgets('select: a controlled value repaints the trigger text', (WidgetTester tester) async {
    String value = 'seoul';
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) => Center(
              child: SizedBox(
                width: 240,
                child: HoronSelect<String>(
                  value: value,
                  onChanged: (String next) => setState(() => value = next),
                  children: <Widget>[
                    const HoronSelectTrigger(child: HoronSelectValue()),
                    const HoronSelectContent(
                      children: <Widget>[
                        HoronSelectItem<String>(value: 'seoul', label: 'Seoul'),
                        HoronSelectItem<String>(value: 'busan', label: 'Busan'),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );

    expect(find.text('Seoul'), findsOneWidget);

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Busan'));
    await tester.pumpAndSettle();

    expect(find.text('Busan'), findsOneWidget);
    expect(find.text('Seoul'), findsNothing);
  });

  testWidgets('select: only the selected item carries a check mark', (WidgetTester tester) async {
    await pumpSelect(tester, selectWith(value: 'busan'));

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();

    final int marks = tester
        .widgetList<CustomPaint>(
          find.descendant(of: find.byKey(HoronSelect.contentKey), matching: find.byType(CustomPaint)),
        )
        .where((CustomPaint paint) => paint.painter is HoronCheckMarkPainter)
        .length;
    expect(marks, 1);
    expect(find.byKey(HoronSelect.checkKey), findsOneWidget);
  });

  testWidgets('select: a disabled item cannot be picked', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpSelect(tester, selectWith(onChanged: changes.add));

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Jeju'));
    await tester.pumpAndSettle();

    expect(changes, isEmpty);
    expect(find.byKey(HoronSelect.contentKey), findsOneWidget);
  });

  testWidgets('select: an empty list shows the empty state', (WidgetTester tester) async {
    await pumpSelect(tester, selectWith(items: const <Widget>[], emptyLabel: '도시 없음'));

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();

    expect(find.text('도시 없음'), findsOneWidget);
  });

  testWidgets('select: an empty list falls back to the theme string', (WidgetTester tester) async {
    await pumpSelect(tester, selectWith(items: const <Widget>[]));

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();

    final HoronStrings strings = HoronTheme.of(tester.element(find.byKey(HoronSelect.contentKey))).strings;
    expect(find.text(strings.noResults), findsOneWidget);
  });

  testWidgets('select: a trigger near the bottom edge flips the list upward', (WidgetTester tester) async {
    // 화면 아래 끝에 트리거를 붙입니다. 아래로는 목록이 들어갈 자리가 없습니다.
    await pumpSelect(tester, selectWith(), alignment: Alignment.bottomCenter);

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();

    final Rect trigger = tester.getRect(find.byType(HoronSelectTrigger));
    final Rect panel = tester.getRect(find.byKey(HoronSelect.contentKey));

    expect(panel.bottom, lessThanOrEqualTo(trigger.top), reason: '아래에 자리가 없으면 위로 뒤집힙니다');
    expect(panel.top, greaterThanOrEqualTo(0), reason: '목록은 화면 안에 남습니다');
  });

  testWidgets('select: a trigger at the top keeps the list below', (WidgetTester tester) async {
    await pumpSelect(tester, selectWith(), alignment: Alignment.topCenter);

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();

    final Rect trigger = tester.getRect(find.byType(HoronSelectTrigger));
    final Rect panel = tester.getRect(find.byKey(HoronSelect.contentKey));

    expect(panel.top, greaterThanOrEqualTo(trigger.bottom));
  });

  testWidgets('select: the list is at least 144 wide and follows a wider trigger', (WidgetTester tester) async {
    await pumpSelect(tester, selectWith());

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();

    final Rect trigger = tester.getRect(find.byType(HoronSelectTrigger));
    final Rect panel = tester.getRect(find.byKey(HoronSelect.contentKey));
    // 트리거 폭이 144보다 넓으면 목록이 그 폭을 따릅니다. 아니면 144입니다.
    expect(panel.width, closeTo(trigger.width < 144 ? 144 : trigger.width, 0.5));
  });

  testWidgets('select: a disabled select never opens', (WidgetTester tester) async {
    await pumpSelect(tester, selectWith(enabled: false));

    await tester.tap(find.byType(HoronSelectTrigger), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(find.byKey(HoronSelect.contentKey), findsNothing);
  });

  testWidgets('select: groups, labels and separators render inside the list', (WidgetTester tester) async {
    await pumpSelect(
      tester,
      selectWith(
        items: const <Widget>[
          HoronSelectGroup(
            children: <Widget>[
              HoronSelectLabel(label: '수도권'),
              HoronSelectItem<String>(value: 'seoul', label: 'Seoul'),
            ],
          ),
          HoronSelectSeparator(),
          HoronSelectGroup(
            children: <Widget>[
              HoronSelectLabel(label: '그 밖'),
              HoronSelectItem<String>(value: 'busan', label: 'Busan'),
            ],
          ),
        ],
      ),
    );

    await tester.tap(find.byType(HoronSelectTrigger));
    await tester.pumpAndSettle();

    expect(find.text('수도권'), findsOneWidget);
    expect(find.text('그 밖'), findsOneWidget);
    expect(find.byType(HoronSelectSeparator), findsOneWidget);
  });

  testWidgets('select: the trigger heights match the React sizes', (WidgetTester tester) async {
    await pumpSelect(
      tester,
      HoronSelect<String>(
        children: <Widget>[
          const HoronSelectTrigger(child: HoronSelectValue()),
          const HoronSelectContent(
            children: <Widget>[HoronSelectItem<String>(value: 'a', label: 'A')],
          ),
        ],
      ),
    );
    expect(tester.getSize(find.byType(HoronSelectTrigger)).height, closeTo(37, 0.01));

    await pumpSelect(
      tester,
      HoronSelect<String>(
        children: <Widget>[
          const HoronSelectTrigger(size: HoronSelectSize.sm, child: HoronSelectValue()),
          const HoronSelectContent(
            children: <Widget>[HoronSelectItem<String>(value: 'a', label: 'A')],
          ),
        ],
      ),
    );
    expect(tester.getSize(find.byType(HoronSelectTrigger)).height, closeTo(28, 0.01));
  });

  testWidgets('select: an invalid trigger paints the destructive border', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpSelect(tester, selectWith(invalid: true), brightness: brightness);
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronSelectTrigger))).colorScheme;
      final AnimatedContainer box = tester.widget<AnimatedContainer>(
        find.descendant(of: find.byType(HoronSelectTrigger), matching: find.byType(AnimatedContainer)).first,
      );
      final BoxDecoration decoration = box.decoration! as BoxDecoration;
      final Color expected = brightness == Brightness.dark ? scheme.error.withValues(alpha: 0.5) : scheme.error;
      expect(decoration.border!.top.color, expected, reason: brightness.name);
    }
  });

  testWidgets('select: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpSelect(tester, selectWith(value: 'seoul'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
