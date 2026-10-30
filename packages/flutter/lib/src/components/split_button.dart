import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 주 동작과 보조 메뉴를 한 알약에 나눠 담은 버튼입니다.
///
/// React `SplitButton`: 하나의 primary 알약을 1x18 막대로 둘로 나눕니다. 왼쪽은 16px 아이콘과
/// 라벨, 오른쪽은 회전하는 14px 캐럿입니다. 둘레는 `rounded-full`이고 높이는 32입니다.
///
/// React는 캐럿을 누르면 자체 `Menu`를 엽니다. Flutter 포트는 메뉴를 소유하지 않고
/// [onMenuPressed]로 호스트에 넘깁니다. 캐럿 회전은 호스트가 [menuOpen]으로 알려 줍니다.
class HoronSplitButton extends StatelessWidget {
  /// 라벨과 두 콜백을 받습니다.
  const HoronSplitButton({
    super.key,
    required this.label,
    this.icon,
    this.onPressed,
    this.onMenuPressed,
    this.disabled = false,
    this.menuOpen = false,
    this.menuSemanticsLabel = 'More actions',
  });

  /// 왼쪽 절반의 라벨입니다. React `children`.
  final String label;

  /// 라벨 앞의 16px 아이콘입니다. React `icon`.
  final Widget? icon;

  /// 왼쪽 절반을 눌렀을 때 호출됩니다. React `BaseButton`의 클릭.
  final VoidCallback? onPressed;

  /// 오른쪽 절반(캐럿)을 눌렀을 때 호출됩니다. React의 `MenuTrigger`가 메뉴를 여는 자리입니다.
  final VoidCallback? onMenuPressed;

  /// 두 절반을 모두 흐리게 하고 누를 수 없게 합니다. React `disabled`.
  final bool disabled;

  /// 캐럿이 180도 돌아간 상태입니다. React `group-data-popup-open:rotate-180`.
  final bool menuOpen;

  /// 캐럿 버튼의 접근성 이름입니다. React `menuLabel`(기본 "More actions").
  final String menuSemanticsLabel;

  /// `size-4` — 라벨 앞 아이콘의 크기입니다.
  static const double _iconSize = 16;

  /// `w-px` — 두 절반을 가르는 막대의 두께입니다.
  static const double _dividerWidth = 1;

  /// `opacity-25` — 막대의 불투명도입니다.
  static const double _dividerOpacity = 0.25;

  /// `opacity-40` — 비활성 상태의 불투명도입니다.
  static const double _disabledOpacity = 0.4;

  /// `duration-200` — 캐럿이 도는 시간입니다.
  static const Duration _caretDuration = Duration(milliseconds: 200);

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool animate = !MediaQuery.disableAnimationsOf(context);
    final Color onPrimary = colors.interactiveOnPrimary;
    // Paper `1VGK-0`의 라벨은 `text-label-lg`(16/22 500)입니다.
    final TextStyle labelStyle = theme.text.labelLg.copyWith(color: onPrimary);

    return Opacity(
      opacity: disabled ? _disabledOpacity : 1,
      child: ClipRRect(
        key: const Key('horon-split-button'),
        borderRadius: BorderRadius.circular(theme.radius.full),
        child: ColoredBox(
          color: colors.interactivePrimary,
          child: SizedBox(
            // `h-8` — 32px.
            height: space.step(8),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Flexible(
                  child: _Half(
                    // `gap-2 rounded-l-full pr-2 pl-4`.
                    padding: EdgeInsetsDirectional.only(start: space.s4, end: space.s2),
                    onPressed: disabled ? null : onPressed,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      spacing: space.s2,
                      children: <Widget>[
                        if (icon != null)
                          IconTheme.merge(
                            data: IconThemeData(size: _iconSize, color: onPrimary),
                            child: icon!,
                          ),
                        Flexible(
                          child: Text(label, style: labelStyle, maxLines: 1, overflow: TextOverflow.ellipsis),
                        ),
                      ],
                    ),
                  ),
                ),
                Container(
                  key: const Key('horon-split-button-divider'),
                  width: _dividerWidth,
                  // `h-4.5` — 18px.
                  height: space.step(4.5),
                  color: onPrimary.withValues(alpha: _dividerOpacity),
                ),
                _Half(
                  // `rounded-r-full pr-4 pl-2`.
                  padding: EdgeInsetsDirectional.only(start: space.s2, end: space.s4),
                  semanticsLabel: menuSemanticsLabel,
                  onPressed: disabled ? null : onMenuPressed,
                  child: AnimatedRotation(
                    turns: menuOpen ? 0.5 : 0,
                    duration: animate ? _caretDuration : Duration.zero,
                    curve: HoronMotion.easeOutQuint,
                    // `size-3.5` — 14px.
                    child: Icon(Icons.expand_more, size: space.s3_5, color: onPrimary),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 알약의 한쪽 절반입니다. 누르는 동안 0.97로 줄어듭니다(`motion-press`).
class _Half extends StatefulWidget {
  const _Half({required this.child, required this.padding, this.onPressed, this.semanticsLabel});

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onPressed;
  final String? semanticsLabel;

  @override
  State<_Half> createState() => _HalfState();
}

class _HalfState extends State<_Half> {
  bool _pressed = false;

  void _setPressed(bool value) {
    if (_pressed == value) return;
    setState(() => _pressed = value);
  }

  @override
  Widget build(BuildContext context) {
    final bool animate = !MediaQuery.disableAnimationsOf(context);
    final bool enabled = widget.onPressed != null;

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.semanticsLabel,
      child: MouseRegion(
        cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.onPressed,
          onTapDown: enabled ? (TapDownDetails details) => _setPressed(true) : null,
          onTapUp: enabled ? (TapUpDetails details) => _setPressed(false) : null,
          onTapCancel: enabled ? () => _setPressed(false) : null,
          child: AnimatedScale(
            scale: _pressed ? HoronMotion.pressScale : 1,
            duration: animate ? HoronMotion.pressDuration : Duration.zero,
            curve: HoronMotion.pressCurve,
            child: Padding(
              padding: widget.padding,
              child: Center(widthFactor: 1, child: widget.child),
            ),
          ),
        ),
      ),
    );
  }
}
