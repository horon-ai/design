import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/list.dart';
import 'package:horon_ui/src/components/separator.dart';

/// [HoronList]를 horon 테마 아래에 띄웁니다.
Future<void> pumpList(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 360,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(
          child: SizedBox(width: width, child: child),
        ),
      ),
    ),
  );
}

/// 목록의 행 하나입니다.
Widget row(String title, {String? description, bool interactive = false, VoidCallback? onTap}) {
  return HoronListItem(
    interactive: interactive,
    onTap: onTap,
    children: <Widget>[
      HoronListItemMedia(child: Icon(Icons.inbox)),
      HoronListItemContent(
        children: <Widget>[
          HoronListItemTitle(text: title),
          if (description != null) HoronListItemDescription(text: description),
        ],
      ),
    ],
  );
}

/// 목록 표면이 칠한 `BoxDecoration`입니다.
BoxDecoration surfaceOf(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find.descendant(of: find.byType(HoronList), matching: find.byType(DecoratedBox)).first,
  );
  return box.decoration as BoxDecoration;
}

void main() {
  testWidgets('list: the surface uses the card role radius and the card colour', (WidgetTester tester) async {
    await pumpList(tester, HoronList(children: <Widget>[row('받은 편지함')]));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronList))).colorScheme;
    final BoxDecoration surface = surfaceOf(tester);
    final BorderRadius radius = surface.borderRadius! as BorderRadius;

    expect(radius.topLeft.x, closeTo(HoronRadiusRole.card, 0.01));
    expect(radius.bottomRight.x, closeTo(HoronRadiusRole.card, 0.01));
    expect(surface.color, scheme.surfaceContainerLow);
    expect(surface.border!.top.color, scheme.outline);
  });

  testWidgets('list: divided draws a divider between rows only', (WidgetTester tester) async {
    await pumpList(tester, HoronList(children: <Widget>[row('첫째'), row('둘째'), row('셋째')]));
    // 행이 셋이면 그 사이에 구분선이 둘입니다.
    expect(find.byType(HoronSeparator), findsNWidgets(2));

    await pumpList(tester, HoronList(divided: false, children: <Widget>[row('첫째'), row('둘째'), row('셋째')]));
    expect(find.byType(HoronSeparator), findsNothing);
  });

  testWidgets('list: bordered can be turned off', (WidgetTester tester) async {
    await pumpList(tester, HoronList(bordered: false, children: <Widget>[row('받은 편지함')]));
    expect(surfaceOf(tester).border, isNull);
  });

  testWidgets('list: an interactive row calls onTap', (WidgetTester tester) async {
    int taps = 0;
    await pumpList(tester, HoronList(children: <Widget>[row('받은 편지함', interactive: true, onTap: () => taps++)]));

    await tester.tap(find.text('받은 편지함'));
    await tester.pumpAndSettle();

    expect(taps, 1, reason: 'interactive rows must be tappable');
  });

  testWidgets('list: a row with no onTap is not tappable', (WidgetTester tester) async {
    await pumpList(tester, HoronList(children: <Widget>[row('받은 편지함')]));

    // 누를 동작이 없으면 GestureDetector도, button 의미 정보도 없습니다.
    expect(find.descendant(of: find.byType(HoronListItem), matching: find.byType(GestureDetector)), findsNothing);
  });

  testWidgets('list: the media slot is 36 square with the lg radius', (WidgetTester tester) async {
    await pumpList(tester, HoronList(children: <Widget>[row('받은 편지함')]));

    final Rect media = tester.getRect(find.byType(HoronListItemMedia));
    expect(media.width, HoronSpace.s9);
    expect(media.height, HoronSpace.s9);

    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronListItemMedia), matching: find.byType(DecoratedBox)).first,
    );
    final BorderRadius radius = (box.decoration as BoxDecoration).borderRadius! as BorderRadius;
    expect(radius.topLeft.x, closeTo(HoronRadius.lg, 0.01));
  });

  testWidgets('list: a long title truncates instead of overflowing', (WidgetTester tester) async {
    await pumpList(
      tester,
      HoronList(
        children: <Widget>[
          row('아주 길어서 한 줄에 다 들어가지 않는 목록 행의 제목입니다 계속 이어집니다', description: '설명도 한 줄로 잘립니다 아주 길게 적어 둡니다 그래야 말줄임이 보입니다'),
        ],
      ),
      width: 240,
    );

    expect(tester.takeException(), isNull);
    final Text title = tester.widget<Text>(find.textContaining('아주 길어서'));
    expect(title.maxLines, 1);
    expect(title.overflow, TextOverflow.ellipsis);
  });

  testWidgets('list: a section draws its label and its own dividers', (WidgetTester tester) async {
    await pumpList(
      tester,
      HoronList(
        children: <Widget>[
          HoronListSection(label: '오늘', children: <Widget>[row('첫째'), row('둘째')]),
        ],
      ),
    );

    expect(find.text('오늘'), findsOneWidget);
    // 목록 자체는 행이 하나라 구분선이 없고, 섹션 안에서 하나가 그려집니다.
    expect(find.byType(HoronSeparator), findsOneWidget);
  });

  testWidgets('list: both brightnesses render every part', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpList(
        tester,
        HoronList(
          children: <Widget>[
            row('받은 편지함', description: '읽지 않은 메시지 3개', interactive: true, onTap: () {}),
            HoronListSection(label: '보관함', children: <Widget>[row('보관된 메시지')]),
          ],
        ),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('list: a row with neither child nor children asserts', (WidgetTester tester) async {
    expect(() => HoronListItem(), throwsA(isA<AssertionError>()));
    expect(() => HoronListItemTitle(), throwsA(isA<AssertionError>()));
    expect(() => HoronListItemDescription(), throwsA(isA<AssertionError>()));
  });
}
