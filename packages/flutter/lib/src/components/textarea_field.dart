import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';

/// React `TextareaField`(Figma 60:466)를 옮긴 라벨 붙은 여러 줄 필드입니다.
///
/// 라벨 줄(오른쪽에 힌트), 120px 유리 상자, 아래 도움말·오류와 글자 수 푸터로
/// 이루어집니다. [error]가 있으면 상자 테두리와 푸터가 `text-danger`로 바뀌고
/// 도움말 자리에 오류 문구가 들어갑니다.
class HoronTextareaField extends StatefulWidget {
  /// 라벨 붙은 여러 줄 필드를 만듭니다.
  const HoronTextareaField({
    super.key,
    required this.label,
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
    final TextStyle textStyle = horon.text.bodyMd.copyWith(
      color: widget.disabled ? colors.textDisabled : colors.textPrimary,
    );

    final Widget footerMessage = invalid
        ? Text(widget.error!, style: horon.text.caption.copyWith(color: colors.textDanger))
        : Text(widget.description ?? '', style: horon.text.caption.copyWith(color: colors.textSecondary));

    final bool showFooter = invalid || widget.description != null || widget.maxLength != null;

    final Widget content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      spacing: horon.space.s2,
      children: <Widget>[
        SizedBox(
          width: double.infinity,
          child: Row(
            spacing: horon.space.s2,
            children: <Widget>[
              Expanded(
                child: Text(
                  widget.label,
                  style: horon.text.labelMd.copyWith(color: colors.textPrimary),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (widget.hint != null)
                Text(widget.hint!, style: horon.text.caption.copyWith(color: colors.textSecondary)),
            ],
          ),
        ),
        SizedBox(
          height: _boxHeight,
          child: HoronFieldBox(
            invalid: invalid,
            enabled: !widget.disabled,
            padding: EdgeInsets.symmetric(horizontal: horon.space.s3_5, vertical: horon.space.s3),
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
                    '$_count / ${widget.maxLength}',
                    style: horon.text.caption.copyWith(color: invalid ? colors.textDanger : colors.textSecondary),
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

/// `h-30` — 상자 높이입니다.
const double _boxHeight = 120;

/// `w-90` — React가 데스크톱에서 잡는 360px입니다. 좁은 화면에서는 부모 폭을 따릅니다.
const double _maxWidth = 360;
