import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

/// 갤러리의 임시 [ThemeData]입니다.
///
/// todo 3 replaces this with horonTheme(). 그때까지 생성된 토큰에서 직접 색을 채웁니다.
/// 컴포넌트 테마는 넣지 않습니다. 그 자리는 todo 3의 `horonTheme`이 소유합니다.
ThemeData galleryTheme(Brightness brightness) {
  final ColorScheme scheme = brightness == Brightness.dark
      ? _darkScheme
      : _lightScheme;
  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
    fontFamily: _bodyFont,
    fontFamilyFallback: const <String>[_latinFont],
    extensions: const <ThemeExtension<dynamic>>[],
  );
}

const String _bodyFont = 'Pretendard';
const String _latinFont = 'Geist';

const ColorScheme _lightScheme = ColorScheme(
  brightness: Brightness.light,
  primary: HoronLightColors.primary,
  onPrimary: HoronLightColors.primaryForeground,
  primaryContainer: HoronLightColors.secondary,
  onPrimaryContainer: HoronLightColors.secondaryForeground,
  secondary: HoronLightColors.secondary,
  onSecondary: HoronLightColors.secondaryForeground,
  secondaryContainer: HoronLightColors.muted,
  onSecondaryContainer: HoronLightColors.foreground,
  tertiary: HoronLightColors.brandGold,
  onTertiary: HoronLightColors.brandInk,
  error: HoronLightColors.destructive,
  onError: HoronLightColors.destructiveForeground,
  surface: HoronLightColors.background,
  onSurface: HoronLightColors.foreground,
  surfaceDim: HoronLightColors.background,
  surfaceBright: HoronLightColors.card,
  surfaceContainerLowest: HoronLightColors.card,
  surfaceContainerLow: HoronLightColors.card,
  surfaceContainer: HoronLightColors.muted,
  surfaceContainerHigh: HoronLightColors.accent,
  surfaceContainerHighest: HoronLightColors.secondary,
  onSurfaceVariant: HoronLightColors.mutedForeground,
  outline: HoronLightColors.border,
  outlineVariant: HoronLightColors.border,
  shadow: HoronPalette.sand1200Shadow,
  scrim: HoronPalette.sand1200Scrim,
  inverseSurface: HoronLightColors.foreground,
  onInverseSurface: HoronLightColors.background,
  inversePrimary: HoronLightColors.primaryForeground,
  surfaceTint: HoronLightColors.primary,
);

const ColorScheme _darkScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: HoronDarkColors.primary,
  onPrimary: HoronDarkColors.primaryForeground,
  primaryContainer: HoronDarkColors.secondary,
  onPrimaryContainer: HoronDarkColors.secondaryForeground,
  secondary: HoronDarkColors.secondary,
  onSecondary: HoronDarkColors.secondaryForeground,
  secondaryContainer: HoronDarkColors.muted,
  onSecondaryContainer: HoronDarkColors.foreground,
  tertiary: HoronDarkColors.brandGold,
  onTertiary: HoronDarkColors.brandInk,
  error: HoronDarkColors.destructive,
  onError: HoronDarkColors.destructiveForeground,
  surface: HoronDarkColors.background,
  onSurface: HoronDarkColors.foreground,
  surfaceDim: HoronDarkColors.background,
  surfaceBright: HoronDarkColors.card,
  surfaceContainerLowest: HoronDarkColors.card,
  surfaceContainerLow: HoronDarkColors.card,
  surfaceContainer: HoronDarkColors.muted,
  surfaceContainerHigh: HoronDarkColors.accent,
  surfaceContainerHighest: HoronDarkColors.secondary,
  onSurfaceVariant: HoronDarkColors.mutedForeground,
  outline: HoronDarkColors.border,
  outlineVariant: HoronDarkColors.border,
  shadow: HoronPalette.sand1200Shadow,
  scrim: HoronPalette.sand1200Scrim,
  inverseSurface: HoronDarkColors.foreground,
  onInverseSurface: HoronDarkColors.background,
  inversePrimary: HoronDarkColors.primaryForeground,
  surfaceTint: HoronDarkColors.primary,
);
