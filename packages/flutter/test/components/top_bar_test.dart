import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/top_bar.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 1024}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, child: child),
    ),
  ),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronTopBar)));

/// 라이브 점입니다.
Finder _liveDot(HoronColors colors) => find.byWidgetPredicate(
  (Widget widget) => widget is Container && (widget.decoration as BoxDecoration?)?.color == colors.statusLive,
);

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(const HoronTopBar(title: '연구 도우미'), brightness: brightness));
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the pill is 56px tall regular glass and the bot avatar is a 32px brand circle', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(const HoronTopBar(title: '연구 도우미', subtitle: '3개 도구 사용 중')));
    final HoronThemeData theme = _theme(tester);

    expect(tester.getSize(find.byType(HoronTopBar)).height, theme.space.step(14), reason: 'p-2 + h-10 = 56');
    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.tier, HoronGlassTier.regular);
    expect(glass.borderRadius, BorderRadius.circular(theme.radius.full));

    final Finder avatar = find.byWidgetPredicate(
      (Widget widget) => widget is DecoratedBox && (widget.decoration as BoxDecoration).color == theme.colors.bgBrand,
    );
    expect(avatar, findsOneWidget, reason: 'bg-bg-brand');
    expect(tester.getSize(avatar), const Size(32, 32), reason: 'size-8');

    final Finder robot = find.byIcon(Icons.smart_toy_outlined);
    expect(IconTheme.of(tester.element(robot)).size, 18, reason: 'size-[18px]');
    expect(IconTheme.of(tester.element(robot)).color, theme.colors.textBrand);
  });

  testWidgets('the title is label-lg primary and the subtitle is caption secondary', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronTopBar(title: '연구 도우미', subtitle: '3개 도구 사용 중')));
    final HoronThemeData theme = _theme(tester);

    final Text title = tester.widget<Text>(find.text('연구 도우미'));
    expect(title.style?.fontSize, theme.text.labelLg.fontSize, reason: 'text-label-lg');
    expect(title.style?.color, theme.colors.textPrimary);
    expect(title.maxLines, 1, reason: 'truncate');
    expect(title.overflow, TextOverflow.ellipsis);

    final Text subtitle = tester.widget<Text>(find.text('3개 도구 사용 중'));
    expect(subtitle.style?.fontSize, theme.text.caption.fontSize, reason: 'text-caption');
    expect(subtitle.style?.color, theme.colors.textSecondary);
  });

  testWidgets('back and more are labelled buttons that call back', (WidgetTester tester) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    int backs = 0;
    int mores = 0;
    await tester.pumpWidget(_host(HoronTopBar(title: '연구 도우미', onBack: () => backs += 1, onMore: () => mores += 1)));

    expect(find.bySemanticsLabel('Back'), findsOneWidget);
    expect(find.bySemanticsLabel('More'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Back'));
    await tester.pump();
    await tester.tap(find.bySemanticsLabel('More'));
    await tester.pump();

    expect(backs, 1);
    expect(mores, 1);
    handle.dispose();
  });

  testWidgets('live draws a 9px status dot on the avatar corner', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronTopBar(title: '연구 도우미', live: true)));
    await tester.pump();
    final HoronThemeData theme = _theme(tester);

    expect(_liveDot(theme.colors), findsOneWidget);
    expect(tester.getSize(_liveDot(theme.colors)), const Size(9, 9), reason: 'size-[9px]');
    expect(tester.takeException(), isNull);
  });

  testWidgets('narrow widths truncate the title instead of overflowing', (WidgetTester tester) async {
    const String long = '아주 긴 워크스페이스 이름을 가진 에이전트의 연구 도우미';
    await tester.pumpWidget(_host(const HoronTopBar(title: long, subtitle: long), width: 320));

    expect(tester.getSize(find.byType(HoronTopBar)).width, 320);
    expect(tester.takeException(), isNull, reason: 'truncate가 넘침을 막습니다');
    expect(tester.widget<Text>(find.text(long).first).maxLines, 1);
  });
}
