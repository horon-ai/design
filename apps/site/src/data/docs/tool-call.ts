/**
 * Reference doc for `Tool Call`, written against
 * `packages/react/src/components/tool-call.tsx` and
 * `packages/flutter/lib/src/components/tool_call.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "tool-call",
  anatomy: {
    description: {
      ko: "Tool Call은 봇이 부른 도구 한 건을 접히는 카드로 보여 줍니다. 머리 줄에는 도구 이름 알약, 한 줄 요약, 상태 아이콘과 걸린 시간이 있고, 펼치면 실패 안내, Arguments, Result 블록이 차례로 나옵니다.",
      en: "Tool Call shows one tool the bot called as a collapsible card: a header with the tool name pill, a one-line summary, the status icon and the elapsed time. Expanded, it adds the failure notice, then the Arguments and Result blocks.",
    },
    parts: [
      {
        name: "Card",
        slot: "ToolCall",
        description: {
          ko: "카드 전체입니다. 16px 라운드와 surface 바탕을 쓰고, 실패하면 테두리가 danger 색으로 바뀝니다.",
          en: "The whole card: a 16px radius and the surface fill, with a danger border once the call fails.",
        },
      },
      {
        name: "Header trigger",
        slot: "Collapsible.Trigger",
        description: {
          ko: "카드를 접고 펴는 버튼입니다. 호버하면 3% 잉크가 깔리고 캐럿이 180도 돌아갑니다.",
          en: "The button that toggles the card. Hover adds 3% ink and the caret turns 180 degrees.",
        },
      },
      {
        name: "Tool pill",
        slot: "tool",
        description: {
          ko: "16px 도구 아이콘과 도구 이름을 담은 6% 잉크 알약입니다. 이름이 길면 알약 안에서 잘립니다.",
          en: "A 6% ink pill with a 16px tool icon and the tool's name, truncated inside the pill when long.",
        },
      },
      {
        name: "Summary",
        slot: "summary",
        description: {
          ko: "보낸 질의나 대상처럼 이 호출이 무엇을 했는지 한 줄로 적습니다. 머리 줄 가운데를 차지하다가 잘립니다.",
          en: "One line on what the call did, such as the query sent or the target. It fills the middle of the header and truncates.",
        },
      },
      {
        name: "Failure notice",
        slot: "error",
        description: {
          ko: "실패했을 때만 나오는 danger 바탕 상자입니다. 오류 문장과, onRetry를 넘겼을 때만 Retry 버튼이 함께 놓입니다.",
          en: "A danger-filled box shown only on failure: the error text, plus a Retry button when onRetry is passed.",
        },
      },
      {
        name: "Arguments block",
        slot: "args",
        description: {
          ko: "Arguments 라벨과 복사 버튼, 그리고 JsonCode로 그린 인자입니다. args가 없으면 이 블록은 통째로 빠집니다.",
          en: "An Arguments label with a copy button and the arguments drawn by JsonCode. Without args the whole block is skipped.",
        },
      },
      {
        name: "Result block",
        slot: "result",
        description: {
          ko: "Result 라벨과 결과 JSON입니다. 아직 도는 중이면 Waiting for result…를, 끝났으면 값을 보여 주고, 실패한 호출에서는 이 블록 대신 실패 안내가 나옵니다.",
          en: "A Result label and the result JSON: Waiting for result… while running, the value once done, and nothing at all on a failed call, where the failure notice takes its place.",
        },
      },
    ],
  },
  properties: [
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "호출의 진행 상태입니다. 상태 아이콘, 테두리 색, 그리고 어떤 블록이 보이는지를 함께 정합니다.",
        en: "Progress of the call. It picks the status icon, the border color and which blocks appear.",
      },
      values: [
        {
          name: "running",
          description: {
            ko: "스피너가 돌고 Result 블록에 Waiting for result…가 적힙니다. 인자는 이미 보여 줄 수 있습니다.",
            en: "A spinner turns and the Result block reads Waiting for result…. The arguments can already be shown.",
          },
        },
        {
          name: "done",
          description: {
            ko: "status-live 색 체크가 붙고 Result 블록에 결과가 그려집니다.",
            en: "A status-live check marks the row and the result is drawn in the Result block.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "테두리가 danger로 바뀌고 머리 줄에 Failed가 붙습니다. Result 블록 대신 실패 안내가 나옵니다.",
            en: "The border turns danger, Failed appears in the header, and the failure notice replaces the Result block.",
          },
        },
      ],
      example: "failed",
    },
    {
      id: "args",
      title: { ko: "args", en: "args" },
      description: {
        ko: "도구에 넘긴 인자입니다. 문자열, 숫자, 참거짓, null, 배열, 객체로만 이루어진 JSON 값을 받고, 클래스 인스턴스나 함수는 그릴 수 없습니다. Arguments 블록에는 이 값이 두 칸 들여쓰기로 그려지고 복사 버튼이 붙습니다.",
        en: "The arguments handed to the tool. Accepts JSON built from strings, numbers, booleans, null, arrays and objects; class instances and functions cannot be drawn. The Arguments block prints it with two-space indentation and adds a copy button.",
      },
      example: "done",
    },
    {
      id: "result",
      title: { ko: "result", en: "result" },
      description: {
        ko: "도구가 돌려준 값입니다. running이면 값 대신 기다린다는 문장이 나오고, done이면 JsonCode로 그려지며, failed면 Result 블록 자체가 나오지 않습니다.",
        en: "What the tool returned. While running, the block shows the waiting sentence instead; when done it is drawn by JsonCode; on failure the block does not appear at all.",
      },
      example: "done",
    },
    {
      id: "error",
      title: { ko: "error", en: "error" },
      description: {
        ko: "실패 이유를 적는 문장입니다. failed 상태에서만 실패 안내 상자에 그려지므로, 다른 상태에서는 넘겨도 화면에 나오지 않습니다.",
        en: "The sentence that explains the failure. It is drawn in the notice only in the failed state, so passing it elsewhere changes nothing on screen.",
      },
      example: "failed",
    },
    {
      id: "truncated",
      title: { ko: "truncated", en: "truncated" },
      description: {
        ko: "결과가 잘렸다는 표시입니다. result가 있고 호출이 running이 아닐 때만 Result 블록 아래에 Show all 링크가 붙고, 그 링크는 onShowAll을 부릅니다.",
        en: "Marks the result as cut off. Only when a result exists and the call is not running does a Show all link appear under the Result block, calling onShowAll.",
      },
      example: "truncated",
    },
    {
      id: "defaultOpen",
      title: { ko: "defaultOpen", en: "defaultOpen" },
      description: {
        ko: "카드를 펼친 채로 시작합니다. 이후의 접기와 펴기는 카드가 스스로 들고 있으므로, 이 값은 처음 한 번만 쓰입니다.",
        en: "Starts the card expanded. The card holds the open state itself afterwards, so this value is read once.",
      },
      example: "done",
    },
    {
      id: "onRetry",
      title: { ko: "onRetry", en: "onRetry" },
      description: {
        ko: "실패 안내의 Retry 버튼이 부르는 함수입니다. 넘기지 않으면 오류 문장만 남고 다시 시도할 자리가 사라집니다.",
        en: "Called by the Retry button in the failure notice. Without it the error text stays and the retry control disappears.",
      },
      example: "failed",
    },
  ],
  guidelines: [
    {
      id: "collapsed-by-default",
      title: { ko: "기본은 접힌 상태", en: "Collapsed by default" },
      body: {
        ko: "대화가 길어지면 도구 호출이 여럿 쌓입니다. defaultOpen은 지금 사용자가 보고 있는 호출 하나에만 주고, 나머지는 접어 둡니다. 인자와 결과는 필요할 때 펼쳐 읽는 값입니다.",
        en: "A long conversation collects many tool calls. Give defaultOpen to the one call in question and leave the rest closed, since arguments and results are read on demand.",
      },
      do: {
        ko: "방금 끝난 호출 하나만 펼치고 지난 호출은 접어 둡니다.",
        en: "Open the call that just finished and leave earlier ones closed.",
      },
      dont: {
        ko: "모든 ToolCall에 defaultOpen을 주지 않습니다.",
        en: "Do not set defaultOpen on every ToolCall.",
      },
      example: "done",
    },
    {
      id: "one-line-summary",
      title: { ko: "요약은 한 줄로", en: "Keep the summary to one line" },
      body: {
        ko: "summary는 도구 이름 다음에 무엇을 했는지 말하는 한 줄입니다. 도구 이름을 다시 쓰거나 결과를 미리 적으면 잘려서 읽을 수 없습니다.",
        en: "summary says what the call did, next to the tool name. Repeating the tool name or predicting the result only gets truncated.",
      },
      do: {
        ko: "\"Searched the web for 'CRM pricing 2026'\"처럼 보낸 내용을 적습니다.",
        en: "Name what was sent, as in \"Searched the web for 'CRM pricing 2026'\".",
      },
      dont: {
        ko: "\"Web search ran successfully and returned five results\"처럼 결과까지 요약에 넣지 않습니다.",
        en: "Do not push the outcome into the summary: \"Web search ran successfully and returned five results\".",
      },
      example: "done",
    },
    {
      id: "failed-uses-error",
      title: { ko: "실패는 error로 말합니다", en: "Failures speak through error" },
      body: {
        ko: "failed 상태에서는 Result 블록이 그려지지 않습니다. 실패 이유는 error에 적고, 다시 시도할 수 있는 실패라면 onRetry를 붙여 Retry 버튼이 함께 나오게 합니다.",
        en: "The Result block is skipped on a failed call. Put the reason in error, and if the failure is retryable pass onRetry so the Retry button comes with it.",
      },
      do: {
        ko: "\"Request timed out after 8s.\"와 원인을 적고 onRetry를 넘깁니다.",
        en: "Write the cause, as in \"Request timed out after 8s.\", and pass onRetry.",
      },
      dont: {
        ko: "result에 오류 문자열을 넣어 정상 결과처럼 보이게 하지 않습니다.",
        en: "Do not put the error string in result and let it look like a normal result.",
      },
      example: "failed",
    },
    {
      id: "json-only",
      title: { ko: "args와 result는 JSON만", en: "JSON only in args and result" },
      body: {
        ko: "두 값은 JsonCode가 그리므로 문자열, 숫자, 참거짓, null, 배열, 객체만 받습니다. 클래스 인스턴스나 함수를 넣으면 그릴 수 없습니다. 강조된 JSON만 필요하고 카드가 필요 없으면 JsonCode를 직접 씁니다.",
        en: "JsonCode draws both values, so they must be strings, numbers, booleans, null, arrays or objects. Class instances and functions cannot be drawn. When only the highlighted JSON is needed and no card, use JsonCode on its own.",
      },
      do: {
        ko: "도구가 돌려준 값을 그대로 객체로 넘기고, 잘린 결과는 truncated와 onShowAll로 이어 줍니다.",
        en: "Pass what the tool returned as an object, and continue a cut result through truncated and onShowAll.",
      },
      dont: {
        ko: "렌더링된 엘리먼트나 Date 객체를 result에 넣지 않습니다.",
        en: "Do not put rendered elements or Date objects in result.",
      },
      example: "truncated",
    },
  ],
  specification: [
    {
      id: "card-frame",
      title: { ko: "카드 틀", en: "Card frame" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "ToolCall", property: "radius", value: "rounded-2xl" },
        { state: "default", slot: "ToolCall", property: "border", value: "1px border-border-default" },
        { state: "failed", slot: "ToolCall", property: "border", value: "1px border-border-danger" },
        { state: "default", slot: "ToolCall", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Trigger", property: "padding", value: "px-4 py-3.5" },
        { state: "default", slot: "Trigger", property: "gap", value: "10px" },
        { state: "hover", slot: "Trigger", property: "background", value: "bg-overlay-ink-3" },
        { state: "focus-visible", slot: "Trigger", property: "outline", value: "2px outline-text-brand" },
        { state: "default", slot: "Tool pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Tool pill", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Tool pill", property: "padding", value: "py-[3px] pr-2.5 pl-2" },
        { state: "default", slot: "Tool pill", property: "font", value: "text-label-md" },
        { state: "default", slot: "Tool icon", property: "size", value: "16px" },
        { state: "default", slot: "Tool icon", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Summary", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Summary", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "status-icons",
      title: { ko: "상태 표시", en: "Status marks" },
      rows: [
        { state: "running", slot: "Status icon", property: "icon", value: "Spinner sm" },
        { state: "done", slot: "Status icon", property: "icon", value: "CheckCircle" },
        { state: "done", slot: "Status icon", property: "text color", value: "text-status-live" },
        { state: "failed", slot: "Status icon", property: "icon", value: "WarningCircle" },
        { state: "failed", slot: "Status icon", property: "text color", value: "text-text-danger" },
        { state: "failed", slot: "Failed label", property: "font", value: "text-label-sm" },
        { state: "failed", slot: "Failed label", property: "text color", value: "text-text-danger" },
        { state: "default", slot: "Elapsed", property: "font", value: "text-caption" },
        { state: "default", slot: "Caret", property: "size", value: "16px" },
        {
          state: "open",
          slot: "Caret",
          property: "rotation",
          value: "180deg",
          note: {
            ko: "panel이 열린 동안만 돌아가고 transition은 200ms ease-out-quint입니다.",
            en: "It turns only while the panel is open, over 200ms ease-out-quint.",
          },
        },
        {
          state: "status change",
          slot: "Status icon",
          property: "motion",
          value: "animate-pop-in",
          note: {
            ko: "아이콘은 key가 바뀌어 다시 pop-in 합니다.",
            en: "The icon is keyed by state, so it pops in again on every change.",
          },
        },
      ],
    },
    {
      id: "blocks",
      title: { ko: "펼친 블록", en: "Expanded blocks" },
      rows: [
        { state: "default", slot: "Panel", property: "padding", value: "px-4 pb-4" },
        { state: "default", slot: "Panel", property: "gap", value: "14px" },
        { state: "default", slot: "Section label", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Section label", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Section label", property: "text transform", value: "uppercase" },
        { state: "default", slot: "Section body", property: "background", value: "bg-bg-subtle" },
        { state: "default", slot: "Section body", property: "radius", value: "10px" },
        { state: "default", slot: "Section body", property: "padding", value: "px-3.5 py-3" },
        { state: "default", slot: "JsonCode", property: "font", value: "font-mono text-code" },
        { state: "default", slot: "JsonCode", property: "text color", value: "text-syntax-string" },
        { state: "string", slot: "JsonCode", property: "text color", value: "text-syntax-string" },
        { state: "key", slot: "JsonCode", property: "text color", value: "text-syntax-key" },
        { state: "number, boolean, null", slot: "JsonCode", property: "text color", value: "text-syntax-number" },
        { state: "punctuation", slot: "JsonCode", property: "text color", value: "text-syntax-punctuation" },
        { state: "copied", slot: "Copy button", property: "text color", value: "text-status-live" },
        { state: "hover", slot: "Copy button", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Waiting message", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Waiting message", property: "text color", value: "text-text-secondary" },
        { state: "failed", slot: "Failure notice", property: "background", value: "bg-bg-danger" },
        { state: "failed", slot: "Failure notice", property: "radius", value: "10px" },
        { state: "failed", slot: "Failure notice", property: "padding", value: "px-3.5 py-3" },
        { state: "failed", slot: "Error text", property: "font", value: "text-body-sm" },
        { state: "failed", slot: "Error text", property: "text color", value: "text-text-danger" },
        { state: "failed", slot: "Retry button", property: "height", value: "30px" },
        { state: "failed", slot: "Retry button", property: "background", value: "bg-bg-surface" },
        { state: "failed", slot: "Retry button", property: "border", value: "1px border-border-default" },
        { state: "failed", slot: "Retry button", property: "font", value: "text-label-sm" },
      ],
    },
  ],
  examples: [
    {
      id: "done",
      title: { ko: "끝난 호출", en: "Finished call" },
      description: {
        ko: "인자와 결과를 펼친 채로 시작하는 호출입니다. 두 블록 모두 복사 버튼과 함께 나옵니다.",
        en: "A call that starts expanded with its arguments and result. Both blocks come with a copy button.",
      },
    },
    {
      id: "running",
      title: { ko: "실행 중", en: "Running" },
      description: {
        ko: "인자만 먼저 보여 주고 Result 블록에는 기다린다는 문장이 놓입니다.",
        en: "The arguments appear first, while the Result block holds the waiting sentence.",
      },
    },
    {
      id: "failed",
      title: { ko: "실패와 재시도", en: "Failure and retry" },
      description: {
        ko: "테두리와 Failed 표시가 danger가 되고, 결과 대신 오류 상자와 Retry 버튼이 나옵니다.",
        en: "The border and Failed mark turn danger, and an error box with Retry replaces the result.",
      },
    },
    {
      id: "truncated",
      title: { ko: "잘린 결과", en: "Truncated result" },
      description: {
        ko: "결과가 길어 잘렸을 때 Result 블록 아래에 Show all 링크가 붙습니다. 같은 값을 JsonCode만으로 그린 모습도 함께 두었습니다.",
        en: "When the result is cut off, a Show all link appears under the Result block. The same value drawn by JsonCode alone sits beside it.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Disclosure Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" },
    notes: [
      {
        ko: "머리 줄은 Base UI Collapsible의 트리거라 aria-expanded와 aria-controls가 붙고, 펼친 패널과 짝을 이룹니다. 접기와 펴기를 직접 만들지 않습니다.",
        en: "The header is a Base UI Collapsible trigger, so it carries aria-expanded and aria-controls and stays paired with the panel. Do not build the toggle yourself.",
      },
      {
        ko: "복사 버튼은 Copy arguments와 Copy result처럼 블록 이름을 대는 aria-label을 쓰고, 복사한 뒤에는 Copied로 바뀝니다. 두 버튼의 이름이 같으면 무엇을 복사했는지 알 수 없습니다.",
        en: "Each copy button is named after its block, such as Copy arguments and Copy result, and changes to Copied after copying. Identical names would hide which block was copied.",
      },
      {
        ko: "상태 아이콘은 aria-hidden이고 실패한 호출에만 Failed 글자가 함께 붙습니다. 나머지 상태는 아이콘 모양으로 구분되므로 색만으로는 전달되지 않습니다.",
        en: "The status icon is aria-hidden and only a failed call adds the Failed word. Other states are told apart by the icon's shape, so nothing rides on color alone.",
      },
      {
        ko: "JSON은 pre 안의 텍스트라 화면 낭독기가 한 덩어리로 읽습니다. 긴 결과는 잘라 두고 Show all로 전문을 열게 하는 편이 읽기 쉽습니다.",
        en: "The JSON is text inside a pre, read as one block. For long results, cut it and open the whole value through Show all.",
      },
      {
        ko: "동작 줄이기를 켜면 패널이 즉시 열리고 아이콘의 pop-in과 캐럿 회전도 한 프레임 뒤 멈춥니다.",
        en: "Under reduced motion the panel opens instantly and the icon pop-in and caret rotation stop after one frame.",
      },
    ],
    keyboard: [
      { keys: ["Enter"], action: { ko: "카드를 접거나 폅니다.", en: "Toggles the card." } },
      { keys: ["Space"], action: { ko: "카드를 접거나 폅니다.", en: "Toggles the card." } },
      { keys: ["Tab"], action: { ko: "펼친 블록의 복사 버튼과 Retry, Show all로 이동합니다.", en: "Moves to the copy buttons, Retry and Show all inside the expanded card." } },
    ],
  },
};
