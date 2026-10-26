import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'field.dart';

/// `textarea.tsx`의 여러 줄 입력입니다.
///
/// React의 클래스를 그대로 옮깁니다. 최소 높이 88(`min-h-[88px]`), 반경은 입력
/// 역할 8(`rounded-sm`), 안쪽 여백 12(`p-3`), 글자 크기 14(`text-sm`), 채움은 카드
/// 색(`bg-card`), 테두리는 입력 토큰(`border-input`), 포커스는 금색 링, 오류는
/// destructive 테두리와 옅은 링, 비활성은 입력 토큰 50% 채움과 50% 불투명도입니다.
///
/// React는 `field-sizing-content`로 내용만큼 늘어납니다. Flutter에는 그 CSS 속성이
/// 없으므로 [minLines]와 [maxLines]로 같은 동작을 냅니다. 최소 높이는 생성된
/// [HoronTextareaMetrics.minHeight]를 제약으로 걸어, 줄 수와 무관하게 88보다 작아지지
/// 않게 합니다. [maxLines]가 null이면 내용만큼 자랍니다.
///
/// `TextField`를 그대로 노출하지 않습니다. 포커스·오류·비활성 모양을 이 위젯이
/// 소유해야 테마가 바뀌어도 화면마다 다른 테두리가 생기지 않습니다.
class HoronTextarea extends StatefulWidget {
  /// 여러 줄 입력을 만듭니다.
  const HoronTextarea({
    super.key,
    this.controller,
    this.focusNode,
    this.hintText,
    this.invalid,
    this.disabled,
    this.readOnly = false,
    this.autofocus = false,
    this.keyboardType,
    this.textInputAction,
    this.inputFormatters,
    this.minLines = 3,
    this.maxLines,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.semanticsLabel,
  });

  /// 텍스트를 읽고 쓰는 컨트롤러입니다.
  final TextEditingController? controller;

  /// 포커스를 관리하는 노드입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final FocusNode? focusNode;

  /// 값이 비었을 때 보이는 안내 문구입니다.
  final String? hintText;

  /// 오류 상태입니다. React의 `aria-invalid`에 대응합니다. null이면 스코프를 따릅니다.
  final bool? invalid;

  /// 입력을 받지 않을 상태입니다. React의 `disabled`에 대응합니다. null이면 스코프를
  /// 따릅니다.
  final bool? disabled;

  /// 값을 읽기만 할지 여부입니다.
  final bool readOnly;

  /// 화면이 열릴 때 포커스를 받을지 여부입니다.
  final bool autofocus;

  /// 키보드 종류입니다. 기본은 여러 줄입니다.
  final TextInputType? keyboardType;

  /// 키보드의 완료 키 동작입니다.
  final TextInputAction? textInputAction;

  /// 입력 형식 제한입니다.
  final List<TextInputFormatter>? inputFormatters;

  /// 최소 줄 수입니다. 최소 높이 88과 함께 걸립니다.
  final int minLines;

  /// 최대 줄 수입니다. null이면 내용만큼 자랍니다.
  final int? maxLines;

  /// 값이 바뀔 때 부릅니다.
  final ValueChanged<String>? onChanged;

  /// 키보드의 완료 키를 눌렀을 때 부릅니다.
  final ValueChanged<String>? onSubmitted;

  /// 필드를 눌렀을 때 부릅니다.
  final VoidCallback? onTap;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticsLabel;

  @override
  State<HoronTextarea> createState() => _HoronTextareaState();
}

class _HoronTextareaState extends State<HoronTextarea> {
  FocusNode? _ownedFocusNode;
  bool _focused = false;

  FocusNode get _focusNode => widget.focusNode ?? (_ownedFocusNode ??= FocusNode());

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void didUpdateWidget(covariant HoronTextarea oldWidget) {
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

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final HoronFieldScope? scope = HoronFieldScope.maybeOf(context);
    final bool invalid = widget.invalid ?? (scope?.invalid ?? false);
    final bool disabled = widget.disabled ?? (scope?.disabled ?? false);
    final bool isDark = theme.brightness == Brightness.dark;

    final Color borderColor = invalid
        ? (isDark ? scheme.error.withValues(alpha: _invalidBorderAlphaDark) : scheme.error)
        : (_focused ? horon.ring : scheme.outline);
    // React `disabled:bg-input/50`(다크는 `/80`)입니다. `/50`은 `--input`(12% 검정)의
    // 알파를 절반으로 줄인다는 뜻이므로, 기존 알파에 배수를 곱합니다.
    final Color fill = disabled
        ? Color.alphaBlend(
            scheme.outline.withValues(alpha: scheme.outline.a * (isDark ? _disabledFillAlphaDark : _disabledFillAlpha)),
            scheme.surfaceContainerLow,
          )
        : scheme.surfaceContainerLow;
    final Color? ring = invalid
        ? scheme.error.withValues(alpha: isDark ? _invalidRingAlphaDark : _invalidRingAlphaLight)
        : (_focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null);

    final TextStyle textStyle = (theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      color: scheme.onSurface,
      fontSize: HoronText.body,
      height: HoronLineHeight.normal,
    );

    return Semantics(
      label: widget.semanticsLabel,
      child: Opacity(
        opacity: disabled ? _disabledOpacity : 1,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: HoronTextareaMetrics.minHeight),
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: fill,
              borderRadius: BorderRadius.circular(HoronRadiusRole.input),
              border: Border.all(color: borderColor),
              boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _ringWidth)],
            ),
            child: TextField(
              controller: widget.controller,
              focusNode: _focusNode,
              readOnly: widget.readOnly,
              enabled: !disabled,
              autofocus: widget.autofocus,
              keyboardType: widget.keyboardType ?? TextInputType.multiline,
              textInputAction: widget.textInputAction,
              inputFormatters: widget.inputFormatters,
              minLines: widget.minLines,
              maxLines: widget.maxLines,
              onChanged: widget.onChanged,
              onSubmitted: widget.onSubmitted,
              onTap: widget.onTap,
              cursorColor: horon.ring,
              style: textStyle,
              decoration: InputDecoration(
                filled: false,
                isDense: true,
                hintText: widget.hintText,
                hintStyle: textStyle.copyWith(color: scheme.onSurfaceVariant),
                contentPadding: const EdgeInsets.all(HoronSpace.s3),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                disabledBorder: InputBorder.none,
                errorBorder: InputBorder.none,
                focusedErrorBorder: InputBorder.none,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// React `focus-visible:ring-3`의 링 두께입니다.
const double _ringWidth = 3;

/// React `ring-ring/50`입니다.
const double _focusRingAlpha = 0.5;

/// React `aria-invalid:ring-destructive/20`입니다.
const double _invalidRingAlphaLight = 0.2;

/// React `dark:aria-invalid:ring-destructive/40`입니다.
const double _invalidRingAlphaDark = 0.4;

/// React `dark:aria-invalid:border-destructive/50`입니다.
const double _invalidBorderAlphaDark = 0.5;

/// React `disabled:bg-input/50`입니다.
const double _disabledFillAlpha = 0.5;

/// React `dark:disabled:bg-input/80`입니다.
const double _disabledFillAlphaDark = 0.8;

/// React `disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;
