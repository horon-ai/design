import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'liquid_glass.dart';

/// `tabs.tsx`의 `focus-visible:outline-2`입니다.
const double _focusWidth = 2;

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `[&_svg]:size-4` — 탭 아이콘 16px입니다.
const double _iconSize = 16;

/// `animate-[tab-panel-in_200ms_var(--ease-out-quint)]` — 패널 진입 200ms입니다.
///
/// `motion-rise` 유틸리티도 같은 키프레임을 쓰지만 220ms이고, 이 컴포넌트는 클래스에
/// 적힌 200ms를 씁니다.
const Duration _panelInDuration = Duration(milliseconds: 200);

/// Figma `Tabs example`(62:353)의 탭 묶음입니다.
///
/// 자식은 [HoronTabsList]와 [HoronTabsPanel]입니다. React의 `Tabs`가 `flex flex-col
/// gap-4`이므로 자식 사이를 16px로 벌립니다. 선택 값은 [value]로 통제하거나
/// [initialValue]로 시작하고, 없으면 첫 탭이 선택됩니다(React의 Base UI 기본값).
class HoronTabs extends StatefulWidget {
  /// 탭 묶음을 만듭니다.
  const HoronTabs({super.key, required this.children, this.initialValue, this.value, this.onChanged});

  /// 목록과 패널입니다.
  final List<Widget> children;

  /// 처음 선택할 값입니다. React의 `defaultValue`입니다.
  final String? initialValue;

  /// 선택 값을 바깥에서 정합니다. React의 `value`입니다.
  final String? value;

  /// 선택이 바뀔 때 부를 콜백입니다. React의 `onValueChange`입니다.
  final ValueChanged<String>? onChanged;

  @override
  State<HoronTabs> createState() => _HoronTabsState();
}

class _HoronTabsState extends State<HoronTabs> {
  String? _inner;

  @override
  void initState() {
    super.initState();
    _inner = widget.initialValue ?? _firstTabValue(widget.children);
  }

  /// React의 Base UI는 첫 탭을 기본 선택으로 잡습니다. 그 값을 자식에서 찾습니다.
  String? _firstTabValue(List<Widget> children) {
    for (final Widget child in children) {
      if (child is HoronTabsTab) return child.value;
      if (child is HoronTabsList) {
        final String? found = _firstTabValue(child.children);
        if (found != null) return found;
      }
    }
    return null;
  }

  String? get _selected => widget.value ?? _inner;

  void _select(String next) {
    if (widget.value == null) setState(() => _inner = next);
    widget.onChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return _TabsScope(
      selected: _selected,
      onSelect: _select,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: space.s4, // gap-4
        children: widget.children,
      ),
    );
  }
}

/// 선택 값을 아래로 내리는 통로입니다. React의 Base UI 컨텍스트 자리입니다.
class _TabsScope extends InheritedWidget {
  const _TabsScope({required this.selected, required this.onSelect, required super.child});

  final String? selected;
  final ValueChanged<String> onSelect;

  static _TabsScope? maybeOf(BuildContext context) => context.dependOnInheritedWidgetOfExactType<_TabsScope>();

  @override
  bool updateShouldNotify(_TabsScope oldWidget) => selected != oldWidget.selected;
}

/// Figma `Tabs example`(62:353)의 유리 쟁반입니다.
///
/// regular 유리 알약에 4px 여백을 두고, 선택된 탭 뒤로 10% 잉크 표시자를 옮깁니다.
/// React는 표시자 위치를 DOM 측정으로 잡고, Flutter 판은 배치 뒤 각 탭의 사각형을 재서
/// 같은 일을 합니다. 좁은 폭에서는 탭이 다음 줄로 넘어가고 표시자도 그 줄을 따라갑니다.
class HoronTabsList extends StatefulWidget {
  /// 탭 목록을 만듭니다.
  const HoronTabsList({super.key, required this.children});

  /// [HoronTabsTab] 목록입니다.
  final List<Widget> children;

  @override
  State<HoronTabsList> createState() => _HoronTabsListState();
}

class _HoronTabsListState extends State<HoronTabsList> {
  final GlobalKey _track = GlobalKey();
  List<GlobalKey> _keys = <GlobalKey>[];
  Rect? _indicator;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final HoronColors colors = theme.colors;
    final String? selected = _TabsScope.maybeOf(context)?.selected;

    if (_keys.length != widget.children.length) {
      _keys = List<GlobalKey>.generate(widget.children.length, (int index) => GlobalKey());
    }

    final int activeIndex = widget.children.indexWhere(
      (Widget child) => child is HoronTabsTab && child.value == selected,
    );
    WidgetsBinding.instance.addPostFrameCallback((Duration _) => _measure(activeIndex));

    return HoronLiquidGlass(
      tier: HoronGlassTier.regular,
      borderRadius: BorderRadius.circular(theme.radius.full),
      child: Padding(
        padding: EdgeInsets.all(space.s1), // p-1
        child: Stack(
          children: <Widget>[
            if (_indicator != null)
              AnimatedPositioned(
                // motion-indicator — 선택이 옮겨 갈 때만 280ms로 미끄러집니다.
                duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.indicatorDuration,
                curve: HoronMotion.indicatorCurve,
                left: _indicator!.left,
                top: _indicator!.top,
                width: _indicator!.width,
                height: _indicator!.height,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    color: colors.overlayInk10, // bg-overlay-ink-10
                    borderRadius: BorderRadius.circular(theme.radius.full),
                  ),
                ),
              ),
            Wrap(
              key: _track,
              spacing: space.s6, // gap-6
              runSpacing: space.s1,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                for (int index = 0; index < widget.children.length; index++)
                  KeyedSubtree(key: _keys[index], child: widget.children[index]),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// 선택된 탭의 사각형을 재서 표시자 자리로 씁니다.
  void _measure(int activeIndex) {
    if (!mounted) return;
    final RenderObject? trackObject = _track.currentContext?.findRenderObject();
    if (trackObject is! RenderBox) return;
    Rect? next;
    if (activeIndex >= 0 && activeIndex < _keys.length) {
      final RenderObject? tabObject = _keys[activeIndex].currentContext?.findRenderObject();
      if (tabObject is RenderBox && tabObject.hasSize) {
        final Offset offset = tabObject.localToGlobal(Offset.zero, ancestor: trackObject);
        next = offset & tabObject.size;
      }
    }
    if (next == _indicator) return;
    setState(() => _indicator = next);
  }
}

/// Figma `Tabs`(62:335)의 알약 탭입니다.
///
/// 목록의 표시자가 10% 선택을 그리고, hover는 5%를 더합니다(선택 위에서는 14%).
/// 아이콘이나 개수가 있으면 좌우 여백이 14px로 넓어집니다.
class HoronTabsTab extends StatefulWidget {
  /// 탭 하나를 만듭니다.
  const HoronTabsTab({super.key, required this.value, required this.label, this.icon, this.count, this.enabled = true});

  /// 선택 값을 가리키는 키입니다.
  final String value;

  /// 탭의 글자입니다.
  final String label;

  /// 앞에 붙는 16px 아이콘입니다.
  final Widget? icon;

  /// 글자 뒤의 개수 알약입니다. 선택되면 잉크 바탕으로 바뀝니다.
  final int? count;

  /// 거짓이면 `opacity-40`으로 흐려지고 눌리지 않습니다.
  final bool enabled;

  @override
  State<HoronTabsTab> createState() => _HoronTabsTabState();
}

class _HoronTabsTabState extends State<HoronTabsTab> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final _TabsScope? scope = _TabsScope.maybeOf(context);
    final bool selected = scope?.selected == widget.value;
    final bool interactive = widget.enabled && scope != null;
    final bool rich = widget.icon != null || widget.count != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    final Color foreground = selected || _hovered ? colors.textPrimary : colors.textSecondary;
    final Color background = _hovered ? (selected ? colors.overlayInk14 : colors.overlayInk5) : Colors.transparent;

    final Widget surface = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      padding: EdgeInsets.symmetric(
        horizontal: rich ? space.s3_5 : space.s1, // px-3.5 / px-1
        vertical: space.s2_5, // py-2.5
      ),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(theme.radius.full)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: space.s1_5, // gap-1.5
        children: <Widget>[
          if (widget.icon != null)
            IconTheme.merge(
              data: IconThemeData(size: _iconSize, color: foreground),
              child: widget.icon!,
            ),
          Flexible(
            child: Text(
              widget.label,
              // text-label-lg whitespace-nowrap
              style: theme.text.labelLg.copyWith(color: foreground),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (widget.count != null) _CountPill(count: widget.count!, selected: selected),
        ],
      ),
    );

    return Semantics(
      button: true,
      selected: selected,
      inMutuallyExclusiveGroup: true,
      enabled: interactive,
      label: widget.label,
      child: Opacity(
        opacity: widget.enabled ? 1 : _disabledOpacity,
        child: FocusableActionDetector(
          enabled: interactive,
          mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
          onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
          onShowFocusHighlight: (bool value) => setState(() => _focused = value),
          shortcuts: const <ShortcutActivator, Intent>{
            SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
            SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
          },
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(
              onInvoke: (ActivateIntent intent) {
                scope?.onSelect(widget.value);
                return null;
              },
            ),
          },
          child: GestureDetector(
            onTap: interactive ? () => scope.onSelect(widget.value) : null,
            child: _FocusRing(
              visible: _focused && interactive,
              radius: theme.radius.full,
              color: colors.textBrand,
              child: surface,
            ),
          ),
        ),
      ),
    );
  }
}

/// `h-5.5 rounded-full bg-overlay-ink-6 px-2 text-label-sm` 개수 알약입니다.
class _CountPill extends StatelessWidget {
  const _CountPill({required this.count, required this.selected});

  final int count;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return AnimatedContainer(
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      height: space.step(5.5), // h-5.5 = 22
      padding: EdgeInsets.symmetric(horizontal: space.s2), // px-2
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: selected ? colors.interactivePrimary : colors.overlayInk6,
        borderRadius: BorderRadius.circular(theme.radius.full),
      ),
      child: Text(
        '$count',
        style: theme.text.labelSm.copyWith(color: selected ? colors.interactiveOnPrimary : colors.textSecondary),
        maxLines: 1,
      ),
    );
  }
}

/// `tabs.tsx`의 `TabsPanel`입니다.
///
/// 선택된 탭의 내용만 그립니다. 나타날 때 `tab-panel-in`(220ms, opacity 0→1,
/// translate 4px→0)을 한 번 재생합니다.
class HoronTabsPanel extends StatelessWidget {
  /// 패널 하나를 만듭니다.
  const HoronTabsPanel({super.key, required this.value, required this.child});

  /// 이 패널을 여는 탭의 값입니다.
  final String value;

  /// 탭이 선택됐을 때 그릴 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final bool selected = _TabsScope.maybeOf(context)?.selected == value;
    if (!selected) return const SizedBox.shrink();
    return _PanelIn(child: child);
  }
}

/// `animate-[tab-panel-in_200ms_var(--ease-out-quint)]`입니다.
class _PanelIn extends StatefulWidget {
  const _PanelIn({required this.child});

  final Widget child;

  @override
  State<_PanelIn> createState() => _PanelInState();
}

class _PanelInState extends State<_PanelIn> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(vsync: this, duration: _panelInDuration);

  @override
  void initState() {
    super.initState();
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (MediaQuery.disableAnimationsOf(context)) return widget.child;
    final Animation<double> curve = CurvedAnimation(parent: _controller, curve: HoronMotion.riseCurve);
    return AnimatedBuilder(
      animation: curve,
      builder: (BuildContext context, Widget? child) => Opacity(
        opacity: curve.value,
        child: Transform.translate(offset: Offset(0, HoronMotion.riseOffset * (1 - curve.value)), child: child),
      ),
      child: widget.child,
    );
  }
}

/// `motion-colors`와 `focus-visible:outline-2 outline-text-brand`을 옮긴 누름 표면입니다.
class _FocusRing extends StatelessWidget {
  const _FocusRing({required this.visible, required this.radius, required this.color, required this.child});

  final bool visible;
  final double radius;
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (!visible) return child;
    final double offset = HoronTheme.of(context).space.s0_5;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -offset,
          top: -offset,
          right: -offset,
          bottom: -offset,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(radius + offset),
                border: Border.all(color: color, width: _focusWidth),
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
