import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 선택 카드의 계약을 확인합니다.
///
/// React `choice-card.tsx`: 252px 불투명 카드, 14 여백, 16 반경, 18px 고리(꺼짐 1.5px
/// 점선, 켜짐 1.5px 잉크 테두리 + 안쪽 3.5px 링 + 8px 점), 선택 시 브랜드 테두리,
/// 꺼진 카드는 hover에서 border-strong. 유리 표면은 없습니다.
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

  testWidgets('기본 카드는 불투명 표면, 기본 테두리, 252 폭, 16 반경이다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, _card));

    final BoxDecoration surface = _surface(tester).decoration! as BoxDecoration;
    expect(surface.color, colors.bgSurface);
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: '유리 표면은 없습니다');
    final Border border = surface.border! as Border;
    expect(border.top.width, 1);
    expect(border.top.color, colors.borderDefault);
    expect(surface.borderRadius, BorderRadius.circular(radius.xl2));
    expect(tester.getSize(find.byKey(const Key('horon-choice-card-surface'))).width, 252);

    final Border ring = (_ring(tester).decoration! as BoxDecoration).border! as Border;
    expect(ring.top.width, 1.5);
    expect(ring.top.color, colors.borderDashed);
    expect(tester.widget<AnimatedScale>(find.byType(AnimatedScale)).scale, 0);
  });

  testWidgets('선택되면 브랜드 테두리와 잉크 고리(테두리 1.5 + 안쪽 3.5), 점을 그린다', (WidgetTester tester) async {
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
    expect(surface.color, colors.bgSurface);
    final Border border = surface.border! as Border;
    expect(border.top.color, colors.borderBrand, reason: '선택 상태는 브랜드 테두리입니다');

    // React는 1.5px 테두리를 유지하고 `shadow-[inset_0_0_0_3.5px]`로 안쪽을 잉크로 덮습니다.
    // 18 − 2 × (1.5 + 3.5) = 8이라 가운데 8px 점만 남습니다.
    final BoxDecoration ring = _ring(tester).decoration! as BoxDecoration;
    expect((ring.border! as Border).top.width, 1.5);
    expect((ring.border! as Border).top.color, colors.interactivePrimary);
    expect(ring.color, colors.interactivePrimary);

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

  testWidgets('제목 label-md semibold, 설명 caption, 세로 간격 4다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, _card));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronChoiceCard)));

    final DefaultTextStyle title = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Workspace connection'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(title.style.fontSize, theme.text.labelMd.fontSize);
    expect(title.style.fontWeight, HoronFontWeight.semibold);
    expect(title.style.color, colors.textPrimary);

    final DefaultTextStyle description = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('Share the workspace with this bot'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(description.style.fontSize, theme.text.caption.fontSize);
    expect(description.style.height, theme.text.caption.height);
    expect(description.style.color, colors.textSecondary);

    // `gap-1` — 제목 줄과 설명 사이는 4px입니다.
    final Column column = tester.widget<Column>(
      find.ancestor(of: find.text('Workspace connection'), matching: find.byType(Column)).first,
    );
    expect(column.spacing, theme.space.s1);
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

  testWidgets('꺼진 카드는 hover에서 border-strong이 되고 선택된 카드는 그대로다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, _card));
    final TestGesture hover = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await hover.addPointer(location: Offset.zero);
    addTearDown(hover.removePointer);
    await hover.moveTo(tester.getCenter(find.byKey(const Key('horon-choice-card-surface'))));
    await tester.pumpAndSettle();
    expect(
      ((_surface(tester).decoration! as BoxDecoration).border! as Border).top.color,
      colors.borderStrong,
      reason: 'data-unchecked:hover:border-border-strong',
    );

    await tester.pumpWidget(_host(Brightness.light, const HoronChoiceCard(title: Text('T'), checked: true)));
    await tester.pumpAndSettle();
    await hover.moveTo(tester.getCenter(find.byKey(const Key('horon-choice-card-surface'))));
    await tester.pumpAndSettle();
    expect(
      ((_surface(tester).decoration! as BoxDecoration).border! as Border).top.color,
      colors.borderBrand,
      reason: '선택된 카드는 hover에서도 브랜드 테두리입니다',
    );
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
