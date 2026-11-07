/**
 * Reference doc for `AgentLanesTimeline`, written against
 * `packages/react/src/components/agent-lanes-timeline.tsx` and
 * `packages/flutter/lib/src/components/agent_lanes_timeline.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "agent-lanes-timeline",
  anatomy: {
    description: {
      ko: "AgentLanesTimeline은 여러 봇의 실행 구간을 하나의 시간축에 놓는 패널입니다. 봇 하나가 행 하나를 차지하고, 각 행에는 그 봇이 맡은 작업 막대가 시간 위치대로 놓입니다.",
      en: "AgentLanesTimeline places several bots' run windows on one shared time axis. Each bot gets a row, and the task bars on that row sit at their time positions.",
    },
    parts: [
      {
        name: "Panel",
        slot: "section",
        description: {
          ko: "패널 전체를 감싸는 section입니다. 24px 모서리에 테두리와 표면 색을 씁니다.",
          en: "The section that wraps the panel, with a 24px radius, a border and the surface fill.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "펄스 아이콘, 제목, 상태 범례, 범위 알약이 한 줄에 놓입니다. 범위 알약은 onRangeClick이 있을 때만 버튼이 됩니다.",
          en: "Holds the pulse icon, the title, the status legend and the range pill in one row. The pill is a button only when onRangeClick is set.",
        },
      },
      {
        name: "Status legend",
        slot: "statuses",
        description: {
          ko: "제목 옆에 붙는 점과 라벨 쌍입니다. tone이 live면 초록 점, ink면 브랜드 점을 씁니다.",
          en: "Dot and label pairs next to the title. tone live paints a green dot, ink the brand dot.",
        },
      },
      {
        name: "Track",
        slot: "bots",
        description: {
          ko: "5분 간격 눈금이 깔린 시간축입니다. 최소 너비가 700px이라 좁은 패널에서는 가로로 스크롤합니다.",
          en: "The time axis with a tick every five minutes. It keeps a 700px minimum width and scrolls horizontally in a narrow panel.",
        },
      },
      {
        name: "Lane row",
        slot: "bots",
        description: {
          ko: "봇 하나의 행입니다. 높이 64px이고, 아바타·이름·도구 줄·배지가 왼쪽 230px 라벨 열에 놓입니다.",
          en: "One bot's row. It is 64px tall and puts the avatar, name, tools line and badge in a 230px label column.",
        },
      },
      {
        name: "Avatar",
        slot: "initial",
        description: {
          ko: "봇 이름의 첫 글자를 담는 34px 사각형입니다. tone으로 채움색을 고릅니다.",
          en: "A 34px square holding the first letter of the bot name. tone picks the fill.",
        },
      },
      {
        name: "Task bar",
        slot: "tasks",
        description: {
          ko: "작업 하나를 나타내는 막대입니다. start와 end 사이 구간을 채우고, 라벨과 아이콘과 배지를 담습니다.",
          en: "A bar for one task. It fills the span between start and end and holds a label, an icon and an optional badge.",
        },
      },
      {
        name: "Handoff curve",
        slot: "handoffs",
        description: {
          ko: "한 작업의 끝에서 다른 작업의 시작으로 이어지는 점선 곡선입니다. 끝점이 모두 있을 때만 그립니다.",
          en: "A dashed curve from one task's end to another task's start, drawn only when both ends resolve.",
        },
      },
      {
        name: "Now line",
        slot: "cursor",
        description: {
          ko: "현재 위치를 표시하는 세로선과 now 라벨입니다. cursor 값이 바뀌면 280ms 동안 미끄러집니다.",
          en: "The vertical line and now label marking the current position. A new cursor value glides there in 280ms.",
        },
      },
      {
        name: "Approval strip",
        slot: "approval",
        description: {
          ko: "타임라인 아래에 붙는 확인 줄입니다. 경고 아이콘, 질문 문구, Later와 Approve 버튼으로 이루어집니다.",
          en: "A confirmation strip under the timeline with a warning icon, the question, and the Later and Approve buttons.",
        },
      },
    ],
  },
  properties: [
    {
      id: "bots",
      title: { ko: "bots", en: "bots" },
      description: {
        ko: "행 하나에 해당하는 봇 배열입니다. 배열 순서가 그대로 행 순서가 되고, 행 높이는 항상 두 개 이상을 확보합니다. 봇이 하나뿐이어도 두 행 높이가 남습니다.",
        en: "The bots, one per row. Array order is row order, and at least two row heights are always reserved, so a single bot still leaves an empty row below.",
      },
      example: "lanes",
    },
    {
      id: "tasks",
      title: { ko: "tasks", en: "tasks" },
      description: {
        ko: "한 봇의 행에 놓이는 작업 막대입니다. start와 end는 시각이 아니라 창 끝에서 거슬러 올라간 분 단위이고, end는 start보다 커야 합니다. 서로 다른 봇의 작업은 같은 시간대에 겹쳐도 됩니다.",
        en: "The task bars on one bot's row. start and end are minutes counted back from the window's end, not timestamps, and end has to be greater than start. Tasks of different bots may overlap in time.",
      },
      example: "lanes",
    },
    {
      id: "tone",
      title: { ko: "tone", en: "tone" },
      description: {
        ko: "막대와 아바타의 색을 정합니다. 작업 막대는 done, running, failed, waiting 중 하나이고, 봇 아바타는 sky, steel, neutral, ink 중 하나입니다.",
        en: "Picks the color of a bar or avatar. A task bar takes done, running, failed or waiting; a bot avatar takes sky, steel, neutral or ink.",
      },
      values: [
        {
          name: "done",
          description: {
            ko: "끝난 작업입니다. 6% 잉크 바탕에 보조 텍스트 색을 씁니다.",
            en: "A finished task: a 6% ink fill with the secondary text color.",
          },
        },
        {
          name: "running",
          description: {
            ko: "지금 도는 작업입니다. 20% 라이브 그린 바탕에 스피너가 붙습니다.",
            en: "A task running now: a 20% live green fill with a spinner.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "실패한 작업입니다. 14% 빨강 바탕에 위험 텍스트 색을 씁니다.",
            en: "A failed task: a 14% red fill with the danger text color.",
          },
        },
        {
          name: "waiting",
          description: {
            ko: "사람의 확인을 기다리는 작업입니다. 표면 바탕에 브랜드 테두리를 두릅니다.",
            en: "A task waiting on a person: a surface fill with a brand border.",
          },
        },
      ],
      example: "approval",
    },
    {
      id: "handoffs",
      title: { ko: "handoffs", en: "handoffs" },
      description: {
        ko: "작업 id 두 개로 이루어진 연결입니다. from 작업의 끝에서 to 작업의 시작으로 점선 곡선을 긋고, 두 id 중 하나라도 이번 배열에 없으면 그 연결은 건너뜁니다.",
        en: "Links between two task ids. A dashed curve runs from the end of the from task to the start of the to task, and a link naming an unknown task is skipped.",
      },
      example: "handoffs",
    },
    {
      id: "windowMinutes",
      title: { ko: "windowMinutes", en: "windowMinutes" },
      description: {
        ko: "시간축의 길이입니다. 눈금 라벨은 5분 간격으로 놓이므로 값이 5의 배수일 때 축과 눈금이 맞습니다. 기본값은 30입니다.",
        en: "The length of the time axis. Tick labels sit every five minutes, so a multiple of five keeps the axis and its labels in step. The default is 30.",
      },
      example: "window",
    },
    {
      id: "cursor",
      title: { ko: "cursor", en: "cursor" },
      description: {
        ko: "now 선이 서 있는 자리를 창 끝에서 거슬러 올라간 분으로 지정합니다. 0이면 창의 오른쪽 끝이고, 값을 바꾸면 선이 280ms 동안 새 자리로 미끄러집니다.",
        en: "Where the now line stands, in minutes counted back from the window's end. Zero sits at the right edge, and a new value glides the line across in 280ms.",
      },
      example: "window",
    },
    {
      id: "approval",
      title: { ko: "approval", en: "approval" },
      description: {
        ko: "패널 아래에 확인 줄을 붙입니다. 질문 문구와 두 버튼을 받고, 버튼을 누르면 각각 onLater와 onApprove를 호출합니다. 값을 넘기지 않으면 줄 자체가 렌더링되지 않습니다.",
        en: "Adds a confirmation strip under the panel. It takes the question and two handlers, and its buttons call onLater and onApprove. Without the prop the strip is not rendered at all.",
      },
      example: "approval",
    },
    {
      id: "onRangeClick",
      title: { ko: "onRangeClick", en: "onRangeClick" },
      description: {
        ko: "범위 알약을 버튼으로 바꿉니다. 핸들러가 없으면 같은 모양의 라벨로만 렌더링되므로 기간을 바꿀 수 없다는 사실이 드러납니다.",
        en: "Turns the range pill into a button. Without the handler the pill renders as a plain label of the same shape, so it reads as fixed rather than clickable.",
      },
      example: "window",
    },
  ],
  guidelines: [
    {
      id: "concurrent-not-sequence",
      title: { ko: "동시 실행을 비교할 때 씁니다", en: "Use it to compare concurrent runs" },
      body: {
        ko: "여러 봇이 같은 시간대에 무엇을 하고 있는지 비교할 때 이 패널을 씁니다. 한 봇의 작업 순서만 보여 주려면 채팅 기록이나 실행 로그가 더 맞습니다.",
        en: "Use this panel to compare what several bots are doing in the same span of time. For the order of one bot's tasks, a chat transcript or a run log fits better.",
      },
      do: {
        ko: "리서처와 라이터가 같은 30분 안에 겹쳐 도는 구간을 한 화면에 둡니다.",
        en: "Put the Researcher and Writer runs that overlap inside the same 30 minutes on one screen.",
      },
      dont: {
        ko: "한 봇의 일곱 단계를 시간 순서로만 보여 주려고 빈 행을 늘리지 않습니다.",
        en: "Do not stretch empty rows to show one bot's seven steps in order.",
      },
      example: "lanes",
    },
    {
      id: "short-task-labels",
      title: { ko: "막대 라벨은 한두 단어로", en: "Keep bar labels to a word or two" },
      body: {
        ko: "막대 너비는 시간 구간이 정하고, 넘치는 라벨은 잘립니다. 라벨은 한두 단어로 줄이고 자세한 내용은 작업 자체에 둡니다.",
        en: "The span sets the bar width and a longer label is truncated. Keep the label to a word or two and leave the detail to the task itself.",
      },
      do: {
        ko: "Investor questions처럼 짧게 적습니다.",
        en: "Write something short such as Investor questions.",
      },
      dont: {
        ko: "Investor questions from the Q3 deck review call처럼 길게 적지 않습니다.",
        en: "Do not write Investor questions from the Q3 deck review call.",
      },
    },
    {
      id: "approval-one-question",
      title: { ko: "확인 줄은 막는 결정 하나에만", en: "Reserve the approval strip for a blocking decision" },
      body: {
        ko: "approval은 실행이 사람의 대답을 기다리며 멈춰 있을 때만 붙입니다. 지나간 기록이나 알림에는 쓰지 않습니다. 승인 줄이 늘 떠 있으면 어떤 작업이 실제로 막혀 있는지 판단할 수 없습니다.",
        en: "Add approval only while a run is held waiting for a person's answer. Do not use it for history or notices; a strip that is always there hides which run is actually blocked.",
      },
      do: {
        ko: "발송 직전에 멈춘 작업에만 승인 줄을 붙입니다.",
        en: "Show the strip only on the task that stopped just before sending.",
      },
      dont: {
        ko: "지난 실패를 알리는 용도로 승인 줄을 쓰지 않습니다.",
        en: "Do not use the strip to announce a failure from earlier.",
      },
      example: "approval",
    },
  ],
  specification: [
    {
      id: "panel-metrics",
      title: { ko: "패널과 헤더", en: "Panel and header" },
      note: {
        ko: "값은 소스 클래스 그대로입니다.",
        en: "Values are the source classes as written.",
      },
      rows: [
        { state: "default", slot: "Panel", property: "radius", value: "rounded-[24px]" },
        { state: "default", slot: "Panel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Panel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Panel", property: "max width", value: "max-w-252.5" },
        { state: "default", slot: "Header", property: "padding", value: "px-5 pt-4 pb-3.5" },
        { state: "default", slot: "Header", property: "gap", value: "gap-x-2.5 gap-y-2" },
        { state: "default", slot: "Header", property: "icon", value: "size-4.5 text-text-primary" },
        { state: "default", slot: "Header", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Status legend", property: "dot", value: "size-1.75 rounded-full" },
        { state: "Status · live", slot: "Status legend", property: "dot color", value: "bg-status-live" },
        { state: "Status · ink", slot: "Status legend", property: "dot color", value: "bg-interactive-primary" },
        { state: "Status", slot: "Status legend", property: "font", value: "text-body-sm text-text-secondary" },
        { state: "default", slot: "Range pill", property: "height", value: "h-7.5" },
        { state: "default", slot: "Range pill", property: "padding", value: "px-3" },
        { state: "default", slot: "Range pill", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Range pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Range pill", property: "font", value: "text-label-sm text-text-primary" },
        { state: "default", slot: "Range pill", property: "icon", value: "size-3 text-text-secondary" },
        { state: "Range · hover", slot: "Range pill", property: "background", value: "bg-overlay-ink-10" },
        { state: "focus-visible", slot: "Range pill", property: "outline", value: "2px outline-text-brand" },
        { state: "default", slot: "Header divider", property: "background", value: "h-px bg-overlay-ink-8" },
      ],
    },
    {
      id: "rows-bars",
      title: { ko: "행과 막대", en: "Rows and bars" },
      note: {
        ko: "행 높이 64px과 라벨 열 230px은 소스 상수에서 온 리터럴입니다.",
        en: "The 64px row height and 230px label column are literals from the source constants.",
      },
      rows: [
        { state: "default", slot: "Track", property: "minimum width", value: "700px" },
        { state: "default", slot: "Tick label", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Tick rule", property: "background", value: "w-px bg-overlay-ink-5" },
        { state: "default", slot: "Lane row", property: "height", value: "64px" },
        { state: "default", slot: "Lane row", property: "padding-left", value: "pl-5" },
        { state: "default", slot: "Lane row", property: "gap", value: "gap-3" },
        { state: "default", slot: "Lane row", property: "separator", value: "border-b border-overlay-ink-6" },
        { state: "Lane · hover", slot: "Lane row", property: "background", value: "bg-overlay-ink-3" },
        { state: "default", slot: "Avatar", property: "size", value: "size-8.5" },
        { state: "default", slot: "Avatar", property: "radius", value: "rounded-[10px]" },
        { state: "Avatar · sky", slot: "Avatar", property: "background", value: "bg-sky-500" },
        { state: "Avatar · steel", slot: "Avatar", property: "background", value: "bg-sky-700" },
        { state: "Avatar · neutral", slot: "Avatar", property: "background", value: "bg-neutral-500" },
        { state: "Avatar · ink", slot: "Avatar", property: "background", value: "bg-interactive-primary text-text-on-ink" },
        { state: "default", slot: "Bot name", property: "font", value: "text-label-md text-text-primary" },
        { state: "default", slot: "Tools line", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Bot badge", property: "background", value: "bg-overlay-ink-6" },
        { state: "Bot badge · ink", slot: "Bot badge", property: "background", value: "bg-interactive-primary text-text-inverse" },
        { state: "default", slot: "Task bar", property: "height", value: "h-9" },
        { state: "default", slot: "Task bar", property: "radius", value: "rounded-[10px]" },
        { state: "default", slot: "Task bar", property: "padding", value: "px-2.5" },
        { state: "default", slot: "Task bar", property: "gap", value: "gap-1.5" },
        { state: "default", slot: "Task bar", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Task bar", property: "icon", value: "size-3.5" },
        { state: "Task · done", slot: "Task bar", property: "background", value: "bg-overlay-ink-6 text-text-secondary" },
        { state: "Task · running", slot: "Task bar", property: "background", value: "bg-status-live/20 text-text-primary" },
        { state: "Task · failed", slot: "Task bar", property: "background", value: "bg-red-500/14 text-text-danger" },
        {
          state: "Task · waiting",
          slot: "Task bar",
          property: "border",
          value: "border border-interactive-primary bg-bg-surface-90 text-text-primary",
        },
        {
          state: "Task badge",
          slot: "Task bar",
          property: "background",
          value: "bg-interactive-primary text-text-inverse",
        },
        { state: "Handoff", slot: "Handoff curve", property: "stroke", value: "stroke-status-live" },
        { state: "Handoff", slot: "Handoff curve", property: "dash", value: "strokeDasharray 3 3" },
        { state: "Now line", slot: "Now line", property: "background", value: "w-[1.5px] bg-status-live/60" },
        { state: "Now label", slot: "Now line", property: "background", value: "bg-status-live/20 text-caption" },
      ],
    },
    {
      id: "approval-strip",
      title: { ko: "확인 줄", en: "Approval strip" },
      rows: [
        { state: "default", slot: "Approval strip", property: "padding", value: "px-5 py-3" },
        { state: "default", slot: "Approval strip", property: "gap", value: "gap-3" },
        { state: "default", slot: "Approval strip", property: "icon", value: "size-3.5 text-text-primary" },
        { state: "default", slot: "Approval strip", property: "font", value: "text-body-sm text-text-primary" },
        { state: "Later", slot: "Button", property: "background", value: "bg-overlay-ink-6" },
        { state: "Later · hover", slot: "Button", property: "background", value: "bg-overlay-ink-10" },
        { state: "Approve", slot: "Button", property: "background", value: "bg-interactive-primary text-text-inverse" },
        { state: "default", slot: "Button", property: "height", value: "h-7.5" },
        { state: "default", slot: "Button", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Button", property: "font", value: "text-label-sm" },
        { state: "focus-visible", slot: "Button", property: "outline", value: "2px outline-text-brand" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        {
          state: "cursor change",
          slot: "Now line",
          property: "transition",
          value: "duration-280 ease-emphasized",
          note: {
            ko: "선과 now 라벨이 같은 시간으로 함께 움직입니다.",
            en: "The line and the now label travel together over the same span.",
          },
        },
        {
          state: "bar change",
          slot: "Task bar",
          property: "transition",
          value: "duration-280 ease-emphasized",
          note: {
            ko: "left, width, 색과 테두리가 함께 바뀝니다.",
            en: "Left, width, colors and border all transition.",
          },
        },
        { state: "row entrance", slot: "Lane row", property: "motion", value: "motion-rise" },
        { state: "bar entrance", slot: "Task bar", property: "motion", value: "motion-rise" },
        {
          state: "row hover",
          slot: "Lane row",
          property: "motion",
          value: "motion-colors",
          note: {
            ko: "동작 줄이기를 켜면 색 전환이 즉시 끝납니다.",
            en: "With reduced motion the color change happens at once.",
          },
        },
        { state: "pressed", slot: "Button", property: "motion", value: "motion-press" },
      ],
    },
  ],
  examples: [
    {
      id: "lanes",
      title: { ko: "기본 행", en: "Lanes" },
      description: {
        ko: "두 봇의 작업을 30분 축에 놓았습니다. 아바타 색과 막대 색이 봇과 작업 상태를 구분합니다.",
        en: "Two bots' tasks on a 30 minute axis. Avatar and bar colors separate the bots and their task states.",
      },
    },
    {
      id: "handoffs",
      title: { ko: "넘김 곡선", en: "Hand-offs" },
      description: {
        ko: "세 봇이 차례로 이어받는 흐름을 점선 곡선으로 보여 줍니다. 상태 범례로 실행 중과 대기 수를 함께 적었습니다.",
        en: "A chain of three bots with dashed curves between them, plus a status legend counting running and waiting tasks.",
      },
    },
    {
      id: "approval",
      title: { ko: "확인 줄", en: "Approval strip" },
      description: {
        ko: "사람의 승인을 기다리는 작업에 확인 줄을 붙였습니다. 실패 막대와 대기 막대가 같은 행에 있습니다.",
        en: "A task waiting on a person carries the approval strip. A failed bar and a waiting bar share the row.",
      },
    },
    {
      id: "window",
      title: { ko: "60분 창과 현재 선", en: "A 60 minute window and the now line" },
      description: {
        ko: "windowMinutes를 60으로 늘리고 cursor를 슬라이더로 옮깁니다. 선과 눈금이 함께 움직입니다.",
        en: "windowMinutes grows to 60 and a slider moves cursor. The line and the ticks move together.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "패널은 section 요소이고 제목은 h3입니다. 페이지에서 이 패널이 어떤 묶음에 속하는지 드러나도록 앞에 제목 단계를 두십시오.",
        en: "The panel is a section with an h3 title. Give it a heading level above it so the page shows which group the panel belongs to.",
      },
      {
        ko: "아바타와 눈금 규칙과 현재 선과 넘김 곡선은 aria-hidden입니다. 이 장식이 사라져도 남는 정보는 작업 라벨과 상태 범례입니다.",
        en: "The avatar, tick rules, now line and hand-off curves are aria-hidden. The information that survives without them is the task labels and the status legend.",
      },
      {
        ko: "막대 라벨은 시간 정보를 대신하지 않습니다. 시작과 끝이 중요한 작업이면 패널 밖에 시각을 적어 두십시오.",
        en: "A bar label does not carry the time. When start and end matter, write the times outside the panel.",
      },
      {
        ko: "동작 줄이기를 켜면 행과 막대의 등장과 현재 선의 이동이 즉시 끝납니다. 정보는 그대로 남습니다.",
        en: "With reduced motion the row entrances and the now line jump instead of animating. The information stays the same.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "범위 알약과 승인 줄 버튼으로 차례로 이동합니다. 핸들러가 없는 알약은 포커스를 받지 않습니다.",
          en: "Moves through the range pill and the approval buttons. A pill without a handler takes no focus.",
        },
      },
      {
        keys: ["Enter"],
        action: {
          ko: "포커스가 닿은 범위 알약이나 승인 버튼을 실행합니다.",
          en: "Runs the focused range pill or approval button.",
        },
      },
      {
        keys: ["Space"],
        action: {
          ko: "포커스가 닿은 범위 알약이나 승인 버튼을 실행합니다.",
          en: "Runs the focused range pill or approval button.",
        },
      },
    ],
  },
};
