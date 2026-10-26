import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `label`의 문구·상태 추종·슬롯을 확인합니다.
void main() {
  Future<void> pumpLabel(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(body: Center(child: child)),
      ),
    );
  }

  /// 라벨 문구의 색입니다.
  Color labelColorOf(WidgetTester tester, String text) => tester.widget<Text>(find.text(text)).style!.color!;

  for (final Brightness brightness in Brightness.values) {
    final String name = brightness == Brightness.light ? '라이트' : '다크';

    testWidgets('$name: 문구를 그리고 기본 색은 onSurface다', (WidgetTester tester) async {
      await pumpLabel(tester, const HoronLabel(label: '이메일'), brightness: brightness);

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronLabel))).colorScheme;
      expect(find.text('이메일'), findsOneWidget);
      expect(labelColorOf(tester, '이메일'), scheme.onSurface);
    });

    testWidgets('$name: 오류면 error 색, 비활성이면 흐린 색이다', (WidgetTester tester) async {
      await pumpLabel(tester, const HoronLabel(label: '이메일', invalid: true), brightness: brightness);
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronLabel))).colorScheme;
      expect(labelColorOf(tester, '이메일'), scheme.error);

      await pumpLabel(tester, const HoronLabel(label: '이메일', disabled: true), brightness: brightness);
      expect(labelColorOf(tester, '이메일'), scheme.onSurface.withValues(alpha: 0.5));
    });

    testWidgets('$name: 필드 스코프의 상태를 따르고 명시 인자가 이긴다', (WidgetTester tester) async {
      await pumpLabel(
        tester,
        const HoronField(invalid: true, disabled: true, children: <Widget>[HoronLabel(label: '메일')]),
        brightness: brightness,
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronLabel))).colorScheme;
      expect(labelColorOf(tester, '메일'), scheme.onSurface.withValues(alpha: 0.5));

      await pumpLabel(tester, const HoronLabel(label: '메일', disabled: false), brightness: brightness);
      expect(labelColorOf(tester, '메일'), scheme.onSurface);
    });
  }

  testWidgets('아이콘과 뒤쪽 슬롯을 문구 양옆에 그린다', (WidgetTester tester) async {
    await pumpLabel(tester, const HoronLabel(label: '필수', icon: Icon(Icons.star), child: Text('(선택)')));

    expect(find.byIcon(Icons.star), findsOneWidget);
    expect(find.text('필수'), findsOneWidget);
    expect(find.text('(선택)'), findsOneWidget);

    final double iconX = tester.getTopLeft(find.byIcon(Icons.star)).dx;
    final double textX = tester.getTopLeft(find.text('필수')).dx;
    final double suffixX = tester.getTopLeft(find.text('(선택)')).dx;
    expect(iconX, lessThan(textX));
    expect(textX, lessThan(suffixX));
  });

  testWidgets('문구가 길어도 넘치지 않는다', (WidgetTester tester) async {
    await pumpLabel(tester, const SizedBox(width: 120, child: HoronLabel(label: '아주 긴 라벨 문구가 좁은 폭에서 잘린다')));

    expect(tester.takeException(), isNull);
  });
}
