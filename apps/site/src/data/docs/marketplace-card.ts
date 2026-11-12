/**
 * Reference doc for `MarketplaceCard`, written against
 * `packages/react/src/components/marketplace-card.tsx` and
 * `packages/flutter/lib/src/components/marketplace_card.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "marketplace-card",
  anatomy: {
    description: {
      ko: "MarketplaceCard는 마켓플레이스 항목 하나를 소개하는 카드입니다. 타일과 이름, 작성자, 설명, 기능 칩이 위에서 아래로 쌓이고 아래에 평점과 설치 버튼이 붙습니다.",
      en: "A MarketplaceCard introduces one marketplace item: a tile, name, author, description and capability chips stacked top to bottom, with a rating and an Install button in the footer.",
    },
    parts: [
      {
        name: "Card",
        slot: "div",
        description: {
          ko: "20px 모서리의 카드입니다. 안쪽 여백 16px, 요소 사이 12px이고 모서리에서 내용을 자릅니다.",
          en: "A card with 20px corners, 16px padding and 12px between parts, clipping content at the corners.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 카드 안쪽에 깔리는 유리 레이어입니다. 모든 자식은 그 위에 놓입니다.",
          en: "A glass layer inside the card when surface is glass. Every child sits above it.",
        },
      },
      {
        name: "Header",
        slot: "initials",
        description: {
          ko: "잉크색 타일과 이름, 작성자 줄입니다. 타일은 두 글자 약자를 담고 장식이라 aria-hidden입니다.",
          en: "The ink tile with the name and author. The tile holds two initials and is decorative, so it is aria-hidden.",
        },
      },
      {
        name: "Description",
        slot: "description",
        description: {
          ko: "카드 본문 문단입니다. 길이 제한 없이 여러 줄로 접힙니다.",
          en: "The body paragraph. It wraps over as many lines as it needs.",
        },
      },
      {
        name: "Chips",
        slot: "chips",
        description: {
          ko: "기능을 나타내는 회색 알약입니다. 칩마다 12px 아이콘을 하나 붙일 수 있습니다.",
          en: "Muted capability pills, each with an optional 12px icon.",
        },
      },
      {
        name: "Footer",
        slot: "score",
        description: {
          ko: "위쪽 1px 구분선으로 나뉜 아래 줄입니다. 평점과 설치 수가 왼쪽에, 설치 버튼이 오른쪽에 놓입니다.",
          en: "The bottom row, separated by a 1px top border: the rating and install count on the left, the Install button on the right.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "카드의 바탕 재질입니다. solid는 불투명한 표면에 기본 테두리를 쓰고, glass는 두꺼운 유리로 그립니다.",
        en: "The card's material. Solid is an opaque surface with a default border; glass draws the thick glass.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "마켓 목록처럼 불투명한 면에 놓을 때 씁니다. 기본값입니다.",
            en: "For an opaque page such as a marketplace grid. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위에 떠 있는 카드에 씁니다.",
            en: "For a card floating over imagery or a glass panel.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "onInstall",
      title: { ko: "onInstall", en: "onInstall" },
      description: {
        ko: "설치 버튼을 그리고 누를 때 호출됩니다. 넘기지 않으면 버튼이 없고 아래 줄에는 평점만 남습니다.",
        en: "Renders the Install button and runs when it is pressed. Without it the footer has no button, only the rating.",
      },
      example: "cards",
    },
    {
      id: "installLabel",
      title: { ko: "installLabel", en: "installLabel" },
      description: {
        ko: "설치 버튼의 문구입니다. 기본값은 Install이고, 설치가 끝난 뒤 호출자가 Installed로 바꿔 상태를 보여 줄 수 있습니다.",
        en: "The Install button's text. It defaults to Install; after the install the caller can switch it to Installed.",
      },
      example: "cards",
    },
    {
      id: "score",
      title: { ko: "score", en: "score" },
      description: {
        ko: "별 뒤에 붙는 평점 값입니다. 넘기지 않으면 별도 그리지 않습니다.",
        en: "The rating after a filled star. Without it the star is not drawn.",
      },
      example: "rating",
    },
    {
      id: "installs",
      title: { ko: "installs", en: "installs" },
      description: {
        ko: "설치 수 캡션입니다. score가 함께 있으면 가운뎃점으로 나누고, 없으면 캡션만 남습니다.",
        en: "The install-count caption. With score a middle dot separates the two; without it the caption stands alone.",
      },
      example: "rating",
    },
    {
      id: "chips",
      title: { ko: "chips", en: "chips" },
      description: {
        ko: "기능 칩의 배열입니다. 칩마다 id, label, 선택적인 icon을 받고 id가 React 키가 됩니다.",
        en: "The capability chips. Each takes an id, a label and an optional icon; the id is the React key.",
      },
      example: "cards",
    },
    {
      id: "author",
      title: { ko: "author", en: "author" },
      description: {
        ko: "이름 아래 게시자 줄입니다. caption 색으로 그려지고 길면 말줄임표로 잘립니다.",
        en: "The publisher line under the name, drawn in caption color and truncated when long.",
      },
      example: "cards",
    },
  ],
  guidelines: [
    {
      id: "install-goal",
      title: { ko: "목표는 설치 하나", en: "One goal: install" },
      body: {
        ko: "카드의 주 동작은 설치입니다. 카드 안에 두 번째 주요 버튼을 넣지 않고, 자세히 보기는 카드 자체나 별도 화면으로 미룹니다.",
        en: "The card's job is the install. Do not add a second primary button inside it; leave more detail to the card itself or another screen.",
      },
      do: {
        ko: "아래 줄에 Install 버튼 하나를 둡니다.",
        en: "Keep one Install button in the footer.",
      },
      dont: {
        ko: "Install 옆에 Try now를 함께 두지 않습니다.",
        en: "Do not put Try now next to Install.",
      },
      example: "cards",
    },
    {
      id: "rating-optional",
      title: { ko: "평점은 근거가 있을 때만", en: "Rate only what was rated" },
      body: {
        ko: "score와 installs는 각각 따로 넘길 수 있고 없으면 그려지지 않습니다. 평점이 없는 항목에 숫자를 만들어 넣지 말고 0으로 채우지도 않습니다.",
        en: "score and installs are independent and each is skipped when absent. Do not invent a number for an unrated item, and do not fill it with zero.",
      },
      example: "rating",
    },
    {
      id: "description-length",
      title: { ko: "설명은 두세 문장", en: "Two or three sentences" },
      body: {
        ko: "설명은 카드 높이를 정합니다. 같은 격자에 놓인 카드들이 들쭉날쭉해지지 않도록 두세 문장으로 맞추고, 설치 이유를 첫 문장에 씁니다.",
        en: "The description sets the card height. Keep it to two or three sentences so a grid stays even, and put the reason to install in the first one.",
      },
      example: "cards",
    },
    {
      id: "glass-in-grid",
      title: { ko: "glass는 배경 위에서만", en: "Glass over a backdrop" },
      body: {
        ko: "glass는 카드가 이미지나 유리 패널 위에 떠 있을 때만 씁니다. 불투명한 목록 안에서는 유리 바탕이 사라져 solid와 같아집니다.",
        en: "Use glass only where the card floats over imagery or a glass panel. Inside an opaque list the fill disappears and it reads as solid.",
      },
      example: "glass",
    },
  ],
  specification: [
    {
      id: "card",
      title: { ko: "카드", en: "Card" },
      rows: [
        { state: "solid", slot: "Card", property: "radius", value: "rounded-xl" },
        { state: "solid", slot: "Card", property: "padding", value: "16px" },
        { state: "solid", slot: "Card", property: "gap", value: "12px" },
        { state: "solid", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Card", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Card", property: "background layer", value: "LiquidGlass" },
        { state: "all", slot: "Card", property: "overflow", value: "overflow-clip" },
      ],
    },
    {
      id: "content",
      title: { ko: "내용", en: "Content" },
      rows: [
        { state: "all", slot: "Header", property: "gap", value: "12px" },
        { state: "all", slot: "Tile", property: "size", value: "40px" },
        { state: "all", slot: "Tile", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Tile", property: "background", value: "bg-neutral-900" },
        { state: "all", slot: "Tile", property: "text color", value: "text-neutral-50" },
        { state: "all", slot: "Tile", property: "font", value: "text-label-md" },
        { state: "all", slot: "Name", property: "font", value: "text-label-md" },
        { state: "all", slot: "Name", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Author", property: "font", value: "text-caption" },
        { state: "all", slot: "Author", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Description", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Chip", property: "height", value: "22px" },
        { state: "all", slot: "Chip", property: "padding", value: "0 8px" },
        { state: "all", slot: "Chip", property: "gap", value: "4px" },
        { state: "all", slot: "Chip", property: "background", value: "bg-overlay-ink-6" },
        { state: "all", slot: "Chip", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Chip", property: "icon size", value: "12px" },
      ],
    },
    {
      id: "footer",
      title: { ko: "아래 줄", en: "Footer" },
      rows: [
        { state: "all", slot: "Footer", property: "border", value: "1px border-border-default" },
        { state: "all", slot: "Footer", property: "padding", value: "12px 0 0" },
        { state: "all", slot: "Footer", property: "gap", value: "6px" },
        { state: "score", slot: "Star", property: "size", value: "14px" },
        { state: "score", slot: "Star", property: "color", value: "text-mascot-gold" },
        { state: "score", slot: "Score", property: "font", value: "text-label-sm" },
        { state: "score", slot: "Score", property: "text color", value: "text-text-primary" },
        { state: "score and installs", slot: "Separator", property: "text color", value: "text-text-placeholder" },
        { state: "installs", slot: "Installs", property: "font", value: "text-caption" },
        { state: "installs", slot: "Installs", property: "text color", value: "text-text-secondary" },
        { state: "install", slot: "Install", property: "variant", value: "solid" },
        { state: "install", slot: "Install", property: "size", value: "sm" },
      ],
    },
  ],
  examples: [
    {
      id: "cards",
      title: { ko: "카드 격자", en: "A grid of cards" },
      description: {
        ko: "평점, 설치 수, 설치 버튼을 갖춘 카드 두 개입니다. 버튼 문구를 Installed로 바꿔 설치 상태를 보여 줍니다.",
        en: "Two cards with a rating, install count and Install button. The label switches to Installed to show the result.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 카드", en: "Glass cards" },
      description: {
        ko: "같은 카드를 배경 위 두꺼운 유리로 그렸습니다. 모든 자식이 유리 위에 놓입니다.",
        en: "The same cards as thick glass over a backdrop, with every child above the glass.",
      },
    },
    {
      id: "rating",
      title: { ko: "평점 조합", en: "Rating combinations" },
      description: {
        ko: "평점과 설치 수를 각각 따로 넘긴 카드와 둘 다 넘긴 카드를 나란히 두었습니다.",
        en: "Cards with only a score, only a count, and both, side by side.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "타일은 aria-hidden입니다. 항목 이름은 옆 텍스트가 전달합니다.",
        en: "The tile is aria-hidden; the name text beside it carries the identity.",
      },
      {
        ko: "평점의 별은 aria-hidden이고 값은 옆 숫자가 읽힙니다. 숫자만으로는 무엇의 값인지 모호하므로 description이나 바깥 맥락이 평점임을 밝혀야 합니다.",
        en: "The star is aria-hidden and the number beside it is what gets read. A bare number is ambiguous, so the description or surrounding context has to say it is a rating.",
      },
      {
        ko: "설치 버튼은 문구로 이름이 붙습니다. 설치가 끝나 문구를 Installed로 바꿀 때는 disabled 처리나 상태 안내를 함께 주어 다시 누를 수 없게 합니다.",
        en: "The Install button is named by its label. When it changes to Installed, make the finished state unrepeatable with a disabled state or an announcement.",
      },
      {
        ko: "별도의 가운뎃점은 aria-hidden이라 낭독되지 않습니다. 화면에서만 두 값을 나눕니다.",
        en: "The middle dot is aria-hidden and never read; it separates the two values visually only.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "설치 버튼으로 포커스를 옮깁니다. onInstall이 없으면 건너뜁니다.", en: "Moves focus to the Install button, skipped when there is no onInstall." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "설치를 실행합니다.", en: "Runs the install." },
      },
    ],
  },
};
