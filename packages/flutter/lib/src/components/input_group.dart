import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'input.dart';

/// React `InputGroup`(Figma 60:429)를 옮긴 나눠진 입력 필드입니다.
///
/// 유리 상자 하나를 [prefix]·입력·[suffix] 세 칸으로 나눕니다. 칸 사이의 1px
/// 구분선은 hover에서 `border-strong`, 오류에서 `border-danger`가 됩니다. React의
/// `group-hover`·`group-data-invalid`를 Flutter에서는 이 위젯이 직접 들고 있는
/// hover·invalid 상태로 옮겼습니다.
class HoronInputGroup extends StatefulWidget {
  /// 나눠진 입력 필드를 만듭니다.
  const HoronInputGroup({
    super.key,
    this.prefix,
    this.suffix,
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
    if (_hovered) return colors.borderStrong;
    return colors.borderDefault;
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronColors colors = horon.colors;
    final Color divider = _dividerColor(colors);
    final TextStyle style = horon.text.bodyMd.copyWith(
      color: widget.disabled ? colors.textDisabled : colors.textPrimary,
    );

    return Semantics(
      label: widget.semanticLabel,
      child: MouseRegion(
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: SizedBox(
          height: _height,
          child: HoronFieldBox(
            invalid: widget.invalid,
            enabled: !widget.disabled,
            padding: EdgeInsets.zero,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                if (widget.prefix != null) ...<Widget>[
                  HoronInputGroupSegment(disabled: widget.disabled, child: widget.prefix!),
                  _Divider(color: divider),
                ],
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.symmetric(horizontal: horon.space.s3),
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
                if (widget.suffix != null) ...<Widget>[
                  _Divider(color: divider),
                  HoronInputGroupSegment(disabled: widget.disabled, child: widget.suffix!),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// React `InputGroupSegment`를 옮긴 칸입니다.
///
/// `bg-overlay-ink-4` 바탕에 `label-md` 글자, 14px 아이콘을 담습니다.
class HoronInputGroupSegment extends StatelessWidget {
  /// 칸을 만듭니다.
  const HoronInputGroupSegment({super.key, required this.child, this.disabled = false});

  /// 칸 안에 넣을 내용입니다.
  final Widget child;

  /// 비활성 상태입니다. 글자가 `text-disabled`가 됩니다.
  final bool disabled;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronColors colors = horon.colors;
    return ColoredBox(
      color: colors.overlayInk4,
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: horon.space.s3),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          spacing: horon.space.s1,
          children: <Widget>[
            IconTheme.merge(
              data: IconThemeData(size: _iconSize, color: colors.textSecondary),
              child: DefaultTextStyle.merge(
                style: horon.text.labelMd.copyWith(color: disabled ? colors.textDisabled : colors.textPrimary),
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

/// `h-10` — 그룹 높이입니다.
const double _height = 40;

/// `size-3.5` — 칸 아이콘입니다.
const double _iconSize = 14;

/// `w-px` — 구분선 두께입니다.
const double _dividerWidth = 1;
