import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpEmpty(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('empty state: the column is 360 wide and centered', (WidgetTester tester) async {
    await pumpEmpty(tester, const HoronEmptyState(title: '아직 없습니다'));
    expect(tester.getSize(find.byType(HoronEmptyState)).width, 360);
    expect(find.text('아직 없습니다'), findsOneWidget);
  });

  testWidgets('empty state: title, description and action are all rendered', (WidgetTester tester) async {
    await pumpEmpty(
      tester,
      const HoronEmptyState(
        title: '연결된 봇이 없습니다',
        description: '봇을 하나 추가하면 여기에 나타납니다.',
        action: SizedBox(key: Key('action'), width: 100, height: 40),
      ),
    );

    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronEmptyState)));
    final TextStyle titleStyle = tester.widget<Text>(find.text('연결된 봇이 없습니다')).style!;

    expect(titleStyle.fontSize, theme.text.titleMd.fontSize);
    expect(titleStyle.color, theme.colors.textPrimary);
    expect(find.text('봇을 하나 추가하면 여기에 나타납니다.'), findsOneWidget);
    expect(find.byKey(const Key('action')), findsOneWidget);
  });

  testWidgets('empty state: the illustration box is 140 square', (WidgetTester tester) async {
    await pumpEmpty(
      tester,
      const HoronEmptyState(
        title: '제목',
        illustration: SizedBox(key: Key('art'), width: 40, height: 40),
      ),
    );
    final Size artBox = tester.getSize(
      find.ancestor(of: find.byKey(const Key('art')), matching: find.byType(SizedBox)).first,
    );
    expect(artBox.width, 140);
    expect(artBox.height, 140);
  });

  testWidgets('empty state: both brightnesses render without motion', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpEmpty(tester, const HoronEmptyState(title: '제목'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('empty state: reduced motion renders the final state immediately', (WidgetTester tester) async {
    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(disableAnimations: true),
        child: MaterialApp(
          theme: horonTheme(Brightness.light),
          home: const Scaffold(
            body: Center(child: HoronEmptyState(title: '제목')),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('제목'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
