/**
 * Reference doc for `DateField`, written against
 * `packages/react/src/components/date-field.tsx` and
 * `packages/flutter/lib/src/components/date_field.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "date-field",
  anatomy: {
    description: {
      ko: "DateField는 날짜를 고르는 입력처럼 보이는 버튼입니다. 트리거를 누르면 달력이 포털로 열리고, 고른 날짜는 트리거 문구로 돌아옵니다.",
      en: "A DateField looks like an input for a date but is a button. Pressing the trigger opens the calendar in a portal, and the picked day comes back as the trigger text.",
    },
    parts: [
      {
        name: "Trigger",
        slot: "Popover.Trigger",
        description: {
          ko: "달력을 여는 실제 button 요소입니다. 상자와 테두리, 높이를 Input과 같은 클래스로 그려 폼 안에서 입력과 나란히 놓입니다. 기본 너비는 280px입니다.",
          en: "The real button that opens the calendar. Its box, border and height come from the same classes as Input, so it lines up with fields in a form. It is 280px wide by default.",
        },
      },
      {
        name: "Icon",
        slot: "CalendarBlank",
        description: {
          ko: "트리거 앞의 달력 아이콘입니다. sm과 md에서 16px, lg에서 20px이며 secondary 색을 씁니다.",
          en: "The calendar icon before the text. 16px on sm and md, 20px on lg, in the secondary color.",
        },
      },
      {
        name: "Value text",
        slot: "children",
        description: {
          ko: "고른 값을 포맷한 문구입니다. 값이 없으면 placeholder가 placeholder 색으로 보이고, 비활성이면 disabled 색으로 흐려집니다.",
          en: "The formatted value. Without one the placeholder shows in the placeholder color, and a disabled field fades its text to the disabled color.",
        },
      },
      {
        name: "Calendar",
        slot: "Calendar",
        description: {
          ko: "트리거 아래 4px에 열리는 달력입니다. 팝업이 자기 너비를 정하고 뷰포트 안으로 제한합니다.",
          en: "The calendar that opens 4px below the trigger. The popup names its own width and caps it to the viewport.",
        },
      },
    ],
  },
  properties: [
    {
      id: "mode",
      title: { ko: "mode", en: "mode" },
      description: {
        ko: "고르는 값의 모양을 정합니다. 같은 값이 트리거 문구와 onValueChange의 인자에 함께 쓰입니다.",
        en: "Shape of the value. The same shape is used for the trigger text and the onValueChange argument.",
      },
      values: [
        {
          name: "single",
          description: {
            ko: "날짜 하나를 고릅니다. value는 Date이고 비어 있으면 null입니다. 기본값입니다.",
            en: "Picks one day. value is a Date, or null when nothing is picked. The default.",
          },
        },
        {
          name: "range",
          description: {
            ko: "시작과 끝 두 날짜를 고릅니다. value는 DateRange이고, 두 번째 날짜를 고르기 전에는 end가 null입니다.",
            en: "Picks a start and an end. value is a DateRange whose end stays null until the second day is picked.",
          },
        },
      ],
      example: "range",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "트리거의 높이와 글자 단계이며, 팝업 안 달력의 셀 크기도 함께 정합니다.",
        en: "Height and text rung of the trigger, and the day-cell size of the calendar inside the popup.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 32px에 body-sm 문구를 쓰고, 팝업 너비는 250px입니다.",
            en: "32px tall with body-sm text, and a 250px popup.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 40px에 body-md 문구를 쓰고, 팝업 너비는 314px입니다. 기본값입니다.",
            en: "40px tall with body-md text, and a 314px popup. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 48px에 body-lg 문구를 쓰고, 팝업 너비는 374px입니다.",
            en: "48px tall with body-lg text, and a 374px popup.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "트리거의 바탕입니다. 놓이는 면에 맞춰 고르고, glass일 때 팝업 안 달력도 유리 바탕을 씁니다.",
        en: "Fill of the trigger. Match it to the surface it sits on; on glass the calendar inside the popup uses the glass fill too.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "올라온 표면 위에 쓰는 불투명 바탕입니다. 기본값입니다.",
            en: "An opaque fill for a raised surface. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위에 쓰는 veil field입니다.",
            en: "The veil field, for imagery and glass panels.",
          },
        },
        {
          name: "solid-on-page",
          description: {
            ko: "페이지 바탕 위에 바로 놓을 때 쓰는 불투명 바탕입니다.",
            en: "An opaque fill for sitting directly on the page background.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "팝업 안 달력의 머리말 모양입니다. 트리거 모양은 바뀌지 않습니다.",
        en: "Header shape of the calendar inside the popup. The trigger does not change.",
      },
      values: [
        {
          name: "default",
          description: {
            ko: "가운데 정렬한 월 제목과 양옆 화살표를 씁니다. 기본값입니다.",
            en: "A centered month title with an arrow on each side. The default.",
          },
        },
        {
          name: "popover",
          description: {
            ko: "왼쪽에 붙인 제목과 오른쪽의 둥근 화살표 두 개를 씁니다. 모서리는 20px입니다.",
            en: "A title on the left with two round arrows on the right, and 20px corners.",
          },
        },
      ],
      example: "popover",
    },
    {
      id: "invalid",
      title: { ko: "invalid", en: "invalid" },
      description: {
        ko: "참이면 트리거에 aria-invalid가 붙고 테두리가 위험 색으로 바뀝니다. 날짜가 반드시 필요한 폼에서 비어 있을 때 씁니다.",
        en: "When true the trigger gets aria-invalid and a danger border. Use it while a required date is still empty.",
      },
      example: "states",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 트리거가 흐려지고 팝업이 열리지 않으며 문구가 disabled 색으로 바뀝니다. 지금 날짜를 고를 수 없는 조건을 지우지 않고 이 상태로 남겨 둡니다.",
        en: "When true the trigger dims, the popup never opens and the text turns to the disabled color. Keep an unavailable date field in place this way.",
      },
      example: "states",
    },
    {
      id: "format",
      title: { ko: "format", en: "format" },
      description: {
        ko: "트리거 문구를 만드는 함수입니다. 주지 않으면 로케일에 맞춰 \"Oct 20, 2026\"과 \"Oct 20 – Oct 24, 2026\" 형식을 씁니다.",
        en: "Function that builds the trigger text. Without it the field formats to the locale, as in \"Oct 20, 2026\" and \"Oct 20 – Oct 24, 2026\".",
      },
    },
  ],
  guidelines: [
    {
      id: "field-not-input",
      title: { ko: "날짜는 직접 입력받지 않습니다", en: "Do not ask for a typed date" },
      body: {
        ko: "DateField는 글자를 받지 않고 달력에서 고르게 합니다. 형식이 사람마다 달라 해석이 갈리는 문제를 없애고, keyboard 사용자에게도 달력의 화살표 이동을 그대로 줍니다. 날짜를 외부 시스템에서 받아 온다면 그 값을 value로 넣고 트리거를 읽기 전용으로 둡니다.",
        en: "A DateField takes no typing; the day comes from the calendar. That removes the format ambiguity of typed dates and keeps arrow-key navigation for keyboard users. When the date comes from another system, pass it as value and treat the trigger as read-only.",
      },
      do: {
        ko: "예약 날짜를 달력에서 고르게 합니다.",
        en: "Let people pick a booking date from the calendar.",
      },
      dont: {
        ko: "YYYY-MM-DD를 직접 입력받는 텍스트 필드로 대신하지 않습니다.",
        en: "Do not replace it with a text field that expects YYYY-MM-DD.",
      },
      example: "single",
    },
    {
      id: "range-needs-two-clicks",
      title: { ko: "범위는 두 번의 클릭으로", en: "A range takes two clicks" },
      body: {
        ko: "range에서는 첫 클릭이 start를 정하고 end를 비우며, 두 번째 클릭이 end를 채웁니다. start보다 앞선 날짜를 누르면 범위를 그 날부터 다시 시작합니다. 트리거 문구는 두 날짜가 모두 정해지기 전까지 시작일 하나만 보여 주므로, 폼 검증도 end가 채워졌는지로 판단합니다.",
        en: "In range mode the first click sets start and clears end, and the second fills end. Clicking a day before start restarts the range from that day. The trigger shows only the start day until both are set, so validate a form on whether end is filled.",
      },
      example: "range",
    },
    {
      id: "one-field-per-date",
      title: { ko: "날짜 하나에 필드 하나", en: "One field per date" },
      body: {
        ko: "시작과 끝이 서로 다른 규칙을 가진다면 범위 하나로 묶지 말고 single 필드 두 개를 씁니다. 두 날짜 사이에 계산된 값이 필요하거나 한쪽만 비활성일 때 범위 모드로는 표현할 수 없습니다.",
        en: "When the two ends follow different rules, use two single fields rather than one range. A computed value between them, or one end disabled, has no place in range mode.",
      },
      example: "single",
    },
    {
      id: "popup-is-not-framed",
      title: { ko: "팝업은 문서 흐름 밖에 열립니다", en: "The popup opens outside the flow" },
      body: {
        ko: "달력은 포털로 body에 붙으므로 카드나 스크롤 영역에 갇히지 않습니다. 대신 부모의 overflow로 잘리지 않는 대신, 스크롤 컨테이너 안에서 열면 위치가 따라 움직입니다. 스크롤되는 카드 안에서는 트리거를 카드 위쪽에 두어 열린 달력이 화면 안에 남게 합니다.",
        en: "The calendar mounts to the body through a portal, so a card or scroll area cannot clip it. The trade is that inside a scrolling container it does not follow the trigger, so keep the trigger near the top of a scrolling card to leave the open calendar on screen.",
      },
    },
  ],
  specification: [
    {
      id: "trigger",
      title: { ko: "트리거", en: "Trigger" },
      note: {
        ko: "값은 컴포넌트가 쓰는 토큰 유틸 이름이고, 크기는 그 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names the component uses; sizes are the pixels those utilities produce.",
      },
      rows: [
        { state: "all", slot: "Trigger", property: "width", value: "w-full max-w-70 (280px)" },
        { state: "all", slot: "Trigger", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Trigger", property: "border", value: "border" },
        { state: "sm", slot: "Trigger", property: "height", value: "h-8 (32px)" },
        { state: "sm", slot: "Trigger", property: "padding-x", value: "px-3" },
        { state: "sm", slot: "Trigger", property: "gap", value: "gap-1.5" },
        { state: "sm", slot: "Icon", property: "size", value: "size-4" },
        { state: "sm", slot: "Value text", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Trigger", property: "height", value: "h-10 (40px)" },
        { state: "md", slot: "Trigger", property: "padding-x", value: "px-3.5" },
        { state: "md", slot: "Trigger", property: "gap", value: "gap-2" },
        { state: "md", slot: "Icon", property: "size", value: "size-4" },
        { state: "md", slot: "Value text", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Trigger", property: "height", value: "h-12 (48px)" },
        { state: "lg", slot: "Trigger", property: "padding-x", value: "px-5" },
        { state: "lg", slot: "Trigger", property: "gap", value: "gap-2.5" },
        { state: "lg", slot: "Icon", property: "size", value: "size-5" },
        { state: "lg", slot: "Value text", property: "font", value: "text-body-lg" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "solid", slot: "Trigger", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Trigger", property: "border", value: "border-border-default" },
        { state: "solid-on-page", slot: "Trigger", property: "background", value: "bg-bg-default" },
        { state: "glass", slot: "Trigger", property: "background", value: "veil-field" },
        { state: "hover", slot: "Trigger", property: "border", value: "border-border-strong" },
        { state: "focus", slot: "Trigger", property: "outline", value: "2px outline-text-brand" },
        { state: "focus", slot: "Trigger", property: "outline offset", value: "2px" },
        { state: "invalid", slot: "Trigger", property: "border", value: "border-border-danger" },
        { state: "placeholder", slot: "Value text", property: "text color", value: "text-text-placeholder" },
        { state: "disabled", slot: "Value text", property: "text color", value: "text-text-disabled" },
        { state: "disabled", slot: "Trigger", property: "cursor", value: "not-allowed" },
      ],
    },
    {
      id: "popup",
      title: { ko: "팝업", en: "Popup" },
      rows: [
        { state: "all", slot: "Popover.Positioner", property: "offset", value: "4px" },
        { state: "all", slot: "Popover.Positioner", property: "align", value: "start" },
        { state: "all", slot: "Popover.Positioner", property: "z-index", value: "z-50" },
        { state: "sm", slot: "Calendar", property: "width", value: "w-62.5 (250px)" },
        { state: "md", slot: "Calendar", property: "width", value: "w-78.5 (314px)" },
        { state: "lg", slot: "Calendar", property: "width", value: "w-93.5 (374px)" },
        { state: "all", slot: "Calendar", property: "max width", value: "max-w-[calc(100vw-2rem)]" },
        { state: "all", slot: "Popover.Popup", property: "motion", value: "motion-popup" },
      ],
    },
  ],
  examples: [
    {
      id: "single",
      title: { ko: "날짜 하나", en: "Single date" },
      description: {
        ko: "Date 값 하나를 제어로 들고 트리거 문구로 되받는 기본 형태입니다.",
        en: "The default shape: one Date held in state and echoed back as the trigger text.",
      },
    },
    {
      id: "range",
      title: { ko: "범위", en: "Range" },
      description: {
        ko: "mode=\"range\"로 시작과 끝을 고릅니다. 두 번째 날짜를 고르기 전에는 end가 null입니다.",
        en: "mode=\"range\" for a start and an end, with end staying null until the second day is picked.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기와 surface", en: "Sizes and surfaces" },
      description: {
        ko: "세 높이를 세로로, solid와 glass를 가로로 놓았습니다.",
        en: "The three heights stacked, with solid and glass side by side.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "값이 없는 placeholder, invalid 테두리, disabled 트리거를 나란히 두었습니다.",
        en: "A placeholder with no value, an invalid border and a disabled trigger side by side.",
      },
    },
    {
      id: "popover",
      title: { ko: "popover 달력", en: "Popover calendar" },
      description: {
        ko: "팝업 안 달력을 왼쪽 제목과 둥근 화살표를 쓰는 popover 모양으로 엽니다.",
        en: "Opens the calendar inside the popup in the popover shape, with a left title and round arrows.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "트리거는 button이라 스크린 리더가 버튼으로 읽습니다. 지금 값이나 placeholder가 곧 버튼의 이름이 되므로 무엇을 고르는 날짜인지 문구에 드러나야 합니다. 폼 라벨과 함께 쓸 때는 Field의 라벨을 트리거에 연결합니다.",
        en: "The trigger is a button, and its value or placeholder is its name, so the text has to say which date it sets. In a form, associate a Field label with the trigger.",
      },
      {
        ko: "값이 없을 때도 트리거에 이름이 있어야 하므로 placeholder를 비워 두지 않습니다. 기본값 \"Pick a date\"가 그 역할을 합니다. 선택이 필수라면 invalid와 함께 무엇이 빠졌는지 문구로 알립니다.",
        en: "The trigger needs a name even when empty, so do not blank the placeholder; the default \"Pick a date\" serves that role. When the date is required, pair invalid with text that says what is missing.",
      },
      {
        ko: "달력은 grid 역할과 날짜별 aria-label로 읽히고, 오늘 날짜에는 aria-current가 붙습니다. 키보드 포커스는 한 번에 하루에만 머물고 화살표로 옮깁니다.",
        en: "The calendar is read as a grid with a full aria-label per day, and today carries aria-current. Keyboard focus rests on one day at a time and moves with the arrow keys.",
      },
      {
        ko: "포커스 표시는 트리거에 2px outline을 2px 떨어뜨려 그리고, 달력 안에서는 각 날짜 칸 안쪽에 그립니다. 두 표시 모두 지우지 않습니다.",
        en: "The trigger draws a 2px outline 2px off its edge, and inside the calendar each day draws the ring within its cell. Neither is removed.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter", "Space"],
        action: { ko: "달력을 엽니다.", en: "Opens the calendar." },
      },
      {
        keys: ["Escape"],
        action: { ko: "달력을 닫고 트리거로 포커스를 돌려놓습니다.", en: "Closes the calendar and returns focus to the trigger." },
      },
      {
        keys: ["ArrowLeft", "ArrowRight"],
        action: { ko: "달력 안에서 포커스를 하루 앞뒤로 옮깁니다.", en: "Inside the calendar, moves focus one day back or forward." },
      },
      {
        keys: ["ArrowUp", "ArrowDown"],
        action: { ko: "달력 안에서 포커스를 한 주 앞뒤로 옮깁니다.", en: "Inside the calendar, moves focus one week back or forward." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 놓인 날짜를 고릅니다.", en: "Picks the focused day." },
      },
    ],
  },
};
