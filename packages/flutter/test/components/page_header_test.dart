import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/page_header.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 1024}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, child: child),
    ),
  ),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronPageHeader)));

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(const HoronPageHeader(title: '에이전트 설정'), brightness: brightness));
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the header is regular glass with a 28px radius and a 40px title row', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronPageHeader(title: '에이전트 설정')));
    final HoronThemeData theme = _theme(tester);

    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.tier, HoronGlassTier.regular, reason: 'bg-glass-regular');
    expect(glass.borderRadius, BorderRadius.circular(28), reason: 'rounded-[28px]');

    final Finder row = find.ancestor(of: find.text('에이전트 설정'), matching: find.byType(SizedBox)).first;
    expect(tester.getSize(row).height, theme.space.step(10), reason: 'h-10 = 40');
  });

  testWidgets('the title is label-lg primary and truncates on one line', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronPageHeader(title: '에이전트 설정')));
    final HoronThemeData theme = _theme(tester);

    final Text title = tester.widget<Text>(find.text('에이전트 설정'));
    expect(title.style?.fontSize, theme.text.labelLg.fontSize, reason: 'text-label-lg');
    expect(title.style?.color, theme.colors.textPrimary);
    expect(title.maxLines, 1, reason: 'truncate');
    expect(title.overflow, TextOverflow.ellipsis);
  });

  testWidgets('the back button appears only when onBack is given, and the title indents without it', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    int backs = 0;
    await tester.pumpWidget(_host(HoronPageHeader(title: '에이전트 설정', onBack: () => backs += 1)));

    expect(find.bySemanticsLabel('Back'), findsOneWidget);
    Padding titlePadding() =>
        tester.widget<Padding>(find.ancestor(of: find.text('에이전트 설정'), matching: find.byType(Padding)).first);
    expect(titlePadding().padding, EdgeInsets.zero, reason: '뒤로 버튼이 있으면 들여쓰지 않습니다');

    await tester.tap(find.bySemanticsLabel('Back'));
    await tester.pump();
    expect(backs, 1);

    await tester.pumpWidget(_host(const HoronPageHeader(title: '에이전트 설정')));
    expect(find.bySemanticsLabel('Back'), findsNothing);
    final HoronThemeData theme = _theme(tester);
    expect(titlePadding().padding, EdgeInsets.only(left: theme.space.s2), reason: '!onBack && pl-2');
    handle.dispose();
  });

  testWidgets('actions sit in the title row and children go under it', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        HoronPageHeader(
          title: '에이전트 설정',
          actions: HoronIconButton(icon: const Icon(Icons.search), label: '검색', onPressed: () {}),
          child: const Text('필터'),
        ),
      ),
    );

    expect(find.byIcon(Icons.search), findsOneWidget);
    expect(find.text('필터'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('narrow widths truncate the title instead of overflowing', (WidgetTester tester) async {
    const String long = '아주 긴 에이전트 설정 페이지의 제목입니다';
    await tester.pumpWidget(_host(const HoronPageHeader(title: long), width: 320));

    expect(tester.getSize(find.byType(HoronPageHeader)).width, 320);
    expect(tester.takeException(), isNull, reason: 'truncate가 넘침을 막습니다');
  });
}
