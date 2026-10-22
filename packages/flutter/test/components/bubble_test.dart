import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [child]를 horon 테마 아래 고정 폭 상자에 띄웁니다.
Future<void> pumpBubble(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  TextDirection textDirection = TextDirection.ltr,
  double width = 320,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Directionality(
        textDirection: textDirection,
        child: Scaffold(
          body: Align(
            alignment: Alignment.topLeft,
            child: SizedBox(width: width, child: child),
          ),
        ),
      ),
    ),
  );
}

/// 말풍선 표면의 `BoxDecoration`입니다. `HoronBubbleContent`가 그리는 첫 장식입니다.
BoxDecoration surfaceOf(WidgetTester tester) {
  final Finder decoration = find.descendant(
    of: find.byType(HoronBubbleContent),
    matching: find.byWidgetPredicate((Widget widget) => widget is DecoratedBox),
  );
  expect(decoration, findsWidgets);
  return tester.widget<DecoratedBox>(decoration.first).decoration as BoxDecoration;
}

/// 표면의 반경을 지금 방향으로 확정한 값입니다.
BorderRadius radiusOf(WidgetTester tester) {
  final BorderRadiusGeometry geometry = surfaceOf(tester).borderRadius!;
  return geometry.resolve(Directionality.of(tester.element(find.byType(HoronBubbleContent))));
}

/// 내용의 안쪽 여백입니다.
EdgeInsets paddingOf(WidgetTester tester) {
  final Finder padding = find.descendant(
    of: find.byType(HoronBubbleContent),
    matching: find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding is EdgeInsets),
  );
  expect(padding, findsWidgets);
  return tester.widget<Padding>(padding.first).padding as EdgeInsets;
}

/// [variant]와 [alignEnd] 조합의 말풍선 하나를 만듭니다.
Widget bubble(HoronBubbleVariant variant, {bool alignEnd = false}) => HoronBubble(
  variant: variant,
  alignEnd: alignEnd,
  children: <Widget>[HoronBubbleContent(child: Text('${variant.name} 말풍선'))],
);

void main() {
  testWidgets('bubble: all 7 variants render at both alignments', (WidgetTester tester) async {
    // 계획이 요구한 조합입니다. 7 × 2 = 14개를 한 화면에 그립니다.
    expect(HoronBubbleVariant.values.length, 7, reason: 'React bubbleVariants.variant has 7 keys');

    for (final Brightness brightness in Brightness.values) {
      await pumpBubble(
        tester,
        SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              for (final HoronBubbleVariant variant in HoronBubbleVariant.values)
                for (final bool alignEnd in <bool>[false, true])
                  Padding(
                    padding: const EdgeInsets.only(bottom: HoronSpace.s2),
                    child: bubble(variant, alignEnd: alignEnd),
                  ),
            ],
          ),
        ),
        brightness: brightness,
      );

      expect(find.byType(HoronBubble), findsNWidgets(14), reason: brightness.name);
      expect(find.byType(HoronBubbleContent), findsNWidgets(14), reason: brightness.name);
      expect(tester.takeException(), isNull, reason: brightness.name);

      for (final HoronBubbleVariant variant in HoronBubbleVariant.values) {
        expect(find.text('${variant.name} 말풍선'), findsNWidgets(2), reason: '${variant.name} ${brightness.name}');
      }
    }
  });

  testWidgets('bubble: each variant paints its React surface', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronBubbleVariant variant in HoronBubbleVariant.values) {
        await pumpBubble(tester, bubble(variant), brightness: brightness);
        final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronBubbleContent))).colorScheme;

        final (Color fill, Color foreground) = switch (variant) {
          HoronBubbleVariant.defaultValue => (scheme.primary, scheme.onPrimary),
          HoronBubbleVariant.secondary => (scheme.secondary, scheme.onSecondary),
          HoronBubbleVariant.muted => (scheme.surfaceContainerHighest, scheme.onSurface),
          HoronBubbleVariant.tinted => (scheme.surfaceContainer, scheme.onSurface),
          HoronBubbleVariant.outline => (scheme.surface, scheme.onSurface),
          HoronBubbleVariant.ghost => (Colors.transparent, scheme.onSurface),
          HoronBubbleVariant.destructive => (scheme.error.withValues(alpha: 0.1), scheme.error),
        };

        expect(surfaceOf(tester).color, fill, reason: '${variant.name} fill ${brightness.name}');
        final DefaultTextStyle inherited = DefaultTextStyle.of(tester.element(find.text('${variant.name} 말풍선')));
        expect(inherited.style.color, foreground, reason: '${variant.name} text ${brightness.name}');
      }
    }
  });

  testWidgets('bubble: ghost drops the radius and the padding', (WidgetTester tester) async {
    await pumpBubble(tester, bubble(HoronBubbleVariant.ghost));
    expect(radiusOf(tester).topLeft.x, HoronRadius.none);
    expect(paddingOf(tester).left, HoronSpace.s0, reason: 'ghost is `p-0`');

    await pumpBubble(tester, bubble(HoronBubbleVariant.defaultValue));
    expect(radiusOf(tester).topLeft.x, HoronRadiusRole.bubble);
    expect(paddingOf(tester).left, HoronSpace.s3, reason: '`px-3`');
    expect(paddingOf(tester).top, HoronSpace.s2, reason: '`py-2`');
  });

  testWidgets('bubble: the tail corner follows the alignment', (WidgetTester tester) async {
    await pumpBubble(tester, bubble(HoronBubbleVariant.defaultValue));
    BorderRadius radius = radiusOf(tester);
    expect(radius.bottomLeft.x, HoronRadius.sm, reason: 'start alignment squares the start-bottom corner');
    expect(radius.bottomRight.x, HoronRadiusRole.bubble);
    expect(radius.topLeft.x, HoronRadiusRole.bubble);

    await pumpBubble(tester, bubble(HoronBubbleVariant.defaultValue, alignEnd: true));
    radius = radiusOf(tester);
    expect(radius.bottomRight.x, HoronRadius.sm, reason: 'end alignment squares the end-bottom corner');
    expect(radius.bottomLeft.x, HoronRadiusRole.bubble);

    // `tail: false`면 네 모서리가 모두 같은 반경입니다.
    await pumpBubble(
      tester,
      HoronBubble(tail: false, children: <Widget>[HoronBubbleContent(child: const Text('꼬리 없음'))]),
    );
    radius = radiusOf(tester);
    expect(radius.bottomLeft.x, HoronRadiusRole.bubble);
    expect(radius.bottomRight.x, HoronRadiusRole.bubble);
  });

  testWidgets('bubble: RTL flips the alignment and the tail corner', (WidgetTester tester) async {
    // 실패 경로 1: 오른쪽에서 왼쪽으로 바뀌면 정렬과 꼬리가 뒤집혀야 합니다.
    await pumpBubble(tester, bubble(HoronBubbleVariant.defaultValue), textDirection: TextDirection.rtl);

    final Rect content = tester.getRect(find.byType(HoronBubbleContent));
    final Rect box = tester.getRect(find.byType(HoronBubble));
    expect(content.right, moreOrLessEquals(box.right), reason: 'RTL: start alignment is the right edge');
    expect(content.left, greaterThan(box.left + 1), reason: 'RTL: the bubble does not fill the row');

    // 꼬리는 시작 쪽 아래 모서리입니다. RTL의 시작은 오른쪽이라 bottomRight가 깎입니다.
    final BorderRadius radius = radiusOf(tester);
    expect(radius.bottomRight.x, HoronRadius.sm, reason: 'RTL: the tail follows the reading direction');
    expect(radius.bottomLeft.x, HoronRadiusRole.bubble);

    // LTR에서는 같은 말풍선이 왼쪽에 붙습니다.
    await pumpBubble(tester, bubble(HoronBubbleVariant.defaultValue));
    final Rect ltrContent = tester.getRect(find.byType(HoronBubbleContent));
    final Rect ltrBox = tester.getRect(find.byType(HoronBubble));
    expect(ltrContent.left, moreOrLessEquals(ltrBox.left));
  });

  testWidgets('bubble: end alignment sits on the opposite edge in both directions', (WidgetTester tester) async {
    await pumpBubble(tester, bubble(HoronBubbleVariant.secondary, alignEnd: true));
    Rect content = tester.getRect(find.byType(HoronBubbleContent));
    Rect box = tester.getRect(find.byType(HoronBubble));
    expect(content.right, moreOrLessEquals(box.right), reason: 'LTR end alignment is the right edge');

    await pumpBubble(tester, bubble(HoronBubbleVariant.secondary, alignEnd: true), textDirection: TextDirection.rtl);
    content = tester.getRect(find.byType(HoronBubbleContent));
    box = tester.getRect(find.byType(HoronBubble));
    expect(content.left, moreOrLessEquals(box.left), reason: 'RTL end alignment is the left edge');
  });

  testWidgets('bubble: the content is capped at 80% of the row, ghost at 100%', (WidgetTester tester) async {
    const double width = 400;
    final String long = 'a' * 400;

    await pumpBubble(
      tester,
      HoronBubble(children: <Widget>[HoronBubbleContent(child: Text(long))]),
      width: width,
    );
    expect(tester.getSize(find.byType(HoronBubbleContent)).width, lessThanOrEqualTo(width * 0.8 + 0.5));

    await pumpBubble(
      tester,
      HoronBubble(
        variant: HoronBubbleVariant.ghost,
        children: <Widget>[HoronBubbleContent(child: Text(long))],
      ),
      width: width,
    );
    expect(
      tester.getSize(find.byType(HoronBubbleContent)).width,
      greaterThan(width * 0.8),
      reason: 'ghost is `max-w-full`',
    );
  });

  testWidgets('bubble: a tappable content shows the hover surface and calls onTap', (WidgetTester tester) async {
    int taps = 0;
    await pumpBubble(
      tester,
      HoronBubble(
        children: <Widget>[HoronBubbleContent(onTap: () => taps++, child: const Text('누를 수 있는 말풍선'))],
      ),
    );

    await tester.tap(find.byType(HoronBubbleContent));
    expect(taps, 1);

    final TestGesture gesture = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await gesture.addPointer(location: Offset.zero);
    addTearDown(gesture.removePointer);
    await gesture.moveTo(tester.getCenter(find.byType(HoronBubbleContent)));
    await tester.pumpAndSettle();

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronBubbleContent))).colorScheme;
    expect(surfaceOf(tester).color, scheme.primary.withValues(alpha: 0.8), reason: 'hover:bg-primary/80');
  });

  testWidgets('bubble: the group stacks bubbles with an 8px gap', (WidgetTester tester) async {
    await pumpBubble(
      tester,
      HoronBubbleGroup(
        children: <Widget>[bubble(HoronBubbleVariant.defaultValue), bubble(HoronBubbleVariant.secondary)],
      ),
    );
    final Rect first = tester.getRect(find.byType(HoronBubble).first);
    final Rect second = tester.getRect(find.byType(HoronBubble).last);
    expect(second.top - first.bottom, moreOrLessEquals(HoronSpace.s2));
  });
}
