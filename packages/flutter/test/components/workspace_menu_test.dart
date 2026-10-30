import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

const Key _triggerKey = Key('workspace-trigger');

Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 400}) => MaterialApp(
  theme: horonTheme(brightness),
  // 팝업 폭은 화면 폭을 기준으로 줄어들므로 테스트에서 화면 폭을 직접 정합니다.
  builder: (BuildContext context, Widget? home) => MediaQuery(
    data: MediaQuery.of(context).copyWith(size: Size(width, 700)),
    child: home!,
  ),
  home: Scaffold(
    body: Center(
      child: SizedBox(
        width: width < 400 ? width : 400,
        height: 500,
        child: Align(alignment: Alignment.topCenter, child: child),
      ),
    ),
  ),
);

const List<HoronWorkspaceMenuItem> _workspaces = <HoronWorkspaceMenuItem>[
  HoronWorkspaceMenuItem(id: 'horon', name: 'Horon team', meta: '12 members', initial: 'H'),
  HoronWorkspaceMenuItem(id: 'paper', name: 'Paper workspace', meta: '4 members'),
  HoronWorkspaceMenuItem(id: 'studio', name: 'Studio', meta: 'Only you'),
];

Widget _trigger() => const SizedBox(
  key: _triggerKey,
  width: 200,
  height: 40,
  child: Center(child: Text('Horon team')),
);

Widget _menu({
  String value = 'horon',
  ValueChanged<String>? onValueChange,
  VoidCallback? onCreate,
  VoidCallback? onSettings,
}) => HoronWorkspaceMenu(
  workspaces: _workspaces,
  value: value,
  trigger: _trigger(),
  onValueChange: onValueChange,
  onCreate: onCreate,
  onSettings: onSettings,
);

/// 팝업의 실제 상자입니다(오버레이 상자는 화면 크기라 폭을 잴 수 없습니다).
Finder _clipInside() => find.descendant(of: find.byType(HoronMenuContent), matching: find.byType(ClipRRect)).first;

void main() {
  testWidgets('a closed workspace menu renders its trigger in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_menu(), brightness: brightness));
      expect(tester.takeException(), isNull);
      expect(find.byKey(_triggerKey), findsOneWidget);
      expect(find.byType(HoronMenuContent), findsNothing);
    }
  });

  testWidgets('opening lists the workspaces with the current check and the two actions', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_menu()));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(_triggerKey));
    await tester.pumpAndSettle();

    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronMenuContent)));
    expect(tester.takeException(), isNull);
    expect(find.text('Workspaces'), findsOneWidget, reason: '기본 묶음 제목입니다');
    expect(find.text('Paper workspace'), findsOneWidget);
    expect(find.text('Studio'), findsOneWidget);
    expect(find.text('New workspace'), findsOneWidget);
    expect(find.text('Workspace settings'), findsOneWidget);
    expect(find.byIcon(Icons.check), findsOneWidget, reason: '현재 워크스페이스에만 체크가 붙습니다');
    expect(find.text('4 members'), findsOneWidget, reason: 'meta는 설명 줄입니다');
    expect(find.text('P'), findsOneWidget, reason: '이니셜이 없으면 이름의 첫 글자를 씁니다');

    // 단색 표면과 `sideOffset={7}`입니다.
    expect(tester.getSize(_clipInside()).width, 256, reason: 'solid w-64');
    final double gap = tester.getTopLeft(_clipInside()).dy - tester.getBottomLeft(find.byKey(_triggerKey)).dy;
    expect(gap, 7, reason: 'sideOffset={7}');

    final Finder current = find
        .ancestor(of: find.text('Horon team').last, matching: find.byType(AnimatedContainer))
        .first;
    expect(
      (tester.widget<AnimatedContainer>(current).decoration! as BoxDecoration).color,
      theme.colors.overlayInk6,
      reason: '현재 행은 bg-overlay-ink-6입니다',
    );
  });

  testWidgets('choosing another workspace reports the id and closes the menu', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_menu(onValueChange: changes.add)));
    await tester.tap(find.byKey(_triggerKey));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Paper workspace'));
    await tester.pumpAndSettle();
    expect(changes, <String>['paper']);
    expect(find.byType(HoronMenuContent), findsNothing);
  });

  testWidgets('the create and settings rows call their callbacks', (WidgetTester tester) async {
    int creates = 0;
    int settings = 0;
    await tester.pumpWidget(_host(_menu(onCreate: () => creates += 1, onSettings: () => settings += 1)));
    await tester.tap(find.byKey(_triggerKey));
    await tester.pumpAndSettle();

    await tester.tap(find.text('New workspace'));
    await tester.pumpAndSettle();
    expect(creates, 1);

    await tester.tap(find.byKey(_triggerKey));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Workspace settings'));
    await tester.pumpAndSettle();
    expect(settings, 1);
  });

  testWidgets('the menu shrinks on a phone width', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_menu(), width: 240));
    await tester.tap(find.byKey(_triggerKey));
    await tester.pumpAndSettle();

    expect(tester.getSize(_clipInside()).width, 208, reason: '240에서 좌우 16px을 남깁니다');
    expect(tester.takeException(), isNull);
  });
}
