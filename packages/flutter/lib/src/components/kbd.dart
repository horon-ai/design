import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

/// `kbd.tsx`의 `px-1.5`입니다.
const double _kbdPaddingX = 6;

/// `kbd.tsx`의 `py-px`입니다.
const double _kbdPaddingY = 1;

/// `kbd.tsx`의 `gap-1`입니다.
const double _kbdGap = 4;

/// `kbd.tsx`의 `[&_svg]:size-3`입니다.
const double _kbdIconSize = 12;

/// Figma `Kbd`(Command palette 110:676): 6% 잉크 칩 위에 캡션 텍스트를 얹은 단축키 표시입니다.
///
/// `kbd.tsx`를 옮긴 것입니다. 배경은 `bg-overlay-ink-6`, 글자는 `text-caption`에
/// `text-text-secondary`, 반경은 `rounded-xs`(6)입니다. [icon]을 넘기면 앞에 12px로
/// 붙고, [label]이나 [child] 중 하나는 있어야 합니다.
class HoronKbd extends StatelessWidget {
  /// 단축키를 만듭니다.
  const HoronKbd({super.key, this.label, this.child, this.icon})
    : assert(label != null || child != null, 'HoronKbd needs a label or a child.');

  /// 칩에 넣을 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final TextStyle style = theme.text.caption.copyWith(color: theme.colors.textSecondary);

    return DecoratedBox(
      decoration: BoxDecoration(color: theme.colors.overlayInk6, borderRadius: BorderRadius.circular(theme.radius.xs)),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: _kbdPaddingX, vertical: _kbdPaddingY),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            if (icon != null) ...<Widget>[
              IconTheme.merge(
                data: IconThemeData(size: _kbdIconSize, color: theme.colors.textSecondary),
                child: icon!,
              ),
              const SizedBox(width: _kbdGap),
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
