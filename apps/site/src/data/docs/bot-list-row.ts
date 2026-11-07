/**
 * Reference doc for `BotListRow`, written against
 * `packages/react/src/components/bot-list-row.tsx` and
 * `packages/flutter/lib/src/components/bot_list_row.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "bot-list-row",
  anatomy: {
    description: {
      ko: "BotListRow는 봇 하나를 한 줄로 보여 줍니다. 행 전체가 버튼이고, 아바타, 이름, 최근 활동 시각과 미리보기가 한 줄에 놓입니다.",
      en: "A BotListRow shows one bot in a single line. The whole row is a button, holding an avatar, a name, a last-activity time and a preview.",
    },
    parts: [
      {
        name: "Row",
        slot: "button",
        description: {
          ko: "행 전체를 덮는 버튼입니다. 누르면 그 봇을 열고, 선택 상태는 aria-pressed로도 나갑니다.",
          en: "The button covering the row. Pressing it opens that bot, and the selected state is exposed as aria-pressed.",
        },
      },
      {
        name: "Avatar",
        slot: "Avatar",
        description: {
          ko: "40px 봇 아바타입니다. live이면 오른쪽 아래에 13px 점이 붙습니다.",
          en: "A 40px bot avatar with a 13px live dot at the bottom right when live.",
        },
      },
      {
        name: "Name",
        slot: "name",
        description: {
          ko: "봇 이름입니다. 한 줄에서 잘리고, 오른쪽에 시각이 붙습니다.",
          en: "The bot name, truncated to one line with the time beside it.",
        },
      },
      {
        name: "Time",
        slot: "time",
        description: {
          ko: "마지막 활동 시각입니다. caption 크기의 보조 글자로 그립니다.",
          en: "The last-activity time, drawn as caption-size secondary text.",
        },
      },
      {
        name: "Preview",
        slot: "preview",
        description: {
          ko: "최근 활동을 한 줄로 요약합니다. 이름 아래에 붙고 넘치면 잘립니다.",
          en: "A one-line summary of the latest activity, below the name and clipped when it overflows.",
        },
      },
    ],
  },
  properties: [
    {
      id: "live",
      title: { ko: "live", en: "live" },
      description: {
        ko: "참이면 아바타에 실행 중 점을 붙입니다. 지금 돌고 있는 봇에만 쓰고, 일시정지나 대기 상태에는 켜지 않습니다.",
        en: "When true the avatar carries the running dot. Use it only for a bot running now, not for paused or queued ones.",
      },
      example: "states",
    },
    {
      id: "selected",
      title: { ko: "selected", en: "selected" },
      description: {
        ko: "참이면 행을 10% 잉크로 칠하고 aria-pressed를 참으로 내보냅니다. 오른쪽 패널에 지금 열린 봇 하나에만 씁니다.",
        en: "When true the row takes the 10% ink fill and aria-pressed becomes true. Only the bot open in the panel gets it.",
      },
      example: "states",
    },
    {
      id: "preview",
      title: { ko: "preview", en: "preview" },
      description: {
        ko: "최근 활동을 한 줄로 요약합니다. 넘기지 않으면 이름과 시각만 남고 행 높이가 줄어듭니다.",
        en: "A one-line summary of the latest activity. Without it only the name and time show and the row gets shorter.",
      },
      example: "minimal",
    },
  ],
  guidelines: [
    {
      id: "one-bot-per-row",
      title: { ko: "행 하나에 봇 하나", en: "One bot per row" },
      body: {
        ko: "행 전체가 하나의 버튼이라 안쪽에 다른 버튼을 넣을 수 없습니다. 봇마다 동작이 더 필요하면 행 옆에 별도 컨트롤을 두거나 메뉴로 엽니다.",
        en: "The whole row is one button, so it cannot hold another button. When a bot needs more actions, put a separate control beside the row or open a menu.",
      },
      example: "list",
    },
    {
      id: "preview-one-line",
      title: { ko: "미리보기는 한 줄", en: "Keep the preview to one line" },
      body: {
        ko: "미리보기는 한 줄에서 잘립니다. 결과의 값을 앞부분에 적고, 마지막 활동이 없으면 비워 두는 편이 잘린 문장보다 읽기 쉽습니다.",
        en: "The preview clips after one line. Put the value at the front, and leave it out when there is no recent activity; a clipped sentence reads worse than none.",
      },
      example: "minimal",
    },
    {
      id: "time-relative",
      title: { ko: "시각은 짧게", en: "Keep the time short" },
      body: {
        ko: "시각은 이름 옆에 붙어 한 줄을 나눠 씁니다. 오늘은 8:41 AM, 지난 활동은 Yesterday처럼 짧게 적어 이름이 밀리지 않게 합니다.",
        en: "The time shares the line with the name. Write it short, such as 8:41 AM for today or Yesterday, so the name keeps its room.",
      },
      example: "list",
    },
    {
      id: "selected-single",
      title: { ko: "선택은 하나만", en: "One selected row" },
      body: {
        ko: "selected는 패널에 열린 봇을 가리키는 자리입니다. 목록에서 여러 행을 동시에 칠하면 어느 봇을 보고 있는지 알 수 없습니다.",
        en: "selected marks the bot open in the panel. Filling several rows at once leaves no way to tell which bot is in view.",
      },
      do: {
        ko: "패널에 열린 봇 한 줄만 selected로 칠합니다.",
        en: "Paint only the bot open in the panel as selected.",
      },
      dont: {
        ko: "실행 중인 봇을 모두 selected로 칠하지 않습니다. 그 표시는 live가 맡습니다.",
        en: "Do not paint every running bot as selected; live covers that.",
      },
      example: "states",
    },
  ],
  specification: [
    {
      id: "row",
      title: { ko: "행", en: "Row" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "all", slot: "Row", property: "width", value: "w-full" },
        { state: "all", slot: "Row", property: "padding", value: "p-3" },
        { state: "all", slot: "Row", property: "gap", value: "gap-3" },
        { state: "all", slot: "Row", property: "radius", value: "rounded-lg" },
        { state: "all", slot: "Row", property: "motion", value: "motion-press" },
        { state: "default", slot: "Row", property: "background", value: "transparent" },
        { state: "hover", slot: "Row", property: "background", value: "bg-overlay-ink-5" },
        { state: "selected", slot: "Row", property: "background", value: "bg-overlay-ink-10" },
        { state: "focus-visible", slot: "Row", property: "outline", value: "outline-2 outline-text-brand" },
        { state: "focus-visible", slot: "Row", property: "outline offset", value: "-outline-offset-2" },
        { state: "all", slot: "Avatar", property: "size", value: "size-10" },
        { state: "all", slot: "Avatar icon", property: "size", value: "size-[22px]" },
        { state: "live", slot: "Avatar dot", property: "size", value: "size-[13px]" },
        { state: "live", slot: "Avatar dot", property: "ring", value: "border-bg-surface" },
      ],
    },
    {
      id: "text",
      title: { ko: "글자", en: "Text" },
      rows: [
        { state: "all", slot: "Name", property: "font", value: "text-label-lg" },
        { state: "all", slot: "Name", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Name", property: "overflow", value: "truncate" },
        { state: "all", slot: "Time", property: "font", value: "text-caption" },
        { state: "all", slot: "Time", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Preview", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Preview", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Preview", property: "overflow", value: "truncate" },
      ],
    },
  ],
  examples: [
    {
      id: "list",
      title: { ko: "목록", en: "List" },
      description: {
        ko: "세 봇을 한 목록에 놓았습니다. 하나는 실행 중이고 패널에 열려 있습니다.",
        en: "Three bots in one list, one of them running and open in the panel.",
      },
    },
    {
      id: "states",
      title: { ko: "상태 조합", en: "State combinations" },
      description: {
        ko: "live와 selected를 각각, 그리고 함께 켠 행입니다.",
        en: "Rows with live, with selected, and with both.",
      },
    },
    {
      id: "minimal",
      title: { ko: "이름과 시각만", en: "Name and time only" },
      description: {
        ko: "미리보기와 시각을 생략한 행입니다. 넘기지 않은 자리는 비고 행 높이가 줄어듭니다.",
        en: "Rows without a preview or a time. Omitted parts take no space and the row gets shorter.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "행 전체가 button이므로 접근 가능한 이름은 이름, 시각, 미리보기 글자에서 나옵니다. 미리보기에 의미 없는 문자열을 넣으면 이름도 함께 지저분해집니다.",
        en: "The row is a button, so its accessible name comes from the name, time and preview text. Fill the preview with noise and the name turns noisy with it.",
      },
      {
        ko: "선택 상태는 aria-pressed로 나가고 배경으로도 보입니다. 어느 봇이 열렸는지 시각과 음성 양쪽에서 확인할 수 있습니다.",
        en: "Selection is exposed as aria-pressed as well as the fill, so the open bot is clear both visually and by voice.",
      },
      {
        ko: "포커스 표시는 행 안쪽에 2px로 그려 목록의 이웃 행과 겹치지 않습니다. 지우지 않습니다.",
        en: "The focus ring is drawn 2px inside the row so it never collides with the next row. Do not remove it.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "다음 행으로 이동합니다.", en: "Moves to the next row." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "그 봇을 엽니다.", en: "Opens that bot." },
      },
    ],
  },
};
