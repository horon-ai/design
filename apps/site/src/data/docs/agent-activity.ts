/**
 * Reference doc for `Agent Activity`, written against
 * `packages/react/src/components/agent-activity.tsx` and
 * `packages/flutter/lib/src/components/agent_activity.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "agent-activity",
  anatomy: {
    description: {
      ko: "Agent Activity는 봇이 일하는 동안 대화에 남는 네 가지 표시를 한 파일에 모았습니다. 대기 중에는 점 세 개가 움직이는 알약을, 답이 오는 동안에는 글자가 찍히는 말풍선을, 도구를 부를 때는 도구 줄을, 끝난 작업은 접히는 기록 카드를 씁니다.",
      en: "Agent Activity gathers the four marks a bot leaves in a conversation while it works: a pill with moving dots while it thinks, a bubble that types the answer, a row for each tool call, and a collapsible log of finished steps.",
    },
    parts: [
      {
        name: "Thinking pill",
        slot: "ThinkingIndicator",
        description: {
          ko: "봇이 아직 첫 글자를 내지 않았을 때 보이는 알약입니다. 점 세 개가 150ms 간격으로 튀고, 상태 문구는 화면에 그리지 않고 접근성 이름으로만 씁니다.",
          en: "The pill shown before the first character arrives. Three dots bounce with a 150ms stagger; the status text is not painted, it only names the status for assistive technology.",
        },
      },
      {
        name: "Answer bubble",
        slot: "StreamingText",
        description: {
          ko: "답이 들어오는 말풍선입니다. 본문 body-sm과 2px 캐럿이 한 덩어리로 흐르고, 캐럿은 글자가 들어오는 동안 멈춰 있다가 다음 조각을 기다릴 때 깜빡입니다.",
          en: "The bubble the answer arrives in. Body-sm text and a 2px caret flow together; the caret holds still while characters land and blinks while it waits for the next chunk.",
        },
      },
      {
        name: "Tool row",
        slot: "ToolStep",
        description: {
          ko: "도구 호출 한 건을 나타내는 줄입니다. 앞에 진행 아이콘, 가운데 도구 이름과 상세 줄, 끝에 오른쪽 캐럿이 놓입니다.",
          en: "One tool call as a row: a progress icon, the tool name with an optional detail line, and a right caret at the end.",
        },
      },
      {
        name: "Log card",
        slot: "WorkLog",
        description: {
          ko: "끝난 단계를 묶는 카드입니다. 렌치 아이콘과 요약 줄이 있는 summary와 그 아래 단계 줄로 이루어지고, 네이티브 details 요소라 상태 없이 접히고 펴집니다.",
          en: "The card that groups finished steps: a summary row with a wrench icon, then one row per step. It is a native details element, so it collapses and expands with no state.",
        },
      },
    ],
  },
  properties: [
    {
      id: "state",
      title: { ko: "state", en: "state" },
      description: {
        ko: "ToolStep의 진행 상태입니다. 아이콘과 제목 색을 함께 정합니다.",
        en: "Progress of a ToolStep. It picks both the leading icon and the title color.",
      },
      values: [
        {
          name: "running",
          description: {
            ko: "기본값입니다. 작은 스피너가 돌고 제목은 text-primary로 남습니다.",
            en: "The default. A small spinner turns and the title stays text-primary.",
          },
        },
        {
          name: "done",
          description: {
            ko: "체크 아이콘이 secondary 색으로 붙습니다. 결과가 이미 나온 호출에 씁니다.",
            en: "A check in secondary color marks the row. Use it once the call has returned.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "경고 아이콘과 제목이 text-danger로 바뀝니다. 상세 줄에 실패 이유를 적습니다.",
            en: "A warning icon and a text-danger title. Put the reason in the detail line.",
          },
        },
      ],
      example: "tool-steps",
    },
    {
      id: "streaming",
      title: { ko: "streaming", en: "streaming" },
      description: {
        ko: "StreamingText에서 더 오는 글이 있는지를 알립니다. 참이면 캐럿이 남고 화면 낭독기는 aria-busy로 표시하며, 거짓이 되면 남은 글자를 한 번에 보여 주고 완성된 답을 한 번 읽어 줍니다.",
        en: "On StreamingText, whether more text is coming. While true the caret stays and screen readers see aria-busy; when it turns false the rest is revealed at once and the finished answer is announced once.",
      },
      example: "streaming",
    },
    {
      id: "smooth",
      title: { ko: "smooth", en: "smooth" },
      description: {
        ko: "도착한 조각을 한 번에 붙이지 않고 프레임마다 몇 글자씩 드러냅니다. 기본값은 참이고 동작 줄이기를 켜면 자동으로 꺼집니다. 한 번에 완성된 글을 보여 줄 때는 거짓으로 두어 타이핑 연출을 생략합니다.",
        en: "Reveals arriving chunks a few characters per frame instead of in one jump. The default is true and it turns itself off under reduced motion. Pass false when the whole text arrives at once and the typing effect would be noise.",
      },
      example: "streaming",
    },
    {
      id: "steps",
      title: { ko: "steps", en: "steps" },
      description: {
        ko: "WorkLog 아래에 늘어놓을 단계 목록입니다. 단계마다 고유한 id와 한 줄 제목이 필요하고, running을 켜면 체크 대신 작은 스피너가 붙습니다.",
        en: "The steps listed under a WorkLog. Each needs a stable id and a one-line title; set running to swap the check for a small spinner.",
      },
      example: "work-log",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "ThinkingIndicator의 접근성 이름입니다. 화면에는 그리지 않으므로 지금 무엇을 기다리는지 문장으로 적고, 기본값 Thinking은 그대로 두어도 됩니다.",
        en: "The accessible name of ThinkingIndicator. It is never painted, so write the waiting step as a sentence, or keep the Thinking default.",
      },
      example: "thinking",
    },
  ],
  guidelines: [
    {
      id: "thinking-then-bubble",
      title: { ko: "생각 중과 답변은 순서대로", en: "Think, then answer" },
      body: {
        ko: "첫 글자가 오기 전에는 ThinkingIndicator를 쓰고, 글자가 도착하기 시작하면 StreamingText로 바꿉니다. 두 표시를 같은 시점에 겹쳐 두면 봇이 생각하면서 동시에 답하는 것처럼 읽힙니다.",
        en: "Show ThinkingIndicator until the first character arrives, then switch to StreamingText. Showing both at once reads as if the bot is thinking and answering in the same breath.",
      },
      do: {
        ko: "요청을 보낸 직후 알약을 띄우고 첫 조각이 오면 말풍선으로 교체합니다.",
        en: "Raise the pill when the request goes out and swap to the bubble at the first chunk.",
      },
      dont: {
        ko: "알약과 말풍선을 같은 자리에 함께 두지 않습니다.",
        en: "Do not stack the pill and the bubble in the same place.",
      },
      example: "thinking",
    },
    {
      id: "whole-answer",
      title: { ko: "text에는 지금까지의 전체 답을", en: "Pass the whole answer so far" },
      body: {
        ko: "StreamingText의 text는 델타가 아니라 지금까지 받은 전부입니다. 새 조각만 넘기면 앞의 글이 사라지고, 글이 덧붙지 않고 다시 쓰이면 공통 접두사부터 드러내기를 다시 시작합니다.",
        en: "StreamingText takes the whole text received so far, not the newest delta. Passing only the newest chunk drops what came before, and a rewrite restarts the reveal from the shared prefix.",
      },
      do: {
        ko: "조각을 받을 때마다 누적한 문자열을 그대로 넘깁니다.",
        en: "Pass the accumulated string on every chunk.",
      },
      dont: {
        ko: "마지막 조각만 넘겨 앞 문장이 지워지게 두지 않습니다.",
        en: "Do not pass just the last chunk and lose the opening sentences.",
      },
      example: "streaming",
    },
    {
      id: "step-vs-log",
      title: { ko: "도구 줄과 기록 카드를 구분합니다", en: "Row for one call, log for many" },
      body: {
        ko: "ToolStep은 방금 부른 도구 하나를 보여 주고 눌러서 상세를 열 수 있는 줄입니다. 이미 지나간 여러 단계를 요약하려면 WorkLog를 씁니다. 기록 카드 안에 도구 줄을 다시 쌓지 않습니다.",
        en: "ToolStep shows the call in flight and can open its detail when pressed. To summarize steps that already passed, use WorkLog. Do not stack tool rows inside the log card.",
      },
      do: {
        ko: "도구 하나는 ToolStep으로, 그 도구를 포함한 전체 작업은 WorkLog로 정리합니다.",
        en: "One tool goes in a ToolStep; the run that contains it goes in a WorkLog.",
      },
      dont: {
        ko: "끝난 호출을 모두 ToolStep으로 늘어놓아 대화를 길게 만들지 않습니다.",
        en: "Do not list every finished call as a ToolStep and stretch the conversation.",
      },
      example: "work-log",
    },
  ],
  specification: [
    {
      id: "thinking-pill",
      title: { ko: "생각 중 알약", en: "Thinking pill" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름입니다.",
        en: "Values are the token utility names written in the component classes.",
      },
      rows: [
        { state: "default", slot: "ThinkingIndicator", property: "height", value: "31px" },
        { state: "default", slot: "ThinkingIndicator", property: "width", value: "69px" },
        { state: "default", slot: "ThinkingIndicator", property: "radius", value: "rounded-full" },
        { state: "default", slot: "ThinkingIndicator", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "ThinkingIndicator", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Dot", property: "size", value: "7px" },
        { state: "default", slot: "Dot", property: "fill", value: "bg-overlay-ink-35" },
        { state: "default", slot: "Dot", property: "fill", value: "bg-overlay-ink-55" },
        { state: "default", slot: "Dot", property: "fill", value: "bg-overlay-ink-80" },
        {
          state: "default",
          slot: "Dot",
          property: "motion",
          value: "animate-thinking",
          note: {
            ko: "1.2초 주기이고 점마다 150ms씩 늦게 출발합니다.",
            en: "A 1.2s cycle, each dot starting 150ms after the one before.",
          },
        },
      ],
    },
    {
      id: "answer-bubble",
      title: { ko: "답변 말풍선", en: "Answer bubble" },
      rows: [
        { state: "default", slot: "StreamingText", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "StreamingText", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "StreamingText", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "StreamingText", property: "padding", value: "px-4 py-3" },
        { state: "default", slot: "StreamingText", property: "font", value: "text-body-sm" },
        { state: "default", slot: "StreamingText", property: "text color", value: "text-text-primary" },
        { state: "typing", slot: "Caret", property: "width", value: "w-0.5" },
        { state: "typing", slot: "Caret", property: "height", value: "1.15em" },
        { state: "typing", slot: "Caret", property: "fill", value: "bg-interactive-primary" },
        {
          state: "waiting",
          slot: "Caret",
          property: "motion",
          value: "animate-caret",
          note: {
            ko: "글자가 들어오지 않는 동안에만 깜빡입니다.",
            en: "It blinks only while no characters are arriving.",
          },
        },
        {
          state: "reveal",
          slot: "StreamingText",
          property: "rate",
          value: "90 chars/s",
          note: {
            ko: "밀린 양이 많으면 초당 90자보다 빠르게 따라잡습니다.",
            en: "A larger backlog drains faster than 90 characters a second.",
          },
        },
      ],
    },
    {
      id: "tool-row-states",
      title: { ko: "도구 줄 상태", en: "Tool row states" },
      rows: [
        { state: "default", slot: "ToolStep", property: "radius", value: "rounded-md" },
        { state: "default", slot: "ToolStep", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "ToolStep", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "ToolStep", property: "padding", value: "px-2.5 py-2" },
        { state: "default", slot: "ToolStep", property: "gap", value: "10px" },
        { state: "default", slot: "Title", property: "font", value: "text-label-md" },
        { state: "default", slot: "Detail", property: "font", value: "text-caption" },
        { state: "default", slot: "Detail", property: "text color", value: "text-text-secondary" },
        {
          state: "running",
          slot: "Leading icon",
          property: "icon",
          value: "Spinner sm",
          note: {
            ko: "스피너는 title과 같은 줄 앞에 놓입니다.",
            en: "The spinner sits before the title on the same row.",
          },
        },
        { state: "done", slot: "Leading icon", property: "text color", value: "text-text-secondary" },
        { state: "failed", slot: "Leading icon", property: "icon", value: "WarningCircle" },
        { state: "failed", slot: "Leading icon", property: "text color", value: "text-text-danger" },
        { state: "failed", slot: "Title", property: "text color", value: "text-text-danger" },
        {
          state: "focus-visible",
          slot: "ToolStep",
          property: "outline",
          value: "2px outline-text-brand",
          note: {
            ko: "키보드로 포커스가 닿을 때만 그립니다.",
            en: "Drawn only when focus arrives from the keyboard.",
          },
        },
        {
          state: "pressed",
          slot: "ToolStep",
          property: "motion",
          value: "motion-press",
          note: {
            ko: "scale 0.97이고, 동작 줄이기를 켜면 즉시 끝납니다.",
            en: "Scale 0.97; it finishes instantly under reduced motion.",
          },
        },
      ],
    },
    {
      id: "log-card",
      title: { ko: "기록 카드", en: "Log card" },
      rows: [
        { state: "default", slot: "WorkLog", property: "radius", value: "rounded-2xl" },
        { state: "default", slot: "WorkLog", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "WorkLog", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "WorkLog", property: "padding", value: "6px" },
        { state: "default", slot: "WorkLog", property: "max width", value: "340px" },
        { state: "default", slot: "Summary", property: "font", value: "text-caption" },
        { state: "default", slot: "Summary", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Step", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Step", property: "padding", value: "px-2.5 py-1.5" },
        { state: "open", slot: "Caret", property: "rotation", value: "0deg" },
        {
          state: "closed",
          slot: "Caret",
          property: "rotation",
          value: "-90deg",
          note: {
            ko: "group-not-open에서만 돌아가며 transition은 200ms ease-out-quint입니다.",
            en: "It turns only while the details is closed, over 200ms ease-out-quint.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "thinking",
      title: { ko: "생각 중 표시", en: "Thinking pill" },
      description: {
        ko: "기본 알약과 대기 단계를 적은 알약을 나란히 두었습니다. label은 화면에 보이지 않고 상태 이름으로만 쓰입니다.",
        en: "The default pill next to one named for its waiting step. The label is never painted; it only names the status.",
      },
    },
    {
      id: "streaming",
      title: { ko: "스트리밍 답변", en: "Streamed answer" },
      description: {
        ko: "아직 오는 중인 답변과 끝난 답변을 비교합니다. 끝난 쪽은 캐럿 없이 전체 글을 한 번에 보여 줍니다.",
        en: "An answer still arriving against a finished one. The finished bubble drops the caret and shows the whole text at once.",
      },
    },
    {
      id: "tool-steps",
      title: { ko: "도구 단계", en: "Tool steps" },
      description: {
        ko: "running, done, failed 세 상태를 위에서 아래로 놓았습니다. 실패 줄만 아이콘과 제목이 danger 색으로 바뀝니다.",
        en: "The running, done and failed states in order. Only the failed row turns its icon and title to danger.",
      },
    },
    {
      id: "work-log",
      title: { ko: "작업 기록", en: "Work log" },
      description: {
        ko: "세 단계를 요약 줄 아래에 묶고 마지막 단계만 진행 중으로 두었습니다. 요약 줄을 누르면 기록이 접힙니다.",
        en: "Three steps under a summary line, with only the last one still running. Pressing the summary collapses the log.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "ThinkingIndicator는 role=status에 aria-label을 붙여 상태를 알립니다. 화면에는 아무 글자도 그리지 않으므로 label에 무엇을 기다리는지 적고, 기본값 Thinking으로 두어도 됩니다.",
        en: "ThinkingIndicator announces itself through role=status and aria-label. It paints no text, so put the waiting step in label, or keep the Thinking default.",
      },
      {
        ko: "StreamingText는 흐르는 글자를 aria-hidden으로 감추고, 끝났을 때 sr-only 영역의 aria-live=polite로 완성된 답을 한 번만 읽어 줍니다. 조각마다 읽히지 않습니다.",
        en: "StreamingText hides the flowing text with aria-hidden and, once the stream ends, reads the finished answer once from an sr-only aria-live=polite region. It never reads chunk by chunk.",
      },
      {
        ko: "ToolStep은 실제 button입니다. 누를 수 있는 줄처럼 보이므로 onClick을 넘기지 않으면 캐럿이 아무 일도 하지 않습니다.",
        en: "ToolStep is a real button. It looks pressable, so give it an onClick or the caret leads nowhere.",
      },
      {
        ko: "WorkLog는 네이티브 details와 summary라 접기와 펴기를 브라우저가 처리하고 키보드로도 동작합니다. 기본 마커는 숨기고 캐럿이 상태를 대신합니다.",
        en: "WorkLog is a native details and summary, so the browser handles expand and collapse, including from the keyboard. The default marker is hidden and the caret carries the state.",
      },
      {
        ko: "동작 줄이기를 켜면 점, 캐럿, 유리 같은 반복 애니메이션이 한 프레임 뒤 멈추고 상태 변화는 즉시 끝납니다.",
        en: "Under reduced motion the looping dot, caret and similar animations stop after one frame and state changes finish instantly.",
      },
    ],
    keyboard: [
      { keys: ["Tab"], action: { ko: "다음 도구 줄이나 요약 줄로 이동합니다.", en: "Moves to the next tool row or summary." } },
      { keys: ["Enter"], action: { ko: "포커스한 도구 줄을 누르거나 기록을 접고 폅니다.", en: "Presses the focused tool row or toggles the log." } },
      { keys: ["Space"], action: { ko: "기록 카드의 summary를 접거나 폅니다.", en: "Toggles the log's summary." } },
    ],
  },
};
