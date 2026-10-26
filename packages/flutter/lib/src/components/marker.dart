import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `marker.tsx`의 `variant` 옵션입니다. 여섯 가지 의미 색을 그대로 옮겼습니다.
enum HoronMarkerVariant {
  /// `text-foreground`
  defaultValue,

  /// `text-muted-foreground`
  muted,

  /// `text-success`
  success,

  /// `text-warning`
  warning,

  /// `text-destructive`
  destructive,

  /// `text-info`
  info,
}

/// `marker.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값이라 이름을 붙입니다.
const double _markerFontSize = 13.0;

/// `marker.tsx`의 `[&_svg:not([class*='size-'])]:size-4`입니다.
const double _markerIconSize = 16.0;

/// 아이콘과 글자를 묶는 한 줄 표시입니다.
///
/// `marker.tsx`를 옮긴 것입니다. 변형이 아이콘과 글자 색을 함께 정하고, 글자는
/// [HoronMarkerContent]로 잘라 넣습니다. React의 `MarkerIcon`·`MarkerContent`도
/// 같은 이름의 위젯으로 있습니다.
///
/// ```dart
/// const HoronMarker(
///   variant: HoronMarkerVariant.success,
///   icon: Icon(Icons.check),
///   label: '연결됨',
/// );
/// ```
class HoronMarker extends StatelessWidget {
  /// 표시 하나를 만듭니다.
  const HoronMarker({super.key, this.label, this.child, this.icon, this.variant = HoronMarkerVariant.defaultValue})
    : assert(label != null || child != null, 'HoronMarker needs a label or a child.');

  /// 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 앞에 붙는 아이콘입니다.
  final Widget? icon;

  /// 의미 색입니다.
  final HoronMarkerVariant variant;

  /// 변형이 고르는 글자 색입니다.
  static Color colorFor(BuildContext context, HoronMarkerVariant variant) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    return switch (variant) {
      HoronMarkerVariant.defaultValue => scheme.onSurface,
      HoronMarkerVariant.muted => scheme.onSurfaceVariant,
      HoronMarkerVariant.success => horon.success,
      HoronMarkerVariant.warning => horon.warning,
      HoronMarkerVariant.destructive => scheme.error,
      HoronMarkerVariant.info => horon.info,
    };
  }

  @override
  Widget build(BuildContext context) {
    final Color color = colorFor(context, variant);
    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _markerFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.normal,
      color: color,
      decoration: TextDecoration.none,
    );

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        if (icon != null) ...<Widget>[
          HoronMarkerIcon(icon: icon!, color: color),
          const SizedBox(width: HoronSpace.s1_5),
        ],
        Flexible(
          child: label != null
              ? HoronMarkerContent(label!, style: textStyle)
              : HoronMarkerContent.custom(child!, style: textStyle),
        ),
      ],
    );
  }
}

/// `marker.tsx`의 `MarkerIcon`입니다.
///
/// `aria-hidden`이라 의미 트리에서 빠집니다. 아이콘은 호스트가 공급합니다.
class HoronMarkerIcon extends StatelessWidget {
  /// 아이콘 하나를 감쌉니다.
  const HoronMarkerIcon({super.key, required this.icon, this.color});

  /// 감쌀 아이콘입니다.
  final Widget icon;

  /// 아이콘 색입니다. 없으면 상속된 [IconTheme]을 씁니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: IconTheme.merge(
        data: IconThemeData(size: _markerIconSize, color: color),
        child: icon,
      ),
    );
  }
}

/// `marker.tsx`의 `MarkerContent`입니다. `truncate`라 한 줄로 자릅니다.
class HoronMarkerContent extends StatelessWidget {
  /// 글자를 잘라 넣습니다.
  const HoronMarkerContent(this.label, {super.key, this.style}) : child = null;

  /// 임의 위젯을 잘라 넣습니다.
  const HoronMarkerContent.custom(this.child, {super.key, this.style}) : label = null;

  /// 글자입니다.
  final String? label;

  /// 임의 위젯입니다.
  final Widget? child;

  /// 글자 스타일입니다. [HoronMarker]가 변형 색을 실어 넘깁니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    if (label != null) {
      return Text(label!, style: style, maxLines: 1, overflow: TextOverflow.ellipsis);
    }
    return DefaultTextStyle.merge(style: style, child: child!);
  }
}
