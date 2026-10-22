import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/spinner.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 스피너의 모양(18px·2px 링), 크기·색 인자, 회전과 정지 조건을 확인합니다.
///
/// React는 `border-2`의 원형 테두리에서 위쪽 4분의 1만 투명합니다. 그래서 이 위젯은
/// 호(arc)를 그리는 페인터가 아니라, 테두리를 가진 정사각형 하나를 회전시킵니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light, bool disableAnimations = false}) =>
      MaterialApp(
        theme: horonTheme(brightness),
        builder: (BuildContext context, Widget? app) => MediaQuery(
          data: MediaQuery.of(context).copyWith(disableAnimations: disableAnimations),
          child: app!,
        ),
        home: Scaffold(body: Center(child: child)),
      );

  BoxDecoration ringDecoration(WidgetTester tester) =>
      tester.widget<DecoratedBox>(find.byKey(HoronSpinner.ringKey)).decoration as BoxDecoration;

  Finder rotation() => find.descendant(of: find.byType(HoronSpinner), matching: find.byType(RotationTransition)).first;

  double turns(WidgetTester tester) => tester.widget<RotationTransition>(rotation()).turns.value;

  testWidgets('spinner: the default ring is 18px with a 2px border', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSpinner()));

    expect(tester.getSize(find.byKey(HoronSpinner.ringKey)), const Size(18, 18));
    final BoxDecoration decoration = ringDecoration(tester);
    expect(decoration.shape, BoxShape.circle);
    final Border border = decoration.border! as Border;
    expect(border.top.width, 2);
    expect(border.top.color, HoronLightColors.foreground);
  });

  testWidgets('spinner: size and color are honoured', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSpinner(size: 32, color: HoronLightColors.mutedForeground)));

    expect(tester.getSize(find.byKey(HoronSpinner.ringKey)), const Size(32, 32));
    expect((ringDecoration(tester).border! as Border).top.color, HoronLightColors.mutedForeground);
  });

  testWidgets('spinner: the ring rotates', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSpinner()));
    await tester.pump();

    final double start = turns(tester);
    await tester.pump(const Duration(milliseconds: 250));
    expect(turns(tester), isNot(closeTo(start, 0.001)));
  });

  testWidgets('spinner: reduced motion stops the rotation', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSpinner(), disableAnimations: true));

    final double start = turns(tester);
    await tester.pump(const Duration(milliseconds: 500));
    expect(turns(tester), closeTo(start, 0.001));
  });

  testWidgets('spinner: the transparent quadrant comes from a dstIn mask', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSpinner()));

    final ShaderMask mask = tester.widget<ShaderMask>(
      find.descendant(of: find.byType(HoronSpinner), matching: find.byType(ShaderMask)).first,
    );
    expect(mask.blendMode, BlendMode.dstIn);
  });

  testWidgets('spinner: the semantics label is exposed when the host supplies one', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSpinner(semanticsLabel: '불러오는 중')));

    expect(find.bySemanticsLabel('불러오는 중'), findsOneWidget);
  });

  testWidgets('spinner: both brightnesses render their own foreground', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(harness(const HoronSpinner(), brightness: brightness));
      // 테마가 바뀌면 MaterialApp이 색을 보간합니다. 보간이 끝난 뒤에 잽니다.
      await tester.pump(const Duration(milliseconds: 400));
      expect(tester.takeException(), isNull, reason: brightness.name);
      final Color expected = brightness == Brightness.dark ? HoronDarkColors.foreground : HoronLightColors.foreground;
      expect((ringDecoration(tester).border! as Border).top.color, expected, reason: brightness.name);
    }
  });
}
