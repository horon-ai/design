/**
 * Reference doc for `ApprovalCard`, written against
 * `packages/react/src/components/approval-card.tsx` and
 * `packages/flutter/lib/src/components/approval_card.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "approval-card",
  anatomy: {
    description: {
      ko: "ApprovalCard는 봇이 실행 전에 예나 아니오를 받는 카드입니다. 상태 줄, 질문, 첨부 이름과 두 버튼이 위에서 아래로 놓입니다.",
      en: "An ApprovalCard asks for a yes or no before the bot runs something. A status line, the question, an attachment name and two buttons stack top to bottom.",
    },
    parts: [
      {
        name: "Card",
        slot: "div",
        description: {
          ko: "카드 본체입니다. pending 동안 브랜드 테두리로 시선을 끌고, 결정이 끝나면 테두리가 기본값으로 돌아갑니다.",
          en: "The card. It draws the brand border while pending and returns to the default border once settled.",
        },
      },
      {
        name: "Status dot",
        slot: "dot",
        description: {
          ko: "상태를 나타내는 8px 점입니다. pending은 live 색, approved는 보조 글자색, declined는 위험 색을 씁니다.",
          en: "An 8px dot for the state: live colour while pending, secondary text colour when approved, danger when declined.",
        },
      },
      {
        name: "Status",
        slot: "status",
        description: {
          ko: "상태 줄입니다. 넘기지 않으면 Needs your yes, Approved, Declined가 상태에 맞춰 나옵니다.",
          en: "The status line. Without an override it reads Needs your yes, Approved or Declined to match the state.",
        },
      },
      {
        name: "Question",
        slot: "title",
        description: {
          ko: "승인을 구하는 질문입니다. label-lg로 카드의 가장 큰 글자입니다.",
          en: "The question being asked, the card's largest text at label-lg.",
        },
      },
      {
        name: "Attachment",
        slot: "attachment",
        description: {
          ko: "결정의 대상이 되는 항목 이름입니다. 클립 아이콘과 함께 5% 잉크 칩에 들어갑니다.",
          en: "The name of the item under decision, in a 5% ink chip with a paperclip icon.",
        },
      },
      {
        name: "Actions",
        slot: "Actions",
        description: {
          ko: "Later와 Approve 두 버튼입니다. pending이 아니면 접히고 inert가 되어 다시 답할 수 없습니다.",
          en: "The Later and Approve buttons. Outside pending they collapse and become inert, so the card cannot be answered twice.",
        },
      },
    ],
  },
  properties: [
    {
      id: "state",
      title: { ko: "state", en: "state" },
      description: {
        ko: "승인 요청의 생명주기입니다. 카드는 스스로 상태를 바꾸지 않으므로, 호출자가 동작이 끝난 뒤 이 값을 바꿉니다.",
        en: "The lifecycle of the request. The card never changes it itself; the caller sets it once the action finishes.",
      },
      values: [
        {
          name: "pending",
          description: {
            ko: "답을 기다리는 상태입니다. 브랜드 테두리와 두 버튼이 그대로 남습니다. 기본값입니다.",
            en: "Awaiting an answer: the brand border and both buttons stay in place. The default.",
          },
        },
        {
          name: "approved",
          description: {
            ko: "승인된 상태입니다. 테두리가 기본값으로 돌아가고 버튼이 접히며 점이 보조 글자색이 됩니다.",
            en: "Approved: the border returns to default, the buttons collapse and the dot turns secondary.",
          },
        },
        {
          name: "declined",
          description: {
            ko: "거절된 상태입니다. 점과 상태 글자가 위험 색으로 바뀌고 버튼이 접힙니다.",
            en: "Declined: the dot and status turn danger and the buttons collapse.",
          },
        },
      ],
      example: "states",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "카드의 재질입니다. glass는 유리 레이어를 한 겹 더 그리고, 그 위에서 Later 버튼도 glass 변형으로 바뀝니다.",
        en: "The card material. glass adds a glass layer and turns the secondary button into the glass variant too.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "표면 바탕에 기본 테두리를 씁니다. 본문 위에 놓는 기본 카드입니다.",
            en: "A surface fill with the default border, the default card on a page.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "glass-thick 바탕에 liquid 레이어를 깝니다. 이미지 위 대화에서 씁니다.",
            en: "A glass-thick fill with a liquid layer, for a conversation over imagery.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "상태 줄의 문구를 바꿉니다. 처리 시각처럼 상태에 덧붙일 값이 있을 때 넘깁니다.",
        en: "Replaces the status line, for when the state needs a value such as the time it was handled.",
      },
      example: "states",
    },
  ],
  guidelines: [
    {
      id: "caller-owns-state",
      title: { ko: "상태는 호출자가 바꿉니다", en: "The caller owns the state" },
      body: {
        ko: "카드는 버튼을 눌러도 스스로 pending을 벗어나지 않습니다. 승인이 실제로 처리된 뒤에 state를 바꿔야 화면과 서버가 어긋나지 않습니다.",
        en: "Pressing a button does not move the card out of pending. Change state after the approval actually goes through, or the screen and the server disagree.",
      },
      do: {
        ko: "요청이 성공한 뒤 approved로 바꾸고 처리 시각을 status에 적습니다.",
        en: "Set approved after the request succeeds and put the time in status.",
      },
      dont: {
        ko: "클릭 즉시 approved로 바꾸고 실패를 따로 알리지 않습니다.",
        en: "Do not flip to approved on click and leave a failure unreported.",
      },
      example: "interactive",
    },
    {
      id: "one-question",
      title: { ko: "카드 하나에 질문 하나", en: "One question per card" },
      body: {
        ko: "title은 예나 아니오로 답할 수 있는 한 문장으로 적습니다. 조건이 여러 개라면 승인 카드를 나누고, 되돌리기 어려운 실행은 질문에 그 결과를 적습니다.",
        en: "Write title as one sentence that a yes or no answers. Split several conditions into separate cards, and state the consequence when the action is hard to undo.",
      },
      example: "pending",
    },
    {
      id: "name-the-attachment",
      title: { ko: "결정의 대상을 이름으로 붙입니다", en: "Name the thing under decision" },
      body: {
        ko: "질문만으로 대상이 분명하지 않으면 attachment에 파일이나 항목 이름을 적습니다. 승인 직전에 무엇이 나가는지 확인할 수 있는 마지막 단서입니다.",
        en: "When the question alone does not identify the target, name the file or item in attachment. It is the last clue to what leaves on approval.",
      },
      example: "pending",
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 배경 위에서만", en: "Glass only over a backdrop" },
      body: {
        ko: "glass 카드는 이미지나 유리 패널 위 대화에서만 씁니다. 불투명한 본문 위에서는 유리 바탕과 테두리가 배경에 묻힙니다.",
        en: "Use a glass card only in a conversation over imagery or a glass panel. On an opaque page its fill and border sink into the background.",
      },
      example: "glass",
    },
  ],
  specification: [
    {
      id: "states",
      title: { ko: "상태별 값", en: "States" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "pending", slot: "Card", property: "border", value: "border-border-brand" },
        { state: "pending", slot: "Status dot", property: "background", value: "bg-status-live" },
        { state: "pending", slot: "Status", property: "text color", value: "text-text-brand" },
        { state: "approved", slot: "Status dot", property: "background", value: "bg-text-secondary" },
        { state: "approved", slot: "Status", property: "text color", value: "text-text-secondary" },
        { state: "declined", slot: "Status dot", property: "background", value: "bg-accent-red-500-90" },
        { state: "declined", slot: "Status", property: "text color", value: "text-text-danger" },
        { state: "pending · glass", slot: "Card", property: "rim", value: "[--glass-edge:var(--color-border-brand)]" },
        { state: "settled", slot: "Actions", property: "state", value: "inert" },
        { state: "settled", slot: "Actions", property: "motion", value: "motion-reveal data-collapsed" },
      ],
    },
    {
      id: "card",
      title: { ko: "카드와 내용", en: "Card and content" },
      rows: [
        { state: "all", slot: "Card", property: "width", value: "w-full max-w-90 md:w-90" },
        { state: "all", slot: "Card", property: "padding", value: "p-4" },
        { state: "all", slot: "Card", property: "radius", value: "rounded-xl" },
        { state: "all", slot: "Card", property: "layout", value: "flex flex-col items-start" },
        { state: "solid", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Card", property: "border", value: "border border-border-default" },
        { state: "glass", slot: "Card", property: "background", value: "bg-glass-thick" },
        { state: "all", slot: "Status", property: "font", value: "text-label-sm" },
        { state: "all", slot: "Status row", property: "gap", value: "gap-1.5" },
        { state: "all", slot: "Dot", property: "size", value: "size-2" },
        { state: "all", slot: "Question", property: "font", value: "text-label-lg" },
        { state: "all", slot: "Question", property: "margin top", value: "mt-3" },
        { state: "all", slot: "Attachment", property: "background", value: "bg-overlay-ink-5" },
        { state: "all", slot: "Attachment", property: "padding", value: "px-3 py-2" },
        { state: "all", slot: "Attachment", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Attachment", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Attachment icon", property: "size", value: "size-3.5" },
        { state: "all", slot: "Actions", property: "layout", value: "justify-end gap-2 pt-3" },
        { state: "all", slot: "Actions", property: "button size", value: "sm" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        { state: "status change", slot: "Status", property: "motion", value: "animate-fade-in" },
        { state: "settled", slot: "Actions", property: "collapse", value: "grid-template-rows 0fr" },
        { state: "settled", slot: "Actions", property: "duration", value: "200ms" },
        { state: "settled", slot: "Actions", property: "opacity duration", value: "150ms" },
        { state: "press", slot: "Button", property: "motion", value: "motion-press" },
      ],
    },
  ],
  examples: [
    {
      id: "pending",
      title: { ko: "대기 상태", en: "Pending" },
      description: {
        ko: "질문과 첨부 이름, 두 버튼이 있는 기본 카드입니다. 브랜드 테두리가 남아 있습니다.",
        en: "The default card with a question, an attachment name and two buttons, brand border intact.",
      },
    },
    {
      id: "states",
      title: { ko: "세 상태", en: "Three states" },
      description: {
        ko: "pending, approved, declined를 나란히 두었습니다. 결정이 끝난 카드는 버튼이 접힙니다.",
        en: "pending, approved and declined side by side. Settled cards fold their buttons away.",
      },
    },
    {
      id: "interactive",
      title: { ko: "직접 답하는 카드", en: "Answering the card" },
      description: {
        ko: "두 버튼이 상태를 바꾸는 카드입니다. 카드 자체는 상태를 바꾸지 않고 호출자가 처리합니다.",
        en: "A card whose buttons change its state. The card itself stays put; the caller decides.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 카드", en: "Glass card" },
      description: {
        ko: "이미지 위에서 glass 표면을 쓴 카드입니다. Later 버튼도 glass 변형으로 바뀝니다.",
        en: "A card in glass over imagery, with the secondary button switched to the glass variant.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "상태는 색과 함께 문구로도 나옵니다. 점의 색만으로 승인 여부를 알리지 않으므로 색을 구분하기 어려운 사용자도 결과를 읽습니다.",
        en: "The state is carried by the status text as well as colour, so a user who cannot separate the dots still reads the outcome.",
      },
      {
        ko: "결정이 끝나면 동작 영역이 접히고 inert가 되어 Tab 순서에서 빠집니다. 같은 요청에 두 번 답할 수 없습니다.",
        en: "Once settled, the action area collapses and becomes inert, dropping out of the Tab order, so a request cannot be answered twice.",
      },
      {
        ko: "두 버튼은 Button이므로 이름이 곧 동작입니다. approveLabel과 laterLabel을 바꿀 때도 무엇이 일어나는지 적습니다.",
        en: "Both buttons are Buttons, so their names are the actions. Keep that true when you change approveLabel and laterLabel.",
      },
      {
        ko: "상태가 바뀔 때 상태 줄만 160ms로 다시 나타나고 버튼 접힘은 200ms입니다. 동작 줄이기를 켜면 둘 다 즉시 끝납니다.",
        en: "On a state change only the status line fades back in over 160ms while the buttons fold over 200ms; both finish instantly with reduced motion on.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "Later와 Approve 사이를 이동합니다. 결정이 끝난 카드의 버튼은 건너뜁니다.", en: "Moves between Later and Approve; a settled card's buttons are skipped." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 있는 버튼을 누릅니다.", en: "Presses the focused button." },
      },
    ],
  },
};
