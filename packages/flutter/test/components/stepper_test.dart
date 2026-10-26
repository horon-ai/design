import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronStepper]를 화면 가운데에 띄웁니다.
Future<void> pumpStepper(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

/// 한 단계의 파트를 만듭니다.
Widget step(String value, String title) {
  return HoronStepperItem(
    step: value,
    children: <Widget>[
      HoronStepperTrigger(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const HoronStepperIndicator(),
            const SizedBox(width: HoronSpace.s2_5),
            HoronStepperTitle(text: title),
          ],
        ),
      ),
      const HoronStepperSeparator(),
    ],
  );
}

/// 세 단계 묶음입니다.
Widget stepperFixture({
  String? value,
  String? initialValue,
  ValueChanged<String>? onValueChanged,
  bool vertical = false,
}) {
  return SizedBox(
    width: 420,
    child: HoronStepper(
      value: value,
      initialValue: initialValue,
      onValueChanged: onValueChanged,
      vertical: vertical,
      children: <Widget>[step('account', '계정'), step('address', '주소'), step('payment', '결제')],
    ),
  );
}

/// 인디케이터 표면의 장식을 읽습니다.
BoxDecoration indicatorDecoration(WidgetTester tester, String step) {
  final AnimatedContainer container = tester.widget<AnimatedContainer>(
    find.byKey(HoronStepperIndicator.surfaceKeyFor(step)),
  );
  return container.decoration! as BoxDecoration;
}

void main() {
  testWidgets('stepper: the active step is filled and the passed steps show a check', (WidgetTester tester) async {
    await pumpStepper(tester, stepperFixture(initialValue: 'address'));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronStepper))).colorScheme;

    // 계정: 지나온 단계(`complete`) - 테두리는 primary, 바탕은 card, 체크 표시.
    expect(indicatorDecoration(tester, 'account').border!.top.color, scheme.primary);
    expect(indicatorDecoration(tester, 'account').color, scheme.surfaceContainerLow);
    expect(
      find.descendant(
        of: find.byKey(HoronStepperIndicator.surfaceKeyFor('account')),
        matching: find.byKey(HoronStepperIndicator.checkKey),
      ),
      findsOneWidget,
    );

    // 주소: 지금 단계(`active`) - 바탕과 테두리가 primary, 체크 표시 없음.
    expect(indicatorDecoration(tester, 'address').color, scheme.primary);
    expect(indicatorDecoration(tester, 'address').border!.top.color, scheme.primary);
    expect(
      find.descendant(
        of: find.byKey(HoronStepperIndicator.surfaceKeyFor('address')),
        matching: find.byKey(HoronStepperIndicator.checkKey),
      ),
      findsNothing,
    );

    // 결제: 아직 오지 않은 단계(`inactive`) - 테두리는 border, 바탕은 card, 체크 없음.
    expect(indicatorDecoration(tester, 'payment').border!.top.color, scheme.outline);
    expect(indicatorDecoration(tester, 'payment').color, scheme.surfaceContainerLow);
    expect(
      find.descendant(
        of: find.byKey(HoronStepperIndicator.surfaceKeyFor('payment')),
        matching: find.byKey(HoronStepperIndicator.checkKey),
      ),
      findsNothing,
    );
  });

  testWidgets('stepper: every step is inactive until a value is set', (WidgetTester tester) async {
    await pumpStepper(tester, stepperFixture());

    for (final String value in <String>['account', 'address', 'payment']) {
      expect(
        find.descendant(
          of: find.byKey(HoronStepperIndicator.surfaceKeyFor(value)),
          matching: find.byKey(HoronStepperIndicator.checkKey),
        ),
        findsNothing,
        reason: '$value should not be complete',
      );
    }
  });

  testWidgets('stepper: tapping a trigger moves the active step and reports it', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpStepper(tester, stepperFixture(initialValue: 'account', onValueChanged: changes.add));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronStepper))).colorScheme;

    await tester.tap(find.text('결제'));
    await tester.pumpAndSettle();

    expect(changes, <String>['payment']);
    expect(indicatorDecoration(tester, 'payment').color, scheme.primary);
    expect(indicatorDecoration(tester, 'account').border!.top.color, scheme.primary);
    expect(
      find.descendant(
        of: find.byKey(HoronStepperIndicator.surfaceKeyFor('account')),
        matching: find.byKey(HoronStepperIndicator.checkKey),
      ),
      findsOneWidget,
    );
  });

  testWidgets('stepper: the separator fills with primary up to the active step', (WidgetTester tester) async {
    await pumpStepper(tester, stepperFixture(initialValue: 'address'));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronStepper))).colorScheme;
    final List<HoronStepperSeparator> separators = tester
        .widgetList<HoronStepperSeparator>(find.byType(HoronStepperSeparator))
        .toList();
    expect(separators, hasLength(3));

    Color separatorColor(int index) {
      final Finder line = find
          .descendant(of: find.byType(HoronStepperSeparator).at(index), matching: find.byType(AnimatedContainer))
          .first;
      return (tester.widget<AnimatedContainer>(line).decoration! as BoxDecoration).color!;
    }

    // 계정 다음 구분선은 지나온 단계(`complete`)라 primary로 채워집니다.
    expect(separatorColor(0), scheme.primary);
    // 주소 다음 구분선은 `active`라 아직 비어 있습니다.
    expect(separatorColor(1), scheme.outline);
  });

  testWidgets('stepper: vertical orientation stacks the steps in one column', (WidgetTester tester) async {
    await pumpStepper(tester, stepperFixture(initialValue: 'account', vertical: true));

    final Rect account = tester.getRect(find.text('계정'));
    final Rect address = tester.getRect(find.text('주소'));

    expect(account.center.dx, closeTo(address.center.dx, 0.5));
    expect(account.center.dy, lessThan(address.center.dy));

    // 수직 구분선은 폭 1, 높이 24입니다(`my-1 h-6 w-px`).
    final Size line = tester.getSize(
      find.descendant(of: find.byType(HoronStepperSeparator).first, matching: find.byType(AnimatedContainer)),
    );
    expect(line.width, closeTo(1, 0.01));
    expect(line.height, closeTo(HoronSpace.s6, 0.01));
  });

  testWidgets('stepper: horizontal orientation puts the steps in one row', (WidgetTester tester) async {
    await pumpStepper(tester, stepperFixture(initialValue: 'account'));

    final Rect account = tester.getRect(find.text('계정'));
    final Rect payment = tester.getRect(find.text('결제'));

    expect(account.center.dy, closeTo(payment.center.dy, 0.5));
    expect(account.center.dx, lessThan(payment.center.dx));

    // 수평 구분선은 높이 1입니다(`mx-1 h-px flex-1`).
    final Size line = tester.getSize(
      find.descendant(of: find.byType(HoronStepperSeparator).first, matching: find.byType(AnimatedContainer)),
    );
    expect(line.height, closeTo(1, 0.01));
  });

  testWidgets('stepper: a disabled trigger does not change the active step', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpStepper(
      tester,
      SizedBox(
        width: 420,
        child: HoronStepper(
          initialValue: 'account',
          onValueChanged: changes.add,
          children: <Widget>[
            step('account', '계정'),
            HoronStepperItem(
              step: 'address',
              children: <Widget>[
                HoronStepperTrigger(
                  disabled: true,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const HoronStepperIndicator(),
                      const SizedBox(width: HoronSpace.s2_5),
                      const HoronStepperTitle(text: '주소'),
                    ],
                  ),
                ),
                const HoronStepperSeparator(),
              ],
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.text('주소'), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(changes, isEmpty, reason: '비활성 트리거가 단계를 옮겼습니다');
    expect(find.byWidgetPredicate((Widget widget) => widget is Opacity && widget.opacity == 0.5), findsOneWidget);
  });

  testWidgets('stepper: a trigger outside an item does nothing and does not throw', (WidgetTester tester) async {
    await pumpStepper(tester, const SizedBox(width: 200, child: HoronStepperTrigger(child: Text('바깥 트리거'))));

    await tester.tap(find.text('바깥 트리거'), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
  });

  testWidgets('stepper: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpStepper(tester, stepperFixture(initialValue: 'address'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
