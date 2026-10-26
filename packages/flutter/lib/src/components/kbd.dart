import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `kbd.tsx`의 `text-[11px]`입니다. 생성 스케일의 12보다 작은 값이라 이름을 붙입니다.
const double _kbdFontSize = 11.0;

/// `kbd.tsx`의 `h-5`/`min-w-5`입니다.
const double _kbdMinExtent = 20.0;

/// `kbd.tsx`의 `[&_svg:not([class*='size-'])]:size-3`입니다.
const double _kbdIconSize = 12.0;

/// 키캡 하나를 그립니다.
///
/// `kbd.tsx`를 옮긴 것입니다. 높이 20, 최소 폭 20, `rounded-sm` 반경, `border-border`
/// 테두리, `bg-muted` 바탕, 고정폭 글꼴 11, `text-muted-foreground` 색입니다.
///
/// 바탕과 글자색을 모두 테마 슬롯에서 읽으므로 다크에서 저절로 뒤집힙니다. 라이트는 밝은
/// 바탕에 어두운 글자, 다크는 어두운 바탕에 밝은 글자입니다. 키캡을 Material 기본
/// [Container] 모양에 맡기지 않고 반경·테두리·글자 크기를 여기서 직접 정하는 이유는,
/// 그 기본값이 디자인 토큰과 무관하게 정해져 있기 때문입니다.
///
/// ```dart
/// const HoronKbd(label: '⌘K');
/// ```
class HoronKbd extends StatelessWidget {
  /// 키캡 하나를 만듭니다.
  const HoronKbd({super.key, this.label, this.child, this.icon})
    : assert(label != null || child != null, 'HoronKbd needs a label or a child.');

  /// 키 이름입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.mono,
      fontSize: _kbdFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.none,
      color: scheme.onSurfaceVariant,
      decoration: TextDecoration.none,
    );

    return ConstrainedBox(
      constraints: const BoxConstraints(minWidth: _kbdMinExtent, minHeight: _kbdMinExtent),
      child: DecoratedBox(
        decoration: BoxDecoration(
          // `bg-muted`
          color: scheme.surfaceContainerHighest,
          // `rounded-sm`
          borderRadius: BorderRadius.circular(HoronRadius.sm),
          border: Border.all(color: scheme.outline),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s1_5),
          child: Center(
            widthFactor: 1,
            heightFactor: 1,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                if (icon != null) ...<Widget>[
                  IconTheme.merge(
                    data: IconThemeData(size: _kbdIconSize, color: scheme.onSurfaceVariant),
                    child: icon!,
                  ),
                  const SizedBox(width: HoronSpace.s1),
                ],
                if (label != null)
                  Text(label!, maxLines: 1, softWrap: false, style: textStyle)
                else
                  DefaultTextStyle(style: textStyle, child: child!),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 여러 키캡을 한 줄로 묶습니다.
///
/// `kbd.tsx`의 `KbdGroup`입니다. 키 사이 간격은 `gap-1`이라 [HoronSpace.s1]입니다.
class HoronKbdGroup extends StatelessWidget {
  /// 키캡 묶음을 만듭니다.
  const HoronKbdGroup({super.key, required this.children});

  /// 묶을 키캡입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    // 빈 묶음은 폭 0으로 그려집니다. 키가 없으면 그릴 것도 없습니다.
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        for (int index = 0; index < children.length; index++) ...<Widget>[
          if (index > 0) const SizedBox(width: HoronSpace.s1),
          children[index],
        ],
      ],
    );
  }
}
