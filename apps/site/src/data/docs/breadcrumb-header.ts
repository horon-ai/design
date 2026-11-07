/**
 * Reference doc for `BreadcrumbHeader`, written against
 * `packages/react/src/components/breadcrumb-header.tsx` and
 * `packages/flutter/lib/src/components/breadcrumb_header.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "breadcrumb-header",
  anatomy: {
    description: {
      ko: "BreadcrumbHeader는 경로와 검색·더보기 버튼을 한 줄에 담은 52px 알약 머리말입니다. 경로는 왼쪽에서 남는 폭을 모두 쓰고 마지막 단계만 잘립니다.",
      en: "A 52px pill header holding a crumb trail with search and more buttons in one row. The trail takes the width the buttons leave and only the last crumb truncates.",
    },
    parts: [
      {
        name: "Header",
        slot: "header",
        description: {
          ko: "머리말 표면입니다. 높이 52px에 완전히 둥근 모서리, 8px 여백을 둡니다.",
          en: "The header surface: 52px tall, fully rounded, with 8px padding.",
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
        name: "Trail",
        slot: "crumbs",
        description: {
          ko: "경로를 담는 nav와 순서 목록입니다. 넘칠 때 라벨을 자르지 않고 안쪽에서 가로로 스크롤합니다.",
          en: "The nav and ordered list holding the trail. When it overflows it scrolls sideways inside rather than truncating labels.",
        },
      },
      {
        name: "Crumb",
        slot: "BreadcrumbItem",
        description: {
          ko: "단계 하나입니다. 마지막 단계는 현재 페이지로 읽히고 그 앞 단계만 링크가 됩니다.",
          en: "One step. The last reads as the current page and only the steps before it become links.",
        },
      },
      {
        name: "Search",
        slot: "onSearch",
        description: {
          ko: "36px 검색 아이콘 버튼입니다. onSearch를 넘길 때만 그려집니다.",
          en: "A 36px search IconButton, drawn only when onSearch is passed.",
        },
      },
      {
        name: "More",
        slot: "onMore",
        description: {
          ko: "36px 더보기 아이콘 버튼입니다. onMore를 넘길 때만 그려집니다.",
          en: "A 36px more IconButton, drawn only when onMore is passed.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "머리말의 바탕입니다. 두 값 모두 52px 높이와 완전히 둥근 모서리를 공유합니다.",
        en: "The header's ground. Both values share the 52px height and the fully rounded corner.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 표면과 기본 테두리를 씁니다. 기본값이고 페이지 위에 놓을 때 맞습니다.",
            en: "The opaque surface with a default border. The default, for placement on the page.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "regular glass와 유리 레이어를 씁니다. 이미지나 유리 패널 위에 머리말을 겹칠 때 씁니다.",
            en: "The regular glass with its layer, for a header layered over imagery or a glass panel.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "crumbs",
      title: { ko: "crumbs", en: "crumbs" },
      description: {
        ko: "순서대로 놓이는 단계 목록입니다. 마지막 항목이 현재 페이지가 되고, 그 앞 항목의 href만 링크로 쓰입니다.",
        en: "The steps in order. The last entry becomes the current page, and only the href of the entries before it is used as a link.",
      },
      example: "trail",
    },
    {
      id: "onSearch",
      title: { ko: "onSearch", en: "onSearch" },
      description: {
        ko: "넘기면 오른쪽에 검색 버튼이 생깁니다. 넘기지 않으면 버튼이 아예 그려지지 않아 자리를 비워 두지 않습니다.",
        en: "Pass it and a search button appears on the right. Leave it out and no button is drawn, so no slot is left empty.",
      },
      example: "actions",
    },
    {
      id: "onMore",
      title: { ko: "onMore", en: "onMore" },
      description: {
        ko: "넘기면 오른쪽에 더보기 버튼이 생깁니다. 검색과 함께 넘기면 검색 다음 자리에 놓입니다.",
        en: "Pass it and a more button appears on the right, after search when both are passed.",
      },
      example: "actions",
    },
  ],
  guidelines: [
    {
      id: "path-plus-actions",
      title: { ko: "경로와 동작을 함께", en: "Path plus actions" },
      body: {
        ko: "BreadcrumbHeader는 경로와 검색·더보기를 한 줄에 담을 때 씁니다. 경로만 필요하면 Breadcrumb를, 제목과 필터만 필요하면 PageHeader를 씁니다.",
        en: "Use BreadcrumbHeader when a path and search or more have to share one row. With only a path use Breadcrumb; with only a title and filters use PageHeader.",
      },
      do: {
        ko: "문서 화면 위에 경로와 더보기를 함께 둡니다.",
        en: "Put a path and a more button together above a document.",
      },
      dont: {
        ko: "같은 화면에 Breadcrumb과 BreadcrumbHeader를 겹쳐 두지 않습니다.",
        en: "Do not stack a Breadcrumb and a BreadcrumbHeader on one screen.",
      },
      example: "surfaces",
    },
    {
      id: "short-crumbs",
      title: { ko: "단계 이름은 짧게", en: "Keep crumb names short" },
      body: {
        ko: "경로는 자르지 않고 스크롤하며 마지막 단계만 잘립니다. 앞 단계 라벨이 길면 경로가 밀려나 보이지 않으므로 화면 이름이나 문서 이름만 적습니다.",
        en: "The trail scrolls rather than truncating and only the last crumb clips. A long earlier label pushes the rest out of view, so keep steps to the screen or document name.",
      },
      example: "trail",
    },
    {
      id: "buttons-on-demand",
      title: { ko: "동작 버튼은 필요할 때만", en: "Only the buttons you need" },
      body: {
        ko: "검색과 더보기는 핸들러를 넘길 때만 그려집니다. 읽기 전용 화면에서는 둘 다 빼고, 동작이 없는 버튼을 자리 채우기로 두지 않습니다.",
        en: "Search and more are drawn only when their handlers are passed. On a read-only screen drop both, and never place a button with nothing behind it to fill a slot.",
      },
      example: "actions",
    },
    {
      id: "glass-over-panels",
      title: { ko: "glass는 유리 면 위에서만", en: "Glass only over a glass surface" },
      body: {
        ko: "glass 머리말은 이미지나 유리 패널 위에 겹칠 때 씁니다. 불투명한 본문 위에서는 바탕이 배경색과 섞여 테두리 없이 머리말과 본문이 붙어 버립니다.",
        en: "A glass header belongs over imagery or a glass panel. On an opaque body its fill mixes with the background and, having no border, the header merges into the page.",
      },
      example: "surfaces",
    },
  ],
  specification: [
    {
      id: "header",
      title: { ko: "머리말", en: "Header" },
      rows: [
        { state: "any", slot: "Header", property: "height", value: "h-13" },
        { state: "any", slot: "Header", property: "radius", value: "rounded-full" },
        { state: "any", slot: "Header", property: "padding", value: "p-2" },
        { state: "any", slot: "Header", property: "gap", value: "gap-2" },
        { state: "solid", slot: "Header", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Header", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Header", property: "background", value: "bg-glass-regular" },
        { state: "glass", slot: "Header", property: "background layer", value: "LiquidGlass" },
        { state: "any", slot: "Trail", property: "gap", value: "gap-1.5" },
        { state: "any", slot: "Trail", property: "overflow", value: "overflow-x-auto" },
        { state: "any", slot: "Separator", property: "size", value: "size-3.5" },
        { state: "any", slot: "Crumb", property: "font", value: "text-label-md" },
        { state: "current", slot: "Crumb", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Crumb", property: "text color", value: "text-text-secondary" },
        { state: "any", slot: "Tile", property: "size", value: "size-5" },
        { state: "any", slot: "Button", property: "size", value: "size-9" },
        { state: "any", slot: "Button icon", property: "size", value: "size-4.5" },
      ],
    },
  ],
  examples: [
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "solid 머리말과 glass 머리말을 같은 경로로 놓았습니다. glass는 뒤에 보이는 면이 있어야 유리가 읽힙니다.",
        en: "The same trail on solid and on glass. The glass reads only where something sits behind it.",
      },
    },
    {
      id: "actions",
      title: { ko: "동작 버튼", en: "Action buttons" },
      description: {
        ko: "검색과 더보기를 모두 넣은 머리말, 검색만 넣은 머리말, 둘 다 뺀 머리말을 보여 줍니다.",
        en: "A header with both buttons, one with only search, and one with neither.",
      },
    },
    {
      id: "trail",
      title: { ko: "깊은 경로", en: "Deep trail" },
      description: {
        ko: "네 단계를 좁은 폭에 넣은 예입니다. 마지막 단계만 잘리고 앞 단계는 스크롤로 남습니다.",
        en: "Four steps in a narrow width. Only the last crumb clips; the earlier ones stay reachable by scrolling.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "경로는 aria-label이 Breadcrumb인 nav로 감싸이고, 마지막 단계는 aria-current가 page로 붙습니다. 단계 사이 케럿은 장식이라 읽히지 않습니다.",
        en: "The trail sits in a nav labelled Breadcrumb and its last step carries aria-current=\"page\". The carets between steps are decorative and never read.",
      },
      {
        ko: "검색과 더보기는 아이콘만 보이므로 searchLabel과 moreLabel이 접근 가능한 이름이 됩니다. 화면 언어로 넘깁니다.",
        en: "Search and more show icons only, so searchLabel and moreLabel are their accessible names. Pass them in the screen's language.",
      },
      {
        ko: "마지막 단계는 링크가 아니라 텍스트라 포커스를 받지 않습니다. 이동 가능한 앞 단계만 탭 순서에 들어갑니다.",
        en: "The last step is text rather than a link, so it takes no focus. Only the earlier steps that navigate are in the tab order.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "경로의 링크인 단계와 검색·더보기 버튼 사이로 포커스를 옮깁니다.",
          en: "Moves focus through the link steps and the search and more buttons.",
        },
      },
      {
        keys: ["Enter"],
        action: { ko: "포커스한 단계나 버튼을 실행합니다.", en: "Runs the focused step or button." },
      },
    ],
  },
};
