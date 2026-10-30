import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

const Key _targetKey = Key('tooltip-target');

Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 640}) {
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(
        child: SizedBox(width: width, child: child),
      ),
    ),
  );
}

Widget _tooltip({HoronOverlaySide side = HoronOverlaySide.top, Widget? label}) {
  return HoronTooltip(
    side: side,
    label: label ?? const Text('저장합니다'),
    child: const SizedBox(key: _targetKey, width: 80, height: 40, child: Text('Hover')),
  );
}

/// 마우스를 [target] 위로 옮깁니다. 툴팁은 hover에서 열립니다.
Future<TestGesture> _hover(WidgetTester tester, Finder target) async {
  final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
  await pointer.addPointer(location: Offset.zero);
  addTearDown(pointer.removePointer);
  await pointer.moveTo(tester.getCenter(target));
  await tester.pumpAndSettle();
  return pointer;
}

Container _bubble(WidgetTester tester) =>
    tester.widget<Container>(find.ancestor(of: find.text('저장합니다'), matching: find.byType(Container)).first);

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_tooltip(), brightness: brightness));
      expect(tester.takeException(), isNull, reason: '$brightness에서 예외가 없어야 합니다');
      // 열기 전에는 말풍선이 없습니다.
      expect(find.text('저장합니다'), findsNothing);
    }
  });

  testWidgets('hover opens the ink bubble with 10/6 padding, an 8px radius and label-sm', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_tooltip()));
    final TestGesture pointer = await _hover(tester, find.byKey(_targetKey));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.text('저장합니다')));

    final BoxDecoration decoration = _bubble(tester).decoration! as BoxDecoration;
    expect(decoration.color, theme.colors.interactivePrimary, reason: 'bg-interactive-primary');
    expect(decoration.borderRadius! as BorderRadius, BorderRadius.circular(theme.radius.sm), reason: 'rounded-sm');
    expect((_bubble(tester).padding! as EdgeInsets), const EdgeInsets.symmetric(horizontal: 10, vertical: 6));

    final TextStyle style = DefaultTextStyle.of(tester.element(find.text('저장합니다'))).style;
    expect(style.fontSize, theme.text.labelSm.fontSize, reason: 'text-label-sm');
    expect(style.color, theme.colors.interactiveOnPrimary, reason: 'text-interactive-on-primary');

    // 마우스가 떠나면 닫힙니다.
    await pointer.moveTo(Offset.zero);
    await tester.pumpAndSettle();
    expect(find.text('저장합니다'), findsNothing);
  });

  testWidgets('each side puts the bubble on that side of the trigger', (WidgetTester tester) async {
    for (final HoronOverlaySide side in HoronOverlaySide.values) {
      await tester.pumpWidget(_host(_tooltip(side: side)));
      final TestGesture pointer = await _hover(tester, find.byKey(_targetKey));
      final Rect target = tester.getRect(find.byKey(_targetKey));
      final Rect label = tester.getRect(find.text('저장합니다'));

      switch (side) {
        case HoronOverlaySide.top:
          expect(label.bottom, lessThan(target.top), reason: 'top: 말풍선이 위에 있습니다');
        case HoronOverlaySide.bottom:
          expect(label.top, greaterThan(target.bottom), reason: 'bottom: 말풍선이 아래에 있습니다');
        case HoronOverlaySide.left:
          expect(label.right, lessThan(target.left), reason: 'left: 말풍선이 왼쪽에 있습니다');
        case HoronOverlaySide.right:
          expect(label.left, greaterThan(target.right), reason: 'right: 말풍선이 오른쪽에 있습니다');
      }

      // 화살표(6px)가 말풍선과 트리거 사이를 채웁니다. label-sm 여백 6 + 화살표 6 = 12.
      if (side == HoronOverlaySide.top) {
        expect(target.top - label.bottom, closeTo(12, 0.5), reason: 'sideOffset 6 + 화살표 6');
      }

      await pointer.moveTo(Offset.zero);
      await tester.pumpAndSettle();
    }
  });

  testWidgets('a long label wraps inside the screen instead of overflowing at 320', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_tooltip(label: const Text('아주 긴 설명이 들어와도 말풍선은 화면 폭 안에서 접힙니다')), width: 320));
    await _hover(tester, find.byKey(_targetKey));
    expect(tester.takeException(), isNull);
    final Rect bubble = tester.getRect(
      find.ancestor(of: find.text('아주 긴 설명이 들어와도 말풍선은 화면 폭 안에서 접힙니다'), matching: find.byType(Container)).first,
    );
    expect(bubble.width, lessThanOrEqualTo(320));
  });

  testWidgets('the provider supplies the default delay to its tooltips', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        const HoronTooltipProvider(
          delay: Duration(milliseconds: 300),
          child: HoronTooltip(
            label: Text('저장합니다'),
            child: SizedBox(key: _targetKey, width: 80, height: 40),
          ),
        ),
      ),
    );
    final HoronTooltipProvider? provider = HoronTooltipProvider.maybeOf(tester.element(find.byType(HoronTooltip)));
    expect(provider, isNotNull);
    expect(provider!.delay, const Duration(milliseconds: 300));
    expect(find.text('저장합니다'), findsNothing);
  });
}
