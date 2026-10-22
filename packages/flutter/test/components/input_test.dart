import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/field.dart';
import 'package:horon_ui/src/components/input.dart';

/// `input`의 값·상태·모양을 확인합니다.
///
/// 모양은 위젯 이름이 아니라 그려진 테두리 색으로 판정합니다. 색이 테마에서 오는지
/// 보려면 `BoxDecoration`을 읽는 편이 위젯 트리 모양보다 오래 살아남습니다.
void main() {
  Future<void> pumpInput(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SizedBox(width: 280, child: child)),
        ),
      ),
    );
  }

  /// [HoronInput]이 그린 테두리 색입니다.
  Color borderColorOf(WidgetTester tester) {
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronInput), matching: find.byType(DecoratedBox)).first,
    );
    return (box.decoration as BoxDecoration).border!.top.color;
  }

  /// [HoronInput]이 그린 채움 색입니다.
  Color fillColorOf(WidgetTester tester) {
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronInput), matching: find.byType(DecoratedBox)).first,
    );
    return (box.decoration as BoxDecoration).color!;
  }

  /// React `aria-invalid:border-destructive`(다크는 `/50`)입니다.
  Color invalidBorderOf(ColorScheme scheme, Brightness brightness) =>
      brightness == Brightness.dark ? scheme.error.withValues(alpha: 0.5) : scheme.error;

  /// 지금 그려진 [TextField]입니다.
  TextField textFieldOf(WidgetTester tester) => tester.widget<TextField>(find.byType(TextField));

  for (final Brightness brightness in Brightness.values) {
    final String name = brightness == Brightness.light ? '라이트' : '다크';

    testWidgets('$name: 값을 입력하면 onChanged가 그 값을 받는다', (WidgetTester tester) async {
      final List<String> changes = <String>[];
      await pumpInput(
        tester,
        HoronInput(hintText: '이메일', onChanged: changes.add),
        brightness: brightness,
      );

      expect(find.text('이메일'), findsOneWidget);
      await tester.enterText(find.byType(TextField), 'minyeol@horon.ai');
      await tester.pump();

      expect(changes, <String>['minyeol@horon.ai']);
      expect(find.text('minyeol@horon.ai'), findsOneWidget);
    });

    testWidgets('$name: 오류 상태면 테두리가 destructive 색이다', (WidgetTester tester) async {
      await pumpInput(tester, const HoronInput(hintText: '이메일', invalid: true), brightness: brightness);

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronInput))).colorScheme;
      expect(borderColorOf(tester), invalidBorderOf(scheme, brightness));
    });

    testWidgets('$name: 비활성 필드는 입력도 포커스도 받지 않는다', (WidgetTester tester) async {
      final List<String> changes = <String>[];
      await pumpInput(
        tester,
        HoronInput(hintText: '이메일', disabled: true, onChanged: changes.add),
        brightness: brightness,
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronInput))).colorScheme;
      expect(borderColorOf(tester), scheme.outline);
      expect(fillColorOf(tester), isNot(scheme.surfaceContainerLow));

      await tester.tap(find.byType(TextField));
      await tester.pump();

      expect(changes, isEmpty);
      expect(textFieldOf(tester).enabled, isFalse);
      expect(textFieldOf(tester).focusNode?.hasFocus ?? false, isFalse);
    });

    testWidgets('$name: 필드 스코프의 오류·비활성을 따르고 명시 인자가 이긴다', (WidgetTester tester) async {
      await pumpInput(
        tester,
        HoronField(
          invalid: true,
          disabled: true,
          children: <Widget>[
            const HoronFieldLabel(label: '메일'),
            const HoronInput(hintText: '메일'),
          ],
        ),
        brightness: brightness,
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronInput))).colorScheme;
      expect(borderColorOf(tester), invalidBorderOf(scheme, brightness));
      expect(textFieldOf(tester).enabled, isFalse);

      await pumpInput(
        tester,
        HoronField(invalid: true, children: <Widget>[const HoronInput(hintText: '메일', invalid: false)]),
        brightness: brightness,
      );
      expect(borderColorOf(tester), scheme.outline);
    });
  }

  testWidgets('prefix와 suffix 슬롯이 입력 양옆에 그려진다', (WidgetTester tester) async {
    await pumpInput(tester, const HoronInput(hintText: '금액', prefix: Text('₩'), suffix: Text('원')));

    expect(find.text('₩'), findsOneWidget);
    expect(find.text('원'), findsOneWidget);
    expect(find.byType(TextField), findsOneWidget);
  });

  testWidgets('필드 높이가 React의 h-[37px]이다', (WidgetTester tester) async {
    await pumpInput(tester, const HoronInput(hintText: '높이'));

    final Size fieldSize = tester.getSize(
      find.ancestor(of: find.byType(TextField), matching: find.byType(SizedBox)).first,
    );
    expect(fieldSize.height, 37);
  });

  testWidgets('readOnly면 값을 고칠 수 없다', (WidgetTester tester) async {
    final TextEditingController controller = TextEditingController(text: '고정');
    addTearDown(controller.dispose);
    await pumpInput(tester, HoronInput(controller: controller, readOnly: true));

    await tester.enterText(find.byType(TextField), '바뀜');
    await tester.pump();

    expect(controller.text, '고정');
    expect(textFieldOf(tester).readOnly, isTrue);
  });
}
