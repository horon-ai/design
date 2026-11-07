/**
 * Reference doc for `HoronIcon` and `HoronGlyph`, written against
 * `packages/react/src/components/horon-icon.tsx` and
 * `packages/flutter/lib/src/components/horon_icon.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "horon-icon",
  anatomy: {
    description: {
      ko: "HoronIcon은 내비게이션에서 Horon을 나타내는 매의 눈 마크입니다. HoronGlyph는 이름 하나로 그 마크와 Phosphor 글리프를 함께 꺼내는 조회 함수입니다.",
      en: "HoronIcon is the falcon-eye mark that stands for Horon in navigation. HoronGlyph is the lookup that resolves a name to that mark or to a Phosphor glyph.",
    },
    parts: [
      {
        name: "Mark",
        slot: "HoronIcon",
        description: {
          ko: "22 단위 viewBox에 선 하나로 그린 눈 모양입니다. width와 height를 같은 size로 받고 fill은 currentColor입니다.",
          en: "An eye drawn as one path in a 22-unit viewBox. Width and height both take size, and the fill is currentColor.",
        },
      },
      {
        name: "Glyph",
        slot: "HoronGlyph",
        description: {
          ko: "name에 따라 Phosphor 컴포넌트 하나를 그리거나, horon이면 HoronIcon을 그립니다. 크기 기본값은 20입니다.",
          en: "Draws one Phosphor component for a name, or HoronIcon when the name is horon. Its default size is 20.",
        },
      },
      {
        name: "Registry",
        slot: "iconNames",
        description: {
          ko: "이름 목록입니다. HoronIconName 타입이 이 목록에서 나오고, 모든 이름은 대응 글리프를 가져야 타입 검사를 통과합니다.",
          en: "The list of names. HoronIconName derives from it, and every name must have a glyph or the type check fails.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "너비와 높이를 한 번에 정합니다. px 숫자나 CSS 길이를 받고, HoronIcon의 기본값은 1em이라 주변 글자 크기를 따릅니다. HoronGlyph의 기본값은 20입니다.",
        en: "Sets width and height together. It takes a px number or a CSS length; HoronIcon defaults to 1em so it follows the surrounding font size, and HoronGlyph defaults to 20.",
      },
      values: [
        {
          name: "16",
          description: {
            ko: "작은 컨트롤과 캡션에 쓰는 크기입니다.",
            en: "The size for small controls and captions.",
          },
        },
        {
          name: "20",
          description: {
            ko: "버튼과 행에 쓰는 크기이며 HoronGlyph의 기본값입니다.",
            en: "The size for buttons and rows, and HoronGlyph's default.",
          },
        },
        {
          name: "24",
          description: {
            ko: "도구 모음과 빈 상태에 쓰는 크기입니다.",
            en: "The size for bars and empty states.",
          },
        },
        {
          name: "1em",
          description: {
            ko: "HoronIcon의 기본값입니다. 글자 크기를 따라가므로 다른 아이콘과 섞인 줄에서 높이가 맞습니다.",
            en: "HoronIcon's default. It follows the font size, so it lines up in a row of mixed icons.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "name",
      title: { ko: "name", en: "name" },
      description: {
        ko: "HoronGlyph가 그릴 글리프 이름입니다. iconNames 목록에서 오는 리터럴 유니온이며, horon은 Phosphor 대신 HoronIcon으로 풀립니다. 이름을 데이터로 저장한다면 이 목록을 그대로 쓰고, 코드에 고정된 아이콘은 Phosphor에서 직접 import해 번들러가 나머지를 지울 수 있게 합니다.",
        en: "The glyph name HoronGlyph draws. It is the literal union from iconNames, and horon resolves to HoronIcon instead of a Phosphor icon. Store names from that list when the icon is data; for an icon fixed in code, import the Phosphor component directly so the rest can be dropped from the bundle.",
      },
      example: "registry",
    },
  ],
  guidelines: [
    {
      id: "three-sizes",
      title: { ko: "세 가지 크기", en: "Three sizes" },
      body: {
        ko: "16은 작은 컨트롤과 캡션, 20은 버튼과 행, 24는 도구 모음과 빈 상태에 씁니다. 그 밖의 값은 이미 쓰이는 자리를 그대로 두고 새로 만들지 않습니다.",
        en: "16 belongs to small controls and captions, 20 to buttons and rows, 24 to bars and empty states. Leave the odd sizes already in place alone rather than adding more.",
      },
      do: {
        ko: "행 안의 아이콘은 20으로 맞춥니다.",
        en: "Keep icons inside a row at 20.",
      },
      dont: {
        ko: "같은 줄에서 18과 22를 섞지 않습니다.",
        en: "Do not mix 18 and 22 in one line.",
      },
      example: "sizes",
    },
    {
      id: "direct-import",
      title: { ko: "데이터가 아니면 직접 import", en: "Import directly unless the name is data" },
      body: {
        ko: "HoronGlyph는 이름을 런타임에 조회하므로 모든 글리프가 번들에 남습니다. 아이콘이 코드에 고정되어 있으면 Phosphor 컴포넌트를 직접 import하고, 이름이 데이터에서 올 때만 HoronGlyph를 씁니다.",
        en: "HoronGlyph resolves the name at runtime, so every glyph stays in the bundle. When the icon is fixed in code, import the Phosphor component directly and keep HoronGlyph for names that arrive as data.",
      },
      example: "registry",
    },
    {
      id: "meaning-outside",
      title: { ko: "의미는 바깥에 둡니다", en: "Put the meaning outside" },
      body: {
        ko: "마크와 글리프 모두 aria-hidden입니다. 아이콘만 있는 버튼이라면 IconButton의 label처럼 바깥 컨트롤에 접근 가능한 이름을 붙입니다.",
        en: "Both the mark and the glyph are aria-hidden. On an icon-only control, give the accessible name to the control, such as IconButton's label.",
      },
      example: "glyphs",
    },
    {
      id: "color-follows-text",
      title: { ko: "색은 글자를 따릅니다", en: "Color comes from the text" },
      body: {
        ko: "fill이 currentColor이므로 부모의 text-* 클래스가 색을 정합니다. fill을 직접 주면 hover나 선택 상태에서 색이 따로 놀게 됩니다.",
        en: "The fill is currentColor, so the parent's text-* class sets the color. A fill prop would leave the icon stuck when hover or selection changes the text.",
      },
      example: "glyphs",
    },
  ],
  specification: [
    {
      id: "mark",
      title: { ko: "마크", en: "Mark" },
      rows: [
        { state: "HoronIcon", slot: "svg", property: "viewBox", value: "0 0 22 22" },
        { state: "HoronIcon", slot: "svg", property: "width and height", value: "size" },
        { state: "HoronIcon", slot: "svg", property: "size default", value: "1em" },
        { state: "HoronIcon", slot: "svg", property: "fill", value: "currentColor" },
        { state: "HoronIcon", slot: "svg", property: "accessibility", value: "aria-hidden" },
        { state: "HoronIcon", slot: "svg", property: "paths", value: "1" },
      ],
    },
    {
      id: "glyph",
      title: { ko: "글리프", en: "Glyph" },
      rows: [
        { state: "HoronGlyph", slot: "svg", property: "size default", value: "20" },
        { state: "HoronGlyph", slot: "svg", property: "fill", value: "currentColor" },
        { state: "HoronGlyph", slot: "svg", property: "accessibility", value: "aria-hidden" },
        { state: "HoronGlyph", slot: "svg", property: "name", value: "HoronIconName" },
        { state: "horon", slot: "svg", property: "resolves to", value: "HoronIcon" },
        {
          state: "name",
          slot: "Registry",
          property: "source",
          value: "iconNames",
          note: {
            ko: "목록에 이름을 더하면 글리프 매핑이 없을 때 타입 검사에서 막힙니다.",
            en: "Adding a name breaks the type check until the glyph map has an entry for it.",
          },
        },
        {
          state: "sizes",
          slot: "Glyph",
          property: "16 / 20 / 24",
          value: "16px / 20px / 24px",
          note: {
            ko: "Paper가 그리는 세 크기입니다. 이 밖의 값은 기존 자리에 남아 있습니다.",
            en: "The three sizes Paper draws. The other values already in code stay where they are.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "마크 크기", en: "Mark sizes" },
      description: {
        ko: "같은 마크를 16, 24, 32로 그렸습니다. size 하나로 너비와 높이가 함께 바뀝니다.",
        en: "The same mark at 16, 24 and 32. One size value moves width and height together.",
      },
    },
    {
      id: "glyphs",
      title: { ko: "글리프와 색", en: "Glyphs and color" },
      description: {
        ko: "한 글리프를 세 글자 색과 세 크기로 그렸습니다. 아이콘은 부모의 text-* 색을 그대로 받습니다.",
        en: "One glyph at three text colors and three sizes. The icon takes the parent's text-* color as-is.",
      },
    },
    {
      id: "registry",
      title: { ko: "레지스트리", en: "Registry" },
      description: {
        ko: "iconNames의 모든 이름을 HoronGlyph로 풀어 그렸습니다. horon만 매의 눈 마크로 나옵니다.",
        en: "Every name in iconNames resolved through HoronGlyph. Only horon draws the falcon-eye mark.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "마크와 글리프 모두 aria-hidden입니다. 낭독기가 읽을 이름은 아이콘을 감싼 버튼이나 라벨이 제공해야 합니다.",
        en: "Both the mark and the glyph are aria-hidden. The button or label around the icon has to carry the name a screen reader reads.",
      },
      {
        ko: "아이콘은 currentColor로 그리므로 색 대비는 부모 텍스트 색의 몫입니다. text-text-secondary처럼 토큰 색을 쓰면 두 테마에서 대비가 유지됩니다.",
        en: "Icons paint in currentColor, so contrast is the parent text color's job. Token colors such as text-text-secondary keep it in both themes.",
      },
      {
        ko: "1em 기본값은 동작 줄이기나 확대 설정과 무관하게 글자 크기를 따릅니다. 사용자가 글자를 키우면 마크도 함께 커집니다.",
        en: "The 1em default follows the font size, so a user who enlarges text enlarges the mark with it.",
      },
    ],
    keyboard: [],
  },
};
