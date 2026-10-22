import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `context_menu`가 길게 누르기와 보조 클릭으로 열리는지, 길게 누르기가
/// **반드시** 햅틱을 울리는지 확인합니다.
void main() {
  Widget host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: SizedBox(width: 240, height: 160, child: child),
        ),
      ),
    ),
  );

  Widget sample({int Function()? onCopy}) => HoronContextMenu(
    semanticLabel: '항목 메뉴',
    trigger: const ColoredBox(
      color: Colors.transparent,
      child: Center(child: Text('길게 눌러 보세요')),
    ),
    children: <Widget>[
      HoronContextMenuItem(label: '복사', onSelected: () {}),
      const HoronContextMenuSeparator(),
      HoronContextMenuItem(label: '삭제', onSelected: () => onCopy?.call()),
    ],
  );

  /// 테스트에서 플랫폼 채널로 나간 햅틱 호출을 모읍니다.
  List<MethodCall> recordHaptics(WidgetTester tester) {
    final List<MethodCall> calls = <MethodCall>[];
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, (MethodCall call) async {
      if (call.method == 'HapticFeedback.vibrate') calls.add(call);
      return null;
    });
    addTearDown(() => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, null));
    return calls;
  }

  testWidgets('a long press opens the menu and fires a medium haptic', (WidgetTester tester) async {
    final List<MethodCall> haptics = recordHaptics(tester);

    await tester.pumpWidget(host(sample()));
    expect(find.text('복사'), findsNothing);

    await tester.longPressAt(tester.getCenter(find.text('길게 눌러 보세요')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('복사'), findsOneWidget);
    // 계획의 금지 사항: 햅틱 없이 길게 누르기를 넘기지 않는다.
    expect(haptics, hasLength(1));
    expect(haptics.single.arguments, 'HapticFeedbackType.mediumImpact');
  });

  testWidgets('a secondary click opens the menu without a haptic', (WidgetTester tester) async {
    final List<MethodCall> haptics = recordHaptics(tester);

    await tester.pumpWidget(host(sample()));
    final Offset center = tester.getCenter(find.text('길게 눌러 보세요'));

    final TestGesture gesture = await tester.startGesture(
      center,
      kind: PointerDeviceKind.mouse,
      buttons: kSecondaryMouseButton,
    );
    await tester.pump();
    await gesture.up();
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('복사'), findsOneWidget);
    expect(haptics, isEmpty);
  });

  testWidgets('the menu opens at the pressed point, not at the trigger corner', (WidgetTester tester) async {
    await tester.pumpWidget(host(sample()));

    final Rect area = tester.getRect(find.text('길게 눌러 보세요'));
    // 트리거 오른쪽 아래 근처를 누릅니다.
    final Offset press = Offset(area.center.dx + 20, area.center.dy + 10);
    await tester.longPressAt(press);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    final Rect panel = tester.getRect(find.text('복사'));
    // 패널은 누른 지점 아래에서 시작합니다. 트리거 왼쪽 위가 아닙니다.
    expect(panel.top, greaterThan(press.dy));
    expect(panel.left, greaterThanOrEqualTo(press.dx - 1));
  });

  testWidgets('choosing an item calls back and closes the menu', (WidgetTester tester) async {
    int deletes = 0;
    await tester.pumpWidget(host(sample(onCopy: () => deletes++)));

    await tester.longPressAt(tester.getCenter(find.text('길게 눌러 보세요')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    await tester.tap(find.text('삭제'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(deletes, 1);
    expect(find.text('삭제'), findsNothing);
  });

  testWidgets('a disabled context menu never opens', (WidgetTester tester) async {
    final List<MethodCall> haptics = recordHaptics(tester);
    await tester.pumpWidget(
      host(
        HoronContextMenu(
          enabled: false,
          trigger: const Center(child: Text('꺼짐')),
          children: <Widget>[HoronContextMenuItem(label: '복사', onSelected: () {})],
        ),
      ),
    );

    await tester.longPressAt(tester.getCenter(find.text('꺼짐')));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('복사'), findsNothing);
    expect(haptics, isEmpty);
  });

  testWidgets('the panel renders on both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(host(sample(), brightness: brightness));
      await tester.longPressAt(tester.getCenter(find.text('길게 눌러 보세요')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.text('복사'), findsOneWidget);
    }
  });
}
