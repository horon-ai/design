/**
 * Reference doc for `Calendar`, written against
 * `packages/react/src/components/calendar.tsx` and
 * `packages/flutter/lib/src/components/calendar.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "calendar",
  anatomy: {
    description: {
      ko: "Calendar는 한 달을 격자로 그려 날짜 하나 또는 시작과 끝 두 날짜를 고르는 컨트롤입니다. 머리말의 월 제목과 화살표, 요일 줄, 날짜 격자가 위에서 아래로 놓입니다.",
      en: "A Calendar lays one month out as a grid for picking a single day or a start and an end. Down the frame sit the month title with its arrows, the weekday row and the day grid.",
    },
    parts: [
      {
        name: "Frame",
        slot: "container",
        description: {
          ko: "달력 전체를 감싸는 상자입니다. 두 변형 모두 모서리 20px이고, surface가 바탕과 테두리를 정합니다.",
          en: "The box around the whole calendar. Both variants use 20px corners, and the surface decides the fill and border.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "월 제목과 이전·다음 달 화살표입니다. 달이 바뀌면 제목이 fade-in으로 나타나고 aria-live로 읽힙니다.",
          en: "The month title and the previous and next arrows. On a month change the title fades in and is announced through aria-live.",
        },
      },
      {
        name: "Weekday row",
        slot: "columnheader",
        description: {
          ko: "요일 머리글 일곱 칸입니다. 각 언어의 좁은 요일 이름을 secondary 색 caption으로 씁니다.",
          en: "The seven weekday headers, using each locale's narrow weekday names in secondary caption text.",
        },
      },
      {
        name: "Day grid",
        slot: "gridcell",
        description: {
          ko: "날짜 버튼 격자입니다. 각 칸은 정사각형에 가깝고, 이번 달 밖의 날짜는 placeholder 색으로 흐려집니다.",
          en: "The grid of day buttons. Each cell is close to square, and days outside the month fade to the placeholder color.",
        },
      },
      {
        name: "Today dot",
        slot: "dot",
        description: {
          ko: "오늘 칸 아래쪽에 붙는 4px 점입니다. 오늘이 선택되었거나 범위 안에 있으면 그리지 않습니다.",
          en: "A 4px dot near the bottom of today's cell. It is not drawn when today is selected or inside the range.",
        },
      },
    ],
  },
  properties: [
    {
      id: "mode",
      title: { ko: "mode", en: "mode" },
      description: {
        ko: "값의 모양을 정합니다. onValueChange는 언제나 value와 같은 모양으로 값을 돌려줍니다.",
        en: "Shape of the value. onValueChange always hands back a value of the same shape.",
      },
      values: [
        {
          name: "single",
          description: {
            ko: "날짜 하나를 고릅니다. value는 Date이거나 null입니다. 기본값입니다.",
            en: "Picks one day. value is a Date or null. The default.",
          },
        },
        {
          name: "range",
          description: {
            ko: "시작과 끝을 고릅니다. 첫 클릭이 start를 정하고 end를 비우며, 두 번째 클릭이 end를 채웁니다. start보다 앞선 날짜를 누르면 범위를 그 날부터 다시 시작합니다.",
            en: "Picks a start and an end. The first click sets start and clears end, the second fills end, and a click before start restarts the range at that day.",
          },
        },
      ],
      example: "range",
    },
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "머리말 배치와 모서리를 정합니다. 같은 격자를 쓰고 틀만 다릅니다.",
        en: "Header layout and corner radius. Both variants share the same grid and differ only in the frame.",
      },
      values: [
        {
          name: "default",
          description: {
            ko: "가운데 정렬한 월 제목과 양옆의 화살표를 쓰고 모서리를 20px로 둡니다. 페이지에 놓는 달력에 씁니다.",
            en: "A centered month title with an arrow on each side and 20px corners, for a calendar placed on a page.",
          },
        },
        {
          name: "popover",
          description: {
            ko: "왼쪽 제목과 오른쪽의 둥근 화살표 두 개, 20px 모서리를 쓰고 요일 글자를 label 눈금으로 그립니다. DateField 팝업 안의 달력이 이 모양입니다.",
            en: "A left title with two round arrows on the right, 20px corners and weekday text on the label scale. This is the calendar inside a DateField popup.",
          },
        },
      ],
      example: "popover",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "달력의 바탕 재질입니다. 놓이는 면에 맞춰 고릅니다.",
        en: "Material of the calendar fill. Match it to where the calendar sits.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 표면 바탕에 기본 테두리를 두릅니다. 기본값입니다.",
            en: "An opaque surface fill with a default border. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil-overlay 바탕을 씁니다. DateField 팝업이 쓰는 재질이라 떠 있는 면 위에서 뒤가 비칩니다.",
            en: "The veil-overlay fill. This is the material of the DateField popup, so it shows what is behind on a floating surface.",
          },
        },
        {
          name: "flat",
          description: {
            ko: "유리 레이어 없이 80% 흰 바탕만 씁니다. Paper의 Schedule 미니 달력처럼 기존 두꺼운 유리 느낌을 유지해야 할 때 씁니다.",
            en: "The 80% white fill of the old thick glass without a glass layer, for places that keep that look such as Paper's schedule mini calendar.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "날짜 칸 크기입니다. 머리말, 안쪽 여백, 요일 줄, 날짜 글자가 함께 커지거나 작아집니다.",
        en: "Day-cell size. The header, padding, weekday row and day text scale with it.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "날짜 칸 32px에 body-sm 글자를 씁니다. 좁은 자리에 맞습니다.",
            en: "32px cells with body-sm text, for a narrow place.",
          },
        },
        {
          name: "md",
          description: {
            ko: "날짜 칸 40px에 body-md 글자를 씁니다. 기본값입니다.",
            en: "40px cells with body-md text. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "날짜 칸 48px에 body-lg 글자를 씁니다. 손가락이 주 입력인 화면에 맞습니다.",
            en: "48px cells with body-lg text, for touch-first screens.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "weekStartsOn",
      title: { ko: "weekStartsOn", en: "weekStartsOn" },
      description: {
        ko: "한 주가 시작하는 요일입니다. 0은 일요일이고 1은 월요일입니다. 기본값은 0이며, 지역 관습에 맞춰 1로 바꿉니다.",
        en: "Weekday the week starts on: 0 for Sunday, 1 for Monday. It defaults to 0; switch to 1 where the locale starts on Monday.",
      },
      example: "sizes",
    },
    {
      id: "highlight",
      title: { ko: "highlight", en: "highlight" },
      description: {
        ko: "옅은 잉크 원으로 표시할 날짜 목록입니다. 일정 카드가 보여 주는 주처럼 배경 정보를 표시할 때 씁니다. 선택된 날짜에는 그리지 않습니다.",
        en: "Days drawn as subtle ink circles, for background information such as the week a schedule covers. Selection draws over them and hides them.",
      },
      example: "highlight",
    },
    {
      id: "isDateDisabled",
      title: { ko: "isDateDisabled", en: "isDateDisabled" },
      description: {
        ko: "참을 돌려준 날짜를 비활성으로 그립니다. 비활성 날짜는 고를 수 없고 글자가 disabled 색으로 흐려집니다. 지난 날짜나 이미 예약된 날짜를 막을 때 씁니다.",
        en: "Days for which it returns true render disabled: they cannot be picked and their text fades. Use it to block past days or days already taken.",
      },
      example: "highlight",
    },
    {
      id: "month",
      title: { ko: "month", en: "month" },
      description: {
        ko: "보이는 달을 바깥에서 정합니다. 값을 주면 화살표와 키보드 이동이 onMonthChange로만 보고하고 달력은 달 상태를 스스로 들지 않습니다.",
        en: "The visible month, controlled from outside. While it is set, the arrows and keyboard movement only report through onMonthChange and the calendar keeps no month of its own.",
      },
    },
  ],
  guidelines: [
    {
      id: "frame-versus-popup",
      title: { ko: "페이지에는 default, 팝업에는 popover", en: "Default on a page, popover inside a popup" },
      body: {
        ko: "default는 달력이 페이지의 한 덩어리로 놓일 때 쓰고, popover는 작은 팝업 안에 들어갈 때 씁니다. popover는 모서리를 키우고 머리말을 왼쪽으로 옮겨 팝업 테두리와 겹치지 않게 합니다.",
        en: "Use default when the calendar is a block on the page, and popover when it lives inside a small popup. The popover variant grows its corners and moves the title left so it does not collide with the popup edge.",
      },
      do: {
        ko: "DateField가 여는 달력에는 popover를 씁니다.",
        en: "Use popover for the calendar a DateField opens.",
      },
      dont: {
        ko: "팝업 안에 default 달력을 그대로 넣지 않습니다.",
        en: "Do not drop a default calendar into a popup.",
      },
      example: "popover",
    },
    {
      id: "calendar-versus-date-field",
      title: { ko: "항상 보이는 달력은 Calendar, 필요할 때 여는 달력은 DateField", en: "Always-on calendar or one that opens" },
      body: {
        ko: "화면에서 날짜가 계속 보여야 하면 Calendar를 그대로 놓습니다. 폼 칸 하나를 채우는 용도라면 달력을 띄우고 트리거 문구로 값을 보여 주는 DateField를 씁니다. 달력은 좁은 자리에서 가로로 스크롤되므로, 폼 안에 그대로 넣으면 칸 배치가 흐트러집니다.",
        en: "Place a Calendar directly when the date must stay visible. When it fills one form slot, use a DateField that opens the calendar and shows the value in its trigger. A calendar scrolls sideways when squeezed, so dropping one into a form row breaks the layout.",
      },
      do: {
        ko: "예약 화면의 큰 달력에는 Calendar를 씁니다.",
        en: "Use a Calendar for the large calendar on a booking screen.",
      },
      dont: {
        ko: "폼의 한 칸에 달력을 그대로 넣지 않습니다.",
        en: "Do not put a bare calendar into a single form slot.",
      },
      example: "single",
    },
    {
      id: "disable-what-cannot-be-picked",
      title: { ko: "고를 수 없는 날짜는 지우지 말고 비활성으로", en: "Disable days instead of hiding them" },
      body: {
        ko: "지난 날짜나 예약이 찬 날짜를 격자에서 빼면 주가 바뀌어 사용자가 날짜를 다시 세게 됩니다. isDateDisabled로 그리되 자리는 남겨 두면 한 달이 그대로 읽힙니다.",
        en: "Removing unpickable days from the grid shifts the weeks and makes people recount dates. Render them with isDateDisabled and keep their place so the month still reads correctly.",
      },
      example: "highlight",
    },
    {
      id: "one-month-at-a-time",
      title: { ko: "한 번에 한 달", en: "One month at a time" },
      body: {
        ko: "달력은 한 달만 그립니다. 두 달을 나란히 보여 주려면 Calendar를 두 개 놓고 month를 같은 값에서 한 달씩 더해 제어합니다. 각 달력에서 고른 값은 하나의 상태로 모아야 범위가 이어집니다.",
        en: "The calendar draws a single month. For two months side by side, render two and control month from one value, offset by a month each; keep one shared selection state so a range can span them.",
      },
    },
  ],
  specification: [
    {
      id: "frame",
      title: { ko: "틀", en: "Frame" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 괄호 안은 그 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; the parentheses give the pixels they produce.",
      },
      rows: [
        { state: "default · sm", slot: "Frame", property: "width", value: "w-full max-w-62.5 (250px)" },
        { state: "default · sm", slot: "Frame", property: "padding", value: "p-3" },
        { state: "default · sm", slot: "Frame", property: "gap", value: "gap-2" },
        { state: "default · md", slot: "Frame", property: "width", value: "w-full max-w-78.5 (314px)" },
        { state: "default · md", slot: "Frame", property: "padding", value: "p-4" },
        { state: "default · md", slot: "Frame", property: "gap", value: "gap-3" },
        { state: "default · lg", slot: "Frame", property: "width", value: "w-full max-w-93.5 (374px)" },
        { state: "default · lg", slot: "Frame", property: "padding", value: "p-4.5" },
        { state: "default · lg", slot: "Frame", property: "gap", value: "gap-3.5" },
        { state: "default", slot: "Frame", property: "radius", value: "rounded-xl" },
        { state: "popover · sm", slot: "Frame", property: "width", value: "w-62 max-w-[calc(100vw-2rem)]" },
        { state: "popover · md", slot: "Frame", property: "width", value: "w-77 max-w-[calc(100vw-2rem)]" },
        { state: "popover · lg", slot: "Frame", property: "width", value: "w-92 max-w-[calc(100vw-2rem)]" },
        { state: "popover", slot: "Frame", property: "radius", value: "rounded-xl" },
        {
          state: "default · narrow",
          slot: "Frame",
          property: "padding · gap",
          value: "max-sm:p-2, max-sm:gap-1",
          note: {
            ko: "sm 아래 화면에서는 여백과 칸 간격을 줄여 날짜 칸이 28px 아래로 내려가지 않게 합니다.",
            en: "Below sm the padding and gaps shrink so no day cell drops under 28px.",
          },
        },
      ],
    },
    {
      id: "titles-and-day-cells",
      title: { ko: "제목과 날짜 칸", en: "Titles and day cells" },
      rows: [
        { state: "default · sm", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "default · md", slot: "Title", property: "font", value: "text-title-sm" },
        { state: "default · lg", slot: "Title", property: "font", value: "text-title-md" },
        { state: "default · all", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "popover · sm", slot: "Title", property: "font", value: "text-label-md" },
        { state: "popover · md", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "popover · lg", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "all", slot: "Weekday row", property: "font", value: "text-caption" },
        { state: "all", slot: "Weekday row", property: "text color", value: "text-text-secondary" },
        { state: "sm", slot: "Day cell", property: "max size", value: "max-w-8 (32px)" },
        { state: "md", slot: "Day cell", property: "max size", value: "max-w-10 (40px)" },
        { state: "lg", slot: "Day cell", property: "max size", value: "max-w-12 (48px)" },
        { state: "all", slot: "Day cell", property: "minimum size", value: "min-w-7 (28px)" },
        { state: "all", slot: "Day cell", property: "shape", value: "aspect-square" },
        { state: "sm", slot: "Day text", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Day text", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Day text", property: "font", value: "text-body-lg" },
      ],
    },
    {
      id: "day-states",
      title: { ko: "날짜 칸 상태", en: "Day states" },
      rows: [
        { state: "default", slot: "Day cell", property: "text color", value: "text-text-primary" },
        { state: "hover", slot: "Day cell", property: "background", value: "bg-overlay-ink-5" },
        { state: "selected", slot: "Day cell", property: "background", value: "bg-interactive-primary" },
        { state: "selected", slot: "Day cell", property: "text color", value: "text-text-inverse" },
        {
          state: "selected",
          slot: "Day text",
          property: "font",
          value: "text-label-md / text-label-lg",
          note: {
            ko: "선택된 날짜만 label 눈금으로 굵어집니다.",
            en: "Only the selected day steps up to the label weight.",
          },
        },
        { state: "in range", slot: "Day cell", property: "background", value: "bg-overlay-ink-8" },
        { state: "in range", slot: "Day cell", property: "shape", value: "square, no rounded-full" },
        { state: "highlight", slot: "Day cell", property: "background", value: "bg-overlay-ink-6" },
        { state: "outside month", slot: "Day cell", property: "text color", value: "text-text-placeholder" },
        { state: "today", slot: "Day cell", property: "text color", value: "text-text-brand" },
        { state: "today", slot: "Dot", property: "background", value: "bg-status-live" },
        { state: "today", slot: "Dot", property: "size", value: "size-1 (4px)" },
        { state: "disabled", slot: "Day cell", property: "text color", value: "text-text-disabled" },
        { state: "disabled", slot: "Day cell", property: "cursor", value: "not-allowed" },
        { state: "focus-visible", slot: "Day cell", property: "outline", value: "2px outline-text-brand" },
        {
          state: "focus-visible",
          slot: "Day cell",
          property: "outline offset",
          value: "2px inward",
          note: {
            ko: "칸 안쪽으로 그려 이웃 칸을 침범하지 않습니다.",
            en: "Drawn inside the cell so it never crosses into a neighbor.",
          },
        },
      ],
    },
    {
      id: "surface-and-motion",
      title: { ko: "바탕과 모션", en: "Surface and motion" },
      rows: [
        { state: "solid", slot: "Frame", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Frame", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Frame", property: "background", value: "veil-overlay" },
        { state: "flat", slot: "Frame", property: "background", value: "bg-glass-thick" },
        { state: "all", slot: "Arrow", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Arrow", property: "background", value: "bg-overlay-ink-6" },
        { state: "hover", slot: "Arrow", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Arrow", property: "motion", value: "motion-press" },
        { state: "month change", slot: "Grid", property: "motion", value: "animate-slide-shift-next / animate-slide-shift-prev" },
        { state: "month change", slot: "Title", property: "motion", value: "animate-fade-in" },
        {
          state: "all",
          slot: "Day cell",
          property: "transition",
          value: "motion-colors",
          note: {
            ko: "동작 줄이기를 켜면 이동 애니메이션이 즉시 끝납니다.",
            en: "With reduced motion on the month slide finishes instantly.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "single",
      title: { ko: "날짜 하나", en: "Single date" },
      description: {
        ko: "값 하나를 제어로 들고 오늘을 aria-current로 표시하는 기본 형태입니다.",
        en: "The default shape: one value held in state, with today marked through aria-current.",
      },
    },
    {
      id: "range",
      title: { ko: "범위", en: "Range" },
      description: {
        ko: "mode=\"range\"에서 시작과 끝 사이의 날짜가 이어진 띠로 그려집니다.",
        en: "In mode=\"range\" the days between the two ends draw as one band.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 칸 크기를 같은 달로 비교합니다.",
        en: "The sm, md and lg cell sizes over the same month.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "surface", en: "Surfaces" },
      description: {
        ko: "solid, glass, flat 세 바탕을 놓았습니다. glass는 뒤가 비치는 면 위에서만 구분됩니다.",
        en: "The solid, glass and flat fills together. Glass only reads as a fill over a backdrop.",
      },
    },
    {
      id: "highlight",
      title: { ko: "강조와 비활성 날짜", en: "Highlighted and disabled days" },
      description: {
        ko: "한 주를 highlight로 표시하고 주말을 isDateDisabled로 막았습니다.",
        en: "One week marked through highlight, with weekends blocked by isDateDisabled.",
      },
    },
    {
      id: "popover",
      title: { ko: "popover 틀", en: "Popover frame" },
      description: {
        ko: "왼쪽 제목과 둥근 화살표를 쓰는 popover 변형입니다.",
        en: "The popover variant with its left title and round arrows.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Grid Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/" },
    notes: [
      {
        ko: "격자는 role=grid에 월 제목을 이름으로 갖고, 요일 줄과 주마다 role=row, 날짜마다 role=gridcell을 씁니다. 각 날짜는 \"Friday, October 23, 2026\" 같은 전체 날짜를 aria-label로 읽고, 선택 여부는 aria-selected로, 오늘은 aria-current로 알립니다.",
        en: "The grid carries role=grid named by the month title, with role=row for the weekday row and every week and role=gridcell for each day. A day reads a full date through aria-label, its selection through aria-selected and today through aria-current.",
      },
      {
        ko: "격자 전체에서 탭 순서를 받는 칸은 하나뿐입니다. 포커스가 놓인 날짜만 tabIndex 0을 갖고 나머지는 -1이라, 표 전체를 지나가지 않고 한 번에 들어와 한 번에 나갑니다.",
        en: "Only one cell in the whole grid is in the tab order: the focused day has tabIndex 0 and the rest -1, so the table takes one tab to enter and one to leave.",
      },
      {
        ko: "월 제목은 aria-live=polite 영역이라 화살표로 달을 넘기면 새 달이 스크린 리더에 읽힙니다. 포커스가 경계를 넘어 다음 달로 이동할 때도 같은 방식으로 알립니다.",
        en: "The month title is an aria-live=polite region, so moving with the arrows announces the new month. The same announcement follows focus crossing into another month.",
      },
      {
        ko: "오늘은 글자색과 점으로 함께 표시하고 선택은 채워진 원으로 표시합니다. 두 표시가 겹치지 않도록 오늘이 선택되면 점을 그리지 않습니다.",
        en: "Today shows in both text color and a dot, while selection shows as a filled circle. The dot is dropped once today is selected so the two marks never collide.",
      },
    ],
    keyboard: [
      {
        keys: ["ArrowLeft"],
        action: { ko: "포커스를 하루 앞으로 옮기고 필요하면 지난달로 넘깁니다.", en: "Moves focus one day back, into the previous month when needed." },
      },
      {
        keys: ["ArrowRight"],
        action: { ko: "포커스를 하루 뒤로 옮기고 필요하면 다음 달로 넘깁니다.", en: "Moves focus one day forward, into the next month when needed." },
      },
      {
        keys: ["ArrowUp"],
        action: { ko: "포커스를 한 주 앞으로 옮깁니다.", en: "Moves focus one week back." },
      },
      {
        keys: ["ArrowDown"],
        action: { ko: "포커스를 한 주 뒤로 옮깁니다.", en: "Moves focus one week forward." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 놓인 날짜를 고릅니다.", en: "Picks the focused day." },
      },
      {
        keys: ["Tab"],
        action: { ko: "포커스가 놓인 날짜에서 격자 밖으로 나갑니다.", en: "Leaves the grid from the focused day." },
      },
    ],
  },
};
