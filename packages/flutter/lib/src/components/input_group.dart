import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';

/// `input-group.tsx`의 `InputGroupSize`입니다.
enum HoronInputGroupSize {
  /// `size="sm"` — 높이 32, 입력 여백 12.
  sm,

  /// `size="md"` — 높이 40, 입력 여백 14. 기본값입니다.
  md,

  /// `size="lg"` — 높이 48, 입력 여백 20.
  lg,
}

/// 그룹의 크기와 비활성 상태를 칸(Select·Combobox·고정 글자)에 내려 줍니다.
///
/// React `InputGroupContext`의 Flutter 대응입니다. 그룹 밖에서는 null입니다.
class HoronInputGroupScope extends InheritedWidget {
  /// 값을 그대로 받는 생성자입니다.
  const HoronInputGroupScope({super.key, required this.size, required this.disabled, required super.child});

  /// 그룹 크기입니다.
  final HoronInputGroupSize size;

  /// 그룹의 비활성 상태입니다.
  final bool disabled;

  /// 가장 가까운 그룹 범위입니다. 없으면 null입니다.
  static HoronInputGroupScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<HoronInputGroupScope>();

  @override
  bool updateShouldNotify(HoronInputGroupScope oldWidget) => size != oldWidget.size || disabled != oldWidget.disabled;
}

/// 칸 하나의 값입니다. React `inputGroupSegmentClass`.
typedef HoronSegmentMetrics = ({double paddingX, double gap, double icon, TextStyle textStyle});

/// [size]의 칸 값을 계산합니다.
HoronSegmentMetrics horonSegmentMetrics(HoronInputGroupSize size, HoronThemeData theme) => switch (size) {
  HoronInputGroupSize.sm => (paddingX: theme.space.s3, gap: theme.space.s1, icon: 16, textStyle: theme.text.bodySm),
  HoronInputGroupSize.md => (paddingX: theme.space.s3, gap: theme.space.s1, icon: 16, textStyle: theme.text.bodyMd),
  HoronInputGroupSize.lg => (paddingX: theme.space.s4, gap: theme.space.s1_5, icon: 20, textStyle: theme.text.bodyLg),
};

/// React `InputGroup`(Figma 60:429)를 옮긴 나눠진 입력 필드입니다.
///
/// 상자 하나를 [prefix]·입력·[suffix] 세 칸으로 나눕니다. 칸 사이의 1px 구분선은
/// hover에서 `border-strong`, 오류에서 `border-danger`가 됩니다. React의
/// `group-hover`·`group-data-invalid`를 Flutter에서는 이 위젯이 직접 들고 있는
/// hover·invalid 상태로 옮겼습니다.
///
/// 표면은 [surface]로 고릅니다. 기본값은 React와 같은 불투명 [HoronInputSurface.solid]이고,
/// 이미지나 유리 패널 위에서는 [HoronInputSurface.glass]를 넘깁니다.
class HoronInputGroup extends StatefulWidget {
  /// 나눠진 입력 필드를 만듭니다.
  const HoronInputGroup({
    super.key,
    this.prefix,
    this.suffix,
    this.surface = HoronInputSurface.solid,
    this.size = HoronInputGroupSize.md,
    this.invalid = false,
    this.disabled = false,
    this.controller,
    this.focusNode,
    this.hintText,
    this.keyboardType,
    this.onChanged,
    this.semanticLabel,
  });

  /// 입력 앞의 칸입니다. 국가 코드 셀렉트처럼 씁니다.
  final Widget? prefix;

  /// 입력 뒤의 칸입니다. 통화 셀렉트처럼 씁니다.
  final Widget? suffix;

  /// 표면입니다. 기본값 `solid`는 불투명 `bg-surface`, `glass`는 React `.veil-field` 표면입니다.
  final HoronInputSurface surface;

  /// 크기입니다. 칸에도 이 값이 내려갑니다. 기본값은 [HoronInputGroupSize.md]입니다.
  final HoronInputGroupSize size;

  /// 오류 상태입니다. 구분선과 테두리가 `border-danger`가 됩니다.
  final bool invalid;

  /// 비활성 상태입니다. 입력과 칸의 글자가 흐려집니다.
  final bool disabled;

  /// 입력값 컨트롤러입니다.
  final TextEditingController? controller;

  /// 초점 노드입니다.
  final FocusNode? focusNode;

  /// 값이 없을 때 보이는 안내 문구입니다.
  final String? hintText;

  /// 키보드 종류입니다.
  final TextInputType? keyboardType;

  /// 값이 바뀔 때 호출됩니다.
  final ValueChanged<String>? onChanged;

  /// 접근성 이름입니다. React `aria-label`에 대응합니다.
  final String? semanticLabel;

  @override
  State<HoronInputGroup> createState() => _HoronInputGroupState();
}

class _HoronInputGroupState extends State<HoronInputGroup> {
  late final TextEditingController _fallback = TextEditingController();
  bool _hovered = false;

  TextEditingController get _controller => widget.controller ?? _fallback;

  @override
  void dispose() {
    _fallback.dispose();
    super.dispose();
  }

  Color _dividerColor(HoronColors colors) {
    if (widget.invalid) return colors.borderDanger;
    // React `group-data-disabled:bg-border-default/60` — 비활성이면 기본 테두리를
    // 60% 불투명도로 낮춥니다. hover는 비활성에서 오지 않습니다.
    if (widget.disabled) return colors.borderDefault.withValues(alpha: 0.6);
    if (_hovered) return colors.borderStrong;
    return colors.borderDefault;
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronColors colors = horon.colors;
    final Color divider = _dividerColor(colors);
    // `inputPaddingClass` — 입력 자체의 좌우 여백은 독립 Input과 같은 12/14/20입니다.
    final double inputPadding = switch (widget.size) {
      HoronInputGroupSize.sm => horon.space.s3,
      HoronInputGroupSize.md => horon.space.s3_5,
      HoronInputGroupSize.lg => horon.space.s5,
    };
    final double height = switch (widget.size) {
      HoronInputGroupSize.sm => horon.space.step(8),
      HoronInputGroupSize.md => horon.space.step(10),
      HoronInputGroupSize.lg => horon.space.step(12),
    };
    final TextStyle style = horon.text.bodyMd.copyWith(
      color: widget.disabled ? colors.textDisabled : colors.textPrimary,
    );

    return Semantics(
      label: widget.semanticLabel,
      child: MouseRegion(
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: SizedBox(
          height: height,
          child: HoronFieldBox(
            surface: widget.surface,
            invalid: widget.invalid,
            enabled: !widget.disabled,
            padding: EdgeInsets.zero,
            child: HoronInputGroupScope(
              size: widget.size,
              disabled: widget.disabled,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  if (widget.prefix != null) ...<Widget>[widget.prefix!, _Divider(color: divider)],
                  Expanded(
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: inputPadding),
                      child: Center(
                        child: TextField(
                          controller: _controller,
                          focusNode: widget.focusNode,
                          enabled: !widget.disabled,
                          keyboardType: widget.keyboardType,
                          onChanged: widget.onChanged,
                          style: style,
                          cursorColor: colors.textPrimary,
                          decoration: InputDecoration.collapsed(
                            hintText: widget.hintText,
                            hintStyle: style.copyWith(color: colors.textPlaceholder),
                          ),
                        ),
                      ),
                    ),
                  ),
                  if (widget.suffix != null) ...<Widget>[_Divider(color: divider), widget.suffix!],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// React `InputGroupSegment`를 옮긴 칸입니다.
///
/// `bg-overlay-ink-4` 바탕에 `body-sm`/`body-md`/`body-lg` 글자, 16/16/20px 아이콘을 담습니다.
class HoronInputGroupSegment extends StatelessWidget {
  /// 칸을 만듭니다.
  const HoronInputGroupSegment({super.key, required this.child, this.disabled});

  /// 칸 안에 넣을 내용입니다.
  final Widget child;

  /// 비활성 상태입니다. 없으면 그룹 값을 씁니다.
  final bool? disabled;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronColors colors = horon.colors;
    final HoronInputGroupScope? group = HoronInputGroupScope.maybeOf(context);
    final bool off = disabled ?? group?.disabled ?? false;
    final HoronSegmentMetrics metrics = horonSegmentMetrics(group?.size ?? HoronInputGroupSize.md, horon);
    return ColoredBox(
      color: colors.overlayInk4,
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: metrics.gap,
          children: <Widget>[
            IconTheme.merge(
              data: IconThemeData(size: metrics.icon, color: colors.textSecondary),
              child: DefaultTextStyle.merge(
                style: metrics.textStyle.copyWith(color: off ? colors.textDisabled : colors.textPrimary),
                child: child,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 칸 사이의 1px 구분선입니다(`w-px`).
class _Divider extends StatelessWidget {
  const _Divider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: _dividerWidth,
      child: ColoredBox(color: color),
    );
  }
}

/// `w-px` — 구분선 두께입니다.
const double _dividerWidth = 1;
