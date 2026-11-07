/**
 * Reference doc for `Orchestrator Panel`, written against
 * `packages/react/src/components/orchestrator-panel.tsx` and
 * `packages/flutter/lib/src/components/orchestrator_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "orchestrator-panel",
  anatomy: {
    description: {
      ko: "Orchestrator Panel은 리드 봇이 일을 나눠 맡기는 장면을 한 판에 담습니다. 위에서부터 제목과 병렬 수 선택, Stop 버튼, 리드 봇 줄, 리드가 세운 계획, 갈래 연결선으로 이어진 레인들, 마지막에 돌아온 결과를 모으는 요약 카드가 놓입니다.",
      en: "Orchestrator Panel holds the whole hand-off in one frame: the title with the parallel picker and Stop button, the lead bot's row, the plan the lead set, the lanes joined by branch connectors, and a closing summary card.",
    },
    parts: [
      {
        name: "Panel",
        slot: "OrchestratorPanel",
        description: {
          ko: "24px 라운드의 surface 판입니다. 모든 조각이 선택 사항이라 title과 lead만으로도 리드 뷰 하나로 동작합니다.",
          en: "A 24px-radius surface panel. Every part is optional, so title and lead alone make a working lead view.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "제목 아래에 병렬 수 라벨과 segmented picker, 오른쪽에 Stop 버튼이 한 줄로 놓입니다.",
          en: "The title, then one row with the parallel label, its segmented picker and the Stop button at the right.",
        },
      },
      {
        name: "Lead row",
        slot: "lead",
        description: {
          ko: "22px 타일과 봇 이름, 역할, 상태 문구, 걸린 시간이 한 줄에 놓입니다. running이면 13px 스피너가 이름 옆에서 돕니다.",
          en: "A 22px tile, the bot name, its role, the status text and the elapsed time on one row, with a 13px spinner while it runs.",
        },
      },
      {
        name: "Plan list",
        slot: "plan",
        description: {
          ko: "리드가 세운 단계를 점과 문장으로 늘어놓습니다. 각 줄은 30ms 간격으로 올라오고, 지금 도는 단계의 점만 펄스합니다.",
          en: "The steps the lead set, each a dot and a sentence. Rows rise in 30ms apart and only the running step's dot pulses.",
        },
      },
      {
        name: "Lane branch",
        slot: "children",
        description: {
          ko: "레인마다 왼쪽 위에서 꺾여 들어오는 1.5px 연결선을 그리고, 레인 사이에는 세로 줄기를 이어 붙입니다.",
          en: "Each lane gets a 1.5px elbow entering from the upper left, with a vertical trunk between consecutive lanes.",
        },
      },
      {
        name: "Summary card",
        slot: "summary",
        description: {
          ko: "돌아온 결과를 모으는 카드입니다. 제목과 개수, 본문으로 이루어지고, 넘기지 않으면 접힌 채 자리만 남습니다.",
          en: "The card that gathers what came back: a title, a count and a body. Without it the slot stays collapsed.",
        },
      },
    ],
  },
  properties: [
    {
      id: "parallelOptions",
      title: { ko: "parallelOptions", en: "parallelOptions" },
      description: {
        ko: "한 번에 몇 개의 레인을 돌릴지 고르는 선택지입니다. 넘길 때만 picker가 그려지고, 넘기지 않으면 헤더에는 Stop 버튼만 남습니다.",
        en: "The choices for how many lanes run at once. The picker renders only when it is passed; without it the header keeps just the Stop button.",
      },
      example: "fan-out",
    },
    {
      id: "parallelValue",
      title: { ko: "parallelValue", en: "parallelValue" },
      description: {
        ko: "지금 고른 병렬 수입니다. 값을 넘기면 제어 상태가 되고, 넘기지 않으면 picker가 스스로 고른 값을 들고 있습니다.",
        en: "The parallel count picked now. Passing it makes the picker controlled; without it the picker holds the choice itself.",
      },
      example: "fan-out",
    },
    {
      id: "onParallelChange",
      title: { ko: "onParallelChange", en: "onParallelChange" },
      description: {
        ko: "병렬 수를 고를 때 숫자로 불립니다. 값은 문자열로 오는 segmented control을 거쳐 숫자로 바뀌므로 그대로 상태에 넣으면 됩니다.",
        en: "Called with a number when the count is picked. The value passes through the segmented control as a string and arrives converted, so it can go straight into state.",
      },
      example: "fan-out",
    },
    {
      id: "onStop",
      title: { ko: "onStop", en: "onStop" },
      description: {
        ko: "Stop 버튼이 부르는 함수입니다. 넘길 때만 버튼이 그려지므로, 중지할 수 없는 실행에는 넘기지 않습니다.",
        en: "Called by the Stop button, which renders only when this is passed, so leave it out for a run that cannot be stopped.",
      },
      example: "stopped",
    },
    {
      id: "lead",
      title: { ko: "lead", en: "lead" },
      description: {
        ko: "일을 나누는 리드 봇입니다. initial, name이 필수이고 role은 비우면 Lead로 채워집니다. running은 스피너를, status와 elapsed는 오른쪽 caption을 켭니다.",
        en: "The lead bot that fans work out. initial and name are required, role falls back to Lead, and running turns on the spinner while status and elapsed fill the captions at the right.",
      },
      example: "lead-only",
    },
    {
      id: "plan",
      title: { ko: "plan", en: "plan" },
      description: {
        ko: "리드가 세운 단계 목록입니다. label이 React key로도 쓰이므로 중복되지 않게 적고, dotClassName으로 레인마다 다른 점 색을 줄 수 있습니다.",
        en: "The steps the lead set. label doubles as the React key, so keep the steps unique, and dotClassName lets each step carry its lane's dot color.",
      },
      example: "fan-out",
    },
    {
      id: "summary",
      title: { ko: "summary", en: "summary" },
      description: {
        ko: "레인들이 돌려준 결과를 모으는 카드입니다. count에는 돌아온 수를, body에는 합쳐진 내용을 적고, title을 비우면 Summary가 됩니다.",
        en: "The card that gathers what the lanes returned: count holds how many came back and body holds the merged result. An empty title falls back to Summary.",
      },
      example: "fan-out",
    },
    {
      id: "children",
      title: { ko: "children", en: "children" },
      description: {
        ko: "레인 카드들입니다. 자식마다 연결선 하나가 그려지고 마지막 자식 앞까지만 세로 줄기가 이어지므로, 레인이 아닌 엘리먼트를 섞지 않습니다.",
        en: "The lane cards. One connector is drawn per child and the trunk runs between consecutive children, so do not mix in elements that are not lanes.",
      },
      example: "stopped",
    },
  ],
  guidelines: [
    {
      id: "set-parallel-before-start",
      title: { ko: "병렬 수는 시작 전에 고릅니다", en: "Pick the count before the run" },
      body: {
        ko: "parallelOptions는 한 번에 몇 개의 레인을 돌릴지 정하는 값입니다. 이미 도는 중에 값을 바꾸면 화면이 약속하는 동작과 실제 실행이 어긋나므로, 실행 중에는 Stop만 열어 두고 picker는 시작 전 상태에 맞춰 둡니다.",
        en: "parallelOptions decides how many lanes run at once. Changing it mid-run puts the promise of the panel out of step with the run, so leave only Stop live and keep the picker at the pre-start state.",
      },
      do: {
        ko: "작업을 시작하기 전에 1, 2, 3, 4 중 하나를 고르게 합니다.",
        en: "Let the count be chosen from 1 to 4 before the task starts.",
      },
      dont: {
        ko: "도는 중에 병렬 수를 바꿔 이미 뜬 레인과 수를 맞추지 않습니다.",
        en: "Do not change the count mid-run and leave it contradicting the lanes already up.",
      },
      example: "fan-out",
    },
    {
      id: "lanes-are-children",
      title: { ko: "레인만 자식으로 넣습니다", en: "Only lanes as children" },
      body: {
        ko: "연결선은 자식 수만큼 그려집니다. 레인이 아닌 안내 문구나 버튼을 자식으로 넣으면 그 앞에도 갈래가 생겨 없는 레인을 가리킵니다. 레인이 없을 때는 children을 비우고 리드와 계획만 보여 줍니다.",
        en: "One connector is drawn per child. Putting a hint or a button among the children draws a branch that points at no lane. With no lanes, pass no children and show just the lead and plan.",
      },
      do: {
        ko: "AgentLane만 children으로 넘깁니다.",
        en: "Pass only AgentLane cards as children.",
      },
      dont: {
        ko: "레인 사이에 구분 문구나 빈 상태 안내를 끼워 넣지 않습니다.",
        en: "Do not slip labels or empty-state copy between lanes.",
      },
      example: "stopped",
    },
    {
      id: "summary-reports-returns",
      title: { ko: "요약은 돌아온 수를 말합니다", en: "The summary reports what returned" },
      body: {
        ko: "summary는 레인이 끝났는지 사람이 다시 세지 않아도 되게 합니다. count에 돌아온 수를 적고 body에 합쳐진 내용을 적습니다. 아직 아무것도 돌아오지 않았으면 그 사실을 그대로 적습니다.",
        en: "summary saves people from recounting the lanes. Put how many returned in count and the merged content in body, and when nothing has come back yet, say so.",
      },
      do: {
        ko: "\"0 of 3 returned\"처럼 현재 수를 그대로 적습니다.",
        en: "State the current count, as in \"0 of 3 returned\".",
      },
      dont: {
        ko: "레인이 아직 도는데 \"Complete\"라고 적지 않습니다.",
        en: "Do not write Complete while lanes are still running.",
      },
      example: "fan-out",
    },
    {
      id: "lead-only-is-enough",
      title: { ko: "리드만으로도 동작합니다", en: "The lead alone is enough" },
      body: {
        ko: "title과 lead 외에는 모두 선택입니다. 리드가 혼자 처리하는 작업에는 picker도 레인도 요약도 필요 없으므로, 빈 자리를 채우려고 넘기지 않습니다.",
        en: "Everything but title and lead is optional. Work the lead does alone needs no picker, lanes or summary, so do not pass them just to fill space.",
      },
      do: {
        ko: "혼자 도는 작업은 title, lead, 그리고 필요하면 status만 넘깁니다.",
        en: "For a solo run pass title, lead and, if useful, status.",
      },
      dont: {
        ko: "레인이 없는데 빈 요약 카드를 띄우지 않습니다.",
        en: "Do not raise an empty summary card when no lane exists.",
      },
      example: "lead-only",
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
        { state: "default", slot: "OrchestratorPanel", property: "radius", value: "24px" },
        { state: "default", slot: "OrchestratorPanel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "OrchestratorPanel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Header", property: "padding", value: "px-5 pt-4 pb-3.5" },
        { state: "default", slot: "Header", property: "gap", value: "12px" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Parallel label", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Parallel label", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Separator", property: "height", value: "1px" },
        { state: "default", slot: "Separator", property: "background", value: "bg-overlay-ink-8" },
        { state: "default", slot: "Body", property: "padding", value: "px-5 pt-4 pb-5" },
        { state: "default", slot: "Body", property: "gap", value: "10px" },
        { state: "default", slot: "Stop button", property: "height", value: "30px" },
        { state: "default", slot: "Stop button", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Stop button", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Stop button", property: "padding", value: "px-3" },
        { state: "default", slot: "Stop button", property: "font", value: "text-label-sm" },
        { state: "hover", slot: "Stop button", property: "background", value: "bg-overlay-ink-10" },
        { state: "focus-visible", slot: "Stop button", property: "outline", value: "2px outline-text-brand" },
      ],
    },
    {
      id: "lead",
      title: { ko: "리드 줄", en: "Lead row" },
      rows: [
        { state: "default", slot: "Lead row", property: "gap", value: "8px" },
        { state: "default", slot: "Lead tile", property: "size", value: "22px" },
        { state: "default", slot: "Lead tile", property: "radius", value: "5px" },
        { state: "default", slot: "Lead tile", property: "background", value: "bg-interactive-primary" },
        { state: "default", slot: "Lead tile", property: "text color", value: "text-text-inverse" },
        { state: "default", slot: "Lead name", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Lead role", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Lead role", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Lead status", property: "font", value: "text-caption" },
        { state: "running", slot: "Lead row", property: "icon", value: "Spinner 13px" },
        { state: "default", slot: "Plan list", property: "padding", value: "pt-0.5 pb-1 pl-7.5" },
        { state: "default", slot: "Plan list", property: "gap", value: "6px" },
        { state: "default", slot: "Plan row", property: "motion", value: "motion-rise" },
        {
          state: "plan row",
          slot: "Plan row",
          property: "delay",
          value: "30ms per row",
          note: {
            ko: "행마다 animationDelay를 30ms씩 늘려 계단처럼 올라옵니다.",
            en: "Each row adds 30ms to its animation delay, so the list rises in steps.",
          },
        },
        { state: "default", slot: "Plan dot", property: "size", value: "6px" },
        { state: "default", slot: "Plan dot", property: "background", value: "bg-status-live" },
        { state: "running", slot: "Plan dot", property: "motion", value: "animate-live-pulse" },
        { state: "running", slot: "Plan dot", property: "text color", value: "text-sky-400" },
        { state: "default", slot: "Plan label", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Plan label", property: "text color", value: "text-text-primary" },
      ],
    },
    {
      id: "branches-and-summary",
      title: { ko: "갈래와 요약", en: "Branches and summary" },
      rows: [
        { state: "default", slot: "Lane column", property: "padding", value: "pl-7.5" },
        { state: "default", slot: "Lane column", property: "gap", value: "10px" },
        { state: "default", slot: "Elbow", property: "size", value: "30px × 22px" },
        { state: "default", slot: "Elbow", property: "radius", value: "rounded-bl-lg" },
        { state: "default", slot: "Elbow", property: "border", value: "1.5px border-overlay-ink-14" },
        {
          state: "default",
          slot: "Elbow",
          property: "shape",
          value: "bottom and left edges",
          note: {
            ko: "레인마다 하나씩, 왼쪽 위에서 꺾여 들어옵니다.",
            en: "One per lane, entering from the upper left.",
          },
        },
        {
          state: "between lanes",
          slot: "Trunk",
          property: "border",
          value: "1.5px border-overlay-ink-14",
          note: {
            ko: "마지막 레인 앞까지만 세로로 이어집니다.",
            en: "It runs vertically only up to the last lane.",
          },
        },
        { state: "default", slot: "Lane", property: "motion", value: "motion-rise" },
        { state: "default", slot: "Summary card", property: "radius", value: "rounded-2xl" },
        { state: "default", slot: "Summary card", property: "background", value: "bg-overlay-ink-4" },
        { state: "default", slot: "Summary card", property: "padding", value: "px-4 py-3" },
        { state: "default", slot: "Summary title", property: "font", value: "text-label-md" },
        { state: "default", slot: "Summary title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Summary count", property: "font", value: "text-caption" },
        { state: "default", slot: "Summary count", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Summary body", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Summary body", property: "text color", value: "text-text-secondary" },
        {
          state: "reveal",
          slot: "Summary wrapper",
          property: "motion",
          value: "motion-reveal",
          note: {
            ko: "요약이 없으면 이 감싸개가 접힌 채 자리를 차지하지 않습니다.",
            en: "Without a summary the wrapper collapses and takes no room.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "fan-out",
      title: { ko: "리드에서 레인으로", en: "Lead to lanes" },
      description: {
        ko: "병렬 수 선택, Stop, 리드, 세 단계 계획, 레인 세 개, 요약을 모두 담았습니다. 갈래 연결선이 레인마다 하나씩 그려집니다.",
        en: "Every part at once: the parallel picker, Stop, the lead, a three-step plan, three lanes and the summary. One branch connector is drawn per lane.",
      },
    },
    {
      id: "lead-only",
      title: { ko: "리드만", en: "Lead only" },
      description: {
        ko: "title과 lead만 넘긴 패널입니다. 레인도 계획도 없으면 연결선과 요약 자리가 함께 사라집니다.",
        en: "A panel given only title and lead. With no lanes and no plan, the connectors and the summary slot disappear.",
      },
    },
    {
      id: "stopped",
      title: { ko: "중지", en: "Stopped" },
      description: {
        ko: "Stop을 누르면 리드의 스피너가 멈추고 도는 레인이 실패로 닫히며 버튼 문구가 Stopped로 바뀝니다.",
        en: "Pressing Stop halts the lead's spinner, closes the running lane as failed and changes the button text to Stopped.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "parallelLabel이 문자열일 때만 segmented control의 aria-label로도 쓰입니다. 엘리먼트를 넘기면 picker에 이름이 사라지므로 라벨은 문자열로 두고, 다른 이름이 필요하면 picker를 직접 감싸 이름을 줍니다.",
        en: "parallelLabel doubles as the segmented control's aria-label only while it is a string. Passing an element leaves the picker unnamed, so keep the label a string or name the picker yourself.",
      },
      {
        ko: "헤더와 본문 사이의 구분선은 role=\"separator\"를 가진 1px 선입니다. 시각적 구분이 전부이므로 이 선에 다른 의미를 기대하지 않습니다.",
        en: "The line between header and body is a 1px separator with role=\"separator\". It is a visual break and nothing more.",
      },
      {
        ko: "계획 줄의 점은 aria-hidden이고 단계 문장이 뜻을 담습니다. 지금 도는 단계는 펄스하는 점과 running 상태로 표시되지만, 스피너만으로 단계를 알리지는 않습니다.",
        en: "The plan dots are aria-hidden and the step sentence carries the meaning. A running step pulses its dot, but the spinner alone never announces the step.",
      },
      {
        ko: "레인이 끝나도 패널은 스스로 알리지 않습니다. 결과가 도착했다는 사실을 읽어 줘야 하면 summary를 라이브 영역으로 감싸 직접 알립니다.",
        en: "The panel does not announce lane completions. If the arrival of results must be spoken, wrap summary in your own live region.",
      },
      {
        ko: "동작 줄이기를 켜면 계획 줄과 레인의 rise, 점의 펄스, 요약 공개가 한 프레임 뒤 멈춥니다.",
        en: "Under reduced motion the plan and lane rise, the dot pulse and the summary reveal stop after one frame.",
      },
    ],
    keyboard: [
      { keys: ["Tab"], action: { ko: "병렬 수 picker와 Stop 버튼으로 이동합니다.", en: "Moves to the parallel picker and the Stop button." } },
      { keys: ["Enter"], action: { ko: "고른 병렬 수를 적용하거나 Stop을 실행합니다.", en: "Applies the picked count or runs Stop." } },
      { keys: ["Space"], action: { ko: "고른 병렬 수를 적용합니다.", en: "Applies the picked count." } },
    ],
  },
};
