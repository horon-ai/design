import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';

/// `sidebar.tsx` 헤더의 `h-14`입니다. [HoronSidebarMetrics.collapsed]와 같은 56입니다.
const double _sidebarHeaderHeight = HoronSpace.s14;

/// `sidebar.tsx` 헤더의 `px-3`/`gap-2`입니다.
const double _sidebarHeaderPadding = HoronSpace.s3;

/// `sidebar.tsx` 헤더의 `gap-2`입니다.
const double _sidebarHeaderGap = HoronSpace.s2;

/// `sidebar.tsx` 내용의 `px-2 py-2`/`gap-3`입니다.
const double _sidebarContentPadding = HoronSpace.s2;

/// `sidebar.tsx` 내용의 `gap-3`입니다.
const double _sidebarContentGap = HoronSpace.s3;

/// `sidebar.tsx` 꼬리말의 `gap-1`입니다.
const double _sidebarFooterGap = HoronSpace.s1;

/// `sidebar.tsx` 그룹의 `gap-0.5`입니다.
const double _sidebarGroupGap = HoronSpace.s0_5;

/// `sidebar.tsx` 메뉴 버튼의 `px-2.5`/`gap-2.5`입니다.
const double _sidebarMenuPadding = HoronSpace.s2_5;

/// `sidebar.tsx` 메뉴 버튼의 `gap-2.5`입니다.
const double _sidebarMenuGap = HoronSpace.s2_5;

/// `sidebar.tsx` 메뉴 버튼의 `py-2`입니다.
const double _sidebarMenuPaddingV = HoronSpace.s2;

/// 접힌 사이드바에서 메뉴 버튼이 라벨을 감추는지 판단하는 폭입니다.
///
/// React는 접힌 상태에서 라벨을 `[&>span]:hidden`으로 감추고, 접히는 동안에는
/// `overflow-hidden`으로 자릅니다. Flutter의 `Row`는 넘치는 순간 오류를 내므로
/// 같은 전환을 폭으로 판단합니다.
const double _sidebarCompactWidth = HoronSpace.s10;

/// 머리말이 첫 자식만 그리는 최소 폭입니다. 접힌 폭 56에서 `px-3`을 뺀 32보다 큽니다.
const double _sidebarHeaderCompactWidth = HoronSpace.s20;

/// `sidebar.tsx`의 `text-sm`입니다.
const double _sidebarFontSize = HoronText.body;

/// `sidebar.tsx` 메뉴 버튼 아이콘의 `size-4`입니다.
const double _sidebarIconSize = HoronSpace.s4;

/// `sidebar.tsx`의 `transition-[width] duration-200 ease-out`입니다.
const Duration _sidebarDuration = Duration(milliseconds: HoronDuration.slow);

/// `focus-visible:ring-3 focus-visible:ring-ring/50`을 4px 눈금의 2px 단계로 옮긴 값입니다.
const double _sidebarFocusRingSpread = HoronSpace.s0_5;

/// `focus-visible:ring-ring/50`의 불투명도입니다.
const double _sidebarFocusRingAlpha = 0.5;

/// `disabled:opacity-50`입니다.
const double _sidebarDisabledOpacity = 0.5;

/// 사이드바의 펼침 상태를 자식에게 알리는 스코프입니다.
class _HoronSidebarScope extends InheritedWidget {
  const _HoronSidebarScope({required this.open, required this.toggle, required super.child});

  /// 펼쳐져 있는지 여부입니다.
  final bool open;

  /// 펼침을 뒤집는 콜백입니다.
  final VoidCallback toggle;

  static _HoronSidebarScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronSidebarScope>();

  @override
  bool updateShouldNotify(_HoronSidebarScope oldWidget) => open != oldWidget.open;
}

/// 접었다 펼 수 있는 세로 내비게이션입니다.
///
/// `sidebar.tsx`의 `Sidebar`를 옮긴 것입니다. React는 `w-64`(256)에서
/// `data-[state=collapsed]:w-14`(56)로 폭을 옮기며 `transition-[width]
/// duration-200 ease-out`을 겁니다. 폭은 생성 토큰
/// [HoronSidebarMetrics.expanded]/[HoronSidebarMetrics.collapsed]가 들고 있고,
/// 시간은 [HoronDuration.slow], 곡선은 [HoronEasing.out]입니다.
///
/// 색은 React의 `bg-card text-card-foreground border-border` 대신
/// [HoronThemeData]의 `sidebar*` 슬롯을 씁니다. 그래야 사이드바가 본문 카드와
/// 같은 표면으로 보이지 않고 자기 층을 갖습니다.
///
/// 이 위젯은 부모가 정한 높이를 채웁니다. 높이가 무한한 자리에서는 [Column]이
/// 설 자리가 없어 예외가 나므로, 화면 높이를 정한 부모 안에 두십시오.
///
/// ```dart
/// Row(
///   children: <Widget>[
///     HoronSidebar(
///       children: <Widget>[
///         HoronSidebarHeader(children: <Widget>[HoronSidebarTrigger()]),
///         HoronSidebarContent(children: <Widget>[HoronSidebarGroup(children: items)]),
///       ],
///     ),
///     HoronSidebarInset(child: page),
///   ],
/// );
/// ```
class HoronSidebar extends StatefulWidget {
  /// 사이드바 하나를 만듭니다.
  const HoronSidebar({super.key, required this.children, this.open, this.defaultOpen = true, this.onOpenChanged});

  /// 헤더·내용·꼬리말 파트입니다.
  final List<Widget> children;

  /// 펼침 상태입니다. null이면 이 위젯이 상태를 소유합니다.
  final bool? open;

  /// 제어 모드가 아닐 때의 처음 상태입니다. React `defaultOpen`과 같습니다.
  final bool defaultOpen;

  /// 펼침 상태가 바뀔 때 부르는 콜백입니다.
  final ValueChanged<bool>? onOpenChanged;

  /// 펼친 폭입니다. React `w-64`입니다.
  static const double expandedWidth = HoronSidebarMetrics.expanded;

  /// 접힌 폭입니다. React `w-14`입니다.
  static const double collapsedWidth = HoronSidebarMetrics.collapsed;

  @override
  State<HoronSidebar> createState() => _HoronSidebarState();
}

class _HoronSidebarState extends State<HoronSidebar> {
  late bool _internalOpen = widget.defaultOpen;

  bool get _open => widget.open ?? _internalOpen;

  void _toggle() {
    final bool next = !_open;
    if (widget.open == null) setState(() => _internalOpen = next);
    widget.onOpenChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);

    return _HoronSidebarScope(
      open: _open,
      toggle: _toggle,
      child: AnimatedContainer(
        duration: _sidebarDuration,
        curve: HoronEasing.out,
        width: _open ? HoronSidebar.expandedWidth : HoronSidebar.collapsedWidth,
        decoration: BoxDecoration(
          color: horon.sidebar,
          border: Border(right: BorderSide(color: horon.sidebarBorder)),
        ),
        // "overflow-hidden" - 접힌 동안 넘치는 라벨이 밖으로 새지 않습니다.
        child: ClipRect(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.max,
            children: widget.children,
          ),
        ),
      ),
    );
  }
}

/// 사이드바의 머리말입니다.
///
/// `sidebar.tsx`의 `SidebarHeader`입니다. `flex h-14 shrink-0 items-center gap-2
/// px-3`이라 높이 56을 지키고 자식을 가로로 놓습니다. 접힌 상태에서는 가운데로
/// 모읍니다.
class HoronSidebarHeader extends StatelessWidget {
  /// 머리말 하나를 만듭니다.
  const HoronSidebarHeader({super.key, required this.children});

  /// 머리말에 놓을 내용입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final bool open = _HoronSidebarScope.maybeOf(context)?.open ?? true;
    return SizedBox(
      height: _sidebarHeaderHeight,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _sidebarHeaderPadding),
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            // React는 접힌 상태에서도 자식을 그대로 두고 `overflow-hidden`으로
            // 자릅니다. Flutter에서 같은 배치를 그대로 두면 `Row`가 넘침 오류를
            // 내므로, 좁아지는 순간 첫 자식(보통 토글 단추)만 가운데에 그립니다.
            final bool compact = !open || constraints.maxWidth < _sidebarHeaderCompactWidth;
            final List<Widget> visible = compact ? children.take(1).toList() : children;
            return Row(
              mainAxisAlignment: compact ? MainAxisAlignment.center : MainAxisAlignment.start,
              children: <Widget>[
                for (int index = 0; index < visible.length; index++) ...<Widget>[
                  if (index > 0) const SizedBox(width: _sidebarHeaderGap),
                  visible[index],
                ],
              ],
            );
          },
        ),
      ),
    );
  }
}

/// 사이드바의 본문입니다.
///
/// `sidebar.tsx`의 `SidebarContent`입니다. `flex min-h-0 flex-1 flex-col gap-3
/// overflow-y-auto px-2 py-2`라 남는 높이를 채우고, 넘치면 스크롤합니다.
class HoronSidebarContent extends StatelessWidget {
  /// 본문 하나를 만듭니다.
  const HoronSidebarContent({super.key, required this.children});

  /// 본문에 놓을 그룹들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: _sidebarContentPadding, vertical: _sidebarContentPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          spacing: _sidebarContentGap,
          children: children,
        ),
      ),
    );
  }
}

/// 사이드바의 꼬리말입니다.
///
/// `sidebar.tsx`의 `SidebarFooter`입니다. `mt-auto flex shrink-0 flex-col gap-1
/// border-t border-border px-2 py-2`라 바닥에 붙고 위에 구분선을 그립니다.
class HoronSidebarFooter extends StatelessWidget {
  /// 꼬리말 하나를 만듭니다.
  const HoronSidebarFooter({super.key, required this.children});

  /// 꼬리말에 놓을 내용입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: horon.sidebarBorder)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _sidebarContentPadding, vertical: _sidebarContentPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          spacing: _sidebarFooterGap,
          children: children,
        ),
      ),
    );
  }
}

/// 사이드바 항목의 묶음입니다.
///
/// `sidebar.tsx`의 `SidebarGroup`입니다. `flex flex-col gap-0.5`라 항목 사이를
/// 2만큼 띄웁니다.
class HoronSidebarGroup extends StatelessWidget {
  /// 그룹 하나를 만듭니다.
  const HoronSidebarGroup({super.key, required this.children});

  /// 그룹에 놓을 항목들입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      spacing: _sidebarGroupGap,
      children: children,
    );
  }
}

/// 사이드바 항목 하나의 자리입니다.
///
/// `sidebar.tsx`의 `SidebarMenuItem`입니다. React는 `relative`만 두어 배지나
/// 펼침 단추를 항목 모서리에 겹쳐 놓을 자리를 만듭니다.
class HoronSidebarMenuItem extends StatelessWidget {
  /// 항목 자리 하나를 만듭니다.
  const HoronSidebarMenuItem({super.key, required this.child});

  /// 자리에 놓을 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) => Stack(children: <Widget>[child]);
}

/// 사이드바의 메뉴 버튼입니다.
///
/// `sidebar.tsx`의 `SidebarMenuButton`입니다. `flex w-full items-center gap-2.5
/// overflow-hidden rounded-sm px-2.5 py-2 text-sm font-medium whitespace-nowrap
/// text-muted-foreground`이고, hover에서 `bg-muted text-foreground`, 활성에서
/// `bg-secondary text-secondary-foreground`가 됩니다.
///
/// 접힌 사이드바에서는 `justify-center px-0`이 붙고 글자가 사라져 아이콘만
/// 남습니다. 아이콘은 호스트가 넘깁니다.
class HoronSidebarMenuButton extends StatefulWidget {
  /// 메뉴 버튼 하나를 만듭니다.
  const HoronSidebarMenuButton({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.active = false,
    this.onPressed,
    this.disabled = false,
    this.semanticLabel,
  }) : assert(
         label != null || child != null || icon != null,
         'HoronSidebarMenuButton needs a label, a child or an icon.',
       );

  /// 버튼 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다. 접힌 상태에서는 이것만 남습니다.
  final Widget? icon;

  /// 지금 보고 있는 화면인지 여부입니다. React `data-[active]`입니다.
  final bool active;

  /// 누르면 부르는 콜백입니다. null이면 비활성입니다.
  final VoidCallback? onPressed;

  /// 누를 수 없는 상태입니다.
  final bool disabled;

  /// 스크린리더가 읽을 이름입니다. 없으면 [label]을 씁니다.
  final String? semanticLabel;

  @override
  State<HoronSidebarMenuButton> createState() => _HoronSidebarMenuButtonState();
}

class _HoronSidebarMenuButtonState extends State<HoronSidebarMenuButton> {
  bool _hovered = false;
  bool _focused = false;

  bool get _enabled => !widget.disabled && widget.onPressed != null;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool open = _HoronSidebarScope.maybeOf(context)?.open ?? true;

    // React는 활성에 `bg-secondary text-secondary-foreground`, hover에
    // `bg-muted text-foreground`를 씁니다. Flutter는 사이드바 전용 슬롯이 있으므로
    // 활성은 `sidebarPrimary`(선택된 항목의 강조 색), hover는 `sidebarAccent`로 그립니다.
    final Color foreground = widget.active
        ? horon.sidebarPrimaryForeground
        : (_hovered && _enabled ? horon.sidebarAccentForeground : scheme.onSurfaceVariant);
    final Color background = widget.active
        ? horon.sidebarPrimary
        : (_hovered && _enabled ? horon.sidebarAccent : Colors.transparent);

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _sidebarFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: foreground,
      decoration: TextDecoration.none,
    );

    // React는 접힌 상태에서 `[&>span]:hidden`으로 라벨을 감추고 아이콘만 남깁니다.
    // Flutter의 `Row`는 넘치는 순간 오류를 내므로, 폭이 좁으면 아이콘만 그리고
    // 그릴 것이 하나도 없으면 빈 `Row`를 남기지 않습니다.
    final Widget content = LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final bool compact = !open || constraints.maxWidth < _sidebarCompactWidth;
        final List<Widget> items = <Widget>[
          if (widget.icon != null)
            IconTheme.merge(
              data: IconThemeData(size: _sidebarIconSize, color: foreground),
              child: widget.icon!,
            ),
          if (!compact && widget.icon != null && (widget.label != null || widget.child != null))
            const SizedBox(width: _sidebarMenuGap),
          if (!compact)
            Flexible(
              child: widget.label != null
                  ? Text(widget.label!, maxLines: 1, overflow: TextOverflow.ellipsis, style: textStyle)
                  : DefaultTextStyle.merge(style: textStyle, child: widget.child!),
            ),
        ];
        if (items.isEmpty) return const SizedBox.shrink();
        final Widget row = Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: compact ? MainAxisAlignment.center : MainAxisAlignment.start,
          children: items,
        );
        // `group-data-[state=collapsed]/sidebar:justify-center` - 접히면 아이콘이
        // 가운데에 오고, 채움은 사이드바 폭을 꽉 채집니다.
        return row;
      },
    );

    Widget result = Semantics(
      button: true,
      selected: widget.active,
      enabled: _enabled,
      label: widget.semanticLabel ?? widget.label,
      child: FocusableActionDetector(
        enabled: _enabled,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              if (_enabled) widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: _enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _enabled ? widget.onPressed : null,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: background,
                borderRadius: BorderRadius.circular(HoronRadius.sm),
                boxShadow: _focused
                    ? <BoxShadow>[
                        BoxShadow(
                          color: horon.sidebarRing.withValues(alpha: _sidebarFocusRingAlpha),
                          spreadRadius: _sidebarFocusRingSpread,
                        ),
                      ]
                    : null,
              ),
              child: Padding(
                padding: EdgeInsets.symmetric(
                  horizontal: open ? _sidebarMenuPadding : HoronSpace.s0,
                  vertical: _sidebarMenuPaddingV,
                ),
                child: content,
              ),
            ),
          ),
        ),
      ),
    );

    if (!_enabled) result = Opacity(opacity: _sidebarDisabledOpacity, child: result);
    return result;
  }
}

/// 사이드바를 접고 펴는 단추입니다.
///
/// `sidebar.tsx`의 `SidebarTrigger`입니다. React는 `Button`의 `ghost` 변형에
/// `icon-sm` 크기를 씁니다. [icon]을 넘기지 않으면 왼쪽 패널을 그린 아이콘을
/// 직접 그립니다(이 패키지는 아이콘 폰트를 번들하지 않습니다).
///
/// React는 `aria-label="Toggle sidebar"`를 코드에 적어 두지만, 이 패키지는 화면
/// 문구를 창작하지 않으므로 [semanticLabel]을 호스트가 넘깁니다.
class HoronSidebarTrigger extends StatelessWidget {
  /// 단추 하나를 만듭니다.
  const HoronSidebarTrigger({super.key, this.icon, this.semanticLabel, this.disabled = false});

  /// 단추에 넣을 아이콘입니다. 없으면 패널 아이콘을 그립니다.
  final Widget? icon;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  /// 누를 수 없는 상태입니다.
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final _HoronSidebarScope? scope = _HoronSidebarScope.maybeOf(context);
    return HoronButton(
      variant: HoronButtonVariant.ghost,
      size: HoronButtonSize.iconSm,
      leading:
          icon ??
          SizedBox.square(
            dimension: _sidebarIconSize,
            child: CustomPaint(painter: _HoronPanelLeftPainter(color: Theme.of(context).colorScheme.onSurfaceVariant)),
          ),
      disabled: disabled || scope == null,
      semanticLabel: semanticLabel,
      onPressed: scope?.toggle,
    );
  }
}

/// 사이드바 옆의 본문 자리입니다.
///
/// `sidebar.tsx`의 `SidebarInset`입니다. `flex min-h-0 min-w-0 flex-1 flex-col
/// bg-background`라 남는 가로 공간을 차지합니다.
class HoronSidebarInset extends StatelessWidget {
  /// 본문 자리 하나를 만듭니다.
  const HoronSidebarInset({super.key, required this.child});

  /// 본문 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Expanded(
      child: ColoredBox(
        color: scheme.surface,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.max,
          children: <Widget>[Expanded(child: child)],
        ),
      ),
    );
  }
}

/// lucide `PanelLeft`(`rect x=3 y=3 w=18 h=18 rx=2` + `M9 3v18`)을 24 단위
/// 상자의 비율로 그립니다.
class _HoronPanelLeftPainter extends CustomPainter {
  const _HoronPanelLeftPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = HoronSpace.s0_5
      ..strokeJoin = StrokeJoin.round;
    final RRect frame = RRect.fromRectAndRadius(
      Rect.fromLTWH(
        size.width * _panelLeftInset,
        size.height * _panelLeftInset,
        size.width * _panelLeftSide,
        size.height * _panelLeftSide,
      ),
      Radius.circular(size.width * _panelLeftRadius),
    );
    canvas.drawRRect(frame, paint);
    final double splitX = size.width * _panelLeftSplit;
    canvas.drawLine(
      Offset(splitX, size.height * _panelLeftInset),
      Offset(splitX, size.height * _panelLeftBottom),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant _HoronPanelLeftPainter oldDelegate) => oldDelegate.color != color;
}

/// lucide `PanelLeft`의 `x=3`/`y=3` 비율입니다. 24 단위 중 3입니다.
const double _panelLeftInset = 0.125;

/// lucide `PanelLeft`의 `w=18`/`h=18` 비율입니다. 24 단위 중 18입니다.
const double _panelLeftSide = 0.75;

/// lucide `PanelLeft`의 `rx=2` 비율입니다. 24 단위 중 2입니다.
const double _panelLeftRadius = 0.083;

/// lucide `PanelLeft`의 `M9 3` 비율입니다. 24 단위 중 9입니다.
const double _panelLeftSplit = 0.375;

/// lucide `PanelLeft`의 세로 선이 끝나는 y입니다. 24 단위 중 21입니다.
const double _panelLeftBottom = 0.875;
