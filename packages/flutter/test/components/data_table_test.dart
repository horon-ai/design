import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 정렬·검색·선택·쪽 나눔을 확인할 표 상태를 만듭니다.
HoronDataTableController<String> buildController({
  List<String>? rows,
  bool selectable = false,
  bool paginated = false,
  int pageSize = 10,
}) {
  return HoronDataTableController<String>(
    columns: <HoronDataTableColumn<String>>[
      HoronDataTableColumn<String>(
        id: 'name',
        label: 'Name',
        sortable: true,
        sortValue: (String row) => row,
        searchValue: (String row) => row,
        cell: (String row) => Text(row),
      ),
      HoronDataTableColumn<String>(
        id: 'size',
        label: 'Size',
        numeric: true,
        sortable: true,
        sortValue: (String row) => row.length,
        cell: (String row) => Text('${row.length}'),
      ),
    ],
    rows: rows ?? <String>['Delta', 'Alpha', 'Charlie', 'Bravo', 'Echo'],
    selectable: selectable,
    paginated: paginated,
    pageSize: pageSize,
  );
}

/// 표 카드를 화면에 올립니다.
Future<void> pumpTable(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 900,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SizedBox(width: width, child: child),
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

/// 머리·표·쪽 나눔·바닥글을 한 카드로 묶은 기본 화면입니다.
Widget fullTable(HoronDataTableController<String> controller, {HoronDataTableDevice? device, double gutter = 24}) {
  return HoronDataTable(
    device: device,
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        const HoronDataTableHeader(title: 'Teams'),
        HoronDataTableView<String>(controller: controller, selectColumn: const HoronDataTableSelectColumn()),
        HoronDataTablePagination<String>(controller: controller),
        const HoronDataTableFooter(hint: '5 rows'),
      ],
    ),
  );
}

void main() {
  testWidgets('data_table: the surface is a 20px rounded border-default card', (WidgetTester tester) async {
    await pumpTable(tester, fullTable(buildController(), gutter: 24));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDataTable)));
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find
          .descendant(
            of: find.byType(HoronDataTable),
            matching: find.byWidgetPredicate(
              (Widget widget) =>
                  widget is DecoratedBox &&
                  widget.decoration is BoxDecoration &&
                  (widget.decoration as BoxDecoration).borderRadius == BorderRadius.circular(theme.radius.xl),
            ),
          )
          .first,
    );
    final BoxDecoration decoration = box.decoration as BoxDecoration;
    expect(decoration.color, theme.colors.bgSurface);
    expect((decoration.border! as Border).top.color, theme.colors.borderDefault);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.xl);
    expect(tester.takeException(), isNull);
  });

  testWidgets('data_table: sorting turns over ascending, descending, then off', (WidgetTester tester) async {
    final HoronDataTableController<String> controller = buildController();
    await pumpTable(tester, fullTable(controller));

    expect(controller.sort.columnId, isNull);

    await tester.tap(find.text('Name'));
    await tester.pumpAndSettle();
    expect(controller.sort.columnId, 'name');
    expect(controller.sort.ascending, isTrue);
    expect(controller.visibleRows, <String>['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']);
    expect(find.byIcon(Icons.arrow_drop_up), findsOneWidget);

    await tester.tap(find.text('Name'));
    await tester.pumpAndSettle();
    expect(controller.sort.ascending, isFalse);
    expect(controller.visibleRows, <String>['Echo', 'Delta', 'Charlie', 'Bravo', 'Alpha']);
    expect(find.byIcon(Icons.arrow_drop_down), findsOneWidget);

    await tester.tap(find.text('Name'));
    await tester.pumpAndSettle();
    expect(controller.sort.columnId, isNull);
    expect(controller.visibleRows.first, 'Delta');
    expect(find.byIcon(Icons.unfold_more), findsNWidgets(2), reason: '정렬을 풀면 두 열 모두 양방향 화살표로 돌아갑니다.');
  });

  testWidgets('data_table: a numeric column sorts by its value, not its text', (WidgetTester tester) async {
    final HoronDataTableController<String> controller = buildController();
    await pumpTable(tester, fullTable(controller));
    await tester.tap(find.text('Size'));
    await tester.pumpAndSettle();
    expect(controller.sort.columnId, 'size');
    // 길이 4(에코·델타)가 앞, 길이 7(찰리)이 뒤입니다.
    expect(controller.visibleRows.last, 'Charlie');
    expect(controller.visibleRows.first.length, 4);
  });

  testWidgets('data_table: the search field filters rows through the controller', (WidgetTester tester) async {
    final HoronDataTableController<String> controller = buildController();
    await pumpTable(
      tester,
      HoronDataTable(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const HoronDataTableHeader(title: 'Teams'),
            Padding(
              padding: const EdgeInsets.all(16),
              child: HoronDataTableSearch(controller: controller),
            ),
            HoronDataTableView<String>(controller: controller),
          ],
        ),
      ),
    );

    await tester.enterText(find.byType(TextField), 'ALP');
    await tester.pumpAndSettle();
    expect(controller.query, 'ALP');
    expect(controller.visibleRows, <String>['Alpha']);
    expect(find.text('Alpha'), findsOneWidget);
    expect(find.text('Bravo'), findsNothing);

    await tester.enterText(find.byType(TextField), '');
    await tester.pumpAndSettle();
    expect(controller.visibleRows.length, 5);
  });

  testWidgets('data_table: one row and all visible rows can be selected', (WidgetTester tester) async {
    final HoronDataTableController<String> controller = buildController(selectable: true, paginated: true, pageSize: 2);
    await pumpTable(tester, fullTable(controller));

    expect(controller.pageCount, 3);
    expect(controller.visibleRows, <String>['Delta', 'Alpha']);

    // 머리 상자가 첫 번째, 행 상자가 그다음입니다.
    await tester.tap(find.byType(HoronCheckbox).at(1));
    await tester.pumpAndSettle();
    expect(controller.selected, <String>{'Delta'});
    expect(controller.someVisibleSelected, isTrue);
    expect(controller.allVisibleSelected, isFalse);

    await tester.tap(find.byType(HoronCheckbox).first);
    await tester.pumpAndSettle();
    expect(controller.selected, <String>{'Delta', 'Alpha'});
    expect(controller.allVisibleSelected, isTrue);

    await tester.tap(find.byType(HoronCheckbox).first);
    await tester.pumpAndSettle();
    expect(controller.selected, isEmpty);
  });

  testWidgets('data_table: pagination counts pages and clamps the page', (WidgetTester tester) async {
    final HoronDataTableController<String> controller = buildController(paginated: true, pageSize: 2);
    await pumpTable(tester, fullTable(controller));

    expect(controller.pageCount, 3);
    expect(controller.page, 0);
    expect(find.text('Page 1 of 3'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.chevron_right));
    await tester.pumpAndSettle();
    expect(controller.page, 1);
    expect(controller.visibleRows, <String>['Charlie', 'Bravo']);
    expect(find.text('Page 2 of 3'), findsOneWidget);

    controller.setPage(9);
    await tester.pumpAndSettle();
    expect(controller.page, 2);
    expect(controller.visibleRows, <String>['Echo']);
    expect(controller.pageCount, 3);

    controller.setPage(-4);
    await tester.pumpAndSettle();
    expect(controller.page, 0);
  });

  testWidgets('data_table: an empty table shows the message and no rows', (WidgetTester tester) async {
    final HoronDataTableController<String> controller = buildController(rows: <String>[]);
    await pumpTable(tester, fullTable(controller));
    expect(controller.visibleRows, isEmpty);
    expect(find.text('No results.'), findsOneWidget);
    expect(find.byType(HoronDataTableRow), findsNothing, reason: '빈 상태 행만 남습니다.');
    expect(tester.takeException(), isNull);
  });

  testWidgets('data_table: mobile widens the gutter to 18 and scrolls the body only', (WidgetTester tester) async {
    Future<double> headerGutter(double width) async {
      await pumpTable(
        tester,
        const HoronDataTable(device: null, child: HoronDataTableHeader(title: 'Teams')),
        width: width,
      );
      final Padding padding = tester.widget<Padding>(
        find.descendant(of: find.byType(HoronDataTableHeader), matching: find.byType(Padding)).first,
      );
      return (padding.padding as EdgeInsets).left;
    }

    expect(await headerGutter(1200), 24, reason: 'lg 이상은 데스크톱 여백입니다.');
    expect(await headerGutter(900), 24, reason: 'md 이상은 태블릿 여백입니다.');
    expect(await headerGutter(320), 18, reason: 'md 미만은 모바일 여백입니다.');

    final HoronDataTableController<String> controller = buildController(paginated: true, pageSize: 2);
    await pumpTable(tester, fullTable(controller, device: HoronDataTableDevice.mobile), width: 320);
    final SingleChildScrollView scroll = tester.widget<SingleChildScrollView>(
      find.descendant(of: find.byType(HoronDataTableView<String>), matching: find.byType(SingleChildScrollView)).first,
    );
    expect(scroll.scrollDirection, Axis.horizontal, reason: '표 본문만 가로로 스크롤합니다.');
    expect(
      find.descendant(of: find.byType(HoronDataTablePagination<String>), matching: find.byType(SingleChildScrollView)),
      findsNothing,
      reason: '조작 요소는 가로로 스크롤하지 않습니다.',
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('data_table: every device value renders with its own gutter', (WidgetTester tester) async {
    for (final HoronDataTableDevice device in HoronDataTableDevice.values) {
      await pumpTable(
        tester,
        HoronDataTable(
          device: device,
          child: const HoronDataTableHeader(title: 'Teams'),
        ),
        width: 400,
      );
      final Padding padding = tester.widget<Padding>(
        find.descendant(of: find.byType(HoronDataTableHeader), matching: find.byType(Padding)).first,
      );
      final double expected = device == HoronDataTableDevice.mobile ? 18 : 24;
      expect((padding.padding as EdgeInsets).left, expected, reason: device.name);
      expect(tester.takeException(), isNull, reason: device.name);
    }
  });

  testWidgets('data_table: header tile is a 26px brand square with a 16px icon', (WidgetTester tester) async {
    await pumpTable(
      tester,
      const HoronDataTable(
        child: HoronDataTableHeader(icon: Icon(Icons.groups_outlined), title: 'Teams'),
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDataTableHeader)));
    final Container tile = tester.widget<Container>(
      find
          .descendant(
            of: find.byType(HoronDataTableHeader),
            matching: find.byWidgetPredicate(
              (Widget widget) =>
                  widget is Container &&
                  widget.decoration is BoxDecoration &&
                  (widget.decoration! as BoxDecoration).color == theme.colors.bgBrand,
            ),
          )
          .first,
    );
    expect(tile.constraints?.maxWidth, 26);
    final BuildContext iconContext = tester.element(find.byIcon(Icons.groups_outlined));
    expect(IconTheme.of(iconContext).size, 16);
    expect(IconTheme.of(iconContext).color, theme.colors.textBrand);
  });

  testWidgets('data_table: item, tag and footer paint their tokens', (WidgetTester tester) async {
    await pumpTable(
      tester,
      Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const HoronDataTableItem(logo: Text('A'), label: 'Aster Labs'),
          const HoronDataTableTag(label: 'Active'),
          const HoronDataTableTag(label: 'Invited', brand: false),
          const HoronDataTableFooter(),
        ],
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDataTableItem)));

    final Container itemTile = tester.widget<Container>(
      find.descendant(of: find.byType(HoronDataTableItem), matching: find.byType(Container)).first,
    );
    expect((itemTile.decoration! as BoxDecoration).color, theme.colors.surfaceInk);
    expect((itemTile.decoration! as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.xs));

    final List<Container> tags = tester
        .widgetList<Container>(find.descendant(of: find.byType(HoronDataTableTag), matching: find.byType(Container)))
        .toList();
    expect((tags[0].decoration! as BoxDecoration).color, theme.colors.bgBrand);
    expect((tags[1].decoration! as BoxDecoration).color, theme.colors.bgSubtle);

    expect(find.text('Add row'), findsOneWidget);
    expect(find.byIcon(Icons.add), findsOneWidget);
  });

  testWidgets('data_table: footer reports the add callback and row hover is reachable', (WidgetTester tester) async {
    int adds = 0;
    final HoronDataTableController<String> controller = buildController();
    await pumpTable(
      tester,
      HoronDataTable(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            HoronDataTableView<String>(controller: controller),
            HoronDataTableFooter(onAdd: () => adds++),
          ],
        ),
      ),
    );
    await tester.tap(find.text('Add row'));
    await tester.pumpAndSettle();
    expect(adds, 1);

    final TestGesture gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await gesture.addPointer(location: Offset.zero);
    addTearDown(gesture.removePointer);
    await gesture.moveTo(tester.getCenter(find.byType(HoronDataTableRow).first));
    await tester.pumpAndSettle();
    final AnimatedContainer row = tester.widget<AnimatedContainer>(
      find.descendant(of: find.byType(HoronDataTableRow).first, matching: find.byType(AnimatedContainer)).first,
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDataTableRow).first));
    expect((row.decoration! as BoxDecoration).color, theme.colors.overlayInk3);
  });

  testWidgets('data_table: the whole table renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      final HoronDataTableController<String> controller = buildController(
        selectable: true,
        paginated: true,
        pageSize: 2,
      );
      await pumpTable(tester, fullTable(controller), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Page 1 of 3'), findsOneWidget);
      controller.dispose();
    }
  });
}
