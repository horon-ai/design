import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/button.dart';
import 'package:horon_ui/src/components/data_table.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 표 한 행입니다. 열 접근자가 읽는 값만 들고 있습니다.
class _Row {
  const _Row(this.name, this.amount);

  final String name;
  final int amount;
}

const List<_Row> _rows = <_Row>[
  _Row('Charlie', 30),
  _Row('Alice', 10),
  _Row('Echo', 50),
  _Row('Bob', 20),
  _Row('Delta', 40),
];

const List<HoronDataTableColumn<_Row>> _columns = <HoronDataTableColumn<_Row>>[
  HoronDataTableColumn<_Row>(id: 'name', header: 'Name', value: _name),
  HoronDataTableColumn<_Row>(id: 'amount', header: 'Amount', value: _amount),
];

String _name(_Row row) => row.name;
int _amount(_Row row) => row.amount;

/// [HoronDataTable]을 horon 테마 아래에 띄웁니다.
Future<void> pumpTable(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 720,
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

/// 본문 칸에 보이는 [values]의 세로 위치를 위에서 아래 순서로 돌려줍니다.
List<String> orderOf(WidgetTester tester, List<String> values) {
  final List<String> visible = values.where((String value) => find.text(value).evaluate().isNotEmpty).toList();
  visible.sort(
    (String a, String b) => tester.getTopLeft(find.text(a)).dy.compareTo(tester.getTopLeft(find.text(b)).dy),
  );
  return visible;
}

/// 정렬 표시의 방향을 읽습니다.
HoronDataTableSortDirection? directionOf(WidgetTester tester, String columnId) =>
    tester.widget<HoronDataTableSortIndicator>(find.byKey(HoronDataTable.sortIndicatorKey(columnId))).direction;

/// 다음 페이지 버튼입니다.
HoronButton nextButton(WidgetTester tester) => tester.widget<HoronButton>(find.byKey(HoronDataTable.nextKey));

/// 이전 페이지 버튼입니다.
HoronButton previousButton(WidgetTester tester) => tester.widget<HoronButton>(find.byKey(HoronDataTable.previousKey));

void main() {
  testWidgets('data_table: sorting reorders the rows and flips the arrow', (WidgetTester tester) async {
    await pumpTable(tester, const HoronDataTable<_Row>(columns: _columns, data: _rows, pageSize: 10));

    // 정렬하지 않은 상태: 데이터 순서 그대로입니다.
    expect(orderOf(tester, <String>['Charlie', 'Alice', 'Echo', 'Bob', 'Delta']), <String>[
      'Charlie',
      'Alice',
      'Echo',
      'Bob',
      'Delta',
    ]);
    expect(directionOf(tester, 'name'), isNull);

    // 첫 번째 누름: 오름차순.
    await tester.tap(find.byKey(HoronDataTable.sortKey('name')));
    await tester.pumpAndSettle();
    expect(directionOf(tester, 'name'), HoronDataTableSortDirection.asc);
    expect(orderOf(tester, <String>['Charlie', 'Alice', 'Echo', 'Bob', 'Delta']), <String>[
      'Alice',
      'Bob',
      'Charlie',
      'Delta',
      'Echo',
    ]);

    // 두 번째 누름: 내림차순.
    await tester.tap(find.byKey(HoronDataTable.sortKey('name')));
    await tester.pumpAndSettle();
    expect(directionOf(tester, 'name'), HoronDataTableSortDirection.desc);
    expect(orderOf(tester, <String>['Charlie', 'Alice', 'Echo', 'Bob', 'Delta']), <String>[
      'Echo',
      'Delta',
      'Charlie',
      'Bob',
      'Alice',
    ]);

    // 세 번째 누름: 정렬 없음.
    await tester.tap(find.byKey(HoronDataTable.sortKey('name')));
    await tester.pumpAndSettle();
    expect(directionOf(tester, 'name'), isNull);
    expect(orderOf(tester, <String>['Charlie', 'Alice', 'Echo', 'Bob', 'Delta']).first, 'Charlie');
  });

  testWidgets('data_table: numbers sort as numbers, not as text', (WidgetTester tester) async {
    await pumpTable(tester, const HoronDataTable<_Row>(columns: _columns, data: _rows, pageSize: 10));

    await tester.tap(find.byKey(HoronDataTable.sortKey('amount')));
    await tester.pumpAndSettle();

    expect(orderOf(tester, <String>['10', '20', '30', '40', '50']), <String>['10', '20', '30', '40', '50']);
    expect(directionOf(tester, 'amount'), HoronDataTableSortDirection.asc);
    expect(directionOf(tester, 'name'), isNull);
  });

  testWidgets('data_table: paging advances and clamps at the last page', (WidgetTester tester) async {
    await pumpTable(tester, const HoronDataTable<_Row>(columns: _columns, data: _rows, pageSize: 2));

    expect(find.byKey(HoronDataTable.pageStatusKey), findsOneWidget);
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 1 of 3');
    expect(tester.widget<Text>(find.byKey(HoronDataTable.rowCountKey)).data, '5 row(s)');
    expect(previousButton(tester).onPressed, isNull);
    expect(nextButton(tester).onPressed, isNotNull);
    expect(orderOf(tester, <String>['Charlie', 'Alice']), <String>['Charlie', 'Alice']);

    await tester.tap(find.byKey(HoronDataTable.nextKey));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 2 of 3');
    expect(orderOf(tester, <String>['Echo', 'Bob']), <String>['Echo', 'Bob']);

    await tester.tap(find.byKey(HoronDataTable.nextKey));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 3 of 3');
    // 마지막 페이지에는 한 행만 남습니다.
    expect(find.text('Delta'), findsOneWidget);
    expect(find.text('Charlie'), findsNothing);
    expect(nextButton(tester).onPressed, isNull);

    // 마지막 페이지에서 다음을 눌러도 넘어가지 않습니다.
    await tester.tap(find.byKey(HoronDataTable.nextKey));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 3 of 3');

    await tester.tap(find.byKey(HoronDataTable.previousKey));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 2 of 3');
  });

  testWidgets('data_table: sorting while paged returns to the first page', (WidgetTester tester) async {
    await pumpTable(tester, const HoronDataTable<_Row>(columns: _columns, data: _rows, pageSize: 2));

    await tester.tap(find.byKey(HoronDataTable.nextKey));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 2 of 3');

    await tester.tap(find.byKey(HoronDataTable.sortKey('name')));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 1 of 3');
    expect(orderOf(tester, <String>['Alice', 'Bob']), <String>['Alice', 'Bob']);
  });

  testWidgets('data_table: the empty state renders the theme message', (WidgetTester tester) async {
    await pumpTable(tester, const HoronDataTable<_Row>(columns: _columns, data: <_Row>[], pageSize: 10));

    expect(find.byKey(HoronDataTable.emptyKey), findsOneWidget);
    expect(find.descendant(of: find.byKey(HoronDataTable.emptyKey), matching: find.text('No results')), findsOneWidget);
    // 행이 없어도 페이지 수는 1입니다.
    expect(tester.widget<Text>(find.byKey(HoronDataTable.pageStatusKey)).data, 'Page 1 of 1');
    expect(tester.widget<Text>(find.byKey(HoronDataTable.rowCountKey)).data, '0 row(s)');
    expect(tester.getSize(find.byKey(HoronDataTable.emptyKey)).height, HoronSpace.s24);
  });

  testWidgets('data_table: a custom empty message replaces the theme string', (WidgetTester tester) async {
    await pumpTable(
      tester,
      const HoronDataTable<_Row>(columns: _columns, data: <_Row>[], emptyMessage: '검색 결과가 없습니다', pageSize: 10),
    );

    expect(find.text('검색 결과가 없습니다'), findsOneWidget);
    expect(find.text('No results'), findsNothing);
  });

  testWidgets('data_table: the sort button reports the column it names', (WidgetTester tester) async {
    String? column;
    HoronDataTableSortDirection? direction;
    await pumpTable(
      tester,
      HoronDataTable<_Row>(
        columns: _columns,
        data: _rows,
        onSortChanged: (String? id, HoronDataTableSortDirection? next) {
          column = id;
          direction = next;
        },
      ),
    );

    await tester.tap(find.byKey(HoronDataTable.sortKey('amount')));
    await tester.pumpAndSettle();
    expect(column, 'amount');
    expect(direction, HoronDataTableSortDirection.asc);
  });

  testWidgets('data_table: a non-sortable column has no sort button', (WidgetTester tester) async {
    await pumpTable(
      tester,
      const HoronDataTable<_Row>(
        columns: <HoronDataTableColumn<_Row>>[
          HoronDataTableColumn<_Row>(id: 'name', header: 'Name', value: _name, sortable: false),
        ],
        data: _rows,
      ),
    );

    expect(find.byKey(HoronDataTable.sortKey('name')), findsNothing);
    expect(find.text('Name'), findsOneWidget);
  });

  testWidgets('data_table: light and dark use their own surface and border', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      // 밝기를 바꿀 때마다 새 위젯을 만들어야 테마가 다시 읽힙니다. `const` 생성자를
      // 그대로 쓰면 같은 인스턴스라 엘리먼트가 다시 그리지 않습니다.
      await pumpTable(
        tester,
        HoronDataTable<_Row>(key: ValueKey<Brightness>(brightness), columns: _columns, data: _rows),
        brightness: brightness,
      );
      // MaterialApp은 테마를 바꿀 때 `AnimatedTheme`로 보간합니다. 보간이 끝나야 새
      // 밝기의 토큰이 반영되므로 한 번 기다립니다.
      await tester.pumpAndSettle();

      final DecoratedBox surface = tester.widget<DecoratedBox>(
        find.descendant(of: find.byType(HoronDataTable<_Row>), matching: find.byType(DecoratedBox)).first,
      );
      final BoxDecoration decoration = surface.decoration as BoxDecoration;
      final bool isDark = brightness == Brightness.dark;
      expect(decoration.color, isDark ? HoronDarkColors.card : HoronLightColors.card);
      expect((decoration.border! as Border).top.color, isDark ? HoronDarkColors.border : HoronLightColors.border);
    }
  });

  testWidgets('data_table: pageCountFor counts the last partial page', (WidgetTester tester) async {
    expect(HoronDataTable.pageCountFor(0, 10), 1);
    expect(HoronDataTable.pageCountFor(1, 10), 1);
    expect(HoronDataTable.pageCountFor(10, 10), 1);
    expect(HoronDataTable.pageCountFor(11, 10), 2);
    expect(HoronDataTable.pageCountFor(5, 2), 3);
  });

  test('data_table: a page size below one is rejected', () {
    expect(() => HoronDataTable<_Row>(columns: _columns, data: _rows, pageSize: 0), throwsAssertionError);
    expect(() => HoronDataTableColumn<_Row>(id: 'empty', header: 'Empty'), throwsAssertionError);
  });
}
