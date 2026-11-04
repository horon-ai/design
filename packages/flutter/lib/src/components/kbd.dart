import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

/// `kbd.tsx`의 `KbdSize`입니다.
enum HoronKbdSize {
  /// `size="sm"` — 좌우 4, `caption`, 아이콘 10px.
  sm,

  /// `size="md"` — 좌우 6·위아래 1, `caption`, 아이콘 12px. 기본값입니다.
  md,

  /// `size="lg"` — 좌우 8·위아래 2, `label-sm`, 아이콘 14px.
  lg,
}

typedef _KbdMetrics = ({double paddingX, double paddingY, double gap, double icon, TextStyle textStyle});

_KbdMetrics _metricsOf(HoronKbdSize size, HoronThemeData theme) => switch (size) {
  HoronKbdSize.sm => (
    paddingX: theme.space.s1,
    paddingY: 0,
    gap: theme.space.s0_5,
    icon: 10,
    textStyle: theme.text.caption,
  ),
  HoronKbdSize.md => (
    paddingX: theme.space.s1_5,
    paddingY: 1,
    gap: theme.space.s1,
    icon: 12,
    textStyle: theme.text.caption,
  ),
  HoronKbdSize.lg => (
    paddingX: theme.space.s2,
    paddingY: 2,
    gap: theme.space.s1,
    icon: 14,
    textStyle: theme.text.labelSm,
  ),
};

/// Figma `Kbd`(Command palette 110:676): 6% 잉크 칩 위에 캡션 텍스트를 얹은 단축키 표시입니다.
///
/// `kbd.tsx`를 옮긴 것입니다. 배경은 `bg-overlay-ink-6`, 글자는 `text-caption`에
/// `text-text-secondary`, 반경은 `rounded-xs`(6)입니다. [icon]을 넘기면 앞에 12px로
/// 붙고, [label]이나 [child] 중 하나는 있어야 합니다.
class HoronKbd extends StatelessWidget {
  /// 단축키를 만듭니다.
  const HoronKbd({super.key, this.label, this.child, this.icon, this.size = HoronKbdSize.md})
    : assert(label != null || child != null, 'HoronKbd needs a label or a child.');

  /// 크기입니다. 기본값은 [HoronKbdSize.md]입니다.
  final HoronKbdSize size;

  /// 칩에 넣을 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final _KbdMetrics metrics = _metricsOf(size, theme);
    final TextStyle style = metrics.textStyle.copyWith(color: theme.colors.textSecondary);

    return DecoratedBox(
      decoration: BoxDecoration(color: theme.colors.overlayInk6, borderRadius: BorderRadius.circular(theme.radius.xs)),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: metrics.paddingX, vertical: metrics.paddingY),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            if (icon != null) ...<Widget>[
              IconTheme.merge(
                data: IconThemeData(size: metrics.icon, color: theme.colors.textSecondary),
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
      ),
    );
  }
}
