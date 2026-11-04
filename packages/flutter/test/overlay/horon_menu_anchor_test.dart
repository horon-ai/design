import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 공용 메뉴 앵커의 열기·닫기 계약을 확인합니다.
///
/// SDK `RawMenuAnchor`가 맡는 부분(컨트롤러, 바깥 탭, Escape, 조상 스크롤)과
/// [HoronMenuAnchor]가 더하는 부분(패널 탭 리전, 바깥 탭 삼키기)을 나눠 봅니다.
const Key _triggerKey = Key('menu-trigger');
const Key _panelKey = Key('menu-panel');
const Key _backgroundKey = Key('menu-background');

/// 트리거를 (200, 200)에, 패널을 트리거 바로 아래에 두는 화면입니다.
///
/// 배경에는 화면 전체를 덮는 버튼을 깔아, 바깥 탭이 아래까지 내려가는지 봅니다.
Widget _host({
  required MenuController controller,
  required VoidCallback onTrigger,
  required VoidCallback onBackground,
  bool absorbOutsideTaps = false,
}) {
  return MaterialApp(
    home: Scaffold(
      body: Stack(
        children: <Widget>[
          Positioned.fill(
            child: GestureDetector(
              key: _backgroundKey,
              behavior: HitTestBehavior.opaque,
              onTap: onBackground,
              child: const ColoredBox(color: Color(0xFFFFFFFF)),
            ),
          ),
          Positioned(
            left: 200,
            top: 200,
            child: HoronMenuAnchor(
              controller: controller,
              absorbOutsideTaps: absorbOutsideTaps,
              child: GestureDetector(
                key: _triggerKey,
                behavior: HitTestBehavior.opaque,
                onTap: onTrigger,
                child: const SizedBox(width: 120, height: 40, child: Text('열기')),
              ),
              overlayBuilder: (BuildContext context, RawMenuOverlayInfo info) => Align(
                alignment: Alignment.topLeft,
                child: Padding(
                  padding: EdgeInsets.only(left: info.anchorRect.left, top: info.anchorRect.bottom),
                  child: const SizedBox(key: _panelKey, width: 100, height: 50),
                ),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

/// 세로로 긴 내용 위에 트리거를 두는 화면입니다.
Widget _scrollHost({required MenuController controller, required VoidCallback onTrigger}) {
  return MaterialApp(
    home: Scaffold(
      body: SingleChildScrollView(
        child: SizedBox(
          height: 1200,
          child: Stack(
            children: <Widget>[
              Positioned(
                left: 20,
                top: 100,
                child: HoronMenuAnchor(
                  controller: controller,
                  child: GestureDetector(
                    key: _triggerKey,
                    behavior: HitTestBehavior.opaque,
                    onTap: onTrigger,
                    child: const SizedBox(width: 120, height: 40, child: Text('열기')),
                  ),
                  overlayBuilder: (BuildContext context, RawMenuOverlayInfo info) => Align(
                    alignment: Alignment.topLeft,
                    child: Padding(
                      padding: EdgeInsets.only(left: info.anchorRect.left, top: info.anchorRect.bottom),
                      child: const SizedBox(key: _panelKey, width: 100, height: 50),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

void main() {
  testWidgets('the trigger opens and closes through the controller', (WidgetTester tester) async {
    final MenuController controller = MenuController();

    await tester.pumpWidget(
      _host(
        controller: controller,
        onTrigger: () => controller.isOpen ? controller.close() : controller.open(),
        onBackground: () {},
      ),
    );
    expect(find.byKey(_panelKey), findsNothing);

    await tester.tap(find.byKey(_triggerKey));
    await tester.pump();
    expect(controller.isOpen, isTrue);
    expect(find.byKey(_panelKey), findsOneWidget);

    await tester.tap(find.byKey(_triggerKey));
    await tester.pump();
    expect(controller.isOpen, isFalse);
    expect(find.byKey(_panelKey), findsNothing);
  });

  testWidgets('an outside tap closes the menu', (WidgetTester tester) async {
    final MenuController controller = MenuController();

    await tester.pumpWidget(_host(controller: controller, onTrigger: controller.open, onBackground: () {}));
    controller.open();
    await tester.pump();
    expect(find.byKey(_panelKey), findsOneWidget);

    await tester.tapAt(const Offset(700, 500));
    await tester.pump();
    expect(controller.isOpen, isFalse);
    expect(find.byKey(_panelKey), findsNothing);
  });

  testWidgets('escape closes the menu', (WidgetTester tester) async {
    final MenuController controller = MenuController();

    await tester.pumpWidget(_host(controller: controller, onTrigger: controller.open, onBackground: () {}));
    controller.open();
    await tester.pump();
    expect(find.byKey(_panelKey), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pump();
    expect(controller.isOpen, isFalse);
    expect(find.byKey(_panelKey), findsNothing);
  });

  testWidgets('scrolling an ancestor closes the menu', (WidgetTester tester) async {
    final MenuController controller = MenuController();

    await tester.pumpWidget(_scrollHost(controller: controller, onTrigger: controller.open));
    controller.open();
    await tester.pump();
    expect(find.byKey(_panelKey), findsOneWidget);

    // 트리거에서 시작한 드래그는 같은 탭 리전 안이므로 바깥 탭으로 닫히지 않고,
    // 조상 스크롤이 움직이면서 메뉴를 닫습니다.
    await tester.drag(find.byKey(_triggerKey), const Offset(0, -80));
    await tester.pump();
    expect(controller.isOpen, isFalse);
    expect(find.byKey(_panelKey), findsNothing);
  });

  testWidgets('an absorbing anchor swallows the outside tap', (WidgetTester tester) async {
    final MenuController controller = MenuController();
    int backgroundTaps = 0;

    await tester.pumpWidget(
      _host(
        controller: controller,
        onTrigger: controller.open,
        onBackground: () => backgroundTaps++,
        absorbOutsideTaps: true,
      ),
    );
    controller.open();
    await tester.pump();
    expect(find.byKey(_panelKey), findsOneWidget);

    await tester.tapAt(const Offset(700, 500));
    await tester.pump();
    expect(backgroundTaps, 0, reason: 'the absorb layer must keep the tap from reaching the page');
    expect(controller.isOpen, isFalse);
    expect(find.byKey(_panelKey), findsNothing);
  });
}
