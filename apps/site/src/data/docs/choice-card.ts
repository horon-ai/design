/**
 * Reference doc for `ChoiceCard`, written against
 * `packages/react/src/components/choice-card.tsx` and
 * `packages/flutter/lib/src/components/choice_card.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "choice-card",
  anatomy: {
    description: {
      ko: "ChoiceCard는 RadioGroup 안에서 카드 하나를 고르는 라디오 카드입니다. 왼쪽의 라디오 표시와 오른쪽의 제목·설명 묶음이 한 줄을 이루고, 제목 줄 끝에는 선택적으로 배지가 붙습니다.",
      en: "A ChoiceCard is a radio card that picks one card within a RadioGroup. A radio mark on the left and a stack of title and description on the right form one row, with an optional badge at the end of the title line.",
    },
    parts: [
      {
        name: "Card",
        slot: "Radio.Root",
        description: {
          ko: "실제 라디오 루트입니다. 최대 252px 너비에 테두리와 둥근 모서리를 갖고, 선택되면 테두리가 brand로 바뀝니다. 호버에서는 unchecked일 때만 테두리가 strong으로 짙어집니다.",
          en: "The real radio root. It caps at 252px with a border and rounded corners, and its border turns brand when checked. On hover the border deepens to strong only while unchecked.",
        },
      },
      {
        name: "Mark",
        slot: "Radio.Indicator",
        description: {
          ko: "18px 라디오 표시입니다. 꺼져 있을 때는 1.5px 회색 테두리, 켜지면 primary 색 링과 8px 점으로 그려집니다. 장식이라 aria-hidden입니다.",
          en: "The 18px radio mark. Off it is a 1.5px grey ring; on it becomes a primary ring around an 8px dot. It is decorative and aria-hidden.",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "카드의 제목입니다. label-md 굵은 글씨로, 카드 너비가 허용하는 만큼 여러 줄로 접힙니다.",
          en: "The card's title, set in semibold label-md and wrapped onto as many lines as the card width allows.",
        },
      },
      {
        name: "Badge",
        slot: "badge",
        description: {
          ko: "제목 줄 끝의 알약입니다. 22px 높이에 label-sm 글씨로, badgeTone이 brand면 하늘색 18% 바탕과 brand 글씨, neutral이면 6% 잉크 바탕과 secondary 글씨를 씁니다.",
          en: "The pill at the end of the title line: 22px tall in label-sm, either 18% sky with brand text on the brand tone or 6% ink with secondary text on neutral.",
        },
      },
      {
        name: "Description",
        slot: "description",
        description: {
          ko: "제목 아래의 caption 줄입니다. 고르는 결과가 무엇인지 한 문장으로 적고, 없으면 그리지 않습니다.",
          en: "The caption line under the title. One sentence on what the choice does; it is not drawn at all when absent.",
        },
      },
    ],
  },
  properties: [
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "이 카드가 대표하는 값입니다. RadioGroup의 value나 defaultValue와 비교되어 어느 카드가 선택되었는지 정합니다. 같은 그룹 안에서 겹치지 않아야 합니다.",
        en: "The value this card stands for. It is compared against the RadioGroup's value or defaultValue to decide which card is checked, and must be unique within the group.",
      },
      example: "group",
    },
    {
      id: "badgeTone",
      title: { ko: "badgeTone", en: "badgeTone" },
      description: {
        ko: "배지의 색입니다. 어떤 카드가 왜 추천되는지 알리는 문구에 어울리는 색을 고릅니다.",
        en: "Color of the badge, picked to suit what the badge says.",
      },
      values: [
        {
          name: "brand",
          description: {
            ko: "하늘색 18% 바탕에 brand 글씨를 씁니다. \"Recommended\"처럼 카드가 지금 권하는 선택일 때 씁니다. 기본값입니다.",
            en: "18% sky with brand text, for a card the product recommends now, such as \"Recommended\". The default.",
          },
        },
        {
          name: "neutral",
          description: {
            ko: "6% 잉크 바탕에 secondary 글씨를 씁니다. \"Current plan\"처럼 권함이 아니라 사실을 알리는 문구에 씁니다.",
            en: "6% ink with secondary text, for a badge that states a fact such as \"Current plan\" rather than a recommendation.",
          },
        },
      ],
      example: "badge-tones",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 카드가 40% 불투명도로 흐려지고 커서가 not-allowed로 바뀌며 눌러도 선택되지 않습니다. 지금 고를 수 없는 조건을 카드에서 지우지 않고 이 상태로 남겨 둡니다.",
        en: "When true the card fades to 40% opacity, the cursor becomes not-allowed, and pressing does nothing. Keep an unavailable option in place this way instead of removing it.",
      },
      example: "group",
    },
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "카드의 제목이며 접근 가능한 이름이 되는 문구입니다. 무엇을 고르는지 한두 단어로 적고, 조건 설명은 description으로 내립니다.",
        en: "The card's title and the text its accessible name comes from. Keep it to a word or two and move the caveats into description.",
      },
      example: "group",
    },
  ],
  guidelines: [
    {
      id: "belongs-to-a-radio-group",
      title: { ko: "항상 RadioGroup 안에", en: "Always inside a RadioGroup" },
      body: {
        ko: "ChoiceCard는 라디오 루트라 그룹 없이 혼자 두면 선택 상태를 관리할 주체가 없습니다. RadioGroup이 값 하나를 들고 화살표 키 이동도 맡으므로, 카드 두세 개를 그룹으로 감싸고 그룹에 이름을 붙입니다.",
        en: "A ChoiceCard is a radio root, so on its own there is nothing to own the selection. The RadioGroup holds one value and handles arrow-key movement, so wrap the cards in one and name the group.",
      },
      do: {
        ko: "요금제 카드 세 개를 RadioGroup 하나로 감쌉니다.",
        en: "Wrap three plan cards in one RadioGroup.",
      },
      dont: {
        ko: "ChoiceCard를 그룹 없이 나란히 두지 않습니다.",
        en: "Do not place choice cards side by side without a group.",
      },
      example: "group",
    },
    {
      id: "one-sentence-description",
      title: { ko: "설명은 한 문장으로", en: "Keep the description to one sentence" },
      body: {
        ko: "카드는 252px 폭에 머물므로 설명이 길어지면 가장 긴 카드가 줄 높이를 정하고 나머지 카드가 그만큼 비어 보입니다. 고른 결과를 한 문장으로 적고, 세부 조건은 아래에 따로 설명합니다.",
        en: "Cards stay at 252px, so a long description makes the tallest card set the row height and leaves the others looking empty. State the outcome in one sentence and explain the details below the group.",
      },
      example: "group",
    },
    {
      id: "badge-for-the-reason",
      title: { ko: "배지는 고를 이유를 적습니다", en: "Let the badge give the reason" },
      body: {
        ko: "배지는 카드 사이의 차이를 알려 주는 자리입니다. \"Recommended\"처럼 고를 이유를 적고, 권함이 아니라 상태라면 neutral로 낮춰 색의 무게를 줄입니다. 배지가 모든 카드에 붙으면 아무것도 구분하지 못합니다.",
        en: "The badge is the place that marks a difference between cards. Put the reason there, as in \"Recommended\", and drop to neutral when it states a fact rather than a recommendation. A badge on every card distinguishes nothing.",
      },
      example: "badge-tones",
    },
    {
      id: "disabled-because-explained",
      title: { ko: "비활성 카드에는 이유를 붙입니다", en: "Say why a card is unavailable" },
      body: {
        ko: "비활성 카드는 흐려지기만 해서 왜 고를 수 없는지 알 수 없습니다. description에 이유를 적고, 그 이유를 푸는 길이 있으면 함께 적습니다. 이유를 적을 수 없다면 카드를 지우는 편이 낫습니다.",
        en: "A disabled card only fades, so nothing says why it cannot be picked. Put the reason in its description, along with the way out when there is one. Without a reason to give, remove the card instead.",
      },
      example: "group",
    },
  ],
  specification: [
    {
      id: "card",
      title: { ko: "카드", en: "Card" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 괄호 안은 그 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; the parentheses give the pixels they produce.",
      },
      rows: [
        { state: "all", slot: "Card", property: "width", value: "w-full max-w-[252px]" },
        { state: "all", slot: "Card", property: "padding", value: "p-3.5 (14px)" },
        { state: "all", slot: "Card", property: "gap", value: "gap-3 (12px)" },
        { state: "all", slot: "Card", property: "radius", value: "rounded-2xl" },
        { state: "all", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "all", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "all", slot: "Mark", property: "size", value: "18px" },
        { state: "all", slot: "Mark", property: "border", value: "1.5px border-border-dashed" },
        { state: "all", slot: "Title", property: "font", value: "text-label-md semibold" },
        { state: "all", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Description", property: "font", value: "text-caption" },
        { state: "all", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Badge", property: "height", value: "h-[22px]" },
        { state: "all", slot: "Badge", property: "padding-x", value: "px-2" },
        { state: "all", slot: "Badge", property: "font", value: "text-label-sm" },
        { state: "all", slot: "Badge", property: "radius", value: "rounded-full" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "unchecked", slot: "Card", property: "border", value: "border-border-default" },
        { state: "unchecked · hover", slot: "Card", property: "border", value: "border-border-strong" },
        { state: "checked", slot: "Card", property: "border", value: "border-border-brand" },
        { state: "checked", slot: "Mark", property: "border", value: "border-interactive-primary" },
        {
          state: "checked",
          slot: "Mark",
          property: "ring",
          value: "inset 0 0 0 3.5px interactive-primary",
          note: {
            ko: "테두리와 안쪽 링이 겹쳐 5px 두께의 링과 8px 점으로 보입니다.",
            en: "The border and the inner ring together read as a 5px ring around an 8px dot.",
          },
        },
        { state: "checked", slot: "Dot", property: "size", value: "size-2 (8px)" },
        { state: "checked", slot: "Dot", property: "background", value: "bg-interactive-on-primary" },
        { state: "checked", slot: "Dot", property: "motion", value: "animate-pop-in" },
        { state: "focus-visible", slot: "Card", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Card", property: "outline offset", value: "2px" },
        { state: "disabled", slot: "Card", property: "opacity", value: "40%" },
        { state: "disabled", slot: "Card", property: "cursor", value: "not-allowed" },
        { state: "all", slot: "Card", property: "transition", value: "motion-colors" },
      ],
    },
    {
      id: "badge-tones",
      title: { ko: "배지 색", en: "Badge tones" },
      rows: [
        { state: "brand", slot: "Badge", property: "background", value: "bg-accent-sky-500-18" },
        { state: "brand", slot: "Badge", property: "text color", value: "text-text-brand" },
        { state: "neutral", slot: "Badge", property: "background", value: "bg-overlay-ink-6" },
        { state: "neutral", slot: "Badge", property: "text color", value: "text-text-secondary" },
      ],
    },
  ],
  examples: [
    {
      id: "group",
      title: { ko: "카드 묶음", en: "A card group" },
      description: {
        ko: "세 카드를 RadioGroup 하나에 담았습니다. 가운데 카드에 추천 배지가 붙고 마지막 카드는 비활성입니다.",
        en: "Three cards in one RadioGroup, with a recommendation badge on the middle card and the last one disabled.",
      },
    },
    {
      id: "badge-tones",
      title: { ko: "배지 색", en: "Badge tones" },
      description: {
        ko: "brand와 neutral 두 색을 나란히 놓았습니다. 권함과 상태를 색으로 구분합니다.",
        en: "The brand and neutral colors side by side, separating a recommendation from a state.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어 선택", en: "Controlled selection" },
      description: {
        ko: "RadioGroup의 value와 onValueChange로 선택을 바깥에서 들고 지금 고른 값을 아래에 적습니다.",
        en: "Holding the choice outside through the RadioGroup's value and onValueChange and writing the picked value below.",
      },
    },
    {
      id: "without-description",
      title: { ko: "설명 없는 카드", en: "Without a description" },
      description: {
        ko: "description을 빼면 제목 줄만 남습니다. 짧은 이름만으로 구분되는 선택지에 맞습니다.",
        en: "Leaving description out keeps only the title line, for choices a short name already separates.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Radio Group Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/radiogroup/" },
    notes: [
      {
        ko: "카드는 role=radio를 가진 라디오 루트이고 선택 상태를 aria-checked로 알립니다. 라디오 표시는 장식이라 aria-hidden이며, 접근 가능한 이름은 카드 안의 제목과 설명 텍스트에서 나옵니다.",
        en: "The card is a radio root with role=radio and reports through aria-checked. The mark is decoration and aria-hidden, and the accessible name comes from the title and description text inside the card.",
      },
      {
        ko: "한 그룹 안에서 탭 순서를 받는 카드는 하나뿐이고, 나머지는 화살표 키로 옮겨 다닙니다. 그래서 카드가 셋이어도 Tab은 그룹을 한 번에 지나갑니다.",
        en: "One card in the group is in the tab order and the arrow keys move between the rest, so a group of three takes one Tab to pass.",
      },
      {
        ko: "테두리가 brand로 바뀌는 것과 라디오 표시가 채워지는 것을 함께 써서 선택을 색만으로 알리지 않습니다. 배지도 색만으로 의미를 전하지 않도록 문구를 함께 적습니다.",
        en: "The brand border and the filled mark show selection together, so it never rests on color alone. A badge likewise carries text rather than relying on its tint.",
      },
      {
        ko: "비활성 카드는 흐려지기만 하므로 왜 고를 수 없는지 화면의 설명으로 남깁니다. 스크린 리더는 그 카드를 건너뛰지 않고 비활성 라디오로 읽습니다.",
        en: "A disabled card only fades, so the reason has to live in its visible description. A screen reader still meets it, announced as a disabled radio.",
      },
    ],
    keyboard: [
      {
        keys: ["ArrowDown", "ArrowRight"],
        action: { ko: "그룹 안에서 다음 카드로 선택을 옮깁니다.", en: "Moves the selection to the next card in the group." },
      },
      {
        keys: ["ArrowUp", "ArrowLeft"],
        action: { ko: "이전 카드로 선택을 옮깁니다.", en: "Moves the selection to the previous card." },
      },
      {
        keys: ["Space"],
        action: { ko: "포커스가 놓인 카드를 선택합니다.", en: "Selects the focused card." },
      },
      {
        keys: ["Tab"],
        action: { ko: "그룹 전체를 지나 다음 요소로 이동합니다.", en: "Passes the whole group to the next control." },
      },
    ],
  },
};
