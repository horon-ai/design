import 'package:flutter/gestures.dart';
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

  testWidgets('the card is a 14px veil overlay with 16/14 padding and two text roles', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(const HoronToast(title: '저장했습니다', description: '반영되었습니다', surface: HoronSurface.glass)),
    );
    final HoronThemeData theme = _theme(tester);

    final HoronVeil veil = tester.widget<HoronVeil>(find.byType(HoronVeil).first);
    expect(veil.kind, HoronVeilKind.overlay, reason: 'React veil-overlay');
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: '유리 레이어를 겹치지 않습니다');
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

  testWidgets('the close button is a 16px glyph in a 32px hit area that hovers to text-primary', (
    WidgetTester tester,
  ) async {
    int dismissed = 0;
    await tester.pumpWidget(_host(HoronToast(title: '알림', onDismiss: () => dismissed += 1)));
    final HoronThemeData theme = _theme(tester);

    final Icon close = tester.widget<Icon>(find.byIcon(Icons.close));
    expect(close.size, 16, reason: '[&_svg]:size-4');
    expect(close.color, theme.colors.textSecondary);
    expect(tester.getSize(find.byIcon(Icons.close)).width, 16);
    expect(
      tester.getSize(find.ancestor(of: find.byIcon(Icons.close), matching: find.byType(SizedBox)).first).width,
      32,
      reason: 'after:-inset-2 → 32px 히트 영역',
    );

    final TestGesture hover = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await hover.addPointer(location: tester.getCenter(find.byIcon(Icons.close)));
    await tester.pumpAndSettle();
    expect(tester.widget<Icon>(find.byIcon(Icons.close)).color, theme.colors.textPrimary, reason: 'hover:text-primary');
    await hover.removePointer();
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.close));
    expect(dismissed, 1);
  });

  testWidgets('the lg close glyph is 20px', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronToast(title: '알림', size: HoronToastSize.lg)));
    expect(tester.widget<Icon>(find.byIcon(Icons.close)).size, 20, reason: 'lg [&_svg]:size-5');
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

  testWidgets('the viewport stacks cards 12px apart with no gap of its own', (WidgetTester tester) async {
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
    controller.show(title: '첫 번째', duration: Duration.zero);
    controller.show(title: '두 번째', duration: Duration.zero);
    await tester.pumpAndSettle();

    // React 뷰포트는 `gap-0`이고 카드마다 `mt-3`(12)을 들고 있습니다.
    final Rect first = tester.getRect(find.byType(HoronToast).at(0));
    final Rect second = tester.getRect(find.byType(HoronToast).at(1));
    expect(second.top - first.bottom, HoronThemeData.light.space.s3);
    expect(tester.getRect(find.byType(HoronToast).at(0)).right, second.right, reason: '오른쪽에 붙습니다');
  });

  testWidgets('a dismissed card collapses before it leaves the list', (WidgetTester tester) async {
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
    controller.show(title: '첫 번째', duration: Duration.zero);
    await tester.pumpAndSettle();
    final double before = tester.getRect(find.text('첫 번째')).top;

    controller.dismiss(0);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 90));

    // `data-ending-style:h-0`·`mt-0` — 카드가 접히는 동안 목록에는 아직 남습니다.
    expect(controller.toasts, hasLength(1), reason: '퇴장 전환이 끝난 뒤에 지웁니다');
    expect(tester.getRect(find.text('첫 번째')).top, greaterThan(before), reason: '위 여백이 0으로 줄어듭니다');

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
