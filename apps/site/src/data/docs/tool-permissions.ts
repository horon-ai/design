/**
 * Reference doc for `ToolPermissions`, written against
 * `packages/react/src/components/tool-permissions.tsx` and
 * `packages/flutter/lib/src/components/tool_permissions.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "tool-permissions",
  anatomy: {
    description: {
      ko: "ToolPermissions는 도구마다 허용, 확인, 끔 중 하나를 고르는 카드입니다. 옅은 머리말에 제목과 개수 알약, 일괄 설정 버튼이 있고, 아래로 도구 한 줄씩 이름·설명·세그먼트 컨트롤이 이어집니다.",
      en: "A ToolPermissions card sets allow, ask or off for each tool. A subtle header holds the title, a count pill and a bulk button, and below it one divided row per tool carries a name, a description and a segmented control.",
    },
    parts: [
      {
        name: "Card",
        slot: "div",
        description: {
          ko: "바깥 상자입니다. 둥근 테두리, 표면 바탕, 최대 520px 너비를 갖고 줄을 잘라 넘치지 않게 합니다.",
          en: "The outer box. It has rounded corners, a surface fill and a 520px maximum width, and clips its rows so nothing spills.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "44px 높이의 옅은 머리말입니다. 제목, 도구 개수를 담은 알약, 오른쪽의 일괄 설정 텍스트 버튼이 한 줄에 놓입니다.",
          en: "The 44px subtle header. The title, a pill with the tool count and the bulk text button share one row.",
        },
      },
      {
        name: "Row",
        slot: "tools",
        description: {
          ko: "도구 하나의 줄입니다. 왼쪽에 mono 글꼴의 이름과 설명이, 오른쪽에 허용·확인·끔 세그먼트 컨트롤이 놓입니다.",
          en: "One tool's row: the name in mono type and its description on the left, and the Allow, Ask and Off control on the right.",
        },
      },
      {
        name: "Permission control",
        slot: "SegmentedControl",
        description: {
          ko: "줄 오른쪽의 작은 세그먼트 컨트롤입니다. sm 크기에 solid 바탕, fill 없음으로 그려지고 세그먼트 이름은 \"<도구 이름> permission\"입니다.",
          en: "The small segmented control on the right of a row, drawn at sm on the solid surface with fill off. Its accessible name is \"<tool name> permission\".",
        },
      },
    ],
  },
  properties: [
    {
      id: "values",
      title: { ko: "values", en: "values" },
      description: {
        ko: "도구 이름을 키로 갖는 제어 값입니다. 넘기면 모든 줄이 이 값을 따르고, 넘기지 않으면 카드가 defaultValue로 시작한 자기 상태를 씁니다. 각 값은 다음 세 가지 중 하나입니다: allow는 묻지 않고 실행하고, ask는 호출마다 확인하며, off는 도구를 끕니다.",
        en: "The controlled map keyed by tool name. Passing it makes every row follow the map; leaving it out lets the card keep its own state, seeded from each defaultValue. Each value is one of three: allow runs without asking, ask confirms on every call, and off disables the tool.",
      },
      example: "controlled",
    },
    {
      id: "tools",
      title: { ko: "tools", en: "tools" },
      description: {
        ko: "도구 목록입니다. name은 줄에 보이는 이름이자 values의 키이고, description은 이름 아래 캡션입니다. defaultValue는 그 줄의 시작 값이며 주지 않으면 ask에서 시작합니다. 목록 길이가 머리말의 개수 알약에 그대로 나타납니다.",
        en: "The tool list. name is both the visible name and the key in values, description is the caption under it, and defaultValue seeds that row, defaulting to ask. The list length is what the header pill shows.",
      },
      example: "defaults",
    },
    {
      id: "allowAllLabel",
      title: { ko: "allowAllLabel", en: "allowAllLabel" },
      description: {
        ko: "모든 도구를 허용으로 한 번에 바꾸는 머리말 버튼의 문구입니다. 기본값은 \"Allow all\"이며, 이 버튼은 onValuesChange로 전체 맵을 넘깁니다.",
        en: "Text of the header button that sets every tool to Allow at once. It defaults to \"Allow all\", and the button reports the whole map through onValuesChange.",
      },
      example: "allow-all",
    },
    {
      id: "onValuesChange",
      title: { ko: "onValuesChange", en: "onValuesChange" },
      description: {
        ko: "줄 하나가 바뀌거나 일괄 설정을 눌렀을 때 완성된 다음 맵으로 호출됩니다. 부분 변경이 아니라 전체 맵이므로 그대로 저장하면 됩니다.",
        en: "Called with the complete next map whenever one row changes or the bulk button is pressed. It is the whole map rather than a patch, so it can be saved as is.",
      },
      example: "controlled",
    },
  ],
  guidelines: [
    {
      id: "ask-is-the-safe-default",
      title: { ko: "기본값은 ask", en: "Ask is the safe default" },
      body: {
        ko: "defaultValue를 비워 두면 그 도구는 ask에서 시작합니다. 도구가 무엇을 읽고 쓰는지 사용자가 아직 모르는 상태라면 확인을 한 번 거치는 편이 안전하고, 읽기만 하는 도구처럼 결과가 명확한 것만 allow로 시작합니다.",
        en: "Leaving defaultValue out starts that tool on ask. While the person cannot yet tell what a tool reads or writes, one confirmation is the safer start; reserve allow for tools whose effect is plain, such as read-only lookups.",
      },
      do: {
        ko: "파일을 지우는 도구는 ask에서 시작합니다.",
        en: "Start a tool that deletes files on ask.",
      },
      dont: {
        ko: "모든 도구를 allow에서 시작하지 않습니다.",
        en: "Do not start every tool on allow.",
      },
      example: "defaults",
    },
    {
      id: "describe-what-it-touches",
      title: { ko: "설명에 무엇을 건드리는지 적습니다", en: "Say what the tool touches" },
      body: {
        ko: "이름만으로는 그 도구가 읽기만 하는지 쓰기까지 하는지 알 수 없습니다. description에 대상과 동작을 함께 적으면 사용자가 확인을 켜 둘지 판단할 수 있습니다. 설명을 비워 두면 이름만 남아 판단 근거가 사라집니다.",
        en: "A name alone does not say whether a tool reads or also writes. A description that names the target and the effect gives the person what they need to decide about confirmation. Without one, only the name remains and the grounds for judging are gone.",
      },
      do: {
        ko: "\"Read one issue with its comments\"처럼 대상을 적습니다.",
        en: "Name the target, as in \"Read one issue with its comments\".",
      },
      dont: {
        ko: "설명 없이 도구 이름만 나열하지 않습니다.",
        en: "Do not list tool names with no description.",
      },
      example: "defaults",
    },
    {
      id: "allow-all-is-not-a-default",
      title: { ko: "Allow all은 사용자가 누르게", en: "Let the person press Allow all" },
      body: {
        ko: "일괄 허용 버튼은 편의를 위한 것이지 처음 상태가 아닙니다. 카드가 열릴 때 모든 도구를 허용으로 두면 사용자가 확인 없이 실행되는 것을 모르게 됩니다. 민감한 도구가 섞여 있으면 버튼 문구를 바꿔 무엇이 바뀌는지 분명히 합니다.",
        en: "The bulk button is a convenience, not a starting state. Opening the card with every tool allowed runs things without the person knowing. When sensitive tools are in the list, change the button text so what it does is clear.",
      },
      example: "allow-all",
    },
    {
      id: "one-card-per-group",
      title: { ko: "도구 묶음 하나에 카드 하나", en: "One card per group of tools" },
      body: {
        ko: "카드 하나가 권한 묶음 하나입니다. 읽기 도구와 쓰기 도구를 나눠 두면 사용자가 위험한 묶음만 따로 좁힐 수 있습니다. 도구가 스무 개를 넘으면 한 카드에 모두 담지 말고 성격별로 나눕니다.",
        en: "One card is one permission group. Separating read tools from write tools lets the person narrow only the risky set. Past about twenty tools, split the card by purpose instead of growing one list.",
      },
    },
  ],
  specification: [
    {
      id: "card-and-header",
      title: { ko: "카드와 머리말", en: "Card and header" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 괄호 안은 그 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; the parentheses give the pixels they produce.",
      },
      rows: [
        { state: "all", slot: "Card", property: "width", value: "w-full max-w-130 (520px)" },
        { state: "all", slot: "Card", property: "radius", value: "rounded-2xl" },
        { state: "all", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "all", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "all", slot: "Header", property: "height", value: "h-11 (44px)" },
        { state: "all", slot: "Header", property: "background", value: "bg-bg-subtle" },
        { state: "all", slot: "Header", property: "padding-x", value: "px-4" },
        { state: "all", slot: "Header", property: "bottom border", value: "border-b border-border-default" },
        { state: "all", slot: "Title", property: "font", value: "text-label-md semibold" },
        { state: "all", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Count pill", property: "height", value: "h-5 (20px)" },
        { state: "all", slot: "Count pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "all", slot: "Count pill", property: "font", value: "text-label-sm" },
        { state: "all", slot: "Row", property: "padding", value: "px-4 py-3" },
        { state: "all", slot: "Row", property: "bottom border", value: "border-b border-border-default" },
        {
          state: "all",
          slot: "Row",
          property: "last row border",
          value: "none",
          note: {
            ko: "마지막 줄은 아래 테두리를 그리지 않습니다.",
            en: "The last row draws no bottom border.",
          },
        },
      ],
    },
    {
      id: "rows",
      title: { ko: "도구 줄", en: "Tool rows" },
      rows: [
        { state: "all", slot: "Tool name", property: "font", value: "font-mono text-code" },
        { state: "all", slot: "Tool name", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Description", property: "font", value: "text-caption" },
        { state: "all", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Permission control", property: "size", value: "sm" },
        { state: "all", slot: "Permission control", property: "surface", value: "solid" },
        { state: "all", slot: "Allow segment", property: "value", value: "allow" },
        { state: "all", slot: "Ask segment", property: "value", value: "ask" },
        { state: "all", slot: "Off segment", property: "value", value: "off" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "default", slot: "Allow all button", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Allow all button", property: "text color", value: "text-text-primary" },
        { state: "focus-visible", slot: "Allow all button", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Allow all button", property: "radius", value: "rounded-sm" },
        { state: "selected", slot: "Permission segment", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Row", property: "wrap", value: "flex-wrap, gap-x-4 gap-y-2" },
        {
          state: "narrow",
          slot: "Row",
          property: "name basis",
          value: "grow basis-40",
          note: {
            ko: "좁은 폭에서는 이름 칸이 먼저 줄어들고 컨트롤이 아래 줄로 내려갑니다.",
            en: "On a narrow card the name column shrinks first and the control drops to the next line.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "defaults",
      title: { ko: "기본값", en: "Defaults" },
      description: {
        ko: "allow, ask, off에서 각각 시작하는 세 도구를 담은 카드입니다. 설명이 판단 근거가 됩니다.",
        en: "A card with three tools starting on allow, ask and off. The descriptions are what the decision rests on.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어 값", en: "Controlled" },
      description: {
        ko: "values와 onValuesChange로 권한 맵을 바깥에서 들고, 지금 허용된 도구를 아래에 요약합니다.",
        en: "Holding the map outside through values and onValuesChange and summarising the allowed tools below.",
      },
    },
    {
      id: "allow-all",
      title: { ko: "일괄 허용", en: "Allow all" },
      description: {
        ko: "머리말 버튼 문구를 바꾼 카드입니다. 버튼을 누르면 세 줄이 모두 Allow로 바뀝니다.",
        en: "The same card with its bulk button renamed. Pressing it sets all three rows to Allow.",
      },
    },
    {
      id: "long-list",
      title: { ko: "긴 목록", en: "Long list" },
      description: {
        ko: "여섯 도구를 담아 개수 알약과 줄 구분선이 어떻게 이어지는지 보여 줍니다.",
        en: "Six tools, showing how the count pill and the row dividers carry down a longer card.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "각 줄의 세그먼트 컨트롤은 \"<도구 이름> permission\"을 aria-label로 받아, 여러 줄이 있어도 스크린 리더가 어느 도구의 설정인지 구분합니다. 카드 제목은 heading이 아니라 문장이라 이름만으로 그룹을 알 수 없으므로 이 라벨이 유일한 단서입니다.",
        en: "Each row's control takes \"<tool name> permission\" as its aria-label, so a screen reader can tell which tool a setting belongs to. The card title is plain text rather than a heading, so this label is the only grouping cue.",
      },
      {
        ko: "도구 이름을 mono 글꼴로 그리지만 이름 자체가 곧 텍스트이므로 복사와 읽기가 그대로 됩니다. 아이콘만으로 도구를 구분하지 않습니다.",
        en: "The tool name is drawn in mono type, but it is still text, so it reads and copies as written. No tool is identified by an icon alone.",
      },
      {
        ko: "일괄 설정 버튼은 실제 button이라 Enter와 Space로 눌립니다. 누르면 여러 값이 한 번에 바뀌므로, 바뀐 결과를 화면의 세그먼트 상태로 확인할 수 있어야 하고 별도 확인 대화상자는 두지 않습니다.",
        en: "The bulk button is a real button, pressed with Enter or Space. It changes several values at once, so the result has to be visible in the segment states; there is no separate confirmation dialog.",
      },
      {
        ko: "줄은 좁은 폭에서 접혀 컨트롤이 아래로 내려갑니다. 이름 칸에 truncate가 걸려 있으므로 아주 긴 도구 이름은 잘리며, 잘린 이름은 title 속성이나 설명으로 보완합니다.",
        en: "Rows wrap on a narrow card and the control drops below. Tool names are truncated, so a very long one is cut and needs a title attribute or its description to carry the rest.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "일괄 설정 버튼과 각 줄의 세그먼트 컨트롤 사이를 이동합니다.", en: "Moves between the bulk button and each row's control." },
      },
      {
        keys: ["ArrowLeft", "ArrowRight"],
        action: { ko: "한 줄의 Allow, Ask, Off 사이에서 포커스를 옮깁니다.", en: "Moves across Allow, Ask and Off within one row." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 놓인 세그먼트를 고르거나 일괄 설정을 실행합니다.", en: "Picks the focused segment, or presses the bulk button." },
      },
    ],
  },
};
