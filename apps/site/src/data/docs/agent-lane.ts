/**
 * Reference doc for `Agent Lane`, written against
 * `packages/react/src/components/agent-lane.tsx` and
 * `packages/flutter/lib/src/components/agent_lane.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "agent-lane",
  anatomy: {
    description: {
      ko: "Agent Lane은 리드 봇이 나눠 맡긴 하위 봇 하나를 보여 주는 카드입니다. 머리 줄에 봇 이름과 상태, 그 아래에 맡은 일, 도구, 결과, 사용량이 차례로 쌓입니다.",
      en: "Agent Lane is the card for one sub-bot that the lead delegated work to: a header with the bot's name and state, then the task, the tool, the output and the usage, in that order.",
    },
    parts: [
      {
        name: "Card",
        slot: "AgentLane",
        description: {
          ko: "레인 전체를 감싸는 16px 라운드 카드입니다. 실패하면 테두리만 danger 색으로 바뀝니다.",
          en: "The 16px-radius card around the lane. On failure only the border turns danger.",
        },
      },
      {
        name: "Bot header",
        slot: "bot",
        description: {
          ko: "18px 타일, 봇 이름, 상태 아이콘, 걸린 시간이 한 줄에 놓입니다. running이면 타일 둘레에 sky 링이 2초마다 퍼집니다.",
          en: "An 18px tile, the bot name, the status icon and the elapsed time on one row. While running, a sky ring spreads from the tile every 2 seconds.",
        },
      },
      {
        name: "Task line",
        slot: "task",
        description: {
          ko: "맡은 일을 label-lg로 적고, 좁아지면 여러 줄로 접힙니다.",
          en: "The delegated task in label-lg, wrapping onto several lines when the card narrows.",
        },
      },
      {
        name: "Tool row",
        slot: "tool",
        description: {
          ko: "14px 도구 아이콘과 출처를 caption으로 붙입니다. 한 줄로 자르므로 도구와 대상을 짧게 적습니다.",
          en: "A 14px tool icon and its source as a caption, cut to one line, so name the tool and target briefly.",
        },
      },
      {
        name: "Output line",
        slot: "output",
        description: {
          ko: "봇이 낸 결과 또는 실패 이유입니다. 실패 상태에서는 danger 색으로 바뀝니다.",
          en: "The result the bot produced, or why it failed. In the failed state it turns danger.",
        },
      },
      {
        name: "Usage line",
        slot: "usage",
        description: {
          ko: "토큰처럼 이 레인이 쓴 양을 caption으로 적습니다.",
          en: "What the lane spent, such as tokens, as a caption.",
        },
      },
    ],
  },
  properties: [
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "레인의 진행 상태입니다. 타일 색, 상태 아이콘, 테두리 색이 함께 바뀝니다.",
        en: "Progress of the lane. The tile fill, the status icon and the border color all change with it.",
      },
      values: [
        {
          name: "running",
          description: {
            ko: "sky-400 타일에 스피너, 그리고 타일 둘레의 링이 퍼집니다. 아직 결과가 없는 레인에 씁니다.",
            en: "A sky-400 tile with a spinner and a ring spreading from the tile. Use it while the lane has no result yet.",
          },
        },
        {
          name: "done",
          description: {
            ko: "sky-600 타일에 체크가 붙고 테두리는 기본색으로 남습니다.",
            en: "A sky-600 tile with a check, and the border stays at its default color.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "sky-800 타일에 경고가 붙고 테두리와 output이 danger 색으로 바뀝니다.",
            en: "A sky-800 tile with a warning, and the border and output turn danger.",
          },
        },
      ],
      example: "statuses",
    },
    {
      id: "bot",
      title: { ko: "bot", en: "bot" },
      description: {
        ko: "레인을 맡은 하위 봇입니다. initial은 18px 타일에 한 글자로 들어가고 name은 머리 줄에서 잘립니다.",
        en: "The sub-bot that owns the lane. initial is one character in the 18px tile and name truncates in the header.",
      },
      example: "statuses",
    },
    {
      id: "task",
      title: { ko: "task", en: "task" },
      description: {
        ko: "이 레인에 나눠 준 일입니다. 레인끼리 나란히 놓았을 때 한눈에 구별되도록 짧은 명사구로 적습니다.",
        en: "The work handed to this lane. Keep it a short noun phrase so lanes side by side are told apart at a glance.",
      },
      example: "minimal",
    },
    {
      id: "output",
      title: { ko: "output", en: "output" },
      description: {
        ko: "결과 또는 실패 이유입니다. 실패했을 때는 원인과 다음에 할 일을 한두 문장으로 적고, 성공했을 때는 다음 단계가 쓸 수 있는 형태로 요약합니다.",
        en: "The result, or the reason it failed. On failure name the cause and the next step in a sentence or two; on success summarize in a shape the next step can use.",
      },
      example: "statuses",
    },
    {
      id: "usage",
      title: { ko: "usage", en: "usage" },
      description: {
        ko: "레인이 쓴 양입니다. 토큰처럼 숫자로 비교할 수 있는 값만 적고, 모르면 비워 둡니다.",
        en: "What the lane spent. Put only comparable numbers such as tokens, and leave it out when unknown.",
      },
      example: "grid",
    },
    {
      id: "elapsed",
      title: { ko: "elapsed", en: "elapsed" },
      description: {
        ko: "머리 줄 오른쪽의 걸린 시간입니다. 숫자가 흔들리지 않도록 tabular-nums로 그립니다.",
        en: "The elapsed time at the right of the header, drawn with tabular-nums so the digits do not jitter.",
      },
      example: "grid",
    },
  ],
  guidelines: [
    {
      id: "one-lane-one-subtask",
      title: { ko: "레인 하나에 하위 작업 하나", en: "One subtask per lane" },
      body: {
        ko: "레인은 리드가 한 번에 나눠 준 단위입니다. 한 레인에 여러 작업을 묶으면 어느 부분이 늦어지는지 알 수 없고, 결과도 한 덩어리로 뭉개집니다.",
        en: "A lane is one unit the lead handed out at once. Bundling several tasks into a lane hides which part is late and flattens the results into one lump.",
      },
      do: {
        ko: "\"Portfolio metrics\"와 \"Draft the update email\"을 서로 다른 레인으로 나눕니다.",
        en: "Split \"Portfolio metrics\" and \"Draft the update email\" into separate lanes.",
      },
      dont: {
        ko: "한 레인에 조사와 작성과 발송을 모두 넣지 않습니다.",
        en: "Do not put research, writing and sending in one lane.",
      },
      example: "grid",
    },
    {
      id: "output-speaks-for-the-lane",
      title: { ko: "output이 레인의 결말입니다", en: "The output is the lane's ending" },
      body: {
        ko: "리드가 모으는 것은 output입니다. 결과를 다음 단계가 바로 쓸 수 있는 문장으로 적고, 실패했을 때는 output에 원인을 남겨 사람이 무엇을 고쳐야 하는지 알게 합니다.",
        en: "What the lead collects is the output. Write the result as a sentence the next step can use, and on failure leave the cause there so a person knows what to fix.",
      },
      do: {
        ko: "\"Revenue up 18%, burn down to $210k a month\"처럼 값을 담아 적습니다.",
        en: "Carry the numbers, as in \"Revenue up 18%, burn down to $210k a month\".",
      },
      dont: {
        ko: "\"Done\"만 적어 리드가 다시 물어야 하게 두지 않습니다.",
        en: "Do not write just \"Done\" and make the lead ask again.",
      },
      example: "statuses",
    },
    {
      id: "optional-lines",
      title: { ko: "모르는 줄은 비워 둡니다", en: "Leave unknown lines out" },
      body: {
        ko: "tool, output, usage, elapsed는 모두 선택입니다. 값이 없는데 자리만 채우면 카드가 길어지고 무엇이 실제 정보인지 흐려집니다. 레인을 처음 띄울 때는 task만으로도 충분합니다.",
        en: "tool, output, usage and elapsed are all optional. Filling them with placeholders makes the card long and blurs what is real. A lane that just started needs only its task.",
      },
      do: {
        ko: "방금 시작한 레인은 status, bot, task만 넘깁니다.",
        en: "Pass only status, bot and task for a lane that just started.",
      },
      dont: {
        ko: "모르는 토큰 수를 0으로 채우지 않습니다.",
        en: "Do not pass 0 for tokens you do not know.",
      },
      example: "minimal",
    },
    {
      id: "inside-the-orchestrator",
      title: { ko: "오케스트레이터 안에 놓습니다", en: "Place lanes in the orchestrator" },
      body: {
        ko: "레인이 여러 개라면 OrchestratorPanel의 자식으로 넣어 갈래 연결선과 30ms 시차 등장을 함께 얻습니다. 레인을 직접 격자로 배치하는 것은 두세 개를 한 번에 비교할 때만 씁니다.",
        en: "With several lanes, pass them as children of OrchestratorPanel to get the branch connectors and the 30ms staggered entrance. Lay lanes out in your own grid only when comparing two or three at once.",
      },
      do: {
        ko: "리드와 레인을 함께 보여 줄 때는 OrchestratorPanel을 씁니다.",
        en: "Use OrchestratorPanel when the lead and its lanes appear together.",
      },
      dont: {
        ko: "레인을 대화 말풍선 안에 넣어 리드 없이 늘어놓지 않습니다.",
        en: "Do not drop lanes into a chat bubble without the lead that spawned them.",
      },
      example: "grid",
    },
  ],
  specification: [
    {
      id: "lane-frame",
      title: { ko: "레인 틀", en: "Lane frame" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "AgentLane", property: "radius", value: "rounded-2xl" },
        { state: "default", slot: "AgentLane", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "AgentLane", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "AgentLane", property: "padding", value: "px-4 py-3" },
        { state: "default", slot: "AgentLane", property: "gap", value: "6px" },
        { state: "failed", slot: "AgentLane", property: "border", value: "1px border-border-danger" },
        { state: "default", slot: "Header", property: "font", value: "text-caption" },
        { state: "default", slot: "Header", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Bot tile", property: "size", value: "18px" },
        { state: "default", slot: "Bot tile", property: "radius", value: "rounded-xs" },
        { state: "default", slot: "Bot tile", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Bot tile", property: "text color", value: "text-text-inverse" },
        { state: "default", slot: "Elapsed", property: "font", value: "text-caption" },
        { state: "default", slot: "Task", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Task", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Tool row", property: "font", value: "text-caption" },
        { state: "default", slot: "Tool row", property: "icon size", value: "14px" },
        { state: "default", slot: "Output", property: "font", value: "text-body-sm" },
        { state: "failed", slot: "Output", property: "text color", value: "text-text-danger" },
        { state: "default", slot: "Usage", property: "font", value: "text-caption" },
      ],
    },
    {
      id: "status-colors",
      title: { ko: "상태별 색과 아이콘", en: "Status colors and icons" },
      rows: [
        { state: "running", slot: "Bot tile", property: "background", value: "bg-sky-400" },
        { state: "running", slot: "Status icon", property: "icon", value: "Spinner 12px" },
        {
          state: "running",
          slot: "Bot tile",
          property: "motion",
          value: "animate-live-pulse",
          note: {
            ko: "링은 currentColor로 그리므로 running 래퍼가 sky-400을 들고 있습니다.",
            en: "The ring is drawn in currentColor, so the running wrapper carries sky-400.",
          },
        },
        { state: "done", slot: "Bot tile", property: "background", value: "bg-sky-600" },
        { state: "done", slot: "Status icon", property: "icon", value: "CheckCircle" },
        { state: "done", slot: "Status icon", property: "text color", value: "text-text-secondary" },
        { state: "failed", slot: "Bot tile", property: "background", value: "bg-sky-800" },
        { state: "failed", slot: "Status icon", property: "icon", value: "WarningCircle" },
        { state: "failed", slot: "Status icon", property: "text color", value: "text-text-danger" },
        {
          state: "any change",
          slot: "AgentLane",
          property: "motion",
          value: "motion-colors",
          note: {
            ko: "색은 150ms로 바뀝니다.",
            en: "Colors change over 150ms.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "statuses",
      title: { ko: "세 상태", en: "Three states" },
      description: {
        ko: "running, done, failed를 위에서 아래로 놓았습니다. 실패한 레인만 테두리와 결과 문장이 danger 색입니다.",
        en: "Running, done and failed from top to bottom. Only the failed lane turns its border and output to danger.",
      },
    },
    {
      id: "grid",
      title: { ko: "나란히 비교", en: "Side by side" },
      description: {
        ko: "끝난 레인 두 개를 두 칸 격자에 놓아 결과와 사용량을 나란히 읽게 했습니다.",
        en: "Two finished lanes in a two-column grid, so results and usage read side by side.",
      },
    },
    {
      id: "minimal",
      title: { ko: "최소 구성", en: "Minimal" },
      description: {
        ko: "status, bot, task만 넘긴 레인입니다. 시작한 직후처럼 아직 결과도 도구도 없을 때 씁니다.",
        en: "A lane given only status, bot and task, for the moment it starts with no result or tool yet.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "레인에는 aria-live가 없습니다. 상태가 바뀌어도 화면 낭독기는 스스로 알리지 않으므로, 진행 상황을 읽어 줘야 하는 화면이라면 레인을 감싼 영역에 직접 라이브 영역을 둡니다.",
        en: "The lane has no aria-live, so a state change is not announced on its own. If the progress must be spoken, wrap the lanes in your own live region.",
      },
      {
        ko: "bot.initial은 화면 낭독기에서 봇 이름 앞에 그대로 읽힙니다. 이니셜과 이름이 겹쳐도 이름만으로 무엇을 맡았는지 알 수 있게 적습니다.",
        en: "bot.initial is read before the bot name. Even though the initial repeats the name, make the name alone say what the bot does.",
      },
      {
        ko: "tool.icon은 라벨이 이미 도구와 출처를 말하므로 aria-hidden으로 감춥니다. 아이콘에 다른 정보를 담았다면 라벨에도 같은 내용을 적습니다.",
        en: "Hide tool.icon with aria-hidden, since the label already names the tool and source. If the icon carries other information, put it in the label too.",
      },
      {
        ko: "상태는 아이콘 모양과 타일 색, 테두리로 함께 전달됩니다. 색을 구별하기 어려워도 스피너, 체크, 경고의 모양 차이로 구분됩니다.",
        en: "State arrives through the icon shape, the tile fill and the border together, so the spinner, check and warning are distinguishable without color.",
      },
      {
        ko: "동작 줄이기를 켜면 링 펄스가 한 프레임 뒤 멈추고 색 전환도 즉시 끝납니다.",
        en: "Under reduced motion the ring pulse stops after one frame and color transitions finish instantly.",
      },
    ],
    keyboard: [],
  },
};
