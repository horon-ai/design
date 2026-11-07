/**
 * Reference doc for `SplitButton`, written against
 * `packages/react/src/components/split-button.tsx` and
 * `packages/flutter/lib/src/components/split_button.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "split-button",
  anatomy: {
    description: {
      ko: "SplitButton은 주 동작과 보조 메뉴를 한 알약에 담은 버튼입니다. 왼쪽 절반이 라벨을 단 주 동작이고, 가는 세로 막대로 나뉜 오른쪽 절반이 캐럿을 눌러 메뉴를 여는 자리입니다.",
      en: "A SplitButton pairs a primary action with a secondary menu in one pill. The left half runs the labeled action, and the right half, divided by a thin vertical bar, opens a menu from its caret.",
    },
    parts: [
      {
        name: "Container",
        slot: "div",
        description: {
          ko: "알약 전체입니다. primary 채움, 0.97 눌림, 40% 비활성 흐림을 이 상자가 들고 있어 두 절반이 한 모양으로 남습니다.",
          en: "The whole pill. It owns the primary fill, the 0.97 press scale and the 40% disabled dim, so both halves stay one shape.",
        },
      },
      {
        name: "Primary half",
        slot: "button",
        description: {
          ko: "라벨을 단 주 동작 버튼입니다. menu가 있으면 왼쪽 모서리만 둥글고, 없으면 알약 전체를 혼자 채웁니다.",
          en: "The labeled action button. With a menu only its left corners round; without one it fills the whole pill alone.",
        },
      },
      {
        name: "Icon",
        slot: "icon",
        description: {
          ko: "라벨 앞의 16px 아이콘입니다. 라벨 색을 그대로 따릅니다.",
          en: "The 16px icon before the label, colored like the label.",
        },
      },
      {
        name: "Divider",
        slot: "divider",
        description: {
          ko: "두 절반을 나누는 1px 세로 막대입니다. menu를 넘길 때만 그려지고, 라벨 색의 25% 불투명도로 놓입니다.",
          en: "The 1px vertical bar between the halves. It exists only with a menu, drawn at 25% of the label color.",
        },
      },
      {
        name: "Caret",
        slot: "menuLabel",
        description: {
          ko: "메뉴를 여는 오른쪽 버튼입니다. menuLabel이 접근 가능한 이름이 되고, 캐럿은 팝업이 열린 동안 180도 돕니다.",
          en: "The right button that opens the menu. menuLabel is its accessible name, and its caret turns 180 degrees while the popup is open.",
        },
      },
    ],
  },
  properties: [
    {
      id: "menu",
      title: { ko: "menu", en: "menu" },
      description: {
        ko: "캐럿이 여는 메뉴 항목들입니다. MenuItem과 MenuSeparator를 넘깁니다. 주지 않으면 구분선과 캐럿이 사라지고 버튼이 알약 전체를 쓰는 단일 버튼이 됩니다.",
        en: "The menu items the caret opens, usually MenuItem and MenuSeparator. Without it the divider and caret disappear and the button becomes a single full-round button.",
      },
      example: "menu",
    },
    {
      id: "icon",
      title: { ko: "icon", en: "icon" },
      description: {
        ko: "라벨 앞의 16px 아이콘입니다. 주 동작의 대상이 무엇인지 아이콘으로 알릴 때 씁니다.",
        en: "The 16px leading icon, for showing what the action works on.",
      },
      example: "menu",
    },
    {
      id: "menuLabel",
      title: { ko: "menuLabel", en: "menuLabel" },
      description: {
        ko: "캐럿 버튼의 접근 가능한 이름입니다. 기본값은 \"More actions\"이고, 이 버튼에는 보이는 글자가 없으므로 이 값이 유일한 이름입니다.",
        en: "Accessible name of the caret button. It defaults to \"More actions\", and because the button shows no text this value is its only name.",
      },
      example: "long-menu-label",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 두 절반과 캐럿이 모두 눌리지 않고 알약 전체가 40% 불투명도로 흐려집니다. 한쪽만 막지 않고 주 동작과 메뉴를 함께 멈춥니다.",
        en: "When true neither half nor the caret responds and the whole pill fades to 40% opacity. The action and its menu stop together rather than one at a time.",
      },
      example: "disabled",
    },
  ],
  guidelines: [
    {
      id: "default-is-the-frequent-action",
      title: { ko: "왼쪽은 가장 자주 쓰는 동작", en: "The left half is the common action" },
      body: {
        ko: "왼쪽 절반은 대부분의 경우 그대로 누르는 동작이어야 합니다. 실제로 매번 다른 항목을 고르는 화면이라면 두 동작을 나누지 말고 기본 버튼 하나와 별도 메뉴 버튼을 씁니다.",
        en: "The left half has to be what most presses should do as is. When nearly every use needs a different item, use a plain button next to a separate menu button rather than splitting.",
      },
      do: {
        ko: "Add는 새 항목을 바로 만들고, 다른 방식은 캐럿에서 고릅니다.",
        en: "Add creates a blank item right away, and the caret holds the other ways in.",
      },
      dont: {
        ko: "주 동작보다 메뉴 항목을 더 자주 쓰는 자리에 넣지 않습니다.",
        en: "Do not use it where a menu item is picked more often than the action.",
      },
      example: "menu",
    },
    {
      id: "one-per-toolbar",
      title: { ko: "한 도구 모음에 하나", en: "One per toolbar" },
      body: {
        ko: "SplitButton은 primary 채움을 쓰므로 화면에서 가장 강한 요소입니다. 같은 줄에 두 개를 놓으면 어느 쪽이 주 동작인지 판단할 수 없으므로, 나머지는 Button의 solid 변형으로 둡니다.",
        en: "A SplitButton carries the primary fill, so it is the strongest element on screen. Two in a row leave no way to tell which action matters, so keep the rest on Button's solid variant.",
      },
      example: "no-menu",
    },
    {
      id: "menu-is-not-the-only-path",
      title: { ko: "메뉴 항목을 주 동작의 대안으로만", en: "Keep menu items as alternatives" },
      body: {
        ko: "캐럿 메뉴는 주 동작의 다른 방법을 담습니다. 주 동작을 불가능하게 만드는 설정을 메뉴에만 두면, 왼쪽 버튼을 누른 사용자는 실패를 만납니다. 두 경우 모두 같은 조건으로 비활성화합니다.",
        en: "The caret menu holds other ways to do the same thing. A setting that makes the main action impossible must not live only in the menu, or pressing the left half fails; disable the split button under the same condition.",
      },
      example: "disabled",
    },
    {
      id: "name-the-caret",
      title: { ko: "캐럿에 이름을 붙입니다", en: "Name the caret" },
      body: {
        ko: "캐럿에는 보이는 글자가 없으므로 menuLabel이 유일한 이름입니다. \"More actions\"를 그대로 쓰지 말고 \"Publish options\"처럼 그 메뉴에 무엇이 있는지 드러내면, 주 버튼과 캐럿이 스크린 리더에서 서로 다른 동작으로 읽힙니다.",
        en: "The caret shows no text, so menuLabel is its only name. Replacing \"More actions\" with something like \"Publish options\" makes the action and the caret read as two different controls.",
      },
      example: "long-menu-label",
    },
  ],
  specification: [
    {
      id: "metrics",
      title: { ko: "크기", en: "Metrics" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 괄호 안은 그 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; the parentheses give the pixels they produce.",
      },
      rows: [
        { state: "all", slot: "Container", property: "height", value: "h-8 (32px)" },
        { state: "all", slot: "Container", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Label", property: "font", value: "text-label-md" },
        { state: "with menu", slot: "Primary half", property: "padding", value: "pr-2 pl-3" },
        { state: "with menu", slot: "Primary half", property: "radius", value: "rounded-l-full" },
        { state: "with menu", slot: "Caret", property: "padding", value: "pr-4 pl-2" },
        { state: "with menu", slot: "Caret", property: "radius", value: "rounded-r-full" },
        { state: "with menu", slot: "Caret", property: "icon size", value: "size-3.5 (14px)" },
        { state: "without menu", slot: "Primary half", property: "padding", value: "px-3" },
        { state: "without menu", slot: "Primary half", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Icon", property: "size", value: "size-4 (16px)" },
        { state: "all", slot: "Divider", property: "size", value: "1px wide, 18px tall" },
        {
          state: "all",
          slot: "Divider",
          property: "background",
          value: "bg-interactive-on-primary at 25% opacity",
        },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "default", slot: "Container", property: "background", value: "bg-interactive-primary" },
        { state: "default", slot: "Label", property: "text color", value: "text-interactive-on-primary" },
        { state: "hover", slot: "Container", property: "background", value: "bg-interactive-primary-hover" },
        { state: "pressed", slot: "Container", property: "scale", value: "0.97" },
        { state: "open", slot: "Caret icon", property: "rotate", value: "180deg" },
        { state: "focus-visible", slot: "Primary half", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Caret", property: "outline", value: "2px outline-text-brand" },
        { state: "disabled", slot: "Container", property: "opacity", value: "40%" },
        {
          state: "disabled",
          slot: "Container",
          property: "background",
          value: "bg-interactive-primary",
          note: {
            ko: "비활성 상태에서는 hover로 채움이 바뀌지 않습니다.",
            en: "The fill does not change on hover while disabled.",
          },
        },
        { state: "disabled", slot: "Halves", property: "cursor", value: "not-allowed" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        { state: "press · hover", slot: "Container", property: "transition", value: "duration-150 ease-out-quint" },
        { state: "press", slot: "Container", property: "scale", value: "0.97" },
        {
          state: "open · close",
          slot: "Caret",
          property: "transition",
          value: "transform 200ms ease-out-quint",
        },
        {
          state: "all",
          slot: "Container",
          property: "reduced motion",
          value: "instant",
          note: {
            ko: "동작 줄이기를 켜면 눌림과 회전이 즉시 끝납니다.",
            en: "With reduced motion on the press and the turn finish at once.",
          },
        },
      ],
    },
    {
      id: "menu-popup",
      title: { ko: "캐럿 메뉴", en: "Caret menu" },
      rows: [
        { state: "all", slot: "MenuContent", property: "alignment", value: "align=\"end\"" },
        { state: "all", slot: "MenuContent", property: "surface", value: "solid" },
        { state: "all", slot: "MenuContent", property: "shadow", value: "shadow-popover" },
        { state: "all", slot: "MenuItem", property: "height", value: "36px" },
      ],
    },
  ],
  examples: [
    {
      id: "menu",
      title: { ko: "메뉴 포함", en: "With a menu" },
      description: {
        ko: "주 동작과, 구분선으로 나뉜 캐럿 메뉴를 함께 둔 기본 형태입니다. 캐럿을 누르면 메뉴가 열립니다.",
        en: "The default shape: the action beside a caret menu divided by the bar. Pressing the caret opens the menu.",
      },
    },
    {
      id: "no-menu",
      title: { ko: "메뉴 없음", en: "Without a menu" },
      description: {
        ko: "menu를 넘기지 않으면 캐럿과 구분선이 사라지고 알약 전체가 하나의 버튼이 됩니다.",
        en: "Without menu the caret and divider disappear and the whole pill becomes one button.",
      },
    },
    {
      id: "disabled",
      title: { ko: "비활성", en: "Disabled" },
      description: {
        ko: "주 동작과 캐럿이 함께 멈추고 알약이 40% 불투명도로 흐려집니다.",
        en: "The action and the caret stop together and the pill fades to 40% opacity.",
      },
    },
    {
      id: "long-menu-label",
      title: { ko: "캐럿 이름", en: "Caret name" },
      description: {
        ko: "menuLabel을 메뉴 내용에 맞춰 바꾼 형태입니다. 화면은 같고 스크린 리더가 읽는 이름만 달라집니다.",
        en: "The same pill with menuLabel set to name its menu. Nothing changes on screen; only the name announced changes.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Menu Button Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
    notes: [
      {
        ko: "알약 안에 버튼이 둘이고 각각 다른 동작입니다. 왼쪽은 라벨이 이름이 되는 실행 버튼이고, 오른쪽 캐럿은 aria-haspopup과 펼침 상태를 들고 메뉴를 엽니다. 하나의 버튼으로 합치면 두 동작 중 어느 것도 이름으로 구분되지 않습니다.",
        en: "The pill holds two buttons with different jobs. The left is an action named by its label, and the right caret opens a menu with aria-haspopup and its expanded state. Merging them into one button leaves neither job named.",
      },
      {
        ko: "캐럿에는 보이는 글자가 없으므로 menuLabel이 접근 가능한 이름입니다. \"More actions\" 같은 일반 문구보다 메뉴 내용을 드러내는 이름이 좋습니다.",
        en: "The caret shows no text, so menuLabel is its accessible name. A name that says what the menu holds beats a generic \"More actions\".",
      },
      {
        ko: "두 절반은 각각 포커스를 받고 각각 2px outline을 그립니다. 알약이 하나로 보여도 키보드 사용자에게는 두 개의 정지점입니다.",
        en: "Each half takes focus on its own and draws its own 2px outline. The pill looks like one control, but a keyboard user meets two stops.",
      },
      {
        ko: "구분선은 aria-hidden인 장식이라 읽히지 않습니다. 두 버튼이 나뉘어 있다는 사실은 각 버튼의 이름과 역할로만 전달됩니다.",
        en: "The divider is decoration with aria-hidden, so it is never announced. That there are two buttons comes only from their names and roles.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter", "Space"],
        action: {
          ko: "포커스가 놓인 절반을 실행합니다. 캐럿에 있으면 메뉴를 엽니다.",
          en: "Runs the focused half; on the caret it opens the menu.",
        },
      },
      {
        keys: ["Tab"],
        action: { ko: "주 동작에서 캐럿으로, 다시 다음 요소로 이동합니다.", en: "Moves from the action to the caret, then out." },
      },
      {
        keys: ["ArrowDown", "ArrowUp"],
        action: { ko: "열린 메뉴에서 다음·이전 항목으로 이동합니다.", en: "Moves through the open menu." },
      },
      {
        keys: ["Enter"],
        action: { ko: "메뉴에서 항목을 실행하고 메뉴를 닫습니다.", en: "Runs the menu item and closes the menu." },
      },
      {
        keys: ["Escape"],
        action: { ko: "메뉴를 닫고 캐럿으로 포커스를 돌려놓습니다.", en: "Closes the menu and returns focus to the caret." },
      },
    ],
  },
};
