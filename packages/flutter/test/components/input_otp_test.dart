import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/input_otp.dart';

/// `input_otp`의 칸 그리기·붙여넣기·완료 콜백을 확인합니다.
///
/// 실제 입력은 칸 뒤에 놓인 투명한 [TextField]가 받습니다. 그래서 테스트도 그 필드에
/// 글자를 넣고, 화면에 그려진 칸의 글자로 결과를 판정합니다.
void main() {
  /// 자리를 여섯 개 가진 코드 입력을 만듭니다.
  Widget otp({
    TextEditingController? controller,
    ValueChanged<String>? onChanged,
    ValueChanged<String>? onCompleted,
    bool disabled = false,
    bool autofocus = false,
  }) {
    return HoronInputOtp(
      length: 6,
      controller: controller,
      disabled: disabled,
      autofocus: autofocus,
      onChanged: onChanged,
      onCompleted: onCompleted,
      children: <Widget>[
        HoronInputOtpGroup(
          children: <Widget>[
            const HoronInputOtpSlot(index: 0),
            const HoronInputOtpSlot(index: 1),
            const HoronInputOtpSlot(index: 2),
          ],
        ),
        const HoronInputOtpSeparator(),
        HoronInputOtpGroup(
          children: <Widget>[
            const HoronInputOtpSlot(index: 3),
            HoronInputOtpSlot(index: 4),
            HoronInputOtpSlot(index: 5),
          ],
        ),
      ],
    );
  }

  Future<void> pumpOtp(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(body: Center(child: child)),
      ),
    );
  }

  /// [index]번째 칸에 그려진 글자입니다. 없으면 빈 문자열입니다.
  String slotText(WidgetTester tester, int index) {
    final Finder slot = find.byType(HoronInputOtpSlot).at(index);
    final Iterable<Text> texts = tester.widgetList<Text>(find.descendant(of: slot, matching: find.byType(Text)));
    return texts.isEmpty ? '' : (texts.first.data ?? '');
  }

  /// 지금 그려진 칸의 글자를 자리 순서대로 이어 붙입니다.
  String codeShown(WidgetTester tester) {
    final int count = find.byType(HoronInputOtpSlot).evaluate().length;
    return <String>[for (int index = 0; index < count; index++) slotText(tester, index)].join();
  }

  testWidgets('여섯 칸과 구분자가 그려진다', (WidgetTester tester) async {
    await pumpOtp(tester, otp());

    expect(find.byType(HoronInputOtpSlot), findsNWidgets(6));
    expect(find.byType(HoronInputOtpGroup), findsNWidgets(2));
    expect(find.byType(HoronInputOtpSeparator), findsOneWidget);
    expect(codeShown(tester), '');

    // React `size-9` - 한 칸은 36입니다.
    expect(tester.getSize(find.byType(HoronInputOtpSlot).first).width, 36);
    expect(tester.getSize(find.byType(HoronInputOtpSlot).first).height, 36);
  });

  testWidgets('숫자를 넣으면 자리 순서대로 칸에 나타난다', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await pumpOtp(tester, otp(onChanged: changes.add));

    await tester.enterText(find.byType(TextField), '1234');
    await tester.pump();

    expect(codeShown(tester), '1234');
    expect(slotText(tester, 4), '');
    expect(changes.last, '1234');
  });

  testWidgets('여섯 자리를 다 채우면 완료 콜백이 그 코드로 불린다', (WidgetTester tester) async {
    final List<String> completed = <String>[];
    await pumpOtp(tester, otp(onCompleted: completed.add));

    await tester.enterText(find.byType(TextField), '482913');
    await tester.pump();

    expect(completed, <String>['482913']);
    expect(codeShown(tester), '482913');
  });

  group('실패 경로', () {
    testWidgets('문자를 붙여넣으면 숫자만 남는다', (WidgetTester tester) async {
      final TextEditingController controller = TextEditingController();
      addTearDown(controller.dispose);
      final List<String> completed = <String>[];
      await pumpOtp(tester, otp(controller: controller, onCompleted: completed.add));

      // 문자와 숫자가 섞인 붙여넣기입니다. React `input-otp`의 기본 pattern은 숫자입니다.
      await tester.enterText(find.byType(TextField), 'a4b8c2');
      await tester.pump();

      expect(controller.text, '482');
      expect(codeShown(tester), '482');
      expect(completed, isEmpty);
    });

    testWidgets('컨트롤러에 직접 문자를 넣어도 칸에는 숫자만 보인다', (WidgetTester tester) async {
      final TextEditingController controller = TextEditingController();
      addTearDown(controller.dispose);
      await pumpOtp(tester, otp(controller: controller));

      // 입력 서식을 거치지 않는 경로입니다. 위젯 자체가 숫자만 남겨야 합니다.
      controller.text = 'x9y8z7';
      await tester.pump();

      expect(codeShown(tester), '987');
      expect(controller.text, '987');
    });

    testWidgets('자릿수보다 긴 입력은 잘린다', (WidgetTester tester) async {
      final TextEditingController controller = TextEditingController();
      addTearDown(controller.dispose);
      final List<String> completed = <String>[];
      await pumpOtp(tester, otp(controller: controller, onCompleted: completed.add));

      await tester.enterText(find.byType(TextField), '1234567890');
      await tester.pump();

      expect(controller.text, '123456');
      expect(codeShown(tester), '123456');
      expect(completed, <String>['123456']);
    });

    testWidgets('비활성 필드는 입력을 받지 않는다', (WidgetTester tester) async {
      final TextEditingController controller = TextEditingController();
      addTearDown(controller.dispose);
      final List<String> completed = <String>[];
      await pumpOtp(tester, otp(controller: controller, disabled: true, onCompleted: completed.add));

      await tester.enterText(find.byType(TextField), '123456');
      await tester.pump();

      expect(controller.text, isEmpty);
      expect(completed, isEmpty);
      expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
    });

    testWidgets('문자만 붙여넣으면 아무것도 들어가지 않는다', (WidgetTester tester) async {
      final TextEditingController controller = TextEditingController();
      addTearDown(controller.dispose);
      final List<String> completed = <String>[];
      await pumpOtp(tester, otp(controller: controller, onCompleted: completed.add));

      await tester.enterText(find.byType(TextField), 'abcdef');
      await tester.pump();

      expect(controller.text, isEmpty);
      expect(codeShown(tester), '');
      expect(completed, isEmpty);
    });
  });

  testWidgets('그룹의 첫 칸만 왼쪽 테두리와 왼쪽 모서리를 갖는다', (WidgetTester tester) async {
    await pumpOtp(tester, otp());

    Border borderOf(int index) {
      final DecoratedBox box = tester.widget<DecoratedBox>(
        find.descendant(of: find.byType(HoronInputOtpSlot).at(index), matching: find.byType(DecoratedBox)).first,
      );
      return (box.decoration as BoxDecoration).border! as Border;
    }

    BorderRadius radiusOf(int index) {
      final DecoratedBox box = tester.widget<DecoratedBox>(
        find.descendant(of: find.byType(HoronInputOtpSlot).at(index), matching: find.byType(DecoratedBox)).first,
      );
      return (box.decoration as BoxDecoration).borderRadius! as BorderRadius;
    }

    // React `border-y border-r border-input first:rounded-l-sm first:border-l last:rounded-r-sm`
    expect(borderOf(0).left.width, 1);
    expect(borderOf(1).left, BorderSide.none);
    expect(borderOf(2).left, BorderSide.none);
    expect(borderOf(0).right.width, 1);

    expect(radiusOf(0).topLeft.x, HoronRadius.sm);
    expect(radiusOf(0).topRight.x, 0);
    expect(radiusOf(2).topRight.x, HoronRadius.sm);
    expect(radiusOf(2).topLeft.x, 0);

    // 두 번째 그룹도 자기 첫 칸(3번)에서 왼쪽 모서리가 둥급니다.
    expect(radiusOf(3).topLeft.x, HoronRadius.sm);
    expect(radiusOf(3).topRight.x, 0);
    expect(radiusOf(5).topRight.x, HoronRadius.sm);
  });

  testWidgets('포커스를 받은 칸에만 깜박이는 커서가 있다', (WidgetTester tester) async {
    await pumpOtp(tester, otp(autofocus: true));

    await tester.pump();
    expect(find.byKey(HoronInputOtp.caretKey), findsOneWidget);

    // 포커스를 잃으면 커서가 사라집니다.
    FocusManager.instance.primaryFocus?.unfocus();
    await tester.pumpAndSettle();
    expect(find.byKey(HoronInputOtp.caretKey), findsNothing);
  });

  for (final Brightness brightness in Brightness.values) {
    testWidgets('${brightness.name}: 두 밝기에서 예외 없이 그려진다', (WidgetTester tester) async {
      await pumpOtp(tester, otp(), brightness: brightness);
      expect(tester.takeException(), isNull);
      expect(find.byType(HoronInputOtpSlot), findsNWidgets(6));
    });
  }
}
