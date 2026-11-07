import { defineMessages } from "@/i18n";

/**
 * Copy for the React introduction and the four pages beside it: installation,
 * styling, theming and icons. Every fact here comes from `packages/react`
 * (README, `src/index.ts`, component props) and `packages/tokens`.
 */

/** `/develop/react`: what the package is, a three-step start and the page map. */
export const reactIntroMessages = defineMessages({
  title: { ko: "소개", en: "Introduction" },
  description: {
    ko: "@horon-ai/react는 84개 컴포넌트와 토큰, 훅을 담은 웹 라이브러리입니다. 동작과 접근성은 Base UI에서 옵니다.",
    en: "@horon-ai/react is a web library of 84 components, tokens and hooks. Behaviour and accessibility come from Base UI.",
  },

  packageHeading: { ko: "패키지 구성", en: "What the package is" },
  packageBody: {
    ko: "컴포넌트의 모양과 값은 Figma Horon 파일에서 왔고, 동작과 접근성은 Base UI(@base-ui/react)에 맡깁니다. 색, 글자, 간격은 @horon-ai/tokens의 값이고 Tailwind CSS v4 유틸리티 클래스로 노출됩니다. 빌드 산출물 없이 TypeScript 소스를 그대로 배포하므로 소비하는 쪽 번들러가 소스를 컴파일합니다.",
    en: "Component looks and values come from the Figma Horon file, while behaviour and accessibility come from Base UI (@base-ui/react). Colour, type and spacing are @horon-ai/tokens values exposed as Tailwind CSS v4 utilities. The package ships TypeScript source with no build output, so the consuming bundler compiles it.",
  },
  itemComponents: {
    ko: "84개 컴포넌트: 버튼과 입력에서 대화상자, 데이터 표, 에이전트 패널까지 한 진입점에서 가져옵니다.",
    en: "84 components: buttons and fields through dialogs, data tables and agent panels, all from one entry.",
  },
  itemTokens: {
    ko: "토큰: 색, 글자, 간격, 반경, 그림자, 유리 재질이 @horon-ai/tokens에 있고, theme.css가 CSS 변수로 바꿉니다.",
    en: "Tokens: colour, type, spacing, radius, shadow and glass come from @horon-ai/tokens, and theme.css turns them into CSS variables.",
  },
  itemHooks: {
    ko: "훅 8개: useColorScheme, useMediaQuery, useHotkey처럼 브라우저 상태를 읽는 훅이 들어 있습니다.",
    en: "Eight hooks: useColorScheme, useMediaQuery and useHotkey read browser state for you.",
  },
  itemSource: {
    ko: "React 19 이상이 피어 의존성입니다. react와 react-dom을 >=19로 요구합니다.",
    en: "React 19 or newer is the peer dependency: react and react-dom at >=19.",
  },

  quickHeading: { ko: "빠른 시작", en: "Quick start" },
  quickBody: {
    ko: "세 단계입니다. 패키지를 더하고, 전역 스타일을 한 번 불러오고, 컴포넌트를 씁니다.",
    en: "Three steps: add the packages, import the global styles once, then use a component.",
  },
  stepPackages: { ko: "패키지 설치", en: "Install the packages" },
  stepStyles: { ko: "전역 스타일", en: "Load the global styles" },
  stepUse: { ko: "첫 컴포넌트", en: "Use a component" },

  docsHeading: { ko: "문서", en: "Docs" },
  docsBody: {
    ko: "이 아래 페이지가 설치에서 시작해 스타일, 테마, 아이콘 순서로 이어집니다.",
    en: "The pages below start at installation and continue through styling, theming and icons.",
  },
});

/** `/develop/react/installation`: packages, peers, local paths and bundler setup. */
export const reactInstallationMessages = defineMessages({
  title: { ko: "설치", en: "Installation" },
  description: {
    ko: "패키지를 더하고 번들러를 설정하면 컴포넌트를 쓸 수 있습니다.",
    en: "Add the packages and configure the bundler to use the components.",
  },

  packagesHeading: { ko: "패키지 추가", en: "Add the packages" },
  packagesBody: {
    ko: "컴포넌트, 토큰, 아이콘을 함께 설치합니다. globals.css가 Tailwind CSS v4를 import하므로 tailwindcss도 필요하고, Vite에서는 @tailwindcss/vite 플러그인을 함께 넣습니다.",
    en: "Install the components, the tokens and the icons together. globals.css imports Tailwind CSS v4, so tailwindcss is needed too, and Vite takes the @tailwindcss/vite plugin.",
  },
  npmBody: {
    ko: "npm에서는 같은 이름으로 설치합니다.",
    en: "On npm, install the same names.",
  },

  peerHeading: { ko: "피어 의존성", en: "Peer dependencies" },
  peerBody: {
    ko: "package.json의 peerDependencies가 react와 react-dom을 >=19로 요구합니다. React 18 이하에서는 설치가 피어 의존성 경고를 냅니다.",
    en: "The package.json peerDependencies require react and react-dom at >=19. On React 18 or older, the install reports a peer dependency warning.",
  },

  localHeading: { ko: "로컬 경로로 설치", en: "Install from a local path" },
  localBody: {
    ko: "저장소를 앱 옆에 두고 file: 경로로 가리킵니다. README에 있는 방식이고, 패키지를 고치면 앱이 그 소스를 바로 씁니다.",
    en: "Keep the repository next to your app and point at it with a file: path. This is the way the README does it: an edit in the package reaches the app as source.",
  },

  bundlerHeading: { ko: "빌드 도구 설정", en: "Bundler setup" },
  bundlerBody: {
    ko: "패키지는 TypeScript 소스를 그대로 배포하고 빌드 단계가 없습니다. 그래서 번들러가 node_modules 안의 소스를 컴파일해야 합니다.",
    en: "The package ships TypeScript source with no build step, so the bundler has to compile the source inside node_modules.",
  },
  viteHeading: { ko: "Vite", en: "Vite" },
  viteBody: {
    ko: "Tailwind는 @tailwindcss/vite 플러그인으로 넣습니다. 이 플러그인이 없으면 globals.css의 @import \"tailwindcss\"가 처리되지 않아 유틸리티 클래스가 생성되지 않습니다.",
    en: "Tailwind comes in through the @tailwindcss/vite plugin. Without it, the @import \"tailwindcss\" in globals.css is not resolved and no utility classes are generated.",
  },
  nextHeading: { ko: "Next.js", en: "Next.js" },
  nextBody: {
    ko: "Next.js는 node_modules의 TypeScript를 기본으로 컴파일하지 않습니다. transpilePackages에 두 패키지를 넣어야 import가 해석되고, 넣지 않으면 소스의 타입 구문에서 문법 오류가 납니다.",
    en: "Next.js does not compile TypeScript in node_modules by default. Add both packages to transpilePackages so the imports resolve; without it the type syntax in the source fails to parse.",
  },

  checkHeading: { ko: "설치 확인", en: "Check the install" },
  checkBody: {
    ko: "Button 하나를 띄웁니다. 둥근 알약 모양에 토큰 색으로 그려지고 콘솔에 스타일 오류가 없으면 설치가 끝났습니다.",
    en: "Render one Button. A rounded pill in the token colours, with no style errors in the console, means the install is done.",
  },
});

/** `/develop/react/styling`: the global import, what it brings and token classes. */
export const reactStylingMessages = defineMessages({
  title: { ko: "스타일", en: "Styling" },
  description: {
    ko: "전역 CSS를 한 번 불러오고, 토큰 클래스로 모양을 정합니다.",
    en: "Load the global CSS once and shape things with token classes.",
  },

  importHeading: { ko: "전역 스타일 불러오기", en: "Load the global styles" },
  importBody: {
    ko: "앱 진입 CSS에서 globals.css를 한 번 import하고, @source 줄로 컴포넌트 소스를 스캔하게 합니다. @source 경로는 앱의 CSS 파일 위치에 맞춰 조정합니다.",
    en: "Import globals.css once in the app entry stylesheet, and add the @source line so Tailwind scans the component sources. Adjust the @source path to where your CSS file sits.",
  },

  bringsHeading: { ko: "globals.css가 가져오는 것", en: "What globals.css brings" },
  bringsTailwind: {
    ko: "Tailwind CSS v4와 @theme 토큰: theme.css의 변수가 유틸리티 클래스가 됩니다.",
    en: "Tailwind CSS v4 and the @theme tokens: the theme.css variables become utility classes.",
  },
  bringsFonts: {
    ko: "서체: Pretendard Variable과 Geist Mono Variable을 @font-face로 불러옵니다.",
    en: "Typefaces: Pretendard Variable and Geist Mono Variable load through @font-face.",
  },
  bringsGlass: {
    ko: "유리 레이어 스타일: .liquid-layers와 veil-field, veil-overlay, veil-drop입니다.",
    en: "Glass layer styles: .liquid-layers plus veil-field, veil-overlay and veil-drop.",
  },
  bringsBase: {
    ko: "기본값: html은 --font-sans를 쓰고, body는 bg-default와 text-primary를 칠합니다.",
    en: "Defaults: html uses --font-sans, and body paints bg-default with text-primary.",
  },
  bringsMotion: {
    ko: "모션 유틸리티: motion-popup, motion-press 같은 클래스와 prefers-reduced-motion 처리가 들어 있습니다.",
    en: "Motion utilities: classes such as motion-popup and motion-press, plus prefers-reduced-motion handling.",
  },

  tokenHeading: { ko: "토큰 클래스", en: "Token classes" },
  tokenBody: {
    ko: "클래스 이름이 곧 토큰입니다. 글자 크기는 text-에 13개 스타일 이름을 붙이고, 색은 text-, bg-, border-에 색 토큰 이름을 붙입니다. 예를 들어 text-label-md, text-text-primary, bg-bg-surface, border-border-default, bg-glass-regular입니다.",
    en: "The class name is the token. Text size is text- plus one of the 13 style names; colour is text-, bg- or border- plus a colour token name. For example text-label-md, text-text-primary, bg-bg-surface, border-border-default and bg-glass-regular.",
  },

  overrideHeading: { ko: "클래스로 덮어쓰기", en: "Override with a class" },
  overrideBody: {
    ko: "컴포넌트는 넘긴 className을 자기 클래스 뒤에 붙입니다. cn()은 토큰 이름을 아는 tailwind-merge라서 text-label-md(크기)와 text-text-primary(색)를 다른 종류로 구분하고, 같은 종류에서는 뒤에 온 클래스가 이깁니다.",
    en: "A component appends the className you pass after its own classes. cn() is a tailwind-merge that knows the token names, so text-label-md (size) and text-text-primary (colour) stay different groups, and within one group the later class wins.",
  },
  overrideNote: {
    ko: "조건부 클래스는 cn()으로 묶습니다. false, null, undefined는 무시합니다.",
    en: "Group conditional classes with cn(); false, null and undefined are dropped.",
  },
});

/** `/develop/react/theming`: dark mode, platform type scale, JS tokens. */
export const reactThemingMessages = defineMessages({
  title: { ko: "테마", en: "Theming" },
  description: {
    ko: "다크 모드와 플랫폼 글자 크기를 켜고, 같은 토큰 값을 JS에서 읽습니다.",
    en: "Turn on dark mode and the platform type scale, and read the same token values from JavaScript.",
  },

  darkHeading: { ko: "다크 모드", en: "Dark mode" },
  darkBody: {
    ko: "상위 요소에 dark 클래스를 두면 팔레트가 바뀝니다. globals.css의 custom-variant dark가 dark: 유틸리티를 .dark 아래로 한정하므로, dark:text-text-primary 같은 클래스가 같은 규칙을 따릅니다. 값은 @horon-ai/tokens의 darkColors에서 옵니다.",
    en: "A dark class on an ancestor switches the palette. The custom-variant dark in globals.css scopes dark: utilities under .dark, so a class such as dark:text-text-primary follows the same rule. The values come from darkColors in @horon-ai/tokens.",
  },
  darkLinkPrefix: {
    ko: "스위치는 이 클래스를 토글하고, 현재 스킴은 ",
    en: "The switch toggles the class, and ",
  },
  darkLinkSuffix: {
    ko: "이 읽어 알려 줍니다.",
    en: " reports the current scheme.",
  },

  platformHeading: { ko: "플랫폼 글자 크기", en: "Platform type scale" },
  platformBody: {
    ko: "상위 요소에 data-platform=\"desktop\" 또는 data-platform=\"mobile\"을 두면 13개 글자 스타일의 크기와 줄 높이가 그 플랫폼 값으로 바뀝니다. 값이 없으면 Web입니다. 예를 들어 body-md는 Web 16px, Desktop 14px, Mobile 16px이고 display-lg는 56, 48, 36px입니다.",
    en: "With data-platform=\"desktop\" or data-platform=\"mobile\" on an ancestor, all 13 text styles take that platform's size and line height. With no value they use the Web values: body-md is 16px on Web, 14px on Desktop and 16px on Mobile, and display-lg is 56, 48 and 36px.",
  },
  platformRule: {
    ko: "새 크기를 만들지 않습니다. 값이 빠졌으면 세 플랫폼 값을 함께 토큰에 추가합니다.",
    en: "No one-off sizes: a missing value is added to the tokens for all three platforms at once.",
  },

  jsHeading: { ko: "JS에서 토큰 읽기", en: "Read tokens in JavaScript" },
  jsBody: {
    ko: "@horon-ai/tokens는 lightColors, darkColors, primitives, glass, veil, radius, shadow, spacing, fontFamily, fontWeight, platforms, textStyles를 내보냅니다. 색 키는 CSS 변수 이름에서 --color- 접두사를 뺀 형태입니다.",
    en: "@horon-ai/tokens exports lightColors, darkColors, primitives, glass, veil, radius, shadow, spacing, fontFamily, fontWeight, platforms and textStyles. A colour key is the CSS variable name without the --color- prefix.",
  },

  generatedHeading: { ko: "theme.css는 생성 파일", en: "theme.css is generated" },
  generatedBody: {
    ko: "packages/tokens/theme.css는 packages/tokens/src의 값에서 만듭니다. 손으로 고치면 커밋된 파일과 생성 결과를 비교하는 테스트가 실패합니다. 값을 바꿀 때는 원본 토큰을 고치고 다시 생성합니다.",
    en: "packages/tokens/theme.css is built from the values in packages/tokens/src. Editing it by hand fails the test that compares the committed file with a fresh build. Change the source tokens and generate again.",
  },
});

/** `/develop/react/icons`: Phosphor Regular, the icon props and the Horon mark. */
export const reactIconsMessages = defineMessages({
  title: { ko: "아이콘", en: "Icons" },
  description: {
    ko: "Phosphor Regular 아이콘과 Horon 눈 마크를 씁니다.",
    en: "Use Phosphor Regular icons and the Horon eye mark.",
  },

  phosphorHeading: { ko: "Phosphor Regular", en: "Phosphor Regular" },
  phosphorBody: {
    ko: "아이콘은 @phosphor-icons/react의 Regular 굵기를 그대로 씁니다. 색은 currentColor를 따라가므로 주변 글자 색이 그대로 적용되고, 크기 기본값은 1em이라 글자 크기를 따릅니다.",
    en: "Icons are @phosphor-icons/react at the Regular weight. They take currentColor, so the surrounding text colour applies, and default to 1em so they follow the font size.",
  },

  passHeading: { ko: "컴포넌트에 넘기기", en: "Pass an icon to a component" },
  passBody: {
    ko: "Button과 IconButton은 icon prop을 받습니다. Button의 아이콘은 라벨 앞에 놓이고 sm과 md에서 16px, lg에서 20px로 그려집니다. IconButton은 정사각이고 아이콘을 16, 20, 24px로 그립니다.",
    en: "Button and IconButton take an icon prop. A Button icon sits before the label and draws at 16px on sm and md, 20px on lg. IconButton is square and draws its icon at 16, 20 or 24px.",
  },

  sizeHeading: { ko: "크기와 색", en: "Size and colour" },
  sizeBody: {
    ko: "아이콘의 색은 텍스트 토큰 클래스로 정하고, 크기는 size-4 같은 유틸리티로 맞춥니다. 컴포넌트에 넘긴 아이콘은 컴포넌트가 크기를 잡으므로 size를 따로 주지 않습니다.",
    en: "Set an icon's colour with a text token class and its size with a utility such as size-4. An icon passed to a component is sized by that component, so leave size off it.",
  },

  horonHeading: { ko: "Horon 아이콘", en: "The Horon mark" },
  horonBody: {
    ko: "Phosphor에 없는 Horon 눈 마크는 HoronIcon으로 그립니다. size는 px 숫자나 CSS 길이이고 기본값은 1em입니다. 이름을 데이터로 고르는 경우에는 HoronGlyph와 iconNames를 씁니다.",
    en: "The Horon eye mark, which Phosphor lacks, is HoronIcon. Its size is a px number or a CSS length and defaults to 1em. When the name comes from data, use HoronGlyph with iconNames.",
  },
});

/** Code samples. Every one is copied from a real package entry or README snippet. */
export const reactStartSnippets: {
  install: string;
  styles: string;
  firstComponent: string;
  installNpm: string;
  peers: string;
  localPath: string;
  viteConfig: string;
  nextConfig: string;
  check: string;
  tokenClasses: string;
  override: string;
  darkHtml: string;
  darkToggle: string;
  platformHtml: string;
  tokensJs: string;
  tokensBuild: string;
  phosphorInstall: string;
  phosphorUse: string;
  componentIcons: string;
  iconSizing: string;
  horonIcon: string;
} = {
  install: `bun add @horon-ai/react @horon-ai/tokens @phosphor-icons/react
bun add -d tailwindcss @tailwindcss/vite`,
  styles: `@import "@horon-ai/react/globals.css";
@source "../node_modules/@horon-ai/react/src/**/*.{ts,tsx}";`,
  firstComponent: `import { Button, Card, Input } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

export function Inbox() {
  return (
    <Card title="Inbox Manager" description="6 emails need you.">
      <Input surface="solid" placeholder="Search bots" />
      <Button icon={<Plus />}>New bot</Button>
    </Card>
  );
}`,
  installNpm: `npm install @horon-ai/react @horon-ai/tokens @phosphor-icons/react
npm install -D tailwindcss @tailwindcss/vite`,
  peers: `{
  "peerDependencies": {
    "react": ">=19",
    "react-dom": ">=19"
  }
}`,
  localPath: `{
  "dependencies": {
    "@horon-ai/react": "file:../design/packages/react",
    "@horon-ai/tokens": "file:../design/packages/tokens"
  }
}`,
  viteConfig: `import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});`,
  nextConfig: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@horon-ai/react", "@horon-ai/tokens"],
};

export default nextConfig;`,
  check: `import { Button } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

export function Check() {
  return <Button icon={<Plus />}>Installed</Button>;
}`,
  tokenClasses: `export function Note() {
  return (
    <section className="rounded-lg border border-border-default bg-bg-surface p-4">
      <p className="text-label-md text-text-primary">Build finished</p>
      <p className="text-body-sm text-text-secondary">3 checks passed, 0 failed.</p>
    </section>
  );
}`,
  override: `import { Button, cn } from "@horon-ai/react";

export function Actions({ busy }: { busy: boolean }) {
  return (
    <Button className={cn("w-full", busy && "opacity-60")} disabled={busy}>
      Save changes
    </Button>
  );
}`,
  darkHtml: `<html lang="ko" class="dark">`,
  darkToggle: `import { Button, useColorScheme } from "@horon-ai/react";

export function ThemeToggle() {
  const scheme = useColorScheme();
  return (
    <Button
      variant="solid"
      onClick={() => document.documentElement.classList.toggle("dark")}
    >
      {scheme === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  );
}`,
  platformHtml: `<body data-platform="mobile">`,
  tokensJs: `import { lightColors, radius, textStyles } from "@horon-ai/tokens";

lightColors["text-primary"]; // "#17181a"
radius.md; // 12
textStyles["body-md"].size.web; // 16`,
  tokensBuild: `bun run tokens`,
  phosphorInstall: `bun add @phosphor-icons/react`,
  phosphorUse: `import { MagnifyingGlass } from "@phosphor-icons/react";

export function SearchHint() {
  return (
    <span className="flex items-center gap-1.5 text-label-md text-text-secondary">
      <MagnifyingGlass size={16} />
      Search
    </span>
  );
}`,
  componentIcons: `import { Button, IconButton } from "@horon-ai/react";
import { Plus, Trash } from "@phosphor-icons/react";

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button icon={<Plus />}>New bot</Button>
      <IconButton icon={<Trash />} label="Delete bot" variant="solid" />
    </div>
  );
}`,
  iconSizing: `import { Trash } from "@phosphor-icons/react";

export function DeleteHint() {
  return (
    <span className="flex items-center gap-1.5 text-caption text-text-danger">
      <Trash className="size-4" />
      Delete removes the bot and its runs.
    </span>
  );
}`,
  horonIcon: `import { HoronIcon } from "@horon-ai/react";

export function Brand() {
  return (
    <a href="/" className="flex items-center gap-2 text-label-lg text-text-primary">
      <HoronIcon size={22} />
      Horon
    </a>
  );
}`,
};
