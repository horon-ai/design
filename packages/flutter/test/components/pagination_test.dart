import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronPagination]을 horon 테마 아래에 띄웁니다.
Future<void> pumpPagination(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 800,
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

/// 이전 링크 위젯입니다.
HoronPaginationPrevious previousOf(WidgetTester tester) =>
    tester.widget<HoronPaginationPrevious>(find.byKey(HoronPagination.previousKey));

/// 다음 링크 위젯입니다.
HoronPaginationNext nextOf(WidgetTester tester) =>
    tester.widget<HoronPaginationNext>(find.byKey(HoronPagination.nextKey));

void main() {
  testWidgets('pagination: previous is disabled on the first page', (WidgetTester tester) async {
    int? picked;
    await pumpPagination(tester, HoronPagination(page: 1, pageCount: 10, onPageChanged: (int next) => picked = next));

    expect(previousOf(tester).disabled, isTrue);
    expect(nextOf(tester).disabled, isFalse);

    // 비활성 링크는 눌러도 콜백을 부르지 않습니다.
    await tester.tap(find.byKey(HoronPagination.previousKey));
    await tester.pumpAndSettle();
    expect(picked, isNull);

    await tester.tap(find.byKey(HoronPagination.nextKey));
    await tester.pumpAndSettle();
    expect(picked, 2);
  });

  testWidgets('pagination: next is disabled on the last page', (WidgetTester tester) async {
    int? picked;
    await pumpPagination(tester, HoronPagination(page: 10, pageCount: 10, onPageChanged: (int next) => picked = next));

    expect(nextOf(tester).disabled, isTrue);
    expect(previousOf(tester).disabled, isFalse);

    await tester.tap(find.byKey(HoronPagination.nextKey));
    await tester.pumpAndSettle();
    expect(picked, isNull);

    await tester.tap(find.byKey(HoronPagination.previousKey));
    await tester.pumpAndSettle();
    expect(picked, 9);
  });

  testWidgets('pagination: a middle page enables both ends', (WidgetTester tester) async {
    await pumpPagination(tester, HoronPagination(page: 5, pageCount: 10, onPageChanged: (int next) {}));
    expect(previousOf(tester).disabled, isFalse);
    expect(nextOf(tester).disabled, isFalse);
  });

  testWidgets('pagination: the labels come from the theme strings', (WidgetTester tester) async {
    await pumpPagination(tester, HoronPagination(page: 3, pageCount: 10, onPageChanged: (int next) {}));

    final HoronStrings strings = HoronTheme.of(tester.element(find.byType(HoronPagination))).strings;
    expect(strings.previousPage, 'Previous');
    expect(strings.nextPage, 'Next');
    expect(find.text(strings.previousPage), findsOneWidget);
    expect(find.text(strings.nextPage), findsOneWidget);
  });

  testWidgets('pagination: the number list keeps the ends and collapses the middle', (WidgetTester tester) async {
    // 열 개 중 다섯 번째: 1, …, 4, 5, 6, …, 10
    expect(HoronPagination.pageNumbersFor(5, 10), <int?>[1, null, 4, 5, 6, null, 10]);
    // 첫 페이지: 왼쪽 말줄임이 없습니다.
    expect(HoronPagination.pageNumbersFor(1, 10), <int?>[1, 2, null, 10]);
    // 마지막 페이지: 오른쪽 말줄임이 없습니다.
    expect(HoronPagination.pageNumbersFor(10, 10), <int?>[1, null, 9, 10]);
    // 페이지가 적으면 말줄임 없이 전부 그립니다.
    expect(HoronPagination.pageNumbersFor(3, 6), <int?>[1, 2, 3, 4, 5, 6]);
  });

  testWidgets('pagination: ellipsis appears only where a gap is', (WidgetTester tester) async {
    await pumpPagination(tester, HoronPagination(page: 5, pageCount: 10, onPageChanged: (int next) {}));
    expect(find.byType(HoronPaginationEllipsis), findsNWidgets(2));
    expect(find.text('1'), findsOneWidget);
    expect(find.text('10'), findsOneWidget);
    expect(find.text('2'), findsNothing);

    await pumpPagination(tester, HoronPagination(page: 3, pageCount: 6, onPageChanged: (int next) {}));
    expect(find.byType(HoronPaginationEllipsis), findsNothing);
  });

  testWidgets('pagination: a page number reports the page it names', (WidgetTester tester) async {
    int? picked;
    await pumpPagination(tester, HoronPagination(page: 1, pageCount: 10, onPageChanged: (int next) => picked = next));

    await tester.tap(find.text('10'));
    await tester.pumpAndSettle();
    expect(picked, 10);
  });

  testWidgets('pagination: the active link is the only one with a border', (WidgetTester tester) async {
    await pumpPagination(tester, HoronPagination(page: 2, pageCount: 6, onPageChanged: (int next) {}));
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronPagination))).colorScheme;

    final List<HoronPaginationLink> links = tester
        .widgetList<HoronPaginationLink>(find.byType(HoronPaginationLink))
        .toList();
    expect(links.where((HoronPaginationLink link) => link.isActive).length, 1);
    expect(links.firstWhere((HoronPaginationLink link) => link.isActive).label, '2');

    // 활성 링크만 `variant: outline`이라 테두리를 그립니다.
    final Finder active = find.byWidgetPredicate((Widget widget) => widget is HoronPaginationLink && widget.isActive);
    final Finder inactive = find.byWidgetPredicate(
      (Widget widget) => widget is HoronPaginationLink && !widget.isActive,
    );
    final DecoratedBox activeSurface = tester.widget<DecoratedBox>(
      find.descendant(of: active, matching: find.byType(DecoratedBox)).first,
    );
    final DecoratedBox inactiveSurface = tester.widget<DecoratedBox>(
      find.descendant(of: inactive.first, matching: find.byType(DecoratedBox)).first,
    );

    expect((activeSurface.decoration as BoxDecoration).border!.top.color, scheme.outline);
    expect((inactiveSurface.decoration as BoxDecoration).border!.top.color, Colors.transparent);
  });

  testWidgets('pagination: a narrow width keeps the labels off and does not overflow', (WidgetTester tester) async {
    await pumpPagination(tester, HoronPagination(page: 5, pageCount: 20, onPageChanged: (int next) {}), width: 320);

    expect(tester.takeException(), isNull);
    // `hidden sm:block` - 640보다 좁으면 이전·다음 글자를 감춥니다.
    final HoronStrings strings = HoronTheme.of(tester.element(find.byType(HoronPagination))).strings;
    expect(find.text(strings.previousPage), findsNothing);
    expect(find.text(strings.nextPage), findsNothing);
  });

  testWidgets('pagination: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpPagination(
        tester,
        HoronPagination(page: 4, pageCount: 12, onPageChanged: (int next) {}),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('pagination: a page outside the range asserts', (WidgetTester tester) async {
    expect(() => HoronPagination(page: 0, pageCount: 10), throwsA(isA<AssertionError>()));
    expect(() => HoronPagination(page: 11, pageCount: 10), throwsA(isA<AssertionError>()));
  });
}
