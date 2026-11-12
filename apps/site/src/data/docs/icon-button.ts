/**
 * Reference doc for `IconButton`, written against
 * `packages/react/src/components/icon-button.tsx` and
 * `packages/flutter/lib/src/components/icon_button.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "icon-button",
  anatomy: {
    description: {
      ko: "IconButton은 아이콘 하나로 동작을 실행하는 원형 버튼입니다. 보이는 원은 32/40/48px이고 그 둘레에 44px 터치 영역이 보이지 않게 깔립니다.",
      en: "An IconButton runs one action from a single icon. The visible disc is 32/40/48px, with an invisible 44px touch target around it.",
    },
    parts: [
      {
        name: "Container",
        slot: "button",
        description: {
          ko: "동작을 실행하는 버튼입니다. label이 aria-label로 붙고, 자리 크기와 배경은 변형과 크기가 정합니다.",
          en: "The button that runs the action. Its label becomes aria-label, and the variant and size decide the footprint and fill.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "glass 변형에서만 원 안쪽에 깔리는 유리 레이어입니다. 원은 넘치는 부분을 잘라내므로 레이어가 원 밖으로 나가지 않습니다.",
          en: "A glass layer drawn inside the disc, only in the glass variant. The disc clips its overflow so the layer never escapes the circle.",
        },
      },
      {
        name: "Icon",
        slot: "icon",
        description: {
          ko: "button 안쪽에서 위치를 잡는 span에 감싸인 글리프입니다. sm에서 16px, md에서 20px, lg에서 24px이며 색은 변형의 글자색을 따릅니다.",
          en: "The glyph, wrapped in a positioning span inside the button. 16px at sm, 20px at md, 24px at lg, colored like the variant's text.",
        },
      },
    ],
  },
  properties: [
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "아이콘 버튼의 채움과 글자색입니다. 기본값은 ghost입니다.",
        en: "Fill and text color of the icon button. The default is ghost.",
      },
      values: [
        {
          name: "ghost",
          description: {
            ko: "평소에는 채움이 없고 hover에서만 6% 잉크가 깔리는 기본형입니다. 도구 모음과 목록 행 동작에 씁니다.",
            en: "No fill until hover, when a 6% ink wash appears. The default for toolbars and row actions.",
          },
        },
        {
          name: "primary",
          description: {
            ko: "브랜드 색으로 채운 원입니다. 한 묶음 안의 주요 동작 하나에만 씁니다.",
            en: "Brand-filled disc, for the one main action in a cluster.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "유리 레이어가 깔린 투명 원입니다. 이미지나 떠 있는 크롬 위에 놓습니다.",
            en: "Clear disc with a glass layer, for floating chrome over imagery.",
          },
        },
        {
          name: "solid",
          description: {
            ko: "테두리와 표면 채움을 가진 원입니다. 페이지 바탕 위에 혼자 놓을 때 씁니다.",
            en: "Bordered, filled disc for a button that sits on the page background.",
          },
        },
        {
          name: "quiet",
          description: {
            ko: "채움도 유리도 없이 hover에서 글자색만 바뀌는 변형입니다. 어두운 셸이나 제목 줄처럼 유리 원이 회색 덩어리로 보이는 자리에 씁니다.",
            en: "No fill and no glass layer; only the text color changes on hover. For dark shells and title bars where a glass disc reads as a grey bubble.",
          },
        },
      ],
      example: "variants",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "원의 지름과 아이콘 크기입니다. 기본값은 md입니다.",
        en: "Diameter of the disc and the icon size. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "지름 32px에 16px 아이콘입니다. 촘촘한 도구 모음에 맞습니다.",
            en: "32px across with a 16px icon, for dense toolbars.",
          },
        },
        {
          name: "md",
          description: {
            ko: "지름 40px에 20px 아이콘입니다.",
            en: "40px across with a 20px icon.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "지름 48px에 24px 아이콘입니다. 화면의 주 동작에 맞습니다.",
            en: "48px across with a 24px icon, for the main action of a screen.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "icon",
      title: { ko: "icon", en: "icon" },
      description: {
        ko: "버튼에 그릴 글리프입니다. 크기는 버튼이 정하므로 아이콘에 직접 크기 클래스를 주지 않습니다.",
        en: "The glyph drawn in the button. The button sets its size, so do not size the icon by hand.",
      },
      example: "toolbar",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "버튼의 접근 가능한 이름입니다. 보이는 글자가 없어서 aria-label로 붙고, 화면 낭독기에서는 이 문구만 들립니다.",
        en: "The button's accessible name. Nothing is visible, so it becomes aria-label and is the only text a screen reader announces.",
      },
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 원이 40% 불투명도로 흐려지고 커서가 not-allowed로 바뀌며 눌리지 않습니다. 자리는 그대로 남습니다.",
        en: "When true the disc fades to 40% opacity, the cursor becomes not-allowed and pressing does nothing. It keeps its place.",
      },
      example: "disabled",
    },
  ],
  guidelines: [
    {
      id: "label-always",
      title: { ko: "label은 동작 이름으로", en: "Name the action in label" },
      body: {
        ko: "아이콘만 보고는 무엇을 하는지 알 수 없으므로 label에 동작을 그대로 적습니다. 아이콘이 여러 개 모인 도구 모음에서는 label이 곧 구분 수단입니다.",
        en: "An icon alone does not say what happens, so label spells out the action. In a toolbar of icons the labels are the only way to tell them apart.",
      },
      do: {
        ko: "label에 \"Add bot\", \"Search\", \"More\"처럼 동작을 씁니다.",
        en: "Write the action in label, such as \"Add bot\", \"Search\" or \"More\".",
      },
      dont: {
        ko: "label에 \"Plus\"나 \"Icon\"처럼 모양을 쓰지 않습니다.",
        en: "Do not name the shape, such as \"Plus\" or \"Icon\".",
      },
      example: "toolbar",
    },
    {
      id: "glass-on-chrome",
      title: { ko: "glass는 떠 있는 크롬 위에서만", en: "Glass belongs on floating chrome" },
      body: {
        ko: "glass는 이미지나 유리 패널 위에서만 씁니다. 불투명한 본문 위에서는 유리 채움이 보이지 않아 원의 경계가 사라집니다.",
        en: "Use glass only over imagery or a glass panel. On an opaque surface the glass fill disappears and with it the edge of the disc.",
      },
      do: {
        ko: "배경 이미지 위에 놓인 도구 모음에서 glass를 씁니다.",
        en: "Use glass in a toolbar that floats over a background image.",
      },
      dont: {
        ko: "일반 카드 안의 동작에 glass를 쓰지 않습니다.",
        en: "Do not use glass for actions inside a plain card.",
      },
      example: "variants",
    },
    {
      id: "quiet-on-dark",
      title: { ko: "어두운 셸에서는 quiet", en: "Quiet on dark shells" },
      body: {
        ko: "어두운 셸이나 제목 줄에서는 glass 원이 회색 방울처럼 보입니다. 이 자리에는 채움 없는 quiet를 쓰고 hover에서 글자색이 primary로 바뀌게 둡니다.",
        en: "On a dark shell or title bar a glass disc reads as a grey bubble. Use quiet there and let the icon turn primary on hover.",
      },
      example: "toolbar",
    },
    {
      id: "one-primary",
      title: { ko: "primary는 한 묶음에 하나", en: "One primary per cluster" },
      body: {
        ko: "primary 원은 도구 모음이나 행 하나에서 가장 중요한 동작 하나에만 씁니다. 두 개가 나란히 있으면 어느 쪽이 주요 동작인지 판단할 수 없습니다.",
        en: "Use the primary disc for the single most important action of a toolbar or row. Two side by side leave no way to tell which one matters.",
      },
      example: "variants",
    },
  ],
  specification: [
    {
      id: "variant-colors",
      title: { ko: "변형별 색", en: "Variant colors" },
      note: {
        ko: "값은 토큰 유틸 이름입니다. hover와 pressed는 비활성 상태에서는 적용되지 않습니다.",
        en: "Values are token utility names. Hover and pressed do not apply while the button is disabled.",
      },
      rows: [
        { state: "Primary", slot: "Container", property: "background", value: "bg-interactive-primary" },
        { state: "Primary", slot: "Container", property: "text color", value: "text-interactive-on-primary" },
        {
          state: "Primary · hover",
          slot: "Container",
          property: "background",
          value: "bg-interactive-primary-hover",
        },
        {
          state: "Primary · pressed",
          slot: "Container",
          property: "background",
          value: "bg-interactive-primary-pressed",
        },
        {
          state: "Ghost",
          slot: "Container",
          property: "background",
          value: "transparent",
          note: { ko: "평소에는 채움이 없습니다.", en: "No fill at rest." },
        },
        { state: "Ghost", slot: "Container", property: "text color", value: "text-text-primary" },
        { state: "Ghost · hover", slot: "Container", property: "background", value: "bg-overlay-ink-6" },
        { state: "Ghost · pressed", slot: "Container", property: "background", value: "bg-overlay-ink-10" },
        { state: "Glass", slot: "Container", property: "background", value: "bg-glass-clear" },
        { state: "Glass", slot: "Container", property: "background layer", value: "LiquidGlass" },
        { state: "Glass", slot: "Container", property: "text color", value: "text-text-primary" },
        {
          state: "Glass · hover",
          slot: "Container",
          property: "background",
          value: "bg-glass-clear-hover",
        },
        {
          state: "Glass · pressed",
          slot: "Container",
          property: "background",
          value: "bg-glass-clear-pressed",
        },
        { state: "Solid", slot: "Container", property: "background", value: "bg-bg-surface" },
        { state: "Solid", slot: "Container", property: "border", value: "1px border-border-default" },
        { state: "Solid", slot: "Container", property: "text color", value: "text-text-primary" },
        { state: "Solid · hover", slot: "Container", property: "background", value: "bg-bg-subtle" },
        {
          state: "Solid · pressed",
          slot: "Container",
          property: "background",
          value: "bg-interactive-secondary-hover",
        },
        { state: "Quiet", slot: "Container", property: "text color", value: "text-text-secondary" },
        {
          state: "Quiet · hover",
          slot: "Container",
          property: "background",
          value: "bg-overlay-ink-6",
        },
        {
          state: "Quiet · hover",
          slot: "Container",
          property: "text color",
          value: "text-text-primary",
        },
        {
          state: "Quiet · pressed",
          slot: "Container",
          property: "background",
          value: "bg-overlay-ink-10",
        },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Container", property: "width", value: "32px" },
        { state: "sm", slot: "Container", property: "height", value: "32px" },
        { state: "sm", slot: "Container", property: "radius", value: "rounded-full" },
        { state: "sm", slot: "Icon", property: "size", value: "16px" },
        { state: "sm", slot: "Container", property: "touch target", value: "44px" },
        { state: "md", slot: "Container", property: "width", value: "40px" },
        { state: "md", slot: "Container", property: "height", value: "40px" },
        { state: "md", slot: "Container", property: "radius", value: "rounded-full" },
        { state: "md", slot: "Icon", property: "size", value: "20px" },
        { state: "md", slot: "Container", property: "touch target", value: "44px" },
        { state: "lg", slot: "Container", property: "width", value: "48px" },
        { state: "lg", slot: "Container", property: "height", value: "48px" },
        { state: "lg", slot: "Container", property: "radius", value: "rounded-full" },
        { state: "lg", slot: "Icon", property: "size", value: "24px" },
        { state: "lg", slot: "Container", property: "touch target", value: "44px" },
        { state: "lg", slot: "Container", property: "disc", value: "48px", note: { ko: "원 자체가 44px보다 커서 터치 영역이 원 전체입니다.", en: "The disc is already larger than 44px, so it is the touch target." } },
      ],
    },
    {
      id: "interaction-states",
      title: { ko: "상호작용 상태", en: "Interaction states" },
      rows: [
        {
          state: "focus-visible",
          slot: "Container",
          property: "outline",
          value: "2px outline-text-brand",
        },
        {
          state: "focus-visible",
          slot: "Container",
          property: "outline offset",
          value: "2px",
          note: {
            ko: "키보드로 포커스가 닿을 때만 그립니다.",
            en: "Drawn only when focus arrives from the keyboard.",
          },
        },
        {
          state: "pressed",
          slot: "Container",
          property: "motion",
          value: "motion-press",
          note: {
            ko: "scale 0.97이고, 동작 줄이기를 켜면 즉시 끝납니다.",
            en: "Scale 0.97; it collapses to nothing when reduced motion is on.",
          },
        },
        {
          state: "disabled",
          slot: "Container",
          property: "opacity",
          value: "40%",
          note: {
            ko: "커서는 not-allowed가 되고 눌러도 아무 일도 일어나지 않습니다.",
            en: "The cursor becomes not-allowed and pressing does nothing.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "variants",
      title: { ko: "변형", en: "Variants" },
      description: {
        ko: "다섯 변형을 한 줄에 놓았습니다. glass는 배경 위에서만 유리 채움이 보입니다.",
        en: "All five variants in one row. Glass only shows its fill over a backdrop.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 지름과 그에 맞춘 아이콘 크기를 나란히 두었습니다.",
        en: "The sm, md and lg diameters with the icon size each one sets.",
      },
    },
    {
      id: "disabled",
      title: { ko: "비활성", en: "Disabled" },
      description: {
        ko: "비활성 원은 자리를 지킨 채 40% 불투명도로 흐려집니다.",
        en: "A disabled disc keeps its place and fades to 40% opacity.",
      },
    },
    {
      id: "toolbar",
      title: { ko: "도구 모음", en: "Toolbar" },
      description: {
        ko: "검색과 추가, 더보기를 한 묶음으로 두고 주요 동작 하나만 primary로 표시합니다.",
        en: "Search, add and more in one cluster, with only the main action filled as primary.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Button Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    notes: [
      {
        ko: "보이는 글자가 없으므로 label이 유일한 접근 가능한 이름입니다. label을 비우면 화면 낭독기가 버튼을 읽을 수 없습니다.",
        en: "With no visible text, label is the only accessible name. An empty label leaves the button unreadable to assistive tech.",
      },
      {
        ko: "1차원 원의 터치 영역은 보이지 않는 의사 요소로 44px까지 넓혀 두었습니다. 원 사이 간격을 좁힐 때는 이 영역이 겹치지 않는지 확인합니다.",
        en: "An invisible pseudo-element widens the touch target to 44px. When you tighten the gap between discs, check that these areas do not overlap.",
      },
      {
        ko: "포커스 표시는 2px outline으로 그리며 outline offset 2px만큼 떨어뜨려 원과 겹치지 않게 합니다. 임의로 지우지 않습니다.",
        en: "The focus ring is a 2px outline held 2px off the disc so the two never merge. Do not remove it.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter"],
        action: { ko: "버튼의 동작을 실행합니다.", en: "Runs the button's action." },
      },
      {
        keys: ["Space"],
        action: { ko: "버튼의 동작을 실행합니다.", en: "Runs the button's action." },
      },
      {
        keys: ["Tab"],
        action: { ko: "다음 포커스 가능한 요소로 이동합니다.", en: "Moves focus to the next focusable control." },
      },
    ],
  },
};
