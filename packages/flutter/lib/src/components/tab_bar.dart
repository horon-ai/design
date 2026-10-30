import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'liquid_glass.dart';

/// `tab-bar.tsx`의 `focus-visible:outline-2`입니다.
const double _focusWidth = 2;

/// `[&_svg]:size-5.5` — 탭 아이콘 22px입니다.
const double _iconSize = 22;

/// `tab-bar.tsx`의 `TabBarItem`입니다.
///
/// 아이콘 전용 탭 하나입니다. [label]은 화면에 그리지 않고 접근성 이름으로만 씁니다
/// (React의 `aria-label`).
class HoronTabBarItem {
  /// 탭 하나를 만듭니다.
  const HoronTabBarItem({required this.value, required this.label, required this.icon});

  /// 선택 값을 가리키는 키입니다.
  final String value;

  /// 접근성 이름입니다.
  final String label;

  /// 탭 가운데에 그릴 아이콘입니다.
  final Widget icon;
}

/// Figma `Tab bar`(63:441)입니다.
///
/// 모바일 하단 탐색입니다. regular 유리 알약 안에 아이콘 전용 64x48(`h-12 w-16`) 탭을
/// 놓고, 현재 탭 뒤로 10% 잉크 알약을 옮깁니다. React는 `w-fit`이라 폭이 모자라면 잘리지만,
/// Flutter 판은 탭 폭을 줄여 한 줄에 모두 남깁니다(최소 40px).
class HoronTabBar extends StatefulWidget {
  /// 탭 막대를 만듭니다.
  const HoronTabBar({
    super.key,
    required this.items,
    this.value,
    this.initialValue,
    this.onChanged,
    this.glass = true,
    this.label = 'Main',
  });

  /// 탭 목록입니다.
  final List<HoronTabBarItem> items;

  /// 선택 값을 바깥에서 정합니다. React의 `value`입니다.
  final String? value;

  /// 처음 선택할 값입니다. 없으면 첫 항목입니다.
  final String? initialValue;

  /// 선택이 바뀔 때 부를 콜백입니다. React의 `onValueChange`입니다.
  final ValueChanged<String>? onChanged;

  /// 참이면 `surface="glass"`입니다. 거짓이면 `surface="flat"`이라 유리 레이어 없이
  /// `bg-glass-regular` 색만 깔립니다.
  final bool glass;

  /// 접근성 이름입니다. React의 `aria-label`이고 기본값은 `Main`입니다.
  final String label;

  @override
  State<HoronTabBar> createState() => _HoronTabBarState();
}

class _HoronTabBarState extends State<HoronTabBar> {
  final GlobalKey _track = GlobalKey();
  List<GlobalKey> _keys = <GlobalKey>[];
  Rect? _indicator;
  String? _inner;

  String? get _selected => widget.value ?? _inner;

  @override
  void initState() {
    super.initState();
    _inner = widget.initialValue ?? (widget.items.isEmpty ? null : widget.items.first.value);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    if (_keys.length != widget.items.length) {
      _keys = List<GlobalKey>.generate(widget.items.length, (int index) => GlobalKey());
    }
    final int activeIndex = widget.items.indexWhere((HoronTabBarItem item) => item.value == _selected);
    WidgetsBinding.instance.addPostFrameCallback((Duration _) => _measure(activeIndex));

    void select(HoronTabBarItem item) {
      if (widget.value == null) setState(() => _inner = item.value);
      widget.onChanged?.call(item.value);
    }

    final Widget track = LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // `w-16` = 64. 폭이 모자라면 탭을 줄여 한 줄에 남깁니다(최소 `w-10` = 40).
        final double available = constraints.maxWidth;
        final int count = widget.items.length;
        final double gaps = space.s1 * (count > 1 ? count - 1 : 0); // gap-1
        final double inner = available - space.s1_5 * 2 - gaps; // p-1.5
        final double tabWidth = count == 0
            ? space.step(16)
            : (inner / count).clamp(space.step(10), space.step(16)).toDouble();

        return Padding(
          padding: EdgeInsets.all(space.s1_5), // p-1.5
          child: Stack(
            key: _track,
            children: <Widget>[
              if (_indicator != null)
                AnimatedPositioned(
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
              Row(
                mainAxisSize: MainAxisSize.min,
                spacing: space.s1, // gap-1
                children: <Widget>[
                  for (int index = 0; index < widget.items.length; index++)
                    KeyedSubtree(
                      key: _keys[index],
                      child: _TabBarButton(
                        item: widget.items[index],
                        current: widget.items[index].value == _selected,
                        width: tabWidth,
                        onTap: select,
                      ),
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );

    final Widget surface = widget.glass
        ? HoronLiquidGlass(
            tier: HoronGlassTier.regular,
            borderRadius: BorderRadius.circular(theme.radius.full),
            child: track,
          )
        // `surface="flat"`: 유리 레이어 없이 `bg-glass-regular` 채움만 남깁니다.
        : Container(
            decoration: BoxDecoration(
              color: colors.glassRegular,
              borderRadius: BorderRadius.circular(theme.radius.full),
            ),
            child: track,
          );

    return Semantics(container: true, label: widget.label, child: surface);
  }

  /// 현재 탭의 사각형을 재서 표시자 자리로 씁니다.
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

/// `h-12 w-16 rounded-full [&_svg]:size-5.5` 아이콘 탭입니다.
class _TabBarButton extends StatefulWidget {
  const _TabBarButton({required this.item, required this.current, required this.width, required this.onTap});

  final HoronTabBarItem item;
  final bool current;
  final double width;
  final ValueChanged<HoronTabBarItem> onTap;

  @override
  State<_TabBarButton> createState() => _TabBarButtonState();
}

class _TabBarButtonState extends State<_TabBarButton> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // `hover:bg-overlay-ink-5`는 현재 탭이 아닐 때만 붙습니다.
    final Color background = _hovered && !widget.current ? colors.overlayInk5 : Colors.transparent;
    final Color foreground = widget.current ? colors.textPrimary : colors.textSecondary;

    return Semantics(
      button: true,
      selected: widget.current,
      inMutuallyExclusiveGroup: true,
      label: widget.item.label,
      child: AnimatedScale(
        // motion-press: scale .97.
        scale: _pressed ? HoronMotion.pressScale : 1,
        duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
        curve: HoronMotion.pressCurve,
        child: FocusableActionDetector(
          enabled: true,
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
                widget.onTap(widget.item);
                return null;
              },
            ),
          },
          child: GestureDetector(
            onTap: () => widget.onTap(widget.item),
            onTapDown: (TapDownDetails details) => setState(() => _pressed = true),
            onTapUp: (TapUpDetails details) {
              if (_pressed) setState(() => _pressed = false);
            },
            onTapCancel: () {
              if (_pressed) setState(() => _pressed = false);
            },
            child: _FocusRing(
              visible: _focused,
              radius: theme.radius.full,
              color: colors.textBrand,
              child: SizedBox(
                width: widget.width,
                height: space.step(12), // h-12 = 48
                // 크기는 즉시 바뀌고 색만 `motion-colors`로 전환합니다(React도 색만 바꿉니다).
                child: AnimatedContainer(
                  duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
                  curve: HoronMotion.colorsCurve,
                  decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(theme.radius.full)),
                  child: Center(
                    child: IconTheme.merge(
                      data: IconThemeData(size: _iconSize, color: foreground),
                      child: widget.item.icon,
                    ),
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

/// `focus-visible:outline-2 outline-offset-2 outline-text-brand`을 바깥으로 그립니다.
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
