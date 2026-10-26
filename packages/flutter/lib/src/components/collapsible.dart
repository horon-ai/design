import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `collapsible.tsx` 트리거의 `px-2.5`입니다.
const double _collapsibleTriggerPaddingH = HoronSpace.s2_5;

/// `collapsible.tsx` 트리거의 `py-2`입니다.
const double _collapsibleTriggerPaddingV = HoronSpace.s2;

/// `collapsible.tsx` 트리거의 `gap-2`입니다.
const double _collapsibleTriggerGap = HoronSpace.s2;

/// `collapsible.tsx` 패널 안쪽의 `px-2.5`입니다.
const double _collapsiblePanelPaddingH = HoronSpace.s2_5;

/// `collapsible.tsx` 패널 안쪽의 `pb-2`입니다.
const double _collapsiblePanelPaddingBottom = HoronSpace.s2;

/// `collapsible.tsx`의 `[&_svg:not([class*='size-'])]:size-4`입니다.
const double _collapsibleIconSize = HoronSpace.s4;

/// `transition-[height] duration-200 ease-out`입니다. `duration-200`은
/// [HoronDuration.slow], `ease-out`은 [HoronEasing.out]입니다.
const Duration _collapsibleDuration = Duration(milliseconds: HoronDuration.slow);

/// `focus-visible:ring-3 focus-visible:ring-ring/50`을 4px 눈금의 2px 단계로 옮긴 값입니다.
const double _collapsibleFocusRingSpread = HoronSpace.s0_5;

/// `focus-visible:ring-ring/50`의 불투명도입니다.
const double _collapsibleFocusRingAlpha = 0.5;

/// `disabled:opacity-50`입니다.
const double _collapsibleDisabledOpacity = 0.5;

/// 열림 상태를 자식에게 알리는 스코프입니다.
class _HoronCollapsibleScope extends InheritedWidget {
  const _HoronCollapsibleScope({
    required this.open,
    required this.disabled,
    required this.toggle,
    required super.child,
  });

  /// 지금 펼쳐져 있는지 여부입니다.
  final bool open;

  /// 이 묶음 전체를 누를 수 없는지 여부입니다.
  final bool disabled;

  /// 트리거가 부르는 열고 닫는 콜백입니다.
  final VoidCallback toggle;

  static _HoronCollapsibleScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronCollapsibleScope>();

  @override
  bool updateShouldNotify(_HoronCollapsibleScope oldWidget) => open != oldWidget.open || disabled != oldWidget.disabled;
}

/// 머리말 하나 아래 내용을 접었다 펴는 묶음입니다.
///
/// `collapsible.tsx`의 `Collapsible`을 옮긴 것입니다. React 루트는 `flex w-full
/// flex-col`이고, 패널은 높이를 `h-(--collapsible-panel-height)`에서 0으로 옮기며
/// `transition-[height] duration-200 ease-out`을 겁니다. Flutter는 [AnimatedSize]가
/// 그 자리를 맡고, 시간은 [HoronDuration.slow], 곡선은 [HoronEasing.out]입니다.
///
/// [open]을 넘기면 제어 모드가 되어 상태를 호스트가 소유하고, 넘기지 않으면 이
/// 위젯이 기억합니다.
///
/// ```dart
/// HoronCollapsible(
///   child: Column(
///     children: <Widget>[
///       HoronCollapsibleTrigger(label: '고급 설정'),
///       HoronCollapsiblePanel(child: Text('숨겨 두었던 항목')),
///     ],
///   ),
/// );
/// ```
class HoronCollapsible extends StatefulWidget {
  /// 접히는 묶음 하나를 만듭니다.
  const HoronCollapsible({
    super.key,
    required this.child,
    this.open,
    this.initialOpen = false,
    this.onOpenChanged,
    this.disabled = false,
  });

  /// 트리거와 패널을 담는 내용입니다.
  final Widget child;

  /// 펼침 상태입니다. null이면 이 위젯이 상태를 소유합니다.
  final bool? open;

  /// 제어 모드가 아닐 때의 처음 상태입니다.
  final bool initialOpen;

  /// 펼침 상태가 바뀔 때 부르는 콜백입니다.
  final ValueChanged<bool>? onOpenChanged;

  /// 누를 수 없는 상태입니다. React `disabled`에 해당합니다.
  final bool disabled;

  @override
  State<HoronCollapsible> createState() => _HoronCollapsibleState();
}

class _HoronCollapsibleState extends State<HoronCollapsible> {
  late bool _internalOpen = widget.initialOpen;

  bool get _open => widget.open ?? _internalOpen;

  void _toggle() {
    if (widget.disabled) return;
    final bool next = !_open;
    if (widget.open == null) setState(() => _internalOpen = next);
    widget.onOpenChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    return _HoronCollapsibleScope(
      open: _open,
      disabled: widget.disabled,
      toggle: _toggle,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[widget.child],
      ),
    );
  }
}

/// 묶음을 여닫는 머리말입니다.
///
/// `collapsible.tsx`의 `CollapsibleTrigger`를 옮긴 것입니다. `inline-flex
/// items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-sm font-medium`
/// 이고, hover에서 `bg-muted`, 포커스에서 링, 비활성에서 불투명도 50%가 됩니다.
/// 오른쪽 아이콘은 호스트가 넘기고, 없으면 이 위젯이 셰브론을 그려 펼침에 따라
/// 돌립니다.
class HoronCollapsibleTrigger extends StatefulWidget {
  /// 트리거 하나를 만듭니다.
  const HoronCollapsibleTrigger({super.key, this.label, this.child, this.icon, this.disabled = false})
    : assert(label != null || child != null, 'HoronCollapsibleTrigger needs a label or a child.');

  /// 머리말 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 오른쪽 아이콘입니다. 없으면 셰브론을 그립니다.
  final Widget? icon;

  /// 누를 수 없는 상태입니다. [HoronCollapsible.disabled]가 참이면 그 값이 이깁니다.
  final bool disabled;

  /// 셰브론 회전을 찾는 키입니다.
  static const Key chevronKey = ValueKey<String>('horon-collapsible-chevron');

  @override
  State<HoronCollapsibleTrigger> createState() => _HoronCollapsibleTriggerState();
}

class _HoronCollapsibleTriggerState extends State<HoronCollapsibleTrigger> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronCollapsibleScope? scope = _HoronCollapsibleScope.maybeOf(context);
    final bool open = scope?.open ?? false;
    final bool disabled = widget.disabled || (scope?.disabled ?? false);

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.body,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );

    final Widget trailing =
        widget.icon ??
        AnimatedRotation(
          key: HoronCollapsibleTrigger.chevronKey,
          turns: open ? 0.5 : 0,
          duration: _collapsibleDuration,
          curve: HoronEasing.easingDefault,
          child: SizedBox.square(
            dimension: _collapsibleIconSize,
            child: CustomPaint(painter: _HoronCollapsibleChevronPainter(color: scheme.onSurfaceVariant)),
          ),
        );

    Widget result = Semantics(
      button: true,
      expanded: open,
      enabled: !disabled,
      child: FocusableActionDetector(
        enabled: !disabled,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              scope?.toggle();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: disabled ? null : scope?.toggle,
            child: DecoratedBox(
              decoration: BoxDecoration(
                // "hover:bg-muted"
                color: _hovered && !disabled ? scheme.surfaceContainerHighest : Colors.transparent,
                borderRadius: BorderRadius.circular(HoronRadius.sm),
                boxShadow: _focused
                    ? <BoxShadow>[
                        BoxShadow(
                          color: horon.ring.withValues(alpha: _collapsibleFocusRingAlpha),
                          spreadRadius: _collapsibleFocusRingSpread,
                        ),
                      ]
                    : null,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: _collapsibleTriggerPaddingH,
                  vertical: _collapsibleTriggerPaddingV,
                ),
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: widget.label != null
                          ? Text(widget.label!, style: textStyle)
                          : DefaultTextStyle.merge(style: textStyle, child: widget.child!),
                    ),
                    const SizedBox(width: _collapsibleTriggerGap),
                    IconTheme.merge(
                      data: IconThemeData(color: scheme.onSurfaceVariant),
                      child: trailing,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );

    if (disabled) result = Opacity(opacity: _collapsibleDisabledOpacity, child: result);
    return result;
  }
}

/// 접히는 내용 패널입니다.
///
/// `collapsible.tsx`의 `CollapsiblePanel`을 옮긴 것입니다. React는 패널 높이를
/// `h-(--collapsible-panel-height)`에서 0으로 옮기며 자식을 자르고, 안쪽 여백은
/// `px-2.5 pt-0 pb-2`입니다. Flutter는 [AnimatedSize]로 높이를 애니메이션하고
/// [ClipRect]로 넘치는 내용을 자릅니다.
class HoronCollapsiblePanel extends StatelessWidget {
  /// 패널 하나를 만듭니다.
  const HoronCollapsiblePanel({super.key, required this.child});

  /// 펼쳤을 때 보이는 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool open = _HoronCollapsibleScope.maybeOf(context)?.open ?? false;

    final Widget inner = Padding(
      padding: const EdgeInsets.only(
        left: _collapsiblePanelPaddingH,
        right: _collapsiblePanelPaddingH,
        bottom: _collapsiblePanelPaddingBottom,
      ),
      child: DefaultTextStyle.merge(
        style: TextStyle(
          fontFamily: HoronFont.body,
          fontFamilyFallback: HoronFont.fontFamilyFallback,
          fontSize: HoronText.body,
          height: HoronLineHeight.normal,
          color: scheme.onSurfaceVariant,
          decoration: TextDecoration.none,
        ),
        child: child,
      ),
    );

    return ClipRect(
      child: AnimatedSize(
        duration: _collapsibleDuration,
        curve: HoronEasing.out,
        alignment: Alignment.topCenter,
        child: open ? inner : const SizedBox(width: double.infinity),
      ),
    );
  }
}

/// lucide `ChevronDown`(`M6 9l6 6 6-6`)을 24 단위 상자의 비율로 그립니다.
class _HoronCollapsibleChevronPainter extends CustomPainter {
  const _HoronCollapsibleChevronPainter({required this.color});

  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = HoronSpace.s0_5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final Path path = Path()
      ..moveTo(size.width * 0.25, size.height * 0.375)
      ..lineTo(size.width * 0.5, size.height * 0.625)
      ..lineTo(size.width * 0.75, size.height * 0.375);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _HoronCollapsibleChevronPainter oldDelegate) => oldDelegate.color != color;
}
