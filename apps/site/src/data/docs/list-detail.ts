/**
 * Reference doc for `ListDetail` and its parts, written against
 * `packages/react/src/components/list-detail.tsx` and
 * `packages/flutter/lib/src/components/list_detail.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "list-detail",
  anatomy: {
    description: {
      ko: "ListDetail은 왼쪽 목록과 오른쪽 상세를 나란히 놓은 두 단 패널입니다. 목록에서 행을 고르면 상세가 그 항목으로 바뀌고, 좁은 화면에서는 두 단이 위아래로 쌓입니다.",
      en: "ListDetail is a two-pane panel: a list on the left and detail on the right. Picking a row swaps the detail, and on narrow screens the panes stack.",
    },
    parts: [
      {
        name: "Shell",
        slot: "div",
        description: {
          ko: "두 단을 감싸는 16px 모서리의 패널입니다. 최대 폭 806px이고 sm 아래에서는 세로로 쌓입니다.",
          en: "The 16px shell around both panes, up to 806px wide, stacking vertically below sm.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 셸 안쪽에 깔리는 유리 레이어입니다. 두 단 모두 그 위에 놓입니다.",
          en: "A glass layer inside the shell when surface is glass. Both panes sit above it.",
        },
      },
      {
        name: "List",
        slot: "listbox",
        description: {
          ko: "왼쪽 목록입니다. role=listbox이고 행은 role=option 버튼입니다. 폭은 250px이고 그룹 사이에 12px 간격을 둡니다.",
          en: "The left list: role=listbox with role=option buttons, 250px wide, with 12px between groups.",
        },
      },
      {
        name: "Group",
        slot: "groups",
        description: {
          ko: "목록의 묶음입니다. label을 label-sm 세미볼드 캡션으로 위에 얹고 항목을 아래에 쌓습니다.",
          en: "A list group. Its label sits above the rows in label-sm semibold caption text.",
        },
      },
      {
        name: "Option",
        slot: "items",
        description: {
          ko: "고를 수 있는 행입니다. 제목은 모노로 그리고 meta가 있으면 아래에 보조 줄로 붙입니다.",
          en: "A selectable row: a mono title with an optional meta line under it.",
        },
      },
      {
        name: "Detail pane",
        slot: "children",
        description: {
          ko: "고른 항목의 상세입니다. children이 항목 하나를 받아 렌더링하고, 선택이 바뀔 때마다 짧게 떠오르며 교체됩니다.",
          en: "The detail for the selected item. children renders one item, and the pane rises briefly each time the selection changes.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "셸의 바탕 재질입니다. solid는 불투명한 표면에 기본 테두리를 쓰고, glass는 두꺼운 유리로 그립니다.",
        en: "The shell's material. Solid is an opaque surface with a default border; glass draws the thick glass.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "목록이 bg-bg-inset으로 한 단 들어가 보이는 기본 재질입니다.",
            en: "The default, where the list reads as an inset surface with bg-bg-inset.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위에 놓인 패널에 씁니다. 목록은 바탕색을 두지 않고 유리 위에 바로 놓입니다.",
            en: "For a panel over imagery or a glass panel. The list drops its fill and sits directly on the glass.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "defaultValue",
      title: { ko: "defaultValue", en: "defaultValue" },
      description: {
        ko: "처음 선택할 항목의 id입니다. 넘기지 않으면 첫 그룹의 첫 항목이 선택됩니다.",
        en: "The id selected on first render. Without it the first item of the first group is selected.",
      },
      example: "overview",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "선택을 직접 들고 있을 때 쓰는 제어 값입니다. 네이티브 입력처럼 value를 넘기면 호출자가 선택을 소유합니다.",
        en: "The controlled selection. Passing value hands ownership of the selection to the caller, as with a native input.",
      },
      example: "controlled",
    },
    {
      id: "onValueChange",
      title: { ko: "onValueChange", en: "onValueChange" },
      description: {
        ko: "행을 누를 때마다 새 id로 호출됩니다. 제어 여부와 무관하게 항상 호출됩니다.",
        en: "Called with the new id whenever a row is pressed, controlled or not.",
      },
      example: "controlled",
    },
    {
      id: "groups",
      title: { ko: "groups", en: "groups" },
      description: {
        ko: "목록의 그룹 배열입니다. 그룹마다 id, label, items를 받고, 평평한 순서가 선택의 기준이 됩니다.",
        en: "The list's groups. Each takes an id, a label and items; the flat order is what the selection resolves against.",
      },
      example: "overview",
    },
    {
      id: "children",
      title: { ko: "children", en: "children" },
      description: {
        ko: "고른 항목을 받아 상세를 렌더링하는 함수입니다. ListDetailHeader, ListDetailMeta 같은 조각을 조합해 채웁니다.",
        en: "A render function that receives the selected item and returns the detail. Compose it from pieces such as ListDetailHeader and ListDetailMeta.",
      },
      example: "overview",
    },
  ],
  guidelines: [
    {
      id: "flat-or-grouped",
      title: { ko: "그룹은 스캔을 돕습니다", en: "Groups help scanning" },
      body: {
        ko: "그룹은 같은 종류의 항목을 묶어 목록을 훑기 쉽게 합니다. 항목이 다섯 개 이하라면 그룹 하나로 두고, 성격이 다를 때만 나눕니다.",
        en: "Groups bundle like items so the list can be scanned. With five or fewer items keep one group and split only when the items differ in kind.",
      },
      example: "overview",
    },
    {
      id: "selection-ownership",
      title: { ko: "선택은 한쪽이 소유합니다", en: "One owner for the selection" },
      body: {
        ko: "value를 넘기면 선택은 호출자 몫이므로 onValueChange에서 값을 바꿔 돌려줘야 행이 따라갑니다. defaultValue만 쓰면 컴포넌트가 스스로 들고 있습니다.",
        en: "Passing value makes the selection the caller's: update it in onValueChange or the rows will not follow. With only defaultValue the component holds it.",
      },
      example: "controlled",
    },
    {
      id: "pane-content",
      title: { ko: "상세는 조각으로 채웁니다", en: "Build the detail from pieces" },
      body: {
        ko: "상세는 제목과 메타, 안내, 파일, 바닥 동작으로 이루어집니다. ListDetailHeader로 머리를 세우고 ListDetailFooter에 동작을 모으면 패널마다 같은 리듬이 유지됩니다.",
        en: "A detail is a header, meta, instructions, files and footer actions. Leading with ListDetailHeader and gathering actions in ListDetailFooter keeps the rhythm across panels.",
      },
      example: "overview",
    },
    {
      id: "narrow-stacking",
      title: { ko: "좁은 폭은 위아래로", en: "Narrow widths stack" },
      body: {
        ko: "sm 아래에서는 두 단이 세로로 쌓여 목록이 위에 옵니다. 목록이 250px를 계속 차지하면 상세가 그릴 자리를 잃기 때문이며, 따로 반응형 처리를 넣지 않습니다.",
        en: "Below sm the panes stack with the list on top, because a fixed 250px list would leave the detail nothing to render in. No responsive handling is needed on your side.",
      },
      example: "overview",
    },
  ],
  specification: [
    {
      id: "shell",
      title: { ko: "셸", en: "Shell" },
      rows: [
        { state: "solid", slot: "Shell", property: "radius", value: "16px" },
        { state: "solid", slot: "Shell", property: "max-width", value: "806px" },
        { state: "solid", slot: "Shell", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Shell", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Shell", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Shell", property: "background layer", value: "LiquidGlass" },
        { state: "all", slot: "Shell", property: "layout", value: "flex-col sm:flex-row" },
        { state: "all", slot: "Shell", property: "overflow", value: "overflow-clip" },
      ],
    },
    {
      id: "list",
      title: { ko: "목록", en: "List" },
      rows: [
        { state: "solid", slot: "List", property: "background", value: "bg-bg-inset" },
        { state: "glass", slot: "List", property: "background", value: "bg-transparent" },
        { state: "sm and up", slot: "List", property: "width", value: "250px" },
        { state: "sm and up", slot: "List", property: "border", value: "1px border-border-default" },
        { state: "all", slot: "List", property: "padding", value: "10px" },
        { state: "all", slot: "List", property: "group gap", value: "12px" },
        { state: "all", slot: "Group label", property: "font", value: "text-label-sm font-semibold" },
        { state: "all", slot: "Group label", property: "padding", value: "4px 12px" },
        { state: "all", slot: "Group label", property: "tracking", value: "0.04em" },
        { state: "all", slot: "Group label", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Option", property: "radius", value: "10px" },
        { state: "all", slot: "Option", property: "padding", value: "10px 12px" },
        { state: "all", slot: "Option", property: "title font", value: "font-mono text-label-md" },
        { state: "all", slot: "Option", property: "meta font", value: "text-label-sm" },
        { state: "option · hover", slot: "Option", property: "background", value: "bg-overlay-ink-4" },
        { state: "option · selected", slot: "Option", property: "background", value: "bg-overlay-ink-6" },
        { state: "option · selected hover", slot: "Option", property: "background", value: "bg-overlay-ink-8" },
        {
          state: "option · focus-visible",
          slot: "Option",
          property: "outline",
          value: "2px outline-text-brand",
        },
        { state: "option", slot: "Option", property: "motion", value: "motion-colors" },
      ],
    },
    {
      id: "detail",
      title: { ko: "상세", en: "Detail" },
      rows: [
        { state: "all", slot: "Detail pane", property: "padding", value: "22px 24px" },
        { state: "all", slot: "Detail pane", property: "gap", value: "20px" },
        { state: "selection change", slot: "Detail pane", property: "motion", value: "motion-rise" },
        { state: "all", slot: "Header", property: "tile", value: "40px" },
        { state: "all", slot: "Header", property: "tile radius", value: "10px" },
        { state: "light", slot: "Header tile", property: "background", value: "bg-sky-100" },
        { state: "light", slot: "Header tile", property: "text color", value: "text-sky-700" },
        { state: "dark", slot: "Header tile", property: "background", value: "bg-sky-900" },
        { state: "dark", slot: "Header tile", property: "text color", value: "text-sky-300" },
        { state: "all", slot: "Header title", property: "font", value: "font-mono text-label-lg font-semibold" },
        { state: "all", slot: "Header description", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Meta", property: "radius", value: "12px" },
        { state: "all", slot: "Meta", property: "background", value: "bg-bg-subtle" },
        { state: "all", slot: "Meta", property: "padding", value: "14px 16px" },
        { state: "all", slot: "Meta", property: "grid", value: "2 columns" },
        { state: "all", slot: "Meta label", property: "font", value: "text-label-sm" },
        { state: "all", slot: "Meta value", property: "font", value: "text-label-md" },
      ],
    },
  ],
  examples: [
    {
      id: "overview",
      title: { ko: "전체 패널", en: "Full panel" },
      description: {
        ko: "머리, 메타, 안내, 파일, 바닥 동작을 모두 갖춘 패널입니다. 그룹 두 개에 세 항목이 들어 있습니다.",
        en: "A panel with a header, meta, instructions, files and footer actions. Two groups hold three items.",
      },
    },
    {
      id: "controlled",
      title: { ko: "선택 제어", en: "Controlled selection" },
      description: {
        ko: "value와 onValueChange로 선택을 밖에서 들고 있습니다. 패널 위에서 지금 선택을 함께 보여 줍니다.",
        en: "The selection lives outside through value and onValueChange, shown above the panel.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 패널", en: "Glass panel" },
      description: {
        ko: "같은 패널을 배경 위 두꺼운 유리로 그렸습니다. 목록은 바탕색 없이 유리 위에 놓입니다.",
        en: "The same panel as thick glass over a backdrop, with the list sitting directly on the glass.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "목록은 role=\"listbox\"이고 행은 role=\"option\" 버튼입니다. 선택된 행은 aria-selected로 표시되고 data-selected로 배경도 바뀝니다.",
        en: "The list is role=\"listbox\" and each row is a role=\"option\" button. The selected row carries aria-selected, and data-selected changes its fill.",
      },
      {
        ko: "목록에는 aria-label Items가 붙어 있습니다. 한 화면에 패널이 둘 이상이면 바깥 제목으로 어느 목록인지 구분합니다.",
        en: "The list carries aria-label Items. With more than one panel on a screen, a surrounding heading tells them apart.",
      },
      {
        ko: "행은 버튼이라 Enter와 Space로 선택됩니다. 화살표 키로 행 사이를 옮기는 동작은 없으므로 목록이 길면 Tab으로 이동합니다.",
        en: "Rows are buttons, so Enter and Space select them. There is no arrow-key movement between rows, so a long list is traversed with Tab.",
      },
      {
        ko: "상세는 선택이 바뀔 때마다 새로 그려집니다. 동작 줄이기를 켜면 떠오르는 전환이 즉시 끝납니다.",
        en: "The detail is re-rendered on every selection change; with reduced motion the rise collapses to nothing.",
      },
      {
        ko: "안내 블록의 편집 버튼은 aria-pressed로 편집 중인 상태를 알리고, 열린 textarea에는 aria-label이 붙습니다.",
        en: "The instructions Edit button reports its state with aria-pressed, and the textarea it opens carries an aria-label.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "목록의 행과 상세 안의 컨트롤로 차례로 포커스를 옮깁니다.", en: "Moves focus through the list rows and then the controls inside the detail." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "행을 선택하거나 버튼을 실행합니다.", en: "Selects the row or runs the button." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "편집 버튼에서 안내 textarea를 열고 닫습니다.", en: "On the Edit button, opens and closes the instructions textarea." },
      },
    ],
  },
};
