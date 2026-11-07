/**
 * Reference doc for the four pieces exported from `schedule`: `ScheduleCard`,
 * `ScheduleSection`, `PickerField` and `WeekdayPicker`. Written against
 * `packages/react/src/components/schedule.tsx` and
 * `packages/flutter/lib/src/components/schedule.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "schedule",
  anatomy: {
    description: {
      ko: "Schedule은 루틴이 언제 돌지 정하는 카드와 그 부품들입니다. 카드 하나에 머리말과 캡션 붙은 구획들이 세로로 쌓이고, 구획 안에 반복 주기·요일·시간 컨트롤이 들어가며, 맨 아래에 다음 실행 시각 띠가 붙습니다.",
      en: "Schedule is a card and its parts for setting when a routine runs. A card stacks a header and captioned sections, each section holds a repeat, weekday or time control, and a next-run strip closes the card.",
    },
    parts: [
      {
        name: "Card",
        slot: "ScheduleCard",
        description: {
          ko: "바깥 section입니다. 반복 아이콘과 제목을 담은 머리말, 자식 구획들, 다음 실행 띠를 세로로 배치하고 둥근 틀을 그립니다.",
          en: "The outer section. It stacks the header with its repeat icon and title, the child sections and the next-run strip, and draws the rounded frame.",
        },
      },
      {
        name: "Section",
        slot: "ScheduleSection",
        description: {
          ko: "캡션 하나와 그 아래 컨트롤로 이루어진 구획입니다. 캡션은 secondary 색이고, 컨트롤과의 간격이 크기 눈금을 따릅니다.",
          en: "One captioned block: a secondary caption above the control it names, with a gap that follows the size rung.",
        },
      },
      {
        name: "Picker field",
        slot: "PickerField",
        description: {
          ko: "반복 주기나 시간을 고르는 필드형 Select입니다. 앞쪽 아이콘, 지금 값, 열림 상태에서 도는 캐럿으로 이루어집니다.",
          en: "A field-shaped Select for repeat frequency or time. It holds a leading icon, the current value and a caret that turns while the popup is open.",
        },
      },
      {
        name: "Weekday picker",
        slot: "WeekdayPicker",
        description: {
          ko: "요일을 여러 개 켜 두는 원형 토글 묶음입니다. 켜진 요일은 interactive-primary로 채워집니다.",
          en: "A row of round toggles for the weekdays a routine runs on. A chosen day fills with interactive-primary.",
        },
      },
      {
        name: "Next run strip",
        slot: "nextRun",
        description: {
          ko: "카드 아래쪽의 옅은 하늘색 띠입니다. 달력 아이콘과 다음 실행 시각을 담고, nextRun을 넘기지 않으면 그리지 않습니다.",
          en: "The faint sky strip at the bottom of the card. It holds a calendar icon and the next run time, and is not drawn at all without nextRun.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "카드와 필드의 바탕 재질입니다. 카드는 solid와 glass를, 필드는 여기에 inset을 더해 받습니다.",
        en: "Fill material of the card and the fields. The card takes solid and glass; the fields add inset to those.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "카드에서는 불투명한 표면 바탕과 기본 테두리, 필드에서는 같은 표면 바탕에 기본 테두리를 씁니다. 기본값입니다.",
            en: "On the card an opaque surface fill with a default border; on a field the same surface fill with its border. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "카드에서는 thick glass 바탕과 유리 레이어, 필드에서는 veil field를 씁니다. 이미지나 유리 패널 위에 띄울 때 씁니다.",
            en: "On the card a thick glass fill with its glass layer; on a field the veil field. For floating over imagery or a glass panel.",
          },
        },
        {
          name: "inset",
          description: {
            ko: "필드 전용 값입니다. 4% 잉크 바탕에 테두리가 없어 카드 안쪽 면에 파인 것처럼 보입니다. 카드 안의 필드는 inset을 씁니다.",
            en: "Field-only. A 4% ink fill with no border, so it reads as recessed into the card. Fields inside the card use inset.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "카드, 구획, 필드, 요일 원이 함께 쓰는 눈금입니다. 카드 너비와 여백, 필드 높이, 요일 원 지름이 같은 단계로 움직입니다.",
        en: "The rung the card, section, field and weekday circles share. Card width and padding, field height and circle diameter all step together.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "카드 340px, 필드 32px, 요일 원 32px에 label-sm 글자를 씁니다.",
            en: "A 340px card, 32px field and 32px circles with label-sm text.",
          },
        },
        {
          name: "md",
          description: {
            ko: "카드 380px, 필드 40px, 요일 원 36px에 label-md 글자를 씁니다. 기본값입니다.",
            en: "A 380px card, 40px field and 36px circles with label-md text. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "카드 420px, 필드 48px, 요일 원 44px에 label-lg 글자를 씁니다.",
            en: "A 420px card, 48px field and 44px circles with label-lg text.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "nextRun",
      title: { ko: "nextRun", en: "nextRun" },
      description: {
        ko: "카드 맨 아래에 붙는 다음 실행 시각 문구입니다. 넘기지 않으면 띠를 아예 그리지 않으므로, 다음 실행이 아직 정해지지 않은 카드는 그대로 둡니다.",
        en: "The next run time shown in the strip at the bottom of the card. Without it the strip is not rendered at all, so a card whose next run is not decided yet simply omits it.",
      },
      example: "full-card",
    },
    {
      id: "items",
      title: { ko: "items", en: "items" },
      description: {
        ko: "PickerField의 선택지 목록입니다. value는 onValueChange가 돌려주는 값이고 label은 트리거와 팝업 줄에 보이는 문구입니다.",
        en: "The choices of a PickerField. value is what onValueChange returns and label is what the trigger and the popup row show.",
      },
      example: "pickers",
    },
    {
      id: "days",
      title: { ko: "days", en: "days" },
      description: {
        ko: "WeekdayPicker의 요일 목록입니다. label은 원에 보이는 짧은 글자이고 name은 토글의 접근 가능한 이름입니다. 값은 value 배열에 들어갑니다.",
        en: "The days of a WeekdayPicker. label is the short text on the circle and name is the toggle's accessible name; the value joins the value array.",
      },
      example: "full-card",
    },
    {
      id: "icon",
      title: { ko: "icon", en: "icon" },
      description: {
        ko: "PickerField 앞의 아이콘입니다. 주지 않으면 시계가 붙습니다. 시간이 아닌 다른 대상을 고르는 필드는 그 대상을 가리키는 아이콘을 넘깁니다.",
        en: "Leading icon of a PickerField. Without it a clock is used, so a field that picks something other than a time passes its own icon.",
      },
      example: "pickers",
    },
  ],
  guidelines: [
    {
      id: "inset-inside-card",
      title: { ko: "카드 안의 필드는 inset", en: "Fields inside the card use inset" },
      body: {
        ko: "카드 바탕 위에 테두리 있는 필드를 얹으면 선이 겹쳐 층이 두 겹으로 보입니다. 카드 안에서는 inset을 써서 필드가 면에 파인 것처럼 보이게 합니다. solid와 glass는 카드 없이 필드만 따로 놓을 때 씁니다.",
        en: "A bordered field on a card draws a second frame on top of the card's own. Use inset inside the card so the field reads as recessed, and keep solid and glass for fields that stand alone.",
      },
      do: {
        ko: "카드 안 시간 필드에 surface=\"inset\"을 줍니다.",
        en: "Pass surface=\"inset\" to the time field inside the card.",
      },
      dont: {
        ko: "카드 안에서 기본 solid 필드를 그대로 쓰지 않습니다.",
        en: "Do not leave the default solid field inside the card.",
      },
      example: "pickers",
    },
    {
      id: "one-size-throughout",
      title: { ko: "카드와 부품의 크기를 맞춥니다", en: "Match the part sizes to the card" },
      body: {
        ko: "카드 크기를 바꾸면 안의 필드, 요일 원, 구획도 같은 값을 받아야 합니다. 크기가 섞이면 40px 필드 옆에 32px 요일 원이 놓여 줄이 어긋납니다.",
        en: "Changing the card size means passing the same value to the fields, circles and sections inside. Mixing rungs puts a 32px circle beside a 40px field and the row stops lining up.",
      },
      example: "sizes",
    },
    {
      id: "next-run-is-a-promise",
      title: { ko: "nextRun은 실제 규칙과 맞춰야 합니다", en: "nextRun has to match the rules" },
      body: {
        ko: "nextRun은 카드가 약속하는 값입니다. 사용자가 요일과 시간을 바꾸면 그 입력에서 다음 실행 시각을 다시 계산해 넘겨야 하고, 아직 정해지지 않았으면 띠를 그리지 않습니다. 고정 문구를 그대로 두면 카드가 거짓을 말합니다.",
        en: "The next run is what the card promises. Recompute it from the chosen days and time whenever they change, and omit it while the answer is still open. Leaving a fixed string makes the card state something untrue.",
      },
      example: "full-card",
    },
    {
      id: "live-schedule-vs-editor",
      title: { ko: "실행 중인 스케줄은 읽기 전용으로", en: "Show a running schedule read-only" },
      body: {
        ko: "이 카드는 편집용입니다. 이미 돌고 있는 스케줄을 목록에서 보여 줄 때는 구획 대신 카드 머리말과 nextRun만 쓰고 고를 수 있는 컨트롤은 넣지 않습니다. 목록에서 바로 값을 바꾸면 무엇이 저장되었는지 알기 어렵습니다.",
        en: "This card is an editor. To show a running schedule in a list, keep the header and the next-run strip without the pickers; changing values straight in a list makes it unclear what was saved.",
      },
      example: "full-card",
    },
  ],
  specification: [
    {
      id: "card-metrics",
      title: { ko: "카드", en: "Card" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 괄호 안은 그 유틸이 만드는 픽셀 값입니다. Figma 너비는 최대값이라 좁은 화면에서는 열 너비로 접힙니다.",
        en: "Values are the token utility names from the component classes; the parentheses give the pixels they produce. The Figma widths are maximums, so the card folds to the column on a narrow screen.",
      },
      rows: [
        { state: "sm", slot: "Card", property: "width", value: "w-full max-w-85 (340px)" },
        { state: "sm", slot: "Card", property: "padding", value: "p-4" },
        { state: "sm", slot: "Card", property: "gap", value: "gap-3" },
        { state: "sm", slot: "Header", property: "font", value: "text-label-md" },
        { state: "sm", slot: "Header", property: "icon size", value: "size-4" },
        { state: "sm", slot: "Next run", property: "font", value: "text-label-md" },
        { state: "sm", slot: "Next run", property: "padding", value: "px-2.5 py-2" },
        { state: "md", slot: "Card", property: "width", value: "w-full max-w-95 (380px)" },
        { state: "md", slot: "Card", property: "padding", value: "p-5" },
        { state: "md", slot: "Card", property: "gap", value: "gap-4" },
        { state: "md", slot: "Header", property: "font", value: "text-label-lg" },
        { state: "md", slot: "Header", property: "icon size", value: "size-4" },
        { state: "md", slot: "Next run", property: "font", value: "text-label-md" },
        { state: "md", slot: "Next run", property: "padding", value: "px-3 py-2" },
        { state: "lg", slot: "Card", property: "width", value: "w-full max-w-105 (420px)" },
        { state: "lg", slot: "Card", property: "padding", value: "p-5" },
        { state: "lg", slot: "Card", property: "gap", value: "gap-4" },
        { state: "lg", slot: "Header", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Header", property: "icon size", value: "size-5" },
        { state: "lg", slot: "Next run", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Next run", property: "padding", value: "px-3.5 py-3" },
        { state: "all", slot: "Card", property: "radius", value: "rounded-xl (20px)" },
      ],
    },
    {
      id: "card-colors",
      title: { ko: "카드 색", en: "Card colors" },
      rows: [
        { state: "solid", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Card", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Card", property: "background layer", value: "LiquidGlass" },
        { state: "all", slot: "Header", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Section caption", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Next run", property: "background", value: "bg-accent-sky-500-16" },
        { state: "all", slot: "Next run", property: "radius", value: "rounded-md (12px)" },
      ],
    },
    {
      id: "picker-field",
      title: { ko: "PickerField", en: "PickerField" },
      rows: [
        { state: "sm", slot: "Trigger", property: "height", value: "h-8 (32px)" },
        { state: "sm", slot: "Trigger", property: "width", value: "w-36 max-w-full (144px)" },
        { state: "sm", slot: "Trigger", property: "padding-x", value: "px-3" },
        { state: "sm", slot: "Value", property: "font", value: "text-body-sm" },
        { state: "sm", slot: "Icon", property: "size", value: "size-4" },
        { state: "sm", slot: "Popup row", property: "height", value: "h-8 (32px)" },
        { state: "sm", slot: "Popup row", property: "font", value: "text-label-sm" },
        { state: "md", slot: "Trigger", property: "height", value: "h-10 (40px)" },
        { state: "md", slot: "Trigger", property: "width", value: "w-40 max-w-full (160px)" },
        { state: "md", slot: "Trigger", property: "padding-x", value: "px-3.5" },
        { state: "md", slot: "Value", property: "font", value: "text-body-md" },
        { state: "md", slot: "Popup row", property: "height", value: "h-10 (40px)" },
        { state: "md", slot: "Popup row", property: "font", value: "text-label-md" },
        { state: "lg", slot: "Trigger", property: "height", value: "h-12 (48px)" },
        { state: "lg", slot: "Trigger", property: "width", value: "w-44 max-w-full (176px)" },
        { state: "lg", slot: "Trigger", property: "padding-x", value: "px-5" },
        { state: "lg", slot: "Value", property: "font", value: "text-body-lg" },
        { state: "lg", slot: "Icon", property: "size", value: "size-5" },
        { state: "lg", slot: "Popup row", property: "height", value: "h-12 (48px)" },
        { state: "lg", slot: "Popup row", property: "font", value: "text-label-lg" },
        { state: "solid", slot: "Trigger", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Trigger", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Trigger", property: "background", value: "veil-field" },
        { state: "inset", slot: "Trigger", property: "background", value: "bg-overlay-ink-4" },
        { state: "open", slot: "Caret", property: "rotate", value: "180deg" },
        { state: "focus", slot: "Trigger", property: "outline", value: "2px outline-text-brand" },
        { state: "hover", slot: "Popup row", property: "background", value: "bg-overlay-ink-6" },
        { state: "selected", slot: "Popup row", property: "background", value: "bg-overlay-ink-6" },
        { state: "all", slot: "Popup", property: "max height", value: "max-h-72" },
        { state: "all", slot: "Popup", property: "min width", value: "min-w-(--anchor-width)" },
        {
          state: "solid",
          slot: "Popup",
          property: "shadow",
          value: "shadow-popover",
          note: {
            ko: "glass와 inset 필드의 팝업은 veil-overlay 바탕을 쓰고 이 그림자를 두지 않습니다.",
            en: "Popups of glass and inset fields use the veil-overlay fill and take no shadow token.",
          },
        },
        { state: "all", slot: "Popup", property: "offset", value: "8px" },
      ],
    },
    {
      id: "weekday-picker",
      title: { ko: "WeekdayPicker", en: "WeekdayPicker" },
      rows: [
        { state: "sm", slot: "Toggle", property: "size", value: "size-8 (32px)" },
        { state: "sm", slot: "Toggle", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Group", property: "gap", value: "gap-1" },
        { state: "md", slot: "Toggle", property: "size", value: "size-9 (36px)" },
        { state: "md", slot: "Toggle", property: "font", value: "text-label-md" },
        { state: "md", slot: "Group", property: "gap", value: "gap-1.5" },
        { state: "lg", slot: "Toggle", property: "size", value: "size-11 (44px)" },
        { state: "lg", slot: "Toggle", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Group", property: "gap", value: "gap-2" },
        { state: "default", slot: "Toggle", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Toggle", property: "text color", value: "text-text-secondary" },
        { state: "selected", slot: "Toggle", property: "background", value: "bg-interactive-primary" },
        { state: "selected", slot: "Toggle", property: "text color", value: "text-interactive-on-primary" },
        { state: "focus-visible", slot: "Toggle", property: "outline", value: "2px outline-text-brand" },
        { state: "press", slot: "Toggle", property: "motion", value: "motion-press" },
      ],
    },
  ],
  examples: [
    {
      id: "full-card",
      title: { ko: "전체 카드", en: "Full card" },
      description: {
        ko: "반복 주기, 요일, 시간, 알림 대상을 모두 담고 다음 실행 시각을 붙인 카드입니다.",
        en: "A card holding repeat frequency, days, time and a report target, with its next run time attached.",
      },
    },
    {
      id: "pickers",
      title: { ko: "필드", en: "Picker fields" },
      description: {
        ko: "시간 필드와 다른 아이콘을 붙인 필드를 inset 바탕으로 나란히 놓았습니다.",
        en: "A time field beside one with its own icon, both on the inset fill.",
      },
    },
    {
      id: "weekdays",
      title: { ko: "요일 선택", en: "Weekday picker" },
      description: {
        ko: "여러 요일을 함께 켜 두는 원형 토글 묶음입니다.",
        en: "The round toggle group that keeps several days on at once.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 카드에 같은 요일과 시간 컨트롤을 같은 크기로 넣었습니다.",
        en: "The sm, md and lg cards with the same day and time controls at matching sizes.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "surface", en: "Surfaces" },
      description: {
        ko: "solid 카드와 glass 카드 위에서 필드의 solid, glass, inset 세 바탕이 어떻게 다르게 보이는지 비교합니다.",
        en: "How the solid, glass and inset field fills read on a solid card and on a glass card.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "카드는 section이고 제목은 h3입니다. 제목은 반복 아이콘 옆에 놓이며 aria-hidden인 아이콘이 이름에 섞이지 않습니다.",
        en: "The card is a section with an h3 title beside the repeat icon, and the decorative icon stays out of the name through aria-hidden.",
      },
      {
        ko: "각 필드에는 보이는 라벨이 따로 없으므로 aria-label을 넘깁니다. 구획 캡션은 화면에 보이는 설명일 뿐 필드의 접근 가능한 이름이 아니므로 둘을 함께 맞춰 적습니다.",
        en: "A field has no label of its own, so pass aria-label. The section caption is visual and does not name the field, so keep the two worded alike.",
      },
      {
        ko: "요일 토글은 aria-label로 \"Monday\" 같은 온전한 이름을 받고, 지금 켜졌는지는 aria-pressed로 알립니다. 원 안의 \"M\"만으로는 요일이 전달되지 않습니다.",
        en: "Each weekday toggle takes a full name such as \"Monday\" through aria-label and reports its state through aria-pressed. The \"M\" on the circle alone does not say the day.",
      },
      {
        ko: "반복 주기와 시간 필드의 팝업은 body에 포털로 붙어 카드 밖으로 열립니다. 목록 항목은 키보드로도 고를 수 있고, 열린 팝업의 캐럿은 180도 돌아 열림 상태를 눈으로도 알립니다.",
        en: "The popups of the repeat and time fields mount to the body and open outside the card. Items are reachable from the keyboard, and the open caret turns 180 degrees so the state shows without reading.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter", "Space"],
        action: { ko: "필드의 팝업을 열거나, 요일 원의 선택을 뒤집습니다.", en: "Opens a field popup, or flips a weekday circle." },
      },
      {
        keys: ["ArrowDown", "ArrowUp"],
        action: { ko: "필드 팝업에서 다음·이전 항목으로 이동합니다.", en: "Moves to the next or previous item in an open field popup." },
      },
      {
        keys: ["Enter"],
        action: { ko: "팝업에서 항목을 고르고 닫습니다.", en: "Picks the item in the popup and closes it." },
      },
      {
        keys: ["Escape"],
        action: { ko: "팝업을 닫고 필드로 포커스를 돌려놓습니다.", en: "Closes the popup and returns focus to the field." },
      },
      {
        keys: ["ArrowLeft", "ArrowRight"],
        action: { ko: "요일 묶음에서 포커스를 옆 요일로 옮깁니다.", en: "Moves focus to the next or previous weekday in the group." },
      },
      {
        keys: ["Tab"],
        action: { ko: "다음 포커스 가능한 요소로 이동합니다.", en: "Moves focus to the next focusable control." },
      },
    ],
  },
};
