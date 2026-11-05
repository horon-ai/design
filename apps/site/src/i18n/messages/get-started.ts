import { defineMessages, type Localized } from "@/i18n";

/** Get Started page copy and its code samples. */
export const getStartedMessages = defineMessages({
  title: { ko: "Get Started", en: "Get Started" },
  description: {
    ko: "Horon 디자인 시스템은 토큰 소스 하나로 웹 컴포넌트와 문서 사이트의 값을 함께 만듭니다. 하려는 일에 맞는 길을 골라 시작하세요.",
    en: "Horon Design System serves web components and the docs site from one token source. Pick the path that fits what you are doing.",
  },

  pathsTitle: { ko: "어디서 시작할까요", en: "Where to start" },
  designPathTitle: { ko: "디자인", en: "Design" },
  designPathBody: {
    ko: "색, 글자, 간격, 반경, 유리 표면의 값과 규칙부터 봅니다.",
    en: "Start with the values and rules for color, type, spacing, radius, and glass.",
  },
  developPathTitle: { ko: "개발", en: "Develop" },
  developPathBody: {
    ko: "저장소를 받아 토큰을 만들고 컴포넌트를 불러옵니다.",
    en: "Clone the repository, build the tokens, and import the components.",
  },
  aiPathTitle: { ko: "AI 도구", en: "AI tools" },
  aiPathBody: {
    ko: "에이전트가 읽을 문서 요약(llms.txt)을 받습니다.",
    en: "Give your agent the docs summary in llms.txt.",
  },

  installTitle: { ko: "설치", en: "Install" },
  installNote: {
    ko: "패키지는 아직 npm에 공개하지 않았습니다. 저장소에서 바로 시작합니다.",
    en: "The packages are not on npm yet, so you start from the repository.",
  },
  stepRepoTitle: { ko: "1. 저장소 준비", en: "1. Set up the repository" },
  stepRepoBody: {
    ko: "의존성을 설치하고 토큰 CSS를 생성합니다.",
    en: "Install the dependencies and build the token CSS.",
  },
  stepStylesTitle: { ko: "2. 스타일 불러오기", en: "2. Load the styles" },
  stepStylesBody: {
    ko: "앱 엔트리에서 전역 스타일을 한 번 불러옵니다. 토큰과 Tailwind CSS v4가 함께 들어옵니다.",
    en: "Import the global styles once at the app entry. Tokens and Tailwind CSS v4 come with it.",
  },
  stepUseTitle: { ko: "3. 컴포넌트 쓰기", en: "3. Use a component" },
  stepUseBody: {
    ko: "컴포넌트는 패키지 진입점(@horon-ai/react)에서 가져오고, 아이콘은 Phosphor를 씁니다.",
    en: "Import components from the package entry (@horon-ai/react); icons come from Phosphor.",
  },
  stepSiteTitle: { ko: "4. 문서 사이트에서 확인하기", en: "4. Check it on the docs site" },
  stepSiteBody: {
    ko: "문서 사이트도 같은 컴포넌트로 만들었고, 모든 컴포넌트의 라이브 프리뷰를 볼 수 있습니다.",
    en: "The docs site uses the same components and has a live preview of each one.",
  },

  guidesTitle: { ko: "가이드 둘러보기", en: "Explore the guides" },
  foundationsTitle: { ko: "Foundations", en: "Foundations" },
  foundationsBody: {
    ko: "색, 글자, 간격, 반경, 유리 표면의 값과 규칙",
    en: "Values and rules for color, type, spacing, radius, and glass",
  },
  tokensTitle: { ko: "Design Token", en: "Design Token" },
  tokensBody: {
    ko: "값을 바꿀 때 고치는 파일과 생성 절차",
    en: "The files to edit and the build step when a value changes",
  },
  componentsTitle: { ko: "Components", en: "Components" },
  componentsBody: {
    ko: "{count}개 컴포넌트의 프리뷰와 코드",
    en: "Preview and code for {count} components",
  },
  mascotTitle: { ko: "Mascot", en: "Mascot" },
  mascotBody: {
    ko: "마스코트 컷과 로고, 쓰는 규칙",
    en: "Mascot cuts, the logo, and how to use them",
  },

  boundariesTitle: { ko: "패키지 경계", en: "Package boundaries" },
  boundariesBody: {
    ko: "컴포넌트는 @horon-ai/react 한 곳에만 두고, 앱은 그 패키지를 가져다 씁니다. 스타일 값은 전부 @horon-ai/tokens의 theme.css에서 읽고, 정적 검사는 oxlint가 맡습니다.",
    en: "Components live only in @horon-ai/react, and apps import that package. Every style value comes from theme.css in @horon-ai/tokens, and oxlint runs the static checks.",
  },

  helpTitle: { ko: "도움과 소식", en: "Help and news" },
  githubTitle: { ko: "GitHub", en: "GitHub" },
  githubBody: {
    ko: "소스 코드를 보고 이슈를 남깁니다.",
    en: "Read the source and open an issue.",
  },
  updatesTitle: { ko: "Updates", en: "Updates" },
  updatesBody: {
    ko: "릴리스마다 바뀐 내용을 확인합니다.",
    en: "See what changed in each release.",
  },
});

/**
 * Terminal and module samples. Samples with shell comments are `Localized`:
 * `CodeBlock` renders one panel per locale and CSS shows the active one.
 */
export const getStartedSnippets: {
  repo: Localized;
  styles: string;
  use: string;
  site: Localized;
} = {
  repo: {
    ko: `# 저장소 루트에서
bun install
bun run --filter @horon-ai/tokens build   # packages/tokens/theme.css 생성`,
    en: `# From the repository root
bun install
bun run --filter @horon-ai/tokens build   # writes packages/tokens/theme.css`,
  },
  styles: `import "@horon-ai/react/globals.css";`,
  use: `import { Button, Card } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

export function Example() {
  return (
    <Card title="Inbox Manager" description="6 emails need you.">
      <Button icon={<Plus />}>New bot</Button>
    </Card>
  );
}`,
  site: {
    ko: `bun run site          # 문서 사이트 → http://localhost:4321`,
    en: `bun run site          # docs site → http://localhost:4321`,
  },
};
