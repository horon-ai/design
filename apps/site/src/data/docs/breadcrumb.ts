/**
 * Reference doc for `Breadcrumb`, written against
 * `packages/react/src/components/breadcrumb.tsx` and
 * `packages/flutter/lib/src/components/breadcrumb.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "breadcrumb",
  anatomy: {
    description: {
      ko: "Breadcrumb은 워크스페이스에서 지금 보는 화면까지의 경로를 한 줄로 보여 줍니다. 이동할 수 있는 앞 단계는 링크로, 마지막 단계는 현재 페이지로 읽힙니다.",
      en: "A Breadcrumb shows the path from the workspace down to the screen in view in one row. Earlier steps read as links and the last one reads as the current page.",
    },
    parts: [
      {
        name: "Navigation",
        slot: "nav",
        description: {
          ko: "경로를 담는 nav 요소입니다. surface를 주면 그 표면 안에 경로가 들어가고, 생략하면 바탕 없이 경로만 놓입니다.",
          en: "The nav element holding the trail. With surface the trail sits inside that surface; without it the trail stands bare.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 트레이 안쪽에 깔리는 유리 레이어입니다.",
          en: "The glass layer inside the tray when surface is glass.",
        },
      },
      {
        name: "Trail",
        slot: "ol",
        description: {
          ko: "단계를 순서대로 담는 목록입니다. 트레이보다 넓어지면 라벨을 자르지 않고 안쪽에서 가로로 스크롤합니다.",
          en: "The ordered list of steps. When it outgrows the tray it scrolls sideways inside instead of truncating labels.",
        },
      },
      {
        name: "Separator",
        slot: "CaretRight",
        description: {
          ko: "단계 사이에 들어가는 14px 케럿입니다. 장식이라 aria-hidden으로 읽히지 않습니다.",
          en: "The 14px caret between steps. It is decorative and hidden from assistive tech.",
        },
      },
      {
        name: "Item",
        slot: "BreadcrumbItem",
        description: {
          ko: "단계 하나입니다. href가 있으면 a 요소, 없거나 current면 span으로 렌더링됩니다.",
          en: "One step. It renders as an a element with href, otherwise as a span, including when current is set.",
        },
      },
      {
        name: "Tile",
        slot: "tile",
        description: {
          ko: "단계 앞에 붙는 20px 잉크 타일입니다. 워크스페이스 이니셜처럼 경로의 출발점을 표시합니다.",
          en: "A 20px ink tile before the step, marking where the trail starts, such as the workspace initial.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "경로를 담는 트레이의 재질입니다. 생략하면 경로만 놓이고 바탕이 생기지 않습니다.",
        en: "The material of the tray around the trail. Leave it out and the trail stands alone with no fill.",
      },
      values: [
        {
          name: "glass",
          description: {
            ko: "regular glass 트레이에 경로를 담습니다. 이미지나 떠 있는 크롬 위에 놓을 때 씁니다.",
            en: "Sets the trail in a regular glass tray, for placement over imagery or floating chrome.",
          },
        },
        {
          name: "solid",
          description: {
            ko: "불투명한 표면 트레이에 기본 테두리를 두릅니다. 본문 위에 놓을 때 씁니다.",
            en: "An opaque surface tray with a default border, for placement on a content surface.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "current",
      title: { ko: "current", en: "current" },
      description: {
        ko: "지금 보고 있는 페이지를 표시합니다. 글자가 primary 색으로 바뀌고 aria-current가 page로 붙으며, href가 있어도 링크가 아니라 텍스트로 남습니다.",
        en: "Marks the page in view: the text turns primary, aria-current becomes page, and the crumb stays text even when href is set.",
      },
      example: "trail",
    },
    {
      id: "tile",
      title: { ko: "tile", en: "tile" },
      description: {
        ko: "단계 앞에 놓는 20px 잉크 타일입니다. 이니셜을 넣어 워크스페이스처럼 경로의 출발점을 표시하고, 보통 첫 단계에만 씁니다.",
        en: "A 20px ink tile before the step. Put the initial in it to mark where the trail starts, such as the workspace, and normally only on the first step.",
      },
      example: "tile",
    },
  ],
  guidelines: [
    {
      id: "not-navigation-menu",
      title: { ko: "경로일 때만", en: "For a path, not a menu" },
      body: {
        ko: "Breadcrumb은 계층이 있는 경로를 보여 줄 때 씁니다. 같은 층위의 화면을 오갈 때는 Tabs나 FilterBar를 쓰고, 경로가 두 단계뿐이면 굳이 경로를 그리지 않고 제목만 둡니다.",
        en: "Use a Breadcrumb to show a hierarchical path. To move between screens on one level use Tabs or FilterBar, and with only two shallow levels a plain title is enough.",
      },
      do: {
        ko: "Horon HQ, Q4 hiring, Chief of staff 순서로 경로를 적습니다.",
        en: "Write the trail Horon HQ, Q4 hiring, Chief of staff.",
      },
      dont: {
        ko: "설정의 하위 탭을 Breadcrumb으로 만들지 않습니다.",
        en: "Do not turn a settings sub-tab row into a Breadcrumb.",
      },
      example: "trail",
    },
    {
      id: "last-is-text",
      title: { ko: "마지막은 현재 페이지", en: "The last crumb is the current page" },
      body: {
        ko: "마지막 단계에는 href를 주지 않고 current만 줍니다. 현재 페이지를 링크로 두면 눌러도 아무 일이 없거나 같은 화면을 다시 열게 됩니다.",
        en: "Give the last step current and no href. A link to the page already open either does nothing or reloads the same screen.",
      },
      do: {
        ko: "마지막 단계를 <BreadcrumbItem current>Chief of staff</BreadcrumbItem>로 둡니다.",
        en: "End with <BreadcrumbItem current>Chief of staff</BreadcrumbItem>.",
      },
      dont: {
        ko: "마지막 단계에도 href와 current를 함께 주지 않습니다.",
        en: "Do not pass both href and current on the last step.",
      },
      example: "surfaces",
    },
    {
      id: "short-labels",
      title: { ko: "라벨은 짧은 이름으로", en: "Keep labels to short names" },
      body: {
        ko: "단계 라벨은 화면 이름이나 문서 이름처럼 짧은 명사로 적습니다. 경로는 자르지 않고 스크롤하기 때문에 긴 라벨은 트레이 밖으로 밀려나 읽는 사람이 직접 넘겨야 합니다.",
        en: "Label a step with the short name of the screen or document. The trail scrolls rather than truncating, so a long label pushes the rest out of the tray and the reader has to scroll.",
      },
      example: "tile",
    },
  ],
  specification: [
    {
      id: "tray",
      title: { ko: "트레이와 경로", en: "Tray and trail" },
      rows: [
        { state: "any", slot: "Navigation", property: "radius", value: "rounded-xl" },
        { state: "any", slot: "Navigation", property: "padding", value: "px-4 py-3.5" },
        { state: "solid", slot: "Navigation", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Navigation", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Navigation", property: "background", value: "bg-glass-regular" },
        { state: "glass", slot: "Navigation", property: "background layer", value: "LiquidGlass" },
        { state: "any", slot: "Trail", property: "gap", value: "gap-1.5" },
        { state: "any", slot: "Trail", property: "overflow", value: "overflow-x-auto" },
        { state: "any", slot: "Separator", property: "size", value: "size-3.5" },
        { state: "any", slot: "Separator", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "crumb",
      title: { ko: "단계", en: "Crumb" },
      rows: [
        { state: "default", slot: "Item", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Item", property: "text color", value: "text-text-primary" },
        { state: "focus-visible", slot: "Item", property: "outline", value: "2px outline-text-brand" },
        { state: "current", slot: "Item", property: "text color", value: "text-text-primary" },
        { state: "any", slot: "Item", property: "font", value: "text-label-md" },
        { state: "any", slot: "Item", property: "radius", value: "rounded-sm" },
        { state: "any", slot: "Item", property: "padding", value: "py-1 pr-1.5 pl-1.5" },
        { state: "any", slot: "Item", property: "gap", value: "gap-1.5" },
        { state: "any", slot: "Item", property: "motion", value: "motion-colors" },
        { state: "any", slot: "Tile", property: "size", value: "size-5" },
        { state: "any", slot: "Tile", property: "background", value: "bg-interactive-primary" },
        { state: "any", slot: "Tile", property: "text color", value: "text-text-inverse" },
        { state: "any", slot: "Tile", property: "radius", value: "rounded-xs" },
        { state: "any", slot: "Tile", property: "font", value: "text-label-sm" },
      ],
    },
  ],
  examples: [
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "solid 트레이와 glass 트레이를 나란히 놓았습니다. glass는 배경 위에서만 트레이가 보입니다.",
        en: "A solid tray next to a glass tray. The glass tray only shows its fill over a backdrop.",
      },
    },
    {
      id: "tile",
      title: { ko: "워크스페이스 타일", en: "Workspace tile" },
      description: {
        ko: "첫 단계에 이니셜 타일을 붙인 경로입니다. 경로의 출발점이 한눈에 보입니다.",
        en: "A trail whose first step carries the initial tile, so where it starts is visible at a glance.",
      },
    },
    {
      id: "trail",
      title: { ko: "긴 경로", en: "Long trail" },
      description: {
        ko: "좁은 폭에 다섯 단계를 넣은 예입니다. 라벨은 잘리지 않고 트레이 안에서 가로로 스크롤합니다.",
        en: "Five steps in a narrow box. Labels are not truncated; the trail scrolls sideways inside the tray.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Breadcrumb Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/" },
    notes: [
      {
        ko: "경로는 nav 랜드마크이고 aria-label이 붙습니다. 값이 없으면 Breadcrumb이 들어가므로 화면에 다른 nav가 있으면 구분되는 이름을 넘깁니다.",
        en: "The trail is a nav landmark with an aria-label that falls back to Breadcrumb, so pass a distinct name when the screen has other navs.",
      },
      {
        ko: "현재 페이지는 aria-current가 page로 표시되고 단계 사이의 케럿은 장식이라 읽히지 않습니다. 케럿을 글자로 대신하지 않습니다.",
        en: "The current page is marked with aria-current=\"page\" and the carets between steps are decorative, so they are never read out. Do not replace a caret with a character.",
      },
      {
        ko: "href가 없는 단계는 링크가 아니라 텍스트입니다. 눌러서 이동할 수 있는 단계에만 href를 주세요.",
        en: "A step without href is text, not a link. Pass href only where a step should actually navigate.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "링크인 단계 사이로 포커스를 옮깁니다. 현재 페이지 단계는 포커스를 받지 않습니다.",
          en: "Moves focus between the steps that are links; the current page step takes no focus.",
        },
      },
      {
        keys: ["Enter"],
        action: { ko: "포커스한 단계의 링크를 엽니다.", en: "Opens the focused step's link." },
      },
    ],
  },
};
