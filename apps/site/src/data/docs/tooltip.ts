/**
 * Reference doc for `Tooltip`, written against
 * `packages/react/src/components/tooltip.tsx` and
 * `packages/flutter/lib/src/components/tooltip.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "tooltip",
  anatomy: {
    description: {
      ko: "Tooltip은 요소 위에 짧은 이름을 띄우는 말풍선입니다. 자식 엘리먼트가 그대로 트리거가 되고, 말풍선과 화살표는 포털에 마운트됩니다.",
      en: "A Tooltip floats a short label over an element. The child element becomes the trigger unchanged, and the bubble and its arrow are portalled.",
    },
    parts: [
      {
        name: "Tooltip",
        slot: "Tooltip",
        description: {
          ko: "트리거와 말풍선을 묶는 루트입니다. 열림 상태는 Base UI가 관리합니다.",
          en: "The root that pairs the trigger with the bubble. Base UI manages the open state.",
        },
      },
      {
        name: "Trigger",
        slot: "children",
        description: {
          ko: "children으로 넘긴 엘리먼트입니다. 감싸는 노드를 만들지 않고 그 요소 자체에 이벤트가 붙습니다.",
          en: "The element passed as children. No wrapper node is added; the events attach to that element.",
        },
      },
      {
        name: "Popup",
        slot: "Popup",
        description: {
          ko: "잉크 바탕의 말풍선입니다. 폭은 256px에서 멈추고 안쪽에서 줄바꿈합니다.",
          en: "The ink-filled bubble. Its width stops at 256px and wraps inside that.",
        },
      },
      {
        name: "Arrow",
        slot: "Arrow",
        description: {
          ko: "10x6px 화살표입니다. side에 따라 말풍선의 해당 모서리로 옮겨집니다.",
          en: "A 10x6px arrow that moves to the matching edge of the bubble for the chosen side.",
        },
      },
    ],
  },
  properties: [
    {
      id: "side",
      title: { ko: "side", en: "side" },
      description: {
        ko: "말풍선이 열릴 방향입니다. 공간이 모자라면 Base UI가 반대편으로 뒤집고 화살표도 함께 따라갑니다.",
        en: "The direction the bubble opens in. When there is no room Base UI flips it and the arrow follows.",
      },
      values: [
        { name: "top", description: { ko: "트리거 위에 열고 기본값입니다.", en: "Opens above the trigger. The default." } },
        { name: "bottom", description: { ko: "트리거 아래에 엽니다.", en: "Opens below the trigger." } },
        { name: "left", description: { ko: "트리거 왼쪽에 엽니다.", en: "Opens to the left of the trigger." } },
        { name: "right", description: { ko: "트리거 오른쪽에 엽니다.", en: "Opens to the right of the trigger." } },
      ],
      example: "sides",
    },
    {
      id: "delay",
      title: { ko: "delay", en: "delay" },
      description: {
        ko: "포인터가 올라간 뒤 말풍선이 열리기까지의 밀리초입니다. 값을 주지 않으면 Base UI 기본값을 씁니다.",
        en: "Milliseconds between the pointer entering and the bubble opening. Omitting it keeps Base UI's default.",
      },
      example: "delay",
    },
  ],
  guidelines: [
    {
      id: "name-not-content",
      title: { ko: "이름을 되풀이하고, 내용은 넣지 않습니다", en: "Repeat the name, not the content" },
      body: {
        ko: "툴팁은 아이콘 버튼이나 잘린 라벨의 이름을 알려 주는 자리입니다. 눌러야 할 정보나 읽어야 할 설명을 여기에 넣으면 키보드와 터치 사용자는 그 내용을 놓칩니다.",
        en: "A tooltip names an icon button or a truncated label. Information the user must read or act on does not belong here, because keyboard and touch users miss it.",
      },
      do: {
        ko: "복사 아이콘 위에 Copy를 띄웁니다.",
        en: "Show Copy over the copy icon.",
      },
      dont: {
        ko: "저장 형식과 만료 시각을 툴팁 안에만 적지 않습니다.",
        en: "Do not put the saved format and expiry time only inside a tooltip.",
      },
      example: "sides",
    },
    {
      id: "short-phrase",
      title: { ko: "한 구절로 줄입니다", en: "Keep it to a phrase" },
      body: {
        ko: "말풍선은 256px에서 폭이 멈추고 안쪽에서 줄바꿈합니다. 두 줄을 넘기면 읽는 동안 시선이 흔들리므로 한 구절로 줄입니다.",
        en: "The bubble caps at 256px and wraps inside it. Past two lines the eye loses the trigger, so keep it to one phrase.",
      },
      example: "delay",
    },
    {
      id: "shared-timing",
      title: { ko: "묶음은 Provider로 감쌉니다", en: "Share timing with a provider" },
      body: {
        ko: "TooltipProvider로 묶으면 인접한 트리거 사이를 옮겨 다닐 때 지연이 다시 시작되지 않습니다. 도구 모음처럼 여러 버튼을 오가며 쓰는 자리에 맞습니다.",
        en: "TooltipProvider keeps the delay from restarting as the pointer moves between adjacent triggers, which suits a toolbar you scan across.",
      },
      example: "toolbar",
    },
  ],
  specification: [
    {
      id: "bubble",
      title: { ko: "말풍선", en: "Bubble" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "all", slot: "Popup", property: "background", value: "bg-interactive-primary" },
        { state: "all", slot: "Popup", property: "text color", value: "text-interactive-on-primary" },
        { state: "all", slot: "Popup", property: "padding", value: "px-2.5 py-1.5" },
        { state: "all", slot: "Popup", property: "radius", value: "rounded-sm" },
        { state: "all", slot: "Popup", property: "font", value: "text-label-sm" },
        { state: "all", slot: "Popup", property: "max width", value: "max-w-64" },
        { state: "all", slot: "Popup", property: "motion", value: "motion-popup duration-150" },
        { state: "all", slot: "Popup", property: "offset", value: "6px" },
        { state: "all", slot: "Arrow", property: "size", value: "10px x 6px" },
        { state: "all", slot: "Arrow", property: "fill", value: "fill-interactive-primary" },
        { state: "top", slot: "Arrow", property: "position", value: "-bottom-1.5" },
        { state: "bottom", slot: "Arrow", property: "position", value: "-top-1.5 rotate-180" },
        { state: "left", slot: "Arrow", property: "position", value: "-right-2 -rotate-90" },
        { state: "right", slot: "Arrow", property: "position", value: "-left-2 rotate-90" },
        { state: "reduced motion", slot: "Popup", property: "motion", value: "0.01ms" },
      ],
    },
  ],
  examples: [
    {
      id: "sides",
      title: { ko: "방향", en: "Sides" },
      description: {
        ko: "네 방향을 한자리에 두었습니다. 화살표가 말풍선의 해당 모서리로 옮겨집니다.",
        en: "All four sides together. The arrow moves to the matching edge of each bubble.",
      },
    },
    {
      id: "delay",
      title: { ko: "지연", en: "Delay" },
      description: {
        ko: "delay를 0과 500으로 준 두 버튼입니다. 값이 없으면 Base UI 기본값을 씁니다.",
        en: "Two buttons with delay set to 0 and 500. Omitting it keeps Base UI's default.",
      },
    },
    {
      id: "toolbar",
      title: { ko: "도구 모음", en: "In a toolbar" },
      description: {
        ko: "Provider로 묶은 유리 도구 모음입니다. 버튼 사이를 옮겨도 지연이 다시 시작되지 않습니다.",
        en: "A glass toolbar wrapped in a provider. Moving between buttons does not restart the delay.",
      },
    },
  ],
  accessibility: {
    pattern: {
      label: "WAI-ARIA Tooltip Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/",
    },
    notes: [
      {
        ko: "말풍선은 트리거의 설명으로 붙고 트리거의 이름을 대신하지 않습니다. 아이콘 버튼에는 IconButton의 label처럼 자체 이름이 있어야 합니다.",
        en: "The bubble attaches as the trigger's description and does not replace its name. An icon button still needs its own name, as IconButton's label gives it.",
      },
      {
        ko: "마우스가 올라갈 때와 키보드 포커스가 닿을 때 모두 열립니다. 그래서 툴팁에만 있는 정보는 포커스 이동으로도 읽을 수 있습니다.",
        en: "It opens on pointer hover and on keyboard focus, so anything a tooltip says is also reachable by tabbing.",
      },
      {
        ko: "말풍선 안에는 포커스 가능한 요소를 두지 않습니다. 안에 버튼을 넣으면 말풍선이 닫히는 순간 그 버튼에 닿을 수 없습니다.",
        en: "Do not put focusable elements inside the bubble; once it closes, nothing can reach them.",
      },
      {
        ko: "말풍선은 잉크 바탕에 흰 글자를 씁니다. 두 색을 임의로 바꾸면 대비가 흔들리므로 그대로 씁니다. 동작 줄이기를 켜면 나타남과 사라짐이 즉시 끝납니다.",
        en: "The bubble draws light text on the ink fill. Overriding either colour unsettles the contrast, so keep both. With reduced motion on, appearing and leaving finish instantly.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "트리거에 포커스가 닿으면 말풍선이 열리고, 다음 요소로 옮기면 닫힙니다.", en: "Focus on the trigger opens the bubble; moving on closes it." },
      },
      {
        keys: ["Escape"],
        action: { ko: "열린 말풍선을 닫습니다.", en: "Closes the open bubble." },
      },
    ],
  },
};
