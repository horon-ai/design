import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// React `InputSize`와 같은 값 집합입니다.
enum HoronInputSize {
  /// `md` — 높이 40, 아이콘 16, body-md.
  md,

  /// `lg` — 높이 48, 아이콘 20, body-lg.
  lg,
}

/// React `InputSurface`와 같은 값 집합입니다.
enum HoronInputSurface {
  /// `glass` — 이미지나 유리 패널 위에 얹는 기본 표면입니다.
  glass,

  /// `solid` — 올라온 표면(`bg-surface`) 위에 쓰는 불투명 표면입니다.
  solid,

  /// `solidOnPage` — 페이지 배경(`bg-default`)에 직접 놓는 불투명 표면입니다.
  solidOnPage,
}

/// React `input.tsx`가 내보내는 `fieldBoxClass` 묶음의 Flutter 대응입니다.
///
/// `input`·`textarea`·`textareaField`·`inputGroup`·`select`가 같은 필드 상자를
/// 씁니다. React는 클래스 문자열을 export하고, 여기서는 테두리·채움·반경·여백을
/// 그리는 위젯이 그 자리를 대신합니다.
///
/// 유리 표면은 [HoronLiquidGlass]의 `regular` 티어로 채우고 그 위로 테두리를
/// 그립니다. 불투명 표면은 React의 `hover:border-border-strong`을 포인터가 있는
/// 환경의 hover 상태로 옮기고, `focus-within:outline-2`는 상자 안쪽 2px 링으로
/// 옮겼습니다(outline-offset만큼 밖으로 나가면 레이아웃이 흔들립니다).
class HoronFieldBox extends StatefulWidget {
  /// 필드 상자를 만듭니다.
  const HoronFieldBox({
    super.key,
    required this.child,
    this.surface = HoronInputSurface.glass,
    this.invalid = false,
    this.enabled = true,
    this.height,
    this.minHeight,
    this.padding,
  });

  /// 상자 안에 넣을 내용입니다.
  final Widget child;

  /// 채움과 테두리 규칙입니다.
  final HoronInputSurface surface;

  /// 오류 상태입니다. 참이면 테두리가 `border-danger`가 됩니다.
  final bool invalid;

  /// 비활성 상태입니다. 불투명 표면의 채움과 테두리가 바뀝니다.
  final bool enabled;

  /// 고정 높이입니다. `h-10`은 40, `h-12`는 48, `h-30`은 120입니다.
  final double? height;

  /// 최소 높이입니다. `min-h-28`은 112입니다.
  final double? minHeight;

  /// 안쪽 여백입니다. 기본값은 `px-3.5`(가로 14)입니다.
  final EdgeInsetsGeometry? padding;

  @override
  State<HoronFieldBox> createState() => _HoronFieldBoxState();
}

class _HoronFieldBoxState extends State<HoronFieldBox> {
  bool _hovered = false;
  bool _focused = false;

  Color _borderColor(HoronColors colors) {
    if (widget.invalid) return colors.borderDanger;
    if (widget.surface == HoronInputSurface.glass) {
      // React: `border-transparent`. 초점 링만 예외로 브랜드 색을 씁니다.
      return _focused ? colors.textBrand : Colors.transparent;
    }
    if (!widget.enabled) return colors.borderDefault;
    if (_focused) return colors.textBrand;
    if (_hovered) return colors.borderStrong;
    return colors.borderDefault;
  }

  Color _fillColor(HoronColors colors) {
    if (!widget.enabled) {
      // React `has-[[data-disabled]]:bg-bg-subtle`와 다크 전용
      // `dark:bg-neutral-800`입니다. 다크 전용 회색은 토큰에 없어
      // `bg-subtle`(다크 #2a2b2d)로 대신합니다.
      return colors.bgSubtle;
    }
    return switch (widget.surface) {
      HoronInputSurface.glass => Colors.transparent,
      HoronInputSurface.solid => colors.bgSurface,
      HoronInputSurface.solidOnPage => colors.bgDefault,
    };
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final EdgeInsetsGeometry padding = widget.padding ?? EdgeInsets.symmetric(horizontal: horon.space.s3_5);
    final BorderRadius radius = BorderRadius.all(Radius.circular(horon.radius.md));
    final Color border = _borderColor(horon.colors);
    final double ring = _focused && !widget.invalid ? 2 : 1;

    final Widget content = Padding(padding: padding, child: widget.child);

    Widget box;
    if (widget.surface == HoronInputSurface.glass) {
      box = DecoratedBox(
        position: DecorationPosition.foreground,
        decoration: BoxDecoration(
          borderRadius: radius,
          border: Border.all(color: border, width: ring),
        ),
        child: HoronLiquidGlass(tier: HoronGlassTier.regular, borderRadius: radius, child: content),
      );
    } else {
      box = AnimatedContainer(
        duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
        curve: HoronMotion.colorsCurve,
        decoration: BoxDecoration(
          color: _fillColor(horon.colors),
          borderRadius: radius,
          border: Border.all(color: border, width: ring),
        ),
        child: content,
      );
    }

    final Widget clipped = ClipRRect(borderRadius: radius, child: box);
    final Widget sized = widget.minHeight == null && widget.height == null
        ? clipped
        : ConstrainedBox(
            constraints: BoxConstraints(minHeight: widget.minHeight ?? 0, maxHeight: widget.height ?? double.infinity),
            child: clipped,
          );

    return MouseRegion(
      onEnter: (_) => _setHovered(true),
      onExit: (_) => _setHovered(false),
      child: Focus(canRequestFocus: false, onFocusChange: (bool focused) => _setFocused(focused), child: sized),
    );
  }

  void _setHovered(bool value) {
    if (_hovered == value) return;
    setState(() => _hovered = value);
  }

  void _setFocused(bool value) {
    if (_focused == value) return;
    setState(() => _focused = value);
  }
}

/// React `Input`(Figma 58:126)을 옮긴 입력 필드입니다.
///
/// MD·LG 두 크기와 Glass·Solid·SolidOnPage 세 표면을 가집니다. 선행 아이콘은
/// `text-secondary` 색으로, MD에서 16px·LG에서 20px로 그립니다.
class HoronInput extends StatefulWidget {
  /// 입력 필드를 만듭니다.
  const HoronInput({
    super.key,
    this.size = HoronInputSize.md,
    this.surface = HoronInputSurface.glass,
    this.icon,
    this.invalid = false,
    this.controller,
    this.focusNode,
    this.hintText,
    this.enabled = true,
    this.obscureText = false,
    this.keyboardType,
    this.textInputAction,
    this.onChanged,
    this.onSubmitted,
    this.autofocus = false,
    this.semanticLabel,
  });

  /// 크기입니다. `sizeClass`의 높이와 아이콘 크기를 고릅니다.
  final HoronInputSize size;

  /// 표면입니다. `glass`만 유리 레이어를 그립니다.
  final HoronInputSurface surface;

  /// 선행 아이콘입니다. `IconTheme`으로 크기와 색을 입힙니다.
  final Widget? icon;

  /// 오류 상태입니다. 테두리가 `border-danger`가 됩니다.
  final bool invalid;

  /// 입력값 컨트롤러입니다.
  final TextEditingController? controller;

  /// 초점 노드입니다.
  final FocusNode? focusNode;

  /// 값이 없을 때 보이는 안내 문구입니다(`placeholder:text-text-placeholder`).
  final String? hintText;

  /// 입력 가능 여부입니다. 거짓이면 값이 `text-disabled`가 됩니다.
  final bool enabled;

  /// 비밀번호처럼 입력을 가릴지 여부입니다.
  final bool obscureText;

  /// 키보드 종류입니다.
  final TextInputType? keyboardType;

  /// 키보드의 완료 키 동작입니다.
  final TextInputAction? textInputAction;

  /// 값이 바뀔 때 호출됩니다.
  final ValueChanged<String>? onChanged;

  /// 키보드의 완료 키를 눌렀을 때 호출됩니다.
  final ValueChanged<String>? onSubmitted;

  /// 화면에 들어올 때 스스로 초점을 받을지 여부입니다.
  final bool autofocus;

  /// 접근성 이름입니다. React `aria-label`에 대응합니다.
  final String? semanticLabel;

  @override
  State<HoronInput> createState() => _HoronInputState();
}

class _HoronInputState extends State<HoronInput> {
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
    final bool isLarge = widget.size == HoronInputSize.lg;
    final double height = isLarge ? _lgHeight : _mdHeight;
    final double iconSize = isLarge ? _lgIconSize : _mdIconSize;
    final TextStyle style = (isLarge ? horon.text.bodyLg : horon.text.bodyMd).copyWith(
      color: widget.enabled ? colors.textPrimary : colors.textDisabled,
    );

    return Semantics(
      label: widget.semanticLabel,
      textField: true,
      child: SizedBox(
        height: height,
        child: HoronFieldBox(
          surface: widget.surface,
          invalid: widget.invalid,
          enabled: widget.enabled,
          child: Row(
            spacing: horon.space.s2,
            children: <Widget>[
              if (widget.icon != null)
                IconTheme.merge(
                  data: IconThemeData(size: iconSize, color: colors.textSecondary),
                  child: widget.icon!,
                ),
              Expanded(
                child: TextField(
                  controller: _controller,
                  focusNode: widget.focusNode,
                  enabled: widget.enabled,
                  obscureText: widget.obscureText,
                  keyboardType: widget.keyboardType,
                  textInputAction: widget.textInputAction,
                  autofocus: widget.autofocus,
                  onChanged: widget.onChanged,
                  onSubmitted: widget.onSubmitted,
                  style: style,
                  cursorColor: colors.textPrimary,
                  decoration: InputDecoration.collapsed(
                    hintText: widget.hintText,
                    hintStyle: style.copyWith(color: colors.textPlaceholder),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// `h-10` — MD 필드 높이입니다.
const double _mdHeight = 40;

/// `h-12` — LG 필드 높이입니다.
const double _lgHeight = 48;

/// `size-4` — MD 아이콘입니다.
const double _mdIconSize = 16;

/// `size-5` — LG 아이콘입니다.
const double _lgIconSize = 20;
