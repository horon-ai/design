import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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

  testWidgets('the glass dialog is the veil overlay with a 20px radius and 24px padding', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronDialog(solid: false, title: Text('제목'), description: Text('설명'))));
    final HoronThemeData theme = _theme(tester);

    final HoronVeil veil = tester.widget<HoronVeil>(find.byType(HoronVeil).first);
    expect(veil.kind, HoronVeilKind.overlay, reason: 'React veil-overlay');
    expect(veil.borderRadius!.topLeft.x, theme.radius.xl, reason: 'rounded-xl');
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: '유리 레이어를 겹치지 않습니다');
    expect(
      find.byWidgetPredicate((Widget widget) => widget is Padding && widget.padding == EdgeInsets.all(theme.space.s6)),
      findsOneWidget,
      reason: 'p-6',
    );
  });

  testWidgets('the veil dialog renders in both brightnesses without a rim or glass layer', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          const HoronDialog(solid: false, title: Text('제목'), description: Text('설명')),
          brightness: brightness,
        ),
      );
      final HoronVeil veil = tester.widget<HoronVeil>(find.byType(HoronVeil).first);
      expect(veil.kind, HoronVeilKind.overlay, reason: '${brightness.name}: veil-overlay');
      expect(find.byType(HoronLiquidGlass), findsNothing, reason: '${brightness.name}: 유리 레이어 없음');
    }
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

  testWidgets('both surfaces keep a 16px rhythm and solid paints bg-surface with a 0/24/64 shadow', (
    WidgetTester tester,
  ) async {
    final HoronSpaceSpec space = HoronThemeData.light.space;

    await tester.pumpWidget(_host(const HoronDialog(solid: false, title: Text('제목'), description: Text('설명'))));
    // 16px 리듬은 머리글 상자와 설명 사이입니다. 제목 글자 상자는 32px 닫기 버튼이
    // 만든 머리글 높이 안에서 위에 붙으므로, 글자 사이를 재면 리듬이 아니게 됩니다.
    expect(
      tester.getRect(find.text('설명')).top - tester.getRect(find.byKey(const Key('horon-dialog-header'))).bottom,
      space.s4,
      reason: 'veil: gap-4',
    );

    await tester.pumpWidget(_host(const HoronDialog(title: Text('제목'), description: Text('설명'), solid: true)));
    final HoronThemeData theme = _theme(tester);
    expect(
      tester.getRect(find.text('설명')).top - tester.getRect(find.byKey(const Key('horon-dialog-header'))).bottom,
      space.s4,
      reason: 'solid: gap-4',
    );
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'surface="solid"에는 유리를 깔지 않습니다');
    expect(find.byType(HoronVeil), findsNothing, reason: 'surface="solid"에는 veil을 깔지 않습니다');

    final BoxDecoration decoration = tester
        .widgetList<DecoratedBox>(find.ancestor(of: find.text('제목'), matching: find.byType(DecoratedBox)))
        .map((DecoratedBox box) => box.decoration)
        .whereType<BoxDecoration>()
        .firstWhere((BoxDecoration decoration) => decoration.color == theme.colors.bgSurface);
    expect(decoration.color, theme.colors.bgSurface, reason: 'bg-bg-surface');
    final BoxShadow shadow = decoration.boxShadow!.single;
    expect(shadow.offset, const Offset(0, 24), reason: 'shadow-[0_24_64]');
    expect(shadow.blurRadius, 64);
  });

  testWidgets(
    'title uses title-md, description body-md in text-secondary and close is a 32px target with a 16px icon',
    (WidgetTester tester) async {
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
      expect(close.size, 16, reason: '[&_svg]:size-4');
      expect(close.color, theme.colors.textSecondary);
      expect(tester.getSize(find.byIcon(Icons.close)).width, 16);
      expect(
        tester
            .getSize(find.ancestor(of: find.byIcon(Icons.close), matching: find.byType(AnimatedContainer)).first)
            .width,
        32,
        reason: 'size-8',
      );

      await tester.tap(find.byIcon(Icons.close));
      expect(closed, 1);

      await tester.pumpWidget(_host(const HoronDialog(title: Text('숨김'), closeLabel: null)));
      expect(find.byIcon(Icons.close), findsNothing, reason: 'closeLabel이 null이면 닫기를 숨깁니다');
    },
  );

  testWidgets('a body taller than the screen scrolls inside the dialog box', (WidgetTester tester) async {
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.binding.setSurfaceSize(const Size(800, 600));

    await tester.pumpWidget(
      _host(
        HoronDialog(
          title: const Text('긴 본문'),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[for (int index = 0; index < 40; index += 1) Text('줄 $index')],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    // `max-h-[calc(100dvh-2rem)]` — 화면 높이에서 32px을 뺀 만큼만 커집니다.
    final Rect box = tester.getRect(find.byType(HoronDialog));
    expect(box.height, lessThanOrEqualTo(600 - 32));
    final Finder scroll = find.descendant(of: find.byType(HoronDialog), matching: find.byType(SingleChildScrollView));
    expect(scroll, findsOneWidget, reason: 'overflow-y-auto');

    final double before = tester.getRect(find.text('줄 0')).top;
    await tester.dragFrom(tester.getRect(scroll).center, const Offset(0, -200));
    await tester.pumpAndSettle();
    expect(tester.getRect(find.text('줄 0')).top, lessThan(before), reason: '상자 안에서만 스크롤합니다');
    expect(tester.getRect(find.byType(HoronDialog)), box, reason: '상자 자체는 제자리에 남습니다');
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

  // 라우트가 `RawDialogRoute` 서브클래스가 되면서 생긴 동작입니다. 스크린 리더는
  // `scopesRoute` 경계를 만나면 모달 밖을 읽지 않습니다.
  testWidgets('the dialog page scopes the route for screen readers', (WidgetTester tester) async {
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
      find.byWidgetPredicate((Widget widget) => widget is Semantics && widget.properties.scopesRoute == true),
      findsWidgets,
      reason: 'RawDialogRoute가 페이지를 라우트 경계로 감쌉니다',
    );
  });

  testWidgets('escape closes a dismissible dialog only', (WidgetTester tester) async {
    Future<void> open({required bool dismissible}) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: horonTheme(Brightness.light),
          home: Scaffold(
            body: Builder(
              builder: (BuildContext context) => TextButton(
                onPressed: () => showHoronDialog(context, title: const Text('다이얼로그 제목'), dismissible: dismissible),
                child: const Text('열기'),
              ),
            ),
          ),
        ),
      );
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();
      expect(find.text('다이얼로그 제목'), findsOneWidget);
    }

    await open(dismissible: true);
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.text('다이얼로그 제목'), findsNothing, reason: 'Escape로 닫힙니다');

    await open(dismissible: false);
    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(find.text('다이얼로그 제목'), findsOneWidget, reason: 'dismissible: false는 Escape로 닫히지 않습니다');

    await tester.tapAt(const Offset(5, 5));
    await tester.pumpAndSettle();
    expect(find.text('다이얼로그 제목'), findsOneWidget, reason: '스크림을 눌러도 닫히지 않습니다');
  });
}
