import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `toggle.tsx`의 `variant` 옵션입니다.
enum HoronToggleVariant {
  /// `bg-transparent` - 배경 없이 글자만 바뀝니다.
  defaultValue,

  /// `border-border bg-transparent` - 테두리가 있는 토글입니다.
  outline,
}

/// `toggle.tsx`의 `size` 옵션입니다.
enum HoronToggleSize {
  /// `h-[32px] min-w-[32px] px-2.5`
  defaultValue,

  /// `h-7 min-w-7 px-2`
  sm,

  /// `h-[37px] min-w-[37px] px-3`
  lg,
}

// toggle.tsx의 size 클래스를 픽셀로 옮긴 값입니다. 37은 4px 스케일의 단계가 아니라
// 이름을 붙여 둡니다: "h-[37px] min-w-[37px]".
const double _toggleHeightDefault = 32.0; // "h-[32px] min-w-[32px]"
const double _toggleHeightSm = 28.0; // "h-7 min-w-7"
const double _toggleHeightLg = 37.0; // "h-[37px] min-w-[37px]"

/// `toggle.tsx`의 `text-[13px]`입니다.
const double _toggleFontSize = 13.0;

/// 크기 하나가 그리는 치수입니다.
class _HoronToggleSpec {
  const _HoronToggleSpec({required this.height, required this.minWidth, required this.padding});

  /// 높이입니다.
  final double height;

  /// 아이콘만 있을 때도 지키는 최소 폭입니다.
  final double minWidth;

  /// 좌우 패딩입니다.
  final double padding;
}

const Map<HoronToggleSize, _HoronToggleSpec> _toggleSpecs = <HoronToggleSize, _HoronToggleSpec>{
  HoronToggleSize.defaultValue: _HoronToggleSpec(
    height: _toggleHeightDefault,
    minWidth: _toggleHeightDefault,
    padding: HoronSpace.s2_5,
  ),
  HoronToggleSize.sm: _HoronToggleSpec(height: _toggleHeightSm, minWidth: _toggleHeightSm, padding: HoronSpace.s2),
  HoronToggleSize.lg: _HoronToggleSpec(height: _toggleHeightLg, minWidth: _toggleHeightLg, padding: HoronSpace.s3),
};

/// 눌린 상태를 유지하는 토글 버튼입니다.
///
/// `toggle.tsx`를 옮긴 것입니다. `data-pressed`가 켜지면 `bg-accent
/// text-accent-foreground`가 되고, 꺼지면 `text-muted-foreground`로 돌아갑니다.
/// [pressed]를 넘기면 제어 모드가 되어 상태를 호스트가 소유하고, 넘기지 않으면
/// 스스로 기억합니다.
///
/// ```dart
/// HoronToggle(label: '굵게', onPressedChange: (bool pressed) => setBold(pressed));
/// ```
class HoronToggle extends StatefulWidget {
  /// 토글 하나를 만듭니다.
  const HoronToggle({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.pressed,
    this.initialPressed = false,
    this.onPressedChange,
    this.variant = HoronToggleVariant.defaultValue,
    this.size = HoronToggleSize.defaultValue,
    this.disabled = false,
    this.semanticLabel,
  }) : assert(label != null || child != null || icon != null, 'HoronToggle needs a label, a child or an icon.');

  /// 토글 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  /// 눌린 상태입니다. null이면 이 위젯이 상태를 소유합니다.
  final bool? pressed;

  /// 제어 모드가 아닐 때의 처음 상태입니다.
  final bool initialPressed;

  /// 눌린 상태가 바뀔 때 부르는 콜백입니다.
  final ValueChanged<bool>? onPressedChange;

  /// 변형입니다.
  final HoronToggleVariant variant;

  /// 크기입니다.
  final HoronToggleSize size;

  /// 누를 수 없는 상태입니다.
  final bool disabled;

  /// 스크린리더가 읽을 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronToggle> createState() => _HoronToggleState();
}

class _HoronToggleState extends State<HoronToggle> {
  final FocusNode _focusNode = FocusNode();

  late bool _internalPressed = widget.initialPressed;
  bool _hovered = false;
  bool _focused = false;

  bool get _pressed => widget.pressed ?? _internalPressed;

  bool get _enabled => !widget.disabled;

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  void _toggle() {
    if (!_enabled) return;
    final bool next = !_pressed;
    if (widget.pressed == null) setState(() => _internalPressed = next);
    widget.onPressedChange?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronToggleSpec spec = _toggleSpecs[widget.size]!;
    final bool pressed = _pressed;

    // "text-muted-foreground hover:bg-muted hover:text-foreground
    //  data-pressed:bg-accent data-pressed:text-accent-foreground"
    final Color foreground = pressed ? scheme.onSecondaryContainer : scheme.onSurfaceVariant;
    final Color background = pressed
        ? scheme.secondaryContainer
        : (_hovered && _enabled ? scheme.surfaceContainerHighest : Colors.transparent);
    final Color borderColor = widget.variant == HoronToggleVariant.outline
        ? (_focused ? horon.ring : scheme.outline)
        : (_focused ? horon.ring : Colors.transparent);
    final Color? ring = _focused ? horon.ring.withValues(alpha: 0.5) : null;

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _toggleFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.none,
      color: foreground,
      // Material 조상이 없는 자리에서는 Flutter가 기본 `DefaultTextStyle`에 노란
      // 이중 밑줄을 넣습니다. 그 값이 merge로 새어 들어오지 않게 명시합니다.
      decoration: TextDecoration.none,
    );

    final Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        if (widget.icon != null)
          IconTheme.merge(
            data: IconThemeData(size: HoronSpace.s4, color: foreground),
            child: widget.icon!,
          ),
        if (widget.icon != null && (widget.label != null || widget.child != null))
          const SizedBox(width: HoronSpace.s1_5),
        // React는 `whitespace-nowrap`이라 글자를 줄이지 않고, 좁은 부모에서는 그대로
        // 넘깁니다. Flutter에서 그대로 두면 이 Row가 부모를 넘쳐 `RenderFlex
        // overflowed`가 납니다(360 폭에서 98px, 2026-10-22 렌더 스윕). 글자를
        // [Flexible]로 두면 자리가 모자랄 때만 줄고, 남을 때는 제 폭을 그대로 씁니다.
        if (widget.label != null)
          Flexible(
            child: Text(widget.label!, maxLines: 1, softWrap: false, overflow: TextOverflow.ellipsis, style: textStyle),
          )
        else if (widget.child != null)
          Flexible(
            child: DefaultTextStyle(style: textStyle, child: widget.child!),
          ),
      ],
    );

    Widget result = Semantics(
      button: true,
      selected: pressed,
      enabled: _enabled,
      label: widget.semanticLabel,
      child: FocusableActionDetector(
        focusNode: _focusNode,
        enabled: _enabled,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              _toggle();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: _enabled ? _toggle : null,
          child: DecoratedBox(
            decoration: BoxDecoration(
              color: background,
              borderRadius: BorderRadius.circular(HoronRadius.sm),
              border: Border.all(color: borderColor),
              boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: 3)],
            ),
            child: ConstrainedBox(
              constraints: BoxConstraints(minWidth: spec.minWidth, minHeight: spec.height),
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: spec.padding, vertical: HoronSpace.s0),
                child: Center(widthFactor: 1, heightFactor: 1, child: content),
              ),
            ),
          ),
        ),
      ),
    );

    if (!_enabled) result = Opacity(opacity: 0.5, child: result);
    return result;
  }
}
