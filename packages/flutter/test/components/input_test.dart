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

  /// 상자의 테두리 색입니다. 유리 표면은 앞쪽 장식, 불투명 표면은 상자 장식입니다.
  Color borderOf(WidgetTester tester) {
    final Iterable<DecoratedBox> boxes = tester.widgetList<DecoratedBox>(
      find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(DecoratedBox)),
    );
    for (final DecoratedBox box in boxes) {
      if (box.position == DecorationPosition.foreground) return (box.decoration as BoxDecoration).border!.top.color;
    }
    final AnimatedContainer filled = tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first);
    return (filled.decoration! as BoxDecoration).border!.top.color;
  }

  /// 불투명 표면의 채움색입니다.
  Color fillOf(WidgetTester tester) {
    final AnimatedContainer box = tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first);
    return (box.decoration! as BoxDecoration).color!;
  }

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

  testWidgets('glass paints the regular glass layer, solid surfaces paint their fill', (WidgetTester tester) async {
    await pumpInput(tester);
    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.tier, HoronGlassTier.regular);
    expect(borderOf(tester), Colors.transparent, reason: 'border-transparent');

    await pumpInput(tester, surface: HoronInputSurface.solid);
    expect(find.byType(HoronLiquidGlass), findsNothing);
    expect(fillOf(tester), themeOf(tester).colors.bgSurface);

    await pumpInput(tester, surface: HoronInputSurface.solidOnPage);
    expect(fillOf(tester), themeOf(tester).colors.bgDefault);
  });

  testWidgets('invalid turns the border danger, disabled turns the fill subtle', (WidgetTester tester) async {
    await pumpInput(tester, invalid: true);
    expect(borderOf(tester), themeOf(tester).colors.borderDanger);

    await pumpInput(tester, surface: HoronInputSurface.solid, enabled: false);
    expect(fillOf(tester), themeOf(tester).colors.bgSubtle);
    expect(borderOf(tester), themeOf(tester).colors.borderDefault);
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
