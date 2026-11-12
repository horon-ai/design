/**
 * Reference doc for the `DataTable` set, written against
 * `packages/react/src/components/data-table.tsx` and the current Flutter table set.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "data-table",
  anatomy: {
    description: {
      ko: "DataTable은 TanStack Table 위에 만든 표 카드입니다. 카드가 기기별 여백을 정하고, 머리, 표, 검색, 페이지 이동, 바닥글이 각자 맡은 부분을 그립니다. useDataTable이 만든 인스턴스 하나를 여러 파트가 함께 읽습니다.",
      en: "DataTable is a table card built on TanStack Table. The card sets the device gutters, and the header, table, search, pagination and footer each draw their own part. One instance from useDataTable is shared by all of them.",
    },
    parts: [
      {
        name: "DataTable",
        slot: "DataTable",
        description: {
          ko: "카드 바탕입니다. device를 data-device로 내보내 머리, 셀, 바닥글의 여백을 한 번에 바꿉니다.",
          en: "The card surface. It publishes device as data-device, so the header, cells and footer switch their padding together.",
        },
      },
      {
        name: "DataTableHeader",
        slot: "DataTableHeader",
        description: {
          ko: "카드의 첫 행입니다. 26px 브랜드 타일 아이콘, 한 줄로 잘리는 제목, 오른쪽 아이콘 버튼들을 담습니다.",
          en: "The card's top row: a 26px brand tile icon, a title truncated to one line, and trailing icon buttons.",
        },
      },
      {
        name: "DataTableTable",
        slot: "DataTableTable",
        description: {
          ko: "가로 스크롤 컨테이너와 table 요소입니다. mobile에서는 표가 max-content 폭이 되어 옆으로 스크롤합니다.",
          en: "The sideways scroll container and the table element. On mobile the table takes its max-content width and scrolls sideways.",
        },
      },
      {
        name: "DataTableHead",
        slot: "DataTableHead",
        description: {
          ko: "높이 52px의 머리 셀입니다. 위아래 헤어라인과 label-md 보조 텍스트를 쓰고, 정렬 열이면 aria-sort가 붙습니다.",
          en: "A 52px head cell with top and bottom hairlines and label-md secondary text. A sortable column carries aria-sort here.",
        },
      },
      {
        name: "DataTableRow · DataTableCell",
        slot: "DataTableRow",
        description: {
          ko: "본문 행과 높이 52px의 셀입니다. 셀은 body-sm 보조 텍스트로 한 줄을 유지합니다.",
          en: "The body row and its 52px cells. A cell keeps one line in body-sm secondary text.",
        },
      },
      {
        name: "DataTableItem",
        slot: "DataTableItem",
        description: {
          ko: "24px 잉크 타일과 label-lg 이름을 묶은 표시입니다. 도구나 사람처럼 이름이 앞에 오는 열에 씁니다.",
          en: "A 24px ink tile paired with a label-lg name, for a column led by a name such as a tool or a person.",
        },
      },
      {
        name: "DataTableTag",
        slot: "DataTableTag",
        description: {
          ko: "셀 안의 분류 라벨입니다. 높이 26px의 span이라 셀의 글자 흐름에 그대로 들어갑니다.",
          en: "A category label inside a cell. It is a 26px span, so it sits in the cell's text flow.",
        },
      },
      {
        name: "DataTableFooter",
        slot: "DataTableFooter",
        description: {
          ko: "바닥 행입니다. 16px 더하기가 붙은 Add row 동작이 남는 폭을 쓰고, 오른쪽에 캡션 힌트가 붙습니다.",
          en: "The bottom row: an Add row action with a 16px plus takes the free width, with a caption hint pinned right.",
        },
      },
      {
        name: "DataTableView · DataTableSearch · DataTablePagination",
        slot: "table",
        description: {
          ko: "useDataTable 인스턴스를 받는 세 파트입니다. 표 본문, 전역 검색 필드, 행 수와 페이지 이동을 각각 그립니다.",
          en: "Three parts that take the useDataTable instance: the table body, the global search field, and the row count with page navigation.",
        },
      },
    ],
  },
  properties: [
    {
      id: "device",
      title: { ko: "device", en: "device" },
      description: {
        ko: "표가 놓이는 화면 폭입니다. 카드의 좌우 여백과 mobile에서의 표 폭을 정합니다.",
        en: "The viewport the table is designed for. It sets the card's side gutters and the table width on mobile.",
      },
      values: [
        {
          name: "desktop",
          description: {
            ko: "24px 여백을 쓰는 기본값입니다. 넓은 카드에서 열을 모두 보여 줍니다.",
            en: "24px gutters. The default, showing every column in a wide card.",
          },
        },
        {
          name: "tablet",
          description: {
            ko: "desktop과 같은 24px 여백을 유지합니다. 카드 폭만 줄어든 자리에 씁니다.",
            en: "The same 24px gutters as desktop, for a narrower card on a tablet.",
          },
        },
        {
          name: "mobile",
          description: {
            ko: "여백을 18px로 줄이고 표를 max-content 폭으로 바꿔 옆으로 스크롤합니다. 열을 압축하지 않습니다.",
            en: "Narrows the gutters to 18px and switches the table to its max-content width so it scrolls sideways instead of squeezing columns.",
          },
        },
      ],
      example: "devices",
    },
    {
      id: "tone",
      title: { ko: "tone", en: "tone" },
      description: {
        ko: "DataTableTag의 색입니다. 분류를 눈에 띄게 할지 조용히 둘지 정합니다.",
        en: "The colour of a DataTableTag, deciding whether a category stands out or stays quiet.",
      },
      values: [
        {
          name: "brand",
          description: {
            ko: "하늘색 바탕에 brand 텍스트를 쓰는 기본값입니다. 지금 살아 있는 분류에 씁니다.",
            en: "Sky fill with brand text. The default, for a category that is current.",
          },
        },
        {
          name: "neutral",
          description: {
            ko: "보조 표면에 보조 텍스트를 씁니다. 여러 행에서 반복되는 분류를 조용히 보여 줍니다.",
            en: "Subtle fill with secondary text, for a category repeated across many rows.",
          },
        },
      ],
      example: "tags",
    },
    {
      id: "columns",
      title: { ko: "columns", en: "columns" },
      description: {
        ko: "useDataTable에 넘기는 열 정의 배열입니다. 표시 순서대로 놓이고 각 열의 meta로 머리 아이콘과 셀 클래스를 정합니다. 선택 열이 필요하면 dataTableSelectColumn()을 첫 항목으로 넣습니다.",
        en: "The column definitions passed to useDataTable, in display order. A column's meta sets its head icon and cell classes; for a checkbox column, put dataTableSelectColumn() first.",
      },
      example: "basic",
    },
    {
      id: "pageSize",
      title: { ko: "pageSize", en: "pageSize" },
      description: {
        ko: "한 페이지에 보여 줄 행 수입니다. 생략하면 수동 페이지 이동이 켜져 모든 행이 한 번에 그려집니다. 값을 주면 시작 페이지는 1페이지입니다.",
        en: "How many rows one page holds. Omit it and manual pagination turns on, drawing every row at once; with a value the table starts on page one.",
      },
      example: "pagination",
    },
    {
      id: "enableRowSelection",
      title: { ko: "enableRowSelection", en: "enableRowSelection" },
      description: {
        ko: "참이면 행을 고를 수 있게 하고 dataTableSelectColumn의 체크박스가 그 상태를 읽고 씁니다. 머리 상자는 현재 페이지의 모든 행을 고르고, 일부만 골랐으면 indeterminate가 됩니다.",
        en: "When true rows can be selected, and the checkboxes from dataTableSelectColumn read and write that state. The header box selects every row on the page and reports indeterminate when only some are chosen.",
      },
      example: "selection",
    },
    {
      id: "getRowId",
      title: { ko: "getRowId", en: "getRowId" },
      description: {
        ko: "행마다 안정된 id를 만드는 함수입니다. 생략하면 행 인덱스가 id가 되어 정렬이나 페이지 이동 뒤 선택이 다른 행에 붙을 수 있습니다.",
        en: "Derives a stable id per row. Without it the row index becomes the id, so a selection can land on a different row after sorting or paging.",
      },
      example: "selection",
    },
    {
      id: "emptyMessage",
      title: { ko: "emptyMessage", en: "emptyMessage" },
      description: {
        ko: "거른 결과가 0행일 때 표 전체 폭으로 그리는 문구입니다. 기본값은 No results. 입니다.",
        en: "The message drawn across the table when no row survives the filter. It defaults to No results.",
      },
      example: "empty",
    },
    {
      id: "placeholder",
      title: { ko: "placeholder", en: "placeholder" },
      description: {
        ko: "DataTableSearch의 안내 문구이자 입력의 aria-label입니다. 기본값은 Search입니다.",
        en: "The hint in DataTableSearch, which is also the input's aria-label. It defaults to Search.",
      },
      example: "search",
    },
    {
      id: "addLabel",
      title: { ko: "addLabel", en: "addLabel" },
      description: {
        ko: "DataTableFooter의 동작 문구입니다. 기본값은 Add row입니다.",
        en: "The label of the footer action. It defaults to Add row.",
      },
      example: "basic",
    },
    {
      id: "onAdd",
      title: { ko: "onAdd", en: "onAdd" },
      description: {
        ko: "바닥글 동작을 눌렀을 때 불리는 함수입니다. 행을 추가하는 일은 호출하는 쪽이 맡고 바닥글은 버튼만 그립니다.",
        en: "Called when the footer action is pressed. Adding the row belongs to the caller; the footer only draws the button.",
      },
      example: "basic",
    },
    {
      id: "hint",
      title: { ko: "hint", en: "hint" },
      description: {
        ko: "바닥글 오른쪽 캡션입니다. 총 개수나 조작 힌트를 적고 줄바꿈하지 않습니다.",
        en: "The caption at the footer's right edge, for a total or a hint. It never wraps.",
      },
      example: "basic",
    },
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "DataTableHeader의 제목입니다. 한 줄로 잘리고 남는 폭을 모두 씁니다.",
        en: "The DataTableHeader title. It truncates to one line and takes the remaining width.",
      },
      example: "basic",
    },
    {
      id: "actions",
      title: { ko: "actions", en: "actions" },
      description: {
        ko: "머리 오른쪽의 16px 아이콘 버튼들입니다. 보통 IconButton을 넘깁니다.",
        en: "The 16px icon buttons at the header's right edge, usually IconButtons.",
      },
      example: "basic",
    },
    {
      id: "icon",
      title: { ko: "icon", en: "icon" },
      description: {
        ko: "머리의 26px 브랜드 타일 안에 들어가는 16px 아이콘입니다. 열 머리에 아이콘을 넣을 때는 DataTableHead의 icon을 씁니다.",
        en: "The 16px icon inside the header's 26px brand tile. For an icon on a column head, use DataTableHead's own icon instead.",
      },
      example: "basic",
    },
    {
      id: "table",
      title: { ko: "table", en: "table" },
      description: {
        ko: "useDataTable이 돌려준 인스턴스입니다. DataTableView, DataTableSearch, DataTablePagination이 같은 인스턴스를 받아 정렬, 검색, 선택, 페이지 상태를 함께 읽습니다.",
        en: "The instance useDataTable returns. DataTableView, DataTableSearch and DataTablePagination all take that one instance, so sorting, filtering, selection and paging share a state.",
      },
      example: "search",
    },
  ],
  guidelines: [
    {
      id: "card-owns-gutters",
      title: { ko: "여백은 카드가 정합니다", en: "The card owns the gutters" },
      body: {
        ko: "DataTable의 device를 바꾸면 머리, 셀, 바닥글, 페이지 이동의 여백이 함께 바뀝니다. 파트마다 px를 따로 넘겨 여백을 맞추지 않습니다.",
        en: "Changing device on DataTable moves the header, cell, footer and pagination gutters together. Do not pass px to each part to line them up.",
      },
      do: {
        ko: "좁은 화면에는 device=\"mobile\"을 넘깁니다.",
        en: "Pass device=\"mobile\" for a narrow screen.",
      },
      dont: {
        ko: "각 파트의 className에 px-4를 따로 넣지 않습니다.",
        en: "Do not add px-4 to each part's className.",
      },
      example: "devices",
    },
    {
      id: "stable-row-id",
      title: { ko: "행 id를 안정적으로 만듭니다", en: "Keep row ids stable" },
      body: {
        ko: "선택이나 정렬을 쓰는 표에는 getRowId를 넘깁니다. 인덱스를 id로 두면 정렬이나 페이지 이동 뒤 선택이 다른 행에 붙고, 삭제한 행의 선택이 남습니다.",
        en: "Pass getRowId to any table with selection or sorting. An index id makes a selection follow the wrong row after sorting or paging, and a deleted row leave its selection behind.",
      },
      do: {
        ko: "getRowId={(row) => row.name}처럼 고유한 값을 씁니다.",
        en: "Use a unique value, as getRowId={(row) => row.name}.",
      },
      dont: {
        ko: "선택 열을 켜면서 getRowId를 비워 두지 않습니다.",
        en: "Do not enable the select column with getRowId empty.",
      },
      example: "selection",
    },
    {
      id: "tag-tone",
      title: { ko: "분류는 반복 횟수로 색을 고릅니다", en: "Let repetition pick the tag tone" },
      body: {
        ko: "여러 행에 같은 분류가 반복되면 neutral로 두고, 지금 살아 있는 값을 강조할 때만 brand를 씁니다. 모든 행이 brand면 강조가 사라집니다.",
        en: "When the same category repeats across rows, keep it neutral; use brand only to mark the value that is current. With every row brand, the emphasis disappears.",
      },
      example: "tags",
    },
    {
      id: "empty-and-footer",
      title: { ko: "빈 결과에도 다음 행동을 남깁니다", en: "Leave a way forward on empty" },
      body: {
        ko: "검색이나 필터로 결과가 0행이 되면 emptyMessage가 표 전체 폭으로 그려집니다. 머리와 바닥글은 그대로 남으므로 검색을 지우거나 행을 추가하는 동작을 계속 쓸 수 있습니다.",
        en: "When a filter leaves no rows, emptyMessage is drawn across the whole table. The header and footer stay, so clearing the search or adding a row is still reachable.",
      },
      example: "empty",
    },
  ],
  specification: [
    {
      id: "device-gutters",
      title: { ko: "device별 여백", en: "Gutters by device" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸과 픽셀 값입니다.",
        en: "Values are the token utilities and pixel values from the component classes.",
      },
      rows: [
        { state: "desktop", slot: "DataTable", property: "side gutters", value: "24px" },
        { state: "tablet", slot: "DataTable", property: "side gutters", value: "24px" },
        { state: "mobile", slot: "DataTable", property: "side gutters", value: "18px" },
        { state: "mobile", slot: "DataTableTable", property: "table width", value: "min-w-max" },
        { state: "default", slot: "DataTable", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "DataTable", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "DataTable", property: "background", value: "bg-bg-surface" },
        {
          state: "default",
          slot: "DataTable",
          property: "attribute",
          value: "data-device",
          note: {
            ko: "파트들이 group-data-[device=…] 선택자로 여백을 바꿉니다.",
            en: "The parts switch their padding through group-data-[device=…] selectors.",
          },
        },
      ],
    },
    {
      id: "part-metrics",
      title: { ko: "파트별 치수", en: "Part metrics" },
      rows: [
        { state: "default", slot: "Header", property: "padding", value: "18px 24px" },
        { state: "default", slot: "Header", property: "gap", value: "12px" },
        { state: "default", slot: "Header icon tile", property: "size", value: "26px" },
        { state: "default", slot: "Header icon tile", property: "radius", value: "rounded-xs" },
        { state: "default", slot: "Header icon tile", property: "background", value: "bg-bg-brand" },
        { state: "default", slot: "Header title", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Head", property: "height", value: "52px" },
        { state: "default", slot: "Head", property: "border", value: "border-y border-border-default" },
        { state: "default", slot: "Head", property: "font", value: "text-label-md" },
        { state: "default", slot: "Head", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Head icon", property: "size", value: "14px" },
        { state: "default", slot: "Row", property: "border", value: "border-b border-border-default" },
        { state: "default", slot: "Cell", property: "height", value: "52px" },
        { state: "default", slot: "Cell", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Cell", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Item tile", property: "size", value: "24px" },
        { state: "default", slot: "Item tile", property: "radius", value: "rounded-xs" },
        { state: "default", slot: "Item tile", property: "background", value: "bg-surface-ink" },
        { state: "default", slot: "Item tile", property: "text color", value: "text-text-on-ink" },
        { state: "default", slot: "Item name", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Tag", property: "height", value: "26px" },
        { state: "default", slot: "Tag", property: "padding", value: "0 10px" },
        { state: "default", slot: "Tag", property: "radius", value: "rounded-sm" },
        { state: "default", slot: "Tag", property: "font", value: "text-label-md" },
        { state: "default", slot: "Footer", property: "padding", value: "14px 24px 16px" },
        { state: "default", slot: "Footer hint", property: "font", value: "text-caption" },
        { state: "default", slot: "Pagination", property: "padding", value: "12px 24px" },
        { state: "default", slot: "Pagination count", property: "font", value: "text-caption" },
      ],
    },
    {
      id: "tag-colors",
      title: { ko: "Tag 색", en: "Tag colours" },
      rows: [
        { state: "brand", slot: "Tag", property: "background", value: "bg-bg-brand" },
        { state: "brand", slot: "Tag", property: "text color", value: "text-text-brand" },
        { state: "neutral", slot: "Tag", property: "background", value: "bg-bg-subtle" },
        { state: "neutral", slot: "Tag", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "row-states",
      title: { ko: "행 상태", en: "Row states" },
      rows: [
        { state: "default", slot: "Row", property: "motion", value: "motion-rise" },
        {
          state: "default",
          slot: "Row",
          property: "stagger",
          value: "animation-delay: calc(var(--i) * 30ms)",
          note: {
            ko: "행이 30ms 간격으로 차례로 올라옵니다.",
            en: "Rows rise one after another at 30ms intervals.",
          },
        },
        { state: "hover", slot: "Row", property: "background", value: "hover:bg-overlay-ink-4" },
        { state: "selected", slot: "Cell", property: "background", value: "data-selected:[&>td]:bg-overlay-ink-4" },
        {
          state: "selected · hover",
          slot: "Cell",
          property: "background",
          value: "data-selected:hover:[&>td]:bg-overlay-ink-6",
        },
        {
          state: "sort · asc",
          slot: "Head",
          property: "caret",
          value: "CaretUp",
          note: {
            ko: "정렬된 열의 머리에만 붙고 aria-sort가 ascending이 됩니다.",
            en: "Drawn on the sorted column, whose aria-sort becomes ascending.",
          },
        },
        { state: "sort · desc", slot: "Head", property: "caret", value: "CaretDown" },
        { state: "sort · none", slot: "Head", property: "caret", value: "CaretUpDown opacity-60" },
        { state: "sort · none", slot: "Head", property: "aria-sort", value: "none" },
        { state: "head · hover", slot: "Head button", property: "text color", value: "hover:text-text-primary" },
        { state: "focus-visible", slot: "Head button", property: "outline", value: "2px outline-text-brand" },
        {
          state: "page change",
          slot: "Body",
          property: "remount",
          value: "pageIndex + sorting + row id",
          note: {
            ko: "정렬이나 페이지가 바뀌면 본문이 다시 마운트되어 stagger가 다시 재생됩니다.",
            en: "A sort or page change remounts the body so the stagger replays.",
          },
        },
        { state: "empty", slot: "Cell", property: "height", value: "96px" },
      ],
    },
    {
      id: "detail-controls",
      title: { ko: "보조 컨트롤", en: "Supporting controls" },
      rows: [
        { state: "select column", slot: "DataTableSelectColumn", property: "width", value: "48px" },
        { state: "select column", slot: "DataTableSelectColumn", property: "sorting", value: "비활성" },
        { state: "select all", slot: "Header checkbox", property: "accessibility", value: "aria-label=\"Select all rows\"" },
        { state: "select row", slot: "Cell checkbox", property: "accessibility", value: "aria-label=\"Select row <n>\"" },
        {
          state: "select row",
          slot: "Cell checkbox",
          property: "disabled",
          value: "!row.getCanSelect()",
          note: {
            ko: "표가 그 행을 고를 수 없으면 체크박스가 비활성됩니다.",
            en: "The checkbox is disabled when the table does not allow selecting that row.",
          },
        },
        { state: "search", slot: "DataTableSearch", property: "field", value: "Input surface=solid size=sm" },
        { state: "search", slot: "DataTableSearch", property: "icon", value: "MagnifyingGlass" },
        {
          state: "search",
          slot: "DataTableSearch",
          property: "value",
          value: "table.state.globalFilter",
          note: {
            ko: "다른 곳에서 필터를 지워도 입력이 같은 값을 읽습니다.",
            en: "When something else clears the filter, the input reads the same state.",
          },
        },
        {
          state: "pagination",
          slot: "DataTablePagination",
          property: "count",
          value: "선택 시 n of m selected, 아니면 n rows",
          note: {
            ko: "개수는 원본 데이터가 아니라 거른 결과를 셉니다.",
            en: "The count follows the filtered rows, not the raw data.",
          },
        },
        {
          state: "pagination",
          slot: "DataTablePagination",
          property: "page label",
          value: "Page n of m",
          note: {
            ko: "페이지 수는 최소 1로 표시됩니다.",
            en: "The page count never shows less than one.",
          },
        },
        {
          state: "pagination",
          slot: "IconButton",
          property: "disabled",
          value: "getCanPreviousPage / getCanNextPage",
          note: {
            ko: "범위 끝에서 화살표가 비활성됩니다.",
            en: "Each arrow is disabled at its end of the range.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본 표", en: "Basic table" },
      description: {
        ko: "머리, 표, 바닥글을 갖춘 카드입니다. 열 정의와 행 데이터만 넘기면 됩니다.",
        en: "A card with a header, a table and a footer, driven by column definitions and rows.",
      },
    },
    {
      id: "pagination",
      title: { ko: "페이지 이동", en: "Pagination" },
      description: {
        ko: "pageSize를 넘겨 페이지를 나누고 행 수와 이전, 다음 버튼을 표시합니다.",
        en: "pageSize splits the rows, with the row count and previous and next buttons.",
      },
    },
    {
      id: "search",
      title: { ko: "검색", en: "Search" },
      description: {
        ko: "DataTableSearch가 전역 필터를 쓰고 표와 페이지 이동이 같은 인스턴스를 읽습니다.",
        en: "DataTableSearch writes the global filter, and the table and pagination read the same instance.",
      },
    },
    {
      id: "selection",
      title: { ko: "행 선택", en: "Row selection" },
      description: {
        ko: "선택 열을 첫 열로 넣고 안정된 행 id를 넘겨 선택이 행을 따라가게 합니다.",
        en: "The select column goes first, with stable row ids so a selection follows its row.",
      },
    },
    {
      id: "tags",
      title: { ko: "분류 라벨", en: "Category tags" },
      description: {
        ko: "brand와 neutral 라벨을 같은 표에서 비교합니다.",
        en: "brand and neutral tags in one table.",
      },
    },
    {
      id: "devices",
      title: { ko: "기기별 여백", en: "Devices" },
      description: {
        ko: "desktop, tablet, mobile의 여백과 mobile에서 옆으로 스크롤하는 표를 보여 줍니다.",
        en: "The desktop, tablet and mobile gutters, and the sideways scroll on mobile.",
      },
    },
    {
      id: "empty",
      title: { ko: "빈 결과", en: "Empty result" },
      description: {
        ko: "행이 없을 때 emptyMessage가 표 전체 폭으로 그려지고 머리와 바닥글은 남습니다.",
        en: "With no rows, emptyMessage spans the table while the header and footer stay.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "정렬 열의 머리는 button이고 th에 aria-sort가 붙습니다. 정렬되지 않은 열은 none, 오름차순은 ascending, 내림차순은 descending입니다. 정렬할 수 없는 열은 aria-sort 없이 meta.icon을 씁니다.",
        en: "A sortable head is a button and its th carries aria-sort: none when unsorted, ascending or descending after a click. A column that cannot sort shows meta.icon with no aria-sort.",
      },
      {
        ko: "선택 체크박스의 이름은 컴포넌트가 붙입니다. 머리 상자는 Select all rows, 각 행 상자는 Select row n입니다. 행에 다른 이름이 필요하면 열 정의의 cell에서 체크박스를 직접 만들어 이름을 바꿉니다.",
        en: "The component names the selection checkboxes: Select all rows in the head and Select row n in each cell. When a row needs a better name, build the checkbox in the column's cell and name it there.",
      },
      {
        ko: "검색 필드의 placeholder가 aria-label이기도 합니다. 표의 대상이 분명한 문구로 바꿉니다. 예를 들어 Search tools처럼 적습니다.",
        en: "The search placeholder doubles as its aria-label. Make it name the table's subject, as Search tools.",
      },
      {
        ko: "mobile에서 표는 옆으로 스크롤합니다. 스크롤 컨테이너에 키보드 포커스가 닿지 않으므로, 좁은 화면에서는 필요한 열만 남기거나 바닥글 hint로 스크롤을 알립니다.",
        en: "On mobile the table scrolls sideways. The scroll container takes no keyboard focus, so on a narrow screen keep the essential columns or say in the footer hint that there is more to scroll.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "검색 필드, 정렬 머리, 체크박스, 페이지 버튼 사이를 이동합니다.",
          en: "Moves between the search field, sortable heads, checkboxes and page buttons.",
        },
      },
      {
        keys: ["Enter"],
        action: { ko: "포커스한 정렬 머리나 바닥글 동작을 실행합니다.", en: "Runs the focused sort head or footer action." },
      },
      {
        keys: ["Space"],
        action: {
          ko: "포커스한 체크박스를 켜고 끄거나 정렬 버튼을 실행합니다.",
          en: "Toggles the focused checkbox, or runs the focused sort button.",
        },
      },
    ],
  },
};
