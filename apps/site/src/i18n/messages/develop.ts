import { defineMessages } from "@/i18n";

/** Copy for the Develop section: the overview and one page per platform. */
export const developMessages = defineMessages({
  title: { ko: "Develop", en: "Develop" },
  description: {
    ko: "React와 Flutter에서 Horon 컴포넌트를 쓰는 방법을 둘러보세요.",
    en: "Set up Horon components in React or Flutter.",
  },

  reactTitle: { ko: "React", en: "React" },
  flutterTitle: { ko: "Flutter", en: "Flutter" },
  flutterDescription: {
    ko: "Flutter 앱에서 horon_ui 패키지와 테마를 쓰는 방법입니다.",
    en: "Use the horon_ui package and theme in a Flutter app.",
  },

  installTitle: { ko: "설치", en: "Install" },
  useTitle: { ko: "컴포넌트 쓰기", en: "Use a component" },

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

/** Code samples for the Flutter page. */
export const developSnippets: {
  flutterPubspec: string;
  flutterTheme: string;
  flutterUse: string;
} = {
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
