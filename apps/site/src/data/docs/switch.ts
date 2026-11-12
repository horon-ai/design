/**
 * Reference doc for `Switch`, written against
 * `packages/react/src/components/switch.tsx` and
 * `packages/flutter/lib/src/components/switch.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "switch",
  anatomy: {
    description: {
      ko: "Switch는 값을 즉시 켜고 끄는 컨트롤입니다. 트랙 안에서 흰 손잡이가 옆으로 미끄러지고, label을 주면 라벨 행 전체가 하나의 스위치가 됩니다.",
      en: "A Switch turns a value on or off at once. A white thumb slides across the track, and with label the whole row becomes one switch.",
    },
    parts: [
      {
        name: "Track",
        slot: "Root",
        description: {
          ko: "손잡이가 움직이는 둥근 트랙입니다. 꺼져 있으면 border-strong, 켜져 있으면 브랜드 색입니다.",
          en: "The rounded track the thumb travels along: border-strong when off, the brand color when on.",
        },
      },
      {
        name: "Thumb",
        slot: "Thumb",
        description: {
          ko: "트랙 안의 흰 손잡이입니다. 켜지면 반대쪽으로 이동하고 색이 inverse로 바뀝니다.",
          en: "The white thumb inside the track. It travels to the other end and takes the inverse color once on.",
        },
      },
      {
        name: "Label row",
        slot: "label",
        description: {
          ko: "label을 주면 생기는 가로 행입니다. 글자가 남은 너비를 채우고 스위치가 오른쪽 끝에 붙어, 행 아무 곳이나 눌러도 바뀝니다.",
          en: "The row that appears with label: the text fills the width, the switch sits at the end, and pressing anywhere on the row toggles it.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "트랙과 손잡이 크기입니다. 기본값은 md입니다.",
        en: "Track and thumb size. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "트랙 32x20px에 16px 손잡이입니다. 촘촘한 설정 목록에 맞습니다.",
            en: "A 32x20px track with a 16px thumb, for dense settings lists.",
          },
        },
        {
          name: "md",
          description: {
            ko: "트랙 44x26px에 22px 손잡이입니다. 기본값입니다.",
            en: "A 44x26px track with a 22px thumb. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "트랙 52x30px에 26px 손잡이입니다.",
            en: "A 52x30px track with a 26px thumb.",
          },
        },
        {
          name: "compact",
          description: {
            ko: "트랙 40x24px에 18px 손잡이이고 안쪽 여백이 3px입니다. Paper의 봇 메모리 토글에 쓰는 크기입니다.",
            en: "A 40x24px track with an 18px thumb and 3px inset, the size used for the bot memory toggle in Paper.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "스위치 왼쪽에 붙는 라벨입니다. 주면 스위치가 라벨 행 오른쪽 끝으로 가고, 라벨이 접근 가능한 이름이 되므로 aria-label이 필요 없습니다.",
        en: "The label to the left of the switch. With it the switch moves to the end of the row and the label names the control, so no aria-label is needed.",
      },
      example: "settings",
    },
    {
      id: "checked",
      title: { ko: "checked", en: "checked" },
      description: {
        ko: "값을 주면 제어 상태가 되고, 주지 않으면 defaultChecked에서 시작해 스스로 상태를 유지합니다. 바뀐 값은 onCheckedChange로 받습니다.",
        en: "Passing a value makes the switch controlled; without it the switch starts at defaultChecked and keeps its own state, reporting changes through onCheckedChange.",
      },
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 트랙이 40%로 흐려지고 커서가 not-allowed로 바뀌며 상태가 바뀌지 않습니다.",
        en: "When true the track fades to 40%, the cursor becomes not-allowed and the state stops changing.",
      },
      example: "disabled",
    },
  ],
  guidelines: [
    {
      id: "immediate-effect",
      title: { ko: "누르면 바로 적용되는 값", en: "For values applied at once" },
      body: {
        ko: "Switch는 누르는 순간 값이 적용되고 저장 버튼이 없다는 약속을 합니다. 저장을 눌러야 반영되는 폼 값에는 Checkbox를 씁니다.",
        en: "A Switch promises the change takes effect the moment it is pressed, with no save step. For a form value that is applied on save, use a Checkbox.",
      },
      do: {
        ko: "알림 받기처럼 바로 반영되는 설정에 Switch를 씁니다.",
        en: "Use a Switch for a setting such as receiving notifications.",
      },
      dont: {
        ko: "약관 동의처럼 저장이 필요한 값에 Switch를 쓰지 않습니다.",
        en: "Do not use a Switch for agreeing to terms, which is applied on save.",
      },
      example: "settings",
    },
    {
      id: "label-the-row",
      title: { ko: "라벨은 스위치에 붙입니다", en: "Keep the label on the switch" },
      body: {
        ko: "스위치 옆에 설명을 따로 두지 말고 label에 그 값을 적습니다. label이 없으면 aria-label이 유일한 이름이 되고, 행을 눌러도 반응하지 않습니다.",
        en: "Rather than a separate caption beside the switch, put the value in label. Without it an aria-label is the only name and the row no longer responds to a press.",
      },
      example: "sizes",
    },
    {
      id: "one-per-row",
      title: { ko: "한 행에 하나", en: "One switch per row" },
      body: {
        ko: "label 행은 행 전체를 클릭 영역으로 씁니다. 한 행에 스위치를 둘 이상 두면 어느 라벨이 어느 스위치의 것인지 나뉘지 않으므로, 설정 하나에 행 하나를 씁니다.",
        en: "A label row makes the whole row clickable. Two switches on one row leave the labels ambiguous, so give each setting a row.",
      },
      example: "settings",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Track", property: "width", value: "32px" },
        { state: "sm", slot: "Track", property: "height", value: "20px" },
        { state: "sm", slot: "Thumb", property: "size", value: "16px" },
        { state: "sm", slot: "Thumb", property: "travel", value: "12px" },
        { state: "sm", slot: "Label row", property: "gap", value: "12px" },
        { state: "sm", slot: "Label row", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Track", property: "width", value: "44px" },
        { state: "md", slot: "Track", property: "height", value: "26px" },
        { state: "md", slot: "Thumb", property: "size", value: "22px" },
        { state: "md", slot: "Thumb", property: "travel", value: "18px" },
        { state: "md", slot: "Label row", property: "gap", value: "16px" },
        { state: "md", slot: "Label row", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Track", property: "width", value: "52px" },
        { state: "lg", slot: "Track", property: "height", value: "30px" },
        { state: "lg", slot: "Thumb", property: "size", value: "26px" },
        { state: "lg", slot: "Thumb", property: "travel", value: "22px" },
        { state: "lg", slot: "Label row", property: "gap", value: "16px" },
        { state: "lg", slot: "Label row", property: "font", value: "text-body-lg" },
        { state: "compact", slot: "Track", property: "width", value: "40px" },
        { state: "compact", slot: "Track", property: "height", value: "24px" },
        { state: "compact", slot: "Track", property: "padding", value: "3px" },
        { state: "compact", slot: "Thumb", property: "size", value: "18px" },
        { state: "compact", slot: "Thumb", property: "travel", value: "16px" },
        { state: "compact", slot: "Label row", property: "gap", value: "12px" },
        { state: "compact", slot: "Label row", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Track", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Track", property: "padding", value: "2px" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "off", slot: "Track", property: "background", value: "bg-border-strong" },
        { state: "off", slot: "Thumb", property: "background", value: "bg-text-on-ink" },
        {
          state: "off · hover",
          slot: "Track",
          property: "background",
          value: "bg-interactive-secondary-hover",
        },
        { state: "on", slot: "Track", property: "background", value: "bg-interactive-primary" },
        { state: "on", slot: "Thumb", property: "background", value: "bg-interactive-on-primary" },
        {
          state: "on · hover",
          slot: "Track",
          property: "background",
          value: "bg-interactive-primary-hover",
        },
        {
          state: "focus-visible",
          slot: "Track",
          property: "outline",
          value: "2px outline-text-brand",
        },
        { state: "focus-visible", slot: "Track", property: "outline offset", value: "2px" },
        { state: "disabled", slot: "Track", property: "opacity", value: "40%" },
        { state: "disabled", slot: "Track", property: "cursor", value: "not-allowed" },
        {
          state: "toggle",
          slot: "Thumb",
          property: "motion",
          value: "220ms ease-spring",
          note: {
            ko: "이동과 배경색만 움직이고 동작 줄이기에서는 즉시 끝납니다.",
            en: "Only translate and background-color run, and reduced motion ends it immediately.",
          },
        },
        { state: "colors", slot: "Track", property: "motion", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg, compact 네 크기를 켠 상태로 나란히 두었습니다.",
        en: "The sm, md, lg and compact sizes side by side, all switched on.",
      },
    },
    {
      id: "settings",
      title: { ko: "설정 목록", en: "Settings list" },
      description: {
        ko: "설정 하나에 행 하나를 쓰고 라벨이 왼쪽, 스위치가 오른쪽 끝에 놓입니다.",
        en: "One setting per row, with the label on the left and the switch at the right end.",
      },
    },
    {
      id: "disabled",
      title: { ko: "비활성", en: "Disabled" },
      description: {
        ko: "지금은 바꿀 수 없는 설정을 40%로 흐리게 보여 줍니다.",
        en: "A setting that cannot be changed right now, faded to 40%.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Switch Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/" },
    notes: [
      {
        ko: "스위치는 role=\"switch\"와 aria-checked로 읽히므로 켜짐과 꺼짐을 상태로 알립니다. 라벨 글자가 상태를 대신하지 않습니다.",
        en: "The control is exposed as role=\"switch\" with aria-checked, so the state is announced. The label text should not be the only state cue.",
      },
      {
        ko: "label을 주면 라벨 행 전체가 하나의 label이 되어 스위치에 이름이 붙고, 행 아무 곳이나 눌러도 바뀝니다.",
        en: "With label the whole row becomes one label: it names the switch and pressing anywhere on the row toggles it.",
      },
      {
        ko: "바뀐 값은 화면에서 바로 반영되어야 합니다. 저장이 필요한 설정에 이 컴포넌트를 쓰면 사용자는 이미 적용됐다고 믿게 됩니다.",
        en: "The change has to land immediately in the interface. Using this control for a value that waits on save makes people believe it already applied.",
      },
    ],
    keyboard: [
      {
        keys: ["Space"],
        action: { ko: "켜짐과 꺼짐을 바꿉니다.", en: "Toggles the switch." },
      },
      {
        keys: ["Enter"],
        action: { ko: "켜짐과 꺼짐을 바꿉니다.", en: "Toggles the switch." },
      },
      {
        keys: ["Tab"],
        action: { ko: "다음 포커스 가능한 요소로 이동합니다.", en: "Moves focus to the next focusable control." },
      },
    ],
  },
};
