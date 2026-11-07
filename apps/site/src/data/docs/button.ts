/**
 * Reference doc for `Button`, written against
 * `packages/react/src/components/button.tsx` and
 * `packages/flutter/lib/src/components/button.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "button",
  anatomy: {
    description: {
      ko: "Button은 동작 하나를 실행하는 컨트롤입니다. 컨테이너 하나에 아이콘과 라벨이 들어가고, glass 변형에서는 컨테이너 안쪽에 유리 레이어가 한 겹 더 깔립니다.",
      en: "A Button runs one action. A single container holds an optional icon and a label, and the glass variant adds a glass layer inside that container.",
    },
    parts: [
      {
        name: "Container",
        slot: "button",
        description: {
          ko: "동작을 실행하는 실제 button 요소입니다. href가 있으면 a 요소로 바뀌고 링크로 읽힙니다.",
          en: "The real button element that runs the action. With href it becomes an a element and is read as a link.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "glass 변형에서만 컨테이너 안쪽에 깔리는 유리 레이어입니다. 아이콘과 라벨은 그 위에 놓입니다.",
          en: "A glass layer drawn inside the container, only in the glass variant. The icon and label sit on top of it.",
        },
      },
      {
        name: "Icon",
        slot: "icon",
        description: {
          ko: "라벨 앞의 아이콘입니다. sm과 md에서 16px, lg에서 20px이며 라벨 색을 따릅니다.",
          en: "Leading icon. 16px in sm and md, 20px in lg, colored like the label.",
        },
      },
      {
        name: "Label",
        slot: "children",
        description: {
          ko: "버튼의 문구입니다. 자식이 엘리먼트면 같은 간격으로 한 줄에 배치합니다.",
          en: "The button's text. Element children are laid out in one row at the same gap.",
        },
      },
    ],
  },
  properties: [
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "버튼의 시각적 변형입니다. link 변형은 크기 값을 쓰지 않습니다.",
        en: "Visual treatment of the button. The link variant ignores the size values.",
      },
      values: [
        {
          name: "primary",
          description: {
            ko: "화면이나 대화상자의 단일 주요 동작에 쓰는 채워진 버튼입니다.",
            en: "Filled button for the single main action of a screen or dialog.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 떠 있는 크롬 위에 놓는 투명 유리 버튼입니다.",
            en: "Clear glass button for chrome floating over imagery.",
          },
        },
        {
          name: "solid",
          description: {
            ko: "페이지의 보조 동작에 쓰는 테두리 표면 버튼입니다.",
            en: "Bordered surface button for secondary actions on a page.",
          },
        },
        {
          name: "danger",
          description: {
            ko: "삭제처럼 되돌리기 어려운 동작에 쓰는 채워진 버튼입니다.",
            en: "Filled button for destructive actions such as delete.",
          },
        },
        {
          name: "link",
          description: {
            ko: "크기와 무관한 텍스트 전용 버튼입니다. 지금 보고 있는 페이지를 가리키면 aria-current로 표시합니다.",
            en: "Size-independent text-only button. Mark it with aria-current when it points at the page in view.",
          },
        },
      ],
      example: "variants",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "높이와 라벨 단계입니다. link 변형에서는 쓰이지 않습니다.",
        en: "Height and label rung. Not used by the link variant.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 32px에 label-md 라벨을 씁니다. 좁은 도구 모음에 맞습니다.",
            en: "32px tall with a label-md label, for dense toolbars.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 40px에 label-lg 라벨을 씁니다. 기본값입니다.",
            en: "40px tall with a label-lg label. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 48px에 label-lg 라벨을 씁니다. 화면의 주 동작에 맞습니다.",
            en: "48px tall with a label-lg label, for the main action of a screen.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 버튼이 40% 불투명도로 흐려지고 커서가 not-allowed로 바뀌며 눌리지 않습니다. 자리에서 지우지 말고 이 상태로 남겨 두면 된다는 것을 알립니다.",
        en: "When true the button fades to 40% opacity, the cursor becomes not-allowed, and it stops responding. Leaving it in place this way says the action exists but cannot run yet.",
      },
      example: "disabled",
    },
  ],
  guidelines: [
    {
      id: "one-primary",
      title: { ko: "화면마다 primary는 하나", en: "One primary per screen" },
      body: {
        ko: "primary는 화면이나 대화상자에서 가장 중요한 동작 하나에만 씁니다. 두 개가 나란히 있으면 어느 쪽이 주요 동작인지 판단할 수 없습니다.",
        en: "Use primary for the single most important action of a screen or dialog. Two side by side leave no way to tell which one matters.",
      },
      do: {
        ko: "저장 버튼 하나를 primary로 두고 나머지는 solid로 둡니다.",
        en: "Keep one Save button primary and the rest solid.",
      },
      dont: {
        ko: "저장과 취소를 모두 primary로 두지 않습니다.",
        en: "Do not make both Save and Cancel primary.",
      },
      example: "variants",
    },
    {
      id: "glass-on-chrome",
      title: { ko: "glass는 떠 있는 면 위에서만", en: "Glass belongs on floating chrome" },
      body: {
        ko: "glass 변형은 이미지나 떠 있는 크롬처럼 뒤가 비치는 면 위에서만 씁니다. 불투명한 본문 위에서는 유리 바탕이 보이지 않아 위계가 사라집니다.",
        en: "Use the glass variant only over imagery or floating chrome. On an opaque page its fill disappears and with it the hierarchy.",
      },
      do: {
        ko: "배경 이미지 위에 놓인 도구 모음에서 glass를 씁니다.",
        en: "Use glass in a toolbar that floats over a background image.",
      },
      dont: {
        ko: "일반 본문 카드 안에서 glass를 쓰지 않습니다.",
        en: "Do not use glass inside a plain content card.",
      },
      example: "variants",
    },
    {
      id: "danger-destructive",
      title: { ko: "danger는 되돌리기 어려운 동작에만", en: "Danger for destructive actions" },
      body: {
        ko: "danger는 삭제처럼 결과를 되돌리기 어려운 동작에만 씁니다. 확인이 필요한 삭제라면 대화상자 안에서 danger로 마무리합니다.",
        en: "Use danger only for actions whose result is hard to undo. A delete that needs confirmation ends with a danger button inside the dialog.",
      },
      do: {
        ko: "봇 삭제를 확인하는 버튼에 danger를 씁니다.",
        en: "Use danger for the button that confirms deleting a bot.",
      },
      dont: {
        ko: "닫기나 취소처럼 되돌릴 수 있는 동작에 danger를 쓰지 않습니다.",
        en: "Do not use danger for reversible actions such as Close or Cancel.",
      },
      example: "disabled",
    },
    {
      id: "link-current",
      title: { ko: "link는 현재 위치를 표시합니다", en: "Link marks the current page" },
      body: {
        ko: "link 변형은 크기 값과 무관하게 한 가지 모양을 유지합니다. 지금 보고 있는 페이지를 가리키는 링크에는 aria-current를 page로 지정하면 라벨이 text-primary로 바뀝니다.",
        en: "The link variant keeps one look at every size. Set aria-current to page on the link for the page in view and its label turns text-primary.",
      },
      example: "link",
    },
  ],
  specification: [
    {
      id: "variant-colors",
      title: { ko: "변형별 색", en: "Variant colors" },
      note: {
        ko: "값은 토큰 유틸 이름이고, hover와 pressed는 비활성 상태에서는 적용되지 않습니다.",
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
        { state: "Glass", slot: "Container", property: "background", value: "bg-glass-clear" },
        { state: "Glass", slot: "Container", property: "background layer", value: "LiquidGlass" },
        { state: "Glass", slot: "Container", property: "text color", value: "text-text-primary" },
        { state: "Glass · hover", slot: "Container", property: "background", value: "bg-glass-clear-hover" },
        { state: "Glass · pressed", slot: "Container", property: "background", value: "bg-glass-clear-pressed" },
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
        { state: "Danger", slot: "Container", property: "background", value: "bg-interactive-danger" },
        { state: "Danger", slot: "Container", property: "text color", value: "text-interactive-on-danger" },
        {
          state: "Danger · hover",
          slot: "Container",
          property: "background",
          value: "bg-interactive-danger-hover",
        },
        {
          state: "Danger · pressed",
          slot: "Container",
          property: "background",
          value: "bg-interactive-danger",
          note: {
            ko: "누르면 hover 색이 아니라 원래 위험 색으로 돌아갑니다.",
            en: "Pressing returns to the base danger color rather than the hover color.",
          },
        },
        { state: "Link", slot: "Label", property: "text color", value: "text-text-secondary" },
        { state: "Link · hover", slot: "Label", property: "text color", value: "text-text-primary" },
        {
          state: "Link · current",
          slot: "Label",
          property: "text color",
          value: "text-text-primary",
          note: {
            ko: "aria-current가 page이거나 true인 링크는 hover 없이도 이 색을 씁니다.",
            en: "A link whose aria-current is page or true gets this color without hovering.",
          },
        },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Container", property: "height", value: "32px" },
        { state: "sm", slot: "Container", property: "padding", value: "0 12px" },
        { state: "sm", slot: "Container", property: "gap", value: "6px" },
        { state: "sm", slot: "Container", property: "radius", value: "9999px" },
        { state: "sm", slot: "Label", property: "font", value: "text-label-md" },
        { state: "sm", slot: "Icon", property: "size", value: "16px" },
        { state: "sm", slot: "Container", property: "touch target", value: "44px" },
        { state: "md", slot: "Container", property: "height", value: "40px" },
        { state: "md", slot: "Container", property: "padding", value: "0 16px" },
        { state: "md", slot: "Container", property: "gap", value: "8px" },
        { state: "md", slot: "Container", property: "radius", value: "9999px" },
        { state: "md", slot: "Label", property: "font", value: "text-label-lg" },
        { state: "md", slot: "Icon", property: "size", value: "16px" },
        { state: "md", slot: "Container", property: "touch target", value: "44px" },
        { state: "lg", slot: "Container", property: "height", value: "48px" },
        { state: "lg", slot: "Container", property: "padding", value: "0 20px" },
        { state: "lg", slot: "Container", property: "gap", value: "8px" },
        { state: "lg", slot: "Container", property: "radius", value: "9999px" },
        { state: "lg", slot: "Label", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Icon", property: "size", value: "20px" },
        { state: "lg", slot: "Container", property: "touch target", value: "48px" },
        { state: "link", slot: "Container", property: "height", value: "auto" },
        { state: "link", slot: "Container", property: "padding", value: "0 4px" },
        { state: "link", slot: "Container", property: "gap", value: "6px" },
        { state: "link", slot: "Container", property: "radius", value: "6px" },
        { state: "link", slot: "Label", property: "font", value: "text-label-sm" },
        { state: "link", slot: "Icon", property: "size", value: "14px" },
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
        ko: "다섯 변형을 한자리에 놓았습니다. glass는 배경 위에서만 유리 바탕이 보입니다.",
        en: "All five variants together. Glass only shows its fill over a backdrop.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 높이와 크기와 무관한 link를 나란히 두었습니다.",
        en: "The sm, md and lg heights next to a link that stays the same at every size.",
      },
    },
    {
      id: "with-icon",
      title: { ko: "아이콘 포함", en: "With an icon" },
      description: {
        ko: "아이콘을 라벨 앞에 두면 아이콘 크기와 색을 버튼이 정합니다.",
        en: "An icon before the label gets its size and color from the button.",
      },
    },
    {
      id: "disabled",
      title: { ko: "비활성", en: "Disabled" },
      description: {
        ko: "비활성 버튼은 자리를 지킨 채 40% 불투명도로 흐려집니다.",
        en: "A disabled button keeps its place and fades to 40% opacity.",
      },
    },
    {
      id: "link",
      title: { ko: "링크 버튼", en: "Link buttons" },
      description: {
        ko: "현재 위치를 aria-current로 표시한 링크와 아이콘이 붙은 링크를 보여 줍니다.",
        en: "A link marked current with aria-current, and a link with an icon.",
      },
    },
    {
      id: "as-link",
      title: { ko: "링크로 렌더링", en: "Rendered as a link" },
      description: {
        ko: "href를 주면 button 대신 a 요소로 렌더링되어 링크로 읽힙니다.",
        en: "With href the button renders as an a element instead and is read as a link.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Button Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/" },
    notes: [
      {
        ko: "버튼 안의 문구가 동작을 그대로 설명해야 합니다. 아이콘만 있는 버튼은 Button이 아니라 IconButton을 쓰고 접근 가능한 이름을 꼭 붙입니다.",
        en: "The label has to name the action. For an icon-only control use IconButton and always give it an accessible name.",
      },
      {
        ko: "href를 주면 button 대신 a 요소로 렌더링되므로 링크로 읽히고, 이동은 브라우저가 처리합니다. 페이지 이동에는 이 형태를 쓰고 동작 실행에는 href를 쓰지 않습니다.",
        en: "With href the button renders as an a element, so it is read as a link and the browser handles the navigation. Use it for navigation, never for running an action.",
      },
      {
        ko: "포커스 표시는 2px outline으로 그리며 outline offset 2px만큼 떨어뜨려 테두리와 겹치지 않게 합니다. 배경과 대비가 유지되도록 임의로 지우지 않습니다.",
        en: "The focus ring is a 2px outline held 2px off the control so it never merges with the border. Do not remove it; it keeps contrast against every surface.",
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
