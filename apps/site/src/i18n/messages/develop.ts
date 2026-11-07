import { defineMessages, type Localized } from "@/i18n";

/** Copy for the Develop section: the overview and one page per platform. */
export const developMessages = defineMessages({
  title: { ko: "Develop", en: "Develop" },
  description: {
    ko: "React와 Flutter에서 Horon 컴포넌트를 쓰는 방법을 둘러보세요.",
    en: "Set up Horon components in React or Flutter.",
  },

  reactTitle: { ko: "React", en: "React" },
  reactDescription: {
    ko: "웹 앱에서 @horon-ai/react 컴포넌트와 토큰을 불러오는 방법입니다.",
    en: "Load the @horon-ai/react components and tokens in a web app.",
  },
  flutterTitle: { ko: "Flutter", en: "Flutter" },
  flutterDescription: {
    ko: "Flutter 앱에서 horon_ui 패키지와 테마를 쓰는 방법입니다.",
    en: "Use the horon_ui package and theme in a Flutter app.",
  },

  installTitle: { ko: "설치", en: "Install" },
  reactInstallBody: {
    ko: "@horon-ai/react와 @horon-ai/tokens는 같은 버전으로 함께 올라갑니다. 아이콘은 Phosphor를 씁니다.",
    en: "@horon-ai/react and @horon-ai/tokens ship together at the same version. Icons come from Phosphor.",
  },
  stylesTitle: { ko: "스타일 불러오기", en: "Load the styles" },
  stylesBody: {
    ko: "앱 엔트리에서 전역 스타일을 한 번 불러옵니다. 토큰과 Tailwind CSS v4가 함께 들어옵니다.",
    en: "Import the global styles once at the app entry. Tokens and Tailwind CSS v4 come with it.",
  },
  useTitle: { ko: "컴포넌트 쓰기", en: "Use a component" },
  reactUseBody: {
    ko: "컴포넌트는 패키지 진입점(@horon-ai/react)에서 가져옵니다. Chart만 @horon-ai/react/components/chart 경로로 따로 가져옵니다.",
    en: "Import components from the package entry (@horon-ai/react). Chart alone comes from @horon-ai/react/components/chart.",
  },
  repoTitle: { ko: "저장소에서 실행하기", en: "Run from the repository" },
  repoBody: {
    ko: "저장소를 받아 토큰을 만들고 문서 사이트를 띄우면 모든 컴포넌트의 라이브 프리뷰를 볼 수 있습니다.",
    en: "Clone the repository, build the tokens and start the docs site to see a live preview of every component.",
  },

  flutterInstallBody: {
    ko: "horon_ui는 pub.dev에 올리지 않습니다. design 저장소를 앱 옆에 두고 경로로 가져옵니다.",
    en: "horon_ui is not on pub.dev. Check out the design repository next to your app and depend on it by path.",
  },
  themeTitle: { ko: "테마 연결하기", en: "Wire up the theme" },
  themeBody: {
    ko: "horonTheme이 라이트와 다크 ThemeData를 만듭니다. 컴포넌트는 이 테마의 토큰만 읽기 때문에 테마 없이 쓰면 오류가 납니다.",
    en: "horonTheme builds the light and dark ThemeData. Components read tokens only from this theme, so using them without it throws.",
  },
  flutterUseBody: {
    ko: "위젯 이름은 React 컴포넌트 이름 앞에 Horon을 붙인 형태이고, 변형과 상태도 같은 이름을 씁니다.",
    en: "Widgets are the React names with a Horon prefix, and they share the same variants and states.",
  },
  tokensTitle: { ko: "토큰", en: "Tokens" },
  tokensBody: {
    ko: "색, 간격, 반경 값은 @horon-ai/tokens에서 생성한 Dart 파일에서 읽습니다. 값을 손으로 고치지 않고, 원본과 어긋나면 테스트가 실패합니다.",
    en: "Color, spacing and radius come from a Dart file generated from @horon-ai/tokens. Never edit it by hand; the tests fail when it drifts from the source.",
  },
});

/** Code samples. Samples with shell comments are `Localized`, one panel per locale. */
export const developSnippets: {
  reactInstall: string;
  reactStyles: string;
  reactUse: string;
  repo: Localized;
  flutterPubspec: string;
  flutterTheme: string;
  flutterUse: string;
} = {
  reactInstall: `bun add @horon-ai/react @horon-ai/tokens @phosphor-icons/react`,
  reactStyles: `import "@horon-ai/react/globals.css";`,
  reactUse: `import { Button, Card } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

export function Example() {
  return (
    <Card title="Inbox Manager" description="6 emails need you.">
      <Button icon={<Plus />}>New bot</Button>
    </Card>
  );
}`,
  repo: {
    ko: `bun install
bun run tokens   # theme.css와 Flutter 토큰 생성
bun run site     # 문서 사이트 → http://localhost:4321`,
    en: `bun install
bun run tokens   # writes theme.css and the Flutter tokens
bun run site     # docs site → http://localhost:4321`,
  },
  flutterPubspec: `dependencies:
  horon_ui:
    path: ../design/packages/flutter`,
  flutterTheme: `import 'package:flutter/material.dart';
import 'package:horon_ui/horon_ui.dart';

void main() {
  runApp(
    MaterialApp(
      theme: horonTheme(Brightness.light),
      darkTheme: horonTheme(Brightness.dark),
      home: const HomeScreen(),
    ),
  );
}`,
  flutterUse: `HoronButton(
  label: 'New bot',
  icon: const Icon(Icons.add),
  onPressed: () {},
)`,
};
