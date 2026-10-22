import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronItem]을 horon 테마 아래에 띄웁니다.
Future<void> pumpItem(
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

/// 항목 하나의 표면 `BoxDecoration`입니다.
BoxDecoration surfaceOf(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find.descendant(of: find.byType(HoronItem), matching: find.byType(DecoratedBox)).first,
  );
  return box.decoration as BoxDecoration;
}

/// 항목 하나의 안쪽 여백입니다.
EdgeInsets paddingOf(WidgetTester tester) {
  final Padding padding = tester.widget<Padding>(
    find
        .descendant(
          of: find.byType(HoronItem),
          matching: find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding is EdgeInsets),
        )
        .first,
  );
  return padding.padding as EdgeInsets;
}

/// 항목 하나를 파트와 함께 만듭니다.
Widget item({
  HoronItemVariant variant = HoronItemVariant.defaultValue,
  HoronItemSize size = HoronItemSize.defaultValue,
  HoronItemMediaVariant media = HoronItemMediaVariant.defaultValue,
  bool withActions = true,
  bool withDescription = true,
}) {
  return HoronItem(
    variant: variant,
    size: size,
    children: <Widget>[
      HoronItemMedia(variant: media, child: const Icon(Icons.mail)),
      HoronItemContent(
        children: <Widget>[
          HoronItemTitle(text: '알림'),
          if (withDescription) HoronItemDescription(text: '새 메시지가 도착했습니다.'),
        ],
      ),
      if (withActions) HoronItemActions(children: <Widget>[const Text('열기')]),
    ],
  );
}

/// 미디어 자리가 위아래로 옮긴 거리입니다. `Transform.translate`의 y 성분을 읽습니다.
double mediaShiftOf(WidgetTester tester) {
  final Transform transform = tester.widget<Transform>(
    find.descendant(of: find.byType(HoronItemMedia), matching: find.byType(Transform)).first,
  );
  // Matrix4의 13번 자리가 y 이동입니다.
  return transform.transform.storage[13];
}

void main() {
  testWidgets('item: every part renders', (WidgetTester tester) async {
    await pumpItem(tester, item(media: HoronItemMediaVariant.icon));

    expect(find.byType(HoronItem), findsOneWidget);
    expect(find.byType(HoronItemMedia), findsOneWidget);
    expect(find.byType(HoronItemContent), findsOneWidget);
    expect(find.text('알림'), findsOneWidget);
    expect(find.text('새 메시지가 도착했습니다.'), findsOneWidget);
    expect(find.text('열기'), findsOneWidget);
  });

  testWidgets('item: the three variants paint their own surface', (WidgetTester tester) async {
    for (final HoronItemVariant variant in HoronItemVariant.values) {
      await pumpItem(tester, item(variant: variant));
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronItem))).colorScheme;
      final BoxDecoration surface = surfaceOf(tester);

      final Color expectedFill = variant == HoronItemVariant.muted
          ? scheme.surfaceContainerHighest.withValues(alpha: 0.5)
          : Colors.transparent;
      final Color expectedBorder = variant == HoronItemVariant.outline ? scheme.outline : Colors.transparent;

      expect(surface.color, expectedFill, reason: variant.name);
      expect((surface.border! as Border).top.color, expectedBorder, reason: variant.name);
    }
  });

  testWidgets('item: the surface radius is md', (WidgetTester tester) async {
    await pumpItem(tester, item());
    final BorderRadius radius = surfaceOf(tester).borderRadius! as BorderRadius;
    expect(radius.topLeft.x, closeTo(HoronRadius.md, 0.01));
    expect(radius.bottomRight.x, closeTo(HoronRadius.md, 0.01));
  });

  testWidgets('item: sm shrinks the padding and the gap', (WidgetTester tester) async {
    await pumpItem(tester, item());
    expect(paddingOf(tester), const EdgeInsets.all(HoronSpace.s4));

    await pumpItem(tester, item(size: HoronItemSize.sm));
    expect(paddingOf(tester), const EdgeInsets.symmetric(horizontal: HoronSpace.s4, vertical: HoronSpace.s3));
  });

  testWidgets('item: the icon media is 32 square with the sm radius', (WidgetTester tester) async {
    await pumpItem(tester, item(media: HoronItemMediaVariant.icon));

    final Rect media = tester.getRect(find.byType(HoronItemMedia));
    expect(media.width, HoronSpace.s8);
    expect(media.height, HoronSpace.s8);

    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronItemMedia), matching: find.byType(DecoratedBox)).first,
    );
    final BorderRadius radius = (box.decoration as BoxDecoration).borderRadius! as BorderRadius;
    expect(radius.topLeft.x, closeTo(HoronRadius.sm, 0.01));
  });

  testWidgets('item: the image media is 40 square', (WidgetTester tester) async {
    await pumpItem(tester, item(media: HoronItemMediaVariant.image, withDescription: false));
    final Rect media = tester.getRect(find.byType(HoronItemMedia));
    expect(media.width, HoronSpace.s10);
    expect(media.height, HoronSpace.s10);
  });

  testWidgets('item: a description pushes the media down by 2', (WidgetTester tester) async {
    await pumpItem(tester, item(media: HoronItemMediaVariant.icon, withDescription: false));
    expect(mediaShiftOf(tester), HoronSpace.s0);

    await pumpItem(tester, item(media: HoronItemMediaVariant.icon, withDescription: true));
    // `group-has-[[data-slot=item-description]]/item:translate-y-0.5`
    expect(mediaShiftOf(tester), closeTo(HoronSpace.s0_5, 0.01));
  });

  testWidgets('item: the description clamps to two lines', (WidgetTester tester) async {
    await pumpItem(tester, item(withDescription: true), width: 220);
    final Text description = tester.widget<Text>(find.text('새 메시지가 도착했습니다.'));
    expect(description.maxLines, 2);
    expect(description.overflow, TextOverflow.ellipsis);
    expect(tester.takeException(), isNull);
  });

  testWidgets('item: a narrow width does not overflow', (WidgetTester tester) async {
    await pumpItem(tester, item(media: HoronItemMediaVariant.icon), width: 160);
    expect(tester.takeException(), isNull);
  });

  testWidgets('item: a group stacks items with a separator', (WidgetTester tester) async {
    await pumpItem(
      tester,
      HoronItemGroup(
        children: <Widget>[item(withActions: false), const HoronItemSeparator(), item(withActions: false)],
      ),
    );
    expect(find.byType(HoronItem), findsNWidgets(2));
    expect(find.byType(HoronItemSeparator), findsOneWidget);
  });

  testWidgets('item: both brightnesses render every variant and size', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronItemVariant variant in HoronItemVariant.values) {
        for (final HoronItemSize size in HoronItemSize.values) {
          for (final HoronItemMediaVariant media in HoronItemMediaVariant.values) {
            await pumpItem(
              tester,
              item(variant: variant, size: size, media: media),
              brightness: brightness,
            );
            expect(tester.takeException(), isNull, reason: '${brightness.name} ${variant.name} ${size.name}');
          }
        }
      }
    }
  });

  testWidgets('item: a title with no content asserts', (WidgetTester tester) async {
    expect(() => HoronItemTitle(), throwsA(isA<AssertionError>()));
    expect(() => HoronItemDescription(), throwsA(isA<AssertionError>()));
  });
}
