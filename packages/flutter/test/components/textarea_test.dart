import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `textarea`의 최소 높이·자동 확장·상태를 확인합니다.
void main() {
  Future<void> pumpTextarea(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SizedBox(width: 280, child: child)),
        ),
      ),
    );
  }

  /// [HoronTextarea]가 그린 테두리 색입니다.
  Color borderColorOf(WidgetTester tester) {
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronTextarea), matching: find.byType(DecoratedBox)).first,
    );
    return (box.decoration as BoxDecoration).border!.top.color;
  }

  /// React `aria-invalid:border-destructive`(다크는 `/50`)입니다.
  Color invalidBorderOf(ColorScheme scheme, Brightness brightness) =>
      brightness == Brightness.dark ? scheme.error.withValues(alpha: 0.5) : scheme.error;

  for (final Brightness brightness in Brightness.values) {
    final String name = brightness == Brightness.light ? '라이트' : '다크';

    testWidgets('$name: 최소 높이가 생성 토큰의 88이다', (WidgetTester tester) async {
      await pumpTextarea(tester, const HoronTextarea(hintText: '메모'), brightness: brightness);

      expect(HoronTextareaMetrics.minHeight, 88);
      expect(tester.getSize(find.byType(HoronTextarea)).height, greaterThanOrEqualTo(88));
      expect(find.text('메모'), findsOneWidget);
    });

    testWidgets('$name: 내용이 늘면 높이가 자란다', (WidgetTester tester) async {
      await pumpTextarea(tester, const HoronTextarea(hintText: '메모'), brightness: brightness);
      final double empty = tester.getSize(find.byType(HoronTextarea)).height;

      await tester.enterText(find.byType(TextField), '첫 줄\n둘째 줄\n셋째 줄\n넷째 줄\n다섯째 줄\n여섯째 줄');
      await tester.pump();

      expect(tester.getSize(find.byType(HoronTextarea)).height, greaterThan(empty));
    });

    testWidgets('$name: 오류 상태면 테두리가 destructive 색이다', (WidgetTester tester) async {
      await pumpTextarea(tester, const HoronTextarea(hintText: '메모', invalid: true), brightness: brightness);

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronTextarea))).colorScheme;
      expect(borderColorOf(tester), invalidBorderOf(scheme, brightness));
    });

    testWidgets('$name: 비활성 textarea는 포커스를 받지 않는다', (WidgetTester tester) async {
      await pumpTextarea(tester, const HoronTextarea(hintText: '메모', disabled: true), brightness: brightness);

      await tester.tap(find.byType(TextField));
      await tester.pump();

      final TextField field = tester.widget<TextField>(find.byType(TextField));
      expect(field.enabled, isFalse);
      expect(field.focusNode?.hasFocus ?? false, isFalse);
    });
  }

  testWidgets('필드 스코프의 오류를 따라간다', (WidgetTester tester) async {
    await pumpTextarea(tester, HoronField(invalid: true, children: <Widget>[const HoronTextarea(hintText: '메모')]));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronTextarea))).colorScheme;
    expect(borderColorOf(tester), scheme.error);
  });

  testWidgets('maxLines를 주면 그 줄 수에서 멈춘다', (WidgetTester tester) async {
    await pumpTextarea(tester, const HoronTextarea(hintText: '메모', maxLines: 4));

    expect(tester.widget<TextField>(find.byType(TextField)).maxLines, 4);
  });
}
