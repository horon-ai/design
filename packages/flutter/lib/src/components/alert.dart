import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `alert.tsx`의 `variant` 옵션입니다.
enum HoronAlertVariant {
  /// `border-border bg-card text-card-foreground`
  defaultValue,

  /// `border-destructive/30 bg-destructive/10 text-destructive`
  destructive,

  /// `border-success/30 bg-success/10 text-success`
  success,

  /// `border-warning/30 bg-warning/10 text-warning`
  warning,

  /// `border-info/30 bg-info/10 text-info`
  info,
}

/// `alert.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값이라 이름을 붙입니다.
const double _alertFontSize = 13.0;

/// `alert.tsx`의 `px-4`입니다.
const double _alertHorizontalPadding = HoronSpace.s4;

/// `alert.tsx`의 `py-3.5`입니다.
const double _alertVerticalPadding = HoronSpace.s3_5;

/// `alert.tsx`의 `gap-x-3`입니다.
const double _alertColumnGap = HoronSpace.s3;

/// `alert.tsx`의 `gap-y-1`입니다.
const double _alertRowGap = HoronSpace.s1;

/// `alert.tsx`의 `[&>svg]:size-4`입니다.
const double _alertIconSize = HoronSpace.s4;

/// `alert.tsx`의 `[&>svg]:translate-y-0.5`입니다.
const double _alertIconOffset = HoronSpace.s0_5;

/// `alert.tsx`의 테두리 `/30`입니다.
const double _alertBorderAlpha = 0.3;

/// `alert.tsx`의 배경 `/10`입니다.
const double _alertFillAlpha = 0.1;

/// `alert.tsx`의 설명 `/90`입니다.
const double _alertDescriptionAlpha = 0.9;

/// 알림의 색 세트입니다. 변형이 고르는 (테두리, 배경, 전경, 설명) 네 색입니다.
@immutable
class _AlertPalette {
  const _AlertPalette({required this.border, required this.fill, required this.foreground, required this.description});

  final Color border;
  final Color fill;
  final Color foreground;
  final Color description;
}

/// 알림 안쪽 조각이 변형의 색을 읽는 범위입니다.
///
/// 제목과 설명을 [HoronAlert] 밖에서 단독으로 쓰면 이 범위가 없습니다. 그때는
/// 조각들이 테마의 기본 전경색을 씁니다.
class _HoronAlertScope extends InheritedWidget {
  const _HoronAlertScope({required this.palette, required super.child});

  final _AlertPalette palette;

  static _AlertPalette? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronAlertScope>()?.palette;

  @override
  bool updateShouldNotify(_HoronAlertScope oldWidget) => palette != oldWidget.palette;
}

/// 변형이 고르는 네 색을 만듭니다.
///
/// 의미 색은 테두리 30%, 배경 10%, 전경 100%, 설명 90%로 씁니다. `default`는 카드
/// 표면과 `border`입니다.
_AlertPalette _alertPaletteFor(BuildContext context, HoronAlertVariant variant) {
  final ColorScheme scheme = Theme.of(context).colorScheme;
  final HoronThemeData horon = HoronTheme.of(context);

  _AlertPalette semantic(Color color) => _AlertPalette(
    border: color.withValues(alpha: _alertBorderAlpha),
    fill: color.withValues(alpha: _alertFillAlpha),
    foreground: color,
    description: color.withValues(alpha: _alertDescriptionAlpha),
  );

  return switch (variant) {
    HoronAlertVariant.defaultValue => _AlertPalette(
      border: scheme.outline,
      fill: scheme.surfaceContainerLow,
      foreground: scheme.onSurface,
      description: scheme.onSurfaceVariant,
    ),
    HoronAlertVariant.destructive => semantic(scheme.error),
    HoronAlertVariant.success => semantic(horon.success),
    HoronAlertVariant.warning => semantic(horon.warning),
    HoronAlertVariant.info => semantic(horon.info),
  };
}

/// 제목과 본문을 담는 알림 상자입니다.
///
/// `alert.tsx`를 옮긴 것입니다. React는 `grid grid-cols-[0_1fr] items-start gap-x-3
/// gap-y-1 rounded-md border px-4 py-3.5 text-[13px]`이고 아이콘이 있으면 첫 열이
/// `auto`로 바뀝니다. 그래서 [icon]을 넘기면 두 열, 넘기지 않으면 한 열입니다.
///
/// 다섯 변형의 색은 React 클래스 그대로입니다. `default`는 카드 표면과 `border`,
/// 나머지 넷은 각자의 의미 색을 30% 테두리와 10% 배경으로 깔고 전경을 그 색으로
/// 씁니다. 설명은 `text-destructive/90`처럼 90% 불투명도로 조금 흐려집니다.
///
/// ```dart
/// const HoronAlert(
///   variant: HoronAlertVariant.warning,
///   title: HoronAlertTitle('저장하지 못했습니다'),
///   description: HoronAlertDescription('연결을 확인한 뒤 다시 시도해 주세요.'),
/// );
/// ```
class HoronAlert extends StatelessWidget {
  /// 알림 하나를 만듭니다.
  const HoronAlert({
    super.key,
    this.variant = HoronAlertVariant.defaultValue,
    this.icon,
    this.title,
    this.description,
    this.child,
  });

  /// 알림 표면을 찾는 테스트용 키입니다. React의 `data-slot="alert"` 자리입니다.
  static const Key surfaceKey = ValueKey<String>('horon-alert-surface');

  /// 변형입니다.
  final HoronAlertVariant variant;

  /// 왼쪽 열에 놓는 아이콘입니다. 호스트가 공급합니다.
  final Widget? icon;

  /// 제목입니다. [HoronAlertTitle]을 넘깁니다.
  final Widget? title;

  /// 설명입니다. [HoronAlertDescription]을 넘깁니다.
  final Widget? description;

  /// 제목·설명 대신 넣는 임의 내용입니다.
  final Widget? child;

  /// 변형이 고르는 네 색은 [_alertPaletteFor]가 만듭니다.
  @override
  Widget build(BuildContext context) {
    final _AlertPalette palette = _alertPaletteFor(context, variant);
    final List<Widget> column = <Widget>[?title, ?description, ?child];

    return _HoronAlertScope(
      palette: palette,
      child: DecoratedBox(
        key: surfaceKey,
        decoration: BoxDecoration(
          color: palette.fill,
          borderRadius: BorderRadius.circular(HoronRadius.md),
          border: Border.all(color: palette.border),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: _alertHorizontalPadding, vertical: _alertVerticalPadding),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              if (icon != null) ...<Widget>[
                Padding(
                  padding: const EdgeInsets.only(top: _alertIconOffset),
                  child: ExcludeSemantics(
                    child: IconTheme.merge(
                      data: IconThemeData(size: _alertIconSize, color: palette.foreground),
                      child: icon!,
                    ),
                  ),
                ),
                const SizedBox(width: _alertColumnGap),
              ],
              Expanded(
                child: DefaultTextStyle(
                  style: TextStyle(
                    fontFamily: HoronFont.body,
                    fontFamilyFallback: HoronFont.fontFamilyFallback,
                    fontSize: _alertFontSize,
                    fontWeight: HoronFontWeight.regular,
                    height: HoronLineHeight.normal,
                    color: palette.foreground,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      for (int index = 0; index < column.length; index++) ...<Widget>[
                        if (index > 0) const SizedBox(height: _alertRowGap),
                        column[index],
                      ],
                    ],
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

/// `alert.tsx`의 `AlertTitle`입니다.
///
/// React는 `col-start-2 min-h-4 font-medium tracking-tight`입니다. [HoronAlert] 안에
/// 있으면 변형의 전경 색을, 밖에 있으면 `onSurface`를 씁니다.
class HoronAlertTitle extends StatelessWidget {
  /// 제목 하나를 만듭니다.
  const HoronAlertTitle(this.title, {super.key, this.child});

  /// 제목 글자입니다.
  final String? title;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Color color = _HoronAlertScope.maybeOf(context)?.foreground ?? scheme.onSurface;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _alertFontSize,
      fontWeight: HoronFontWeight.medium,
      height: HoronLineHeight.snug,
      letterSpacing: HoronLetterSpacing.tight,
      color: color,
    );
    return ConstrainedBox(
      constraints: const BoxConstraints(minHeight: HoronSpace.s4),
      child: title != null ? Text(title!, style: style) : DefaultTextStyle(style: style, child: child!),
    );
  }
}

/// `alert.tsx`의 `AlertDescription`입니다.
///
/// React는 `col-start-2 grid justify-items-start gap-1 text-muted-foreground`이고,
/// 의미 변형에서는 `text-<variant>/90`이 됩니다.
class HoronAlertDescription extends StatelessWidget {
  /// 설명 하나를 만듭니다.
  const HoronAlertDescription(this.description, {super.key, this.child});

  /// 설명 글자입니다.
  final String? description;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Color color = _HoronAlertScope.maybeOf(context)?.description ?? scheme.onSurfaceVariant;
    final TextStyle style = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _alertFontSize,
      fontWeight: HoronFontWeight.regular,
      height: HoronLineHeight.relaxed,
      color: color,
    );
    return description != null ? Text(description!, style: style) : DefaultTextStyle(style: style, child: child!);
  }
}
