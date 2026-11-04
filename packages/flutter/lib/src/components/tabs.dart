import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../contracts/surface.dart';
import '../glass/horon_surface.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'liquid_glass.dart';

/// `tabs.tsx`의 `focus-visible:outline-2`입니다.
const double _focusWidth = 2;

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `tabs.tsx`의 `TabsSize`입니다.
enum HoronTabsSize {
  /// `size="sm"` — 높이 26, `label-sm`, 아이콘 14px.
  sm,

  /// `size="md"` — 높이 30, `label-md`, 아이콘 16px. 기본값입니다.
  md,

  /// `size="lg"` — 높이 36, `label-lg`, 아이콘 20px.
  lg,
}

/// `tabs.tsx`의 `TabsListVariant`입니다.
enum HoronTabsListVariant {
  /// `variant="pill"` — 알약 쟁반 위의 알약 탭입니다. 기본값입니다.
  pill,

  /// `variant="underline"` — 쟁반 없이 폭을 채우고, 아래 1px 테두리와 2px 밑줄로
  /// 선택을 보여 주는 문서형 탭입니다. [HoronTabsList.surface]는 쓰지 않습니다.
  underline,
}

/// 크기 단계 하나의 값입니다. React `tabClass`·`countClass`와 같은 값입니다.
typedef _TabMetrics = ({
  double height,
  double paddingX,
  double gap,
  double icon,
  double countHeight,
  double countPaddingX,
  TextStyle textStyle,
});

/// 단계별 높이·여백·타이포입니다. `SegmentedControl`과 같은 눈금(26/30/36)을 씁니다.
_TabMetrics _metricsOf(HoronTabsSize size, HoronThemeData theme) => switch (size) {
  HoronTabsSize.sm => (
    height: theme.space.step(6.5), // h-6.5 = 26
    paddingX: theme.space.s2_5, // px-2.5
    gap: theme.space.s1, // gap-1
    icon: theme.space.s3_5, // 14
    countHeight: theme.space.step(4.5), // h-4.5 = 18
    countPaddingX: theme.space.s1_5, // px-1.5
    textStyle: theme.text.labelSm,
  ),
  HoronTabsSize.md => (
    height: theme.space.step(7.5), // h-7.5 = 30
    paddingX: theme.space.s4, // px-4
    gap: theme.space.s1_5, // gap-1.5
    icon: theme.space.s4, // 16
    countHeight: theme.space.step(5), // h-5 = 20
    countPaddingX: theme.space.s1_5, // px-1.5
    textStyle: theme.text.labelMd,
  ),
  HoronTabsSize.lg => (
    height: theme.space.step(9), // h-9 = 36
    paddingX: theme.space.s4, // px-4
    gap: theme.space.s2, // gap-2
    icon: theme.space.s5, // 20
    countHeight: theme.space.step(6), // h-6 = 24
    countPaddingX: theme.space.s2, // px-2
    textStyle: theme.text.labelLg,
  ),
};

/// `p-[3px]`·`p-1` — 쟁반 여백입니다. `SegmentedControl`과 같은 눈금입니다.
double _listPaddingOf(HoronTabsSize size, HoronThemeData theme) =>
    size == HoronTabsSize.lg ? theme.space.s1 : theme.space.step(0.75);

/// `border-b` — 아래 테두리 1px입니다.
const double _hairline = 1;

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
  const HoronTabs({
    super.key,
    required this.children,
    this.initialValue,
    this.value,
    this.onChanged,
    this.size = HoronTabsSize.md,
  });

  /// 목록과 패널입니다.
  final List<Widget> children;

  /// 탭 크기입니다. 목록과 탭이 이 값을 함께 읽습니다. 기본값은 [HoronTabsSize.md]입니다.
  final HoronTabsSize size;

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
      size: widget.size,
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
  const _TabsScope({required this.selected, required this.onSelect, required this.size, required super.child});

  final String? selected;
  final ValueChanged<String> onSelect;
  final HoronTabsSize size;

  static _TabsScope? maybeOf(BuildContext context) => context.dependOnInheritedWidgetOfExactType<_TabsScope>();

  @override
  bool updateShouldNotify(_TabsScope oldWidget) => selected != oldWidget.selected || size != oldWidget.size;
}

/// 탭 모양을 아래로 내리는 통로입니다. React `TabsVariantContext`의 자리입니다.
class _TabsVariantScope extends InheritedWidget {
  const _TabsVariantScope({required this.variant, required super.child});

  final HoronTabsListVariant variant;

  static HoronTabsListVariant maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_TabsVariantScope>()?.variant ?? HoronTabsListVariant.pill;

  @override
  bool updateShouldNotify(_TabsVariantScope oldWidget) => variant != oldWidget.variant;
}

/// Figma `Tabs example`(62:353)의 탭 목록입니다.
///
/// 기본 `variant="pill"`은 solid 또는 regular 유리 쟁반 위에 알약 탭을 놓고, 선택된
/// 탭 뒤로 표시자를 옮깁니다. `variant="underline"`은 쟁반 없이 폭을 채우고 아래 1px
/// 테두리 위를 2px 밑줄이 따라갑니다. React는 표시자 위치를 DOM 측정으로 잡고,
/// Flutter 판은 배치 뒤 각 탭의 사각형을 재서 같은 일을 합니다. 좁은 폭에서는 탭이
/// 다음 줄로 넘어갑니다.
class HoronTabsList extends StatefulWidget {
  /// 탭 목록을 만듭니다.
  const HoronTabsList({
    super.key,
    required this.children,
    this.variant = HoronTabsListVariant.pill,
    this.surface = HoronSurface.solid,
  });

  /// [HoronTabsTab] 목록입니다.
  final List<Widget> children;

  /// 탭 모양입니다. 기본값은 [HoronTabsListVariant.pill]입니다.
  final HoronTabsListVariant variant;

  /// 표면입니다. 기본값은 [HoronSurface.solid]이고
  /// [HoronTabsListVariant.underline]에서는 쓰지 않습니다.
  final HoronSurface surface;

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
    final _TabsScope? scope = _TabsScope.maybeOf(context);
    final String? selected = scope?.selected;

    if (_keys.length != widget.children.length) {
      _keys = List<GlobalKey>.generate(widget.children.length, (int index) => GlobalKey());
    }

    final int activeIndex = widget.children.indexWhere(
      (Widget child) => child is HoronTabsTab && child.value == selected,
    );
    WidgetsBinding.instance.addPostFrameCallback((Duration _) => _measure(activeIndex));

    final Widget track = Wrap(
      key: _track,
      // pill은 `gap-0.5`, underline은 `gap-6`입니다.
      spacing: widget.variant == HoronTabsListVariant.underline ? space.s6 : space.s0_5,
      runSpacing: space.s1,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        for (int index = 0; index < widget.children.length; index++)
          KeyedSubtree(key: _keys[index], child: widget.children[index]),
      ],
    );

    if (widget.variant == HoronTabsListVariant.underline) {
      // `variant="underline"`: 쟁반 없이 아래 1px 경계를 두고, 그 위에 2px 표시자가 미끄러집니다.
      // React의 `w-full`을 지키려고 `Column(stretch)`가 폭을 채웁니다.
      return _TabsVariantScope(
        variant: widget.variant,
        child: Stack(
          clipBehavior: Clip.none,
          children: <Widget>[
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                track,
                // `border-b border-border-default`
                SizedBox(
                  height: _hairline,
                  child: ColoredBox(color: colors.borderDefault),
                ),
              ],
            ),
            if (_indicator != null)
              AnimatedPositioned(
                duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.indicatorDuration,
                curve: HoronMotion.indicatorCurve,
                left: _indicator!.left,
                width: _indicator!.width,
                // `-bottom-px h-0.5`: 경계를 1px 넘어 아래로 걸칩니다.
                bottom: -_hairline,
                height: space.s0_5,
                child: DecoratedBox(decoration: BoxDecoration(color: colors.textPrimary)), // bg-text-primary
              ),
          ],
        ),
      );
    }

    return _TabsVariantScope(
      variant: widget.variant,
      child: HoronSurfaceLayer(
        surface: widget.surface,
        tier: HoronGlassTier.regular,
        borderRadius: BorderRadius.circular(theme.radius.full),
        child: Padding(
          padding: EdgeInsets.all(_listPaddingOf(scope?.size ?? HoronTabsSize.md, theme)),
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
                  child: _indicatorFill(theme),
                ),
              track,
            ],
          ),
        ),
      ),
    );
  }

  /// 선택 표시자의 채움입니다.
  ///
  /// solid는 10% 잉크 한 겹이고, glass는 두꺼운 유리 알약에 옅은 그림자를 얹습니다
  /// (React `bg-glass-thick shadow-[0_1px_3px_rgba(0,0,0,0.08)]`).
  Widget _indicatorFill(HoronThemeData theme) {
    if (widget.surface != HoronSurface.glass) {
      return DecoratedBox(
        decoration: BoxDecoration(
          color: theme.colors.overlayInk10, // bg-overlay-ink-10
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
      );
    }
    // React의 `shadow-[0_1px_3px_rgba(0,0,0,0.08)]`입니다. 원시 검정 대신 토큰
    // `overlay-ink-8`을 써서 테마 밝기를 따릅니다(라이트가 같은 8% 검정입니다).
    return DecoratedBox(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(theme.radius.full),
        boxShadow: <BoxShadow>[BoxShadow(color: theme.colors.overlayInk8, offset: const Offset(0, 1), blurRadius: 3)],
      ),
      child: HoronLiquidGlass(
        tier: HoronGlassTier.thick,
        borderRadius: BorderRadius.circular(theme.radius.full),
        child: const SizedBox.expand(),
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

/// Figma `Tabs`(62:335)의 탭입니다.
///
/// 목록의 표시자가 선택을 그립니다. hover는 바탕을 더하지 않고 글자색만
/// `text-secondary`에서 `text-primary`로 올립니다. 높이와 좌우 여백, 아이콘 크기는
/// 목록의 [HoronTabsSize] 단계를 따르고, [HoronTabsListVariant.underline] 목록에서는
/// 알약 대신 6px 반경에 좌우 여백이 없습니다.
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
    final _TabsScope? scope = _TabsScope.maybeOf(context);
    final bool selected = scope?.selected == widget.value;
    final bool interactive = widget.enabled && scope != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final _TabMetrics metrics = _metricsOf(scope?.size ?? HoronTabsSize.md, theme);
    final bool underline = _TabsVariantScope.maybeOf(context) == HoronTabsListVariant.underline;
    final BorderRadius radius = BorderRadius.circular(underline ? theme.radius.xs : theme.radius.full);

    // hover는 바탕을 더하지 않고 글자색만 올립니다(`hover:text-text-primary`).
    final Color foreground = selected || _hovered ? colors.textPrimary : colors.textSecondary;

    final Widget surface = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      height: metrics.height,
      // underline은 각 단계의 높이와 타이포만 남기고 좌우 여백을 없앱니다(`px-0`).
      padding: EdgeInsets.symmetric(horizontal: underline ? 0 : metrics.paddingX),
      decoration: BoxDecoration(borderRadius: radius),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: metrics.gap,
        children: <Widget>[
          if (widget.icon != null)
            IconTheme.merge(
              data: IconThemeData(size: metrics.icon, color: foreground),
              child: widget.icon!,
            ),
          Flexible(
            child: Text(
              widget.label,
              // text-label-* whitespace-nowrap
              style: metrics.textStyle.copyWith(color: foreground),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (widget.count != null) _CountPill(count: widget.count!, selected: selected, metrics: metrics),
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
              radius: underline ? theme.radius.xs : theme.radius.full,
              color: colors.textBrand,
              child: surface,
            ),
          ),
        ),
      ),
    );
  }
}

/// `rounded-full bg-overlay-ink-6 text-label-sm` 개수 알약입니다.
///
/// 높이와 좌우 여백은 단계별 값(18/20/24px, 6/6/8px)을 쓰고, 글자는 모든 단계에서
/// `label-sm`입니다.
class _CountPill extends StatelessWidget {
  const _CountPill({required this.count, required this.selected, required this.metrics});

  final int count;
  final bool selected;
  final _TabMetrics metrics;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    return AnimatedContainer(
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      height: metrics.countHeight,
      padding: EdgeInsets.symmetric(horizontal: metrics.countPaddingX),
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
