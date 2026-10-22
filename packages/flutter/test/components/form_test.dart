import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `form`의 검증·오류 표시·비활성 전파를 확인합니다.
void main() {
  Future<void> pumpForm(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SizedBox(width: 320, child: child)),
        ),
      ),
    );
  }

  /// 이름 필드 하나를 가진 폼입니다. 빈 값을 거부합니다.
  Widget buildForm(GlobalKey<HoronFormState> key, {bool enabled = true, bool withTextarea = false}) {
    return HoronForm(
      key: key,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          HoronFormField(
            name: 'email',
            enabled: enabled,
            validator: (String? value) => (value == null || value.isEmpty) ? '이메일을 입력해 주세요' : null,
            builder: (BuildContext context, FormFieldState<String> field) {
              return HoronFormItem(
                children: <Widget>[
                  const HoronFormLabel(label: '이메일'),
                  HoronFormControl(
                    child: HoronInput(hintText: 'name@horon.ai', onChanged: field.didChange),
                  ),
                  const HoronFormDescription(description: '로그인에 쓰는 주소입니다'),
                  const HoronFormMessage(),
                ],
              );
            },
          ),
          if (withTextarea)
            HoronFormField(
              name: 'memo',
              builder: (BuildContext context, FormFieldState<String> field) {
                return HoronFormControl(child: HoronTextarea(hintText: '메모'));
              },
            ),
        ],
      ),
    );
  }

  for (final Brightness brightness in Brightness.values) {
    final String name = brightness == Brightness.light ? '라이트' : '다크';

    testWidgets('$name: 빈 필수 필드로 제출하면 오류 문구가 그려진다', (WidgetTester tester) async {
      final GlobalKey<HoronFormState> key = GlobalKey<HoronFormState>();
      bool? submitted;
      await pumpForm(
        tester,
        HoronForm(
          key: key,
          onSubmit: (bool valid) => submitted = valid,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              HoronFormField(
                name: 'email',
                validator: (String? value) => (value == null || value.isEmpty) ? '이메일을 입력해 주세요' : null,
                builder: (BuildContext context, FormFieldState<String> field) {
                  return HoronFormItem(
                    children: <Widget>[
                      const HoronFormLabel(label: '이메일'),
                      HoronFormControl(
                        child: HoronInput(hintText: 'name@horon.ai', onChanged: field.didChange),
                      ),
                      const HoronFormMessage(),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
        brightness: brightness,
      );

      expect(find.text('이메일을 입력해 주세요'), findsNothing);

      key.currentState!.submit();
      await tester.pump();

      expect(submitted, isFalse);
      expect(find.text('이메일을 입력해 주세요'), findsOneWidget);

      // 오류가 있으면 라벨도 destructive 색이 됩니다.
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronFormLabel))).colorScheme;
      final Text label = tester.widget<Text>(find.text('이메일'));
      expect(label.style!.color, scheme.error);
    });

    testWidgets('$name: 값을 채우면 오류가 사라진다', (WidgetTester tester) async {
      final GlobalKey<HoronFormState> key = GlobalKey<HoronFormState>();
      await pumpForm(tester, buildForm(key), brightness: brightness);

      key.currentState!.submit();
      await tester.pump();
      expect(find.text('이메일을 입력해 주세요'), findsOneWidget);

      await tester.enterText(find.byType(TextField), 'minyeol@horon.ai');
      key.currentState!.submit();
      await tester.pump();

      expect(find.text('이메일을 입력해 주세요'), findsNothing);
    });

    testWidgets('$name: 비활성 필드는 오류를 표시하지 않고 입력도 받지 않는다', (WidgetTester tester) async {
      final GlobalKey<HoronFormState> key = GlobalKey<HoronFormState>();
      await pumpForm(tester, buildForm(key, enabled: false), brightness: brightness);

      expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
      key.currentState!.submit();
      await tester.pump();
      expect(find.text('이메일을 입력해 주세요'), findsNothing);
    });
  }

  testWidgets('FormControl이 오류를 컨트롤의 테두리로 내려보낸다', (WidgetTester tester) async {
    final GlobalKey<HoronFormState> key = GlobalKey<HoronFormState>();
    await pumpForm(tester, buildForm(key, withTextarea: true));

    key.currentState!.submit();
    await tester.pump();

    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronInput), matching: find.byType(DecoratedBox)).first,
    );
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronInput))).colorScheme;
    expect((box.decoration as BoxDecoration).border!.top.color, scheme.error);
  });

  testWidgets('FormMessage는 오류가 없으면 높이를 차지하지 않는다', (WidgetTester tester) async {
    final GlobalKey<HoronFormState> key = GlobalKey<HoronFormState>();
    await pumpForm(tester, buildForm(key));

    expect(tester.getSize(find.byType(HoronFormMessage)).height, 0);
  });

  testWidgets('reset은 필드를 처음 값으로 되돌린다', (WidgetTester tester) async {
    final GlobalKey<HoronFormState> key = GlobalKey<HoronFormState>();
    await pumpForm(tester, buildForm(key));

    key.currentState!.submit();
    await tester.pump();
    expect(find.text('이메일을 입력해 주세요'), findsOneWidget);

    key.currentState!.reset();
    await tester.pump();
    expect(find.text('이메일을 입력해 주세요'), findsNothing);
  });
}
