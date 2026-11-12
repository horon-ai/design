/**
 * Reference doc for `PluginRow`, written against
 * `packages/react/src/components/plugin-row.tsx` and
 * `packages/flutter/lib/src/components/plugin_row.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "plugin-row",
  anatomy: {
    description: {
      ko: "PluginRow는 설치한 플러그인 하나를 목록의 한 행으로 보여 줍니다. 타일과 이름, 버전, 작성자, 기능 칩이 왼쪽에 모이고 오른쪽에 업데이트 버튼, 켜기 스위치, 넘침 메뉴가 놓입니다.",
      en: "PluginRow shows one installed plugin as a list row: a tile, name, version, author and capability chips on the left, with an Update button, an on switch and an overflow menu on the right.",
    },
    parts: [
      {
        name: "Row",
        slot: "div",
        description: {
          ko: "아래에 1px 구분선을 긋는 행입니다. 마지막 자식에서는 구분선이 사라집니다.",
          en: "The row, which draws a 1px bottom divider and drops it on the last child.",
        },
      },
      {
        name: "Tile",
        slot: "initials",
        description: {
          ko: "두 글자 약자를 담는 40px 타일입니다. 장식이라 aria-hidden입니다.",
          en: "A 40px tile holding the two-letter initials. It is decorative and aria-hidden.",
        },
      },
      {
        name: "Name line",
        slot: "name",
        description: {
          ko: "이름과 버전, 업데이트 알약이 한 줄에 놓입니다. 이름이 길면 말줄임표로 자르고 나머지는 그대로 남습니다.",
          en: "The name, version and update pill on one line. A long name truncates while the rest keeps its space.",
        },
      },
      {
        name: "Author",
        slot: "author",
        description: {
          ko: "이름 아래 작성자 줄입니다. verified를 켜면 이름 뒤에 하늘색 확인 배지가 붙습니다.",
          en: "The author line under the name. With verified, a sky check badge follows the name.",
        },
      },
      {
        name: "Chips",
        slot: "chips",
        description: {
          ko: "기능을 나타내는 회색 알약입니다. 칩마다 11px 아이콘을 하나 붙일 수 있습니다.",
          en: "Muted pills naming capabilities. Each chip may take one 11px icon.",
        },
      },
      {
        name: "Update",
        slot: "onUpdate",
        description: {
          ko: "onUpdate가 있을 때만 펼쳐지는 solid sm 버튼입니다. 없으면 폭이 0으로 접히고 inert가 됩니다.",
          en: "A solid sm button that unfolds only with onUpdate. Without it the slot collapses to zero width and becomes inert.",
        },
      },
      {
        name: "Switch",
        slot: "toggleLabel",
        description: {
          ko: "플러그인을 켜고 끄는 스위치입니다. toggleLabel이 접근 가능한 이름이 됩니다.",
          en: "The switch that turns the plugin on and off. toggleLabel is its accessible name.",
        },
      },
      {
        name: "Overflow menu",
        slot: "menu",
        description: {
          ko: "menu를 넘길 때만 나타나는 점 세 개 버튼입니다. 메뉴는 행에서 열리고 document.body로 포털됩니다.",
          en: "The three-dot button that appears only with menu. Its menu opens from the row and portals to document.body.",
        },
      },
    ],
  },
  properties: [
    {
      id: "enabled",
      title: { ko: "enabled", en: "enabled" },
      description: {
        ko: "플러그인의 켜짐 상태입니다. onEnabledChange와 함께 넘기면 스위치가 제어 모드가 되고, 없으면 스위치가 스스로 상태를 들고 있습니다.",
        en: "The plugin's on state. Paired with onEnabledChange the switch is controlled; without it the switch holds its own state.",
      },
      example: "toggles",
    },
    {
      id: "verified",
      title: { ko: "verified", en: "verified" },
      description: {
        ko: "작성자 이름 뒤에 확인 배지를 붙입니다. author가 있을 때만 그려집니다.",
        en: "Adds the verified badge after the author. It only renders when author is set.",
      },
      example: "full",
    },
    {
      id: "chips",
      title: { ko: "chips", en: "chips" },
      description: {
        ko: "기능 칩의 배열입니다. 칩마다 id, label, 선택적인 icon을 받고 id가 React 키가 됩니다.",
        en: "The capability chips. Each takes an id, a label and an optional icon; the id is the React key.",
      },
      example: "chips",
    },
    {
      id: "onUpdate",
      title: { ko: "onUpdate", en: "onUpdate" },
      description: {
        ko: "업데이트 버튼을 펼치고 누를 때 호출됩니다. 넘기지 않으면 버튼이 폭 0으로 접히고 탭 순서에서도 빠집니다.",
        en: "Unfolds the Update button and runs when it is pressed. Without it the button collapses to zero width and leaves the tab order.",
      },
      example: "minimal",
    },
    {
      id: "updateBadge",
      title: { ko: "updateBadge", en: "updateBadge" },
      description: {
        ko: "버전 옆의 하늘색 알약 문구입니다. 업데이트가 없으면 넘기지 않습니다.",
        en: "The sky pill beside the version. Leave it out when the plugin is up to date.",
      },
      example: "full",
    },
    {
      id: "version",
      title: { ko: "version", en: "version" },
      description: {
        ko: "이름 옆에 모노 글꼴로 그리는 버전 문자열입니다.",
        en: "A version string drawn in mono beside the name.",
      },
      example: "full",
    },
    {
      id: "toggleLabel",
      title: { ko: "toggleLabel", en: "toggleLabel" },
      description: {
        ko: "켜기 스위치의 접근 가능한 이름입니다. 기본값은 Enabled이고, 스위치가 아이콘 없이 서므로 이름이 꼭 필요합니다.",
        en: "The enable switch's accessible name. It defaults to Enabled, and the switch has no visible label, so the name matters.",
      },
      example: "toggles",
    },
    {
      id: "overflowLabel",
      title: { ko: "overflowLabel", en: "overflowLabel" },
      description: {
        ko: "넘침 메뉴 버튼의 접근 가능한 이름입니다. 기본값은 More입니다.",
        en: "The overflow button's accessible name. The default is More.",
      },
    },
  ],
  guidelines: [
    {
      id: "rows-stack",
      title: { ko: "행만 쌓습니다", en: "Stack rows, nothing else" },
      body: {
        ko: "행은 스스로 아래 구분선을 그리고 마지막 행에서 없앱니다. 플러그인 목록에는 이 행만 쌓고, 카드가 필요하면 행을 담는 쪽이 모서리를 자르게 합니다.",
        en: "Each row draws its own divider and drops it on the last one. Stack only these rows for a plugin list, and let a wrapping card handle the corners.",
      },
      example: "full",
    },
    {
      id: "update-only-when-ready",
      title: { ko: "업데이트는 있을 때만", en: "Only offer an update that exists" },
      body: {
        ko: "onUpdate가 없으면 업데이트 버튼이 접히므로, 최신 상태의 플러그인에는 onUpdate와 updateBadge를 함께 넘기지 않습니다. 둘은 같은 사실을 가리킵니다.",
        en: "Without onUpdate the button collapses, so an up-to-date plugin passes neither onUpdate nor updateBadge. Both state the same fact.",
      },
      do: {
        ko: "새 버전이 있을 때만 updateBadge와 onUpdate를 함께 줍니다.",
        en: "Pass updateBadge and onUpdate together only when a new version exists.",
      },
      dont: {
        ko: "최신 플러그인에 Update available만 남기지 않습니다.",
        en: "Do not leave Update available on a plugin that is current.",
      },
      example: "minimal",
    },
    {
      id: "toggle-named",
      title: { ko: "스위치에 이름을 붙입니다", en: "Name the switch" },
      body: {
        ko: "스위치는 행 오른쪽에 아이콘 없이 서서 이름이 보이지 않습니다. toggleLabel을 플러그인 이름으로 바꾸면 낭독기에서 어느 플러그인을 켜는지 알 수 있습니다.",
        en: "The switch stands bare at the right edge. Changing toggleLabel to the plugin's name tells a screen reader which plugin it turns on.",
      },
      example: "toggles",
    },
    {
      id: "chips-short",
      title: { ko: "칩은 세 개 안팎", en: "Keep chips to a few" },
      body: {
        ko: "칩은 기능을 훑는 용도입니다. 개수가 늘면 줄이 접히고 행 높이가 들쭉날쭉해지므로, 설명이 필요한 기능은 칩 대신 상세 화면에 둡니다.",
        en: "Chips are for scanning capabilities. More of them wrap and make row heights uneven, so put anything needing an explanation on the detail screen instead.",
      },
      example: "chips",
    },
  ],
  specification: [
    {
      id: "row-metrics",
      title: { ko: "행 치수", en: "Row metrics" },
      rows: [
        { state: "default", slot: "Row", property: "divider", value: "1px border-border-default" },
        { state: "last", slot: "Row", property: "divider", value: "none" },
        { state: "default", slot: "Row", property: "padding", value: "16px 0" },
        { state: "default", slot: "Row", property: "gap", value: "14px / 12px" },
        { state: "default", slot: "Tile", property: "size", value: "40px" },
        { state: "default", slot: "Tile", property: "radius", value: "rounded-md" },
        { state: "default", slot: "Tile", property: "background", value: "bg-sky-500" },
        { state: "default", slot: "Tile", property: "text color", value: "text-neutral-50" },
        { state: "default", slot: "Tile", property: "font", value: "text-label-md" },
        { state: "default", slot: "Name", property: "font", value: "text-label-md" },
        { state: "default", slot: "Name", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Version", property: "font", value: "font-mono text-label-sm" },
        { state: "default", slot: "Version", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Author", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Author", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Name column", property: "basis", value: "160px" },
      ],
    },
    {
      id: "pills-and-badges",
      title: { ko: "알약과 배지", en: "Pills and badges" },
      rows: [
        { state: "update", slot: "Update pill", property: "height", value: "22px" },
        { state: "update", slot: "Update pill", property: "radius", value: "rounded-full" },
        { state: "update", slot: "Update pill", property: "padding", value: "0 8px" },
        { state: "update", slot: "Update pill", property: "background", value: "bg-accent-sky-500-18" },
        { state: "update", slot: "Update pill", property: "text color", value: "text-text-brand" },
        { state: "update", slot: "Update pill", property: "font", value: "text-label-sm" },
        { state: "verified", slot: "Badge", property: "size", value: "14px" },
        { state: "verified", slot: "Badge", property: "background", value: "bg-sky-500" },
        { state: "verified", slot: "Badge", property: "text color", value: "text-neutral-50" },
        { state: "verified", slot: "Badge", property: "glyph size", value: "8px" },
        { state: "chip", slot: "Chip", property: "height", value: "22px" },
        { state: "chip", slot: "Chip", property: "padding", value: "0 8px" },
        { state: "chip", slot: "Chip", property: "gap", value: "4px" },
        { state: "chip", slot: "Chip", property: "background", value: "bg-overlay-ink-6" },
        { state: "chip", slot: "Chip", property: "text color", value: "text-text-secondary" },
        { state: "chip", slot: "Chip", property: "icon size", value: "11px" },
      ],
    },
    {
      id: "actions",
      title: { ko: "오른쪽 동작", en: "Actions" },
      rows: [
        { state: "update", slot: "Update", property: "variant", value: "solid" },
        { state: "update", slot: "Update", property: "size", value: "sm" },
        { state: "update", slot: "Update", property: "icon size", value: "14px" },
        {
          state: "update",
          slot: "Update slot",
          property: "motion",
          value: "motion-reveal-x",
          note: {
            ko: "onUpdate가 없으면 폭이 0으로 접히고 inert가 되어 포커스도 받지 않습니다.",
            en: "Without onUpdate the slot collapses to zero width and turns inert, so it takes no focus.",
          },
        },
        { state: "switch", slot: "Switch", property: "size", value: "md" },
        { state: "overflow", slot: "Overflow menu", property: "variant", value: "ghost" },
        { state: "overflow", slot: "Overflow menu", property: "size", value: "sm" },
        {
          state: "overflow",
          slot: "Menu content",
          property: "alignment",
          value: "end",
        },
      ],
    },
  ],
  examples: [
    {
      id: "full",
      title: { ko: "전체 행", en: "Full row" },
      description: {
        ko: "버전, 업데이트 알약, 확인 배지, 칩, 업데이트 버튼, 스위치, 넘침 메뉴를 모두 갖춘 행입니다.",
        en: "A row with a version, an update pill, the verified badge, chips, the Update button, the switch and the overflow menu.",
      },
    },
    {
      id: "minimal",
      title: { ko: "최소 행", en: "Minimal row" },
      description: {
        ko: "최신 상태라 업데이트 버튼이 접힌 행입니다. 이름과 스위치만 남습니다.",
        en: "An up-to-date row where the Update button is collapsed, leaving the name and the switch.",
      },
    },
    {
      id: "toggles",
      title: { ko: "켜기 상태", en: "Enabled state" },
      description: {
        ko: "enabled와 onEnabledChange로 스위치를 제어하는 두 행입니다. 하나는 켜져 있고 하나는 꺼져 있습니다.",
        en: "Two rows whose switch is controlled by enabled and onEnabledChange: one on, one off.",
      },
    },
    {
      id: "chips",
      title: { ko: "기능 칩", en: "Capability chips" },
      description: {
        ko: "11px 아이콘이 붙은 기능 칩을 세 개 단 행입니다.",
        en: "A row with three capability chips, each with an 11px icon.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "타일은 aria-hidden입니다. 플러그인 이름은 옆 텍스트가 전달합니다.",
        en: "The tile is aria-hidden; the name beside it carries the identity.",
      },
      {
        ko: "켜기 스위치는 화면에 이름이 없으므로 toggleLabel이 유일한 이름입니다. 플러그인 이름으로 바꾸면 어느 플러그인을 켜는지 분명해집니다.",
        en: "The switch has no visible label, so toggleLabel is its only name. Using the plugin's name makes clear what is being turned on.",
      },
      {
        ko: "확인 배지는 role=\"img\"와 aria-label Verified를 가져 낭독기가 확인된 작성자임을 읽습니다.",
        en: "The verified badge carries role=\"img\" with aria-label Verified, so a screen reader announces a verified author.",
      },
      {
        ko: "메뉴는 Base UI Menu를 써서 키보드로 열고 항목 사이를 옮길 수 있습니다. 메뉴가 포털로 열려 미리보기 프레임 안에는 담기지 않습니다.",
        en: "The menu uses the Base UI Menu, so it opens from the keyboard and moves between items. It portals and cannot be framed.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "업데이트 버튼, 스위치, 넘침 버튼으로 차례로 포커스를 옮깁니다.", en: "Moves focus through the Update button, then the switch, then the overflow button." },
      },
      {
        keys: ["Space"],
        action: { ko: "스위치를 켜거나 끕니다.", en: "Turns the plugin on or off." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "업데이트 버튼을 실행하거나 메뉴를 엽니다.", en: "Runs the Update button or opens the menu." },
      },
      {
        keys: ["Escape"],
        action: { ko: "메뉴를 닫고 트리거로 포커스를 돌려놓습니다.", en: "Closes the menu and returns focus to the trigger." },
      },
    ],
  },
};
