import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 한 단계의 상태입니다. React `stepper.tsx`의 `data-state` 세 값과 같습니다.
///
/// React는 이 값을 cva 변형이 아니라 `data-state` 속성으로만 노출합니다. 공개
/// enum으로 두면 변형 게이트가 React에 없는 이름을 보게 되므로 이 파일 안에만
/// 둡니다. 바깥에서는 [HoronStepperIndicator]·[HoronStepperTitle]·
/// [HoronStepperSeparator]가 그리는 모양으로 상태를 읽습니다.
enum _HoronStepStatus {
  /// 지금 서 있는 단계입니다. `data-state="active"`.
  active,

  /// 이미 지나온 단계입니다. `data-state="complete"`.
  complete,

  /// 아직 오지 않은 단계입니다. `data-state="inactive"`.
  inactive,
}

/// 단계 표시가 늘어선 방향입니다. 호출자는 [HoronStepper.vertical]로 고릅니다.
///
/// React `stepper.tsx`의 `StepperOrientation`은 cva 변형 그룹이 아니라 타입
/// 별칭이므로 공개 enum을 두지 않습니다.
enum _HoronStepperOrientation { horizontal, vertical }

/// `stepper.tsx` 루트와 항목의 `gap-2`입니다.
const double _stepperGap = HoronSpace.s2;

/// `stepper.tsx` 트리거의 `p-1`입니다.
const double _stepperTriggerPadding = HoronSpace.s1;

/// `stepper.tsx` 인디케이터의 `size-8`입니다.
const double _stepperIndicatorSize = HoronSpace.s8;

/// `stepper.tsx` 인디케이터의 `text-xs`입니다.
const double _stepperIndicatorFontSize = HoronText.caption;

/// `stepper.tsx` 제목의 `text-sm`입니다.
const double _stepperTitleFontSize = HoronText.body;

/// `stepper.tsx` 구분선의 `h-px`/`w-px`입니다. 테두리 두께는 토큰 스케일에 없어
/// 이름을 붙입니다.
const double _stepperSeparatorThickness = 1.0;

/// `stepper.tsx` 수직 구분선의 `h-6`입니다.
const double _stepperSeparatorHeightVertical = HoronSpace.s6;

/// `stepper.tsx` 구분선의 `mx-1`/`my-1`입니다.
const double _stepperSeparatorMargin = HoronSpace.s1;

/// `transition-colors`입니다. React는 클래스로 시간을 정하지 않아 토큰의 기본
/// 시간을 씁니다.
const Duration _stepperTransition = Duration(milliseconds: HoronDuration.normal);

/// `focus-visible:ring-3 focus-visible:ring-ring/50`을 4px 눈금의 2px 단계로 옮긴 값입니다.
const double _stepperFocusRingSpread = HoronSpace.s0_5;

/// `focus-visible:ring-ring/50`의 불투명도입니다.
const double _stepperFocusRingAlpha = 0.5;

/// `disabled:opacity-50`입니다.
const double _stepperDisabledOpacity = 0.5;

/// lucide `Check`(`M20 6 9 17l-5-5`)의 비율 좌표입니다.
const double _checkStartX = 0.167;
const double _checkStartY = 0.5;
const double _checkMidX = 0.375;
const double _checkMidY = 0.708;
const double _checkEndX = 0.833;
const double _checkEndY = 0.25;

/// 단계 값과 순서, 방향을 자식에게 알리는 스코프입니다.
class _HoronStepperScope extends InheritedWidget {
  const _HoronStepperScope({
    required this.value,
    required this.steps,
    required this.orientation,
    required this.onSelect,
    required super.child,
  });

  /// 지금 서 있는 단계의 값입니다. 아직 없으면 null입니다.
  final String? value;

  /// 단계 값 목록입니다. 순서가 곧 진행 순서입니다.
  final List<String> steps;

  /// 방향입니다.
  final _HoronStepperOrientation orientation;

  /// 단계 하나를 눌렀을 때 루트가 부르는 콜백입니다.
  final ValueChanged<String> onSelect;

  static _HoronStepperScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronStepperScope>();

  @override
  bool updateShouldNotify(_HoronStepperScope oldWidget) =>
      value != oldWidget.value || orientation != oldWidget.orientation || !_sameSteps(oldWidget.steps, steps);
}

/// 두 단계 목록이 같은 순서인지 확인합니다.
bool _sameSteps(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (int index = 0; index < a.length; index++) {
    if (a[index] != b[index]) return false;
  }
  return true;
}

/// 한 항목의 단계 값·순서·상태를 자식에게 알리는 스코프입니다.
class _HoronStepperItemScope extends InheritedWidget {
  const _HoronStepperItemScope({
    required this.step,
    required this.index,
    required this.state,
    required this.orientation,
    required super.child,
  });

  /// 이 항목의 단계 값입니다.
  final String step;

  /// 이 항목의 순서입니다.
  final int index;

  /// 이 항목의 상태입니다.
  final _HoronStepStatus state;

  /// 방향입니다.
  final _HoronStepperOrientation orientation;

  static _HoronStepperItemScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronStepperItemScope>();

  @override
  bool updateShouldNotify(_HoronStepperItemScope oldWidget) =>
      step != oldWidget.step || index != oldWidget.index || state != oldWidget.state;
}

/// 진행 단계를 보여 주고 고르게 하는 묶음입니다.
///
/// `stepper.tsx`의 `Stepper`를 옮긴 것입니다. React는 자식의 `step` prop을 모아
/// 순서를 만들고, 지금 값의 위치와 비교해 각 단계를 `active`·`complete`·
/// `inactive`로 나눕니다. Flutter도 [HoronStepperItem]의 `step`을 적힌 순서대로
/// 모아 같은 규칙을 씁니다.
///
/// [value]를 넘기면 제어 모드가 되어 상태를 호스트가 소유하고, 넘기지 않으면 이
/// 위젯이 기억합니다. 값이 없으면 모든 단계가 `inactive`입니다(React도 같습니다).
///
/// ```dart
/// HoronStepper(
///   initialValue: 'address',
///   children: <Widget>[
///     HoronStepperItem(
///       step: 'account',
///       children: <Widget>[
///         HoronStepperTrigger(
///           child: Row(
///             children: <Widget>[
///               const HoronStepperIndicator(),
///               const SizedBox(width: HoronSpace.s2_5),
///               const HoronStepperTitle(text: '계정'),
///             ],
///           ),
///         ),
///         const HoronStepperSeparator(),
///       ],
///     ),
///   ],
/// );
/// ```
class HoronStepper extends StatefulWidget {
  /// 단계 묶음 하나를 만듭니다.
  const HoronStepper({
    super.key,
    required this.children,
    this.value,
    this.initialValue,
    this.onValueChanged,
    this.vertical = false,
  });

  /// 단계들입니다. [HoronStepperItem]을 넣습니다.
  final List<Widget> children;

  /// 지금 단계의 값입니다. null이면 이 위젯이 상태를 소유합니다.
  final String? value;

  /// 제어 모드가 아닐 때의 처음 단계 값입니다.
  final String? initialValue;

  /// 단계가 바뀔 때 부르는 콜백입니다.
  final ValueChanged<String>? onValueChanged;

  /// 세로로 쌓을지 여부입니다. React `orientation="vertical"`에 해당합니다.
  final bool vertical;

  @override
  State<HoronStepper> createState() => _HoronStepperState();
}

class _HoronStepperState extends State<HoronStepper> {
  late String? _internalValue = widget.initialValue;

  String? get _value => widget.value ?? _internalValue;

  void _select(String step) {
    if (widget.value == null) setState(() => _internalValue = step);
    widget.onValueChanged?.call(step);
  }

  /// 자식 항목의 `step`을 적힌 순서대로 모읍니다.
  List<String> get _steps => <String>[
    for (final Widget child in widget.children)
      if (child is HoronStepperItem) child.step,
  ];

  @override
  Widget build(BuildContext context) {
    final bool vertical = widget.vertical;
    // 수평일 때는 각 항목이 폭을 나눠 가지고, 항목 안의 구분선이 남는 자리를 채웁니다
    // (React `flex-1`). 폭이 정해지지 않은 `Row`에서는 `Expanded`가 설 자리가 없어
    // 항목을 늘려 같은 배치를 만듭니다.
    final List<Widget> children = vertical
        ? widget.children
        : <Widget>[for (final Widget child in widget.children) Expanded(child: child)];

    return _HoronStepperScope(
      value: _value,
      steps: _steps,
      orientation: vertical ? _HoronStepperOrientation.vertical : _HoronStepperOrientation.horizontal,
      onSelect: _select,
      child: Flex(
        direction: vertical ? Axis.vertical : Axis.horizontal,
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: vertical ? CrossAxisAlignment.stretch : CrossAxisAlignment.center,
        spacing: _stepperGap,
        children: children,
      ),
    );
  }
}

/// 한 단계의 항목입니다.
///
/// `stepper.tsx`의 `StepperItem`을 옮긴 것입니다. React는 `data-state`와
/// `data-orientation`을 달고, 수직이면 `w-full flex-col items-start`가 됩니다.
/// 이 위젯은 그 상태를 [HoronStepperIndicator]와 [HoronStepperSeparator]에
/// 스코프로 내려 보냅니다.
class HoronStepperItem extends StatelessWidget {
  /// 항목 하나를 만듭니다.
  const HoronStepperItem({super.key, required this.step, required this.children});

  /// 이 단계의 값입니다. 진행 순서는 이 값의 나열 순서로 정해집니다.
  final String step;

  /// 트리거와 구분선 등 이 항목의 파트입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final _HoronStepperScope? stepper = _HoronStepperScope.maybeOf(context);
    final List<String> steps = stepper?.steps ?? const <String>[];
    final String? value = stepper?.value;
    final int index = steps.indexOf(step);
    final int activeIndex = value == null ? -1 : steps.indexOf(value);
    final _HoronStepStatus status;
    if (index == -1 || activeIndex == -1) {
      status = _HoronStepStatus.inactive;
    } else if (index == activeIndex) {
      status = _HoronStepStatus.active;
    } else if (index < activeIndex) {
      status = _HoronStepStatus.complete;
    } else {
      status = _HoronStepStatus.inactive;
    }
    final _HoronStepperOrientation orientation = stepper?.orientation ?? _HoronStepperOrientation.horizontal;
    final bool vertical = orientation == _HoronStepperOrientation.vertical;

    return _HoronStepperItemScope(
      step: step,
      index: index,
      state: status,
      orientation: orientation,
      child: Flex(
        direction: vertical ? Axis.vertical : Axis.horizontal,
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: vertical ? CrossAxisAlignment.start : CrossAxisAlignment.center,
        spacing: _stepperGap,
        children: children,
      ),
    );
  }
}

/// 단계를 눌러 그 단계로 옮기는 트리거입니다.
///
/// `stepper.tsx`의 `StepperTrigger`를 옮긴 것입니다. `flex items-center gap-2.5
/// rounded-md p-1 text-left`이고, 누르면 그 단계의 값이 됩니다.
class HoronStepperTrigger extends StatefulWidget {
  /// 트리거 하나를 만듭니다.
  const HoronStepperTrigger({super.key, required this.child, this.disabled = false});

  /// 인디케이터와 제목 등 트리거 안에 놓을 내용입니다.
  final Widget child;

  /// 누를 수 없는 상태입니다.
  final bool disabled;

  @override
  State<HoronStepperTrigger> createState() => _HoronStepperTriggerState();
}

class _HoronStepperTriggerState extends State<HoronStepperTrigger> {
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronStepperItemScope? item = _HoronStepperItemScope.maybeOf(context);
    final _HoronStepperScope? stepper = _HoronStepperScope.maybeOf(context);

    void select() {
      if (widget.disabled || item == null) return;
      stepper?.onSelect(item.step);
    }

    Widget result = Semantics(
      button: true,
      enabled: !widget.disabled,
      selected: item?.state == _HoronStepStatus.active,
      child: FocusableActionDetector(
        enabled: !widget.disabled,
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              select();
              return null;
            },
          ),
        },
        child: MouseRegion(
          cursor: widget.disabled ? SystemMouseCursors.basic : SystemMouseCursors.click,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: widget.disabled ? null : select,
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(HoronRadius.md),
                boxShadow: _focused
                    ? <BoxShadow>[
                        BoxShadow(
                          color: horon.ring.withValues(alpha: _stepperFocusRingAlpha),
                          spreadRadius: _stepperFocusRingSpread,
                        ),
                      ]
                    : null,
              ),
              child: Padding(padding: const EdgeInsets.all(_stepperTriggerPadding), child: widget.child),
            ),
          ),
        ),
      ),
    );

    if (widget.disabled) result = Opacity(opacity: _stepperDisabledOpacity, child: result);
    return result;
  }
}

/// 단계 번호를 담는 동그라미입니다.
///
/// `stepper.tsx`의 `StepperIndicator`를 옮긴 것입니다. `size-8 rounded-full
/// border border-border bg-card text-xs font-semibold text-muted-foreground`이고,
/// `active`는 `border-primary bg-primary text-primary-foreground`, `complete`는
/// `border-primary text-primary`에 체크 표시입니다. [child]를 넘기면 번호 대신
/// 그 내용을 그립니다.
class HoronStepperIndicator extends StatelessWidget {
  /// 인디케이터 하나를 만듭니다.
  const HoronStepperIndicator({super.key, this.child});

  /// 번호 대신 넣는 내용입니다. `complete` 상태에서는 무시하고 체크를 그립니다.
  final Widget? child;

  /// 체크 표시를 찾는 키입니다.
  static const Key checkKey = ValueKey<String>('horon-stepper-check');

  /// 동그라미 표면을 단계 값으로 찾는 키입니다.
  static Key surfaceKeyFor(String step) => ValueKey<String>('horon-stepper-indicator-$step');

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronStepperItemScope? item = _HoronStepperItemScope.maybeOf(context);
    final _HoronStepStatus status = item?.state ?? _HoronStepStatus.inactive;

    final Color border;
    final Color background;
    final Color foreground;
    switch (status) {
      case _HoronStepStatus.active:
        border = scheme.primary;
        background = scheme.primary;
        foreground = scheme.onPrimary;
      case _HoronStepStatus.complete:
        border = scheme.primary;
        background = scheme.surfaceContainerLow;
        foreground = scheme.primary;
      case _HoronStepStatus.inactive:
        border = scheme.outline;
        background = scheme.surfaceContainerLow;
        foreground = scheme.onSurfaceVariant;
    }

    final Widget content;
    if (status == _HoronStepStatus.complete) {
      content = SizedBox.square(
        dimension: HoronSpace.s4,
        child: CustomPaint(
          key: checkKey,
          painter: _HoronStepperCheckPainter(color: foreground, strokeWidth: HoronSpace.s0_5),
        ),
      );
    } else if (child != null) {
      content = child!;
    } else {
      final int number = (item?.index ?? 0) + 1;
      content = Text(
        '$number',
        style: TextStyle(
          fontFamily: HoronFont.body,
          fontFamilyFallback: HoronFont.fontFamilyFallback,
          fontSize: _stepperIndicatorFontSize,
          fontWeight: HoronFontWeight.semibold,
          height: HoronLineHeight.none,
          color: foreground,
          fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
          decoration: TextDecoration.none,
        ),
      );
    }

    return AnimatedContainer(
      key: item == null ? null : surfaceKeyFor(item.step),
      duration: _stepperTransition,
      curve: HoronEasing.easingDefault,
      width: _stepperIndicatorSize,
      height: _stepperIndicatorSize,
      decoration: BoxDecoration(
        color: background,
        shape: BoxShape.circle,
        border: Border.all(color: border),
      ),
      child: Center(child: content),
    );
  }
}

/// 단계의 이름입니다.
///
/// `stepper.tsx`의 `StepperTitle`을 옮긴 것입니다. `text-sm font-medium
/// text-muted-foreground`이고 `active`·`complete`에서 `text-foreground`가 됩니다.
class HoronStepperTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronStepperTitle({super.key, this.text, this.child})
    : assert(text != null || child != null, 'HoronStepperTitle needs a text or a child.');

  /// 제목 글자입니다.
  final String? text;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronStepStatus status = _HoronStepperItemScope.maybeOf(context)?.state ?? _HoronStepStatus.inactive;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _stepperTitleFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: status == _HoronStepStatus.inactive ? scheme.onSurfaceVariant : scheme.onSurface,
      decoration: TextDecoration.none,
    );

    if (text != null) return Text(text!, style: style);
    return DefaultTextStyle.merge(style: style, child: child!);
  }
}

/// 단계 사이를 잇는 선입니다.
///
/// `stepper.tsx`의 `StepperSeparator`를 옮긴 것입니다. 수평은 `mx-1 h-px flex-1`,
/// 수직은 `my-1 h-6 w-px`이고, `complete`에서 `bg-primary`로 채워집니다.
class HoronStepperSeparator extends StatelessWidget {
  /// 구분선 하나를 만듭니다.
  const HoronStepperSeparator({super.key});

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final _HoronStepperItemScope? item = _HoronStepperItemScope.maybeOf(context);
    final bool vertical = item?.orientation == _HoronStepperOrientation.vertical;
    final bool complete = item?.state == _HoronStepStatus.complete;

    final Widget line = AnimatedContainer(
      duration: _stepperTransition,
      curve: HoronEasing.easingDefault,
      width: vertical ? _stepperSeparatorThickness : null,
      height: vertical ? _stepperSeparatorHeightVertical : _stepperSeparatorThickness,
      decoration: BoxDecoration(
        color: complete ? scheme.primary : scheme.outline,
        borderRadius: BorderRadius.circular(HoronRadius.full),
      ),
    );

    // 수평 구분선은 남는 폭을 채우고(`flex-1`), 수직은 고정 높이를 가집니다.
    if (vertical) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: _stepperSeparatorMargin),
        child: line,
      );
    }
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _stepperSeparatorMargin),
        child: line,
      ),
    );
  }
}

/// lucide `Check`을 24 단위 상자의 비율로 그립니다.
class _HoronStepperCheckPainter extends CustomPainter {
  const _HoronStepperCheckPainter({required this.color, required this.strokeWidth});

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
      ..moveTo(size.width * _checkStartX, size.height * _checkStartY)
      ..lineTo(size.width * _checkMidX, size.height * _checkMidY)
      ..lineTo(size.width * _checkEndX, size.height * _checkEndY);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _HoronStepperCheckPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.strokeWidth != strokeWidth;
}
