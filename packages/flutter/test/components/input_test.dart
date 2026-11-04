import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronInput`의 표면·크기·상태·반응형 계약을 검사합니다.
void main() {
  Future<void> pumpInput(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    HoronInputSize size = HoronInputSize.md,
    HoronInputSurface surface = HoronInputSurface.glass,
    bool invalid = false,
    bool enabled = true,
    Widget? icon,
    double width = 320,
    ValueChanged<String>? onChanged,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: width,
              child: HoronInput(
                size: size,
                surface: surface,
                invalid: invalid,
                enabled: enabled,
                icon: icon,
                hintText: 'Hint',
                onChanged: onChanged,
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronInput)));

  /// veil 표면입니다. glass 상자는 [HoronVeil] 한 겹이 채움과 링을 맡습니다.
  HoronVeil veilOf(WidgetTester tester) =>
      tester.widget<HoronVeil>(find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(HoronVeil)));

  /// 불투명 표면의 채움색입니다.
  Color fillOf(WidgetTester tester) {
    final AnimatedContainer box = tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first);
    return (box.decoration! as BoxDecoration).color!;
  }

  testWidgets('the default surface is solid', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: Center(
            child: SizedBox(width: 320, child: HoronInput(hintText: 'Hint')),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: '기본 표면은 유리가 아닙니다');
    expect(fillOf(tester), HoronThemeData.light.colors.bgSurface);
  });

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpInput(tester, brightness: brightness);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('md is 40 tall with a 16px icon, lg is 48 with 20', (WidgetTester tester) async {
    await pumpInput(tester, icon: const Icon(Icons.search));
    expect(tester.getSize(find.byType(HoronInput)).height, 40);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.search))).size, 16);

    await pumpInput(tester, size: HoronInputSize.lg, icon: const Icon(Icons.search));
    expect(tester.getSize(find.byType(HoronInput)).height, 48);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.search))).size, 20);
  });

  testWidgets('glass paints the veil field, solid surfaces paint their fill', (WidgetTester tester) async {
    await pumpInput(tester);
    final HoronVeil veil = veilOf(tester);
    expect(veil.kind, HoronVeilKind.field, reason: '.veil-field');
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'glass는 LiquidGlass를 겹치지 않습니다');
    expect(veil.focused, isFalse);
    expect(veil.invalid, isFalse);

    await pumpInput(tester, surface: HoronInputSurface.solid);
    expect(find.byType(HoronVeil), findsNothing);
    expect(fillOf(tester), themeOf(tester).colors.bgSurface);

    await pumpInput(tester, surface: HoronInputSurface.solidOnPage);
    expect(fillOf(tester), themeOf(tester).colors.bgDefault);
  });

  testWidgets('focus fills the veil field and invalid turns its ring danger', (WidgetTester tester) async {
    await pumpInput(tester);
    await tester.tap(find.byType(TextField));
    await tester.pump();
    expect(veilOf(tester).focused, isTrue, reason: 'focus-within은 field-focus 채움입니다');

    await pumpInput(tester, invalid: true);
    expect(veilOf(tester).invalid, isTrue, reason: '오류 링은 border-danger입니다');
  });

  testWidgets('a disabled veil field drops to 60% opacity', (WidgetTester tester) async {
    await pumpInput(tester, enabled: false);
    expect(find.byType(HoronVeil), findsOneWidget);
    final Opacity dim = tester.widget<Opacity>(
      find.ancestor(of: find.byType(HoronVeil), matching: find.byType(Opacity)).first,
    );
    expect(dim.opacity, 0.6, reason: 'has-[[data-disabled]]:opacity-60');
  });

  testWidgets('invalid turns an opaque border danger, disabled turns the fill subtle', (WidgetTester tester) async {
    await pumpInput(tester, surface: HoronInputSurface.solid, invalid: true);
    expect(
      (tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first).decoration! as BoxDecoration)
          .border!
          .top
          .color,
      themeOf(tester).colors.borderDanger,
    );

    await pumpInput(tester, surface: HoronInputSurface.solid, enabled: false);
    expect(fillOf(tester), themeOf(tester).colors.bgSubtle);
    expect(
      (tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first).decoration! as BoxDecoration)
          .border!
          .top
          .color,
      themeOf(tester).colors.borderDefault,
    );
  });

  testWidgets('every size and surface value renders', (WidgetTester tester) async {
    for (final HoronInputSize size in HoronInputSize.values) {
      for (final HoronInputSurface surface in HoronInputSurface.values) {
        await pumpInput(tester, size: size, surface: surface);
        expect(tester.takeException(), isNull, reason: '$size/$surface');
      }
    }
  });

  testWidgets('typing reaches onChanged and a disabled field refuses it', (WidgetTester tester) async {
    final List<String> seen = <String>[];
    await pumpInput(tester, onChanged: seen.add);
    await tester.enterText(find.byType(TextField), 'hello');
    expect(seen, <String>['hello']);

    await pumpInput(tester, enabled: false, onChanged: seen.add);
    expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
  });

  testWidgets('at 320 wide an icon and hint still fit', (WidgetTester tester) async {
    await pumpInput(tester, width: 320, icon: const Icon(Icons.search));
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(HoronInput)).width, 320);
  });
}
