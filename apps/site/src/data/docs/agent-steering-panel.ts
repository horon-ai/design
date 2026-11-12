/**
 * Reference doc for `Agent Steering Panel`, written against
 * `packages/react/src/components/agent-steering-panel.tsx` and
 * `packages/flutter/lib/src/components/agent_steering_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "agent-steering-panel",
  anatomy: {
    description: {
      ko: "Agent Steering Panel은 도는 봇에게 방향을 주는 판입니다. 위에서부터 작업 이름과 상태, 일시정지 버튼, 단계 레일, 다음 단계에 적용할 메모, 그리고 지시를 적는 입력창이 놓입니다.",
      en: "Agent Steering Panel is where a running bot takes direction: the task name and state with a pause button, the step rail, the notes queued for the next step, and the input the instruction is typed into.",
    },
    parts: [
      {
        name: "Header",
        slot: "title · subtitle · status",
        description: {
          ko: "경로 아이콘, 작업 이름과 둘째 줄, 6px 라이브 점, 상태 문구, 일시정지 버튼이 한 줄에 놓입니다. 점은 일시정지가 아닐 때만 2초마다 퍼집니다.",
          en: "A path icon, the task name with a second line, a 6px live dot, the status text and the pause button on one row. The dot spreads every 2 seconds unless paused.",
        },
      },
      {
        name: "Step rail",
        slot: "steps",
        description: {
          ko: "단계마다 표식과 문장, 걸린 시간을 놓고 그 사이를 세로 선으로 잇습니다. 끝난 단계 아래의 선만 라이브 색으로 채워집니다.",
          en: "Each step gets a marker, a sentence and a time, joined by a vertical line. Only the line under a finished step fills with the live color.",
        },
      },
      {
        name: "Queued notes",
        slot: "notes",
        description: {
          ko: "다음 단계에 적용할 메모 목록입니다. 머리에 대기 중인 수가 붙고, 메모마다 Now와 삭제 버튼이 있거나, 이미 적용된 메모는 채워진 Now 알약을 답니다.",
          en: "The notes queued for the next step, with a count in the heading. Each note has Now and remove buttons, or a filled Now pill once it is applied.",
        },
      },
      {
        name: "Steer box",
        slot: "onSteer",
        description: {
          ko: "지시를 적는 44px 알약 입력창과 보내기 버튼입니다. 아래에는 Enter와 Mod+Enter가 무엇을 하는지 적은 키 힌트가 붙고, 터치 기기에서는 감춥니다.",
          en: "A 44px pill input for the instruction with a send button. Under it, key hints explain Enter and Mod+Enter, and touch devices hide them.",
        },
      },
    ],
  },
  properties: [
    {
      id: "steps",
      title: { ko: "steps", en: "steps" },
      description: {
        ko: "실행 중인 작업의 단계 목록입니다. 각 단계는 id, label, status가 필요하고, time을 넘기면 오른쪽에 걸린 시간이 붙습니다.",
        en: "The steps of the running task. Each needs an id, a label and a status; passing time adds the duration at the right.",
      },
      values: [
        {
          name: "done",
          description: {
            ko: "라이브 색 원에 체크를 그리고 아래 선을 라이브 색으로 채웁니다. 이름은 'Done'으로 읽힙니다.",
            en: "A check on the live circle, with the connector below filled. It reads as Done.",
          },
        },
        {
          name: "active",
          description: {
            ko: "18px 스피너가 돌고 이름은 'Running'으로 읽힙니다. 보통 한 단계만 이 상태입니다.",
            en: "An 18px spinner turns and the name is Running. Usually only one step holds it.",
          },
        },
        {
          name: "todo",
          description: {
            ko: "점선 테두리의 빈 원을 그리고 이름과 문장을 secondary로 흐립니다. 이름은 'Waiting'으로 읽힙니다.",
            en: "An empty dashed circle, with the label and sentence faded to secondary. It reads as Waiting.",
          },
        },
      ],
      example: "running",
    },
    {
      id: "notes",
      title: { ko: "notes", en: "notes" },
      description: {
        ko: "다음 단계에 적용할 메모입니다. text와 id가 필요하고, applied를 켜면 대기 목록에서 빠져 채워진 Now 알약을 답니다. 메모 목록은 비어 있으면 접힙니다.",
        en: "The notes queued for the next step. Each needs an id and text; setting applied takes it out of the queue and shows the filled Now pill. An empty list collapses.",
      },
      example: "notes",
    },
    {
      id: "onSteer",
      title: { ko: "onSteer", en: "onSteer" },
      description: {
        ko: "보내기 버튼과 Enter, Mod+Enter에서 불립니다. 두 번째 인자는 지금 바로 끼어들지 여부이고, 패널은 초안을 비울 뿐 메모를 직접 만들지 않습니다.",
        en: "Called by the send button, Enter and Mod+Enter. The second argument says whether to interrupt now; the panel only clears the draft and never queues a note itself.",
      },
      example: "running",
    },
    {
      id: "paused",
      title: { ko: "paused", en: "paused" },
      description: {
        ko: "일시정지 상태입니다. 라이브 점의 펄스를 멈추고 버튼을 Play로 바꿉니다. 패널은 표시만 할 뿐 실제 작업을 멈추지 않으므로 멈추는 일은 호출자가 합니다.",
        en: "The paused state. It stops the dot's pulse and swaps the button to Play. The panel only reflects it and never stops the work, so pausing is the caller's job.",
      },
      example: "paused",
    },
    {
      id: "onPausedChange",
      title: { ko: "onPausedChange", en: "onPausedChange" },
      description: {
        ko: "일시정지 버튼이 다음 paused 값과 함께 부릅니다. 값을 그대로 받아 상태에 넣고, 같은 턴에 status 문구도 함께 바꿉니다.",
        en: "Called by the pause button with the next paused value. Store it and change the status text in the same turn.",
      },
      example: "paused",
    },
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "라이브 점 옆의 상태 문구입니다. 점은 aria-hidden이라 상태를 말로 전하는 것은 이 문구이므로, 도는 중인지 멈췄는지를 여기에 적습니다.",
        en: "The text beside the live dot. The dot is aria-hidden, so this line is what states the state in words: running, paused or stopped.",
      },
      example: "running",
    },
    {
      id: "onApplyNow",
      title: { ko: "onApplyNow", en: "onApplyNow" },
      description: {
        ko: "메모의 Now 버튼이 메모 id와 함께 부릅니다. 다음 단계를 기다리지 않고 지금 적용할 때 씁니다.",
        en: "Called with the note id by its Now button, for applying the note without waiting for the next step.",
      },
      example: "notes",
    },
    {
      id: "onRemoveNote",
      title: { ko: "onRemoveNote", en: "onRemoveNote" },
      description: {
        ko: "삭제 버튼을 누르면 메모가 pop-out으로 빠져나간 뒤 id와 함께 불립니다. 그때 notes에서 메모를 지우면 됩니다.",
        en: "After the remove button plays the note's pop-out, this is called with its id so the note can be dropped from notes.",
      },
      example: "notes",
    },
    {
      id: "placeholder",
      title: { ko: "placeholder", en: "placeholder" },
      description: {
        ko: "입력창의 안내 문구이자 접근성 이름입니다. 화면에 이름이 이것뿐이므로 무엇을 적는 자리인지 그대로 말하게 적습니다.",
        en: "The input's hint and its accessible name. It is the only visible name, so let it say what belongs there.",
      },
      example: "running",
    },
  ],
  guidelines: [
    {
      id: "queue-before-interrupt",
      title: { ko: "기본은 대기, 끼어들기는 예외", en: "Queue by default, interrupt rarely" },
      body: {
        ko: "Enter는 다음 단계에 적용할 메모를 남기고, Mod+Enter는 지금 도는 일을 끊고 바로 반영합니다. 끼어들기는 이미 하던 일을 버리게 하므로, 방향이 틀렸을 때만 쓰고 세부 조정은 대기로 남깁니다.",
        en: "Enter leaves a note for the next step; Mod+Enter cuts the work in progress and applies at once. An interrupt throws away what was under way, so save it for a wrong direction and queue the refinements.",
      },
      do: {
        ko: "\"답장은 120단어 이하로\"처럼 나중에 적용해도 되는 지시는 Enter로 남깁니다.",
        en: "Leave guidance that can wait, such as \"keep replies under 120 words\", with Enter.",
      },
      dont: {
        ko: "문장만 고치려고 방향 전환용 Mod+Enter를 쓰지 않습니다.",
        en: "Do not reach for Mod+Enter to polish a sentence.",
      },
      example: "running",
    },
    {
      id: "pause-is-a-signal",
      title: { ko: "일시정지는 신호입니다", en: "Pause is a signal" },
      body: {
        ko: "paused를 켜도 패널은 아무 일도 멈추지 않습니다. 점의 펄스와 버튼 모양만 바뀌므로, 실제로 멈춰야 한다면 onPausedChange에서 실행을 멈추고 status에도 멈춘 상태를 적습니다.",
        en: "Setting paused stops nothing by itself; only the dot and the button change. To really stop, halt the run in onPausedChange and say so in status.",
      },
      do: {
        ko: "onPausedChange에서 실행을 멈추고 status를 \"Paused · 2m 10s\"로 바꿉니다.",
        en: "Halt the run in onPausedChange and set status to \"Paused · 2m 10s\".",
      },
      dont: {
        ko: "paused만 켜 두고 작업은 계속 돌게 두지 않습니다.",
        en: "Do not set paused while the work keeps running.",
      },
      example: "paused",
    },
    {
      id: "notes-are-one-instruction",
      title: { ko: "메모는 지시 하나", en: "One instruction per note" },
      body: {
        ko: "메모 한 줄은 다음 단계에 적용할 지시 하나입니다. 여러 지시를 한 줄에 붙이면 어느 것이 적용됐는지 확인할 수 없습니다. 적용된 메모는 남겨 두었다가 onRemoveNote로 목록에서 지웁니다.",
        en: "A note row is one instruction for the next step. Stacking several makes it impossible to tell what took effect. Keep an applied note until onRemoveNote drops it.",
      },
      do: {
        ko: "\"요약에 담당자 이름을 넣어라\" 한 가지만 적습니다.",
        en: "Write one thing: \"name the owners in the summary\".",
      },
      dont: {
        ko: "길이, 어조, 형식, 마감을 한 메모에 몰아넣지 않습니다.",
        en: "Do not cram length, tone, format and deadline into one note.",
      },
      example: "notes",
    },
    {
      id: "status-carries-the-state",
      title: { ko: "상태는 문구가 전합니다", en: "The text carries the state" },
      body: {
        ko: "라이브 점은 aria-hidden이라 화면 낭독기에 전달되지 않습니다. 도는 중인지 멈췄는지는 status 문구가 유일한 단서이므로, 점만 바꾸고 문구를 그대로 두지 않습니다.",
        en: "The live dot is aria-hidden and never reaches a screen reader. The status line is the only cue, so never change the dot and leave the text as it was.",
      },
      do: {
        ko: "상태가 바뀔 때 status도 같은 말로 바꿉니다.",
        en: "Move status to match whenever the state changes.",
      },
      dont: {
        ko: "점만 회색으로 바꾸고 \"Running\"을 남기지 않습니다.",
        en: "Do not grey the dot and leave Running in the line.",
      },
      example: "running",
    },
  ],
  specification: [
    {
      id: "panel-and-header",
      title: { ko: "패널과 머리", en: "Panel and header" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "AgentSteeringPanel", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "AgentSteeringPanel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "AgentSteeringPanel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "AgentSteeringPanel", property: "max width", value: "520px" },
        { state: "default", slot: "Header", property: "padding", value: "px-5 pt-4 pb-3.5" },
        { state: "default", slot: "Header", property: "gap", value: "10px horizontal, 8px vertical" },
        { state: "default", slot: "Path icon", property: "size", value: "18px" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Subtitle", property: "font", value: "text-caption" },
        { state: "default", slot: "Subtitle", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Live dot", property: "size", value: "6px" },
        { state: "default", slot: "Live dot", property: "background", value: "bg-status-live" },
        {
          state: "running",
          slot: "Live dot",
          property: "motion",
          value: "animate-live-pulse",
          note: {
            ko: "2초 주기로 퍼지고, paused면 이 클래스가 빠집니다.",
            en: "It spreads every 2s and loses this class while paused.",
          },
        },
        { state: "default", slot: "Status", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Status", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Pause button", property: "size", value: "30px" },
        { state: "default", slot: "Pause button", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Pause button", property: "radius", value: "rounded-full" },
        { state: "hover", slot: "Pause button", property: "background", value: "bg-overlay-ink-10" },
        { state: "paused", slot: "Pause button", property: "icon", value: "Play" },
        { state: "running", slot: "Pause button", property: "icon", value: "Pause" },
        {
          state: "toggle",
          slot: "Pause button",
          property: "motion",
          value: "motion-swap",
          note: {
            ko: "두 아이콘을 같은 칸에 겹쳐 두고 150ms로 교차시킵니다.",
            en: "Both icons share one cell and cross-fade over 150ms.",
          },
        },
        { state: "default", slot: "Divider", property: "background", value: "1px bg-overlay-ink-8" },
      ],
    },
    {
      id: "step-rail",
      title: { ko: "단계 레일", en: "Step rail" },
      rows: [
        { state: "default", slot: "Step list", property: "padding", value: "px-5 py-3" },
        { state: "default", slot: "Step list", property: "gap", value: "12px" },
        { state: "default", slot: "Step row", property: "min height", value: "26px" },
        { state: "default", slot: "Step row", property: "gap", value: "12px" },
        { state: "default", slot: "Step row", property: "motion", value: "motion-rise" },
        {
          state: "entering",
          slot: "Step row",
          property: "delay",
          value: "staggered by index",
          note: {
            ko: "행마다 --i를 올려 늦게 올라옵니다.",
            en: "Each row raises --i so it rises a little later.",
          },
        },
        { state: "default", slot: "Marker column", property: "size", value: "26px × 20px" },
        { state: "done", slot: "Marker", property: "size", value: "18px" },
        { state: "done", slot: "Marker", property: "background", value: "bg-status-live" },
        { state: "done", slot: "Marker", property: "text color", value: "text-text-on-ink" },
        { state: "active", slot: "Marker", property: "icon", value: "Spinner 18px" },
        { state: "todo", slot: "Marker", property: "border", value: "1px border-dashed border-border-dashed" },
        { state: "done", slot: "Connector", property: "background", value: "1px bg-status-live" },
        { state: "active, todo", slot: "Connector", property: "background", value: "1px bg-overlay-ink-10" },
        { state: "default", slot: "Step label", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Step label", property: "text color", value: "text-text-primary" },
        { state: "todo", slot: "Step label", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Step time", property: "font", value: "text-caption" },
        { state: "default", slot: "Step time", property: "text color", value: "text-text-secondary" },
        { state: "any change", slot: "Step label", property: "motion", value: "motion-colors" },
      ],
    },
    {
      id: "notes-and-input",
      title: { ko: "메모와 입력창", en: "Notes and input" },
      rows: [
        { state: "default", slot: "Notes area", property: "padding", value: "px-5 py-3.5" },
        { state: "default", slot: "Notes area", property: "gap", value: "10px" },
        {
          state: "empty",
          slot: "Notes wrapper",
          property: "motion",
          value: "motion-reveal",
          note: {
            ko: "메모가 없으면 접혀 머리도 보이지 않습니다.",
            en: "With no notes it collapses and even the heading is hidden.",
          },
        },
        { state: "default", slot: "Notes heading", property: "font", value: "text-caption" },
        { state: "default", slot: "Notes heading", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Note row", property: "radius", value: "rounded-md" },
        { state: "default", slot: "Note row", property: "background", value: "bg-overlay-ink-4" },
        { state: "default", slot: "Note row", property: "padding", value: "py-2 pr-2.5 pl-3.5" },
        { state: "default", slot: "Note text", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Note text", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Now button", property: "height", value: "26px" },
        { state: "default", slot: "Now button", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Now button", property: "padding", value: "px-2" },
        { state: "default", slot: "Now button", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Now icon", property: "size", value: "12px" },
        { state: "default", slot: "Remove button", property: "size", value: "24px" },
        { state: "hover", slot: "Remove button", property: "text color", value: "text-text-primary" },
        { state: "applied", slot: "Now pill", property: "background", value: "bg-interactive-primary" },
        { state: "applied", slot: "Now pill", property: "text color", value: "text-text-inverse" },
        {
          state: "leaving",
          slot: "Note row",
          property: "motion",
          value: "animate-pop-out",
          note: {
            ko: "130ms 뒤에 onRemoveNote가 불립니다.",
            en: "onRemoveNote fires when it ends, after 130ms.",
          },
        },
        { state: "default", slot: "Steer box", property: "height", value: "44px" },
        { state: "default", slot: "Steer box", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Steer box", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "Steer box", property: "padding", value: "pr-1.5 pl-4" },
        { state: "default", slot: "Steer input", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Send button", property: "size", value: "32px" },
        { state: "default", slot: "Send button", property: "background", value: "bg-interactive-primary" },
        { state: "default", slot: "Send button", property: "text color", value: "text-text-inverse" },
        { state: "focus-visible", slot: "Send button", property: "outline", value: "2px outline-text-brand" },
        { state: "default", slot: "Key hints", property: "font", value: "text-caption" },
        { state: "touch device", slot: "Key hints", property: "display", value: "hidden" },
      ],
    },
  ],
  examples: [
    {
      id: "running",
      title: { ko: "도는 중인 작업", en: "Running task" },
      description: {
        ko: "다섯 단계 중 둘째가 도는 중입니다. 메모 하나를 대기열에 두었고, Now로 바로 적용하거나 지울 수 있습니다.",
        en: "The second of five steps is running, with one note in the queue that can be applied now or removed.",
      },
    },
    {
      id: "paused",
      title: { ko: "일시정지", en: "Paused" },
      description: {
        ko: "일시정지 상태에서는 라이브 점이 멈추고 버튼이 Play로 바뀝니다. 메모 영역은 비어 있어 접혀 있습니다.",
        en: "While paused the dot stops pulsing and the button becomes Play. With no notes the notes area stays collapsed.",
      },
    },
    {
      id: "notes",
      title: { ko: "적용된 메모", en: "Applied note" },
      description: {
        ko: "이미 적용된 메모는 채워진 Now 알약을 달고 대기 수에서 빠지며, 아직 대기 중인 메모에는 Now와 삭제 버튼이 남습니다.",
        en: "An applied note carries the filled Now pill and leaves the queue count, while the queued note keeps its Now and remove buttons.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "라이브 점은 aria-hidden입니다. 도는 중인지 멈췄는지는 status 문구가 전부이므로 같은 턴에 문구를 바꿉니다.",
        en: "The live dot is aria-hidden. The status line is the whole story of running or paused, so change it in the same turn.",
      },
      {
        ko: "일시정지 버튼은 Resume 또는 Pause로 이름이 바뀌고 aria-pressed로 상태를 함께 노출합니다. 아이콘만 있는 버튼이라 이 이름을 직접 대신 만들 필요가 없습니다.",
        en: "The pause button is named Resume or Pause and exposes the state through aria-pressed. It is icon-only, so this name is what makes it usable.",
      },
      {
        ko: "단계 표식은 모양마다 이름을 답니다. 체크는 'Done', 스피너는 'Running'으로 상태를 알리고, 점선 원은 'Waiting'으로 읽힙니다.",
        en: "Each step marker carries a name: the check reads Done, the spinner Running, and the dashed circle Waiting.",
      },
      {
        ko: "입력창은 outline을 지우고 상자에도 focus-within 표시가 없어, 포커스는 커서로만 보입니다. 키보드만 쓰는 화면이라면 포커스 표시를 직접 더합니다.",
        en: "The input drops its outline and the box has no focus-within ring, so focus shows only through the caret. A keyboard-only screen should add a visible focus style.",
      },
      {
        ko: "한글과 일본어 입력 중에는 조합 키 입력을 무시해 글자가 완성되기 전에 전송되지 않습니다. Enter는 대기, Mod+Enter는 즉시 적용입니다.",
        en: "While Korean or Japanese text is being composed, keystrokes are ignored so nothing sends mid-character. Enter queues and Mod+Enter applies at once.",
      },
      {
        ko: "동작 줄이기를 켜면 라이브 점의 펄스, 단계 rise, 메모의 pop-out, 스피너가 한 프레임 뒤 멈춥니다.",
        en: "Under reduced motion the dot pulse, the step rise, the note pop-out and the spinners stop after one frame.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter"],
        action: { ko: "적은 지시를 다음 단계용으로 대기열에 넣습니다.", en: "Queues the typed instruction for the next step." },
      },
      {
        keys: ["Mod+Enter"],
        action: { ko: "지금 도는 일을 끊고 지시를 바로 적용합니다.", en: "Applies the instruction at once, cutting the work in progress." },
      },
      { keys: ["Tab"], action: { ko: "일시정지 버튼, 메모 동작, 입력창, 보내기 순서로 이동합니다.", en: "Moves to the pause button, note actions, the input and send." } },
      { keys: ["Space"], action: { ko: "포커스한 버튼을 누릅니다.", en: "Presses the focused button." } },
    ],
  },
};
