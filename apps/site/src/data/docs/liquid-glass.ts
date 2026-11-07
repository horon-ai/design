/**
 * Reference doc for `LiquidGlass`, written against
 * `packages/react/src/components/liquid-glass.tsx`, `packages/tokens/src/glass.ts`
 * and the `.liquid-layers` rules in `packages/react/src/styles/globals.css`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "liquid-glass",
  anatomy: {
    description: {
      ko: "LiquidGlass는 유리 표면 하나를 그리는 레이어입니다. 스스로는 아무것도 정하지 않고, 부모의 클래스가 정한 바탕색과 모서리 위에 흐림, 채도, 1px 테두리를 얹습니다.",
      en: "LiquidGlass is the layer that draws one glass surface. It decides nothing on its own: it lays a blur, a saturation and a 1px rim over the fill and corners its host sets.",
    },
    parts: [
      {
        name: "Backdrop layer",
        slot: "LiquidGlass",
        description: {
          ko: "aria-hidden인 span 하나입니다. absolute inset-0으로 부모를 가득 채우고 pointer-events-none이라 입력을 가로채지 않습니다.",
          en: "A single aria-hidden span. It fills the host with absolute inset-0 and is pointer-events-none, so it never intercepts input.",
        },
      },
      {
        name: "Rim",
        slot: "::after",
        description: {
          ko: "가장자리 안쪽 1px을 따라 그리는 테두리입니다. 위가 밝고 중간이 흐리고 아래가 다시 조금 밝은 세로 그라데이션입니다.",
          en: "A ring drawn 1px inside the edge: a vertical gradient that is bright at the top, faint in the middle and slightly bright again at the bottom.",
        },
      },
      {
        name: "Host",
        slot: "div",
        description: {
          ko: "유리를 담는 부모입니다. 모서리와 바탕색을 스스로 갖고, relative isolate로 레이어를 자기 안에 가둡니다.",
          en: "The parent that holds the glass. It owns the radius and the fill, and isolates the layer with relative isolate.",
        },
      },
    ],
  },
  properties: [],
  guidelines: [
    {
      id: "no-tier-prop",
      title: { ko: "농도는 부모가 정합니다", en: "The host owns the tier" },
      body: {
        ko: "LiquidGlass에는 tier prop이 없습니다. 부모에 bg-glass-clear, bg-glass-regular, bg-glass-thick 중 하나를 붙여 농도를 정합니다. 레이어에 바탕색을 주면 투명도 줄이기와 backdrop-filter 미지원에서 globals.css가 거는 glass-fill-frost 교체를 덮어 버립니다.",
        en: "LiquidGlass has no tier prop. The host picks the tier with bg-glass-clear, bg-glass-regular or bg-glass-thick. A fill on the layer would override the glass-fill-frost swap that globals.css applies for reduced transparency and for engines without backdrop-filter.",
      },
      do: {
        ko: "부모에 rounded-xl bg-glass-regular를 주고 그 안에 LiquidGlass를 둡니다.",
        en: "Give the host rounded-xl bg-glass-regular and put LiquidGlass inside it.",
      },
      dont: {
        ko: "LiquidGlass에 배경색이나 모서리를 직접 주지 않습니다.",
        en: "Do not put a background or a radius on LiquidGlass itself.",
      },
      example: "tiers",
    },
    {
      id: "first-child-isolate",
      title: { ko: "첫 자식으로, isolate 안에", en: "First child, inside isolate" },
      body: {
        ko: "부모는 relative isolate여야 하고 레이어는 첫 자식이어야 합니다. 레이어는 absolute로 부모를 채우고 z-index가 없으므로, 뒤따르는 내용은 relative를 줘야 그 위에 그려집니다. isolate는 흐림이 부모 바깥으로 번지지 않게 배경 기준을 부모 안에 가둡니다.",
        en: "The host must be relative isolate and the layer the first child. The layer fills the host with absolute and carries no z-index, so following content needs relative to paint above it. isolate keeps the filtered backdrop rooted inside the host.",
      },
      example: "chrome",
    },
    {
      id: "floating-chrome-only",
      title: { ko: "떠 있는 크롬에만", en: "Floating chrome only" },
      body: {
        ko: "유리는 뒤가 비치는 면 위에서만 재질로 읽힙니다. 읽거나 누르는 본문 표면은 토큰의 불투명 표면을 쓰고, 유리는 도구 모음, 시트, 카드 머리처럼 떠 있는 크롬에만 씁니다.",
        en: "Glass reads as a material only over something visible behind it. Content surfaces that are read or pressed use the solid token surfaces; glass belongs to floating chrome such as toolbars, sheets and a card header.",
      },
      do: {
        ko: "배경 이미지 위에 놓인 도구 모음에 유리를 씁니다.",
        en: "Use glass for a toolbar that floats over a background image.",
      },
      dont: {
        ko: "설정 목록의 각 행에 유리를 깔지 않습니다.",
        en: "Do not lay glass inside every row of a settings list.",
      },
      example: "chrome",
    },
    {
      id: "radius-inherits",
      title: { ko: "모서리는 부모를 따릅니다", en: "The radius is inherited" },
      body: {
        ko: "레이어와 테두리 모두 border-radius inherit을 쓰므로 부모의 모서리를 그대로 따라갑니다. 부모에 overflow-clip을 함께 주면 내용도 같은 모서리에서 잘립니다.",
        en: "Both the layer and the rim use border-radius inherit, so they follow the host exactly. Adding overflow-clip to the host also cuts the content at that radius.",
      },
      example: "radii",
    },
  ],
  specification: [
    {
      id: "material",
      title: { ko: "재질 값", en: "Material values" },
      note: {
        ko: "값은 glass.ts에서 오고 theme.css가 CSS 변수로 내보냅니다. 웹과 Flutter의 HoronLiquidGlass가 같은 값을 그립니다.",
        en: "The values come from glass.ts and theme.css publishes them as CSS variables. Flutter's HoronLiquidGlass draws from the same numbers.",
      },
      rows: [
        { state: "layer", slot: "LiquidGlass", property: "position", value: "absolute inset-0" },
        {
          state: "layer",
          slot: "LiquidGlass",
          property: "stacking",
          value: "first child, no z-index",
          note: {
            ko: "뒤따르는 내용은 relative를 줘야 레이어 위에 그려집니다.",
            en: "Content after the layer needs relative to paint above it.",
          },
        },
        { state: "layer", slot: "LiquidGlass", property: "pointer events", value: "pointer-events-none" },
        { state: "layer", slot: "LiquidGlass", property: "radius", value: "border-radius inherit" },
        { state: "layer", slot: "LiquidGlass", property: "backdrop filter", value: "blur(20px) saturate(1.8)" },
        { state: "layer", slot: "LiquidGlass", property: "blur token", value: "--glass-blur" },
        { state: "layer", slot: "LiquidGlass", property: "saturation token", value: "--glass-saturate" },
        { state: "rim", slot: "::after", property: "width", value: "1px" },
        { state: "rim", slot: "::after", property: "width token", value: "--glass-rim-width" },
        { state: "rim", slot: "::after", property: "top stop", value: "--glass-rim-top" },
        { state: "rim", slot: "::after", property: "middle stop", value: "--glass-rim-mid" },
        { state: "rim", slot: "::after", property: "middle position", value: "--glass-rim-mid-stop" },
        { state: "rim", slot: "::after", property: "bottom stop", value: "--glass-rim-bottom" },
        {
          state: "rim · tinted",
          slot: "::after",
          property: "gradient override",
          value: "--glass-edge",
          note: {
            ko: "부모가 이 변수를 설정하면 그라데이션 대신 단색 테두리가 됩니다. danger나 선택 상태를 표시할 때 씁니다.",
            en: "When the host sets this variable the gradient gives way to a flat edge color, which is how a danger or selected state is marked.",
          },
        },
      ],
    },
    {
      id: "tiers",
      title: { ko: "농도", en: "Tiers" },
      note: {
        ko: "농도는 부모의 바탕 클래스로 고릅니다. 셋 다 같은 레이어를 쓰고 채우기만 다릅니다.",
        en: "The tier is a class on the host. All three use the same layer and differ only in fill.",
      },
      rows: [
        { state: "clear", slot: "Host", property: "fill", value: "bg-glass-clear" },
        { state: "regular", slot: "Host", property: "fill", value: "bg-glass-regular" },
        { state: "thick", slot: "Host", property: "fill", value: "bg-glass-thick" },
        { state: "all", slot: "Host", property: "position", value: "relative isolate" },
        { state: "all", slot: "Host", property: "background layer", value: "LiquidGlass" },
        {
          state: "reduced transparency",
          slot: "LiquidGlass",
          property: "fill",
          value: "bg-glass-fill-frost",
          note: {
            ko: "투명도 줄이기를 켜면 흐림이 꺼지고 서리 낀 불투명 바탕으로 바뀌며 테두리는 남습니다.",
            en: "With reduced transparency the blur is turned off, the fill becomes a frosted opaque surface, and the rim stays.",
          },
        },
        {
          state: "no backdrop-filter",
          slot: "LiquidGlass",
          property: "fill",
          value: "bg-glass-fill-frost",
          note: {
            ko: "엔진이 backdrop-filter를 지원하지 않아도 같은 서리 바탕으로 떨어집니다.",
            en: "An engine without backdrop-filter falls back to the same frosted fill.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "tiers",
      title: { ko: "세 가지 농도", en: "Three tiers" },
      description: {
        ko: "clear, regular, thick를 같은 배경 위에 놓았습니다. 부모의 바탕 클래스만 바꾸고 레이어는 그대로입니다.",
        en: "Clear, regular and thick over one backdrop. Only the host's fill class changes; the layer is the same.",
      },
    },
    {
      id: "radii",
      title: { ko: "모서리를 따라갑니다", en: "Following the radius" },
      description: {
        ko: "같은 유리를 20px, 16px, 9999px 모서리에 넣었습니다. 레이어와 테두리가 부모의 모서리를 그대로 따릅니다.",
        en: "The same glass at a 20px, a 16px and a 9999px radius. The layer and the rim follow the host's corners.",
      },
    },
    {
      id: "chrome",
      title: { ko: "떠 있는 크롬", en: "Floating chrome" },
      description: {
        ko: "배경 위에 놓인 도구 모음입니다. 문구와 버튼은 relative인 한 겹 안에 모여 레이어 위에 그려집니다.",
        en: "A toolbar over a backdrop. The copy and the buttons sit in one relative wrapper so they paint above the layer.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "LiquidGlass는 순수 장식입니다. aria-hidden이고 포커스를 받지 않으므로 낭독기와 탭 순서에 나타나지 않습니다.",
        en: "LiquidGlass is purely decorative: aria-hidden and never focusable, so it stays out of both the reading order and the tab sequence.",
      },
      {
        ko: "유리 위 글자는 뒤 배경에 따라 대비가 달라집니다. 읽어야 하는 본문에는 유리를 쓰지 않고, 떠 있는 크롬의 글자는 text-text-primary처럼 토큰 색으로 유지합니다.",
        en: "Text on glass gains or loses contrast with whatever sits behind it. Do not put body copy on glass, and keep floating chrome text on token colors such as text-text-primary.",
      },
      {
        ko: "투명도 줄이기를 켠 사용자에게는 흐림 대신 서리 낀 불투명 바탕이 그려집니다. 이 교체는 컴포넌트가 아니라 globals.css가 처리하므로 임의로 배경을 덮지 않습니다.",
        en: "A user who asks for reduced transparency gets a frosted opaque fill instead of the blur. globals.css owns that swap, so never paint over it.",
      },
    ],
    keyboard: [],
  },
};
