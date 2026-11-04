import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

/// `kbd.tsx`의 `KbdSize`입니다.
enum HoronKbdSize {
  /// `size="sm"` — 높이 16, 좌우 4, `caption`, 아이콘 10px.
  sm,

  /// `size="md"` — 높이 20, 좌우 6, `caption`, 아이콘 12px. 기본값입니다.
  md,

  /// `size="lg"` — 높이 24, 좌우 8, `label-sm`, 아이콘 14px.
  lg,
}

typedef _KbdMetrics = ({double height, double paddingX, double gap, double icon, TextStyle textStyle});

_KbdMetrics _metricsOf(HoronKbdSize size, HoronThemeData theme) => switch (size) {
  HoronKbdSize.sm => (
    height: 16,
    paddingX: theme.space.s1,
    gap: theme.space.s0_5,
    icon: 10,
    textStyle: theme.text.caption,
  ),
  HoronKbdSize.md => (
    height: 20,
    paddingX: theme.space.s1_5,
    gap: theme.space.s1,
    icon: 12,
    textStyle: theme.text.caption,
  ),
  HoronKbdSize.lg => (
    height: 24,
    paddingX: theme.space.s2,
    gap: theme.space.s1,
    icon: 14,
    textStyle: theme.text.labelSm,
  ),
};

/// Figma `Kbd`(Command palette 110:676): 6% 잉크 칩 위에 캡션 텍스트를 얹은 단축키 표시입니다.
///
/// `kbd.tsx`를 옮긴 것입니다. 배경은 `bg-overlay-ink-6`, 글자는 `text-caption`에
/// `text-text-secondary`, 반경은 `rounded-xs`(6)입니다. 세 크기는 세로 여백이 아니라
/// 높이 16·20·24로 갈리고(`h-4`/`h-5`/`h-6`), 글자는 `leading-none`이라 줄 높이를
/// 1.0으로 덮습니다. [icon]을 넘기면 앞에 붙고, [label]이나 [child] 중 하나는
/// 있어야 합니다.
///
/// React는 `className`으로 `bg-bg-surface-6 text-text-inverse/80` 같은 덮어쓰기를
/// 허용합니다. Flutter는 그 자리를 [background]·[foreground]로 엽니다. 둘 다 넘기지
/// 않으면 기본 토큰 색(`bg-overlay-ink-6`·`text-text-secondary`)을 씁니다.
class HoronKbd extends StatelessWidget {
  /// 단축키를 만듭니다.
  const HoronKbd({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.size = HoronKbdSize.md,
    this.background,
    this.foreground,
  }) : assert(label != null || child != null, 'HoronKbd needs a label or a child.');

  /// 크기입니다. 기본값은 [HoronKbdSize.md]입니다.
  final HoronKbdSize size;

  /// 칩에 넣을 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  /// 배경색 덮어쓰기입니다. React `className`의 `bg-*`입니다.
  ///
  /// 없으면 `bg-overlay-ink-6`을 씁니다.
  final Color? background;

  /// 글자색 덮어쓰기입니다. React `className`의 `text-*`입니다.
  ///
  /// 없으면 `text-text-secondary`를 씁니다.
  final Color? foreground;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final _KbdMetrics metrics = _metricsOf(size, theme);
    final Color fill = background ?? theme.colors.overlayInk6;
    final Color ink = foreground ?? theme.colors.textSecondary;
    // `leading-none` — 줄 높이를 1.0으로 덮어 고정 높이 안에서 세로로 가운데 놓습니다.
    final TextStyle style = metrics.textStyle.copyWith(color: ink, height: 1);

    return Container(
      height: metrics.height,
      alignment: Alignment.center,
      padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
      decoration: BoxDecoration(color: fill, borderRadius: BorderRadius.circular(theme.radius.xs)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          if (icon != null) ...<Widget>[
            IconTheme.merge(
              data: IconThemeData(size: metrics.icon, color: ink),
              child: icon!,
            ),
            SizedBox(width: metrics.gap),
          ],
          if (label != null)
            Text(label!, maxLines: 1, softWrap: false, overflow: TextOverflow.ellipsis, style: style)
          else
            DefaultTextStyle(style: style, child: child!),
        ],
      ),
    );
  }
}
