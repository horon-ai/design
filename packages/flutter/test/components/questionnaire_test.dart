import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/progress.dart';
import 'package:horon_ui/src/components/questionnaire.dart';

/// 설문 하나를 horon 테마 아래 고정 폭 상자에 띄웁니다.
Future<void> pumpQuestionnaire(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 360,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SizedBox(width: width, child: child),
        ),
      ),
    ),
  );
}

/// 선택지 카드의 표면 장식입니다.
BoxDecoration optionBoxOf(WidgetTester tester, int index) {
  final Finder box = find.byKey(HoronQuestionnaireOption.boxKey);
  expect(box, findsWidgets);
  return tester.widget<DecoratedBox>(box.at(index)).decoration as BoxDecoration;
}

/// 라디오 선택지 하나입니다.
Widget radio(int value, String label) => HoronQuestionnaireOption<int>.radio(value: value, child: Text(label));

void main() {
  testWidgets('questionnaire: the progress header shows the label and a filled bar', (WidgetTester tester) async {
    await pumpQuestionnaire(
      tester,
      const HoronQuestionnaire(children: <Widget>[HoronQuestionnaireProgress(label: '2 / 4', value: 2, max: 4)]),
    );

    expect(find.text('2 / 4'), findsOneWidget);
    expect(find.byType(HoronProgress), findsOneWidget);

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronQuestionnaire))).colorScheme;
    final TextStyle label = tester.widget<Text>(find.text('2 / 4')).style!;
    expect(label.fontSize, HoronText.caption, reason: '`text-xs`');
    expect(label.color, scheme.onSurfaceVariant, reason: '`text-muted-foreground`');
    expect(label.fontFeatures, contains(const FontFeature.tabularFigures()), reason: '`tabular-nums`');
  });

  testWidgets('questionnaire: without a value the progress bar is absent', (WidgetTester tester) async {
    await pumpQuestionnaire(
      tester,
      const HoronQuestionnaire(children: <Widget>[HoronQuestionnaireProgress(label: '준비')]),
    );
    expect(find.text('준비'), findsOneWidget);
    expect(find.byType(HoronProgress), findsNothing, reason: 'React renders Progress only for a number');
  });

  testWidgets('questionnaire: a radio group selects exactly one option', (WidgetTester tester) async {
    int selected = 0;
    await pumpQuestionnaire(
      tester,
      StatefulBuilder(
        builder: (BuildContext context, StateSetter setState) {
          return HoronQuestionnaire(
            children: <Widget>[
              HoronQuestionnaireItem(
                children: <Widget>[
                  const Text('얼마나 만족하십니까?'),
                  HoronQuestionnaireOptions<int>(
                    value: selected,
                    onChanged: (int value) => setState(() => selected = value),
                    children: <Widget>[radio(0, '만족'), radio(1, '보통'), radio(2, '불만족')],
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    // 첫 선택지만 선택되어 있습니다.
    expect(optionBoxOf(tester, 0).color, isNot(optionBoxOf(tester, 1).color));

    await tester.tap(find.text('불만족'));
    await tester.pumpAndSettle();
    expect(selected, 2);

    // 세 선택지의 채움을 세어 보면 하나만 선택 색입니다.
    final Set<Color> fills = <Color>{for (int index = 0; index < 3; index++) optionBoxOf(tester, index).color!};
    expect(fills.length, 2, reason: 'one selected fill plus one unselected fill');
  });

  testWidgets('questionnaire: a selected radio paints the primary fill and a dot', (WidgetTester tester) async {
    await pumpQuestionnaire(
      tester,
      HoronQuestionnaire(
        children: <Widget>[
          HoronQuestionnaireOptions<int>(
            value: 1,
            onChanged: (_) {},
            children: <Widget>[radio(0, '아니오'), radio(1, '예')],
          ),
        ],
      ),
    );

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronQuestionnaire))).colorScheme;
    // `bg-input/20`: `input`(12% ink)에 20%를 곱한 실효 2.4%입니다.
    expect(
      optionBoxOf(tester, 0).color,
      scheme.outline.withValues(alpha: scheme.outline.a * 0.2),
      reason: '`bg-input/20`',
    );
    expect(optionBoxOf(tester, 1).color, scheme.primary.withValues(alpha: 0.1), reason: '`bg-primary/10`');
    expect(
      (optionBoxOf(tester, 1).border! as Border).top.color,
      scheme.primary.withValues(alpha: 0.4),
      reason: '`border-primary/40`',
    );

    // 선택된 표시는 원이고, 그 안에 8px 점이 있습니다.
    final Finder indicator = find.byKey(HoronQuestionnaireOption.indicatorKey);
    expect(indicator, findsNWidgets(2));
    final Container selectedIndicator = tester.widget<Container>(indicator.at(1));
    final BoxDecoration decoration = selectedIndicator.decoration! as BoxDecoration;
    expect(decoration.color, scheme.primary);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, HoronRadius.full, reason: 'radio is a circle');
    expect(
      find.descendant(of: indicator.at(1), matching: find.byType(Container)),
      findsOneWidget,
      reason: 'the selected radio draws its dot',
    );
    expect(
      find.descendant(of: indicator.at(0), matching: find.byType(Container)),
      findsNothing,
      reason: 'the unselected radio draws no dot',
    );
  });

  testWidgets('questionnaire: a checkbox option toggles independently and paints a check', (WidgetTester tester) async {
    bool first = true;
    bool second = false;
    await pumpQuestionnaire(
      tester,
      StatefulBuilder(
        builder: (BuildContext context, StateSetter setState) {
          return HoronQuestionnaire(
            children: <Widget>[
              HoronQuestionnaireOptions<int>(
                children: <Widget>[
                  HoronQuestionnaireOption<int>.checkbox(
                    selected: first,
                    onChanged: (bool value) => setState(() => first = value),
                    child: const Text('알림'),
                  ),
                  HoronQuestionnaireOption<int>.checkbox(
                    selected: second,
                    onChanged: (bool value) => setState(() => second = value),
                    child: const Text('이메일'),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    await tester.tap(find.text('이메일'));
    await tester.pumpAndSettle();
    expect(second, isTrue);
    expect(first, isTrue, reason: 'checkboxes do not clear each other');

    await tester.tap(find.text('알림'));
    await tester.pumpAndSettle();
    expect(first, isFalse);

    // 선택된 체크박스의 표시는 둥근 사각형이고 체크 표시가 들어 있습니다.
    await tester.tap(find.text('이메일'));
    await tester.pumpAndSettle();
    expect(second, isFalse);

    await tester.tap(find.text('알림'));
    await tester.pumpAndSettle();
    expect(first, isTrue);

    final Finder indicator = find.byKey(HoronQuestionnaireOption.indicatorKey);
    final Container selectedIndicator = tester.widget<Container>(indicator.at(0));
    final BoxDecoration decoration = selectedIndicator.decoration! as BoxDecoration;
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, HoronRadius.xs, reason: 'checkbox is `rounded-sm`');
    expect(
      find.descendant(of: indicator.at(0), matching: find.byWidgetPredicate((Widget widget) => widget is CustomPaint)),
      findsOneWidget,
      reason: 'the check mark is painted',
    );
  });

  testWidgets('questionnaire: the option card is 44 tall with a 14 radius and a 16px inset', (
    WidgetTester tester,
  ) async {
    await pumpQuestionnaire(
      tester,
      HoronQuestionnaire(
        children: <Widget>[
          HoronQuestionnaireOptions<int>(value: 0, onChanged: (_) {}, children: <Widget>[radio(0, '선택지')]),
        ],
      ),
    );

    final BoxDecoration decoration = optionBoxOf(tester, 0);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, HoronRadius.lg, reason: '`rounded-lg`');

    final Finder padding = find.ancestor(
      of: find.byKey(HoronQuestionnaireOption.indicatorKey),
      matching: find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding is EdgeInsets),
    );
    final EdgeInsets inset = tester.widget<Padding>(padding.first).padding as EdgeInsets;
    expect(inset.left, HoronSpace.s4, reason: '`px-4`');
    expect(inset.top, HoronSpace.s3, reason: '`py-3`');

    expect(
      tester.getSize(find.byKey(HoronQuestionnaireOption.boxKey).at(0)).height,
      greaterThanOrEqualTo(HoronSpace.s11),
      reason: '`min-h-11`',
    );
  });

  testWidgets('questionnaire: a disabled option is 50% opaque and does not change', (WidgetTester tester) async {
    int calls = 0;
    await pumpQuestionnaire(
      tester,
      HoronQuestionnaire(
        children: <Widget>[
          HoronQuestionnaireOptions<int>(
            value: 0,
            onChanged: (_) => calls++,
            enabled: false,
            children: <Widget>[radio(0, '막힌 선택지'), radio(1, '다른 선택지')],
          ),
        ],
      ),
    );

    final Opacity opacity = tester.widget<Opacity>(
      find.ancestor(of: find.text('막힌 선택지'), matching: find.byType(Opacity)).first,
    );
    expect(opacity.opacity, 0.5, reason: '`has-[:disabled]:opacity-50`');

    await tester.tap(find.text('막힌 선택지'));
    await tester.pumpAndSettle();
    expect(calls, 0, reason: 'a disabled group does not report a selection');
  });

  testWidgets('questionnaire: the question and option groups are 24 and 12 apart', (WidgetTester tester) async {
    await pumpQuestionnaire(
      tester,
      HoronQuestionnaire(
        children: <Widget>[
          const HoronQuestionnaireProgress(label: '1 / 2'),
          HoronQuestionnaireItem(
            children: <Widget>[
              const Text('첫 질문'),
              HoronQuestionnaireOptions<int>(
                value: 0,
                onChanged: (_) {},
                children: <Widget>[radio(0, '가'), radio(1, '나')],
              ),
            ],
          ),
          HoronQuestionnaireItem(children: <Widget>[const Text('둘째 질문')]),
        ],
      ),
    );

    final Rect progress = tester.getRect(find.byType(HoronQuestionnaireProgress));
    final Rect firstItem = tester.getRect(find.byType(HoronQuestionnaireItem).first);
    expect(firstItem.top - progress.bottom, moreOrLessEquals(HoronSpace.s6), reason: '`gap-6`');

    final Rect title = tester.getRect(find.text('첫 질문'));
    final Rect options = tester.getRect(find.byType(HoronQuestionnaireOptions<int>));
    expect(options.top - title.bottom, moreOrLessEquals(HoronSpace.s5), reason: '`gap-5`');

    final Rect first = tester.getRect(find.byKey(HoronQuestionnaireOption.boxKey).at(0));
    final Rect second = tester.getRect(find.byKey(HoronQuestionnaireOption.boxKey).at(1));
    expect(second.top - first.bottom, moreOrLessEquals(HoronSpace.s3), reason: '`gap-3`');
  });

  testWidgets('questionnaire: a radio option outside a group is inert, not an error', (WidgetTester tester) async {
    // 묶음 없이 라디오를 놓으면 선택을 올릴 곳이 없습니다. 예외 대신 아무 일도 하지 않습니다.
    await pumpQuestionnaire(tester, HoronQuestionnaire(children: <Widget>[radio(0, '혼자 있는 선택지')]));
    await tester.tap(find.text('혼자 있는 선택지'));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    expect(optionBoxOf(tester, 0).color, isNotNull);
  });

  testWidgets('questionnaire: both brightnesses render every part', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpQuestionnaire(
        tester,
        HoronQuestionnaire(
          children: <Widget>[
            const HoronQuestionnaireProgress(label: '2 / 3', value: 2, max: 3),
            HoronQuestionnaireItem(
              children: <Widget>[
                const Text('질문'),
                HoronQuestionnaireOptions<int>(
                  value: 0,
                  onChanged: (_) {},
                  children: <Widget>[
                    radio(0, '라디오'),
                    HoronQuestionnaireOption<int>.checkbox(selected: true, onChanged: (_) {}, child: const Text('체크')),
                  ],
                ),
              ],
            ),
          ],
        ),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.byKey(HoronQuestionnaireOption.boxKey), findsNWidgets(2), reason: brightness.name);
    }
  });
}
