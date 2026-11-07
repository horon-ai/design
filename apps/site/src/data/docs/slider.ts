/**
 * Reference doc for `Slider`, written against
 * `packages/react/src/components/slider.tsx` and
 * `packages/flutter/lib/src/components/slider.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "slider",
  anatomy: {
    description: {
      ko: "Slider는 가는 트랙 위의 손잡이 하나로 값을 고르는 컨트롤입니다. 20px 높이의 조작 영역 전체가 드래그와 클릭을 받고, 그 안에 6px 트랙과 채움, 18px 손잡이가 차례로 놓입니다.",
      en: "A Slider picks a value with one handle on a thin track. The whole 20px control row takes drags and clicks, and inside it sit the 6px track, its fill, and the 18px thumb.",
    },
    parts: [
      {
        name: "Root",
        slot: "Root",
        description: {
          ko: "값과 범위를 들고 있는 바깥 상자입니다. 기본 너비는 220px이고 부모가 좁으면 그 너비를 넘지 않습니다.",
          en: "The outer box that owns the value and its range. It is 220px wide by default and never exceeds a narrower parent.",
        },
      },
      {
        name: "Control",
        slot: "Control",
        description: {
          ko: "높이 20px의 조작 영역입니다. 드래그와 클릭을 받고, 비활성일 때 커서가 not-allowed로 바뀝니다.",
          en: "The 20px interaction row. It takes drags and clicks, and turns the cursor to not-allowed while disabled.",
        },
      },
      {
        name: "Track",
        slot: "Track",
        description: {
          ko: "높이 6px의 둥근 트랙입니다. 8% 잉크로 그려 카드 위에서도 배경과 구분됩니다.",
          en: "The 6px rounded track. It is drawn in 8% ink so it stays visible on a card.",
        },
      },
      {
        name: "Indicator",
        slot: "Indicator",
        description: {
          ko: "트랙에서 최소값부터 지금 값까지를 채우는 부분입니다. interactive-primary 색을 씁니다.",
          en: "The part of the track filled from the minimum to the current value, in interactive-primary.",
        },
      },
      {
        name: "Thumb",
        slot: "Thumb",
        description: {
          ko: "18px 원형 손잡이로, 이 컨트롤에서 유일하게 포커스를 받는 요소입니다. 흰 바탕에 1px 테두리와 옅은 그림자가 있고, hover에서 105%, 누르면 110%로 커집니다.",
          en: "The 18px round handle and the only focusable element here. It is white with a 1px border and a soft shadow, and scales to 105% on hover and 110% while pressed.",
        },
      },
    ],
  },
  properties: [
    {
      id: "aria-label",
      title: { ko: "aria-label", en: "aria-label" },
      description: {
        ko: "손잡이의 접근 가능한 이름입니다. 슬라이더에는 보이는 라벨이 없으므로 무엇을 조절하는지 반드시 붙입니다.",
        en: "Accessible name of the thumb. A slider has no visible label, so always name what it controls here.",
      },
      example: "basic",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 조작 영역이 40% 불투명도로 흐려지고 커서가 not-allowed로 바뀌며 드래그와 키 입력이 모두 막힙니다. 값을 지우지 않고 이 상태로 남겨 두면 조절할 수 있는 대상이 있다는 것을 알립니다.",
        en: "When true the control row fades to 40% opacity, the cursor becomes not-allowed, and both dragging and keys stop. Keeping it in place this way says the setting exists but cannot change.",
      },
      example: "disabled",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "바깥 상자에 합쳐지는 클래스입니다. 기본 220px을 넘기거나 줄일 때 너비를 여기서 정합니다.",
        en: "Classes merged onto the root. Set the width here to go past or below the default 220px.",
      },
      example: "width",
    },
  ],
  guidelines: [
    {
      id: "value-over-choice",
      title: { ko: "값의 크기보다 정확한 값이 중요하면 Slider를 쓰지 않습니다", en: "Skip the slider when the exact number matters" },
      body: {
        ko: "Slider는 눈으로 어림잡아 옮기는 컨트롤입니다. 몇 초, 몇 퍼센트처럼 정확한 값이 결과를 바꾸면 숫자를 직접 넣는 Input을 쓰고, Slider는 소리 크기나 속도처럼 연속해서 조절하며 결과를 바로 확인하는 설정에 씁니다.",
        en: "A slider is meant to be moved by eye. When an exact number changes the result, such as a timeout or a percentage, use an Input and type it; keep the slider for settings you tune continuously and judge by the result, such as volume or speed.",
      },
      do: {
        ko: "속도, 음량, 밝기처럼 조절한 결과를 바로 확인하는 값에 씁니다.",
        en: "Use it for speed, volume or brightness, values you judge the moment they change.",
      },
      dont: {
        ko: "0.5초 단위로 맞춰야 하는 타임아웃에 슬라이더를 쓰지 않습니다.",
        en: "Do not use a slider for a timeout that must land on an exact step.",
      },
      example: "width",
    },
    {
      id: "label-the-thumb",
      title: { ko: "손잡이에 이름을 붙입니다", en: "Name the thumb" },
      body: {
        ko: "슬라이더는 라벨이 없으므로 aria-label로 조절 대상의 이름을 줍니다. 화면에 캡션을 함께 보여 줄 때도 이름은 필요합니다. 캡션은 시각적 설명이고, 스크린 리더는 aria-label만 읽습니다.",
        en: "A slider carries no label of its own, so give it an aria-label that names the setting. A visible caption next to it is not enough: the caption is visual and the screen reader reads only aria-label.",
      },
      do: {
        ko: "aria-label=\"Voice speed\"처럼 조절 대상을 그대로 적습니다.",
        en: "Name the setting itself, as in aria-label=\"Voice speed\".",
      },
      dont: {
        ko: "aria-label 없이 값만 보여 주지 않습니다.",
        en: "Do not show only the number and leave the control unnamed.",
      },
      example: "basic",
    },
    {
      id: "one-track-per-setting",
      title: { ko: "설정 하나에 트랙 하나", en: "One track per setting" },
      body: {
        ko: "트랙 한 줄은 값 하나입니다. 시작과 끝 두 값이 필요하면 두 개의 Slider를 세로로 쌓고 각각 이름을 붙입니다. 두 값을 한 트랙에서 함께 다루는 range 슬라이더는 이 컴포넌트가 제공하지 않습니다.",
        en: "One track holds one value. When a setting needs a start and an end, stack two sliders and name each one. This component does not provide a two-handle range slider.",
      },
      example: "basic",
    },
  ],
  specification: [
    {
      id: "track-and-thumb",
      title: { ko: "트랙과 손잡이", en: "Track and thumb" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 크기는 해당 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; sizes are the pixels those utilities produce.",
      },
      rows: [
        { state: "default", slot: "Root", property: "width", value: "w-55" },
        { state: "default", slot: "Root", property: "max width", value: "max-w-full" },
        { state: "default", slot: "Control", property: "height", value: "h-5 (20px)" },
        { state: "default", slot: "Track", property: "height", value: "h-1.5 (6px)" },
        { state: "default", slot: "Track", property: "background", value: "bg-overlay-ink-8" },
        { state: "default", slot: "Track", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Indicator", property: "background", value: "bg-interactive-primary" },
        { state: "default", slot: "Thumb", property: "size", value: "18px" },
        { state: "default", slot: "Thumb", property: "background", value: "bg-bg-default" },
        { state: "default", slot: "Thumb", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Thumb", property: "shadow", value: "0 1px 3px #0000001f" },
        { state: "hover", slot: "Thumb", property: "scale", value: "1.05" },
        { state: "pressed", slot: "Thumb", property: "scale", value: "1.10" },
        { state: "focus-visible", slot: "Thumb", property: "outline", value: "2px outline-text-brand" },
        {
          state: "focus-visible",
          slot: "Thumb",
          property: "outline offset",
          value: "2px",
          note: {
            ko: "키보드로 포커스가 닿았을 때만 그립니다.",
            en: "Drawn only when focus arrives from the keyboard.",
          },
        },
        { state: "disabled", slot: "Control", property: "opacity", value: "40%" },
        { state: "disabled", slot: "Control", property: "cursor", value: "not-allowed" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        { state: "hover · pressed", slot: "Thumb", property: "transition", value: "transition-[scale,box-shadow] duration-120 ease-out-quint" },
        {
          state: "hover · pressed",
          slot: "Thumb",
          property: "duration",
          value: "120ms",
          note: {
            ko: "동작 줄이기를 켜면 상태 변화가 즉시 끝납니다.",
            en: "With reduced motion on, state changes finish instantly.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "기본값 50에서 시작하는 트랙 하나입니다. aria-label이 손잡이의 이름이 됩니다.",
        en: "One track starting at 50. The aria-label names the thumb.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어 상태", en: "Controlled value" },
      description: {
        ko: "value와 onValueChange로 값을 바깥에서 들고, 지금 값을 라벨에 함께 보여 줍니다.",
        en: "Holding the value outside through value and onValueChange, with the current number shown beside it.",
      },
    },
    {
      id: "width",
      title: { ko: "너비", en: "Width" },
      description: {
        ko: "기본 220px 너비와 className으로 넓힌 너비를 나란히 두었습니다.",
        en: "The default 220px width next to one widened through className.",
      },
    },
    {
      id: "disabled",
      title: { ko: "비활성", en: "Disabled" },
      description: {
        ko: "비활성 트랙은 자리를 지킨 채 40% 불투명도로 흐려집니다.",
        en: "A disabled track keeps its place and fades to 40% opacity.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Slider Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/" },
    notes: [
      {
        ko: "손잡이가 aria-valuenow, aria-valuemin, aria-valuemax와 aria-orientation을 들고 값의 위치를 스크린 리더에 알립니다. 값이 바뀌면 화면의 숫자도 함께 갱신해 두 곳이 어긋나지 않게 합니다.",
        en: "The thumb carries aria-valuenow, aria-valuemin, aria-valuemax and aria-orientation, so the screen reader knows where the value sits. When it changes, update any visible number as well so the two never disagree.",
      },
      {
        ko: "포커스는 손잡이에만 닿고, 2px outline을 2px 떨어뜨려 그립니다. 트랙이나 채움에는 포커스가 가지 않습니다.",
        en: "Only the thumb takes focus, with a 2px outline held 2px off it. Neither the track nor the fill is focusable.",
      },
      {
        ko: "조절 영역이 20px 높이라 손가락으로 잡기에는 좁습니다. 터치가 주 입력인 화면에서는 세로 여백을 두어 손가락이 트랙 밖을 눌러도 값이 바뀌지 않게 합니다.",
        en: "The 20px row is thin for a finger. On touch-first screens leave vertical space around it so a press just outside the track does not move the value.",
      },
    ],
    keyboard: [
      {
        keys: ["ArrowRight", "ArrowUp"],
        action: { ko: "값을 step만큼 올립니다.", en: "Raises the value by one step." },
      },
      {
        keys: ["ArrowLeft", "ArrowDown"],
        action: { ko: "값을 step만큼 내립니다.", en: "Lowers the value by one step." },
      },
      {
        keys: ["Shift", "Arrow"],
        action: { ko: "한 번에 큰 폭으로 값을 옮깁니다.", en: "Moves the value by a large step." },
      },
      {
        keys: ["PageUp", "PageDown"],
        action: { ko: "큰 폭으로 값을 올리거나 내립니다.", en: "Raises or lowers the value by a large step." },
      },
      {
        keys: ["Home"],
        action: { ko: "최소값으로 옮깁니다.", en: "Moves to the minimum." },
      },
      {
        keys: ["End"],
        action: { ko: "최대값으로 옮깁니다.", en: "Moves to the maximum." },
      },
      {
        keys: ["Tab"],
        action: { ko: "다음 포커스 가능한 요소로 이동합니다.", en: "Moves focus to the next focusable control." },
      },
    ],
  },
};
