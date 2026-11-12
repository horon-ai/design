/**
 * Reference doc for `Select`, written against
 * `packages/react/src/components/select.tsx` and
 * `packages/flutter/lib/src/components/select.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "select",
  anatomy: {
    description: {
      ko: "Select는 목록에서 하나를 고르는 드롭다운입니다. 트리거가 고른 값을 보여 주고, 목록은 트리거 아래에 떠서 고른 행에 체크를 남깁니다.",
      en: "A Select picks one item from a list. The trigger shows the chosen value and the list floats under it, marking the chosen row with a check.",
    },
    parts: [
      {
        name: "Trigger",
        slot: "Trigger",
        description: {
          ko: "값과 캐럿을 담는 버튼입니다. variant에 따라 필드 상자, 칩, InputGroup 칸으로 그려집니다.",
          en: "The button that holds the value and the caret; the variant decides whether it is a field box, a chip or an InputGroup segment.",
        },
      },
      {
        name: "Value",
        slot: "Value",
        description: {
          ko: "고른 값의 글자입니다. selectedLabel이 있으면 그 짧은 값을, 없으면 label을 보여 주고 넘치면 말줄임합니다.",
          en: "The chosen value. It shows selectedLabel when one exists, otherwise label, and truncates when it does not fit.",
        },
      },
      {
        name: "Icon",
        slot: "Icon",
        description: {
          ko: "오른쪽 캐럿입니다. 목록이 열리면 180도 돌아가고, showIndicator를 끄면 사라집니다.",
          en: "The caret on the right. It turns 180 degrees while the list is open and disappears when showIndicator is off.",
        },
      },
      {
        name: "Popup",
        slot: "Popup",
        description: {
          ko: "트리거 아래 4px에 떠오르는 목록 상자입니다. 트리거보다 좁아지지 않고 화면 너비에서 2rem을 뺀 값에서 멈춥니다.",
          en: "The list box that opens 4px below the trigger. It is at least as wide as the trigger and stops 2rem short of the viewport width.",
        },
      },
      {
        name: "Item",
        slot: "Item",
        description: {
          ko: "목록의 한 행입니다. 값, 체크 자리, 행 높이를 가집니다. 비활성 행은 40%로 흐려지고 골라지지 않습니다.",
          en: "One row: its value, its check slot and its height. A disabled row fades to 40% and cannot be picked.",
        },
      },
    ],
  },
  properties: [
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "트리거의 모양입니다. 목록 상자는 모든 변형에서 같습니다.",
        en: "The shape of the trigger. The popup is the same in every variant.",
      },
      values: [
        {
          name: "field",
          description: {
            ko: "라벨과 테두리를 가진 기본 필드입니다. 폼 안에서 값을 고를 때 씁니다.",
            en: "The default field with a border, for choosing a value inside a form.",
          },
        },
        {
          name: "chip",
          description: {
            ko: "높이 32px의 둥근 칩입니다. 목록 위의 필터를 표시할 때 씁니다.",
            en: "A 32px rounded chip, for a filter shown above a list.",
          },
        },
        {
          name: "segment",
          description: {
            ko: "InputGroup의 앞이나 뒤 칸이 되는 변형입니다. 그룹의 크기, 표면, 비활성 상태를 그대로 따릅니다.",
            en: "The leading or trailing segment of an InputGroup. It takes the group's size, surface and disabled state.",
          },
        },
      ],
      example: "chip",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "필드 높이와 목록 행의 높이, 글자 단계입니다. chip은 32px과 label-md를 유지하고 목록 행에만 이 값을 씁니다.",
        en: "Field height, row height and the text rung. A chip keeps its 32px and label-md and uses the value for its rows only.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 32px, body-sm 글자, 행은 32px에 label-sm입니다.",
            en: "32px tall with body-sm text; rows are 32px with label-sm.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 40px, body-md 글자, 행은 40px에 label-md입니다. 기본값입니다.",
            en: "40px tall with body-md text; rows are 40px with label-md. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 48px, body-lg 글자, 행은 48px에 label-lg입니다.",
            en: "48px tall with body-lg text; rows are 48px with label-lg.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "필드와 목록의 채움입니다. glass는 목록을 veil 상자로 바꿉니다.",
        en: "The fill of the field and the popup. Glass switches the popup to the veil box.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "떠 있는 표면 위의 기본 값입니다. 목록은 테두리와 그림자를 가진 표면이 됩니다.",
            en: "The default on a raised surface. The popup becomes a bordered surface with a shadow.",
          },
        },
        {
          name: "solid-on-page",
          description: {
            ko: "페이지 바탕에 바로 놓는 필드입니다. 목록은 solid와 같은 표면입니다.",
            en: "A field on the page background. Its popup is the same surface as solid.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 위에 놓는 필드입니다. 목록도 veil 상자가 되어 배경이 비칩니다.",
            en: "A field over imagery or glass. Its popup becomes a veil box so the backdrop shows through.",
          },
        },
      ],
    },
    {
      id: "items",
      title: { ko: "items", en: "items" },
      description: {
        ko: "목록에 놓을 선택지 배열입니다. 각 항목의 value가 폼에 제출되고, label은 행과 트리거에, selectedLabel은 고른 뒤 트리거에 보여 줍니다.",
        en: "The choices in the list. Each item's value is what the form submits, label fills the row and the trigger, and selectedLabel replaces label once chosen.",
      },
      example: "basic",
    },
    {
      id: "placeholder",
      title: { ko: "placeholder", en: "placeholder" },
      description: {
        ko: "아직 아무것도 고르지 않았을 때 트리거에 보이는 문구입니다. 기본값은 Select입니다.",
        en: "What the trigger shows before a choice is made. The default is Select.",
      },
      example: "basic",
    },
    {
      id: "invalid",
      title: { ko: "invalid", en: "invalid" },
      description: {
        ko: "참이면 트리거 테두리가 danger 색으로 바뀌고 aria-invalid가 붙습니다.",
        en: "When true the trigger border turns danger red and aria-invalid is set.",
      },
      example: "states",
    },
    {
      id: "showIndicator",
      title: { ko: "showIndicator", en: "showIndicator" },
      description: {
        ko: "트리거 오른쪽 캐럿을 그릴지 정합니다. 기본값은 true이고, 트리거가 자체 아이콘을 가질 때만 끕니다.",
        en: "Whether the caret is drawn at the right of the trigger. The default is true; turn it off only when the trigger supplies its own icon.",
      },
    },
  ],
  guidelines: [
    {
      id: "select-vs-combobox",
      title: { ko: "긴 목록은 Combobox로", en: "Long lists belong to Combobox" },
      body: {
        ko: "Select는 목록을 훑어 고르는 자리입니다. 항목이 열 개를 넘거나 이름이 비슷해 찾기 어려우면 입력으로 좁힐 수 있는 Combobox를 씁니다.",
        en: "Select is for scanning a short list. Past about ten items, or when the names are easy to confuse, use Combobox so the reader can type to narrow it.",
      },
      do: {
        ko: "봇 역할 네 개처럼 짧은 목록에 Select를 씁니다.",
        en: "Use Select for a short list such as four bot roles.",
      },
      dont: {
        ko: "국가 목록처럼 긴 목록을 Select에 넣지 않습니다.",
        en: "Do not put a long list such as countries in a Select.",
      },
      example: "basic",
    },
    {
      id: "trigger-name",
      title: { ko: "트리거에는 이름이 필요합니다", en: "Give the trigger a name" },
      body: {
        ko: "트리거는 네이티브 select가 아니라 버튼입니다. 감싸는 label은 이 버튼의 이름이 되지 않으므로 aria-label을 주거나 Field 안에서 라벨을 연결합니다.",
        en: "The trigger is a button, not a native select. A wrapping label does not name it, so give it an aria-label or connect a label inside a Field.",
      },
      example: "basic",
    },
    {
      id: "short-selected-label",
      title: { ko: "고른 뒤에는 짧은 값을", en: "Show the short value once chosen" },
      body: {
        ko: "행에서는 긴 이름이 읽기 좋지만 트리거에서는 자리가 좁습니다. selectedLabel에 짧은 값을 두면 고른 뒤 트리거가 한눈에 읽히고 목록 행은 설명을 유지합니다.",
        en: "A full name reads well in a row but crowds the trigger. Give selectedLabel a short form so the trigger stays legible while the rows keep their full text.",
      },
      do: {
        ko: "행은 \"+82 South Korea\", 트리거는 \"+82\"로 둡니다.",
        en: "Keep \"+82 South Korea\" in the row and \"+82\" in the trigger.",
      },
      example: "basic",
    },
  ],
  specification: [
    {
      id: "trigger-variants",
      title: { ko: "트리거 변형", en: "Trigger variants" },
      note: {
        ko: "field 행은 size에 따라 값이 달라지고, chip과 segment 행은 고정값입니다.",
        en: "Field rows follow size; chip and segment rows are fixed.",
      },
      rows: [
        { state: "Field", slot: "Trigger", property: "background", value: "bg-bg-surface" },
        { state: "Field", slot: "Trigger", property: "border", value: "1px border-border-default" },
        { state: "Field", slot: "Trigger", property: "width", value: "240px" },
        { state: "Field · hover", slot: "Trigger", property: "border", value: "border-border-strong" },
        { state: "Field · focus-visible", slot: "Trigger", property: "outline", value: "2px outline-text-brand" },
        { state: "Field · placeholder", slot: "Value", property: "text color", value: "text-text-placeholder" },
        { state: "Field · selected", slot: "Value", property: "text color", value: "text-text-primary" },
        { state: "Chip", slot: "Trigger", property: "background", value: "bg-bg-subtle" },
        { state: "Chip", slot: "Trigger", property: "height", value: "32px" },
        { state: "Chip", slot: "Trigger", property: "padding-x", value: "12px" },
        { state: "Chip", slot: "Trigger", property: "radius", value: "rounded-full" },
        { state: "Chip", slot: "Trigger", property: "gap", value: "4px" },
        { state: "Chip", slot: "Trigger", property: "font", value: "text-label-md" },
        { state: "Chip · hover", slot: "Trigger", property: "background", value: "bg-overlay-ink-8" },
        { state: "Chip", slot: "Icon", property: "size", value: "16px" },
        { state: "Segment", slot: "Trigger", property: "background", value: "bg-overlay-ink-4" },
        { state: "Segment", slot: "Trigger", property: "font", value: "text-body-md" },
        { state: "all", slot: "Icon", property: "text color", value: "text-text-secondary" },
        {
          state: "all · open",
          slot: "Icon",
          property: "transform",
          value: "rotate 180deg",
          note: {
            ko: "회전은 200ms ease-out-quint로 끝납니다.",
            en: "The turn runs 200ms on ease-out-quint.",
          },
        },
        { state: "all · disabled", slot: "Trigger", property: "cursor", value: "not-allowed" },
        { state: "all · disabled", slot: "Value", property: "text color", value: "text-text-disabled" },
        { state: "all · invalid", slot: "Trigger", property: "border", value: "border-border-danger" },
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
        { state: "all", slot: "Popup", property: "width", value: "min-w-(--anchor-width)" },
        { state: "all", slot: "Popup", property: "gap", value: "2px" },
        { state: "all", slot: "Popup", property: "motion", value: "motion-popup" },
        { state: "all", slot: "Item", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Item", property: "text color", value: "text-text-primary" },
        { state: "highlighted", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "selected", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "selected", slot: "Item", property: "indicator", value: "Check" },
        { state: "item · disabled", slot: "Item", property: "opacity", value: "40%" },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Trigger", property: "height", value: "32px" },
        { state: "sm", slot: "Trigger", property: "padding-x", value: "12px" },
        { state: "sm", slot: "Trigger", property: "gap", value: "6px" },
        { state: "sm", slot: "Value", property: "font", value: "text-body-sm" },
        { state: "sm", slot: "Item", property: "height", value: "32px" },
        { state: "sm", slot: "Item", property: "padding-x", value: "10px" },
        { state: "sm", slot: "Item", property: "gap", value: "8px" },
        { state: "sm", slot: "Item", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Item", property: "icon size", value: "16px" },
        { state: "md", slot: "Trigger", property: "height", value: "40px" },
        { state: "md", slot: "Trigger", property: "padding-x", value: "14px" },
        { state: "md", slot: "Trigger", property: "gap", value: "8px" },
        { state: "md", slot: "Value", property: "font", value: "text-body-md" },
        { state: "md", slot: "Item", property: "height", value: "40px" },
        { state: "md", slot: "Item", property: "padding-x", value: "12px" },
        { state: "md", slot: "Item", property: "gap", value: "10px" },
        { state: "md", slot: "Item", property: "font", value: "text-label-md" },
        { state: "md", slot: "Item", property: "icon size", value: "16px" },
        { state: "lg", slot: "Trigger", property: "height", value: "48px" },
        { state: "lg", slot: "Trigger", property: "padding-x", value: "20px" },
        { state: "lg", slot: "Trigger", property: "gap", value: "10px" },
        { state: "lg", slot: "Value", property: "font", value: "text-body-lg" },
        { state: "lg", slot: "Item", property: "height", value: "48px" },
        { state: "lg", slot: "Item", property: "padding-x", value: "16px" },
        { state: "lg", slot: "Item", property: "gap", value: "12px" },
        { state: "lg", slot: "Item", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Item", property: "icon size", value: "20px" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "봇 역할 네 개를 고르는 필드입니다. 고른 뒤 트리거에는 selectedLabel이 보입니다.",
        en: "A field for choosing among four bot roles; the trigger shows selectedLabel once chosen.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 높이를 나란히 두었습니다. 목록 행도 같은 단계를 따릅니다.",
        en: "The sm, md and lg heights side by side. The rows follow the same rung.",
      },
    },
    {
      id: "chip",
      title: { ko: "칩", en: "Chip" },
      description: {
        ko: "목록 위의 필터로 쓰는 32px 칩 트리거입니다.",
        en: "The 32px chip trigger used as a filter above a list.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "오류, 비활성 트리거와 목록의 비활성 행을 함께 보여 줍니다.",
        en: "An invalid and a disabled trigger, plus a disabled row in the list.",
      },
    },
  ],
  accessibility: {
    pattern: {
      label: "WAI-ARIA Combobox Pattern (Select-Only)",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
    },
    notes: [
      {
        ko: "트리거는 button 요소라서 감싸는 label이 이름이 되지 않습니다. aria-label을 주거나 Field 안에서 라벨을 연결합니다.",
        en: "The trigger is a button, so a wrapping label does not name it. Use an aria-label or connect a label inside a Field.",
      },
      {
        ko: "고른 값은 트리거 글자로 보이고, 목록의 고른 행에는 체크가 붙습니다. 색만으로 선택을 알리지 않습니다.",
        en: "The chosen value shows in the trigger and the chosen row carries a check, so selection never rests on color alone.",
      },
      {
        ko: "invalid는 트리거의 aria-invalid와 danger 테두리를 함께 설정합니다. 오류 문구는 별도로 남깁니다.",
        en: "invalid sets aria-invalid on the trigger and paints the danger border. The message itself is still yours to place.",
      },
    ],
    keyboard: [
      {
        keys: ["ArrowDown", "ArrowUp"],
        action: {
          ko: "닫힌 트리거에서 목록을 열고, 열린 목록에서 강조 행을 옮깁니다.",
          en: "Opens the list from the closed trigger and moves the highlight once it is open.",
        },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "목록을 열고, 강조된 행을 고릅니다.", en: "Opens the list, and picks the highlighted row." },
      },
      {
        keys: ["Esc"],
        action: { ko: "목록을 닫습니다.", en: "Closes the list." },
      },
      {
        keys: ["Tab"],
        action: { ko: "목록을 닫고 다음 요소로 이동합니다.", en: "Closes the list and moves to the next control." },
      },
    ],
  },
};
