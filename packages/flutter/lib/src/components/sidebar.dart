import 'dart:math' as math;
import 'dart:ui' show PathMetric;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../glass/flue_background.dart';
import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `w-70` — 사이드바의 기본 폭 280입니다.
const double _sidebarWidth = 280;

/// `Sidebar`의 `minWidth` 기본값입니다.
const double _sidebarMinWidth = 240;

/// `Sidebar`의 `maxWidth` 기본값입니다.
const double _sidebarMaxWidth = 400;

/// `RESIZE_STEP` — 키보드로 폭을 한 번에 옮기는 16px입니다.
const double _resizeStep = 16;

/// `w-2` — 폭 조절 손잡이의 폭 8입니다.
const double _resizeHandleWidth = 8;

/// `w-0.5` — 손잡이의 표시선 폭 2입니다.
const double _resizeLineWidth = 2;

/// `border-r` — 사이드바 오른쪽 테두리 1px입니다.
const double _hairline = 1;

/// `transition-[width] duration-200 ease-out-quint` — 폭 전이 200ms입니다.
///
/// React는 `resizable`일 때 폭을 전이하고, 끄는 동안에는 `data-resizing`으로
/// 전이를 끕니다(포인터를 1:1로 따라가야 하므로).
const Duration _widthDuration = Duration(milliseconds: 200);

/// `after:min-h-11 after:min-w-11` — 터치 영역 44px입니다.
///
/// React는 `::after`로 보이는 상자 밖까지 히트 영역을 넓힙니다. 다만 헤더 행이
/// `h-9`(36)이고 사이드바 `nav`가 `overflow-clip`이라 세로로는 36px까지만 닿습니다.
/// Flutter 판은 행 높이를 넘지 않는 상자로 같은 히트 영역을 냅니다.
const double _minTapTarget = 44;

/// 프로젝트 행 "더 보기"의 히트 영역이 보이는 16px 상자 밖으로 나가는 폭입니다.
///
/// React는 `after:min-w-11`로 좌우 14px씩 넓히므로, 44px 상자를 14px 왼쪽으로
/// 옮겨야 보이는 아이콘이 `right-2.5` 자리에 그대로 남습니다.
const double _projectMoreHitInset = (_minTapTarget - 16) / 2;

/// `rounded-md` — 워크스페이스 스위치·계정 아바타·추가 버튼의 반경입니다.
const double _radius10 = 10;

/// `[&>svg]:size-4.5` — 사이드바 항목 아이콘 18px입니다.
const double _itemIconSize = 18;

/// `[&_[data-slot=icon]>svg]:size-4` — 트리 안 항목 아이콘 16px입니다.
const double _treeIconSize = 16;

/// `size-[7px]` — 주의 표시 점 7px입니다.
const double _attentionDotSize = 7;

/// `size-3.5` — 캐럿 아이콘 14px입니다.
const double _caretSmall = 14;

/// `size-4` — 헤더의 접기 캐럿과 계정 캐럿 16px입니다.
const double _caretLarge = 16;

/// `SidebarTree`가 가정하는 행 높이 32입니다.
///
/// React의 `ROW` 상수와 같습니다. 연결선은 이 높이의 행이 2px 간격으로 쌓인다고
/// 계산하므로, 호출자가 여러 줄짜리 위젯을 넣어 행이 커지면 연결선이 어긋납니다.
const double _treeRowHeight = 32;

/// `gap-0.5` — 트리 행 사이 2px입니다.
const double _treeRowGap = 2;

/// 연결선 열의 폭 16입니다.
const double _treeConnectorWidth = 16;

/// `strokeWidth="1.5"` — 연결선 두께입니다.
const double _treeConnectorStroke = 1.5;

/// 연결선이 행 가운데로 꺾이는 반경 9입니다.
const double _treeCurveRadius = HoronRadius.sm;

/// `bg-sidebar-photo`의 55% 흰 막입니다.
///
/// React의 유틸리티는 `#EEF3F8` 바탕 위에 하늘색 그라디언트(`sidebar-gradient.png`)와
/// `#ffffff8c` 막을 얹습니다(`globals.css`). Flutter 패키지는 그 이미지를 싣지 않으므로,
/// 이 포트는 가장 가까운 바탕 토큰([HoronPalette.sky50])과 같은 알파의 흰 막으로
/// 평평하게 그립니다.
const double _photoVeil = 0.55;

/// `strokeDasharray="4 3"` — 추가 버튼 점선의 4px 선, 3px 틈입니다.
const double _dashOn = 4;
const double _dashOff = 3;

/// `rect stroke-width="2"`를 안쪽 1px로 자른 결과의 선 두께입니다.
const double _dashStroke = 1;

/// 폭 조절 손잡이를 찾는 키입니다. 손잡이는 [HoronSidebar]가 `resizable`이고
/// `md` 폭 이상일 때만 트리에 있습니다.
const Key horonSidebarResizeHandleKey = Key('horon-sidebar-resize-handle');

/// 사이드바 바탕의 네 가지입니다.
///
/// React는 `surface: "glass" | "photo" | "plain"`을 인라인 유니온으로 선언합니다. 이름
/// 붙은 유니온이 아니라서 variant 게이트가 읽지 않으므로, 이 포트는 공개 enum 대신
/// 이름 있는 생성자([HoronSidebar.photo], [HoronSidebar.plain], [HoronSidebar.flue])로
/// 같은 선택을 엽니다. `glass`·`photo`·`plain`·`flue` 중 `flue`만 Flutter 쪽 추가입니다.
enum _SidebarSurface {
  /// `surface="glass"`, 기본값입니다. 두꺼운 유리 한 겹입니다.
  glass,

  /// `surface="photo"` — 라이트에서는 Paper 그라디언트 바탕, 다크에서는 두꺼운 유리입니다.
  photo,

  /// `surface="plain"` — 채움도 유리도 없이 뒤 레이아웃의 색을 그대로 쓰고, 오른쪽
  /// 1px `border-default`로만 경계를 긋습니다.
  plain,

  /// Flutter 전용 — Flue 배경 위에 보통 유리를 얹습니다.
  flue,
}

/// Figma `Sidebar`(88:848)입니다.
///
/// 280px 기둥에 위 16 / 좌우 12 / 아래 12 여백, 자식 사이 2px 간격을 둡니다.
/// [resizable]이면 오른쪽 가장자리의 8px 손잡이로 폭을 [minWidth]와 [maxWidth]
/// 사이에서 끕니다. 손잡이는 `md`(768) 폭 이상에서만 보이고, 그 아래에서는 사이드바가
/// 280 고정입니다.
///
/// 자식은 [HoronSidebarHeader], [HoronSidebarGroup], [HoronSidebarProject],
/// [HoronSidebarItem], [HoronSidebarSpacer], [HoronSidebarAddButton],
/// [HoronSidebarAccount]로 조립합니다. [HoronSidebarSpacer]가 남는 높이를 차지하므로
/// 높이가 정해진 자리에 놓습니다. React의 `nav`는 넘치는 내용을 `overflow-clip`으로
/// 잘라 내지만 이 포트는 `Column` 그대로라, 내용이 주어진 높이보다 길면 디버그에서
/// 넘침 오류가 납니다. 긴 목록이 필요하면 호출자가 스크롤을 소유하십시오.
class HoronSidebar extends StatefulWidget {
  /// 두꺼운 유리 바탕의 사이드바를 만듭니다. React의 기본 `surface`입니다.
  const HoronSidebar({
    super.key,
    required this.children,
    this.resizable = false,
    this.defaultWidth = _sidebarWidth,
    this.minWidth = _sidebarMinWidth,
    this.maxWidth = _sidebarMaxWidth,
    this.onWidthChange,
    this.resizeLabel = 'Resize sidebar',
  }) : _surface = _SidebarSurface.glass;

  /// `surface="photo"` — 라이트에서는 Paper의 그라디언트 바탕, 다크에서는 두꺼운 유리입니다.
  const HoronSidebar.photo({
    super.key,
    required this.children,
    this.resizable = false,
    this.defaultWidth = _sidebarWidth,
    this.minWidth = _sidebarMinWidth,
    this.maxWidth = _sidebarMaxWidth,
    this.onWidthChange,
    this.resizeLabel = 'Resize sidebar',
  }) : _surface = _SidebarSurface.photo;

  /// `surface="plain"` — 채움과 유리 없이 뒤 레이아웃의 색을 쓰고, 오른쪽 1px
  /// `border-default`로만 경계를 긋습니다.
  const HoronSidebar.plain({
    super.key,
    required this.children,
    this.resizable = false,
    this.defaultWidth = _sidebarWidth,
    this.minWidth = _sidebarMinWidth,
    this.maxWidth = _sidebarMaxWidth,
    this.onWidthChange,
    this.resizeLabel = 'Resize sidebar',
  }) : _surface = _SidebarSurface.plain;

  /// Flutter 전용 `surface="flue"` — [HoronFlueBackground] 위에 보통 유리를 얹습니다.
  const HoronSidebar.flue({
    super.key,
    required this.children,
    this.resizable = false,
    this.defaultWidth = _sidebarWidth,
    this.minWidth = _sidebarMinWidth,
    this.maxWidth = _sidebarMaxWidth,
    this.onWidthChange,
    this.resizeLabel = 'Resize sidebar',
  }) : _surface = _SidebarSurface.flue;

  /// 세로로 쌓을 자식입니다. flex 열과 같이 위에서 아래로 붙습니다.
  final List<Widget> children;

  /// 오른쪽 가장자리를 끌어 폭을 바꿀지 여부입니다. `md` 폭 이상에서만 손잡이가 보입니다.
  final bool resizable;

  /// [resizable]일 때의 시작 폭입니다. 손잡이를 더블 탭하면 이 폭으로 돌아옵니다.
  final double defaultWidth;

  /// 끌 수 있는 가장 좁은 폭입니다.
  final double minWidth;

  /// 끌 수 있는 가장 넓은 폭입니다.
  final double maxWidth;

  /// 폭이 바뀔 때마다, 끄는 중에도 부릅니다. 값은 이미 [minWidth]·[maxWidth]로 잘린 값입니다.
  final ValueChanged<double>? onWidthChange;

  /// 손잡이의 접근성 이름입니다. React의 `resizeLabel`입니다.
  final String resizeLabel;

  /// 고른 바탕입니다.
  final _SidebarSurface _surface;

  @override
  State<HoronSidebar> createState() => _HoronSidebarState();
}

class _HoronSidebarState extends State<HoronSidebar> {
  late double _width;
  double _dragStartWidth = 0;
  double _dragStartX = 0;
  bool _dragging = false;
  bool _hoverHandle = false;
  bool _focusHandle = false;
  final FocusNode _handleFocus = FocusNode(debugLabel: 'horon-sidebar-resize');

  @override
  void initState() {
    super.initState();
    _width = _clampWidth(widget.defaultWidth);
  }

  @override
  void didUpdateWidget(HoronSidebar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.defaultWidth != widget.defaultWidth ||
        oldWidget.minWidth != widget.minWidth ||
        oldWidget.maxWidth != widget.maxWidth) {
      _width = _clampWidth(_width);
    }
  }

  @override
  void dispose() {
    _handleFocus.dispose();
    super.dispose();
  }

  /// React의 `clamp`와 같습니다. 반올림한 뒤 min·max 사이로 자릅니다.
  double _clampWidth(double value) => math.min(widget.maxWidth, math.max(widget.minWidth, value)).roundToDouble();

  /// 폭을 바꾸고 [HoronSidebar.onWidthChange]를 부릅니다. 같은 값이면 아무 일도 없습니다.
  void _resize(double next) {
    final double clamped = _clampWidth(next);
    if (clamped == _width) return;
    setState(() => _width = clamped);
    widget.onWidthChange?.call(clamped);
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent && event is! KeyRepeatEvent) return KeyEventResult.ignored;
    final double? next = switch (event.logicalKey) {
      LogicalKeyboardKey.arrowLeft => _width - _resizeStep,
      LogicalKeyboardKey.arrowRight => _width + _resizeStep,
      LogicalKeyboardKey.home => widget.minWidth,
      LogicalKeyboardKey.end => widget.maxWidth,
      _ => null,
    };
    if (next == null) return KeyEventResult.ignored;
    _resize(next);
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // React의 `md:`는 뷰포트 기준입니다. 이 위젯이 놓인 상자가 그보다 좁으면
        // (갤러리의 고정 폭 미리보기처럼) 그 폭을 따릅니다.
        final double available = constraints.hasBoundedWidth ? constraints.maxWidth : MediaQuery.sizeOf(context).width;
        final bool showHandle = widget.resizable && available >= theme.breakpoints.md;
        final double width = showHandle ? _width : _sidebarWidth;
        // `transition-[width] duration-200 data-resizing:transition-none`입니다. 끄는
        // 동안에는 전이를 끄고, 키보드·더블 탭처럼 값이 뛰는 경우에만 미끄러집니다.
        final bool animateWidth = widget.resizable && !_dragging;

        return TweenAnimationBuilder<double>(
          tween: Tween<double>(end: width),
          duration: animateWidth && !MediaQuery.disableAnimationsOf(context) ? _widthDuration : Duration.zero,
          curve: HoronMotion.easeOutQuint,
          builder: (BuildContext context, double animatedWidth, Widget? child) =>
              SizedBox(width: animatedWidth, child: child),
          child: DecoratedBox(
            // `surface="plain"`만 `border-r border-border-default`를 얻습니다. glass와
            // photo는 테두리 없이 유리나 그라디언트 바탕이 경계를 만듭니다.
            decoration: BoxDecoration(
              border: widget._surface == _SidebarSurface.plain
                  ? Border(
                      right: BorderSide(color: colors.borderDefault, width: _hairline),
                    )
                  : null,
            ),
            child: Stack(
              fit: StackFit.passthrough,
              children: <Widget>[
                ..._background(theme),
                Padding(
                  // px-3 pt-4 pb-3
                  padding: EdgeInsets.fromLTRB(space.s3, space.s4, space.s3, space.s3),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    // gap-0.5
                    spacing: space.s0_5,
                    children: widget.children,
                  ),
                ),
                if (showHandle)
                  Positioned(top: 0, bottom: 0, right: 0, width: _resizeHandleWidth, child: _resizeHandle(theme)),
              ],
            ),
          ),
        );
      },
    );
  }

  /// 바탕 레이어입니다. React처럼 내용 뒤에 깔고, 내용은 그 위에 그립니다.
  List<Widget> _background(HoronThemeData theme) {
    final bool dark = theme.brightness == Brightness.dark;
    final HoronColors colors = theme.colors;
    switch (widget._surface) {
      case _SidebarSurface.glass:
        return <Widget>[_glass(theme, HoronGlassTier.thick)];
      case _SidebarSurface.photo:
        // `bg-sidebar-photo dark:bg-glass-thick dark:bg-none` — 다크에서는 그라디언트가 빠지고
        // 두꺼운 유리 **색**만 남습니다. React도 이 자리에 LiquidGlass 레이어를 두지 않습니다.
        if (dark) {
          return <Widget>[Positioned.fill(child: ColoredBox(color: colors.glassThick))];
        }
        return <Widget>[
          const Positioned.fill(child: ColoredBox(color: HoronPalette.sky50)),
          Positioned.fill(
            child: ColoredBox(color: HoronPalette.baseWhite.withValues(alpha: _photoVeil)),
          ),
        ];
      case _SidebarSurface.plain:
        // 채움도 유리도 없이 뒤 레이아웃의 색이 그대로 비칩니다.
        return const <Widget>[];
      case _SidebarSurface.flue:
        return <Widget>[
          // 유리 겹이 이미 glass-regular 색조를 얹으므로 Flue 자체 색조는 끕니다.
          const Positioned.fill(child: HoronFlueBackground(tint: Colors.transparent)),
          _glass(theme, HoronGlassTier.regular),
        ];
    }
  }

  Widget _glass(HoronThemeData theme, HoronGlassTier tier) => Positioned.fill(
    child: HoronLiquidGlass(tier: tier, borderRadius: BorderRadius.zero, child: const SizedBox.expand()),
  );

  /// `group/resize absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none outline-none md:block`
  Widget _resizeHandle(HoronThemeData theme) {
    final HoronColors colors = theme.colors;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    // `group-hover:bg-overlay-ink-16 group-focus-visible:bg-text-brand
    //  group-data-dragging:bg-text-brand` — 평상시에는 보이지 않습니다.
    final Color line = _focusHandle || _dragging
        ? colors.textBrand
        : _hoverHandle
        ? colors.overlayInk16
        : Colors.transparent;

    return Focus(
      focusNode: _handleFocus,
      onFocusChange: (bool value) => setState(() => _focusHandle = value),
      onKeyEvent: _onKey,
      child: MouseRegion(
        cursor: SystemMouseCursors.resizeColumn,
        onEnter: (PointerEnterEvent event) => setState(() => _hoverHandle = true),
        onExit: (PointerExitEvent event) => setState(() => _hoverHandle = false),
        child: Semantics(
          label: widget.resizeLabel,
          slider: true,
          value: '${_width.round()}',
          child: Listener(
            // React는 pointerdown에서 포커스를 잡습니다. 탭 제스처 경합을 기다리지 않습니다.
            onPointerDown: (PointerDownEvent event) => _handleFocus.requestFocus(),
            child: GestureDetector(
              key: horonSidebarResizeHandleKey,
              // 손잡이는 보이는 8px 전체가 클릭 영역입니다.
              behavior: HitTestBehavior.opaque,
              // React는 누른 지점(pointerdown)에서부터의 이동량을 씁니다.
              dragStartBehavior: DragStartBehavior.down,
              onDoubleTap: () => _resize(widget.defaultWidth),
              onHorizontalDragStart: (DragStartDetails details) {
                setState(() {
                  _dragging = true;
                  _dragStartWidth = _width;
                  _dragStartX = details.globalPosition.dx;
                });
              },
              onHorizontalDragUpdate: (DragUpdateDetails details) =>
                  _resize(_dragStartWidth + details.globalPosition.dx - _dragStartX),
              onHorizontalDragEnd: (DragEndDetails details) => setState(() => _dragging = false),
              onHorizontalDragCancel: () => setState(() => _dragging = false),
              child: Stack(
                children: <Widget>[
                  Positioned(
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: _resizeLineWidth,
                    child: AnimatedContainer(
                      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
                      curve: HoronMotion.colorsCurve,
                      color: line,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Figma 워크스페이스 전환 버튼입니다.
///
/// 28px 잉크 타일과 워크스페이스 이름, 위아래 캐럿을 한 줄에 놓습니다. 메뉴가 열려
/// 있는 동안에는 [menuOpen]으로 6% 잉크를 유지합니다(React `data-popup-open`).
class HoronSidebarWorkspaceSwitch extends StatefulWidget {
  /// 전환 버튼을 만듭니다.
  const HoronSidebarWorkspaceSwitch({
    super.key,
    required this.initial,
    required this.name,
    this.menuOpen = false,
    this.onPressed,
  });

  /// 28px 잉크 타일에 그릴 머리글자입니다.
  final String initial;

  /// 워크스페이스 이름입니다. 길면 말줄임합니다.
  final String name;

  /// 워크스페이스 메뉴가 열려 있는지 여부입니다. 참이면 hover와 같은 바탕이 남습니다.
  final bool menuOpen;

  /// 눌렀을 때 부를 콜백입니다. 보통 메뉴를 엽니다.
  final VoidCallback? onPressed;

  @override
  State<HoronSidebarWorkspaceSwitch> createState() => _HoronSidebarWorkspaceSwitchState();
}

class _HoronSidebarWorkspaceSwitchState extends State<HoronSidebarWorkspaceSwitch> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // `hover:bg-overlay-ink-6 data-popup-open:bg-overlay-ink-6`
    final Color fill = _hovered || widget.menuOpen ? colors.overlayInk6 : Colors.transparent;

    return FocusableActionDetector(
      enabled: widget.onPressed != null,
      mouseCursor: widget.onPressed != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
      onShowFocusHighlight: (bool value) => setState(() => _focused = value),
      shortcuts: const <ShortcutActivator, Intent>{
        SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
      },
      actions: <Type, Action<Intent>>{
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (ActivateIntent intent) {
            widget.onPressed?.call();
            return null;
          },
        ),
      },
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
          curve: HoronMotion.colorsCurve,
          // h-9, rounded-md, pr-1 pl-2
          height: space.step(9),
          padding: EdgeInsets.only(right: space.s1, left: space.s2),
          decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(_radius10)),
          // focus-visible:outline-2 focus-visible:outline-text-brand
          foregroundDecoration: BoxDecoration(
            borderRadius: BorderRadius.circular(_radius10),
            border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
          ),
          child: Row(
            // gap-1.5
            spacing: space.s1_5,
            children: <Widget>[
              Container(
                // size-7 shrink-0 rounded-sm bg-interactive-primary
                width: space.step(7),
                height: space.step(7),
                decoration: BoxDecoration(
                  color: colors.interactivePrimary,
                  borderRadius: BorderRadius.circular(theme.radius.sm),
                ),
                child: Center(
                  child: Text(
                    widget.initial,
                    maxLines: 1,
                    overflow: TextOverflow.clip,
                    // text-label-md text-text-inverse
                    style: theme.text.labelMd.copyWith(color: colors.textInverse),
                  ),
                ),
              ),
              Expanded(
                child: Text(
                  widget.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  // min-w-0 flex-1 truncate text-label-lg text-text-primary
                  style: theme.text.labelLg.copyWith(color: colors.textPrimary),
                ),
              ),
              Icon(
                // @phosphor-icons/react CaretUpDown
                Icons.unfold_more,
                size: _caretSmall,
                color: colors.textSecondary,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Figma 사이드바 머리입니다.
///
/// 워크스페이스 전환 버튼과, [onCollapse]가 있을 때만 보이는 28px 접기 버튼을
/// 한 줄(36px)에 두고 아래로 10px 띄웁니다. 접기 버튼은 React처럼 보이는 상자
/// 28px 밖으로 히트 영역을 넓히고, hover는 6% 잉크, 누르면 10% 잉크를 씁니다.
class HoronSidebarHeader extends StatelessWidget {
  /// 머리를 만듭니다.
  const HoronSidebarHeader({
    super.key,
    required this.initial,
    required this.name,
    this.switchSlot,
    this.onCollapse,
    this.collapseLabel = 'Collapse sidebar',
  });

  /// 28px 타일에 그릴 머리글자입니다. [switchSlot]이 있으면 쓰이지 않습니다.
  final String initial;

  /// 워크스페이스 이름입니다. [switchSlot]이 있으면 쓰이지 않습니다.
  final String name;

  /// 기본 전환 버튼을 통째로 바꾸는 자리입니다. React의 `switchSlot`입니다.
  final Widget? switchSlot;

  /// 접기 버튼을 눌렀을 때 부를 콜백입니다. null이면 접기 버튼이 없습니다.
  final VoidCallback? onCollapse;

  /// 접기 버튼의 접근성 이름입니다.
  final String collapseLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;

    return Padding(
      // mb-2.5
      padding: EdgeInsets.only(bottom: space.s2_5),
      child: SizedBox(
        // h-9
        height: space.step(9),
        // React의 `::after`는 레이아웃을 차지하지 않고 보이는 상자 양옆으로 8px씩
        // 넓어집니다. 그래서 전환 버튼은 28px 자리를 그대로 예약하고, 접기 버튼의
        // 히트 영역만 `Positioned`로 겹쳐 놓습니다.
        child: Stack(
          children: <Widget>[
            Row(
              // gap-1.5
              spacing: space.s1_5,
              children: <Widget>[
                Expanded(
                  child: switchSlot ?? HoronSidebarWorkspaceSwitch(initial: initial, name: name),
                ),
                if (onCollapse != null) SizedBox(width: space.step(7)),
              ],
            ),
            if (onCollapse != null)
              Positioned(
                // `after:min-w-11` — 보이는 28px 상자 중심으로 8px씩 넓힌 44px입니다.
                // 오른쪽 8px는 React처럼 부모가 잘라 내므로 36px만 닿습니다.
                top: 0,
                bottom: 0,
                right: -space.s2,
                width: _minTapTarget,
                child: _CollapseButton(label: collapseLabel, onPressed: onCollapse!),
              ),
          ],
        ),
      ),
    );
  }
}

/// `SidebarHeader`의 접기 버튼입니다.
///
/// 보이는 상자는 `size-7`(28)이고, React의 `after:min-h-11 after:min-w-11` 히트
/// 영역을 담은 44×행 높이(36) 슬롯 가운데에 놓입니다. hover는 6% 잉크, 누르면 10%
/// 잉크이고 라벨은 hover에서 `text-primary`로 올라갑니다.
class _CollapseButton extends StatefulWidget {
  const _CollapseButton({required this.label, required this.onPressed});

  final String label;
  final VoidCallback onPressed;

  @override
  State<_CollapseButton> createState() => _CollapseButtonState();
}

class _CollapseButtonState extends State<_CollapseButton> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // `hover:bg-overlay-ink-6 active:bg-overlay-ink-10 motion-colors`입니다.
    final Color fill = _pressed
        ? colors.overlayInk10
        : _hovered
        ? colors.overlayInk6
        : Colors.transparent;

    return FocusableActionDetector(
      mouseCursor: SystemMouseCursors.click,
      onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
      onShowFocusHighlight: (bool value) => setState(() => _focused = value),
      shortcuts: const <ShortcutActivator, Intent>{
        SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
      },
      actions: <Type, Action<Intent>>{
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (ActivateIntent intent) {
            widget.onPressed();
            return null;
          },
        ),
      },
      child: Semantics(
        button: true,
        label: widget.label,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onPressed,
          onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
          onTapUp: (TapUpDetails details) => setState(() => _pressed = false),
          onTapCancel: () => setState(() => _pressed = false),
          child: Center(
            child: AnimatedContainer(
              duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
              curve: HoronMotion.colorsCurve,
              // size-7 rounded-sm
              width: space.step(7),
              height: space.step(7),
              decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(theme.radius.sm)),
              foregroundDecoration: BoxDecoration(
                borderRadius: BorderRadius.circular(theme.radius.sm),
                border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
              ),
              child: Icon(
                // @phosphor-icons/react CaretLeft
                Icons.chevron_left,
                size: _caretLarge,
                color: _hovered ? colors.textPrimary : colors.textSecondary,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Figma 사이드바 `Item`입니다.
///
/// 32px 행에 12px 반경, 좌우 10px 여백, 10px 간격을 둡니다. [current]인 항목은
/// 6% 잉크, hover는 4% 잉크입니다. [count]는 오른쪽에, [attention]은 7px 빨간 점으로
/// 표시합니다. [href]가 있으면 React처럼 링크로 읽히고, 없으면 버튼입니다.
class HoronSidebarItem extends StatefulWidget {
  /// 항목을 만듭니다.
  const HoronSidebarItem({
    super.key,
    required this.label,
    this.icon,
    this.count,
    this.attention = false,
    this.current = false,
    this.href,
    this.onPressed,
  });

  /// 항목 이름입니다. 길면 말줄임합니다.
  final String label;

  /// 18px 아이콘, 또는 [HoronSidebarProjectTile]입니다.
  /// [HoronSidebarTree] 안에서는 React처럼 16px로 그립니다.
  final Widget? icon;

  /// 오른쪽에 붙는 개수입니다.
  final String? count;

  /// 주의가 필요한 항목에 다는 7px 점입니다.
  final bool attention;

  /// 지금 보고 있는 항목인지 여부입니다. 참이면 6% 잉크가 남습니다.
  final bool current;

  /// 이 항목이 가리키는 문서의 주소입니다. React의 `href`이고, 값이 있으면 행이
  /// 링크 시맨틱([Semantics.link])을 얻습니다. 패키지는 주소를 열지 않으므로 실제
  /// 이동은 [onPressed]가 맡습니다.
  final Uri? href;

  /// 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onPressed;

  @override
  State<HoronSidebarItem> createState() => _HoronSidebarItemState();
}

class _HoronSidebarItemState extends State<HoronSidebarItem> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    // 트리 안에서는 React가 `[&_[data-slot=icon]>svg]:size-4`로 16px로 줄입니다.
    final double iconSize = _SidebarIconSize.maybeOf(context) ?? _itemIconSize;

    // current ? bg-overlay-ink-6 : hover:bg-overlay-ink-4
    final Color fill = widget.current
        ? colors.overlayInk6
        : _hovered
        ? colors.overlayInk4
        : Colors.transparent;

    // React는 `href`가 있으면 `<a>`, 없으면 `<button type="button">`입니다.
    final bool link = widget.href != null;

    return Semantics(
      button: !link,
      link: link,
      selected: widget.current,
      child: FocusableActionDetector(
        enabled: widget.onPressed != null,
        mouseCursor: widget.onPressed != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{SingleActivator(LogicalKeyboardKey.enter): ActivateIntent()},
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.onPressed,
          child: AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            // h-8 rounded-md px-2.5
            height: space.step(8),
            padding: EdgeInsets.symmetric(horizontal: space.s2_5),
            decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(theme.radius.md)),
            // focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand
            foregroundDecoration: BoxDecoration(
              borderRadius: BorderRadius.circular(theme.radius.md),
              border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
            ),
            child: Row(
              // gap-2.5
              spacing: space.s2_5,
              children: <Widget>[
                if (widget.icon != null)
                  SizedBox(
                    width: iconSize,
                    height: iconSize,
                    child: IconTheme.merge(
                      data: IconThemeData(size: iconSize, color: colors.textPrimary),
                      child: widget.icon!,
                    ),
                  ),
                Expanded(
                  child: Text(
                    widget.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    // text-label-md text-text-primary
                    style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                  ),
                ),
                if (widget.count != null)
                  Text(
                    widget.count!,
                    maxLines: 1,
                    // text-body-sm text-text-secondary
                    style: theme.text.bodySm.copyWith(color: colors.textSecondary),
                  ),
                if (widget.attention)
                  Container(
                    width: _attentionDotSize,
                    height: _attentionDotSize,
                    decoration: BoxDecoration(color: colors.textDanger, shape: BoxShape.circle),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 프로젝트 행에 쓰는 22px 타일입니다.
///
/// 6px 반경에 잉크 바탕, 14px 반대색 아이콘입니다. 바탕은 [backgroundColor]로
/// 바꿉니다(React는 `className`으로 바꿉니다).
class HoronSidebarProjectTile extends StatelessWidget {
  /// 타일을 만듭니다.
  const HoronSidebarProjectTile({super.key, this.child, this.backgroundColor});

  /// 타일 가운데에 그릴 14px 아이콘입니다.
  final Widget? child;

  /// 타일 바탕색입니다. 없으면 `interactive-primary`입니다.
  final Color? backgroundColor;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    return Container(
      // size-5.5 rounded-xs bg-interactive-primary text-text-inverse
      width: space.step(5.5),
      height: space.step(5.5),
      decoration: BoxDecoration(
        color: backgroundColor ?? colors.interactivePrimary,
        borderRadius: BorderRadius.circular(theme.radius.xs),
      ),
      child: Center(
        child: IconTheme.merge(
          data: IconThemeData(size: _caretSmall, color: colors.textInverse),
          child: child ?? const SizedBox.shrink(),
        ),
      ),
    );
  }
}

/// 접히는 사이드바 그룹입니다.
///
/// 28px 라벨 행에 14px 캐럿을 두고, 위로 14px 띄웁니다. 캐럿은 닫혀 있을 때
/// -90°(위쪽 화살표가 오른쪽을 봄), 열려 있을 때 0°입니다.
class HoronSidebarGroup extends StatefulWidget {
  /// 그룹을 만듭니다.
  const HoronSidebarGroup({
    super.key,
    required this.label,
    required this.children,
    this.defaultOpen = true,
    this.onOpenChange,
  });

  /// 그룹 이름입니다.
  final String label;

  /// 열렸을 때 보이는 항목입니다.
  final List<Widget> children;

  /// 처음 열린 상태인지 여부입니다.
  final bool defaultOpen;

  /// 열림 상태가 바뀔 때 부를 콜백입니다.
  final ValueChanged<bool>? onOpenChange;

  @override
  State<HoronSidebarGroup> createState() => _HoronSidebarGroupState();
}

class _HoronSidebarGroupState extends State<HoronSidebarGroup> {
  late bool _open = widget.defaultOpen;
  bool _hovered = false;
  bool _focused = false;

  void _toggle() {
    setState(() => _open = !_open);
    widget.onOpenChange?.call(_open);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    // `motion-colors hover:text-text-primary` — 라벨과 캐럿이 함께 올라갑니다.
    final Color foreground = _hovered ? colors.textPrimary : colors.textSecondary;

    return Padding(
      // mt-3.5
      padding: EdgeInsets.only(top: space.s3_5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        // gap-0.5
        spacing: space.s0_5,
        children: <Widget>[
          FocusableActionDetector(
            mouseCursor: SystemMouseCursors.click,
            onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
            onShowFocusHighlight: (bool value) => setState(() => _focused = value),
            shortcuts: const <ShortcutActivator, Intent>{
              SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
              SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
            },
            actions: <Type, Action<Intent>>{
              ActivateIntent: CallbackAction<ActivateIntent>(
                onInvoke: (ActivateIntent intent) {
                  _toggle();
                  return null;
                },
              ),
            },
            child: Semantics(
              button: true,
              expanded: _open,
              label: widget.label,
              child: GestureDetector(
                onTap: _toggle,
                child: SizedBox(
                  // h-7 w-fit px-2.5
                  height: space.step(7),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: space.s2_5),
                    // focus-visible:outline-2 focus-visible:outline-text-brand
                    foregroundDecoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(theme.radius.xs),
                      border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      // gap-1
                      spacing: space.s1,
                      children: <Widget>[
                        AnimatedDefaultTextStyle(
                          duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
                          curve: HoronMotion.colorsCurve,
                          style: theme.text.labelMd.copyWith(color: foreground),
                          child: Text(widget.label, maxLines: 1),
                        ),
                        AnimatedRotation(
                          // group-not-data-panel-open:-rotate-90 group-data-panel-open:rotate-0
                          turns: _open ? 0 : -0.25,
                          duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
                          curve: HoronMotion.easeOutQuint,
                          child: Icon(
                            // @phosphor-icons/react CaretDown
                            Icons.expand_more,
                            size: _caretSmall,
                            color: foreground,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          ClipRect(
            child: AnimatedSize(
              duration: reduceMotion ? Duration.zero : HoronMotion.collapseDuration,
              curve: HoronMotion.collapseCurve,
              alignment: Alignment.topCenter,
              child: _open
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      spacing: space.s0_5,
                      children: widget.children,
                    )
                  : const SizedBox(width: double.infinity),
            ),
          ),
        ],
      ),
    );
  }
}

/// Figma `Tree`입니다.
///
/// 16px 연결선 열과, 부모에서 각 자식 행 가운데로 9px 곡선을 그리는 1.5px 선입니다.
/// 왼쪽으로 20px 들어가고 자식 사이는 2px입니다.
///
/// 연결선은 행 높이 32와 간격 2를 가정해 그립니다(React의 `ROW`·`GAP` 상수).
/// 자식이 여러 줄로 커지면 연결선이 행 가운데를 지나지 않습니다.
class HoronSidebarTree extends StatelessWidget {
  /// 트리를 만듭니다.
  const HoronSidebarTree({super.key, required this.children});

  /// 세로로 쌓을 항목입니다. 보통 [HoronSidebarItem]입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final int count = children.length;
    // ROW / 2 + (count - 1) * (ROW + GAP) + 0.75
    final double height = _treeRowHeight / 2 + (count <= 1 ? 0 : (count - 1) * (_treeRowHeight + _treeRowGap)) + 0.75;

    return Padding(
      // pl-5
      padding: EdgeInsets.only(left: space.s5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          SizedBox(
            width: _treeConnectorWidth,
            height: height,
            child: CustomPaint(
              painter: _SidebarTreeConnectorPainter(count: count, color: colors.overlayInk16),
            ),
          ),
          Expanded(
            // `[&_[data-slot=icon]>svg]:size-4` — 트리 안 아이콘은 16px입니다.
            child: _SidebarIconSize(
              size: _treeIconSize,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                // gap-0.5
                spacing: space.s0_5,
                children: children,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// 계정 카드를 아래로 밀어내는 빈 자리입니다.
///
/// React의 `min-h-px flex-1`입니다. 높이가 정해진 `Column` 안에 놓아야 남는 높이를
/// 차지합니다(높이가 무한하면 `Expanded`가 거부합니다).
class HoronSidebarSpacer extends StatelessWidget {
  /// 빈 자리를 만듭니다.
  const HoronSidebarSpacer({super.key});

  @override
  Widget build(BuildContext context) => const Expanded(child: SizedBox(height: 1, width: double.infinity));
}

/// Figma 사이드바 `Account`입니다.
///
/// 36px 하늘색 아바타 타일과 이름·메일, 위아래 캐럿을 한 줄에 놓습니다. 위아래 8px
/// 여백 위에 이름(20px)과 메일(18px) 두 줄이 쌓여 행 높이가 38px이 되고, 결과는
/// 54px입니다(메일이 없으면 52px). hover는 4% 잉크, 메뉴가 열려 있으면([menuOpen])
/// 6% 잉크입니다.
class HoronSidebarAccount extends StatefulWidget {
  /// 계정 행을 만듭니다.
  const HoronSidebarAccount({
    super.key,
    required this.initials,
    required this.name,
    this.email,
    this.menuOpen = false,
    this.onPressed,
  });

  /// 아바타 타일에 그릴 머리글자입니다.
  final String initials;

  /// 계정 이름입니다. 길면 말줄임합니다.
  final String name;

  /// 메일 주소입니다. 없으면 이름만 그립니다.
  final String? email;

  /// 계정 메뉴가 열려 있는지 여부입니다. 참이면 6% 잉크가 남습니다.
  final bool menuOpen;

  /// 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onPressed;

  @override
  State<HoronSidebarAccount> createState() => _HoronSidebarAccountState();
}

class _HoronSidebarAccountState extends State<HoronSidebarAccount> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // hover:bg-overlay-ink-4 data-popup-open:bg-overlay-ink-6
    final Color fill = widget.menuOpen
        ? colors.overlayInk6
        : _hovered
        ? colors.overlayInk4
        : Colors.transparent;

    return FocusableActionDetector(
      enabled: widget.onPressed != null,
      mouseCursor: widget.onPressed != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
      onShowFocusHighlight: (bool value) => setState(() => _focused = value),
      shortcuts: const <ShortcutActivator, Intent>{SingleActivator(LogicalKeyboardKey.enter): ActivateIntent()},
      actions: <Type, Action<Intent>>{
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (ActivateIntent intent) {
            widget.onPressed?.call();
            return null;
          },
        ),
      },
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
          curve: HoronMotion.colorsCurve,
          // py-2 pr-2 pl-1.5 rounded-lg
          padding: EdgeInsets.fromLTRB(space.s1_5, space.s2, space.s2, space.s2),
          decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(theme.radius.lg)),
          // focus-visible:outline-2 focus-visible:outline-text-brand
          foregroundDecoration: BoxDecoration(
            borderRadius: BorderRadius.circular(theme.radius.lg),
            border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
          ),
          child: Row(
            // gap-2.5
            spacing: space.s2_5,
            children: <Widget>[
              Container(
                // size-9 rounded-md bg-sky-200 text-surface-ink
                width: space.step(9),
                height: space.step(9),
                decoration: BoxDecoration(color: HoronPalette.sky200, borderRadius: BorderRadius.circular(_radius10)),
                child: Center(
                  child: Text(
                    widget.initials,
                    maxLines: 1,
                    overflow: TextOverflow.clip,
                    style: theme.text.labelMd.copyWith(color: colors.surfaceInk),
                  ),
                ),
              ),
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      widget.name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      // truncate text-label-md text-text-primary
                      style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                    ),
                    if (widget.email != null)
                      Text(
                        widget.email!,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        // truncate text-caption text-text-secondary
                        style: theme.text.caption.copyWith(color: colors.textSecondary),
                      ),
                  ],
                ),
              ),
              Icon(Icons.unfold_more, size: _caretLarge, color: colors.textPrimary),
            ],
          ),
        ),
      ),
    );
  }
}

/// Figma 사이드바 프로젝트 행입니다.
///
/// 타일·이름·14px 캐럿을 한 줄(32px)에 두고, 열려 있으면 아래에
/// [HoronSidebarTree]를 붙입니다. 캐럿은 열렸을 때 90° 돌아 아래를 봅니다.
///
/// [actions]가 있으면 **펼친 상태에서만** 캐럿 대신 16px "더 보기" 버튼을 보이고
/// 자식이 없는 프로젝트는 항상 보입니다(React `04f963d`의 `actions !== undefined &&
/// isOpen`·`!hasChildren || isOpen` 규칙). hover·포커스·메뉴 열림은 더 이상 표시
/// 조건이 아니며 6% 잉크 행 배경만 남깁니다.
///
/// [open]이 있으면 controlled, 없으면 [defaultOpen]에서 시작해 스스로 바뀝니다.
class HoronSidebarProject extends StatefulWidget {
  /// 프로젝트 행을 만듭니다.
  const HoronSidebarProject({
    super.key,
    required this.icon,
    required this.label,
    this.children = const <Widget>[],
    this.current = false,
    this.defaultOpen = false,
    this.open,
    this.onOpenChange,
    this.actions,
    this.menuOpen = false,
  });

  /// [HoronSidebarProjectTile] 같은 아이콘입니다.
  final Widget icon;

  /// 프로젝트 이름입니다. 길면 말줄임합니다.
  final String label;

  /// 펼쳤을 때 트리에 들어갈 항목입니다. 비어 있으면 캐럿이 없고 펼칠 수도 없습니다.
  final List<Widget> children;

  /// 지금 보고 있는 프로젝트인지 여부입니다. 참이면 6% 잉크가 남습니다.
  final bool current;

  /// 처음 펼친 상태인지 여부입니다.
  final bool defaultOpen;

  /// 펼침을 밖에서 정하는 값입니다. null이면 [defaultOpen]에서 시작해 스스로 바뀝니다.
  final bool? open;

  /// 펼침 상태가 바뀔 때 부를 콜백입니다.
  final ValueChanged<bool>? onOpenChange;

  /// "더 보기" 컨트롤입니다. 보통 [HoronSidebarProjectMore]입니다.
  ///
  /// 있으면 펼친 상태에서 캐럿 대신 보이고(자식이 없으면 항상), 접으면 캐럿만 남습니다.
  final Widget? actions;

  /// "더 보기" 메뉴가 열려 있는지 여부입니다. 참이면 행에 6% 잉크가 남습니다.
  ///
  /// React의 `has-data-popup-open` 자리이며, 표시 여부는 [open] 상태가 정합니다.
  final bool menuOpen;

  @override
  State<HoronSidebarProject> createState() => _HoronSidebarProjectState();
}

class _HoronSidebarProjectState extends State<HoronSidebarProject> {
  late bool _open = widget.defaultOpen;
  bool _hovered = false;
  bool _focused = false;

  bool get _isOpen => widget.open ?? _open;

  bool get _hasChildren => widget.children.isNotEmpty;

  void _toggle() {
    if (!_hasChildren) return;
    final bool next = !_isOpen;
    setState(() => _open = next);
    widget.onOpenChange?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // `current ? bg-overlay-ink-6 : hover:bg-overlay-ink-4`, `has-data-popup-open:bg-overlay-ink-6`
    final Color rowFill = widget.menuOpen
        ? colors.overlayInk6
        : _hovered
        ? colors.overlayInk4
        : widget.current
        ? colors.overlayInk6
        : Colors.transparent;

    final Widget row = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      // h-8 rounded-md
      height: space.step(8),
      decoration: BoxDecoration(color: rowFill, borderRadius: BorderRadius.circular(theme.radius.md)),
      // focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand
      foregroundDecoration: BoxDecoration(
        borderRadius: BorderRadius.circular(theme.radius.md),
        border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
      ),
      child: Stack(
        children: <Widget>[
          Positioned.fill(
            child: FocusableActionDetector(
              mouseCursor: SystemMouseCursors.click,
              onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
              onShowFocusHighlight: (bool value) => setState(() => _focused = value),
              shortcuts: const <ShortcutActivator, Intent>{SingleActivator(LogicalKeyboardKey.enter): ActivateIntent()},
              actions: <Type, Action<Intent>>{
                ActivateIntent: CallbackAction<ActivateIntent>(
                  onInvoke: (ActivateIntent intent) {
                    _toggle();
                    return null;
                  },
                ),
              },
              child: GestureDetector(
                onTap: _toggle,
                child: Padding(
                  // px-2.5
                  padding: EdgeInsets.symmetric(horizontal: space.s2_5),
                  child: Row(
                    // gap-2.5
                    spacing: space.s2_5,
                    children: <Widget>[
                      widget.icon,
                      Expanded(
                        child: Text(
                          widget.label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          // text-label-md text-text-primary
                          style: theme.text.labelMd.copyWith(color: colors.textPrimary),
                        ),
                      ),
                      if (_hasChildren)
                        Visibility(
                          // `actions && isOpen ? invisible` — 열린 프로젝트에서만 캐럿을
                          // 숨기고 자리는 남깁니다(`visibility:hidden`).
                          visible: !(widget.actions != null && _isOpen),
                          maintainSize: true,
                          maintainAnimation: true,
                          maintainState: true,
                          child: AnimatedRotation(
                            // group-data-panel-open/trigger:rotate-90
                            turns: _isOpen ? 0.25 : 0,
                            duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
                            curve: HoronMotion.easeOutQuint,
                            child: Icon(
                              // @phosphor-icons/react CaretRight
                              Icons.chevron_right,
                              size: _caretSmall,
                              color: colors.textPrimary,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (widget.actions != null)
            Positioned(
              // absolute right-2.5 inset-y-0 — 히트 영역이 넓어진 만큼 왼쪽으로
              // 옮겨, 보이는 아이콘은 `right-2.5` 자리에 남깁니다.
              top: 0,
              bottom: 0,
              right: space.s2_5 - _projectMoreHitInset,
              child: Center(
                child: Visibility(
                  // `!hasChildren || isOpen ? visible : invisible` — 자식이 없는
                  // 프로젝트는 항상, 자식이 있으면 펼쳤을 때만 More를 보입니다.
                  visible: !_hasChildren || _isOpen,
                  maintainSize: true,
                  maintainAnimation: true,
                  maintainState: true,
                  child: widget.actions!,
                ),
              ),
            ),
        ],
      ),
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      // gap-0.5
      spacing: space.s0_5,
      children: <Widget>[
        row,
        if (_hasChildren)
          ClipRect(
            child: AnimatedSize(
              duration: reduceMotion ? Duration.zero : HoronMotion.collapseDuration,
              curve: HoronMotion.collapseCurve,
              alignment: Alignment.topCenter,
              child: _isOpen ? HoronSidebarTree(children: widget.children) : const SizedBox(width: double.infinity),
            ),
          ),
      ],
    );
  }
}

/// 프로젝트 행의 16px "더 보기" 버튼입니다.
class HoronSidebarProjectMore extends StatefulWidget {
  /// 더 보기 버튼을 만듭니다.
  const HoronSidebarProjectMore({super.key, this.label = 'Project actions', this.onPressed});

  /// 접근성 이름입니다. React의 `label`입니다.
  final String label;

  /// 눌렀을 때 부를 콜백입니다. 보통 메뉴를 엽니다.
  final VoidCallback? onPressed;

  @override
  State<HoronSidebarProjectMore> createState() => _HoronSidebarProjectMoreState();
}

class _HoronSidebarProjectMoreState extends State<HoronSidebarProjectMore> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Semantics(
      button: true,
      label: widget.label,
      child: FocusableActionDetector(
        enabled: widget.onPressed != null,
        mouseCursor: widget.onPressed != null ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{SingleActivator(LogicalKeyboardKey.enter): ActivateIntent()},
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onPressed,
          // React `after:min-h-11 after:min-w-11` — 보이는 16px 밖으로 히트 영역을
          // 넓힙니다. 행 높이가 32라 세로로는 그 안까지만 닿습니다.
          child: SizedBox(
            width: _minTapTarget,
            height: space.step(8),
            child: Center(
              child: AnimatedContainer(
                duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
                curve: HoronMotion.colorsCurve,
                // size-4 rounded-xs, `hover:bg-overlay-ink-6`
                width: space.step(4),
                height: space.step(4),
                decoration: BoxDecoration(
                  color: _hovered && widget.onPressed != null ? colors.overlayInk6 : Colors.transparent,
                  borderRadius: BorderRadius.circular(theme.radius.xs),
                ),
                foregroundDecoration: BoxDecoration(
                  // focus-visible:outline-2 focus-visible:outline-text-brand
                  borderRadius: BorderRadius.circular(theme.radius.xs),
                  border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
                ),
                child: Icon(
                  // @phosphor-icons/react DotsThree
                  Icons.more_horiz,
                  size: space.step(4),
                  color: colors.textPrimary,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Figma `Add project`입니다.
///
/// 36px 버튼에 안쪽 1px 점선 테두리(4px 선, 3px 틈, 20% 잉크)를 그립니다. 라벨
/// 다음에 16px 더하기 아이콘이 오고, 위로 8px 띄웁니다.
class HoronSidebarAddButton extends StatefulWidget {
  /// 추가 버튼을 만듭니다.
  const HoronSidebarAddButton({super.key, required this.label, this.icon, this.onPressed});

  /// 버튼 문구입니다. React의 `children`입니다.
  final String label;

  /// 오른쪽 16px 아이콘입니다. 없으면 더하기 원입니다.
  final Widget? icon;

  /// 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onPressed;

  @override
  State<HoronSidebarAddButton> createState() => _HoronSidebarAddButtonState();
}

class _HoronSidebarAddButtonState extends State<HoronSidebarAddButton> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    return Padding(
      // mt-2
      padding: EdgeInsets.only(top: space.s2),
      child: FocusableActionDetector(
        mouseCursor: SystemMouseCursors.click,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        shortcuts: const <ShortcutActivator, Intent>{SingleActivator(LogicalKeyboardKey.enter): ActivateIntent()},
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          onTap: widget.onPressed,
          child: AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            // h-9 rounded-md hover:bg-overlay-ink-4
            height: space.step(9),
            decoration: BoxDecoration(
              color: _hovered ? colors.overlayInk4 : Colors.transparent,
              borderRadius: BorderRadius.circular(_radius10),
            ),
            // focus-visible:outline-2 focus-visible:outline-text-brand
            foregroundDecoration: BoxDecoration(
              borderRadius: BorderRadius.circular(_radius10),
              border: Border.all(color: _focused ? colors.textBrand : Colors.transparent, width: space.s0_5),
            ),
            child: Stack(
              children: <Widget>[
                Positioned.fill(
                  child: CustomPaint(
                    painter: _SidebarDashedBorderPainter(color: colors.overlayInk20, radius: _radius10),
                  ),
                ),
                Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    // gap-1.5
                    spacing: space.s1_5,
                    children: <Widget>[
                      Text(
                        widget.label,
                        maxLines: 1,
                        // text-label-md text-text-secondary
                        style: theme.text.labelMd.copyWith(color: colors.textSecondary),
                      ),
                      IconTheme.merge(
                        // React는 `[&>[data-slot=icon]]:size-4` 규칙을 지웠으므로 아이콘은
                        // 부모 글자 크기(1em)를 따릅니다. Flutter에는 em 상속이 없어 라벨
                        // 스타일(`label-md` = 14px)의 글자 크기를 그대로 넘깁니다.
                        data: IconThemeData(size: theme.text.labelMd.fontSize, color: colors.textSecondary),
                        child:
                            widget.icon ??
                            const Icon(
                              // @phosphor-icons/react PlusCircle
                              Icons.add_circle_outline,
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 트리 안에서만 아이콘 크기를 줄이는 상속 위젯입니다.
///
/// React의 `[&_[data-slot=icon]>svg]:size-4` 선택자를 Flutter의 상속으로 옮긴 것입니다.
class _SidebarIconSize extends InheritedWidget {
  const _SidebarIconSize({required this.size, required super.child});

  /// 자식 항목이 그릴 아이콘 크기입니다.
  final double size;

  static double? maybeOf(BuildContext context) => context.dependOnInheritedWidgetOfExactType<_SidebarIconSize>()?.size;

  @override
  bool updateShouldNotify(_SidebarIconSize oldWidget) => oldWidget.size != size;
}

/// 트리 연결선을 그립니다.
///
/// React `branchesPath(count)`와 같은 좌표입니다. 줄기는 (0.75, 0)에서 마지막 행
/// 가운데 9px 위까지 내려오고, 각 행 가운데에서 9px 곡선을 그려 (9.75, y)로 빠진 뒤
/// (13.75, y)에서 끝납니다.
class _SidebarTreeConnectorPainter extends CustomPainter {
  const _SidebarTreeConnectorPainter({required this.count, required this.color});

  final int count;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    if (count <= 0) return;
    final List<double> centers = <double>[
      for (int index = 0; index < count; index++) _treeRowHeight / 2 + index * (_treeRowHeight + _treeRowGap),
    ];
    final double last = centers.last;
    final Path path = Path()
      ..moveTo(0.75, 0)
      ..lineTo(0.75, last - _treeCurveRadius);
    for (final double center in centers) {
      final double start = center - _treeCurveRadius;
      path
        ..moveTo(0.75, start)
        ..cubicTo(0.75, start + 4.909, 4.841, center, 9.75, center)
        ..lineTo(13.75, center);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = _treeConnectorStroke,
    );
  }

  @override
  bool shouldRepaint(_SidebarTreeConnectorPainter oldDelegate) =>
      oldDelegate.count != count || oldDelegate.color != color;
}

/// 안쪽 점선 테두리를 그립니다.
///
/// React는 `stroke-width="2"`인 SVG rect를 안쪽 1px로 자릅니다. 여기서는 0.5px
/// 들여 그린 사각형에 1px 선으로 같은 결과를 냅니다.
class _SidebarDashedBorderPainter extends CustomPainter {
  const _SidebarDashedBorderPainter({required this.color, required this.radius});

  final Color color;
  final double radius;

  @override
  void paint(Canvas canvas, Size size) {
    final RRect rrect = RRect.fromRectAndRadius((Offset.zero & size).deflate(_dashStroke / 2), Radius.circular(radius));
    final Path path = Path()..addRRect(rrect);
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = _dashStroke;
    for (final PathMetric metric in path.computeMetrics()) {
      double distance = 0;
      while (distance < metric.length) {
        final double end = math.min(distance + _dashOn, metric.length);
        canvas.drawPath(metric.extractPath(distance, end), paint);
        distance = end + _dashOff;
      }
    }
  }

  @override
  bool shouldRepaint(_SidebarDashedBorderPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.radius != radius;
}
