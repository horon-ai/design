/**
 * Reference doc for `McpServerRow`, written against
 * `packages/react/src/components/mcp-server-row.tsx`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "mcp-server-row",
  anatomy: {
    description: {
      ko: "McpServerRow는 MCP 서버 하나를 목록의 한 행으로 보여 줍니다. 40px 타일과 이름, 태그, 상태 알약, 그리고 설정 버튼과 넘침 메뉴가 한 줄에 놓입니다.",
      en: "McpServerRow shows one MCP server as a row of a list: a 40px tile, the name, tags, a status pill, and a Configure button with an overflow menu.",
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
          ko: "이름의 앞 두 글자를 담는 40px 타일입니다. initials를 주면 그 글자로 바뀝니다.",
          en: "A 40px tile holding the first two letters of the name, replaced by initials when that is passed.",
        },
      },
      {
        name: "Head",
        slot: "name",
        description: {
          ko: "이름과 태그가 한 줄에 놓이는 자리입니다. 이름이 길면 말줄임표로 자르고 태그는 다음 줄로 접힙니다.",
          en: "The line where the name meets its tags. A long name truncates and the tags wrap to the next line.",
        },
      },
      {
        name: "Description",
        slot: "description",
        description: {
          ko: "태그 아래 본문 줄입니다. 서버가 무엇을 하는지 한 문장으로 적습니다.",
          en: "The body line under the tags: one sentence on what the server does.",
        },
      },
      {
        name: "Meta",
        slot: "meta",
        description: {
          ko: "도구 수나 인증 방식처럼 짧은 값들을 가운뎃점으로 이어 붙이는 줄입니다.",
          en: "A line of short values such as tool count or auth method, joined by a middle dot.",
        },
      },
      {
        name: "Status pill",
        slot: "statusLabel",
        description: {
          ko: "오른쪽 상태 알약입니다. 6px 점과 문구로 이루어지고 statusTone이 색을 정합니다.",
          en: "The status pill on the right: a 6px dot and a label, colored by statusTone.",
        },
      },
      {
        name: "Configure",
        slot: "onConfigure",
        description: {
          ko: "톱니 아이콘이 붙은 solid sm 버튼입니다. onConfigure가 없어도 그려지지만 눌러도 아무 일도 일어나지 않습니다.",
          en: "A solid sm button with a gear icon. It renders even without onConfigure, in which case pressing it does nothing.",
        },
      },
      {
        name: "Overflow menu",
        slot: "menu",
        description: {
          ko: "menu를 넘길 때만 나타나는 점 세 개 버튼입니다. 메뉴는 행에서 열리고 document.body로 포털됩니다.",
          en: "The three-dot button that appears only when menu is passed. Its menu opens from the row and portals to document.body.",
        },
      },
    ],
  },
  properties: [
    {
      id: "statusTone",
      title: { ko: "statusTone", en: "statusTone" },
      description: {
        ko: "상태 알약의 색과 점입니다. 서버가 건강한지, 손이 필요한지, 아직 모르는지를 색으로 나눕니다.",
        en: "The status pill's color and dot: healthy, needs attention, or not known yet.",
      },
      values: [
        {
          name: "connected",
          description: {
            ko: "정상 연결입니다. 옅은 바탕에 살아 있는 점이 붙은 기본 톤입니다.",
            en: "Healthy. The default tone: a muted fill with a live dot.",
          },
        },
        {
          name: "warning",
          description: {
            ko: "인증이 필요하거나 끊긴 상태입니다. 위험 색 바탕과 위험 색 점으로 바뀝니다.",
            en: "Needs sign-in or lost its connection. The pill and the dot turn to the danger color.",
          },
        },
        {
          name: "neutral",
          description: {
            ko: "쉬는 중이거나 아직 모르는 상태입니다. 옅은 바탕에 자리표시자 색 점을 씁니다.",
            en: "Idle or unknown: a muted fill with a placeholder-colored dot.",
          },
        },
      ],
      example: "tones",
    },
    {
      id: "statusLabel",
      title: { ko: "statusLabel", en: "statusLabel" },
      description: {
        ko: "알약 안의 문구입니다. 기본값은 Connected이고, 상태가 다르면 Needs auth처럼 그 상태를 그대로 적습니다.",
        en: "The text inside the pill. It defaults to Connected; for another state write that state, such as Needs auth.",
      },
      example: "tones",
    },
    {
      id: "tags",
      title: { ko: "tags", en: "tags" },
      description: {
        ko: "이름 옆에 붙는 회색 태그입니다. Official처럼 출처를 표시합니다. 같은 문자열이 두 번 와도 각각 다른 키로 그려집니다.",
        en: "Muted tags beside the name, marking provenance such as Official. A repeated string still gets its own key.",
      },
      example: "rows",
    },
    {
      id: "brandTags",
      title: { ko: "brandTags", en: "brandTags" },
      description: {
        ko: "브랜드 색으로 칠하는 태그입니다. All devices처럼 사용자가 고른 범위를 강조할 때 씁니다.",
        en: "Tags tinted brand, for a scope the user chose such as All devices.",
      },
      example: "rows",
    },
    {
      id: "meta",
      title: { ko: "meta", en: "meta" },
      description: {
        ko: "짧은 값의 배열입니다. 도구 수, 마지막 사용, 버전처럼 한눈에 훑는 값을 넣고 가운뎃점으로 이어 붙입니다.",
        en: "An array of short values such as tool count, last use or version, joined by a middle dot.",
      },
      example: "rows",
    },
    {
      id: "initials",
      title: { ko: "initials", en: "initials" },
      description: {
        ko: "타일 글자를 직접 정합니다. 이름에서 두 글자를 뽑으면 어색한 경우에 쓰고 두 글자까지가 가장 잘 읽힙니다.",
        en: "Overrides the two letters taken from the name. Use it when the derived pair reads badly; up to two characters read best.",
      },
      example: "rows",
    },
    {
      id: "menu",
      title: { ko: "menu", en: "menu" },
      description: {
        ko: "넘침 메뉴의 항목입니다. 넘기지 않으면 점 세 개 버튼이 아예 그려지지 않습니다.",
        en: "The overflow menu items. Without it the three-dot button is not rendered at all.",
      },
      example: "rows",
    },
    {
      id: "configureLabel",
      title: { ko: "configureLabel", en: "configureLabel" },
      description: {
        ko: "설정 버튼의 문구입니다. 기본값은 Configure이고, 서버마다 다른 동작을 시키면 그 동작의 이름으로 바꿉니다.",
        en: "The Configure button's text. It defaults to Configure; rename it when the button does something else for that server.",
      },
    },
  ],
  guidelines: [
    {
      id: "list-not-card",
      title: { ko: "행은 목록에 쌓습니다", en: "Rows belong in a list" },
      body: {
        ko: "이 행은 카드가 아니라 설정 목록의 한 줄입니다. 행만 아래로 쌓고 마지막 행에서 구분선이 사라지므로, 카드 안에 넣을 때는 카드가 모서리를 자르게 합니다.",
        en: "This is a row of a settings list, not a card. Stack rows and the last one drops its divider; inside a card, let the card clip the corners.",
      },
      do: {
        ko: "카드 안에 행을 위에서 아래로 쌓습니다.",
        en: "Stack the rows top to bottom inside a card.",
      },
      dont: {
        ko: "행 하나를 카드처럼 따로 띄우지 않습니다.",
        en: "Do not float one row on its own like a card.",
      },
      example: "rows",
    },
    {
      id: "tone-matches-label",
      title: { ko: "톤과 문구를 맞춥니다", en: "Match tone and label" },
      body: {
        ko: "statusTone은 색만 바꾸고 문구는 바꾸지 않습니다. warning을 쓰면 statusLabel도 Needs auth처럼 손이 필요한 상태로 맞춰야 색과 말이 어긋나지 않습니다.",
        en: "statusTone changes color, never the label. With warning, set statusLabel to the state that needs attention, such as Needs auth, or the color and the words disagree.",
      },
      example: "tones",
    },
    {
      id: "configure-needs-handler",
      title: { ko: "버튼에는 동작을 줍니다", en: "Give the button something to do" },
      body: {
        ko: "설정 버튼은 onConfigure가 없어도 그려집니다. 자리만 맞추려고 행을 넣는 경우가 아니라면 onConfigure를 넘겨 실제로 설정을 열게 합니다.",
        en: "The Configure button renders even without onConfigure. Unless the row is a layout placeholder, pass onConfigure so the button opens the settings.",
      },
      example: "actions",
    },
    {
      id: "short-meta",
      title: { ko: "meta는 짧게", en: "Keep meta short" },
      body: {
        ko: "meta는 가운뎃점으로 이어 붙는 한 줄입니다. 값이 길거나 개수가 많으면 줄이 접히며 행 높이가 들쭉날쭉해지므로 세 개 안팎으로 줄입니다.",
        en: "meta is one dotted line. Long values or many of them wrap and make row heights uneven, so keep it to about three entries.",
      },
      example: "rows",
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
        { state: "default", slot: "Tile", property: "radius", value: "10px" },
        { state: "default", slot: "Tile", property: "background", value: "bg-sky-500" },
        { state: "default", slot: "Tile", property: "text color", value: "text-neutral-50" },
        { state: "default", slot: "Tile", property: "font", value: "text-label-md" },
        { state: "default", slot: "Name", property: "font", value: "text-label-md" },
        { state: "default", slot: "Name", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Description", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Meta", property: "font", value: "text-label-sm" },
        { state: "default", slot: "Meta", property: "gap", value: "6px" },
        { state: "default", slot: "Name column", property: "basis", value: "160px" },
      ],
    },
    {
      id: "pills",
      title: { ko: "알약", en: "Pills" },
      note: {
        ko: "태그와 상태 알약은 높이와 글자 단계를 공유하고 색만 다릅니다.",
        en: "Tags and the status pill share a height and a type rung; only the colors differ.",
      },
      rows: [
        { state: "tag", slot: "Tag", property: "height", value: "22px" },
        { state: "tag", slot: "Tag", property: "radius", value: "9999px" },
        { state: "tag", slot: "Tag", property: "padding", value: "0 8px" },
        { state: "tag", slot: "Tag", property: "background", value: "bg-overlay-ink-6" },
        { state: "tag", slot: "Tag", property: "text color", value: "text-text-secondary" },
        { state: "brand tag", slot: "Tag", property: "background", value: "bg-accent-sky-500-18" },
        { state: "brand tag", slot: "Tag", property: "text color", value: "text-text-brand" },
        { state: "connected", slot: "Status pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "connected", slot: "Status pill", property: "text color", value: "text-text-primary" },
        { state: "connected", slot: "Status pill", property: "dot", value: "bg-status-live" },
        { state: "warning", slot: "Status pill", property: "background", value: "bg-accent-red-500-14" },
        { state: "warning", slot: "Status pill", property: "text color", value: "text-text-danger" },
        { state: "warning", slot: "Status pill", property: "dot", value: "bg-text-danger" },
        { state: "neutral", slot: "Status pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "neutral", slot: "Status pill", property: "text color", value: "text-text-secondary" },
        { state: "neutral", slot: "Status pill", property: "dot", value: "bg-text-placeholder" },
        { state: "all", slot: "Status pill", property: "font", value: "text-label-sm" },
        { state: "all", slot: "Status pill", property: "dot", value: "6px" },
      ],
    },
    {
      id: "actions",
      title: { ko: "동작", en: "Actions" },
      rows: [
        { state: "configure", slot: "Configure", property: "variant", value: "solid" },
        { state: "configure", slot: "Configure", property: "size", value: "sm" },
        { state: "configure", slot: "Configure", property: "icon size", value: "14px" },
        { state: "overflow", slot: "Overflow menu", property: "variant", value: "ghost" },
        { state: "overflow", slot: "Overflow menu", property: "size", value: "sm" },
        {
          state: "overflow",
          slot: "Overflow menu",
          property: "accessible name",
          value: "menuLabel (\"More\")",
        },
        {
          state: "overflow",
          slot: "Menu content",
          property: "alignment",
          value: "end",
          note: {
            ko: "메뉴는 행 오른쪽 끝에서 열리고 document.body로 포털됩니다.",
            en: "The menu opens at the row's right edge and portals to document.body.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "rows",
      title: { ko: "서버 목록", en: "Server rows" },
      description: {
        ko: "이름, 태그, 설명, 메타, 넘침 메뉴를 갖춘 세 행입니다. 마지막 행에는 구분선이 없습니다.",
        en: "Three rows with names, tags, descriptions, meta and overflow menus. The last row has no divider.",
      },
    },
    {
      id: "tones",
      title: { ko: "상태 톤", en: "Status tones" },
      description: {
        ko: "connected, warning, neutral을 나란히 두었습니다. 톤에 맞춰 문구도 함께 바꿉니다.",
        en: "Connected, warning and neutral side by side, each with a label that matches its tone.",
      },
    },
    {
      id: "actions",
      title: { ko: "설정 버튼", en: "Configure and overflow" },
      description: {
        ko: "Configure 버튼과 점 세 개 메뉴를 함께 둔 행입니다. 메뉴는 닫힌 트리거만 그립니다.",
        en: "A row with both the Configure button and the three-dot menu. The menu shows only its closed trigger.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "타일은 aria-hidden입니다. 서버 이름은 옆의 텍스트가 전달하므로 타일 글자를 낭독할 필요가 없습니다.",
        en: "The tile is aria-hidden. The name beside it carries the server identity, so the tile letters need no reading.",
      },
      {
        ko: "Configure 버튼에는 문구가 있어 이름이 따로 필요 없고, 점 세 개 버튼은 아이콘만 있어 menuLabel이 접근 가능한 이름이 됩니다.",
        en: "The Configure button names itself with its label, while the icon-only three-dot button takes its accessible name from menuLabel.",
      },
      {
        ko: "상태 알약의 점은 장식이라 aria-hidden이고, 상태는 알약 문구가 말합니다. 색만으로 상태를 전달하지 않습니다.",
        en: "The status dot is decorative and aria-hidden; the pill label states the status, so color is never the only signal.",
      },
      {
        ko: "넘침 메뉴는 Base UI Menu를 써서 키보드로 열고 항목 사이를 옮길 수 있습니다. 메뉴가 포털로 열리므로 미리보기 프레임 안에는 담기지 않습니다.",
        en: "The overflow menu uses the Base UI Menu, which opens from the keyboard and moves between items. It portals, so it cannot be contained in a preview frame.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "Configure 버튼과 넘침 버튼으로 차례로 포커스를 옮깁니다.", en: "Moves focus through the Configure button and then the overflow button." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "버튼을 실행하거나 메뉴를 엽니다.", en: "Runs the button or opens the menu." },
      },
      {
        keys: ["ArrowDown", "ArrowUp"],
        action: { ko: "열린 메뉴에서 항목 사이를 옮깁니다.", en: "Moves between items in an open menu." },
      },
      {
        keys: ["Escape"],
        action: { ko: "메뉴를 닫고 트리거로 포커스를 돌려놓습니다.", en: "Closes the menu and returns focus to the trigger." },
      },
    ],
  },
};
