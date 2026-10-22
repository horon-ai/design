import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../overlay/horon_overlay.dart';
import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'checkbox.dart';
import 'select.dart' show HoronChevronPainter;

/// 서브메뉴를 겹쳐 열 수 있는 최대 단계입니다.
///
/// 계획이 정한 상한입니다. 터치에서는 서브메뉴가 깊어질수록 다시 열기 어려우므로
/// 루트 패널과 그 아래 서브메뉴 하나, 두 단계까지만 허용합니다. 세 번째 단계를
/// 만들려 하면 [HoronDropdownMenuSubmenu]가 [StateError]를 던집니다.
const int horonMenuMaxSubmenuDepth = 2;

/// 팝업 메뉴 패널의 `min-w-36`입니다.
const double horonPopupMenuMinWidth = 144;

/// 팝업 메뉴 패널의 `p-1`입니다.
const double horonPopupMenuPadding = HoronSpace.s1;

/// 팝업 메뉴 패널의 높이 상한입니다. React는 `max-h-(--available-height)`로 화면에
/// 남은 자리를 쓰고, 여기서는 그 자리와 이 값 중 작은 쪽을 씁니다.
const double horonPopupMenuMaxHeight = 320;

/// 트리거의 `h-9`입니다.
const double _triggerHeight = HoronSpace.s9;

/// 트리거의 `px-3`입니다.
const double _triggerPaddingHorizontal = HoronSpace.s3;

/// 트리거의 `gap-1.5`입니다.
const double _triggerGap = HoronSpace.s1_5;

/// 트리거의 `focus-visible:ring-3`입니다.
const double _focusRingWidth = 3;

/// 트리거의 `ring-ring/50`입니다.
const double _focusRingAlpha = 0.5;

/// 항목의 `px-2`입니다.
const double _itemPaddingHorizontal = HoronSpace.s2;

/// 항목의 `py-1.5`입니다.
const double _itemPaddingVertical = HoronSpace.s1_5;

/// 항목의 `gap-1.5`입니다.
const double _itemGap = HoronSpace.s1_5;

/// 항목의 `text-sm`입니다.
const double _itemFontSize = HoronText.body;

/// `text-sm`의 줄 높이 1.25rem(20px)을 14px 글자로 나눈 값입니다.
const double _itemLineHeight = 20 / 14;

/// 항목 하나의 최소 높이입니다. `py-1.5` 두 번과 20px 줄 높이를 더한 값입니다.
const double _itemHeight = 32;

/// 체크·라디오 항목의 `pl-8`입니다. 표시 자리를 비워 둡니다.
const double _indicatorPaddingStart = HoronSpace.s8;

/// 체크·라디오 항목의 `pr-2`입니다.
const double _indicatorPaddingEnd = HoronSpace.s2;

/// 체크·라디오 표시의 `left-2`입니다.
const double _indicatorInset = HoronSpace.s2;

/// 표시 상자의 `size-4`입니다.
const double _indicatorSize = HoronSpace.s4;

/// 라디오 점의 `size-2`입니다.
const double _radioDotSize = HoronSpace.s2;

/// 표시 상자와 글자 사이의 거리입니다. React의 `pl-8`(32)에서 왼쪽 여백 8과 표시
/// 폭 16을 뺴 8이 남습니다.
const double _indicatorGap = _indicatorPaddingStart - _indicatorInset - _indicatorSize;

/// 항목 아이콘의 `size-4`입니다.
const double _iconSize = HoronSpace.s4;

/// 라벨의 `px-2`입니다.
const double _labelPaddingHorizontal = HoronSpace.s2;

/// 라벨의 `py-1.5`입니다.
const double _labelPaddingVertical = HoronSpace.s1_5;

/// 라벨의 `text-xs`입니다.
const double _labelFontSize = HoronText.caption;

/// 구분선의 `my-1`입니다.
const double _separatorMargin = HoronSpace.s1;

/// 구분선 두께입니다. CSS `h-px`입니다.
const double _separatorThickness = 1.0;

/// `data-disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// 체크 표시 선 두께입니다. lucide `Check`의 24 그리드 `stroke-width` 2를
/// 16px 상자로 옮긴 값입니다.
const double _checkStrokeWidth = 1.4;

/// 열려 있는 팝업 메뉴의 상태를 자손에게 나릅니다.
///
/// React는 Base UI의 `Menu.Root`가 열림·닫기·중첩을 소유합니다. Flutter에서는
/// `dropdown_menu`·`context_menu`·`menubar` 세 루트가 같은 항목 위젯을 공유하므로,
/// 세 루트가 이 위젯으로 다음을 내려 줍니다.
///
/// - [groupId]: 메뉴 패널과 서브메뉴 패널을 하나의 탭 영역으로 묶습니다. 그래야
///   서브메뉴 안을 눌렀을 때 바깥 탭으로 읽혀 루트 메뉴가 닫히지 않습니다.
/// - [open]: 트리거가 자기 모양을 열림에 맞춥니다(`data-popup-open`).
/// - [close]: 항목을 골랐을 때 메뉴를 닫습니다.
/// - [level]: 지금 패널의 단계입니다. 트리거 자리가 0, 첫 패널이 1, 그 아래
///   서브메뉴 패널이 2입니다.
class HoronPopupMenuScope extends InheritedWidget {
  /// 스코프를 만듭니다.
  const HoronPopupMenuScope({
    super.key,
    required this.groupId,
    required this.open,
    required this.close,
    this.level = 0,
    required super.child,
  });

  /// 이 메뉴에 속한 탭 영역의 식별자입니다.
  final Object groupId;

  /// 루트 메뉴가 열려 있는지입니다.
  final bool open;

  /// 루트 메뉴를 닫습니다.
  final VoidCallback close;

  /// 지금 패널의 단계입니다.
  final int level;

  /// 가장 가까운 스코프를 돌려줍니다. 메뉴 밖이면 `null`입니다.
  static HoronPopupMenuScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<HoronPopupMenuScope>();

  @override
  bool updateShouldNotify(HoronPopupMenuScope oldWidget) =>
      oldWidget.open != open || oldWidget.level != level || oldWidget.groupId != groupId;
}

/// 라디오 그룹의 값과 변경 함수를 자손 라디오 항목에게 나릅니다.
class _HoronRadioGroupScope<T> extends InheritedWidget {
  const _HoronRadioGroupScope({required this.value, required this.onChanged, required super.child});

  final T? value;
  final ValueChanged<T>? onChanged;

  static _HoronRadioGroupScope<T>? maybeOf<T>(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronRadioGroupScope<T>>();

  @override
  bool updateShouldNotify(_HoronRadioGroupScope<T> oldWidget) => oldWidget.value != value;
}

/// 트리거에 붙는 드롭다운 메뉴입니다.
///
/// `dropdown-menu.tsx`를 옮긴 것입니다. 트리거를 누르면 유리 패널이 열리고,
/// 항목·체크박스 항목·라디오 항목·서브메뉴·그룹 라벨·구분선을 담습니다. 배치는
/// [HoronOverlay]가 맡으므로 화면 밖으로 나가면 뒤집히고 화면 안으로 밀려
/// 들어옵니다. 바깥을 누르거나 `Escape`를 누르면 닫힙니다.
///
/// ```dart
/// HoronDropdownMenu(
///   trigger: const HoronDropdownMenuTrigger(label: '보기'),
///   children: <Widget>[
///     const HoronDropdownMenuLabel(label: '밀도'),
///     HoronDropdownMenuRadioGroup<String>(
///       value: density,
///       onChanged: (String value) => setState(() => density = value),
///       children: <Widget>[
///         HoronDropdownMenuRadioItem<String>(value: 'compact', label: '좁게'),
///         HoronDropdownMenuRadioItem<String>(value: 'roomy', label: '넓게'),
///       ],
///     ),
///   ],
/// );
/// ```
class HoronDropdownMenu extends StatefulWidget {
  /// 메뉴를 만듭니다.
  const HoronDropdownMenu({
    super.key,
    required this.trigger,
    required this.children,
    this.position = const HoronOverlayPosition(),
    this.minWidth = horonPopupMenuMinWidth,
    this.semanticLabel,
    this.enabled = true,
  });

  /// 트리거 위젯입니다. 보통 [HoronDropdownMenuTrigger]입니다.
  final Widget trigger;

  /// 펼쳐졌을 때 보일 항목들입니다.
  final List<Widget> children;

  /// 패널이 붙을 방향과 정렬입니다.
  final HoronOverlayPosition position;

  /// 패널의 최소 폭입니다. React의 `min-w-36`이 기본값입니다.
  final double minWidth;

  /// 스크린리더가 읽을 메뉴 이름입니다.
  final String? semanticLabel;

  /// 열 수 있는 상태인지입니다.
  final bool enabled;

  @override
  State<HoronDropdownMenu> createState() => _HoronDropdownMenuState();
}

class _HoronDropdownMenuState extends State<HoronDropdownMenu> {
  final HoronOverlayController _controller = HoronOverlayController();
  final Object _tapGroup = Object();
  final FocusNode _panelFocus = FocusNode(debugLabel: 'horon-dropdown-menu');

  @override
  void dispose() {
    _controller.dispose();
    _panelFocus.dispose();
    super.dispose();
  }

  void _close() {
    if (!_controller.isOpen) return;
    _controller.hide();
    _panelFocus.unfocus();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
      _close();
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (BuildContext context, Widget? child) => HoronPopupMenuScope(
        groupId: _tapGroup,
        open: _controller.isOpen,
        close: _close,
        child: TapRegion(
          groupId: _tapGroup,
          onTapOutside: (_) => _close(),
          child: HoronOverlay(
            controller: _controller,
            position: widget.position,
            trigger: Semantics(
              button: true,
              expanded: _controller.isOpen,
              label: widget.semanticLabel,
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTap: widget.enabled ? _controller.toggle : null,
                child: widget.trigger,
              ),
            ),
            panelBuilder: (BuildContext context, HoronOverlayPlacement placement) => TapRegion(
              groupId: _tapGroup,
              child: HoronPopupMenuScope(
                groupId: _tapGroup,
                open: true,
                close: _close,
                level: 1,
                child: Focus(
                  focusNode: _panelFocus,
                  autofocus: true,
                  onKeyEvent: _onKey,
                  child: HoronDropdownMenuContent(
                    minWidth: widget.minWidth,
                    maxHeight: math.min(placement.maxHeight, horonPopupMenuMaxHeight),
                    children: widget.children,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `dropdown-menu.tsx`의 `DropdownMenuTrigger`입니다.
///
/// `h-9`·`rounded-md`·`border-input`·`px-3`·`text-sm font-medium`을 그대로 옮깁니다.
/// 메뉴가 열려 있으면 `data-popup-open:bg-accent`처럼 강조 채움을 칠하고, 포커스를
/// 받으면 금색 링을 그립니다. 누르는 동작은 [HoronDropdownMenu]가 감싸므로 이
/// 위젯은 모양과 접근성만 맡습니다.
class HoronDropdownMenuTrigger extends StatefulWidget {
  /// 트리거를 만듭니다.
  const HoronDropdownMenuTrigger({super.key, this.label, this.child, this.icon, this.semanticLabel})
    : assert(label != null || child != null, 'HoronDropdownMenuTrigger needs a label or a child.');

  /// 트리거 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘 슬롯입니다.
  final Widget? icon;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDropdownMenuTrigger> createState() => _HoronDropdownMenuTriggerState();
}

class _HoronDropdownMenuTriggerState extends State<HoronDropdownMenuTrigger> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool open = HoronPopupMenuScope.maybeOf(context)?.open ?? false;
    final bool accent = open || _hovered;

    final Color? ring = _focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null;
    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _itemFontSize,
      height: HoronLineHeight.none,
      fontWeight: HoronFontWeight.medium,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    return Semantics(
      button: true,
      label: widget.semanticLabel ?? widget.label,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: FocusableActionDetector(
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: HoronDuration.fast),
            curve: HoronEasing.easingDefault,
            height: _triggerHeight,
            padding: const EdgeInsets.symmetric(horizontal: _triggerPaddingHorizontal),
            decoration: BoxDecoration(
              color: accent ? scheme.surfaceContainerHighest : Colors.transparent,
              borderRadius: BorderRadius.circular(HoronRadiusRole.control),
              border: Border.all(color: _focused ? horon.ring : scheme.outline),
              boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _focusRingWidth)],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                if (widget.icon != null) ...<Widget>[
                  IconTheme.merge(
                    data: IconThemeData(size: _iconSize, color: scheme.onSurfaceVariant),
                    child: widget.icon!,
                  ),
                  const SizedBox(width: _triggerGap),
                ],
                DefaultTextStyle(
                  style: textStyle,
                  child: widget.label != null
                      ? Text(
                          widget.label!,
                          maxLines: 1,
                          softWrap: false,
                          overflow: TextOverflow.ellipsis,
                          style: textStyle,
                        )
                      : widget.child!,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 팝업 메뉴의 유리 패널입니다.
///
/// `dropdown-menu.tsx`의 `DropdownMenuContent`입니다. `.glass-strong` 표면에
/// `min-w-36`, `p-1`, `rounded-md`, `text-sm`을 씁니다. 표면·그림자·모서리 자르기는
/// [HoronOverlayPanel]이 맡고, 이 위젯은 폭·여백·스크롤만 정합니다. 폭은 내용에
/// 맞춰 줄어들되 [minWidth]보다 좁아지지 않습니다.
///
/// React는 같은 클래스를 `context-menu.tsx`와 `menubar.tsx`에도 반복하므로,
/// [HoronContextMenuContent]와 [HoronMenubarContent]도 이 위젯을 씁니다.
class HoronDropdownMenuContent extends StatelessWidget {
  /// 패널 내용을 만듭니다.
  const HoronDropdownMenuContent({
    super.key,
    required this.children,
    this.minWidth = horonPopupMenuMinWidth,
    this.maxHeight,
    this.padding = const EdgeInsets.all(horonPopupMenuPadding),
  });

  /// 패널 안에 세로로 쌓을 항목입니다.
  final List<Widget> children;

  /// 패널의 최소 폭입니다.
  final double minWidth;

  /// 패널이 넘지 않을 최대 높이입니다.
  final double? maxHeight;

  /// 패널 안쪽 여백입니다.
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    return HoronOverlayPanel(
      maxHeight: maxHeight,
      padding: padding,
      child: SingleChildScrollView(
        child: ConstrainedBox(
          constraints: BoxConstraints(minWidth: minWidth),
          child: IntrinsicWidth(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: children,
            ),
          ),
        ),
      ),
    );
  }
}

/// `dropdown-menu.tsx`의 `DropdownMenuItem`입니다.
///
/// `rounded-md`·`px-2 py-1.5`·`text-sm`·`gap-1.5`에, 마우스를 올리거나 키보드로
/// 포커스를 받으면 `bg-accent`를 칠합니다. 고르면 [HoronPopupMenuScope.close]가
/// 메뉴를 닫습니다.
class HoronDropdownMenuItem extends StatefulWidget {
  /// 항목을 만듭니다.
  const HoronDropdownMenuItem({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.trailing,
    this.onSelected,
    this.enabled = true,
    this.semanticLabel,
  }) : assert(label != null || child != null, 'HoronDropdownMenuItem needs a label or a child.');

  /// 항목 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘 슬롯입니다.
  final Widget? icon;

  /// 오른쪽 끝에 붙는 내용입니다. 예: `HoronMenuShortcut`.
  final Widget? trailing;

  /// 항목을 골랐을 때 부릅니다.
  final VoidCallback? onSelected;

  /// 고를 수 있는 상태인지입니다.
  final bool enabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDropdownMenuItem> createState() => _HoronDropdownMenuItemState();
}

class _HoronDropdownMenuItemState extends State<HoronDropdownMenuItem> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool enabled = widget.enabled;
    final bool highlighted = enabled && (_hovered || _focused);
    final TextStyle textStyle = _popupTextStyle(scheme);

    final Widget body = Container(
      constraints: const BoxConstraints(minHeight: _itemHeight),
      padding: const EdgeInsets.symmetric(horizontal: _itemPaddingHorizontal, vertical: _itemPaddingVertical),
      decoration: BoxDecoration(
        color: highlighted ? scheme.surfaceContainerHighest : Colors.transparent,
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              if (widget.icon != null) ...<Widget>[
                IconTheme.merge(
                  data: IconThemeData(size: _iconSize, color: scheme.onSurfaceVariant),
                  child: widget.icon!,
                ),
                const SizedBox(width: _itemGap),
              ],
              if (widget.label != null)
                Text(widget.label!, maxLines: 1, softWrap: false, style: textStyle)
              else
                DefaultTextStyle(style: textStyle, child: widget.child!),
            ],
          ),
          if (widget.trailing != null) ...<Widget>[const SizedBox(width: _itemGap), widget.trailing!],
        ],
      ),
    );

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.semanticLabel ?? widget.label,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: FocusableActionDetector(
          enabled: enabled,
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                _select(context);
                return null;
              },
            ),
          },
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: enabled ? () => _select(context) : null,
            child: Opacity(opacity: enabled ? 1 : _disabledOpacity, child: body),
          ),
        ),
      ),
    );
  }

  void _select(BuildContext context) {
    if (!widget.enabled) return;
    widget.onSelected?.call();
    HoronPopupMenuScope.maybeOf(context)?.close();
  }
}

/// `dropdown-menu.tsx`의 `DropdownMenuLabel`입니다.
///
/// `px-2 py-1.5 text-xs`에 `text-muted-foreground`를 씁니다.
class HoronDropdownMenuLabel extends StatelessWidget {
  /// 라벨을 만듭니다.
  const HoronDropdownMenuLabel({super.key, required this.label});

  /// 라벨 글자입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: _labelPaddingHorizontal, vertical: _labelPaddingVertical),
      child: Text(
        label,
        style: TextStyle(
          fontFamily: HoronFont.body,
          fontFamilyFallback: HoronFont.fontFamilyFallback,
          fontSize: _labelFontSize,
          height: HoronLineHeight.normal,
          color: scheme.onSurfaceVariant,
          decoration: TextDecoration.none,
        ),
      ),
    );
  }
}

/// 항목들을 하나의 그룹으로 묶습니다. 라벨은 선택입니다.
///
/// React는 `DropdownMenuLabel`이 그룹을 함께 열지만, 여기서는 라벨과 항목을 한
/// 위젯으로 묶어 호출부가 두 번 감싸지 않게 했습니다.
class HoronDropdownMenuGroup extends StatelessWidget {
  /// 그룹을 만듭니다.
  const HoronDropdownMenuGroup({super.key, required this.children, this.label});

  /// 그룹에 넣을 항목입니다.
  final List<Widget> children;

  /// 그룹 위 라벨입니다.
  final String? label;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        if (label != null) HoronDropdownMenuLabel(label: label!),
        ...children,
      ],
    );
  }
}

/// `dropdown-menu.tsx`의 `DropdownMenuSeparator`입니다.
///
/// `-mx-1 my-1 h-px bg-border`를 그대로 옮깁니다. 패널 여백 4를 되돌리는 음수
/// 여백이라 선이 패널 양 끝까지 닿습니다.
class HoronDropdownMenuSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronDropdownMenuSeparator({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: _separatorMargin),
      child: SizedBox(
        height: _separatorThickness,
        child: ColoredBox(color: scheme.outline),
      ),
    );
  }
}

/// `dropdown-menu.tsx`의 `DropdownMenuCheckboxItem`입니다.
///
/// `pl-8`이 비워 둔 왼쪽 자리에 `size-4` 체크 표시를 그립니다. 선택은 호스트가
/// [checked]로 소유하고 [onChanged]로 되돌려 받습니다. React의 Base UI와 같이
/// 체크 항목은 메뉴를 닫지 않으므로 여러 개를 이어서 고를 수 있습니다.
class HoronDropdownMenuCheckboxItem extends StatefulWidget {
  /// 체크 항목을 만듭니다.
  const HoronDropdownMenuCheckboxItem({
    super.key,
    required this.label,
    required this.checked,
    this.onChanged,
    this.enabled = true,
    this.semanticLabel,
  });

  /// 항목 글자입니다.
  final String label;

  /// 지금 선택 상태입니다.
  final bool checked;

  /// 선택이 바뀔 때 부릅니다. `null`이면 눌러도 바뀌지 않습니다.
  final ValueChanged<bool>? onChanged;

  /// 고를 수 있는 상태인지입니다.
  final bool enabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDropdownMenuCheckboxItem> createState() => _HoronDropdownMenuCheckboxItemState();
}

class _HoronDropdownMenuCheckboxItemState extends State<HoronDropdownMenuCheckboxItem> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool enabled = widget.enabled;
    final bool highlighted = enabled && _hovered;
    final TextStyle textStyle = _popupTextStyle(scheme);

    return Semantics(
      checked: widget.checked,
      enabled: enabled,
      label: widget.semanticLabel ?? widget.label,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: enabled ? () => widget.onChanged?.call(!widget.checked) : null,
          child: Opacity(
            opacity: enabled ? 1 : _disabledOpacity,
            child: Container(
              constraints: const BoxConstraints(minHeight: _itemHeight),
              padding: const EdgeInsetsDirectional.only(
                start: _indicatorInset,
                end: _indicatorPaddingEnd,
                top: _itemPaddingVertical,
                bottom: _itemPaddingVertical,
              ),
              decoration: BoxDecoration(
                color: highlighted ? scheme.surfaceContainerHighest : Colors.transparent,
                borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              ),
              child: Row(
                children: <Widget>[
                  // React는 표시를 `left-2`에 절대 배치하고 본문을 `pl-8`로 밀어
                  // 둡니다. 여기서는 같은 자리를 늘 비워 두는 슬롯으로 만듭니다.
                  SizedBox(
                    width: _indicatorSize,
                    height: _indicatorSize,
                    child: widget.checked
                        ? CustomPaint(
                            painter: HoronCheckMarkPainter(
                              color: scheme.onSurface,
                              indeterminate: false,
                              strokeWidth: _checkStrokeWidth,
                            ),
                          )
                        : null,
                  ),
                  const SizedBox(width: _indicatorGap),
                  Expanded(child: Text(widget.label, maxLines: 1, softWrap: false, style: textStyle)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// `dropdown-menu.tsx`의 `DropdownMenuRadioGroup`입니다.
///
/// 선택 값과 변경 함수를 자손 [HoronDropdownMenuRadioItem]에게 나릅니다.
class HoronDropdownMenuRadioGroup<T> extends StatelessWidget {
  /// 라디오 그룹을 만듭니다.
  const HoronDropdownMenuRadioGroup({super.key, required this.children, this.value, this.onChanged});

  /// 그룹에 넣을 라디오 항목입니다.
  final List<Widget> children;

  /// 지금 선택된 값입니다.
  final T? value;

  /// 선택이 바뀔 때 부릅니다.
  final ValueChanged<T>? onChanged;

  @override
  Widget build(BuildContext context) {
    return _HoronRadioGroupScope<T>(
      value: value,
      onChanged: onChanged,
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: children),
    );
  }
}

/// `dropdown-menu.tsx`의 `DropdownMenuRadioItem`입니다.
///
/// `pl-8` 자리에 `size-2` 채운 점을 그립니다. React는 `CircleIcon`에 `fill-current`를
/// 주므로 점은 전경색으로 꽉 찹니다. 고르면 메뉴가 닫힙니다.
class HoronDropdownMenuRadioItem<T> extends StatefulWidget {
  /// 라디오 항목을 만듭니다.
  const HoronDropdownMenuRadioItem({
    super.key,
    required this.value,
    required this.label,
    this.enabled = true,
    this.semanticLabel,
  });

  /// 이 항목이 나타내는 값입니다.
  final T value;

  /// 항목 글자입니다.
  final String label;

  /// 고를 수 있는 상태인지입니다.
  final bool enabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDropdownMenuRadioItem<T>> createState() => _HoronDropdownMenuRadioItemState<T>();
}

class _HoronDropdownMenuRadioItemState<T> extends State<HoronDropdownMenuRadioItem<T>> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronRadioGroupScope<T>? scope = _HoronRadioGroupScope.maybeOf<T>(context);
    final bool selected = scope?.value == widget.value;
    final bool enabled = widget.enabled;
    final bool highlighted = enabled && _hovered;
    final TextStyle textStyle = _popupTextStyle(scheme);

    return Semantics(
      inMutuallyExclusiveGroup: true,
      checked: selected,
      enabled: enabled,
      label: widget.semanticLabel ?? widget.label,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: enabled
              ? () {
                  scope?.onChanged?.call(widget.value);
                  HoronPopupMenuScope.maybeOf(context)?.close();
                }
              : null,
          child: Opacity(
            opacity: enabled ? 1 : _disabledOpacity,
            child: Container(
              constraints: const BoxConstraints(minHeight: _itemHeight),
              padding: const EdgeInsetsDirectional.only(
                start: _indicatorInset,
                end: _indicatorPaddingEnd,
                top: _itemPaddingVertical,
                bottom: _itemPaddingVertical,
              ),
              decoration: BoxDecoration(
                color: highlighted ? scheme.surfaceContainerHighest : Colors.transparent,
                borderRadius: BorderRadius.circular(HoronRadiusRole.card),
              ),
              child: Row(
                children: <Widget>[
                  SizedBox(
                    width: _indicatorSize,
                    height: _indicatorSize,
                    child: selected
                        ? Center(
                            child: Container(
                              width: _radioDotSize,
                              height: _radioDotSize,
                              decoration: BoxDecoration(color: scheme.onSurface, shape: BoxShape.circle),
                            ),
                          )
                        : null,
                  ),
                  const SizedBox(width: _indicatorGap),
                  Expanded(child: Text(widget.label, maxLines: 1, softWrap: false, style: textStyle)),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 서브메뉴를 여는 항목입니다.
///
/// 항목을 누르거나 마우스를 올리면 오른쪽에 하위 패널이 열립니다. 배치는
/// [HoronOverlay]가 맡고, 오른쪽에 자리가 없으면 왼쪽으로 뒤집힙니다.
///
/// 깊이는 [horonMenuMaxSubmenuDepth]까지만 허용합니다. 부모 패널의
/// [HoronPopupMenuScope.level]이 상한에 닿았는데 또 서브메뉴를 만들면
/// [StateError]를 던집니다. 터치에서 세 단계를 넘기면 다시 열기 어려워지는 것을
/// 막는 계약입니다.
class HoronDropdownMenuSubmenu extends StatefulWidget {
  /// 서브메뉴를 만듭니다.
  const HoronDropdownMenuSubmenu({
    super.key,
    required this.label,
    required this.children,
    this.enabled = true,
    this.semanticLabel,
  });

  /// 서브메뉴를 여는 항목의 글자입니다.
  final String label;

  /// 하위 패널에 넣을 항목입니다.
  final List<Widget> children;

  /// 열 수 있는 상태인지입니다.
  final bool enabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronDropdownMenuSubmenu> createState() => _HoronDropdownMenuSubmenuState();
}

class _HoronDropdownMenuSubmenuState extends State<HoronDropdownMenuSubmenu> {
  final HoronOverlayController _controller = HoronOverlayController();
  bool _hovered = false;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onOpenChanged);
  }

  @override
  void dispose() {
    _controller.removeListener(_onOpenChanged);
    _controller.dispose();
    super.dispose();
  }

  void _onOpenChanged() {
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final HoronPopupMenuScope? scope = HoronPopupMenuScope.maybeOf(context);
    final int level = scope?.level ?? 1;
    if (level >= horonMenuMaxSubmenuDepth) {
      throw StateError(
        'HoronDropdownMenuSubmenu는 $horonMenuMaxSubmenuDepth단계까지만 엽니다. '
        '지금은 $level단계 패널 안이라 더 깊은 서브메뉴를 만들 수 없습니다.',
      );
    }

    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Object tapGroup = scope?.groupId ?? this;
    final bool open = _controller.isOpen;
    final bool highlighted = widget.enabled && (open || _hovered);
    final TextStyle textStyle = _popupTextStyle(scheme);

    final Widget row = Container(
      constraints: const BoxConstraints(minHeight: _itemHeight),
      padding: const EdgeInsets.symmetric(horizontal: _itemPaddingHorizontal, vertical: _itemPaddingVertical),
      decoration: BoxDecoration(
        color: highlighted ? scheme.surfaceContainerHighest : Colors.transparent,
        borderRadius: BorderRadius.circular(HoronRadiusRole.card),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Text(widget.label, maxLines: 1, softWrap: false, style: textStyle),
          const SizedBox(width: _itemGap),
          // lucide `ChevronRight` 대신 `ChevronDown`을 오른쪽으로 돌려 그립니다.
          Transform.rotate(
            angle: -math.pi / 2,
            child: SizedBox(
              width: _iconSize,
              height: _iconSize,
              child: CustomPaint(painter: HoronChevronPainter(color: scheme.onSurfaceVariant)),
            ),
          ),
        ],
      ),
    );

    return TapRegion(
      groupId: tapGroup,
      onTapOutside: (_) {
        if (_controller.isOpen) _controller.hide();
      },
      child: MouseRegion(
        onEnter: widget.enabled
            ? (_) {
                setState(() => _hovered = true);
                _controller.show();
              }
            : null,
        onExit: widget.enabled ? (_) => setState(() => _hovered = false) : null,
        child: HoronOverlay(
          controller: _controller,
          position: const HoronOverlayPosition(side: HoronOverlaySide.right, align: HoronOverlayAlign.start),
          trigger: Semantics(
            button: true,
            expanded: open,
            enabled: widget.enabled,
            label: widget.semanticLabel ?? widget.label,
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: widget.enabled ? _controller.toggle : null,
              child: Opacity(opacity: widget.enabled ? 1 : _disabledOpacity, child: row),
            ),
          ),
          panelBuilder: (BuildContext context, HoronOverlayPlacement placement) => TapRegion(
            groupId: tapGroup,
            child: HoronPopupMenuScope(
              groupId: tapGroup,
              open: true,
              close: scope?.close ?? _controller.hide,
              level: level + 1,
              child: HoronDropdownMenuContent(
                maxHeight: math.min(placement.maxHeight, horonPopupMenuMaxHeight),
                children: widget.children,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// 팝업 메뉴 항목이 공유하는 글자 스타일입니다.
///
/// `text-sm`(14)에 `text-sm`의 줄 높이 20을 붙입니다. React의 `text-accent-foreground`는
/// `foreground`와 같은 값이라 [ColorScheme.onSurface]를 씁니다.
TextStyle _popupTextStyle(ColorScheme scheme) => TextStyle(
  fontFamily: HoronFont.body,
  fontFamilyFallback: HoronFont.fontFamilyFallback,
  fontSize: _itemFontSize,
  height: _itemLineHeight,
  color: scheme.onSurface,
  decoration: TextDecoration.none,
);
