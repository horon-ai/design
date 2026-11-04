import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';

/// `textarea.tsx`의 `TextareaSize`입니다.
enum HoronTextareaSize {
  /// `size="sm"` — 최소 높이 88, 여백 12/8, `body-sm`.
  sm,

  /// `size="md"` — 최소 높이 112, 여백 14/12, `body-md`. 기본값입니다.
  md,

  /// `size="lg"` — 최소 높이 136, 여백 16/14, `body-lg`.
  lg,
}

typedef _TextareaMetrics = ({double minHeight, double paddingX, double paddingY, TextStyle textStyle});

_TextareaMetrics _metricsOf(HoronTextareaSize size, HoronThemeData theme) => switch (size) {
  HoronTextareaSize.sm => (
    minHeight: theme.space.step(22),
    paddingX: theme.space.s3,
    paddingY: theme.space.s2,
    textStyle: theme.text.bodySm,
  ),
  HoronTextareaSize.md => (
    minHeight: theme.space.step(28),
    paddingX: theme.space.s3_5,
    paddingY: theme.space.s3,
    textStyle: theme.text.bodyMd,
  ),
  HoronTextareaSize.lg => (
    minHeight: theme.space.step(34),
    paddingX: theme.space.s4,
    paddingY: theme.space.s3_5,
    textStyle: theme.text.bodyLg,
  ),
};

/// React `Textarea`(Figma 58:137)를 옮긴 여러 줄 입력입니다.
///
/// 상자 안에 14/12px 여백으로 글을 넣습니다. 상자는 `min-h-28`(112)에서
/// 시작해 입력이 늘면 함께 자라고, 오류 상태면 테두리가 `border-danger`가 됩니다.
///
/// 표면은 [surface]로 고릅니다. 기본값은 React와 같은 불투명 [HoronInputSurface.solid]이고,
/// 이미지나 유리 패널 위에서는 [HoronInputSurface.glass]를 넘깁니다.
class HoronTextarea extends StatefulWidget {
  /// 여러 줄 입력을 만듭니다.
  const HoronTextarea({
    super.key,
    this.surface = HoronInputSurface.solid,
    this.size = HoronTextareaSize.md,
    this.invalid = false,
    this.controller,
    this.focusNode,
    this.hintText,
    this.enabled = true,
    this.minLines = 3,
    this.maxLength,
    this.onChanged,
    this.semanticLabel,
  });

  /// 표면입니다. 기본값 `solid`는 불투명 `bg-surface`, `glass`는 유리입니다.
  final HoronInputSurface surface;

  /// 크기입니다. 기본값은 [HoronTextareaSize.md]입니다.
  final HoronTextareaSize size;

  /// 오류 상태입니다. 참이면 테두리가 `border-danger`가 됩니다.
  final bool invalid;

  /// 입력값 컨트롤러입니다.
  final TextEditingController? controller;

  /// 초점 노드입니다.
  final FocusNode? focusNode;

  /// 값이 없을 때 보이는 안내 문구입니다.
  final String? hintText;

  /// 입력 가능 여부입니다.
  final bool enabled;

  /// 최소 줄 수입니다. React `rows` 기본값 3에 대응합니다.
  final int minLines;

  /// 최대 글자 수입니다. React의 `maxLength`와 같습니다.
  final int? maxLength;

  /// 값이 바뀔 때 호출됩니다.
  final ValueChanged<String>? onChanged;

  /// 접근성 이름입니다. React `aria-label`에 대응합니다.
  final String? semanticLabel;

  @override
  State<HoronTextarea> createState() => _HoronTextareaState();
}

class _HoronTextareaState extends State<HoronTextarea> {
  late final TextEditingController _fallback = TextEditingController();

  TextEditingController get _controller => widget.controller ?? _fallback;

  @override
  void dispose() {
    _fallback.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronColors colors = horon.colors;
    final _TextareaMetrics metrics = _metricsOf(widget.size, horon);
    final TextStyle style = metrics.textStyle.copyWith(
      color: widget.enabled ? colors.textPrimary : colors.textDisabled,
    );

    return Semantics(
      label: widget.semanticLabel,
      textField: true,
      child: HoronFieldBox(
        surface: widget.surface,
        invalid: widget.invalid,
        enabled: widget.enabled,
        minHeight: metrics.minHeight,
        padding: EdgeInsets.symmetric(horizontal: metrics.paddingX, vertical: metrics.paddingY),
        child: TextField(
          controller: _controller,
          focusNode: widget.focusNode,
          enabled: widget.enabled,
          minLines: widget.minLines,
          maxLines: null,
          maxLength: widget.maxLength,
          onChanged: widget.onChanged,
          style: style,
          cursorColor: colors.textPrimary,
          decoration: InputDecoration.collapsed(
            hintText: widget.hintText,
            hintStyle: style.copyWith(color: colors.textPlaceholder),
          ),
        ),
      ),
    );
  }
}
