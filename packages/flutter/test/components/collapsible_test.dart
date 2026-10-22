import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronCollapsible]을 화면 가운데에 띄웁니다.
Future<void> pumpCollapsible(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

/// 트리거 하나와 패널 하나를 가진 묶음입니다.
Widget collapsibleFixture({
  bool? open,
  bool initialOpen = false,
  ValueChanged<bool>? onOpenChanged,
  bool disabled = false,
}) {
  return SizedBox(
    width: 320,
    child: HoronCollapsible(
      open: open,
      initialOpen: initialOpen,
      onOpenChanged: onOpenChanged,
      disabled: disabled,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          const HoronCollapsibleTrigger(label: '고급 설정'),
          const HoronCollapsiblePanel(child: Text('숨겨 둔 항목')),
        ],
      ),
    ),
  );
}

void main() {
  testWidgets('collapsible: the panel starts closed and opens on tap', (WidgetTester tester) async {
    await pumpCollapsible(tester, collapsibleFixture());

    expect(tester.getSize(find.byType(HoronCollapsiblePanel)).height, 0);
    expect(find.text('숨겨 둔 항목'), findsNothing);

    await tester.tap(find.text('고급 설정'));
    await tester.pumpAndSettle();

    expect(tester.getSize(find.byType(HoronCollapsiblePanel)).height, greaterThan(0));
    expect(find.text('숨겨 둔 항목'), findsOneWidget);
  });

  testWidgets('collapsible: the panel animates its height with the token duration and curve', (
    WidgetTester tester,
  ) async {
    await pumpCollapsible(tester, collapsibleFixture());

    final AnimatedSize size = tester.widget<AnimatedSize>(
      find.descendant(of: find.byType(HoronCollapsiblePanel), matching: find.byType(AnimatedSize)),
    );
    // `transition-[height] duration-200 ease-out`
    expect(size.duration, const Duration(milliseconds: HoronDuration.slow));
    expect(size.curve, HoronEasing.out);

    // 한 프레임만 진행하면 아직 다 열리지 않았습니다. 중간 높이가 0과 최종 높이 사이입니다.
    await tester.tap(find.text('고급 설정'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: HoronDuration.slow ~/ 2));
    final double mid = tester.getSize(find.byType(HoronCollapsiblePanel)).height;
    await tester.pumpAndSettle();
    final double end = tester.getSize(find.byType(HoronCollapsiblePanel)).height;

    expect(mid, greaterThan(0));
    expect(mid, lessThan(end));
  });

  testWidgets('collapsible: tapping again closes the panel and reports the state', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await pumpCollapsible(tester, collapsibleFixture(onOpenChanged: changes.add));

    await tester.tap(find.text('고급 설정'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('고급 설정'));
    await tester.pumpAndSettle();

    expect(changes, <bool>[true, false]);
    expect(tester.getSize(find.byType(HoronCollapsiblePanel)).height, 0);
  });

  testWidgets('collapsible: the chevron turns a half turn while open', (WidgetTester tester) async {
    await pumpCollapsible(tester, collapsibleFixture());

    expect(tester.widget<AnimatedRotation>(find.byKey(HoronCollapsibleTrigger.chevronKey)).turns, 0);

    await tester.tap(find.text('고급 설정'));
    await tester.pumpAndSettle();

    final AnimatedRotation rotation = tester.widget<AnimatedRotation>(find.byKey(HoronCollapsibleTrigger.chevronKey));
    expect(rotation.turns, 0.5);
    expect(rotation.duration, const Duration(milliseconds: HoronDuration.slow));
  });

  testWidgets('collapsible: a disabled trigger does not open and reads 50% opacity', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await pumpCollapsible(tester, collapsibleFixture(onOpenChanged: changes.add, disabled: true));

    await tester.tap(find.text('고급 설정'), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(changes, isEmpty, reason: '비활성 트리거가 열렸습니다');
    expect(tester.getSize(find.byType(HoronCollapsiblePanel)).height, 0);
    expect(find.byWidgetPredicate((Widget widget) => widget is Opacity && widget.opacity == 0.5), findsOneWidget);
  });

  testWidgets('collapsible: a controlled collapsible follows the owner', (WidgetTester tester) async {
    await pumpCollapsible(tester, collapsibleFixture(open: false, onOpenChanged: (bool _) {}));

    await tester.tap(find.text('고급 설정'));
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronCollapsiblePanel)).height, 0, reason: '소유자가 값을 바꾸지 않았습니다');

    await pumpCollapsible(tester, collapsibleFixture(open: true, onOpenChanged: (bool _) {}));
    expect(tester.getSize(find.byType(HoronCollapsiblePanel)).height, greaterThan(0));
  });

  testWidgets('collapsible: a panel outside a collapsible stays closed', (WidgetTester tester) async {
    await pumpCollapsible(tester, const SizedBox(width: 320, child: HoronCollapsiblePanel(child: Text('본문'))));

    expect(tester.getSize(find.byType(HoronCollapsiblePanel)).height, 0);
    expect(tester.takeException(), isNull);
  });

  testWidgets('collapsible: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpCollapsible(tester, collapsibleFixture(initialOpen: true), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
