import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(body: Center(child: child)),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronChip)));

/// 칩 상자입니다. 체크 자리도 `AnimatedContainer`라 폭을 여닫으므로, 먼저 나오는
/// 바깥 상자를 집습니다.
Finder _surface() => find.descendant(of: find.byType(HoronChip), matching: find.byType(AnimatedContainer)).first;

AnimatedContainer _container(WidgetTester tester) => tester.widget<AnimatedContainer>(_surface());

BoxDecoration _decoration(WidgetTester tester) => _container(tester).decoration! as BoxDecoration;

/// 체크 아이콘의 불투명도입니다. React는 선택 전에도 아이콘을 트리에 두고
/// `opacity-0`으로 숨깁니다.
double _checkOpacity(WidgetTester tester) => tester
    .widget<AnimatedOpacity>(find.ancestor(of: find.byIcon(Icons.check), matching: find.byType(AnimatedOpacity)).first)
    .opacity;

/// 유리 위에 얹히는 내용의 패딩입니다. React의 `px-3`와 체크 자리 당김을 담습니다.
EdgeInsetsGeometry _contentPadding(WidgetTester tester) =>
    tester.widget<Padding>(find.ancestor(of: find.byType(Row), matching: find.byType(Padding)).first).padding;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(const HoronChip(label: '필터'), brightness: brightness));
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the resting chip is a 32px solid pill with the 6/12 padding', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronChip(label: '필터')));
    final HoronThemeData theme = _theme(tester);
    final BoxDecoration decoration = _decoration(tester);

    expect(tester.getSize(_surface()).height, 32, reason: 'h-8');
    // 칩은 유리를 쓰지 않습니다. React `border border-border-default bg-bg-surface`와 같습니다.
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: '칩은 불투명 표면만 씁니다');
    expect(decoration.color, theme.colors.bgSurface, reason: 'bg-bg-surface');
    expect(decoration.border!.top.color, theme.colors.borderDefault, reason: 'border-border-default');
    expect(decoration.border!.top.width, 1, reason: 'border');
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.full, reason: 'rounded-full');
    // React가 체크 슬롯 음수 마진을 없앴으므로 라벨은 선택 전후 모두 12px에서 시작합니다.
    expect(_contentPadding(tester), EdgeInsets.symmetric(horizontal: theme.space.s3));
    expect(tester.widget<Text>(find.text('필터')).style!.fontSize, theme.text.labelMd.fontSize, reason: 'text-label-md');
    expect(find.byIcon(Icons.check), findsOneWidget, reason: '체크 아이콘은 트리에 있고');
    expect(_checkOpacity(tester), 0, reason: 'opacity-0으로 숨습니다');
    expect(
      tester.getSize(find.ancestor(of: find.byIcon(Icons.check), matching: find.byType(ClipRect)).first).width,
      0,
      reason: '체크 자리는 w-0에서 시작합니다',
    );
  });

  testWidgets('tapping selects the chip: check, brand rim, brand label', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await tester.pumpWidget(_host(HoronChip(label: '필터', onPressedChange: changes.add)));

    await tester.tap(find.byType(HoronChip));
    await tester.pumpAndSettle();

    final HoronThemeData theme = _theme(tester);
    expect(changes, <bool>[true]);
    expect(find.byIcon(Icons.check), findsOneWidget, reason: '선택하면 체크가 나타납니다');
    expect(_checkOpacity(tester), 1, reason: 'group-data-pressed:opacity-100');
    expect(_decoration(tester).color, theme.colors.bgSurface, reason: 'pressed keeps the solid fill');
    expect(_decoration(tester).border!.top.color, theme.colors.borderBrand, reason: 'data-pressed:border-border-brand');
    expect(tester.widget<Text>(find.text('필터')).style!.color, theme.colors.textBrand, reason: 'text-text-brand');
    expect(_container(tester).padding, isNull, reason: '패딩은 유리 위 내용으로 옮겼습니다');
    expect(_contentPadding(tester), EdgeInsets.symmetric(horizontal: theme.space.s3));

    await tester.tap(find.byType(HoronChip));
    await tester.pumpAndSettle();
    expect(changes, <bool>[true, false], reason: '다시 누르면 해제를 요청합니다');
    expect(_checkOpacity(tester), 0, reason: '해제하면 opacity-0으로 돌아갑니다');
  });

  testWidgets('a controlled chip follows the pressed argument', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronChip(label: '필터', pressed: true)));
    await tester.pumpAndSettle();
    expect(find.byIcon(Icons.check), findsOneWidget);
    expect(_decoration(tester).border!.top.color, _theme(tester).colors.borderBrand);

    await tester.pumpWidget(_host(const HoronChip(label: '필터', pressed: false)));
    await tester.pumpAndSettle();
    expect(_checkOpacity(tester), 0);
  });

  testWidgets('a disabled chip dims and does not toggle', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await tester.pumpWidget(_host(HoronChip(label: '필터', enabled: false, onPressedChange: changes.add)));
    await tester.tap(find.byType(HoronChip));
    await tester.pumpAndSettle();

    expect(changes, isEmpty);
    expect(
      tester.widget<Opacity>(find.descendant(of: find.byType(HoronChip), matching: find.byType(Opacity))).opacity,
      0.4,
      reason: 'data-disabled:opacity-40',
    );
  });

  testWidgets('a long label truncates at phone width instead of overflowing', (WidgetTester tester) async {
    for (final double width in <double>[320, 1024]) {
      await tester.pumpWidget(
        _host(
          SizedBox(
            width: width,
            child: const HoronChip(label: '아주 긴 필터 라벨이 들어오는 경우의 칩'),
          ),
        ),
      );
      expect(tester.takeException(), isNull, reason: '폭 $width에서 예외가 없어야 합니다');
    }
  });
}
