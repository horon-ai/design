import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 1024}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, child: child),
    ),
  ),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronFilterBar)));

const List<HoronFilterBarItem> _items = <HoronFilterBarItem>[
  HoronFilterBarItem(value: 'all', label: '전체', count: 12),
  HoronFilterBarItem(value: 'running', label: '실행 중', count: 3),
  HoronFilterBarItem(value: 'idle', label: '대기'),
  HoronFilterBarItem(value: 'failed', label: '실패', count: 1, disabled: true),
];

/// 트랙의 5% 잉크 바탕입니다.
Finder _track(HoronColors colors) => find.descendant(
  of: find.byType(HoronFilterBar),
  matching: find.byWidgetPredicate(
    (Widget widget) => widget is DecoratedBox && (widget.decoration as BoxDecoration).color == colors.overlayInk5,
  ),
);

/// 선택된 옵션 뒤의 10% 잉크 표시자입니다.
Finder _indicator(HoronColors colors) => find.descendant(
  of: find.byType(HoronFilterBar),
  matching: find.byWidgetPredicate(
    (Widget widget) => widget is DecoratedBox && (widget.decoration as BoxDecoration).color == colors.overlayInk10,
  ),
);

Finder _option(String label) => find.ancestor(of: find.text(label), matching: find.byType(Container)).first;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(const HoronFilterBar(items: _items), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the track is a 5% ink pill with 3px padding and rounded-full', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronFilterBar(items: _items)));
    await tester.pump();
    final HoronThemeData theme = _theme(tester);

    expect(_track(theme.colors), findsOneWidget, reason: 'bg-overlay-ink-5');
    final BoxDecoration decoration = tester.widget<DecoratedBox>(_track(theme.colors)).decoration as BoxDecoration;
    expect(decoration.borderRadius, BorderRadius.circular(theme.radius.full), reason: 'rounded-full');

    final Finder padding = find.descendant(of: find.byType(HoronFilterBar), matching: find.byType(Padding)).first;
    expect(tester.widget<Padding>(padding).padding, EdgeInsets.all(theme.space.step(0.75)), reason: 'p-[3px]');
  });

  testWidgets('each option is a 30px pill with px-3 and the 10% indicator sits on the selection', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(const HoronFilterBar(items: _items)));
    await tester.pump();
    final HoronThemeData theme = _theme(tester);

    expect(tester.getSize(_option('전체')).height, theme.space.step(7.5), reason: 'h-7.5 = 30');
    expect(
      tester.widget<Container>(_option('전체')).padding,
      EdgeInsets.symmetric(horizontal: theme.space.s3),
      reason: 'px-3',
    );
    expect(_indicator(theme.colors), findsOneWidget);

    // 표시자 자리는 `AnimatedPositioned`의 목표값으로 검사합니다. 애니메이션 중간값은
    // 시간에 기대지 않습니다.
    final Rect bar = tester.getRect(find.byType(HoronFilterBar));
    final Rect option = tester.getRect(_option('전체'));
    final AnimatedPositioned indicator = tester.widget<AnimatedPositioned>(find.byType(AnimatedPositioned));
    expect(indicator.left, option.left - bar.left);
    expect(indicator.top, option.top - bar.top);
    expect(indicator.width, option.width);
    expect(indicator.height, option.height);
  });

  testWidgets('the selected label is primary and the rest are secondary until hovered', (WidgetTester tester) async {
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    await tester.pumpWidget(_host(const HoronFilterBar(items: _items)));
    await tester.pump();
    final HoronColors colors = _theme(tester).colors;

    Color? colorOf(String label) => tester
        .widget<AnimatedDefaultTextStyle>(
          find.ancestor(of: find.text(label), matching: find.byType(AnimatedDefaultTextStyle)).first,
        )
        .style
        .color;

    expect(colorOf('전체'), colors.textPrimary, reason: '선택된 옵션은 text-text-primary');
    expect(colorOf('대기'), colors.textSecondary);

    await pointer.moveTo(tester.getCenter(find.text('대기')));
    await tester.pump();
    expect(colorOf('대기'), colors.textPrimary, reason: 'hover:text-text-primary');
  });

  testWidgets('tapping an option selects it and calls back once', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(HoronFilterBar(items: _items, onChanged: changes.add)));
    await tester.pump();

    await tester.tap(find.text('실행 중'));
    await tester.pump();
    // 배치 뒤 측정이 끝나 표시자가 새 자리를 받는 프레임입니다.
    await tester.pump();

    expect(changes, <String>['running']);
    final HoronColors colors = _theme(tester).colors;
    expect(_indicator(colors), findsOneWidget);
    final Rect bar = tester.getRect(find.byType(HoronFilterBar));
    final Rect option = tester.getRect(_option('실행 중'));
    final AnimatedPositioned indicator = tester.widget<AnimatedPositioned>(find.byType(AnimatedPositioned));
    expect(indicator.left, option.left - bar.left, reason: '표시자가 따라갑니다');
    expect(indicator.width, option.width);
  });

  testWidgets('a disabled option is 50% opaque and does not select', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(HoronFilterBar(items: _items, onChanged: changes.add)));
    await tester.pump();

    final Finder failed = find.ancestor(of: find.text('실패'), matching: find.byType(Opacity)).first;
    expect(tester.widget<Opacity>(failed).opacity, 0.5, reason: 'disabled:opacity-50');

    await tester.tap(find.text('실패'));
    await tester.pump();
    expect(changes, isEmpty);
  });

  testWidgets('narrow widths wrap the options instead of clipping them', (WidgetTester tester) async {
    const List<HoronFilterBarItem> many = <HoronFilterBarItem>[
      HoronFilterBarItem(value: 'all', label: '전체 에이전트', count: 12),
      HoronFilterBarItem(value: 'running', label: '실행 중인 작업', count: 3),
      HoronFilterBarItem(value: 'idle', label: '대기 중'),
      HoronFilterBarItem(value: 'failed', label: '실패한 작업', count: 1),
      HoronFilterBarItem(value: 'archived', label: '보관됨'),
    ];

    await tester.pumpWidget(_host(const HoronFilterBar(items: many), width: 1024));
    await tester.pump();
    final double wide = tester.getSize(find.byType(HoronFilterBar)).height;

    await tester.pumpWidget(_host(const HoronFilterBar(items: many), width: 320));
    await tester.pump();
    final double narrow = tester.getSize(find.byType(HoronFilterBar)).height;

    expect(narrow, greaterThan(wide), reason: '320px에서는 옵션이 다음 줄로 넘어갑니다');
    expect(tester.takeException(), isNull);
  });
}
