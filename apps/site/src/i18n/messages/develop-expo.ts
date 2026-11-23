import { defineMessages } from "@/i18n";

/**
 * Copy for the Expo docs section: the introduction and the six pages beside
 * it. Every fact here comes from `packages/expo` (README, `package.json`,
 * `src/provider.tsx`, `src/lib/glass-surface.tsx`, `src/lib/glass-support.ts`,
 * `src/lib/insets.ts`, `src/lib/text.tsx`) and the gallery in
 * `apps/expo-gallery`.
 */

/** `/develop/expo`: what the package is, a four-step start and the page map. */
export const expoIntroMessages = defineMessages({
  title: { ko: "소개", en: "Introduction" },
  description: {
    ko: "@horon-ai/expo는 같은 84개 컴포넌트를 React Native 뷰 위에 옮긴 패키지입니다. Expo SDK 58 앱에서 iOS와 Android를 한 코드로 그립니다.",
    en: "@horon-ai/expo ports the same 84 components onto React Native views, so one Expo SDK 58 app draws on iOS and Android.",
  },

  packageHeading: { ko: "패키지 구성", en: "What the package is" },
  packageBody: {
    ko: "컴포넌트의 모양과 값은 @horon-ai/react와 같습니다. 슬러그, export 이름, variant 값, @horon-ai/tokens의 색과 치수가 모두 같고, 다른 것은 그리는 요소입니다. div와 button 대신 React Native의 View와 Pressable을 쓰고, className 대신 style을 받습니다.",
    en: "Component looks and values match @horon-ai/react: same slugs, same export names, same variant values and the same @horon-ai/tokens colours and dimensions. Only the elements differ, with React Native View and Pressable in place of div and button and style in place of className.",
  },
  itemComponents: {
    ko: "84개 컴포넌트: 버튼과 입력에서 대화상자, 데이터 표, 에이전트 패널까지 한 진입점에서 가져옵니다.",
    en: "84 components: buttons and fields through dialogs, data tables and agent panels, all from one entry.",
  },
  itemSameShape: {
    ko: "같은 이름, 같은 값: React에서 쓰던 슬러그와 variant를 그대로 부르면 같은 모양이 나옵니다.",
    en: "Same names, same values: the slug and variant you used in React draw the same shape here.",
  },
  itemPlatforms: {
    ko: "iOS와 Android: 한 번 작성한 트리가 두 플랫폼에서 그려지고, Expo의 웹 실행에서는 react-native-web이 같은 트리를 그립니다.",
    en: "iOS and Android: one tree renders on both, and Expo's web run draws the same tree through react-native-web.",
  },
  itemSource: {
    ko: "expo 58, expo-glass-effect, expo-clipboard, expo-haptics, react-native-safe-area-context, react-native-svg가 피어 의존성입니다. 패키지는 TypeScript 소스를 그대로 배포하고, 직접 의존하는 것은 @horon-ai/tokens 하나입니다.",
    en: "expo 58, expo-glass-effect, expo-clipboard, expo-haptics, react-native-safe-area-context and react-native-svg are peers; @horon-ai/tokens is the one direct dependency. The package ships TypeScript source.",
  },

  quickHeading: { ko: "빠른 시작", en: "Quick start" },
  quickBody: {
    ko: "네 단계입니다. 패키지를 더하고, 글꼴을 등록하고, SafeAreaProvider와 HoronProvider로 트리를 감싸고, 컴포넌트를 씁니다.",
    en: "Four steps: add the packages, register the fonts, wrap the tree in SafeAreaProvider and HoronProvider, then use a component.",
  },
  stepPackages: { ko: "패키지 설치", en: "Install the packages" },
  stepFonts: { ko: "글꼴 등록", en: "Register the fonts" },
  stepFontsBody: {
    ko: "컴포넌트는 토큰 첫 글꼴인 Pretendard Variable과 Geist Mono Variable로 글자를 그립니다. expo-font에 같은 이름으로 등록하고, 다른 이름으로 올렸으면 HoronProvider의 fonts로 알려 줍니다.",
    en: "Components draw text in the token first families, Pretendard Variable and Geist Mono Variable. Register them with expo-font under those names, and pass other names through HoronProvider's fonts.",
  },
  stepProviders: { ko: "루트 감싸기", en: "Wrap the root" },
  stepProvidersBody: {
    ko: "트리를 SafeAreaProvider 안의 HoronProvider로 감쌉니다. Expo Router를 쓰면 SafeAreaProvider는 라우터가 이미 넣으므로 HoronProvider만 감쌉니다.",
    en: "Wrap the tree in HoronProvider inside SafeAreaProvider. With Expo Router the router already mounts SafeAreaProvider, so HoronProvider alone goes in.",
  },
  stepUse: { ko: "첫 컴포넌트", en: "Use a component" },

  docsHeading: { ko: "문서", en: "Docs" },
  docsBody: {
    ko: "이 아래 페이지가 설치에서 시작해 테마, 유리 표면, 안전 영역, React와의 차이, 갤러리 순서로 이어집니다.",
    en: "The pages below start at installation and continue through theme, liquid glass, safe areas, the differences from React and the gallery.",
  },
});

/** `/develop/expo/installation`: packages, fonts, the root providers and what ships. */
export const expoInstallationMessages = defineMessages({
  title: { ko: "설치", en: "Installation" },
  description: {
    ko: "패키지와 네이티브 의존성을 넣고 글꼴을 등록한 뒤 SafeAreaProvider와 HoronProvider로 트리를 감쌉니다.",
    en: "Add the package and its native dependencies, register the fonts, then wrap the tree in SafeAreaProvider and HoronProvider.",
  },

  packagesHeading: { ko: "패키지 추가", en: "Add the packages" },
  packagesBody: {
    ko: "컴포넌트 패키지와 네이티브 의존성을 넣습니다. 유리는 expo-glass-effect, 클립보드는 expo-clipboard, 눌림 진동은 expo-haptics, 파일 선택은 expo-document-picker, 안전 영역은 react-native-safe-area-context, 아이콘은 react-native-svg가 맡습니다. expo install을 쓰면 앱의 SDK에 맞는 빌드가 들어갑니다.",
    en: "Add the component package and its native dependencies: expo-glass-effect for glass, expo-clipboard for copy actions, expo-haptics for press feedback, expo-document-picker for file picking, react-native-safe-area-context for insets and react-native-svg for icons. expo install picks the build that matches the app's SDK.",
  },

  fontsHeading: { ko: "글꼴", en: "Fonts" },
  fontsBody: {
    ko: "컴포넌트는 @horon-ai/tokens의 첫 글꼴 이름으로 글자를 그립니다. 그 이름이 Pretendard Variable과 Geist Mono Variable입니다. expo-font에 같은 이름으로 등록하면 그대로 쓰이고, 다른 이름으로 올렸다면 HoronProvider의 fonts에 sans와 mono를 넘깁니다. 글꼴 파일과 라이선스는 apps/expo-gallery/assets/fonts에 있습니다.",
    en: "Components draw text in the first family of each @horon-ai/tokens stack, which is Pretendard Variable and Geist Mono Variable. Register them under those names with expo-font and nothing else is needed; if you registered other names, pass them as sans and mono in HoronProvider's fonts. The font files and their licences live in apps/expo-gallery/assets/fonts.",
  },

  providerHeading: { ko: "루트 설정", en: "Root setup" },
  providerBody: {
    ko: "트리를 SafeAreaProvider 안의 HoronProvider로 감쌉니다. 글꼴을 읽은 뒤 화면을 그리고, 읽는 동안에는 null을 돌려줍니다. Expo Router를 쓰면 SafeAreaProvider는 라우터가 이미 넣으므로 HoronProvider만 감쌉니다.",
    en: "Wrap the tree in HoronProvider inside SafeAreaProvider and draw once the fonts have loaded, returning null while they do. With Expo Router the router already mounts SafeAreaProvider, so HoronProvider alone goes in.",
  },

  sourceHeading: { ko: "배포 형태", en: "What ships" },
  sourceBody: {
    ko: '패키지는 TypeScript 소스를 그대로 배포합니다. exports가 "."과 "./components/*"를 내주고, 번들러가 node_modules 안의 소스를 컴파일합니다. src/index.ts는 배럴이고 scripts/integrate가 생성하므로 손으로 고치지 않습니다.',
    en: 'The package ships TypeScript source. Its exports map "." and "./components/*", and your bundler compiles the source inside node_modules. src/index.ts is a barrel generated by scripts/integrate, so it is not edited by hand.',
  },

  checkHeading: { ko: "설치 확인", en: "Check the install" },
  checkBody: {
    ko: "Button 하나를 띄웁니다. 누르면 onPress가 불리고 알약 모양에 토큰 색으로 그려지면 설치가 끝났습니다.",
    en: "Render one Button. A press firing onPress, with the pill drawn in the token colours, means the install is done.",
  },
});

/** `/develop/expo/theming`: the provider props table and the theme hook. */
export const expoThemingMessages = defineMessages({
  title: { ko: "테마와 플랫폼", en: "Theme and platform" },
  description: {
    ko: "HoronProvider가 팔레트와 글자 크기판, 유리 방식을 정하고 useHoronTheme이 그 값을 읽습니다.",
    en: "HoronProvider settles the palette, the type board and the glass mode, and useHoronTheme reads them.",
  },

  providerHeading: { ko: "테마 루트", en: "The theme root" },
  providerBody: {
    ko: "모든 트리를 HoronProvider로 감쌉니다. 루트가 팔레트 배경을 칠하고, 글자 크기판을 고르고, 접근성 설정을 읽어 유리 방식을 정합니다. 값이 바뀌면 useHoronTheme로 읽는 컴포넌트가 다시 그려집니다.",
    en: "Wrap every tree in HoronProvider. The root paints the palette background, selects the type board, reads the accessibility settings and settles the glass mode; when a value changes, every component that reads it through useHoronTheme re-renders.",
  },

  propsHeading: { ko: "prop과 기본값", en: "Props and defaults" },
  columnProp: { ko: "prop", en: "prop" },
  columnDefault: { ko: "기본값", en: "Default" },
  columnMeaning: { ko: "뜻", en: "Meaning" },
  rowMotionDefault: { ko: "OS 설정", en: "OS setting" },
  rowFontsDefault: { ko: "토큰 첫 글꼴", en: "Token first family" },
  rowSchemeMeaning: {
    ko: "화면 모드. light, dark, system 중 하나이고 system은 OS 설정을 실시간으로 따라갑니다.",
    en: "Which palette to paint. light, dark or system; system follows the OS setting live.",
  },
  rowPlatformMeaning: {
    ko: "글자 크기판. web, desktop, mobile 중 하나이고 폰과 태블릿은 mobile 열을 씁니다.",
    en: "The typography board. web, desktop or mobile; phones and tablets read the mobile column.",
  },
  rowMotionMeaning: {
    ko: "비워 두면 OS의 동작 줄이기를 따르고, true면 애니메이션이 끝 상태로 바로 갑니다.",
    en: "Leave it unset to follow the OS Reduce Motion setting; true draws every animation in its end state.",
  },
  rowTouchMeaning: {
    ko: "44pt보다 작은 컨트롤에 hitSlop을 붙여 손가락 타깃을 44pt로 맞춥니다. 그려지는 크기는 그대로입니다.",
    en: "Adds hitSlop to controls under 44pt so the finger target reaches 44pt while the paint keeps its size.",
  },
  rowGlassMeaning: {
    ko: "auto는 네이티브 Liquid Glass가 가능한 곳에서 그것을, frost는 어디서나 대체 모양을 씁니다.",
    en: "auto paints native Liquid Glass wherever it is available; frost uses the fallback everywhere.",
  },
  rowHapticsMeaning: {
    ko: "누를 때 expo-haptics로 짧은 진동을 줍니다. 컨트롤마다 haptic으로 종류를 고르고, 트리 전체에서는 이 값을 끕니다.",
    en: "Presses play a short expo-haptics tap. Each control picks its kind through haptic; this flag turns the whole tree off.",
  },
  rowFontsMeaning: {
    ko: "expo-font에 등록한 글꼴 이름을 sans와 mono로 넘깁니다. 비우면 토큰의 첫 글꼴입니다.",
    en: "The family names registered with expo-font, as sans and mono. Unset reads the token first families.",
  },
  rowTextScaleMeaning: {
    ko: "앱 글자 크기 배율. 글자 토큰의 크기와 줄 높이에 곱하고, OS 글자 확대보다 먼저 적용됩니다.",
    en: "The app text-size multiplier. It scales every type token's size and line height before OS font scaling.",
  },

  schemeHeading: { ko: "scheme", en: "scheme" },
  schemeBody: {
    ko: '"system"이 기본값이고 useColorScheme을 실시간으로 따라갑니다. "light"나 "dark"를 넘기면 OS 설정보다 앱 값이 이기고, 네이티브 유리도 그 값을 colorScheme으로 받습니다.',
    en: '"system" is the default and follows useColorScheme live. A resolved "light" or "dark" wins over the OS setting, and native glass receives it as colorScheme too.',
  },

  platformHeading: { ko: "platform", en: "platform" },
  platformBody: {
    ko: '기본값은 "mobile"입니다. 글자 스타일 13개의 크기와 줄 높이가 그 플랫폼 열로 바뀝니다. 예를 들어 body-md는 Web 16px, Desktop 14px, Mobile 16px입니다.',
    en: 'It defaults to "mobile". The 13 text styles take that platform column\'s size and line height: body-md is 16px on Web, 14px on Desktop and 16px on Mobile.',
  },

  motionHeading: { ko: "reducedMotion", en: "reducedMotion" },
  motionBody: {
    ko: "비우면 OS의 동작 줄이기를 따르고 변경 이벤트도 받습니다. true를 넘기면 모든 애니메이션이 끝 상태로 바로 그려집니다.",
    en: "Unset, it follows the OS Reduce Motion setting including its change event. Pass true and every animation draws in its end state.",
  },

  touchHeading: { ko: "touch", en: "touch" },
  touchBody: {
    ko: '기본값은 true입니다. 32pt와 40pt 컨트롤에는 hitSlop이 붙어 손가락 타깃이 44pt가 되고 그려지는 크기는 그대로입니다. platform="mobile"이 타깃을 키우지는 않습니다. 두 값은 따로 동작합니다.',
    en: 'The default is true. The 32pt and 40pt controls get hitSlop, so the finger target is 44pt while the paint keeps its size. platform="mobile" does not grow a target; the two values are independent.',
  },

  glassHeading: { ko: "glass", en: "glass" },
  glassBody: {
    ko: '"auto"는 expo-glass-effect가 네이티브 유리를 그릴 수 있는 곳에서 그렇게 그리고, 나머지에서는 대체 모양을 씁니다. "frost"는 어디서나 대체 모양을 씁니다. 판정 규칙은 유리 표면 페이지에 있습니다.',
    en: '"auto" paints native Liquid Glass wherever expo-glass-effect reports it and the fallback elsewhere; "frost" forces the fallback everywhere. The rules behind that decision are on the liquid glass page.',
  },

  fontsHeading: { ko: "fonts", en: "fonts" },
  fontsBody: {
    ko: "기본값은 토큰 첫 글꼴인 Pretendard Variable과 Geist Mono Variable입니다. expo-font에 다른 이름으로 올렸다면 fonts={{ sans, mono }}로 알려 줍니다.",
    en: "It defaults to the token first families, Pretendard Variable and Geist Mono Variable. If expo-font registered other names, pass them as fonts={{ sans, mono }}.",
  },

  textScaleHeading: { ko: "textScale", en: "textScale" },
  textScaleBody: {
    ko: "앱 자체의 글자 크기 배율이고 기본값은 1입니다. 글자 토큰 13개의 크기와 줄 높이에 곱하며 OS 글자 확대보다 먼저 적용되므로, 사용자가 앱 설정에서 고른 값에 1.2를 넘기면 body-md가 16px에서 19.2px로 커집니다. 줄 높이도 같은 비율로 늘어 줄 간격이 유지됩니다.",
    en: "The app's own text-size multiplier, 1 by default. It scales the size and line height of all 13 type tokens before OS font scaling, so passing 1.2 for a user's in-app preference takes body-md from 16px to 19.2px. Line height grows by the same factor, so spacing stays proportional.",
  },

  hapticsHeading: { ko: "haptics", en: "haptics" },
  hapticsBody: {
    ko: "켜져 있으면 HoronPressable이 누르는 순간 진동을 한 번 줍니다. 버튼과 행은 light, 스위치와 탭, 세그먼트, 선택 목록은 selection을 쓰고, 스크림처럼 상태를 바꾸지 않는 표면은 none입니다. 비활성 컨트롤은 진동하지 않고, 진동이 없는 기기와 웹에서는 조용히 넘어갑니다.",
    en: "While it is on, HoronPressable plays one tap as the press begins. Buttons and rows use light, switches, tabs, segments and selection lists use selection, and surfaces that change no state, such as a scrim, use none. A disabled control is silent, and a device without a Taptic Engine, or the web, simply skips the call.",
  },

  hookHeading: { ko: "useHoronTheme", en: "useHoronTheme" },
  hookBody: {
    ko: "트리 아래 어디서든 useHoronTheme()가 지금 값을 돌려줍니다. scheme, platform, reducedMotion, reduceTransparency, touch, glass, fonts, colors와 두 함수입니다. color(token)는 토큰 이름을 활성 스킴의 색으로, text(style)는 글자 토큰을 React Native 텍스트 스타일로 바꿉니다. 컴포넌트는 이 값만 읽고 색과 간격을 직접 적지 않습니다.",
    en: "Anywhere below the root, useHoronTheme() returns the current values: scheme, platform, reducedMotion, reduceTransparency, touch, glass, fonts, colors and two lookups. color(token) resolves a token name to the active scheme's colour, text(style) resolves a type token to a React Native text style. Components read only these values and never hard-code colours or spacing.",
  },
  exampleHeading: { ko: "예", en: "Example" },
});

/** `/develop/expo/liquid-glass`: the native and frost branches, overlays and the opacity rule. */
export const expoGlassMessages = defineMessages({
  title: { ko: "유리 표면", en: "Liquid glass" },
  description: {
    ko: "유리는 expo-glass-effect의 GlassView로 그리고, 그릴 수 없는 환경은 frost 채움과 토큰 테두리로 떨어집니다.",
    en: "Glass draws through expo-glass-effect's GlassView, and environments that cannot draw it fall back to the frost fill with the token rim.",
  },

  surfaceHeading: { ko: "GlassSurface", en: "GlassSurface" },
  surfaceBody: {
    ko: "유리를 직접 그리지 않고 expo-glass-effect에 맡깁니다. GlassSurface가 판단을 한곳에서 하고 나머지 컴포넌트는 그것을 씁니다. iOS에서 isLiquidGlassAvailable()과 isGlassEffectAPIAvailable()가 모두 참이고 투명도 줄이기가 꺼져 있을 때만 네이티브입니다. 함수가 예외를 던지면(네이티브 모듈이 없는 예전 바이너리) 대체 모양으로 갑니다.",
    en: "The glass is not drawn by hand; expo-glass-effect owns it, GlassSurface makes the decision in one place and the other components go through it. On iOS it is native only when isLiquidGlassAvailable() and isGlassEffectAPIAvailable() are both true and Reduce Transparency is off. A check that throws, as on an old binary without the native module, reads as unavailable and the fallback paints.",
  },

  environmentHeading: { ko: "환경별 그리는 것", en: "What each environment draws" },
  columnEnvironment: { ko: "환경", en: "Environment" },
  columnDraws: { ko: "그리는 것", en: "What it draws" },
  rowNativeEnvironment: {
    ko: "iOS 26 이상, 투명도 줄이기 꺼짐",
    en: "iOS 26 or later, Reduce Transparency off",
  },
  rowNativeDraws: {
    ko: "GlassView. 모든 단계가 regular 효과이고 thick에는 glass-thick(다크는 glass-fill-strong) 색조가 더해집니다. 유리 층 불투명도는 glass.native[scheme].fillOpacity(라이트 0.75, 다크 0.92)를 따르며 그 위의 내용은 흐려지지 않습니다. glass 재료는 가장자리를 잘라 내지 않아 시스템 굴절 테두리가 보이고, veil은 내용을 모서리에서 잘라 냅니다. 앱 화면 모드는 colorScheme으로 넘어갑니다.",
    en: "A GlassView in the regular effect for every tier; thick adds the glass-thick tint (glass-fill-strong in dark). The glass layer sits at glass.native[scheme].fillOpacity (0.75 in light, 0.92 in dark) behind opaque content. The glass material is not clipped, so the system refraction rim at the edge shows; veil clips its content to the corner. The app scheme goes in as colorScheme.",
  },
  rowFrostEnvironment: {
    ko: 'Android, iOS 26 미만, 투명도 줄이기 켜짐, glass="frost"',
    en: 'Android, iOS before 26, Reduce Transparency on, glass="frost"',
  },
  rowFrostDraws: {
    ko: "뒤 배경을 흐리게 할 수 없으므로 glass-fill-frost 채움에 토큰 테두리를 둡니다. 위는 밝고 옆은 옅고 아래는 중간인 glass.ts의 대체 규칙과 같습니다.",
    en: "The backdrop cannot be blurred, so the fill becomes glass-fill-frost with the token rim: bright on top, faint on the sides, the closing stop at the bottom, as glass.ts prescribes.",
  },

  tierHeading: { ko: "티어와 반경", en: "Tier and radius" },
  tierBody: {
    ko: "tier는 clear, regular, thick 세 단계이고 기본값은 regular입니다. radius는 네이티브 효과의 모서리 반경이고 기본값은 0입니다. style에 준 모서리 반경도 유리 층이 따라갑니다. 높이와 그림자는 재료에 들지 않으므로, 떠 있는 표면은 @horon-ai/tokens의 shadow에서 직접 더합니다.",
    en: "tier is clear, regular or thick and defaults to regular. radius is the corner of the native effect and defaults to 0; a corner radius set through style is followed too. Elevation is not part of the material, so a floating surface adds its own boxShadow from @horon-ai/tokens shadow.",
  },

  pressedHeading: { ko: "누름 상태", en: "Press state" },
  pressedBody: {
    ko: "유리로 그리는 컨트롤은 눌림 상태를 표면에 넘깁니다. 네이티브 유리는 interactive로 스스로 반응하고, 대체 모양은 시스템 효과가 없어 pressed가 참이면 overlay-ink-8을 채움 위에 깝니다. 이 워시가 없으면 Android와 iOS 26 미만에서 유리 버튼이 눌려도 색이 바뀌지 않습니다.",
    en: "A control drawn on glass passes its press state to the surface. Native glass reacts through interactive on its own; the fallback has no system effect, so a true pressed lays the overlay-ink-8 wash over the fill. Without that wash a glass button shows no colour change on Android or on iOS before 26.",
  },
  pressExampleHeading: { ko: "누름 상태를 넘기는 예", en: "Passing the press state" },

  veilHeading: { ko: "오버레이", en: "Overlays" },
  veilBody: {
    ko: '메뉴, 팝업, 대화상자는 material="veil"로 그립니다. 대체 모양에서는 테두리 대신 링과 그림자가 붙습니다.',
    en: 'Menus, popups and dialogs draw with material="veil". In the fallback they take the overlay ring and shadow instead of the rim.',
  },

  opacityHeading: { ko: "투명도", en: "Opacity" },
  opacityBody: {
    ko: "Apple 권고대로 유리와 그 부모의 opacity는 1로 둡니다. 흐려진 부모 아래에서는 유리가 그려지지 않습니다.",
    en: "Following Apple's guidance, glass and its parent keep opacity at 1: the glass does not render under a faded parent.",
  },

  hostHeading: { ko: "두 진입점", en: "Two entry points" },
  hostBody: {
    ko: "표면 전체를 소유하는 컴포넌트는 GlassSurface를 직접 씁니다. LiquidGlass는 react처럼 호스트 안에 까는 레이어이고, 반경과 채움은 호스트가 가집니다.",
    en: "A component that owns a whole surface uses GlassSurface directly. LiquidGlass is the layer laid inside a host, as in react, and the host owns the radius and the fill.",
  },
  exampleHeading: { ko: "예", en: "Example" },
});

/** `/develop/expo/safe-areas`: which components pad which edge and the inset hook. */
export const expoSafeAreaMessages = defineMessages({
  title: { ko: "안전 영역", en: "Safe areas" },
  description: {
    ko: "가장자리에 붙는 컴포넌트가 react-native-safe-area-context의 insets만큼 스스로 안쪽 여백을 둡니다.",
    en: "Components that sit on an edge pad themselves by the react-native-safe-area-context insets.",
  },

  insetsHeading: { ko: "insets", en: "Insets" },
  insetsBody: {
    ko: "react-native-safe-area-context의 insets를 읽습니다. 화면 가장자리에 붙는 컴포넌트만 그 가장자리만큼 안쪽 여백을 두고, 화면 가운데 놓이는 컨텐츠는 여백을 두지 않습니다.",
    en: "Insets come from react-native-safe-area-context. Only the components that sit on a screen edge pad by that edge; content in the middle of a screen carries no extra padding.",
  },

  edgesHeading: { ko: "컴포넌트별 가장자리", en: "Edges per component" },
  columnComponent: { ko: "컴포넌트", en: "Component" },
  columnEdge: { ko: "반영하는 가장자리", en: "Edges" },
  rowTopBar: { ko: "위", en: "Top" },
  rowTabBar: { ko: "아래", en: "Bottom" },
  rowBottomSheet: { ko: "아래", en: "Bottom" },
  rowToaster: { ko: "위·아래(놓인 쪽)", en: "Top and bottom, whichever side it sits on" },
  rowSidebar: { ko: "위·아래·왼쪽", en: "Top, bottom and left" },
  rowOverlays: { ko: "필요한 가장자리", en: "Whichever edges it needs" },
  rowOverlaysComponent: { ko: "Modal, Dialog(전체 화면)", en: "Modal, Dialog (full screen)" },

  providerHeading: { ko: "SafeAreaProvider", en: "SafeAreaProvider" },
  providerBody: {
    ko: "루트에 SafeAreaProvider를 둡니다. Expo Router를 쓰면 라우터가 이미 넣으므로 따로 넣지 않습니다.",
    en: "Mount SafeAreaProvider at the root. With Expo Router the router already does it, so it is not added twice.",
  },

  fallbackHeading: { ko: "useInsets", en: "useInsets" },
  fallbackBody: {
    ko: "useInsets()는 SafeAreaProvider가 없으면 네 방향 모두 0을 돌려줍니다. 컴포넌트는 useSafeAreaInsets() 대신 이 훅을 읽어, 미리보기나 테스트, 다른 앱 안에 끼워 넣은 화면에서도 예외 없이 그려집니다.",
    en: "useInsets() returns zero on all four edges when no SafeAreaProvider is mounted. The components read this hook rather than useSafeAreaInsets(), so a preview, a test or a screen embedded in another app draws without throwing.",
  },

  ownHeading: { ko: "화면에서 직접 더하기", en: "Padding a screen yourself" },
  ownBody: {
    ko: "화면을 직접 구성할 때는 같은 훅으로 여백을 더합니다. 갤러리는 본문 스크롤에 위 여백과 아래 여백 24pt를 더합니다.",
    en: "A screen you build yourself adds the padding through the same hook. The gallery adds the top inset and 24pt below the bottom inset to its scroll body.",
  },
});

/** `/develop/expo/differences`: every point the README lists against the React package. */
export const expoDifferencesMessages = defineMessages({
  title: { ko: "React와 다른 점", en: "Differences from React" },
  description: {
    ko: "이름과 값은 같고, React Native에 DOM이 없어 달라지는 부분만 모았습니다.",
    en: "Names and values match; only what a missing DOM changes differs.",
  },

  introHeading: { ko: "무엇이 다른가", en: "What differs" },
  introBody: {
    ko: "React Native에는 DOM이 없습니다. 컴포넌트의 이름, variant, 색, 치수는 같지만 다음 일곱 가지가 다릅니다.",
    en: "React Native has no DOM. Component names, variants, colours and dimensions match, but these seven things differ.",
  },

  eventsLabel: { ko: "이벤트 이름", en: "Event names" },
  eventsBody: {
    ko: "DOM에서 물려받은 onClick 대신 React Native 관례인 onPress를 씁니다. react가 직접 선언한 콜백 이름은 그대로입니다.",
    en: "onPress, the React Native convention, replaces the DOM-derived onClick. Callbacks react declares itself keep their names.",
  },

  styleLabel: { ko: "스타일", en: "Styles" },
  styleBody: {
    ko: "className 대신 style을 받습니다. cn()은 클래스 이름을 합치는 도구라 내보내지 않고, 스타일 배열을 쓰면 됩니다.",
    en: "Props take style instead of className. cn() merges class names and is not exported; a style array does the job.",
  },

  propsLabel: { ko: "Base UI에서 물려받는 prop", en: "Props inherited from Base UI" },
  propsBody: {
    ko: "open과 onOpenChange, value와 onValueChange, checked, orientation처럼 동작에 관한 prop은 같은 이름으로 받습니다. DOM, 폼, 키보드 포커스에 묶인 prop은 받지 않고, 목록과 이유는 test/props-parity.test.ts에 있습니다.",
    en: "Behaviour props keep their names: open and onOpenChange, value and onValueChange, checked, orientation. Props tied to the DOM, forms or keyboard focus are dropped, and the list with reasons lives in test/props-parity.test.ts.",
  },

  hooksLabel: { ko: "훅", en: "Hooks" },
  hooksBody: {
    ko: "useHotkey는 네이티브에 전역 키 이벤트가 없어 동작하지 않고 react-native-web에서만 붙습니다. useMediaQuery는 폭, 높이, 방향, 화면 모드, 동작 줄이기, 포인터 쿼리만 해석합니다. useActiveIndicator는 DOM 선택자 대신 활성 인덱스와 bindItem(index)의 onLayout으로 잽니다.",
    en: "useHotkey cannot work on native, where there are no global key events, and binds on react-native-web only. useMediaQuery interprets width, height, orientation, colour scheme, reduce-motion and pointer queries only. useActiveIndicator measures through the active index and bindItem(index)'s onLayout instead of DOM selectors.",
  },

  pressLabel: { ko: "눌림과 햅틱", en: "Press and haptics" },
  pressBody: {
    ko: "누르는 컨트롤은 HoronPressable로 그립니다. Pressable의 prop에 haptic과 pressScale을 더한 것이고, haptic은 light, selection, none이고 기본값은 light입니다. 버튼과 행은 light, 스위치와 탭, 세그먼트, 선택 목록은 selection을 쓰고, 스크림처럼 상태를 바꾸지 않는 표면은 none입니다. HoronProvider의 haptics가 켜져 있을 때만 진동하고 비활성 컨트롤은 조용합니다. pressScale은 react의 motion-press처럼 0.97로 줄이고, 동작 줄이기가 켜지면 생략합니다.",
    en: "Pressable controls draw through HoronPressable: Pressable's props plus haptic and pressScale. haptic is light, selection or none and defaults to light, with light for buttons and rows, selection for switches, tabs, segments and selection lists, and none for surfaces that change no state, such as a scrim. Feedback plays only while HoronProvider haptics is on, and a disabled control stays silent. pressScale shrinks to 0.97 like react's motion-press and is skipped under Reduce Motion.",
  },

  a11yLabel: { ko: "접근성", en: "Accessibility" },
  a11yBody: {
    ko: "누르는 요소는 role과 접근 이름, accessibilityState를 붙입니다. 오버레이는 React Native Modal이라 Android 뒤로 가기로 닫히고, 내용은 accessibilityViewIsModal입니다. 글자는 HoronText가 Dynamic Type을 따라 그리고 최대 2배에서 멈춥니다.",
    en: "Pressable elements carry role, an accessible name and accessibilityState. Overlays are React Native Modals, so Android's back gesture closes them and the content is accessibilityViewIsModal. HoronText follows Dynamic Type and stops at 2×.",
  },

  domLabel: { ko: "DOM 전용 제외", en: "DOM-only, not ported" },
  domBody: {
    ko: "mountCursorGhost(데스크톱 커서 꼬리)는 옮기지 않았습니다.",
    en: "mountCursorGhost, the desktop cursor tail, was not ported.",
  },

  sameHeading: { ko: "같은 것", en: "What stays the same" },
  sameBody: {
    ko: "파일 슬러그 집합, 값 export 이름, export type 이름, 문자열 유니언 variant의 리터럴이 React 패키지와 같습니다. prop의 이름, 필수 여부, 리터럴, 기본값까지 같은지도 검사합니다. test/parity.test.ts와 test/props-parity.test.ts가 비교합니다.",
    en: "The file slug set, value export names, exported type names and string-literal union values match the React package, and prop names, required flags, literals and defaults are compared too, by test/parity.test.ts and test/props-parity.test.ts.",
  },
});

/** `/develop/expo/gallery`: the Expo Go gallery, its deep link and the package commands. */
export const expoGalleryMessages = defineMessages({
  title: { ko: "갤러리 실행", en: "Running the gallery" },
  description: {
    ko: "저장소의 Expo 앱으로 컴포넌트 84개를 Expo Go에서 열어 봅니다.",
    en: "See all 84 components in Expo Go through the repository's Expo app.",
  },

  runHeading: { ko: "갤러리 실행", en: "Run the gallery" },
  runBody: {
    ko: "apps/expo-gallery가 84개 데모를 담은 Expo 앱입니다. Expo Go로 iOS 시뮬레이터를 열고, Android는 bun run android로 엽니다. 머리의 스위치로 화면 모드와 유리 방식, 진동을 바꿉니다.",
    en: "apps/expo-gallery is the Expo app with all 84 demos. It opens in Expo Go on the iOS simulator, and bun run android opens it on Android. The header switches flip the scheme, the glass mode and haptics.",
  },

  switchHeading: { ko: "머리의 스위치", en: "The header switches" },
  switchBody: {
    ko: "Dark는 scheme을 light와 dark 사이에서 바꾸고, Frost는 glass를 frost로 고정하고, Haptics는 HoronProvider의 haptics를 끄고 켭니다. Frost를 켜면 눌림이 overlay-ink-8 워시로 그려지는 모습을 같은 데모에서 바로 비교할 수 있습니다.",
    en: "Dark flips scheme between light and dark, Frost pins glass to frost and Haptics turns HoronProvider haptics off and on. With Frost on, the pressed overlay-ink-8 wash can be compared on the same demo.",
  },

  linkHeading: { ko: "딥 링크", en: "Deep link" },
  linkBody: {
    ko: "스크린샷 실행이 탭 없이 한 데모를 열도록 앱이 딥 링크를 읽습니다. slug는 갤러리 레지스트리의 슬러그이고, scheme, glass, haptics는 선택입니다. haptics=off로 진동을 끕니다.",
    en: "So a screenshot run opens one demo without tapping, the app reads a deep link. The slug comes from the gallery registry; scheme, glass and haptics are optional, and haptics=off silences feedback.",
  },

  testHeading: { ko: "렌더 테스트", en: "Render tests" },
  testBody: {
    ko: "jest-expo가 렌더와 상호작용을 검사합니다. test/render/*.jest.tsx의 테스트가 컴포넌트를 React Native 테스트 렌더러 위에서 그립니다.",
    en: "jest-expo checks rendering and interaction. The tests in test/render/*.jest.tsx draw components on the React Native test renderer.",
  },

  parityHeading: { ko: "패리티 검사", en: "Parity check" },
  parityBody: {
    ko: "저장소 루트의 bun test가 packages/react와 이 패키지를 비교합니다. bun run integrate는 배럴과 미구현 원장, 갤러리 레지스트리를 다시 만듭니다.",
    en: "The root bun test compares this package with packages/react. bun run integrate regenerates the barrel, the pending ledger and the gallery registry.",
  },

  generatedHeading: { ko: "생성 파일", en: "Generated files" },
  generatedBody: {
    ko: "src/index.ts, test/pending.ts, apps/expo-gallery/registry.g.ts는 스크립트가 만듭니다. 직접 고치지 않고, CI가 integrate.ts --check로 재생성 결과가 커밋과 같은지 확인합니다.",
    en: "src/index.ts, test/pending.ts and apps/expo-gallery/registry.g.ts are generated. Do not edit them by hand; CI runs integrate.ts --check to confirm a fresh run matches the commit.",
  },
});

/** Code samples. Every one is copied from a real package file or README snippet. */
export const expoSnippets: {
  install: string;
  entry: string;
  check: string;
  provider: string;
  themeHook: string;
  glassSurface: string;
  glassPress: string;
  insets: string;
  galleryRun: string;
  galleryLink: string;
  galleryCommands: string;
} = {
  install: `bun add @horon-ai/expo
bunx expo install expo-glass-effect expo-clipboard expo-haptics expo-document-picker react-native-safe-area-context react-native-svg expo-font`,
  entry: `import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, Card, HoronProvider } from "@horon-ai/expo";

export default function App() {
  const [loaded] = useFonts({
    "Pretendard Variable": require("./assets/fonts/PretendardVariable.ttf"),
    "Geist Mono Variable": require("./assets/fonts/GeistMono-Variable.ttf"),
  });
  if (!loaded) return null;
  return (
    <SafeAreaProvider>
      <HoronProvider>
        <Card title="Inbox Manager" description="6 emails need you." />
        <Button onPress={() => console.log("tap")}>Continue</Button>
      </HoronProvider>
    </SafeAreaProvider>
  );
}`,
  check: `import { Button } from "@horon-ai/expo";

export function Check() {
  return <Button onPress={() => console.log("tap")}>Installed</Button>;
}`,
  provider: `<HoronProvider
  scheme="system"
  platform="mobile"
  touch
  glass="auto"
  fonts={{ sans: "Pretendard Variable", mono: "Geist Mono Variable" }}
>
  <Button onPress={() => console.log("tap")}>Continue</Button>
</HoronProvider>`,
  themeHook: `import { HoronProvider, HoronText, useHoronTheme } from "@horon-ai/expo";

function Status() {
  const theme = useHoronTheme();
  return (
    <HoronText variant="label-md" tone="text-primary">
      {theme.scheme} · {theme.platform} · {theme.glass}
    </HoronText>
  );
}

export default function App() {
  return (
    <HoronProvider scheme="dark" platform="mobile">
      <Status />
    </HoronProvider>
  );
}`,
  glassSurface: `import { GlassSurface, HoronText } from "@horon-ai/expo";

export function FloatingBar() {
  return (
    <GlassSurface tier="regular" radius={14} style={{ padding: 16 }}>
      <HoronText variant="label-md" tone="text-primary">Floating chrome</HoronText>
    </GlassSurface>
  );
}`,
  glassPress: `import { GlassSurface, HoronPressable, HoronText } from "@horon-ai/expo";

export function GlassButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <HoronPressable onPress={onPress} style={{ width: "100%" }}>
      {({ pressed }) => (
        <GlassSurface tier="regular" radius={14} interactive pressed={pressed} style={{ padding: 16 }}>
          <HoronText variant="label-md" tone="text-primary">{label}</HoronText>
        </GlassSurface>
      )}
    </HoronPressable>
  );
}`,
  insets: `import { ScrollView } from "react-native";
import { useInsets } from "@horon-ai/expo";

export function Screen({ children }: { children: React.ReactNode }) {
  const insets = useInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}>
      {children}
    </ScrollView>
  );
}`,
  galleryRun: `cd apps/expo-gallery
bun run ios`,
  galleryLink: `exp://<host>/--/<slug>?scheme=dark&glass=frost&haptics=off`,
  galleryCommands: `bun run --cwd packages/expo test
bun test
bun run --cwd packages/expo integrate
bun run --cwd packages/expo typecheck
bun run --cwd packages/expo lint`,
};
