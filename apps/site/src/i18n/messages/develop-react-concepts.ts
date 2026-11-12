import { defineMessages, type Localized } from "@/i18n";

/**
 * Copy for the React concept pages: imports, liquid glass, motion, platform and
 * shortcuts, the cursor ghost, and contributing. Facts here come from
 * packages/react (README, src/lib, src/styles/globals.css) and the root scripts.
 */
export const conceptsMessages = defineMessages({
  /* Imports ---------------------------------------------------------------- */
  importsTitle: { ko: "가져오기", en: "Imports" },
  importsDescription: {
    ko: "컴포넌트를 진입점에서 한 번에 받거나, 쓰는 파일만 하위 경로로 가져옵니다.",
    en: "Take every component from the entry point, or only the files you use through a subpath.",
  },
  importsEntryHeading: { ko: "진입점과 하위 경로", en: "Entry point and subpaths" },
  importsEntryBody: {
    ko: "@horon-ai/react는 빌드 산출물 없이 TypeScript 소스를 그대로 배포합니다. 진입점은 모든 컴포넌트를 다시 내보내고, 하위 경로는 export map으로 같은 소스 파일을 가리킵니다. 두 경로는 같은 파일에 도착하므로 타입과 동작이 같습니다.",
    en: "The package ships TypeScript source with no build output. The entry point re-exports every component, and a subpath points at the same source file through the export map. Both routes reach the same file, so types and behavior match.",
  },
  importsEntryBarrelItem: {
    ko: '진입점: import { Button, Card } from "@horon-ai/react" 한 줄로 이름을 가져옵니다.',
    en: 'Entry point: one line, import { Button, Card } from "@horon-ai/react", pulls the names you name.',
  },
  importsEntrySubpathItem: {
    ko: "하위 경로: 파일 이름이 곧 경로입니다. @horon-ai/react/components/button은 src/components/button.tsx로 연결됩니다.",
    en: "Subpath: the file name is the path. @horon-ai/react/components/button maps to src/components/button.tsx.",
  },
  importsEntryBundleItem: {
    ko: "진입점도 번들러가 쓰지 않는 컴포넌트를 떨어냅니다. 패키지의 sideEffects가 배럴·전역 CSS·커서 잔상 세 파일만 남기기 때문입니다. 하위 경로와의 차이는 커서 잔상 자동 마운트 3KB뿐이라, 여러 컴포넌트를 쓰는 화면은 진입점을 그대로 써도 됩니다.",
    en: "The entry point tree-shakes too: the package's sideEffects keeps only the barrel, the global CSS and the cursor ghost, so unused components drop out. The only difference from a subpath is the 3 KB cursor-ghost auto-mount, so a screen that uses several components can stay on the entry point.",
  },
  importsPropsHeading: { ko: "Prop 타입", en: "Prop types" },
  importsPropsBody: {
    ko: "각 컴포넌트 파일은 자기 prop 타입을 함께 내보냅니다. ButtonProps, CardProps, KbdProps처럼 컴포넌트 이름에 Props를 붙인 이름이고, 진입점과 하위 경로 어디서나 같은 이름으로 가져옵니다.",
    en: "Each component file exports its prop type: the component name with Props, such as ButtonProps, CardProps or KbdProps. The name is the same from the entry point and from a subpath.",
  },
  importsPropsTypeItem: {
    ko: "타입만 필요하면 import type으로 가져옵니다. 번들에는 남지 않습니다.",
    en: "When you only need the type, use import type. Nothing reaches the bundle.",
  },
  importsPropsForwardItem: {
    ko: "컴포넌트를 감싸는 쪽은 이 타입을 그대로 펼쳐 쓰면 prop 목록을 다시 적지 않아도 됩니다.",
    en: "A wrapper can spread the type instead of restating the prop list.",
  },
  importsHelpersHeading: { ko: "훅과 플랫폼 헬퍼", en: "Hooks and platform helpers" },
  importsHelpersBody: {
    ko: "훅과 플랫폼 헬퍼에는 하위 경로가 없습니다. 진입점에서만 가져옵니다. 플랫폼 헬퍼는 detectOs, detectRuntime, formatShortcut, isModKey, matchesShortcut 다섯 함수이고, Os, PlatformInput, Runtime, RuntimeWindow, ShortcutEvent 타입을 함께 내보냅니다.",
    en: "Hooks and platform helpers have no subpath; they come from the entry point only. The platform helpers are five functions, detectOs, detectRuntime, formatShortcut, isModKey and matchesShortcut, with the Os, PlatformInput, Runtime, RuntimeWindow and ShortcutEvent types.",
  },
  importsHelpersCnItem: {
    ko: "클래스 병합에 쓰는 cn도 진입점에 있습니다. Horon 토큰 이름을 아는 tailwind-merge라서 넘긴 클래스가 컴포넌트 기본값을 덮습니다.",
    en: "cn lives on the entry point too: a tailwind-merge that knows the Horon token names, so a class you pass overrides a component default.",
  },
  importsHelpersHookItem: {
    ko: "훅은 컴포넌트 하위 경로에 섞여 있지 않습니다. 목록은 사이드바의 React · 훅 그룹에 있습니다.",
    en: "Hooks are not mixed into the component subpaths. The sidebar's React · Hooks group lists them.",
  },
  importsClientHeading: { ko: "클라이언트 경계", en: "The client boundary" },
  importsClientBody: {
    ko: '패키지 소스에는 "use client" 지시문이 없습니다. 훅을 쓰는 컴포넌트도 예외가 아닙니다. 경계는 소비하는 쪽이 정합니다. Astro에서는 client:load 같은 지시문이 아일랜드를 브라우저에서 켜고, Next.js App Router에서는 컴포넌트를 가져오는 자기 파일 위에 "use client"를 둡니다.',
    en: 'The package source has no "use client" directive, and components that call hooks are no exception. The consumer sets the boundary: in Astro a client:load style directive starts the island in the browser, and in the Next.js App Router you put "use client" on your own file that imports the component.',
  },
  importsClientItem: {
    ko: "지시문을 패키지에 넣으면 서버 컴포넌트에서 쓸 수 있는 정적 컴포넌트까지 클라이언트로 넘어갑니다. 그래서 패키지는 지시문을 두지 않습니다.",
    en: "A directive inside the package would push even the static components a server component can use across the boundary, so the package leaves it out.",
  },
  importsGhostHeading: { ko: "커서 잔상 가져오기", en: "Import the cursor ghost" },
  importsGhostBody: {
    ko: '잔상은 컴포넌트가 아니라 부수 효과 import입니다. import "@horon-ai/react/cursor-ghost" 한 줄이면 React 없이도 붙습니다. 이 사이트도 BaseLayout에서 이 줄을 씁니다. 붙는 조건과 옵션은 커서 잔상 페이지에 있습니다.',
    en: 'The ghost is a side-effect import, not a component. One line, import "@horon-ai/react/cursor-ghost", mounts it without React. This site does it in BaseLayout. The cursor ghost page covers when it mounts and how to configure it.',
  },

  /* Liquid glass ----------------------------------------------------------- */
  glassTitle: { ko: "유리 표면", en: "Liquid glass" },
  glassDescription: {
    ko: "LiquidGlass가 그리는 재질, 호스트에 필요한 클래스, 흐림을 쓸 수 없을 때의 대체 채움입니다.",
    en: "The material LiquidGlass draws, the classes a host needs, and the fallback fill when the backdrop cannot be blurred.",
  },
  glassMaterialHeading: { ko: "재질", en: "The material" },
  glassMaterialBody: {
    ko: "LiquidGlass는 @horon-ai/tokens의 glass.ts 값을 그대로 씁니다. Lynx의 LiquidGlass도 같은 값을 읽고, 배경은 <blur-view>로 겁니다. iOS는 Liquid Glass, web은 CSS backdrop-filter, Android와 HarmonyOS는 캡처 블러를 쓰고, 지원하지 않는 엔진은 glass-fill-frost로 떨어집니다. <blur-view>가 채도 값을 받지 않아 Lynx에서는 saturate(1.8)가 빠집니다.",
    en: "LiquidGlass reads the values in glass.ts from @horon-ai/tokens. Lynx's LiquidGlass reads the same values and filters the backdrop with <blur-view>: iOS renders Liquid Glass, the web engine turns it into a CSS backdrop-filter, and Android and HarmonyOS blur the captured backdrop. Engines without it fall back to glass-fill-frost. <blur-view> takes no saturation value, so saturate(1.8) is dropped in Lynx.",
  },
  glassMaterialBackdropItem: {
    ko: "배경: 뒤 내용을 20px 흐리게 하고 채도를 180%로 올립니다.",
    en: "Backdrop: blurs what is behind by 20px and raises saturation to 180%.",
  },
  glassMaterialFillItem: {
    ko: "채움: 호스트가 glass-clear, glass-regular, glass-thick 중 하나로 칠합니다. 높은 값일수록 불투명합니다.",
    en: "Fill: the host paints one of glass-clear, glass-regular or glass-thick. The later the tier, the more opaque.",
  },
  glassMaterialRimItem: {
    ko: "테두리: 가장자리 안쪽 1px 링입니다. 위가 밝고 가운데에서 옅어졌다가 아래에서 조금 다시 밝아집니다. 호스트에는 자기 테두리를 두지 않습니다. 링이 곧 테두리입니다.",
    en: "Edge: a 1px ring inside the border. Bright at the top, faint at the middle, a little brighter again at the bottom. The host keeps no border of its own; the ring is the edge.",
  },
  glassHostHeading: { ko: "호스트 규칙", en: "Host rules" },
  glassHostBody: {
    ko: "LiquidGlass는 prop을 받지 않고 aria-hidden span 하나를 그립니다. 시각 결정은 모두 호스트의 클래스에서 옵니다.",
    en: "LiquidGlass takes no props and renders a single aria-hidden span. Every visual decision comes from the host's class list.",
  },
  glassHostFirstItem: {
    ko: "호스트의 첫 자식으로 둡니다. 레이어는 absolute inset-0이고 반경을 호스트에서 물려받습니다.",
    en: "Make it the host's first child. The layer is absolute inset-0 and inherits the host's radius.",
  },
  glassHostStackItem: {
    ko: "호스트에 relative isolate와 반경, 채움 클래스를 답니다. isolate가 레이어의 z 순서를 호스트 안에 가둡니다.",
    en: "Give the host relative isolate, a radius and the fill class. isolate keeps the layer's z order inside the host.",
  },
  glassHostZItem: {
    ko: "호스트에 [&>.liquid-layers]:-z-10을 두면 레이어가 호스트 채움 위, 본문 아래로 확정됩니다. Card는 이 일을 스스로 합니다.",
    en: "Putting [&>.liquid-layers]:-z-10 on the host fixes the layer above the host fill and under the body. Card does this itself.",
  },
  glassHostBodyItem: {
    ko: "isolate를 걸 수 없는 호스트는 본문 요소를 relative로 올려 같은 순서를 만듭니다. LiquidGlass의 예제가 이 방식입니다.",
    en: "A host that cannot isolate raises its body to relative instead, which gives the same order. LiquidGlass's own example does that.",
  },
  glassHostFillItem: {
    ko: "레이어에 bg-glass-*를 얹지 않습니다. 폴백 채움을 덮어서 표면을 실제와 다르게 그립니다.",
    en: "Never put bg-glass-* on the layer. It overrides the fallback fill and draws a surface that differs from the real one.",
  },
  glassHostTierItem: {
    ko: '유리 높이를 정하는 tier prop은 없습니다. 예전 코드의 tier="thick" 같은 인자는 지웁니다.',
    en: 'There is no tier prop. In older code, remove arguments such as tier="thick".',
  },
  glassFallbackHeading: { ko: "폴백", en: "Fallback" },
  glassFallbackBody: {
    ko: "투명도 줄이기 설정이 켜져 있거나 엔진이 backdrop-filter를 지원하지 않으면 흐림 대신 glass-fill-frost 채움이 칠해지고 링은 그대로 남습니다. 이 판단은 globals.css가 하므로 컴포넌트마다 따로 처리하지 않습니다.",
    en: "With reduced transparency requested, or an engine without backdrop-filter, the fill turns to glass-fill-frost and the ring stays. globals.css decides this, so no component handles it separately.",
  },
  glassCardHeading: { ko: "카드", en: "Card" },
  glassCardBody: {
    ko: "Card는 surface로 solid, glass, frost를 고릅니다. glass와 frost는 bg-glass-thick을 쓰고 frost는 glass-fill-frost로 덮습니다. Card는 relative isolate와 -z-10을 스스로 답니다.",
    en: "Card picks solid, glass or frost with surface. glass and frost use bg-glass-thick, and frost overrides it with glass-fill-frost. Card sets relative isolate and -z-10 on its own.",
  },
  glassWhereHeading: { ko: "유리가 놓이는 자리", en: "Where glass belongs" },
  glassWhereBody: {
    ko: "유리는 배경 위에 떠 있는 크롬에만 씁니다. 헤더, 사이드바, 다이얼로그, 컴포저, 탭 바, 토스트, 메뉴, 툴팁입니다. 읽거나 누르는 내용 표면은 solid 토큰 표면을 씁니다.",
    en: "Glass belongs to chrome floating over a backdrop: headers, the sidebar, dialogs, the composer, tab bars, toasts, menus and tooltips. Content surfaces people read or press use the solid token surfaces.",
  },
  glassWhereVeilBody: {
    ko: "입력 필드와 오버레이는 veil을 씁니다. glass.ts의 veil은 8px 흐림에 채도 160%이고, 링과 그림자가 있습니다.",
    en: "Fields and overlays use the veil: glass.ts sets an 8px blur at 160% saturation with a ring and a shadow.",
  },

  /* Motion ----------------------------------------------------------------- */
  motionTitle: { ko: "모션", en: "Motion" },
  motionDescription: {
    ko: "globals.css에 있는 이징, 애니메이션 토큰, 모션 유틸리티와 동작 줄이기 처리입니다.",
    en: "The easings, animation tokens, motion utilities and reduced-motion handling in globals.css.",
  },
  motionEasingHeading: { ko: "이징과 길이", en: "Easings and durations" },
  motionEasingBody: {
    ko: "이징은 세 개이고 CSS 변수로 정의됩니다. 컴포넌트와 유틸리티는 var(--ease-*)로 읽습니다.",
    en: "There are three easings, defined as CSS variables. Components and utilities read them as var(--ease-*).",
  },
  motionEasingOutItem: {
    ko: "--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1). 대부분의 진입과 이동에 씁니다.",
    en: "--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1). Used for most entrances and moves.",
  },
  motionEasingEmphasizedItem: {
    ko: "--ease-emphasized: cubic-bezier(0.2, 0, 0, 1). 항목 사이를 이동하는 표시에 씁니다.",
    en: "--ease-emphasized: cubic-bezier(0.2, 0, 0, 1). Used for indicators that travel between items.",
  },
  motionEasingSpringItem: {
    ko: "--ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1). 살짝 튀는 등장에 씁니다.",
    en: "--ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1). Used for entrances with a slight overshoot.",
  },
  motionEasingDurationBody: {
    ko: "길이는 색과 누름 피드백이 120~150ms, 팝업과 패널이 180~240ms, 항목 사이를 이동하는 표시가 약 280ms입니다.",
    en: "Durations: 120-150ms for color and press feedback, 180-240ms for popups and panels, about 280ms for indicators that travel between items.",
  },
  motionTokensHeading: { ko: "애니메이션 토큰", en: "Animation tokens" },
  motionTokensBody: {
    ko: "@theme에 --animate-*로 등록되어 animate-shimmer 같은 Tailwind 클래스로 바로 씁니다. 길이와 이징은 토큰에 들어 있습니다.",
    en: "They are registered in @theme as --animate-*, so the Tailwind class animates directly, such as animate-shimmer. Duration and easing live in the token.",
  },
  motionTokensInItem: {
    ko: "등장: animate-pop-in 220ms ease-spring, animate-fade-in 160ms ease-out-quint, animate-scale-out 120ms ease-in(퇴장).",
    en: "Entrances: animate-pop-in at 220ms ease-spring, animate-fade-in at 160ms ease-out-quint, animate-scale-out at 120ms ease-in (exit).",
  },
  motionTokensOutItem: {
    ko: "퇴장: animate-pop-out 130ms ease-in.",
    en: "Exits: animate-pop-out at 130ms ease-in.",
  },
  motionTokensSlideItem: {
    ko: "이동: animate-slide-next와 animate-slide-prev 200ms, animate-slide-shift-next와 animate-slide-shift-prev 200ms, animate-swap-move 200ms. 모두 ease-out-quint입니다.",
    en: "Moves: animate-slide-next and animate-slide-prev at 200ms, animate-slide-shift-next and animate-slide-shift-prev at 200ms, animate-swap-move at 200ms. All ease-out-quint.",
  },
  motionTokensLoopItem: {
    ko: "반복: animate-shimmer 1.6s linear, animate-live-pulse 2s ease-out-quint, animate-sweep 1.4s ease-out-quint.",
    en: "Loops: animate-shimmer at 1.6s linear, animate-live-pulse at 2s ease-out-quint, animate-sweep at 1.4s ease-out-quint.",
  },
  motionTokensLoopItem2: {
    ko: "짧은 반복: animate-caret 1s steps(1, end), animate-thinking 1.2s ease-in-out, animate-wave 900ms ease-in-out.",
    en: "Short loops: animate-caret at 1s steps(1, end), animate-thinking at 1.2s ease-in-out, animate-wave at 900ms ease-in-out.",
  },
  motionUtilitiesHeading: { ko: "모션 유틸리티", en: "Motion utilities" },
  motionUtilitiesBody: {
    ko: "컴포넌트가 조합하는 @utility입니다. 열고 닫는 상태는 Base UI가 붙이는 data-starting-style, data-ending-style, data-collapsed, data-hidden 속성으로 읽습니다.",
    en: "These are @utility rules the components compose. Open and close states come from the data-starting-style, data-ending-style, data-collapsed and data-hidden attributes Base UI sets.",
  },
  motionUtilitiesRiseItem: {
    ko: "motion-rise: tab-panel-in을 220ms ease-out-quint로 재생합니다. 목록 지연은 animation-delay: calc(var(--i) * 30ms)로 줍니다.",
    en: "motion-rise: plays tab-panel-in at 220ms ease-out-quint. Stagger a list with animation-delay: calc(var(--i) * 30ms).",
  },
  motionUtilitiesPopupItem: {
    ko: "motion-popup: 진입 200ms, 이탈 130ms. opacity, scale, translate를 함께 움직이고 Base UI가 정한 --transform-origin에서 자랍니다.",
    en: "motion-popup: 200ms in, 130ms out. Moves opacity, scale and translate, growing from the --transform-origin Base UI sets.",
  },
  motionUtilitiesFadeItem: {
    ko: "motion-fade: opacity만 200ms ease-out으로 바꿉니다. 배경 딤처럼 단순한 페이드에 씁니다.",
    en: "motion-fade: opacity only, 200ms ease-out. For plain fades such as a backdrop dim.",
  },
  motionUtilitiesCollapseItem: {
    ko: "motion-collapse: 240ms. Base UI Collapsible이 재는 --collapsible-panel-height로 높이를 잽니다.",
    en: "motion-collapse: 240ms. It animates to the --collapsible-panel-height Base UI Collapsible measures.",
  },
  motionUtilitiesDetailsItem: {
    ko: "motion-details: details 본문을 240ms로 열고 닫습니다. Chromium 131+와 Safari 18.4+에서 동작하고, 그 밖의 브라우저는 즉시 열고 닫습니다.",
    en: "motion-details: opens and closes a details body over 240ms. Works in Chromium 131+ and Safari 18.4+; other browsers toggle at once.",
  },
  motionUtilitiesRevealItem: {
    ko: "motion-reveal: 200ms에 opacity 150ms. 자식 하나를 감싸고 data-collapsed로 닫습니다. 가로 방향 짝은 motion-reveal-x입니다.",
    en: "motion-reveal: 200ms, opacity at 150ms. Wrap one child and close it with data-collapsed. motion-reveal-x is the horizontal counterpart.",
  },
  motionUtilitiesSwapItem: {
    ko: "motion-swap: 150ms. 두 자식을 같은 칸에 겹치고 data-hidden으로 비활성 쪽을 숨깁니다.",
    en: "motion-swap: 150ms. Stacks two children in one cell and hides the inactive one with data-hidden.",
  },
  motionUtilitiesIndicatorItem: {
    ko: "motion-indicator: 280ms ease-emphasized. 탭과 세그먼트 컨트롤의 표시가 항목 사이를 이동합니다.",
    en: "motion-indicator: 280ms ease-emphasized. The indicator travels between tab and segmented control items.",
  },
  motionUtilitiesFeedbackItem: {
    ko: "motion-colors는 150ms ease-out으로 색을 바꾸고, motion-press는 150ms에 :active에서 scale 0.97을 더합니다. 비활성 상태는 제외합니다.",
    en: "motion-colors changes color over 150ms ease-out, and motion-press adds scale 0.97 on :active over 150ms. Disabled states are excluded.",
  },
  motionReducedHeading: { ko: "동작 줄이기", en: "Reduced motion" },
  motionReducedBody: {
    ko: "prefers-reduced-motion: reduce에서는 globals.css가 모든 애니메이션과 전이 길이를 0.01ms로 줄이고 반복 횟수를 1로 고정합니다. scroll-behavior도 auto가 됩니다.",
    en: "Under prefers-reduced-motion: reduce, globals.css cuts every animation and transition to 0.01ms, fixes the iteration count at 1 and sets scroll-behavior to auto.",
  },
  motionReducedHookBody: {
    ko: "스크립트로 직접 그리는 모션은 useReducedMotion으로 같은 설정을 읽습니다. 이 훅은 서버 렌더와 첫 패스에서 false를 돌려줍니다. 자세한 계약은 훅 페이지에 있습니다.",
    en: "Motion drawn from script reads the same setting through useReducedMotion, which returns false during a server render and the first pass. Its hook page has the full contract.",
  },

  /* Platform and shortcuts ------------------------------------------------ */
  platformTitle: { ko: "플랫폼과 단축키", en: "Platform and shortcuts" },
  platformDescription: {
    ko: "OS와 실행 환경을 읽는 헬퍼, Mod 키 규칙, 단축키 문자열 문법입니다.",
    en: "The helpers that read the OS and the shell, the Mod key rules and the shortcut string syntax.",
  },
  platformOsHeading: { ko: "OS 감지", en: "Detecting the OS" },
  platformOsBody: {
    ko: "detectOs(input: PlatformInput = {})는 Os를 돌려줍니다. Os는 macos, windows, linux, ios, android, unknown입니다. 힌트는 userAgentData.platform, navigator.platform, user agent 순서로 읽고 처음 이름이 나온 값을 씁니다.",
    en: "detectOs(input: PlatformInput = {}) returns an Os: macos, windows, linux, ios, android or unknown. It reads the hints in order, userAgentData.platform, then navigator.platform, then the user agent, and takes the first that names an OS.",
  },
  platformOsIpadosItem: {
    ko: "힌트에 mac이 있고 터치 포인트가 1보다 크면 ios입니다. iPadOS가 Mac을 보고하기 때문입니다.",
    en: "A hint that says mac with more than one touch point is ios, because iPadOS reports a Mac.",
  },
  platformOsUnknownItem: {
    ko: "어느 힌트도 OS를 이름 붙이지 않으면 unknown입니다. 서버 렌더와 빈 입력도 unknown입니다.",
    en: "When no hint names an OS the result is unknown. A server render and empty input are unknown too.",
  },
  platformOsInputItem: {
    ko: "PlatformInput의 필드는 userAgent, platform, uaPlatform, maxTouchPoints입니다. 브라우저에서는 navigator에서 이 값을 채워 넘깁니다.",
    en: "PlatformInput holds userAgent, platform, uaPlatform and maxTouchPoints. In a browser, fill them from navigator.",
  },
  platformRuntimeHeading: { ko: "실행 환경", en: "Runtime" },
  platformRuntimeBody: {
    ko: "detectRuntime(win: RuntimeWindow | null = null)는 web 또는 desktop을 돌려줍니다. window.__TAURI_INTERNALS__가 있으면 desktop이고, 없으면 user agent에 electron이 있을 때 desktop입니다. 인자를 주지 않거나 null이면 web입니다.",
    en: "detectRuntime(win: RuntimeWindow | null = null) returns web or desktop. window.__TAURI_INTERNALS__ means desktop; otherwise an electron user agent means desktop. Omitted or null reports web.",
  },
  platformRuntimeWindowItem: {
    ko: "RuntimeWindow는 __TAURI_INTERNALS__와 navigator.userAgent만 읽습니다. 그 밖의 window 속성은 보지 않습니다.",
    en: "RuntimeWindow reads only __TAURI_INTERNALS__ and navigator.userAgent. Other window properties are not inspected.",
  },
  platformModHeading: { ko: "Mod 키", en: "The Mod key" },
  platformModBody: {
    ko: "단축키 문자열의 Mod는 OS마다 다른 실제 키를 가리킵니다.",
    en: "Mod in a shortcut string stands for a different physical key on each OS.",
  },
  platformModMacItem: {
    ko: "macos와 ios는 ⌘(metaKey)입니다. Ctrl이 함께 눌린 조합은 Mod로 보지 않습니다.",
    en: "macos and ios use ⌘ (metaKey). A combination that also holds Ctrl is not Mod.",
  },
  platformModOtherItem: {
    ko: "windows, linux, android는 Ctrl(ctrlKey)입니다. ⌘이 함께 눌린 조합은 Mod로 보지 않습니다.",
    en: "windows, linux and android use Ctrl (ctrlKey). A combination that also holds ⌘ is not Mod.",
  },
  platformModUnknownItem: {
    ko: "unknown은 둘 중 하나가 눌리면 Mod입니다. 서버 렌더와 첫 하이드레이션이 여기에 해당합니다.",
    en: "unknown treats either key as Mod. That covers a server render and the first hydration pass.",
  },
  platformModIsItem: {
    ko: "isModKey(event, os)는 그 OS의 Mod 키가 눌렸는지만 봅니다. 이벤트에서 key, metaKey, ctrlKey, altKey, shiftKey를 읽으므로 KeyboardEvent를 그대로 넘깁니다.",
    en: "isModKey(event, os) only answers whether that OS's Mod key is down. It reads key, metaKey, ctrlKey, altKey and shiftKey, so a KeyboardEvent passes as-is.",
  },
  platformStringHeading: { ko: "단축키 문자열", en: "Shortcut strings" },
  platformStringBody: {
    ko: "문자열은 +로 이어 붙이고 Mod, Shift, Alt와 마지막 키 하나로 씁니다. 예: Mod+K, Mod+Shift+Enter, Escape.",
    en: "A string joins its parts with + and holds Mod, Shift, Alt and one final key, such as Mod+K, Mod+Shift+Enter or Escape.",
  },
  platformStringFormatItem: {
    ko: "formatShortcut(keys, os)는 그리는 문자열을 만듭니다. macos와 ios는 ⌘⇧↵처럼 기호를 붙여 쓰고, 나머지는 Ctrl+Shift+Enter처럼 +를 유지합니다. unknown은 Mac 기호로 그립니다.",
    en: "formatShortcut(keys, os) builds the label. macos and ios glue the symbols, ⌘⇧↵, and the rest keep +, as in Ctrl+Shift+Enter. unknown draws the Mac symbols.",
  },
  platformStringMatchItem: {
    ko: "matchesShortcut(event, keys, os)는 키 이벤트를 문자열과 맞춥니다. Alt와 Shift는 문자열에 있는 그대로 눌리거나 눌리지 않아야 합니다.",
    en: "matchesShortcut(event, keys, os) tests a key event against the string. Alt and Shift must be held or released exactly as the string says.",
  },
  platformStringEdgeItem: {
    ko: "수정자만 있는 문자열은 어느 키와도 맞지 않습니다. esc와 escape는 같은 키이고, 비교는 대소문자를 가리지 않습니다.",
    en: "A string of modifiers alone matches nothing. esc and escape are the same key, and the comparison ignores case.",
  },
  platformStringMissingItem: {
    ko: "이름이 없는 키는 문자열에 쓴 그대로 비교합니다. K는 K입니다.",
    en: "A key with no label in the table is compared as written. K stays K.",
  },
  platformKbdHeading: { ko: "Kbd와 단축키 표시", en: "Kbd and key hints" },
  platformKbdBody: {
    ko: 'Kbd의 keys prop은 같은 문자열을 받아 그 OS의 라벨로 그립니다. keys="Mod+K"는 macOS에서 ⌘K, Windows에서 Ctrl+K입니다. keys를 주지 않으면 children을 그리므로 칩을 손으로 조합할 수 있습니다.',
    en: "Kbd's keys prop takes the same string and draws that OS's labels: keys=\"Mod+K\" is ⌘K on macOS and Ctrl+K on Windows. Without keys it renders children, so chips can be composed by hand.",
  },
  platformKbdSizeItem: {
    ko: "size는 sm, md, lg이고 높이가 16px, 20px, 24px입니다. 기본은 md입니다.",
    en: "size is sm, md or lg at 16px, 20px and 24px tall. The default is md.",
  },
  platformKbdHookItem: {
    ko: "키 힌트를 보여줄지 정하려면 useDevice의 keyboardHints를 봅니다. OS와 셸, Mod 키는 usePlatform이, keydown 연결은 useHotkey가 맡습니다. 두 훅의 계약은 훅 페이지에 있습니다.",
    en: "To decide whether to show a key hint, read keyboardHints from useDevice. usePlatform reports the OS, the shell and the Mod key, and useHotkey binds a keydown. Their hook pages hold the contracts.",
  },
  platformKbdGuardItem: {
    ko: "문자열이 실제 키 입력과 맞는지는 호출하는 쪽이 정합니다. keydown 처리에는 matchesShortcut을 쓰거나 useHotkey를 씁니다.",
    en: "Matching the string against real key presses is the caller's job: use matchesShortcut in a keydown handler, or useHotkey.",
  },

  /* Cursor ghost ---------------------------------------------------------- */
  ghostTitle: { ko: "커서 잔상", en: "Cursor ghost" },
  ghostDescription: {
    ko: "정밀한 포인터 뒤로 따라오는 화살표 잔상의 동작, 붙는 조건, 옵션입니다.",
    en: "The arrow trail that follows a fine pointer: how it draws, when it mounts and the options.",
  },
  ghostWhatHeading: { ko: "동작", en: "What it draws" },
  ghostWhatBody: {
    ko: "화살표 사본 5개가 실제 커서를 뒤따라 흐려집니다. 첫 사본이 포인터를 가장 가깝게 따라가고 뒤로 갈수록 느슨해지며 마지막 사본이 가장 흐립니다.",
    en: "Five arrow copies trail behind the real cursor and blur as they fall behind. The first follows the pointer most closely, each later one looser, and the last is the blurriest.",
  },
  ghostWhatCursorItem: {
    ko: "시스템 커서는 숨기지 않고 바꾸지도 않습니다.",
    en: "The native cursor is never hidden or replaced.",
  },
  ghostWhatLayerItem: {
    ko: "잔상은 페이지 맨 위의 고정 레이어에 있고 pointer-events: none과 aria-hidden입니다. 클릭, 호버, 포커스를 받지 않습니다.",
    en: "The trail lives in one fixed layer on top of the page with pointer-events: none and aria-hidden, so it takes no clicks, hovers or focus.",
  },
  ghostWhatBlendItem: {
    ko: "흰 화살표를 difference로 섞어 어두운 화면에서는 밝게, 밝은 화면에서는 어둡게 보입니다.",
    en: "A white arrow blended with difference reads light on a dark screen and dark on a light one.",
  },
  ghostWhenHeading: { ko: "붙는 조건", en: "When it mounts" },
  ghostWhenBody: {
    ko: "정밀한 포인터를 hover할 수 있는 환경에서만 붙습니다. 미디어 쿼리는 (hover: hover) and (pointer: fine)이고, 동작 줄이기 설정에서는 붙지 않습니다. 두 조건은 바뀔 때 다시 판단합니다.",
    en: "It mounts only where a fine pointer can hover: the query is (hover: hover) and (pointer: fine), and reduced motion keeps it off. Both are re-checked when they change.",
  },
  ghostWhenImportBody: {
    ko: '@horon-ai/react를 한 번이라도 import하면 페이지마다 한 번 자동으로 붙습니다. React를 쓰지 않는 페이지는 import "@horon-ai/react/cursor-ghost" 한 줄로 붙입니다. 이 사이트의 BaseLayout이 그 예입니다.',
    en: 'Any import of @horon-ai/react mounts it once per page. A page without React mounts it with one line, import "@horon-ai/react/cursor-ghost". This site\'s BaseLayout is the example.',
  },
  ghostOffHeading: { ko: "끄기", en: "Turning it off" },
  ghostOffBody: {
    ko: 'import보다 먼저 html 요소에 data-horon-cursor="off"를 둡니다. 자동 마운트가 꺼지고, 그 뒤에 옵션을 줘서 붙이려면 mountCursorGhost를 직접 부릅니다.',
    en: 'Put data-horon-cursor="off" on the html element before the import. That suppresses the automatic mount; call mountCursorGhost yourself afterwards for custom options.',
  },
  ghostOffItem: {
    ko: "속성 이름은 data-horon-cursor이고 값은 off입니다. 다른 값은 자동 마운트를 막지 않습니다.",
    en: "The attribute is data-horon-cursor and the value is off. Any other value leaves the automatic mount on.",
  },
  ghostOptionsHeading: { ko: "옵션", en: "Options" },
  ghostOptionsBody: {
    ko: "mountCursorGhost(options)는 잔상을 붙이고 떼는 함수를 돌려줍니다. 넘기지 않은 값은 기본값을 씁니다.",
    en: "mountCursorGhost(options) mounts the trail and returns the function that removes it. Omitted keys take their defaults.",
  },
  ghostOptionsGhostsItem: {
    ko: "ghosts: 화살표 사본 수. 기본 5.",
    en: "ghosts: number of arrow copies. Default 5.",
  },
  ghostOptionsSizeItem: {
    ko: "size: 화살표 높이(CSS px). 기본 26.",
    en: "size: arrow height in CSS px. Default 26.",
  },
  ghostOptionsFollowItem: {
    ko: "headFollow: 첫 사본이 포인터를 따라가는 비율. 프레임마다 적용되고 기본 0.16입니다.",
    en: "headFollow: how far the first copy moves toward the pointer, applied per frame. Default 0.16.",
  },
  ghostOptionsSmearItem: {
    ko: "smear: 마지막 사본의 흐림 폭(CSS px). 기본 14.",
    en: "smear: blur spread of the last copy in CSS px. Default 14.",
  },
  ghostOptionsColorItem: {
    ko: 'color: 화살표 채움색. 기본 "#FFFFFF"이고 difference로 섞이므로 흰색이 밝은 화면에서 어둡게 보입니다.',
    en: 'color: the arrow fill. Default "#FFFFFF", blended with difference, so white reads dark on a light screen.',
  },
  ghostOptionsTeardownBody: {
    ko: "돌려받은 함수를 부르면 레이어, 리스너, 대기 중인 애니메이션 프레임이 함께 정리됩니다. window, document, matchMedia가 없는 서버 렌더에서는 아무것도 하지 않는 함수를 돌려줍니다.",
    en: "Calling the returned function removes the layer, its listeners and any pending animation frame. On a server render without window, document or matchMedia it returns a no-op.",
  },

  /* Working in the repo --------------------------------------------------- */
  contributingTitle: { ko: "저장소에서 개발", en: "Working in the repo" },
  contributingDescription: {
    ko: "저장소를 받아 토큰과 문서 사이트를 만들고, 컴포넌트를 추가할 때 고치는 파일과 검사입니다.",
    en: "Clone the repo, build the tokens and the docs site, and see the files and checks a new component needs.",
  },
  contributingSetupHeading: { ko: "준비", en: "Setup" },
  contributingSetupBody: {
    ko: "저장소 루트에서 bun install을 한 번 실행합니다. 워크스페이스라 packages와 apps의 의존성이 함께 설치됩니다.",
    en: "Run bun install once at the repository root. It is a workspace, so the dependencies of packages and apps install together.",
  },
  contributingSetupTokensItem: {
    ko: "bun run tokens: @horon-ai/tokens를 빌드해 theme.css를 만들고 Flutter 토큰을 생성합니다.",
    en: "bun run tokens: builds @horon-ai/tokens into theme.css and generates the Flutter tokens.",
  },
  contributingSetupSiteItem: {
    ko: "bun run site: 문서 사이트를 띄웁니다. 주소는 http://localhost:4321입니다.",
    en: "bun run site: starts the docs site at http://localhost:4321.",
  },
  contributingSetupBuildItem: {
    ko: "bun run build:site: 사이트를 정적 파일로 빌드합니다. bun run deploy:site는 빌드한 뒤 Cloudflare Pages로 올립니다.",
    en: "bun run build:site: builds the site as static files. bun run deploy:site builds and uploads to Cloudflare Pages.",
  },
  contributingChecksHeading: { ko: "검사", en: "Checks" },
  contributingChecksBody: {
    ko: "루트 스크립트는 turbo를 거쳐 각 패키지의 같은 이름 스크립트를 실행합니다.",
    en: "The root scripts go through turbo and run each package's script of the same name.",
  },
  contributingChecksLintItem: {
    ko: "bun run lint: oxlint입니다. 사이트 패키지는 경고도 실패로 봅니다.",
    en: "bun run lint: oxlint. The site package treats a warning as a failure.",
  },
  contributingChecksTypeItem: {
    ko: "bun run typecheck: astro check와 tsc입니다. 사이트는 먼저 데모 래퍼를 생성합니다.",
    en: "bun run typecheck: astro check and tsc. The site generates its demo wrappers first.",
  },
  contributingChecksTestItem: {
    ko: "bun test: 저장소 루트에서 실행합니다. 진입점 재수출, 카탈로그, 토큰 CSS, i18n을 검사합니다.",
    en: "bun test: runs at the repository root over the entry-point exports, the catalog, the token CSS and i18n.",
  },
  contributingChecksBuildItem: {
    ko: "bun run build는 각 패키지의 build 스크립트를 돌리고, bun run format은 prettier를 돌립니다.",
    en: "bun run build runs each package's build script, and bun run format runs prettier.",
  },
  contributingComponentHeading: { ko: "컴포넌트 추가", en: "Adding a component" },
  contributingComponentBody: {
    ko: "컴포넌트 하나는 다섯 파일을 함께 고칩니다. 어느 하나가 빠지면 테스트가 실패합니다.",
    en: "One component touches five files. Leave one out and a test fails.",
  },
  contributingComponentFileItem: {
    ko: "packages/react/src/components/<slug>.tsx: 컴포넌트와 props 타입입니다.",
    en: "packages/react/src/components/<slug>.tsx: the component and its props type.",
  },
  contributingComponentBarrelItem: {
    ko: "packages/react/src/index.ts: ./components/<slug> 재수출 한 줄입니다.",
    en: "packages/react/src/index.ts: one re-export line for ./components/<slug>.",
  },
  contributingComponentCatalogItem: {
    ko: "apps/site/src/data/components.ts: 카탈로그 항목입니다. slug, title, group, description을 채웁니다.",
    en: "apps/site/src/data/components.ts: the catalog entry, with slug, title, group and description.",
  },
  contributingComponentDemoItem: {
    ko: "apps/site/src/components/demos/<slug>.tsx: 라이브 프리뷰와 사용 코드입니다.",
    en: "apps/site/src/components/demos/<slug>.tsx: the live preview and its usage code.",
  },
  contributingComponentThumbItem: {
    ko: "apps/site/src/components/thumbnails/<slug>.tsx: 카탈로그의 인덱스 썸네일입니다.",
    en: "apps/site/src/components/thumbnails/<slug>.tsx: the catalog's index thumbnail.",
  },
  contributingComponentWrapperItem: {
    ko: "데모 래퍼는 apps/site/scripts/generate-demo-wrappers.ts가 만들고 커밋하지 않습니다. dev, build, typecheck가 먼저 실행합니다.",
    en: "apps/site/scripts/generate-demo-wrappers.ts writes the demo wrappers, which are not committed. dev, build and typecheck run it first.",
  },
  contributingGuardsHeading: { ko: "테스트 가드", en: "What the tests check" },
  contributingGuardsBarrelBody: {
    ko: "packages/react/test/exports.test.ts는 컴포넌트 파일마다 진입점 재수출이 있는지, 값 내보내기를 이름으로 가져올 수 있는지, 값 이름이 파일 사이에서 겹치지 않는지 봅니다.",
    en: "packages/react/test/exports.test.ts checks that every component file is re-exported from the entry point, that each value export imports by name, and that no value name repeats across files.",
  },
  contributingGuardsSiteBody: {
    ko: "apps/site/test/components.test.ts는 컴포넌트마다 데모, 카탈로그 항목, 썸네일이 있는지와 카탈로그에 라이브러리에 없는 항목이 없는지 봅니다.",
    en: "apps/site/test/components.test.ts checks that every component has a demo, a catalog entry and a thumbnail, and that no catalog entry lacks a component.",
  },
  contributingTokensHeading: { ko: "토큰", en: "Tokens" },
  contributingTokensBody: {
    ko: "packages/tokens/theme.css는 생성 파일입니다. 손으로 고치지 않고 bun run tokens로 다시 만듭니다. packages/tokens/test/theme-css.test.ts가 커밋된 파일과 생성 결과를 비교합니다.",
    en: "packages/tokens/theme.css is generated. Never edit it by hand; rebuild it with bun run tokens. packages/tokens/test/theme-css.test.ts compares the committed file with a fresh build.",
  },
});

/** Code samples. The setup sample has shell comments, so it is `Localized`. */
export const conceptsSnippets: {
  importsBarrel: string;
  importsSubpath: string;
  importsTypes: string;
  importsHelpers: string;
  importsClient: string;
  glassHost: string;
  glassCard: string;
  motionClasses: string;
  platformDetect: string;
  platformKbd: string;
  ghostOptions: string;
  repoSetup: Localized;
} = {
  importsBarrel: `import { Button, Card, Input } from "@horon-ai/react";

export function Example() {
  return (
    <Card title="Inbox Manager" description="6 emails need you.">
      <Input surface="solid" placeholder="Search bots" />
      <Button>New bot</Button>
    </Card>
  );
}`,
  importsSubpath: `import { Button } from "@horon-ai/react/components/button";
import { Card } from "@horon-ai/react/components/card";`,
  importsTypes: `import { Card, type CardProps } from "@horon-ai/react";

export function Panel(props: CardProps) {
  return <Card {...props} />;
}`,
  importsHelpers: `import { cn, detectOs, formatShortcut } from "@horon-ai/react";

function shortcutLabel(userAgent: string) {
  const os = detectOs({ userAgent });
  return formatShortcut("Mod+K", os);
}

const className = cn("bg-bg-surface", "bg-glass-regular");`,
  importsClient: `"use client";

import { useState } from "react";
import { Switch } from "@horon-ai/react";

export function Setting() {
  const [on, setOn] = useState(false);
  return <Switch label="Notifications" checked={on} onCheckedChange={setOn} />;
}`,
  glassHost: `import { LiquidGlass } from "@horon-ai/react";

export function FloatingBar() {
  return (
    <div className="relative isolate overflow-clip rounded-xl bg-glass-regular [&>.liquid-layers]:-z-10">
      <LiquidGlass />
      <p className="px-4 py-3 text-body-sm">Floating chrome</p>
    </div>
  );
}`,
  glassCard: `<Card surface="glass" title="Deploy" description="Ship the build." />
<Card surface="frost" title="Today" description="3 runs finished." />`,
  motionClasses: `<button className="motion-press motion-colors rounded-md bg-bg-surface px-3 py-1.5 text-label-sm">
  Save
</button>

<div className="motion-rise" style={{ animationDelay: "calc(var(--i) * 30ms)" }}>
  ...
</div>`,
  platformDetect: `import { detectOs, detectRuntime, formatShortcut, matchesShortcut, type Os } from "@horon-ai/react";

function readPlatform() {
  const os = detectOs({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  });
  return { os, shell: detectRuntime(window), label: formatShortcut("Mod+K", os) };
}

function bindPaletteKey(os: Os, open: () => void) {
  const onKeyDown = (event: KeyboardEvent) => {
    if (matchesShortcut(event, "Mod+K", os)) open();
  };
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}`,
  platformKbd: `import { Kbd } from "@horon-ai/react";

<span className="flex items-center gap-1 text-caption">
  Search <Kbd keys="Mod+K" />
  Send <Kbd keys="Mod+Enter" size="sm" />
</span>`,
  ghostOptions: `import { mountCursorGhost } from "@horon-ai/react";

const unmount = mountCursorGhost({ ghosts: 2, size: 20, headFollow: 0.2, smear: 10 });`,
  repoSetup: {
    ko: `bun install        # 워크스페이스 의존성 설치
bun run tokens     # theme.css와 Flutter 토큰 생성
bun run site       # 문서 사이트 → http://localhost:4321`,
    en: `bun install        # install the workspace dependencies
bun run tokens     # writes theme.css and the Flutter tokens
bun run site       # docs site → http://localhost:4321`,
  },
};
