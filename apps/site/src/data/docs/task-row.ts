/**
 * Reference doc for `Task Row`, written against
 * `packages/react/src/components/task-row.tsx` and
 * `packages/flutter/lib/src/components/task_row.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "task-row",
  anatomy: {
    description: {
      ko: "Task Row는 맡긴 작업 하나의 상태를 보여 주는 행입니다. 위에서부터 작업 이름과 걸린 시간, 봇과 프로젝트, 그리고 상태 아이콘과 결과 문장, 그 오른쪽에 그 상태에서 쓸 수 있는 동작 하나가 놓입니다.",
      en: "Task Row shows the state of one assigned task. From the top: the task name and its elapsed time, the bot and project, then the status icon with the result line and the single action that state allows.",
    },
    parts: [
      {
        name: "Row",
        slot: "TaskRow",
        description: {
          ko: "세 줄을 담는 컨테이너입니다. 카드 변형은 16px 라운드와 테두리를 갖고, 목록 변형은 바탕 없이 아래쪽 1px 구분선만 남깁니다.",
          en: "The container for the three lines. The card variant has a 16px radius and a border; the list variant drops the fill and keeps only a 1px divider below.",
        },
      },
      {
        name: "Title line",
        slot: "title",
        description: {
          ko: "작업 이름을 label-lg 한 줄로 자르고, 오른쪽에 걸린 시간을 caption으로 붙입니다.",
          en: "The task name cut to one label-lg line, with the elapsed time as a caption on the right.",
        },
      },
      {
        name: "Bot line",
        slot: "bot",
        description: {
          ko: "18px 봇 타일과 봇 이름, 그 뒤에 점과 폴더 아이콘으로 구분한 프로젝트가 이어집니다.",
          en: "An 18px bot tile and the bot name, then the project after a dot and a folder icon.",
        },
      },
      {
        name: "Status line",
        slot: "message",
        description: {
          ko: "상태 아이콘과 결과 문장, 그리고 상세 문구입니다. 문장은 상태가 바뀔 때마다 페이드 인으로 다시 나타납니다.",
          en: "The status icon, the result sentence and an optional detail. The sentence fades in again on every state change.",
        },
      },
      {
        name: "Action",
        slot: "onCancel · onRetry · onReview · onArchive",
        description: {
          ko: "상태마다 하나만 나오는 동작입니다. running이면 Cancel, failed면 Retry, review면 Review 알약과 보관 아이콘, done이면 보관 아이콘만 보입니다.",
          en: "The one action the state allows: Cancel while running, Retry when failed, Review plus the archive icon in review, and only the archive icon when done.",
        },
      },
    ],
  },
  properties: [
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "작업의 생애주기입니다. 아이콘, 문장 색, 봇 타일 색, 그리고 어떤 동작이 보이는지를 함께 정합니다.",
        en: "The task's lifecycle. It drives the icon, the message color, the bot tile fill and which action appears.",
      },
      values: [
        {
          name: "running",
          description: {
            ko: "스피너가 돌고 Cancel 알약이 붙습니다. 지금 무슨 일을 하는지 문장에 적습니다.",
            en: "A spinner turns and the Cancel pill appears. Say what it is doing right now in the message.",
          },
        },
        {
          name: "review",
          description: {
            ko: "사람의 확인을 기다리는 상태입니다. text-primary 체크와 채워진 Review 알약, 보관 아이콘이 나옵니다.",
            en: "Waiting on a person: a text-primary check, the filled Review pill and the archive icon.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "경고 아이콘과 danger 색 문장, Retry 알약이 나옵니다. 상세 줄에 다시 시도할 수 있는 이유를 적습니다.",
            en: "A warning icon, a danger message and the Retry pill. Put the reason worth retrying in the detail.",
          },
        },
        {
          name: "done",
          description: {
            ko: "secondary 색 체크와 secondary 문장, 보관 아이콘이 나옵니다. 끝난 작업이 목록에서 조용히 물러나게 합니다.",
            en: "A secondary check, a secondary message and the archive icon, so finished work fades back in the list.",
          },
        },
      ],
      example: "states",
    },
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "행의 겉모양입니다. 목록 안에 쌓을 때는 list를, 단독으로 놓을 때는 card를 씁니다.",
        en: "The row's shell. Use list when stacking rows in a list and card when the row stands alone.",
      },
      values: [
        {
          name: "card",
          description: {
            ko: "기본값입니다. 16px 라운드, 테두리, surface 바탕을 가진 독립 카드로 그립니다.",
            en: "The default: a standalone card with a 16px radius, a border and the surface fill.",
          },
        },
        {
          name: "list",
          description: {
            ko: "바탕과 테두리를 없애고 아래쪽에만 1px 구분선을 그립니다. 목록의 마지막 행은 구분선도 그리지 않습니다.",
            en: "Drops the fill and border and draws only a 1px divider below. The last row in the list draws no divider.",
          },
        },
      ],
      example: "list",
    },
    {
      id: "bot",
      title: { ko: "bot", en: "bot" },
      description: {
        ko: "작업을 맡은 봇입니다. initial은 18px 타일에 들어가고, name은 옆에 붙습니다. tileClassName을 넘기면 상태가 정한 타일 색을 덮어쓰고 글자를 text-inverse로 고정합니다.",
        en: "The bot the task belongs to. initial sits in the 18px tile and name follows it. Passing tileClassName overrides the status tile fill and forces the letter to text-inverse.",
      },
      example: "states",
    },
    {
      id: "message",
      title: { ko: "message", en: "message" },
      description: {
        ko: "상태 줄의 본문입니다. 지금 하는 일, 끝난 결과, 또는 실패 이유를 적고, 색은 status가 정합니다.",
        en: "The body of the status line: what it is doing, what it produced, or why it failed. status picks the color.",
      },
      example: "states",
    },
    {
      id: "detail",
      title: { ko: "detail", en: "detail" },
      description: {
        ko: "문장 뒤에 점으로 이어 붙는 caption입니다. 결과의 규모를 숫자로 적고, 실패했을 때는 고칠 수 있는 원인을 적습니다.",
        en: "A caption joined to the message by a dot. Use it for the size of the result, or for the fixable cause when the task failed.",
      },
      example: "states",
    },
    {
      id: "onReview",
      title: { ko: "onReview", en: "onReview" },
      description: {
        ko: "Review 알약이 부르는 함수입니다. review 상태에서만 알약이 그려지므로 다른 상태에서는 눌릴 자리가 없습니다.",
        en: "Called by the Review pill. The pill renders only in review, so there is nothing to press in any other state.",
      },
      example: "actions",
    },
  ],
  guidelines: [
    {
      id: "review-needs-a-person",
      title: { ko: "review는 사람이 판단할 때만", en: "Review means a person must decide" },
      body: {
        ko: "review는 봇이 더 진행하려면 사람의 판단이 필요할 때만 씁니다. 스스로 끝난 작업은 done으로 두어야 목록에서 확인할 일과 이미 끝난 일이 섞이지 않습니다.",
        en: "Use review only when a person has to decide before the bot can go on. Work that finished on its own belongs in done, or the list mixes what needs you with what is already over.",
      },
      do: {
        ko: "답장 초안처럼 보내기 전에 확인이 필요한 작업을 review로 둡니다.",
        en: "Keep a task in review when it needs a yes before it sends, such as a drafted reply.",
      },
      dont: {
        ko: "이미 전송까지 끝난 작업을 review로 남겨 두지 않습니다.",
        en: "Do not leave work that already sent in review.",
      },
      example: "states",
    },
    {
      id: "one-action-per-state",
      title: { ko: "상태마다 동작은 하나", en: "One action per state" },
      body: {
        ko: "행은 상태에 맞는 동작 하나만 그립니다. 네 함수를 모두 넘겨도 지금 상태에 맞는 것만 보이므로, 각 함수가 실제로 그 상태에서 할 일을 하도록 적습니다.",
        en: "The row draws the one action its state allows. All four handlers can be passed and only the matching one appears, so each must do what that state actually needs.",
      },
      do: {
        ko: "onRetry는 다시 실행하고, onReview는 확인 화면을 엽니다.",
        en: "Make onRetry run the task again and onReview open the review.",
      },
      dont: {
        ko: "네 함수에 같은 콜백을 넣어 무엇을 눌러도 같은 일이 일어나게 하지 않습니다.",
        en: "Do not point all four at one callback so every control does the same thing.",
      },
      example: "actions",
    },
    {
      id: "list-inside-panels",
      title: { ko: "패널 안에서는 list를 씁니다", en: "List inside panels" },
      body: {
        ko: "AgentPanel처럼 이미 surface 카드인 컨테이너 안에서는 list 변형을 써서 테두리를 겹치지 않게 합니다. 카드 변형은 행이 화면에서 단독으로 설 때만 씁니다.",
        en: "Inside a container that is already a surface card, such as AgentPanel, use the list variant so borders do not double. Card is for a row that stands alone on the screen.",
      },
      do: {
        ko: "목록 컨테이너 안에서 variant=\"list\"로 한 줄씩 이어 붙입니다.",
        en: "Stack variant=\"list\" rows inside one list container.",
      },
      dont: {
        ko: "패널 안에 카드형 행을 여러 개 쌓지 않습니다.",
        en: "Do not stack card rows inside a panel.",
      },
      example: "list",
    },
    {
      id: "message-states-the-result",
      title: { ko: "문장은 결과를 말합니다", en: "The message states the outcome" },
      body: {
        ko: "message는 지금 하는 일이나 끝난 결과를 한 문장으로 적고, 규모는 detail로 뺍니다. 같은 내용을 두 줄에 나눠 적으면 한 줄이 잘릴 때 정보가 사라집니다.",
        en: "message carries the current step or the result in one sentence, and the size moves to detail. Repeating the same fact across both lines loses information when one line truncates.",
      },
      do: {
        ko: "\"Sent\"와 \"Delivered to 4 people · 2 opened\"처럼 결과와 규모를 나눕니다.",
        en: "Split the result and its size, as in \"Sent\" and \"Delivered to 4 people · 2 opened\".",
      },
      dont: {
        ko: "문장과 상세에 같은 말을 겹쳐 적지 않습니다.",
        en: "Do not write the same sentence in both message and detail.",
      },
      example: "states",
    },
  ],
  specification: [
    {
      id: "row-frame",
      title: { ko: "행 틀", en: "Row frame" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "TaskRow", property: "padding", value: "px-4 py-3.5" },
        { state: "default", slot: "TaskRow", property: "gap", value: "8px" },
        { state: "card", slot: "TaskRow", property: "radius", value: "rounded-2xl" },
        { state: "card", slot: "TaskRow", property: "border", value: "1px border-border-default" },
        { state: "card", slot: "TaskRow", property: "background", value: "bg-bg-surface" },
        { state: "list", slot: "TaskRow", property: "background", value: "transparent" },
        {
          state: "list",
          slot: "Divider",
          property: "background",
          value: "1px bg-overlay-ink-8",
          note: {
            ko: "행 아래에 1px 높이로 그리고, 좌우 16px은 들여서 그립니다.",
            en: "Drawn 1px tall under the row, inset 16px from each side.",
          },
        },
        {
          state: "list · last",
          slot: "Divider",
          property: "height",
          value: "0",
          note: {
            ko: "마지막 행은 구분선을 그리지 않습니다.",
            en: "The last row draws no divider.",
          },
        },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Elapsed", property: "font", value: "text-caption" },
        { state: "default", slot: "Bot line", property: "font", value: "text-caption" },
        { state: "default", slot: "Bot tile", property: "size", value: "18px" },
        { state: "default", slot: "Bot tile", property: "radius", value: "rounded-xs" },
        { state: "default", slot: "Bot tile", property: "font", value: "text-label-sm" },
      ],
    },
    {
      id: "status-colors",
      title: { ko: "상태별 색", en: "Status colors" },
      rows: [
        { state: "running", slot: "Bot tile", property: "background", value: "bg-interactive-primary" },
        { state: "running", slot: "Bot tile", property: "text color", value: "text-interactive-on-primary" },
        { state: "running", slot: "Message", property: "text color", value: "text-text-primary" },
        { state: "running", slot: "Status icon", property: "icon", value: "Spinner 15px" },
        { state: "review", slot: "Bot tile", property: "background", value: "bg-sky-500" },
        { state: "review", slot: "Bot tile", property: "text color", value: "text-sky-50" },
        { state: "review", slot: "Status icon", property: "text color", value: "text-text-primary" },
        { state: "failed", slot: "Bot tile", property: "background", value: "bg-sky-700" },
        { state: "failed", slot: "Bot tile", property: "text color", value: "text-sky-50" },
        { state: "failed", slot: "Message", property: "text color", value: "text-text-danger" },
        { state: "failed", slot: "Status icon", property: "text color", value: "text-text-danger" },
        { state: "done", slot: "Bot tile", property: "background", value: "bg-interactive-primary" },
        { state: "done", slot: "Bot tile", property: "text color", value: "text-interactive-on-primary" },
        { state: "done", slot: "Message", property: "text color", value: "text-text-secondary" },
        { state: "done", slot: "Status icon", property: "text color", value: "text-text-secondary" },
        {
          state: "bot.tileClassName",
          slot: "Bot tile",
          property: "text color",
          value: "text-text-inverse",
          note: {
            ko: "타일 색을 직접 넘기면 상태가 정한 색 대신 이 조합을 씁니다.",
            en: "When the tile fill is passed in, this pairing replaces the status colors.",
          },
        },
      ],
    },
    {
      id: "actions",
      title: { ko: "상태별 동작", en: "Actions per state" },
      rows: [
        { state: "running", slot: "Cancel pill", property: "height", value: "30px" },
        { state: "running", slot: "Cancel pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "running", slot: "Cancel pill", property: "text color", value: "text-text-primary" },
        { state: "failed", slot: "Retry pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "failed", slot: "Retry pill", property: "text color", value: "text-text-primary" },
        { state: "review", slot: "Review pill", property: "background", value: "bg-interactive-primary" },
        { state: "review", slot: "Review pill", property: "text color", value: "text-text-inverse" },
        { state: "review, done", slot: "Archive button", property: "size", value: "30px" },
        { state: "review, done", slot: "Archive button", property: "radius", value: "rounded-full" },
        { state: "review, done", slot: "Archive button", property: "text color", value: "text-text-secondary" },
        { state: "review, done · hover", slot: "Archive button", property: "background", value: "bg-overlay-ink-6" },
        { state: "all pills", slot: "Pill", property: "radius", value: "rounded-full" },
        { state: "all pills", slot: "Pill", property: "padding", value: "px-3" },
        { state: "all pills", slot: "Pill", property: "font", value: "text-label-sm" },
        { state: "all pills", slot: "Pill", property: "gap", value: "6px" },
        {
          state: "action appears",
          slot: "Pill",
          property: "motion",
          value: "animate-pop-in",
          note: {
            ko: "220ms 스프링이고, 동작 줄이기를 켜면 즉시 끝납니다.",
            en: "A 220ms spring that finishes instantly under reduced motion.",
          },
        },
        {
          state: "message change",
          slot: "Message",
          property: "motion",
          value: "animate-fade-in",
          note: {
            ko: "status가 바뀔 때 문장만 160ms로 다시 나타납니다.",
            en: "Only the message re-enters, over 160ms, when status changes.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "states",
      title: { ko: "네 상태", en: "Four states" },
      description: {
        ko: "running, review, failed, done을 위에서 아래로 놓았습니다. 상태마다 아이콘, 문장 색, 봇 타일 색과 동작이 함께 달라집니다.",
        en: "Running, review, failed and done from top to bottom. Each state changes its icon, message color, bot tile fill and action together.",
      },
    },
    {
      id: "list",
      title: { ko: "목록 변형", en: "List variant" },
      description: {
        ko: "테두리와 바탕을 없앤 행 세 개를 이어 붙였습니다. 마지막 행에는 구분선이 없습니다.",
        en: "Three rows without borders or fill, joined. The last row has no divider.",
      },
    },
    {
      id: "actions",
      title: { ko: "상태별 동작", en: "Actions per state" },
      description: {
        ko: "아래 버튼으로 상태를 바꾸면 오른쪽에 붙는 동작이 하나씩 달라집니다. 다른 상태의 함수는 그려지지 않습니다.",
        en: "Switch the state with the buttons below and the action on the right changes with it. Handlers for other states are not drawn.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "상태는 색만으로 전달되지 않습니다. 아이콘이 스피너, 체크, 경고로 바뀌고 문장도 함께 달라지므로 색을 구별하기 어려워도 상태를 읽을 수 있습니다.",
        en: "State never relies on color alone: the icon becomes a spinner, a check or a warning, and the sentence changes with it, so the state is readable without color.",
      },
      {
        ko: "보관 버튼은 아이콘만 있고 aria-label=\"Archive\"로 이름을 붙입니다. 이 이름을 지우거나 아이콘을 바꾸면 접근성 이름이 사라집니다.",
        en: "The archive control is icon-only and named through aria-label=\"Archive\". Removing that label or swapping the icon drops the accessible name.",
      },
      {
        ko: "알약은 실제 button이므로 키보드로 포커스가 닿고 Enter와 Space로 눌립니다. 포커스 표시는 2px outline이고 알약에서는 2px 떨어뜨려 그립니다.",
        en: "The pills are real buttons, so they take focus and respond to Enter and Space. The focus ring is a 2px outline, held 2px off on the pills.",
      },
      {
        ko: "상태가 바뀌는 순간 아이콘과 알약이 pop-in으로, 문장이 fade-in으로 들어옵니다. 동작 줄이기를 켜면 이 전환은 즉시 끝납니다.",
        en: "On a state change the icon and pill pop in and the message fades in. Under reduced motion those transitions finish instantly.",
      },
    ],
    keyboard: [
      { keys: ["Tab"], action: { ko: "행의 동작으로 이동합니다.", en: "Moves to the row's action." } },
      { keys: ["Enter"], action: { ko: "포커스한 동작을 실행합니다.", en: "Runs the focused action." } },
      { keys: ["Space"], action: { ko: "포커스한 동작을 실행합니다.", en: "Runs the focused action." } },
    ],
  },
};
