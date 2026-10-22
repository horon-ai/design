import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/breadcrumb.dart';

/// [HoronBreadcrumb]을 horon 테마 아래에 띄웁니다.
Future<void> pumpBreadcrumb(
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

/// 글자 하나를 가진 경로 항목입니다.
Widget crumb(String label, {VoidCallback? onTap}) {
  return HoronBreadcrumbItem(
    child: onTap == null ? HoronBreadcrumbPage(text: label) : HoronBreadcrumbLink(text: label, onTap: onTap),
  );
}

/// 여섯 항목짜리 경로입니다.
List<Widget> sixCrumbs() => <Widget>[
  crumb('홈', onTap: () {}),
  crumb('워크스페이스', onTap: () {}),
  crumb('프로젝트', onTap: () {}),
  crumb('설정', onTap: () {}),
  crumb('멤버', onTap: () {}),
  crumb('프로필'),
];

void main() {
  testWidgets('breadcrumb: every part renders with separators between items', (WidgetTester tester) async {
    await pumpBreadcrumb(
      tester,
      HoronBreadcrumb(
        children: <Widget>[
          crumb('홈', onTap: () {}),
          crumb('설정', onTap: () {}),
          crumb('프로필'),
        ],
      ),
    );

    expect(find.byType(HoronBreadcrumb), findsOneWidget);
    expect(find.byType(HoronBreadcrumbList), findsOneWidget);
    expect(find.byType(HoronBreadcrumbItem), findsNWidgets(3));
    expect(find.byType(HoronBreadcrumbLink), findsNWidgets(2));
    expect(find.byType(HoronBreadcrumbPage), findsOneWidget);
    // 항목 셋이면 구분자는 둘입니다.
    expect(find.byType(HoronBreadcrumbSeparator), findsNWidgets(2));
  });

  testWidgets('breadcrumb: a link calls onTap and a page does not', (WidgetTester tester) async {
    int taps = 0;
    await pumpBreadcrumb(
      tester,
      HoronBreadcrumb(
        children: <Widget>[
          crumb('홈', onTap: () => taps++),
          crumb('프로필'),
        ],
      ),
    );

    await tester.tap(find.text('홈'));
    await tester.pumpAndSettle();
    expect(taps, 1);

    // 현재 위치는 누를 수 없습니다(`aria-disabled`).
    expect(find.descendant(of: find.byType(HoronBreadcrumbPage), matching: find.byType(GestureDetector)), findsNothing);
  });

  testWidgets('breadcrumb: maxItems collapses only the middle items', (WidgetTester tester) async {
    await pumpBreadcrumb(tester, HoronBreadcrumb(maxItems: 4, children: sixCrumbs()));

    // 첫 항목과 마지막 두 항목이 남고, 가운데 셋이 말줄임 하나로 접힙니다.
    expect(find.text('홈'), findsOneWidget);
    expect(find.text('멤버'), findsOneWidget);
    expect(find.text('프로필'), findsOneWidget);
    expect(find.text('워크스페이스'), findsNothing);
    expect(find.text('프로젝트'), findsNothing);
    expect(find.text('설정'), findsNothing);
    expect(find.byType(HoronBreadcrumbEllipsis), findsOneWidget);

    // 남은 자리 넷에 구분자는 셋입니다.
    expect(find.byType(HoronBreadcrumbItem), findsNWidgets(4));
    expect(find.byType(HoronBreadcrumbSeparator), findsNWidgets(3));
  });

  testWidgets('breadcrumb: without maxItems nothing collapses', (WidgetTester tester) async {
    await pumpBreadcrumb(tester, HoronBreadcrumb(children: sixCrumbs()));

    expect(find.byType(HoronBreadcrumbEllipsis), findsNothing);
    expect(find.byType(HoronBreadcrumbItem), findsNWidgets(6));
  });

  testWidgets('breadcrumb: fewer items than maxItems keeps every one', (WidgetTester tester) async {
    await pumpBreadcrumb(
      tester,
      HoronBreadcrumb(
        maxItems: 6,
        children: <Widget>[
          crumb('홈', onTap: () {}),
          crumb('설정', onTap: () {}),
          crumb('프로필'),
        ],
      ),
    );
    expect(find.byType(HoronBreadcrumbEllipsis), findsNothing);
    expect(find.byType(HoronBreadcrumbItem), findsNWidgets(3));
  });

  testWidgets('breadcrumb: maxItems three keeps only the first, the ellipsis and the last', (
    WidgetTester tester,
  ) async {
    await pumpBreadcrumb(tester, HoronBreadcrumb(maxItems: 3, children: sixCrumbs()));

    expect(find.text('홈'), findsOneWidget);
    expect(find.text('프로필'), findsOneWidget);
    expect(find.byType(HoronBreadcrumbEllipsis), findsOneWidget);
    // 첫 항목·말줄임·마지막 항목 세 자리에 구분자는 둘입니다.
    expect(find.byType(HoronBreadcrumbItem), findsNWidgets(3));
    expect(find.byType(HoronBreadcrumbSeparator), findsNWidgets(2));
    expect(find.byType(HoronBreadcrumbLink), findsOneWidget);
    expect(find.byType(HoronBreadcrumbPage), findsOneWidget);
  });

  testWidgets('breadcrumb: a custom separator replaces the default arrow', (WidgetTester tester) async {
    await pumpBreadcrumb(
      tester,
      HoronBreadcrumb(
        separator: const HoronBreadcrumbSeparator(child: Text('/')),
        children: <Widget>[
          crumb('홈', onTap: () {}),
          crumb('프로필'),
        ],
      ),
    );

    expect(find.text('/'), findsOneWidget);
    expect(find.byType(HoronBreadcrumbSeparator), findsOneWidget);
  });

  testWidgets('breadcrumb: a narrow width wraps instead of overflowing', (WidgetTester tester) async {
    await pumpBreadcrumb(tester, HoronBreadcrumb(children: sixCrumbs()), width: 200);
    expect(tester.takeException(), isNull);
  });

  testWidgets('breadcrumb: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpBreadcrumb(tester, HoronBreadcrumb(maxItems: 4, children: sixCrumbs()), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('breadcrumb: a maxItems below three asserts', (WidgetTester tester) async {
    expect(() => HoronBreadcrumb(maxItems: 2, children: sixCrumbs()), throwsA(isA<AssertionError>()));
    expect(() => HoronBreadcrumbItem(), throwsA(isA<AssertionError>()));
    expect(() => HoronBreadcrumbLink(), throwsA(isA<AssertionError>()));
  });
}
