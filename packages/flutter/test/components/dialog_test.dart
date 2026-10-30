import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 390}) {
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(
        child: SizedBox(width: width, child: child),
      ),
    ),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronDialog)));

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronDialog(
            title: const Text('워크스페이스 삭제'),
            description: const Text('이 작업은 되돌릴 수 없습니다.'),
            child: HoronDialogFooter(
              children: <Widget>[TextButton(onPressed: () {}, child: const Text('삭제'))],
            ),
          ),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull, reason: '$brightness에서 예외가 없어야 합니다');
    }
  });

  testWidgets('the light glass dialog is the frost surface: 90% fill, 24px blur, 20px radius, 24px padding', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(const HoronDialog(title: Text('제목'), description: Text('설명'))));
    final HoronThemeData theme = _theme(tester);

    final Finder frost = find.byWidgetPredicate(
      (Widget widget) => widget is ColoredBox && widget.color == theme.colors.glassFillFrost,
    );
    expect(frost, findsOneWidget, reason: 'Paper UBN-1: fill #FFFFFFE5');
    expect(
      tester
          .widget<BackdropFilter>(find.ancestor(of: frost, matching: find.byType(BackdropFilter)).first)
          .filter
          .toString(),
      ui.ImageFilter.blur(sigmaX: 24, sigmaY: 24).toString(),
      reason: 'Paper UBN-1: 호스트 blur(24px)',
    );
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: '라이트는 유리 티어가 아니라 서리 채움입니다');

    final Container panel = tester.widget<Container>(find.ancestor(of: frost, matching: find.byType(Container)).first);
    final BoxDecoration decoration = panel.decoration! as BoxDecoration;
    expect(decoration.borderRadius! as BorderRadius, BorderRadius.circular(theme.radius.xl));
    expect((decoration.border! as Border).top.color, theme.colors.glassRimFrost, reason: 'Paper UBN-1: rim #FFFFFFB3');
    expect(decoration.boxShadow!.single.color, theme.colors.overlayInk3, reason: '0 0 0 1px #00000008');
    expect(
      find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding == EdgeInsets.all(theme.space.s6)),
      findsOneWidget,
      reason: 'p-6',
    );
  });

  testWidgets('the dark glass dialog keeps the thick tier and draws no rim', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        const HoronDialog(title: Text('제목'), description: Text('설명')),
        brightness: Brightness.dark,
      ),
    );
    expect(
      tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier,
      HoronGlassTier.thick,
      reason: 'Paper CLU-0: #17181ACC',
    );
    final Container panel = tester.widget<Container>(
      find.ancestor(of: find.byType(HoronLiquidGlass), matching: find.byType(Container)).first,
    );
    final BoxDecoration decoration = panel.decoration! as BoxDecoration;
    expect(decoration.border, isNull, reason: 'CLU-0에는 고리가 없습니다');
    expect(decoration.boxShadow, isEmpty, reason: 'dark:shadow-none');
  });

  testWidgets('the scrim is #0B0C0E at 40% opacity', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Builder(
            builder: (BuildContext context) => TextButton(
              onPressed: () => showHoronDialog(context, title: const Text('다이얼로그 제목')),
              child: const Text('열기'),
            ),
          ),
        ),
      ),
    );
    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();

    expect(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is ColoredBox && widget.color == HoronThemeData.light.colors.bgScrim.withValues(alpha: 0.4),
      ),
      findsOneWidget,
      reason: 'Paper UE8-1: #0B0C0E, opacity 0.4',
    );
  });

  testWidgets('glass keeps an 8px rhythm where solid uses 20px and a 0/24/64 shadow', (WidgetTester tester) async {
    final HoronSpaceSpec space = HoronThemeData.light.space;

    await tester.pumpWidget(_host(const HoronDialog(title: Text('제목'), description: Text('설명'))));
    expect(
      tester.getRect(find.text('설명')).top - tester.getRect(find.text('제목')).bottom,
      space.s2,
      reason: 'glass: gap-2',
    );

    await tester.pumpWidget(_host(const HoronDialog(title: Text('제목'), description: Text('설명'), solid: true)));
    final HoronThemeData theme = _theme(tester);
    expect(
      tester.getRect(find.text('설명')).top - tester.getRect(find.text('제목')).bottom,
      space.s5,
      reason: 'solid: gap-5',
    );
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'surface="solid"에는 유리를 깔지 않습니다');

    final Container panel = tester.widget<Container>(
      find.ancestor(of: find.text('제목'), matching: find.byType(Container)).first,
    );
    final BoxDecoration decoration = panel.decoration! as BoxDecoration;
    expect(decoration.color, theme.colors.bgDefault, reason: 'bg-bg-default');
    final BoxShadow shadow = decoration.boxShadow!.single;
    expect(shadow.offset, const Offset(0, 24), reason: 'shadow-[0_24_64]');
    expect(shadow.blurRadius, 64);
  });

  testWidgets('title uses title-md, description body-md in text-secondary and close is 20px', (
    WidgetTester tester,
  ) async {
    int closed = 0;
    await tester.pumpWidget(
      _host(HoronDialog(title: const Text('제목'), description: const Text('설명'), onClose: () => closed += 1)),
    );
    final HoronThemeData theme = _theme(tester);

    final TextStyle titleStyle = DefaultTextStyle.of(tester.element(find.text('제목'))).style;
    expect(titleStyle.fontSize, theme.text.titleMd.fontSize);
    expect(titleStyle.color, theme.colors.textPrimary);

    final TextStyle bodyStyle = DefaultTextStyle.of(tester.element(find.text('설명'))).style;
    expect(bodyStyle.fontSize, theme.text.bodyMd.fontSize);
    expect(bodyStyle.color, theme.colors.textSecondary);

    final Icon close = tester.widget<Icon>(find.byIcon(Icons.close));
    expect(close.size, 20, reason: '[&_svg]:size-5');
    expect(close.color, theme.colors.textSecondary);

    await tester.tap(find.byIcon(Icons.close));
    expect(closed, 1);

    await tester.pumpWidget(_host(const HoronDialog(title: Text('숨김'), closeLabel: null)));
    expect(find.byIcon(Icons.close), findsNothing, reason: 'closeLabel이 null이면 닫기를 숨깁니다');
  });

  testWidgets('leading sits 14px before the title', (WidgetTester tester) async {
    final HoronSpaceSpec space = HoronThemeData.light.space;
    await tester.pumpWidget(
      _host(
        HoronDialog(
          title: const Text('제목'),
          leading: const SizedBox(key: Key('leading'), width: 40, height: 40),
        ),
      ),
    );
    final double gap = tester.getRect(find.text('제목')).left - tester.getRect(find.byKey(const Key('leading'))).right;
    expect(gap, space.s3_5, reason: 'leading이 있으면 gap-3.5');
  });

  testWidgets('the footer right-aligns and wraps instead of overflowing at 320', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        HoronDialogFooter(
          children: <Widget>[
            for (int index = 0; index < 4; index += 1) SizedBox(width: 100, height: 40, child: Text('동작 $index')),
          ],
        ),
        width: 320,
      ),
    );
    expect(tester.takeException(), isNull);
    final Rect footer = tester.getRect(find.byType(HoronDialogFooter));
    final Rect last = tester.getRect(find.text('동작 3'));
    expect(footer.height, greaterThan(40), reason: '한 줄에 들어가지 않으면 줄을 바꿉니다');
    expect(last.right, closeTo(footer.right, 0.5), reason: 'justify-end');
  });

  testWidgets('the dialog opens centred and closes by close and scrim', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Builder(
            builder: (BuildContext context) => TextButton(
              onPressed: () => showHoronDialog(context, title: const Text('다이얼로그 제목'), description: const Text('본문')),
              child: const Text('열기'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    expect(find.text('다이얼로그 제목'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    expect(find.text('다이얼로그 제목'), findsNothing);

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    await tester.tapAt(const Offset(5, 5));
    await tester.pumpAndSettle();
    expect(find.text('다이얼로그 제목'), findsNothing);
  });

  testWidgets('the dialog is 420 wide at desktop and the viewport minus 32 at 320', (WidgetTester tester) async {
    addTearDown(() => tester.binding.setSurfaceSize(null));

    Future<double> openWidth(double screen) async {
      await tester.binding.setSurfaceSize(Size(screen, 800));
      await tester.pumpWidget(
        MaterialApp(
          theme: horonTheme(Brightness.light),
          home: Scaffold(
            body: Builder(
              builder: (BuildContext context) => TextButton(
                onPressed: () => showHoronDialog(context, title: const Text('다이얼로그 제목')),
                child: const Text('열기'),
              ),
            ),
          ),
        ),
      );
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();
      final double width = tester.getSize(find.byType(HoronDialog)).width;
      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();
      return width;
    }

    expect(await openWidth(1440), 420, reason: 'w-105');
    expect(await openWidth(320), 320 - 32, reason: 'max-w-[calc(100vw-2rem)]');
  });
}
