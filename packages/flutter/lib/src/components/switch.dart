import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `switch.tsx`가 받는 크기입니다.
///
/// React는 `size?: "sm" | "default"`를 받고 `data-[size=...]`로 클래스를
/// 바꿉니다. cva `variants:` 블록이 아니라 prop이지만, 이름은 React의 키를 그대로
/// 옮깁니다. `default`는 Dart 예약어라 `defaultValue`입니다.
enum HoronSwitchSize {
  /// `h-6 w-10`(24×40)이고 썸은 `size-5`(20)입니다. React의 기본값입니다.
  defaultValue,

  /// `h-[18px] w-[30px]`(18×30)이고 썸은 `size-3.5`(14)입니다.
  sm,
}

/// `switch.tsx`의 스위치입니다.
///
/// React의 트랙은 `rounded-full border border-border`이고, 썸은 `rounded-full`에
/// 크기별 `size-5`·`size-3.5`입니다. 켜지면 트랙이 `primary`가 되고 썸이
/// `translate-x-[calc(100%-2px)]`만큼 움직입니다. 그 2px은 테두리 1px과 여백
/// 1px이고, 이 위젯은 테두리 안쪽에 [AnimatedAlign]을 두어 같은 거리를 셈하지
/// 않고 냅니다. 기본 크기에서 썸이 움직이는 거리는 40-2-20=18px입니다.
///
/// 상태별 모양은 React 클래스와 같습니다.
/// - 켜짐: 트랙 `primary`
/// - 꺼짐: 트랙 `input`(다크는 `dark:data-unchecked:bg-input/80`)
/// - 오류([invalid], React `aria-invalid`): 테두리 `destructive`와 바깥 링
/// - 비활성: 불투명도 50%(React `data-disabled:opacity-50`)
/// - 포커스: 테두리 `ring`과 바깥 링(React `focus-visible:ring-3 ring-ring/50`)
///
/// 썸의 색은 React의 `dark:` 규칙을 그대로 따릅니다. 라이트는 `bg-card`,
/// 다크에서 켜지면 `bg-primary-foreground`, 다크에서 꺼지면 `bg-foreground`입니다.
/// 그래서 다크에서는 트랙과 썸의 명암이 뒤집힙니다.
class HoronSwitch extends StatefulWidget {
  /// 스위치를 만듭니다.
  const HoronSwitch({
    super.key,
    required this.value,
    this.onChanged,
    this.size = HoronSwitchSize.defaultValue,
    this.invalid = false,
    this.enabled = true,
    this.autofocus = false,
    this.focusNode,
    this.label,
    this.semanticsLabel,
  });

  /// 켜져 있는지 여부입니다.
  final bool value;

  /// 값이 바뀔 때 부릅니다. `null`이면 눌러도 값이 바뀌지 않습니다.
  final ValueChanged<bool>? onChanged;

  /// React의 `size`입니다.
  final HoronSwitchSize size;

  /// 오류 상태입니다. React의 `aria-invalid`에 대응합니다.
  final bool invalid;

  /// 누름과 포커스를 받을지 여부입니다.
  final bool enabled;

  /// 화면이 열릴 때 포커스를 받을지 여부입니다.
  final bool autofocus;

  /// 포커스를 관리하는 노드입니다. 넘기지 않으면 이 위젯이 소유합니다.
  final FocusNode? focusNode;

  /// 트랙 오른쪽에 붙는 문구입니다. 호스트가 넘깁니다.
  final String? label;

  /// 보조 기술이 읽을 이름입니다. 없으면 [label]을 씁니다.
  final String? semanticsLabel;

  /// 테스트가 트랙을 찾는 키입니다.
  static const Key trackKey = ValueKey<String>('horon-switch-track');

  /// 이 크기의 트랙 너비입니다. React `w-10`은 40, `w-[30px]`은 30입니다.
  double get trackWidth => switch (size) {
    HoronSwitchSize.defaultValue => _trackWidthDefault,
    HoronSwitchSize.sm => _trackWidthSm,
  };

  /// 이 크기의 트랙 높이입니다. React `h-6`은 24, `h-[18px]`은 18입니다.
  double get trackHeight => switch (size) {
    HoronSwitchSize.defaultValue => _trackHeightDefault,
    HoronSwitchSize.sm => _trackHeightSm,
  };

  /// 이 크기의 썸 지름입니다. React `size-5`는 20, `size-3.5`는 14입니다.
  double get thumbSize => switch (size) {
    HoronSwitchSize.defaultValue => _thumbSizeDefault,
    HoronSwitchSize.sm => _thumbSizeSm,
  };

  @override
  State<HoronSwitch> createState() => _HoronSwitchState();
}

class _HoronSwitchState extends State<HoronSwitch> {
  FocusNode? _ownedFocusNode;
  bool _focused = false;

  FocusNode get _focusNode => widget.focusNode ?? (_ownedFocusNode ??= FocusNode(debugLabel: 'HoronSwitch'));

  bool get _disabled => !widget.enabled || widget.onChanged == null;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void didUpdateWidget(covariant HoronSwitch oldWidget) {
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

  void _toggle() {
    if (_disabled) return;
    widget.onChanged?.call(!widget.value);
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final LogicalKeyboardKey key = event.logicalKey;
    if (key != LogicalKeyboardKey.space && key != LogicalKeyboardKey.enter) return KeyEventResult.ignored;
    _toggle();
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final bool focused = _focused && !_disabled;

    final Color inputColor = scheme.outline;
    final Color trackColor = widget.value
        ? scheme.primary
        : inputColor.withValues(alpha: inputColor.a * (isDark ? _darkUncheckedAlphaScale : 1));
    final Color thumbColor = isDark ? (widget.value ? scheme.onPrimary : scheme.onSurface) : scheme.surfaceContainerLow;
    final Color borderColor = focused ? horon.ring : (widget.invalid ? scheme.error : scheme.outline);

    final Widget track = Container(
      key: HoronSwitch.trackKey,
      width: widget.trackWidth,
      height: widget.trackHeight,
      padding: const EdgeInsets.all(_trackBorderWidth),
      decoration: BoxDecoration(
        color: trackColor,
        borderRadius: BorderRadius.circular(widget.trackHeight / 2),
        border: Border.all(color: borderColor),
        boxShadow: focused
            ? <BoxShadow>[
                BoxShadow(
                  color: horon.ring.withValues(alpha: _focusRingAlpha),
                  spreadRadius: _focusRingSpread,
                ),
              ]
            : null,
      ),
      child: AnimatedAlign(
        alignment: widget.value ? Alignment.centerRight : Alignment.centerLeft,
        duration: const Duration(milliseconds: HoronDuration.normal),
        curve: HoronEasing.easingDefault,
        child: SizedBox.square(
          dimension: widget.thumbSize,
          child: DecoratedBox(
            decoration: BoxDecoration(color: thumbColor, shape: BoxShape.circle),
          ),
        ),
      ),
    );

    final String? label = widget.label;
    final Widget body = Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        track,
        if (label != null) ...<Widget>[
          const SizedBox(width: HoronSpace.s2),
          Flexible(
            child: Text(
              label,
              style: (theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
                color: scheme.onSurface,
                fontSize: HoronText.body,
                height: HoronLineHeight.none,
              ),
            ),
          ),
        ],
      ],
    );

    return Semantics(
      container: true,
      toggled: widget.value,
      enabled: !_disabled,
      label: widget.semanticsLabel ?? label,
      onTap: _disabled ? null : _toggle,
      child: Opacity(
        opacity: _disabled ? _disabledOpacity : 1,
        child: Focus(
          focusNode: _focusNode,
          autofocus: widget.autofocus,
          onKeyEvent: _handleKey,
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _disabled ? null : _toggle,
            child: MouseRegion(cursor: _disabled ? SystemMouseCursors.basic : SystemMouseCursors.click, child: body),
          ),
        ),
      ),
    );
  }
}

/// React `data-[size=default]:w-10`입니다.
const double _trackWidthDefault = HoronSpace.s10;

/// React `data-[size=default]:h-6`입니다.
const double _trackHeightDefault = HoronSpace.s6;

/// React `data-[size=sm]:w-[30px]`입니다. 4px 눈금에 없는 값이라 상수로 둡니다.
const double _trackWidthSm = 30;

/// React `data-[size=sm]:h-[18px]`입니다.
const double _trackHeightSm = 18;

/// React `group-data-[size=default]/switch:size-5`입니다.
const double _thumbSizeDefault = HoronSpace.s5;

/// React `group-data-[size=sm]/switch:size-3.5`입니다.
const double _thumbSizeSm = HoronSpace.s3_5;

/// React `border`의 두께입니다. 테두리 안쪽 여백이 썸의 이동 거리를 만듭니다.
const double _trackBorderWidth = 1;

/// React `dark:data-unchecked:bg-input/80`의 80%입니다.
const double _darkUncheckedAlphaScale = 0.8;

/// React `ring-ring/50`의 투명도입니다.
const double _focusRingAlpha = 0.5;

/// 바깥 링이 번지는 거리입니다.
const double _focusRingSpread = HoronSpace.s0_5;

/// React `data-disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;
