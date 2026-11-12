/**
 * Reference doc for `Banner`, written against
 * `packages/react/src/components/banner.tsx` and
 * `packages/flutter/lib/src/components/banner.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "banner",
  anatomy: {
    description: {
      ko: "Banner는 화면이나 영역 위에 붙는 알림 띠입니다. 아이콘, 문구, 선택적인 동작 하나로 이루어지고 tone이 아이콘과 테두리 색, ARIA 역할을 함께 정합니다.",
      en: "A Banner is a notice strip attached to a screen or a region. It holds an icon, a line of text and at most one action; tone sets the icon, the rim colour and the ARIA role together.",
    },
    parts: [
      {
        name: "Strip",
        slot: "div",
        description: {
          ko: "알림의 바탕과 테두리, 안쪽 여백을 갖는 요소입니다. tone에 따라 role이 status나 alert로 정해집니다.",
          en: "The element that carries the fill, border and padding. tone decides whether its role is status or alert.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 안쪽에 깔리는 유리 레이어입니다. 테두리 색은 --glass-edge로 유리 가장자리에 전달됩니다.",
          en: "A glass layer laid inside when surface is glass. The rim colour reaches the glass edge through --glass-edge.",
        },
      },
      {
        name: "Icon",
        slot: "icon",
        description: {
          ko: "tone에 따라 Info 또는 WarningCircle이 그려지는 아이콘입니다. sm 14px, md 16px, lg 20px입니다.",
          en: "The icon, Info or WarningCircle by tone. It is 14px, 16px or 20px with the size.",
        },
      },
      {
        name: "Message",
        slot: "children",
        description: {
          ko: "알림 문구입니다. 남는 폭을 모두 쓰고 본문 색으로 그려집니다.",
          en: "The notice text. It takes the remaining width and is drawn in primary text.",
        },
      },
      {
        name: "Action",
        slot: "action",
        description: {
          ko: "오른쪽에 붙는 밑줄 동작 하나입니다. 링크나 버튼을 넘기면 같은 줄에 놓입니다.",
          en: "One underlined action at the trailing edge. A link or a button passed here sits on the same row.",
        },
      },
    ],
  },
  properties: [
    {
      id: "tone",
      title: { ko: "tone", en: "tone" },
      description: {
        ko: "알림의 심각도입니다. 아이콘, 테두리 색, ARIA 역할이 함께 바뀝니다.",
        en: "The severity of the notice. The icon, rim colour and ARIA role change together.",
      },
      values: [
        {
          name: "info",
          description: {
            ko: "브랜드 색 테두리와 Info 아이콘을 쓰고 role status로 그려집니다. 알아 두면 좋은 소식이나 상태에 맞습니다.",
            en: "Brand rim with the Info icon, rendered with role status. Suits news or a state worth knowing.",
          },
        },
        {
          name: "danger",
          description: {
            ko: "위험 색 테두리와 WarningCircle 아이콘을 쓰고 role alert로 즉시 읽힙니다. 지금 고쳐야 하는 실패에만 씁니다.",
            en: "Danger rim with the WarningCircle icon and role alert, announced at once. Reserve it for a failure that has to be handled now.",
          },
        },
      ],
      example: "tones",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "띠의 바탕 재질입니다. solid는 불투명 표면, glass는 유리 패널이나 이미지 위에 놓는 재질입니다.",
        en: "The material of the strip. solid is an opaque surface; glass is for glass panels and imagery.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명 표면에 1px 기본 테두리를 쓰는 기본값입니다. 페이지 본문 안의 알림에 맞습니다.",
            en: "Opaque surface with a 1px default border. The default, and right for notices in page content.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "유리 바탕에 tone 색 가장자리를 씁니다. 배경 이미지나 유리 패널 위의 알림에 맞습니다.",
            en: "Glass fill with a tone-coloured edge, for notices on a background image or a glass panel.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "띠의 높이와 안쪽 여백, 아이콘, 문구, 동작의 글자 단계를 함께 정합니다.",
        en: "Sets the strip's height, padding and the type rung of the icon, the text and the action.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "최소 높이 32px에 body-sm 문구를 씁니다. 좁은 패널 안의 한 줄 알림에 맞습니다.",
            en: "At least 32px tall with body-sm text, for a one-line notice inside a narrow panel.",
          },
        },
        {
          name: "md",
          description: {
            ko: "Figma 기준 48px 높이에 body-md 문구를 쓰는 기본값입니다.",
            en: "48px tall with body-md text. This is the Figma size and the default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "56px 높이에 body-lg 문구를 씁니다. 화면 위쪽의 큰 공지에 맞습니다.",
            en: "56px tall with body-lg text, for a larger announcement at the top of a screen.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "action",
      title: { ko: "action", en: "action" },
      description: {
        ko: "알림 오른쪽에 붙는 동작 하나입니다. 넘긴 요소에 밑줄과 포인터 커서가 적용되고 줄바꿈하지 않습니다. 동작이 둘 이상 필요하면 Banner 대신 대화상자나 별도 화면을 씁니다.",
        en: "One action at the trailing edge. The element you pass gets an underline and a pointer cursor and never wraps. When two actions are needed, use a dialog or a screen instead of a Banner.",
      },
      example: "with-action",
    },
  ],
  guidelines: [
    {
      id: "danger-is-urgent",
      title: { ko: "danger는 지금 고쳐야 할 때만", en: "Danger is for what must be fixed now" },
      body: {
        ko: "danger는 role alert로 즉시 읽히므로 스크린 리더 사용자의 현재 작업을 끊습니다. 연결이 끊겨 에이전트가 멈춘 것처럼 지금 손을 써야 하는 실패에만 쓰고, 지난 기록은 info나 Badge로 남깁니다.",
        en: "danger is announced at once as role alert and interrupts what a screen reader user is doing. Keep it for a failure that needs action now, such as a lost connection that stopped an agent; record past events with info or a Badge.",
      },
      do: {
        ko: "메일함 연결이 끊겨 실행이 멈춘 알림에 danger를 씁니다.",
        en: "Use danger when a lost mailbox connection stopped the run.",
      },
      dont: {
        ko: "어제 실패한 작업의 기록에 danger를 쓰지 않습니다.",
        en: "Do not use danger for a failure recorded yesterday.",
      },
      example: "tones",
    },
    {
      id: "one-action",
      title: { ko: "동작은 하나만", en: "One action" },
      body: {
        ko: "Banner는 문구 한 줄과 동작 하나를 전제로 만든 폭입니다. 선택지가 둘 이상이면 사용자는 무엇을 먼저 해야 할지 판단해야 하므로 대화상자로 옮깁니다.",
        en: "A Banner is built for one line of text and one action. With two choices the reader has to work out which comes first, so move the decision into a dialog.",
      },
      do: {
        ko: "Reconnect 하나를 동작으로 둡니다.",
        en: "Offer Reconnect as the single action.",
      },
      dont: {
        ko: "Review와 Dismiss를 나란히 두지 않습니다.",
        en: "Do not place Review and Dismiss side by side.",
      },
      example: "with-action",
    },
    {
      id: "glass-on-imagery",
      title: { ko: "glass는 배경 위에서만", en: "Glass over a backdrop" },
      body: {
        ko: "glass는 유리 패널이나 이미지 위에서만 유리 바탕이 보입니다. 불투명한 본문 안에서는 solid와 구분되지 않으므로 solid를 씁니다.",
        en: "Glass shows its fill only on a glass panel or over imagery. In opaque page content it reads the same as solid, so use solid there.",
      },
      example: "surfaces",
    },
    {
      id: "length",
      title: { ko: "두 문장을 넘기지 않습니다", en: "Stay within two sentences" },
      body: {
        ko: "문구는 원인과 다음 행동을 한두 문장으로 적습니다. 설명이 더 필요하면 Banner 아래에 본문을 두고 Banner는 요약만 맡깁니다.",
        en: "State the cause and the next step in one or two sentences. When more explanation is needed, put the detail in the page body and let the Banner summarize.",
      },
      do: {
        ko: "Gmail에 연결하지 못했습니다. 다시 연결해 주세요.",
        en: "Could not reach Gmail. Reconnect to keep the agent running.",
      },
      dont: {
        ko: "오류 코드와 재시도 기록을 모두 띠 안에 넣지 않습니다.",
        en: "Do not put error codes and retry history into the strip.",
      },
      example: "tones",
    },
  ],
  specification: [
    {
      id: "tone-and-role",
      title: { ko: "tone과 역할", en: "Tone and role" },
      note: {
        ko: "solid는 본문 테두리와 tone 테두리를 함께 그립니다. glass는 투명 테두리 위에 --glass-edge로 tone 색을 전달합니다.",
        en: "solid draws the default border plus the tone border. glass draws a transparent border and passes the tone colour through --glass-edge.",
      },
      rows: [
        { state: "info", slot: "Strip", property: "role", value: "status" },
        { state: "info", slot: "Strip", property: "icon", value: "Info" },
        { state: "info", slot: "Strip", property: "text color", value: "text-text-brand" },
        { state: "info · solid", slot: "Strip", property: "border", value: "border-border-brand" },
        {
          state: "info · glass",
          slot: "Strip",
          property: "edge",
          value: "--glass-edge:var(--color-border-brand)",
        },
        { state: "danger", slot: "Strip", property: "role", value: "alert" },
        { state: "danger", slot: "Strip", property: "icon", value: "WarningCircle" },
        { state: "danger", slot: "Strip", property: "text color", value: "text-text-danger" },
        { state: "danger · solid", slot: "Strip", property: "border", value: "border-border-danger" },
        {
          state: "danger · glass",
          slot: "Strip",
          property: "edge",
          value: "--glass-edge:var(--color-border-danger)",
        },
        { state: "solid", slot: "Strip", property: "background", value: "bg-bg-surface" },
        { state: "glass", slot: "Strip", property: "background", value: "bg-glass-regular" },
        { state: "glass", slot: "Strip", property: "background layer", value: "LiquidGlass" },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Strip", property: "min height", value: "32px" },
        { state: "sm", slot: "Strip", property: "padding", value: "8px 12px" },
        { state: "sm", slot: "Strip", property: "gap", value: "8px" },
        { state: "sm", slot: "Icon", property: "size", value: "14px" },
        { state: "sm", slot: "Message", property: "font", value: "text-body-sm" },
        { state: "sm", slot: "Action", property: "font", value: "text-label-md" },
        { state: "md", slot: "Strip", property: "height", value: "48px" },
        { state: "md", slot: "Strip", property: "padding", value: "10px 16px" },
        { state: "md", slot: "Strip", property: "gap", value: "12px" },
        { state: "md", slot: "Icon", property: "size", value: "16px" },
        { state: "md", slot: "Message", property: "font", value: "text-body-md" },
        { state: "md", slot: "Action", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Strip", property: "height", value: "56px" },
        { state: "lg", slot: "Strip", property: "padding", value: "12px 20px" },
        { state: "lg", slot: "Strip", property: "gap", value: "12px" },
        { state: "lg", slot: "Icon", property: "size", value: "20px" },
        { state: "lg", slot: "Message", property: "font", value: "text-body-lg" },
        { state: "lg", slot: "Action", property: "font", value: "text-label-lg" },
      ],
    },
    {
      id: "layout-and-motion",
      title: { ko: "배치와 동작", en: "Layout and motion" },
      rows: [
        { state: "default", slot: "Strip", property: "display", value: "flex items-center" },
        { state: "default", slot: "Strip", property: "radius", value: "rounded-md" },
        { state: "default", slot: "Strip", property: "overflow", value: "overflow-clip" },
        { state: "default", slot: "Message", property: "width", value: "min-w-0 flex-1" },
        {
          state: "default",
          slot: "Strip",
          property: "motion",
          value: "motion-rise",
          note: {
            ko: "띠가 나타날 때 220ms 동안 아래에서 올라옵니다.",
            en: "The strip rises into place over 220ms when it mounts.",
          },
        },
        { state: "default", slot: "Action", property: "decoration", value: "underline" },
        { state: "default", slot: "Action", property: "wrap", value: "whitespace-nowrap" },
      ],
    },
  ],
  examples: [
    {
      id: "tones",
      title: { ko: "tone", en: "Tones" },
      description: {
        ko: "info와 danger를 나란히 두어 아이콘, 테두리, 역할의 차이를 보여 줍니다.",
        en: "info and danger side by side, showing the difference in icon, rim and role.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg의 높이와 글자 단계를 비교합니다.",
        en: "The sm, md and lg heights and type rungs.",
      },
    },
    {
      id: "with-action",
      title: { ko: "동작 포함", en: "With an action" },
      description: {
        ko: "알림 오른쪽에 동작 하나를 붙인 모습입니다. 동작은 밑줄로 강조됩니다.",
        en: "One action at the trailing edge, marked with an underline.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "glass 표면", en: "Glass surface" },
      description: {
        ko: "배경 이미지 위에 glass 알림을 놓아 유리 바탕과 tone 가장자리를 보여 줍니다.",
        en: "A glass banner over imagery, showing the fill and the tone-coloured edge.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "tone이 역할을 정합니다. info는 role status로 조용히 읽히고 danger는 role alert로 즉시 읽힙니다. 이 차이 때문에 danger는 지금 처리해야 하는 실패에만 씁니다.",
        en: "tone decides the role. info is a quiet role status; danger is role alert and is announced at once. That difference is why danger belongs only to failures that need handling now.",
      },
      {
        ko: "알림 문구만으로 상황과 다음 행동을 알 수 있어야 합니다. 아이콘은 aria-hidden이 아니지만 이름이 없으므로 문구가 뜻을 전달합니다.",
        en: "The text alone has to name the situation and the next step. The icon carries no name, so the copy does the work.",
      },
      {
        ko: "동작에 링크나 버튼을 넘기면 밑줄과 포인터 커서가 붙습니다. 동작의 이름은 무엇이 일어나는지로 적고 자세히 보기처럼 모호한 문구를 쓰지 않습니다.",
        en: "A link or button passed as action picks up the underline and pointer cursor. Name the action by what happens, not with a vague phrase like Learn more.",
      },
    ],
    keyboard: [],
  },
};
