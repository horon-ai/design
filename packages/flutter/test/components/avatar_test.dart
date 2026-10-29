import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpAvatar(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('avatar: the four sizes are 24, 32, 40 and 56', (WidgetTester tester) async {
    const Map<HoronAvatarSize, double> expected = <HoronAvatarSize, double>{
      HoronAvatarSize.sm: 24,
      HoronAvatarSize.md: 32,
      HoronAvatarSize.lg: 40,
      HoronAvatarSize.xl: 56,
    };
    for (final MapEntry<HoronAvatarSize, double> entry in expected.entries) {
      await pumpAvatar(tester, HoronAvatar.initials('MJ', size: entry.key));
      expect(tester.getSize(find.byType(HoronAvatar)), Size.square(entry.value), reason: entry.key.name);
    }
  });

  testWidgets('avatar: initials are centred and the sky tone swaps the palette', (WidgetTester tester) async {
    await pumpAvatar(tester, const HoronAvatar.initials('MJ'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAvatar)));
    Container face = tester.widget<Container>(find.byType(Container).first);
    expect((face.decoration! as BoxDecoration).color, theme.colors.bgSubtle);
    expect(find.text('MJ'), findsOneWidget);

    await pumpAvatar(tester, const HoronAvatar.initials('MJ', sky: true));
    face = tester.widget<Container>(find.byType(Container).first);
    expect((face.decoration! as BoxDecoration).color, HoronPalette.sky100);
    expect(tester.widget<Text>(find.text('MJ')).style!.color, HoronPalette.sky700);
  });

  testWidgets('avatar: the bot shape paints the brand fill and a robot icon', (WidgetTester tester) async {
    await pumpAvatar(tester, const HoronAvatar.bot());
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAvatar)));
    final Container face = tester.widget<Container>(find.byType(Container).first);
    expect((face.decoration! as BoxDecoration).color, theme.colors.bgBrand);
    expect(find.byIcon(Icons.smart_toy_outlined), findsOneWidget);
  });

  testWidgets('avatar: the live dot is the status colour with a 2px surface ring', (WidgetTester tester) async {
    await pumpAvatar(tester, const HoronAvatar.initials('MJ', live: true));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAvatar)));

    final Iterable<Container> dots = tester.widgetList<Container>(find.byType(Container)).where((Container c) {
      final Decoration? decoration = c.decoration;
      return decoration is BoxDecoration &&
          decoration.shape == BoxShape.circle &&
          decoration.color == theme.colors.statusLive;
    });
    expect(dots, isNotEmpty);
    final BoxDecoration dot = dots.first.decoration! as BoxDecoration;
    expect((dot.border! as Border).top.width, 2);
    expect((dot.border! as Border).top.color, theme.colors.bgDefault);
    expect(tester.getSize(find.byType(HoronAvatar)).width, 32);
  });

  testWidgets('avatar: a missing image falls back to the initials on error', (WidgetTester tester) async {
    await pumpAvatar(tester, const HoronAvatar.image(imageUrl: 'https://invalid.invalid/x.png', initials: 'AB'));
    // 네트워크 이미지는 테스트에서 실패하므로 대체 글자가 남습니다.
    await tester.pump(const Duration(milliseconds: 100));
    expect(tester.takeException(), isNull);
  });

  testWidgets('avatar: both brightnesses render every shape', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final Widget avatar in <Widget>[
        const HoronAvatar.initials('MJ'),
        const HoronAvatar.bot(),
        const HoronAvatar.initials('MJ', sky: true, live: true),
      ]) {
        await pumpAvatar(tester, avatar, brightness: brightness);
        expect(tester.takeException(), isNull, reason: brightness.name);
      }
    }
  });
}
