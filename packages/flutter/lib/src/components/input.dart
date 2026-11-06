import 'package:flutter/material.dart';

import '../glass/horon_veil.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// React `InputSize`(`ControlSize`)와 같은 값 집합입니다.
enum HoronInputSize {
  /// `sm` — 높이 32, 아이콘 16, body-sm.
  sm,

  /// `md` — 높이 40, 아이콘 16, body-md. 기본값입니다.
  md,

  /// `lg` — 높이 48, 아이콘 20, body-lg.
  lg,
}

/// 필드 계열 컨트롤이 공유하는 크기 값입니다. React `fieldSizeClass`·`fieldTextClass`.
typedef HoronFieldMetrics = ({double height, double paddingX, double gap, double icon, TextStyle textStyle});

/// [HoronInputSize]에 대응하는 필드 값입니다.
HoronFieldMetrics horonFieldMetrics(HoronInputSize size, HoronThemeData theme) => switch (size) {
  HoronInputSize.sm => (
    height: theme.space.step(8),
    paddingX: theme.space.s3,
    gap: theme.space.s1_5,
    icon: 16,
    textStyle: theme.text.bodySm,
  ),
  HoronInputSize.md => (
    height: theme.space.step(10),
    paddingX: theme.space.s3_5,
    gap: theme.space.s2,
    icon: 16,
    textStyle: theme.text.bodyMd,
  ),
  HoronInputSize.lg => (
    height: theme.space.step(12),
    paddingX: theme.space.s5,
    gap: theme.space.s2_5,
    icon: 20,
    textStyle: theme.text.bodyLg,
  ),
};

/// React `InputSurface`와 같은 값 집합입니다.
enum HoronInputSurface {
  /// `glass` — 이미지나 유리 패널 위에 얹는 `.veil-field` 표면입니다.
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
/// 유리 표면은 React `.veil-field`와 같은 [HoronVeil] 한 겹으로 채우고, 오류 테두리는
/// veil의 1px 링이 맡습니다. 불투명 표면은 React의 `hover:border-border-strong`을
/// 포인터가 있는 환경의 hover 상태로 옮깁니다.
///
/// React `fieldBoxClass.base`는 포커스 링을 **상자**에 겁니다
/// (`focus-within:outline-2 outline-offset-2 outline-text-brand`). 그래서 안쪽 입력이
/// 아니라 상자가 포커스를 받은 것처럼 2px 브랜드 링을 상자 바깥 2px에 겹쳐 그립니다.
/// 테두리 자체는 상태와 무관하게 1px입니다.
class HoronFieldBox extends StatefulWidget {
  /// 필드 상자를 만듭니다.
  const HoronFieldBox({
    super.key,
    required this.child,
    this.surface = HoronInputSurface.solid,
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

  /// 상자 테두리 색입니다. 포커스는 테두리를 바꾸지 않고 바깥 링이 맡습니다.
  Color _borderColor(HoronColors colors) {
    if (widget.invalid) return colors.borderDanger;
    if (!widget.enabled) return colors.borderDefault;
    if (_hovered) return colors.borderStrong;
    return colors.borderDefault;
  }

  Color _fillColor(HoronColors colors) {
    if (!widget.enabled) {
      // React `has-[[data-disabled]]:bg-bg-subtle`입니다. `solid-on-page`의 다크 전용
      // 중립색 예외는 이번 React 변경에서 사라졌습니다.
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

    final Widget content = Padding(padding: padding, child: widget.child);

    Widget box;
    if (widget.surface == HoronInputSurface.glass) {
      // React `fieldBoxClass.glass`는 `.veil-field`입니다. HoronLiquidGlass를 겹치지
      // 않고 veil 한 겹만 씁니다. 비활성은 `has-[[data-disabled]]:opacity-60`입니다.
      final Widget veil = HoronVeil(
        kind: HoronVeilKind.field,
        borderRadius: radius,
        focused: _focused,
        invalid: widget.invalid,
        child: content,
      );
      box = widget.enabled ? veil : Opacity(opacity: _disabledOpacity, child: veil);
    } else {
      box = AnimatedContainer(
        duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
        curve: HoronMotion.colorsCurve,
        decoration: BoxDecoration(
          color: _fillColor(horon.colors),
          borderRadius: radius,
          border: Border.all(color: border),
        ),
        child: content,
      );
    }

    // veil은 링·그림자를 표면 바깥에 그리므로 바깥 ClipRRect로 잘라 내면 안 됩니다.
    // HoronVeil이 자기 표면과 내용을 이미 둥글게 자릅니다.
    final Widget clipped = widget.surface == HoronInputSurface.glass
        ? box
        : ClipRRect(borderRadius: radius, child: box);
    final Widget sized = widget.minHeight == null && widget.height == null
        ? clipped
        : ConstrainedBox(
            constraints: BoxConstraints(minHeight: widget.minHeight ?? 0, maxHeight: widget.height ?? double.infinity),
            child: clipped,
          );
    // `focus-within:outline-2 outline-offset-2 outline-text-brand` — 2px 브랜드 링을
    // 상자 바깥 2px에 겹칩니다. 오류 상태에서는 상자 테두리가 이미 위험 색이라
    // 링을 그리지 않습니다(React도 오류 링과 겹치지 않게 상자를 danger로 칠합니다).
    final Widget ringed = _focused && !widget.invalid && widget.enabled
        ? _OutlineRing(radius: radius, color: horon.colors.textBrand, child: sized)
        : sized;

    return MouseRegion(
      onEnter: (_) => _setHovered(true),
      onExit: (_) => _setHovered(false),
      child: Focus(canRequestFocus: false, onFocusChange: (bool focused) => _setFocused(focused), child: ringed),
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

/// `outline-2 outline-offset-2` — 상자 바깥 2px에 겹치는 2px 링입니다.
///
/// React의 outline은 상자 크기를 바꾸지 않으므로, 레이아웃을 밀지 않도록 테두리를
/// 자식 바깥에 겹쳐 그립니다.
class _OutlineRing extends StatelessWidget {
  const _OutlineRing({required this.radius, required this.color, required this.child});

  final BorderRadius radius;
  final Color color;
  final Widget child;

  /// `outline-offset-2`.
  static const double _offset = 2;

  /// `outline-2`.
  static const double _width = 2;

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -_offset,
          top: -_offset,
          right: -_offset,
          bottom: -_offset,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: radius.add(BorderRadius.circular(_offset)),
                border: Border.all(color: color, width: _width),
              ),
            ),
          ),
        ),
        child,
      ],
    );
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
    this.surface = HoronInputSurface.solid,
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

  /// 표면입니다. 기본값은 불투명 `solid`이고, 이미지나 유리 패널 위에서는
  /// `glass`를 넘깁니다.
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
    final HoronFieldMetrics metrics = horonFieldMetrics(widget.size, horon);
    final TextStyle style = metrics.textStyle.copyWith(
      color: widget.enabled ? colors.textPrimary : colors.textDisabled,
    );

    return Semantics(
      label: widget.semanticLabel,
      textField: true,
      child: SizedBox(
        height: metrics.height,
        child: HoronFieldBox(
          surface: widget.surface,
          invalid: widget.invalid,
          enabled: widget.enabled,
          padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
          child: Row(
            spacing: metrics.gap,
            children: <Widget>[
              if (widget.icon != null)
                IconTheme.merge(
                  data: IconThemeData(size: metrics.icon, color: colors.textSecondary),
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

/// `has-[[data-disabled]]:opacity-60` — veil 필드의 비활성 불투명도입니다.
const double _disabledOpacity = 0.6;
