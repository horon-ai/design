import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpCard(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 320, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('card: the glass surface is a 20px rounded thick glass card', (WidgetTester tester) async {
    await pumpCard(tester, const HoronCard(title: '제목', description: '설명', surface: HoronCardSurface.glass));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCard)));
    expect(find.byType(HoronLiquidGlass), findsOneWidget);
    final ClipRRect clip = tester.widget<ClipRRect>(
      find.descendant(of: find.byType(HoronCard), matching: find.byType(ClipRRect)).first,
    );
    expect((clip.borderRadius as BorderRadius).topLeft.x, closeTo(theme.radius.xl, 0.01));
    expect(find.text('제목'), findsOneWidget);
    expect(find.text('설명'), findsOneWidget);
  });

  testWidgets('card: the frost surface drops the glass layer for a frosted fill', (WidgetTester tester) async {
    await pumpCard(tester, const HoronCard(title: '제목', surface: HoronCardSurface.frost));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCard)));
    expect(find.byType(HoronLiquidGlass), findsNothing);
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronCard), matching: find.byType(DecoratedBox)).first,
    );
    expect((box.decoration as BoxDecoration).color, theme.colors.glassFillFrost);
  });

  testWidgets('card: an interactive card shows the caret and reports taps', (WidgetTester tester) async {
    int taps = 0;
    await pumpCard(tester, HoronCard(title: '열기', interactive: true, onTap: () => taps++));
    expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    await tester.tap(find.byType(HoronCard));
    await tester.pumpAndSettle();
    expect(taps, 1);
  });

  testWidgets('card: the title row keeps the 8px gap', (WidgetTester tester) async {
    await pumpCard(tester, HoronCard(title: '열기', interactive: true, onTap: () {}));
    final HoronThemeData theme = HoronThemeData.light;
    final Row titleRow = tester.widget<Row>(
      find.descendant(of: find.byType(HoronCard), matching: find.byType(Row)).first,
    );
    expect(titleRow.spacing, theme.space.s2, reason: 'Paper UAP-1: 제목 행 gap 8');
  });

  testWidgets('card: a titleless interactive card puts the caret in the top-right corner', (WidgetTester tester) async {
    await pumpCard(tester, HoronCard(description: '본문만 있습니다', interactive: true, onTap: () {}));
    final Rect card = tester.getRect(find.byType(HoronCard));
    final Rect caret = tester.getRect(find.byIcon(Icons.chevron_right));

    expect(tester.widget<Icon>(find.byIcon(Icons.chevron_right)).size, 16);
    // `absolute top-5 right-5`는 CSS에서도 테두리 안쪽(padding box)에서 20입니다.
    // solid 표면의 1px 테두리를 더해 바깥 상자 기준 21입니다.
    expect(caret.top - card.top, 21, reason: 'border 1 + top-5 20');
    expect(card.right - caret.right, 21, reason: 'border 1 + right-5 20');
  });

  testWidgets('card: the selected card paints the brand rim', (WidgetTester tester) async {
    await pumpCard(tester, const HoronCard(title: '선택됨', selected: true));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCard)));
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronCard), matching: find.byType(DecoratedBox)).first,
    );
    final Border border = (box.decoration as BoxDecoration).border! as Border;
    expect(border.top.color, theme.colors.borderBrand, reason: 'solid 카드의 선택 테두리');

    await pumpCard(tester, const HoronCard(title: '선택됨', selected: true, surface: HoronCardSurface.glass));
    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.edgeColor, theme.colors.borderBrand, reason: '유리 카드는 림 색으로 표시합니다');
  });

  testWidgets('card: both surfaces render in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final bool frost in <bool>[false, true]) {
        await pumpCard(
          tester,
          HoronCard(title: '제목', surface: frost ? HoronCardSurface.frost : HoronCardSurface.solid),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} frost=$frost');
      }
    }
  });
}
