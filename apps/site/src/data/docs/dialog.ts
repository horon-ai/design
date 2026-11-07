/**
 * Reference doc for `Dialog`, written against
 * `packages/react/src/components/dialog.tsx` and
 * `packages/flutter/lib/src/components/dialog.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "dialog",
  anatomy: {
    description: {
      ko: "Dialog는 짧은 확인을 받는 대화상자입니다. 화면을 어둡게 덮고 420px 패널을 가운데에 띄우며, 제목과 설명, 동작 버튼만 담습니다.",
      en: "A Dialog asks for a short confirmation. It dims the screen, floats a 420px panel in the middle, and holds only a title, a description and the actions.",
    },
    parts: [
      {
        name: "Root",
        slot: "Dialog",
        description: {
          ko: "열림 상태를 들고 있는 뿌리입니다. 아무것도 그리지 않고 open과 onOpenChange로 제어하거나, 둘 다 넘기지 않고 defaultOpen으로 비제어로 둡니다.",
          en: "The root holding the open state. It renders nothing: control it with open and onOpenChange, or leave both out and start from defaultOpen.",
        },
      },
      {
        name: "Trigger",
        slot: "DialogTrigger",
        description: {
          ko: "대화상자를 여는 컨트롤입니다. render로 기존 버튼에 눌림 동작을 얹습니다.",
          en: "The control that opens the dialog. Use render to put the press behaviour on your own button.",
        },
      },
      {
        name: "Scrim",
        slot: "Backdrop",
        description: {
          ko: "화면을 32% 잉크로 덮고 6px 흐리는 배경층입니다. 등장과 퇴장은 fade로 처리합니다.",
          en: "The layer that covers the screen in 32% ink with a 6px blur. It fades in and out.",
        },
      },
      {
        name: "Panel",
        slot: "DialogContent",
        description: {
          ko: "내용을 담는 420px 패널입니다. 뷰포트 높이를 넘으면 패널 안에서 스크롤합니다.",
          en: "The 420px panel holding the content. Past the viewport height it scrolls inside.",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "패널 제목입니다. 대화상자의 이름이 되어 보조 기기가 읽습니다.",
          en: "The panel heading. It names the dialog for assistive tech.",
        },
      },
      {
        name: "Description",
        slot: "description",
        description: {
          ko: "제목 아래 보조 문단입니다. 무엇이 바뀌는지 한두 문장으로 적습니다.",
          en: "The secondary paragraph under the title, one or two sentences on what changes.",
        },
      },
      {
        name: "Close",
        slot: "closeLabel",
        description: {
          ko: "오른쪽 위의 32px 닫기 버튼입니다. 접근 가능한 이름은 closeLabel이 정하고, null을 넘기면 버튼이 사라집니다.",
          en: "The 32px close button at the top right. closeLabel names it, and null removes it.",
        },
      },
      {
        name: "Footer",
        slot: "DialogFooter",
        description: {
          ko: "동작을 오른쪽 끝에 모으는 줄입니다. 보조 동작을 먼저, 주 동작을 마지막에 둡니다.",
          en: "The row that gathers the actions at the right edge: secondary first, primary last.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "패널의 재질입니다. 두 값 모두 모서리 20px과 24px 안쪽 여백을 씁니다.",
        en: "The panel material. Both values use a 20px radius and 24px padding.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 기본 표면에 0 24 64 그림자를 얹습니다. 기본값이고 확인 대화상자에 맞습니다.",
            en: "The opaque default fill with a 0 24 64 shadow. The default, and what confirmation dialogs use.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil 재질의 유리 패널입니다. 뒤에 보이는 내용 위에 대화상자를 겹칠 때 씁니다.",
            en: "The veil material, for a dialog layered over content that shows through.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "closeLabel",
      title: { ko: "closeLabel", en: "closeLabel" },
      description: {
        ko: "닫기 버튼의 접근 가능한 이름입니다. 기본값은 Close이고, null을 넘기면 버튼을 아예 그리지 않아 아래 동작으로만 닫게 됩니다.",
        en: "The accessible name of the close button. It defaults to Close; passing null drops the button so the actions below are the only way out.",
      },
      example: "actions",
    },
    {
      id: "description",
      title: { ko: "description", en: "description" },
      description: {
        ko: "제목 아래 둘째 문단입니다. 대화상자가 어떤 결과를 만드는지 한두 문장으로 적고, 목록이나 폼이 필요하면 Modal을 씁니다.",
        en: "The second paragraph under the title. Keep it to one or two sentences on what the dialog causes; for a list or a form use Modal.",
      },
      example: "destructive",
    },
    {
      id: "leading",
      title: { ko: "leading", en: "leading" },
      description: {
        ko: "제목 앞에 놓는 타일이나 아이콘입니다. 넘기면 제목과의 간격이 14px로 벌어지고, 없으면 8px입니다.",
        en: "A tile or icon set before the title. With it the gap to the title is 14px, without it 8px.",
      },
      example: "leading",
    },
  ],
  guidelines: [
    {
      id: "short-confirmation",
      title: { ko: "짧은 확인에만", en: "Short confirmations only" },
      body: {
        ko: "Dialog는 예나 아니오로 끝나는 확인을 받을 때 씁니다. 입력 필드나 긴 내용이 필요하면 Modal을 쓰고, 둘을 한 화면에 겹쳐 열지 않습니다.",
        en: "A Dialog is for a confirmation that ends in yes or no. When the work needs fields or a long read use Modal, and never open the two over each other.",
      },
      do: {
        ko: "봇 삭제를 확인받을 때 Dialog를 씁니다.",
        en: "Use a Dialog to confirm deleting a bot.",
      },
      dont: {
        ko: "설정 폼을 Dialog 안에 넣지 않습니다.",
        en: "Do not put a settings form inside a Dialog.",
      },
      example: "destructive",
    },
    {
      id: "title-is-the-question",
      title: { ko: "제목이 곧 질문입니다", en: "The title is the question" },
      body: {
        ko: "제목은 대화상자의 이름이자 질문입니다. Delete Inbox Manager?처럼 무엇을 하려는지 묻고, description에는 지워지는 것과 남는 것을 적습니다.",
        en: "The title both names the dialog and asks the question, as in Delete Inbox Manager?, and the description says what is removed and what stays.",
      },
      do: {
        ko: "제목을 질문으로, 설명에 결과를 적습니다.",
        en: "Ask in the title and state the result in the description.",
      },
      dont: {
        ko: "제목을 Confirm처럼 무엇을 확인하는지 모를 단어로 두지 않습니다.",
        en: "Do not title it Confirm, which says nothing about what is being confirmed.",
      },
      example: "destructive",
    },
    {
      id: "actions-order",
      title: { ko: "동작은 오른쪽에 순서대로", en: "Actions in order at the right" },
      body: {
        ko: "DialogFooter에 보조 동작을 먼저, 주 동작을 마지막에 둡니다. 파괴적인 확인이면 주 동작을 danger로 두고, 취소는 solid로 남겨 두어 잘못 누를 위험을 줄입니다.",
        en: "Put the secondary action first and the primary last in DialogFooter. For a destructive confirmation make the primary danger and leave Cancel solid, so a mispress is cheap.",
      },
      do: {
        ko: "Cancel 다음에 Delete bot을 danger로 둡니다.",
        en: "Put Cancel first and Delete bot as danger after it.",
      },
      dont: {
        ko: "danger를 왼쪽에 두어 습관적인 첫 버튼이 되게 하지 않습니다.",
        en: "Do not put danger on the left where it becomes the habitual first press.",
      },
      example: "actions",
    },
    {
      id: "glass-over-content",
      title: { ko: "glass는 내용 위에", en: "Glass over content" },
      body: {
        ko: "glass 패널은 뒤가 비치는 면을 전제로 합니다. 뒤에 아무것도 없는 화면에서는 veil 바탕이 회색으로만 보이므로 solid를 씁니다.",
        en: "The glass panel assumes a surface behind it. On a screen with nothing behind, the veil reads as flat gray, so use solid.",
      },
      example: "surfaces",
    },
  ],
  specification: [
    {
      id: "panel",
      title: { ko: "패널", en: "Panel" },
      note: {
        ko: "패널은 420px에서 멈추고, 뷰포트 좌우 16px 여백이 그보다 좁은 화면에서 폭을 줄입니다.",
        en: "The panel stops at 420px; the viewport's 16px gutters shrink it on narrower screens.",
      },
      rows: [
        { state: "any", slot: "Panel", property: "width", value: "max-w-105" },
        { state: "any", slot: "Panel", property: "radius", value: "rounded-xl" },
        { state: "any", slot: "Panel", property: "padding", value: "p-6" },
        { state: "any", slot: "Panel", property: "gap", value: "gap-4" },
        { state: "any", slot: "Panel", property: "max height", value: "max-h-[calc(100dvh-2rem)]" },
        { state: "solid", slot: "Panel", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Panel", property: "shadow", value: "shadow-[0_24px_64px_#0A142433]" },
        { state: "glass", slot: "Panel", property: "background", value: "veil-overlay" },
        { state: "any", slot: "Panel", property: "motion", value: "motion-popup duration-240" },
        { state: "entering", slot: "Panel", property: "translate", value: "data-starting-style:translate-y-2" },
        { state: "any", slot: "Scrim", property: "background", value: "bg-bg-scrim/32" },
        { state: "any", slot: "Scrim", property: "blur", value: "backdrop-blur-[6px]" },
        { state: "any", slot: "Scrim", property: "motion", value: "motion-fade" },
      ],
    },
    {
      id: "content",
      title: { ko: "내용", en: "Content" },
      rows: [
        { state: "any", slot: "Title", property: "font", value: "text-title-md" },
        { state: "any", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "any", slot: "Description", property: "font", value: "text-body-md" },
        { state: "any", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "any", slot: "Header row", property: "gap", value: "gap-2" },
        { state: "leading", slot: "Header row", property: "gap", value: "gap-3.5" },
        { state: "any", slot: "Close", property: "size", value: "size-8" },
        { state: "any", slot: "Close", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Close", property: "background", value: "bg-overlay-ink-6" },
        { state: "any", slot: "Close icon", property: "size", value: "size-4" },
        { state: "any", slot: "Footer", property: "gap", value: "gap-2" },
        { state: "any", slot: "Footer", property: "align", value: "justify-end" },
      ],
    },
  ],
  examples: [
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "solid 패널과 glass 패널을 여는 트리거입니다. 대화상자는 닫힌 채로 두고 트리거만 보여 줍니다.",
        en: "Triggers for the solid and glass panels. The dialogs stay closed so only the triggers show.",
      },
    },
    {
      id: "destructive",
      title: { ko: "파괴적 확인", en: "Destructive confirmation" },
      description: {
        ko: "봇 삭제를 확인받는 트리거입니다. 제목이 질문이고 설명이 지워지는 것과 남는 것을 알려 줍니다.",
        en: "A trigger for confirming a bot deletion, with the question as the title and the description saying what goes and what stays.",
      },
    },
    {
      id: "actions",
      title: { ko: "동작 줄과 닫기 버튼", en: "Actions and the close button" },
      description: {
        ko: "Cancel과 저장 버튼을 둔 확인과, closeLabel을 null로 두어 닫기 버튼 없이 동작으로만 닫는 확인입니다.",
        en: "One confirmation with Cancel and Save, and one with closeLabel set to null so only its actions close it.",
      },
    },
    {
      id: "leading",
      title: { ko: "앞 아이콘", en: "Leading icon" },
      description: {
        ko: "제목 앞에 타일을 둔 대화상자 트리거입니다. 타일이 있으면 제목과의 간격이 넓어집니다.",
        en: "A dialog trigger with a tile before the title; the tile widens the gap to it.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Dialog (Modal) Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
    notes: [
      {
        ko: "title이 패널의 제목이 되어 대화상자의 이름이 됩니다. 제목 없는 대화상자는 무엇을 확인하는지 읽히지 않으므로 title은 항상 넘깁니다.",
        en: "title becomes the panel's heading and names the dialog. A dialog with no title says nothing about what it asks, so always pass title.",
      },
      {
        ko: "Base UI가 포커스 트랩과 Esc 닫기, 배경 스크롤 잠금을 맡고, 닫을 때 포커스를 트리거로 돌려 놓습니다. 이 동작을 직접 구현하지 않습니다.",
        en: "Base UI owns the focus trap, Escape to close and the scroll lock, and returns focus to the trigger on close. Do not reimplement these.",
      },
      {
        ko: "닫기 버튼과 배경 누르기가 모두 닫기이므로, 확인 동작은 반드시 안쪽 버튼으로 한 번 더 받습니다. 바깥을 눌렀다고 확인이 실행되게 만들지 않습니다.",
        en: "The close button and a press on the backdrop both close, so the confirming action always needs its own button inside. Never let a press outside count as confirmation.",
      },
      {
        ko: "패널은 motion-popup으로 나타나 8px 아래에서 올라옵니다. 동작 줄이기를 켜면 이동 없이 즉시 나타납니다.",
        en: "The panel appears with motion-popup, rising 8px into place. With reduced motion it appears without the travel.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "대화상자 안에서만 포커스를 옮깁니다. 마지막 컨트롤 다음에는 첫 컨트롤로 돌아옵니다.",
          en: "Moves focus inside the dialog only, returning to the first control after the last.",
        },
      },
      {
        keys: ["Escape"],
        action: {
          ko: "대화상자를 닫고 포커스를 트리거로 돌려놓습니다.",
          en: "Closes the dialog and returns focus to the trigger.",
        },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스한 버튼을 실행합니다.", en: "Runs the focused button." },
      },
    ],
  },
};
