import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// 사이드바를 정해진 높이의 `Row` 안에 띄웁니다.
///
/// `h-full`이므로 부모가 높이를 정해야 합니다. 높이가 무한하면 안쪽 `Column`이
/// 설 자리가 없습니다.
Future<void> pumpSidebar(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: SizedBox(height: 480, child: Row(children: <Widget>[child])),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

/// 머리말·본문·꼬리말을 갖춘 사이드바입니다.
Widget sidebarFixture({bool? open, ValueChanged<bool>? onOpenChanged, bool firstActive = true}) {
  return HoronSidebar(
    open: open,
    onOpenChanged: onOpenChanged,
    children: <Widget>[
      HoronSidebarHeader(
        children: <Widget>[
          HoronSidebarTrigger(semanticLabel: 'Toggle sidebar'),
          const Text('Horon'),
        ],
      ),
      HoronSidebarContent(
        children: <Widget>[
          HoronSidebarGroup(
            children: <Widget>[
              HoronSidebarMenuItem(
                child: HoronSidebarMenuButton(
                  label: 'Inbox',
                  icon: const Icon(Icons.inbox),
                  active: firstActive,
                  onPressed: () {},
                ),
              ),
              HoronSidebarMenuItem(
                child: HoronSidebarMenuButton(label: 'Settings', icon: const Icon(Icons.settings), onPressed: () {}),
              ),
            ],
          ),
        ],
      ),
      HoronSidebarFooter(
        children: <Widget>[HoronSidebarMenuButton(label: 'Sign out', onPressed: () {})],
      ),
    ],
  );
}

/// 사이드바 표면을 찾는 페인터입니다. 폭을 재려고 위젯 자체의 크기를 씁니다.

void main() {
  testWidgets('sidebar: expanded is 256 and collapsed is 56 logical pixels', (WidgetTester tester) async {
    // React `w-64`(16rem = 256)와 `w-14`(3.5rem = 56)를 토큰에서 읽습니다.
    expect(HoronSidebar.expandedWidth, 256);
    expect(HoronSidebar.collapsedWidth, 56);
    expect(HoronSidebar.expandedWidth, HoronSidebarMetrics.expanded);
    expect(HoronSidebar.collapsedWidth, HoronSidebarMetrics.collapsed);

    await pumpSidebar(tester, sidebarFixture());
    expect(tester.getSize(find.byType(HoronSidebar)).width, 256);

    await tester.tap(find.byType(HoronSidebarTrigger));
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 56);

    await tester.tap(find.byType(HoronSidebarTrigger));
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 256);
  });

  testWidgets('sidebar: the width animation uses the token duration and easing', (WidgetTester tester) async {
    await pumpSidebar(tester, sidebarFixture());

    final AnimatedContainer container = tester.widget<AnimatedContainer>(
      find.descendant(of: find.byType(HoronSidebar), matching: find.byType(AnimatedContainer)).first,
    );
    // `transition-[width] duration-200 ease-out`
    expect(container.duration, const Duration(milliseconds: HoronDuration.slow));
    expect(container.curve, HoronEasing.out);
  });

  testWidgets('sidebar: collapsing hides the menu labels and keeps the icons', (WidgetTester tester) async {
    await pumpSidebar(tester, sidebarFixture());

    expect(find.text('Inbox'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);

    await tester.tap(find.byType(HoronSidebarTrigger));
    await tester.pumpAndSettle();

    expect(find.text('Inbox'), findsNothing, reason: '접힌 사이드바는 라벨을 감춥니다');
    expect(find.text('Settings'), findsNothing);
    expect(find.byIcon(Icons.inbox), findsOneWidget, reason: '아이콘은 남아야 합니다');
  });

  testWidgets('sidebar: the active menu button fills with the sidebar accent token', (WidgetTester tester) async {
    await pumpSidebar(tester, sidebarFixture());

    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronSidebar)));
    final Finder active = find.ancestor(of: find.text('Inbox'), matching: find.byType(HoronSidebarMenuButton));
    final Finder idle = find.ancestor(of: find.text('Settings'), matching: find.byType(HoronSidebarMenuButton));

    Color surfaceOf(Finder button) {
      final DecoratedBox box = tester.widget<DecoratedBox>(
        find
            .descendant(
              of: button,
              matching: find.byWidgetPredicate(
                (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
              ),
            )
            .first,
      );
      return (box.decoration as BoxDecoration).color!;
    }

    expect(surfaceOf(active), horon.sidebarPrimary);
    expect(surfaceOf(idle), Colors.transparent);
    expect(horon.sidebarPrimary, HoronLightColors.sidebarPrimary);

    // 활성 항목의 글자는 `sidebar-primary-foreground`입니다.
    final Text activeLabel = tester.widget<Text>(find.text('Inbox'));
    expect(activeLabel.style!.color, horon.sidebarPrimaryForeground);
  });

  testWidgets('sidebar: the surface and border read the sidebar slots in both brightnesses', (
    WidgetTester tester,
  ) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpSidebar(tester, sidebarFixture(), brightness: brightness);
      final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronSidebar)));

      final AnimatedContainer container = tester.widget<AnimatedContainer>(
        find.descendant(of: find.byType(HoronSidebar), matching: find.byType(AnimatedContainer)).first,
      );
      final BoxDecoration decoration = container.decoration! as BoxDecoration;

      expect(decoration.color, horon.sidebar, reason: brightness.name);
      expect((decoration.border! as Border).right.color, horon.sidebarBorder, reason: brightness.name);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('sidebar: a controlled sidebar follows the owner', (WidgetTester tester) async {
    await pumpSidebar(tester, sidebarFixture(open: false, onOpenChanged: (bool _) {}));

    expect(tester.getSize(find.byType(HoronSidebar)).width, 56);

    await tester.tap(find.byType(HoronSidebarTrigger), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 56, reason: '소유자가 값을 바꾸지 않았습니다');

    await pumpSidebar(tester, sidebarFixture(open: true, onOpenChanged: (bool _) {}));
    expect(tester.getSize(find.byType(HoronSidebar)).width, 256);
  });

  testWidgets('sidebar: a trigger outside a sidebar is disabled and does nothing', (WidgetTester tester) async {
    await pumpSidebar(tester, HoronSidebarTrigger(semanticLabel: 'Toggle sidebar'));

    await tester.tap(find.byType(HoronSidebarTrigger), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(find.byType(HoronSidebar), findsNothing);
  });

  testWidgets('sidebar: the inset takes the remaining width', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: SizedBox(
            height: 480,
            child: Row(
              children: <Widget>[
                sidebarFixture(),
                HoronSidebarInset(child: Text('본문')),
              ],
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final Size inset = tester.getSize(find.byType(HoronSidebarInset));
    expect(inset.width, closeTo(800 - 256, 0.5));
    expect(tester.getSize(find.byType(HoronSidebar)).width, 256);
  });
}
