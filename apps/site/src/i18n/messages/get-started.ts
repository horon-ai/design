import { defineMessages, type Localized } from "@/i18n";

/** Get Started page copy and its code samples. */
export const getStartedMessages = defineMessages({
  title: { ko: "Get Started", en: "Get Started" },
  description: {
    ko: "HORON 디자인 시스템은 하나의 토큰 소스에서 웹 컴포넌트와 문서 사이트의 값을 함께 냅니다. 아래 절차대로 설치하고, 토큰을 생성하고, 컴포넌트를 가져다 쓰면 됩니다.",
    en: "HORON Design System serves web components and the docs site from one token source. Install the packages, build the tokens, and import the components as below.",
  },

  welcomeTitle: { ko: "처음 오셨나요?", en: "First time here?" },
  welcomeBody: {
    ko: "설치 세 줄, 토큰 생성 한 줄, 그리고 컴포넌트 import 한 줄이면 시작할 수 있습니다.",
    en: "Three install lines, one token build, and one component import are enough to start.",
  },
  welcomeMascotAlt: { ko: "인사하는 Horon 마스코트", en: "Horon mascot waving" },

  whatIsTitle: { ko: "무엇인가요", en: "What it is" },
  whatIsLead: { ko: "HORON의 UI는 ", en: "HORON UI comes down to " },
  whatIsKeywords: {
    ko: "잉크와 종이, 하늘색 액센트, 리퀴드 글래스",
    en: "ink and paper, a sky accent, and liquid glass",
  },
  whatIsMid: {
    ko: "로 정리됩니다. 값은 모두 Figma ",
    en: ". Every value is read from variables in the Figma ",
  },
  whatIsTail: {
    ko: " 파일의 변수에서 읽었고, 컴포넌트는 Base UI 위에 그 값만 참조해 만들었습니다.",
    en: " file; components sit on Base UI and reference only those values.",
  },
  tokenLead: { ko: "토큰 정본은 ", en: "There is one token source: " },
  tokenMid: {
    ko: " 하나입니다. 이 패키지가 웹용 CSS(",
    en: ". It emits the web CSS (",
  },
  tokenTail: {
    ko: ")를 내기 때문에, 컴포넌트와 문서 사이트의 색·간격·타이포가 어긋나지 않습니다.",
    en: "), so components and the docs site keep the same color, spacing, and type.",
  },

  installTitle: { ko: "설치", en: "Install" },

  webTitle: { ko: "웹에서 쓰기", en: "Use in web" },
  webLead: { ko: "엔트리에서 ", en: "Import " },
  webMid: {
    ko: "를 한 번 불러오고, 컴포넌트는 배럴 또는 하위 경로로 가져옵니다. Tailwind CSS v4가 함께 들어오고, 아이콘은 ",
    en: " once at the entry, then bring components from the barrel or a subpath. Tailwind CSS v4 comes along; icons use ",
  },
  webTail: { ko: "를 씁니다.", en: "." },

  appsTitle: { ko: "앱에서 확인하기", en: "Check it in the app" },
  appsLead: {
    ko: "저장소의 앱은 같은 컴포넌트 레이어를 소비합니다. 문서 사이트는 ",
    en: "Apps in the repository consume the same component layer. The docs site is ",
  },
  appsTail: {
    ko: "이고, 컴포넌트의 라이브 프리뷰도 이 사이트의 컴포넌트 페이지에 있습니다.",
    en: ", and component live previews live on its component pages.",
  },

  boundariesTitle: { ko: "패키지 경계", en: "Package boundaries" },
  boundariesLead: { ko: "컴포넌트는 ", en: "Components live only in " },
  boundariesMid: {
    ko: " 하나에만 있고, 앱은 그것을 소비합니다. 정적 검사는 oxlint가 맡습니다.",
    en: "; apps consume it. oxlint runs the static checks.",
  },
  only: { ko: "만", en: " only" },
  boundaryStyle: {
    ko: "스타일 값은 전부 @horon-ai/tokens의 theme.css에서 읽습니다.",
    en: "Every style value is read from theme.css in @horon-ai/tokens.",
  },

  nextTitle: { ko: "다음 단계", en: "Next steps" },
  foundationsLabel: { ko: "Foundations", en: "Foundations" },
  nextFoundationsBody: {
    ko: " — 색, 글자, 간격, 반경, 유리 표면의 값과 규칙",
    en: " — values and rules for color, type, spacing, radius, and glass surfaces",
  },
  componentsLabel: { ko: "Components", en: "Components" },
  nextComponentsLead: { ko: " — ", en: " — " },
  nextComponentsTail: {
    ko: "개 컴포넌트의 프리뷰와 코드 예시",
    en: " components, each with a preview and a code example",
  },
  tokensLabel: { ko: "Design Token", en: "Design Token" },
  nextTokensBody: {
    ko: " — 값을 바꿀 때 고치는 파일과 생성 절차",
    en: " — the files to edit and the build step when a value changes",
  },
});

/**
 * Terminal and module samples. `install` and `apps` carry shell comments, so
 * they are `Localized`: `CodeBlock` renders one panel per locale and CSS shows
 * the active one. `consume` has no comments and stays one string.
 */
export const getStartedSnippets: {
  install: Localized;
  consume: string;
  apps: Localized;
} = {
  install: {
    ko: `# 저장소 루트에서
bun install
bun run --filter @horon-ai/tokens build   # packages/tokens/theme.css 생성
bun run site          # http://localhost:4321`,
    en: `# From the repository root
bun install
bun run --filter @horon-ai/tokens build   # writes packages/tokens/theme.css
bun run site          # http://localhost:4321`,
  },
  consume: `import { Button, Card } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";
import "@horon-ai/react/globals.css";

export function Example() {
  return (
    <Card title="Inbox Manager" description="6 emails need you.">
      <Button icon={<Plus />}>New bot</Button>
    </Card>
  );
}`,
  apps: {
    ko: `bun run site          # 문서 사이트 → http://localhost:4321`,
    en: `bun run site          # docs site → http://localhost:4321`,
  },
};
