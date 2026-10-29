import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/split_button.dart';

/// 나뉜 버튼의 계약을 확인합니다.
///
/// React `split-button.tsx`: primary 알약 하나(높이 32)를 1x18 막대로 나누고, 왼쪽에는 16px
/// 아이콘과 라벨, 오른쪽에는 14px 캐럿이 들어갑니다.
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

Finder _pill() => find.byKey(const Key('horon-split-button'));

void main() {
  final HoronColors colors = HoronThemeData.light.colors;
  const HoronRadiusSpec radius = HoronRadiusSpec();
  const HoronSpaceSpec space = HoronSpaceSpec();

  testWidgets('라이트와 다크에서 기본 상태가 예외 없이 그려진다', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(brightness, const HoronSplitButton(label: 'Run', onPressed: _noop, onMenuPressed: _noop)),
      );
      expect(tester.takeException(), isNull);
      expect(find.text('Run'), findsOneWidget);
      expect(find.byIcon(Icons.expand_more), findsOneWidget);
    }
  });

  testWidgets('알약은 32 높이, primary 배경, 완전 반경이다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronSplitButton(label: 'Run', onPressed: _noop)));

    expect(tester.getSize(_pill()).height, space.step(8));
    expect(tester.widget<ClipRRect>(_pill()).borderRadius, BorderRadius.circular(radius.full));
    final ColoredBox fill = tester.widget<ColoredBox>(
      find.descendant(of: _pill(), matching: find.byType(ColoredBox)).first,
    );
    expect(fill.color, colors.interactivePrimary);

    final Text label = tester.widget<Text>(find.text('Run'));
    expect(label.style!.fontSize, 14);
    expect(label.style!.fontWeight, HoronFontWeight.medium);
    expect(label.style!.color, colors.interactiveOnPrimary);
  });

  testWidgets('아이콘은 16, 캐럿은 14, 막대는 1x18이다', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        Brightness.light,
        const HoronSplitButton(label: 'Run', icon: Icon(Icons.play_arrow), onPressed: _noop, onMenuPressed: _noop),
      ),
    );

    final Icon leading = tester.widget<Icon>(find.byIcon(Icons.play_arrow));
    expect(leading.size, isNull, reason: '크기는 IconTheme가 정합니다');
    expect(tester.getSize(find.byIcon(Icons.play_arrow)).height, 16);
    final Icon caret = tester.widget<Icon>(find.byIcon(Icons.expand_more));
    expect(caret.size, space.s3_5);
    expect(caret.color, colors.interactiveOnPrimary);

    final Size divider = tester.getSize(find.byKey(const Key('horon-split-button-divider')));
    expect(divider, Size(1, space.step(4.5)));
    final Container bar = tester.widget<Container>(find.byKey(const Key('horon-split-button-divider')));
    expect(bar.color, colors.interactiveOnPrimary.withValues(alpha: 0.25));
  });

  testWidgets('왼쪽은 onPressed, 캐럿은 onMenuPressed를 부른다', (WidgetTester tester) async {
    int pressed = 0;
    int menus = 0;
    await tester.pumpWidget(
      _host(Brightness.light, HoronSplitButton(label: 'Run', onPressed: () => pressed++, onMenuPressed: () => menus++)),
    );

    await tester.tap(find.text('Run'));
    await tester.pump();
    expect(pressed, 1);
    expect(menus, 0);

    await tester.tap(find.byIcon(Icons.expand_more));
    await tester.pump();
    expect(pressed, 1);
    expect(menus, 1);
  });

  testWidgets('비활성이면 흐려지고 아무 콜백도 오지 않는다', (WidgetTester tester) async {
    int pressed = 0;
    int menus = 0;
    await tester.pumpWidget(
      _host(
        Brightness.light,
        HoronSplitButton(label: 'Run', disabled: true, onPressed: () => pressed++, onMenuPressed: () => menus++),
      ),
    );

    final Opacity opacity = tester.widget<Opacity>(
      find.ancestor(of: find.text('Run'), matching: find.byType(Opacity)).first,
    );
    expect(opacity.opacity, 0.4);

    await tester.tap(find.text('Run'));
    await tester.tap(find.byIcon(Icons.expand_more));
    await tester.pump();
    expect(pressed, 0);
    expect(menus, 0);
    expect(tester.takeException(), isNull);
  });

  testWidgets('menuOpen이면 캐럿이 180도 돌아간다', (WidgetTester tester) async {
    await tester.pumpWidget(_host(Brightness.light, const HoronSplitButton(label: 'Run', menuOpen: true)));
    final AnimatedRotation rotation = tester.widget<AnimatedRotation>(find.byType(AnimatedRotation));
    expect(rotation.turns, 0.5);

    await tester.pumpWidget(_host(Brightness.light, const HoronSplitButton(label: 'Run')));
    expect(tester.widget<AnimatedRotation>(find.byType(AnimatedRotation)).turns, 0);
  });

  testWidgets('좁은 폭에서는 라벨이 줄어들고 넘치지 않는다', (WidgetTester tester) async {
    const HoronSplitButton long = HoronSplitButton(label: 'Regenerate the whole workspace summary');
    await tester.pumpWidget(_host(Brightness.light, long, width: 320));
    expect(tester.takeException(), isNull);
    expect(tester.getSize(_pill()).width, lessThanOrEqualTo(320));
  });
}

void _noop() {}
