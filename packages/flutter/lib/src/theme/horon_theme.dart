// 생성된 토큰과 Material 테마 사이의 다리입니다.
//
// 색, 타이포, 글래스, 반경, 간격, 그림자, 브레이크포인트, 문구를 하나의 확장
// ([HoronThemeData])에 묶음으로 들고 있습니다. 컴포넌트는
// `HoronTheme.of(context).colors.textPrimary`처럼 묶음에서 값을 읽고, 원시 상수나
// 색 리터럴을 직접 쓰지 않습니다. 값은 전부 `horon_tokens.g.dart`에서 옵니다.
//
// `ColorScheme.fromSeed`는 쓰지 않습니다. 시드에서 파생한 슬롯은 디자인 토큰에 없는
// 색을 만들어 내고, 그러면 웹과 Flutter가 같은 화면에서 다른 색을 그립니다.
//
// `ColorScheme.background`·`onBackground`·`surfaceVariant`는 Flutter 3.18에서 폐기됐고
// `surface`·`onSurface`·`surfaceContainerHighest`가 그 자리를 대신합니다. 이 파일은
// 폐기 슬롯을 쓰지 않습니다. 폐기 멤버를 쓰면 `dart analyze --fatal-infos`가 실패합니다.

import 'package:flutter/material.dart';

import '../contracts/horon_strings.dart';
import '../tokens/horon_tokens.g.dart';

/// 반경 값 묶음입니다.
///
/// `scale.ts` `radius`의 단계 이름을 그대로 씁니다. 그래서 React의 `rounded-md`는
/// `HoronTheme.of(context).radius.md`가 됩니다. v1의 역할 상수(control, input, card,
/// panel, bubble, pill)는 두지 않았습니다. 다시 만든 React 세트에서 버튼은
/// `rounded-full`, 입력은 `rounded-md`, 카드는 `rounded-xl`을 쓰므로 그 역할 이름이
/// 더는 실제 컴포넌트를 가리키지 않기 때문입니다.
final class HoronRadiusSpec {
  /// 단계별 값을 받는 생성자입니다. 생략하면 토큰 값입니다.
  const HoronRadiusSpec({
    this.none = HoronRadius.none,
    this.xs = HoronRadius.xs,
    this.sm = HoronRadius.sm,
    this.md = HoronRadius.md,
    this.lg = HoronRadius.lg,
    this.xl = HoronRadius.xl,
    this.xl2 = HoronRadius.xl2,
    this.full = HoronRadius.full,
  });

  /// `rounded-none`에 대응하는 0입니다.
  final double none;

  /// `rounded-xs` — 6.
  final double xs;

  /// `rounded-sm` — 8.
  final double sm;

  /// `rounded-md` — 12. 입력 필드와 대부분의 인라인 컨트롤이 씁니다.
  final double md;

  /// `rounded-lg` — 14.
  final double lg;

  /// `rounded-xl` — 20. 카드와 다이얼로그가 씁니다.
  final double xl;

  /// `rounded-2xl` — 16. 토큰에서 20보다 작은 값입니다.
  final double xl2;

  /// `rounded-full` — 9999. 버튼과 칩처럼 완전히 둥근 표면이 씁니다.
  final double full;
}

/// 간격 값 묶음입니다.
///
/// 이름은 Tailwind 간격 단위입니다. 단위 1은 4px이므로 `gap-1.5`는 [s1_5](6px),
/// `px-4`는 [s4](16px)입니다.
final class HoronSpaceSpec {
  /// 단계별 값을 받는 생성자입니다. 생략하면 토큰 값입니다.
  const HoronSpaceSpec({
    this.s0_5 = HoronSpace.s0_5,
    this.s1 = HoronSpace.s1,
    this.s1_5 = HoronSpace.s1_5,
    this.s2 = HoronSpace.s2,
    this.s2_5 = HoronSpace.s2_5,
    this.s3 = HoronSpace.s3,
    this.s3_5 = HoronSpace.s3_5,
    this.s4 = HoronSpace.s4,
    this.s5 = HoronSpace.s5,
    this.s6 = HoronSpace.s6,
    this.s8 = HoronSpace.s8,
  });

  /// `gap-0.5` — 2.
  final double s0_5;

  /// `gap-1` — 4. Tailwind 간격 단위 하나의 크기입니다.
  final double s1;

  /// `gap-1.5` — 6.
  final double s1_5;

  /// `gap-2` — 8.
  final double s2;

  /// `gap-2.5` — 10.
  final double s2_5;

  /// `gap-3` — 12.
  final double s3;

  /// `gap-3.5` — 14.
  final double s3_5;

  /// `gap-4`, `p-4` — 16.
  final double s4;

  /// `gap-5` — 20.
  final double s5;

  /// `gap-6` — 24.
  final double s6;

  /// `gap-8` — 32.
  final double s8;

  /// Tailwind 간격 단위 [units]를 논리 픽셀로 바꿉니다.
  ///
  /// 단위 1은 [s1](4px)입니다. 토큰 단계에 없는 값은 이 함수로 계산하고, 계산한
  /// 이유(reinterpreted React 클래스)를 컴포넌트 파일의 주석으로 남깁니다.
  /// 예: `h-5.5` = `space.step(5.5)` = 22, `size-4.5` = `space.step(4.5)` = 18.
  double step(double units) => units * s1;
}

/// 그림자 값 묶음입니다.
final class HoronShadowSpec {
  /// 그림자를 받는 생성자입니다. 생략하면 토큰 값입니다.
  const HoronShadowSpec({this.popover = HoronShadow.popover, this.palette = HoronShadow.palette});

  /// `shadow-popover` — 메뉴, 셀렉트, 팝오버가 쓰는 그림자입니다.
  final List<BoxShadow> popover;

  /// `shadow-palette` — 커맨드 팔레트가 쓰는 더 깊은 그림자입니다.
  final List<BoxShadow> palette;
}

/// 레이아웃 브레이크포인트 묶음입니다.
///
/// `scale.ts`에는 브레이크포인트가 없습니다. React 세트가 컴파일되는 Tailwind v4
/// 기본값이므로, 컴포넌트가 `md:`·`lg:`로 바뀌는 지점과 같은 값을 씁니다.
final class HoronBreakpoints {
  /// 단계별 값을 받는 생성자입니다. 생략하면 토큰 값입니다.
  const HoronBreakpoints({
    this.sm = HoronBreakpoint.sm,
    this.md = HoronBreakpoint.md,
    this.lg = HoronBreakpoint.lg,
    this.xl = HoronBreakpoint.xl,
    this.xl2 = HoronBreakpoint.xl2,
  });

  /// `sm:` — 640.
  final double sm;

  /// `md:` — 768. 폰 가로와 태블릿 세로를 가르는 지점입니다.
  final double md;

  /// `lg:` — 1024. 태블릿 가로와 데스크톱을 가르는 지점입니다.
  final double lg;

  /// `xl:` — 1280.
  final double xl;

  /// `2xl:` — 1536.
  final double xl2;
}

/// [ColorScheme]이 담지 못하는 horon 토큰 묶음입니다.
///
/// 색은 [colors], 타이포는 [text], 글래스 레시피는 [glass], 반경·간격·그림자·브레이크포인트는
/// 각각의 묶음에서 읽습니다. 컴포넌트는 원시 상수 대신 `HoronTheme.of(context)`로 이 객체를
/// 읽습니다.
class HoronThemeData extends ThemeExtension<HoronThemeData> {
  /// 묶음을 모두 받는 생성자입니다.
  const HoronThemeData({
    required this.brightness,
    required this.colors,
    required this.text,
    required this.glass,
    required this.radius,
    required this.space,
    required this.shadows,
    required this.breakpoints,
    required this.strings,
  });

  /// 라이트 밝기의 토큰 묶음입니다.
  static const HoronThemeData light = HoronThemeData(
    brightness: Brightness.light,
    colors: HoronColors.light,
    text: HoronTextStyles(),
    glass: HoronGlassTokens(),
    radius: HoronRadiusSpec(),
    space: HoronSpaceSpec(),
    shadows: HoronShadowSpec(),
    breakpoints: HoronBreakpoints(),
    strings: HoronStringsEn(),
  );

  /// 다크 밝기의 토큰 묶음입니다.
  static const HoronThemeData dark = HoronThemeData(
    brightness: Brightness.dark,
    colors: HoronColors.dark,
    text: HoronTextStyles(),
    glass: HoronGlassTokens(),
    radius: HoronRadiusSpec(),
    space: HoronSpaceSpec(),
    shadows: HoronShadowSpec(),
    breakpoints: HoronBreakpoints(),
    strings: HoronStringsEn(),
  );

  /// 이 묶음이 그리는 밝기입니다.
  final Brightness brightness;

  /// 의미 색 전체입니다. 이름은 `color.ts`의 토큰 이름을 카멜 표기로 옮긴 것입니다.
  final HoronColors colors;

  /// 13가지 타이포 스타일입니다. 값은 모바일 플랫폼 크기입니다.
  final HoronTextStyles text;

  /// 리퀴드 글래스 레시피입니다. 호스트 높이에 따른 블러·여백은 토큰의 함수가 계산합니다.
  final HoronGlassTokens glass;

  /// 반경 단계입니다.
  final HoronRadiusSpec radius;

  /// 간격 단계입니다.
  final HoronSpaceSpec space;

  /// 그림자입니다.
  final HoronShadowSpec shadows;

  /// 레이아웃 브레이크포인트입니다.
  final HoronBreakpoints breakpoints;

  /// 컴포넌트가 화면에 쓰는 문구입니다. 호스트 앱이 [HoronStrings] 구현을 골라 넘깁니다.
  final HoronStrings strings;

  @override
  HoronThemeData copyWith({
    Brightness? brightness,
    HoronColors? colors,
    HoronTextStyles? text,
    HoronGlassTokens? glass,
    HoronRadiusSpec? radius,
    HoronSpaceSpec? space,
    HoronShadowSpec? shadows,
    HoronBreakpoints? breakpoints,
    HoronStrings? strings,
  }) {
    return HoronThemeData(
      brightness: brightness ?? this.brightness,
      colors: colors ?? this.colors,
      text: text ?? this.text,
      glass: glass ?? this.glass,
      radius: radius ?? this.radius,
      space: space ?? this.space,
      shadows: shadows ?? this.shadows,
      breakpoints: breakpoints ?? this.breakpoints,
      strings: strings ?? this.strings,
    );
  }

  /// 밝기 사이를 잇는 애니메이션 값입니다.
  ///
  /// 색은 [HoronColors.lerp]로 보간하고, 나머지 묶음은 값이 밝기와 무관하므로
  /// 중간 지점에서 한쪽을 그대로 씁니다.
  @override
  HoronThemeData lerp(covariant HoronThemeData? other, double t) {
    if (other == null) return this;
    return HoronThemeData(
      brightness: t < 0.5 ? brightness : other.brightness,
      colors: HoronColors.lerp(colors, other.colors, t),
      text: t < 0.5 ? text : other.text,
      glass: t < 0.5 ? glass : other.glass,
      radius: t < 0.5 ? radius : other.radius,
      space: t < 0.5 ? space : other.space,
      shadows: t < 0.5 ? shadows : other.shadows,
      breakpoints: t < 0.5 ? breakpoints : other.breakpoints,
      strings: t < 0.5 ? strings : other.strings,
    );
  }
}

/// 라이트 밝기의 horon [ColorScheme]입니다.
///
/// 슬롯마다 토큰 하나를 직접 대응합니다. 그래서 Material 위젯(다이얼로그, 툴팁, 스낵바)도
/// 웹과 같은 색을 그립니다. `surfaceTint`는 투명입니다. horon은 그림자로 깊이를 만들고
/// elevation 틴트를 쓰지 않기 때문입니다.
const ColorScheme horonLightColorScheme = ColorScheme(
  brightness: Brightness.light,
  primary: HoronLightColors.interactivePrimary,
  onPrimary: HoronLightColors.interactiveOnPrimary,
  primaryContainer: HoronLightColors.bgSubtle,
  onPrimaryContainer: HoronLightColors.textPrimary,
  secondary: HoronLightColors.bgSubtle,
  onSecondary: HoronLightColors.textPrimary,
  secondaryContainer: HoronLightColors.bgSubtle,
  onSecondaryContainer: HoronLightColors.textPrimary,
  error: HoronLightColors.interactiveDanger,
  onError: HoronLightColors.interactiveOnDanger,
  errorContainer: HoronLightColors.bgDanger,
  onErrorContainer: HoronLightColors.textDanger,
  surface: HoronLightColors.bgSurface,
  onSurface: HoronLightColors.textPrimary,
  surfaceDim: HoronLightColors.bgSubtle,
  surfaceBright: HoronLightColors.bgDefault,
  surfaceContainerLowest: HoronLightColors.bgDefault,
  surfaceContainerLow: HoronLightColors.bgSurface,
  surfaceContainer: HoronLightColors.bgSubtle,
  surfaceContainerHigh: HoronLightColors.bgSubtle,
  surfaceContainerHighest: HoronLightColors.bgSubtle,
  onSurfaceVariant: HoronLightColors.textSecondary,
  outline: HoronLightColors.borderDefault,
  outlineVariant: HoronLightColors.borderStrong,
  shadow: HoronLightColors.bgScrim,
  scrim: HoronLightColors.bgScrim,
  inverseSurface: HoronLightColors.surfaceInk,
  onInverseSurface: HoronLightColors.textOnInk,
  inversePrimary: HoronLightColors.textInverse,
  surfaceTint: Colors.transparent,
);

/// 다크 밝기의 horon [ColorScheme]입니다.
const ColorScheme horonDarkColorScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: HoronDarkColors.interactivePrimary,
  onPrimary: HoronDarkColors.interactiveOnPrimary,
  primaryContainer: HoronDarkColors.bgSubtle,
  onPrimaryContainer: HoronDarkColors.textPrimary,
  secondary: HoronDarkColors.bgSubtle,
  onSecondary: HoronDarkColors.textPrimary,
  secondaryContainer: HoronDarkColors.bgSubtle,
  onSecondaryContainer: HoronDarkColors.textPrimary,
  error: HoronDarkColors.interactiveDanger,
  onError: HoronDarkColors.interactiveOnDanger,
  errorContainer: HoronDarkColors.bgDanger,
  onErrorContainer: HoronDarkColors.textDanger,
  surface: HoronDarkColors.bgSurface,
  onSurface: HoronDarkColors.textPrimary,
  surfaceDim: HoronDarkColors.bgDefault,
  surfaceBright: HoronDarkColors.bgSubtle,
  surfaceContainerLowest: HoronDarkColors.bgDefault,
  surfaceContainerLow: HoronDarkColors.bgSurface,
  surfaceContainer: HoronDarkColors.bgSubtle,
  surfaceContainerHigh: HoronDarkColors.bgSubtle,
  surfaceContainerHighest: HoronDarkColors.bgSubtle,
  onSurfaceVariant: HoronDarkColors.textSecondary,
  outline: HoronDarkColors.borderDefault,
  outlineVariant: HoronDarkColors.borderStrong,
  shadow: HoronDarkColors.bgScrim,
  scrim: HoronDarkColors.bgScrim,
  inverseSurface: HoronDarkColors.surfaceInk,
  onInverseSurface: HoronDarkColors.textOnInk,
  inversePrimary: HoronDarkColors.textInverse,
  surfaceTint: Colors.transparent,
);

/// 토큰 타이포에서 Material [TextTheme]을 만듭니다.
///
/// 13가지 스타일을 Material의 15개 슬롯에 가까운 뜻으로 배치합니다. 색은 비워 두므로
/// [ThemeData]가 활성 밝기의 `onSurface`를 적용합니다.
TextTheme horonTextTheme(HoronTextStyles text) {
  return TextTheme(
    displayLarge: text.displayLg,
    displayMedium: text.displayMd,
    displaySmall: text.titleLg,
    headlineLarge: text.titleLg,
    headlineMedium: text.titleMd,
    headlineSmall: text.titleSm,
    titleLarge: text.titleMd,
    titleMedium: text.labelLg,
    titleSmall: text.labelMd,
    bodyLarge: text.bodyLg,
    bodyMedium: text.bodyMd,
    bodySmall: text.bodySm,
    labelLarge: text.labelLg,
    labelMedium: text.labelMd,
    labelSmall: text.labelSm,
  );
}

/// [brightness]의 horon [ThemeData]입니다.
///
/// 라이트와 다크는 서로 독립한 토큰 묶음입니다. [ColorScheme], [HoronThemeData],
/// Material 하위 테마가 모두 같은 묶음에서 값을 읽으므로 다크가 라이트 값을 빌려 쓰지
/// 않습니다. 반경과 간격은 토큰 단계를 읽습니다. 그래야 이후 컴포넌트 웨이브가 같은
/// 숫자를 두 번 적지 않습니다.
ThemeData horonTheme(Brightness brightness) {
  final bool isDark = brightness == Brightness.dark;
  final ColorScheme scheme = isDark ? horonDarkColorScheme : horonLightColorScheme;
  final HoronThemeData data = isDark ? HoronThemeData.dark : HoronThemeData.light;
  final HoronColors colors = data.colors;
  final HoronRadiusSpec radius = data.radius;
  final HoronSpaceSpec space = data.space;

  final BorderRadius controlRadius = BorderRadius.circular(radius.full);
  final BorderRadius fieldRadius = BorderRadius.circular(radius.md);
  final BorderRadius surfaceRadius = BorderRadius.circular(radius.xl);

  return ThemeData(
    brightness: brightness,
    colorScheme: scheme,
    textTheme: horonTextTheme(data.text),
    extensions: <ThemeExtension<dynamic>>[data],
    scaffoldBackgroundColor: colors.bgDefault,
    appBarTheme: AppBarThemeData(
      backgroundColor: colors.bgDefault,
      foregroundColor: colors.textPrimary,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: false,
      titleTextStyle: data.text.titleMd.copyWith(color: colors.textPrimary),
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
      color: colors.bgSurface,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: surfaceRadius,
        side: BorderSide(color: colors.borderDefault),
      ),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: colors.bgSurface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: surfaceRadius),
      titleTextStyle: data.text.titleMd.copyWith(color: colors.textPrimary),
      contentTextStyle: data.text.bodyMd.copyWith(color: colors.textSecondary),
    ),
    dividerTheme: DividerThemeData(color: colors.borderDefault, thickness: 1, space: 1),
    inputDecorationTheme: InputDecorationThemeData(
      filled: true,
      fillColor: colors.bgSurface,
      contentPadding: EdgeInsets.symmetric(horizontal: space.s3_5, vertical: space.s2_5),
      border: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: colors.borderDefault),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: colors.borderDefault),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: colors.borderFocus, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: colors.borderDanger),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: fieldRadius,
        borderSide: BorderSide(color: colors.borderDanger, width: 2),
      ),
    ),
    listTileTheme: ListTileThemeData(
      iconColor: colors.textSecondary,
      textColor: colors.textPrimary,
      selectedTileColor: colors.bgSubtle,
      selectedColor: colors.textPrimary,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(radius.md)),
    ),
  );
}

/// 테마에서 horon 토큰 묶음을 읽는 접근자입니다.
abstract final class HoronTheme {
  /// [context]의 [HoronThemeData]를 돌려줍니다.
  ///
  /// 없으면 [StateError]를 던집니다. 라이트 값으로 조용히 떨어지지 않는 이유는 그런
  /// fallback이 다크 화면에 라이트 색을 칠하고도 테스트를 통과시키기 때문입니다.
  /// 테마는 [horonTheme]로 조립해야 합니다.
  static HoronThemeData of(BuildContext context) {
    final HoronThemeData? data = Theme.of(context).extension<HoronThemeData>();
    if (data == null) {
      throw StateError(
        'No HoronThemeData in the ambient Theme. Build the app theme with '
        'horonTheme(brightness) so the extension is registered; components read '
        'colors, text, glass, radius, space and shadows from it and there is no fallback.',
      );
    }
    return data;
  }
}
