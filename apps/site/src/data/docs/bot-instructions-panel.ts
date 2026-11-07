/**
 * Reference doc for `BotInstructionsPanel`, written against
 * `packages/react/src/components/bot-instructions-panel.tsx` and
 * `packages/flutter/lib/src/components/bot_instructions_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "bot-instructions-panel",
  anatomy: {
    description: {
      ko: "BotInstructionsPanel은 봇의 지침 프롬프트를 읽기 전용으로 보여 주고, 그 아래에서 시험 값을 고른 뒤 실행을 요청하는 패널입니다. 머리에는 봇과 버전 알약이, 본문에는 Instructions와 Example 두 탭이 있습니다.",
      en: "BotInstructionsPanel shows a bot's prompt read-only and, under it, lets a person pick test values and ask for a run. The header holds the version and bot pills; the body holds the Instructions and Example tabs.",
    },
    parts: [
      {
        name: "Panel",
        slot: "section",
        description: {
          ko: "패널 전체를 감싸는 section입니다. 24px 모서리와 표면 색을 쓰고 최대 너비가 620px입니다.",
          en: "The section wrapping the panel. It has a 24px radius, the surface fill and a 620px maximum width.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "제목, 버전 알약, 봇 알약이 한 줄에 놓입니다. 알약은 핸들러가 있을 때만 버튼이 되고, 버전 알약에는 라이브 점을 붙일 수 있습니다.",
          en: "The title, version pill and bot pill in one row. A pill is a button only when its handler is set, and the version pill can carry a live dot.",
        },
      },
      {
        name: "Tabs",
        slot: "PanelPillTabs",
        description: {
          ko: "Instructions와 Example을 오가는 알약 탭 트랙입니다. 선택 표시는 10% 잉크 알약이고 280ms 동안 옮겨 갑니다.",
          en: "The pill tab track that switches Instructions and Example. The selection is a 10% ink pill that slides across in 280ms.",
        },
      },
      {
        name: "Prompt",
        slot: "instructions",
        description: {
          ko: "줄마다 하나의 배열로 받는 프롬프트 본문입니다. 문자열은 그대로, 변수는 칩으로 렌더링하고 마지막 줄 끝에 캐럿이 깜박입니다.",
          en: "The prompt body, one array per line. Strings render as text and variables as chips, with a caret blinking at the end of the last line.",
        },
      },
      {
        name: "Variable chip",
        slot: "tone",
        description: {
          ko: "`{{name}}` 자리에 놓이는 둥근 칩입니다. tone으로 하늘, 짙은 하늘, 회색 중 하나의 바탕과 테두리를 씁니다.",
          en: "The rounded chip that stands in for a `{{name}}`. tone picks the sky, deeper sky or grey fill and ring.",
        },
      },
      {
        name: "Test values",
        slot: "variables",
        description: {
          ko: "프롬프트 아래에 붙는 변수별 시험 값입니다. 이름 옆에 칩과 같은 색의 점이 붙어 어느 칩과 짝인지 알려 줍니다.",
          en: "The test value per variable under the prompt. A dot in the chip's color ties each name to its chip.",
        },
      },
      {
        name: "Scenarios",
        slot: "scenarios",
        description: {
          ko: "Run 옆에 놓이는 두 번째 알약 탭 트랙입니다. 고른 값이 onRun에 그대로 전달됩니다.",
          en: "A second pill tab track next to Run. The selected value is passed to onRun as is.",
        },
      },
      {
        name: "Run",
        slot: "onRun",
        description: {
          ko: "시나리오를 골라 실행을 요청하는 버튼입니다. 패널 스스로는 아무것도 실행하지 않고 onRun만 호출합니다.",
          en: "The button that asks for a run with the chosen scenario. The panel runs nothing itself and only calls onRun.",
        },
      },
      {
        name: "Output",
        slot: "output",
        description: {
          ko: "마지막 실행의 결과가 놓이는 띠입니다. output이 없으면 자리를 차지하지 않고, 실행할 때마다 다시 올라옵니다.",
          en: "The strip that holds the last run's output. Without output it takes no space, and it rises in again on every run.",
        },
      },
    ],
  },
  properties: [
    {
      id: "instructions",
      title: { ko: "instructions", en: "instructions" },
      description: {
        ko: "프롬프트를 줄 단위로 나눈 배열입니다. 바깥 배열의 한 항목이 한 문단이고, 안쪽 배열에는 문자열과 { variable, tone } 조각이 섞입니다. 변수 이름은 중괄호 없이 적고 칩이 중괄호를 대신합니다.",
        en: "The prompt split into lines. One outer entry is one paragraph, and the inner array mixes strings with { variable, tone } pieces. Write the variable name without braces; the chip supplies them.",
      },
      example: "instructions",
    },
    {
      id: "tone",
      title: { ko: "tone", en: "tone" },
      description: {
        ko: "변수 칩과 시험 값 점의 색입니다. 같은 변수는 프롬프트와 시험 값에서 같은 tone을 써야 짝이 눈에 띕니다. 기본값은 sky입니다.",
        en: "The color of a variable chip and its test value dot. Use the same tone in the prompt and the test value so the pair reads as one. The default is sky.",
      },
      values: [
        {
          name: "sky",
          description: {
            ko: "옅은 하늘 바탕입니다. 대부분의 변수에 맞습니다.",
            en: "A light sky fill, right for most variables.",
          },
        },
        {
          name: "brand",
          description: {
            ko: "짙은 하늘 바탕입니다. 지침에서 특별히 강조하는 변수에 씁니다.",
            en: "A deeper sky fill for a variable the prompt leans on.",
          },
        },
        {
          name: "neutral",
          description: {
            ko: "회색 바탕입니다. 외부 입력처럼 성격이 다른 변수에 씁니다.",
            en: "A grey fill for a variable of another kind, such as outside input.",
          },
        },
      ],
      example: "instructions",
    },
    {
      id: "variables",
      title: { ko: "variables", en: "variables" },
      description: {
        ko: "프롬프트의 변수마다 하나씩 붙는 시험 값입니다. 값을 넘기면 variables나 scenarios 블록이 열리고, 둘 다 없으면 블록 자체가 사라집니다.",
        en: "One test value per prompt variable. Passing it opens the variables and scenarios block, and with neither the block disappears.",
      },
      example: "run",
    },
    {
      id: "scenarios",
      title: { ko: "scenarios", en: "scenarios" },
      description: {
        ko: "시험해 볼 상황 이름 목록입니다. 알약 탭으로 렌더링되고 첫 항목이 기본 선택이지만, defaultScenario로 다른 항목을 먼저 고를 수 있습니다.",
        en: "The situations to test against. They render as pill tabs and the first is selected by default, though defaultScenario can start on another.",
      },
      example: "run",
    },
    {
      id: "defaultScenario",
      title: { ko: "defaultScenario", en: "defaultScenario" },
      description: {
        ko: "처음 렌더링할 때 선택할 시나리오입니다. scenarios에 없는 이름을 넘기면 아무 알약도 선택되지 않습니다.",
        en: "The scenario selected on first render. A name that is not in scenarios leaves no pill selected.",
      },
      example: "run",
    },
    {
      id: "example",
      title: { ko: "example", en: "example" },
      description: {
        ko: "Example 탭에 보여 줄 내용입니다. 값을 넘기지 않으면 Example 탭을 눌러도 프롬프트가 그대로 남습니다.",
        en: "What the Example tab shows. Without it, pressing Example leaves the prompt in place.",
      },
      example: "example-tab",
    },
    {
      id: "tokenCount",
      title: { ko: "tokenCount", en: "tokenCount" },
      description: {
        ko: "탭 줄 오른쪽에 붙는 토큰 수입니다. 값을 넘기지 않으면 그 자리가 비어 있습니다.",
        en: "The token count at the right of the tab row. Leave it out and the slot stays empty.",
      },
      example: "version",
    },
    {
      id: "version",
      title: { ko: "version", en: "version" },
      description: {
        ko: "머리에 놓는 버전 라벨입니다. versionStatus를 함께 넘기면 라이브 점과 상태 문구가 알약 안에 붙습니다.",
        en: "The version label in the header. With versionStatus the pill also carries a live dot and the status text.",
      },
      example: "version",
    },
    {
      id: "onRun",
      title: { ko: "onRun", en: "onRun" },
      description: {
        ko: "Run을 누를 때 고른 시나리오를 받는 핸들러입니다. 시나리오가 없으면 undefined를 넘깁니다. 실행 자체는 호출한 쪽이 맡습니다.",
        en: "Called with the selected scenario when Run is pressed, or undefined with no scenarios. Running the prompt is the caller's job.",
      },
      example: "run",
    },
    {
      id: "output",
      title: { ko: "output", en: "output" },
      description: {
        ko: "마지막 실행의 결과입니다. output이 없는 동안에는 결과 띠가 접혀 있고, 값이 생기면 펼쳐지면서 올라옵니다.",
        en: "The last run's output. While it is undefined the result strip stays collapsed; a value expands it and rises in.",
      },
      example: "run",
    },
    {
      id: "onVersionClick",
      title: { ko: "onVersionClick", en: "onVersionClick" },
      description: {
        ko: "버전 알약을 버튼으로 바꿉니다. 핸들러가 없으면 같은 모양의 라벨로만 남아 버전을 바꿀 수 없다는 사실이 드러납니다.",
        en: "Turns the version pill into a button. Without the handler it stays a plain label, which shows the version cannot be switched.",
      },
      example: "version",
    },
    {
      id: "onBotClick",
      title: { ko: "onBotClick", en: "onBotClick" },
      description: {
        ko: "봇 알약을 버튼으로 바꿉니다. 다른 봇의 지침으로 옮겨 갈 수 있을 때만 넘깁니다.",
        en: "Turns the bot pill into a button. Pass it only when another bot's instructions can be opened from here.",
      },
      example: "version",
    },
  ],
  guidelines: [
    {
      id: "one-line-one-idea",
      title: { ko: "줄 하나에 지시 하나", en: "One instruction per line" },
      body: {
        ko: "instructions는 줄 단위로 렌더링되고, 각 줄은 따로 감싸집니다. 한 줄에 지시를 여러 개 넣으면 읽는 사람이 어느 부분이 조건인지 나눠 읽기 어렵습니다.",
        en: "instructions renders line by line, and each line wraps on its own. Several instructions on one line make it hard to see which part is a condition.",
      },
      do: {
        ko: "금지 규칙은 별도 줄로 내려 적습니다.",
        en: "Give a prohibition its own line.",
      },
      dont: {
        ko: "초안을 쓰고 보내지 말고 150자 이내로 유지하라고 한 줄에 몰아 적지 않습니다.",
        en: "Do not crowd draft it, do not send it and stay under 150 characters into one line.",
      },
      example: "instructions",
    },
    {
      id: "show-test-values",
      title: { ko: "변수에는 시험 값을 함께", en: "Give every variable a test value" },
      body: {
        ko: "프롬프트에 변수를 넣었으면 variables에도 같은 이름을 넣습니다. 칩만 있고 값이 없으면 실행했을 때 무엇이 대입되는지 알 수 없습니다.",
        en: "A variable in the prompt belongs in variables as well. A chip without a value leaves no way to tell what a run substitutes.",
      },
      do: {
        ko: "user_name 칩에 Alpox 값을 붙입니다.",
        en: "Pair the user_name chip with the value Alpox.",
      },
      dont: {
        ko: "칩만 남기고 variables를 비워 두지 않습니다.",
        en: "Do not leave variables empty while the chips remain.",
      },
      example: "run",
    },
    {
      id: "panel-does-not-run",
      title: { ko: "실행은 호출한 쪽이 맡습니다", en: "The caller runs the prompt" },
      body: {
        ko: "이 패널은 보여 주기만 하고 실행하지 않습니다. Run을 눌렀을 때 실제로 도는 일은 onRun에서 시작하고, 결과는 output으로 돌려주어야 화면이 맞습니다.",
        en: "The panel presents the prompt and runs nothing. Start the real work in onRun and hand the result back through output so the screen stays in step.",
      },
      example: "run",
    },
    {
      id: "example-is-sample-output",
      title: { ko: "Example은 결과 예시입니다", en: "Example is a sample output" },
      body: {
        ko: "Example 탭에는 같은 지침으로 나온 결과 예시를 넣습니다. 다른 지침을 한 벌 더 넣으면 어느 쪽이 실제로 쓰이는 프롬프트인지 흐려집니다.",
        en: "Put a sample of the output this prompt produces in the Example tab. A second set of instructions there blurs which prompt is actually in use.",
      },
      example: "example-tab",
    },
  ],
  specification: [
    {
      id: "panel-header",
      title: { ko: "패널과 머리", en: "Panel and header" },
      note: {
        ko: "값은 소스 클래스 그대로입니다.",
        en: "Values are the source classes as written.",
      },
      rows: [
        { state: "default", slot: "Panel", property: "radius", value: "rounded-[24px]" },
        { state: "default", slot: "Panel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Panel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Panel", property: "max width", value: "max-w-155" },
        { state: "default", slot: "Header", property: "padding", value: "px-5 pt-4 pb-3.5" },
        { state: "default", slot: "Header", property: "gap", value: "gap-2" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg text-text-primary" },
        { state: "default", slot: "Version pill", property: "height", value: "h-7.5" },
        { state: "default", slot: "Version pill", property: "padding", value: "px-2.5" },
        { state: "default", slot: "Version pill", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Version pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Version pill", property: "font", value: "text-label-sm text-text-primary" },
        { state: "Version · hover", slot: "Version pill", property: "background", value: "bg-overlay-ink-10" },
        { state: "Version status", slot: "Version pill", property: "dot", value: "size-1.5 bg-status-live animate-live-pulse" },
        { state: "Version status", slot: "Version pill", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Bot pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "Bot · hover", slot: "Bot pill", property: "background", value: "bg-overlay-ink-10" },
        { state: "default", slot: "Bot avatar", property: "size", value: "size-4.5" },
        { state: "default", slot: "Bot avatar", property: "radius", value: "rounded-[5px]" },
        { state: "default", slot: "Bot avatar", property: "background", value: "bg-interactive-primary text-text-inverse" },
        { state: "default", slot: "Header divider", property: "background", value: "h-px bg-overlay-ink-8" },
        { state: "focus-visible", slot: "Pill", property: "outline", value: "2px outline-text-brand" },
      ],
    },
    {
      id: "tabs-prompt",
      title: { ko: "탭과 프롬프트", en: "Tabs and prompt" },
      rows: [
        { state: "default", slot: "Tab track", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "Tab track", property: "padding", value: "p-[3px]" },
        { state: "default", slot: "Tab track", property: "gap", value: "gap-0.5" },
        { state: "default", slot: "Tab track", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Tab option", property: "height", value: "h-7.5" },
        { state: "default", slot: "Tab option", property: "padding", value: "px-3" },
        { state: "default", slot: "Tab option", property: "font", value: "text-label-md" },
        { state: "Tab · selected", slot: "Tab option", property: "text color", value: "text-text-primary" },
        { state: "Tab · rest", slot: "Tab option", property: "text color", value: "text-text-secondary" },
        { state: "Tab · hover", slot: "Tab option", property: "text color", value: "text-text-primary" },
        { state: "Tab · selection", slot: "Tab track", property: "background", value: "bg-overlay-ink-10" },
        { state: "Tab · selection", slot: "Tab track", property: "motion", value: "motion-indicator" },
        { state: "focus-visible", slot: "Tab option", property: "outline", value: "2px outline-text-brand" },
        { state: "default", slot: "Token count", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Prompt block", property: "padding", value: "px-5 pt-3 pb-3.5" },
        { state: "default", slot: "Prompt line", property: "gap", value: "gap-1" },
        { state: "default", slot: "Prompt line", property: "font", value: "text-body-sm text-text-primary" },
        { state: "Variable chip · sky", slot: "Chip", property: "background", value: "bg-accent-sky-500-18 ring-accent-sky-500-90/40" },
        { state: "Variable chip · brand", slot: "Chip", property: "background", value: "bg-accent-sky-700-18 ring-accent-sky-700-90/40" },
        { state: "Variable chip · neutral", slot: "Chip", property: "background", value: "bg-text-placeholder-18 ring-text-placeholder-90/40" },
        { state: "Variable chip", slot: "Chip", property: "radius", value: "rounded-xs" },
        { state: "Variable chip", slot: "Chip", property: "padding", value: "px-1.5 py-px" },
        { state: "Variable chip", slot: "Chip", property: "ring", value: "ring-1 ring-inset" },
        { state: "Caret", slot: "Prompt line", property: "size", value: "h-4 w-px" },
        { state: "Caret · focused", slot: "Prompt line", property: "motion", value: "animate-caret" },
        { state: "Hint", slot: "Prompt block", property: "font", value: "text-caption text-text-secondary" },
        { state: "Hint key", slot: "Prompt block", property: "background", value: "rounded-md bg-overlay-ink-6 px-1.5 py-px" },
      ],
    },
    {
      id: "test-block",
      title: { ko: "시험 블록과 실행", en: "Test block and run" },
      rows: [
        { state: "default", slot: "Test block", property: "padding", value: "px-5 pt-3 pb-3.5" },
        { state: "default", slot: "Test block", property: "gap", value: "gap-2.5" },
        { state: "Variable name", slot: "Test block", property: "font", value: "text-caption text-text-secondary" },
        { state: "Variable dot", slot: "Test block", property: "size", value: "size-1.5 rounded-full" },
        { state: "Variable dot · sky", slot: "Test block", property: "background", value: "bg-sky-500" },
        { state: "Variable dot · brand", slot: "Test block", property: "background", value: "bg-sky-700" },
        { state: "Variable dot · neutral", slot: "Test block", property: "background", value: "bg-neutral-500" },
        { state: "default", slot: "Variable value", property: "height", value: "h-10" },
        { state: "default", slot: "Variable value", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "Variable value", property: "radius", value: "rounded-md" },
        { state: "default", slot: "Variable value", property: "padding", value: "px-3" },
        { state: "default", slot: "Variable value", property: "font", value: "text-body-sm text-text-primary" },
        { state: "default", slot: "Run button", property: "height", value: "h-7.5" },
        { state: "default", slot: "Run button", property: "background", value: "bg-interactive-primary text-text-inverse" },
        { state: "Run · hover", slot: "Run button", property: "background", value: "bg-interactive-primary-hover" },
        { state: "default", slot: "Run button", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Run button", property: "icon", value: "size-3.5" },
        { state: "default", slot: "Run key hint", property: "background", value: "bg-bg-surface-6 text-text-inverse/80" },
        { state: "default", slot: "Output", property: "background", value: "bg-overlay-ink-3" },
        { state: "default", slot: "Output", property: "padding", value: "px-5 pt-3.5 pb-4" },
        { state: "default", slot: "Output", property: "font", value: "text-body-sm text-text-secondary" },
        { state: "output change", slot: "Output", property: "motion", value: "motion-rise" },
        { state: "collapse", slot: "Output", property: "motion", value: "motion-reveal" },
        { state: "pressed", slot: "Run button", property: "motion", value: "motion-press" },
      ],
    },
  ],
  examples: [
    {
      id: "instructions",
      title: { ko: "지침과 변수 칩", en: "Instructions and variable chips" },
      description: {
        ko: "다섯 줄짜리 프롬프트에 세 가지 tone의 변수 칩을 섞었습니다. 마지막 줄 끝에 캐럿이 있습니다.",
        en: "A five line prompt mixes variable chips in three tones. A caret sits at the end of the last line.",
      },
    },
    {
      id: "version",
      title: { ko: "버전과 봇 알약", en: "Version and bot pills" },
      description: {
        ko: "라이브 점이 붙은 버전 알약과 봇 알약을 버튼으로 만들고 토큰 수를 함께 적었습니다.",
        en: "The version pill carries a live dot, both pills are buttons, and the token count sits at the tab row.",
      },
    },
    {
      id: "run",
      title: { ko: "시나리오 실행", en: "Running a scenario" },
      description: {
        ko: "세 시나리오 중 하나를 고르고 Run을 누르면 결과 띠가 열리며 메시지가 올라옵니다.",
        en: "Pick one of three scenarios and press Run; the result strip opens and a message rises into it.",
      },
    },
    {
      id: "example-tab",
      title: { ko: "Example 탭", en: "The Example tab" },
      description: {
        ko: "Example 탭에 같은 지침의 결과 예시를 넣었습니다. 탭을 눌러 지침과 예시를 오갈 수 있습니다.",
        en: "The Example tab holds a sample output for the same prompt. Press the tab to move between the prompt and the sample.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "탭 트랙은 tablist이고 각 탭은 button role=tab입니다. 선택된 탭만 탭 순서에 남고, 좌우 화살표가 선택을 옮기며 포커스도 함께 옮깁니다.",
        en: "The tab track is a tablist and each tab is a button with role tab. Only the selected tab stays in the tab order, and the arrow keys move both the selection and focus.",
      },
      {
        ko: "탭 트랙에는 aria-label을 붙여야 합니다. 패널이 두 개의 트랙을 쓰므로 이름이 없으면 스크린 리더가 둘을 구분하지 못합니다.",
        en: "Each tab track needs an aria-label. The panel uses two tracks, and without a name a screen reader cannot tell them apart.",
      },
      {
        ko: "프롬프트 영역은 tabIndex 0으로 포커스를 받습니다. 포커스가 닿으면 마지막 줄 끝의 캐럿이 보이므로 지금 읽는 위치가 드러납니다.",
        en: "The prompt area takes focus with tabIndex 0. Focus reveals the caret at the end of the last line, so the reading position is visible.",
      },
      {
        ko: "출력 띠는 실행마다 새로 그려져 화면 낭독기가 다시 읽습니다. 결과가 길면 호출한 쪽에서 요약을 함께 넘기십시오.",
        en: "The output strip is redrawn on every run, so a screen reader reads it again. For a long result, pass a summary from the caller.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "버전·봇 알약, 선택된 탭, Run, 출력 순서로 이동합니다.", en: "Moves through the pills, the selected tab, Run and the output." },
      },
      {
        keys: ["ArrowLeft"],
        action: { ko: "탭 트랙에서 이전 항목을 고르고 그 탭으로 포커스를 옮깁니다.", en: "Selects the previous tab and moves focus to it." },
      },
      {
        keys: ["ArrowRight"],
        action: { ko: "탭 트랙에서 다음 항목을 고르고 그 탭으로 포커스를 옮깁니다.", en: "Selects the next tab and moves focus to it." },
      },
      {
        keys: ["Enter"],
        action: { ko: "포커스가 닿은 탭이나 Run 버튼을 실행합니다.", en: "Runs the focused tab or the Run button." },
      },
      {
        keys: ["Mod+Enter"],
        action: {
          ko: "Run 버튼에 적힌 조합입니다. ⌘↵은 macOS와 iOS, Ctrl+Enter는 그 밖의 환경이고, 키보드 힌트를 숨기는 터치 기기에서는 칩을 그리지 않습니다.",
          en: "The combination printed on Run: ⌘↵ on macOS and iOS, Ctrl+Enter elsewhere. Touch devices that hide keyboard hints get no chip.",
        },
      },
    ],
    pattern: {
      label: "WAI-ARIA Tabs Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
    },
  },
};
