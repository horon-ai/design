import { defineMessages } from "@/i18n";

/** Get Started page copy: one intro and three groups of link tiles. */
export const getStartedMessages = defineMessages({
  title: { ko: "Get Started", en: "Get Started" },
  description: {
    ko: "Horon 디자인 시스템은 Horon 제품의 디자인과 코드가 같은 값을 바라보게 만드는 공통 언어입니다.",
    en: "Horon Design System is the shared language that keeps design and code for Horon products on the same values.",
  },

  whatTitle: { ko: "Horon 디자인 시스템이란?", en: "What is the Horon Design System?" },
  whatBody: {
    ko: "색, 글자, 간격 같은 값부터 버튼과 패널 같은 컴포넌트까지 하나의 체계로 정리했습니다. 값은 Figma Horon 파일에서 읽어 @horon-ai/tokens에 한 번만 적고, 웹(React)과 앱(Flutter)이 같은 값을 씁니다.",
    en: "Values like color, type and spacing, and components like buttons and panels, live in one system. Values are read from the Figma Horon file and written once in @horon-ai/tokens, so web (React) and app (Flutter) share them.",
  },

  systemTitle: { ko: "시스템 이해하기", en: "Understand the system" },
  foundationsTitle: { ko: "Foundations", en: "Foundations" },
  foundationsBody: {
    ko: "색, 글자, 간격, 반경, 유리 표면 등 화면의 바탕이 되는 값.",
    en: "Color, type, spacing, radius and glass: the values every screen sits on.",
  },
  componentsTitle: { ko: "Components", en: "Components" },
  componentsBody: {
    ko: "{count}개 컴포넌트의 프리뷰와 코드.",
    en: "Previews and code for {count} components.",
  },
  mascotTitle: { ko: "Mascot", en: "Mascot" },
  mascotBody: {
    ko: "마스코트 컷과 로고, 쓰는 규칙.",
    en: "Mascot cuts, the logo, and how to use them.",
  },

  developTitle: { ko: "개발 시작하기", en: "Start building" },
  reactTitle: { ko: "React", en: "React" },
  reactBody: {
    ko: "웹 앱에 @horon-ai/react를 설치하고 컴포넌트를 불러옵니다.",
    en: "Install @horon-ai/react in a web app and import components.",
  },
  flutterTitle: { ko: "Flutter", en: "Flutter" },
  flutterBody: {
    ko: "Flutter 앱에 horon_ui와 테마를 연결합니다.",
    en: "Wire horon_ui and its theme into a Flutter app.",
  },
  aiTitle: { ko: "AI 도구", en: "AI tools" },
  aiBody: {
    ko: "에이전트가 읽을 문서 요약(llms.txt)을 받습니다.",
    en: "Give your agent the docs summary in llms.txt.",
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
