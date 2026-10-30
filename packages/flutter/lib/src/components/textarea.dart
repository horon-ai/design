import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';

/// React `Textarea`(Figma 58:137)를 옮긴 여러 줄 입력입니다.
///
/// 유리 상자 안에 14/12px 여백으로 글을 넣습니다. 상자는 `min-h-28`(112)에서
/// 시작해 입력이 늘면 함께 자라고, 오류 상태면 테두리가 `border-danger`가 됩니다.
class HoronTextarea extends StatefulWidget {
  /// 여러 줄 입력을 만듭니다.
  const HoronTextarea({
    super.key,
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
    final TextStyle style = horon.text.bodyMd.copyWith(
      color: widget.enabled ? colors.textPrimary : colors.textDisabled,
    );

    return Semantics(
      label: widget.semanticLabel,
      textField: true,
      child: HoronFieldBox(
        invalid: widget.invalid,
        enabled: widget.enabled,
        minHeight: _minHeight,
        padding: EdgeInsets.symmetric(horizontal: horon.space.s3_5, vertical: horon.space.s3),
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

/// `min-h-28` — 여러 줄 상자의 최소 높이입니다.
const double _minHeight = 112;
