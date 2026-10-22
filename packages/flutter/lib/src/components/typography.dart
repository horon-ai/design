import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `typography.tsx`의 `headingVariants` `level` 옵션입니다.
///
/// React의 cva 키는 숫자 `1`~`4`이고, 정규화하면 `level1`~`level4`가 됩니다. 이 파일의
/// 공개 enum은 이것 하나뿐입니다. 다른 축(목록의 순서 같은 것)을 enum으로 두면 변형 어휘
/// 게이트가 React에 없는 값으로 읽습니다.
enum HoronTypographyLevel {
  /// `text-display leading-tight` - [HoronText.display], 36.
  level1,

  /// `text-heading leading-snug` - [HoronText.heading], 24.
  level2,

  /// `text-subtitle leading-snug` - [HoronText.subtitle], 18.
  level3,

  /// `text-lead leading-snug` - [HoronText.lead], 16.
  level4,
}

/// `typography.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값이라 이름을 붙입니다.
const double _typographyBaseFontSize = 13.0;

/// `typography.tsx`의 `text-[0.85em]`입니다. 인라인 코드가 상속 크기의 85%로 그려집니다.
const double _typographyInlineCodeScale = 0.85;

/// `typography.tsx`의 `ml-5`입니다.
const double _typographyListIndent = HoronSpace.s5;

/// `typography.tsx`의 `space-y-1.5`입니다.
const double _typographyListGap = HoronSpace.s1_5;

/// 본문 컨테이너입니다.
///
/// `typography.tsx`의 `Typography`입니다. 세로로 쌓고(`flex flex-col gap-3`), 기본 글자
/// 크기 13에 `leading-relaxed`, 색은 `text-foreground`입니다. 안에 넣은 [Text]는 이
/// [DefaultTextStyle]을 상속하므로 크기·줄 높이·색을 따로 넘기지 않아도 됩니다.
class HoronTypography extends StatelessWidget {
  /// 본문 컨테이너를 만듭니다.
  const HoronTypography({super.key, required this.children});

  /// 세로로 쌓을 내용입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return DefaultTextStyle(
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: _typographyBaseFontSize,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.relaxed,
        color: scheme.onSurface,
        decoration: TextDecoration.none,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: HoronSpace.s3,
        children: children,
      ),
    );
  }
}

/// 제목입니다.
///
/// `typography.tsx`의 `TypographyHeading`입니다. `font-semibold tracking-tight`에
/// [level]이 고른 크기·줄 높이가 붙습니다. React는 `h1`~`h4` 태그를 골랐지만 Flutter에는
/// 태그가 없으므로 [Semantics]의 `header`로 같은 정보를 남깁니다.
class HoronTypographyHeading extends StatelessWidget {
  /// 제목을 만듭니다.
  const HoronTypographyHeading({
    super.key,
    required this.data,
    this.level = HoronTypographyLevel.level2,
    this.textAlign,
  });

  /// 제목 글자입니다.
  final String data;

  /// 제목 단계입니다. 기본값은 React의 `defaultVariants: { level: 2 }`와 같습니다.
  final HoronTypographyLevel level;

  /// 글자 정렬입니다.
  final TextAlign? textAlign;

  /// [level]이 고르는 글자 크기입니다.
  static double fontSizeFor(HoronTypographyLevel level) => switch (level) {
    HoronTypographyLevel.level1 => HoronText.display,
    HoronTypographyLevel.level2 => HoronText.heading,
    HoronTypographyLevel.level3 => HoronText.subtitle,
    HoronTypographyLevel.level4 => HoronText.lead,
  };

  /// [level]이 고르는 줄 높이 배수입니다.
  static double lineHeightFor(HoronTypographyLevel level) => switch (level) {
    HoronTypographyLevel.level1 => HoronLineHeight.tight,
    _ => HoronLineHeight.snug,
  };

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double fontSize = fontSizeFor(level);
    return Semantics(
      header: true,
      child: Text(
        data,
        textAlign: textAlign,
        style: TextStyle(
          fontFamily: HoronFont.body,
          fontFamilyFallback: HoronFont.fontFamilyFallback,
          fontSize: fontSize,
          fontWeight: HoronFontWeight.semibold,
          height: lineHeightFor(level),
          // `tracking-tight`은 -0.025em이라 글자 크기에 비례합니다.
          letterSpacing: HoronLetterSpacing.tight * fontSize,
          color: scheme.onSurface,
          decoration: TextDecoration.none,
        ),
      ),
    );
  }
}

/// 도입 문단입니다.
///
/// `typography.tsx`의 `TypographyLead`입니다. `text-lead leading-relaxed
/// text-muted-foreground`.
class HoronTypographyLead extends StatelessWidget {
  /// 도입 문단을 만듭니다.
  const HoronTypographyLead({super.key, required this.data, this.textAlign});

  /// 문단 글자입니다.
  final String data;

  /// 글자 정렬입니다.
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Text(
      data,
      textAlign: textAlign,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: HoronText.lead,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.relaxed,
        color: scheme.onSurfaceVariant,
        decoration: TextDecoration.none,
      ),
    );
  }
}

/// 보조 문구입니다.
///
/// `typography.tsx`의 `TypographyMuted`입니다. `text-caption text-muted-foreground`.
class HoronTypographyMuted extends StatelessWidget {
  /// 보조 문구를 만듭니다.
  const HoronTypographyMuted({super.key, required this.data, this.textAlign});

  /// 문구입니다.
  final String data;

  /// 글자 정렬입니다.
  final TextAlign? textAlign;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Text(
      data,
      textAlign: textAlign,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: HoronText.caption,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.normal,
        color: scheme.onSurfaceVariant,
        decoration: TextDecoration.none,
      ),
    );
  }
}

/// 문단 안의 인라인 코드입니다.
///
/// `typography.tsx`의 `TypographyInlineCode`입니다. `rounded-sm border border-border
/// bg-muted px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-foreground`를
/// 옮겼습니다. 크기는 상속된 글자 크기의 0.85배라, 문단 안에서 그 문단에 맞춰 줄어듭니다.
class HoronTypographyInlineCode extends StatelessWidget {
  /// 인라인 코드를 만듭니다.
  const HoronTypographyInlineCode({super.key, required this.data});

  /// 코드 글자입니다.
  final String data;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final double inherited = DefaultTextStyle.of(context).style.fontSize ?? HoronText.body;
    return DecoratedBox(
      decoration: BoxDecoration(
        // `bg-muted`
        color: scheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(HoronRadius.sm),
        border: Border.all(color: scheme.outline),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s1_5, vertical: HoronSpace.s0_5),
        child: Text(
          data,
          style: TextStyle(
            fontFamily: HoronFont.mono,
            fontSize: inherited * _typographyInlineCodeScale,
            fontWeight: HoronFontWeight.medium,
            height: HoronLineHeight.normal,
            color: scheme.onSurface,
            decoration: TextDecoration.none,
          ),
        ),
      ),
    );
  }
}

/// 글머리 목록입니다.
///
/// `typography.tsx`의 `TypographyList`입니다. `ml-5 space-y-1.5
/// marker:text-muted-foreground`와 `list-disc`(또는 [ordered]일 때 `list-decimal`)를
/// 옮겼습니다. Flutter에는 목록 글머리 기본 요소가 없으므로 글머리 글리프를 직접 그립니다.
///
/// 이름이 [HoronTypographyList]인 이유는 `list` 슬러그를 가진 별도 컴포넌트와 이름이
/// 겹치지 않게 하기 위해서입니다.
class HoronTypographyList extends StatelessWidget {
  /// 글머리 목록을 만듭니다.
  const HoronTypographyList({super.key, this.items, this.children, this.ordered = false})
    : assert(items != null || children != null, 'HoronTypographyList needs items or children.');

  /// 목록 항목 글자입니다.
  final List<String>? items;

  /// 항목 대신 넣는 위젯입니다.
  final List<Widget>? children;

  /// 참이면 숫자(`1.`)를, 거짓이면 점(`•`)을 글머리로 씁니다.
  final bool ordered;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final TextStyle itemStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _typographyBaseFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.relaxed,
      color: scheme.onSurface,
      decoration: TextDecoration.none,
    );
    // `marker:text-muted-foreground`
    final TextStyle markerStyle = itemStyle.copyWith(color: scheme.onSurfaceVariant);

    final int count = items?.length ?? children!.length;
    return DefaultTextStyle(
      style: itemStyle,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        spacing: _typographyListGap,
        children: <Widget>[
          for (int index = 0; index < count; index++)
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // `ml-5`만큼 들여 쓰고, 그 자리에 글머리를 놓습니다.
                SizedBox(
                  width: _typographyListIndent,
                  child: Text(ordered ? '${index + 1}.' : '•', style: markerStyle),
                ),
                Expanded(
                  child: items != null
                      ? Text(items![index], style: itemStyle)
                      : DefaultTextStyle.merge(style: itemStyle, child: children![index]),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
