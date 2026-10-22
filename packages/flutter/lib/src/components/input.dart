import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'field.dart';

/// `input.tsx`의 입력 필드입니다.
///
/// React의 클래스를 그대로 옮깁니다. 높이 37(`h-[37px]`), 반경은 입력 역할
/// 8(`rounded-sm`), 좌우 여백 12(`px-3`), 글자 크기 14(`text-sm`), 채움은 카드
/// 색(`bg-card`), 테두리는 입력 토큰(`border-input`), 포커스는 금색 링
/// (`focus-visible:ring-3 ring-ring/50`), 오류는 destructive 테두리와 옅은 링,
/// 비활성은 입력 토큰 50% 채움과 50% 불투명도입니다.
///
/// `TextField`를 그대로 노출하지 않습니다. 포커스·오류·비활성 모양을 이 위젯이
/// 소유해야 테마가 바뀌어도 화면마다 다른 테두리가 생기지 않습니다.
///
/// [invalid]와 [disabled]를 넘기지 않으면 둘러싼 [HoronFieldScope]의 상태를
/// 따릅니다. 그래서 `HoronFormControl` 안에서는 오류를 따로 넘기지 않아도 됩니다.
/// React 소스에 `variants:` 블록이 없으므로 공개 변형 enum을 두지 않습니다.
class HoronInput extends StatefulWidget {
  /// 입력 필드를 만듭니다.
  const HoronInput({
    super.key,
    this.controller,
    this.focusNode,
    this.initialValue,
    this.hintText,
    this.invalid,
    this.disabled,
    this.readOnly = false,
    this.obscureText = false,
    this.autofocus = false,
    this.keyboardType,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.inputFormatters,
    this.onChanged,
    this.onSubmitted,
    this.onTap,
    this.prefix,
    this.suffix,
    this.semanticsLabel,
  });

  /// 텍스트를 읽고 쓰는 컨트롤러입니다.
  final TextEditingController? controller;

  /// 포커스를 관리하는 노드입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final FocusNode? focusNode;

  /// 컨트롤러 없이 시작할 때의 값입니다.
  final String? initialValue;

  /// 값이 비었을 때 보이는 안내 문구입니다.
  final String? hintText;

  /// 오류 상태입니다. React의 `aria-invalid`에 대응합니다. null이면 스코프를 따릅니다.
  final bool? invalid;

  /// 입력을 받지 않을 상태입니다. React의 `disabled`에 대응합니다. null이면 스코프를
  /// 따릅니다.
  final bool? disabled;

  /// 값을 읽기만 할지 여부입니다.
  final bool readOnly;

  /// 입력을 가릴지 여부입니다.
  final bool obscureText;

  /// 화면이 열릴 때 포커스를 받을지 여부입니다.
  final bool autofocus;

  /// 키보드 종류입니다.
  final TextInputType? keyboardType;

  /// 키보드의 완료 키 동작입니다.
  final TextInputAction? textInputAction;

  /// 자동 대문자 규칙입니다.
  final TextCapitalization textCapitalization;

  /// 입력 형식 제한입니다.
  final List<TextInputFormatter>? inputFormatters;

  /// 값이 바뀔 때 부릅니다.
  final ValueChanged<String>? onChanged;

  /// 키보드의 완료 키를 눌렀을 때 부릅니다.
  final ValueChanged<String>? onSubmitted;

  /// 필드를 눌렀을 때 부릅니다.
  final VoidCallback? onTap;

  /// 입력 앞에 붙는 슬롯입니다.
  final Widget? prefix;

  /// 입력 뒤에 붙는 슬롯입니다.
  final Widget? suffix;

  /// 보조 기술이 읽을 이름입니다.
  final String? semanticsLabel;

  @override
  State<HoronInput> createState() => _HoronInputState();
}

class _HoronInputState extends State<HoronInput> {
  FocusNode? _ownedFocusNode;
  TextEditingController? _ownedController;
  bool _focused = false;

  FocusNode get _focusNode => widget.focusNode ?? (_ownedFocusNode ??= FocusNode());

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void didUpdateWidget(covariant HoronInput oldWidget) {
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
    _ownedController?.dispose();
    super.dispose();
  }

  void _handleFocusChange() {
    if (_focused == _focusNode.hasFocus) return;
    setState(() => _focused = _focusNode.hasFocus);
  }

  /// [HoronInput.initialValue]만 준 경우에 쓰는 내부 컨트롤러입니다.
  TextEditingController? get _controller {
    if (widget.controller != null) return widget.controller;
    if (widget.initialValue == null) return null;
    return _ownedController ??= TextEditingController(text: widget.initialValue);
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
    final Color fill = disabled ? _disabledFill(scheme, isDark) : scheme.surfaceContainerLow;
    final Color? ring = invalid
        ? scheme.error.withValues(alpha: isDark ? _invalidRingAlphaDark : _invalidRingAlphaLight)
        : (_focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null);

    final TextStyle textStyle = (theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      color: scheme.onSurface,
      fontSize: HoronText.body,
    );

    final Widget field = SizedBox(
      height: _inputHeight,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: fill,
          borderRadius: BorderRadius.circular(HoronRadiusRole.input),
          border: Border.all(color: borderColor),
          boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: _ringWidth)],
        ),
        child: Row(
          children: <Widget>[
            if (widget.prefix != null)
              Padding(
                padding: const EdgeInsetsDirectional.only(start: HoronSpace.s3),
                child: widget.prefix!,
              ),
            Expanded(
              child: TextField(
                controller: _controller,
                focusNode: _focusNode,
                readOnly: widget.readOnly,
                enabled: !disabled,
                obscureText: widget.obscureText,
                autofocus: widget.autofocus,
                keyboardType: widget.keyboardType,
                textInputAction: widget.textInputAction,
                textCapitalization: widget.textCapitalization,
                inputFormatters: widget.inputFormatters,
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
                  contentPadding: EdgeInsetsDirectional.symmetric(
                    horizontal: widget.prefix == null ? HoronSpace.s3 : HoronSpace.s2,
                    vertical: HoronSpace.s2,
                  ),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  disabledBorder: InputBorder.none,
                  errorBorder: InputBorder.none,
                  focusedErrorBorder: InputBorder.none,
                ),
              ),
            ),
            if (widget.suffix != null)
              Padding(
                padding: const EdgeInsetsDirectional.only(end: HoronSpace.s3),
                child: widget.suffix!,
              ),
          ],
        ),
      ),
    );

    return Semantics(
      label: widget.semanticsLabel,
      child: Opacity(opacity: disabled ? _disabledOpacity : 1, child: field),
    );
  }

  /// React `disabled:bg-input/50`(다크는 `/80`)입니다.
  ///
  /// Tailwind의 `/50`은 `--input` 색의 알파를 절반으로 줄입니다. `--input`은 이미
  /// 12% 검정이므로 결과는 6%이고, `withValues(alpha: 0.5)`처럼 알파를 새로 정하면
  /// 50% 검정이 되어 React보다 훨씬 어두워집니다. 그래서 기존 알파에 배수를 곱합니다.
  Color _disabledFill(ColorScheme scheme, bool isDark) => Color.alphaBlend(
    scheme.outline.withValues(alpha: scheme.outline.a * (isDark ? _disabledFillAlphaDark : _disabledFillAlpha)),
    scheme.surfaceContainerLow,
  );
}

/// React `input.tsx`의 `h-[37px]`입니다.
///
/// 생성된 메트릭에는 입력 높이 항목이 없습니다. `HoronButtonMetrics.height`도 같은
/// 값이지만 그것은 버튼이 그리는 크기라 여기서 빌려 쓰지 않습니다.
const double _inputHeight = 37;

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
