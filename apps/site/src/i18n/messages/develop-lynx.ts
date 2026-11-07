import { defineMessages } from "@/i18n";

/**
 * Copy for the Lynx docs section: the introduction and the five pages beside
 * it. Every fact here comes from `packages/lynx` (README, `package.json`,
 * `src/provider.tsx`, `src/components/liquid-glass.tsx`) and its build configs
 * (`tailwind.config.cjs`, `postcss.config.cjs`, `lynx.config.ts`).
 */

/** `/develop/lynx`: what the package is, a three-step start and the page map. */
export const lynxIntroMessages = defineMessages({
  title: { ko: "소개", en: "Introduction" },
  description: {
    ko: "@horon-ai/lynx는 같은 84개 컴포넌트를 ReactLynx 요소 위에 옮긴 패키지입니다. 웹, iOS, Android, HarmonyOS에서 같은 코드를 씁니다.",
    en: "@horon-ai/lynx ports the same 84 components onto ReactLynx elements, so one codebase runs on the web, iOS, Android and HarmonyOS.",
  },

  packageHeading: { ko: "패키지 구성", en: "What the package is" },
  packageBody: {
    ko: "컴포넌트의 모양과 값은 @horon-ai/react와 같습니다. 슬러그, export 이름, variant 값, @horon-ai/tokens의 색과 치수가 모두 같고, 다른 것은 요소입니다. div, button, input 대신 view, text, image, input, textarea, scroll-view, blur-view를 씁니다.",
    en: "Component looks and values match @horon-ai/react: same slugs, same export names, same variant values and the same @horon-ai/tokens colours and dimensions. Only the elements differ, with view, text, image, input, textarea, scroll-view and blur-view in place of div, button and input.",
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
    ko: "네 플랫폼: 한 번 작성한 트리가 웹, iOS, Android, HarmonyOS에서 그려집니다.",
    en: "Four platforms: one tree renders on the web, iOS, Android and HarmonyOS.",
  },
  itemSource: {
    ko: "@lynx-js/react 0.129.0 이상이 피어 의존성입니다. 패키지는 TypeScript 소스를 그대로 배포하고 빌드 산출물이 없습니다.",
    en: "@lynx-js/react 0.129.0 or newer is the peer dependency. The package ships TypeScript source with no build output.",
  },

  quickHeading: { ko: "빠른 시작", en: "Quick start" },
  quickBody: {
    ko: "세 단계입니다. 패키지를 더하고, 전역 스타일과 Tailwind 설정을 한 번 세팅하고, HoronProvider 안에서 컴포넌트를 씁니다.",
    en: "Three steps: add the packages, set up the global styles and Tailwind once, then use a component inside HoronProvider.",
  },
  stepPackages: { ko: "패키지 설치", en: "Install the packages" },
  stepStyles: { ko: "전역 스타일", en: "Load the global styles" },
  stepUse: { ko: "첫 컴포넌트", en: "Use a component" },

  docsHeading: { ko: "문서", en: "Docs" },
  docsBody: {
    ko: "이 아래 페이지가 설치에서 시작해 테마, 유리 표면, React와의 차이, 갤러리 순서로 이어집니다.",
    en: "The pages below start at installation and continue through theme, liquid glass, the differences from React and the gallery.",
  },
});

/** `/develop/lynx/installation`: packages, Tailwind v3, the Rspeedy config and the entry. */
export const lynxInstallationMessages = defineMessages({
  title: { ko: "설치", en: "Installation" },
  description: {
    ko: "패키지를 더하고 Tailwind v3, Rspeedy, 앱 진입점을 설정하면 컴포넌트를 쓸 수 있습니다.",
    en: "Add the packages, then configure Tailwind v3, Rspeedy and the app entry to use the components.",
  },

  packagesHeading: { ko: "패키지 추가", en: "Add the packages" },
  packagesBody: {
    ko: "컴포넌트와 런타임을 함께 설치합니다. ReactLynx 런타임인 @lynx-js/react는 피어 의존성이라 직접 넣습니다.",
    en: "Install the components together with the runtime. The ReactLynx runtime @lynx-js/react is a peer dependency, so it goes in explicitly.",
  },
  devHeading: { ko: "개발 의존성", en: "Development dependencies" },
  devBody: {
    ko: "Tailwind는 v3여야 합니다. @lynx-js/tailwind-preset이 v4와 호환되지 않아, v4를 넣으면 유틸리티가 생성되지 않습니다. Rspeedy 설정이 @lynx-js/react-rsbuild-plugin과 @lynx-js/rspeedy를 import하므로 둘도 개발 의존성으로 넣습니다.",
    en: "Tailwind must be v3: @lynx-js/tailwind-preset is not compatible with v4, and under v4 no utilities are generated. The Rspeedy config imports @lynx-js/react-rsbuild-plugin and @lynx-js/rspeedy, so those are development dependencies as well.",
  },

  tailwindHeading: { ko: "Tailwind 설정", en: "Tailwind config" },
  tailwindBody: {
    ko: "프리셋을 두 단계로 겹칩니다. @lynx-js/tailwind-preset이 Lynx가 지원하는 유틸리티 집합을 정하고, @horon-ai/lynx/tailwind-preset이 그 위에 토큰 클래스를 더합니다. 순서가 중요합니다. 토큰 프리셋이 뒤에 와야 text-label-md, text-text-primary, bg-glass-regular 같은 클래스가 만들어집니다.",
    en: "Stack two presets: @lynx-js/tailwind-preset selects the utility set Lynx supports, then @horon-ai/lynx/tailwind-preset adds the token classes on top. The order matters: the token preset goes second so classes such as text-label-md, text-text-primary and bg-glass-regular are generated.",
  },
  tailwindOrderNote: {
    ko: "presets 배열은 [lynxPreset, horonPreset] 순서입니다. preflight는 Lynx에 DOM이 없어 끕니다. content에는 이 패키지의 소스 경로도 넣습니다. @horon-ai/lynx는 TypeScript 소스를 그대로 배포하고 globals.css의 @tailwind utilities는 소비자의 content로 생성되므로, node_modules/@horon-ai/lynx/src를 스캔하지 않으면 컴포넌트 안에서만 쓰는 클래스가 만들어지지 않습니다.",
    en: "The presets array is [lynxPreset, horonPreset] in that order. Preflight is off because Lynx has no DOM. The content array also lists this package's source: @horon-ai/lynx ships TypeScript source and globals.css runs @tailwind utilities against the consumer's content, so classes used only inside the components are never generated unless Tailwind scans node_modules/@horon-ai/lynx/src.",
  },

  postcssHeading: { ko: "PostCSS 설정", en: "PostCSS config" },
  postcssBody: {
    ko: "Tailwind를 플러그인 하나로 넣습니다. @tailwind base와 @tailwind utilities는 @horon-ai/lynx/globals.css 안에 있습니다.",
    en: "Tailwind comes in as a single plugin. The @tailwind base and @tailwind utilities directives live inside @horon-ai/lynx/globals.css.",
  },

  bundlerHeading: { ko: "Rspeedy 설정", en: "Rspeedy config" },
  bundlerBody: {
    ko: "pluginReactLynx가 JSX와 Lynx 요소 변환을 맡습니다. environments에 lynx와 web을 함께 두면 같은 진입점에서 두 번들이 나옵니다. main.lynx.bundle은 Lynx 엔진용(iOS, Android, HarmonyOS)이고, main.web.bundle은 브라우저의 @lynx-js/web-core용입니다.",
    en: "pluginReactLynx handles the JSX and Lynx element transform. With lynx and web in environments, one entry produces two bundles: main.lynx.bundle for the Lynx engine (iOS, Android, HarmonyOS) and main.web.bundle for @lynx-js/web-core in a browser.",
  },

  entryHeading: { ko: "앱 진입점", en: "App entry" },
  entryBody: {
    ko: '진입 파일에서 globals.css를 한 번 import하고, root.render로 트리를 그립니다. 전역 스타일 경로는 "@horon-ai/lynx/globals.css"입니다.',
    en: 'Import globals.css once in the entry file and render the tree with root.render. The global stylesheet path is "@horon-ai/lynx/globals.css".',
  },

  sourceHeading: { ko: "배포 형태", en: "What ships" },
  sourceBody: {
    ko: "패키지는 TypeScript 소스를 그대로 배포합니다. 번들러가 node_modules 안의 소스를 컴파일하고, 컴포넌트는 필요한 것만 가져다 씁니다. src/index.ts는 배럴이고 scripts/integrate가 생성하므로 손으로 고치지 않습니다.",
    en: "The package ships TypeScript source. Your bundler compiles the source inside node_modules, and components come in only where used. src/index.ts is a barrel generated by scripts/integrate, so it is not edited by hand.",
  },

  checkHeading: { ko: "설치 확인", en: "Check the install" },
  checkBody: {
    ko: "Button 하나를 띄웁니다. 알약 모양에 토큰 색으로 그려지고 콘솔에 스타일 오류가 없으면 설치가 끝났습니다.",
    en: "Render one Button. A pill in the token colours with no style errors in the console means the install is done.",
  },
});

/** `/develop/lynx/theming`: the provider props, the root classes and the theme hook. */
export const lynxThemingMessages = defineMessages({
  title: { ko: "테마와 플랫폼", en: "Theme and platform" },
  description: {
    ko: "HoronProvider가 팔레트와 글자 크기판을 정하고, useHoronTheme이 그 값을 읽습니다.",
    en: "HoronProvider sets the palette and the typography board, and useHoronTheme reads them.",
  },

  providerHeading: { ko: "테마 루트", en: "The theme root" },
  providerBody: {
    ko: "모든 트리를 HoronProvider로 감쌉니다. Lynx에는 html 요소도 미디어 쿼리도 없어서, 스킴과 플랫폼을 루트 view의 클래스로 칠합니다. .horon-light 또는 .dark가 팔레트를, .horon-platform-web, .horon-platform-desktop, .horon-platform-mobile이 글자 크기판을 정합니다. 값이 바뀌면 트리 전체가 다시 그려집니다.",
    en: "Wrap every tree in HoronProvider. Lynx has no html element and no media queries, so the scheme and platform are painted as classes on the root view: .horon-light or .dark for the palette, and .horon-platform-web, .horon-platform-desktop or .horon-platform-mobile for the type board. A change re-renders the whole tree.",
  },

  schemeHeading: { ko: "scheme", en: "scheme" },
  schemeBody: {
    ko: 'scheme은 "light", "dark", "system" 중 하나이고 기본값은 "light"입니다. "system"은 마운트할 때 lynx.__globalProps.scheme을 한 번 읽어 "dark"이면 다크로, 그 밖에는 라이트로 정합니다. Lynx에는 OS 설정을 읽는 API가 없으므로, OS 변경을 따라가려면 호스트가 확정된 "light" 또는 "dark"를 넘겨 주고 직접 갱신합니다.',
    en: 'scheme is "light", "dark" or "system" and defaults to "light". "system" reads lynx.__globalProps.scheme once at mount: "dark" paints the dark palette and anything else paints light. Lynx has no API for the OS preference, so a host that follows a live change passes a resolved "light" or "dark" and updates it itself.',
  },

  platformHeading: { ko: "platform", en: "platform" },
  platformBody: {
    ko: 'platform은 "web", "desktop", "mobile" 중 하나이고 기본값은 "web"입니다. 13개 글자 스타일의 크기와 줄 높이가 그 플랫폼 값으로 바뀝니다. 예를 들어 body-md는 Web 16px, Desktop 14px, Mobile 16px입니다.',
    en: 'platform is "web", "desktop" or "mobile" and defaults to "web". The 13 text styles take that platform\'s size and line height: body-md is 16px on Web, 14px on Desktop and 16px on Mobile.',
  },

  motionHeading: { ko: "reducedMotion", en: "reducedMotion" },
  motionBody: {
    ko: "reducedMotion의 기본값은 false입니다. Lynx는 prefers-reduced-motion을 읽을 수 없어서 호스트가 직접 판단해 넘깁니다. true이면 루트에 .horon-reduced-motion이 붙고 모든 지속 시간이 0에 가깝게 줄어듭니다.",
    en: "reducedMotion defaults to false. Lynx cannot read prefers-reduced-motion, so the host decides and passes it. When true, .horon-reduced-motion lands on the root and every duration collapses to almost zero.",
  },

  hookHeading: { ko: "useHoronTheme", en: "useHoronTheme" },
  hookBody: {
    ko: "트리 아래 어디서든 useHoronTheme()이 지금 값을 돌려줍니다. scheme, platform, reducedMotion과 color(token) 네 가지입니다. color는 토큰 이름을 활성 스킴의 hex로 바꾸므로, CSS 클래스로 표현할 수 없는 Icon의 SVG fill이나 계산된 그라디언트에 씁니다.",
    en: "Anywhere below the root, useHoronTheme() returns the current values: scheme, platform, reducedMotion and color(token). color resolves a token name to the hex of the active scheme, which serves what a CSS class cannot express, such as an Icon's SVG fill or a computed gradient.",
  },
  exampleHeading: { ko: "예", en: "Example" },
});

/** `/develop/lynx/liquid-glass`: the blur-view element, its fallbacks and the host rule. */
export const lynxGlassMessages = defineMessages({
  title: { ko: "유리 표면", en: "Liquid glass" },
  description: {
    ko: "Lynx의 유리는 blur-view 위에 그립니다. 필터를 못 쓰는 엔진은 frost 채움으로 떨어집니다.",
    en: "Lynx draws its glass on blur-view. Engines without the filter fall back to the frost fill.",
  },

  elementHeading: { ko: "blur-view", en: "blur-view" },
  elementBody: {
    ko: 'Lynx 4.0의 blur-view가 배경을 필터합니다. iOS는 blur-effect="glass"로 Liquid Glass를 그리고, 웹 엔진은 CSS backdrop-filter로, Android와 HarmonyOS는 캡처한 배경을 흐립니다. React의 .liquid-layers와 ::after 한 쌍이 여기서는 요소 둘이 됩니다. 레이어가 위에서 밝고 아래로 흐린 테두리 그라디언트를 그리고, 그 자식이 테두리를 뺀 안쪽을 채웁니다.',
    en: "Lynx 4.0's blur-view filters the backdrop. iOS draws Liquid Glass through blur-effect=\"glass\", the web engine turns it into a CSS backdrop-filter, and Android and HarmonyOS blur the captured backdrop. React's .liquid-layers plus ::after pair becomes two elements here: the layer draws the rim gradient, and its child fills everything inside the rim.",
  },
  saturateNote: {
    ko: "saturate(1.8)은 빠집니다. blur-view가 채도 값을 받지 않아, React의 유리와 채도만 다릅니다.",
    en: "saturate(1.8) is dropped, because blur-view takes no saturation value; only the saturation differs from React's glass.",
  },

  fallbackHeading: { ko: "필터가 없는 엔진", en: "Engines without the filter" },
  fallbackBody: {
    ko: "Clay 데스크톱 렌더러(macOS, Windows)처럼 blur-view가 없는 엔진에서는 supportsBackdropBlur()가 false를 돌려주고, HoronProvider가 .horon-glass-blur를 붙이지 않습니다. 그때 세 티어는 glass-fill-frost로 떨어져 구멍이 아니라 서리 낀 표면으로 보입니다.",
    en: "On engines without blur-view, such as the Clay desktop renderer on macOS and Windows, supportsBackdropBlur() returns false and HoronProvider leaves .horon-glass-blur off. The three tiers then resolve to glass-fill-frost, so the surface reads as frosted rather than as a hole.",
  },

  hostHeading: { ko: "쓰는 법", en: "How to use it" },
  hostBody: {
    ko: "LiquidGlass는 prop을 받지 않고 레이어와 테두리 하나를 그립니다. relative overflow-hidden인 호스트의 첫 자식으로 두고, 반경과 티어 채움은 호스트가 가집니다. 티어는 bg-glass-clear, bg-glass-regular, bg-glass-thick 중 하나이고, 호스트에 border를 두지 않습니다. 테두리는 레이어의 rim이 맡습니다.",
    en: "LiquidGlass takes no props and draws one layer plus its rim. Render it as the first child of a relative overflow-hidden host; the host owns the radius and the tier fill (bg-glass-clear, bg-glass-regular or bg-glass-thick), and it carries no border because the rim is the edge.",
  },
  contentNote: {
    ko: "호스트 안의 글자는 레이어 위에 와야 합니다. text에 relative를 주면 rim 아래로 내려가지 않습니다.",
    en: "Text inside the host has to sit above the layer: a relative class on the text keeps it out from under the rim.",
  },
  exampleHeading: { ko: "예", en: "Example" },
});

/** `/develop/lynx/differences`: every point the README lists against the React package. */
export const lynxDifferencesMessages = defineMessages({
  title: { ko: "React와 다른 점", en: "Differences from React" },
  description: {
    ko: "이름과 값은 같고, Lynx에 DOM이 없어 달라지는 부분만 모았습니다.",
    en: "Names and values match; only what a missing DOM changes differs.",
  },

  introHeading: { ko: "무엇이 다른가", en: "What differs" },
  introBody: {
    ko: "Lynx에는 DOM이 없고 일부 CSS와 API도 없습니다. 컴포넌트의 이름, variant, 색, 치수는 같지만 다음 여덟 가지가 다릅니다.",
    en: "Lynx has no DOM, and some CSS and APIs are missing with it. Component names, variants, colours and dimensions match, but these eight things differ.",
  },

  elementsLabel: { ko: "요소", en: "Elements" },
  elementsBody: {
    ko: "div, button, input 대신 view, text, image, input, textarea, scroll-view, blur-view를 씁니다. 글자는 반드시 text 안에 들어갑니다.",
    en: "view, text, image, input, textarea, scroll-view and blur-view replace div, button and input. Text always sits inside text.",
  },

  stateLabel: { ko: "상태", en: "State" },
  stateBody: {
    ko: "Base UI가 없어 checked, open, value 같은 상태 prop을 컴포넌트가 직접 받습니다. 이름과 기본값은 React와 같습니다.",
    en: "With no Base UI, components take the checked, open and value state props themselves. Names and defaults match React.",
  },

  glassLabel: { ko: "유리", en: "Glass" },
  glassBody: {
    ko: "blur-view(Lynx 4.0)로 배경을 필터합니다. iOS는 Liquid Glass, 웹은 CSS backdrop-filter, Android와 HarmonyOS는 캡처 블러입니다. 지원하지 않는 엔진은 glass-fill-frost로 떨어지고, saturate(1.8)은 blur-view가 받지 않아 빠집니다.",
    en: "blur-view (Lynx 4.0) filters the backdrop: Liquid Glass on iOS, CSS backdrop-filter on the web, captured blur on Android and HarmonyOS. Engines without it fall back to glass-fill-frost, and saturate(1.8) is dropped because blur-view takes no saturation value.",
  },

  motionLabel: { ko: "모션", en: "Motion" },
  motionBody: {
    ko: "hover:, focus-visible:가 없어 active:(터치)로 대체하고, data-*, :last-child, has-[]를 쓸 수 없어 상태를 JS로 계산합니다. Tailwind v4 전용 간격은 같은 px 임의값으로 적었습니다.",
    en: "With no hover: or focus-visible:, active: (touch) stands in; with no data-*, :last-child or has-[], state is computed in JS. Tailwind v4-only spacing is written as the same px arbitrary value.",
  },

  overlayLabel: { ko: "오버레이", en: "Overlays" },
  overlayBody: {
    ko: "포털이 없어 position: fixed 뷰를 그 자리에서 그립니다. 스크림 탭과 닫기 컨트롤이 종료 경로이고, Escape와 포커스 트랩은 없습니다.",
    en: "With no portals, a position: fixed view renders in place. Tapping the scrim and the close control are the exit paths; there is no Escape and no focus trap.",
  },

  calendarLabel: { ko: "달력·목록", en: "Calendar and lists" },
  calendarBody: {
    ko: "키보드 포커스 이동이 없어 탭으로만 선택합니다.",
    en: "With no keyboard focus movement, selection is by tap only.",
  },

  filesLabel: { ko: "파일", en: "Files" },
  filesBody: {
    ko: "file-drop은 File과 드래그 API가 없어, 호스트가 넘긴 파일 기술자를 onFiles로 보고합니다.",
    en: "file-drop has no File or drag API, so it reports the file descriptors the host passes through onFiles.",
  },

  domLabel: { ko: "DOM 전용 제외", en: "DOM-only, not ported" },
  domBody: {
    ko: "mountCursorGhost(데스크톱 커서 꼬리)는 옮기지 않았습니다.",
    en: "mountCursorGhost, the desktop cursor tail, was not ported.",
  },

  sameHeading: { ko: "같은 것", en: "What stays the same" },
  sameBody: {
    ko: "파일 슬러그 집합, 값 export 이름, export type 이름, 문자열 유니언 variant의 리터럴 집합이 React 패키지와 같습니다. 이 네 가지는 테스트가 비교합니다.",
    en: "The file slug set, the value export names, the exported type names and the string-literal union values all match the React package, and a test compares all four.",
  },
});

/** `/develop/lynx/gallery`: building the example, serving it on the web and running the tests. */
export const lynxGalleryMessages = defineMessages({
  title: { ko: "갤러리 실행", en: "Running the gallery" },
  description: {
    ko: "저장소의 example 앱으로 컴포넌트 84개를 브라우저에서 봅니다.",
    en: "See all 84 components in a browser through the repository's example app.",
  },

  buildHeading: { ko: "갤러리 빌드", en: "Build the gallery" },
  buildBody: {
    ko: "example 앱을 두 번들로 빌드합니다. main.lynx.bundle은 Lynx 엔진용이고, main.web.bundle은 브라우저용입니다. 출력은 example/dist에 남습니다.",
    en: "Build the example app into two bundles: main.lynx.bundle for the Lynx engine and main.web.bundle for the browser. The output lands in example/dist.",
  },

  webHeading: { ko: "브라우저에서 보기", en: "Open it in a browser" },
  webBody: {
    ko: "빌드 결과를 @lynx-js/web-core로 띄웁니다. 먼저 build를 돌려야 main.web.bundle이 있습니다. PORT로 포트를 바꾸고, 기본값은 4610입니다.",
    en: "Serves the build through @lynx-js/web-core. Run build first so main.web.bundle exists. PORT changes the port; the default is 4610.",
  },

  testHeading: { ko: "렌더 테스트", en: "Render tests" },
  testBody: {
    ko: "rstest가 렌더와 상호작용을 검사합니다. 컴포넌트를 JSDOM 기반 요소 API에서 그리므로 Lynx 엔진 없이도 돌아갑니다.",
    en: "rstest checks rendering and interaction. Components draw on a JSDOM-backed element API, so the run needs no Lynx engine.",
  },

  parityHeading: { ko: "패리티 검사", en: "Parity check" },
  parityBody: {
    ko: "저장소 루트의 bun test가 packages/react/src/components와 이 패키지를 비교합니다. 파일 슬러그 집합, 값 export 이름, export type 이름, 문자열 유니언 리터럴이 모두 같아야 하고, 미구현 슬러그는 test/pending.ts에 있습니다.",
    en: "The root bun test compares packages/react/src/components with this package. File slugs, value export names, exported type names and string-literal unions must all match, and unported slugs live in test/pending.ts.",
  },

  generatedHeading: { ko: "생성 파일", en: "Generated files" },
  generatedBody: {
    ko: "src/index.ts, example/registry.g.ts, test/pending.ts, src/styles/tokens.css, tailwind-preset.cjs, src/icons/phosphor.g.ts는 스크립트가 만듭니다. 직접 고치지 않고, CI가 재생성 결과가 커밋과 같은지 확인합니다.",
    en: "src/index.ts, example/registry.g.ts, test/pending.ts, src/styles/tokens.css, tailwind-preset.cjs and src/icons/phosphor.g.ts are generated. Do not edit them by hand; CI checks that a fresh run matches the commit.",
  },
});

/** Code samples. Every one is copied from a real package file or README snippet. */
export const lynxSnippets: {
  install: string;
  installDev: string;
  styles: string;
  tailwindConfig: string;
  postcssConfig: string;
  lynxConfig: string;
  entry: string;
  firstComponent: string;
  check: string;
  provider: string;
  themeHook: string;
  glassHost: string;
  galleryBuild: string;
  galleryWeb: string;
  galleryTest: string;
  galleryParity: string;
} = {
  install: `bun add @horon-ai/lynx @lynx-js/react
bun add -d tailwindcss@^3 @lynx-js/tailwind-preset`,
  installDev: `bun add -d @lynx-js/react-rsbuild-plugin @lynx-js/rspeedy`,
  styles: `import "@horon-ai/lynx/globals.css";`,
  tailwindConfig: `const lynxPreset = require("@lynx-js/tailwind-preset");
const horonPreset = require("@horon-ai/lynx/tailwind-preset");

module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@horon-ai/lynx/src/**/*.{ts,tsx}"],
  presets: [lynxPreset, horonPreset],
  corePlugins: { preflight: false },
};`,
  postcssConfig: `module.exports = {
  plugins: {
    tailwindcss: {},
  },
};`,
  lynxConfig: `import { pluginReactLynx } from "@lynx-js/react-rsbuild-plugin";
import { defineConfig } from "@lynx-js/rspeedy";

export default defineConfig({
  plugins: [pluginReactLynx()],
  environments: {
    lynx: {},
    web: {},
  },
  source: {
    entry: {
      main: "./src/index.tsx",
    },
  },
});`,
  entry: `import "@horon-ai/lynx/globals.css";

import { root } from "@lynx-js/react";

import { App } from "./app";

root.render(<App />);`,
  firstComponent: `import { HoronProvider, Button, Card } from "@horon-ai/lynx";

export function App() {
  return (
    <HoronProvider scheme="dark" platform="mobile">
      <Card>
        <Button onClick={() => console.log("tap")}>Continue</Button>
      </Card>
    </HoronProvider>
  );
}`,
  check: `import { Button } from "@horon-ai/lynx";

export function Check() {
  return <Button>Installed</Button>;
}`,
  provider: `<HoronProvider scheme="system" platform="mobile" reducedMotion={false}>
  <Button onClick={() => console.log("tap")}>Continue</Button>
</HoronProvider>`,
  themeHook: `import { HoronProvider, useHoronTheme } from "@horon-ai/lynx";

function Status() {
  const theme = useHoronTheme();
  return (
    <text style={{ color: theme.color("text-primary") }}>
      {theme.scheme} · {theme.platform}
    </text>
  );
}

export function App() {
  return (
    <HoronProvider scheme="dark" platform="desktop">
      <Status />
    </HoronProvider>
  );
}`,
  glassHost: `import { LiquidGlass } from "@horon-ai/lynx";

export function FloatingBar() {
  return (
    <view className="relative overflow-hidden rounded-xl bg-glass-regular p-4">
      <LiquidGlass />
      <text className="relative text-label-md text-text-primary">Floating chrome</text>
    </view>
  );
}`,
  galleryBuild: `bun run --cwd packages/lynx build`,
  galleryWeb: `bun run --cwd packages/lynx gallery:web`,
  galleryTest: `bun run --cwd packages/lynx test`,
  galleryParity: `bun test packages/lynx/test/parity.test.ts`,
};
