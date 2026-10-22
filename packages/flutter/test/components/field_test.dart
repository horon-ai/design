import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/field.dart';
import 'package:horon_ui/src/components/input.dart';

/// `field`의 부품·간격·상태를 확인합니다.
void main() {
  Future<void> pumpField(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SizedBox(width: 320, child: child)),
        ),
      ),
    );
  }

  for (final Brightness brightness in Brightness.values) {
    final String name = brightness == Brightness.light ? '라이트' : '다크';

    testWidgets('$name: 라벨·컨트롤·설명을 세로로 쌓는다', (WidgetTester tester) async {
      await pumpField(
        tester,
        HoronField(
          children: <Widget>[
            const HoronFieldLabel(label: '이메일'),
            const HoronInput(hintText: 'name@horon.ai'),
            const HoronFieldDescription(description: '로그인에 쓰는 주소입니다'),
          ],
        ),
        brightness: brightness,
      );

      expect(find.text('이메일'), findsOneWidget);
      expect(find.byType(HoronInput), findsOneWidget);
      expect(find.text('로그인에 쓰는 주소입니다'), findsOneWidget);

      // 세로 순서: 라벨 → 입력 → 설명
      final double labelY = tester.getTopLeft(find.text('이메일')).dy;
      final double inputY = tester.getTopLeft(find.byType(HoronInput)).dy;
      final double descriptionY = tester.getTopLeft(find.text('로그인에 쓰는 주소입니다')).dy;
      expect(labelY, lessThan(inputY));
      expect(inputY, lessThan(descriptionY));
    });

    testWidgets('$name: 오류가 있으면 FieldError가 error 색으로 그려진다', (WidgetTester tester) async {
      await pumpField(
        tester,
        HoronField(
          invalid: true,
          children: <Widget>[
            const HoronFieldLabel(label: '이메일'),
            const HoronInput(hintText: 'name@horon.ai'),
            const HoronFieldError(message: '이메일을 입력해 주세요'),
          ],
        ),
        brightness: brightness,
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronField))).colorScheme;
      final Text error = tester.widget<Text>(find.text('이메일을 입력해 주세요'));
      expect(error.style!.color, scheme.error);
      expect(find.byType(HoronFieldError), findsOneWidget);
    });

    testWidgets('$name: 비활성 필드의 라벨은 흐려지고 컨트롤도 비활성이다', (WidgetTester tester) async {
      await pumpField(
        tester,
        HoronField(
          disabled: true,
          children: <Widget>[
            const HoronFieldLabel(label: '이메일'),
            const HoronInput(hintText: '메일'),
          ],
        ),
        brightness: brightness,
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronField))).colorScheme;
      final Text label = tester.widget<Text>(find.text('이메일'));
      expect(label.style!.color, scheme.onSurface.withValues(alpha: 0.5));
      expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
    });
  }

  testWidgets('오류 문구가 없으면 FieldError는 높이를 차지하지 않는다', (WidgetTester tester) async {
    await pumpField(tester, const HoronFieldError());

    expect(find.byType(HoronFieldError), findsOneWidget);
    expect(tester.getSize(find.byType(HoronFieldError)).height, 0);
  });

  testWidgets('FieldGroup과 FieldSet은 자식을 간격을 두고 쌓는다', (WidgetTester tester) async {
    await pumpField(
      tester,
      HoronFieldGroup(
        children: <Widget>[
          const HoronField(children: <Widget>[HoronFieldLabel(label: '하나')]),
          HoronFieldSet(
            legend: const HoronFieldLabel(label: '묶음'),
            children: <Widget>[
              const HoronField(children: <Widget>[HoronFieldLabel(label: '둘')]),
            ],
          ),
        ],
      ),
    );

    final double first = tester.getTopLeft(find.text('하나')).dy;
    final double legend = tester.getTopLeft(find.text('묶음')).dy;
    final double second = tester.getTopLeft(find.text('둘')).dy;
    expect(first, lessThan(legend));
    expect(legend, lessThan(second));
    expect(second - legend, greaterThan(HoronSpace.s2));
  });
}
