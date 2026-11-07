/**
 * Reference doc for `PageHeader`, written against
 * `packages/react/src/components/page-header.tsx` and
 * `packages/flutter/lib/src/components/page_header.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "page-header",
  anatomy: {
    description: {
      ko: "PageHeader는 화면 맨 위에서 뒤로 가기, 제목, 동작을 한 줄에 담고 그 아래에 필터 줄을 붙일 수 있는 머리말입니다. 모서리 28px의 표면 하나가 전체를 감쌉니다.",
      en: "A PageHeader holds back, title and actions in one row at the top of a screen, with an optional filter row underneath. One 28px-radius surface wraps the whole thing.",
    },
    parts: [
      {
        name: "Header",
        slot: "header",
        description: {
          ko: "머리말 표면입니다. solid는 불투명 표면과 테두리, glass는 유리 바탕과 유리 레이어를 씁니다.",
          en: "The header surface. Solid uses the opaque surface and a border; glass uses the glass fill and a glass layer.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 내용 뒤에 깔리는 유리 레이어입니다.",
          en: "The glass layer behind the content when surface is glass.",
        },
      },
      {
        name: "Back",
        slot: "onBack",
        description: {
          ko: "제목 앞의 40px 뒤로 가기 아이콘 버튼입니다. onBack을 넘길 때만 그려지고, 그때 제목의 왼쪽 여백이 줄어듭니다.",
          en: "The 40px back IconButton before the title. It appears only with onBack, and the title loses its left padding in exchange.",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "h1으로 렌더링되는 제목입니다. 한 줄로 유지되고 넘치면 말줄임표로 잘립니다.",
          en: "The title, rendered as the h1. It stays on one line and truncates with an ellipsis when it does not fit.",
        },
      },
      {
        name: "Actions",
        slot: "actions",
        description: {
          ko: "제목 오른쪽 끝의 40px 아이콘 버튼 자리입니다. 보통 검색이나 더보기를 하나만 둡니다.",
          en: "The 40px icon-button slot at the right end of the title row, normally one control such as search or more.",
        },
      },
      {
        name: "Filter row",
        slot: "children",
        description: {
          ko: "제목 줄 아래에 붙는 필터 줄입니다. 자식이 있으면 swap 이동과 함께 나타납니다.",
          en: "The filter row under the title row. It appears with the swap move when children are present.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "머리말의 바탕입니다. 두 값 모두 모서리 28px과 8px 안쪽 여백을 공유합니다.",
        en: "The header's ground. Both values share the 28px radius and 8px padding.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 표면과 기본 테두리를 씁니다. 기본값이고 본문 위에 놓을 때 맞습니다.",
            en: "The opaque surface with a default border. The default, for placement on a content surface.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "regular glass와 유리 레이어를 씁니다. 이미지나 떠 있는 크롬 위에 머리말을 겹칠 때 씁니다.",
            en: "The regular glass with its layer, for a header layered over imagery or floating chrome.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "onBack",
      title: { ko: "onBack", en: "onBack" },
      description: {
        ko: "넘기면 뒤로 가기 버튼이 생기고 누를 때 이 함수를 부릅니다. 넘기지 않으면 버튼이 아예 없고 제목이 왼쪽 여백을 가집니다.",
        en: "Pass it and a back button appears, calling it on press. Leave it out and the button is absent and the title takes the left padding instead.",
      },
      example: "back",
    },
    {
      id: "backLabel",
      title: { ko: "backLabel", en: "backLabel" },
      description: {
        ko: "뒤로 가기 버튼의 접근 가능한 이름입니다. 기본값은 Back이고, 화면 언어가 다르면 그 언어로 넘깁니다.",
        en: "The accessible name of the back button. It defaults to Back; pass it in the screen's language otherwise.",
      },
      example: "back",
    },
    {
      id: "actions",
      title: { ko: "actions", en: "actions" },
      description: {
        ko: "제목 줄 오른쪽에 놓는 아이콘 버튼입니다. 40px 높이에 맞춰지고 여러 개를 넘기면 순서대로 나란히 놓입니다.",
        en: "Icon buttons on the right of the title row. They fit the 40px row and stack side by side in the order given.",
      },
      example: "filters",
    },
  ],
  guidelines: [
    {
      id: "mobile-screen-header",
      title: { ko: "화면 머리말에는 이 컴포넌트", en: "This is the screen header" },
      body: {
        ko: "PageHeader는 화면 하나의 머리말입니다. 봇 대화처럼 아바타와 상태를 함께 보여 줘야 하면 TopBar를, 경로와 검색·더보기가 한 줄에 필요하면 BreadcrumbHeader를 씁니다.",
        en: "A PageHeader is one screen's header. When the row needs an avatar and a live status, use TopBar; when it needs a path with search and more in one line, use BreadcrumbHeader.",
      },
      do: {
        ko: "Routines 화면 위에 PageHeader를 둡니다.",
        en: "Put a PageHeader on the Routines screen.",
      },
      dont: {
        ko: "같은 화면에서 PageHeader와 TopBar를 겹쳐 두지 않습니다.",
        en: "Do not stack a PageHeader and a TopBar on one screen.",
      },
      example: "surfaces",
    },
    {
      id: "one-filter-row",
      title: { ko: "필터는 한 줄만", en: "One filter row" },
      body: {
        ko: "children 자리에는 SegmentedControl 같은 필터를 한 줄만 둡니다. 필터가 두 줄로 늘어나면 머리말이 화면의 절반을 차지해 본문이 밀려납니다.",
        en: "The children slot takes one row of filters, such as a SegmentedControl. A second row of filters makes the header eat half the screen and push the content down.",
      },
      do: {
        ko: "상태 필터 하나를 children으로 넘깁니다.",
        en: "Pass one status filter as children.",
      },
      dont: {
        ko: "필터 두 줄을 children에 넣지 않습니다.",
        en: "Do not put two filter rows in children.",
      },
      example: "filters",
    },
    {
      id: "short-title",
      title: { ko: "제목은 한 줄로 읽히게", en: "Keep the title one line" },
      body: {
        ko: "제목은 한 줄로 유지되고 넘치면 잘립니다. 화면 이름을 짧은 명사로 적고, 설명이 필요하면 본문 첫 문단에 둡니다. 뒤로 가기 버튼을 빼면 제목이 그만큼 넓어집니다.",
        en: "The title stays one line and truncates when it does not fit. Name the screen with a short noun and put any explanation in the first paragraph of the body. Dropping the back button buys the title its 8px back.",
      },
      example: "back",
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 겹칠 때만", en: "Glass only when layered" },
      body: {
        ko: "glass 머리말은 뒤에 보이는 면이 있어야 유리가 읽힙니다. 본문 위에 그대로 두면 테두리가 없어 머리말이 본문과 붙어 버립니다.",
        en: "A glass header needs something behind it for the glass to read. Left on a plain page it has no border, so the header merges into the body.",
      },
      example: "surfaces",
    },
  ],
  specification: [
    {
      id: "header",
      title: { ko: "머리말", en: "Header" },
      note: {
        ko: "제목 줄은 40px이고, 제목과 동작 아이콘은 같은 줄 높이를 씁니다.",
        en: "The title row is 40px, and the title and action icons share that height.",
      },
      rows: [
        { state: "any", slot: "Header", property: "radius", value: "rounded-[28px]" },
        { state: "any", slot: "Header", property: "padding", value: "p-2" },
        { state: "any", slot: "Header", property: "gap", value: "gap-1.5" },
        { state: "solid", slot: "Header", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Header", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Header", property: "background", value: "bg-glass-regular" },
        { state: "glass", slot: "Header", property: "background layer", value: "LiquidGlass" },
        { state: "any", slot: "Title row", property: "height", value: "h-10" },
        { state: "any", slot: "Title row", property: "gap", value: "gap-2" },
        { state: "any", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "any", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "no back", slot: "Title", property: "padding", value: "pl-2" },
        { state: "any", slot: "Back", property: "size", value: "40px" },
        { state: "any", slot: "Filter row", property: "motion", value: "animate-swap-move" },
      ],
    },
  ],
  examples: [
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "solid 머리말과 glass 머리말을 나란히 놓았습니다. glass는 배경 위에 겹칠 때 유리가 보입니다.",
        en: "A solid header next to a glass one. The glass reads only where it is layered over a backdrop.",
      },
    },
    {
      id: "filters",
      title: { ko: "필터 줄", en: "Filter row" },
      description: {
        ko: "제목 줄 아래에 상태 필터를 붙이고 검색 버튼을 오른쪽에 둔 예입니다.",
        en: "A status filter under the title row with a search button at the right.",
      },
    },
    {
      id: "back",
      title: { ko: "뒤로 가기와 긴 제목", en: "Back and a long title" },
      description: {
        ko: "뒤로 가기 버튼이 있는 머리말과 없는 머리말을 함께 두었습니다. 긴 제목은 말줄임표로 잘립니다.",
        en: "A header with the back button and one without. The long title truncates with an ellipsis.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "제목은 페이지의 h1입니다. 화면마다 PageHeader를 하나만 두어 문서에 h1이 하나가 되게 합니다.",
        en: "The title is the page's h1, so keep one PageHeader per screen and the document keeps one h1.",
      },
      {
        ko: "뒤로 가기와 동작 버튼은 아이콘만 보이므로 label이 접근 가능한 이름이 됩니다. backLabel을 화면 언어로 넘기고, actions로 넘기는 IconButton에도 label을 붙입니다.",
        en: "The back and action buttons show icons only, so their label is the accessible name. Pass backLabel in the screen's language and give every IconButton in actions a label too.",
      },
      {
        ko: "필터 줄은 머리말의 자식이지만 제목과 별개의 컨트롤이므로, 필터 묶음 자체에 aria-label을 붙여 무엇을 거르는지 밝힙니다.",
        en: "The filter row is a child of the header but a separate control, so name the filter group with aria-label to say what it filters.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "뒤로 가기, 동작 버튼, 필터 순서로 포커스를 옮깁니다.",
          en: "Moves focus through back, the action buttons and the filter in that order.",
        },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스한 버튼을 실행합니다.", en: "Runs the focused button." },
      },
    ],
  },
};
