import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `checkbox.tsx`의 체크박스입니다.
///
/// React의 `size-[18px]`·`rounded-[5px]`·`border border-input`·
/// `data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground`를
/// 그대로 옮깁니다. 18px 상자의 테두리·채움은 [Container]가 그리고, 체크 표시와
/// 불확정 대시는 [HoronCheckMarkPainter]가 직접 그립니다. 글자 글리프도 Material
/// 아이콘도 쓰지 않는 이유는 이 패키지가 아이콘 폰트를 번들하지 않기 때문입니다.
/// `Icon`을 쓰면 호스트가 폰트를 등록하지 않은 화면에서 빈 네모가 그려집니다.
///
/// [value]가 `null`이면 불확정 상태입니다. React는 `checked`에 `'indeterminate'`를
/// 넘기지만, Flutter의 체크박스 관례와 맞추려고 `bool?`의 `null`로 같은 상태를
/// 표현합니다. 불확정은 선택과 같은 채움에 가운데 대시를 그립니다. React의 클래스는
/// `data-checked`만 보고 칠하기 때문에 불확정이 미선택처럼 보이는데, 여기서는 대시가
/// 읽히도록 선택과 같은 채움을 씁니다.
///
/// 상태별 모양은 React 클래스와 같습니다.
/// - 선택: 테두리·채움 `primary`, 표시 `primary-foreground`
/// - 미선택: 테두리 `input`, 채움 없음
/// - 오류([invalid], React `aria-invalid`): 미선택이면 테두리 `destructive`,
///   선택이면 `primary`가 이깁니다(React `aria-invalid:aria-checked:border-primary`)
/// - 비활성: 불투명도 50%(React `disabled:opacity-50`)
/// - 포커스: 테두리 `ring`과 바깥 링(React `focus-visible:ring-3 ring-ring/50`)
///
/// `border`와 `input`은 생성 토큰에서 같은 값이라 [ColorScheme.outline]이 그 자리를
/// 맡습니다. 그래서 이 위젯은 밝기별 색을 직접 고르지 않고 테마에서만 읽습니다.
class HoronCheckbox extends StatefulWidget {
  /// 체크박스를 만듭니다.
  const HoronCheckbox({
    super.key,
    required this.value,
    this.onChanged,
    this.invalid = false,
    this.enabled = true,
    this.autofocus = false,
    this.focusNode,
    this.label,
    this.semanticsLabel,
  });

  /// 현재 값입니다. `null`이면 불확정 상태입니다.
  final bool? value;

  /// 값이 바뀔 때 부릅니다. `null`이면 눌러도 값이 바뀌지 않습니다.
  ///
  /// 넘기는 값은 다음 상태의 `bool`입니다. 불확정이나 미선택에서 누르면 선택으로,
  /// 선택에서 누르면 해제로 갑니다. Base UI의 체크박스와 같은 규칙입니다.
  final ValueChanged<bool>? onChanged;

  /// 오류 상태입니다. React의 `aria-invalid`에 대응합니다.
  final bool invalid;

  /// 누름과 포커스를 받을지 여부입니다.
  final bool enabled;

  /// 화면이 열릴 때 포커스를 받을지 여부입니다.
  final bool autofocus;

  /// 포커스를 관리하는 노드입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final FocusNode? focusNode;

  /// 상자 오른쪽에 붙는 문구입니다. 호스트가 넘깁니다.
  ///
  /// 이 패키지는 화면 문구를 창작하지 않습니다. 보이는 이름은 언제나 호출자가
  /// 정하고, 선택 상태는 [Semantics]의 checked·mixed 플래그로 알려서 플랫폼의
  /// 음성 안내가 그대로 쓰이게 합니다.
  final String? label;

  /// 보조 기술이 읽을 이름입니다. 없으면 [label]을 씁니다.
  final String? semanticsLabel;

  /// React `size-[18px]`입니다.
  static const double size = HoronCheckboxMetrics.size;

  /// React `rounded-[5px]`입니다.
  static const double radius = HoronCheckboxMetrics.radius;

  /// React `[&>svg]:size-3.5`입니다. 표시가 차지하는 정사각형입니다.
  static const double markSize = HoronSpace.s3_5;

  /// 테스트가 상자를 찾는 키입니다.
  static const Key boxKey = ValueKey<String>('horon-checkbox-box');

  /// 테스트가 체크 표시를 찾는 키입니다.
  static const Key markKey = ValueKey<String>('horon-checkbox-mark');

  @override
  State<HoronCheckbox> createState() => _HoronCheckboxState();
}

class _HoronCheckboxState extends State<HoronCheckbox> {
  FocusNode? _ownedFocusNode;
  bool _focused = false;

  FocusNode get _focusNode => widget.focusNode ?? (_ownedFocusNode ??= FocusNode(debugLabel: 'HoronCheckbox'));

  bool get _disabled => !widget.enabled || widget.onChanged == null;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void didUpdateWidget(covariant HoronCheckbox oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.focusNode != widget.focusNode) {
      (oldWidget.focusNode ?? _ownedFocusNode)?.removeListener(_handleFocusChange);
      _focusNode.addListener(_handleFocusChange);
      _focused = _focusNode.hasFocus;
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _ownedFocusNode?.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (_focused == _focusNode.hasFocus) return;
    setState(() => _focused = _focusNode.hasFocus);
  }

  void _toggle() {
    if (_disabled) return;
    widget.onChanged?.call(widget.value != true);
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final LogicalKeyboardKey key = event.logicalKey;
    if (key != LogicalKeyboardKey.space && key != LogicalKeyboardKey.enter) return KeyEventResult.ignored;
    _toggle();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);

    final bool filled = widget.value != false;
    final bool indeterminate = widget.value == null;
    final bool focused = _focused && !_disabled;

    final Color border = focused
        ? horon.ring
        : (filled ? scheme.primary : (widget.invalid ? scheme.error : scheme.outline));

    final Widget box = Container(
      key: HoronCheckbox.boxKey,
      width: HoronCheckbox.size,
      height: HoronCheckbox.size,
      decoration: BoxDecoration(
        color: filled ? scheme.primary : Colors.transparent,
        borderRadius: BorderRadius.circular(HoronCheckbox.radius),
        border: Border.all(color: border),
        boxShadow: focused
            ? <BoxShadow>[
                BoxShadow(
                  color: horon.ring.withValues(alpha: _focusRingAlpha),
                  spreadRadius: _focusRingSpread,
                ),
              ]
            : null,
      ),
      child: filled
          ? Center(
              child: SizedBox.square(
                dimension: HoronCheckbox.markSize,
                child: CustomPaint(
                  key: HoronCheckbox.markKey,
                  painter: HoronCheckMarkPainter(
                    color: scheme.onPrimary,
                    indeterminate: indeterminate,
                    strokeWidth: HoronSpace.s0_5,
                  ),
                ),
              ),
            )
          : null,
    );

    final String? label = widget.label;
    final Widget body = Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        box,
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
      checked: widget.value,
      mixed: indeterminate,
      enabled: !_disabled,
      label: widget.semanticsLabel ?? label,
      onTap: _disabled ? null : _toggle,
      child: Opacity(
        opacity: _disabled ? _disabledOpacity : 1,
        child: Focus(
          focusNode: _focusNode,
          autofocus: widget.autofocus,
          onKeyEvent: _handleKey,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _disabled ? null : _toggle,
            child: MouseRegion(cursor: _disabled ? SystemMouseCursors.basic : SystemMouseCursors.click, child: body),
          ),
        ),
      ),
    );
  }
}

/// 체크 표시와 불확정 대시를 그립니다.
///
/// 좌표는 React가 렌더하는 lucide 아이콘을 24 단위 상자에서 0~1 비율로 옮긴
/// 값입니다. `Check`는 `M20 6 9 17l-5-5`이고, 이 페인터는 그 선분을
/// (0.167, 0.5) → (0.375, 0.708) → (0.833, 0.25)로 그립니다. `Minus`는
/// `M5 12h14`이고, 이 페인터는 0.208~0.792를 가로지르는 대시로 그립니다. 상자
/// 크기가 바뀌어도 같은 비율을 유지하므로 [HoronCheckbox.markSize]를 바꿔도
/// 모양이 무너지지 않습니다.
class HoronCheckMarkPainter extends CustomPainter {
  /// 표시를 그리는 페인터를 만듭니다.
  const HoronCheckMarkPainter({required this.color, required this.indeterminate, required this.strokeWidth});

  /// 선 색입니다.
  final Color color;

  /// 참이면 가운데 대시를, 거짓이면 체크 표시를 그립니다.
  final bool indeterminate;

  /// 선 두께입니다.
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    if (indeterminate) {
      final double y = size.height / 2;
      canvas.drawLine(Offset(size.width * _dashStart, y), Offset(size.width * _dashEnd, y), paint);
      return;
    }

    final Path path = Path()
      ..moveTo(size.width * _checkStartX, size.height * _checkStartY)
      ..lineTo(size.width * _checkMidX, size.height * _checkMidY)
      ..lineTo(size.width * _checkEndX, size.height * _checkEndY);
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant HoronCheckMarkPainter oldDelegate) =>
      oldDelegate.color != color ||
      oldDelegate.indeterminate != indeterminate ||
      oldDelegate.strokeWidth != strokeWidth;
}

/// React `ring-ring/50`의 투명도입니다.
const double _focusRingAlpha = 0.5;

/// 바깥 링이 번지는 거리입니다. React `ring-3`을 4px 눈금의 2px 단계로 옮겼습니다.
const double _focusRingSpread = HoronSpace.s0_5;

/// React `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;

/// lucide `Check`의 시작점 x입니다. 24 단위 중 4입니다.
const double _checkStartX = 0.167;

/// lucide `Check`의 시작점 y입니다. 24 단위 중 12입니다.
const double _checkStartY = 0.5;

/// lucide `Check`의 꺾이는 점 x입니다. 24 단위 중 9입니다.
const double _checkMidX = 0.375;

/// lucide `Check`의 꺾이는 점 y입니다. 24 단위 중 17입니다.
const double _checkMidY = 0.708;

/// lucide `Check`의 끝점 x입니다. 24 단위 중 20입니다.
const double _checkEndX = 0.833;

/// lucide `Check`의 끝점 y입니다. 24 단위 중 6입니다.
const double _checkEndY = 0.25;

/// lucide `Minus`의 시작점 비율입니다. 24 단위 중 5입니다.
const double _dashStart = 0.208;

/// lucide `Minus`의 끝점 비율입니다. 24 단위 중 19입니다.
const double _dashEnd = 0.792;
