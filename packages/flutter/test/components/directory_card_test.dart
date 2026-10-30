import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpCard(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 400, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('directory card: the tile is 40px ink at a 10px radius', (WidgetTester tester) async {
    await pumpCard(tester, const HoronDirectoryCard(icon: Icon(Icons.folder_outlined), name: 'Docs'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDirectoryCard)));

    final Container tile = tester.widget<Container>(
      find.descendant(of: find.byType(HoronDirectoryCard), matching: find.byType(Container)).first,
    );
    final BoxDecoration decoration = tile.decoration! as BoxDecoration;

    // Paper `1VJJ-0`: 타일 채움 #17181A, 글리프 #F9FAFB
    expect(decoration.color, HoronPalette.neutral900);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, closeTo(10, 0.01));
    expect(tester.getSize(find.byType(Container).first), const Size(40, 40));
    expect(find.byIcon(Icons.folder_outlined), findsOneWidget);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.folder_outlined))).color, theme.colors.textInverse);
  });

  testWidgets('directory card: the name is label-md and the description clamps to one line', (
    WidgetTester tester,
  ) async {
    await pumpCard(
      tester,
      const HoronDirectoryCard(
        icon: Icon(Icons.folder_outlined),
        name: 'Knowledge',
        description: '아주 긴 설명이 들어와도 한 줄로 잘려서 카드 높이가 흔들리지 않습니다',
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDirectoryCard)));
    final TextStyle nameStyle = tester.widget<Text>(find.text('Knowledge')).style!;
    final Text description = tester.widget<Text>(find.text('아주 긴 설명이 들어와도 한 줄로 잘려서 카드 높이가 흔들리지 않습니다'));

    expect(nameStyle.fontSize, theme.text.labelMd.fontSize);
    // Paper `1VJJ-0`: 이름 14/20 600
    expect(nameStyle.fontWeight, HoronFontWeight.semibold);
    expect(description.maxLines, 1);
    expect(description.overflow, TextOverflow.ellipsis);
  });

  testWidgets('directory card: the glass add button calls onAdd', (WidgetTester tester) async {
    int calls = 0;
    await pumpCard(
      tester,
      HoronDirectoryCard(
        icon: const Icon(Icons.folder_outlined),
        name: 'Docs',
        addLabel: '디렉터리 추가',
        onAdd: () => calls++,
      ),
    );
    expect(find.byType(HoronIconButton), findsOneWidget);
    await tester.tap(find.byType(HoronIconButton));
    await tester.pumpAndSettle();
    expect(calls, 1);
  });

  testWidgets('directory card: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpCard(
        tester,
        const HoronDirectoryCard(icon: Icon(Icons.folder_outlined), name: 'Docs', description: '설명'),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
