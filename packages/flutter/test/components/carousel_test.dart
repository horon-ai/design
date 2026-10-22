import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 캐러셀의 스냅·화살표 비활성·인디케이터를 확인합니다.
///
/// React `carousel.tsx`는 Embla로 한 장씩 넘기고 첫/마지막 장에서 화살표를 비활성으로
/// 둡니다. 이식본은 `PageView`로 같은 동작을 냅니다. 자동 재생·루프·무한 스크롤이
/// 없다는 것도 함께 확인합니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(child: SizedBox(width: 360, height: 320, child: child)),
    ),
  );

  Widget slide(int index) => Center(child: Text('slide $index'));

  Widget carousel({int initialPage = 0, ValueChanged<int>? onPageChanged, int count = 3}) => HoronCarousel(
    extent: 120,
    initialPage: initialPage,
    onPageChanged: onPageChanged,
    children: <Widget>[
      HoronCarouselContent(
        children: <Widget>[for (int index = 0; index < count; index++) HoronCarouselItem(child: slide(index))],
      ),
      const HoronCarouselPrevious(),
      const HoronCarouselNext(),
      const HoronCarouselDots(),
    ],
  );

  bool previousEnabled(WidgetTester tester) =>
      !tester.widget<HoronButton>(find.byKey(HoronCarouselPrevious.buttonKey)).disabled;

  bool nextEnabled(WidgetTester tester) =>
      !tester.widget<HoronButton>(find.byKey(HoronCarouselNext.buttonKey)).disabled;

  testWidgets('carousel: the first slide shows and the previous arrow is disabled', (WidgetTester tester) async {
    await tester.pumpWidget(harness(carousel()));
    await tester.pumpAndSettle();

    expect(find.text('slide 0'), findsOneWidget);
    expect(previousEnabled(tester), isFalse);
    expect(nextEnabled(tester), isTrue);
  });

  testWidgets('carousel: the next arrow moves exactly one slide and reports it', (WidgetTester tester) async {
    final List<int> changes = <int>[];
    await tester.pumpWidget(harness(carousel(onPageChanged: changes.add)));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(HoronCarouselNext.buttonKey));
    await tester.pumpAndSettle();

    expect(changes, <int>[1]);
    expect(find.text('slide 1'), findsOneWidget);
    expect(previousEnabled(tester), isTrue);
    expect(nextEnabled(tester), isTrue);
  });

  testWidgets('carousel: both arrows disable at the ends and it never wraps', (WidgetTester tester) async {
    final List<int> changes = <int>[];
    await tester.pumpWidget(harness(carousel(onPageChanged: changes.add)));
    await tester.pumpAndSettle();

    for (int step = 0; step < 2; step++) {
      await tester.tap(find.byKey(HoronCarouselNext.buttonKey));
      await tester.pumpAndSettle();
    }

    expect(changes, <int>[1, 2]);
    expect(find.text('slide 2'), findsOneWidget);
    // 마지막 장입니다. 다음 화살표는 꺼지고, 다시 눌러도 첫 장으로 돌아가지 않습니다.
    expect(nextEnabled(tester), isFalse);
    await tester.tap(find.byKey(HoronCarouselNext.buttonKey));
    await tester.pumpAndSettle();
    expect(find.text('slide 2'), findsOneWidget);
    expect(changes, <int>[1, 2]);
  });

  testWidgets('carousel: a drag past half a slide snaps to the next one', (WidgetTester tester) async {
    final List<int> changes = <int>[];
    await tester.pumpWidget(harness(carousel(onPageChanged: changes.add)));
    await tester.pumpAndSettle();

    await tester.drag(find.byType(PageView), const Offset(-220, 0));
    await tester.pumpAndSettle();

    expect(changes, <int>[1]);
    expect(find.text('slide 1'), findsOneWidget);
  });

  testWidgets('carousel: a drag shorter than half a slide springs back', (WidgetTester tester) async {
    final List<int> changes = <int>[];
    await tester.pumpWidget(harness(carousel(onPageChanged: changes.add)));
    await tester.pumpAndSettle();

    await tester.drag(find.byType(PageView), const Offset(-60, 0));
    await tester.pumpAndSettle();

    expect(changes, isEmpty);
    expect(find.text('slide 0'), findsOneWidget);
  });

  testWidgets('carousel: it never advances on its own', (WidgetTester tester) async {
    final List<int> changes = <int>[];
    await tester.pumpWidget(harness(carousel(onPageChanged: changes.add)));
    await tester.pumpAndSettle();

    // 자동 재생이 없습니다. 3초를 흘려도 그대로 첫 장입니다.
    await tester.pump(const Duration(seconds: 3));
    await tester.pumpAndSettle();

    expect(changes, isEmpty);
    expect(find.text('slide 0'), findsOneWidget);
  });

  testWidgets('carousel: the dots follow the current slide', (WidgetTester tester) async {
    await tester.pumpWidget(harness(carousel()));
    await tester.pumpAndSettle();

    expect(find.byKey(HoronCarouselDots.dotsKey), findsOneWidget);
    expect(find.bySemanticsLabel('1 / 3'), findsOneWidget);

    await tester.tap(find.byKey(HoronCarouselNext.buttonKey));
    await tester.pumpAndSettle();

    expect(find.bySemanticsLabel('2 / 3'), findsOneWidget);
  });

  testWidgets('carousel: the vertical variant pages vertically with up and down arrows', (WidgetTester tester) async {
    final List<int> changes = <int>[];
    await tester.pumpWidget(
      harness(
        HoronCarousel.vertical(
          extent: 100,
          onPageChanged: changes.add,
          children: <Widget>[
            HoronCarouselContent(
              children: <Widget>[for (int index = 0; index < 2; index++) HoronCarouselItem(child: slide(index))],
            ),
            const HoronCarouselPrevious(),
            const HoronCarouselNext(),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(tester.widget<PageView>(find.byType(PageView)).scrollDirection, Axis.vertical);
    expect(previousEnabled(tester), isFalse);

    await tester.tap(find.byKey(HoronCarouselNext.buttonKey));
    await tester.pumpAndSettle();

    expect(changes, <int>[1]);
    expect(nextEnabled(tester), isFalse);
  });

  testWidgets('carousel: a single slide disables both arrows', (WidgetTester tester) async {
    await tester.pumpWidget(harness(carousel(count: 1)));
    await tester.pumpAndSettle();

    expect(previousEnabled(tester), isFalse);
    expect(nextEnabled(tester), isFalse);
  });

  testWidgets('carousel: an arrow outside a carousel reports the misuse', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronCarouselNext()));
    expect(tester.takeException(), isA<StateError>());
  });

  testWidgets('carousel: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(harness(carousel(), brightness: brightness));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.byType(PageView), findsOneWidget, reason: brightness.name);
    }
  });
}
