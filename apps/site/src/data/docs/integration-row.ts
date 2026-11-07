/**
 * Reference doc for `IntegrationRow`, written against
 * `packages/react/src/components/integration-row.tsx` and
 * `packages/flutter/lib/src/components/integration_row.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "integration-row",
  anatomy: {
    description: {
      ko: "IntegrationRow는 서비스 하나의 연결 상태를 한 줄로 보여 줍니다. 왼쪽 40px 타일에 아이콘이 놓이고 이름과 상세가 이어지며, 오른쪽에는 상태 알약이나 동작 버튼 하나가 붙습니다.",
      en: "An IntegrationRow shows one service's connection state on a single line: a 40px icon tile, the name and detail, and one status pill or action button on the right.",
    },
    parts: [
      {
        name: "Container",
        slot: "div",
        description: {
          ko: "행 전체를 감싸는 컨테이너입니다. 모서리 16px에 위아래 여백 12px, 왼쪽 12px, 오른쪽 14px이고, 좁은 폭에서는 이름 칸이 다음 줄로 접힙니다.",
          en: "The row shell: 16px corners, 12px block padding, 12px on the left and 14px on the right. The text column wraps to a second line when the row gets narrow.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 컨테이너 안쪽에 깔리는 유리 레이어입니다. 타일과 문구는 그 위에 놓입니다.",
          en: "A glass layer drawn inside the container when surface is glass. The tile and the copy sit above it.",
        },
      },
      {
        name: "Tile",
        slot: "icon",
        description: {
          ko: "아이콘을 담는 40px 타일입니다. 모서리 10px이고 안쪽 아이콘은 20px이며, 상태에 따라 바탕색이 바뀝니다.",
          en: "A 40px tile holding the icon. Its corners are 10px, the icon inside is 20px, and its fill follows the status.",
        },
      },
      {
        name: "Name",
        slot: "name",
        description: {
          ko: "서비스 이름입니다. 한 줄로 자르고 넘치면 말줄임표를 붙입니다.",
          en: "The service name. It stays on one line and ends with an ellipsis when it overflows.",
        },
      },
      {
        name: "Detail",
        slot: "detail",
        description: {
          ko: "이름 아래 보조 줄입니다. 연결된 계정과 권한, 또는 다시 연결해야 하는 이유를 적습니다. reconnect에서는 위험 색으로 바뀝니다.",
          en: "The secondary line under the name: the connected account and scopes, or why a reconnect is needed. It turns to the danger color for reconnect.",
        },
      },
      {
        name: "Status pill",
        slot: "connectedLabel",
        description: {
          ko: "connected에서만 보이는 알약입니다. 살아 있는 점과 문구를 함께 보여 주고 버튼은 숨깁니다.",
          en: "The pill shown only when connected. It carries a live dot and the label, and the button is hidden.",
        },
      },
      {
        name: "Action button",
        slot: "reconnectLabel",
        description: {
          ko: "reconnect와 not-connected에서 보이는 버튼입니다. 두 상태는 같은 자리를 쓰고 알약과 교차 전환됩니다.",
          en: "The button shown for reconnect and not-connected. Both states share one slot and cross-fade with the pill.",
        },
      },
    ],
  },
  properties: [
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "서비스의 연결 상태입니다. 타일 바탕, 오른쪽 컨트롤, 재연결일 때의 위험 테두리를 한 번에 정합니다.",
        en: "The service's connection state. It drives the tile fill, the control on the right, and the danger border used for a reconnect.",
      },
      values: [
        {
          name: "connected",
          description: {
            ko: "정상 연결입니다. 타일이 하늘색으로 채워지고 오른쪽에 살아 있는 점이 붙은 알약이 서며 버튼은 사라집니다.",
            en: "A healthy connection. The tile fills sky, a pill with a live dot sits on the right, and the button disappears.",
          },
        },
        {
          name: "reconnect",
          description: {
            ko: "권한이 만료되어 다시 연결해야 하는 상태입니다. 타일이 더 진한 하늘색이 되고 행 테두리와 detail이 위험 색이 되며 Reconnect 버튼이 붙습니다.",
            en: "The connection needs to be renewed. The tile turns to a deeper sky, the row border and the detail line take the danger color, and a Reconnect button appears.",
          },
        },
        {
          name: "not-connected",
          description: {
            ko: "아직 연결하지 않은 상태입니다. 타일이 옅은 회색이 되고 연결 동작을 실행하는 주요 버튼이 붙습니다.",
            en: "Not connected yet. The tile turns to a muted gray and the primary button that starts the connection appears.",
          },
        },
      ],
      example: "statuses",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "행의 바탕 재질입니다. solid는 불투명한 표면에 기본 테두리를 쓰고, glass는 두꺼운 유리로 그립니다.",
        en: "The row's material. Solid is an opaque surface with a default border; glass draws the thick glass.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "본문이나 설정 화면처럼 불투명한 면 위에 놓을 때 씁니다. 기본값입니다.",
            en: "For opaque pages such as a settings screen. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위에 떠 있는 크롬에 씁니다. reconnect 테두리는 유리 가장자리 색으로 옮겨 갑니다.",
            en: "For chrome floating over imagery or a glass panel. The reconnect border moves to the glass edge.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "onAction",
      title: { ko: "onAction", en: "onAction" },
      description: {
        ko: "오른쪽 버튼을 누를 때 호출됩니다. connected에는 버튼이 없으므로 그 상태에서는 호출되지 않습니다.",
        en: "Called when the right-hand button is pressed. A connected row has no button, so it never fires then.",
      },
      example: "connect",
    },
    {
      id: "connectedLabel",
      title: { ko: "연결 문구", en: "Labels" },
      description: {
        ko: "connectedLabel은 알약 문구이고 기본값은 Connected입니다. reconnectLabel과 connectLabel은 각 상태의 버튼 문구이며 기본값은 Reconnect와 Connect입니다.",
        en: "connectedLabel is the pill text and defaults to Connected. reconnectLabel and connectLabel name the buttons for those states and default to Reconnect and Connect.",
      },
    },
  ],
  guidelines: [
    {
      id: "one-service-per-row",
      title: { ko: "서비스 하나에 행 하나", en: "One row per service" },
      body: {
        ko: "행은 서비스 하나의 연결 상태만 보여 줍니다. 여러 서비스를 카드 격자로 늘어놓기보다 목록으로 쌓으면 상태를 세로로 훑을 수 있습니다.",
        en: "A row carries one service's connection state. Stacking rows in a list lets the eye scan the states down a column; a grid of cards does not.",
      },
      do: {
        ko: "Gmail, Calendar, Slack을 위에서 아래로 쌓습니다.",
        en: "Stack Gmail, Calendar and Slack from top to bottom.",
      },
      dont: {
        ko: "한 행에 서비스 두 개를 넣지 않습니다.",
        en: "Do not put two services in one row.",
      },
      example: "statuses",
    },
    {
      id: "reconnect-reason",
      title: { ko: "재연결에는 이유를 적습니다", en: "Say why a reconnect is needed" },
      body: {
        ko: "reconnect에서 detail은 위험 색으로 바뀌며 사용자가 무엇이 끊겼는지 읽는 자리입니다. 만료된 권한이나 실패한 인증처럼 이유를 한 줄로 적습니다.",
        en: "In the reconnect state the detail line turns to the danger color and becomes the place the reason is read. Put the expired scope or the failed sign-in there in one line.",
      },
      do: {
        ko: "Access expired 2 days ago처럼 이유를 적습니다.",
        en: "Write the reason, such as Access expired 2 days ago.",
      },
      dont: {
        ko: "detail을 비워 두고 Reconnect 버튼만 두지 않습니다.",
        en: "Do not leave the detail empty and show only the Reconnect button.",
      },
      example: "statuses",
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 떠 있는 면에서만", en: "Glass only floats" },
      body: {
        ko: "glass는 이미지나 유리 패널 위에 놓인 행에만 씁니다. 불투명한 설정 목록 안에서는 유리 바탕이 보이지 않아 solid와 구분되지 않습니다.",
        en: "Use glass only for a row that floats over imagery or a glass panel. Inside an opaque settings list the fill disappears and the row reads as solid.",
      },
      example: "glass",
    },
    {
      id: "state-not-ownership",
      title: { ko: "상태는 호출자가 정합니다", en: "The caller owns the state" },
      body: {
        ko: "행은 status를 스스로 바꾸지 않습니다. onAction에서 연결을 마친 뒤 호출자가 status를 connected로 바꿔 주어야 알약으로 교체됩니다.",
        en: "The row never changes status on its own. After the connection completes, the caller sets status to connected and the pill replaces the button.",
      },
      example: "connect",
    },
  ],
  specification: [
    {
      id: "status-colors",
      title: { ko: "상태별 색", en: "Status colors" },
      note: {
        ko: "값은 토큰 유틸 이름입니다. glass에서는 not-connected 타일만 overlay-ink-6을 쓰고 나머지는 같은 색을 유지합니다.",
        en: "Values are token utility names. On glass only the not-connected tile switches to overlay-ink-6; the other fills stay the same.",
      },
      rows: [
        { state: "connected", slot: "Tile", property: "background", value: "bg-sky-500" },
        { state: "connected", slot: "Tile", property: "icon color", value: "text-neutral-50" },
        { state: "connected", slot: "Status pill", property: "background", value: "bg-accent-sky-500-18" },
        { state: "connected", slot: "Status pill", property: "text color", value: "text-text-primary" },
        { state: "connected", slot: "Status pill", property: "dot", value: "bg-status-live" },
        { state: "reconnect", slot: "Tile", property: "background", value: "bg-sky-700" },
        { state: "reconnect", slot: "Tile", property: "icon color", value: "text-neutral-50" },
        { state: "reconnect", slot: "Container", property: "border", value: "1px border-border-danger" },
        {
          state: "reconnect",
          slot: "Container",
          property: "glass edge",
          value: "[--glass-edge:var(--color-border-danger)]",
          note: {
            ko: "glass에서는 테두리 대신 유리 가장자리 색을 위험 색으로 바꿉니다.",
            en: "On glass the danger color goes to the glass edge instead of a border.",
          },
        },
        { state: "reconnect", slot: "Detail", property: "text color", value: "text-text-danger" },
        { state: "reconnect", slot: "Action button", property: "background", value: "bg-accent-red-500-14" },
        { state: "reconnect", slot: "Action button", property: "text color", value: "text-text-danger" },
        { state: "not-connected", slot: "Tile", property: "background", value: "bg-bg-subtle" },
        { state: "not-connected", slot: "Tile", property: "icon color", value: "text-text-secondary" },
        {
          state: "not-connected",
          slot: "Tile",
          property: "background (glass)",
          value: "bg-overlay-ink-6",
        },
        { state: "not-connected", slot: "Action button", property: "background", value: "bg-interactive-primary" },
        { state: "not-connected", slot: "Action button", property: "text color", value: "text-text-inverse" },
        { state: "Detail", slot: "Detail", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "metrics",
      title: { ko: "치수", en: "Metrics" },
      rows: [
        { state: "solid", slot: "Container", property: "radius", value: "16px" },
        { state: "solid", slot: "Container", property: "padding", value: "12px 14px 12px 12px" },
        { state: "solid", slot: "Container", property: "gap", value: "12px / 8px" },
        { state: "solid", slot: "Container", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Container", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Container", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Container", property: "background layer", value: "LiquidGlass" },
        { state: "all", slot: "Tile", property: "size", value: "40px" },
        { state: "all", slot: "Tile", property: "radius", value: "10px" },
        { state: "all", slot: "Tile", property: "icon size", value: "20px" },
        { state: "all", slot: "Name", property: "font", value: "text-label-md" },
        { state: "all", slot: "Detail", property: "font", value: "text-caption" },
        { state: "all", slot: "Name column", property: "basis", value: "160px" },
        { state: "all", slot: "Name column", property: "gap", value: "2px" },
        { state: "all", slot: "Status pill", property: "height", value: "30px" },
        { state: "all", slot: "Status pill", property: "radius", value: "9999px" },
        { state: "all", slot: "Status pill", property: "padding", value: "0 12px" },
        { state: "all", slot: "Status pill", property: "font", value: "text-label-sm" },
        { state: "all", slot: "Status pill", property: "dot", value: "6px" },
        { state: "connected · action", slot: "Action button", property: "height", value: "30px" },
        { state: "connected · action", slot: "Action button", property: "padding", value: "0 12px" },
        { state: "connected · action", slot: "Action button", property: "gap", value: "6px" },
        { state: "not-connected", slot: "Action button", property: "icon size", value: "14px" },
      ],
    },
    {
      id: "states",
      title: { ko: "상호작용 상태", en: "Interaction states" },
      rows: [
        {
          state: "focus-visible",
          slot: "Action button",
          property: "outline",
          value: "2px outline-text-brand",
        },
        {
          state: "focus-visible",
          slot: "Action button",
          property: "outline offset",
          value: "2px",
        },
        {
          state: "pressed",
          slot: "Action button",
          property: "motion",
          value: "motion-press",
          note: {
            ko: "scale 0.97이고, 동작 줄이기를 켜면 즉시 끝납니다.",
            en: "Scale 0.97, collapsing to nothing when reduced motion is on.",
          },
        },
        {
          state: "status change",
          slot: "Action slot",
          property: "motion",
          value: "motion-swap",
          note: {
            ko: "알약과 버튼이 같은 자리에서 교차 전환됩니다. 숨은 쪽은 aria-hidden과 tabIndex -1로 포커스를 받지 않습니다.",
            en: "The pill and the button cross-fade in one slot. The hidden one is aria-hidden and taken out of the tab order with tabIndex -1.",
          },
        },
        {
          state: "tile",
          slot: "Tile",
          property: "motion",
          value: "motion-colors",
          note: {
            ko: "상태가 바뀔 때 바탕색과 글자색이 함께 전환됩니다.",
            en: "Fill and text color transition together when the status changes.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "statuses",
      title: { ko: "세 가지 상태", en: "Three states" },
      description: {
        ko: "연결됨, 재연결 필요, 미연결을 한 줄씩 놓았습니다. 타일과 오른쪽 컨트롤이 상태를 따라 바뀝니다.",
        en: "Connected, reconnect and not connected in one stack. The tile and the right-hand control follow the status.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 위의 행", en: "Glass over a backdrop" },
      description: {
        ko: "같은 세 상태를 배경 위 두꺼운 유리로 그립니다. 재연결 테두리는 유리 가장자리 색으로 옮겨 갑니다.",
        en: "The same three states as thick glass over a backdrop. The reconnect outline moves to the glass edge.",
      },
    },
    {
      id: "connect",
      title: { ko: "연결 흐름", en: "Connecting in place" },
      description: {
        ko: "not-connected에서 버튼을 누르면 호출자가 status를 connected로 바꾸고 행이 알약으로 교체됩니다.",
        en: "Pressing the button on a not-connected row lets the caller set status to connected, and the row swaps to the pill.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "행 전체는 컨테이너일 뿐이고, 누를 수 있는 것은 오른쪽 버튼 하나입니다. 행에 onClick을 붙이지 않습니다.",
        en: "The row is only a container; the one pressable thing is the button on the right. Do not put onClick on the row.",
      },
      {
        ko: "보이지 않는 컨트롤은 aria-hidden과 tabIndex -1로 포커스와 낭독에서 모두 빠집니다. 상태가 바뀌어도 죽은 버튼이 탭 순서에 남지 않습니다.",
        en: "The control that is not showing is aria-hidden and tabIndex -1, so it leaves both the tab order and the reading order. A state change never leaves a dead button in the tab sequence.",
      },
      {
        ko: "상태를 색만으로 전달하지 않습니다. 알약 문구와 버튼 문구가 상태를 말로 알려 주므로 기본 문구를 그대로 두는 편이 좋습니다.",
        en: "Status is never color alone: the pill text and the button label name it. Keeping the default labels is the safe choice.",
      },
      {
        ko: "연결된 알약의 점은 장식이라 aria-hidden입니다. 읽어 줄 정보는 알약 문구에 담깁니다.",
        en: "The dot inside the connected pill is decorative and aria-hidden; the pill text carries the meaning.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "오른쪽 버튼으로 포커스를 옮깁니다. connected에는 버튼이 없어 건너뜁니다.", en: "Moves focus to the right-hand button. A connected row has no button, so it is skipped." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "버튼의 동작을 실행합니다.", en: "Runs the button's action." },
      },
    ],
  },
};
