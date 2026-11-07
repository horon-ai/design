/**
 * Reference doc for `Source Row`, written against
 * `packages/react/src/components/source-row.tsx` and
 * `packages/flutter/lib/src/components/source_row.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "source-row",
  anatomy: {
    description: {
      ko: "Source Row는 지식 소스 하나가 어디까지 색인됐는지 보여 주는 줄입니다. 왼쪽에 소스 아이콘과 이름, 가운데에 parse, chunk, embed, index 네 단계 막대, 오른쪽에 지금 단계의 결과나 재시도 버튼이 놓입니다.",
      en: "Source Row reports how far one knowledge source has been indexed: the source icon and name on the left, four stage bars for parse, chunk, embed and index in the middle, and the current stage's result or a retry button on the right.",
    },
    parts: [
      {
        name: "Row",
        slot: "SourceRow",
        description: {
          ko: "한 줄을 감싸는 틀입니다. 카드 변형은 14px 라운드와 테두리를, 목록 변형은 아래쪽 1px 구분선만 씁니다.",
          en: "The frame around the row. The card variant has a 14px radius and a border; the list variant keeps only a 1px divider below.",
        },
      },
      {
        name: "Source tile",
        slot: "icon",
        description: {
          ko: "32px 타일 안에 16px 소스 아이콘을 넣습니다. 파일, 사이트, 메일함 같은 종류를 한눈에 구분하게 합니다.",
          en: "A 32px tile holding a 16px source icon, so file, site and mailbox are told apart at a glance.",
        },
      },
      {
        name: "Name and detail",
        slot: "name · detail",
        description: {
          ko: "이름은 label-md 한 줄로 자르고, 상세 줄에는 페이지와 청크 수, 또는 지금 단계와 진행량을 적습니다. 실패하면 경고 아이콘과 함께 danger 색이 됩니다.",
          en: "The name is cut to one label-md line; the detail line carries pages and chunks, or the current stage and how far it got. On failure it turns danger and gains a warning icon.",
        },
      },
      {
        name: "Stage bars",
        slot: "stages",
        description: {
          ko: "parse, chunk, embed, index 네 단계를 막대 네 개로 그립니다. 끝난 단계는 35% 잉크, 대기 단계는 8% 잉크, 실패는 붉은 강조색이고, 진행 중 단계만 progress만큼 채워집니다.",
          en: "Four bars for parse, chunk, embed and index: 35% ink for a finished stage, 8% ink for a waiting one, the red accent for a failed one, and only the active bar fills to progress.",
        },
      },
      {
        name: "Trailing slot",
        slot: "status",
        description: {
          ko: "상태마다 다른 컨트롤이 들어가는 72px 자리입니다. ready면 체크, indexing이면 퍼센트 숫자, failed면 Retry 버튼입니다.",
          en: "A 72px slot whose control follows the state: a check when ready, a percentage while indexing, and a Retry button when failed.",
        },
      },
    ],
  },
  properties: [
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "소스의 전체 상태입니다. 단계 막대의 기본값, 상세 줄 색, 오른쪽 컨트롤을 함께 정합니다.",
        en: "The source's overall state. It picks the default stage bars, the detail color and the trailing control.",
      },
      values: [
        {
          name: "ready",
          description: {
            ko: "네 단계가 모두 끝나 오른쪽에 체크가 붙습니다. 상세 줄에는 페이지와 청크 수처럼 결과를 적습니다.",
            en: "All four stages are done and a check sits at the right. The detail line carries the result, such as pages and chunks.",
          },
        },
        {
          name: "indexing",
          description: {
            ko: "기본값은 parse와 chunk가 끝나고 embed가 진행 중인 모양입니다. progress만큼 채워지고 오른쪽에 퍼센트가 나옵니다.",
            en: "By default parse and chunk are done and embed is active. The bar fills to progress and a percentage shows at the right.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "기본값은 embed에서 멈춘 모양입니다. 상세 줄이 danger가 되고 오른쪽에 Retry 버튼이 나옵니다.",
            en: "By default it stops at embed. The detail turns danger and a Retry button appears at the right.",
          },
        },
      ],
      example: "states",
    },
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "줄의 겉모양입니다. KnowledgeBasePanel처럼 목록을 담는 패널 안에서는 list를, 한 줄만 단독으로 보여 줄 때는 card를 씁니다.",
        en: "The row's shell. Use list inside a panel that holds a list, such as KnowledgeBasePanel, and card for a single row on its own.",
      },
      values: [
        {
          name: "card",
          description: {
            ko: "기본값입니다. 14px 라운드와 테두리, surface 바탕을 갖고 좌우 패딩이 12px입니다.",
            en: "The default: 14px radius, a border, the surface fill and 12px side padding.",
          },
        },
        {
          name: "list",
          description: {
            ko: "바탕과 테두리를 없애고 아래쪽에만 1px 구분선을 그립니다. 마지막 줄은 구분선도 그리지 않습니다.",
            en: "Drops the fill and border and draws only a 1px divider below. The last row draws none.",
          },
        },
      ],
      example: "list",
    },
    {
      id: "progress",
      title: { ko: "progress", en: "progress" },
      description: {
        ko: "진행 중 단계의 막대가 채워질 비율입니다. 0에서 100 사이 값을 넣고, indexing이 아니면 막대에 쓰이지 않으므로 상태와 함께 움직여야 합니다.",
        en: "How full the active bar is, from 0 to 100. It is only drawn while indexing, so it has to move together with the state.",
      },
      example: "stages",
    },
    {
      id: "stages",
      title: { ko: "stages", en: "stages" },
      description: {
        ko: "네 단계의 상태를 직접 지정합니다. 값을 넘기지 않으면 status에 맞는 기본 조합을 씁니다. 앞 단계에서 멈춘 소스처럼 기본 조합으로 표현할 수 없는 진행을 보여 줄 때만 넘깁니다.",
        en: "Sets the four stage states yourself. Without it the default set for status applies. Pass it only when the progress cannot be expressed by that default, such as a source that stopped early.",
      },
      values: [
        {
          name: "done",
          description: { ko: "끝난 단계입니다. 35% 잉크 막대로 그립니다.", en: "A finished stage, drawn as a 35% ink bar." },
        },
        {
          name: "active",
          description: {
            ko: "지금 도는 단계입니다. 8% 잉크 트랙 위에 status-live 색이 progress만큼 채워집니다.",
            en: "The stage running now: the status-live fill over an 8% ink track, filled to progress.",
          },
        },
        {
          name: "todo",
          description: { ko: "아직 오지 않은 단계입니다. 8% 잉크 막대로 그립니다.", en: "A stage still ahead, drawn as an 8% ink bar." },
        },
        {
          name: "failed",
          description: {
            ko: "실패한 단계입니다. 붉은 강조색 막대로 그립니다.",
            en: "A failed stage, drawn as a red accent bar.",
          },
        },
      ],
      example: "stages",
    },
    {
      id: "onRetry",
      title: { ko: "onRetry", en: "onRetry" },
      description: {
        ko: "Retry 버튼이 부르는 함수입니다. failed에서만 버튼이 그려지므로 다른 상태에서는 넘겨도 화면에 나오지 않습니다.",
        en: "Called by the Retry button, which renders only in failed, so passing it in another state changes nothing on screen.",
      },
      example: "states",
    },
    {
      id: "detail",
      title: { ko: "detail", en: "detail" },
      description: {
        ko: "이름 아래 caption 줄입니다. 끝난 소스에는 페이지와 청크 수를, 진행 중에는 지금 단계와 진행량을, 실패에는 멈춘 지점을 적습니다.",
        en: "The caption line under the name: pages and chunks for a finished source, the current stage and progress while indexing, and where it stopped on failure.",
      },
      example: "states",
    },
  ],
  guidelines: [
    {
      id: "detail-names-the-stage",
      title: { ko: "단계 막대는 색만으로 말하지 않습니다", en: "The bars never speak alone" },
      body: {
        ko: "단계 막대는 aria-hidden이라 화면 낭독기에 전달되지 않습니다. 어느 단계인지와 얼마나 갔는지는 detail 줄의 문장이 책임지므로, 진행 중인 소스에는 지금 단계의 이름을 반드시 적습니다.",
        en: "The stage bars are aria-hidden and never reach a screen reader. The detail line owns the stage name and how far it got, so name the running stage in it.",
      },
      do: {
        ko: "\"Embedding · 140 of 296 chunks\"처럼 단계와 양을 함께 적습니다.",
        en: "Write the stage with its amount, as in \"Embedding · 140 of 296 chunks\".",
      },
      dont: {
        ko: "\"Indexing…\"만 적고 어느 단계인지 숨기지 않습니다.",
        en: "Do not reduce it to \"Indexing…\" and hide which stage it is.",
      },
      example: "states",
    },
    {
      id: "progress-matches-state",
      title: { ko: "progress는 상태와 함께 움직입니다", en: "Progress moves with the state" },
      body: {
        ko: "progress는 진행 중 단계의 막대에만 쓰입니다. 100을 넘기거나 상태가 ready인데 숫자가 남아 있으면 줄이 서로 다른 말을 합니다. 단계가 끝나면 status를 ready로 바꿔 체크가 숫자를 대신하게 합니다.",
        en: "progress only paints the active bar. A value past 100, or a number left behind on a ready source, makes the row contradict itself. When the stage finishes, switch status to ready so the check replaces the number.",
      },
      do: {
        ko: "끝난 소스는 ready로 바꾸고 progress를 넘기지 않습니다.",
        en: "Move a finished source to ready and stop passing progress.",
      },
      dont: {
        ko: "ready 상태에 progress={100}을 남겨 두지 않습니다.",
        en: "Do not leave progress={100} on a ready source.",
      },
      example: "stages",
    },
    {
      id: "stages-for-odd-pipelines",
      title: { ko: "기본 조합으로 안 될 때만 stages", en: "Reach for stages only when needed" },
      body: {
        ko: "기본 조합은 세 상태를 각각 네 단계에 맞춰 그립니다. parse에서 멈춘 소스처럼 앞 단계가 진행 중인 경우에만 stages를 넘기고, 넘길 때는 네 값을 모두 적습니다.",
        en: "The defaults map the three states onto the four stages. Pass stages only for a shape they cannot express, such as a source still parsing, and always give all four values.",
      },
      do: {
        ko: "parse 중이면 [\"active\", \"todo\", \"todo\", \"todo\"]를 넘깁니다.",
        en: "While parsing, pass [\"active\", \"todo\", \"todo\", \"todo\"].",
      },
      dont: {
        ko: "기본값과 같은 배열을 굳이 넘겨 두지 않습니다.",
        en: "Do not hard-code an array that equals the default.",
      },
      example: "stages",
    },
    {
      id: "list-inside-the-panel",
      title: { ko: "패널 안에서는 list 변형", en: "List variant inside the panel" },
      body: {
        ko: "KnowledgeBasePanel은 이미 surface 카드입니다. 그 안에 카드형 줄을 넣으면 테두리가 두 겹이 되므로 list 변형으로 구분선만 남깁니다. 목록 밖에 한 줄만 보여 줄 때 card를 씁니다.",
        en: "KnowledgeBasePanel is already a surface card. Card rows inside it double the border, so the list variant keeps only dividers. Use card for a single row outside a list.",
      },
      do: {
        ko: "패널 안에서는 variant=\"list\"로 줄을 이어 붙입니다.",
        en: "Join rows with variant=\"list\" inside the panel.",
      },
      dont: {
        ko: "패널 안에 카드형 소스 줄을 쌓지 않습니다.",
        en: "Do not stack card rows inside the panel.",
      },
      example: "list",
    },
  ],
  specification: [
    {
      id: "row-frame",
      title: { ko: "줄 틀", en: "Row frame" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "SourceRow", property: "padding", value: "px-2 py-3" },
        { state: "default", slot: "SourceRow", property: "column gap", value: "12px" },
        { state: "default", slot: "SourceRow", property: "row gap", value: "8px" },
        { state: "card", slot: "SourceRow", property: "radius", value: "14px" },
        { state: "card", slot: "SourceRow", property: "border", value: "1px border-border-default" },
        { state: "card", slot: "SourceRow", property: "background", value: "bg-bg-surface" },
        { state: "card", slot: "SourceRow", property: "padding", value: "px-3" },
        { state: "list", slot: "SourceRow", property: "background", value: "transparent" },
        {
          state: "list",
          slot: "Divider",
          property: "background",
          value: "1px bg-overlay-ink-8",
          note: {
            ko: "줄 아래에 그리며 좌우 8px은 들여서 그립니다.",
            en: "Drawn under the row, inset 8px from each side.",
          },
        },
        {
          state: "list · last",
          slot: "Divider",
          property: "height",
          value: "0",
          note: {
            ko: "마지막 줄은 구분선을 그리지 않습니다.",
            en: "The last row draws no divider.",
          },
        },
        { state: "default", slot: "Source tile", property: "size", value: "32px" },
        { state: "default", slot: "Source tile", property: "radius", value: "10px" },
        { state: "default", slot: "Source tile", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "Source icon", property: "size", value: "16px" },
        { state: "default", slot: "Name", property: "font", value: "text-label-md" },
        { state: "default", slot: "Name", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Detail", property: "font", value: "text-caption" },
        { state: "default", slot: "Detail", property: "text color", value: "text-text-secondary" },
        { state: "failed", slot: "Detail", property: "text color", value: "text-text-danger" },
        { state: "failed", slot: "Detail", property: "icon", value: "WarningCircle 12px" },
      ],
    },
    {
      id: "stage-bars",
      title: { ko: "단계 막대", en: "Stage bars" },
      rows: [
        { state: "default", slot: "Stage bar", property: "height", value: "3px" },
        { state: "default", slot: "Stage bar", property: "width", value: "24px" },
        { state: "default", slot: "Stage bar", property: "width from sm", value: "44px" },
        { state: "default", slot: "Stage bar", property: "radius", value: "rounded-full" },
        { state: "done", slot: "Stage bar", property: "background", value: "bg-overlay-ink-35" },
        { state: "todo", slot: "Stage bar", property: "background", value: "bg-overlay-ink-8" },
        { state: "failed", slot: "Stage bar", property: "background", value: "bg-accent-red-500-90" },
        { state: "active", slot: "Stage bar track", property: "background", value: "bg-overlay-ink-8" },
        { state: "active", slot: "Stage bar fill", property: "background", value: "bg-status-live" },
        {
          state: "active",
          slot: "Stage bar fill",
          property: "motion",
          value: "transition-[width] duration-400 ease-out-quint",
          note: {
            ko: "폭이 progress만큼 바뀌며 400ms로 따라갑니다.",
            en: "The width follows progress over 400ms.",
          },
        },
        {
          state: "all",
          slot: "Stage bars",
          property: "accessibility",
          value: "aria-hidden",
          note: {
            ko: "단계 정보는 detail 줄이 문장으로 전달합니다.",
            en: "The detail line carries the stage in words instead.",
          },
        },
      ],
    },
    {
      id: "trailing",
      title: { ko: "오른쪽 자리", en: "Trailing slot" },
      rows: [
        { state: "default", slot: "Trailing slot", property: "width", value: "72px" },
        { state: "default", slot: "Trailing slot", property: "height", value: "30px" },
        { state: "ready", slot: "Check", property: "size", value: "16px" },
        { state: "ready", slot: "Check", property: "text color", value: "text-text-secondary" },
        { state: "indexing", slot: "Percentage", property: "font", value: "text-label-md" },
        { state: "indexing", slot: "Percentage", property: "text color", value: "text-text-secondary" },
        {
          state: "indexing",
          slot: "Percentage",
          property: "motion",
          value: "animate-fade-in",
          note: {
            ko: "숫자가 바뀔 때마다 160ms로 다시 나타납니다.",
            en: "It fades in again, over 160ms, each time the number changes.",
          },
        },
        { state: "failed", slot: "Retry button", property: "height", value: "30px" },
        { state: "failed", slot: "Retry button", property: "background", value: "bg-overlay-ink-6" },
        { state: "failed", slot: "Retry button", property: "radius", value: "rounded-full" },
        { state: "failed", slot: "Retry button", property: "padding", value: "px-3" },
        { state: "failed", slot: "Retry button", property: "font", value: "text-label-sm" },
        { state: "failed · hover", slot: "Retry button", property: "background", value: "bg-overlay-ink-10" },
      ],
    },
  ],
  examples: [
    {
      id: "states",
      title: { ko: "세 상태", en: "Three states" },
      description: {
        ko: "ready, indexing, failed를 위에서 아래로 놓았습니다. 실패한 줄만 상세 문장이 danger가 되고 Retry 버튼이 붙습니다.",
        en: "Ready, indexing and failed from top to bottom. Only the failed row turns its detail to danger and gains a Retry button.",
      },
    },
    {
      id: "list",
      title: { ko: "목록 변형", en: "List variant" },
      description: {
        ko: "패널에 담을 때 쓰는 목록 변형입니다. 테두리 없이 구분선만 남고 마지막 줄에는 선이 없습니다.",
        en: "The list variant for use inside a panel: dividers instead of borders, and no line under the last row.",
      },
    },
    {
      id: "stages",
      title: { ko: "단계 직접 지정", en: "Explicit stages" },
      description: {
        ko: "parse와 chunk에서 각각 진행 중인 소스 두 개입니다. stages로 진행 중 단계를 앞으로 옮겼습니다.",
        en: "Two sources still in parse and in chunk, with stages moving the active bar forward.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "단계 막대 네 개는 aria-hidden입니다. 어느 단계인지와 얼마나 남았는지는 detail 문장이 전달하므로 그 줄을 비우지 않습니다.",
        en: "The four stage bars are aria-hidden. The detail sentence carries the stage and the remaining amount, so never leave that line empty.",
      },
      {
        ko: "indexing의 퍼센트는 진행 막대 역할이 아니라 그냥 텍스트입니다. aria-valuenow 같은 값이 없으므로 화면 낭독기는 숫자만 읽고, 진행이 바뀌어도 스스로 알리지 않습니다.",
        en: "The indexing percentage is plain text, not a progressbar, so there is no aria-valuenow and no announcement when it changes. A reader hears the number only when it reaches that row.",
      },
      {
        ko: "ready의 체크는 aria-label=\"Ready\"를 달고 있어 상태를 이름으로 알립니다. 실패의 경고 아이콘은 aria-hidden이고 대신 Retry 버튼이 다음 행동을 제공합니다.",
        en: "The ready check carries aria-label=\"Ready\", naming the state. The failure warning icon is aria-hidden and the Retry button offers the next action instead.",
      },
      {
        ko: "동작 줄이기를 켜면 진행 막대 폭 전환과 퍼센트 페이드가 즉시 끝납니다.",
        en: "Under reduced motion the bar's width transition and the percentage fade finish instantly.",
      },
    ],
    keyboard: [
      { keys: ["Tab"], action: { ko: "실패한 줄의 Retry 버튼으로 이동합니다.", en: "Moves to the Retry button on a failed row." } },
      { keys: ["Enter"], action: { ko: "Retry를 실행합니다.", en: "Runs Retry." } },
      { keys: ["Space"], action: { ko: "Retry를 실행합니다.", en: "Runs Retry." } },
    ],
  },
};
