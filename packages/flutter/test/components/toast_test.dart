import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 400}) {
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(
        child: SizedBox(width: width, child: child),
      ),
    ),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronToast)));

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronToast(title: '저장했습니다', description: '변경 사항이 반영되었습니다.'),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull, reason: '$brightness에서 예외가 없어야 합니다');
    }
  });

  testWidgets('every tone paints its own icon and colour', (WidgetTester tester) async {
    for (final HoronToastTone tone in HoronToastTone.values) {
      await tester.pumpWidget(_host(HoronToast(title: '알림', tone: tone)));
      final HoronColors colors = _theme(tester).colors;
      final (IconData expectedIcon, Color expectedColor) = switch (tone) {
        HoronToastTone.neutral => (Icons.info_outline, colors.textSecondary),
        HoronToastTone.success => (Icons.check_circle_outline, colors.textBrand),
        HoronToastTone.danger => (Icons.error_outline, colors.textDanger),
      };
      final Icon icon = tester.widget<Icon>(find.byIcon(expectedIcon));
      expect(icon.size, 20, reason: '[&_svg]:size-5');
      expect(icon.color, expectedColor, reason: '$tone 아이콘 색');
    }
  });

  testWidgets('the card is a 14px regular glass box with 16/14 padding and two text roles', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(_host(const HoronToast(title: '저장했습니다', description: '반영되었습니다')));
    final HoronThemeData theme = _theme(tester);

    expect(find.byType(HoronLiquidGlass), findsOneWidget, reason: 'bg-glass-regular');
    expect(
      tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier,
      HoronGlassTier.regular,
      reason: 'LiquidGlass tier="regular"',
    );
    expect(
      find.byWidgetPredicate(
        (Widget widget) => widget is Padding && widget.padding == EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      findsOneWidget,
      reason: 'px-4 py-3.5',
    );

    final Text title = tester.widget<Text>(find.text('저장했습니다'));
    expect(title.style!.fontSize, theme.text.labelLg.fontSize, reason: 'text-label-lg');
    expect(title.style!.color, theme.colors.textPrimary);

    final Text description = tester.widget<Text>(find.text('반영되었습니다'));
    expect(description.style!.fontSize, theme.text.bodySm.fontSize, reason: 'text-body-sm');
    expect(description.style!.color, theme.colors.textSecondary);
    expect(
      tester.getRect(find.text('반영되었습니다')).top - tester.getRect(find.text('저장했습니다')).bottom,
      theme.space.s0_5,
      reason: 'gap-0.5',
    );
  });

  testWidgets('the close button is a 16px glyph that calls onDismiss', (WidgetTester tester) async {
    int dismissed = 0;
    await tester.pumpWidget(_host(HoronToast(title: '알림', onDismiss: () => dismissed += 1)));
    final HoronThemeData theme = _theme(tester);

    final Icon close = tester.widget<Icon>(find.byIcon(Icons.close));
    expect(close.size, 16, reason: '[&_svg]:size-4');
    expect(close.color, theme.colors.textSecondary);

    await tester.tap(find.byIcon(Icons.close));
    expect(dismissed, 1);
  });

  testWidgets('the toaster shows, dismisses and clears toasts through the controller', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: HoronToaster(controller: controller, child: const SizedBox.expand()),
        ),
      ),
    );

    controller.show(title: '첫 번째');
    controller.show(title: '두 번째', tone: HoronToastTone.danger);
    await tester.pumpAndSettle();
    expect(find.byType(HoronToast), findsNWidgets(2));
    expect(controller.toasts.length, 2);

    // 카드마다 붙은 닫기 버튼 중 첫 번째를 누릅니다.
    await tester.tap(find.byIcon(Icons.close).first);
    await tester.pumpAndSettle();
    expect(find.byType(HoronToast), findsOneWidget);
    expect(controller.toasts.single.title, '두 번째');

    controller.clear();
    await tester.pumpAndSettle();
    expect(find.byType(HoronToast), findsNothing);
    expect(controller.toasts, isEmpty);
  });

  testWidgets('the scope hands the controller to descendants and refuses to invent one', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);
    late HoronToastController seen;

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: HoronToaster(
          controller: controller,
          child: Builder(
            builder: (BuildContext context) {
              seen = HoronToastScope.of(context);
              return const SizedBox.expand();
            },
          ),
        ),
      ),
    );
    expect(identical(seen, controller), isTrue);

    // 토스터 밖에서는 컨트롤러가 없으므로 of는 던집니다.
    await tester.pumpWidget(_host(const HoronToast(title: '알림')));
    expect(() => HoronToastScope.of(tester.element(find.byType(HoronToast))), throwsStateError);
  });

  testWidgets('a toast shrinks to the viewport instead of overflowing at 320', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.binding.setSurfaceSize(const Size(320, 600));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: HoronToaster(controller: controller, child: const SizedBox.expand()),
        ),
      ),
    );
    // 레이아웃만 보는 테스트라 자동 닫힘 타이머를 만들지 않습니다(duration: zero).
    controller.show(
      title: '아주 긴 제목이 들어와도 카드는 화면을 넘지 않습니다',
      description: '설명도 여러 줄로 접힙니다. 토스트는 360px 상한을 넘지 않습니다.',
      duration: Duration.zero,
    );
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(HoronToast)).width, lessThanOrEqualTo(320 - 48));
  });
}
