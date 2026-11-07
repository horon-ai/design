/**
 * Reference doc for `ToolCallsHeader`, written against
 * `packages/react/src/components/tool-calls-header.tsx` and
 * `packages/flutter/lib/src/components/tool_calls_header.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "tool-calls-header",
  anatomy: {
    description: {
      ko: "ToolCallsHeader는 한 차례에 묶인 도구 호출들의 제목 줄입니다. 겹친 도구 칩과 상태 문구가 접힘 버튼이 되어, 그 아래 ToolCall 카드를 함께 펼치고 접습니다.",
      en: "ToolCallsHeader is the title row of one batch of tool calls. Overlapping tool chips and the status text form a disclosure button that opens and closes the ToolCall cards beneath.",
    },
    parts: [
      {
        name: "Card",
        slot: "section",
        description: {
          ko: "제목 줄과 카드를 감싸는 카드입니다. 12px 모서리에 테두리와 표면 색을 씁니다.",
          en: "The card that wraps the header and the calls, with a 12px radius, a border and the surface fill.",
        },
      },
      {
        name: "Chip stack",
        slot: "icons",
        description: {
          ko: "도구 아이콘을 28px 칩으로 겹쳐 놓은 묶음입니다. 앞의 세 개만 그려지고, 각 칩은 표면 색 테두리로 다음 칩과 분리됩니다.",
          en: "The overlapping 28px chips of tool icons. Only the first three are drawn, and each chip is separated from the next by a surface-coloured ring.",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "상태 문구입니다. 기본값은 Using tools…이고, 도구가 모두 끝난 뒤에는 Used 2 tools처럼 지난형으로 바꿔 씁니다.",
          en: "The status text. It defaults to Using tools…, and after the calls finish it usually reads in the past tense, such as Used 2 tools.",
        },
      },
      {
        name: "Elapsed",
        slot: "elapsed",
        description: {
          ko: "제목 뒤에 가운뎃점으로 이어 붙는 소요 시간입니다. 값이 없으면 아무것도 그리지 않습니다.",
          en: "The elapsed time appended after the title with a middot. Without a value nothing is drawn.",
        },
      },
      {
        name: "Trigger",
        slot: "defaultOpen",
        description: {
          ko: "Base UI Collapsible의 버튼입니다. 누르면 패널이 열리고 캐럿이 180도 돌아갑니다.",
          en: "The Base UI Collapsible button. A press opens the panel and turns the caret 180 degrees.",
        },
      },
      {
        name: "Panel",
        slot: "children",
        description: {
          ko: "ToolCall 카드를 8px 간격으로 쌓는 접히는 영역입니다. 열고 닫을 때 높이가 부드럽게 바뀝니다.",
          en: "The collapsing region that stacks ToolCall cards 8px apart. Its height eases when it opens and closes.",
        },
      },
    ],
  },
  properties: [
    {
      id: "icons",
      title: { ko: "icons", en: "icons" },
      description: {
        ko: "칩으로 그릴 도구 아이콘입니다. 앞의 세 개만 그려지고 나머지는 버려지므로, 같은 도구가 여러 번 불렸다면 아이콘을 중복해 넣지 않습니다.",
        en: "The tool icons drawn as chips. Only the first three are used and the rest are dropped, so do not repeat an icon for a tool that ran twice.",
      },
      example: "open",
    },
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "제목 줄의 문구입니다. 실행 중에는 기본값 Using tools…를 그대로 쓰고, 끝난 뒤에는 지난형으로 바꿉니다. 길면 잘립니다.",
        en: "The text of the header row. Keep the default Using tools… while calls run and switch to the past tense afterwards. It truncates when long.",
      },
      example: "collapsed",
    },
    {
      id: "elapsed",
      title: { ko: "elapsed", en: "elapsed" },
      description: {
        ko: "묶음 전체의 소요 시간입니다. 4.0s처럼 짧게 적고, 없으면 그리지 않습니다.",
        en: "The total time for the batch, written short such as 4.0s. Omit it and nothing is drawn.",
      },
      example: "open",
    },
    {
      id: "defaultOpen",
      title: { ko: "defaultOpen", en: "defaultOpen" },
      description: {
        ko: "처음에 카드를 펼쳐 둘지 정합니다. 기본값은 참입니다. 한 번 누른 뒤에는 컴포넌트가 상태를 스스로 들고 있어 이 값을 바꿔도 따라가지 않습니다.",
        en: "Whether the cards start open. It defaults to true, and after the first press the component holds its own state, so a later change to this value does not move it.",
      },
      example: "collapsed",
    },
    {
      id: "open",
      title: { ko: "open", en: "open" },
      description: {
        ko: "펼침 상태를 밖에서 정합니다. 넘길 때는 onOpenChange도 함께 넘겨야 사용자가 접고 펼 수 있습니다.",
        en: "The open state controlled from outside. Pass onOpenChange with it, or the user cannot open and close the group.",
      },
      example: "controlled",
    },
    {
      id: "onOpenChange",
      title: { ko: "onOpenChange", en: "onOpenChange" },
      description: {
        ko: "트리거를 누를 때 다음 펼침 상태를 받습니다. open과 함께 쓰면 제어 컴포넌트가 됩니다.",
        en: "Receives the next open state when the trigger is pressed. With open it makes the group controlled.",
      },
      example: "controlled",
    },
  ],
  guidelines: [
    {
      id: "one-batch-per-turn",
      title: { ko: "한 묶음은 한 차례의 호출", en: "One group per turn" },
      body: {
        ko: "이 제목은 한 답변 안에서 이어서 일어난 도구 호출을 묶습니다. 턴이 바뀌면 새 묶음을 만들고, 서로 다른 턴의 호출을 한 카드에 모으면 어느 호출이 어느 답변에 속하는지 알 수 없습니다.",
        en: "The header groups tool calls that happened in one reply. Start a new group on the next turn; mixing turns in one card hides which call belongs to which reply.",
      },
      example: "open",
    },
    {
      id: "status-tense",
      title: { ko: "제목은 상태에 맞춰 시제를 바꿉니다", en: "Match the title to the state" },
      body: {
        ko: "호출이 도는 동안에는 Using tools…를 유지하고, 모두 끝나면 Used 2 tools처럼 지난형으로 바꿉니다. 끝난 묶음에 현재형이 남아 있으면 아직 도는 작업으로 읽힙니다.",
        en: "Keep Using tools… while calls run, and switch to the past tense, such as Used 2 tools, once they finish. A present tense title on a finished batch reads as still running.",
      },
      do: {
        ko: "끝난 뒤 Used 3 tools로 적습니다.",
        en: "After finishing, write Used 3 tools.",
      },
      dont: {
        ko: "끝난 묶음에 Using tools…를 그대로 두지 않습니다.",
        en: "Do not leave Using tools… on a finished batch.",
      },
      example: "collapsed",
    },
    {
      id: "three-icons",
      title: { ko: "칩은 세 개까지", en: "Three chips at most" },
      body: {
        ko: "칩은 세 개까지만 그려집니다. 네 번째부터는 조용히 사라지므로 아이콘을 더 주지 말고, 자세한 내용은 아래 ToolCall 카드에 맡깁니다.",
        en: "Only three chips are drawn; a fourth disappears without notice. Do not pass more icons and leave the detail to the ToolCall cards below.",
      },
      example: "open",
    },
    {
      id: "children-are-tool-calls",
      title: { ko: "자식은 ToolCall 카드", en: "Children are ToolCall cards" },
      body: {
        ko: "패널은 자식을 8px 간격의 세로 열로 쌓기만 합니다. 각 호출의 상태와 인자와 결과를 보여 주는 일은 ToolCall이 맡으므로, 다른 모양의 내용을 넣으면 접힘 동작만 남고 호출 정보가 사라집니다.",
        en: "The panel only stacks children in an 8px column. ToolCall shows each call's state, arguments and result, so other content loses the call information and keeps only the collapse.",
      },
      example: "collapsed",
    },
  ],
  specification: [
    {
      id: "card-trigger",
      title: { ko: "카드와 트리거", en: "Card and trigger" },
      note: {
        ko: "값은 소스 클래스 그대로입니다.",
        en: "Values are the source classes as written.",
      },
      rows: [
        { state: "default", slot: "Card", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Card", property: "padding", value: "p-3" },
        { state: "default", slot: "Trigger", property: "gap", value: "gap-2.5" },
        { state: "default", slot: "Trigger", property: "padding-bottom", value: "pb-1" },
        { state: "focus-visible", slot: "Trigger", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Trigger", property: "outline offset", value: "2px" },
        { state: "default", slot: "Chip", property: "size", value: "size-7" },
        { state: "default", slot: "Chip", property: "radius", value: "rounded-[10px]" },
        { state: "default", slot: "Chip", property: "background", value: "bg-bg-subtle text-text-secondary" },
        { state: "default", slot: "Chip", property: "ring", value: "ring-2 ring-bg-surface" },
        { state: "default", slot: "Chip", property: "overlap", value: "-ml-2" },
        { state: "default", slot: "Chip", property: "icon", value: "size-3.5" },
        { state: "default", slot: "Title", property: "font", value: "text-label-md text-text-primary" },
        { state: "default", slot: "Elapsed", property: "font", value: "text-label-md text-text-secondary" },
        { state: "default", slot: "Caret", property: "size", value: "size-4 text-text-secondary" },
        { state: "open", slot: "Caret", property: "transform", value: "rotate-180" },
        {
          state: "toggle",
          slot: "Caret",
          property: "transition",
          value: "duration-200 ease-out-quint",
          note: {
            ko: "캐럿은 트리거 바로 뒤에서 180도 돌아갑니다.",
            en: "The caret turns 180 degrees right after the trigger.",
          },
        },
      ],
    },
    {
      id: "panel",
      title: { ko: "패널", en: "Panel" },
      rows: [
        { state: "default", slot: "Panel", property: "gap", value: "gap-2" },
        { state: "default", slot: "Panel", property: "padding-top", value: "pt-1" },
        { state: "open", slot: "Panel", property: "motion", value: "motion-collapse" },
        {
          state: "open",
          slot: "Card",
          property: "stack",
          value: "8px",
          note: {
            ko: "카드 사이 간격은 패널의 gap-2에서 나옵니다.",
            en: "The gap between cards comes from the panel's gap-2.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "open",
      title: { ko: "펼친 묶음", en: "An open batch" },
      description: {
        ko: "세 도구 칩과 4.0초 소요 시간을 단 묶음이 처음부터 펼쳐져 있습니다. 끝난 호출과 도는 호출이 함께 있습니다.",
        en: "Three tool chips and a 4.0s elapsed time start expanded, with one finished call and one still running.",
      },
    },
    {
      id: "collapsed",
      title: { ko: "접힌 묶음", en: "A collapsed batch" },
      description: {
        ko: "defaultOpen을 거짓으로 두어 두 호출이 접힌 채 시작합니다. 제목은 지난형이고, 하나는 실패해 Retry가 붙습니다.",
        en: "defaultOpen false starts the two calls collapsed. The title is in the past tense and one failure carries a Retry.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어 상태", en: "Controlled" },
      description: {
        ko: "open과 onOpenChange로 펼침 상태를 밖에서 정하고, 아래 버튼으로 같은 상태를 바꿉니다.",
        en: "open and onOpenChange hold the state outside the header, and the button below flips the same value.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "트리거는 Base UI Collapsible의 버튼이라 펼침 상태를 aria-expanded로, 패널을 aria-controls로 연결합니다. 별도로 role을 붙이지 않습니다.",
        en: "The trigger is a Base UI Collapsible button, so it exposes the open state through aria-expanded and points at the panel with aria-controls. No extra role is added.",
      },
      {
        ko: "칩은 장식이므로 아이콘에 aria-hidden을 붙입니다. 칩이 말해 주는 정보는 제목 문구와 아래 호출 카드에 이미 들어 있습니다.",
        en: "The chips are decoration, so mark the icons aria-hidden. What they suggest is already in the title and the call cards below.",
      },
      {
        ko: "제목은 잘릴 수 있지만 접근 가능한 이름은 전체 문자열입니다. 상태를 문구에 담아 두면 칩을 보지 못하는 사용자도 무엇이 도는지 알 수 있습니다.",
        en: "The title may truncate, yet its accessible name is the whole string. Keeping the state in the text tells someone who cannot see the chips what is running.",
      },
      {
        ko: "펼침과 접힘은 높이 애니메이션이며 동작 줄이기를 켜면 즉시 끝납니다. 캐럿 회전도 같은 설정을 따릅니다.",
        en: "Opening and closing animate the height, and reduced motion ends them at once. The caret rotation follows the same setting.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter"],
        action: { ko: "묶음을 펼치거나 접습니다.", en: "Opens or closes the group." },
      },
      {
        keys: ["Space"],
        action: { ko: "묶음을 펼치거나 접습니다.", en: "Opens or closes the group." },
      },
      {
        keys: ["Tab"],
        action: {
          ko: "트리거로 이동한 뒤 펼쳐진 카드 안의 버튼으로 이어집니다.",
          en: "Moves to the trigger, then into the buttons of the open cards.",
        },
      },
    ],
  },
};
