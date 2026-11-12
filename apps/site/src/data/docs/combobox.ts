/**
 * Reference doc for `Combobox`, written against
 * `packages/react/src/components/combobox.tsx` and
 * `packages/flutter/lib/src/components/combobox.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "combobox",
  anatomy: {
    description: {
      ko: "Combobox는 입력한 글자로 목록을 좁힌 뒤 하나 또는 여러 개를 고르는 필드입니다. 여러 개를 고르면 고른 항목이 필드 안에 칩으로 쌓입니다.",
      en: "A Combobox narrows a list as you type, then takes one item or several. With multiple selection the chosen items stack as chips inside the field.",
    },
    parts: [
      {
        name: "Field box",
        slot: "div",
        description: {
          ko: "검색 아이콘, 입력, 캐럿을 담는 상자입니다. 테두리와 포커스 링은 이 상자가 그립니다.",
          en: "The box that holds the search icon, the input and the caret; it draws the border and the focus ring.",
        },
      },
      {
        name: "Input",
        slot: "input",
        description: {
          ko: "글자를 받아 목록을 거르는 입력입니다. 고른 항목이 있으면 그 항목의 selectedLabel이 보입니다.",
          en: "The field you type into to filter the list; once an item is chosen it shows that item's selectedLabel.",
        },
      },
      {
        name: "Chips",
        slot: "Chips",
        description: {
          ko: "multiple에서만 나타나는 칩 묶음입니다. 칩이 늘면 상자가 고정 높이 대신 아래로 자랍니다.",
          en: "The chip cluster of multiple mode. As chips collect, the box grows downward instead of holding a fixed height.",
        },
      },
      {
        name: "Chip",
        slot: "Chip",
        description: {
          ko: "고른 항목 하나를 나타내는 둥근 칩입니다. 오른쪽 X로 그 항목만 지웁니다.",
          en: "One chosen item as a rounded chip, with an X on the right that removes just that item.",
        },
      },
      {
        name: "Popup",
        slot: "Popup",
        description: {
          ko: "결과를 담는 목록 상자입니다. 320px에서 멈추고 안쪽 목록은 256px부터 스크롤합니다. 일치하는 행이 없으면 emptyLabel을 보여 줍니다.",
          en: "The list box: it caps at 320px and the list inside scrolls past 256px. When nothing matches it shows emptyLabel.",
        },
      },
      {
        name: "Item",
        slot: "Item",
        description: {
          ko: "목록의 한 행입니다. label과 선택적 trailing을 보여 주고, 고른 행에는 체크가 붙습니다.",
          en: "One row: its label and an optional trailing note, with a check on the chosen row.",
        },
      },
    ],
  },
  properties: [
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "필드의 형태입니다. 기본값은 field입니다.",
        en: "The shape of the field. The default is field.",
      },
      values: [
        {
          name: "field",
          description: {
            ko: "검색 아이콘과 캐럿이 붙은 240px 필드입니다. 목록은 필드 아래에 열립니다.",
            en: "A 240px field with a search icon and a caret; its list opens under the field.",
          },
        },
        {
          name: "segment",
          description: {
            ko: "InputGroup의 앞이나 뒤 칸이 되는 트리거입니다. Popup 위에 자체 검색 상자를 두고 그룹의 크기를 따릅니다.",
            en: "The trigger for an InputGroup segment: its popup carries its own search box on top and it follows the group's size.",
          },
        },
      ],
      example: "segment",
    },
    {
      id: "multiple",
      title: { ko: "multiple", en: "multiple" },
      description: {
        ko: "참이면 값을 여러 개 고르고, 고른 항목이 칩으로 쌓입니다. 거짓이면 값 하나만 고릅니다.",
        en: "When true several items can be chosen and each shows as a chip; otherwise the field takes one.",
      },
      example: "multiple",
    },
    {
      id: "items",
      title: { ko: "items", en: "items" },
      description: {
        ko: "목록에 놓을 항목 배열입니다. value는 폼에 제출되는 값이고, keywords는 화면에 보이지 않으면서 검색에만 쓰이는 말입니다.",
        en: "The items in the list. value is what the form submits, and keywords are extra search terms that never appear on screen.",
      },
      example: "basic",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "필드 높이와 행, 칩의 크기입니다. 기본값은 md입니다.",
        en: "Field height and the size of rows and chips. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "필드 32px, 행 32px에 label-sm, 칩 높이 20px입니다.",
            en: "A 32px field, 32px rows with label-sm, and 20px chips.",
          },
        },
        {
          name: "md",
          description: {
            ko: "필드 40px, 행 40px에 label-md, 칩 높이 24px입니다.",
            en: "A 40px field, 40px rows with label-md, and 24px chips.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "필드 48px, 행 48px에 label-lg, 칩 높이 28px입니다.",
            en: "A 48px field, 48px rows with label-lg, and 28px chips.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "필드의 채움이고 목록도 같은 표면을 씁니다. glass는 목록을 veil 상자로 그립니다.",
        en: "The field's fill; the popup uses the same surface. Glass draws the popup as a veil box.",
      },
      example: "states",
    },
    {
      id: "placeholder",
      title: { ko: "placeholder", en: "placeholder" },
      description: {
        ko: "아직 고르지 않았을 때 필드에 보이는 문구입니다. field variant에서는 이 문구가 곧 입력의 aria-label이기도 합니다.",
        en: "What the field shows before a choice. In the field variant this text is also the input's aria-label.",
      },
      example: "basic",
    },
    {
      id: "searchPlaceholder",
      title: { ko: "searchPlaceholder", en: "searchPlaceholder" },
      description: {
        ko: "segment 목록 위 검색 상자의 자리 표시 문구입니다. 기본값은 Search입니다.",
        en: "The placeholder of the search box inside a segment popup. The default is Search.",
      },
      example: "segment",
    },
    {
      id: "emptyLabel",
      title: { ko: "emptyLabel", en: "emptyLabel" },
      description: {
        ko: "검색과 맞는 행이 하나도 없을 때 목록에 남는 문구입니다. 기본값은 No results입니다.",
        en: "What the list shows when nothing matches the query. The default is No results.",
      },
      example: "states",
    },
    {
      id: "invalid",
      title: { ko: "invalid", en: "invalid" },
      description: {
        ko: "참이면 필드 테두리가 danger 색으로 바뀌고 aria-invalid가 붙습니다. segment에서는 InputGroup이 테두리를 맡으므로 트리거에는 표시되지 않습니다.",
        en: "When true the field border turns danger red and aria-invalid is set. In a segment the InputGroup owns the border, so the trigger itself shows nothing.",
      },
      example: "states",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 필드가 열리지 않습니다. segment에서는 감싼 InputGroup의 비활성 상태를 이어받습니다.",
        en: "When true the field no longer opens. In a segment it also inherits the disabled state of the InputGroup around it.",
      },
      example: "states",
    },
  ],
  guidelines: [
    {
      id: "combobox-vs-select",
      title: { ko: "찾아야 하면 Combobox", en: "Search means Combobox" },
      body: {
        ko: "목록이 짧고 눈으로 훑을 수 있으면 Select로 충분합니다. 항목이 많거나 이름이 비슷해 입력으로 좁혀야 하면 Combobox를 씁니다. 두 컴포넌트의 목록 모양은 같아서 바꿔도 화면이 흔들리지 않습니다.",
        en: "A short list you can scan works as a Select. When the list is long or the names are similar, reach for Combobox and let the reader type. The two share the same popup, so switching keeps the screen steady.",
      },
      do: {
        ko: "수백 개의 연락처에서 한 사람을 고를 때 Combobox를 씁니다.",
        en: "Use Combobox to pick one person out of hundreds of contacts.",
      },
      dont: {
        ko: "선택지 네 개를 고르는 자리에 Combobox를 쓰지 않습니다.",
        en: "Do not use Combobox for four choices.",
      },
      example: "basic",
    },
    {
      id: "keywords",
      title: { ko: "keywords로 검색어를 보충합니다", en: "Add search words with keywords" },
      body: {
        ko: "label이 화면에 보이는 이름이라면 keywords는 사용자가 실제로 칠 만한 다른 말입니다. 한글 이름과 영문 이름, 축약형을 함께 넣으면 찾지 못하는 항목이 줄어듭니다.",
        en: "label is the name on screen; keywords are the other words a reader is likely to type. Putting both scripts and a short form in them cuts the items nobody can find.",
      },
      example: "basic",
    },
    {
      id: "chip-removal",
      title: { ko: "칩 하나만 지웁니다", en: "Remove one chip at a time" },
      body: {
        ko: "여러 개를 고른 상태에서는 칩마다 X가 붙어 그 항목만 지웁니다. 전체를 비우는 동작이 필요하면 필드 바깥에 따로 두고, 칩 X와 같은 자리에 겹치지 않게 합니다.",
        en: "With several items each chip carries its own X, which removes only that item. A clear-all action belongs outside the field, not on top of the chip's X.",
      },
      example: "multiple",
    },
    {
      id: "counter-not-chip",
      title: { ko: "고른 개수는 밖에 적습니다", en: "Count the selection outside" },
      body: {
        ko: "칩이 많아지면 필드가 여러 줄로 자랍니다. 선택 개수를 함께 보여 줘야 하는 화면이라면 필드 옆이나 아래에 숫자를 적고, 칩 안에 숫자를 넣지 않습니다.",
        en: "Many chips make the field grow over several rows. When the screen needs a count, put the number beside or under the field rather than inside a chip.",
      },
      example: "multiple",
    },
  ],
  specification: [
    {
      id: "field",
      title: { ko: "필드", en: "Field" },
      rows: [
        { state: "Solid", slot: "Field box", property: "background", value: "bg-bg-surface" },
        { state: "Solid", slot: "Field box", property: "border", value: "1px border-border-default" },
        { state: "Glass", slot: "Field box", property: "background", value: "veil-field" },
        { state: "all", slot: "Field box", property: "width", value: "240px" },
        { state: "all", slot: "Field box", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Field box", property: "icon", value: "MagnifyingGlass" },
        { state: "all", slot: "Field box", property: "icon color", value: "text-text-secondary" },
        { state: "focus-within", slot: "Field box", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-within", slot: "Field box", property: "outline offset", value: "2px" },
        { state: "invalid", slot: "Field box", property: "border", value: "border-border-danger" },
        { state: "all", slot: "Input", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Input", property: "placeholder", value: "text-text-placeholder" },
        { state: "all", slot: "Chip", property: "background", value: "bg-overlay-ink-6" },
        { state: "all", slot: "Chip", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Chip", property: "font", value: "text-label-sm" },
        { state: "chip · highlighted", slot: "Chip", property: "background", value: "bg-overlay-ink-12" },
        {
          state: "chip · remove hover",
          slot: "Chip",
          property: "background",
          value: "bg-overlay-ink-10",
        },
        { state: "all", slot: "Chip", property: "motion", value: "animate-pop-in" },
        { state: "all", slot: "Field box", property: "motion", value: "motion-colors" },
      ],
    },
    {
      id: "popup",
      title: { ko: "목록", en: "Popup" },
      rows: [
        { state: "Solid", slot: "Popup", property: "background", value: "bg-bg-surface" },
        { state: "Solid", slot: "Popup", property: "border", value: "1px border-border-default" },
        { state: "Solid", slot: "Popup", property: "shadow", value: "shadow-popover" },
        { state: "Glass", slot: "Popup", property: "background", value: "veil-overlay" },
        { state: "all", slot: "Popup", property: "radius", value: "rounded-xl" },
        { state: "all", slot: "Popup", property: "padding", value: "6px" },
        { state: "all", slot: "Popup", property: "max height", value: "320px" },
        { state: "all", slot: "Popup", property: "width", value: "min-w-(--anchor-width)" },
        { state: "all", slot: "Popup", property: "motion", value: "motion-popup" },
        { state: "all", slot: "Popup", property: "list max height", value: "256px" },
        { state: "all", slot: "Item", property: "radius", value: "rounded-md" },
        { state: "highlighted", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "selected", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "selected", slot: "Item", property: "indicator", value: "Check" },
        { state: "all", slot: "Item", property: "trailing color", value: "text-text-secondary" },
        { state: "empty", slot: "Popup", property: "text color", value: "text-text-secondary" },
        { state: "item · disabled", slot: "Item", property: "opacity", value: "40%" },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Field box", property: "height", value: "32px" },
        { state: "sm", slot: "Field box", property: "padding-x", value: "12px" },
        { state: "sm", slot: "Item", property: "height", value: "32px" },
        { state: "sm", slot: "Item", property: "padding-x", value: "10px" },
        { state: "sm", slot: "Item", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Chip", property: "height", value: "20px" },
        { state: "sm", slot: "Chip", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Empty", property: "padding", value: "8px 12px" },
        { state: "md", slot: "Field box", property: "height", value: "40px" },
        { state: "md", slot: "Field box", property: "padding-x", value: "14px" },
        { state: "md", slot: "Item", property: "height", value: "40px" },
        { state: "md", slot: "Item", property: "padding-x", value: "12px" },
        { state: "md", slot: "Item", property: "font", value: "text-label-md" },
        { state: "md", slot: "Chip", property: "height", value: "24px" },
        { state: "md", slot: "Chip", property: "font", value: "text-label-sm" },
        { state: "md", slot: "Empty", property: "padding", value: "8px 12px" },
        { state: "lg", slot: "Field box", property: "height", value: "48px" },
        { state: "lg", slot: "Field box", property: "padding-x", value: "20px" },
        { state: "lg", slot: "Item", property: "height", value: "48px" },
        { state: "lg", slot: "Item", property: "padding-x", value: "16px" },
        { state: "lg", slot: "Item", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Chip", property: "height", value: "28px" },
        { state: "lg", slot: "Chip", property: "font", value: "text-label-md" },
        { state: "lg", slot: "Empty", property: "padding", value: "12px 12px" },
        { state: "multiple", slot: "Chips", property: "gap", value: "4px" },
        { state: "multiple", slot: "Chips", property: "padding", value: "4px 8px" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "봇 목록에서 하나를 고릅니다. keywords에 적힌 말로도 검색됩니다.",
        en: "Choose one bot; the keywords in its item are searchable too.",
      },
    },
    {
      id: "multiple",
      title: { ko: "여러 개 선택", en: "Multiple" },
      description: {
        ko: "고른 항목이 칩으로 쌓이고, 칩의 X로 하나씩 지웁니다.",
        en: "Chosen items stack as chips, and each X removes one.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 필드와 그에 맞는 행, 칩 크기를 보여 줍니다.",
        en: "The sm, md and lg fields with their row and chip sizes.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "오류와 비활성 필드, 결과가 없을 때의 문구를 보여 줍니다.",
        en: "An invalid and a disabled field, plus what the list shows with no matches.",
      },
    },
    {
      id: "segment",
      title: { ko: "InputGroup 칸", en: "InputGroup segment" },
      description: {
        ko: "전화번호 앞의 국가 코드를 검색으로 고르는 segment 변형입니다.",
        en: "The segment variant that picks a country code by search in front of a phone number.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "field 변형에서는 placeholder가 입력의 이름이 됩니다. 자리 표시 문구가 이름으로 부적절하면 aria-label을 함께 줍니다.",
        en: "In the field variant the placeholder is the input's name. When that reads badly as a name, add an aria-label as well.",
      },
      {
        ko: "칩을 지우는 X에는 칩마다 다른 이름이 붙습니다. 화면 낭독기에서 어느 항목을 지우는지 알 수 있습니다.",
        en: "Each chip's X carries its own name, so a screen reader can say which item it removes.",
      },
      {
        ko: "목록은 강조 행을 한 번에 하나만 두고, 고른 행은 체크로도 구분합니다. 색만으로 두 상태를 나누지 않습니다.",
        en: "The list keeps one highlighted row at a time, and a chosen row is also marked with a check, so neither state rests on color alone.",
      },
      {
        ko: "고른 값은 item의 value로 제출되지만 화면에는 selectedLabel이 보입니다. 폼과 화면이 다른 값을 쓸 수 있다는 점을 기억합니다.",
        en: "The form receives the item's value while the field shows its selectedLabel, so the submitted and displayed text can differ.",
      },
    ],
    keyboard: [
      {
        keys: ["ArrowDown", "ArrowUp"],
        action: { ko: "강조 행을 옮깁니다.", en: "Moves the highlighted row." },
      },
      {
        keys: ["Enter"],
        action: { ko: "강조된 항목을 고릅니다.", en: "Picks the highlighted item." },
      },
      {
        keys: ["Esc"],
        action: { ko: "목록을 닫습니다.", en: "Closes the list." },
      },
      {
        keys: ["Backspace"],
        action: {
          ko: "입력이 비어 있으면 마지막 칩을 지웁니다.",
          en: "With an empty input, removes the last chip.",
        },
      },
      {
        keys: ["Backspace", "Delete"],
        action: {
          ko: "포커스가 칩에 있을 때 그 칩을 지웁니다.",
          en: "With focus on a chip, removes that chip.",
        },
      },
    ],
  },
};
