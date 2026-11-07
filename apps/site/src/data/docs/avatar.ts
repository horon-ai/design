/**
 * Reference doc for `Avatar`, written against
 * `packages/react/src/components/avatar.tsx` and
 * `packages/flutter/lib/src/components/avatar.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "avatar",
  anatomy: {
    description: {
      ko: "Avatar는 사람이나 에이전트를 나타내는 원형 표시입니다. 이니셜, 봇 아이콘, 이미지 중 하나를 담고 오른쪽 아래에 상태 점을 붙일 수 있습니다. Base UI의 avatar 프리미티브를 쓰므로 이미지를 불러오지 못하면 깨진 아이콘 대신 children으로 돌아갑니다.",
      en: "An Avatar is the round marker for a person or an agent. It holds initials, a bot icon or an image, with an optional status dot at the bottom right. It uses Base UI's avatar primitive, so a failed image falls back to the children instead of a broken icon.",
    },
    parts: [
      {
        name: "Root",
        slot: "Root",
        description: {
          ko: "지름과 바탕색이 정해진 원형 컨테이너입니다. 안쪽에 1px 잉크 링을 그려 밝은 배경에서도 윤곽이 남습니다.",
          en: "The round container that carries the diameter and the fill. A 1px ink ring is drawn inside it so the edge survives on light surfaces.",
        },
      },
      {
        name: "Image",
        slot: "Image",
        description: {
          ko: "type이 image이고 src가 있을 때만 렌더링되는 이미지입니다. 원을 가득 채우고 불러오는 동안 서서히 나타납니다.",
          en: "The image, rendered only when type is image and src is set. It fills the circle and fades in while it loads.",
        },
      },
      {
        name: "Fallback",
        slot: "children",
        description: {
          ko: "이미지가 없거나 실패했을 때 보이는 내용입니다. 보통 이니셜을 넣고, 봇은 children 대신 type bot을 씁니다.",
          en: "What shows when there is no image or the image fails. Usually initials; for a bot, use type instead of placing an icon here.",
        },
      },
      {
        name: "Bot icon",
        slot: "type",
        description: {
          ko: "type이 bot일 때 children 대신 그려지는 로봇 아이콘입니다. 지름에 맞춰 13px, 18px, 22px, 31px로 커집니다.",
          en: "The robot icon drawn instead of children when type is bot. It scales with the diameter to 13px, 18px, 22px or 31px.",
        },
      },
      {
        name: "Live dot",
        slot: "live",
        description: {
          ko: "live가 참일 때 오른쪽 아래에 붙는 상태 점입니다. 2px 테두리로 뒤 표면과 경계를 만들고 천천히 맥동합니다.",
          en: "The status dot at the bottom right when live is true. A 2px border separates it from the surface behind, and it pulses slowly.",
        },
      },
    ],
  },
  properties: [
    {
      id: "type",
      title: { ko: "type", en: "type" },
      description: {
        ko: "아바타가 무엇을 보여 줄지 정합니다. 사람은 이니셜이나 사진, 에이전트는 봇 아이콘을 씁니다.",
        en: "What the avatar shows. People get initials or a photo; agents get the bot icon.",
      },
      values: [
        {
          name: "initials",
          description: {
            ko: "children의 글자를 보조 표면 위에 그리는 기본값입니다. 이름의 첫 글자 두 자를 넣습니다.",
            en: "Draws the children as text on the subtle surface. This is the default; pass the first two letters of the name.",
          },
        },
        {
          name: "bot",
          description: {
            ko: "브랜드 바탕에 로봇 아이콘을 그립니다. 사람이 아닌 에이전트를 나타낼 때 씁니다.",
            en: "Draws the robot icon on the brand tint, for an agent rather than a person.",
          },
        },
        {
          name: "image",
          description: {
            ko: "src의 사진을 원 안에 채웁니다. 불러오는 동안과 실패했을 때는 children이 보입니다.",
            en: "Fills the circle with the photo at src. The children show while it loads and if it fails.",
          },
        },
      ],
      example: "types",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "지름을 정하고 이니셜 글자, 봇 아이콘, 상태 점 크기를 함께 바꿉니다.",
        en: "Sets the diameter and scales the initials, the bot icon and the live dot with it.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "지름 24px입니다. 목록 행이나 댓글처럼 촘촘한 자리에 맞습니다.",
            en: "24px across, for dense places such as list rows and comments.",
          },
        },
        {
          name: "md",
          description: {
            ko: "지름 32px입니다. 기본값이며 대부분의 헤더와 행에 맞습니다.",
            en: "32px across. The default, and the right pick for most headers and rows.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "지름 40px입니다. 카드 머리나 상세 화면의 주체를 표시할 때 맞습니다.",
            en: "40px across, for a card header or the subject of a detail view.",
          },
        },
        {
          name: "xl",
          description: {
            ko: "지름 56px입니다. 프로필 상단처럼 아바타가 화면의 주인공일 때 씁니다.",
            en: "56px across, for a profile header where the avatar leads the screen.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "tone",
      title: { ko: "tone", en: "tone" },
      description: {
        ko: "initials 아바타의 색만 바꿉니다. bot과 image에는 적용되지 않습니다.",
        en: "Changes the colour of an initials avatar only. It does not apply to bot or image.",
      },
      values: [
        {
          name: "neutral",
          description: {
            ko: "보조 표면 바탕에 보조 텍스트를 쓰는 기본값입니다.",
            en: "The subtle surface with secondary text. This is the default.",
          },
        },
        {
          name: "sky",
          description: {
            ko: "하늘색 바탕에 진한 하늘색 글자를 씁니다. 계정 프로필처럼 아바타가 사람을 대표하는 자리에 씁니다.",
            en: "A sky fill with darker sky text, for a place where the avatar stands for the person, such as an account profile.",
          },
        },
      ],
      example: "tone",
    },
    {
      id: "live",
      title: { ko: "live", en: "live" },
      description: {
        ko: "참이면 오른쪽 아래에 상태 점을 붙입니다. 점은 aria-hidden이라 스크린 리더가 읽지 않으므로 온라인 여부는 문구로도 알립니다.",
        en: "When true a status dot appears at the bottom right. The dot is aria-hidden, so an online state also needs to be stated in text.",
      },
      example: "live",
    },
    {
      id: "src",
      title: { ko: "src", en: "src" },
      description: {
        ko: "type이 image일 때 쓸 사진 주소입니다. 값이 없으면 이미지 대신 children이 보입니다.",
        en: "The photo address used when type is image. Without it the children show instead of an image.",
      },
      example: "types",
    },
    {
      id: "alt",
      title: { ko: "alt", en: "alt" },
      description: {
        ko: "이미지의 대체 텍스트입니다. 기본값은 빈 문자열이고, 이름이 아바타 옆에 이미 있으면 빈 문자열로 둡니다. 사진만으로 대상을 알려야 하면 이름을 넣습니다.",
        en: "Alternative text for the image. The default is an empty string, which is right when the name already sits next to the avatar. Put the name here when the photo is the only label.",
      },
      example: "types",
    },
    {
      id: "liveRingClassName",
      title: { ko: "liveRingClassName", en: "liveRingClassName" },
      description: {
        ko: "상태 점의 테두리 색입니다. 기본값은 border-bg-surface이고, 유리 패널이나 보조 표면 위에서는 그 표면 색을 넘겨 점이 떠 보이지 않게 합니다.",
        en: "Border colour of the live dot. It defaults to border-bg-surface; on a glass panel or a subtle surface pass that surface's colour so the dot does not float.",
      },
      example: "live",
    },
    {
      id: "children",
      title: { ko: "children", en: "children" },
      description: {
        ko: "이니셜이나 대체 내용입니다. 글자 두 자를 넘기면 작은 지름에서 넘칠 수 있으므로 이름의 첫 글자 두 개로 줄입니다.",
        en: "Initials or fallback content. More than two characters overflow at the smaller diameters, so reduce a name to its first two letters.",
      },
      example: "sizes",
    },
  ],
  guidelines: [
    {
      id: "empty-alt-beside-name",
      title: { ko: "옆에 이름이 있으면 alt를 비웁니다", en: "Empty alt beside a name" },
      body: {
        ko: "목록 행이나 댓글처럼 이름이 아바타 바로 옆에 있으면 사진은 장식입니다. alt를 빈 문자열로 두어 스크린 리더가 이름을 두 번 읽지 않게 합니다.",
        en: "When the name sits right beside the avatar, as in a list row or a comment, the photo is decoration. Keep alt empty so a screen reader does not read the name twice.",
      },
      do: {
        ko: "이름이 옆에 있으면 alt=\"\"로 둡니다.",
        en: "Use alt=\"\" when the name is next to it.",
      },
      dont: {
        ko: "이름을 alt에 한 번 더 넣지 않습니다.",
        en: "Do not repeat the name in alt.",
      },
      example: "types",
    },
    {
      id: "initials-length",
      title: { ko: "이니셜은 두 자까지", en: "Two characters of initials" },
      body: {
        ko: "이니셜은 지름에 맞춰 정해진 글자 단계를 쓰고 한 줄로 유지됩니다. 이름 전체나 세 글자 이상을 넣으면 sm과 md에서 잘리므로 첫 글자 두 개로 줄입니다.",
        en: "Initials use the label rung that matches the diameter and stay on one line. A full name or three or more characters clips at sm and md, so reduce it to two letters.",
      },
      example: "sizes",
    },
    {
      id: "bot-for-agents",
      title: { ko: "에이전트에는 bot을 씁니다", en: "Use bot for agents" },
      body: {
        ko: "사람이 아닌 에이전트는 이니셜 대신 type bot을 씁니다. 로봇 아이콘이 브랜드 바탕에 그려져 사람 아바타와 한눈에 구분됩니다.",
        en: "An agent that is not a person uses type bot instead of initials. The robot on the brand tint separates it from a person's avatar at a glance.",
      },
      do: {
        ko: "Inbox Manager에는 type bot을 씁니다.",
        en: "Give Inbox Manager type bot.",
      },
      dont: {
        ko: "에이전트 이름의 이니셜을 사람처럼 넣지 않습니다.",
        en: "Do not render an agent's initials as if it were a person.",
      },
      example: "types",
    },
    {
      id: "live-ring",
      title: { ko: "상태 점의 테두리는 표면에 맞춥니다", en: "Match the dot ring to its surface" },
      body: {
        ko: "상태 점은 2px 테두리로 뒤 표면과 경계를 만듭니다. 유리 패널이나 보조 표면 위에 아바타를 놓으면 liveRingClassName에 그 표면 색을 넘겨 테두리가 어긋나지 않게 합니다.",
        en: "The dot builds its edge with a 2px border against the surface behind it. On a glass panel or a subtle surface, pass that surface's colour to liveRingClassName so the ring does not mismatch.",
      },
      example: "live",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      note: {
        ko: "지름과 글자 단계는 Root에, 아이콘과 점 크기는 각 파트에 적용됩니다.",
        en: "The diameter and label rung land on the Root; the icon and dot sizes apply to their own parts.",
      },
      rows: [
        { state: "sm", slot: "Root", property: "diameter", value: "24px" },
        { state: "sm", slot: "Fallback", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Bot icon", property: "size", value: "13px" },
        { state: "sm", slot: "Live dot", property: "size", value: "10px" },
        { state: "md", slot: "Root", property: "diameter", value: "32px" },
        { state: "md", slot: "Fallback", property: "font", value: "text-label-md" },
        { state: "md", slot: "Bot icon", property: "size", value: "18px" },
        { state: "md", slot: "Live dot", property: "size", value: "11px" },
        { state: "lg", slot: "Root", property: "diameter", value: "40px" },
        { state: "lg", slot: "Fallback", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Bot icon", property: "size", value: "22px" },
        { state: "lg", slot: "Live dot", property: "size", value: "13px" },
        { state: "xl", slot: "Root", property: "diameter", value: "56px" },
        { state: "xl", slot: "Fallback", property: "font", value: "text-title-sm" },
        { state: "xl", slot: "Bot icon", property: "size", value: "31px" },
        { state: "xl", slot: "Live dot", property: "size", value: "18px" },
      ],
    },
    {
      id: "type-colors",
      title: { ko: "type별 색", en: "Type colours" },
      rows: [
        { state: "initials", slot: "Root", property: "background", value: "bg-bg-subtle" },
        { state: "initials", slot: "Root", property: "text color", value: "text-text-secondary" },
        { state: "initials · tone=sky", slot: "Root", property: "background", value: "bg-sky-100" },
        { state: "initials · tone=sky", slot: "Root", property: "text color", value: "text-sky-700" },
        { state: "bot", slot: "Root", property: "background", value: "bg-bg-brand" },
        { state: "bot", slot: "Root", property: "text color", value: "text-text-brand" },
        { state: "image", slot: "Root", property: "background", value: "bg-sky-200" },
        { state: "image", slot: "Root", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "shape-and-live",
      title: { ko: "모양과 상태 점", en: "Shape and live dot" },
      rows: [
        { state: "default", slot: "Root", property: "radius", value: "9999px" },
        { state: "default", slot: "Root", property: "ring", value: "inset-ring-1 inset-ring-overlay-ink-6" },
        { state: "default", slot: "Image", property: "fit", value: "size-full object-cover" },
        {
          state: "image · loading",
          slot: "Image",
          property: "motion",
          value: "motion-fade",
          note: {
            ko: "이미지가 준비되면 160ms 동안 서서히 나타납니다.",
            en: "The image fades in over 160ms once it is ready.",
          },
        },
        {
          state: "bot",
          slot: "Bot icon",
          property: "accessibility",
          value: "aria-hidden",
          note: {
            ko: "봇 아이콘은 장식이라 읽지 않습니다. 에이전트 이름은 아바타 바깥 문구로 전달합니다.",
            en: "The bot icon is decorative and skipped. The agent's name comes from the text beside the avatar.",
          },
        },
        { state: "live", slot: "Live dot", property: "background", value: "bg-status-live" },
        { state: "live", slot: "Live dot", property: "border", value: "2px border-bg-surface" },
        {
          state: "live",
          slot: "Live dot",
          property: "motion",
          value: "animate-pop-in + animate-live-pulse",
          note: {
            ko: "점이 220ms 동안 튀어나온 뒤 2초 주기로 맥동합니다.",
            en: "The dot springs in over 220ms, then pulses on a 2s cycle.",
          },
        },
        {
          state: "live",
          slot: "Live dot",
          property: "placement",
          value: "absolute -right-px -bottom-px",
        },
        {
          state: "default",
          slot: "Root",
          property: "selection",
          value: "select-none",
          note: {
            ko: "아바타의 글자가 드래그로 선택되지 않습니다.",
            en: "The avatar's text cannot be selected by dragging.",
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
        ko: "sm, md, lg, xl의 지름과 이니셜 크기를 나란히 두었습니다.",
        en: "The sm, md, lg and xl diameters with their initials side by side.",
      },
    },
    {
      id: "types",
      title: { ko: "type", en: "Types" },
      description: {
        ko: "이니셜, 봇, 이미지 아바타를 같은 크기로 비교합니다. 이미지에는 alt를 넣습니다.",
        en: "Initials, bot and image avatars at the same size. The image carries alt text.",
      },
    },
    {
      id: "tone",
      title: { ko: "tone=sky", en: "Sky tone" },
      description: {
        ko: "계정 프로필에 쓰는 하늘색 이니셜 아바타를 기본값과 비교합니다.",
        en: "The sky initials avatar used for an account profile, next to the default.",
      },
    },
    {
      id: "live",
      title: { ko: "상태 점", en: "Live dot" },
      description: {
        ko: "실행 중인 에이전트에 live를 켜고, 유리 패널 위에서는 테두리 색을 표면에 맞춥니다.",
        en: "live marks a running agent; on a glass panel the ring colour is matched to the surface.",
      },
    },
    {
      id: "fallback",
      title: { ko: "이미지 실패", en: "Image fallback" },
      description: {
        ko: "이미지를 불러오지 못하면 이니셜이 남습니다. 주소가 잘못되어도 깨진 아이콘이 보이지 않습니다.",
        en: "When the image fails the initials remain, so a wrong address never leaves a broken icon.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "아바타 자체는 문구나 이미지입니다. 대상의 이름을 아바타 바깥 텍스트로 두고, 아바타가 유일한 표시라면 type image에 alt를 넣거나 이니셜 옆에 이름을 붙입니다.",
        en: "The avatar itself is text or an image. Put the subject's name in text outside it; when the avatar is the only label, give type image an alt or place the name beside the initials.",
      },
      {
        ko: "봇 아이콘과 상태 점은 aria-hidden이라 스크린 리더가 읽지 않습니다. 실행 중이라는 사실은 문구나 Badge 같은 별도 표시로 전달합니다.",
        en: "The bot icon and the live dot are aria-hidden and skipped by screen readers. A running state needs its own text or a Badge.",
      },
      {
        ko: "상태 점의 테두리 색은 뒤 표면과 같아야 합니다. 다른 색을 쓰면 점이 떠 보이거나 배경과 붙어 보여 상태를 알아보기 어려워집니다.",
        en: "The dot's border has to match the surface behind it. Another colour makes the dot float or merge into the background, and the state becomes hard to read.",
      },
    ],
    keyboard: [],
  },
};
