import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/table.dart';

/// [HoronTable]을 horon 테마 아래에 띄웁니다.
Future<void> pumpTable(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 480,
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

/// 머리 한 줄과 본문 두 줄, 꼬리 한 줄을 가진 표입니다.
Widget table({bool withCaption = false, bool withFooter = false}) {
  return HoronTable(
    children: <Widget>[
      HoronTableHeader(
        children: <Widget>[
          HoronTableRow(
            children: <Widget>[
              HoronTableHead(text: '이름'),
              HoronTableHead(text: '금액'),
            ],
          ),
        ],
      ),
      HoronTableBody(
        children: <Widget>[
          HoronTableRow(
            children: <Widget>[
              HoronTableCell(text: '김민열'),
              HoronTableCell(text: '29,000원'),
            ],
          ),
          HoronTableRow(
            children: <Widget>[
              HoronTableCell(text: '박서준'),
              HoronTableCell(text: '12,000원'),
            ],
          ),
        ],
      ),
      if (withFooter)
        HoronTableFooter(
          children: <Widget>[
            HoronTableRow(
              children: <Widget>[
                HoronTableCell(text: '합계'),
                HoronTableCell(text: '41,000원'),
              ],
            ),
          ],
        ),
      if (withCaption) HoronTableCaption(text: '이번 달 결제 내역'),
    ],
  );
}

void main() {
  testWidgets('table: the header, body and caption render as one table', (WidgetTester tester) async {
    await pumpTable(tester, table(withCaption: true));

    expect(find.byType(Table), findsOneWidget);
    expect(find.text('이름'), findsOneWidget);
    expect(find.text('김민열'), findsOneWidget);
    expect(find.text('박서준'), findsOneWidget);
    expect(find.text('이번 달 결제 내역'), findsOneWidget);

    // 캡션은 표 아래에 붙습니다(`caption-bottom`).
    final Rect tableRect = tester.getRect(find.byType(Table));
    final Rect caption = tester.getRect(find.text('이번 달 결제 내역'));
    expect(caption.top, greaterThanOrEqualTo(tableRect.bottom));
  });

  testWidgets('table: the header row is tinted and the last body row loses its border', (WidgetTester tester) async {
    await pumpTable(tester, table());

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronTable))).colorScheme;
    final List<TableRow> rows = tester.widget<Table>(find.byType(Table)).children;
    expect(rows.length, 3);

    // `bg-muted/40` on the header.
    expect((rows.first.decoration! as BoxDecoration).color, scheme.surfaceContainerHighest.withValues(alpha: 0.4));
    // `[&_tr:last-child]:border-0` on the last body row.
    final Border lastBorder = (rows.last.decoration! as BoxDecoration).border! as Border;
    expect(lastBorder.bottom, BorderSide.none);
    // A middle row keeps its bottom border.
    final Border middleBorder = (rows[1].decoration! as BoxDecoration).border! as Border;
    expect(middleBorder.bottom.color, scheme.outline);
  });

  testWidgets('table: a footer adds a top border and a selected row is tinted', (WidgetTester tester) async {
    await pumpTable(
      tester,
      HoronTable(
        children: <Widget>[
          HoronTableBody(
            children: <Widget>[
              HoronTableRow(selected: true, children: <Widget>[HoronTableCell(text: '선택된 행')]),
            ],
          ),
          HoronTableFooter(
            children: <Widget>[
              HoronTableRow(children: <Widget>[HoronTableCell(text: '합계')]),
            ],
          ),
        ],
      ),
    );

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronTable))).colorScheme;
    final List<TableRow> rows = tester.widget<Table>(find.byType(Table)).children;

    expect((rows.first.decoration! as BoxDecoration).color, scheme.surfaceContainerHighest);
    final Border footerBorder = (rows.last.decoration! as BoxDecoration).border! as Border;
    expect(footerBorder.top.color, scheme.outline);
  });

  testWidgets('table: the head is 40 tall and the cell pads 16 by 12', (WidgetTester tester) async {
    await pumpTable(tester, table());

    final Rect head = tester.getRect(find.byType(HoronTableHead).first);
    expect(head.height, greaterThanOrEqualTo(HoronSpace.s10));

    final Padding cellPadding = tester.widget<Padding>(
      find.descendant(of: find.byType(HoronTableCell).first, matching: find.byType(Padding)).first,
    );
    expect(cellPadding.padding, const EdgeInsets.symmetric(horizontal: HoronSpace.s4, vertical: HoronSpace.s3));
  });

  testWidgets('table: a narrow width scrolls instead of overflowing', (WidgetTester tester) async {
    // 열 폭은 내용에서 재므로 이 표는 200보다 넓습니다. 넘치지 않고 스크롤이 생겨야
    // 합니다.
    await pumpTable(tester, table(), width: 160);

    expect(tester.takeException(), isNull);

    final Scrollable scrollable = tester.widget<Scrollable>(
      find.descendant(of: find.byType(HoronTable), matching: find.byType(Scrollable)).first,
    );
    expect(scrollable.axisDirection, AxisDirection.right);

    final Finder horizontal = find.descendant(
      of: find.byType(HoronTable),
      matching: find.byWidgetPredicate(
        (Widget widget) => widget is SingleChildScrollView && widget.scrollDirection == Axis.horizontal,
      ),
    );
    expect(horizontal, findsOneWidget);

    final ScrollPosition position = tester.state<ScrollableState>(find.byType(Scrollable).last).position;
    expect(position.maxScrollExtent, greaterThan(0), reason: 'the table must be wider than the viewport');
  });

  testWidgets('table: a wide width fills the container', (WidgetTester tester) async {
    await pumpTable(tester, table(), width: 720);
    expect(tester.takeException(), isNull);

    final double tableWidth = tester.getRect(find.byType(Table)).width;
    expect(tableWidth, closeTo(720, 1.0));
  });

  testWidgets('table: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpTable(tester, table(withFooter: true, withCaption: true), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('table: a cell with no content asserts', (WidgetTester tester) async {
    expect(() => HoronTableHead(), throwsA(isA<AssertionError>()));
    expect(() => HoronTableCell(), throwsA(isA<AssertionError>()));
    expect(() => HoronTableCaption(), throwsA(isA<AssertionError>()));
  });
}
