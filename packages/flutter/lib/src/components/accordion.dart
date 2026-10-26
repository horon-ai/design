import 'package:flutter/foundation.dart' show setEquals;
import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `accordion.tsx` 트리거의 `py-3`입니다.
const double _accordionTriggerPaddingV = HoronSpace.s3;

/// `accordion.tsx` 트리거의 `gap-2`입니다. 제목과 셰브론 사이 거리입니다.
const double _accordionTriggerGap = HoronSpace.s2;

/// `accordion.tsx` 패널 안쪽의 `pb-3`입니다.
const double _accordionPanelPaddingBottom = HoronSpace.s3;

/// `accordion.tsx`의 `[&_svg:not([class*='size-'])]:size-4`입니다.
const double _accordionChevronSize = HoronSpace.s4;

/// 셰브론 선의 두께입니다. lucide `ChevronDown`의 `stroke-width` 2를 4px 눈금의
/// 2px 단계로 옮겼습니다.
const double _accordionChevronStroke = HoronSpace.s0_5;

/// `transition-transform duration-200`입니다. `duration-200`은 [HoronDuration.slow]입니다.
const Duration _accordionAnimation = Duration(milliseconds: HoronDuration.slow);

/// `focus-visible:ring-3 focus-visible:ring-ring/50`을 4px 눈금의 2px 단계로 옮긴 값입니다.
const double _accordionFocusRingSpread = HoronSpace.s0_5;

/// `focus-visible:ring-ring/50`의 불투명도입니다.
const double _accordionFocusRingAlpha = 0.5;

/// `disabled:opacity-50`입니다.
const double _accordionDisabledOpacity = 0.5;

/// 한 번에 하나만 열지, 여러 개를 함께 열지 정합니다.
///
/// React는 Base UI의 `openMultiple` prop으로 고르고 cva 변형 그룹이 아니므로
/// 공개 enum을 두지 않습니다. 호출자는 [HoronAccordion.multiple]로 고릅니다.
enum _HoronAccordionMode { single, multiple }

/// 열린 항목의 값을 자식에게 알리는 스코프입니다.
class _HoronAccordionScope extends InheritedWidget {
  const _HoronAccordionScope({
    required this.openValues,
    required this.mode,
    required this.onToggle,
    required super.child,
  });

  /// 지금 열린 항목의 값들입니다.
  final Set<String> openValues;

  /// 단일·다중 열림 방식입니다.
  final _HoronAccordionMode mode;

  /// 항목 하나를 눌렀을 때 아코디언이 부르는 콜백입니다.
  final ValueChanged<String> onToggle;

  static _HoronAccordionScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronAccordionScope>();

  @override
  bool updateShouldNotify(_HoronAccordionScope oldWidget) =>
      !setEquals(openValues, oldWidget.openValues) || mode != oldWidget.mode;
}

/// 항목 하나의 열림·비활성 상태를 트리거와 패널에게 알리는 스코프입니다.
class _HoronAccordionItemScope extends InheritedWidget {
  const _HoronAccordionItemScope({
    required this.value,
    required this.open,
    required this.disabled,
    required this.toggle,
    required super.child,
  });

  /// 이 항목의 값입니다.
  final String value;

  /// 이 항목이 열렸는지 여부입니다.
  final bool open;

  /// 이 항목을 누를 수 없는지 여부입니다.
  final bool disabled;

  /// 이 항목을 열고 닫는 콜백입니다.
  final VoidCallback toggle;

  static _HoronAccordionItemScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronAccordionItemScope>();

  @override
  bool updateShouldNotify(_HoronAccordionItemScope oldWidget) =>
      value != oldWidget.value || open != oldWidget.open || disabled != oldWidget.disabled;
}

/// 접었다 펼 수 있는 항목을 세로로 쌓는 묶음입니다.
///
/// `accordion.tsx`의 `Accordion`을 옮긴 것입니다. React 루트는 `flex w-full
/// flex-col`이고, 각 항목이 아래 테두리를 그립니다(`border-b border-border
/// last:border-b-0`). 이 위젯은 항목 사이에 1px 선을 놓아 같은 모양을 만듭니다.
///
/// [multiple]이 거짓이면 한 번에 하나만 열리고(단일 열림), 참이면 여러 항목이 함께
/// 열립니다. [value]를 넘기면 제어 모드가 되어 열린 값을 호스트가 소유하고, 넘기지
/// 않으면 이 위젯이 기억합니다.
///
/// ```dart
/// HoronAccordion(
///   initialValue: <String>{'shipping'},
///   children: const <Widget>[
///     HoronAccordionItem(
///       value: 'shipping',
///       trigger: '배송',
///       child: Text('영업일 기준 2일 안에 도착합니다.'),
///     ),
///   ],
/// );
/// ```
class HoronAccordion extends StatefulWidget {
  /// 아코디언 하나를 만듭니다.
  const HoronAccordion({
    super.key,
    required this.children,
    this.multiple = false,
    this.value,
    this.initialValue = const <String>{},
    this.onValueChanged,
  });

  /// 항목들입니다. [HoronAccordionItem]을 넣습니다.
  final List<Widget> children;

  /// 여러 항목을 함께 열 수 있는지 여부입니다.
  final bool multiple;

  /// 열린 항목의 값들입니다. null이면 이 위젯이 상태를 소유합니다.
  final Set<String>? value;

  /// 제어 모드가 아닐 때 처음 열린 값들입니다.
  final Set<String> initialValue;

  /// 열린 값이 바뀔 때 부르는 콜백입니다.
  final ValueChanged<Set<String>>? onValueChanged;

  @override
  State<HoronAccordion> createState() => _HoronAccordionState();
}

class _HoronAccordionState extends State<HoronAccordion> {
  late Set<String> _internalValue = Set<String>.of(widget.initialValue);

  Set<String> get _openValues => widget.value ?? _internalValue;

  void _toggle(String value) {
    final Set<String> current = _openValues;
    final Set<String> next;
    if (current.contains(value)) {
      next = Set<String>.of(current)..remove(value);
    } else if (widget.multiple) {
      next = Set<String>.of(current)..add(value);
    } else {
      next = <String>{value};
    }
    if (widget.value == null) setState(() => _internalValue = next);
    widget.onValueChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final List<Widget> rows = <Widget>[];
    for (int index = 0; index < widget.children.length; index++) {
      // "border-b border-border last:border-b-0" - 항목 사이에만 선을 긋습니다.
      if (index > 0) {
        rows.add(
          SizedBox(
            height: _accordionDividerThickness,
            child: ColoredBox(color: scheme.outline),
          ),
        );
      }
      rows.add(widget.children[index]);
    }

    return _HoronAccordionScope(
      openValues: _openValues,
      mode: widget.multiple ? _HoronAccordionMode.multiple : _HoronAccordionMode.single,
      onToggle: _toggle,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: rows),
    );
  }
}

/// `accordion.tsx` 항목의 `border-b`가 그리는 선 두께입니다. 테두리 두께는 토큰
/// 스케일에 없어 이 파일이 이름을 붙여 들고 있습니다.
const double _accordionDividerThickness = 1.0;

/// 아코디언의 항목 하나입니다.
///
/// `accordion.tsx`의 `AccordionItem`을 옮긴 것입니다. React는 항목이 아래 테두리를
/// 그리고 트리거와 패널을 담습니다. Flutter에서는 [HoronAccordion]이 항목 사이에
/// 선을 그리므로 이 위젯은 두 파트만 세로로 쌓습니다.
class HoronAccordionItem extends StatelessWidget {
  /// 항목 하나를 만듭니다.
  const HoronAccordionItem({
    super.key,
    required this.value,
    this.trigger,
    this.child,
    this.children,
    this.disabled = false,
  }) : assert(trigger != null || children != null, 'HoronAccordionItem needs a trigger or explicit children.');

  /// 이 항목의 값입니다. 열린 값 집합에 들어갑니다.
  final String value;

  /// 트리거 글자입니다. [children]을 넘기지 않을 때 씁니다.
  final String? trigger;

  /// 펼쳤을 때 보이는 내용입니다.
  final Widget? child;

  /// 트리거와 패널을 직접 넣습니다. [trigger] 대신 씁니다.
  final List<Widget>? children;

  /// 누를 수 없는 상태입니다. React `disabled`에 해당합니다.
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final _HoronAccordionScope? accordion = _HoronAccordionScope.maybeOf(context);
    final bool open = accordion?.openValues.contains(value) ?? false;
    void toggle() {
      if (disabled) return;
      accordion?.onToggle(value);
    }

    final Widget? panel = child == null ? null : HoronAccordionPanel(child: child!);

    final List<Widget> parts = children ?? <Widget>[HoronAccordionTrigger(label: trigger, disabled: disabled), ?panel];

    return _HoronAccordionItemScope(
      value: value,
      open: open,
      disabled: disabled,
      toggle: toggle,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: parts),
    );
  }
}

/// 항목을 여닫는 머리말입니다.
///
/// `accordion.tsx`의 `AccordionTrigger`를 옮긴 것입니다. `flex w-full items-center
/// justify-between gap-2 rounded-sm py-3 text-sm font-medium`이고, 오른쪽에
/// [HoronDuration.slow] 동안 180도 도는 셰브론이 붙습니다. hover에서 글자가
/// `text-primary`가 되고, 비활성은 불투명도 50%입니다.
class HoronAccordionTrigger extends StatefulWidget {
  /// 트리거 하나를 만듭니다.
  const HoronAccordionTrigger({super.key, this.label, this.child, this.icon, this.disabled = false})
    : assert(label != null || child != null, 'HoronAccordionTrigger needs a label or a child.');

  /// 머리말 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 셰브론 자리에 넣는 아이콘입니다. 없으면 이 위젯이 셰브론을 직접 그립니다.
  final Widget? icon;

  /// 누를 수 없는 상태입니다. [HoronAccordionItem.disabled]가 참이면 그 값이
  /// 이깁니다.
  final bool disabled;

  @override
  State<HoronAccordionTrigger> createState() => _HoronAccordionTriggerState();
}

class _HoronAccordionTriggerState extends State<HoronAccordionTrigger> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronAccordionItemScope? item = _HoronAccordionItemScope.maybeOf(context);
    final bool open = item?.open ?? false;
    final bool disabled = widget.disabled || (item?.disabled ?? false);

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: HoronText.body,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: _hovered && !disabled ? scheme.primary : scheme.onSurface,
      decoration: TextDecoration.none,
    );

    final Widget chevron =
        widget.icon ??
        AnimatedRotation(
          turns: open ? 0.5 : 0,
          duration: _accordionAnimation,
          curve: HoronEasing.easingDefault,
          child: SizedBox.square(
            dimension: _accordionChevronSize,
            child: CustomPaint(
              painter: _HoronChevronPainter(color: scheme.onSurfaceVariant, strokeWidth: _accordionChevronStroke),
            ),
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
              item?.toggle();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: disabled ? null : item?.toggle,
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(HoronRadius.sm),
                boxShadow: _focused
                    ? <BoxShadow>[
                        BoxShadow(
                          color: horon.ring.withValues(alpha: _accordionFocusRingAlpha),
                          spreadRadius: _accordionFocusRingSpread,
                        ),
                      ]
                    : null,
              ),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: _accordionTriggerPaddingV),
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: widget.label != null
                          ? Text(widget.label!, style: textStyle)
                          : DefaultTextStyle.merge(style: textStyle, child: widget.child!),
                    ),
                    const SizedBox(width: _accordionTriggerGap),
                    IconTheme.merge(
                      data: IconThemeData(color: scheme.onSurfaceVariant),
                      child: chevron,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );

    if (disabled) result = Opacity(opacity: _accordionDisabledOpacity, child: result);
    return result;
  }
}

/// 항목의 내용을 담는 패널입니다.
///
/// `accordion.tsx`의 `AccordionPanel`을 옮긴 것입니다. React는 패널 높이를
/// `h-(--accordion-panel-height)`에서 0으로 옮기며 `transition-[height]
/// duration-200 ease-out`을 겁니다. Flutter는 [AnimatedSize]가 그 자리를 맡고,
/// 시간은 [HoronDuration.slow], 곡선은 [HoronEasing.out]입니다. 안쪽 여백은
/// `pt-0 pb-3`이라 아래에만 12가 붙습니다.
class HoronAccordionPanel extends StatelessWidget {
  /// 패널 하나를 만듭니다.
  const HoronAccordionPanel({super.key, required this.child});

  /// 펼쳤을 때 보이는 내용입니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool open = _HoronAccordionItemScope.maybeOf(context)?.open ?? false;

    final Widget inner = Padding(
      padding: const EdgeInsets.only(bottom: _accordionPanelPaddingBottom),
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

    // "h-(--accordion-panel-height) overflow-hidden" - 넘치는 내용은 잘립니다.
    return ClipRect(
      child: AnimatedSize(
        duration: _accordionAnimation,
        curve: HoronEasing.out,
        alignment: Alignment.topCenter,
        child: open ? inner : const SizedBox(width: double.infinity),
      ),
    );
  }
}

/// lucide `ChevronDown`(`M6 9l6 6 6-6`)을 24 단위 상자의 비율로 그립니다.
class _HoronChevronPainter extends CustomPainter {
  const _HoronChevronPainter({required this.color, required this.strokeWidth});

  final Color color;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final Path path = Path()
      ..moveTo(size.width * _chevronStartX, size.height * _chevronStartY)
      ..lineTo(size.width * _chevronMidX, size.height * _chevronMidY)
      ..lineTo(size.width * _chevronEndX, size.height * _chevronEndY);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _HoronChevronPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.strokeWidth != strokeWidth;
}

/// lucide `ChevronDown`의 시작점 x입니다. 24 단위 중 6입니다.
const double _chevronStartX = 0.25;

/// lucide `ChevronDown`의 시작점 y입니다. 24 단위 중 9입니다.
const double _chevronStartY = 0.375;

/// lucide `ChevronDown`의 꺾이는 점 x입니다. 24 단위 중 12입니다.
const double _chevronMidX = 0.5;

/// lucide `ChevronDown`의 꺾이는 점 y입니다. 24 단위 중 15입니다.
const double _chevronMidY = 0.625;

/// lucide `ChevronDown`의 끝점 x입니다. 24 단위 중 18입니다.
const double _chevronEndX = 0.75;

/// lucide `ChevronDown`의 끝점 y입니다. 24 단위 중 9입니다.
const double _chevronEndY = 0.375;
