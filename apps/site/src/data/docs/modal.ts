/**
 * Reference doc for `Modal`, written against
 * `packages/react/src/components/modal.tsx` and
 * `packages/flutter/lib/src/components/modal.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "modal",
  anatomy: {
    description: {
      ko: "Modal은 폼이나 긴 내용을 담는 창입니다. 머리말과 본문, 동작 줄 세 부분이 고정이고, 창이 화면 높이에 닿으면 본문만 스크롤합니다.",
      en: "A Modal is a window for a form or a long read. Header, body and action row are fixed parts, and once the window reaches the screen height only the body scrolls.",
    },
    parts: [
      {
        name: "Root",
        slot: "Modal",
        description: {
          ko: "열림 상태를 들고 있는 뿌리입니다. open과 onOpenChange로 제어하거나 defaultOpen으로 비제어로 둡니다.",
          en: "The root holding the open state. Control it with open and onOpenChange, or start from defaultOpen uncontrolled.",
        },
      },
      {
        name: "Trigger",
        slot: "ModalTrigger",
        description: {
          ko: "창을 여는 컨트롤입니다. Base UI가 aria-controls와 펼침 상태를 붙이고, render로 기존 버튼을 트리거로 씁니다.",
          en: "The control that opens the window. Base UI adds aria-controls and the expanded state; use render to make an existing button the trigger.",
        },
      },
      {
        name: "Scrim",
        slot: "Backdrop",
        description: {
          ko: "화면을 32% 잉크로 덮고 6px 흐리는 배경층입니다. 창이 어디에 놓이든 이 층이 뒤를 가립니다.",
          en: "The layer covering the screen in 32% ink with a 6px blur. It masks the page wherever the window lands.",
        },
      },
      {
        name: "Window",
        slot: "ModalContent",
        description: {
          ko: "머리말, 본문, 동작 줄을 세로로 쌓는 창입니다. size가 너비를 정하고 높이는 화면 높이에서 32px을 뺀 값까지 늘어납니다.",
          en: "The window stacking header, body and actions in a column. size sets the width and the height grows to the screen minus 32px.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "제목, 설명, 닫기 버튼을 담는 머리말입니다. 스크롤하지 않고 제자리에 남습니다.",
          en: "The header holding the title, description and close button. It stays put while the body scrolls.",
        },
      },
      {
        name: "Body",
        slot: "children",
        description: {
          ko: "폼이나 긴 내용이 들어가는 본문입니다. 창이 화면 높이에 닿으면 이 영역만 스크롤합니다.",
          en: "The body the form or long content goes in. Once the window reaches the screen height only this region scrolls.",
        },
      },
      {
        name: "Footer",
        slot: "footer",
        description: {
          ko: "동작을 오른쪽에 모으는 줄입니다. ModalFooter를 넘겨 본문 아래에 고정합니다.",
          en: "The row gathering the actions at the right. Pass a ModalFooter to keep it fixed under the body.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "창의 너비 단계입니다. 화면이 좁으면 뷰포트 여백 16px만큼 줄어들어 화면보다 넓어지지 않습니다.",
        en: "The window's width step. On a narrow screen it shrinks to the viewport's 16px gutters so it never exceeds the screen.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "400px 창입니다. 항목이 두세 개인 짧은 폼에 맞습니다.",
            en: "A 400px window, for a short form of two or three fields.",
          },
        },
        {
          name: "md",
          description: {
            ko: "560px 창입니다. 기본값이고 읽기 좋은 폭입니다.",
            en: "A 560px window. The default and a comfortable reading width.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "720px 창입니다. 넓은 편집기나 표에 맞습니다.",
            en: "A 720px window, for a wide editor or a table.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "창의 재질입니다. 두 값 모두 모서리 20px과 24px 안쪽 여백을 씁니다.",
        en: "The window material. Both values use a 20px radius and 24px padding.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 기본 표면에 0 24 64 그림자를 얹습니다. 기본값이고 폼 창에 맞습니다.",
            en: "The opaque default fill with a 0 24 64 shadow. The default, and what forms use.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil 재질의 유리 창입니다. 뒤에 보이는 내용 위에 창을 겹칠 때 씁니다.",
            en: "The veil material, for a window layered over content that shows through.",
          },
        },
      ],
      example: "form",
    },
    {
      id: "footer",
      title: { ko: "footer", en: "footer" },
      description: {
        ko: "본문 아래에 고정되는 동작 줄입니다. 넘기지 않으면 본문이 아래 여백까지 쓰고, 넘기면 본문 아래 여백이 8px로 줄어 동작 줄과 붙습니다.",
        en: "The action row fixed under the body. Without it the body takes the bottom padding; with it that padding shrinks to 8px so the row sits flush.",
      },
      example: "form",
    },
    {
      id: "closeLabel",
      title: { ko: "closeLabel", en: "closeLabel" },
      description: {
        ko: "닫기 버튼의 접근 가능한 이름입니다. 기본값은 Close이고, null을 넘기면 버튼이 사라져 동작 줄로만 닫게 됩니다.",
        en: "The accessible name of the close button. It defaults to Close; null removes the button so the action row is the only way out.",
      },
      example: "sizes",
    },
  ],
  guidelines: [
    {
      id: "work-not-confirmation",
      title: { ko: "폼과 긴 내용에", en: "For work, not a yes or no" },
      body: {
        ko: "Modal은 입력을 받거나 읽을 것이 많을 때 씁니다. 예나 아니오로 끝나는 짧은 확인은 Dialog가 맞고, 둘을 같은 화면에 겹쳐 열지 않습니다.",
        en: "Use a Modal when there are fields to fill or a lot to read. A short yes-or-no confirmation belongs in a Dialog, and the two are never stacked.",
      },
      do: {
        ko: "봇 이름과 지시문을 고치는 창에 Modal을 씁니다.",
        en: "Use a Modal to edit a bot's name and instructions.",
      },
      dont: {
        ko: "삭제 확인 하나에 Modal을 쓰지 않습니다.",
        en: "Do not spend a Modal on a single delete confirmation.",
      },
      example: "form",
    },
    {
      id: "size-by-content",
      title: { ko: "내용에 맞는 너비", en: "Width follows the content" },
      body: {
        ko: "size는 내용의 성격으로 고릅니다. 짧은 폼은 sm, 일반 편집은 md, 표나 긴 문서는 lg를 씁니다. 창이 화면보다 넓어질 수는 없으므로 lg도 좁은 화면에서는 여백만 남습니다.",
        en: "Pick size by what the window holds: sm for a short form, md for ordinary editing, lg for a table or a long document. A window cannot exceed the screen, so lg on a phone is just the gutters.",
      },
      example: "sizes",
    },
    {
      id: "body-scrolls",
      title: { ko: "스크롤은 본문만", en: "Only the body scrolls" },
      body: {
        ko: "머리말과 동작 줄은 고정이고 본문만 스크롤합니다. 그래서 긴 내용을 넣어도 제목과 저장 버튼은 항상 같은 자리에 있습니다. 본문 길이를 미리 제한하지 말고 그대로 넘깁니다.",
        en: "Header and actions stay fixed and only the body scrolls, so the title and the save button keep their places however long the content is. Pass the content at full length rather than trimming it.",
      },
      example: "sizes",
    },
    {
      id: "actions-right",
      title: { ko: "동작은 오른쪽에", en: "Actions on the right" },
      body: {
        ko: "ModalFooter에 보조 동작을 먼저, 주 동작을 마지막에 둡니다. 주 동작이 위험한 변경이면 danger로 두고, 취소는 solid로 남깁니다.",
        en: "In ModalFooter put the secondary action first and the primary last. When the primary makes a dangerous change make it danger and leave Cancel solid.",
      },
      do: {
        ko: "Cancel 다음에 Save changes를 둡니다.",
        en: "Put Cancel first and Save changes after it.",
      },
      dont: {
        ko: "동작을 왼쪽에 흩어 놓지 않습니다.",
        en: "Do not scatter the actions across the left side.",
      },
      example: "form",
    },
  ],
  specification: [
    {
      id: "window",
      title: { ko: "창", en: "Window" },
      note: {
        ko: "창은 화면 높이에서 32px을 뺀 값까지만 커지고, 그 안에서 본문이 스크롤합니다.",
        en: "The window grows to the screen height minus 32px at most, and the body scrolls inside that.",
      },
      rows: [
        { state: "sm", slot: "Window", property: "width", value: "max-w-100" },
        { state: "md", slot: "Window", property: "width", value: "max-w-140" },
        { state: "lg", slot: "Window", property: "width", value: "max-w-180" },
        { state: "any", slot: "Window", property: "radius", value: "rounded-xl" },
        { state: "any", slot: "Window", property: "max height", value: "max-h-[calc(100dvh-2rem)]" },
        { state: "solid", slot: "Window", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Window", property: "shadow", value: "shadow-[0_24px_64px_#0A142433]" },
        { state: "glass", slot: "Window", property: "background", value: "veil-overlay" },
        { state: "any", slot: "Window", property: "motion", value: "motion-popup duration-240" },
        { state: "entering", slot: "Window", property: "translate", value: "data-starting-style:translate-y-2" },
        { state: "any", slot: "Scrim", property: "background", value: "bg-bg-scrim/32" },
        { state: "any", slot: "Scrim", property: "blur", value: "backdrop-blur-[6px]" },
      ],
    },
    {
      id: "parts",
      title: { ko: "세 부분", en: "The three parts" },
      rows: [
        { state: "any", slot: "Header", property: "padding", value: "px-6 pt-6 pb-4" },
        { state: "any", slot: "Header", property: "gap", value: "gap-2" },
        { state: "leading", slot: "Header", property: "gap", value: "gap-3.5" },
        { state: "any", slot: "Title", property: "font", value: "text-title-md" },
        { state: "any", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "any", slot: "Description", property: "font", value: "text-body-md" },
        { state: "any", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "any", slot: "Close", property: "size", value: "size-8" },
        { state: "hover", slot: "Close", property: "background", value: "bg-overlay-ink-6" },
        { state: "any", slot: "Body", property: "padding", value: "px-6 pb-6" },
        { state: "with footer", slot: "Body", property: "padding", value: "px-6 pb-2" },
        { state: "any", slot: "Body", property: "font", value: "text-body-md" },
        { state: "any", slot: "Body", property: "overflow", value: "overflow-y-auto overscroll-contain" },
        { state: "any", slot: "Footer", property: "padding", value: "px-6 pt-4 pb-6" },
        { state: "any", slot: "Footer", property: "gap", value: "gap-2" },
        { state: "any", slot: "Footer", property: "align", value: "justify-end" },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "너비", en: "Widths" },
      description: {
        ko: "sm, md, lg 창을 여는 트리거입니다. 창은 닫힌 채로 두고 트리거만 보여 줍니다.",
        en: "Triggers for the sm, md and lg windows. The windows stay closed so only the triggers show.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "solid 창과 glass 창을 여는 트리거를 나란히 두었습니다. glass는 뒤에 내용이 있을 때 재질이 읽힙니다.",
        en: "Triggers for a solid window and a glass one. The glass reads only where content sits behind it.",
      },
    },
    {
      id: "form",
      title: { ko: "폼 창", en: "Form window" },
      description: {
        ko: "이름과 지시문을 고치는 창의 트리거입니다. 동작 줄이 본문 아래에 고정됩니다.",
        en: "A trigger for editing a name and instructions, with the action row fixed under the body.",
      },
    },
    {
      id: "long-body",
      title: { ko: "긴 본문", en: "Long body" },
      description: {
        ko: "본문이 창보다 길어 스크롤이 생기는 예입니다. 제목과 동작 줄은 제자리에 남습니다.",
        en: "A body longer than the window, so it scrolls while the title and the actions keep their places.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Dialog (Modal) Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
    notes: [
      {
        ko: "title이 창의 제목이 되어 대화상자의 이름이 되고, description이 있으면 설명으로 연결됩니다. 두 값을 짧게라도 채워 무엇을 하는 창인지 읽히게 합니다.",
        en: "title names the dialog and description is wired as its description. Fill both, however briefly, so the window's purpose is read out.",
      },
      {
        ko: "Base UI가 포커스 트랩과 Esc 닫기, 배경 누르기, 스크롤 잠금을 맡고 닫을 때 포커스를 트리거로 돌려 놓습니다. 창이 포털로 document.body에 붙으므로 부모의 쌓임 순서에 영향을 받지 않습니다.",
        en: "Base UI owns the focus trap, Escape, backdrop press and the scroll lock, and returns focus to the trigger on close. The window portals to document.body, so the caller's stacking context does not affect it.",
      },
      {
        ko: "본문은 스크롤되지만 포커스는 창 안에 갇힙니다. 본문을 키보드로 넘길 수 있도록 스크롤 영역 안에 포커스를 받을 수 있는 요소를 두거나, 내용을 짧게 유지합니다.",
        en: "The body scrolls while focus stays inside the window. Give the scrolling region something focusable, or keep the content short, so the body can be reached from the keyboard.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "창 안에서만 포커스를 옮깁니다. 마지막 컨트롤 다음에는 첫 컨트롤로 돌아옵니다.",
          en: "Moves focus inside the window only, returning to the first control after the last.",
        },
      },
      {
        keys: ["Escape"],
        action: {
          ko: "창을 닫고 포커스를 트리거로 돌려놓습니다.",
          en: "Closes the window and returns focus to the trigger.",
        },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스한 버튼을 실행합니다.", en: "Runs the focused button." },
      },
    ],
  },
};
