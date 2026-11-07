/**
 * Reference doc for `CommandPalette`, written against
 * `packages/react/src/components/command-palette.tsx` and
 * `packages/flutter/lib/src/components/command_palette.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "command-palette",
  anatomy: {
    description: {
      ko: "CommandPalette는 화면 위쪽에 열리는 검색 대화상자입니다. 검색 행, 구분선, 결과 묶음과 키 힌트 바닥글이 세로로 쌓입니다.",
      en: "A CommandPalette is a search dialog that opens near the top of the screen. A search row, a divider, grouped results and a key-hint footer stack vertically.",
    },
    parts: [
      {
        name: "CommandPalette",
        slot: "CommandPalette",
        description: {
          ko: "대화상자 상태와 스크림, 팝업을 담는 루트입니다. open과 onOpenChange로 제어하거나 trigger로 엽니다.",
          en: "The root holding the dialog state, the scrim and the popup. Control it with open and onOpenChange, or open it from trigger.",
        },
      },
      {
        name: "Search row",
        slot: "Input",
        description: {
          ko: "돋보기, 검색 입력, 닫기 컨트롤로 이루어진 48px 행입니다. placeholder가 대화상자의 이름도 겸합니다.",
          en: "A 48px row of magnifier, search input and close control. Its placeholder also names the dialog.",
        },
      },
      {
        name: "Divider",
        slot: "divider",
        description: {
          ko: "검색 행과 결과 사이의 1px 선입니다.",
          en: "The 1px rule between the search row and the results.",
        },
      },
      {
        name: "Group label",
        slot: "GroupLabel",
        description: {
          ko: "결과 묶음 위의 caption 제목입니다. 묶음은 넘긴 순서대로 그려집니다.",
          en: "A caption heading above a group of results. Groups render in the order they are passed.",
        },
      },
      {
        name: "Result row",
        slot: "Item",
        description: {
          ko: "타일, 라벨, 보조 문구, 오른쪽 힌트로 이루어진 44px 행입니다. 첫 행이 처음부터 강조됩니다.",
          en: "A 44px row of tile, label, meta text and a trailing hint. The first row is highlighted from the start.",
        },
      },
      {
        name: "Empty",
        slot: "empty",
        description: {
          ko: "검색 결과가 없을 때 나오는 문구입니다. 기본값은 No results입니다.",
          en: "The message shown when the query matches nothing. It defaults to No results.",
        },
      },
      {
        name: "Footer",
        slot: "hints",
        description: {
          ko: "이동과 열기 같은 키 힌트를 나열하는 바닥글입니다. 키보드 힌트를 쓰지 않는 기기에서는 사라집니다.",
          en: "A footer listing key hints such as move and open. It disappears on devices that show no keyboard hints.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "팝업의 재질입니다. solid는 테두리와 palette 그림자를, glass는 veil 유리를 씁니다.",
        en: "The popup material. solid adds the border and palette shadow; glass uses the veil.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "표면 바탕에 기본 테두리와 palette 그림자를 씁니다. 기본값입니다.",
            en: "A surface fill with the default border and the palette shadow. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil 유리 바탕을 써서 이미지나 유리 크롬 위에서도 팔레트가 읽힙니다.",
            en: "The veil glass fill, keeping the palette readable over imagery and glass chrome.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "open",
      title: { ko: "open", en: "open" },
      description: {
        ko: "대화상자의 열림 상태입니다. 제어하지 않으면 trigger가 열고, 행을 고르거나 Escape를 누르거나 스크림을 누르면 닫힙니다.",
        en: "The dialog's open state. When left uncontrolled the trigger opens it, and selecting a row, pressing Escape or pressing the scrim closes it.",
      },
      example: "basic",
    },
    {
      id: "hints",
      title: { ko: "hints", en: "hints" },
      description: {
        ko: "바닥글에 놓을 키와 설명의 쌍입니다. useDevice가 키보드 힌트를 쓰지 않는 기기로 판단하면 바닥글과 행의 힌트가 함께 사라집니다.",
        en: "Pairs of key and label for the footer. When useDevice reports a device without keyboard hints, the footer and the row hints both disappear.",
      },
      example: "basic",
    },
  ],
  guidelines: [
    {
      id: "label-and-keywords",
      title: { ko: "라벨과 keywords를 함께", en: "Label plus keywords" },
      body: {
        ko: "검색은 라벨과 keywords를 합친 문자열에서 대소문자를 가리지 않고 찾습니다. 화면에 보이지 않는 줄임말이나 경로는 keywords에 넣습니다.",
        en: "The query matches against the label and keywords together, ignoring case. Put abbreviations and paths that are not shown into keywords.",
      },
      example: "groups",
    },
    {
      id: "controlled-close",
      title: { ko: "행을 고르면 닫히도록 open을 제어합니다", en: "Control open so a choice closes it" },
      body: {
        ko: "행을 고르면 팔레트는 onOpenChange(false)를 호출합니다. open을 제어하지 않으면 이 호출이 상태를 바꾸지 않아 팔레트가 열린 채 남습니다.",
        en: "Selecting a row calls onOpenChange(false). Left uncontrolled, that call changes nothing and the palette stays open.",
      },
      example: "basic",
    },
    {
      id: "grouped-results",
      title: { ko: "결과는 두세 묶음으로", en: "Two or three groups" },
      body: {
        ko: "묶음 제목은 결과가 어떤 종류인지 알려 줍니다. 봇, 프로젝트, 동작처럼 두세 묶음으로 나누고, 묶음이 하나뿐이면 제목을 붙이지 않는 편이 읽기 쉽습니다.",
        en: "A group heading tells the user what kind of result it holds. Split into two or three, such as bots, projects and actions; a single group reads better without a heading.",
      },
      example: "groups",
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 배경 위에서만", en: "Glass only over a backdrop" },
      body: {
        ko: "glass 팔레트는 뒤가 비치는 면 위에서 유리 바탕이 보입니다. 페이지 본문 위에서는 solid를 써서 스크림과 팔레트의 경계를 분명히 합니다.",
        en: "A glass palette shows its fill over a see-through backdrop. On a plain page use solid so the scrim and the palette stay distinct.",
      },
      example: "glass",
    },
  ],
  specification: [
    {
      id: "popup",
      title: { ko: "팝업과 스크림", en: "Popup and scrim" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "viewport", slot: "Viewport", property: "position", value: "fixed inset-0 pt-24" },
        { state: "viewport", slot: "Viewport", property: "alignment", value: "items-start justify-center px-2" },
        { state: "backdrop", slot: "Backdrop", property: "background", value: "bg-bg-scrim/32" },
        { state: "backdrop", slot: "Backdrop", property: "blur", value: "backdrop-blur-[6px]" },
        { state: "all", slot: "Popup", property: "width", value: "w-full max-w-140" },
        { state: "all", slot: "Popup", property: "radius", value: "rounded-[24px]" },
        { state: "all", slot: "Popup", property: "padding", value: "p-1.5" },
        { state: "all", slot: "Popup", property: "motion", value: "motion-popup duration-240" },
        { state: "enter", slot: "Popup", property: "offset", value: "translate-y-2" },
        { state: "solid", slot: "Popup", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Popup", property: "border", value: "border border-border-default" },
        { state: "solid", slot: "Popup", property: "shadow", value: "shadow-palette" },
        { state: "glass", slot: "Popup", property: "background", value: "veil-overlay" },
      ],
    },
    {
      id: "search-row",
      title: { ko: "검색 행", en: "Search row" },
      rows: [
        { state: "all", slot: "Row", property: "height", value: "h-12" },
        { state: "all", slot: "Row", property: "padding", value: "px-3" },
        { state: "all", slot: "Row", property: "gap", value: "gap-2.5" },
        { state: "all", slot: "Search icon", property: "size", value: "size-5" },
        { state: "all", slot: "Search icon", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Input", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Input", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Input", property: "placeholder color", value: "placeholder:text-text-secondary" },
        { state: "all", slot: "Divider", property: "border", value: "h-px bg-overlay-ink-8" },
        { state: "keyboard close", slot: "Close", property: "content", value: "Kbd Escape" },
        { state: "touch close", slot: "Close", property: "size", value: "size-7" },
        { state: "touch close", slot: "Close", property: "radius", value: "rounded-full" },
      ],
    },
    {
      id: "results",
      title: { ko: "결과", en: "Results" },
      rows: [
        { state: "empty", slot: "Empty", property: "padding", value: "px-3 py-4" },
        { state: "empty", slot: "Empty", property: "font", value: "text-body-sm" },
        { state: "all", slot: "List", property: "max height", value: "max-h-[min(60dvh,24rem)]" },
        { state: "all", slot: "Group label", property: "padding", value: "px-3 pt-1 pb-1" },
        { state: "all", slot: "Group label", property: "font", value: "text-caption" },
        { state: "all", slot: "Item", property: "height", value: "h-11" },
        { state: "all", slot: "Item", property: "padding", value: "px-3" },
        { state: "all", slot: "Item", property: "gap", value: "gap-2.5" },
        { state: "all", slot: "Item", property: "radius", value: "rounded-md" },
        { state: "highlighted", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "all", slot: "Item label", property: "font", value: "text-label-md" },
        { state: "all", slot: "Item meta", property: "font", value: "text-caption" },
        { state: "all", slot: "Item meta", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Tile", property: "size", value: "size-7" },
        { state: "all", slot: "Tile", property: "radius", value: "rounded-sm" },
        { state: "default tile", slot: "Tile", property: "background", value: "bg-interactive-primary" },
        { state: "default tile", slot: "Tile", property: "text color", value: "text-interactive-on-primary" },
        { state: "all", slot: "Footer", property: "padding", value: "px-3 pt-2 pb-1" },
        { state: "all", slot: "Footer", property: "font", value: "text-caption" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본 팔레트", en: "Basic palette" },
      description: {
        ko: "open을 제어하고 바닥글에 이동과 열기 힌트를 붙인 팔레트입니다.",
        en: "A palette with controlled open state and move and open hints in the footer.",
      },
    },
    {
      id: "groups",
      title: { ko: "묶음과 키워드", en: "Groups and keywords" },
      description: {
        ko: "프로젝트와 동작 두 묶음, 타일, 검색에만 쓰이는 keywords, 행 힌트를 함께 보여 줍니다.",
        en: "Two groups, tiles, keywords that only the search reads, and per-row hints.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 팔레트", en: "Glass palette" },
      description: {
        ko: "이미지 위에서 glass 팔레트를 엽니다. 스크림은 그대로 남습니다.",
        en: "A glass palette over imagery. The scrim stays in place.",
      },
    },
    {
      id: "trigger",
      title: { ko: "트리거로 열기", en: "Opened from a trigger" },
      description: {
        ko: "trigger에 DialogTrigger를 넘겨 열림 상태를 직접 관리하지 않는 형태입니다.",
        en: "A DialogTrigger passed as trigger, leaving the open state to the dialog.",
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
        ko: "placeholder가 대화상자의 aria-label이 됩니다. Search처럼 짧은 값 대신 무엇을 찾는지 적은 문구를 넘깁니다.",
        en: "The placeholder becomes the dialog's aria-label, so pass something like Search bots and actions rather than a bare Search.",
      },
      {
        ko: "입력은 목록을 필터링하고 첫 행이 자동으로 강조됩니다. 방향키로 강조를 옮기고 Enter로 고릅니다.",
        en: "The input filters the list and the first row is highlighted automatically. Arrow keys move the highlight and Enter picks it.",
      },
      {
        ko: "키보드 힌트를 쓰지 않는 기기에서는 esc 칩 대신 이름이 붙은 X 버튼이 나오고, 행 힌트와 바닥글이 사라집니다. 터치만 있는 기기에 키 안내를 남기지 않습니다.",
        en: "On a device without keyboard hints, a labelled X button replaces the esc chip and the row and footer hints disappear, so no key instructions remain on a touch-only device.",
      },
      {
        ko: "팔레트가 열리면 포커스가 입력에 놓이고 Tab은 팔레트 안에서만 움직입니다. 닫으면 포커스가 트리거로 돌아갑니다.",
        en: "Opening the palette puts focus in the input and keeps Tab inside it. Closing returns focus to the trigger.",
      },
    ],
    keyboard: [
      {
        keys: ["Escape"],
        action: { ko: "팔레트를 닫습니다.", en: "Closes the palette." },
      },
      {
        keys: ["ArrowDown", "ArrowUp"],
        action: { ko: "결과 사이에서 강조를 옮깁니다.", en: "Moves the highlight between results." },
      },
      {
        keys: ["Enter"],
        action: { ko: "강조된 결과를 고릅니다.", en: "Picks the highlighted result." },
      },
      {
        keys: ["Tab"],
        action: { ko: "팔레트 안의 다음 컨트롤로 이동합니다.", en: "Moves to the next control inside the palette." },
      },
    ],
  },
};
