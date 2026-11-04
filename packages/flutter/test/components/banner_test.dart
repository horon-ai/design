import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpBanner(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 520, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('banner: the info tone paints the brand border and text', (WidgetTester tester) async {
    await pumpBanner(tester, const HoronBanner(message: '새 버전이 있습니다.'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBanner)));
    final Text text = tester.widget<Text>(find.text('새 버전이 있습니다.'));

    expect(text.style!.color, theme.colors.textBrand);
    expect(find.byIcon(Icons.info_outline), findsOneWidget);
  });

  testWidgets('banner: the danger tone paints the danger border and text', (WidgetTester tester) async {
    await pumpBanner(tester, const HoronBanner(message: '연결이 끊겼습니다.', tone: HoronBannerTone.danger));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBanner)));
    final Text text = tester.widget<Text>(find.text('연결이 끊겼습니다.'));

    expect(text.style!.color, theme.colors.textDanger);
    expect(find.byIcon(Icons.error_outline), findsOneWidget);
  });

  testWidgets('banner: the action sits at the end, underlined', (WidgetTester tester) async {
    await pumpBanner(
      tester,
      const HoronBanner(
        message: '새 버전이 있습니다.',
        action: Text('업데이트', key: Key('action')),
      ),
    );
    expect(find.byKey(const Key('action')), findsOneWidget);
    // 스타일은 DefaultTextStyle 로 병합되므로, 실제로 그려지는 RichText 에서 읽습니다.
    final RichText painted = tester.widget<RichText>(
      find.descendant(of: find.byKey(const Key('action')), matching: find.byType(RichText)),
    );
    final TextStyle style = painted.text.style!;
    expect(style.decoration, TextDecoration.underline);
    // 액션은 `text-label-lg` 토큰을 그대로 씁니다. 크기·줄 높이·자간을 덮지 않습니다.
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBanner)));
    final TextStyle token = theme.text.labelLg;
    expect(style.fontSize, token.fontSize);
    expect(style.fontSize! * style.height!, moreOrLessEquals(token.fontSize! * token.height!));
    expect(style.letterSpacing, token.letterSpacing);
    expect(style.fontWeight, token.fontWeight);
  });

  testWidgets('banner: the icon is 14, 16 and 20 by size rung', (WidgetTester tester) async {
    for (final HoronBannerSize size in HoronBannerSize.values) {
      await pumpBanner(tester, HoronBanner(message: '문구', size: size));
      final double expected = switch (size) {
        HoronBannerSize.sm => 14,
        HoronBannerSize.md => 16,
        HoronBannerSize.lg => 20,
      };
      expect(IconTheme.of(tester.element(find.byIcon(Icons.info_outline))).size, expected, reason: size.name);
    }
  });

  testWidgets('banner: a one-line message makes the 52px strip', (WidgetTester tester) async {
    await pumpBanner(tester, const HoronBanner(message: '새 버전이 있습니다.'));
    // solid: 위아래 여백 12 + `body-md` 줄 높이 26 + 1px 테두리 둘 = 52.
    expect(tester.getSize(find.byType(HoronBanner)).height, 52);
  });

  testWidgets('banner: every tone renders in both brightnesses without exceptions', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronBannerTone tone in HoronBannerTone.values) {
        await pumpBanner(
          tester,
          HoronBanner(message: '문구', tone: tone),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${tone.name}');
      }
    }
  });

  testWidgets('banner: narrow widths keep the icon and wrap the text', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: Center(
            child: SizedBox(width: 280, child: HoronBanner(message: '아주 긴 안내 문구가 좁은 폭에서도 잘리지 않고 여러 줄로 흐릅니다.')),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    expect(find.byIcon(Icons.info_outline), findsOneWidget);
  });
}
