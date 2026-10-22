import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/alert.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 알림의 다섯 변형이 각자의 의미 색을 쓰는지, 제목·설명·아이콘 슬롯이 그 색을
/// 따라가는지 확인합니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    key: ValueKey<Brightness>(brightness),
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(child: SizedBox(width: 320, child: child)),
    ),
  );

  BoxDecoration surface(WidgetTester tester) =>
      tester.widget<DecoratedBox>(find.byKey(HoronAlert.surfaceKey)).decoration as BoxDecoration;

  Color titleColor(WidgetTester tester, String text) => tester.widget<Text>(find.text(text)).style!.color!;

  Color descriptionColor(WidgetTester tester, String text) => tester.widget<Text>(find.text(text)).style!.color!;

  testWidgets('alert: the five variants paint their own semantic colours', (WidgetTester tester) async {
    expect(HoronAlertVariant.values.length, 5);

    for (final HoronAlertVariant variant in HoronAlertVariant.values) {
      await tester.pumpWidget(
        harness(
          HoronAlert(
            variant: variant,
            title: const HoronAlertTitle('제목'),
            description: const HoronAlertDescription('설명'),
          ),
        ),
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronAlert))).colorScheme;
      final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronAlert)));
      final Color semantic = switch (variant) {
        HoronAlertVariant.defaultValue => scheme.onSurface,
        HoronAlertVariant.destructive => scheme.error,
        HoronAlertVariant.success => horon.success,
        HoronAlertVariant.warning => horon.warning,
        HoronAlertVariant.info => horon.info,
      };

      expect(titleColor(tester, '제목'), semantic, reason: '${variant.name} title');

      if (variant == HoronAlertVariant.defaultValue) {
        // `default`는 의미 색이 아니라 카드 표면과 muted 설명입니다.
        expect(surface(tester).color, scheme.surfaceContainerLow);
        expect((surface(tester).border! as Border).top.color, scheme.outline);
        expect(descriptionColor(tester, '설명'), scheme.onSurfaceVariant);
      } else {
        // 의미 변형은 테두리 30%, 배경 10%, 설명 90%입니다.
        expect(surface(tester).color!.a, closeTo(0.1, 0.01), reason: '${variant.name} background /10');
        expect(
          (surface(tester).border! as Border).top.color.a,
          closeTo(0.3, 0.01),
          reason: '${variant.name} border /30',
        );
        expect(descriptionColor(tester, '설명').a, closeTo(0.9, 0.01), reason: '${variant.name} description /90');
        expect(descriptionColor(tester, '설명').withValues(alpha: 1), semantic);
      }
    }
  });

  testWidgets('alert: an icon adds the second column and inherits the variant colour', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronAlert(
          variant: HoronAlertVariant.warning,
          icon: Icon(Icons.warning_amber),
          title: HoronAlertTitle('저장하지 못했습니다'),
        ),
      ),
    );

    final Rect icon = tester.getRect(find.byIcon(Icons.warning_amber));
    final Rect title = tester.getRect(find.text('저장하지 못했습니다'));
    expect(icon.right, lessThan(title.left), reason: '아이콘이 제목 왼쪽 열에 있지 않습니다');
    expect(tester.getSize(find.byIcon(Icons.warning_amber)).width, 16);

    final IconTheme iconTheme = tester.widget<IconTheme>(
      find.descendant(of: find.byKey(HoronAlert.surfaceKey), matching: find.byType(IconTheme)).first,
    );
    expect(iconTheme.data.color, HoronTheme.of(tester.element(find.byType(HoronAlert))).warning);
  });

  testWidgets('alert: without an icon the title starts at the left padding edge', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronAlert(title: HoronAlertTitle('제목'))));

    final Rect alert = tester.getRect(find.byKey(HoronAlert.surfaceKey));
    expect(tester.getRect(find.text('제목')).left, closeTo(alert.left + HoronSpace.s4, 0.5));
  });

  testWidgets('alert: the description follows the title with the 4px row gap', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(const HoronAlert(title: HoronAlertTitle('제목'), description: HoronAlertDescription('설명'))),
    );

    expect(tester.getRect(find.text('설명')).top - tester.getRect(find.text('제목')).bottom, closeTo(HoronSpace.s1, 1.0));
  });

  testWidgets('alert: a title outside the alert falls back to the theme foreground', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronAlertTitle('단독')));

    expect(titleColor(tester, '단독'), HoronLightColors.foreground);
  });

  testWidgets('alert: both brightnesses render their own destructive colour', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        harness(
          const HoronAlert(
            variant: HoronAlertVariant.destructive,
            title: HoronAlertTitle('실패'),
            description: HoronAlertDescription('다시 시도해 주세요.'),
          ),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      final Color expected = brightness == Brightness.dark ? HoronDarkColors.destructive : HoronLightColors.destructive;
      expect(titleColor(tester, '실패'), expected, reason: brightness.name);
    }
  });
}
