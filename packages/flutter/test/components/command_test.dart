import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show LogicalKeyboardKey;
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 명령 목록이 검색어로 좁혀지는지 확인합니다.
///
/// 계획이 이름으로 지정한 단언이 첫 테스트입니다: 검색어를 넣으면 목록이
/// 좁혀져야 합니다. 그 밖에 빈 상태, 그룹 제목 감춤, 선택 콜백, 시트 열기,
/// 하드웨어 키보드 열기를 확인합니다.
void main() {
  const List<String> allLabels = <String>['새 파일', '파일 열기', '설정 열기', '로그아웃'];

  /// 세 그룹으로 나눈 명령 목록을 화면 가운데에 띄웁니다.
  Widget host({
    HoronCommandController? controller,
    ValueChanged<String>? onQueryChanged,
    List<String> selected = const <String>[],
    Brightness brightness = Brightness.light,
  }) {
    return MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(
          child: SizedBox(
            width: 400,
            child: HoronCommand(
              controller: controller,
              onQueryChanged: onQueryChanged,
              children: <Widget>[
                const HoronCommandInput(hintText: '명령을 찾습니다'),
                HoronCommandList(
                  children: <Widget>[
                    const HoronCommandEmpty(),
                    HoronCommandGroup(
                      label: '파일',
                      children: <Widget>[
                        HoronCommandItem(value: '새 파일', onSelected: () => selected.add('새 파일')),
                        HoronCommandItem(value: '파일 열기', onSelected: () => selected.add('파일 열기')),
                      ],
                    ),
                    const HoronCommandSeparator(),
                    HoronCommandGroup(
                      label: '앱',
                      children: <Widget>[
                        HoronCommandItem(
                          value: '설정 열기',
                          keywords: const <String>['settings'],
                          onSelected: () => selected.add('설정 열기'),
                          trailing: const HoronCommandShortcut(label: '⌘,'),
                        ),
                        HoronCommandItem(value: '로그아웃', onSelected: () => selected.add('로그아웃')),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> type(WidgetTester tester, String text) async {
    await tester.enterText(find.byType(TextField), text);
    await tester.pumpAndSettle();
  }

  testWidgets('command: typing a query narrows the list', (WidgetTester tester) async {
    await tester.pumpWidget(host());
    for (final String label in allLabels) {
      expect(find.text(label), findsOneWidget, reason: label);
    }

    await type(tester, '파일');

    // "파일"이 든 두 항목만 남고, 나머지 둘은 사라집니다.
    expect(find.text('새 파일'), findsOneWidget);
    expect(find.text('파일 열기'), findsOneWidget);
    expect(find.text('설정 열기'), findsNothing);
    expect(find.text('로그아웃'), findsNothing);

    // 더 좁히면 하나만 남습니다.
    await type(tester, '열기');
    expect(find.text('새 파일'), findsNothing);
    expect(find.text('파일 열기'), findsOneWidget);
    expect(find.text('설정 열기'), findsOneWidget);
    expect(find.text('로그아웃'), findsNothing);
  });

  testWidgets('command: a query with no match shows the empty state', (WidgetTester tester) async {
    await tester.pumpWidget(host());
    // 결과가 있을 때는 빈 상태가 없습니다.
    expect(find.text(HoronTheme.of(tester.element(find.byType(HoronCommand))).strings.noResults), findsNothing);

    await type(tester, '없는명령');
    expect(find.byType(HoronCommandEmpty), findsOneWidget);
    expect(find.text(HoronTheme.of(tester.element(find.byType(HoronCommand))).strings.noResults), findsOneWidget);
    for (final String label in allLabels) {
      expect(find.text(label), findsNothing, reason: label);
    }

    // 지우면 다시 나옵니다.
    await type(tester, '');
    for (final String label in allLabels) {
      expect(find.text(label), findsOneWidget, reason: label);
    }
  });

  testWidgets('command: a group with no matching item hides its heading', (WidgetTester tester) async {
    await tester.pumpWidget(host());
    expect(find.text('파일'), findsOneWidget);
    expect(find.text('앱'), findsOneWidget);

    await type(tester, '로그아웃');
    // "파일" 그룹은 통째로 사라지고 "앱" 그룹만 남습니다. 검색어 자체도 입력
    // 상자에 글자로 들어 있으므로, 항목은 위젯으로 찾습니다.
    expect(find.text('파일'), findsNothing);
    expect(find.text('앱'), findsOneWidget);
    expect(find.widgetWithText(HoronCommandItem, '로그아웃'), findsOneWidget);
  });

  testWidgets('command: keywords match, so an English word finds a Korean item', (WidgetTester tester) async {
    await tester.pumpWidget(host());

    await type(tester, 'settings');
    expect(find.text('설정 열기'), findsOneWidget);
    expect(find.text('로그아웃'), findsNothing);
  });

  testWidgets('command: the query is split on spaces and every word must match', (WidgetTester tester) async {
    await tester.pumpWidget(host());

    await type(tester, '열기 파');
    expect(find.text('파일 열기'), findsOneWidget);
    expect(find.text('설정 열기'), findsNothing);
  });

  testWidgets('command: tapping an item calls its callback', (WidgetTester tester) async {
    final List<String> selected = <String>[];
    await tester.pumpWidget(host(selected: selected));

    await tester.tap(find.text('설정 열기'));
    await tester.pumpAndSettle();
    expect(selected, <String>['설정 열기']);
  });

  testWidgets('command: a disabled item is dimmed and does not call back', (WidgetTester tester) async {
    bool tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: HoronCommand(
            children: <Widget>[
              HoronCommandList(
                children: <Widget>[HoronCommandItem(value: '꺼짐', enabled: false, onSelected: () => tapped = true)],
              ),
            ],
          ),
        ),
      ),
    );

    await tester.tap(find.text('꺼짐'));
    await tester.pumpAndSettle();
    expect(tapped, isFalse);

    // `data-[disabled=true]:opacity-50`
    final Opacity opacity = tester.widget<Opacity>(
      find.ancestor(of: find.text('꺼짐'), matching: find.byType(Opacity)).first,
    );
    expect(opacity.opacity, 0.5);
  });

  testWidgets('command: the shortcut slot sits at the trailing edge', (WidgetTester tester) async {
    await tester.pumpWidget(host());

    final Rect item = tester.getRect(find.ancestor(of: find.text('설정 열기'), matching: find.byType(HoronCommandItem)));
    final Rect shortcut = tester.getRect(find.text('⌘,'));
    expect(shortcut.left, greaterThan(tester.getRect(find.text('설정 열기')).right));
    expect(item.right - shortcut.right, lessThanOrEqualTo(HoronSpace.s2 + 0.01));
  });

  testWidgets('command: the list caps its height at 300', (WidgetTester tester) async {
    await tester.pumpWidget(host());

    final Size list = tester.getSize(find.byType(HoronCommandList));
    expect(list.height, lessThanOrEqualTo(300));
  });

  testWidgets('command: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(host(brightness: brightness));
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.byType(HoronCommand), findsOneWidget, reason: brightness.name);
    }
  });

  testWidgets('command: the dialog opens a sheet from its trigger', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(800, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Center(
            child: HoronCommandDialog(
              semanticLabel: '명령',
              trigger: const SizedBox(key: Key('command-trigger'), width: 120, height: 40),
              builder: (BuildContext context) => HoronCommand(
                children: <Widget>[
                  const HoronCommandInput(hintText: '명령을 찾습니다'),
                  HoronCommandList(
                    children: <Widget>[
                      const HoronCommandEmpty(),
                      HoronCommandGroup(
                        label: '파일',
                        children: <Widget>[HoronCommandItem(value: '새 파일', onSelected: () {})],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    expect(find.text('새 파일'), findsNothing);
    await tester.tap(find.byKey(const Key('command-trigger')), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(find.text('새 파일'), findsOneWidget);

    // 시트는 화면 아래쪽에 붙습니다.
    final Rect sheet = tester.getRect(find.byType(HoronCommand));
    expect(sheet.center.dy, greaterThan(450));

    // 시트 안에서도 검색이 좁힙니다.
    await tester.enterText(find.byType(TextField), '없는명령');
    await tester.pumpAndSettle();
    expect(find.text('새 파일'), findsNothing);
  });

  testWidgets('command: a hardware shortcut opens the sheet', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(800, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Center(
            child: HoronCommandDialog(
              shortcut: const SingleActivator(LogicalKeyboardKey.keyK, meta: true),
              trigger: const SizedBox(width: 120, height: 40),
              builder: (BuildContext context) => HoronCommand(
                children: <Widget>[
                  HoronCommandList(
                    children: <Widget>[HoronCommandItem(value: '새 파일', onSelected: () {})],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    expect(find.text('새 파일'), findsNothing);
    await tester.sendKeyDownEvent(LogicalKeyboardKey.meta);
    await tester.sendKeyEvent(LogicalKeyboardKey.keyK);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.meta);
    await tester.pumpAndSettle();
    expect(find.text('새 파일'), findsOneWidget);
  });

  testWidgets('command: a dialog without a shortcut ignores the key', (WidgetTester tester) async {
    tester.view.physicalSize = const Size(800, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Center(
            child: HoronCommandDialog(
              trigger: const SizedBox(width: 120, height: 40),
              builder: (BuildContext context) => HoronCommand(
                children: <Widget>[
                  HoronCommandList(
                    children: <Widget>[HoronCommandItem(value: '새 파일', onSelected: () {})],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );

    await tester.sendKeyDownEvent(LogicalKeyboardKey.meta);
    await tester.sendKeyEvent(LogicalKeyboardKey.keyK);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.meta);
    await tester.pumpAndSettle();
    expect(find.text('새 파일'), findsNothing);
  });

  testWidgets('command: initialQuery narrows the list and shows in the input', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: HoronCommand(
            initialQuery: '파일',
            children: <Widget>[
              const HoronCommandInput(hintText: '명령을 찾습니다'),
              HoronCommandList(
                children: <Widget>[
                  HoronCommandGroup(
                    label: '파일',
                    children: <Widget>[HoronCommandItem(value: '새 파일', onSelected: () {})],
                  ),
                  HoronCommandGroup(
                    label: '앱',
                    children: <Widget>[HoronCommandItem(value: '로그아웃', onSelected: () {})],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // 목록은 좁혀지고, 그 검색어가 입력 상자에도 보입니다.
    expect(find.widgetWithText(HoronCommandItem, '새 파일'), findsOneWidget);
    expect(find.text('로그아웃'), findsNothing);
    expect(tester.widget<TextField>(find.byType(TextField)).controller!.text, '파일');
  });

  testWidgets('command: onQueryChanged reports the typed text', (WidgetTester tester) async {
    final List<String> queries = <String>[];
    await tester.pumpWidget(host(onQueryChanged: queries.add));

    await type(tester, '파일');
    expect(queries, <String>['파일']);
  });

  testWidgets('command: an external controller drives the query', (WidgetTester tester) async {
    final HoronCommandController controller = HoronCommandController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(host(controller: controller));
    for (final String label in allLabels) {
      expect(find.text(label), findsOneWidget, reason: label);
    }

    controller.query = '로그아웃';
    await tester.pumpAndSettle();
    // 검색어가 입력 상자에도 반영되므로, 항목은 위젯으로 찾습니다.
    expect(find.widgetWithText(HoronCommandItem, '로그아웃'), findsOneWidget);
    expect(find.text('새 파일'), findsNothing);
    expect(controller.query, '로그아웃');
    expect(tester.widget<TextField>(find.byType(TextField)).controller!.text, '로그아웃');
  });
}
