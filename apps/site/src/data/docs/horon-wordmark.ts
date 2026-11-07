/**
 * Reference doc for `HoronWordmark`, written against
 * `packages/react/src/components/horon-wordmark.tsx`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "horon-wordmark",
  anatomy: {
    description: {
      ko: "HoronWordmark는 UI 크기의 Horon 글자 로고입니다. 여섯 개의 채워진 path가 하나의 그림으로 글자 윤곽을 그리고, 색은 주변 글자 색을 따릅니다.",
      en: "HoronWordmark is the Horon letter logo at UI size. Six filled paths trace the letters as one drawing, and the color follows the surrounding text.",
    },
    parts: [
      {
        name: "Wordmark",
        slot: "svg",
        description: {
          ko: "48.7038 x 11.5 viewBox를 가진 svg입니다. height로 크기를 정하고 너비는 비율을 따라갑니다.",
          en: "The svg with a 48.7038 by 11.5 viewBox. height sets its size and the width follows the ratio.",
        },
      },
      {
        name: "Letters",
        slot: "path",
        description: {
          ko: "H, o, r, o, n의 윤곽을 그리는 여섯 path입니다. 각각 이름이 없고 하나의 그림으로 칠해집니다.",
          en: "Six paths tracing the H, o, r, o and n. None carries a name; they paint as one drawing.",
        },
      },
    ],
  },
  properties: [
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "로고의 접근 가능한 이름입니다. role=\"img\"인 svg의 aria-label이 되어 낭독기가 여섯 path 대신 하나의 이미지로 읽습니다. 기본값은 Horon입니다.",
        en: "The logo's accessible name. It becomes the aria-label of the role=\"img\" svg, so a screen reader announces one image rather than six paths. The default is Horon.",
      },
      example: "lockup",
    },
    {
      id: "height",
      title: { ko: "height", en: "height" },
      description: {
        ko: "높이입니다. 너비는 viewBox 비율로 따라오므로 width를 함께 주지 않습니다. 기본값은 11.5입니다.",
        en: "The height. The width follows from the viewBox ratio, so no width is needed. The default is 11.5.",
      },
      example: "sizes",
    },
  ],
  guidelines: [
    {
      id: "scale-by-height",
      title: { ko: "height로만 키웁니다", en: "Scale with height only" },
      body: {
        ko: "너비를 따로 주면 글자가 찌그러집니다. height 하나만 바꾸면 비율이 유지된 채 커지고 작아집니다.",
        en: "A separate width squashes the letters. Changing height alone scales the logo while the ratio holds.",
      },
      do: {
        ko: "height={23}으로 키웁니다.",
        en: "Enlarge it with height={23}.",
      },
      dont: {
        ko: "width와 height를 함께 지정하지 않습니다.",
        en: "Do not set width and height together.",
      },
      example: "sizes",
    },
    {
      id: "color-token",
      title: { ko: "색은 토큰으로", en: "Color with a token" },
      body: {
        ko: "로고는 주변 글자 색을 그대로 받습니다. text-text-primary를 쓰면 두 테마에서 대비가 유지되고, 어두운 배경에서는 text-text-inverse를 씁니다.",
        en: "The logo takes the surrounding text color. text-text-primary keeps contrast in both themes, and a dark surface calls for text-text-inverse.",
      },
      example: "lockup",
    },
    {
      id: "decorative",
      title: { ko: "장식일 때는 이름을 비웁니다", en: "Silence it when it repeats" },
      body: {
        ko: "바로 옆에 Horon이라는 글자가 있으면 로고는 장식입니다. title에 빈 문자열을 주고 aria-hidden을 붙이면 낭독기가 같은 이름을 두 번 읽지 않습니다.",
        en: "When the word Horon already sits next to the logo, the logo is decoration. Pass an empty title and add aria-hidden so the name is not read twice.",
      },
      example: "decorative",
    },
    {
      id: "mark-or-wordmark",
      title: { ko: "마크와 함께 쓰기", en: "Pair it with the mark" },
      body: {
        ko: "아이콘만 있는 자리에는 HoronIcon을, 이름이 필요한 자리에는 HoronWordmark를 씁니다. 둘을 나란히 두면 사이드바 머리처럼 마크와 이름을 함께 보여 줄 수 있습니다.",
        en: "Use HoronIcon where only the mark fits and HoronWordmark where the name is needed. Side by side they form a brand lockup such as a sidebar header.",
      },
      example: "lockup",
    },
  ],
  specification: [
    {
      id: "geometry",
      title: { ko: "형태", en: "Geometry" },
      rows: [
        { state: "svg", slot: "Wordmark", property: "viewBox", value: "0 0 48.7038 11.5" },
        { state: "svg", slot: "Wordmark", property: "height default", value: "11.5" },
        { state: "svg", slot: "Wordmark", property: "width", value: "auto" },
        { state: "svg", slot: "Wordmark", property: "fill", value: "currentColor" },
        { state: "svg", slot: "Wordmark", property: "paths", value: "6" },
      ],
    },
    {
      id: "accessibility-spec",
      title: { ko: "접근성", en: "Accessibility" },
      rows: [
        { state: "default", slot: "Wordmark", property: "role", value: "img" },
        { state: "default", slot: "Wordmark", property: "aria-label", value: "title (\"Horon\")" },
        {
          state: "decorative",
          slot: "Wordmark",
          property: "aria-label",
          value: "title=\"\"",
          note: {
            ko: "빈 이름과 aria-hidden을 함께 주면 낭독기에서 빠집니다.",
            en: "An empty name plus aria-hidden takes it out of the reading order.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "기본 높이 11.5와 두 배인 23을 나란히 두었습니다. 너비는 비율을 따라 함께 커집니다.",
        en: "The default 11.5 next to a doubled 23. The width grows with it at the same ratio.",
      },
    },
    {
      id: "lockup",
      title: { ko: "마크와 함께", en: "With the mark" },
      description: {
        ko: "HoronIcon과 나란히 둔 사이드바 머리 조합입니다. 색은 부모의 text-text-primary가 정합니다.",
        en: "A sidebar header that pairs it with HoronIcon. The parent's text-text-primary sets the color.",
      },
    },
    {
      id: "decorative",
      title: { ko: "장식으로", en: "Decorative" },
      description: {
        ko: "옆에 이름이 이미 있는 자리에서 이름을 비우고 aria-hidden을 붙인 경우입니다.",
        en: "The logo with an empty name and aria-hidden, where the name is already written beside it.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "svg는 role=\"img\"이고 aria-label을 title에서 받습니다. 낭독기는 글자 여섯 개가 아니라 이미지 하나로 읽습니다.",
        en: "The svg is role=\"img\" with an aria-label taken from title, so it is read as one image rather than as six letters.",
      },
      {
        ko: "기본 이름은 Horon입니다. 다른 이름이 필요하면 title을 바꾸고, 로고가 장식이면 빈 문자열과 aria-hidden을 함께 씁니다.",
        en: "The default name is Horon. Change title when another name is right, and use an empty title with aria-hidden when the logo is decoration.",
      },
      {
        ko: "색은 currentColor로 칠하므로 대비는 주변 텍스트 색이 책임집니다. 이미지 대체 텍스트가 아니라 이름이므로 색을 지워도 정보는 남습니다.",
        en: "The fill is currentColor, so contrast belongs to the surrounding text color. The name, not the drawing, carries the information.",
      },
    ],
    keyboard: [],
  },
};
