import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 시트를 화면 아래에 붙여 놓는 호스트입니다. 시트는 높이 상한이 있어야 본문을
/// 스크롤로 감쌀 수 있으므로 [SizedBox]로 상한을 줍니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 390, double height = 620}) {
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(
        alignment: Alignment.bottomCenter,
        child: SizedBox(width: width, height: height, child: child),
      ),
    ),
  );
}

// 시트 없이 행만 띄우는 테스트도 있으므로, 테마는 Scaffold(테마 아래)에서 읽습니다.
HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(Scaffold).first));

ClipRRect _panelClip(WidgetTester tester) => tester.widget<ClipRRect>(
  find.descendant(of: find.byType(HoronBottomSheet), matching: find.byType(ClipRRect)).first,
);

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronBottomSheet(
            title: const Text('알림 설정'),
            child: HoronBottomSheetRow(label: 'Wi-Fi', value: const Text('On')),
          ),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull, reason: '$brightness에서 예외가 없어야 합니다');
    }
  });

  testWidgets('the glass surface draws the liquid layer with a 32px top radius', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronBottomSheet(title: Text('알림 설정'))));
    final HoronSpaceSpec space = _theme(tester).space;

    // Paper `VBH-1`(라이트)은 `--color-glass-fill-frost`(#FFFFFFE5, 90%) + 24px 배경 흐림을,
    // 다크 `DKE-0`은 두꺼운 유리(#17181ACC, 80%)를 씁니다. 라이트에서는 유리 엔진 대신
    // 서리 채움과 흐림이 그 자리를 맡습니다.
    final HoronThemeData light = _theme(tester);
    expect(
      find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == light.colors.glassFillFrost),
      findsOneWidget,
      reason: 'glass-fill-frost #FFFFFFE5',
    );
    expect(find.byType(BackdropFilter), findsOneWidget, reason: '24px 배경 흐림');
    final BorderRadius radius = _panelClip(tester).borderRadius as BorderRadius;
    expect(radius.topLeft.x, 32, reason: 'rounded-t-[32px]');
    expect(radius.bottomLeft.x, 0, reason: '위쪽 모서리만 둥급니다');
    // `0 0 0 1px var(--color-overlay-ink-3)` — 바깐 1px 잉크 고리입니다.
    final HoronThemeData theme = _theme(tester);
    final DecoratedBox outer = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronBottomSheet), matching: find.byType(DecoratedBox)).first,
    );
    final BoxShadow ring = (outer.decoration as BoxDecoration).boxShadow!.single;
    expect(ring.color, theme.colors.overlayInk3, reason: '0 0 0 1px overlay-ink-3');
    expect(ring.spreadRadius, 1, reason: '1px 고리');
    expect(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is Padding &&
            // px-4 pt-2 pb-5
            widget.padding == EdgeInsets.only(left: space.s4, right: space.s4, top: space.s2, bottom: space.s5),
      ),
      findsOneWidget,
    );
  });

  testWidgets('the solid surface paints bg-bg-default, 20px radius and pb-6 without glass', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(const HoronBottomSheet(title: Text('워크스페이스'), solid: true)));
    final HoronThemeData theme = _theme(tester);
    final HoronSpaceSpec space = theme.space;

    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'surface="solid"에는 유리를 깔지 않습니다');
    expect(
      find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == theme.colors.bgDefault),
      findsOneWidget,
    );
    expect((_panelClip(tester).borderRadius as BorderRadius).topLeft.x, theme.radius.xl, reason: 'rounded-t-[20px]');
    expect(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is Padding &&
            // px-4 pt-2 pb-6
            widget.padding == EdgeInsets.only(left: space.s4, right: space.s4, top: space.s2, bottom: space.s6),
      ),
      findsOneWidget,
    );
  });

  testWidgets('detail uses the 18px rhythm where panel uses 4px', (WidgetTester tester) async {
    final HoronSpaceSpec space = HoronThemeData.light.space;
    Future<double> gapOf({required bool detail}) async {
      await tester.pumpWidget(
        _host(HoronBottomSheet(title: const Text('제목'), closeLabel: null, detail: detail, child: const Text('본문'))),
      );
      return tester.getRect(find.text('본문')).top - tester.getRect(find.text('제목')).bottom;
    }

    expect(await gapOf(detail: false), space.s2 + space.s1, reason: 'panel: pb-2 + gap-1');
    expect(await gapOf(detail: true), space.step(4.5), reason: 'detail: gap-4.5');
  });

  testWidgets('the close button keeps the 32px box and the 16/18px glyph', (WidgetTester tester) async {
    int closed = 0;
    await tester.pumpWidget(_host(HoronBottomSheet(title: const Text('시트'), onClose: () => closed += 1)));
    final Icon panelIcon = tester.widget<Icon>(find.byIcon(Icons.close));
    expect(panelIcon.size, 16, reason: 'panel: size-4');
    expect(panelIcon.color, _theme(tester).colors.textSecondary);
    expect(tester.getSize(find.byWidgetPredicate((Widget w) => w is Container && w.child is Icon)).width, 32);

    await tester.tap(find.byIcon(Icons.close));
    expect(closed, 1);

    await tester.pumpWidget(_host(const HoronBottomSheet(title: Text('상세'), detail: true)));
    expect(tester.widget<Icon>(find.byIcon(Icons.close)).size, 18, reason: 'detail: size-[18px]');

    await tester.pumpWidget(_host(const HoronBottomSheet(title: Text('숨김'), closeLabel: null)));
    expect(find.byIcon(Icons.close), findsNothing, reason: 'closeLabel이 null이면 닫기를 숨깁니다');
  });

  testWidgets('a row is 48px with a 20px icon, a truncated label and a 16px caret', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(
      // _host 는 높이를 고정하므로, 행 자체의 높이를 재려면 min 높이 열로 감쌉니다.
      _host(
        Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            HoronBottomSheetRow(
              label: '아주 긴 설정 이름이 들어와도 한 줄로 잘립니다',
              icon: const Icon(Icons.wifi),
              value: const Text('Weekdays'),
              onTap: () => taps += 1,
            ),
          ],
        ),
      ),
    );
    final HoronThemeData theme = _theme(tester);

    expect(tester.getSize(find.byType(HoronBottomSheetRow)).height, theme.space.step(12), reason: 'h-12');
    expect(IconTheme.of(tester.element(find.byIcon(Icons.wifi))).size, 20, reason: '[&>svg]:size-5');
    expect(tester.widget<Icon>(find.byIcon(Icons.chevron_right)).size, 16, reason: 'size-4');

    final Text label = tester.widget<Text>(find.textContaining('아주 긴 설정'));
    expect(label.maxLines, 1, reason: 'truncate');
    expect(label.overflow, TextOverflow.ellipsis);
    expect(label.style!.color, theme.colors.textPrimary);
    expect(label.style!.fontSize, theme.text.labelMd.fontSize);
    final RichText value = tester.widget<RichText>(
      find.descendant(of: find.text('Weekdays'), matching: find.byType(RichText)),
    );
    expect(value.text.style!.color, theme.colors.textSecondary);

    await tester.tap(find.byType(HoronBottomSheetRow));
    expect(taps, 1);
  });

  testWidgets('actions paint ink and 6% ink, stay 44px tall and wrap at 320', (WidgetTester tester) async {
    final HoronThemeData theme = HoronThemeData.light;

    await tester.pumpWidget(
      _host(
        HoronBottomSheetActions(
          children: <Widget>[
            HoronBottomSheetAction(label: '취소', onPressed: () {}),
            HoronBottomSheetAction(label: '저장', primary: true, onPressed: () {}),
          ],
        ),
      ),
    );
    final Container secondary = tester.widget<Container>(
      find.descendant(of: find.byType(HoronBottomSheetAction).first, matching: find.byType(Container)),
    );
    expect((secondary.decoration! as BoxDecoration).color, theme.colors.overlayInk6, reason: 'bg-overlay-ink-6');
    expect(tester.widget<Text>(find.text('취소')).style!.color, theme.colors.textPrimary);
    expect(tester.getSize(find.byType(HoronBottomSheetAction).first).height, theme.space.step(11), reason: 'h-11');

    final Container primary = tester.widget<Container>(
      find.descendant(of: find.byType(HoronBottomSheetAction).last, matching: find.byType(Container)),
    );
    expect((primary.decoration! as BoxDecoration).color, theme.colors.interactivePrimary);
    expect(tester.widget<Text>(find.text('저장')).style!.color, theme.colors.textInverse, reason: 'text-text-inverse');
    expect(
      (primary.decoration! as BoxDecoration).borderRadius as BorderRadius,
      BorderRadius.circular(theme.radius.full),
    );

    // 폭 320에서 네 버튼은 한 줄에 들어가지 않으므로 줄을 바꿉니다(가로 스크롤 없음).
    await tester.pumpWidget(
      _host(
        HoronBottomSheetActions(
          children: <Widget>[
            for (int index = 0; index < 4; index += 1)
              HoronBottomSheetAction(label: '동작 $index', primary: index.isEven, onPressed: () {}),
          ],
        ),
        width: 320,
      ),
    );
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(HoronBottomSheetActions)).height, greaterThan(theme.space.step(11)));
  });

  testWidgets('the sheet opens from the bottom and closes by close and scrim', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Builder(
            builder: (BuildContext context) => TextButton(
              onPressed: () => showHoronBottomSheet(context, title: const Text('시트 제목'), child: const Text('본문')),
              child: const Text('열기'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    expect(find.text('시트 제목'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    expect(find.text('시트 제목'), findsNothing);

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    // 스크림을 눌러 닫습니다.
    await tester.tapAt(const Offset(5, 5));
    await tester.pumpAndSettle();
    expect(find.text('시트 제목'), findsNothing);
  });

  testWidgets('the sheet width follows the viewport: 374 cap, full at 320, inset when floating', (
    WidgetTester tester,
  ) async {
    addTearDown(() => tester.binding.setSurfaceSize(null));

    Future<double> openWidth({required double screen, required bool floating}) async {
      await tester.binding.setSurfaceSize(Size(screen, 800));
      await tester.pumpWidget(
        MaterialApp(
          theme: horonTheme(Brightness.light),
          home: Scaffold(
            body: Builder(
              builder: (BuildContext context) => TextButton(
                onPressed: () => showHoronBottomSheet(
                  context,
                  title: const Text('시트 제목'),
                  floating: floating,
                  child: const Text('본문'),
                ),
                child: const Text('열기'),
              ),
            ),
          ),
        ),
      );
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();
      final double width = tester.getSize(find.byType(HoronBottomSheet)).width;
      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();
      return width;
    }

    expect(await openWidth(screen: 1440, floating: false), 374, reason: 'max-w-93.5');
    expect(await openWidth(screen: 320, floating: false), 320, reason: '화면이 좁으면 전폭');
    expect(await openWidth(screen: 1440, floating: true), 1440 - 32, reason: 'inset-x-4');
  });

  testWidgets('pressing an action scales it down (motion-press) and hover keeps the cursor', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(HoronBottomSheetAction(label: '저장', onPressed: () {})));
    final TestGesture press = await tester.startGesture(tester.getCenter(find.byType(HoronBottomSheetAction)));
    await tester.pump();
    expect(tester.widget<AnimatedScale>(find.byType(AnimatedScale)).scale, lessThan(1));
    await press.up();
    await tester.pumpAndSettle();

    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);
    await pointer.moveTo(tester.getCenter(find.byType(HoronBottomSheetAction)));
    await tester.pump();
    expect(tester.takeException(), isNull);
  });

  testWidgets('the dark sheet keeps the thick glass, not the frost fill', (WidgetTester tester) async {
    // Paper `DKE-0`은 라이트 `VBH-1`의 서리 채움 대신 두꺼운 유리를 씁니다.
    await tester.pumpWidget(_host(const HoronBottomSheet(title: Text('알림 설정')), brightness: Brightness.dark));
    expect(find.byType(HoronLiquidGlass), findsOneWidget, reason: '다크는 유리 엔진이 그립니다');
    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.tier, HoronGlassTier.thick, reason: '#17181ACC 80%');
  });
}
