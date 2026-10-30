import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 화면 바깥을 누르는 자리입니다.
const Offset _outside = Offset(2, 2);

Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 800}) => MaterialApp(
  theme: horonTheme(brightness),
  // 팝업 폭은 화면 폭을 기준으로 줄어들므로 테스트에서 화면 폭을 직접 정합니다.
  builder: (BuildContext context, Widget? home) => MediaQuery(
    data: MediaQuery.of(context).copyWith(size: Size(width, 600)),
    child: home!,
  ),
  home: Scaffold(body: Center(child: child)),
);

Widget _contentHost(HoronMenuContent content, {double width = 800}) =>
    _host(SizedBox(width: 400, child: content), width: width);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronMenuContent)));

Finder _item(String label) => find.ancestor(of: find.text(label), matching: find.byType(AnimatedContainer)).first;

BoxDecoration _itemDecoration(WidgetTester tester, String label) =>
    tester.widget<AnimatedContainer>(_item(label)).decoration! as BoxDecoration;

Finder _clipInside() => find.descendant(of: find.byType(HoronMenuContent), matching: find.byType(ClipRRect)).first;

/// 표면이 칠하는 바탕을 담은 `DecoratedBox`입니다.
BoxDecoration _surfaceDecoration(WidgetTester tester) {
  final Iterable<DecoratedBox> boxes = tester.widgetList<DecoratedBox>(
    find.descendant(of: find.byType(HoronMenuContent), matching: find.byType(DecoratedBox)),
  );
  return boxes
      .map((DecoratedBox box) => box.decoration)
      .whereType<BoxDecoration>()
      .firstWhere((BoxDecoration decoration) => decoration.color != null);
}

void main() {
  testWidgets('a closed menu renders only its trigger in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronMenu(
            trigger: const Text('열기'),
            content: const HoronMenuContent(children: <Widget>[HoronMenuItem(label: 'One')]),
          ),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull);
      expect(find.text('열기'), findsOneWidget);
      expect(find.byType(HoronMenuContent), findsNothing);
    }
  });

  testWidgets('the glass surface opens at 220px with a 20px radius and the 6px padding', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        HoronMenu(
          trigger: const Text('열기'),
          content: const HoronMenuContent(children: <Widget>[HoronMenuItem(label: 'One')]),
        ),
      ),
    );
    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();

    final HoronThemeData theme = _theme(tester);
    expect(tester.takeException(), isNull);
    expect(tester.getSize(_clipInside()).width, 220, reason: 'w-55');
    expect(tester.widget<ClipRRect>(_clipInside()).borderRadius, BorderRadius.circular(theme.radius.xl));
    expect(
      tester
          .widget<Padding>(find.descendant(of: find.byType(HoronMenuContent), matching: find.byType(Padding)).first)
          .padding,
      EdgeInsets.all(theme.space.s1_5),
      reason: 'p-1.5',
    );
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass).first).tier, HoronGlassTier.thick);
  });

  testWidgets('each surface has its own width, radius and fill', (WidgetTester tester) async {
    final Map<HoronMenuSurface, double> widths = <HoronMenuSurface, double>{
      HoronMenuSurface.glass: 220,
      HoronMenuSurface.solid: 256,
      HoronMenuSurface.paper: 304,
    };

    for (final HoronMenuSurface surface in HoronMenuSurface.values) {
      await tester.pumpWidget(
        _contentHost(
          HoronMenuContent(
            surface: surface,
            children: const <Widget>[HoronMenuItem(label: 'One')],
          ),
        ),
      );
      expect(tester.takeException(), isNull, reason: '$surface에서 예외가 없어야 합니다');
      final HoronThemeData theme = _theme(tester);
      expect(tester.getSize(_clipInside()).width, widths[surface]);

      final double expectedRadius = switch (surface) {
        HoronMenuSurface.glass => theme.radius.xl,
        HoronMenuSurface.solid => 18,
        HoronMenuSurface.paper => theme.radius.lg,
      };
      expect(tester.widget<ClipRRect>(_clipInside()).borderRadius, BorderRadius.circular(expectedRadius));

      switch (surface) {
        case HoronMenuSurface.glass:
          expect(find.byType(HoronLiquidGlass), findsOneWidget, reason: 'glass는 채움을 유리가 그립니다');
        case HoronMenuSurface.solid:
          // React는 solid에도 `LiquidGlass`를 깝니다. 불투명 채움이 그 위를 덮습니다.
          expect(find.byType(HoronLiquidGlass), findsOneWidget);
          final BoxDecoration decoration = _surfaceDecoration(tester);
          expect(decoration.color, theme.colors.glassFillSolid, reason: 'bg-glass-fill-solid');
          expect(decoration.boxShadow, theme.shadows.popover, reason: 'shadow-popover');
        case HoronMenuSurface.paper:
          expect(find.byType(HoronLiquidGlass), findsNothing);
          final BoxDecoration decoration = _surfaceDecoration(tester);
          expect(decoration.color, theme.colors.bgDefault, reason: 'bg-bg-default');
          expect(decoration.border!.top.color, theme.colors.borderDefault, reason: 'border-border-default');
          expect(decoration.boxShadow!.single.offset, const Offset(0, 12), reason: 'shadow-[0_12px_32px]');
          expect(decoration.boxShadow!.single.blurRadius, 32);
      }
    }
  });

  testWidgets('item rows follow the surface heights and the 18px icon', (WidgetTester tester) async {
    await tester.pumpWidget(
      _contentHost(
        const HoronMenuContent(
          children: <Widget>[
            HoronMenuItem(label: 'Plain', icon: Icon(Icons.copy_outlined)),
            HoronMenuItem(label: 'Described', description: 'Anyone with the link'),
          ],
        ),
      ),
    );
    final HoronThemeData theme = _theme(tester);
    expect(tester.getSize(_item('Plain')).height, 40, reason: 'h-10');
    expect(tester.getSize(_item('Described')).height, 46, reason: 'h-11.5');
    expect(tester.getSize(find.byIcon(Icons.copy_outlined)).width, 18, reason: '[&>svg]:size-4.5');
    expect(
      (tester.widget<AnimatedContainer>(_item('Plain')).decoration! as BoxDecoration).color,
      Colors.transparent,
      reason: '강조되지 않은 행은 투명합니다',
    );
    expect(
      tester.widget<Text>(find.text('Described')).style!.fontSize,
      theme.text.labelMd.fontSize,
      reason: 'text-label-md',
    );
    expect(
      tester.widget<Text>(find.text('Anyone with the link')).style!.fontSize,
      theme.text.caption.fontSize,
      reason: 'text-caption',
    );

    await tester.pumpWidget(
      _contentHost(
        const HoronMenuContent(
          surface: HoronMenuSurface.solid,
          children: <Widget>[HoronMenuItem(label: 'Plain')],
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.getSize(_item('Plain')).height, 36, reason: 'solid h-9');
    expect(
      (tester.widget<AnimatedContainer>(_item('Plain')).decoration! as BoxDecoration).borderRadius,
      BorderRadius.circular(10),
      reason: 'rounded-[10px]',
    );
  });

  testWidgets('danger, selected, trailing and disabled states paint from tokens', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(
      _contentHost(
        HoronMenuContent(
          children: <Widget>[
            HoronMenuItem(
              label: 'Delete',
              icon: const Icon(Icons.delete_outline),
              danger: true,
              trailing: const Icon(Icons.check),
              onTap: () => taps += 1,
            ),
            const HoronMenuItem(label: 'Selected', selected: true),
            HoronMenuItem(label: 'Disabled', enabled: false, onTap: () => taps += 1),
          ],
        ),
      ),
    );
    final HoronThemeData theme = _theme(tester);

    expect(tester.widget<Text>(find.text('Delete')).style!.color, theme.colors.textDanger, reason: 'text-text-danger');
    final IconThemeData iconTheme = tester
        .widget<IconTheme>(find.ancestor(of: find.byIcon(Icons.delete_outline), matching: find.byType(IconTheme)).first)
        .data;
    expect(iconTheme.color, theme.colors.textDanger, reason: '위험 항목은 아이콘도 text-danger입니다');
    expect(iconTheme.size, 18, reason: '[&>svg]:size-4.5');
    expect(tester.getSize(find.byIcon(Icons.check)).width, 16, reason: '[&>svg]:size-4');
    expect(_itemDecoration(tester, 'Selected').color, theme.colors.bgBrand, reason: 'selected:bg-bg-brand');

    final Finder disabled = find.ancestor(of: find.text('Disabled'), matching: find.byType(Opacity)).first;
    expect(tester.widget<Opacity>(disabled).opacity, 0.4, reason: 'data-disabled:opacity-40');

    await tester.tap(find.text('Disabled'));
    expect(taps, 0, reason: '비활성 행은 눌리지 않습니다');
    await tester.tap(find.text('Delete'));
    expect(taps, 1);
  });

  testWidgets('choosing an item runs its callback and closes the menu', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(
      _host(
        HoronMenu(
          trigger: const Text('열기'),
          content: HoronMenuContent(
            children: <Widget>[HoronMenuItem(label: 'Duplicate', onTap: () => taps += 1)],
          ),
        ),
      ),
    );
    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    expect(find.text('Duplicate'), findsOneWidget);

    await tester.tap(find.text('Duplicate'));
    await tester.pumpAndSettle();
    expect(taps, 1);
    expect(find.byType(HoronMenuContent), findsNothing, reason: '항목을 고르면 메뉴가 닫힙니다');
  });

  testWidgets('escape and an outside tap close the menu, the trigger toggles it', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        HoronMenu(
          trigger: const Text('열기'),
          content: const HoronMenuContent(children: <Widget>[HoronMenuItem(label: 'One')]),
        ),
      ),
    );

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    expect(find.byType(HoronMenuContent), findsOneWidget);

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.byType(HoronMenuContent), findsNothing, reason: 'Escape는 메뉴를 닫습니다');

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    expect(find.byType(HoronMenuContent), findsOneWidget);

    await tester.tapAt(_outside);
    await tester.pumpAndSettle();
    expect(find.byType(HoronMenuContent), findsNothing, reason: '바깥 누르기는 메뉴를 닫습니다');
  });

  testWidgets('a narrow screen shrinks the popup instead of overflowing', (WidgetTester tester) async {
    await tester.pumpWidget(
      _contentHost(
        const HoronMenuContent(
          surface: HoronMenuSurface.paper,
          children: <Widget>[HoronMenuItem(label: 'One')],
        ),
        width: 320,
      ),
    );
    expect(tester.getSize(_clipInside()).width, 288, reason: '320에서 좌우 16px을 남깁니다');
    expect(tester.takeException(), isNull);
  });
}
