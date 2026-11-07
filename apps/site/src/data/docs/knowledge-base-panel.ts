/**
 * Reference doc for `Knowledge Base Panel`, written against
 * `packages/react/src/components/knowledge-base-panel.tsx` and
 * `packages/flutter/lib/src/components/knowledge_base_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "knowledge-base-panel",
  anatomy: {
    description: {
      ko: "Knowledge Base Panel은 지식 소스 묶음의 색인 상태를 한 판에 보여 줍니다. 위에서부터 제목과 소스 수, 설정과 Add source 버튼, 알약 탭, 단계 이름표가 있는 표 머리, 소스 줄 목록, 그리고 파일을 떨어뜨리는 점선 상자가 차례로 놓입니다.",
      en: "Knowledge Base Panel shows the indexing state of a group of knowledge sources in one frame: the title and source count, the settings and Add source buttons, the pill tabs, a table head with the stage names, the list of source rows, and a dashed drop zone.",
    },
    parts: [
      {
        name: "Panel",
        slot: "KnowledgeBasePanel",
        description: {
          ko: "24px 라운드의 surface 판입니다. 최대 폭이 800px이라 넓은 화면에서도 소스 줄이 한 줄로 읽힙니다.",
          en: "A 24px-radius surface panel capped at 800px, so source rows stay readable on a wide screen.",
        },
      },
      {
        name: "Header",
        slot: "title · meta",
        description: {
          ko: "제목은 h3 한 줄로 자르고, 그 아래 meta에 소스 수와 청크 수를 caption으로 적습니다. 오른쪽에 설정 아이콘 버튼과 Add source 버튼이 붙습니다.",
          en: "The title is cut to one h3 line with the source and chunk counts as a caption under it. The settings icon button and the Add source button sit at the right.",
        },
      },
      {
        name: "Tab tray",
        slot: "tabs",
        description: {
          ko: "소스 목록과 검색 시험 같은 보기를 바꾸는 알약 탭입니다. 탭마다 이름 앞에 개수를 caption으로 붙일 수 있고, 오른쪽에는 도는 색인 수가 나옵니다.",
          en: "The pill tabs that switch views such as the source list and a retrieval test. Each tab can carry a count after its name, and the running index count appears at the right.",
        },
      },
      {
        name: "Table head",
        slot: "stages",
        description: {
          ko: "단계 이름 네 개를 소스 줄의 막대 위치에 맞춰 놓은 caption 줄입니다. 좁은 화면에서는 감춥니다.",
          en: "A caption row that lines the four stage names up with the bars in the source rows. Hidden on narrow widths.",
        },
      },
      {
        name: "Source list",
        slot: "children",
        description: {
          ko: "Source Row를 목록 변형으로 쌓는 자리입니다. 패널이 이미 카드이므로 줄은 구분선만 그립니다.",
          en: "Where Source Row rows stack in the list variant. The panel is already a card, so the rows draw only dividers.",
        },
      },
      {
        name: "Drop zone",
        slot: "onFiles",
        description: {
          ko: "점선 테두리의 파일 상자입니다. 클릭하면 파일 선택기가 열리고 드래그도 받습니다. onFiles를 넘겼을 때만 그려집니다.",
          en: "The dashed file box: clicking opens the picker and dragging drops files. It renders only when onFiles is passed.",
        },
      },
    ],
  },
  properties: [
    {
      id: "tabs",
      title: { ko: "tabs", en: "tabs" },
      description: {
        ko: "알약 탭 목록입니다. id가 탭의 값이자 key이고, count를 넘기면 이름 옆에 개수가 붙습니다. 첫 탭이 선택된 채로 시작합니다.",
        en: "The pill tabs. id is both the tab's value and its key, and count adds a number after the name. The first tab starts selected.",
      },
      example: "tabs",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "지금 선택된 탭 id입니다. 값을 넘기면 제어 상태가 되고, 넘기지 않으면 패널이 선택을 스스로 들고 있습니다. defaultValue는 비제어일 때 첫 선택을 정합니다.",
        en: "The selected tab id. Passing it makes the panel controlled; without it the panel holds the selection itself, and defaultValue sets the first one.",
      },
      example: "tabs",
    },
    {
      id: "indexing",
      title: { ko: "indexing", en: "indexing" },
      description: {
        ko: "지금 색인 중인 소스 수입니다. 0보다 크면 탭 줄 오른쪽에 스피너와 \"N indexing\"이 나타나고, 0이면 그 자리가 접힙니다.",
        en: "How many sources are indexing now. Above zero, a spinner and \"N indexing\" appear at the right of the tab row; at zero the slot collapses.",
      },
      example: "sources",
    },
    {
      id: "onFiles",
      title: { ko: "onFiles", en: "onFiles" },
      description: {
        ko: "드롭존에 떨어뜨리거나 Browse로 고른 파일을 받습니다. 이 함수를 넘겨야 드롭존이 그려지고, 고른 뒤 입력 값은 매번 비워져 같은 파일을 다시 고를 수 있습니다.",
        en: "Receives the files dropped on the zone or picked through Browse. The zone exists only when this is passed, and the input is cleared after each pick so the same file can be chosen twice.",
      },
      example: "sources",
    },
    {
      id: "dropTitle",
      title: { ko: "dropTitle", en: "dropTitle" },
      description: {
        ko: "드롭존의 첫 줄입니다. 무엇을 할 수 있는지 짧게 말하고, 기본값은 Drop files here, or browse입니다.",
        en: "The first line of the drop zone: what can be done here. It defaults to Drop files here, or browse.",
      },
      example: "empty",
    },
    {
      id: "dropHint",
      title: { ko: "dropHint", en: "dropHint" },
      description: {
        ko: "드롭존의 둘째 줄입니다. 받는 형식과 Add source로만 추가되는 출처를 적습니다. 실제로 받지 않는 형식을 적으면 사람이 그 형식을 기대하게 됩니다.",
        en: "The second line: the accepted formats and the sources that only arrive through Add source. Naming a format you do not accept sets the wrong expectation.",
      },
      example: "empty",
    },
    {
      id: "stages",
      title: { ko: "stages", en: "stages" },
      description: {
        ko: "표 머리에 그릴 단계 이름 네 개입니다. 순서가 소스 줄의 막대 순서와 같아야 하므로, 이름을 바꿔도 parse, chunk, embed, index 자리는 옮기지 않습니다.",
        en: "The four stage names drawn in the table head. Their order matches the bars in the source rows, so rename them without moving the parse, chunk, embed and index slots.",
      },
      example: "tabs",
    },
    {
      id: "meta",
      title: { ko: "meta", en: "meta" },
      description: {
        ko: "제목 아래 caption 줄입니다. 소스 수와 청크 수처럼 이 지식 베이스의 규모를 적고, 비우면 줄이 사라집니다.",
        en: "The caption under the title: the scale of the knowledge base, such as sources and chunks. Leaving it out drops the line.",
      },
      example: "sources",
    },
    {
      id: "onAddSource",
      title: { ko: "onAddSource", en: "onAddSource" },
      description: {
        ko: "Add source 버튼이 부르는 함수입니다. 버튼은 항상 그려지므로 넘기지 않으면 눌러도 아무 일이 일어나지 않습니다.",
        en: "Called by the Add source button. The button always renders, so without this handler pressing it does nothing.",
      },
      example: "sources",
    },
    {
      id: "onSettings",
      title: { ko: "onSettings", en: "onSettings" },
      description: {
        ko: "오른쪽 위 설정 아이콘 버튼이 부르는 함수입니다. 이 버튼도 항상 그려지고, 아이콘만 있으므로 이름은 컴포넌트가 Knowledge base settings로 붙입니다.",
        en: "Called by the settings icon button at the top right. That button also always renders, and since it is icon-only the component names it Knowledge base settings.",
      },
      example: "sources",
    },
  ],
  guidelines: [
    {
      id: "dropzone-needs-a-handler",
      title: { ko: "드롭존은 onFiles로 켭니다", en: "The drop zone comes with onFiles" },
      body: {
        ko: "드롭존은 onFiles를 넘겼을 때만 그려집니다. 반대로 파일을 받을 곳이 없는 화면에서는 넘기지 않아 점선 상자가 사라지게 합니다. 상자를 띄워 두고 아무것도 받지 않는 상태가 가장 나쁩니다.",
        en: "The drop zone renders only with onFiles. Conversely, a screen that accepts no files should omit it so the dashed box disappears. A box that opens and accepts nothing is the worst case.",
      },
      do: {
        ko: "업로드를 처리할 수 있으면 onFiles를 넘기고, 아니면 넘기지 않습니다.",
        en: "Pass onFiles when uploads are handled, and leave it out when they are not.",
      },
      dont: {
        ko: "빈 함수를 넘겨 드롭존만 띄우지 않습니다.",
        en: "Do not pass an empty function just to show the zone.",
      },
      example: "tabs",
    },
    {
      id: "one-tab-per-view",
      title: { ko: "탭은 보기 하나에 하나", en: "One tab per view" },
      body: {
        ko: "탭은 같은 지식 베이스를 다른 각도로 보는 자리입니다. 소스 목록과 검색 시험처럼 실제로 다른 내용이 나올 때만 탭을 늘리고, 걸러 보기라면 탭이 아니라 목록 위 필터로 처리합니다.",
        en: "Tabs show the same knowledge base from another angle. Add one only when the content really differs, as a source list and a retrieval test do; for narrowing the same list, use a filter above it instead.",
      },
      do: {
        ko: "Sources와 Test retrieval처럼 다른 내용을 보여 주는 두 탭을 둡니다.",
        en: "Keep two tabs that show different content, such as Sources and Test retrieval.",
      },
      dont: {
        ko: "\"PDF\"와 \"웹사이트\"를 탭으로 나눠 같은 목록을 두 번 그리지 않습니다.",
        en: "Do not split PDF and Website into tabs that draw the same list twice.",
      },
      example: "tabs",
    },
    {
      id: "counts-stay-honest",
      title: { ko: "개수는 목록과 맞춥니다", en: "Counts match the list" },
      body: {
        ko: "탭의 count, meta의 소스 수, 그리고 실제 줄 수는 같은 값을 말해야 합니다. 파일을 더 받았는데 숫자가 그대로면 사람은 색인이 시작되지 않았다고 읽습니다.",
        en: "The tab count, the source count in meta and the number of rows must agree. A number that stays put after a file lands reads as indexing that never started.",
      },
      do: {
        ko: "파일을 받으면 목록, count, meta를 같은 갱신에서 함께 늘립니다.",
        en: "When a file arrives, grow the list, the count and meta in the same update.",
      },
      dont: {
        ko: "새 소스를 목록에만 넣고 숫자는 그대로 두지 않습니다.",
        en: "Do not add a source to the list and leave the numbers behind.",
      },
      example: "sources",
    },
    {
      id: "rows-in-list-variant",
      title: { ko: "줄은 목록 변형으로", en: "Rows use the list variant" },
      body: {
        ko: "패널이 이미 surface 카드이므로 안에 넣는 Source Row는 variant=\"list\"를 씁니다. 카드형 줄을 넣으면 테두리가 두 겹이 되고 표 머리와 막대 위치도 어긋납니다.",
        en: "The panel is already a surface card, so Source Rows inside it take variant=\"list\". Card rows double the border and knock the bars out of line with the table head.",
      },
      do: {
        ko: "자식으로 variant=\"list\"인 Source Row만 넣습니다.",
        en: "Put only variant=\"list\" Source Rows in as children.",
      },
      dont: {
        ko: "패널 안에서 카드형 줄을 쌓지 않습니다.",
        en: "Do not stack card rows inside the panel.",
      },
      example: "sources",
    },
  ],
  specification: [
    {
      id: "panel-frame",
      title: { ko: "패널 틀", en: "Panel frame" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "KnowledgeBasePanel", property: "radius", value: "24px" },
        { state: "default", slot: "KnowledgeBasePanel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "KnowledgeBasePanel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "KnowledgeBasePanel", property: "padding", value: "px-5 py-4.5" },
        { state: "default", slot: "KnowledgeBasePanel", property: "gap", value: "12px" },
        { state: "default", slot: "KnowledgeBasePanel", property: "max width", value: "800px" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Meta", property: "font", value: "text-caption" },
        { state: "default", slot: "Meta", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Settings button", property: "size", value: "30px" },
        { state: "default", slot: "Settings button", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Settings button", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Settings icon", property: "size", value: "16px" },
        { state: "hover", slot: "Settings button", property: "background", value: "bg-overlay-ink-10" },
        { state: "focus-visible", slot: "Settings button", property: "outline", value: "2px outline-text-brand" },
        { state: "default", slot: "Add source button", property: "height", value: "30px" },
        { state: "default", slot: "Add source button", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Add source button", property: "padding", value: "pr-2.5 pl-3" },
        { state: "default", slot: "Add source button", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Add source icon", property: "size", value: "14px" },
        { state: "default", slot: "Add source caret", property: "size", value: "12px" },
      ],
    },
    {
      id: "tabs-and-head",
      title: { ko: "탭과 표 머리", en: "Tabs and table head" },
      rows: [
        { state: "default", slot: "Tab tray", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Tab tray", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "Tab tray", property: "padding", value: "3px" },
        { state: "default", slot: "Tab", property: "height", value: "30px" },
        { state: "default", slot: "Tab", property: "padding", value: "px-3" },
        { state: "default", slot: "Tab", property: "font", value: "text-label-md" },
        { state: "selected", slot: "Tab", property: "text color", value: "text-text-primary" },
        { state: "unselected", slot: "Tab", property: "text color", value: "text-text-secondary" },
        {
          state: "selected indicator",
          slot: "Tab tray",
          property: "background",
          value: "bg-overlay-ink-10",
          note: {
            ko: "선택 표시가 탭 사이를 280ms로 이동합니다.",
            en: "The selection slides between tabs over 280ms.",
          },
        },
        { state: "default", slot: "Tab count", property: "font", value: "text-caption" },
        { state: "default", slot: "Indexing label", property: "font", value: "text-caption" },
        { state: "default", slot: "Indexing label", property: "text color", value: "text-text-secondary" },
        {
          state: "indexing > 0",
          slot: "Indexing slot",
          property: "motion",
          value: "motion-reveal-x",
          note: {
            ko: "0이면 가로로 접혀 자리를 차지하지 않습니다.",
            en: "At zero it collapses horizontally and takes no room.",
          },
        },
        { state: "default", slot: "Table head", property: "font", value: "text-caption" },
        { state: "default", slot: "Table head", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Table head", property: "padding", value: "px-2 pt-2 pb-1" },
        { state: "narrow width", slot: "Table head", property: "display", value: "hidden" },
        { state: "default", slot: "Stage label cell", property: "size", value: "16px × 44px" },
        { state: "default", slot: "Trailing cell", property: "width", value: "72px" },
      ],
    },
    {
      id: "dropzone",
      title: { ko: "드롭존", en: "Drop zone" },
      rows: [
        { state: "default", slot: "Drop zone", property: "radius", value: "rounded-2xl" },
        { state: "default", slot: "Drop zone", property: "border", value: "1px border-dashed border-overlay-ink-18" },
        { state: "default", slot: "Drop zone", property: "background", value: "transparent" },
        { state: "default", slot: "Drop zone", property: "padding", value: "px-4.5 py-4" },
        { state: "default", slot: "Drop zone", property: "gap", value: "12px" },
        { state: "dragging", slot: "Drop zone", property: "border", value: "1px border-dashed border-border-focus" },
        { state: "dragging", slot: "Drop zone", property: "background", value: "bg-bg-brand" },
        {
          state: "dragging",
          slot: "Drop zone",
          property: "motion",
          value: "motion-colors",
          note: {
            ko: "테두리와 바탕이 150ms로 바뀝니다.",
            en: "Border and fill change over 150ms.",
          },
        },
        {
          state: "focus-visible",
          slot: "Drop zone",
          property: "outline",
          value: "2px outline-text-brand",
          note: {
            ko: "안쪽 파일 입력이 포커스를 받으면 상자 전체에 그립니다.",
            en: "Drawn around the whole box when the hidden file input takes focus.",
          },
        },
        { state: "default", slot: "Upload icon", property: "size", value: "18px" },
        { state: "default", slot: "Upload icon", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Drop title", property: "font", value: "text-label-md" },
        { state: "default", slot: "Drop title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Drop hint", property: "font", value: "text-caption" },
        { state: "default", slot: "Drop hint", property: "text color", value: "text-text-secondary" },
        {
          state: "default",
          slot: "File input",
          property: "visibility",
          value: "sr-only",
          note: {
            ko: "multiple 입력이라 한 번에 여러 파일을 고를 수 있습니다.",
            en: "The input is multiple, so several files can be picked at once.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "sources",
      title: { ko: "소스 목록", en: "Source list" },
      description: {
        ko: "탭, 색인 수, 소스 줄 세 개, 드롭존을 모두 담았습니다. 파일을 떨어뜨리면 새 줄이 parse 단계로 붙습니다.",
        en: "Tabs, the indexing count, three source rows and the drop zone. Dropping a file adds a row still in the parse stage.",
      },
    },
    {
      id: "tabs",
      title: { ko: "제어 탭", en: "Controlled tabs" },
      description: {
        ko: "선택된 탭을 밖에서 들고 meta를 탭에 맞춰 바꾸는 패널입니다. onFiles를 넘기지 않아 드롭존이 없습니다.",
        en: "A panel that holds the selected tab outside and changes meta with it. Without onFiles the drop zone is absent.",
      },
    },
    {
      id: "empty",
      title: { ko: "빈 지식 베이스", en: "Empty knowledge base" },
      description: {
        ko: "소스가 하나도 없는 상태입니다. 목록 없이 제목, 탭, 드롭존만 남아 첫 파일을 기다립니다.",
        en: "No sources yet: only the title, tabs and drop zone wait for the first file.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "드롭존은 label이 감싼 파일 입력이라 클릭과 드래그가 모두 파일 선택으로 이어집니다. 입력은 화면에서만 숨고 포커스를 받을 수 있어 Tab으로 도달하고, 포커스가 닿으면 상자 전체에 outline이 그려집니다.",
        en: "The drop zone is a label wrapping a file input, so clicking and dragging both lead to a file pick. The input is only visually hidden and stays focusable, and the whole box draws an outline when it takes focus.",
      },
      {
        ko: "설정 버튼은 아이콘만 있어 컴포넌트가 aria-label=\"Knowledge base settings\"를 붙입니다. Add source는 화면에 글자가 있으므로 이름을 따로 주지 않습니다.",
        en: "The settings button is icon-only, so the component names it with aria-label=\"Knowledge base settings\". Add source has visible text and needs no extra name.",
      },
      {
        ko: "탭은 role=\"tab\"과 aria-selected를 쓰고 선택된 탭만 탭 순서에 남습니다. 아래 목록과는 aria-controls로 연결되어 있지 않으므로, 패널을 쓸 때 목록 영역이 어느 탭의 내용인지 화면에서 분명히 하거나 직접 연결합니다.",
        en: "The tabs use role=\"tab\" and aria-selected, keeping only the selected tab in the tab order. They are not wired to the list with aria-controls, so make the list's ownership clear on screen or connect it yourself.",
      },
      {
        ko: "\"N indexing\"은 라이브 영역이 아닙니다. 색인이 끝났다는 사실을 읽어 줘야 하면 목록 밖에 별도의 라이브 영역을 두어 같은 사실을 알립니다.",
        en: "\"N indexing\" is not a live region. When the end of indexing must be spoken, add your own live region outside the list with the same fact.",
      },
      {
        ko: "동작 줄이기를 켜면 탭 표시의 이동, 드롭존 색 전환, 색인 수 공개가 즉시 끝납니다.",
        en: "Under reduced motion the tab indicator, the drop zone colors and the indexing slot reveal finish instantly.",
      },
    ],
    keyboard: [
      { keys: ["Tab"], action: { ko: "설정, Add source, 선택된 탭, 파일 입력 순서로 이동합니다.", en: "Moves to settings, Add source, the selected tab, then the file input." } },
      { keys: ["ArrowLeft", "ArrowRight"], action: { ko: "탭 사이를 옮겨 다니며 선택을 바꿉니다.", en: "Moves between tabs and changes the selection." } },
      { keys: ["Enter"], action: { ko: "파일 입력에서 파일 선택기를 엽니다.", en: "Opens the file picker from the file input." } },
      { keys: ["Space"], action: { ko: "파일 입력에서 파일 선택기를 엽니다.", en: "Opens the file picker from the file input." } },
    ],
  },
};
