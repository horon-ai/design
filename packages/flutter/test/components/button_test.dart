import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다. 부모가 느슨한 제약을 주므로
/// 위젯은 자기 크기만큼만 차지합니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: sized)),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronButton)));

Finder _container() => find.descendant(of: find.byType(HoronButton), matching: find.byType(AnimatedContainer));

AnimatedContainer _surface(WidgetTester tester) => tester.widget<AnimatedContainer>(_container());

BoxDecoration _decoration(WidgetTester tester) => _surface(tester).decoration! as BoxDecoration;

TextStyle _labelStyle(WidgetTester tester) =>
    tester.widget<Text>(find.descendant(of: find.byType(HoronButton), matching: find.byType(Text))).style!;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronButton(label: '저장', onPressed: () {}),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('each variant paints its own background and label colour', (WidgetTester tester) async {
    for (final HoronButtonVariant variant in HoronButtonVariant.values) {
      await tester.pumpWidget(_host(HoronButton(label: '저장', variant: variant, onPressed: () {})));
      final HoronColors colors = _theme(tester).colors;
      final (Color background, Color foreground) expected = switch (variant) {
        HoronButtonVariant.primary => (colors.interactivePrimary, colors.interactiveOnPrimary),
        HoronButtonVariant.glass => (colors.glassClear, colors.textPrimary),
        HoronButtonVariant.danger => (colors.interactiveDanger, colors.interactiveOnDanger),
        HoronButtonVariant.link => (Colors.transparent, colors.textSecondary),
      };
      expect(_decoration(tester).color, expected.$1, reason: '$variant 배경색');
      expect(_labelStyle(tester).color, expected.$2, reason: '$variant 라벨색');
    }
  });

  testWidgets('each size paints the React height, padding and label style', (WidgetTester tester) async {
    final HoronSpaceSpec space = HoronThemeData.light.space;
    for (final HoronButtonSize size in HoronButtonSize.values) {
      await tester.pumpWidget(_host(HoronButton(label: '저장', size: size, onPressed: () {})));
      await tester.pumpAndSettle();
      final AnimatedContainer surface = _surface(tester);
      final (double height, double paddingX) = switch (size) {
        HoronButtonSize.sm => (space.step(8), space.s3), // h-8 px-3
        HoronButtonSize.md => (space.step(10), space.s4), // h-10 px-4
        HoronButtonSize.lg => (space.step(12), space.s5), // h-12 px-5
      };
      expect(tester.getSize(_container()).height, height, reason: '$size 높이');
      expect(surface.padding, EdgeInsets.symmetric(horizontal: paddingX), reason: '$size 좌우 여백');
      expect((_decoration(tester).borderRadius! as BorderRadius).topLeft.x, _theme(tester).radius.full);
    }
  });

  testWidgets('the link variant ignores size and uses label-sm with no fill', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(HoronButton(label: '자세히', variant: HoronButtonVariant.link, size: HoronButtonSize.lg)),
    );
    final HoronThemeData theme = _theme(tester);
    final AnimatedContainer surface = _surface(tester);
    expect(surface.constraints, isNull, reason: 'h-auto — 높이를 잡지 않습니다');
    expect(surface.padding, EdgeInsets.symmetric(horizontal: theme.space.s1), reason: 'px-1');
    expect(_labelStyle(tester).fontSize, theme.text.labelSm.fontSize);
    expect((_decoration(tester).borderRadius! as BorderRadius).topLeft.x, theme.radius.sm);
  });

  testWidgets('the icon takes the React size for each size', (WidgetTester tester) async {
    for (final HoronButtonSize size in HoronButtonSize.values) {
      await tester.pumpWidget(
        _host(HoronButton(label: '추가', size: size, icon: const Icon(Icons.add), onPressed: () {})),
      );
      final double expected = size == HoronButtonSize.lg ? 20 : 16; // [&_svg]:size-5 / size-4
      expect(IconTheme.of(tester.element(find.byType(Icon))).size, expected, reason: '$size 아이콘');
      expect(IconTheme.of(tester.element(find.byType(Icon))).color, _labelStyle(tester).color);
    }
  });

  testWidgets('tapping calls onPressed and pressing scales the button down', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(_host(HoronButton(label: '저장', onPressed: () => taps += 1)));

    final TestGesture press = await tester.startGesture(tester.getCenter(find.byType(HoronButton)));
    await tester.pump();
    expect(tester.widget<AnimatedScale>(find.byType(AnimatedScale)).scale, lessThan(1), reason: 'motion-press .97');
    await press.up();
    await tester.pumpAndSettle();

    expect(taps, 1);
    expect(tester.widget<AnimatedScale>(find.byType(AnimatedScale)).scale, 1);
  });

  testWidgets('hover paints the hover colour and a disabled button ignores taps', (WidgetTester tester) async {
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    await tester.pumpWidget(_host(HoronButton(label: '저장', onPressed: () {})));
    final HoronColors colors = _theme(tester).colors;
    await pointer.moveTo(tester.getCenter(find.byType(HoronButton)));
    await tester.pump();
    expect(_decoration(tester).color, colors.interactivePrimaryHover, reason: 'hover:bg-interactive-primary-hover');

    int taps = 0;
    await tester.pumpWidget(_host(HoronButton(label: '저장', enabled: false, onPressed: () => taps += 1)));
    await pointer.moveTo(Offset.zero);
    await tester.pump();
    await tester.tap(find.byType(HoronButton));
    await tester.pumpAndSettle();
    expect(taps, 0);
    expect(
      tester.widget<Opacity>(find.descendant(of: find.byType(HoronButton), matching: find.byType(Opacity))).opacity,
      0.4,
      reason: 'data-disabled:opacity-40',
    );
  });

  testWidgets('a long label truncates instead of overflowing at phone width', (WidgetTester tester) async {
    for (final double width in <double>[320, 1024]) {
      await tester.pumpWidget(
        _host(
          HoronButton(
            label: '아주 긴 라벨이 들어와도 버튼은 넘치지 않고 말줄임으로 줄어듭니다',
            size: HoronButtonSize.lg,
            icon: const Icon(Icons.add),
            onPressed: () {},
          ),
          width: width,
        ),
      );
      expect(tester.takeException(), isNull, reason: '폭 $width에서 예외가 없어야 합니다');
    }
  });
}
