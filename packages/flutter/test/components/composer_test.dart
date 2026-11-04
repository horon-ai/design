import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 메시지 입력 알약의 계약을 확인합니다.
///
/// React `composer.tsx`: veil-field 알약(여백 8, 간격 8)에 40px 첨부 버튼, 입력칸, 그리고
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

Key? _visibleButtonKey(WidgetTester tester) => _liveIcon(tester, Icons.arrow_upward)
    ? const ValueKey<String>('horon-composer-send')
    : const ValueKey<String>('horon-composer-voice');

/// [icon]을 그린 버튼이 지금 눌리는지 여부입니다. `HoronSwap`은 숨은 쪽을
/// `IgnorePointer`로 감싸 두므로(React `inert`), 가장 가까운 `IgnorePointer`의
/// `ignoring`으로 지금 보이는 쪽을 가릅니다.
bool _liveIcon(WidgetTester tester, IconData icon) {
  final Finder ignore = find.ancestor(of: find.byIcon(icon), matching: find.byType(IgnorePointer)).first;
  return !tester.widget<IgnorePointer>(ignore).ignoring;
}

void main() {
  final HoronColors colors = HoronThemeData.light.colors;
  const HoronSpaceSpec space = HoronSpaceSpec();

  testWidgets('라이트와 다크에서 기본 상태가 예외 없이 그려진다', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(brightness, const HoronComposer()));
      expect(tester.takeException(), isNull);
      expect(find.byIcon(Icons.add), findsOneWidget);
      expect(find.byIcon(Icons.mic_none), findsOneWidget);
      // React `motion-swap`은 두 버튼을 모두 트리에 두고 숨은 쪽만 막습니다.
      expect(_liveIcon(tester, Icons.mic_none), isTrue);
      expect(_liveIcon(tester, Icons.arrow_upward), isFalse);
    }
  });

  testWidgets('알약은 veil-field, 56 높이, 20px 아이콘을 쓴다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronComposer(surface: HoronComposerSurface.glass)));

    expect(tester.getSize(find.byKey(const Key('horon-composer'))).height, space.s2 + 40 + space.s2);
    // React `composer.tsx`의 `veil-field`와 같은 재료를 씁니다. 액체 유리를 겹치지 않습니다.
    expect(find.byType(HoronLiquidGlass), findsNothing);
    final HoronVeil veil = tester.widget<HoronVeil>(find.byType(HoronVeil));
    expect(veil.kind, HoronVeilKind.field);

    final Icon attach = tester.widget<Icon>(find.byIcon(Icons.add));
    expect(attach.size, 20);
    expect(attach.color, colors.textSecondary); // Plus className="text-text-secondary"
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

  testWidgets('입력칸이 포커스를 받으면 solid 알약 테두리가 border-strong이 된다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronComposer()));

    BoxDecoration surface() =>
        tester
                .widget<AnimatedContainer>(
                  find
                      .descendant(of: find.byKey(const Key('horon-composer')), matching: find.byType(AnimatedContainer))
                      .first,
                )
                .decoration!
            as BoxDecoration;

    expect((surface().border! as Border).top.color, colors.borderDefault);

    // has-[input:focus-visible]:border-border-strong
    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    expect((surface().border! as Border).top.color, colors.borderStrong);
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
    expect(tester.widget<TextField>(find.byType(TextField)).style!.color, colors.textDisabled);
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
