/**
 * Reference doc for `Toaster`, written against
 * `packages/react/src/components/toast.tsx` and
 * `packages/flutter/lib/src/components/toast.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "toast",
  anatomy: {
    description: {
      ko: "Toaster는 앱을 감싸고 토스트 큐를 화면 아래 오른쪽에 띄웁니다. 카드 한 장은 아이콘, 제목과 설명, 닫기 버튼으로 이루어집니다.",
      en: "A Toaster wraps the app and shows the toast queue at the bottom right of the screen. One card holds an icon, a title with a description, and a close button.",
    },
    parts: [
      {
        name: "Toaster",
        slot: "Toaster",
        description: {
          ko: "앱 트리와 뷰포트를 함께 그리는 Provider입니다. 앱에 한 번만 감쌉니다.",
          en: "The provider that renders the app tree and the viewport. Wrap the app in it once.",
        },
      },
      {
        name: "Viewport",
        slot: "Viewport",
        description: {
          ko: "화면 오른쪽 아래에 고정된 영역입니다. 토스트가 아래에서 위로 쌓이고, 좌우로 24px 여백을 둡니다.",
          en: "The fixed area at the bottom right. Toasts stack upward from the bottom with a 24px gutter on each side.",
        },
      },
      {
        name: "Toast",
        slot: "Root",
        description: {
          ko: "카드 한 장입니다. 높이와 위쪽 여백을 함께 전환해 목록이 부드럽게 밀립니다.",
          en: "One card. Its height and top margin transition together so the stack shifts smoothly.",
        },
      },
      {
        name: "Icon",
        slot: "icon",
        description: {
          ko: "tone에 따라 정보, 체크, 경고 아이콘을 그립니다. 크기는 카드 크기를 따릅니다.",
          en: "An info, check or warning icon chosen by tone, sized by the card size.",
        },
      },
      {
        name: "Title",
        slot: "Title",
        description: {
          ko: "결과를 한 줄로 적는 제목입니다. text-text-primary로 그립니다.",
          en: "The one-line result title, drawn in text-text-primary.",
        },
      },
      {
        name: "Description",
        slot: "Description",
        description: {
          ko: "제목 아래의 보조 설명입니다. 비워 두면 제목만 남습니다.",
          en: "Supporting copy under the title. Leaving it out leaves the title alone.",
        },
      },
      {
        name: "Close",
        slot: "Close",
        description: {
          ko: "우측 상단의 X 버튼입니다. 아이콘은 작지만 after 가상 요소로 누를 수 있는 영역을 8px씩 넓힙니다.",
          en: "The X at the top right. Its glyph is small, and an after pseudo-element widens the hit area by 8px on each side.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "카드의 폭과 여백, 글자 단계, 아이콘 크기를 한 번에 정합니다. Provider에 준 값이 이 Provider의 모든 토스트에 적용됩니다.",
        en: "Sets the card width, padding, text rung and icon size together. The value given to the provider applies to every toast it shows.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "최대 320px, 아이콘 16px, label-md 제목입니다. 좁은 화면이나 짧은 알림에 맞습니다.",
            en: "Up to 320px with a 16px icon and a label-md title, for narrow screens and short notices.",
          },
        },
        {
          name: "md",
          description: {
            ko: "최대 360px, 아이콘 20px, label-lg 제목입니다. 기본값입니다.",
            en: "Up to 360px with a 20px icon and a label-lg title. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "최대 400px, 아이콘 24px, label-lg 제목과 body-md 설명입니다. 설명이 두 줄 이상일 때 맞습니다.",
            en: "Up to 400px with a 24px icon, a label-lg title and a body-md description, for descriptions of two lines or more.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "카드의 재질입니다. 한 Provider의 모든 토스트가 같은 재질을 씁니다.",
        en: "The card material. Every toast from one provider uses the same one.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "표면 바탕에 기본 테두리와 popover 그림자를 씁니다. 페이지 위에 뜨는 기본 카드입니다.",
            en: "A surface fill with the default border and the popover shadow, the default card above a page.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil 유리 바탕을 씁니다. 이미지나 유리 크롬 위에 띄울 때 맞습니다.",
            en: "The veil glass fill, for showing a toast over imagery or glass chrome.",
          },
        },
      ],
      example: "glass",
    },
  ],
  guidelines: [
    {
      id: "result-not-decision",
      title: { ko: "결과를 알리고, 결정은 묻지 않습니다", en: "Report a result, do not ask for a decision" },
      body: {
        ko: "토스트는 방금 끝난 일을 알리는 자리이고 스스로 사라집니다. 답을 받아야 하는 오류나 승인 요청은 Banner나 ApprovalCard처럼 화면에 남는 요소에 둡니다.",
        en: "A toast reports something that already happened and clears itself. An error that needs an answer, or a request for approval, belongs in something that stays, such as a Banner or an ApprovalCard.",
      },
      do: {
        ko: "저장과 전송 결과를 제목 한 줄로 알립니다.",
        en: "Report a save or send as a one-line title.",
      },
      dont: {
        ko: "메일 계정 재연결을 토스트에서만 요구하지 않습니다.",
        en: "Do not require an email reconnect only through a toast.",
      },
      example: "tones",
    },
    {
      id: "one-action-one-toast",
      title: { ko: "동작 하나에 토스트 하나", en: "One toast per action" },
      body: {
        ko: "토스트는 큐로 쌓이므로 한 동작이 여러 개를 만들면 화면을 덮습니다. 같은 결과를 반복해서 알리지 말고, 묶어야 할 일은 설명 한 줄로 합칩니다.",
        en: "Toasts stack in a queue, so several from one action cover the screen. Announce a repeated result once and fold the rest into a single description line.",
      },
      example: "sizes",
    },
    {
      id: "title-then-detail",
      title: { ko: "제목은 결과, 설명은 다음 단서", en: "Title states the result, description the next clue" },
      body: {
        ko: "제목에는 무엇이 끝났는지 적고, 설명에는 사용자가 다음에 알면 좋은 값을 적습니다. 제목 한 줄만으로도 뜻이 통해야 합니다.",
        en: "The title says what finished; the description carries the value the user needs next. The title alone has to make sense.",
      },
      example: "tones",
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 배경 위에서만", en: "Glass only over a backdrop" },
      body: {
        ko: "glass 카드는 뒤가 비치는 면 위에서만 유리 바탕이 보입니다. 불투명한 페이지 위에서는 카드 경계가 흐려지므로 solid를 씁니다.",
        en: "A glass card shows its fill only over a see-through backdrop. On an opaque page the card edge fades, so use solid.",
      },
      example: "glass",
    },
  ],
  specification: [
    {
      id: "sizes",
      title: { ko: "크기별 값", en: "Sizes" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "sm", slot: "Toast", property: "max width", value: "max-w-80" },
        { state: "sm", slot: "Toast", property: "padding", value: "px-3 py-2.5" },
        { state: "sm", slot: "Toast", property: "gap", value: "gap-2" },
        { state: "sm", slot: "Icon", property: "size", value: "[&_svg]:size-4" },
        { state: "sm", slot: "Title", property: "font", value: "text-label-md" },
        { state: "sm", slot: "Description", property: "font", value: "text-body-sm" },
        { state: "sm", slot: "Close", property: "size", value: "[&_svg]:size-3.5" },
        { state: "md", slot: "Toast", property: "max width", value: "max-w-90" },
        { state: "md", slot: "Toast", property: "padding", value: "px-4 py-3.5" },
        { state: "md", slot: "Toast", property: "gap", value: "gap-3" },
        { state: "md", slot: "Icon", property: "size", value: "[&_svg]:size-5" },
        { state: "md", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "md", slot: "Description", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Close", property: "size", value: "[&_svg]:size-4" },
        { state: "lg", slot: "Toast", property: "max width", value: "max-w-100" },
        { state: "lg", slot: "Toast", property: "padding", value: "px-5 py-4" },
        { state: "lg", slot: "Toast", property: "gap", value: "gap-3.5" },
        { state: "lg", slot: "Icon", property: "size", value: "[&_svg]:size-6" },
        { state: "lg", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Description", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Close", property: "size", value: "[&_svg]:size-5" },
      ],
    },
    {
      id: "surfaces",
      title: { ko: "바탕과 그림자", en: "Surfaces and shadow" },
      rows: [
        { state: "all", slot: "Toast", property: "radius", value: "rounded-lg" },
        { state: "all", slot: "Toast", property: "margin top", value: "mt-3" },
        { state: "solid", slot: "Toast", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Toast", property: "border", value: "border border-border-default" },
        { state: "solid", slot: "Toast", property: "shadow", value: "shadow-popover" },
        { state: "glass", slot: "Toast", property: "background", value: "veil-overlay" },
        { state: "all", slot: "Viewport", property: "position", value: "fixed inset-x-6 bottom-6" },
        { state: "all", slot: "Viewport", property: "stack", value: "flex flex-col items-end" },
        { state: "neutral", slot: "Icon", property: "text color", value: "text-text-secondary" },
        { state: "success", slot: "Icon", property: "text color", value: "text-text-brand" },
        { state: "danger", slot: "Icon", property: "text color", value: "text-text-danger" },
        { state: "close · hover", slot: "Close", property: "text color", value: "hover:text-text-primary" },
        { state: "close", slot: "Close", property: "hit area", value: "after:-inset-2" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        { state: "enter", slot: "Toast", property: "motion", value: "translate-y-4 scale-95 opacity-0" },
        { state: "enter", slot: "Toast", property: "duration", value: "duration-240" },
        { state: "enter", slot: "Toast", property: "easing", value: "ease-out-quint" },
        { state: "exit", slot: "Toast", property: "motion", value: "translate-x-6 opacity-0" },
        { state: "exit", slot: "Toast", property: "duration", value: "duration-180" },
        { state: "exit", slot: "Toast", property: "easing", value: "ease-in" },
        {
          state: "exit",
          slot: "Toast",
          property: "size",
          value: "h-0 mt-0",
          note: {
            ko: "높이와 위쪽 여백이 함께 줄어 아래 카드가 올라옵니다.",
            en: "Height and top margin shrink together so the cards below rise.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 카드를 각각의 Provider로 띄웁니다. 트리거를 누르면 오른쪽 아래에 나타납니다.",
        en: "sm, md and lg cards, each from its own provider. Pressing a trigger shows it at the bottom right.",
      },
    },
    {
      id: "tones",
      title: { ko: "종류", en: "Tones" },
      description: {
        ko: "neutral, success, danger 세 종류를 한 Provider에서 띄웁니다. 아이콘과 색만 바뀝니다.",
        en: "Neutral, success and danger from one provider. Only the icon and its colour change.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 카드", en: "Glass card" },
      description: {
        ko: "이미지 위에서 glass 카드를 띄웁니다. 카드가 유리 바탕을 쓰고 테두리가 없습니다.",
        en: "A glass card over imagery. The card takes the glass fill and drops the border.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "뷰포트는 role region과 aria-live polite로 두고, Base UI가 우선순위에 따라 각 카드를 dialog나 alertdialog로 표시합니다. 그래서 화면을 보지 않아도 결과가 읽힙니다.",
        en: "The viewport is a region with aria-live polite, and Base UI marks each card as a dialog or alertdialog by priority, so the result is announced without sight.",
      },
      {
        ko: "F6을 누르면 포커스가 뷰포트로 이동해 키보드로 토스트를 읽고 닫을 수 있습니다. 마우스로만 닫을 수 있는 알림을 만들지 않습니다.",
        en: "F6 moves focus to the viewport so a keyboard user can read and close a toast. Never make a toast closable only by pointer.",
      },
      {
        ko: "닫기 버튼은 화면에 보이는 X보다 넓은 영역을 누를 수 있고 aria-label로 이름을 가집니다. 아이콘만 있는 버튼이므로 이름을 지우지 않습니다.",
        en: "The close button accepts presses outside the visible X and carries an aria-label. It is an icon-only control, so keep its name.",
      },
      {
        ko: "동작 줄이기를 켜면 240ms 등장과 180ms 퇴장이 즉시 끝나고, 쌓인 카드는 자리만 옮깁니다.",
        en: "With reduced motion on, the 240ms entrance and 180ms exit finish instantly and stacked cards only change place.",
      },
    ],
    keyboard: [
      {
        keys: ["F6"],
        action: { ko: "포커스를 토스트 뷰포트로 옮깁니다.", en: "Moves focus to the toast viewport." },
      },
      {
        keys: ["Tab"],
        action: { ko: "토스트와 닫기 버튼 사이를 이동합니다.", en: "Moves between the toast and its close button." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 있는 닫기 버튼을 누릅니다.", en: "Presses the focused close button." },
      },
      {
        keys: ["Escape"],
        action: { ko: "포커스가 들어 있는 토스트를 닫습니다.", en: "Closes the toast that holds focus." },
      },
    ],
  },
};
