/**
 * Reference doc for `Plan Card`, written against
 * `packages/react/src/components/plan-card.tsx` and
 * `packages/flutter/lib/src/components/plan_card.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "plan-card",
  anatomy: {
    description: {
      ko: "Plan Card는 계획 단계를 감싸는 카드입니다. 위쪽에 계획 이름과 단계 수, 그 아래에 Plan Step 줄들, 마지막에 상태 바닥글이 놓입니다. 바닥글은 status를 넘길 때만 펼쳐집니다.",
      en: "Plan Card wraps the steps of a plan: a label and step count at the top, the Plan Step rows below, and a status footer at the end that opens only when status is passed.",
    },
    parts: [
      {
        name: "Card",
        slot: "PlanCard",
        description: {
          ko: "20px 라운드의 surface 카드입니다. 안쪽 여백과 구분선을 직접 그려 단계와 바닥글을 나눕니다.",
          en: "A 20px-radius surface card that draws its own padding and dividers around the steps and the footer.",
        },
      },
      {
        name: "Label row",
        slot: "label",
        description: {
          ko: "16px 목록 아이콘과 caption 문구를 한 줄로 놓습니다. 보통 \"Plan · 5 steps\"처럼 계획의 성격과 길이를 적습니다.",
          en: "A 16px list icon with a caption line, usually naming the plan and its length, such as \"Plan · 5 steps\".",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "카드의 h3 제목입니다. label-lg 굵은 글씨로 그리고 좁아지면 여러 줄로 접힙니다.",
          en: "The card's h3 heading, in semibold label-lg, wrapping onto several lines when narrow.",
        },
      },
      {
        name: "Steps",
        slot: "children",
        description: {
          ko: "Plan Step 줄들입니다. 카드가 좌우 여백을 주므로 단계는 레일만 그리면 됩니다.",
          en: "The Plan Step rows. The card supplies the side padding, so each step only draws its rail.",
        },
      },
      {
        name: "Footer",
        slot: "status · statusLabel",
        description: {
          ko: "구분선 아래의 상태 줄입니다. running이면 스피너와 primary 문구, failed면 경고 아이콘과 danger 문구가 놓이고, 오른쪽에 시간이 붙을 수 있습니다.",
          en: "The status row under a divider: a spinner with primary text while running, a warning icon with danger text when failed, and an optional time at the right.",
        },
      },
    ],
  },
  properties: [
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "바닥글의 상태입니다. 한 번에 하나만 쓸 수 있고, 값을 넘기는 순간 바닥글이 펼쳐지며, 비우면 접힙니다.",
        en: "The footer's state. Only one applies at a time; passing it opens the footer and clearing it collapses the footer.",
      },
      values: [
        {
          name: "running",
          description: {
            ko: "14px 스피너와 함께 바닥글 문구를 primary 색으로 둡니다. 아직 도는 계획에 씁니다.",
            en: "A 14px spinner with the footer text in primary color, for a plan still in progress.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "경고 아이콘과 함께 문구를 danger 색으로 바꿉니다. 어느 단계에서 멈췄는지 함께 적습니다.",
            en: "A warning icon turns the text danger. Say which step stopped it.",
          },
        },
      ],
      example: "failed",
    },
    {
      id: "statusLabel",
      title: { ko: "statusLabel", en: "statusLabel" },
      description: {
        ko: "바닥글 문구입니다. 지금 어디까지 갔는지 또는 어디서 멈췄는지를 한 문장으로 적고, 단계 수를 함께 적으면 카드 안을 다시 세지 않아도 됩니다.",
        en: "The footer text: where the plan got to, or where it stopped. Including the step count saves recounting the rows above.",
      },
      example: "running",
    },
    {
      id: "elapsed",
      title: { ko: "elapsed", en: "elapsed" },
      description: {
        ko: "바닥글 오른쪽의 시간입니다. 도는 중에는 경과 시간을, 멈춘 뒤에는 멈춘 시점을 caption으로 붙입니다.",
        en: "The time at the right of the footer: elapsed while running, or the moment it stopped once it has.",
      },
      example: "running",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "제목 위의 caption 줄입니다. 목록 아이콘이 앞에 붙고, 비우면 이 줄이 통째로 빠집니다.",
        en: "The caption line above the title, preceded by a list icon. Leaving it out drops the whole row.",
      },
      example: "no-footer",
    },
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "계획의 이름입니다. h3으로 렌더링되므로 화면의 제목 단계에 그대로 참여하고, 카드마다 하나씩 둡니다.",
        en: "The plan's name. It renders as an h3 and joins the page's heading order, so keep one per card.",
      },
      example: "running",
    },
  ],
  guidelines: [
    {
      id: "footer-mirrors-the-steps",
      title: { ko: "바닥글은 단계와 같은 말을 합니다", en: "The footer agrees with the steps" },
      body: {
        ko: "statusLabel은 카드 안 단계들의 요약입니다. 실패한 단계가 있는데 바닥글이 Running이면 사람은 어느 쪽을 믿어야 할지 모릅니다. 단계 상태가 바뀔 때 같은 값으로 바닥글도 바꿉니다.",
        en: "statusLabel summarizes the steps inside the card. A failed step under a Running footer leaves no way to know which to trust, so move the footer with the step state.",
      },
      do: {
        ko: "실패한 단계가 있으면 status를 failed로, 문구를 \"Stopped · step 4 failed\"로 맞춥니다.",
        en: "With a failed step, set status to failed and the text to \"Stopped · step 4 failed\".",
      },
      dont: {
        ko: "실패한 단계를 둔 채 바닥글을 Running으로 남기지 않습니다.",
        en: "Do not leave a Running footer over a failed step.",
      },
      example: "failed",
    },
    {
      id: "footer-only-when-there-is-state",
      title: { ko: "보여 줄 상태가 없으면 바닥글을 비웁니다", en: "No state, no footer" },
      body: {
        ko: "status를 넘기지 않으면 바닥글이 접힌 채로 남습니다. 아직 시작하지 않았거나 상태를 보여 줄 필요가 없는 계획에는 넘기지 말고, 빈 문구로 자리만 채우지 않습니다.",
        en: "Without status the footer stays collapsed. Leave it out for a plan that has not started or needs no state, and do not pass an empty label to fill space.",
      },
      do: {
        ko: "단계만 보여 주는 계획은 status와 statusLabel을 비웁니다.",
        en: "Show only steps and pass neither status nor statusLabel.",
      },
      dont: {
        ko: "statusLabel에 빈 문자열을 넣어 빈 줄을 만들지 않습니다.",
        en: "Do not pass an empty statusLabel and leave a blank row.",
      },
      example: "no-footer",
    },
    {
      id: "one-plan-per-card",
      title: { ko: "카드 하나에 계획 하나", en: "One plan per card" },
      body: {
        ko: "카드는 계획 하나의 이름, 단계, 상태를 담는 단위입니다. 한 카드에 계획을 둘 넣으면 제목과 바닥글이 어느 계획을 말하는지 알 수 없습니다. 계획이 둘이면 카드도 둘로 나눕니다.",
        en: "A card is the unit for one plan's name, steps and state. Two plans in one card leave the title and footer ambiguous, so split them into two cards.",
      },
      do: {
        ko: "\"Reply to the investor thread\"와 \"Prepare the board update\"를 각각의 카드로 나눕니다.",
        en: "Split \"Reply to the investor thread\" and \"Prepare the board update\" into separate cards.",
      },
      dont: {
        ko: "한 카드 안에 서로 다른 계획의 단계를 이어 붙이지 않습니다.",
        en: "Do not chain steps from different plans inside one card.",
      },
      example: "running",
    },
    {
      id: "card-owns-the-spacing",
      title: { ko: "여백은 카드가 맡습니다", en: "The card owns the spacing" },
      body: {
        ko: "카드가 좌우 24px 여백과 단계 사이 간격을 정합니다. 단계에 따로 여백을 주면 카드마다 들여쓰기가 어긋나므로, Plan Step에는 className을 넘기지 않는 것이 기본입니다.",
        en: "The card sets the 24px side padding and the rhythm between steps. Adding margins on the steps makes indentation drift between cards, so Plan Step usually needs no className.",
      },
      do: {
        ko: "Plan Step을 그대로 넣고 마지막 단계에만 last를 넘깁니다.",
        en: "Drop Plan Steps in as they are and pass last on the final one only.",
      },
      dont: {
        ko: "각 단계에 좌우 여백을 직접 주지 않습니다.",
        en: "Do not add side margins to each step.",
      },
      example: "no-footer",
    },
  ],
  specification: [
    {
      id: "card-frame",
      title: { ko: "카드 틀", en: "Card frame" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "PlanCard", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "PlanCard", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "PlanCard", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Header", property: "padding", value: "px-6 pt-5 pb-3.5" },
        { state: "default", slot: "Header", property: "gap", value: "8px" },
        { state: "default", slot: "Label row", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Label row", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Label icon", property: "size", value: "16px" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg font-semibold" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Steps", property: "padding", value: "px-6 pt-1.5 pb-1" },
      ],
    },
    {
      id: "footer",
      title: { ko: "상태 바닥글", en: "Status footer" },
      rows: [
        { state: "open", slot: "Divider", property: "background", value: "1px bg-overlay-ink-8" },
        { state: "running, failed", slot: "Footer", property: "padding", value: "px-6 pt-3.5 pb-4" },
        { state: "running, failed", slot: "Footer", property: "gap", value: "8px" },
        { state: "running, failed", slot: "Footer", property: "font", value: "text-label-md" },
        { state: "running", slot: "Footer", property: "text color", value: "text-text-primary" },
        { state: "failed", slot: "Footer", property: "text color", value: "text-text-danger" },
        { state: "running", slot: "Footer", property: "icon", value: "Spinner 14px" },
        { state: "failed", slot: "Footer", property: "icon", value: "WarningCircle 16px" },
        {
          state: "status change",
          slot: "Footer text",
          property: "motion",
          value: "animate-fade-in",
          note: {
            ko: "status가 바뀔 때만 160ms로 다시 나타나고, 위의 label 줄은 움직이지 않습니다.",
            en: "Only the footer text re-enters, over 160ms, when status changes; the label row above does not animate.",
          },
        },
        {
          state: "open, closed",
          slot: "Footer panel",
          property: "motion",
          value: "motion-collapse",
          note: {
            ko: "패널이 DOM에 남아 있어 status를 비워도 사라지지 않고 접히기만 합니다.",
            en: "The panel stays mounted, so clearing status collapses it instead of unmounting it.",
          },
        },
        { state: "default", slot: "Elapsed", property: "font", value: "text-caption" },
        { state: "default", slot: "Elapsed", property: "text color", value: "text-text-secondary" },
      ],
    },
  ],
  examples: [
    {
      id: "running",
      title: { ko: "진행 중인 계획", en: "Plan in progress" },
      description: {
        ko: "다섯 단계 중 셋을 지나 도는 계획입니다. 바닥글에 스피너와 \"Running · 4 of 5\", 오른쪽에 경과 시간이 붙습니다.",
        en: "A five-step plan past its third step: a spinner and \"Running · 4 of 5\" in the footer, with elapsed time at the right.",
      },
    },
    {
      id: "failed",
      title: { ko: "멈춘 계획", en: "Stopped plan" },
      description: {
        ko: "둘째 단계가 실패해 바닥글이 danger가 되고, 그 단계에 오류와 재시도가 붙었습니다. 재시도를 누르면 계획이 다시 running으로 돌아갑니다.",
        en: "A failed second step turns the footer danger and adds an error and retry on that step. Pressing retry puts the plan back to running.",
      },
    },
    {
      id: "no-footer",
      title: { ko: "바닥글 없는 계획", en: "Plan without a footer" },
      description: {
        ko: "status를 넘기지 않은 카드입니다. 바닥글이 접혀 제목과 단계만 남습니다.",
        en: "A card with no status: the footer stays collapsed and only the title and steps remain.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "계획 이름은 h3으로 렌더링됩니다. 화면의 제목 순서를 건너뛰지 않도록 앞에 h2가 있게 두고, 카드마다 하나의 h3만 씁니다.",
        en: "The plan name renders as an h3. Keep an h2 above it so the heading order does not skip, and use a single h3 per card.",
      },
      {
        ko: "바닥글은 라이브 영역이 아닙니다. 상태가 바뀌어도 화면 낭독기는 알리지 않으므로, 진행을 읽어 줘야 하면 단계 쪽 오류 문장이나 바깥 라이브 영역으로 같은 사실을 전합니다.",
        en: "The footer is not a live region, so a status change is not announced. When progress must be spoken, carry the same fact in the step's error or in a live region outside the card.",
      },
      {
        ko: "failed 바닥글은 아이콘과 문구가 함께 danger가 됩니다. 문구에 상태를 말로 적어 두면 색을 구별하지 못해도 읽힙니다.",
        en: "A failed footer turns both icon and text danger. Because the text states the state in words, it reads without color.",
      },
      {
        ko: "동작 줄이기를 켜면 바닥글 접기와 펴기, 문구 페이드가 즉시 끝납니다.",
        en: "Under reduced motion the footer collapse and the text fade finish instantly.",
      },
    ],
    keyboard: [
      { keys: ["Tab"], action: { ko: "카드 안의 재시도 버튼으로 이동합니다.", en: "Moves to the retry button inside the card." } },
      { keys: ["Enter"], action: { ko: "재시도를 실행합니다.", en: "Runs the retry." } },
      { keys: ["Space"], action: { ko: "재시도를 실행합니다.", en: "Runs the retry." } },
    ],
  },
};
