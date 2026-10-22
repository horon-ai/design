import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/typography.dart';

Future<void> pumpTypography(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

TextStyle _styleOf(WidgetTester tester, String data) => tester.widget<Text>(find.text(data)).style!;

void main() {
  testWidgets('typography: level1 renders at the HoronText.display size', (WidgetTester tester) async {
    await pumpTypography(tester, const HoronTypographyHeading(data: 'Display', level: HoronTypographyLevel.level1));
    final TextStyle style = _styleOf(tester, 'Display');

    expect(style.fontSize, HoronText.display);
    expect(style.fontSize, 36);
    expect(style.height, HoronLineHeight.tight);
    expect(style.fontWeight, HoronFontWeight.semibold);
    // `tracking-tight` is -0.025em, so it scales with the font size.
    expect(style.letterSpacing, closeTo(HoronLetterSpacing.tight * HoronText.display, 0.0001));
  });

  testWidgets('typography: every heading level reads its own token size', (WidgetTester tester) async {
    const Map<HoronTypographyLevel, double> expected = <HoronTypographyLevel, double>{
      HoronTypographyLevel.level1: HoronText.display,
      HoronTypographyLevel.level2: HoronText.heading,
      HoronTypographyLevel.level3: HoronText.subtitle,
      HoronTypographyLevel.level4: HoronText.lead,
    };

    for (final MapEntry<HoronTypographyLevel, double> entry in expected.entries) {
      await pumpTypography(tester, HoronTypographyHeading(data: entry.key.name, level: entry.key));
      expect(_styleOf(tester, entry.key.name).fontSize, entry.value, reason: entry.key.name);
    }
  });

  testWidgets('typography: the default heading level is level2', (WidgetTester tester) async {
    await pumpTypography(tester, const HoronTypographyHeading(data: 'Default'));
    expect(_styleOf(tester, 'Default').fontSize, HoronText.heading);
  });

  testWidgets('typography: lead and muted read their tokens', (WidgetTester tester) async {
    await pumpTypography(
      tester,
      const Column(
        children: <Widget>[
          HoronTypographyLead(data: 'Lead'),
          HoronTypographyMuted(data: 'Muted'),
        ],
      ),
    );
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronTypographyLead))).colorScheme;

    expect(_styleOf(tester, 'Lead').fontSize, HoronText.lead);
    expect(_styleOf(tester, 'Lead').height, HoronLineHeight.relaxed);
    expect(_styleOf(tester, 'Lead').color, scheme.onSurfaceVariant);
    expect(_styleOf(tester, 'Muted').fontSize, HoronText.caption);
    expect(_styleOf(tester, 'Muted').color, scheme.onSurfaceVariant);
  });

  testWidgets('typography: the list draws a disc and a decimal marker', (WidgetTester tester) async {
    await pumpTypography(
      tester,
      const Column(
        children: <Widget>[
          HoronTypographyList(items: <String>['One', 'Two']),
          HoronTypographyList(items: <String>['First', 'Second'], ordered: true),
        ],
      ),
    );

    expect(find.text('•'), findsNWidgets(2));
    expect(find.text('1.'), findsOneWidget);
    expect(find.text('2.'), findsOneWidget);
    expect(find.text('One'), findsOneWidget);
    expect(find.text('Second'), findsOneWidget);
  });

  testWidgets('typography: inline code scales with the paragraph it sits in', (WidgetTester tester) async {
    await pumpTypography(
      tester,
      const HoronTypography(children: <Widget>[HoronTypographyInlineCode(data: 'flutter test')]),
    );
    final Text code = tester.widget<Text>(find.text('flutter test'));

    // The container sets 13, and `text-[0.85em]` makes it 13 * 0.85.
    expect(code.style!.fontSize, closeTo(13 * 0.85, 0.0001));
    expect(code.style!.fontFamily, HoronFont.mono);
  });

  testWidgets('typography: both brightnesses render the whole family', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpTypography(
        tester,
        const HoronTypography(
          children: <Widget>[
            HoronTypographyHeading(data: 'Title', level: HoronTypographyLevel.level1),
            HoronTypographyLead(data: 'Lead'),
            HoronTypographyInlineCode(data: 'code'),
            HoronTypographyMuted(data: 'Muted'),
            HoronTypographyList(items: <String>['a', 'b']),
          ],
        ),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('typography: a list without items or children asserts', (WidgetTester tester) async {
    expect(() => HoronTypographyList(), throwsA(isA<AssertionError>()));
  });
}
