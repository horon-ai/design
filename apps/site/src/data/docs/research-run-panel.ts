/**
 * Reference doc for `ResearchRunPanel`, written against
 * `packages/react/src/components/research-run-panel.tsx` and
 * `packages/flutter/lib/src/components/research_run_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "research-run-panel",
  anatomy: {
    description: {
      ko: "ResearchRunPanel은 리서치 질문 하나와 그 실행의 진행 상황을 함께 보여 줍니다. 질문은 오른쪽 말풍선으로, 진행 상태와 검색어는 그 아래에, 후속 질문 입력은 맨 아래에 놓입니다.",
      en: "ResearchRunPanel shows one research question with the progress of its run. The question sits right-aligned as a bubble, the status and queries follow, and the follow-up input closes the panel.",
    },
    parts: [
      {
        name: "Panel",
        slot: "section",
        description: {
          ko: "패널 전체를 감싸는 section입니다. 24px 모서리에 최대 너비가 600px입니다.",
          en: "The section wrapping the panel, with a 24px radius and a 600px maximum width.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "돋보기 아이콘과 제목, 그리고 새 리서치를 시작하는 버튼이 한 줄에 놓입니다. 버튼은 핸들러가 없어도 렌더링됩니다.",
          en: "The magnifier, the title and the button that starts a new run share a row. The button renders even without a handler.",
        },
      },
      {
        name: "Question",
        slot: "question",
        description: {
          ko: "오른쪽으로 붙은 사용자 말풍선입니다. 패널 폭의 85%까지만 넓어집니다.",
          en: "The user bubble, aligned right. It grows to no more than 85% of the panel width.",
        },
      },
      {
        name: "Status line",
        slot: "statusLabel",
        description: {
          ko: "스피너, 상태 문구, 깜박이는 캐럿, 경과 시간과 읽은 수가 한 줄에 놓입니다. running이 false이면 줄 전체가 접힙니다.",
          en: "A spinner, the status label, a blinking caret, the elapsed time and the read count on one line. With running false the whole line collapses.",
        },
      },
      {
        name: "Query list",
        slot: "queries",
        description: {
          ko: "세로 레일 위에 검색어를 한 줄씩 쌓습니다. 진행 중인 검색어는 스피너와 흐린 글자로, 끝난 검색어는 체크로 표시합니다.",
          en: "Queries stacked on a vertical rail, one per row. A searching query takes a spinner and muted text; a finished one takes a check.",
        },
      },
      {
        name: "Sources pill",
        slot: "sources",
        description: {
          ko: "읽은 출처를 겹친 아바타로 보여 주는 알약입니다. read와 total이 있으면 개수 라벨이 되고, onOpenSources를 넘기면 버튼이 됩니다.",
          en: "The pill showing read sources as stacked avatars. With read and total it becomes a count, and with onOpenSources it becomes a button.",
        },
      },
      {
        name: "Follow-up field",
        slot: "onFollowUp",
        description: {
          ko: "맨 아래의 입력 줄입니다. 제출하면 입력값을 onFollowUp에 넘기고 필드를 비웁니다.",
          en: "The input row at the bottom. Submitting hands the value to onFollowUp and clears the field.",
        },
      },
      {
        name: "Run button",
        slot: "running",
        description: {
          ko: "입력 줄 끝의 둥근 버튼입니다. running이면 정지 아이콘과 Stop 이름으로 멈추고, 아니면 화살표와 Send 이름으로 제출합니다.",
          en: "The round button at the end of the input row. While running it shows a stop glyph and is named Stop; otherwise an arrow and the name Send submit the field.",
        },
      },
    ],
  },
  properties: [
    {
      id: "question",
      title: { ko: "question", en: "question" },
      description: {
        ko: "패널이 보여 주는 리서치 질문입니다. 이미 물어본 내용이므로 사용자 말풍선으로 오른쪽에 붙습니다.",
        en: "The research question the panel presents. It has already been asked, so it sits right-aligned in a user bubble.",
      },
      example: "running",
    },
    {
      id: "running",
      title: { ko: "running", en: "running" },
      description: {
        ko: "실행이 진행 중인지 정합니다. 참이면 상태 줄과 캐럿이 보이고 버튼이 Stop이 되며, 거짓이면 상태 줄이 접히고 버튼이 Send로 바뀝니다. 기본값은 참입니다.",
        en: "Whether the run is in progress. True shows the status line and caret and makes the button Stop; false collapses the status line and turns the button into Send. The default is true.",
      },
      example: "sources",
    },
    {
      id: "statusLabel",
      title: { ko: "statusLabel", en: "statusLabel" },
      description: {
        ko: "상태 줄 앞의 문구입니다. 지금 하는 일을 현재형으로 적고, 기본값은 Researching입니다.",
        en: "The label in front of the status line, written in the present tense. The default is Researching.",
      },
      example: "follow-up",
    },
    {
      id: "elapsed",
      title: { ko: "elapsed", en: "elapsed" },
      description: {
        ko: "상태 문구 뒤에 붙는 경과 시간입니다. read와 total이 함께 있으면 가운뎃점으로 이어 두 값을 같은 줄에 놓습니다.",
        en: "The elapsed time after the status label. With read and total it joins both values on the same line with a middot.",
      },
      example: "running",
    },
    {
      id: "read",
      title: { ko: "read", en: "read" },
      description: {
        ko: "지금까지 읽은 페이지 수입니다. total과 함께 넘겨야 N of M read 문구와 출처 알약의 개수 라벨이 나타납니다. 하나만 넘기면 둘 다 표시되지 않습니다.",
        en: "Pages read so far. It needs total beside it for the N of M read line and the sources pill count. Either one alone shows nothing.",
      },
      example: "sources",
    },
    {
      id: "queries",
      title: { ko: "queries", en: "queries" },
      description: {
        ko: "실행하면서 던진 검색어 목록입니다. state가 searching이면 스피너와 흐린 글자로, 그 밖의 값이면 체크와 본문 색으로 그립니다. results를 넣으면 줄 끝에 결과 수가 붙습니다.",
        en: "The queries the run has issued. A state of searching draws a spinner and muted text; any other value draws a check and body color. results adds the count at the row end.",
      },
      values: [
        {
          name: "searching",
          description: {
            ko: "지금 찾고 있는 검색어입니다. 스피너가 돌고 결과 수는 아직 없습니다.",
            en: "The query being searched now: a spinner runs and there is no result count yet.",
          },
        },
        {
          name: "done",
          description: {
            ko: "끝난 검색어입니다. 체크가 붙고 결과 수를 함께 적습니다. 값을 생략해도 이 모양이 됩니다.",
            en: "A finished query: a check plus its result count. Omitting the value gives this shape too.",
          },
        },
      ],
      example: "running",
    },
    {
      id: "sources",
      title: { ko: "sources", en: "sources" },
      description: {
        ko: "출처 아바타에 넣을 머리 글자 배열입니다. 두 글자보다 짧게 유지하고, 최대 네 개까지 겹쳐도 읽힙니다. 값이 있으면 알약이 팝인으로 나타납니다.",
        en: "The initials for the source avatars. Keep them short; up to four still read when overlapped. With a value the pill pops in.",
      },
      example: "sources",
    },
    {
      id: "onStop",
      title: { ko: "onStop", en: "onStop" },
      description: {
        ko: "running일 때 버튼을 누르면 호출됩니다. 멈춘 뒤에는 호출한 쪽이 running을 false로 바꿔야 버튼이 Send로 돌아갑니다. 패널은 실행 상태를 스스로 들지 않습니다.",
        en: "Called when the button is pressed while running. The caller has to set running false afterwards for the button to return to Send; the panel holds no run state of its own.",
      },
      example: "follow-up",
    },
    {
      id: "onOpenSources",
      title: { ko: "onOpenSources", en: "onOpenSources" },
      description: {
        ko: "출처 알약을 버튼으로 바꿉니다. 핸들러가 없으면 같은 모양의 라벨로만 남습니다.",
        en: "Turns the sources pill into a button. Without the handler it stays a plain label of the same shape.",
      },
      example: "sources",
    },
    {
      id: "onToggleStatus",
      title: { ko: "onToggleStatus", en: "onToggleStatus" },
      description: {
        ko: "상태 줄을 펼치고 접는 버튼으로 만듭니다. 핸들러가 없으면 캐럿 없이 문구만 있는 줄이 됩니다. 어느 쪽이든 aria-live polite로 읽힙니다.",
        en: "Makes the status line an expandable button. Without it the line carries no caret. Either way the line is announced politely.",
      },
      example: "follow-up",
    },
    {
      id: "onFollowUp",
      title: { ko: "onFollowUp", en: "onFollowUp" },
      description: {
        ko: "후속 질문을 제출할 때 입력값을 그대로 받습니다. 패널은 필드를 비우기만 하고 새 말풍선은 그리지 않으므로, 호출한 쪽이 질문을 덧붙여야 합니다.",
        en: "Receives the raw field value on submit. The panel only clears the field and draws no new bubble, so the caller appends the question.",
      },
      example: "follow-up",
    },
    {
      id: "onNewResearch",
      title: { ko: "onNewResearch", en: "onNewResearch" },
      description: {
        ko: "머리의 새 리서치 버튼을 누를 때 호출됩니다. 버튼은 핸들러가 없어도 그려지므로, 준비되지 않았다면 넘기지 않는 편이 낫습니다.",
        en: "Called when the header's new research button is pressed. The button draws even without a handler, so leaving it out is better while the action is not ready.",
      },
      example: "follow-up",
    },
  ],
  guidelines: [
    {
      id: "status-is-present-tense",
      title: { ko: "상태 문구는 지금 하는 일", en: "Describe the current step" },
      body: {
        ko: "statusLabel은 실행이 지금 무엇을 하고 있는지 현재형으로 적습니다. 결과를 미리 단정하는 문구를 넣으면 아직 확인되지 않은 내용을 확정처럼 읽게 됩니다.",
        en: "statusLabel states what the run is doing now. A label that pre-empts the answer reads as a settled result before anything is checked.",
      },
      do: {
        ko: "Reading sources처럼 하는 일을 적습니다.",
        en: "Write what it is doing, such as Reading sources.",
      },
      dont: {
        ko: "Found the answer처럼 결과를 먼저 적지 않습니다.",
        en: "Do not write the result first, such as Found the answer.",
      },
      example: "follow-up",
    },
    {
      id: "one-query-per-row",
      title: { ko: "검색어는 한 줄에 하나", en: "One query per row" },
      body: {
        ko: "queries의 한 항목이 한 줄입니다. 긴 검색어는 잘리므로 핵심 단어만 남기고, 결과 수는 results에 따로 적습니다.",
        en: "One entry of queries is one row, and a long query truncates. Keep the key words and put the count in results.",
      },
      do: {
        ko: "seed round AI agent startup Korea 2026처럼 한 번의 검색을 한 줄로 적습니다.",
        en: "Write one search per line, such as seed round AI agent startup Korea 2026.",
      },
      dont: {
        ko: "세 개의 검색을 한 줄에 쉼표로 이어 붙이지 않습니다.",
        en: "Do not join three searches with commas on one line.",
      },
      example: "running",
    },
    {
      id: "read-needs-total",
      title: { ko: "읽은 수는 전체와 함께", en: "Pair the read count with the total" },
      body: {
        ko: "read만 넘기면 개수 문구가 나타나지 않습니다. 진행률을 보여 주려면 total을 반드시 함께 넘기고, 실제 전체 쪽수를 넣습니다.",
        en: "A read value alone shows no count. Pass total beside it for progress to appear, and make it the real page count.",
      },
      example: "sources",
    },
    {
      id: "panel-holds-no-state",
      title: { ko: "실행 상태는 호출한 쪽이 들고 있습니다", en: "The caller owns the run state" },
      body: {
        ko: "패널은 보여 주기만 하고 실행 상태를 들지 않습니다. Stop을 눌러도 running은 그대로이므로, onStop에서 실행을 끝내고 running을 false로 바꿔 주어야 화면과 실제 상태가 맞습니다.",
        en: "The panel presents and holds no run state. Pressing Stop leaves running as it was, so end the run in onStop and set running false to keep the screen and the real state together.",
      },
      example: "follow-up",
    },
  ],
  specification: [
    {
      id: "header-question",
      title: { ko: "머리와 질문", en: "Header and question" },
      note: {
        ko: "값은 소스 클래스 그대로입니다.",
        en: "Values are the source classes as written.",
      },
      rows: [
        { state: "default", slot: "Panel", property: "radius", value: "rounded-[24px]" },
        { state: "default", slot: "Panel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Panel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Panel", property: "max width", value: "max-w-150" },
        { state: "default", slot: "Header", property: "padding", value: "px-5 pt-4 pb-3.5" },
        { state: "default", slot: "Header", property: "gap", value: "gap-x-2 gap-y-2" },
        { state: "default", slot: "Header icon", property: "size", value: "size-4 text-text-primary" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg text-text-primary" },
        { state: "default", slot: "New research", property: "height", value: "h-7.5" },
        { state: "default", slot: "New research", property: "background", value: "bg-overlay-ink-6" },
        { state: "New research · hover", slot: "New research", property: "background", value: "bg-overlay-ink-10" },
        { state: "default", slot: "New research", property: "font", value: "text-label-sm text-text-primary" },
        { state: "default", slot: "New research", property: "icon", value: "size-3.5" },
        { state: "default", slot: "Body", property: "padding", value: "px-5 pt-4 pb-4" },
        { state: "default", slot: "Body", property: "gap", value: "gap-3" },
        { state: "default", slot: "Question bubble", property: "max width", value: "max-w-[85%]" },
        { state: "default", slot: "Header divider", property: "background", value: "h-px bg-overlay-ink-8" },
        { state: "focus-visible", slot: "Button", property: "outline", value: "2px outline-text-brand" },
      ],
    },
    {
      id: "status-queries",
      title: { ko: "상태 줄과 검색어", en: "Status line and queries" },
      rows: [
        { state: "default", slot: "Status line", property: "gap", value: "gap-x-1.5 gap-y-1" },
        { state: "default", slot: "Status label", property: "font", value: "text-label-md text-text-primary" },
        { state: "default", slot: "Caret", property: "size", value: "h-3 w-0.5" },
        { state: "default", slot: "Caret", property: "background", value: "bg-interactive-primary" },
        { state: "default", slot: "Caret", property: "motion", value: "animate-caret" },
        { state: "default", slot: "Meta", property: "font", value: "text-caption text-text-secondary tabular-nums" },
        { state: "default", slot: "Query rail", property: "width", value: "w-[1.5px] bg-overlay-ink-14" },
        { state: "default", slot: "Query list", property: "gap", value: "gap-2.5" },
        { state: "default", slot: "Query row", property: "gap", value: "gap-2.5" },
        { state: "Query · done", slot: "Query row", property: "text color", value: "text-text-primary" },
        { state: "Query · searching", slot: "Query row", property: "text color", value: "text-text-secondary" },
        { state: "Query · done", slot: "Query row", property: "icon", value: "size-3.5 text-text-secondary" },
        { state: "Query", slot: "Query row", property: "font", value: "text-body-sm" },
        { state: "Query results", slot: "Query row", property: "font", value: "text-caption text-text-secondary" },
        { state: "row entrance", slot: "Query row", property: "motion", value: "motion-rise" },
        { state: "row entrance", slot: "Query row", property: "stagger", value: "30ms per row" },
        { state: "running change", slot: "Status block", property: "motion", value: "motion-reveal" },
      ],
    },
    {
      id: "sources-input",
      title: { ko: "출처와 입력", en: "Sources and input" },
      rows: [
        { state: "default", slot: "Sources pill", property: "height", value: "h-9" },
        { state: "default", slot: "Sources pill", property: "background", value: "bg-overlay-ink-5" },
        { state: "Sources · hover", slot: "Sources pill", property: "background", value: "bg-overlay-ink-8" },
        { state: "default", slot: "Sources pill", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Source avatar", property: "size", value: "size-7 rounded-full" },
        { state: "default", slot: "Source avatar", property: "background", value: "bg-sky-700 text-label-sm text-text-on-ink" },
        { state: "default", slot: "Source avatar", property: "ring", value: "ring-2 ring-bg-surface" },
        { state: "default", slot: "Sources label", property: "font", value: "text-label-md text-text-primary tabular-nums" },
        { state: "sources appear", slot: "Sources pill", property: "motion", value: "animate-pop-in" },
        { state: "default", slot: "Input row", property: "height", value: "h-11" },
        { state: "default", slot: "Input row", property: "background", value: "bg-overlay-ink-5" },
        { state: "input focus", slot: "Input row", property: "background", value: "focus-within:bg-overlay-ink-8" },
        { state: "default", slot: "Input row", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Input row", property: "padding", value: "pl-4 pr-1.5" },
        { state: "default", slot: "Input", property: "font", value: "text-body-sm text-text-primary" },
        { state: "default", slot: "Send button", property: "size", value: "size-8 rounded-full" },
        { state: "default", slot: "Send button", property: "background", value: "bg-interactive-primary text-text-inverse" },
        { state: "running toggle", slot: "Send button", property: "motion", value: "motion-swap" },
        { state: "pressed", slot: "Send button", property: "motion", value: "motion-press" },
      ],
    },
  ],
  examples: [
    {
      id: "running",
      title: { ko: "실행 중", en: "While running" },
      description: {
        ko: "네 개의 검색어 중 셋이 끝나고 하나가 도는 중입니다. 상태 줄에 경과 시간과 읽은 수가 붙습니다.",
        en: "Three of four queries are done and one is searching. The status line carries the elapsed time and the read count.",
      },
    },
    {
      id: "sources",
      title: { ko: "출처 알약", en: "The sources pill" },
      description: {
        ko: "실행이 끝난 상태에서 다섯 출처를 겹친 아바타로 보여 주고, 버튼으로 만들어 출처 목록을 열 수 있게 했습니다.",
        en: "With the run finished, five sources show as stacked avatars behind a button that opens the source list.",
      },
    },
    {
      id: "follow-up",
      title: { ko: "후속 질문", en: "Follow-up" },
      description: {
        ko: "실행 중에는 Stop, 멈춘 뒤에는 Send로 바뀌는 버튼과 후속 질문 입력을 함께 두었습니다. 보낸 값은 아래에 적힙니다.",
        en: "The button is Stop while running and Send afterwards, beside the follow-up field. Sent values are listed below.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "상태 줄은 aria-live polite라 상태 문구가 바뀌면 화면 낭독기가 알려 줍니다. 실행 중에만 존재하는 줄이므로 완료 뒤에는 조용해집니다.",
        en: "The status line is aria-live polite, so a changed label is announced. The line only exists while running, so it falls silent once the run ends.",
      },
      {
        ko: "후속 질문 입력은 placeholder 문구를 aria-label로도 씁니다. 입력 필드 하나뿐인 폼이므로 별도 라벨을 그리지 않지만, 문구는 필드의 목적을 설명해야 합니다.",
        en: "The follow-up field uses its placeholder as its aria-label. The form has one field and draws no visible label, so the text has to name what the field is for.",
      },
      {
        ko: "입력 줄 끝의 버튼은 아이콘만 있고 Stop과 Send라는 이름을 스스로 붙입니다. 상태에 따라 이름이 바뀌므로 스크린 리더도 지금 누르면 무엇이 되는지 알 수 있습니다.",
        en: "The button at the end of the input is icon-only and names itself Stop or Send. The name follows the state, so a screen reader also knows what the press will do.",
      },
      {
        ko: "검색어의 스피너와 체크는 진행 상태를 색이 아니라 아이콘과 글자 색으로 함께 전달합니다. 동작 줄이기를 켜면 캐럿 깜박임과 등장 애니메이션이 멈춥니다.",
        en: "Spinner and check carry the query state with an icon and text color, not colour alone. With reduced motion the caret stops blinking and the entrances play out at once.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "새 리서치 버튼, 상태 줄, 출처 알약, 후속 질문 입력, 실행 버튼 순서로 이동합니다.",
          en: "Moves through the new research button, the status line, the sources pill, the follow-up field and the run button.",
        },
      },
      {
        keys: ["Enter"],
        action: {
          ko: "후속 질문 필드에서 제출하면 onFollowUp을 호출하고 필드를 비웁니다. 실행 중이면 버튼의 동작이 멈추기입니다.",
          en: "Submitting from the field calls onFollowUp and clears it. While running, the button's action is stopping instead.",
        },
      },
      {
        keys: ["Space"],
        action: { ko: "포커스가 닿은 버튼을 실행합니다.", en: "Runs the focused button." },
      },
    ],
  },
};
