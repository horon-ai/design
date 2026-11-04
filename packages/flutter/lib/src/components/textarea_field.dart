import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';

/// `textarea-field.tsx`의 `TextareaFieldSize`입니다.
enum HoronTextareaFieldSize {
  /// `size="sm"` — 간격 6, `label-sm`, 상자 88px.
  sm,

  /// `size="md"` — 간격 8, `label-md`, 상자 112px. 기본값입니다.
  md,

  /// `size="lg"` — 간격 10, `label-lg`, 상자 136px.
  lg,
}

typedef _FieldMetrics = ({
  double gap,
  double boxHeight,
  double paddingX,
  double paddingY,
  TextStyle label,
  TextStyle meta,
  TextStyle textStyle,
});

_FieldMetrics _metricsOf(HoronTextareaFieldSize size, HoronThemeData theme) => switch (size) {
  HoronTextareaFieldSize.sm => (
    gap: theme.space.s1_5,
    boxHeight: theme.space.step(22),
    paddingX: theme.space.s3,
    paddingY: theme.space.s2,
    label: theme.text.labelSm,
    meta: theme.text.caption,
    textStyle: theme.text.bodySm,
  ),
  HoronTextareaFieldSize.md => (
    gap: theme.space.s2,
    boxHeight: theme.space.step(28),
    paddingX: theme.space.s3_5,
    paddingY: theme.space.s3,
    label: theme.text.labelMd,
    meta: theme.text.caption,
    textStyle: theme.text.bodyMd,
  ),
  HoronTextareaFieldSize.lg => (
    gap: theme.space.s2_5,
    boxHeight: theme.space.step(34),
    paddingX: theme.space.s5,
    paddingY: theme.space.s3_5,
    label: theme.text.labelLg,
    meta: theme.text.bodySm,
    textStyle: theme.text.bodyLg,
  ),
};

/// React `TextareaField`(Figma 60:466)를 옮긴 라벨 붙은 여러 줄 필드입니다.
///
/// 라벨 줄(오른쪽에 힌트), 112px 유리 상자, 아래 도움말·오류와 글자 수 푸터로
/// 이루어집니다. [error]가 있으면 상자 테두리와 푸터가 `text-danger`로 바뀌고
/// 도움말 자리에 오류 문구가 들어갑니다. 표면은 [surface]로 고르고, 기본값은 React와
/// 같은 불투명 `solid`입니다. 유리 패널 위에서는 `glass`를 넘기며, 이때
/// [HoronFieldBox]의 `.veil-field`가 그려지고 HoronLiquidGlass는 겹치지 않습니다.
class HoronTextareaField extends StatefulWidget {
  /// 라벨 붙은 여러 줄 필드를 만듭니다.
  const HoronTextareaField({
    super.key,
    required this.label,
    this.surface = HoronInputSurface.solid,
    this.size = HoronTextareaFieldSize.md,
    this.hint,
    this.description,
    this.error,
    this.maxLength,
    this.disabled = false,
    this.controller,
    this.focusNode,
    this.hintText,
    this.onChanged,
  });

  /// 라벨입니다. React `label`에 대응합니다.
  final String label;

  /// 표면입니다. 기본값 `solid`는 불투명 `bg-surface`, `glass`는 React `.veil-field` 표면입니다.
  final HoronInputSurface surface;

  /// 크기입니다. 기본값은 [HoronTextareaFieldSize.md]입니다.
  final HoronTextareaFieldSize size;

  /// 라벨 줄 오른쪽에 붙는 짧은 문구입니다. 예: `Optional`.
  final String? hint;

  /// 도움말입니다. [error]가 있으면 자리를 비켜 줍니다.
  final String? description;

  /// 오류 문구입니다. 값이 있으면 필드가 무효 상태가 됩니다.
  final String? error;

  /// 최대 글자 수입니다. 값이 있으면 `현재 / 최대` 카운터를 그립니다.
  final int? maxLength;

  /// 비활성 상태입니다. React `data-disabled:opacity-60`처럼 흐려집니다.
  final bool disabled;

  /// 입력값 컨트롤러입니다. 없으면 이 위젯이 하나 만들어 씁니다.
  final TextEditingController? controller;

  /// 초점 노드입니다.
  final FocusNode? focusNode;

  /// 값이 없을 때 상자 안에 보이는 안내 문구입니다.
  final String? hintText;

  /// 값이 바뀔 때 호출됩니다.
  final ValueChanged<String>? onChanged;

  @override
  State<HoronTextareaField> createState() => _HoronTextareaFieldState();
}

class _HoronTextareaFieldState extends State<HoronTextareaField> {
  TextEditingController? _owned;
  int _count = 0;

  TextEditingController get _controller => widget.controller ?? (_owned ??= TextEditingController());

  /// 카운터가 읽을 글자 수입니다.
  ///
  /// React는 `value !== undefined`이면(부모가 값을 소유하면) 입력 이벤트 없이 값이
  /// 바뀔 수 있으므로 매번 `String(value).length`를 다시 셉니다(폼 초기화, 부모가 값을
  /// 다시 쓴 경우). Flutter에서 값 소유는 [HoronTextareaField.controller]로 표현되므로,
  /// 컨트롤러가 있으면 그 텍스트를 그때그때 세고, 없으면 이 위젯이 들고 있는
  /// [_count]를 씁니다.
  int get _length => widget.controller == null ? _count : widget.controller!.text.characters.length;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_onTextChanged);
    _count = _controller.text.characters.length;
  }

  @override
  void didUpdateWidget(HoronTextareaField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _owned)?.removeListener(_onTextChanged);
      _controller.addListener(_onTextChanged);
      _count = _controller.text.characters.length;
    }
  }

  @override
  void dispose() {
    (widget.controller ?? _owned)?.removeListener(_onTextChanged);
    _owned?.dispose();
    super.dispose();
  }

  void _onTextChanged() {
    final int next = _controller.text.characters.length;
    if (next == _count) return;
    setState(() => _count = next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronColors colors = horon.colors;
    final bool invalid = widget.error != null;
    final _FieldMetrics metrics = _metricsOf(widget.size, horon);
    final TextStyle textStyle = metrics.textStyle.copyWith(
      color: widget.disabled ? colors.textDisabled : colors.textPrimary,
    );

    final Widget footerMessage = invalid
        ? Text(widget.error!, style: metrics.meta.copyWith(color: colors.textDanger))
        : Text(widget.description ?? '', style: metrics.meta.copyWith(color: colors.textSecondary));

    final bool showFooter = invalid || widget.description != null || widget.maxLength != null;

    final Widget content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: metrics.gap,
      children: <Widget>[
        SizedBox(
          width: double.infinity,
          child: Row(
            spacing: horon.space.s2,
            children: <Widget>[
              Expanded(
                child: Text(
                  widget.label,
                  style: metrics.label.copyWith(color: colors.textPrimary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (widget.hint != null) Text(widget.hint!, style: metrics.meta.copyWith(color: colors.textSecondary)),
            ],
          ),
        ),
        SizedBox(
          height: metrics.boxHeight,
          child: HoronFieldBox(
            surface: widget.surface,
            invalid: invalid,
            enabled: !widget.disabled,
            padding: EdgeInsets.symmetric(horizontal: metrics.paddingX, vertical: metrics.paddingY),
            child: TextField(
              controller: _controller,
              focusNode: widget.focusNode,
              enabled: !widget.disabled,
              expands: true,
              maxLines: null,
              onChanged: widget.onChanged,
              style: textStyle,
              cursorColor: colors.textPrimary,
              decoration: InputDecoration.collapsed(
                hintText: widget.hintText,
                hintStyle: textStyle.copyWith(color: colors.textPlaceholder),
              ),
            ),
          ),
        ),
        if (showFooter)
          SizedBox(
            width: double.infinity,
            child: Row(
              spacing: horon.space.s2,
              children: <Widget>[
                Expanded(child: footerMessage),
                if (widget.maxLength != null)
                  Text(
                    '$_length / ${widget.maxLength}',
                    style: metrics.meta.copyWith(color: invalid ? colors.textDanger : colors.textSecondary),
                  ),
              ],
            ),
          ),
      ],
    );

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: _maxWidth),
      child: widget.disabled ? Opacity(opacity: 0.6, child: content) : content,
    );
  }
}

/// `w-90` — React가 데스크톱에서 잡는 360px입니다. 좁은 화면에서는 부모 폭을 따릅니다.
const double _maxWidth = 360;
