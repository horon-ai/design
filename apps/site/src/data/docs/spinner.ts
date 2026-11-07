/**
 * Reference doc for `Spinner`, written against
 * `packages/react/src/components/spinner.tsx` and
 * `packages/flutter/lib/src/components/spinner.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "spinner",
  anatomy: {
    description: {
      ko: "Spinner는 작업이 진행 중임을 알리는 회전 표시입니다. 10% 잉크 고리 위에 4분의 1만큼의 진한 호가 돌고, 마운트된 동안 계속 회전합니다.",
      en: "A Spinner signals that work is running. A quarter arc turns over a 10% ink ring and keeps turning for as long as it is mounted.",
    },
    parts: [
      {
        name: "Ring",
        slot: "svg",
        description: {
          ko: "viewBox 100 기준의 원형 고리입니다. strokeWidth 11로 그리고 10% 잉크 색을 씁니다.",
          en: "The circular ring in a 100-unit viewBox, stroked at 11 with the 10% ink colour.",
        },
      },
      {
        name: "Arc",
        slot: "svg",
        description: {
          ko: "고리 위를 도는 4분의 1 호입니다. 브랜드 채움 색을 쓰고 회전은 svg 전체에 적용됩니다.",
          en: "The quarter arc that travels the ring. It is drawn in the brand fill, and the rotation applies to the whole svg.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "지름을 정합니다. 네 가지 이름값을 쓰거나 픽셀 숫자를 넘겨 한 자리에만 맞춥니다. 이름값은 form 컨트롤과 같은 계열이 아닌 Spinner 전용 눈금입니다.",
        en: "Sets the diameter. Use one of the four named rungs, or pass a pixel number to fit one spot exactly. The named rungs are Spinner's own scale, not the form-control scale.",
      },
      values: [
        {
          name: "xs",
          description: {
            ko: "14px입니다. 문장 안이나 아이콘 자리에 들어가는 가장 작은 값입니다.",
            en: "14px, the smallest, for a place inside a sentence or an icon slot.",
          },
        },
        {
          name: "sm",
          description: {
            ko: "16px입니다. 기본값이며 버튼 옆이나 행 안의 대기 표시에 맞습니다.",
            en: "16px. The default, and right for a waiting mark beside a button or inside a row.",
          },
        },
        {
          name: "md",
          description: {
            ko: "24px입니다. 카드나 패널이 로딩 중임을 알리는 자리에 맞습니다.",
            en: "24px, for a card or panel that is loading.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "32px입니다. 빈 영역 한가운데 두는 큰 대기 표시에 맞습니다.",
            en: "32px, for a large waiting mark centred in empty space.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "회전하는 동안 보조 기술이 읽는 이름입니다. 기본값은 Loading이고 role status로 전달됩니다. 화면 문구가 Saving처럼 구체적이면 같은 낱말을 넘깁니다.",
        en: "The name assistive technology reads while it spins. It defaults to Loading and is exposed through role status. When the screen says Saving, pass that same word.",
      },
      example: "with-text",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "svg에 병합되는 클래스입니다. animate-spin과 shrink-0은 항상 적용되므로 회전을 끄는 데 쓰지 않고 여백이나 색을 맞출 때만 씁니다.",
        en: "Classes merged onto the svg. animate-spin and shrink-0 are always applied, so do not use this to stop the spin; use it for spacing or colour fit.",
      },
      example: "numeric",
    },
  ],
  guidelines: [
    {
      id: "label-the-work",
      title: { ko: "무엇을 기다리는지 적습니다", en: "Name the wait" },
      body: {
        ko: "label은 화면에 보이지 않아도 보조 기술에는 들립니다. Saving, Loading agents처럼 기다리는 일을 적으면 시야가 없는 사용자도 무엇이 진행 중인지 압니다.",
        en: "The label is not on screen but is heard by assistive technology. Naming the work, as Saving or Loading agents, tells a user without sight what is running.",
      },
      do: {
        ko: "화면 문구와 같은 label=\"Saving\"을 넘깁니다.",
        en: "Pass label=\"Saving\", matching the words on screen.",
      },
      dont: {
        ko: "여러 스피너에 기본값 Loading만 쓰지 않습니다.",
        en: "Do not leave several spinners on the default Loading.",
      },
      example: "with-text",
    },
    {
      id: "short-waits",
      title: { ko: "짧은 기다림에 씁니다", en: "For short waits" },
      body: {
        ko: "Spinner는 끝이 보이지 않는 짧은 대기에 맞습니다. 화면 구조가 이미 정해져 있고 내용만 늦게 오는 자리에는 Skeleton을 쓰고, 남은 양을 아는 작업에는 Progress를 씁니다.",
        en: "A Spinner suits a short wait with no visible end. When the layout is already known and only the content is late, use a Skeleton; when the remaining amount is known, use Progress.",
      },
      example: "sizes",
    },
    {
      id: "pair-with-text",
      title: { ko: "문구와 함께 둡니다", en: "Keep text beside it" },
      body: {
        ko: "회전만 있는 표시는 동작 줄이기를 켠 사용자에게 멈춘 그림으로 보입니다. Saving처럼 무엇을 하는지 적은 문구를 옆에 두면 움직임과 무관하게 상태가 전달됩니다.",
        en: "A spin alone reads as a still image to someone with reduced motion on. Put the action beside it, as Saving, so the state survives without the movement.",
      },
      do: {
        ko: "Spinner 옆에 Saving 문구를 둡니다.",
        en: "Place Saving next to the Spinner.",
      },
      dont: {
        ko: "빈 영역에 스피너만 두지 않습니다.",
        en: "Do not leave a bare spinner in an empty region.",
      },
      example: "with-text",
    },
    {
      id: "numeric-size",
      title: { ko: "이름값 밖의 크기는 숫자로", en: "Use a number off the scale" },
      body: {
        ko: "행 높이에 맞춰 15px이나 20px처럼 이름값 사이 크기가 필요하면 size에 숫자를 넘깁니다. 이름값을 억지로 맞추려고 className으로 크기를 덮지 않습니다.",
        en: "When a row needs a size between the named rungs, such as 15px or 20px, pass a number to size. Do not override the size in className to force a named rung to fit.",
      },
      example: "numeric",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      note: {
        ko: "숫자를 넘기면 width와 height가 그 픽셀 값이 되고 이름값 클래스는 붙지 않습니다.",
        en: "A number sets width and height to that pixel value and applies no named size class.",
      },
      rows: [
        { state: "xs", slot: "svg", property: "size", value: "14px" },
        { state: "sm", slot: "svg", property: "size", value: "16px" },
        { state: "md", slot: "svg", property: "size", value: "24px" },
        { state: "lg", slot: "svg", property: "size", value: "32px" },
        { state: "number", slot: "svg", property: "size", value: "width/height 속성" },
      ],
    },
    {
      id: "appearance",
      title: { ko: "모양", en: "Appearance" },
      rows: [
        { state: "default", slot: "Ring", property: "stroke", value: "stroke-overlay-ink-10" },
        { state: "default", slot: "Arc", property: "stroke", value: "stroke-interactive-primary" },
        { state: "default", slot: "Ring", property: "stroke width", value: "11" },
        { state: "default", slot: "svg", property: "viewBox", value: "0 0 100 100" },
        { state: "default", slot: "svg", property: "shrink", value: "shrink-0" },
        { state: "default", slot: "svg", property: "fill", value: "none" },
      ],
    },
    {
      id: "motion-and-semantics",
      title: { ko: "움직임과 의미", en: "Motion and semantics" },
      rows: [
        {
          state: "default",
          slot: "svg",
          property: "animation",
          value: "animate-spin",
          note: {
            ko: "마운트된 동안 1초 주기로 계속 돕니다.",
            en: "It turns on a 1s cycle for as long as it is mounted.",
          },
        },
        {
          state: "reduced motion",
          slot: "svg",
          property: "animation",
          value: "0.01ms · 1회",
          note: {
            ko: "동작 줄이기를 켜면 한 번만 돌고 멈춘 그림이 됩니다. 상태 문구를 함께 두어야 합니다.",
            en: "With reduced motion it turns once and becomes a still image, so the state needs text beside it.",
          },
        },
        { state: "default", slot: "svg", property: "role", value: "status" },
        { state: "default", slot: "svg", property: "accessible name", value: "aria-label" },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "xs, sm, md, lg 네 눈금을 나란히 두었습니다.",
        en: "The xs, sm, md and lg rungs side by side.",
      },
    },
    {
      id: "with-text",
      title: { ko: "문구와 함께", en: "With text" },
      description: {
        ko: "Saving처럼 하는 일을 적은 문구 옆에 스피너를 둡니다. label도 같은 낱말입니다.",
        en: "A spinner beside the action it performs, with the same word as its label.",
      },
    },
    {
      id: "numeric",
      title: { ko: "픽셀 크기", en: "Pixel size" },
      description: {
        ko: "이름값 사이 크기가 필요할 때 숫자를 넘겨 행 높이에 맞춥니다.",
        en: "A number fits the spinner to a row when no named rung matches.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "svg가 role status와 aria-label을 가지므로 회전이 시작될 때 이름이 읽힙니다. 기본값 Loading 대신 실제 작업 이름을 넘깁니다.",
        en: "The svg carries role status and aria-label, so its name is read when the spin starts. Pass the real task name instead of the default Loading.",
      },
      {
        ko: "동작 줄이기를 켜면 회전이 한 번만 실행되어 정지한 그림처럼 보입니다. 같은 정보를 문구로도 전달해야 상태를 알 수 있습니다.",
        en: "With reduced motion the spin runs once and looks still. The same information has to be in text for the state to be known.",
      },
      {
        ko: "스피너는 포커스를 받지 않습니다. 포커스는 기다림을 시작한 컨트롤에 남겨 두고, 완료되면 그 컨트롤의 상태를 문구로 바꿉니다.",
        en: "The spinner takes no focus. Leave focus on the control that started the wait and change that control's state in text when it finishes.",
      },
    ],
    keyboard: [],
  },
};
