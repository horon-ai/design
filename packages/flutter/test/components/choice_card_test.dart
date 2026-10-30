import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 선택 카드의 계약을 확인합니다.
///
/// React `choice-card.tsx`: 252px 유리 카드, 14 여백, 16 반경, 18px 고리(꺼짐 1.5px,
/// 켜짐 5px + 8px 점), 선택 시 브랜드 테두리와 thick 유리.
Widget _host(Brightness brightness, Widget child, {double width = 600}) {
  return MaterialApp(
    // 밝기를 바꿀 때 AnimatedTheme가 이전 색에서 보간하지 않도록 트리를 새로 만듭니다.
    key: ValueKey<Brightness>(brightness),
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: width),
          child: child,
        ),
      ),
    ),
  );
}

const Widget _card = HoronChoiceCard(
  title: Text('Workspace connection'),
  description: Text('Share the workspace with this bot'),
  badge: Text('Recommended'),
);

AnimatedContainer _surface(WidgetTester tester) =>
    tester.widget<AnimatedContainer>(find.byKey(const Key('horon-choice-card-surface')));

AnimatedContainer _ring(WidgetTester tester) =>
    tester.widget<AnimatedContainer>(find.byKey(const Key('horon-choice-card-ring')));

void main() {
  final HoronColors colors = HoronThemeData.light.colors;
  const HoronRadiusSpec radius = HoronRadiusSpec();

  testWidgets('라이트와 다크에서 기본 상태가 예외 없이 그려진다', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(brightness, _card));
      expect(tester.takeException(), isNull);
      expect(find.text('Workspace connection'), findsOneWidget);
      expect(find.text('Share the workspace with this bot'), findsOneWidget);
      expect(find.text('Recommended'), findsOneWidget);
    }
  });

  testWidgets('기본 카드는 clear 유리, 투명 테두리, 252 폭, 16 반경이다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, _card));

    final BoxDecoration surface = _surface(tester).decoration! as BoxDecoration;
    // 바탕은 유리 엔진이 그립니다. React `choice-card.tsx:34`의 `<LiquidGlass tier="clear" />`와
    // 같은 순서로, 컨테이너에는 반경과 테두리만 남습니다.
    expect(surface.color, isNull, reason: 'bg-glass-clear는 유리 채움 레이어가 그립니다');
    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(find.byType(HoronLiquidGlass), findsOneWidget, reason: '카드가 유리 표면을 깝니다');
    expect(glass.tier, HoronGlassTier.clear);
    expect((surface.border! as Border).top.color, Colors.transparent);
    expect(surface.borderRadius, BorderRadius.circular(radius.xl2));
    expect(tester.getSize(find.byKey(const Key('horon-choice-card-surface'))).width, 252);

    final Border ring = (_ring(tester).decoration! as BoxDecoration).border! as Border;
    expect(ring.top.width, 1.5);
    expect(ring.top.color, colors.borderDashed);
    expect(tester.widget<AnimatedScale>(find.byType(AnimatedScale)).scale, 0);
  });

  testWidgets('선택되면 thick 유리, 브랜드 테두리, 5px 잉크 고리와 점을 그린다', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        Brightness.light,
        const HoronChoiceCard(
          title: Text('Workspace connection'),
          description: Text('Share the workspace with this bot'),
          badge: Text('Recommended'),
          checked: true,
        ),
      ),
    );
    expect(tester.takeException(), isNull);

    final BoxDecoration surface = _surface(tester).decoration! as BoxDecoration;
    expect(surface.color, isNull, reason: 'bg-glass-thick도 유리 채움 레이어가 그립니다');
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.thick);
    expect((surface.border! as Border).top.color, colors.borderBrand);

    final Border ring = (_ring(tester).decoration! as BoxDecoration).border! as Border;
    expect(ring.top.width, 5);
    expect(ring.top.color, colors.interactivePrimary);

    expect(tester.widget<AnimatedScale>(find.byType(AnimatedScale)).scale, 1);
    final Container dot = tester.widget<Container>(find.byKey(const Key('horon-choice-card-dot')));
    expect((dot.decoration! as BoxDecoration).color, colors.interactiveOnPrimary);
    expect(tester.getSize(find.byKey(const Key('horon-choice-card-dot'))).width, 8);
  });

  testWidgets('배지 두 색이 각각 sky 18%와 잉크 6%다', (WidgetTester tester) async {
    Finder badge() => find.ancestor(of: find.text('Recommended'), matching: find.byType(Container)).first;

    await tester.pumpWidget(_host(Brightness.light, _card));
    final BoxDecoration brand = tester.widget<Container>(badge()).decoration! as BoxDecoration;
    expect(brand.color, colors.accentSky500_18);
    final DefaultTextStyle brandText = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Recommended'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(brandText.style.color, colors.textBrand);
    expect(tester.getSize(badge()).height, 22);

    await tester.pumpWidget(
      _host(Brightness.light, const HoronChoiceCard(title: Text('T'), badge: Text('Recommended'), neutralBadge: true)),
    );
    final BoxDecoration neutral = tester.widget<Container>(badge()).decoration! as BoxDecoration;
    expect(neutral.color, colors.overlayInk6);
    final DefaultTextStyle neutralText = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Recommended'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(neutralText.style.color, colors.textSecondary);
  });

  testWidgets('제목 14/20 semibold, 설명 12/16 regular다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, _card));

    final DefaultTextStyle title = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Workspace connection'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(title.style.fontSize, 14);
    expect(title.style.fontWeight, HoronFontWeight.semibold);
    expect(title.style.color, colors.textPrimary);

    final DefaultTextStyle description = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Share the workspace with this bot'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(description.style.fontSize, 12);
    expect(description.style.fontWeight, HoronFontWeight.regular);
    expect(description.style.color, colors.textSecondary);
  });

  testWidgets('누르면 onTap을 부르고 비활성이면 부르지 않는다', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(_host(Brightness.light, HoronChoiceCard(title: const Text('T'), onTap: () => taps++)));
    await tester.tap(find.byType(HoronChoiceCard));
    await tester.pump();
    expect(taps, 1);

    await tester.pumpWidget(
      _host(Brightness.light, HoronChoiceCard(title: const Text('T'), onTap: () => taps++, disabled: true)),
    );
    await tester.tap(find.byType(HoronChoiceCard));
    await tester.pump();
    expect(taps, 1);
    final Opacity opacity = tester.widget<Opacity>(
      find.ancestor(of: find.text('T'), matching: find.byType(Opacity)).first,
    );
    expect(opacity.opacity, 0.4);
    expect(tester.takeException(), isNull);
  });

  testWidgets('부모가 좁으면 252 대신 부모 폭을 따른다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, _card, width: 600));
    expect(tester.getSize(find.byKey(const Key('horon-choice-card-surface'))).width, 252);
    expect(tester.takeException(), isNull);

    await tester.pumpWidget(_host(Brightness.light, _card, width: 200));
    expect(tester.getSize(find.byKey(const Key('horon-choice-card-surface'))).width, 200);
    expect(tester.takeException(), isNull);
  });
}
