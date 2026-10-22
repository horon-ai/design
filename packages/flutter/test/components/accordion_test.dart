import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronAccordion]을 화면 가운데에 띄웁니다.
Future<void> pumpAccordion(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

/// 항목 셋을 가진 아코디언입니다. 두 번째 항목은 [disableSecond]로 끕니다.
Widget accordionFixture({
  bool multiple = false,
  Set<String>? value,
  Set<String> initialValue = const <String>{},
  ValueChanged<Set<String>>? onValueChanged,
  bool disableSecond = false,
}) {
  return SizedBox(
    width: 320,
    child: HoronAccordion(
      multiple: multiple,
      value: value,
      initialValue: initialValue,
      onValueChanged: onValueChanged,
      children: <Widget>[
        const HoronAccordionItem(value: 'shipping', trigger: '배송', child: Text('이틀 안에 도착합니다')),
        HoronAccordionItem(value: 'returns', trigger: '반품', disabled: disableSecond, child: const Text('30일 안에 반납')),
        const HoronAccordionItem(value: 'payment', trigger: '결제', child: Text('카드와 계좌이체')),
      ],
    ),
  );
}

/// 한 항목의 패널 높이입니다. 닫혀 있으면 0입니다.
double panelHeightOf(WidgetTester tester, String label) {
  final Finder item = find.ancestor(of: find.text(label), matching: find.byType(HoronAccordionItem));
  final Finder panel = find.descendant(of: item, matching: find.byType(HoronAccordionPanel));
  return tester.getSize(panel).height;
}

void main() {
  testWidgets('accordion: every panel starts closed and opens on tap', (WidgetTester tester) async {
    await pumpAccordion(tester, accordionFixture());

    expect(panelHeightOf(tester, '배송'), 0);
    expect(panelHeightOf(tester, '반품'), 0);

    await tester.tap(find.text('배송'));
    await tester.pumpAndSettle();

    expect(panelHeightOf(tester, '배송'), greaterThan(0));
    expect(find.text('이틀 안에 도착합니다'), findsOneWidget);
    expect(panelHeightOf(tester, '반품'), 0);
  });

  testWidgets('accordion: single mode closes the previous panel', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpAccordion(tester, accordionFixture(onValueChanged: changes.add));

    await tester.tap(find.text('배송'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('반품'));
    await tester.pumpAndSettle();

    expect(changes.last, <String>{'returns'});
    expect(panelHeightOf(tester, '배송'), 0, reason: '단일 모드에서 앞 항목이 닫혀야 합니다');
    expect(panelHeightOf(tester, '반품'), greaterThan(0));
  });

  testWidgets('accordion: multiple mode keeps both panels open', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpAccordion(tester, accordionFixture(multiple: true, onValueChanged: changes.add));

    await tester.tap(find.text('배송'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('반품'));
    await tester.pumpAndSettle();

    expect(changes.last, <String>{'shipping', 'returns'});
    expect(panelHeightOf(tester, '배송'), greaterThan(0));
    expect(panelHeightOf(tester, '반품'), greaterThan(0));
  });

  testWidgets('accordion: a disabled item never expands and reads 50% opacity', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpAccordion(tester, accordionFixture(onValueChanged: changes.add, disableSecond: true));

    await tester.tap(find.text('반품'), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(changes, isEmpty, reason: '비활성 항목이 열렸습니다');
    expect(panelHeightOf(tester, '반품'), 0);
    expect(find.byWidgetPredicate((Widget widget) => widget is Opacity && widget.opacity == 0.5), findsOneWidget);
  });

  testWidgets('accordion: the chevron rotates a half turn while the panel opens', (WidgetTester tester) async {
    await pumpAccordion(tester, accordionFixture());

    final Finder chevron = find.descendant(
      of: find.ancestor(of: find.text('배송'), matching: find.byType(HoronAccordionTrigger)),
      matching: find.byType(AnimatedRotation),
    );
    expect(tester.widget<AnimatedRotation>(chevron).turns, 0);
    // `transition-transform duration-200` - 토큰의 200ms를 씁니다.
    expect(tester.widget<AnimatedRotation>(chevron).duration, const Duration(milliseconds: HoronDuration.slow));

    await tester.tap(find.text('배송'));
    await tester.pumpAndSettle();

    expect(tester.widget<AnimatedRotation>(chevron).turns, 0.5);
  });

  testWidgets('accordion: an open panel closes on a second tap', (WidgetTester tester) async {
    await pumpAccordion(tester, accordionFixture(initialValue: <String>{'payment'}));
    expect(panelHeightOf(tester, '결제'), greaterThan(0));

    await tester.tap(find.text('결제'));
    await tester.pumpAndSettle();

    expect(panelHeightOf(tester, '결제'), 0);
  });

  testWidgets('accordion: a controlled accordion follows the owner', (WidgetTester tester) async {
    await pumpAccordion(tester, accordionFixture(value: <String>{}, onValueChanged: (Set<String> _) {}));

    await tester.tap(find.text('배송'));
    await tester.pumpAndSettle();
    expect(panelHeightOf(tester, '배송'), 0, reason: '소유자가 값을 바꾸지 않았습니다');

    await pumpAccordion(tester, accordionFixture(value: <String>{'shipping'}, onValueChanged: (Set<String> _) {}));
    expect(panelHeightOf(tester, '배송'), greaterThan(0));
  });

  testWidgets('accordion: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpAccordion(
        tester,
        accordionFixture(initialValue: <String>{'shipping'}, disableSecond: true),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
