import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronModal`의 크기·표면·머리글·스크롤 본문·푸터를 검사합니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, Size screen = const Size(1200, 900)}) {
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(
        child: MediaQuery(
          data: MediaQueryData(size: screen),
          child: child,
        ),
      ),
    ),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronModal)));

void main() {
  testWidgets('the public enum values match React ModalSize and ModalSurface', (WidgetTester tester) async {
    expect(HoronModalSize.values.map((HoronModalSize size) => size.name), <String>['sm', 'md', 'lg']);
    expect(HoronModalSurfaceKind.values.map((HoronModalSurfaceKind surface) => surface.name), <String>[
      'solid',
      'glass',
    ]);
  });

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          const HoronModal(title: Text('워크스페이스 만들기'), description: Text('이름을 정합니다.')),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('sizes are 400, 560 and 720 wide', (WidgetTester tester) async {
    final Map<HoronModalSize, double> widths = <HoronModalSize, double>{
      HoronModalSize.sm: 400,
      HoronModalSize.md: 560,
      HoronModalSize.lg: 720,
    };
    for (final HoronModalSize size in HoronModalSize.values) {
      await tester.pumpWidget(_host(HoronModal(title: const Text('제목'), size: size)));
      expect(tester.getSize(find.byType(HoronModal)).width, widths[size], reason: '${size.name}: ${widths[size]}');
    }
  });

  testWidgets('never grows past the viewport minus 32px', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        const HoronModal(title: Text('제목'), size: HoronModalSize.lg),
        screen: const Size(600, 500),
      ),
    );
    expect(tester.getSize(find.byType(HoronModal)).width, 568, reason: 'max-w-[calc(100vw-2rem)] = 600-32');
    expect(tester.getSize(find.byType(HoronModal)).height, lessThanOrEqualTo(500 - 32));
  });

  testWidgets('solid is bg-surface with a 0/24/64 shadow and glass is the veil overlay', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronModal(title: Text('제목'))));
    final HoronThemeData theme = _theme(tester);

    expect(find.byType(HoronVeil), findsNothing, reason: 'solid는 veil을 깔지 않습니다');
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'solid는 유리를 깔지 않습니다');
    final BoxDecoration decoration = tester
        .widgetList<DecoratedBox>(find.ancestor(of: find.text('제목'), matching: find.byType(DecoratedBox)))
        .map((DecoratedBox box) => box.decoration)
        .whereType<BoxDecoration>()
        .firstWhere((BoxDecoration decoration) => decoration.color == theme.colors.bgSurface);
    expect(decoration.color, theme.colors.bgSurface, reason: 'bg-bg-surface');
    final BoxShadow shadow = decoration.boxShadow!.single;
    expect(shadow.offset, const Offset(0, 24), reason: 'shadow-[0_24_64]');
    expect(shadow.blurRadius, 64);

    await tester.pumpWidget(_host(const HoronModal(title: Text('제목'), surface: HoronModalSurfaceKind.glass)));
    expect(find.byType(BackdropFilter), findsOneWidget, reason: 'glass는 8px 흐림 위의 베일');
    expect(
      find.descendant(
        of: find.byType(HoronModal),
        matching: find.byWidgetPredicate(
          (Widget widget) => widget is ColoredBox && widget.color == theme.colors.bgSurface75,
        ),
      ),
      findsOneWidget,
      reason: '베일 채움은 75% 표면입니다',
    );
    expect(find.byType(HoronLiquidGlass), findsNothing);
  });

  testWidgets('the header is px24 pt24 pb16 with title-md, body-md description and a 32px close', (
    WidgetTester tester,
  ) async {
    int closed = 0;
    await tester.pumpWidget(
      _host(HoronModal(title: const Text('제목'), description: const Text('설명'), onClose: () => closed += 1)),
    );
    final HoronThemeData theme = _theme(tester);

    expect(
      tester
          .widget<DefaultTextStyle>(find.ancestor(of: find.text('제목'), matching: find.byType(DefaultTextStyle)).first)
          .style
          .fontSize,
      theme.text.titleMd.fontSize,
      reason: 'title-md',
    );
    expect(
      tester
          .widget<DefaultTextStyle>(find.ancestor(of: find.text('설명'), matching: find.byType(DefaultTextStyle)).first)
          .style
          .fontSize,
      theme.text.bodyMd.fontSize,
      reason: 'body-md',
    );
    expect(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is Padding &&
            widget.padding ==
                EdgeInsets.only(
                  left: theme.space.s6,
                  // 닫기 버튼이 `-mr-2`로 오른쪽 여백을 먹으므로 머리글 오른쪽은 16입니다.
                  right: theme.space.s4,
                  top: theme.space.s6,
                  bottom: theme.space.s4,
                ),
      ),
      findsOneWidget,
      reason: 'px-6 pt-6 pb-4 (-mr-2)',
    );
    final Icon close = tester.widget<Icon>(find.byIcon(Icons.close));
    expect(close.size, 16, reason: '[&_svg]:size-4');
    expect(
      tester.getSize(find.ancestor(of: find.byIcon(Icons.close), matching: find.byType(AnimatedContainer)).first).width,
      32,
      reason: 'size-8',
    );

    await tester.tap(find.byIcon(Icons.close));
    expect(closed, 1);
  });

  testWidgets('closeLabel null hides the close button and the body scrolls above a pinned footer', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _host(
        HoronModal(
          title: const Text('긴 본문'),
          closeLabel: null,
          size: HoronModalSize.sm,
          footer: HoronModalFooter(
            children: <Widget>[TextButton(onPressed: () {}, child: const Text('취소'))],
          ),
          child: SizedBox(height: 2000, child: const Text('본문')),
        ),
        screen: const Size(1200, 500),
      ),
    );
    expect(find.byIcon(Icons.close), findsNothing);

    final Rect footer = tester.getRect(find.byType(HoronModalFooter));
    final Rect body = tester.getRect(find.byType(SingleChildScrollView));
    expect(body.bottom, lessThanOrEqualTo(footer.top), reason: '본문이 스크롤되고 푸터는 아래에 남습니다');

    final double before = tester.getRect(find.text('본문')).top;
    await tester.drag(find.text('본문'), const Offset(0, -300));
    await tester.pumpAndSettle();
    final double after = tester.getRect(find.text('본문')).top;
    expect(after, lessThan(before), reason: '본문만 스크롤합니다');
    expect(tester.getRect(find.byType(HoronModalFooter)).top, footer.top, reason: '푸터는 제자리에 남습니다');
  });

  testWidgets('the footer right-aligns and wraps at a narrow width', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        HoronModal(
          title: const Text('제목'),
          size: HoronModalSize.sm,
          footer: HoronModalFooter(
            children: <Widget>[
              for (final String label in <String>['취소', '저장', '나중에'])
                SizedBox(
                  width: 160,
                  child: TextButton(onPressed: () {}, child: Text(label)),
                ),
            ],
          ),
        ),
        screen: const Size(420, 700),
      ),
    );
    final Rect footer = tester.getRect(find.byType(HoronModalFooter));
    expect(footer.height, greaterThan(60), reason: '한 줄에 들어가지 않으면 줄을 바꿉니다');
    final Rect last = tester.getRect(find.text('나중에'));
    expect(last.right, closeTo(footer.right - HoronThemeData.light.space.s6, 0.5), reason: 'justify-end');
  });
}
