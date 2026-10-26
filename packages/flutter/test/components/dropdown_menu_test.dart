import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `dropdown_menu`의 트리거·항목·체크 항목·라디오 항목·서브메뉴를 확인합니다.
void main() {
  Widget host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: Padding(padding: const EdgeInsets.all(24), child: child),
      ),
    ),
  );

  testWidgets('tapping the trigger opens the panel and tapping outside closes it', (WidgetTester tester) async {
    await tester.pumpWidget(
      host(
        HoronDropdownMenu(
          semanticLabel: '보기 메뉴',
          trigger: const HoronDropdownMenuTrigger(label: '보기'),
          children: <Widget>[HoronDropdownMenuItem(label: '확대', onSelected: () {})],
        ),
      ),
    );
    expect(find.text('확대'), findsNothing);

    await tester.tap(find.text('보기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('확대'), findsOneWidget);

    // 패널 바깥(화면 아래쪽)을 누르면 닫힙니다.
    await tester.tapAt(const Offset(400, 580));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('확대'), findsNothing);
  });

  testWidgets('choosing an item calls its callback and closes the menu', (WidgetTester tester) async {
    int chosen = 0;
    await tester.pumpWidget(
      host(
        HoronDropdownMenu(
          trigger: const HoronDropdownMenuTrigger(label: '보기'),
          children: <Widget>[
            HoronDropdownMenuItem(label: '확대', onSelected: () => chosen++),
            const HoronDropdownMenuSeparator(),
            HoronDropdownMenuItem(label: '축소', onSelected: () {}),
          ],
        ),
      ),
    );

    await tester.tap(find.text('보기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    await tester.tap(find.text('확대'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(chosen, 1);
    expect(find.text('확대'), findsNothing);
  });

  testWidgets('a disabled item is not selectable', (WidgetTester tester) async {
    int chosen = 0;
    await tester.pumpWidget(
      host(
        HoronDropdownMenu(
          trigger: const HoronDropdownMenuTrigger(label: '보기'),
          children: <Widget>[HoronDropdownMenuItem(label: '꺼짐', enabled: false, onSelected: () => chosen++)],
        ),
      ),
    );

    await tester.tap(find.text('보기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    await tester.tap(find.text('꺼짐'));
    await tester.pump();
    expect(chosen, 0);
    // 비활성 항목은 메뉴를 닫지도 않습니다.
    expect(find.text('꺼짐'), findsOneWidget);
  });

  testWidgets('a checkbox item toggles and keeps the menu open', (WidgetTester tester) async {
    bool checked = false;
    await tester.pumpWidget(
      StatefulBuilder(
        builder: (BuildContext context, StateSetter setState) => host(
          HoronDropdownMenu(
            trigger: const HoronDropdownMenuTrigger(label: '보기'),
            children: <Widget>[
              HoronDropdownMenuCheckboxItem(
                label: '눈금',
                checked: checked,
                onChanged: (bool value) => setState(() => checked = value),
              ),
            ],
          ),
        ),
      ),
    );

    await tester.tap(find.text('보기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    // 미선택이면 체크 표시가 없습니다.
    expect(find.byType(CustomPaint), findsWidgets);
    await tester.tap(find.text('눈금'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(checked, isTrue);
    // React의 체크 항목과 같이 메뉴가 열린 채로 남습니다.
    expect(find.text('눈금'), findsOneWidget);
  });

  testWidgets('a radio group shows one dot at the selected item', (WidgetTester tester) async {
    String density = 'compact';
    await tester.pumpWidget(
      StatefulBuilder(
        builder: (BuildContext context, StateSetter setState) => host(
          HoronDropdownMenu(
            trigger: const HoronDropdownMenuTrigger(label: '보기'),
            children: <Widget>[
              HoronDropdownMenuRadioGroup<String>(
                value: density,
                onChanged: (String value) => setState(() => density = value),
                children: <Widget>[
                  HoronDropdownMenuRadioItem<String>(value: 'compact', label: '좁게'),
                  HoronDropdownMenuRadioItem<String>(value: 'roomy', label: '넓게'),
                ],
              ),
            ],
          ),
        ),
      ),
    );

    await tester.tap(find.text('보기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(density, 'compact');
    await tester.tap(find.text('넓게'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(density, 'roomy');
    // 라디오 항목은 메뉴를 닫습니다.
    expect(find.text('넓게'), findsNothing);
  });

  testWidgets('a submenu opens beside its item with a second panel', (WidgetTester tester) async {
    await tester.pumpWidget(
      host(
        HoronDropdownMenu(
          trigger: const HoronDropdownMenuTrigger(label: '보기'),
          children: <Widget>[
            HoronDropdownMenuSubmenu(
              label: '정렬 기준',
              children: <Widget>[HoronDropdownMenuItem(label: '이름', onSelected: () {})],
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.text('보기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('정렬 기준'), findsOneWidget);
    expect(find.text('이름'), findsNothing);

    await tester.tap(find.text('정렬 기준'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('이름'), findsOneWidget);
    final Rect parent = tester.getRect(find.text('정렬 기준'));
    final Rect child = tester.getRect(find.text('이름'));
    // 오른쪽에 자리가 있으면 오른쪽으로 열립니다.
    expect(child.left, greaterThan(parent.left));
  });

  testWidgets('the submenu depth stops at two levels', (WidgetTester tester) async {
    expect(horonMenuMaxSubmenuDepth, 2);

    await tester.pumpWidget(
      host(
        HoronDropdownMenu(
          trigger: const HoronDropdownMenuTrigger(label: '보기'),
          children: <Widget>[
            HoronDropdownMenuSubmenu(
              label: '한 단계',
              children: <Widget>[
                HoronDropdownMenuSubmenu(
                  label: '두 단계',
                  children: <Widget>[
                    // 세 번째 단계는 계약 위반입니다.
                    HoronDropdownMenuSubmenu(label: '세 단계', children: <Widget>[]),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );

    await tester.tap(find.text('보기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    await tester.tap(find.text('한 단계'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(tester.takeException(), isStateError);
  });

  testWidgets('the panel renders on both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        host(
          HoronDropdownMenu(
            trigger: const HoronDropdownMenuTrigger(label: '보기'),
            children: <Widget>[HoronDropdownMenuItem(label: '항목', onSelected: () {})],
          ),
          brightness: brightness,
        ),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.text('보기'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));

      expect(find.text('항목'), findsOneWidget, reason: 'brightness=$brightness');

      // 다음 밝기로 넘어가기 전에 닫습니다. 열린 채로 두면 새 테마에서 트리거를
      // 누를 때 토글이 닫기로 동작합니다.
      await tester.tapAt(const Offset(400, 580));
      await tester.pumpAndSettle();
    }
  });
}
