/**
 * Reference doc for `Kbd`, written against
 * `packages/react/src/components/kbd.tsx` and
 * `packages/flutter/lib/src/components/kbd.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "kbd",
  anatomy: {
    description: {
      ko: "Kbd는 키보드 단축키를 보여 주는 작은 칩입니다. 실제 kbd 요소로 렌더링되고, keys에 단축키를 넘기면 운영체제에 맞는 키 이름으로 그립니다.",
      en: "A Kbd is a small chip that shows a keyboard shortcut. It renders a real kbd element, and passing a shortcut to keys draws that OS's key labels.",
    },
    parts: [
      {
        name: "Chip",
        slot: "kbd",
        description: {
          ko: "높이, 안쪽 여백, 모서리와 바탕색을 갖는 kbd 요소입니다. 6% 잉크 바탕에 보조 텍스트를 씁니다.",
          en: "The kbd element that carries the height, padding, radius and fill: a 6% ink chip with secondary text.",
        },
      },
      {
        name: "Label",
        slot: "children",
        description: {
          ko: "키 이름을 담는 안쪽 상자입니다. 글자를 cap 높이에 맞춰 광학적으로 가운데에 두고, 아이콘도 같은 간격으로 정렬합니다.",
          en: "The inner box that holds the key label. It trims the text to the cap height for optical centring and aligns an icon at the same gap.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "칩의 높이와 글자 단계, 안쪽 아이콘 크기를 함께 정합니다. 폼 컨트롤과 같은 크기 값을 씁니다.",
        en: "Sets the chip height, label rung and inner icon size from the same scale as the form controls.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 16px에 caption 라벨을 씁니다. 문장 안에 섞는 가장 작은 칩입니다.",
            en: "16px tall with a caption label, the smallest chip to set inside a sentence.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 20px에 caption 라벨을 쓰는 기본값입니다. 검색 필드나 도구 모음의 힌트에 맞습니다.",
            en: "20px tall with a caption label. The default, and right for hints in a search field or a toolbar.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 24px에 label-sm 라벨을 씁니다. 단축키를 크게 안내하는 도움말에 맞습니다.",
            en: "24px tall with a label-sm label, for help text that teaches a shortcut.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "keys",
      title: { ko: "keys", en: "keys" },
      description: {
        ko: "더하기로 이은 단축키 문자열입니다. 값을 넘기면 children 대신 운영체제의 키 이름을 그립니다. Mod는 macOS와 iOS에서 ⌘, Windows와 Linux, Android에서 Ctrl이 되고, 운영체제를 아직 모르는 첫 렌더에서는 ⌘로 그립니다.",
        en: "A plus-joined shortcut string. When set it draws the OS key labels instead of children. Mod becomes ⌘ on macOS and iOS and Ctrl on Windows, Linux and Android, and the first render, before the OS is known, draws ⌘.",
      },
      example: "combos",
    },
    {
      id: "children",
      title: { ko: "children", en: "children" },
      description: {
        ko: "keys가 없을 때 그대로 보이는 내용입니다. 한 칩에 한 키를 넣어 직접 조합하거나, 화살표처럼 글자로 표현하기 어려운 키를 넣습니다.",
        en: "What shows when keys is unset. Pass one key per chip and compose them by hand, or use it for a key that is hard to spell out, such as an arrow.",
      },
      example: "combos",
    },
  ],
  guidelines: [
    {
      id: "keys-for-real-shortcuts",
      title: { ko: "실제 단축키는 keys로", en: "Real shortcuts go through keys" },
      body: {
        ko: "Mod+Enter처럼 운영체제마다 이름이 다른 단축키는 children에 직접 적지 말고 keys로 넘깁니다. 그러면 Mac에서는 ⌘↵, Windows에서는 Ctrl+Enter로 그려져 사용자가 자기 키보드에서 찾을 수 있습니다.",
        en: "For a shortcut whose name differs by platform, such as Mod+Enter, pass it to keys instead of writing it out in children. It then draws ⌘↵ on a Mac and Ctrl+Enter on Windows, so people find the keys they actually have.",
      },
      do: {
        ko: "keys=\"Mod+Enter\"로 넘깁니다.",
        en: "Pass keys=\"Mod+Enter\".",
      },
      dont: {
        ko: "children에 ⌘↵를 고정으로 적지 않습니다.",
        en: "Do not hard-code ⌘↵ in children.",
      },
      example: "combos",
    },
    {
      id: "one-chip-per-key",
      title: { ko: "한 칩에 한 키", en: "One key per chip" },
      body: {
        ko: "차례로 누르는 단축키는 칩을 하나씩 나눠 놓습니다. 한 칩에 G I를 함께 넣으면 두 키를 동시에 누르는 조합으로 읽힙니다.",
        en: "For a shortcut pressed in sequence, put each key in its own chip. G and I inside one chip read as a chord held down together.",
      },
      do: {
        ko: "G와 I를 각각 Kbd로 나눕니다.",
        en: "Split G and I into separate Kbd chips.",
      },
      dont: {
        ko: "한 칩에 G I를 넣지 않습니다.",
        en: "Do not put G I into one chip.",
      },
      example: "sequence",
    },
    {
      id: "hint-only",
      title: { ko: "칩은 안내만 합니다", en: "The chip only shows the hint" },
      body: {
        ko: "Kbd는 단축키를 표시할 뿐 키 입력을 처리하지 않습니다. 실제 동작은 그 화면의 입력 처리에서 만들고, 칩은 사용자가 누를 키를 알려 주는 자리에 둡니다.",
        en: "A Kbd displays a shortcut; it does not handle the key press. Build the behavior in the screen's own key handling and keep the chip where it tells someone what to press.",
      },
      example: "in-context",
    },
    {
      id: "next-to-its-control",
      title: { ko: "컨트롤 옆에 붙입니다", en: "Sit beside the control" },
      body: {
        ko: "단축키 칩은 그 동작을 실행하는 버튼이나 검색 필드 옆, 또는 그 안에 둡니다. 화면 아래에 모아 두면 어느 동작의 단축키인지 찾아야 합니다.",
        en: "Put the chip next to, or inside, the control that runs the action. Collected at the bottom of a screen, it makes people hunt for which action it belongs to.",
      },
      example: "in-context",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Chip", property: "height", value: "16px" },
        { state: "sm", slot: "Chip", property: "padding", value: "0 4px" },
        { state: "sm", slot: "Chip", property: "gap", value: "2px" },
        { state: "sm", slot: "Label", property: "font", value: "text-caption" },
        { state: "sm", slot: "Icon", property: "size", value: "10px" },
        { state: "md", slot: "Chip", property: "height", value: "20px" },
        { state: "md", slot: "Chip", property: "padding", value: "0 6px" },
        { state: "md", slot: "Chip", property: "gap", value: "4px" },
        { state: "md", slot: "Label", property: "font", value: "text-caption" },
        { state: "md", slot: "Icon", property: "size", value: "12px" },
        { state: "lg", slot: "Chip", property: "height", value: "24px" },
        { state: "lg", slot: "Chip", property: "padding", value: "0 8px" },
        { state: "lg", slot: "Chip", property: "gap", value: "4px" },
        { state: "lg", slot: "Label", property: "font", value: "text-label-sm" },
        { state: "lg", slot: "Icon", property: "size", value: "14px" },
      ],
    },
    {
      id: "appearance",
      title: { ko: "모양", en: "Appearance" },
      rows: [
        { state: "default", slot: "Chip", property: "background", value: "bg-overlay-ink-6" },
        { state: "default", slot: "Chip", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Chip", property: "radius", value: "rounded-xs" },
        { state: "default", slot: "Chip", property: "font family", value: "font-sans" },
        { state: "default", slot: "Chip", property: "display", value: "inline-flex items-center shrink-0" },
        { state: "default", slot: "Chip", property: "line height", value: "leading-none" },
        { state: "default", slot: "Chip", property: "wrap", value: "whitespace-nowrap" },
        {
          state: "default",
          slot: "Label",
          property: "optical centring",
          value: "text-trim",
          note: {
            ko: "글자 상자를 cap 높이에 맞게 잘라 칩 안에서 광학적으로 가운데에 둡니다.",
            en: "The label box is trimmed to the cap height so the glyph is optically centred in the chip.",
          },
        },
      ],
    },
    {
      id: "key-labels",
      title: { ko: "keys 값이 그려지는 방식", en: "How keys is drawn" },
      note: {
        ko: "macOS, iOS와 운영체제를 모르는 첫 렌더는 Mac 기호를 쓰고 나머지는 이름을 더하기로 잇습니다. 표에 없는 키는 입력한 글자 그대로 남습니다.",
        en: "macOS, iOS and the first render before the OS is known use the Mac symbols; the rest join the names with a plus. A key outside the table is kept as written.",
      },
      rows: [
        { state: "macOS · iOS", slot: "Label", property: "Mod", value: "⌘" },
        { state: "macOS · iOS", slot: "Label", property: "Enter", value: "↵" },
        { state: "macOS · iOS", slot: "Label", property: "Escape", value: "esc" },
        { state: "macOS · iOS", slot: "Label", property: "Shift", value: "⇧" },
        { state: "macOS · iOS", slot: "Label", property: "Alt", value: "⌥" },
        { state: "Windows · Linux · Android", slot: "Label", property: "Mod", value: "Ctrl" },
        { state: "Windows · Linux · Android", slot: "Label", property: "Enter", value: "Enter" },
        { state: "Windows · Linux · Android", slot: "Label", property: "Escape", value: "Esc" },
        { state: "Windows · Linux · Android", slot: "Label", property: "Shift", value: "Shift" },
        { state: "Windows · Linux · Android", slot: "Label", property: "Alt", value: "Alt" },
        {
          state: "both",
          slot: "Label",
          property: "arrows",
          value: "↑ ↓ ← →",
          note: {
            ko: "화살표는 운영체제와 무관하게 기호로 그립니다.",
            en: "The arrow keys are drawn as symbols on every platform.",
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
        ko: "sm, md, lg 칩의 높이와 글자 크기를 비교합니다.",
        en: "The sm, md and lg chip heights and label sizes.",
      },
    },
    {
      id: "combos",
      title: { ko: "단축키", en: "Shortcuts" },
      description: {
        ko: "keys로 넘긴 단축키를 칩 하나로 그리고, Mac 기호와 이름 표기가 같은 자리에 나타납니다.",
        en: "A shortcut passed as keys draws as one chip, with Mac symbols or spelled-out names in the same place.",
      },
    },
    {
      id: "sequence",
      title: { ko: "이어 누르는 단축키", en: "A sequence" },
      description: {
        ko: "차례로 누르는 키는 칩을 나눠 놓고 사이를 화살표나 짧은 문구로 잇습니다.",
        en: "Keys pressed in order get separate chips, joined by an arrow or a short word.",
      },
    },
    {
      id: "in-context",
      title: { ko: "검색 필드 안에서", en: "Inside a search field" },
      description: {
        ko: "검색 필드 오른쪽에 붙인 칩입니다. 어느 동작의 단축키인지 바로 보입니다.",
        en: "A chip at the trailing edge of a search field, so the shortcut's target is obvious.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "실제 kbd 요소로 렌더링되므로 보조 기술이 키보드 입력으로 읽습니다. 칩 안의 글자는 화면에 보이는 그대로 전달하는 안내이고, 포커스를 받지 않습니다.",
        en: "It renders a real kbd element, so assistive technology reads it as keyboard input. The text is a hint shown as it appears and the chip never takes focus.",
      },
      {
        ko: "keys로 그린 기호는 스크린 리더마다 읽는 방식이 다릅니다. 단축키를 처음 소개하는 자리에는 칩 옆에 말로 된 설명을 함께 둡니다.",
        en: "Screen readers pronounce the symbols drawn by keys differently. Where a shortcut is first introduced, put a spoken description next to the chip.",
      },
      {
        ko: "단축키 칩의 대비는 보조 텍스트와 같습니다. 본문보다 약하게 보이도록 만든 색이므로 배지나 버튼 안처럼 더 강한 대비가 필요한 자리에는 쓰지 않습니다.",
        en: "The chip uses secondary text contrast. That is deliberately quieter than body text, so avoid it where stronger contrast is required, such as inside a badge or a button.",
      },
    ],
    keyboard: [],
  },
};
