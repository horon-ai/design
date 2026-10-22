// 생성된 토큰과 Material 테마 사이의 다리입니다.
//
// 색은 전부 `horon_tokens.g.dart`에서 옵니다. `ColorScheme.fromSeed`는 쓰지 않습니다.
// 시드에서 파생한 슬롯은 디자인 토큰에 없는 값을 만들어 내고, 그러면 웹과 Flutter가
// 같은 화면에서 다른 색을 그립니다. `ColorScheme`이 담지 못하는 슬롯(상태색, 차트,
// 사이드바, 유리 표면, 브랜드, 포커스 링)은 [HoronThemeData]가 소유합니다.
//
// `ColorScheme.background`는 Flutter 3.18에서 폐기됐고 `surface`가 그 자리를
// 대신합니다. 이 파일은 `surface`/`onSurface`만 씁니다. 폐기 멤버를 쓰면
// `flutter analyze --fatal-infos`가 실패합니다.

import 'package:flutter/material.dart';

import '../contracts/horon_strings.dart';
import '../tokens/horon_tokens.g.dart';
import 'horon_fonts.dart';

/// [ColorScheme]이 담지 못하는 horon 슬롯입니다.
///
/// 상태색(success·warning·info), 차트 계열, 사이드바 세트, 유리 표면 세트,
/// 브랜드 세트, 포커스 링, 그리고 화면 문구([strings])를 한 객체에 모읍니다.
/// 컴포넌트는 원시 상수 대신 [HoronTheme.of]로 이 객체를 읽습니다.
class HoronThemeData extends ThemeExtension<HoronThemeData> {
  /// 슬롯을 모두 받는 생성자입니다.
  const HoronThemeData({
    required this.success,
    required this.successForeground,
    required this.warning,
    required this.warningForeground,
    required this.info,
    required this.infoForeground,
    required this.chart1,
    required this.chart2,
    required this.chart3,
    required this.chart4,
    required this.chart5,
    required this.sidebar,
    required this.sidebarForeground,
    required this.sidebarPrimary,
    required this.sidebarPrimaryForeground,
    required this.sidebarAccent,
    required this.sidebarAccentForeground,
    required this.sidebarBorder,
    required this.sidebarRing,
    required this.glassFill,
    required this.glassFillStrong,
    required this.glassFillFrost,
    required this.glassFillSolid,
    required this.glassBorder,
    required this.glassTint,
    required this.glassForeground,
    required this.brandInk,
    required this.brandInk2,
    required this.brandInkForeground,
    required this.brandInkMuted,
    required this.brandInkFaint,
    required this.brandGold,
    required this.brandGoldText,
    required this.brandGoldSoft,
    required this.ring,
    required this.strings,
  });

  /// 라이트 밝기의 슬롯입니다.
  static const HoronThemeData light = HoronThemeData(
    success: HoronLightColors.success,
    successForeground: HoronLightColors.successForeground,
    warning: HoronLightColors.warning,
    warningForeground: HoronLightColors.warningForeground,
    info: HoronLightColors.info,
    infoForeground: HoronLightColors.infoForeground,
    chart1: HoronLightColors.chart1,
    chart2: HoronLightColors.chart2,
    chart3: HoronLightColors.chart3,
    chart4: HoronLightColors.chart4,
    chart5: HoronLightColors.chart5,
    sidebar: HoronLightColors.sidebar,
    sidebarForeground: HoronLightColors.sidebarForeground,
    sidebarPrimary: HoronLightColors.sidebarPrimary,
    sidebarPrimaryForeground: HoronLightColors.sidebarPrimaryForeground,
    sidebarAccent: HoronLightColors.sidebarAccent,
    sidebarAccentForeground: HoronLightColors.sidebarAccentForeground,
    sidebarBorder: HoronLightColors.sidebarBorder,
    sidebarRing: HoronLightColors.sidebarRing,
    glassFill: HoronLightColors.glassFill,
    glassFillStrong: HoronLightColors.glassFillStrong,
    glassFillFrost: HoronLightColors.glassFillFrost,
    glassFillSolid: HoronLightColors.glassFillSolid,
    glassBorder: HoronLightColors.glassBorder,
    glassTint: HoronLightColors.glassTint,
    glassForeground: HoronLightColors.glassForeground,
    brandInk: HoronLightColors.brandInk,
    brandInk2: HoronLightColors.brandInk2,
    brandInkForeground: HoronLightColors.brandInkForeground,
    brandInkMuted: HoronLightColors.brandInkMuted,
    brandInkFaint: HoronLightColors.brandInkFaint,
    brandGold: HoronLightColors.brandGold,
    brandGoldText: HoronLightColors.brandGoldText,
    brandGoldSoft: HoronLightColors.brandGoldSoft,
    ring: HoronLightColors.ring,
    strings: HoronStringsEn(),
  );

  /// 다크 밝기의 슬롯입니다.
  static const HoronThemeData dark = HoronThemeData(
    success: HoronDarkColors.success,
    successForeground: HoronDarkColors.successForeground,
    warning: HoronDarkColors.warning,
    warningForeground: HoronDarkColors.warningForeground,
    info: HoronDarkColors.info,
    infoForeground: HoronDarkColors.infoForeground,
    chart1: HoronDarkColors.chart1,
    chart2: HoronDarkColors.chart2,
    chart3: HoronDarkColors.chart3,
    chart4: HoronDarkColors.chart4,
    chart5: HoronDarkColors.chart5,
    sidebar: HoronDarkColors.sidebar,
    sidebarForeground: HoronDarkColors.sidebarForeground,
    sidebarPrimary: HoronDarkColors.sidebarPrimary,
    sidebarPrimaryForeground: HoronDarkColors.sidebarPrimaryForeground,
    sidebarAccent: HoronDarkColors.sidebarAccent,
    sidebarAccentForeground: HoronDarkColors.sidebarAccentForeground,
    sidebarBorder: HoronDarkColors.sidebarBorder,
    sidebarRing: HoronDarkColors.sidebarRing,
    glassFill: HoronDarkColors.glassFill,
    glassFillStrong: HoronDarkColors.glassFillStrong,
    glassFillFrost: HoronDarkColors.glassFillFrost,
    glassFillSolid: HoronDarkColors.glassFillSolid,
    glassBorder: HoronDarkColors.glassBorder,
    glassTint: HoronDarkColors.glassTint,
    glassForeground: HoronDarkColors.glassForeground,
    brandInk: HoronDarkColors.brandInk,
    brandInk2: HoronDarkColors.brandInk2,
    brandInkForeground: HoronDarkColors.brandInkForeground,
    brandInkMuted: HoronDarkColors.brandInkMuted,
    brandInkFaint: HoronDarkColors.brandInkFaint,
    brandGold: HoronDarkColors.brandGold,
    brandGoldText: HoronDarkColors.brandGoldText,
    brandGoldSoft: HoronDarkColors.brandGoldSoft,
    ring: HoronDarkColors.ring,
    strings: HoronStringsEn(),
  );

  /// 상태 성공 색입니다.
  final Color success;

  /// 상태 성공 색 위에 얹는 전경 색입니다.
  final Color successForeground;

  /// 상태 경고 색입니다.
  final Color warning;

  /// 상태 경고 색 위에 얹는 전경 색입니다.
  final Color warningForeground;

  /// 상태 정보 색입니다.
  final Color info;

  /// 상태 정보 색 위에 얹는 전경 색입니다.
  final Color infoForeground;

  /// 차트 계열 1번 색입니다.
  final Color chart1;

  /// 차트 계열 2번 색입니다.
  final Color chart2;

  /// 차트 계열 3번 색입니다.
  final Color chart3;

  /// 차트 계열 4번 색입니다.
  final Color chart4;

  /// 차트 계열 5번 색입니다.
  final Color chart5;

  /// 사이드바 표면 색입니다.
  final Color sidebar;

  /// 사이드바 표면 위의 전경 색입니다.
  final Color sidebarForeground;

  /// 사이드바에서 선택된 항목의 강조 색입니다.
  final Color sidebarPrimary;

  /// 사이드바에서 선택된 항목의 강조 위 전경 색입니다.
  final Color sidebarPrimaryForeground;

  /// 사이드바의 hover 강조 색입니다.
  final Color sidebarAccent;

  /// 사이드바의 hover 강조 위 전경 색입니다.
  final Color sidebarAccentForeground;

  /// 사이드바의 테두리 색입니다.
  final Color sidebarBorder;

  /// 사이드바 안에서 포커스를 그리는 색입니다.
  final Color sidebarRing;

  /// 유리 표면의 기본 채움 색입니다.
  final Color glassFill;

  /// 유리 표면의 진한 채움 색입니다.
  final Color glassFillStrong;

  /// 유리 표면의 서리 낀 채움 색입니다.
  final Color glassFillFrost;

  /// 유리 표면의 불투명 채움 색입니다.
  final Color glassFillSolid;

  /// 유리 표면의 테두리 색입니다.
  final Color glassBorder;

  /// 유리 표면 위에 얹는 색조입니다.
  final Color glassTint;

  /// 유리 표면 위의 전경 색입니다.
  final Color glassForeground;

  /// 브랜드 잉크 표면 색입니다.
  final Color brandInk;

  /// 브랜드 잉크 표면의 두 번째 단계 색입니다.
  final Color brandInk2;

  /// 브랜드 잉크 표면 위의 전경 색입니다.
  final Color brandInkForeground;

  /// 브랜드 잉크 표면 위의 보조 전경 색입니다.
  final Color brandInkMuted;

  /// 브랜드 잉크 표면 위의 흐린 전경 색입니다.
  final Color brandInkFaint;

  /// 브랜드 금색입니다.
  final Color brandGold;

  /// 금색을 글자로 쓸 때의 색입니다. 대비를 맞춘 값이라 [brandGold]와 다릅니다.
  final Color brandGoldText;

  /// 브랜드 금색의 부드러운 단계입니다.
  final Color brandGoldSoft;

  /// 포커스 링 색입니다.
  ///
  /// `ColorScheme`에는 ring 슬롯이 없습니다. 입력 필드의 포커스 테두리와
  /// 포커스 가능한 컨트롤은 이 값을 읽습니다.
  final Color ring;

  /// 컴포넌트가 화면에 쓰는 문구입니다.
  ///
  /// 호스트 앱이 [HoronStrings] 구현을 골라 넘깁니다. 이 패키지는 번역 데이터를
  /// 들고 있지 않습니다.
  final HoronStrings strings;

  @override
  HoronThemeData copyWith({
    Color? success,
    Color? successForeground,
    Color? warning,
    Color? warningForeground,
    Color? info,
    Color? infoForeground,
    Color? chart1,
    Color? chart2,
    Color? chart3,
    Color? chart4,
    Color? chart5,
    Color? sidebar,
    Color? sidebarForeground,
    Color? sidebarPrimary,
    Color? sidebarPrimaryForeground,
    Color? sidebarAccent,
    Color? sidebarAccentForeground,
    Color? sidebarBorder,
    Color? sidebarRing,
    Color? glassFill,
    Color? glassFillStrong,
    Color? glassFillFrost,
    Color? glassFillSolid,
    Color? glassBorder,
    Color? glassTint,
    Color? glassForeground,
    Color? brandInk,
    Color? brandInk2,
    Color? brandInkForeground,
    Color? brandInkMuted,
    Color? brandInkFaint,
    Color? brandGold,
    Color? brandGoldText,
    Color? brandGoldSoft,
    Color? ring,
    HoronStrings? strings,
  }) {
    return HoronThemeData(
      success: success ?? this.success,
      successForeground: successForeground ?? this.successForeground,
      warning: warning ?? this.warning,
      warningForeground: warningForeground ?? this.warningForeground,
      info: info ?? this.info,
      infoForeground: infoForeground ?? this.infoForeground,
      chart1: chart1 ?? this.chart1,
      chart2: chart2 ?? this.chart2,
      chart3: chart3 ?? this.chart3,
      chart4: chart4 ?? this.chart4,
      chart5: chart5 ?? this.chart5,
      sidebar: sidebar ?? this.sidebar,
      sidebarForeground: sidebarForeground ?? this.sidebarForeground,
      sidebarPrimary: sidebarPrimary ?? this.sidebarPrimary,
      sidebarPrimaryForeground: sidebarPrimaryForeground ?? this.sidebarPrimaryForeground,
      sidebarAccent: sidebarAccent ?? this.sidebarAccent,
      sidebarAccentForeground: sidebarAccentForeground ?? this.sidebarAccentForeground,
      sidebarBorder: sidebarBorder ?? this.sidebarBorder,
      sidebarRing: sidebarRing ?? this.sidebarRing,
      glassFill: glassFill ?? this.glassFill,
      glassFillStrong: glassFillStrong ?? this.glassFillStrong,
      glassFillFrost: glassFillFrost ?? this.glassFillFrost,
      glassFillSolid: glassFillSolid ?? this.glassFillSolid,
      glassBorder: glassBorder ?? this.glassBorder,
      glassTint: glassTint ?? this.glassTint,
      glassForeground: glassForeground ?? this.glassForeground,
      brandInk: brandInk ?? this.brandInk,
      brandInk2: brandInk2 ?? this.brandInk2,
      brandInkForeground: brandInkForeground ?? this.brandInkForeground,
      brandInkMuted: brandInkMuted ?? this.brandInkMuted,
      brandInkFaint: brandInkFaint ?? this.brandInkFaint,
      brandGold: brandGold ?? this.brandGold,
      brandGoldText: brandGoldText ?? this.brandGoldText,
      brandGoldSoft: brandGoldSoft ?? this.brandGoldSoft,
      ring: ring ?? this.ring,
      strings: strings ?? this.strings,
    );
  }

  @override
  HoronThemeData lerp(covariant HoronThemeData? other, double t) {
    if (other == null) return this;
    return HoronThemeData(
      success: Color.lerp(success, other.success, t)!,
      successForeground: Color.lerp(successForeground, other.successForeground, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
      warningForeground: Color.lerp(warningForeground, other.warningForeground, t)!,
      info: Color.lerp(info, other.info, t)!,
      infoForeground: Color.lerp(infoForeground, other.infoForeground, t)!,
      chart1: Color.lerp(chart1, other.chart1, t)!,
      chart2: Color.lerp(chart2, other.chart2, t)!,
      chart3: Color.lerp(chart3, other.chart3, t)!,
      chart4: Color.lerp(chart4, other.chart4, t)!,
      chart5: Color.lerp(chart5, other.chart5, t)!,
      sidebar: Color.lerp(sidebar, other.sidebar, t)!,
      sidebarForeground: Color.lerp(sidebarForeground, other.sidebarForeground, t)!,
      sidebarPrimary: Color.lerp(sidebarPrimary, other.sidebarPrimary, t)!,
      sidebarPrimaryForeground: Color.lerp(sidebarPrimaryForeground, other.sidebarPrimaryForeground, t)!,
      sidebarAccent: Color.lerp(sidebarAccent, other.sidebarAccent, t)!,
      sidebarAccentForeground: Color.lerp(sidebarAccentForeground, other.sidebarAccentForeground, t)!,
      sidebarBorder: Color.lerp(sidebarBorder, other.sidebarBorder, t)!,
      sidebarRing: Color.lerp(sidebarRing, other.sidebarRing, t)!,
      glassFill: Color.lerp(glassFill, other.glassFill, t)!,
      glassFillStrong: Color.lerp(glassFillStrong, other.glassFillStrong, t)!,
      glassFillFrost: Color.lerp(glassFillFrost, other.glassFillFrost, t)!,
      glassFillSolid: Color.lerp(glassFillSolid, other.glassFillSolid, t)!,
      glassBorder: Color.lerp(glassBorder, other.glassBorder, t)!,
      glassTint: Color.lerp(glassTint, other.glassTint, t)!,
      glassForeground: Color.lerp(glassForeground, other.glassForeground, t)!,
      brandInk: Color.lerp(brandInk, other.brandInk, t)!,
      brandInk2: Color.lerp(brandInk2, other.brandInk2, t)!,
      brandInkForeground: Color.lerp(brandInkForeground, other.brandInkForeground, t)!,
      brandInkMuted: Color.lerp(brandInkMuted, other.brandInkMuted, t)!,
      brandInkFaint: Color.lerp(brandInkFaint, other.brandInkFaint, t)!,
      brandGold: Color.lerp(brandGold, other.brandGold, t)!,
      brandGoldText: Color.lerp(brandGoldText, other.brandGoldText, t)!,
      brandGoldSoft: Color.lerp(brandGoldSoft, other.brandGoldSoft, t)!,
      ring: Color.lerp(ring, other.ring, t)!,
      strings: t < 0.5 ? strings : other.strings,
    );
  }
}

/// 라이트 밝기의 horon [ColorScheme]입니다.
///
/// 시드에서 파생하지 않고 생성 토큰을 슬롯마다 직접 대응합니다. 슬롯 매핑은
/// `mobile/lib/src/theme/color_schemes.dart`와 같은 값입니다.
const ColorScheme horonLightColorScheme = ColorScheme(
  brightness: Brightness.light,
  primary: HoronLightColors.primary,
  onPrimary: HoronLightColors.primaryForeground,
  primaryContainer: HoronLightColors.secondary,
  onPrimaryContainer: HoronLightColors.secondaryForeground,
  primaryFixed: HoronLightColors.secondary,
  primaryFixedDim: HoronLightColors.muted,
  onPrimaryFixed: HoronLightColors.secondaryForeground,
  onPrimaryFixedVariant: HoronLightColors.secondaryForeground,
  secondary: HoronLightColors.secondary,
  onSecondary: HoronLightColors.secondaryForeground,
  secondaryContainer: HoronLightColors.secondary,
  onSecondaryContainer: HoronLightColors.secondaryForeground,
  secondaryFixed: HoronLightColors.secondary,
  secondaryFixedDim: HoronLightColors.muted,
  onSecondaryFixed: HoronLightColors.secondaryForeground,
  onSecondaryFixedVariant: HoronLightColors.secondaryForeground,
  tertiary: HoronLightColors.secondary,
  onTertiary: HoronLightColors.secondaryForeground,
  tertiaryContainer: HoronLightColors.secondary,
  onTertiaryContainer: HoronLightColors.secondaryForeground,
  tertiaryFixed: HoronLightColors.secondary,
  tertiaryFixedDim: HoronLightColors.muted,
  onTertiaryFixed: HoronLightColors.secondaryForeground,
  onTertiaryFixedVariant: HoronLightColors.secondaryForeground,
  error: HoronLightColors.destructive,
  onError: HoronLightColors.destructiveForeground,
  errorContainer: HoronLightColors.destructive,
  onErrorContainer: HoronLightColors.destructiveForeground,
  surface: HoronLightColors.background,
  onSurface: HoronLightColors.foreground,
  surfaceDim: HoronLightColors.muted,
  surfaceBright: HoronLightColors.card,
  surfaceContainerLowest: HoronPalette.sand100,
  surfaceContainerLow: HoronLightColors.card,
  surfaceContainer: HoronLightColors.secondary,
  surfaceContainerHigh: HoronLightColors.popover,
  surfaceContainerHighest: HoronLightColors.muted,
  onSurfaceVariant: HoronLightColors.mutedForeground,
  outline: HoronLightColors.border,
  outlineVariant: HoronLightColors.border,
  shadow: HoronPalette.sand1200Shadow,
  scrim: HoronPalette.sand1200Scrim,
  inverseSurface: HoronPalette.sand1200,
  onInverseSurface: HoronPalette.sand100,
  inversePrimary: HoronPalette.accentLight,
  surfaceTint: HoronLightColors.primary,
);

/// 다크 밝기의 horon [ColorScheme]입니다.
const ColorScheme horonDarkColorScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: HoronDarkColors.primary,
  onPrimary: HoronDarkColors.primaryForeground,
  primaryContainer: HoronDarkColors.secondary,
  onPrimaryContainer: HoronDarkColors.secondaryForeground,
  primaryFixed: HoronDarkColors.secondary,
  primaryFixedDim: HoronDarkColors.muted,
  onPrimaryFixed: HoronDarkColors.secondaryForeground,
  onPrimaryFixedVariant: HoronDarkColors.secondaryForeground,
  secondary: HoronDarkColors.secondary,
  onSecondary: HoronDarkColors.secondaryForeground,
  secondaryContainer: HoronDarkColors.secondary,
  onSecondaryContainer: HoronDarkColors.secondaryForeground,
  secondaryFixed: HoronDarkColors.secondary,
  secondaryFixedDim: HoronDarkColors.muted,
  onSecondaryFixed: HoronDarkColors.secondaryForeground,
  onSecondaryFixedVariant: HoronDarkColors.secondaryForeground,
  tertiary: HoronDarkColors.secondary,
  onTertiary: HoronDarkColors.secondaryForeground,
  tertiaryContainer: HoronDarkColors.secondary,
  onTertiaryContainer: HoronDarkColors.secondaryForeground,
  tertiaryFixed: HoronDarkColors.secondary,
  tertiaryFixedDim: HoronDarkColors.muted,
  onTertiaryFixed: HoronDarkColors.secondaryForeground,
  onTertiaryFixedVariant: HoronDarkColors.secondaryForeground,
  error: HoronDarkColors.destructive,
  onError: HoronDarkColors.destructiveForeground,
  errorContainer: HoronDarkColors.destructive,
  onErrorContainer: HoronDarkColors.destructiveForeground,
  surface: HoronDarkColors.background,
  onSurface: HoronDarkColors.foreground,
  surfaceDim: HoronDarkColors.muted,
  surfaceBright: HoronDarkColors.card,
  surfaceContainerLowest: HoronPalette.sand1200,
  surfaceContainerLow: HoronDarkColors.card,
  surfaceContainer: HoronDarkColors.secondary,
  surfaceContainerHigh: HoronDarkColors.popover,
  surfaceContainerHighest: HoronDarkColors.muted,
  onSurfaceVariant: HoronDarkColors.mutedForeground,
  outline: HoronDarkColors.border,
  outlineVariant: HoronDarkColors.border,
  shadow: HoronPalette.sand1200Shadow,
  scrim: HoronPalette.sand1200Scrim,
  inverseSurface: HoronPalette.sand100,
  onInverseSurface: HoronPalette.sand1200,
  inversePrimary: HoronPalette.accentDark,
  surfaceTint: HoronDarkColors.primary,
);

/// 생성된 타입 스케일로 조립한 horon [TextTheme]입니다.
///
/// 색은 비워 둡니다. 그러면 [ThemeData]가 활성 밝기의 `onSurface`를 적용하므로
/// 이 테마는 밝기와 무관하게 하나로 유지됩니다. 15개 슬롯의 크기·무게·줄 높이는
/// `mobile/lib/src/theme/text_theme.dart`와 같은 값입니다.
const TextTheme horonTextTheme = TextTheme(
  displayLarge: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.hero,
    fontWeight: HoronFontWeight.bold,
    height: HoronLineHeight.tight,
  ),
  displayMedium: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.display,
    fontWeight: HoronFontWeight.bold,
    height: HoronLineHeight.tight,
  ),
  displaySmall: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.display,
    fontWeight: HoronFontWeight.semibold,
    height: HoronLineHeight.tight,
  ),
  headlineLarge: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.heading,
    fontWeight: HoronFontWeight.semibold,
    height: HoronLineHeight.tight,
  ),
  headlineMedium: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.heading,
    fontWeight: HoronFontWeight.semibold,
    height: HoronLineHeight.snug,
  ),
  headlineSmall: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.subtitle,
    fontWeight: HoronFontWeight.semibold,
    height: HoronLineHeight.snug,
  ),
  titleLarge: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.subtitle,
    fontWeight: HoronFontWeight.medium,
    height: HoronLineHeight.snug,
  ),
  titleMedium: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.lead,
    fontWeight: HoronFontWeight.medium,
    height: HoronLineHeight.normal,
  ),
  titleSmall: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.medium,
    height: HoronLineHeight.normal,
  ),
  bodyLarge: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.lead,
    fontWeight: HoronFontWeight.regular,
    height: HoronLineHeight.normal,
  ),
  bodyMedium: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.regular,
    height: HoronLineHeight.normal,
  ),
  bodySmall: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.caption,
    fontWeight: HoronFontWeight.regular,
    height: HoronLineHeight.normal,
  ),
  labelLarge: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.semibold,
    height: HoronLineHeight.normal,
  ),
  labelMedium: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.caption,
    fontWeight: HoronFontWeight.medium,
    height: HoronLineHeight.normal,
  ),
  labelSmall: TextStyle(
    fontFamily: HoronFont.body,
    fontFamilyFallback: HoronFont.fontFamilyFallback,
    fontSize: HoronText.caption,
    fontWeight: HoronFontWeight.regular,
    height: HoronLineHeight.snug,
  ),
);

/// [brightness]의 horon [ThemeData]입니다.
///
/// 라이트와 다크는 서로 독립한 토큰 집합입니다. 색, [ColorScheme],
/// [HoronThemeData]가 함께 바뀌므로 다크가 라이트 값을 빌려 쓰지 않습니다.
/// 표면 반경은 숫자 대신 [HoronRadiusRole]을 읽습니다. 그래야 버튼, 카드, 패널이
/// 각자 대응하는 디자인 컴포넌트의 반경을 유지합니다.
ThemeData horonTheme(Brightness brightness) {
  final bool isDark = brightness == Brightness.dark;
  final ColorScheme scheme = isDark ? horonDarkColorScheme : horonLightColorScheme;
  final HoronThemeData data = isDark ? HoronThemeData.dark : HoronThemeData.light;

  final BorderRadius controlRadius = BorderRadius.circular(HoronRadiusRole.control);
  final BorderRadius cardRadius = BorderRadius.circular(HoronRadiusRole.card);
  final BorderRadius fieldRadius = BorderRadius.circular(HoronRadiusRole.input);
  final BorderRadius panelRadius = BorderRadius.circular(HoronRadiusRole.panel);

  return ThemeData(
    brightness: brightness,
    colorScheme: scheme,
    textTheme: horonTextTheme,
    extensions: <ThemeExtension<dynamic>>[data],
    scaffoldBackgroundColor: scheme.surface,
    appBarTheme: AppBarThemeData(
      backgroundColor: scheme.surface,
      foregroundColor: scheme.onSurface,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      titleTextStyle: horonTextTheme.titleLarge?.copyWith(color: scheme.onSurface),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: controlRadius)),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: controlRadius)),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: controlRadius)),
    ),
    cardTheme: CardThemeData(
      color: scheme.surfaceContainerLow,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: cardRadius,
        side: BorderSide(color: scheme.outline),
      ),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: scheme.surfaceContainerHigh,
      surfaceTintColor: Colors.transparent,
      elevation: HoronShadow.lgElevation.toDouble(),
      shape: RoundedRectangleBorder(borderRadius: panelRadius),
      titleTextStyle: horonTextTheme.headlineSmall?.copyWith(color: scheme.onSurface),
      contentTextStyle: horonTextTheme.bodyMedium?.copyWith(color: scheme.onSurfaceVariant),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: scheme.surfaceContainer,
      surfaceTintColor: Colors.transparent,
      indicatorColor: scheme.secondaryContainer,
      elevation: 0,
      labelTextStyle: WidgetStatePropertyAll<TextStyle?>(horonTextTheme.labelMedium),
    ),
    navigationRailTheme: NavigationRailThemeData(
      backgroundColor: scheme.surfaceContainer,
      indicatorColor: scheme.secondaryContainer,
      selectedIconTheme: IconThemeData(color: scheme.onSecondaryContainer),
      unselectedIconTheme: IconThemeData(color: scheme.onSurfaceVariant),
      selectedLabelTextStyle: horonTextTheme.labelMedium?.copyWith(color: scheme.onSurface),
      unselectedLabelTextStyle: horonTextTheme.labelMedium?.copyWith(color: scheme.onSurfaceVariant),
    ),
    inputDecorationTheme: InputDecorationThemeData(
      filled: true,
      fillColor: scheme.surfaceContainer,
      contentPadding: const EdgeInsets.symmetric(horizontal: HoronSpace.s4, vertical: HoronSpace.s3),
      border: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: scheme.outline),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: scheme.outline),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: data.ring, width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: scheme.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: scheme.error, width: 2),
      ),
    ),
    bottomSheetTheme: BottomSheetThemeData(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(HoronRadiusRole.panel))),
    ),
    listTileTheme: ListTileThemeData(
      iconColor: scheme.onSurfaceVariant,
      textColor: scheme.onSurface,
      selectedTileColor: scheme.secondaryContainer,
      selectedColor: scheme.onSecondaryContainer,
      // 목록 항목이 쓰는 `radius.md`를 `control` 역할이 같은 값으로 가리킵니다.
      shape: RoundedRectangleBorder(borderRadius: controlRadius),
    ),
    dividerTheme: DividerThemeData(color: scheme.outline, thickness: 1, space: 1),
  );
}

/// 테마에서 horon 슬롯을 읽는 접근자입니다.
abstract final class HoronTheme {
  /// [context]의 [HoronThemeData]를 돌려줍니다.
  ///
  /// 없으면 [StateError]를 던집니다. 라이트 값으로 조용히 떨어지지 않는 이유는
  /// 그런 fallback이 다크 화면에 라이트 금색을 칠하고도 테스트를 통과시키기
  /// 때문입니다. 테마는 [horonTheme]로 조립해야 합니다.
  static HoronThemeData of(BuildContext context) {
    final HoronThemeData? data = Theme.of(context).extension<HoronThemeData>();
    if (data == null) {
      throw StateError(
        'No HoronThemeData in the ambient Theme. Build the app theme with '
        'horonTheme(brightness) so the extension is registered; components read '
        'ring, glass, chart and sidebar colours from it and there is no fallback.',
      );
    }
    return data;
  }
}
