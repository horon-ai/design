import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronCard]를 horon 테마 아래에 띄웁니다.
Future<void> pumpCard(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 320, child: child)),
      ),
    ),
  );
}

/// 카드 표면이 칠한 `BoxDecoration`입니다.
BoxDecoration surfaceOf(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find.descendant(of: find.byType(HoronCard), matching: find.byType(DecoratedBox)).first,
  );
  return box.decoration as BoxDecoration;
}

/// 카드 안쪽 여백입니다.
EdgeInsets paddingOf(WidgetTester tester) {
  final Padding padding = tester.widget<Padding>(
    find
        .descendant(
          of: find.byType(HoronCard),
          matching: find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding is EdgeInsets),
        )
        .first,
  );
  return padding.padding as EdgeInsets;
}

void main() {
  testWidgets('card: every part renders in order', (WidgetTester tester) async {
    await pumpCard(
      tester,
      HoronCard(
        children: <Widget>[
          HoronCardHeader(
            children: <Widget>[
              HoronCardTitle(text: '결제 수단'),
              HoronCardDescription(text: '등록된 카드 두 장'),
              HoronCardAction(child: Icon(Icons.more_horiz, key: const Key('card-action'))),
            ],
          ),
          HoronCardContent(child: Text('본문')),
          HoronCardFooter(child: Text('푸터')),
        ],
      ),
    );

    expect(find.byType(HoronCard), findsOneWidget);
    expect(find.byType(HoronCardHeader), findsOneWidget);
    expect(find.text('결제 수단'), findsOneWidget);
    expect(find.text('등록된 카드 두 장'), findsOneWidget);
    expect(find.byKey(const Key('card-action')), findsOneWidget);
    expect(find.text('본문'), findsOneWidget);
    expect(find.text('푸터'), findsOneWidget);

    // 액션은 제목과 같은 행의 오른쪽으로 빠집니다.
    final Rect action = tester.getRect(find.byKey(const Key('card-action')));
    final Rect title = tester.getRect(find.text('결제 수단'));
    expect(action.right, greaterThan(title.right));
    expect(action.top, lessThanOrEqualTo(title.top));
  });

  testWidgets('card: the surface uses the card role radius and the card colour', (WidgetTester tester) async {
    await pumpCard(tester, HoronCard(children: <Widget>[HoronCardContent(child: Text('본문'))]));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronCard))).colorScheme;
    final BoxDecoration surface = surfaceOf(tester);
    final BorderRadius radius = surface.borderRadius! as BorderRadius;

    expect(radius.topLeft.x, closeTo(HoronRadiusRole.card, 0.01));
    expect(radius.bottomRight.x, closeTo(HoronRadiusRole.card, 0.01));
    expect(surface.color, scheme.surfaceContainerLow);
    expect(surface.border!.top.color, scheme.outline);
  });

  testWidgets('card: sm shrinks the spacing from 18 to 12', (WidgetTester tester) async {
    await pumpCard(tester, HoronCard(children: <Widget>[HoronCardContent(child: Text('본문'))]));
    expect(paddingOf(tester).top, 18);
    expect(paddingOf(tester).bottom, 18);

    await pumpCard(
      tester,
      HoronCard(
        size: HoronCardSize.sm,
        children: <Widget>[HoronCardContent(child: Text('본문'))],
      ),
    );
    expect(paddingOf(tester).top, HoronSpace.s3);
    expect(paddingOf(tester).bottom, HoronSpace.s3);
  });

  testWidgets('card: a footer removes the bottom spacing so it sits on the edge', (WidgetTester tester) async {
    await pumpCard(
      tester,
      HoronCard(
        children: <Widget>[
          HoronCardContent(child: Text('본문')),
          HoronCardFooter(child: Text('푸터')),
        ],
      ),
    );

    // `has-data-[slot=card-footer]:pb-0`
    expect(paddingOf(tester).bottom, 0);

    final Rect card = tester.getRect(find.byType(HoronCard));
    final Rect footer = tester.getRect(find.byType(HoronCardFooter));
    expect(footer.bottom, closeTo(card.bottom, 0.5));
  });

  testWidgets('card: the sm size drops the title to the body size', (WidgetTester tester) async {
    await pumpCard(
      tester,
      HoronCard(
        children: <Widget>[
          HoronCardHeader(children: <Widget>[HoronCardTitle(text: '제목')]),
        ],
      ),
    );
    final Text defaultTitle = tester.widget<Text>(find.text('제목'));
    expect(defaultTitle.style?.fontSize, HoronText.lead);

    await pumpCard(
      tester,
      HoronCard(
        size: HoronCardSize.sm,
        children: <Widget>[
          HoronCardHeader(children: <Widget>[HoronCardTitle(text: '제목')]),
        ],
      ),
    );
    final Text smallTitle = tester.widget<Text>(find.text('제목'));
    expect(smallTitle.style?.fontSize, HoronText.body);
  });

  testWidgets('card: both brightnesses render every part', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronCardSize size in HoronCardSize.values) {
        await pumpCard(
          tester,
          HoronCard(
            size: size,
            children: <Widget>[
              HoronCardHeader(
                children: <Widget>[
                  HoronCardTitle(text: '제목'),
                  HoronCardDescription(text: '설명'),
                  HoronCardAction(child: const Icon(Icons.more_horiz)),
                ],
              ),
              HoronCardContent(child: Text('본문')),
              HoronCardFooter(child: Text('푸터')),
            ],
          ),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${size.name} on ${brightness.name}');
      }
    }
  });

  testWidgets('card: a title with neither text nor child asserts', (WidgetTester tester) async {
    // 계약 위반은 조용히 빈 제목을 그리지 않고 생성 시점에 실패합니다.
    expect(() => HoronCardTitle(), throwsA(isA<AssertionError>()));
    expect(() => HoronCardDescription(), throwsA(isA<AssertionError>()));
  });
}
