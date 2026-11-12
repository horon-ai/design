/**
 * Reference doc for `Card`, written against
 * `packages/react/src/components/card.tsx` and
 * `packages/flutter/lib/src/components/card.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "card",
  anatomy: {
    description: {
      ko: "Card는 제목과 설명, 추가 내용을 담는 표면입니다. solid는 불투명 바탕이고 glass와 frost는 유리 레이어를 안쪽에 깝니다. interactive를 켜면 카드가 눌리는 동작을 갖고 오른쪽에 캐럿이 붙습니다.",
      en: "A Card is a surface that holds a title, a description and extra content. solid paints an opaque surface; glass and frost lay a glass layer inside. With interactive the card becomes pressable and a caret appears at the trailing edge.",
    },
    parts: [
      {
        name: "Root",
        slot: "div",
        description: {
          ko: "카드의 바탕과 테두리, 모서리, 안쪽 여백을 갖는 요소입니다. render로 button이나 a로 바꿀 수 있습니다.",
          en: "The element that carries the fill, border, corner radius and padding. render swaps it for a button or an a.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "solid이 아닌 surface에서만 안쪽에 깔리는 유리 레이어입니다. isolate로 카드 안에 격리되어 내용 뒤에 놓입니다.",
          en: "A glass layer laid inside every surface other than solid. The card's isolate keeps it behind the content.",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "카드의 제목입니다. 한 줄로 잘리지 않고 카드 폭 안에서 줄바꿈하며, interactive일 때 같은 줄 오른쪽에 캐럿이 붙습니다.",
          en: "The card heading. It wraps inside the card instead of truncating, and with interactive the caret joins this row on the right.",
        },
      },
      {
        name: "Description",
        slot: "description",
        description: {
          ko: "제목 아래 한 줄 설명입니다. body-sm 보조 텍스트로 그려집니다.",
          en: "A supporting line under the title, drawn as body-sm secondary text.",
        },
      },
      {
        name: "Content",
        slot: "children",
        description: {
          ko: "설명 아래에 전체 폭으로 놓이는 내용입니다. 목록, 버튼, 이미지처럼 카드가 감쌀 무엇이든 들어갑니다.",
          en: "Content placed full width under the description. It can hold a list, a button, an image or anything else the card wraps.",
        },
      },
      {
        name: "Caret",
        slot: "interactive",
        description: {
          ko: "interactive일 때 오른쪽에 붙는 16px 화살표입니다. 제목이 있으면 제목 줄에, 없으면 카드 오른쪽 위에 놓입니다.",
          en: "The 16px arrow shown with interactive. It sits in the title row, or at the top right when there is no title.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "카드의 바탕 재질입니다. glass와 frost는 떠 있는 크롬 위나 이미지 위에서만 씁니다.",
        en: "The material behind the card. glass and frost belong over imagery or floating chrome.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명 표면에 1px 기본 테두리를 쓰는 기본값입니다. 본문에서 읽히는 카드에 맞습니다.",
            en: "Opaque surface with a 1px default border. The default, and the right pick for cards read as content.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "두꺼운 유리 바탕입니다. 배경 이미지나 유리 패널 위에 카드를 띄울 때 씁니다.",
            en: "The thick glass fill, for a card floating over a background image or a glass panel.",
          },
        },
        {
          name: "frost",
          description: {
            ko: "같은 두꺼운 유리에 더 짙은 서리 바탕과 0 8 24 그림자를 더한 값입니다. 보드처럼 카드가 배경 위에 겹쳐 놓이는 자리에 씁니다.",
            en: "The same thick glass with the denser frost fill and a 0 8 24 shadow, for boards where cards overlap the background.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "interactive",
      title: { ko: "interactive", en: "interactive" },
      description: {
        ko: "참이면 카드가 눌리는 대상이 되어 캐럿, hover 테두리, 누를 때 축소가 붙습니다. root가 div인 채로 두면 키보드로 닿을 수 없으므로 render로 button이나 a를 함께 넘깁니다.",
        en: "When true the card becomes pressable, gaining the caret, a hover border and a press scale. A div root cannot be reached by keyboard, so pass render with a button or an a as well.",
      },
      example: "interactive",
    },
    {
      id: "selected",
      title: { ko: "selected", en: "selected" },
      description: {
        ko: "참이면 테두리를 브랜드 색으로 바꾸고 data-selected를 붙입니다. 고른 카드를 표시할 때 쓰며, 고를 수 있는 목록에는 ChoiceCard가 맞습니다.",
        en: "When true the rim turns brand colour and data-selected is set. Use it to mark the chosen card; for a list of choices, ChoiceCard is the better fit.",
      },
      example: "selected",
    },
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "카드의 제목입니다. 잘리지 않고 카드 폭에서 줄바꿈하므로 두 줄까지는 자연스럽게 들어갑니다. 제목 없이 내용만 두면 카드가 제목 행을 그리지 않습니다.",
        en: "The card heading. It wraps inside the card rather than truncating, so two lines fit naturally. Without it the card draws no heading row.",
      },
      example: "composition",
    },
    {
      id: "description",
      title: { ko: "description", en: "description" },
      description: {
        ko: "제목 아래 보조 설명입니다. body-sm 보조 텍스트라 제목보다 한 단계 약하게 읽힙니다. 한 문장으로 유지합니다.",
        en: "Supporting copy under the title. It is body-sm secondary text, a step quieter than the heading. Keep it to one sentence.",
      },
      example: "composition",
    },
    {
      id: "render",
      title: { ko: "render", en: "render" },
      description: {
        ko: "카드의 root 요소를 바꿉니다. button이나 a를 넘기면 눌리거나 이동하는 카드가 되고, 유리 레이어는 그대로 내용 뒤에 남습니다.",
        en: "Swaps the root element. A button or an a makes the card pressable or navigable, and the glass layer still stays behind the content.",
      },
      example: "interactive",
    },
  ],
  guidelines: [
    {
      id: "glass-over-content",
      title: { ko: "유리 카드는 배경 위에서만", en: "Glass cards belong over a backdrop" },
      body: {
        ko: "glass와 frost는 뒤가 비치는 재질이라 배경 이미지나 떠 있는 크롬 위에서만 위계가 생깁니다. 불투명한 본문 안에 넣으면 solid 카드와 구분되지 않습니다.",
        en: "glass and frost are see-through materials and only carry hierarchy over imagery or floating chrome. Inside an opaque page they look the same as a solid card.",
      },
      do: {
        ko: "배경 이미지 위의 보드에서 frost를 씁니다.",
        en: "Use frost on a board laid over a background image.",
      },
      dont: {
        ko: "본문 목록 안의 카드에 glass를 쓰지 않습니다.",
        en: "Do not use glass for cards inside a page's content list.",
      },
      example: "surfaces",
    },
    {
      id: "press-needs-element",
      title: { ko: "누르는 카드는 button이나 a로", en: "A pressable card needs a button or an a" },
      body: {
        ko: "interactive는 모양과 포커스 링을 더하지만 요소를 바꾸지는 않습니다. div에 onClick만 붙이면 키보드로 닿을 수 없으므로 render에 button이나 a를 넘깁니다.",
        en: "interactive adds the look and the focus ring but does not change the element. A div with onClick alone cannot be reached by keyboard, so pass a button or an a to render.",
      },
      do: {
        ko: "render={<button type=\"button\" />}로 눌리는 카드를 만듭니다.",
        en: "Use render={<button type=\"button\" />} for a pressable card.",
      },
      dont: {
        ko: "div에 onClick만 붙여 카드를 누르게 하지 않습니다.",
        en: "Do not make a div pressable with onClick alone.",
      },
      example: "interactive",
    },
    {
      id: "selected-vs-choice",
      title: { ko: "선택 표시와 선택 컨트롤을 구분합니다", en: "Marking a choice vs choosing one" },
      body: {
        ko: "selected는 이미 고른 카드에 브랜드 테두리를 그리는 표시입니다. 여러 카드 중 하나를 고르게 하는 목록이면 선택 상태와 라디오 의미가 있는 ChoiceCard를 씁니다.",
        en: "selected marks a card that is already chosen with a brand rim. When the user has to pick one of several cards, use ChoiceCard, which carries the selection state and radio semantics.",
      },
      example: "selected",
    },
    {
      id: "content-below",
      title: { ko: "내용은 제목과 설명 아래에", en: "Content sits under the copy" },
      body: {
        ko: "children은 설명 아래에 전체 폭으로 놓입니다. 카드 안에 별도 제목을 다시 넣지 말고 title과 description을 쓰면 간격과 글자 단계가 카드 규칙을 따릅니다.",
        en: "children render full width under the description. Instead of adding another heading inside, use title and description so spacing and type follow the card's own rules.",
      },
      do: {
        ko: "제목은 title, 요약은 description으로 넘깁니다.",
        en: "Pass the heading as title and the summary as description.",
      },
      dont: {
        ko: "children 안에 h3를 다시 넣어 제목을 겹치지 않습니다.",
        en: "Do not repeat the heading as an h3 inside children.",
      },
      example: "composition",
    },
  ],
  specification: [
    {
      id: "surface-colors",
      title: { ko: "surface별 색", en: "Surface colours" },
      note: {
        ko: "glass와 frost는 LiquidGlass 레이어를 함께 그립니다. 테두리 색은 --glass-edge로 유리 가장자리에 전달됩니다.",
        en: "glass and frost also draw the LiquidGlass layer. Border colours reach the glass edge through --glass-edge.",
      },
      rows: [
        { state: "solid", slot: "Root", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Root", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Root", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Root", property: "background layer", value: "LiquidGlass" },
        { state: "frost", slot: "Root", property: "background", value: "bg-glass-fill-frost" },
        { state: "frost", slot: "Root", property: "shadow", value: "0 8px 24px #0a14240f" },
        { state: "frost", slot: "Root", property: "background layer", value: "LiquidGlass" },
        { state: "selected · solid", slot: "Root", property: "border", value: "border-border-brand" },
        {
          state: "selected · glass",
          slot: "Root",
          property: "edge",
          value: "--glass-edge:var(--color-border-brand)",
        },
        {
          state: "selected",
          slot: "Root",
          property: "attribute",
          value: "data-selected",
          note: {
            ko: "선택 상태를 CSS와 테스트가 읽을 수 있게 빈 data-selected를 붙입니다.",
            en: "An empty data-selected is set so CSS and tests can read the selected state.",
          },
        },
      ],
    },
    {
      id: "interaction-states",
      title: { ko: "상호작용 상태", en: "Interaction states" },
      rows: [
        { state: "interactive", slot: "Root", property: "cursor", value: "cursor-pointer" },
        {
          state: "interactive · hover · solid",
          slot: "Root",
          property: "border",
          value: "hover:border-border-strong",
        },
        {
          state: "interactive · hover · glass",
          slot: "Root",
          property: "edge",
          value: "hover:[--glass-edge:var(--color-border-strong)]",
        },
        { state: "interactive · pressed", slot: "Root", property: "motion", value: "active:scale-[0.99]" },
        { state: "focus-visible", slot: "Root", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Root", property: "outline offset", value: "2px" },
        {
          state: "default",
          slot: "Root",
          property: "motion",
          value: "motion-colors",
          note: {
            ko: "색과 테두리 변화는 150ms 동안 이어집니다.",
            en: "Colour and border changes run over 150ms.",
          },
        },
        {
          state: "selected · hover",
          slot: "Root",
          property: "border",
          value: "border-border-brand",
          note: {
            ko: "이미 선택된 카드는 hover에서도 브랜드 테두리를 유지합니다.",
            en: "An already selected card keeps the brand rim on hover.",
          },
        },
      ],
    },
    {
      id: "metrics",
      title: { ko: "치수", en: "Metrics" },
      rows: [
        { state: "default", slot: "Root", property: "padding", value: "20px" },
        { state: "default", slot: "Root", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "Root", property: "gap", value: "8px" },
        { state: "default", slot: "Root", property: "width", value: "min-w-0" },
        { state: "default", slot: "Title", property: "font", value: "text-title-sm" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Description", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Caret", property: "size", value: "16px" },
        { state: "default", slot: "Caret", property: "text color", value: "text-text-secondary" },
        {
          state: "interactive · no title",
          slot: "Caret",
          property: "placement",
          value: "absolute top-5 right-5",
          note: {
            ko: "제목이 없으면 캐럿이 카드 오른쪽 위로 이동합니다.",
            en: "Without a title the caret moves to the top right corner.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "surfaces",
      title: { ko: "surface", en: "Surfaces" },
      description: {
        ko: "solid, glass, frost를 배경 위에서 비교합니다. 유리 재질은 배경이 있어야 바탕이 보입니다.",
        en: "solid, glass and frost over a backdrop. The glass fills only read with something behind them.",
      },
    },
    {
      id: "interactive",
      title: { ko: "누르는 카드", en: "Pressable card" },
      description: {
        ko: "render로 button을 넘기고 interactive를 켜면 캐럿, hover 테두리, 포커스 링이 붙습니다.",
        en: "render with a button plus interactive adds the caret, the hover border and the focus ring.",
      },
    },
    {
      id: "selected",
      title: { ko: "선택된 카드", en: "Selected card" },
      description: {
        ko: "브랜드 테두리로 고른 카드를 표시하고 나머지 카드와 나란히 둡니다.",
        en: "A brand rim marks the chosen card next to the others.",
      },
    },
    {
      id: "composition",
      title: { ko: "내용 구성", en: "Composed content" },
      description: {
        ko: "제목, 설명 아래에 목록과 버튼을 넣은 카드입니다. 내용은 전체 폭으로 놓입니다.",
        en: "A card with a list and a button under its title and description. The content takes the full width.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "interactive 카드는 실제 button이나 a로 렌더링해야 합니다. 그래야 Tab으로 닿고 Enter나 Space로 실행되며, focus-visible 테두리도 함께 그려집니다.",
        en: "An interactive card has to render a real button or a so it can be reached with Tab, run with Enter or Space, and show its focus-visible ring.",
      },
      {
        ko: "제목은 카드마다 한 번만 씁니다. 내용 안에 같은 제목을 다시 넣으면 스크린 리더가 같은 머리를 두 번 읽습니다.",
        en: "Use one title per card. Repeating it inside the content makes a screen reader read the same heading twice.",
      },
      {
        ko: "selected는 색과 data-selected로 표시됩니다. 스크린 리더에 선택 상태를 알려야 하면 카드 바깥에 aria-pressed나 aria-current가 있는 컨트롤을 두거나 ChoiceCard를 씁니다.",
        en: "selected is shown by colour and data-selected. To announce the state to a screen reader, wrap the card in a control with aria-pressed or aria-current, or use ChoiceCard.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "누를 수 있는 카드로 포커스를 옮깁니다.", en: "Moves focus onto a pressable card." },
      },
      {
        keys: ["Enter"],
        action: { ko: "button이나 a로 렌더링된 카드의 동작을 실행합니다.", en: "Runs the action of a card rendered as a button or an a." },
      },
      {
        keys: ["Space"],
        action: { ko: "button으로 렌더링된 카드를 실행합니다.", en: "Runs a card rendered as a button." },
      },
    ],
  },
};
