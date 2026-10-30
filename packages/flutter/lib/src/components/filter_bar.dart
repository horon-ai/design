import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `filter-bar.tsx`의 `focus-visible:outline-2`입니다.
const double _focusWidth = 2;

/// `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// `filter-bar.tsx`의 `FilterBarItem`입니다.
///
/// 필터 하나입니다. [count]는 글자 뒤에 붙는 개수이고, [disabled]면 흐려지며 눌리지
/// 않습니다.
class HoronFilterBarItem {
  /// 필터 하나를 만듭니다.
  const HoronFilterBarItem({required this.value, required this.label, this.count, this.disabled = false});

  /// 선택 값을 가리키는 키입니다.
  final String value;

  /// 필터의 글자입니다.
  final String label;

  /// 글자 뒤에 붙는 개수입니다.
  final int? count;

  /// 거짓이면 눌리지 않고 `opacity-50`으로 흐려집니다.
  final bool disabled;
}

/// Paper `Filter bar`(Agents N2)입니다.
///
/// 5% 잉크 알약 트랙에 30px(`h-7.5`) 옵션을 놓고, 선택된 옵션 뒤로 10% 잉크 알약을
/// 옮깁니다. React는 표시자 위치를 DOM 측정으로 잡고, Flutter 판은 배치 뒤 각 옵션의
/// 사각형을 재서 같은 일을 합니다. 좁은 폭에서는 옵션이 다음 줄로 넘어갑니다.
class HoronFilterBar extends StatefulWidget {
  /// 필터 묶음을 만듭니다.
  const HoronFilterBar({
    super.key,
    required this.items,
    this.value,
    this.initialValue,
    this.onChanged,
    this.label = 'Filter',
  });

  /// 필터 목록입니다.
  final List<HoronFilterBarItem> items;

  /// 선택 값을 바깥에서 정합니다. React의 `value`입니다.
  final String? value;

  /// 처음 선택할 값입니다. 없으면 첫 항목입니다. React의 `defaultValue`입니다.
  final String? initialValue;

  /// 선택이 바뀔 때 부를 콜백입니다. React의 `onValueChange`입니다.
  final ValueChanged<String>? onChanged;

  /// 접근성 이름입니다. React의 `aria-label`이고 기본값은 `Filter`입니다.
  final String label;

  @override
  State<HoronFilterBar> createState() => _HoronFilterBarState();
}

class _HoronFilterBarState extends State<HoronFilterBar> {
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
    final int activeIndex = widget.items.indexWhere((HoronFilterBarItem item) => item.value == _selected);
    WidgetsBinding.instance.addPostFrameCallback((Duration _) => _measure(activeIndex));

    void select(HoronFilterBarItem item) {
      if (widget.value == null) setState(() => _inner = item.value);
      widget.onChanged?.call(item.value);
    }

    // `inline-flex items-center gap-0.5 rounded-full bg-overlay-ink-5 p-[3px]`입니다.
    return Semantics(
      container: true,
      label: widget.label,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: colors.overlayInk5, // bg-overlay-ink-5
          borderRadius: BorderRadius.circular(theme.radius.full),
        ),
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
            // `p-[3px]` = 3. 간격 단위 0.75입니다.
            Padding(
              padding: EdgeInsets.all(space.step(0.75)),
              child: Wrap(
                spacing: space.s0_5, // gap-0.5
                runSpacing: space.s1,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: <Widget>[
                  for (int index = 0; index < widget.items.length; index++)
                    KeyedSubtree(
                      key: _keys[index],
                      child: _FilterOption(
                        item: widget.items[index],
                        selected: widget.items[index].value == _selected,
                        onTap: select,
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// 선택된 옵션의 사각형을 재서 표시자 자리로 씁니다.
  void _measure(int activeIndex) {
    if (!mounted) return;
    final RenderObject? trackObject = _track.currentContext?.findRenderObject();
    if (trackObject is! RenderBox) return;
    Rect? next;
    if (activeIndex >= 0 && activeIndex < _keys.length) {
      final RenderObject? optionObject = _keys[activeIndex].currentContext?.findRenderObject();
      if (optionObject is RenderBox && optionObject.hasSize) {
        final Offset offset = optionObject.localToGlobal(Offset.zero, ancestor: trackObject);
        next = offset & optionObject.size;
      }
    }
    if (next == _indicator) return;
    setState(() => _indicator = next);
  }
}

/// 필터 옵션 하나입니다. `h-7.5 px-3 rounded-full text-[14px]/[20px] font-medium`입니다.
class _FilterOption extends StatefulWidget {
  const _FilterOption({required this.item, required this.selected, required this.onTap});

  final HoronFilterBarItem item;
  final bool selected;
  final ValueChanged<HoronFilterBarItem> onTap;

  @override
  State<_FilterOption> createState() => _FilterOptionState();
}

class _FilterOptionState extends State<_FilterOption> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = !widget.item.disabled;
    final Color foreground = widget.selected || _hovered ? colors.textPrimary : colors.textSecondary;

    final Widget surface = AnimatedDefaultTextStyle(
      duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      style: theme.text.labelMd.copyWith(color: foreground),
      child: Container(
        height: space.step(7.5), // h-7.5 = 30
        padding: EdgeInsets.symmetric(horizontal: space.s3), // px-3
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: space.s1_5, // gap-1.5
          children: <Widget>[
            Text(widget.item.label, maxLines: 1, overflow: TextOverflow.ellipsis),
            if (widget.item.count != null)
              Text(
                '${widget.item.count}',
                // text-[12px]/[18px]
                style: theme.text.caption.copyWith(color: colors.textSecondary),
                maxLines: 1,
              ),
          ],
        ),
      ),
    );

    return Semantics(
      button: true,
      selected: widget.selected,
      inMutuallyExclusiveGroup: true,
      enabled: interactive,
      label: widget.item.label,
      child: Opacity(
        opacity: interactive ? 1 : _disabledOpacity,
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
                widget.onTap(widget.item);
                return null;
              },
            ),
          },
          child: GestureDetector(
            onTap: interactive ? () => widget.onTap(widget.item) : null,
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

/// `focus-visible:outline-2 outline-text-brand`을 바깥으로 그립니다.
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
