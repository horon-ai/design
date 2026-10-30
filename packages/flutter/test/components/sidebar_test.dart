import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/sidebar.dart';

/// 테스트가 쓰는 화면 폭입니다. `md`(768)보다 넓어야 폭 조절 손잡이가 보입니다.
const double _desktopWidth = 1024;

/// 테스트가 쓰는 화면 높이입니다. 사이드바의 마지막 스페이서가 남는 높이를 차지합니다.
const double _surfaceHeight = 720;

/// 화면 크기를 정합니다. 테스트가 끝나면 원래 크기로 돌립니다.
void _useSurface(WidgetTester tester, {double width = _desktopWidth}) {
  tester.view.physicalSize = Size(width, _surfaceHeight);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.reset);
}

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
///
/// `Align`이 사이드바에 느슨한 제약을 주므로 위젯이 자기 폭(280)을 지킵니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = _desktopWidth}) {
  return MaterialApp(
    // 밝기를 바꿀 때 이전 색에서 보간하지 않도록 트리를 새로 만듭니다.
    key: ValueKey<Brightness>(brightness),
    theme: horonTheme(brightness),
    home: Scaffold(
      body: SizedBox(
        width: width,
        height: _surfaceHeight,
        // 사이드바에 느슨한 제약을 줘서 자기 폭(280)을 지키게 합니다.
        child: Align(alignment: Alignment.topLeft, child: child),
      ),
    ),
  );
}

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronSidebar)));

HoronColors _colors(WidgetTester tester) => _theme(tester).colors;

/// 한 항목 행의 바탕 컨테이너입니다.
Finder _itemRow(int index) =>
    find.descendant(of: find.byType(HoronSidebarItem).at(index), matching: find.byType(AnimatedContainer)).first;

BoxDecoration _decoration(WidgetTester tester, Finder finder) =>
    tester.widget<AnimatedContainer>(finder).decoration! as BoxDecoration;

/// 갤러리와 같은 조립의 사이드바 내용입니다. 부품이 모두 한 번씩 들어갑니다.
List<Widget> _content({bool projectOpen = true}) => <Widget>[
  HoronSidebarHeader(initial: 'H', name: 'Horon Workspace', onCollapse: () {}),
  HoronSidebarGroup(
    label: 'Workspace',
    children: <Widget>[
      HoronSidebarItem(icon: const Icon(Icons.inbox), label: 'Inbox', count: '12', current: true, onPressed: () {}),
      HoronSidebarItem(icon: const Icon(Icons.send), label: 'Sent', attention: true, onPressed: () {}),
    ],
  ),
  HoronSidebarProject(
    icon: const HoronSidebarProjectTile(child: Icon(Icons.folder)),
    label: 'Paper',
    defaultOpen: projectOpen,
    actions: HoronSidebarProjectMore(onPressed: () {}),
    children: <Widget>[
      HoronSidebarItem(icon: const Icon(Icons.article), label: 'Design sync', onPressed: () {}),
      HoronSidebarItem(label: 'Weekly notes', onPressed: () {}),
    ],
  ),
  const HoronSidebarSpacer(),
  HoronSidebarAddButton(label: 'Add project', onPressed: () {}),
  HoronSidebarAccount(initials: 'M', name: '민열', email: 'alpoxdev@horon.ai', onPressed: () {}),
];

void main() {
  testWidgets('renders all twelve parts in light and dark', (WidgetTester tester) async {
    _useSurface(tester);
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(HoronSidebar(children: _content()), brightness: brightness));
      expect(tester.takeException(), isNull, reason: '$brightness');

      expect(find.byType(HoronSidebar), findsOneWidget);
      expect(find.byType(HoronSidebarHeader), findsOneWidget);
      expect(find.byType(HoronSidebarWorkspaceSwitch), findsOneWidget);
      expect(find.byType(HoronSidebarGroup), findsOneWidget);
      expect(find.byType(HoronSidebarProject), findsOneWidget);
      expect(find.byType(HoronSidebarProjectTile), findsOneWidget);
      expect(find.byType(HoronSidebarProjectMore), findsOneWidget);
      expect(find.byType(HoronSidebarTree), findsOneWidget);
      expect(find.byType(HoronSidebarSpacer), findsOneWidget);
      expect(find.byType(HoronSidebarAddButton), findsOneWidget);
      expect(find.byType(HoronSidebarAccount), findsOneWidget);
      // 그룹의 두 항목과 트리의 두 항목이 모두 그려집니다.
      expect(find.byType(HoronSidebarItem), findsNWidgets(4));
    }
  });

  testWidgets('paints the current row, the hover row and the attention dot', (WidgetTester tester) async {
    _useSurface(tester);
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    await tester.pumpWidget(
      _host(
        HoronSidebar(
          children: <Widget>[
            HoronSidebarItem(icon: const Icon(Icons.inbox), label: 'Inbox', current: true, onPressed: () {}),
            HoronSidebarItem(icon: const Icon(Icons.send), label: 'Sent', attention: true, onPressed: () {}),
          ],
        ),
      ),
    );

    final HoronColors colors = _colors(tester);
    // current ? bg-overlay-ink-6 : hover:bg-overlay-ink-4
    expect(_decoration(tester, _itemRow(0)).color, colors.overlayInk6, reason: 'current');
    expect(_decoration(tester, _itemRow(1)).color, Colors.transparent, reason: '평상시');
    expect(_decoration(tester, _itemRow(0)).borderRadius, BorderRadius.circular(_theme(tester).radius.md));

    await pointer.moveTo(tester.getCenter(find.byType(HoronSidebarItem).at(1)));
    await tester.pumpAndSettle();
    expect(_decoration(tester, _itemRow(1)).color, colors.overlayInk4, reason: 'hover');

    // attention 점은 7px 원이고 text-danger입니다.
    final Container dot = tester.widget<Container>(
      find.descendant(of: find.byType(HoronSidebarItem).at(1), matching: find.byType(Container)).last,
    );
    expect(tester.getSize(find.byWidget(dot)).width, 7, reason: 'size-[7px]');
    expect((dot.decoration! as BoxDecoration).color, colors.textDanger);
    expect((dot.decoration! as BoxDecoration).shape, BoxShape.circle);
  });

  testWidgets('a group collapses and expands', (WidgetTester tester) async {
    _useSurface(tester);
    final List<bool> changes = <bool>[];
    await tester.pumpWidget(
      _host(
        HoronSidebar(
          children: <Widget>[
            HoronSidebarGroup(
              label: 'Workspace',
              onOpenChange: changes.add,
              children: <Widget>[HoronSidebarItem(label: 'Inbox', onPressed: () {})],
            ),
          ],
        ),
      ),
    );

    expect(find.byType(HoronSidebarItem), findsOneWidget);
    await tester.tap(find.text('Workspace'));
    await tester.pumpAndSettle();
    expect(find.byType(HoronSidebarItem), findsNothing);
    expect(changes, <bool>[false]);

    await tester.tap(find.text('Workspace'));
    await tester.pumpAndSettle();
    expect(find.byType(HoronSidebarItem), findsOneWidget);
    expect(changes, <bool>[false, true]);
  });

  testWidgets('a project row swaps its chevron for the actions on hover and while its menu is open', (
    WidgetTester tester,
  ) async {
    _useSurface(tester);
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    await tester.pumpWidget(
      _host(
        HoronSidebar(
          children: <Widget>[
            HoronSidebarProject(
              icon: const HoronSidebarProjectTile(child: Icon(Icons.folder)),
              label: 'Paper',
              actions: HoronSidebarProjectMore(onPressed: () {}),
              children: <Widget>[HoronSidebarItem(label: 'Design sync')],
            ),
          ],
        ),
      ),
    );

    Visibility chevron() => tester.widget<Visibility>(
      find.descendant(of: find.byType(HoronSidebarProject), matching: find.byType(Visibility)).first,
    );
    AnimatedOpacity actions() => tester.widget<AnimatedOpacity>(
      find.descendant(of: find.byType(HoronSidebarProject), matching: find.byType(AnimatedOpacity)),
    );

    // 평상시: 캐럿이 보이고 액션은 투명합니다.
    expect(chevron().visible, isTrue);
    expect(actions().opacity, 0);

    await pointer.moveTo(tester.getCenter(find.byType(HoronSidebarProject)));
    await tester.pumpAndSettle();
    expect(chevron().visible, isFalse, reason: 'group-hover/project:invisible');
    expect(actions().opacity, 1, reason: 'group-hover/project:opacity-100');

    // `menuOpen`은 React의 has-data-popup-open과 같습니다.
    await tester.pumpWidget(
      _host(
        HoronSidebar(
          children: <Widget>[
            HoronSidebarProject(
              icon: const HoronSidebarProjectTile(child: Icon(Icons.folder)),
              label: 'Paper',
              menuOpen: true,
              actions: HoronSidebarProjectMore(onPressed: () {}),
              children: <Widget>[HoronSidebarItem(label: 'Design sync')],
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(chevron().visible, isFalse);
    expect(actions().opacity, 1);
  });

  testWidgets('the drag handle resizes within its bounds', (WidgetTester tester) async {
    _useSurface(tester);
    final List<double> widths = <double>[];
    await tester.pumpWidget(
      _host(
        HoronSidebar(
          resizable: true,
          onWidthChange: widths.add,
          children: <Widget>[HoronSidebarItem(label: 'Inbox', onPressed: () {})],
        ),
      ),
    );

    expect(tester.getSize(find.byType(HoronSidebar)).width, 280, reason: 'w-70');
    final Finder handle = find.byKey(horonSidebarResizeHandleKey);
    expect(handle, findsOneWidget);

    await tester.drag(handle, const Offset(60, 0));
    await tester.pump();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 340);
    expect(widths.last, 340);

    // maxWidth 400에서 멈춥니다.
    await tester.drag(handle, const Offset(500, 0));
    await tester.pump();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 400);
    expect(widths.last, 400);

    // minWidth 240에서 멈춥니다.
    await tester.drag(handle, const Offset(-2000, 0));
    await tester.pump();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 240);
    expect(widths.last, 240);

    // 더블 탭 인식기가 걸어 둔 타이머를 비웁니다.
    await tester.pump(kDoubleTapTimeout);
  });

  testWidgets('keyboard arrows step 16 and Home and End jump to the bounds', (WidgetTester tester) async {
    _useSurface(tester);
    final List<double> widths = <double>[];
    await tester.pumpWidget(
      _host(
        HoronSidebar(
          resizable: true,
          onWidthChange: widths.add,
          children: <Widget>[HoronSidebarItem(label: 'Inbox', onPressed: () {})],
        ),
      ),
    );

    final Finder handle = find.byKey(horonSidebarResizeHandleKey);
    await tester.tap(handle);
    await tester.pump();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
    await tester.pump();
    expect(widths.last, 296, reason: 'RESIZE_STEP 16');

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    await tester.pump();
    expect(widths.last, 280);

    await tester.sendKeyEvent(LogicalKeyboardKey.home);
    await tester.pump();
    expect(widths.last, 240);

    await tester.sendKeyEvent(LogicalKeyboardKey.end);
    await tester.pump();
    expect(widths.last, 400);

    // 더블 탭 인식기가 걸어 둔 타이머를 비웁니다.
    await tester.pump(kDoubleTapTimeout);
  });

  testWidgets('double tapping the handle returns to the default width', (WidgetTester tester) async {
    _useSurface(tester);
    final List<double> widths = <double>[];
    await tester.pumpWidget(
      _host(
        HoronSidebar(
          resizable: true,
          onWidthChange: widths.add,
          children: <Widget>[HoronSidebarItem(label: 'Inbox', onPressed: () {})],
        ),
      ),
    );

    final Finder handle = find.byKey(horonSidebarResizeHandleKey);
    await tester.drag(handle, const Offset(40, 0));
    await tester.pump();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 320);

    await tester.tap(handle);
    await tester.pump(kDoubleTapMinTime);
    await tester.tap(handle);
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 280, reason: 'defaultWidth');
    expect(widths.last, 280);
    await tester.pump(kDoubleTapTimeout);
  });

  testWidgets('every surface renders in both brightnesses', (WidgetTester tester) async {
    _useSurface(tester);
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(HoronSidebar(children: _content()), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull, reason: 'glass $brightness');
      expect(find.byType(HoronLiquidGlass), findsOneWidget, reason: 'glass $brightness');
      expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.thick);

      await tester.pumpWidget(_host(HoronSidebar.photo(children: _content()), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull, reason: 'photo $brightness');
      if (brightness == Brightness.light) {
        // 라이트는 사진 바탕(#EEF3F8 근사)과 흰 막이고 유리 겹이 없습니다.
        expect(find.byType(HoronLiquidGlass), findsNothing);
        expect(
          find.descendant(
            of: find.byType(HoronSidebar),
            matching: find.byWidgetPredicate(
              (Widget widget) => widget is ColoredBox && widget.color == HoronPalette.sky50,
            ),
          ),
          findsOneWidget,
        );
      } else {
        // `dark:bg-glass-thick dark:bg-none`
        expect(find.byType(HoronLiquidGlass), findsOneWidget);
        expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.thick);
      }

      await tester.pumpWidget(_host(HoronSidebar.flue(children: _content()), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull, reason: 'flue $brightness');
      expect(find.byType(HoronFlueBackground), findsOneWidget, reason: 'flue $brightness');
      expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.regular);
    }
  });

  testWidgets('the sidebar does not overflow at 320, 390 and 1024', (WidgetTester tester) async {
    for (final double width in <double>[320, 390, _desktopWidth]) {
      _useSurface(tester, width: width);
      await tester.pumpWidget(
        _host(
          HoronSidebar(
            resizable: true,
            children: <Widget>[
              HoronSidebarHeader(initial: 'H', name: 'A workspace name far longer than the sidebar', onCollapse: () {}),
              HoronSidebarItem(
                icon: const Icon(Icons.inbox),
                label: 'A very long item label that must truncate',
                count: '128',
                attention: true,
                onPressed: () {},
              ),
              HoronSidebarAccount(
                initials: 'M',
                name: 'A very long person name',
                email: 'a-very-long-address@horon.ai',
                onPressed: () {},
              ),
            ],
          ),
          width: width,
        ),
      );
      expect(tester.takeException(), isNull, reason: '$width 폭에서 넘치지 않습니다');
      // `md` 아래에서는 손잡이가 없고 폭이 280으로 고정입니다.
      expect(
        find.byKey(horonSidebarResizeHandleKey),
        width >= _theme(tester).breakpoints.md ? findsOneWidget : findsNothing,
        reason: '$width 폭의 손잡이',
      );
      expect(tester.getSize(find.byType(HoronSidebar)).width, 280, reason: '$width 폭의 사이드바');
    }
  });

  testWidgets('measures match the React classes', (WidgetTester tester) async {
    _useSurface(tester);
    await tester.pumpWidget(_host(HoronSidebar(children: _content())));

    final HoronThemeData theme = _theme(tester);
    final Rect sidebar = tester.getRect(find.byType(HoronSidebar));
    final Rect header = tester.getRect(find.byType(HoronSidebarHeader));
    expect(sidebar.width, 280, reason: 'w-70');
    // px-3 pt-4, 그리고 머리 아래 mb-2.5가 머리 높이에 들어 있습니다.
    expect(header.left - sidebar.left, 12, reason: 'px-3');
    expect(header.top - sidebar.top, 16, reason: 'pt-4');
    expect(header.height, 46, reason: 'h-9 + mb-2.5');

    expect(tester.getSize(find.byType(HoronSidebarWorkspaceSwitch)).height, 36, reason: 'h-9');
    expect(tester.getSize(_itemRow(0)).height, 32, reason: 'h-8');
    expect(tester.getSize(find.byType(HoronSidebarProjectTile)), const Size(22, 22), reason: 'size-5.5');
    expect(tester.getSize(find.byType(HoronSidebarAccount)).height, 54, reason: 'py-2 + 이름·메일 두 줄 38px');
    expect(
      tester.getSize(find.descendant(of: find.byType(HoronSidebarAddButton), matching: find.byType(AnimatedContainer))),
      const Size(256, 36),
      reason: 'h-9, 사이드바 안쪽 폭',
    );
    // 트리 연결선 열은 16px입니다.
    expect(
      tester
          .getSize(find.descendant(of: find.byType(HoronSidebarTree), matching: find.byType(CustomPaint)).first)
          .width,
      16,
      reason: 'Tree connector column',
    );
    // 그룹 라벨 행은 h-7입니다.
    expect(
      tester
          .getSize(find.descendant(of: find.byType(HoronSidebarGroup), matching: find.byType(Container)).first)
          .height,
      28,
      reason: 'h-7',
    );
    expect(theme.radius.md, 12, reason: 'rounded-md');
    // 트리 밖 아이콘은 18px(`[&>svg]:size-4.5`), 트리 안은 16px입니다.
    expect(IconTheme.of(tester.element(find.byIcon(Icons.inbox))).size, 18, reason: 'size-4.5');
    expect(IconTheme.of(tester.element(find.byIcon(Icons.article))).size, 16, reason: '트리 안 size-4');
  });
}
