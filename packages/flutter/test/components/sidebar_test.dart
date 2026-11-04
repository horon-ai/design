import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

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

/// `border-r border-border-default` — plain 표면만 갖는 오른쪽 1px 테두리입니다.
Finder _rightBorder(HoronColors colors) => find.descendant(
  of: find.byType(HoronSidebar),
  matching: find.byWidgetPredicate(
    (Widget widget) =>
        widget is DecoratedBox &&
        widget.decoration is BoxDecoration &&
        (widget.decoration as BoxDecoration).border == Border(right: BorderSide(color: colors.borderDefault, width: 1)),
  ),
);

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

  testWidgets('hovering a group label lifts the label and the caret to text-primary', (WidgetTester tester) async {
    _useSurface(tester);
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    await tester.pumpWidget(
      _host(
        HoronSidebar(
          children: <Widget>[
            HoronSidebarGroup(
              label: 'Workspace',
              children: <Widget>[HoronSidebarItem(label: 'Inbox', onPressed: () {})],
            ),
          ],
        ),
      ),
    );
    final HoronColors colors = _colors(tester);

    Color labelColor() => DefaultTextStyle.of(tester.element(find.text('Workspace'))).style.color!;
    Color caretColor() => tester.widget<Icon>(find.byIcon(Icons.expand_more)).color!;

    expect(labelColor(), colors.textSecondary);
    expect(caretColor(), colors.textSecondary);

    await pointer.moveTo(tester.getCenter(find.text('Workspace')));
    await tester.pumpAndSettle();
    expect(labelColor(), colors.textPrimary, reason: 'hover:text-text-primary');
    expect(caretColor(), colors.textPrimary, reason: '캐럿도 함께 올라갑니다');
  });

  testWidgets('the header collapse button keeps the 28px box inside a 44px hit area', (WidgetTester tester) async {
    _useSurface(tester);
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    int collapses = 0;
    await tester.pumpWidget(
      _host(
        HoronSidebar(
          children: <Widget>[HoronSidebarHeader(initial: 'H', name: 'Horon', onCollapse: () => collapses += 1)],
        ),
      ),
    );
    final HoronColors colors = _colors(tester);
    final HoronThemeData theme = _theme(tester);

    final Finder box = find
        .ancestor(of: find.byIcon(Icons.chevron_left), matching: find.byType(AnimatedContainer))
        .first;
    expect(tester.getSize(box), Size.square(theme.space.step(7)), reason: 'size-7 = 28');
    final Finder hit = find.ancestor(of: box, matching: find.byType(GestureDetector)).first;
    expect(tester.getSize(hit).width, 44, reason: 'after:min-w-11');

    // 라이트 유리가 아닌 glass 표면에서도 hover는 6% 잉크입니다.
    await pointer.moveTo(tester.getCenter(box));
    await tester.pumpAndSettle();
    expect((tester.widget<AnimatedContainer>(box).decoration! as BoxDecoration).color, colors.overlayInk6);

    await tester.tap(box);
    await tester.pumpAndSettle();
    expect(collapses, 1);
  });

  testWidgets('an open project shows More in place of the chevron and a collapsed one keeps the chevron', (
    WidgetTester tester,
  ) async {
    _useSurface(tester);
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    Widget project({
      bool? open,
      bool defaultOpen = false,
      bool withChildren = true,
      ValueChanged<bool>? onOpenChange,
    }) => HoronSidebar(
      children: <Widget>[
        HoronSidebarProject(
          icon: const HoronSidebarProjectTile(child: Icon(Icons.folder)),
          label: 'Paper',
          open: open,
          defaultOpen: defaultOpen,
          onOpenChange: onOpenChange,
          actions: HoronSidebarProjectMore(onPressed: () {}),
          children: withChildren ? <Widget>[HoronSidebarItem(label: 'Design sync')] : const <Widget>[],
        ),
      ],
    );

    Visibility caretGate() => tester.widget<Visibility>(
      find.ancestor(of: find.byIcon(Icons.chevron_right), matching: find.byType(Visibility)).first,
    );
    Visibility moreGate() => tester.widget<Visibility>(
      find.ancestor(of: find.byType(HoronSidebarProjectMore), matching: find.byType(Visibility)).first,
    );

    // 접힌 프로젝트: 캐럿만 보이고 More는 숨습니다(`!hasChildren || isOpen`).
    await tester.pumpWidget(_host(project()));
    await tester.pumpAndSettle();
    expect(caretGate().visible, isTrue, reason: '접힌 프로젝트는 캐럿을 남깁니다');
    expect(moreGate().visible, isFalse, reason: '접혀 있으면 More는 invisible');
    expect(find.byType(HoronSidebarTree), findsNothing);

    // hover·포커스는 더 이상 표시 조건이 아닙니다(React `986662a`가 걷어 냄).
    await pointer.moveTo(tester.getCenter(find.text('Paper')));
    await tester.pumpAndSettle();
    expect(moreGate().visible, isFalse, reason: 'hover로는 More가 나오지 않습니다');
    expect(caretGate().visible, isTrue);
    await pointer.moveTo(Offset.zero);
    await tester.pumpAndSettle();

    // 펼친 프로젝트: 캐럿은 자리를 남긴 채 invisible, 제자리에 More가 섭니다.
    await tester.pumpWidget(_host(project(open: true)));
    await tester.pumpAndSettle();
    expect(caretGate().visible, isFalse, reason: 'actions && isOpen → 캐럿 invisible');
    expect(moreGate().visible, isTrue, reason: 'isOpen → More visible');
    expect(find.byIcon(Icons.chevron_right), findsOneWidget, reason: 'invisible은 자리를 남깁니다');
    expect(find.byType(HoronSidebarTree), findsOneWidget, reason: '펼치면 트리가 붙습니다');

    // uncontrolled: defaultOpen=false에서 탭하면 열리고, More가 그때 나타납니다.
    final List<bool> changes = <bool>[];
    await tester.pumpWidget(_host(project(onOpenChange: changes.add)));
    await tester.pumpAndSettle();
    expect(moreGate().visible, isFalse);
    await tester.tap(find.text('Paper'));
    await tester.pumpAndSettle();
    expect(changes, <bool>[true]);
    expect(moreGate().visible, isTrue, reason: '열리면 More가 보입니다');
    expect(caretGate().visible, isFalse);
    await tester.tap(find.text('Paper'));
    await tester.pumpAndSettle();
    expect(changes, <bool>[true, false]);
    expect(moreGate().visible, isFalse, reason: '다시 접으면 캐럿만 남습니다');

    // controlled: `open: false`면 탭해도 상태가 바뀌지 않습니다.
    await tester.pumpWidget(_host(project(open: false, onOpenChange: changes.add)));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Paper'));
    await tester.pumpAndSettle();
    expect(changes.last, isTrue);
    expect(moreGate().visible, isFalse, reason: 'controlled 값이 우선입니다');
    expect(caretGate().visible, isTrue);

    // 자식이 없는 프로젝트는 캐럿 없이 More를 항상 보입니다.
    await tester.pumpWidget(_host(project(withChildren: false)));
    await tester.pumpAndSettle();
    expect(find.byIcon(Icons.chevron_right), findsNothing, reason: '자식이 없으면 캐럿이 없습니다');
    expect(moreGate().visible, isTrue, reason: '!hasChildren → More visible');
  });

  testWidgets('the project more button is a 16px box inside a 44px hit area with a hover fill', (
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
              // More는 펼친 프로젝트에서만 보입니다(React `04f963d`).
              defaultOpen: true,
              menuOpen: true,
              actions: HoronSidebarProjectMore(onPressed: () {}),
              children: <Widget>[HoronSidebarItem(label: 'Design sync')],
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();
    final HoronThemeData theme = _theme(tester);

    final Finder box = find.ancestor(of: find.byIcon(Icons.more_horiz), matching: find.byType(AnimatedContainer)).first;
    expect(tester.getSize(box), Size.square(theme.space.step(4)), reason: 'size-4 = 16');
    final Finder hit = find.ancestor(of: box, matching: find.byType(GestureDetector)).first;
    expect(tester.getSize(hit).width, 44, reason: 'after:min-w-11');

    // More 자체의 hover는 6% 잉크입니다(`hover:bg-overlay-ink-6`).
    expect((tester.widget<AnimatedContainer>(box).decoration! as BoxDecoration).color, Colors.transparent);
    await pointer.moveTo(tester.getCenter(box));
    await tester.pumpAndSettle();
    expect(
      (tester.widget<AnimatedContainer>(box).decoration! as BoxDecoration).color,
      _colors(tester).overlayInk6,
      reason: 'hover:bg-overlay-ink-6',
    );
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

    // 드래그가 끝난 프레임에는 `_dragging`이 이미 false라 `transition-[width]`가
    // 켜집니다. 마지막 값까지 200ms 전이를 끝낸 뒤 폭을 잽니다.
    await tester.drag(handle, const Offset(60, 0));
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 340);
    expect(widths.last, 340);

    // maxWidth 400에서 멈춥니다.
    await tester.drag(handle, const Offset(500, 0));
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 400);
    expect(widths.last, 400);

    // minWidth 240에서 멈춥니다.
    await tester.drag(handle, const Offset(-2000, 0));
    await tester.pumpAndSettle();
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
    // 키보드 입력은 포인터를 따라가는 중이 아니므로 React `transition-[width]`처럼
    // 200ms로 미끄러집니다. 첫 프레임에는 아직 시작 폭입니다.
    expect(tester.getSize(find.byType(HoronSidebar)).width, 280, reason: '전이 시작 프레임');
    await tester.pumpAndSettle();
    expect(tester.getSize(find.byType(HoronSidebar)).width, 296, reason: '전이가 끝나면 새 폭');

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    await tester.pumpAndSettle();
    expect(widths.last, 280);

    await tester.sendKeyEvent(LogicalKeyboardKey.home);
    await tester.pumpAndSettle();
    expect(widths.last, 240);

    await tester.sendKeyEvent(LogicalKeyboardKey.end);
    await tester.pumpAndSettle();
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
    // 드래그가 끝나면 폭 전이가 켜지므로 320까지 200ms를 끝낸 뒤 잽니다.
    await tester.pumpAndSettle();
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
      final HoronColors colors = _colors(tester);
      expect(tester.takeException(), isNull, reason: 'glass $brightness');
      expect(find.byType(HoronLiquidGlass), findsOneWidget, reason: 'glass $brightness');
      expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.thick);
      expect(_rightBorder(colors), findsNothing, reason: 'glass는 테두리가 없습니다');

      await tester.pumpWidget(_host(HoronSidebar.photo(children: _content()), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull, reason: 'photo $brightness');
      expect(_rightBorder(colors), findsNothing, reason: 'photo도 테두리가 없습니다');
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
        // `dark:bg-glass-thick dark:bg-none` — 유리 레이어 없이 두꺼운 유리 색만 남습니다.
        expect(find.byType(HoronLiquidGlass), findsNothing);
        expect(
          find.descendant(
            of: find.byType(HoronSidebar),
            matching: find.byWidgetPredicate(
              (Widget widget) => widget is ColoredBox && widget.color == colors.glassThick,
            ),
          ),
          findsOneWidget,
        );
      }

      await tester.pumpWidget(_host(HoronSidebar.flue(children: _content()), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull, reason: 'flue $brightness');
      expect(find.byType(HoronFlueBackground), findsOneWidget, reason: 'flue $brightness');
      expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.regular);
      expect(_rightBorder(colors), findsNothing, reason: 'flue도 테두리가 없습니다');

      // `surface="plain"` — 채움도 유리도 없이 오른쪽 1px 테두리만 남습니다.
      await tester.pumpWidget(_host(HoronSidebar.plain(children: _content()), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull, reason: 'plain $brightness');
      expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'plain $brightness');
      expect(find.byType(HoronFlueBackground), findsNothing, reason: 'plain $brightness');
      expect(_rightBorder(colors), findsOneWidget, reason: 'border-r border-border-default');
      final BoxDecoration plain = tester.widget<DecoratedBox>(_rightBorder(colors)).decoration as BoxDecoration;
      expect(plain.color, isNull, reason: '채움이 없습니다');
    }
  });

  testWidgets('an item with href reads as a link and keeps aria-current as selected', (WidgetTester tester) async {
    _useSurface(tester);
    final SemanticsHandle handle = tester.ensureSemantics();
    await tester.pumpWidget(
      _host(
        HoronSidebar(
          children: <Widget>[
            HoronSidebarItem(label: 'Docs', href: Uri.parse('https://horon.ai/docs'), current: true, onPressed: () {}),
            HoronSidebarItem(label: 'Inbox', onPressed: () {}),
          ],
        ),
      ),
    );

    final SemanticsNode link = tester.getSemantics(find.byType(HoronSidebarItem).first);
    expect(link.flagsCollection.isLink, isTrue, reason: 'href가 있으면 링크입니다');
    expect(link.flagsCollection.isButton, isFalse);
    expect(link.flagsCollection.isSelected.toBoolOrNull(), isTrue, reason: 'aria-current="page"');

    final SemanticsNode button = tester.getSemantics(find.byType(HoronSidebarItem).last);
    expect(button.flagsCollection.isButton, isTrue, reason: 'href가 없으면 버튼입니다');
    expect(button.flagsCollection.isLink, isFalse);
    handle.dispose();
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
    // React가 `[&>[data-slot=icon]]:size-4`를 지워 아이콘이 라벨 글자 크기(1em)를 따릅니다.
    expect(
      IconTheme.of(
        tester.element(
          find.descendant(of: find.byType(HoronSidebarAddButton), matching: find.byIcon(Icons.add_circle_outline)),
        ),
      ).size,
      theme.text.labelMd.fontSize,
      reason: '추가 버튼 아이콘은 1em',
    );
    expect(IconTheme.of(tester.element(find.byIcon(Icons.article))).size, 16, reason: '트리 안 size-4');
  });
}
