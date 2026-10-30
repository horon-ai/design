import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui_example/gallery/gallery_theme.dart';

/// 갤러리 테마가 실제 테마 브리지를 쓰는지 고정합니다.
///
/// 회귀 대상: todo 5의 임시 스텁은 `extensions`가 비어 있어
/// `HoronTheme.of`를 부르는 컴포넌트가 갤러리에서 열리는 순간
/// `StateError`를 던졌습니다. 테마를 읽는 컴포넌트가 16개였고,
/// 셸 테스트 4개는 그런 섹션을 열지 않아 초록이었습니다.
void main() {
  test('gallery theme registers HoronThemeData for both brightnesses', () {
    for (final Brightness brightness in Brightness.values) {
      final ThemeData theme = galleryTheme(brightness);
      expect(
        theme.extension<HoronThemeData>(),
        isNotNull,
        reason: '$brightness 갤러리 테마에 HoronThemeData가 없습니다',
      );
      expect(theme.brightness, brightness);
    }
  });

  testWidgets('a themed component renders under the gallery theme', (
    WidgetTester tester,
  ) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        MaterialApp(
          theme: galleryTheme(brightness),
          home: Builder(
            builder: (BuildContext context) => Center(
              child: Text(
                'gallery',
                style: TextStyle(
                  color: HoronTheme.of(context).colors.textPrimary,
                ),
              ),
            ),
          ),
        ),
      );
      expect(
        tester.takeException(),
        isNull,
        reason: '$brightness 갤러리 테마에서 테마를 읽는 위젯이 예외를 던졌습니다',
      );
      expect(find.text('gallery'), findsOneWidget);
    }
  });

  testWidgets('HoronTheme.of resolves inside the gallery theme', (
    WidgetTester tester,
  ) async {
    HoronThemeData? resolved;
    await tester.pumpWidget(
      MaterialApp(
        theme: galleryTheme(Brightness.dark),
        home: Builder(
          builder: (BuildContext context) {
            resolved = HoronTheme.of(context);
            return const SizedBox.shrink();
          },
        ),
      ),
    );
    expect(resolved, isNotNull);
    expect(resolved!.colors.glassRegular, isNotNull);
  });
}
