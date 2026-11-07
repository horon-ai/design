/**
 * Reference doc for `CodePanel`, written against
 * `packages/react/src/components/code-panel.tsx` and
 * `packages/flutter/lib/src/components/code_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "code-panel",
  anatomy: {
    description: {
      ko: "CodePanel은 설정 화면에 놓는 밝은 코드 상자입니다. 모서리 10px의 패널 하나에 코드 문자열이 들어가고, 헤더 바나 복사 버튼은 없습니다.",
      en: "A light code box for settings screens. One 10px-radius panel holds the code string, and there is no header bar or copy button.",
    },
    parts: [
      {
        name: "Panel",
        slot: "pre",
        description: {
          ko: "코드를 담는 pre 요소입니다. 가로로 넘치는 줄은 줄바꿈하지 않고 상자 안에서 스크롤합니다.",
          en: "The pre element holding the code. Lines wider than the panel scroll inside it instead of wrapping.",
        },
      },
      {
        name: "Code",
        slot: "children",
        description: {
          ko: "패널에 들어가는 문자열입니다. 공백과 줄바꿈을 그대로 유지합니다.",
          en: "The string inside the panel. Whitespace and line breaks are kept as written.",
        },
      },
      {
        name: "CodeKey",
        slot: "CodeKey",
        description: {
          ko: "frontmatter 키처럼 강조할 토큰을 감싸는 span입니다. 글자색만 키 색으로 바꾸고 나머지 코드는 문자열 색을 유지합니다.",
          en: "A span that wraps a highlighted token such as a frontmatter key. It only changes the wrapped text to the key color; the rest stays the string color.",
        },
      },
    ],
  },
  properties: [
    {
      id: "children",
      title: { ko: "children", en: "children" },
      description: {
        ko: "패널에 표시할 코드입니다. 여러 줄 문자열을 그대로 넣고, 강조할 토큰만 CodeKey로 감쌉니다.",
        en: "The code shown in the panel. Pass the multi-line string as-is and wrap only the tokens you want highlighted in CodeKey.",
      },
      example: "frontmatter",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "pre에 덧붙는 클래스입니다. 패널 표면과 글자 클래스 뒤에 합쳐지므로 너비나 바깥 여백을 정할 때 씁니다.",
        en: "Classes appended to the pre, merged after the panel surface and type classes, so use it for width and outer spacing.",
      },
      example: "width",
    },
  ],
  guidelines: [
    {
      id: "light-not-ink",
      title: { ko: "밝은 패널은 설정 화면에만", en: "The light panel belongs to settings" },
      body: {
        ko: "CodePanel은 neutral-50 바탕의 밝은 패널입니다. 채팅처럼 어두운 잉크 면에는 같은 라이브러리의 CodeBlock을 쓰고, 설정 화면이나 문서 본문처럼 밝은 면에만 이 패널을 놓습니다.",
        en: "CodePanel is the light neutral-50 panel. On ink surfaces such as chat use CodeBlock instead; keep this panel for light surfaces such as settings and document bodies.",
      },
      do: {
        ko: "봇 지시문 편집 화면에서 CodePanel을 씁니다.",
        en: "Use CodePanel on a bot instruction screen.",
      },
      dont: {
        ko: "채팅 말풍선 안에 CodePanel을 넣지 않습니다.",
        en: "Do not place CodePanel inside a chat bubble.",
      },
      example: "frontmatter",
    },
    {
      id: "keys-only",
      title: { ko: "강조는 키에만", en: "Highlight keys only" },
      body: {
        ko: "CodeKey는 키 이름처럼 한 줄에 하나씩 있는 토큰에만 감습니다. 문자열 값이나 문장 전체를 감싸면 강조가 의미를 잃고 읽기만 어려워집니다.",
        en: "Wrap CodeKey around per-line tokens such as key names only. Wrapping values or whole sentences drops the highlight's meaning and only makes the block harder to read.",
      },
      do: {
        ko: "name:과 description: 같은 frontmatter 키에 CodeKey를 씁니다.",
        en: "Use CodeKey on frontmatter keys such as name: and description:.",
      },
      dont: {
        ko: "값 부분까지 같은 색으로 감싸지 않습니다.",
        en: "Do not wrap the value alongside the key.",
      },
      example: "frontmatter",
    },
    {
      id: "no-wrap",
      title: { ko: "줄을 감지 않습니다", en: "Lines do not wrap" },
      body: {
        ko: "패널은 whitespace-pre로 공백을 유지하고 넘치는 줄은 상자 안에서만 가로로 스크롤합니다. 아주 긴 줄은 읽는 사람이 직접 넘겨야 하므로 설정 파일은 한 줄을 짧게 끊어 씁니다.",
        en: "The panel keeps whitespace with whitespace-pre and lets wide lines scroll sideways inside the box. Very long lines have to be scrolled by the reader, so break config lines short.",
      },
      example: "width",
    },
  ],
  specification: [
    {
      id: "panel-surface",
      title: { ko: "패널 표면", en: "Panel surface" },
      note: {
        ko: "다크 테마에서는 패널이 neutral-800으로 바뀌고 테두리가 진해집니다.",
        en: "In dark mode the panel turns neutral-800 and the border strengthens.",
      },
      rows: [
        { state: "default", slot: "Panel", property: "background", value: "bg-neutral-50" },
        { state: "default", slot: "Panel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Panel", property: "radius", value: "rounded-[10px]" },
        { state: "default", slot: "Panel", property: "padding", value: "px-4 py-3.5" },
        { state: "default", slot: "Code", property: "font", value: "font-mono text-[12px]/[21px]" },
        { state: "default", slot: "Code", property: "text color", value: "text-syntax-string" },
        { state: "default", slot: "Panel", property: "overflow", value: "overflow-x-auto whitespace-pre" },
        { state: "key", slot: "CodeKey", property: "text color", value: "text-syntax-key" },
        { state: "dark", slot: "Panel", property: "background", value: "dark:bg-neutral-800" },
        { state: "dark", slot: "Panel", property: "border", value: "dark:border-border-strong" },
      ],
    },
  ],
  examples: [
    {
      id: "frontmatter",
      title: { ko: "Frontmatter", en: "Frontmatter" },
      description: {
        ko: "키 세 개를 CodeKey로 강조한 봇 지시문입니다. 키마다 한 줄씩 두어 강조가 줄 단위로 읽힙니다.",
        en: "A bot instruction with three keys highlighted by CodeKey, one key per line so the highlight reads line by line.",
      },
    },
    {
      id: "json",
      title: { ko: "JSON 코드", en: "JSON code" },
      description: {
        ko: "CodeKey 없이 문자열만 넣은 설정 조각입니다. 강조가 필요 없으면 CodePanel 하나로 충분합니다.",
        en: "A settings snippet with a plain string and no CodeKey. When nothing needs emphasis the panel alone is enough.",
      },
    },
    {
      id: "width",
      title: { ko: "너비와 긴 줄", en: "Width and long lines" },
      description: {
        ko: "className으로 최대 너비를 정하고, 넘치는 한 줄은 상자 안에서 가로로 스크롤합니다.",
        en: "className caps the width, and the over-wide line scrolls sideways inside the box.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "코드는 읽는 내용이므로 포커스나 키보드 조작을 붙이지 않습니다. 패널 자체는 정적 텍스트로 읽힙니다.",
        en: "Code is content, so the panel adds no focus or keyboard handling and reads as static text.",
      },
      {
        ko: "밝은 패널 위의 글자색은 neutral-50 바탕에서 대비를 확보한 문자열 색과 키 색을 그대로 씁니다. 임의의 색으로 바꾸면 대비가 무너집니다.",
        en: "Text on the light panel keeps the string and key colors, which hold contrast against neutral-50. Replacing them with arbitrary colors breaks that contrast.",
      },
      {
        ko: "코드를 복사해야 하는 화면이라면 패널 밖에 복사 버튼을 두고 접근 가능한 이름을 붙입니다. 패널 자체에는 복사 버튼이 없습니다.",
        en: "Where the code has to be copied, put a copy button outside the panel and give it an accessible name. The panel ships no copy control.",
      },
    ],
    keyboard: [],
  },
};
