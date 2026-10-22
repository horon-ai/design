import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `radio-group.tsx`의 라디오 그룹입니다.
///
/// React의 `grid w-full gap-2`를 [Column]으로 옮깁니다. 선택은 호출자가 소유하고
/// ([value]와 [onChanged]), 이 위젯은 그 값을 항목에 스코프로 내려보냅니다. 항목은
/// 자기를 그릴 때 그 값을 읽으므로 같은 그룹 안에서 선택은 언제나 하나입니다.
///
/// React 소스에 `variants:` 블록이 없으므로 공개 변형 enum을 두지 않습니다.
class HoronRadioGroup<T> extends StatelessWidget {
  /// 라디오 그룹을 만듭니다.
  const HoronRadioGroup({
    super.key,
    required this.value,
    required this.children,
    this.onChanged,
    this.invalid = false,
    this.enabled = true,
    this.semanticsLabel,
  });

  /// 지금 선택된 값입니다. 없으면 `null`입니다.
  final T? value;

  /// 그룹 안에 세로로 쌓을 항목입니다.
  final List<Widget> children;

  /// 다른 항목을 골랐을 때 부릅니다. 넘기는 값은 새로 선택된 항목의 값입니다.
  ///
  /// `null`이면 그룹 전체가 비활성입니다. React의 `disabled`에 대응합니다.
  final ValueChanged<T>? onChanged;

  /// 그룹 전체의 오류 상태입니다. React의 `aria-invalid`에 대응합니다.
  ///
  /// 항목이 자기 [HoronRadioGroupItem.invalid]를 넘기지 않으면 이 값을 따릅니다.
  final bool invalid;

  /// 그룹이 누름과 포커스를 받을지 여부입니다.
  ///
  /// 항목이 자기 [HoronRadioGroupItem.enabled]를 넘기지 않으면 이 값을 따릅니다.
  final bool enabled;

  /// 보조 기술이 읽을 그룹 이름입니다. 호스트가 넘깁니다.
  final String? semanticsLabel;

  @override
  Widget build(BuildContext context) {
    final ValueChanged<T>? onChanged = this.onChanged;
    return Semantics(
      container: true,
      inMutuallyExclusiveGroup: true,
      label: semanticsLabel,
      child: _HoronRadioGroupScope<T>(
        value: value,
        invalid: invalid,
        enabled: enabled && onChanged != null,
        onSelected: onChanged,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: HoronSpace.s2,
          children: children,
        ),
      ),
    );
  }
}

/// `radio-group.tsx`의 `RadioGroupItem`입니다.
///
/// React는 18px 원(`size-[18px] rounded-full border-2 border-input`)을 그리고,
/// 선택되면 그 안에 10px 점(`size-2.5 rounded-full bg-primary`)을 가운데에
/// 얹습니다. 이 위젯은 링과 점을 **서로 다른 두 위젯과 두 페인터로** 그립니다.
/// 링은 [HoronRadioRingPainter]가 지름 [diameter]의 원을 두께 [ringWidth]의
/// 테두리로 그리고, 점은 [HoronRadioDotPainter]가 지름 [dotDiameter]의 채운 원을
/// 그립니다. 링을 채워 점을 대신하지 않으므로 선택 상태에서도 링의 테두리와 점
/// 사이에 틈이 남습니다.
///
/// 상태별 모양은 React 클래스와 같습니다.
/// - 선택: 링 `primary`, 점 `primary`
/// - 미선택: 링 `input`, 점 없음
/// - 오류: 링 `destructive`. 선택된 항목은 `primary`가 이깁니다
///   (React `aria-invalid:aria-checked:border-primary`)
/// - 비활성: 불투명도 50%(React `disabled:opacity-50`)
/// - 포커스: 링 `ring`과 바깥 링(React `focus-visible:ring-3 ring-ring/50`)
class HoronRadioGroupItem<T> extends StatefulWidget {
  /// 라디오 항목을 만듭니다.
  ///
  /// [HoronRadioGroup] 안에서만 씁니다. 그룹이 없으면 선택도 누름도 없는
  /// 미선택 항목으로 그려집니다.
  const HoronRadioGroupItem({
    super.key,
    required this.value,
    this.label,
    this.invalid,
    this.enabled,
    this.semanticsLabel,
  });

  /// 이 항목이 나타내는 값입니다. 그룹의 값과 이 값이 같으면 선택으로 그립니다.
  final T value;

  /// 원 오른쪽에 붙는 문구입니다. 호스트가 넘깁니다.
  final String? label;

  /// 명시한 오류 상태입니다. null이면 그룹을 따릅니다.
  final bool? invalid;

  /// 명시한 활성 상태입니다. null이면 그룹을 따릅니다.
  final bool? enabled;

  /// 보조 기술이 읽을 이름입니다. 없으면 [label]을 씁니다.
  final String? semanticsLabel;

  /// React `size-[18px]`입니다. 링의 바깥 지름입니다.
  static const double diameter = _ringDiameter;

  /// React `border-2`입니다. 링의 선 두께입니다.
  static const double ringWidth = _ringWidth;

  /// React `size-2.5`입니다. 가운데 점의 지름입니다.
  static const double dotDiameter = _dotDiameter;

  /// 테스트가 링을 찾는 키입니다.
  static const Key ringKey = ValueKey<String>('horon-radio-ring');

  /// 테스트가 가운데 점을 찾는 키입니다.
  static const Key dotKey = ValueKey<String>('horon-radio-dot');

  @override
  State<HoronRadioGroupItem<T>> createState() => _HoronRadioGroupItemState<T>();
}

class _HoronRadioGroupItemState<T> extends State<HoronRadioGroupItem<T>> {
  bool _focused = false;

  void _select() {
    final _HoronRadioGroupScope<T>? scope = _HoronRadioGroupScope.maybeOf<T>(context);
    scope?.onSelected?.call(widget.value);
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final LogicalKeyboardKey key = event.logicalKey;
    if (key != LogicalKeyboardKey.space && key != LogicalKeyboardKey.enter) return KeyEventResult.ignored;
    _select();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronRadioGroupScope<T>? scope = _HoronRadioGroupScope.maybeOf<T>(context);

    final bool selected = scope != null && scope.value == widget.value;
    final bool invalid = widget.invalid ?? (scope?.invalid ?? false);
    final bool enabled = (widget.enabled ?? true) && (scope?.enabled ?? false);
    final bool focused = _focused && enabled;

    final Color ringColor = focused
        ? horon.ring
        : (selected ? scheme.primary : (invalid ? scheme.error : scheme.outline));

    final Widget circle = SizedBox.square(
      dimension: HoronRadioGroupItem.diameter,
      child: Stack(
        alignment: Alignment.center,
        children: <Widget>[
          CustomPaint(
            key: HoronRadioGroupItem.ringKey,
            size: const Size.square(HoronRadioGroupItem.diameter),
            painter: HoronRadioRingPainter(
              color: ringColor,
              diameter: HoronRadioGroupItem.diameter,
              ringWidth: HoronRadioGroupItem.ringWidth,
              haloColor: focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null,
            ),
          ),
          if (selected)
            CustomPaint(
              key: HoronRadioGroupItem.dotKey,
              size: const Size.square(HoronRadioGroupItem.dotDiameter),
              painter: HoronRadioDotPainter(color: scheme.primary, diameter: HoronRadioGroupItem.dotDiameter),
            ),
        ],
      ),
    );

    final String? label = widget.label;
    final Widget body = Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        circle,
        if (label != null) ...<Widget>[
          const SizedBox(width: HoronSpace.s2),
          Flexible(
            child: Text(
              label,
              style: (theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
                color: scheme.onSurface,
                fontSize: HoronText.body,
                height: HoronLineHeight.none,
              ),
            ),
          ),
        ],
      ],
    );

    return Semantics(
      container: true,
      inMutuallyExclusiveGroup: true,
      checked: selected,
      enabled: enabled,
      label: widget.semanticsLabel ?? label,
      onTap: enabled ? _select : null,
      child: Opacity(
        opacity: enabled ? 1 : _disabledOpacity,
        child: Focus(
          onFocusChange: (bool value) {
            if (_focused == value) return;
            setState(() => _focused = value);
          },
          onKeyEvent: _handleKey,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: enabled ? _select : null,
            child: MouseRegion(cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic, child: body),
          ),
        ),
      ),
    );
  }
}

/// 라디오의 링을 그립니다.
///
/// 지름 [diameter]의 원을 두께 [ringWidth]의 테두리로 그립니다. 반지름은
/// `(diameter - ringWidth) / 2`라서 선의 바깥 가장자리가 정확히 [diameter] 안에
/// 들어옵니다. 이 페인터는 링을 언제나 테두리(`PaintingStyle.stroke`)로만
/// 그리므로 안쪽은 비어 있습니다. 가운데 점은 [HoronRadioDotPainter]가 따로
/// 그립니다.
class HoronRadioRingPainter extends CustomPainter {
  /// 링을 그리는 페인터를 만듭니다.
  const HoronRadioRingPainter({required this.color, required this.diameter, required this.ringWidth, this.haloColor});

  /// 링의 색입니다.
  final Color color;

  /// 링의 바깥 지름입니다.
  final double diameter;

  /// 링의 선 두께입니다.
  final double ringWidth;

  /// 포커스 링 색입니다. 없으면 그리지 않습니다.
  final Color? haloColor;

  @override
  void paint(Canvas canvas, Size size) {
    final Offset center = size.center(Offset.zero);
    final Color? halo = haloColor;
    if (halo != null) {
      canvas.drawCircle(center, diameter / 2 + _focusRingWidth, Paint()..color = halo);
    }
    canvas.drawCircle(
      center,
      (diameter - ringWidth) / 2,
      Paint()
        ..color = color
        ..style = PaintingStyle.stroke
        ..strokeWidth = ringWidth,
    );
  }

  @override
  bool shouldRepaint(covariant HoronRadioRingPainter oldDelegate) =>
      oldDelegate.color != color ||
      oldDelegate.diameter != diameter ||
      oldDelegate.ringWidth != ringWidth ||
      oldDelegate.haloColor != haloColor;
}

/// 라디오의 가운데 점을 그립니다.
///
/// 지름 [diameter]의 채운 원 하나만 그립니다. 링과 별개의 도형이므로 선택
/// 상태에서도 링의 테두리와 이 점 사이에 틈이 남습니다.
class HoronRadioDotPainter extends CustomPainter {
  /// 점을 그리는 페인터를 만듭니다.
  const HoronRadioDotPainter({required this.color, required this.diameter});

  /// 점의 색입니다.
  final Color color;

  /// 점의 지름입니다.
  final double diameter;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawCircle(size.center(Offset.zero), diameter / 2, Paint()..color = color);
  }

  @override
  bool shouldRepaint(covariant HoronRadioDotPainter oldDelegate) =>
      oldDelegate.color != color || oldDelegate.diameter != diameter;
}

/// 그룹의 값·오류·활성 상태를 항목에 내려보내는 스코프입니다.
class _HoronRadioGroupScope<T> extends InheritedWidget {
  const _HoronRadioGroupScope({
    required this.value,
    required this.invalid,
    required this.enabled,
    required this.onSelected,
    required super.child,
  });

  final T? value;
  final bool invalid;
  final bool enabled;
  final ValueChanged<T>? onSelected;

  static _HoronRadioGroupScope<T>? maybeOf<T>(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronRadioGroupScope<T>>();

  @override
  bool updateShouldNotify(_HoronRadioGroupScope<T> oldWidget) =>
      oldWidget.value != value || oldWidget.invalid != invalid || oldWidget.enabled != enabled;
}

/// React `size-[18px]`입니다. 4px 눈금에 없는 값이라 상수로 둡니다.
const double _ringDiameter = 18;

/// React `border-2`입니다.
const double _ringWidth = 2;

/// React `size-2.5`입니다. 4px 눈금에 없는 값이라 상수로 둡니다.
const double _dotDiameter = 10;

/// React `focus-visible:ring-3`의 링 두께입니다.
const double _focusRingWidth = 3;

/// React `ring-ring/50`의 투명도입니다.
const double _focusRingAlpha = 0.5;

/// React `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;
