/**
 * Reference doc for `DocumentExtractPanel`, written against
 * `packages/react/src/components/document-extract-panel.tsx` and
 * `packages/flutter/lib/src/components/document_extract_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "document-extract-panel",
  anatomy: {
    description: {
      ko: "DocumentExtractPanel은 문서 한 장과 그 문서에서 읽어 낸 값을 나란히 보여 줍니다. 왼쪽은 확대할 수 있는 종이 시트이고, 오른쪽은 필드·JSON·Schema 세 보기로 같은 데이터를 펼칩니다.",
      en: "DocumentExtractPanel sets one document page beside the values read from it. The left side is a zoomable paper sheet; the right side expands the same data as Fields, JSON or Schema.",
    },
    parts: [
      {
        name: "Panel",
        slot: "section",
        description: {
          ko: "패널 전체를 감싸는 section입니다. 컨테이너 쿼리로 폭을 판단하므로 페이지 폭이 아니라 자기 폭에 따라 두 열이 갈라집니다.",
          en: "The section wrapping the panel. It measures with container queries, so the two columns split on its own width rather than the page width.",
        },
      },
      {
        name: "Viewer column",
        slot: "sheet",
        description: {
          ko: "문서를 보여 주는 왼쪽 열입니다. 넓은 컨테이너에서는 540px로 고정되고, 좁아지면 위아래로 쌓입니다.",
          en: "The left column that shows the document. It fixes at 540px in a wide container and stacks when the container narrows.",
        },
      },
      {
        name: "Toolbar",
        slot: "fileName",
        description: {
          ko: "파일 아이콘, 파일 이름, 페이지 표시, 확대 조절기, Fit 버튼이 한 줄에 놓입니다. 파일 이름은 onOpenFile이 있을 때만 버튼이 됩니다.",
          en: "The file icon, file name, page label, zoom stepper and Fit button in one row. The name is a button only when onOpenFile is set.",
        },
      },
      {
        name: "Sheet",
        slot: "sheet",
        description: {
          ko: "종이를 흉내 내는 흰 시트입니다. 확대 값에 따라 위쪽 모서리를 기준으로 배율만 바뀌고, 안쪽 내용은 다시 흐르지 않습니다.",
          en: "The white sheet that imitates paper. Zoom scales it from its top edge, so the content inside never reflows.",
        },
      },
      {
        name: "ExtractHighlight",
        slot: "ExtractHighlight",
        description: {
          ko: "시트 위에서 읽어 낸 값에 두르는 1.2px 상자입니다. tone으로 네 가지 색 조합을 고르고, 넘긴 div 클래스가 마지막에 합쳐집니다.",
          en: "The 1.2px box drawn around a value read from the sheet. tone picks one of four colour pairs, and a div className is merged last.",
        },
      },
      {
        name: "View tabs",
        slot: "PanelPillTabs",
        description: {
          ko: "Fields, JSON, Schema를 오가는 알약 탭입니다. 같은 groups 데이터를 세 가지 모양으로 바꿔 보여 줍니다.",
          en: "The pill tabs that switch Fields, JSON and Schema views of the same groups data.",
        },
      },
      {
        name: "Group",
        slot: "groups",
        description: {
          ko: "필드 묶음 하나입니다. 점과 제목이 붙은 머리 아래에 필드 행과 표가 순서대로 놓입니다.",
          en: "One group of fields. A dotted heading sits above the field rows and tables in order.",
        },
      },
      {
        name: "Field row",
        slot: "fields",
        description: {
          ko: "왼쪽 라벨, 가운데 값, 오른쪽 타입으로 이루어진 행입니다. status가 check이면 값이 확인 버튼으로 바뀝니다.",
          en: "A row of label on the left, value in the middle and type on the right. A status of check turns the value into a confirm button.",
        },
      },
      {
        name: "Table",
        slot: "columns",
        description: {
          ko: "값 하나로 담기지 않는 항목을 위한 표입니다. 열 정의와 행 배열을 받고, 폭이 모자라면 표 안에서만 가로로 스크롤합니다.",
          en: "A table for an item that does not fit one value. It takes column definitions and rows, and scrolls inside itself when the width runs out.",
        },
      },
      {
        name: "Footer",
        slot: "bot",
        description: {
          ko: "필드마다 점 하나, 채움 개수, 확인 대기 개수, 봇 크레딧, Accept all 버튼이 놓이는 줄입니다.",
          en: "The strip with a dot per field, the filled and unresolved counts, the bot credit and the Accept all button.",
        },
      },
    ],
  },
  properties: [
    {
      id: "fileName",
      title: { ko: "fileName", en: "fileName" },
      description: {
        ko: "툴바에 보이는 문서 이름입니다. 길면 잘리고, onOpenFile을 넘기면 같은 자리에서 버튼이 됩니다.",
        en: "The document name in the toolbar. It truncates when long, and becomes a button in the same spot with onOpenFile.",
      },
      example: "fields",
    },
    {
      id: "pageLabel",
      title: { ko: "pageLabel", en: "pageLabel" },
      description: {
        ko: "툴바 오른쪽의 페이지 표시입니다. 기본값은 1 / 1이고, 실제 페이지를 넘기는 일은 하지 않습니다.",
        en: "The page indicator at the right of the toolbar. It defaults to 1 / 1 and never changes pages itself.",
      },
      example: "fields",
    },
    {
      id: "sheet",
      title: { ko: "sheet", en: "sheet" },
      description: {
        ko: "시트에 그릴 내용입니다. 테마와 무관한 neutral 잉크로 그리므로 어두운 테마에서도 종이처럼 읽힙니다. 읽어 낸 값을 표시하려면 ExtractHighlight로 감쌉니다.",
        en: "What is drawn on the sheet. Use neutral ink rather than theme colors so it reads as paper in both themes. Wrap a read value in ExtractHighlight to mark it.",
      },
      example: "highlight",
    },
    {
      id: "groups",
      title: { ko: "groups", en: "groups" },
      description: {
        ko: "추출 결과를 묶음 단위로 받습니다. 필드와 표를 함께 담을 수 있고, 이 하나의 배열이 Fields·JSON·Schema 세 보기와 바닥 카운터의 공통 출처입니다.",
        en: "The extracted result, grouped. A group may hold fields and tables, and this one array feeds all three views and the footer counters.",
      },
      example: "tables",
    },
    {
      id: "tone",
      title: { ko: "tone", en: "tone" },
      description: {
        ko: "ExtractHighlight의 테두리와 바탕 색입니다. 읽은 값의 성격을 구분할 때만 나누고, 한 문서 안에서 네 가지를 모두 쓰면 표시가 의미를 잃습니다.",
        en: "The border and fill of an ExtractHighlight. Split by the kind of read only; using all four in one document leaves the marks without meaning.",
      },
      values: [
        {
          name: "sky",
          description: {
            ko: "보통 값에 쓰는 기본 표시입니다.",
            en: "The default mark for an ordinary value.",
          },
        },
        {
          name: "brand",
          description: {
            ko: "표에서 한 덩어리로 읽은 값처럼 눈에 띄게 표시할 때 씁니다.",
            en: "Used when a read should stand out, such as a block read as one unit.",
          },
        },
        {
          name: "neutral",
          description: {
            ko: "메모처럼 추출 대상이 아닌 참고 표시에 씁니다.",
            en: "For a note that is context rather than an extracted value.",
          },
        },
        {
          name: "ink",
          description: {
            ko: "강조 표시입니다. 브랜드 채움 테두리로 가장 진하게 보입니다.",
            en: "The strongest mark, drawn with the brand fill border.",
          },
        },
      ],
      example: "highlight",
    },
    {
      id: "defaultZoom",
      title: { ko: "defaultZoom", en: "defaultZoom" },
      description: {
        ko: "처음 보여 줄 확대 값입니다. 70에서 시트가 설계 크기로 그려지고, 조절 범위는 30에서 150 사이 10 단위입니다. 범위를 벗어난 값을 넘겨도 조절기는 범위 안에서만 움직입니다.",
        en: "The zoom shown first. At 70 the sheet draws at its design size, and the control runs from 30 to 150 in steps of ten. The stepper stays inside that range whatever value it starts from.",
      },
      example: "footer",
    },
    {
      id: "bot",
      title: { ko: "bot", en: "bot" },
      description: {
        ko: "바닥에 붙는 봇 크레딧입니다. 머리 글자, 이름, 선택적인 소요 시간을 받고, 값이 없으면 크레딧 자리 전체가 사라집니다.",
        en: "The bot credit in the footer. It takes an initial, a name and an optional elapsed time; without it the whole credit slot disappears.",
      },
      example: "footer",
    },
    {
      id: "onExtract",
      title: { ko: "onExtract", en: "onExtract" },
      description: {
        ko: "Extract를 누를 때 호출됩니다. 패널은 실행 횟수를 하나 올려 지금 보이는 보기를 다시 그리므로, 결과가 같아도 행이 다시 올라옵니다.",
        en: "Called when Extract is pressed. The panel also bumps its run counter and redraws the visible view, so the rows rise in again even for the same result.",
      },
      example: "tables",
    },
    {
      id: "onAcceptAll",
      title: { ko: "onAcceptAll", en: "onAcceptAll" },
      description: {
        ko: "Accept all을 누를 때 호출됩니다. 패널은 모든 행을 확인된 것으로 표시한 뒤 핸들러를 부르므로, 저장 쪽은 다음 렌더에 바뀐 표시를 보게 됩니다.",
        en: "Called when Accept all is pressed. The panel marks every row confirmed before calling the handler, so the saving side sees the marks on the next render.",
      },
      example: "footer",
    },
    {
      id: "onOpenFile",
      title: { ko: "onOpenFile", en: "onOpenFile" },
      description: {
        ko: "파일 이름을 버튼으로 바꿉니다. 핸들러가 없으면 이름은 라벨로만 남습니다.",
        en: "Turns the file name into a button. Without the handler the name stays a plain label.",
      },
      example: "footer",
    },
  ],
  guidelines: [
    {
      id: "confirm-before-accept",
      title: { ko: "확인이 필요한 값은 check로 남깁니다", en: "Mark uncertain reads with check" },
      body: {
        ko: "값이 흐리거나 형식이 낯설면 status를 check로 두어 사람이 한 번 확인하게 합니다. 모두 filled로 두고 Accept all을 누르게 하면 틀린 값이 그대로 저장됩니다.",
        en: "When a read is faint or oddly formatted, set status to check so a person confirms it. Leaving everything filled and pressing Accept all saves a wrong value without anyone seeing it.",
      },
      do: {
        ko: "스캔이 흐린 만기일 행에만 check를 붙입니다.",
        en: "Mark only the faint due date row with check.",
      },
      dont: {
        ko: "모든 행을 check로 두어 확인이 무의미해지게 하지 않습니다.",
        en: "Do not mark every row, which makes the check meaningless.",
      },
      example: "fields",
    },
    {
      id: "groups-follow-document",
      title: { ko: "묶음은 문서의 구획을 따릅니다", en: "Let groups follow the document's sections" },
      body: {
        ko: "groups의 라벨은 문서에 실제로 있는 구획 이름을 씁니다. 임의로 나누면 같은 값이 어느 구획에서 읽혔는지 알 수 없고, 섹션 표시가 장식으로 남습니다.",
        en: "Name groups after sections that exist in the document. Arbitrary grouping hides which section a value came from and leaves the headings decorative.",
      },
      do: {
        ko: "Vendor, Totals, Payment처럼 문서의 구획을 그대로 씁니다.",
        en: "Use the document's own sections, such as Vendor, Totals and Payment.",
      },
      dont: {
        ko: "Important과 Others로 임의로 나누지 않습니다.",
        en: "Do not invent Important and Others.",
      },
      example: "fields",
    },
    {
      id: "views-share-one-source",
      title: { ko: "세 보기는 한 데이터에서 나옵니다", en: "One source feeds all three views" },
      body: {
        ko: "JSON과 Schema는 groups에서 바로 만들어집니다. 시트에만 값을 그리고 groups를 비우면 세 보기가 모두 빈 화면이 됩니다. 읽은 값은 모두 groups에 넣습니다.",
        en: "JSON and Schema are built from groups. Drawing values only on the sheet and leaving groups empty gives three blank views. Put every read value in groups.",
      },
      example: "tables",
    },
    {
      id: "paper-ink",
      title: { ko: "시트는 neutral 잉크로 그립니다", en: "Draw the sheet in neutral ink" },
      body: {
        ko: "시트는 종이를 흉내 내므로 neutral-50 바탕과 neutral-900 글자를 씁니다. 테마 표면 색을 쓰면 어두운 테마에서 회색 종이가 되어 본문 카드와 구분되지 않습니다.",
        en: "The sheet imitates paper, so it uses a neutral-50 fill and neutral-900 text. Theme surface colors turn it into grey paper in dark mode and it stops reading as a document.",
      },
      example: "highlight",
    },
  ],
  specification: [
    {
      id: "viewer",
      title: { ko: "툴바와 시트", en: "Toolbar and sheet" },
      note: {
        ko: "값은 소스 클래스 그대로이고, 배율은 70을 100%로 보고 계산합니다.",
        en: "Values are the source classes; the scale treats 70 as 100%.",
      },
      rows: [
        { state: "default", slot: "Panel", property: "radius", value: "rounded-[24px]" },
        { state: "default", slot: "Panel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Panel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Panel", property: "max width", value: "max-w-280" },
        { state: "split", slot: "Viewer column", property: "width", value: "@4xl:w-135" },
        { state: "default", slot: "Toolbar", property: "padding", value: "px-5 py-3" },
        { state: "default", slot: "Toolbar", property: "gap", value: "gap-2" },
        { state: "default", slot: "File icon", property: "size", value: "size-7 rounded-[10px]" },
        { state: "default", slot: "File icon", property: "background", value: "bg-overlay-ink-5 text-text-danger" },
        { state: "default", slot: "File name", property: "font", value: "text-label-md text-text-primary" },
        { state: "default", slot: "Page label", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Zoom stepper", property: "height", value: "h-7.5" },
        { state: "default", slot: "Zoom stepper", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "Zoom stepper", property: "padding", value: "p-[3px]" },
        { state: "default", slot: "Zoom stepper", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Zoom step button", property: "size", value: "size-6 rounded-full" },
        { state: "Zoom · hover", slot: "Zoom step button", property: "background", value: "bg-overlay-ink-8" },
        { state: "Zoom · disabled", slot: "Zoom step button", property: "opacity", value: "disabled:opacity-40" },
        { state: "default", slot: "Zoom value", property: "font", value: "text-label-sm tabular-nums" },
        { state: "default", slot: "Fit button", property: "height", value: "h-7.5" },
        { state: "default", slot: "Fit button", property: "background", value: "bg-overlay-ink-6" },
        { state: "Fit · hover", slot: "Fit button", property: "background", value: "bg-overlay-ink-8" },
        { state: "default", slot: "Stage", property: "background", value: "bg-overlay-ink-7" },
        { state: "default", slot: "Stage", property: "padding", value: "px-6 py-5" },
        { state: "default", slot: "Stage", property: "min height", value: "min-h-120" },
        { state: "default", slot: "Sheet", property: "background", value: "bg-neutral-50" },
        { state: "default", slot: "Sheet", property: "text color", value: "text-neutral-900" },
        { state: "default", slot: "Sheet", property: "padding", value: "px-6.5 pt-6.5 pb-5" },
        { state: "default", slot: "Sheet", property: "ring", value: "ring-1 ring-overlay-ink-8" },
        { state: "default", slot: "Sheet", property: "shadow", value: "[filter:drop-shadow(0_2px_4px_#00000014)]" },
        {
          state: "zoom change",
          slot: "Sheet",
          property: "transition",
          value: "transition-[scale] duration-220 ease-out-quint",
          note: {
            ko: "위쪽 모서리를 기준으로 배율만 바뀌므로 글이 다시 흐르지 않습니다.",
            en: "Only the scale changes, from the top edge, so the text never reflows.",
          },
        },
        { state: "Highlight · sky", slot: "ExtractHighlight", property: "border", value: "border-accent-sky-500-90 bg-accent-sky-500-12" },
        { state: "Highlight · brand", slot: "ExtractHighlight", property: "border", value: "border-accent-sky-700-90 bg-accent-sky-700-12" },
        { state: "Highlight · neutral", slot: "ExtractHighlight", property: "border", value: "border-text-placeholder-90 bg-text-placeholder-12" },
        { state: "Highlight · ink", slot: "ExtractHighlight", property: "border", value: "border-interactive-primary bg-overlay-ink-12" },
        { state: "default", slot: "ExtractHighlight", property: "radius", value: "rounded-sm" },
        { state: "default", slot: "ExtractHighlight", property: "border width", value: "border-[1.2px]" },
      ],
    },
    {
      id: "fields-view",
      title: { ko: "필드 보기", en: "Fields view" },
      rows: [
        { state: "default", slot: "Extract button", property: "height", value: "h-7.5" },
        { state: "default", slot: "Extract button", property: "background", value: "bg-overlay-ink-6" },
        { state: "Extract · hover", slot: "Extract button", property: "background", value: "bg-overlay-ink-10" },
        { state: "default", slot: "Extract button", property: "font", value: "text-label-sm text-text-primary" },
        { state: "default", slot: "Summary", property: "font", value: "text-body-sm text-text-secondary" },
        { state: "default", slot: "Group heading", property: "dot", value: "size-1.75 rounded-full bg-sky-500" },
        { state: "default", slot: "Group heading", property: "font", value: "text-label-md text-text-primary" },
        { state: "default", slot: "Field label", property: "width", value: "w-25" },
        { state: "default", slot: "Field label", property: "font", value: "text-body-sm text-text-secondary" },
        { state: "default", slot: "Field value", property: "height", value: "h-9" },
        { state: "default", slot: "Field value", property: "radius", value: "rounded-[10px]" },
        { state: "default", slot: "Field value", property: "background", value: "bg-overlay-ink-4 border-transparent" },
        { state: "default", slot: "Field value", property: "font", value: "text-body-sm text-text-primary" },
        { state: "Field · check", slot: "Field value", property: "border", value: "border-border-danger" },
        { state: "Field · check", slot: "Field value", property: "background", value: "bg-overlay-ink-12" },
        { state: "Field · check hover", slot: "Field value", property: "background", value: "bg-overlay-ink-14" },
        { state: "Field · check", slot: "Field value", property: "caption", value: "text-caption text-text-danger" },
        { state: "Field · resolved", slot: "Field value", property: "icon", value: "size-3.5 animate-pop-in" },
        { state: "default", slot: "Field type", property: "width", value: "w-14" },
        { state: "default", slot: "Field type", property: "font", value: "text-caption text-text-secondary" },
        { state: "row entrance", slot: "Field row", property: "motion", value: "motion-rise" },
        { state: "row entrance", slot: "Field row", property: "stagger", value: "30ms per row" },
        { state: "default", slot: "Table", property: "border", value: "border border-overlay-ink-10" },
        { state: "default", slot: "Table", property: "radius", value: "rounded-[10px]" },
        { state: "default", slot: "Table", property: "padding", value: "px-3 py-0.5" },
        { state: "default", slot: "Table heading", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Table cell", property: "font", value: "text-caption text-text-primary" },
      ],
    },
    {
      id: "views-footer",
      title: { ko: "JSON·Schema 보기와 바닥", en: "JSON, Schema and the footer" },
      rows: [
        { state: "JSON", slot: "Code block", property: "background", value: "bg-overlay-ink-4" },
        { state: "JSON", slot: "Code block", property: "radius", value: "rounded-[10px]" },
        { state: "JSON", slot: "Code block", property: "font", value: "font-mono text-caption" },
        { state: "JSON", slot: "Code block", property: "motion", value: "animate-slide-shift-next" },
        { state: "Schema", slot: "List row", property: "font", value: "text-body-sm text-text-primary" },
        { state: "Schema", slot: "Type badge", property: "background", value: "bg-overlay-ink-6 px-1.5 py-px" },
        { state: "Schema", slot: "Type badge", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Footer", property: "padding", value: "px-5 py-3" },
        { state: "default", slot: "Footer", property: "gap", value: "gap-3" },
        { state: "default", slot: "Footer dot", property: "size", value: "size-2 rounded-full" },
        { state: "Footer dot · filled", slot: "Footer", property: "background", value: "bg-sky-500" },
        { state: "Footer dot · to check", slot: "Footer", property: "background", value: "bg-red-500" },
        { state: "default", slot: "Footer count", property: "font", value: "text-body-sm text-text-secondary" },
        { state: "default", slot: "Bot avatar", property: "size", value: "size-5 rounded-[5px]" },
        { state: "default", slot: "Bot credit", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Accept all", property: "height", value: "h-7.5" },
        { state: "default", slot: "Accept all", property: "background", value: "bg-interactive-primary text-text-inverse" },
        { state: "Accept all · hover", slot: "Accept all", property: "background", value: "bg-interactive-primary-hover" },
        { state: "default", slot: "Accept all", property: "font", value: "text-label-sm" },
        { state: "pressed", slot: "Button", property: "motion", value: "motion-press" },
        { state: "view change", slot: "Body", property: "motion", value: "motion-rise" },
      ],
    },
  ],
  examples: [
    {
      id: "fields",
      title: { ko: "필드 보기", en: "Fields view" },
      description: {
        ko: "청구서 한 장과 두 구획의 필드를 나란히 두었습니다. 만기일 행 하나만 check로 두어 확인 버튼이 됩니다.",
        en: "One invoice page beside fields in two groups. A single due date row is marked check and turns into a confirm button.",
      },
    },
    {
      id: "tables",
      title: { ko: "표가 있는 추출", en: "Extraction with a table" },
      description: {
        ko: "품목을 표로 받고 숫자 열은 오른쪽으로 맞췄습니다. 아래 필드 하나는 check로 남아 있습니다.",
        en: "Line items arrive as a table with right-aligned number columns. One field below stays marked check.",
      },
    },
    {
      id: "highlight",
      title: { ko: "시트 위 표시", en: "Marks on the sheet" },
      description: {
        ko: "ExtractHighlight의 네 tone을 한 시트에 놓아 읽은 값과 참고 표시를 구분했습니다.",
        en: "All four ExtractHighlight tones on one sheet separate read values from notes.",
      },
    },
    {
      id: "footer",
      title: { ko: "확대와 바닥", en: "Zoom and footer" },
      description: {
        ko: "defaultZoom을 100으로 키우고 봇 크레딧과 Accept all을 붙였습니다. 파일 이름은 버튼이 됩니다.",
        en: "defaultZoom starts at 100, the bot credit and Accept all sit in the footer, and the file name is a button.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "확인이 필요한 값 행은 이름이 붙은 버튼입니다. Confirm <라벨> 형태의 aria-label을 스스로 붙이므로 라벨을 따로 넘길 필요가 없습니다. 확인이 끝난 행의 버튼은 disabled가 됩니다.",
        en: "A row that needs confirmation is a button with a name. The panel supplies an aria-label of the form Confirm <label>, so no extra label is needed. Once resolved, the button is disabled.",
      },
      {
        ko: "확대·축소 버튼은 아이콘만 있으므로 Zoom out과 Zoom in이라는 aria-label을 씁니다. 경계에 닿으면 disabled가 되어 눌러도 반응하지 않습니다.",
        en: "The zoom buttons are icon-only and carry the aria-labels Zoom out and Zoom in. At a limit they become disabled and stop responding.",
      },
      {
        ko: "바닥의 점은 aria-hidden 장식이고, 같은 내용을 채움 개수와 확인 대기 개수 문장으로 함께 적습니다. 색만으로 상태를 전달하지 않습니다.",
        en: "The footer dots are aria-hidden decoration, and the same facts appear in the filled and to check sentence. No state relies on colour alone.",
      },
      {
        ko: "탭은 tablist이고 화살표로 선택과 포커스가 함께 옮겨집니다. 보기를 바꾸면 본문이 다시 올라오므로 동작 줄이기를 켜면 즉시 나타납니다.",
        en: "The view tabs are a tablist and the arrow keys move selection and focus together. A new view rises in, and with reduced motion it appears at once.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "파일 이름, 확대 조절기, Fit, 탭, 확인 대기 행, Accept all 순서로 이동합니다.",
          en: "Moves through the file name, zoom controls, Fit, the tabs, unresolved rows and Accept all.",
        },
      },
      {
        keys: ["ArrowLeft"],
        action: { ko: "보기 탭에서 이전 보기를 고릅니다.", en: "Selects the previous view tab." },
      },
      {
        keys: ["ArrowRight"],
        action: { ko: "보기 탭에서 다음 보기를 고릅니다.", en: "Selects the next view tab." },
      },
      {
        keys: ["Enter"],
        action: {
          ko: "포커스가 닿은 확인 행이나 버튼을 실행합니다. 확인 행은 그 값 하나를 확인 처리합니다.",
          en: "Runs the focused confirm row or button. A confirm row accepts that one value.",
        },
      },
      {
        keys: ["Space"],
        action: { ko: "포커스가 닿은 버튼을 실행합니다.", en: "Runs the focused button." },
      },
    ],
    pattern: {
      label: "WAI-ARIA Tabs Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
    },
  },
};
