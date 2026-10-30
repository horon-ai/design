import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 메시지 입력 알약의 계약을 확인합니다.
///
/// React `composer.tsx`: regular 유리 알약(여백 8, 간격 8)에 40px 첨부 버튼, 입력칸, 그리고
/// 글이 없으면 음성 버튼, 있으면 잉크색 전송 버튼이 들어갑니다.
Widget _host(Brightness brightness, Widget child, {double width = 600}) {
  return MaterialApp(
    // 밝기를 바꿀 때 AnimatedTheme가 이전 색에서 보간하지 않도록 트리를 새로 만듭니다.
    key: ValueKey<Brightness>(brightness),
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: width),
          child: child,
        ),
      ),
    ),
  );
}

Key? _visibleButtonKey(WidgetTester tester) =>
    tester.widget<AnimatedSwitcher>(find.byType(AnimatedSwitcher)).child?.key;

void main() {
  final HoronColors colors = HoronThemeData.light.colors;
  const HoronSpaceSpec space = HoronSpaceSpec();

  testWidgets('라이트와 다크에서 기본 상태가 예외 없이 그려진다', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(brightness, const HoronComposer()));
      expect(tester.takeException(), isNull);
      expect(find.byIcon(Icons.add), findsOneWidget);
      expect(find.byIcon(Icons.mic_none), findsOneWidget);
      expect(find.byIcon(Icons.arrow_upward), findsNothing);
    }
  });

  testWidgets('알약은 regular 유리, 56 높이, 20px 아이콘을 쓴다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronComposer()));

    expect(tester.getSize(find.byKey(const Key('horon-composer'))).height, space.s2 + 40 + space.s2);
    final ColoredBox fill = tester.widget<ColoredBox>(
      find.descendant(of: find.byKey(const Key('horon-composer')), matching: find.byType(ColoredBox)).first,
    );
    expect(fill.color, colors.glassRegular);

    final Icon attach = tester.widget<Icon>(find.byIcon(Icons.add));
    expect(attach.size, 20);
    expect(attach.color, colors.textPrimary);
    final Icon voice = tester.widget<Icon>(find.byIcon(Icons.mic_none));
    expect(voice.size, 20);
    expect(voice.color, colors.textSecondary);
  });

  testWidgets('입력칸은 bodyMd 글자와 placeholder 색을 쓴다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronComposer(placeholder: 'Message to bot')));

    final TextField field = tester.widget<TextField>(find.byType(TextField));
    expect(field.style!.fontSize, 16);
    expect(field.style!.color, colors.textPrimary);
    expect(field.decoration!.hintText, 'Message to bot');
    expect(field.decoration!.hintStyle!.fontSize, 16);
    expect(field.decoration!.hintStyle!.color, colors.textPlaceholder);
  });

  testWidgets('글이 생기면 음성 버튼이 전송 버튼으로 바뀐다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronComposer()));
    expect(_visibleButtonKey(tester), const ValueKey<String>('horon-composer-voice'));

    await tester.enterText(find.byType(TextField), '안녕하세요');
    await tester.pump();

    expect(_visibleButtonKey(tester), const ValueKey<String>('horon-composer-send'));
    expect(find.byIcon(Icons.arrow_upward), findsOneWidget);
  });

  testWidgets('전송하면 값이 올라가고 입력칸이 비워진다', (WidgetTester tester) async {
    final TextEditingController controller = TextEditingController();
    addTearDown(controller.dispose);
    final List<String> submitted = <String>[];
    await tester.pumpWidget(_host(Brightness.light, HoronComposer(controller: controller, onSubmit: submitted.add)));

    await tester.enterText(find.byType(TextField), 'Hello');
    await tester.pump();
    await tester.tap(find.byIcon(Icons.arrow_upward));
    await tester.pump();

    expect(submitted, <String>['Hello']);
    expect(controller.text, isEmpty);
    expect(_visibleButtonKey(tester), const ValueKey<String>('horon-composer-voice'));
  });

  testWidgets('빈 값과 공백만 있는 값은 전송하지 않는다', (WidgetTester tester) async {
    final List<String> submitted = <String>[];
    await tester.pumpWidget(_host(Brightness.light, HoronComposer(onSubmit: submitted.add)));

    await tester.testTextInput.receiveAction(TextInputAction.send);
    await tester.pump();
    expect(submitted, isEmpty);

    await tester.enterText(find.byType(TextField), '   ');
    await tester.pump();
    // 공백뿐이면 전송 버튼이 나타나지 않습니다.
    expect(_visibleButtonKey(tester), const ValueKey<String>('horon-composer-voice'));
    await tester.testTextInput.receiveAction(TextInputAction.send);
    await tester.pump();
    expect(submitted, isEmpty);
  });

  testWidgets('첨부와 음성 버튼이 각자의 콜백을 부른다', (WidgetTester tester) async {
    int attaches = 0;
    int voices = 0;
    await tester.pumpWidget(
      _host(Brightness.light, HoronComposer(onAttach: () => attaches++, onVoice: () => voices++)),
    );

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();
    expect(attaches, 1);

    await tester.tap(find.byIcon(Icons.mic_none));
    await tester.pump();
    expect(voices, 1);
  });

  testWidgets('비활성이면 흐려지고 입력칸과 버튼이 막힌다', (WidgetTester tester) async {
    int attaches = 0;
    await tester.pumpWidget(_host(Brightness.light, HoronComposer(disabled: true, onAttach: () => attaches++)));

    expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
    final Opacity opacity = tester.widget<Opacity>(
      find.ancestor(of: find.byIcon(Icons.add), matching: find.byType(Opacity)).first,
    );
    expect(opacity.opacity, 0.4);

    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();
    expect(attaches, 0);
    expect(tester.takeException(), isNull);
  });

  testWidgets('좁은 폭에서도 입력칸이 남고 넘치지 않는다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronComposer(), width: 320));
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(TextField)).width, greaterThan(100));
    expect(tester.getSize(find.byKey(const Key('horon-composer'))).width, 320);
  });
}
