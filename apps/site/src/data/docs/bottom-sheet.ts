/**
 * Reference doc for `BottomSheet`, written against
 * `packages/react/src/components/bottom-sheet.tsx` and
 * `packages/flutter/lib/src/components/bottom_sheet.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "bottom-sheet",
  anatomy: {
    description: {
      ko: "BottomSheet은 화면 아래에서 올라오는 시트입니다. 손잡이, 제목, 설정 행과 동작 행이 한 컬럼으로 쌓이고, 열려 있는 동안에만 마운트됩니다.",
      en: "A BottomSheet rises from the bottom of the screen. A grabber, a title, settings rows and an action row stack in one column, and the sheet is mounted only while open.",
    },
    parts: [
      {
        name: "BottomSheet",
        slot: "BottomSheet",
        description: {
          ko: "열림 상태와 닫기를 소유하는 루트입니다. Base UI Drawer의 루트를 그대로 다시 내보냅니다.",
          en: "The root that owns the open state and dismissal. It re-exports Base UI's drawer root unchanged.",
        },
      },
      {
        name: "BottomSheetTrigger",
        slot: "BottomSheetTrigger",
        description: {
          ko: "시트를 여는 요소입니다. render로 기존 버튼을 그대로 트리거로 쓸 수 있습니다.",
          en: "The element that opens the sheet. Use render to make an existing button the trigger.",
        },
      },
      {
        name: "BottomSheetContent",
        slot: "BottomSheetContent",
        description: {
          ko: "시트 본체입니다. 포털에 마운트되는 팝업으로, 최대 높이는 100dvh에서 2rem을 뺀 값입니다.",
          en: "The sheet itself: a portalled popup capped at 100dvh minus 2rem.",
        },
      },
      {
        name: "Grabber",
        slot: "grabber",
        description: {
          ko: "상단 가운데의 36x5px 막대입니다. 장식이라 aria-hidden으로 숨기고, 아래로 끌면 시트가 닫힙니다.",
          en: "The 36x5px bar at the top centre. It is decoration, hidden with aria-hidden, and dragging it down dismisses the sheet.",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "시트 제목입니다. Drawer의 제목 슬롯에 들어가 대화상자의 이름이 됩니다.",
          en: "The sheet title. It fills the drawer's title slot and names the dialog.",
        },
      },
      {
        name: "BottomSheetRow",
        slot: "BottomSheetRow",
        description: {
          ko: "아이콘, 라벨, 현재 값, 캐럿으로 이루어진 48px 행입니다. 시트 안의 설정 항목에 씁니다.",
          en: "A 48px row with an icon, a label, a current value and a caret, for settings inside the sheet.",
        },
      },
      {
        name: "BottomSheetActions",
        slot: "BottomSheetActions",
        description: {
          ko: "시트 아래쪽의 동작 행입니다. 보조 동작이 먼저 오고 주요 동작이 오른쪽 끝에 놓입니다.",
          en: "The action row at the bottom of the sheet: secondary actions first and the primary action at the right edge.",
        },
      },
      {
        name: "BottomSheetAction",
        slot: "BottomSheetAction",
        description: {
          ko: "높이 44px의 알약 버튼입니다. secondary는 6% 잉크 바탕, primary는 잉크 바탕을 씁니다.",
          en: "A 44px pill button: secondary paints a 6% ink fill, primary paints the ink fill.",
        },
      },
    ],
  },
  properties: [
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "BottomSheetContent의 variant는 시트의 구성 방식을, BottomSheetAction의 variant는 버튼의 채움을 정합니다.",
        en: "variant on BottomSheetContent picks the sheet layout; variant on BottomSheetAction picks the button fill.",
      },
      values: [
        {
          name: "panel",
          description: {
            ko: "Figma 패널 시트입니다. 폭이 374px로 제한되고 제목이 label-lg로 들어갑니다. 기본값입니다.",
            en: "The Figma panel sheet: capped at 374px wide with a label-lg title. The default.",
          },
        },
        {
          name: "detail",
          description: {
            ko: "Paper 상세 시트입니다. 폭을 꽉 채우고 18px 리듬을 쓰며, 타일과 제목, 설명으로 된 머리말을 호출자가 만듭니다.",
            en: "The Paper detail sheet: full width, an 18px rhythm, and a header of tile, title and description that the caller builds.",
          },
        },
        {
          name: "primary",
          description: {
            ko: "BottomSheetAction의 채워진 버튼입니다. 시트의 주 동작 하나에 씁니다.",
            en: "The filled BottomSheetAction, for the one main action of the sheet.",
          },
        },
        {
          name: "secondary",
          description: {
            ko: "BottomSheetAction의 6% 잉크 버튼입니다. 취소나 보조 동작에 쓰고 기본값입니다.",
            en: "The 6% ink BottomSheetAction for cancel and secondary actions. The default.",
          },
        },
      ],
      example: "panel-sheet",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "시트의 바탕 재질입니다. glass는 veil 시트로, 뒤가 비치는 유리 위에 놓습니다.",
        en: "The sheet material. glass turns it into the veil sheet for placing over see-through surfaces.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 표면 바탕에 위쪽 모서리 20px를 씁니다. 본문 위에 놓는 기본 시트입니다.",
            en: "An opaque surface fill with 20px top corners, for the default sheet over content.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil-overlay 유리 바탕에 위쪽 모서리 32px를 씁니다. 이미지나 유리 크롬 위에서 씁니다.",
            en: "The veil-overlay glass with 32px top corners, for use over imagery or glass chrome.",
          },
        },
      ],
      example: "glass-sheet",
    },
    {
      id: "backdrop",
      title: { ko: "backdrop", en: "backdrop" },
      description: {
        ko: "참이면 시트 뒤에 32% 스크림과 6px 흐림을 깝니다. Paper의 떠 있는 패널 시트처럼 페이지를 계속 보여 주려면 끕니다.",
        en: "When true a 32% scrim with a 6px blur sits behind the sheet. Turn it off to keep the page visible, as Paper's floating panel sheet does.",
      },
      example: "floating-sheet",
    },
    {
      id: "floating",
      title: { ko: "floating", en: "floating" },
      description: {
        ko: "참이면 시트를 좌우와 아래에서 16px 띄우고 폭을 꽉 채웁니다. 화면에 붙는 도킹 대신 떠 있는 패널이 됩니다.",
        en: "When true the sheet sits 16px off the sides and bottom edge at full width, becoming a floating panel instead of a docked sheet.",
      },
      example: "floating-sheet",
    },
  ],
  guidelines: [
    {
      id: "one-primary",
      title: { ko: "동작 행에는 주요 동작 하나", en: "One primary action per row" },
      body: {
        ko: "동작 행은 오른쪽 끝을 주요 동작 자리로 씁니다. 보조 동작은 왼쪽에 두고, 되돌리기 어려운 동작이라면 확인 단계를 따로 둡니다.",
        en: "The right edge of the action row is the primary slot. Keep secondary actions to its left and give a destructive action its own confirmation step.",
      },
      do: {
        ko: "왼쪽에 취소, 오른쪽에 저장을 두고 저장만 primary로 칠합니다.",
        en: "Put Cancel on the left and Save on the right, and fill only Save as primary.",
      },
      dont: {
        ko: "취소와 저장을 모두 primary로 칠하지 않습니다.",
        en: "Do not fill both Cancel and Save as primary.",
      },
      example: "panel-sheet",
    },
    {
      id: "rows-open-detail",
      title: { ko: "행은 상세로 이어질 때만", en: "Rows lead somewhere" },
      body: {
        ko: "BottomSheetRow는 오른쪽에 캐럿을 항상 그립니다. 그래서 행을 누르면 값 편집이나 상세 화면이 이어져야 하고, 켜고 끄기만 하는 항목에는 맞지 않습니다.",
        en: "BottomSheetRow always draws a trailing caret, so pressing it should lead to a value editor or a detail view. It is the wrong part for a plain on-or-off item.",
      },
      example: "panel-sheet",
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 배경 위에서만", en: "Glass goes over a backdrop" },
      body: {
        ko: "glass 시트는 이미지나 유리 크롬처럼 뒤가 비치는 면 위에만 놓습니다. 불투명한 본문 위에서는 유리 바탕이 드러나지 않아 시트의 경계가 사라집니다.",
        en: "Place a glass sheet only over imagery or glass chrome. Over an opaque page its fill disappears and so does the sheet edge.",
      },
      do: {
        ko: "배경 이미지 위에서 메시지 옵션 시트를 glass로 띄웁니다.",
        en: "Open a message options sheet in glass over a background image.",
      },
      dont: {
        ko: "일반 설정 화면 한가운데에서 glass 시트를 쓰지 않습니다.",
        en: "Do not use a glass sheet in the middle of a plain settings screen.",
      },
      example: "glass-sheet",
    },
    {
      id: "keep-context",
      title: { ko: "맥락을 남길 때는 floating", en: "Keep context with floating" },
      body: {
        ko: "페이지를 계속 보면서 값을 고쳐야 한다면 floating과 backdrop을 끈 조합을 씁니다. 확인이 필요한 흐름이라면 도킹 시트에 스크림을 남깁니다.",
        en: "If the page must stay readable while a value changes, combine floating with backdrop off. For a flow that needs confirmation, keep the docked sheet and its scrim.",
      },
      example: "floating-sheet",
    },
  ],
  specification: [
    {
      id: "sheet-surfaces",
      title: { ko: "바탕과 배치", en: "Surfaces and placement" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "solid", slot: "Popup", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Popup", property: "radius", value: "rounded-t-xl" },
        { state: "solid", slot: "Popup", property: "padding", value: "px-4 pt-2 pb-6" },
        { state: "glass", slot: "Popup", property: "background", value: "veil-overlay" },
        { state: "glass", slot: "Popup", property: "radius", value: "rounded-t-xl" },
        { state: "glass", slot: "Popup", property: "padding", value: "px-4 pt-2 pb-5" },
        { state: "backdrop", slot: "Backdrop", property: "background", value: "bg-bg-scrim/32" },
        { state: "backdrop", slot: "Backdrop", property: "blur", value: "backdrop-blur-[6px]" },
        { state: "all", slot: "Popup", property: "max height", value: "max-h-[calc(100dvh-2rem)]" },
        { state: "all", slot: "Popup", property: "overflow", value: "overflow-clip" },
        { state: "panel", slot: "Popup", property: "max width", value: "max-w-93.5" },
        { state: "panel", slot: "Popup", property: "gap", value: "gap-1" },
        { state: "panel", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "detail", slot: "Popup", property: "gap", value: "gap-4.5" },
        { state: "detail", slot: "Title", property: "layout", value: "flex" },
        { state: "floating", slot: "Viewport", property: "inset", value: "inset-x-4 bottom-4" },
        { state: "floating", slot: "Popup", property: "gap", value: "gap-3" },
        { state: "docked", slot: "Viewport", property: "inset", value: "inset-x-0 bottom-0" },
      ],
    },
    {
      id: "rows",
      title: { ko: "설정 행", en: "Settings rows" },
      rows: [
        { state: "default", slot: "Row", property: "height", value: "h-12" },
        { state: "default", slot: "Row", property: "padding", value: "px-2" },
        { state: "default", slot: "Row", property: "gap", value: "gap-3" },
        { state: "default", slot: "Row", property: "radius", value: "rounded-lg" },
        { state: "hover", slot: "Row", property: "background", value: "bg-overlay-ink-4" },
        { state: "focus-visible", slot: "Row", property: "outline", value: "outline-2 outline-text-brand" },
        { state: "focus-visible", slot: "Row", property: "outline offset", value: "-outline-offset-2" },
        { state: "all", slot: "Icon", property: "size", value: "size-5" },
        { state: "all", slot: "Icon", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Label", property: "font", value: "text-label-md" },
        { state: "all", slot: "Label", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Value", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Value", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Caret", property: "size", value: "size-4" },
      ],
    },
    {
      id: "actions",
      title: { ko: "동작 버튼", en: "Action buttons" },
      rows: [
        { state: "actions", slot: "Row", property: "layout", value: "justify-end" },
        { state: "actions", slot: "Row", property: "gap", value: "gap-2" },
        { state: "actions", slot: "Row", property: "padding", value: "pt-3" },
        { state: "all", slot: "Action", property: "height", value: "h-11" },
        { state: "all", slot: "Action", property: "min width", value: "min-w-25" },
        { state: "all", slot: "Action", property: "padding", value: "px-4" },
        { state: "all", slot: "Action", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Action", property: "font", value: "text-label-md" },
        { state: "secondary", slot: "Action", property: "background", value: "bg-overlay-ink-6" },
        { state: "secondary", slot: "Action", property: "text color", value: "text-text-primary" },
        { state: "primary", slot: "Action", property: "background", value: "bg-interactive-primary" },
        { state: "primary", slot: "Action", property: "text color", value: "text-text-inverse" },
        { state: "focus-visible", slot: "Action", property: "outline", value: "outline-2 outline-offset-2" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        { state: "open", slot: "Popup", property: "motion", value: "transition-[translate]" },
        { state: "open", slot: "Popup", property: "duration", value: "duration-320" },
        { state: "open", slot: "Popup", property: "easing", value: "ease-out-quint" },
        { state: "closed", slot: "Popup", property: "duration", value: "duration-220" },
        { state: "closed", slot: "Popup", property: "easing", value: "ease-in" },
        { state: "closed", slot: "Popup", property: "translate", value: "translate-y-full" },
        {
          state: "grabber",
          slot: "Grabber",
          property: "size",
          value: "h-[5px] w-9",
          note: {
            ko: "완전히 둥근 모서리, 20% 잉크 바탕입니다.",
            en: "A fully rounded bar on a 20% ink fill.",
          },
        },
        {
          state: "reduced motion",
          slot: "Popup",
          property: "motion",
          value: "0.01ms",
          note: {
            ko: "동작 줄이기를 켜면 전역 규칙이 모든 전환을 즉시 끝냅니다.",
            en: "With reduced motion on, the global rule collapses every transition to nothing.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "panel-sheet",
      title: { ko: "패널 시트", en: "Panel sheet" },
      description: {
        ko: "설정 행 세 줄과 동작 행 두 개로 만든 기본 시트입니다. 트리거를 누르면 아래에서 올라옵니다.",
        en: "The default sheet with three settings rows and two actions. Pressing the trigger raises it from the bottom.",
      },
    },
    {
      id: "floating-sheet",
      title: { ko: "떠 있는 시트", en: "Floating sheet" },
      description: {
        ko: "floating과 backdrop을 끈 조합입니다. 시트가 좌우와 아래에서 떨어져 페이지가 계속 보입니다.",
        en: "floating with the backdrop off: the sheet stands off the sides and bottom, so the page stays visible.",
      },
    },
    {
      id: "detail-sheet",
      title: { ko: "상세 시트", en: "Detail sheet" },
      description: {
        ko: "detail 변형은 폭을 꽉 채우고 제목 자리에 타일과 설명을 넣습니다.",
        en: "The detail variant fills the width and takes a tile and description in the title slot.",
      },
    },
    {
      id: "glass-sheet",
      title: { ko: "유리 시트", en: "Glass sheet" },
      description: {
        ko: "이미지 위에 glass 시트와 glass 트리거를 함께 놓았습니다.",
        en: "A glass sheet behind a glass trigger, both over imagery.",
      },
    },
  ],
  accessibility: {
    pattern: {
      label: "WAI-ARIA Dialog (Modal) Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
    },
    notes: [
      {
        ko: "title prop은 필수이고 Drawer의 제목 슬롯에 들어가 대화상자의 이름이 됩니다. 제목 없이 시트를 열면 스크린 리더가 이름 없는 대화상자를 만나므로, 보이는 제목이 없어도 title에 짧은 문구를 넘깁니다.",
        en: "title is required and fills the drawer's title slot, naming the dialog. A sheet without it leaves screen readers in an unnamed dialog, so pass a short phrase even when the heading is visually hidden.",
      },
      {
        ko: "손잡이는 장식이라 aria-hidden입니다. 끌어서 닫는 동작은 보조 수단이고, 스크림 누르기와 Escape가 같은 결과를 냅니다.",
        en: "The grabber is decoration and is hidden with aria-hidden. Dragging is an extra path; pressing the scrim and Escape reach the same result.",
      },
      {
        ko: "시트가 열리면 포커스가 안으로 들어가고 Tab은 시트 안에서만 순환합니다. 닫으면 포커스가 트리거로 돌아갑니다.",
        en: "When the sheet opens, focus moves inside and Tab cycles within it. Closing returns focus to the trigger.",
      },
      {
        ko: "공간이 좁아 동작 행이 두 줄로 접힙니다. 두 버튼의 순서와 이름은 그대로이므로 키보드 사용자는 배치와 무관하게 같은 순서로 만납니다.",
        en: "The action row wraps onto a second line in narrow space. Order and names stay the same, so keyboard users meet the same sequence regardless of layout.",
      },
    ],
    keyboard: [
      {
        keys: ["Escape"],
        action: { ko: "시트를 닫고 포커스를 트리거로 돌립니다.", en: "Closes the sheet and returns focus to the trigger." },
      },
      {
        keys: ["Tab"],
        action: { ko: "시트 안의 다음 컨트롤로 이동합니다.", en: "Moves to the next control inside the sheet." },
      },
      {
        keys: ["Shift+Tab"],
        action: { ko: "시트 안의 이전 컨트롤로 이동합니다.", en: "Moves to the previous control inside the sheet." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 있는 행이나 동작 버튼을 실행합니다.", en: "Runs the focused row or action button." },
      },
    ],
  },
};
