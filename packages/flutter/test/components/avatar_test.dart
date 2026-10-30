import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Finder liveDotFinder(HoronThemeData theme) {
  return find.byWidgetPredicate((Widget widget) {
    final Decoration? decoration = widget is Container ? widget.decoration : null;
    return decoration is BoxDecoration &&
        decoration.shape == BoxShape.circle &&
        decoration.color == theme.colors.statusLive;
  });
}

BoxDecoration liveDot(WidgetTester tester, HoronThemeData theme) {
  final Finder finder = liveDotFinder(theme);
  expect(finder, findsOneWidget, reason: '상태 점이 하나 있어야 합니다');
  return tester.widget<Container>(finder).decoration! as BoxDecoration;
}

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

  testWidgets('avatar: the live dot is the status colour with a 2px bg-surface ring', (WidgetTester tester) async {
    await pumpAvatar(tester, const HoronAvatar.initials('MJ', live: true));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAvatar)));

    final BoxDecoration dot = liveDot(tester, theme);
    expect((dot.border! as Border).top.width, 2);
    // Paper `TU8-1`의 링색은 라이트 #FFFFFF·다크 #17181A인 `bg-surface`입니다.
    expect((dot.border! as Border).top.color, theme.colors.bgSurface);
    expect(tester.getSize(find.byType(HoronAvatar)).width, 32);
  });

  testWidgets('avatar: the live dot hangs 1px outside and centres 4/4.5/5.5/8px inside', (WidgetTester tester) async {
    const Map<HoronAvatarSize, double> paperDot = <HoronAvatarSize, double>{
      HoronAvatarSize.sm: 10,
      HoronAvatarSize.md: 11,
      HoronAvatarSize.lg: 13,
      HoronAvatarSize.xl: 18,
    };
    for (final MapEntry<HoronAvatarSize, double> entry in paperDot.entries) {
      await pumpAvatar(tester, HoronAvatar.initials('MJ', size: entry.key, live: true));
      final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAvatar)));
      liveDot(tester, theme);
      final Rect avatar = tester.getRect(find.byType(HoronAvatar));
      final Rect dot = tester.getRect(liveDotFinder(theme));

      expect(dot.width, entry.value, reason: '${entry.key.name} 바깥 지름');
      // Paper는 점의 중심을 바깥 지름의 절반에서 1px 안쪽에 둡니다.
      expect(avatar.right - dot.center.dx, entry.value / 2 - 1, reason: '${entry.key.name} 가로 중심');
      expect(avatar.bottom - dot.center.dy, entry.value / 2 - 1, reason: '${entry.key.name} 세로 중심');
      expect(dot.right - avatar.right, 1, reason: '${entry.key.name} 바깥 돌출');
    }
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
