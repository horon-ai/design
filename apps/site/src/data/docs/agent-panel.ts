/**
 * Reference doc for `Agent Panel`, written against
 * `packages/react/src/components/agent-panel.tsx` and
 * `packages/flutter/lib/src/components/agent_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "agent-panel",
  anatomy: {
    description: {
      ko: "Agent Panel은 봇에게 일을 맡기는 화면의 껍데기입니다. 패널 하나에 위에서부터 필터 줄, 작업 입력창, 작업 목록이 들어가고, 입력창 안에는 봇과 프로젝트를 고르는 칩 두 개와 시작 버튼이 놓입니다.",
      en: "Agent Panel is the frame of the screen that hands work to a bot: a filter row, a task composer and the task list, top to bottom. Inside the composer sit two picker chips for the bot and the project, and the Start button.",
    },
    parts: [
      {
        name: "Panel",
        slot: "AgentPanel",
        description: {
          ko: "입력창과 목록을 담는 section입니다. 20px 모서리와 surface 바탕을 쓰고, filter를 넘기면 제목 없이 맨 위에 필터 줄만 놓습니다.",
          en: "The section that holds the composer and the list. It uses a 20px radius and the surface fill; passing filter puts a filter row at the top and nothing else above it.",
        },
      },
      {
        name: "Filter row",
        slot: "filter",
        description: {
          ko: "패널 맨 위 한 줄입니다. 보통 FilterBar를 넘겨 작업 목록을 상태별로 좁힙니다.",
          en: "The top row of the panel, usually a FilterBar that narrows the task list by state.",
        },
      },
      {
        name: "Composer box",
        slot: "TaskComposer",
        description: {
          ko: "작업 문장을 적는 상자입니다. 위쪽에 textarea, 아래쪽에 칩 줄과 키 힌트, Start 버튼이 있습니다.",
          en: "The box the task is typed into: a textarea on top, then a row with the chips, the key hint and the Start button.",
        },
      },
      {
        name: "Picker chip",
        slot: "ComposerChip",
        description: {
          ko: "봇이나 프로젝트를 고르는 30px 알약입니다. 앞에 16px 타일 또는 14px 아이콘, 끝에 12px 캐럿이 붙습니다.",
          en: "A 30px pill that picks the bot or the project: a 16px tile or a 14px icon, then a 12px caret at the end.",
        },
      },
      {
        name: "Key hint",
        slot: "Kbd",
        description: {
          ko: "Start 옆에 붙는 Mod+Enter 키 칩입니다. 운영체제에 맞는 키를 그리고, 호버 가능한 포인터가 없는 터치 기기에서는 감춥니다.",
          en: "The Mod+Enter key chip next to Start. It draws the keys of the current OS and hides on touch devices with no hovering fine pointer.",
        },
      },
    ],
  },
  properties: [
    {
      id: "filter",
      title: { ko: "filter", en: "filter" },
      description: {
        ko: "AgentPanel 맨 위에 놓을 한 줄입니다. 작업 목록을 상태별로 좁히는 FilterBar를 넘기고, 넘기지 않으면 필터 줄이 사라집니다.",
        en: "The row placed at the top of AgentPanel. Pass a FilterBar that narrows the task list by state; leave it out and the row disappears.",
      },
      example: "tasks",
    },
    {
      id: "leading",
      title: { ko: "leading", en: "leading" },
      description: {
        ko: "ComposerChip 앞의 표시입니다. 문자열을 넘기면 봇 이니셜을 그리는 16px 타일이 되고, 아이콘 엘리먼트를 넘기면 14px 아이콘이 secondary 색으로 들어갑니다.",
        en: "The leading mark of ComposerChip. A string draws a 16px tile with the bot's initial; an icon element draws a 14px icon in secondary color.",
      },
      example: "chips",
    },
    {
      id: "tileClassName",
      title: { ko: "tileClassName", en: "tileClassName" },
      description: {
        ko: "칩 타일의 바탕색입니다. 기본값은 브랜드 색이고, 타일 글자를 text-inverse로 고정하므로 밝은 sky 계열을 넘겨도 대비가 유지됩니다.",
        en: "The fill of the chip tile. It defaults to the brand fill, and because the tile letter is forced to text-inverse, a light sky shade keeps its contrast.",
      },
      example: "chips",
    },
    {
      id: "placeholder",
      title: { ko: "placeholder", en: "placeholder" },
      description: {
        ko: "TaskComposer textarea의 안내 문구이자 접근성 이름입니다. 화면에 그려지는 유일한 이름이므로 무엇을 적을지 구체적으로 말합니다.",
        en: "The hint inside the TaskComposer textarea and its accessible name. It is the only visible name, so say what belongs in the box.",
      },
      example: "composer",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "TaskComposer가 그릴 초안 문자열입니다. 값을 넘기면 제어 컴포넌트가 되고, 걸러 버리면 입력창이 스스로 초안을 들고 있는 비제어 상태로 동작합니다.",
        en: "The draft text TaskComposer draws. Passing it makes the composer controlled; leaving it out lets the textarea hold the draft itself.",
      },
      example: "composer",
    },
    {
      id: "onStart",
      title: { ko: "onStart", en: "onStart" },
      description: {
        ko: "Start 버튼과 Mod+Enter에서 불립니다. 입력창은 초안을 스스로 지우지 않으므로, 작업을 띄운 뒤 초안을 비우는 일은 이 함수에서 합니다.",
        en: "Called by the Start button and by Mod+Enter. The composer never clears the draft itself, so emptying it after the task goes out is this handler's job.",
      },
      example: "composer",
    },
    {
      id: "startLabel",
      title: { ko: "startLabel", en: "startLabel" },
      description: {
        ko: "시작 버튼의 문구입니다. 기본값 Start를 그대로 두고, 이 화면의 말투가 다를 때만 바꿉니다.",
        en: "The Start button's text. Keep the Start default and change it only when the screen's wording differs.",
      },
      example: "composer",
    },
  ],
  guidelines: [
    {
      id: "draft-lives-outside",
      title: { ko: "초안은 호출자가 들고 있습니다", en: "The caller holds the draft" },
      body: {
        ko: "입력창은 초안을 스스로 지우지 않습니다. value와 onValueChange를 넘겨 초안을 호출자가 들고, onStart에서 작업을 띄운 뒤 초안을 비웁니다. 보내기 전에 확인이 필요하면 이때 그대로 남겨 둘 수 있습니다.",
        en: "The composer never clears the draft. Hold it with value and onValueChange, then empty it in onStart after the task goes out. If the screen needs a confirmation first, that is the moment the draft can stay.",
      },
      do: {
        ko: "value, onValueChange, onStart를 함께 넘겨 초안과 시작을 한 곳에서 다룹니다.",
        en: "Pass value, onValueChange and onStart so the draft and the start are handled in one place.",
      },
      dont: {
        ko: "초안이 비워지기를 기대하고 onStart만 넘기지 않습니다.",
        en: "Do not pass only onStart and expect the box to empty itself.",
      },
      example: "composer",
    },
    {
      id: "chip-per-picker",
      title: { ko: "고르는 대상마다 칩 하나", en: "One chip per picker" },
      body: {
        ko: "칩은 봇과 프로젝트처럼 이번 작업에 함께 묶이는 대상에만 씁니다. 칩은 평범한 버튼이므로 누르면 열 메뉴나 선택 화면을 직접 연결해야 합니다.",
        en: "Use a chip only for the things this task is bound to, such as the bot and the project. A chip is a plain button, so wire its menu or picker yourself.",
      },
      do: {
        ko: "봇 칩과 프로젝트 칩을 나란히 두어 한 번에 무엇이 바뀌는지 보이게 합니다.",
        en: "Keep the bot chip and the project chip side by side so the change is visible at a glance.",
      },
      dont: {
        ko: "설정 항목을 모두 칩으로 늘어놓아 입력창을 옵션 더미로 만들지 않습니다.",
        en: "Do not turn every setting into a chip and make the composer an options dump.",
      },
      example: "chips",
    },
    {
      id: "composer-before-list",
      title: { ko: "입력창을 목록 위에 둡니다", en: "Composer above the list" },
      body: {
        ko: "패널 안 순서는 필터, 입력창, 목록입니다. 새 작업을 맡기는 자리가 목록 아래로 가면 결과를 보다가 다시 입력하러 올라와야 합니다.",
        en: "Inside the panel the order is filter, composer, list. Putting the composer under the list makes people scroll back up to assign the next task.",
      },
      do: {
        ko: "필터를 맨 위, 입력창을 그 아래, 작업 목록을 마지막에 둡니다.",
        en: "Filter at the top, composer under it, task list last.",
      },
      dont: {
        ko: "목록을 위로 올리고 입력창을 맨 아래에 두지 않습니다.",
        en: "Do not put the list first and the composer at the bottom.",
      },
      example: "tasks",
    },
    {
      id: "list-variant-inside",
      title: { ko: "패널 안 목록은 list 변형으로", en: "Use the list variant inside" },
      body: {
        ko: "패널은 이미 surface 바탕과 라운드를 가진 카드입니다. 안에 들어가는 TaskRow는 variant를 list로 두어 각 행이 카드 테두리를 한 겹 더 만들지 않게 합니다.",
        en: "The panel is already a surface card with a radius. TaskRow rows inside it take variant list, so each row does not add a second card border.",
      },
      do: {
        ko: "AgentPanel 안에서는 TaskRow variant=\"list\"로 한 줄씩 구분선만 남깁니다.",
        en: "Inside AgentPanel use TaskRow variant=\"list\" and keep only the hairline between rows.",
      },
      dont: {
        ko: "패널 안에서 카드형 행을 쌓아 테두리를 겹치게 하지 않습니다.",
        en: "Do not stack card rows inside the panel and double the borders.",
      },
      example: "tasks",
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
        { state: "default", slot: "AgentPanel", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "AgentPanel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "AgentPanel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "AgentPanel", property: "padding", value: "px-5 pt-4 pb-2" },
        { state: "default", slot: "AgentPanel", property: "gap", value: "12px" },
        { state: "default", slot: "filter", property: "layout", value: "row above the children" },
        { state: "default", slot: "filter", property: "padding", value: "none" },
      ],
    },
    {
      id: "composer",
      title: { ko: "입력창", en: "Composer" },
      rows: [
        { state: "default", slot: "TaskComposer", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "TaskComposer", property: "background", value: "bg-overlay-ink-4" },
        { state: "default", slot: "TaskComposer", property: "padding", value: "px-4 pt-3.5 pb-2.5" },
        { state: "default", slot: "TaskComposer", property: "gap", value: "14px" },
        { state: "default", slot: "Textarea", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Textarea", property: "min height", value: "22px" },
        { state: "default", slot: "Textarea", property: "max height", value: "160px" },
        {
          state: "default",
          slot: "Textarea",
          property: "placeholder color",
          value: "text-text-secondary",
          note: {
            ko: "한 줄에서 시작해 내용에 맞춰 자라고, 160px를 넘으면 안에서 스크롤합니다.",
            en: "It starts at one row, grows with the content, and scrolls inside itself past 160px.",
          },
        },
        {
          state: "focus-within",
          slot: "TaskComposer",
          property: "outline",
          value: "2px outline-text-brand",
          note: {
            ko: "outline offset은 2px이고, 초점이 입력창 안 어디에 있어도 같은 테두리를 씁니다.",
            en: "The outline sits 2px off, and it is the same ring wherever focus is inside the box.",
          },
        },
        { state: "default", slot: "Start button", property: "height", value: "30px" },
        { state: "default", slot: "Start button", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Start button", property: "background", value: "bg-interactive-primary" },
        { state: "default", slot: "Start button", property: "text color", value: "text-text-inverse" },
        { state: "default", slot: "Start button", property: "padding", value: "px-3.5" },
        { state: "default", slot: "Start button", property: "font", value: "text-label-sm" },
        {
          state: "pressed",
          slot: "Start button",
          property: "motion",
          value: "motion-press",
          note: {
            ko: "scale 0.97입니다.",
            en: "Scale 0.97.",
          },
        },
      ],
    },
    {
      id: "chip",
      title: { ko: "고르는 칩", en: "Picker chip" },
      rows: [
        { state: "default", slot: "ComposerChip", property: "height", value: "30px" },
        { state: "default", slot: "ComposerChip", property: "radius", value: "rounded-full" },
        { state: "default", slot: "ComposerChip", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "ComposerChip", property: "padding", value: "pr-2.5 pl-2" },
        { state: "default", slot: "ComposerChip", property: "gap", value: "6px" },
        { state: "default", slot: "ComposerChip", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Tile", property: "size", value: "16px" },
        { state: "default", slot: "Tile", property: "radius", value: "rounded-xs" },
        { state: "default", slot: "Tile", property: "background", value: "bg-interactive-primary" },
        { state: "default", slot: "Tile", property: "text color", value: "text-text-inverse" },
        { state: "icon leading", slot: "Icon", property: "size", value: "14px" },
        { state: "icon leading", slot: "Icon", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Caret", property: "size", value: "12px" },
        { state: "focus-visible", slot: "ComposerChip", property: "outline", value: "2px outline-text-brand" },
      ],
    },
  ],
  examples: [
    {
      id: "composer",
      title: { ko: "작업 입력창", en: "Task composer" },
      description: {
        ko: "초안을 밖에서 들고 Start에서 비우는 입력창입니다. 입력창만 따로 놓아도 20px 라운드 상자로 동작합니다.",
        en: "A composer whose draft is held outside and cleared on Start. On its own it is still a 20px-radius box.",
      },
    },
    {
      id: "chips",
      title: { ko: "고르는 칩", en: "Picker chips" },
      description: {
        ko: "이니셜 타일을 쓰는 봇 칩과 아이콘에 sky 바탕을 준 프로젝트 칩을 나란히 두었습니다.",
        en: "A bot chip with an initial tile next to a project chip with an icon and a sky fill.",
      },
    },
    {
      id: "tasks",
      title: { ko: "필터와 작업 목록", en: "Filter and task list" },
      description: {
        ko: "필터 줄, 입력창, list 변형 작업 행 두 개를 패널 하나에 담았습니다.",
        en: "A filter row, the composer and two list-variant task rows in one panel.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "AgentPanel은 이름 없는 section으로 렌더링됩니다. 화면의 제목이 패널 밖에 있다면 aria-labelledby로 연결하고, 제목이 없다면 aria-label을 붙여 영역의 이름을 남깁니다.",
        en: "AgentPanel renders an unnamed section. If the screen's heading sits outside the panel, connect it with aria-labelledby; with no heading, add aria-label so the region still has a name.",
      },
      {
        ko: "입력창의 접근성 이름은 placeholder입니다. 안내 문구를 지우거나 아이콘만 두면 이름이 사라지므로, 화면에 보이는 문구가 그대로 이름이 되게 적습니다.",
        en: "The composer's accessible name is its placeholder. Clearing the hint or leaving only an icon drops the name, so let the visible hint be the name.",
      },
      {
        ko: "ComposerChip은 평범한 button입니다. 자식 글자가 이름이 되므로 봇 이름이나 프로젝트 이름을 그대로 넣고, 메뉴를 열 때는 aria-expanded와 aria-haspopup을 직접 붙입니다.",
        en: "ComposerChip is a plain button whose children name it. Put the bot or project name there, and add aria-expanded and aria-haspopup yourself when it opens a menu.",
      },
      {
        ko: "Mod+Enter는 macOS와 iOS에서 ⌘Enter, Windows, Linux, Android에서 Ctrl+Enter이고 운영체제에 맞춰 키 칩이 그려집니다. 터치 기기에서는 키 힌트가 숨습니다.",
        en: "Mod+Enter is ⌘Enter on macOS and iOS and Ctrl+Enter on Windows, Linux and Android, and the key chip draws the matching keys. Touch devices hide the hint.",
      },
    ],
    keyboard: [
      {
        keys: ["Mod+Enter"],
        action: { ko: "onStart를 실행합니다.", en: "Runs onStart." },
      },
      {
        keys: ["Enter"],
        action: {
          ko: "입력창 안에서 줄을 바꿉니다. 작업은 시작하지 않습니다.",
          en: "Starts a new line in the textarea. It does not start the task.",
        },
      },
      { keys: ["Tab"], action: { ko: "칩, Start 버튼 순서로 이동합니다.", en: "Moves to the chips and then to Start." } },
    ],
  },
};
