/**
 * Reference doc for `Composer`, written against
 * `packages/react/src/components/composer.tsx` and
 * `packages/flutter/lib/src/components/composer.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "composer",
  anatomy: {
    description: {
      ko: "Composer는 메시지를 쓰고 보내는 알약 모양 입력창입니다. 왼쪽 첨부 버튼, 가운데 글자 입력, 오른쪽 음성·보내기 버튼이 한 줄에 놓이고, 입력이 비었는지에 따라 마지막 버튼이 바뀝니다.",
      en: "A Composer is a pill-shaped message box. An attach button, the text field and a voice-or-send button share one row, and the last button swaps depending on whether the field is empty.",
    },
    parts: [
      {
        name: "Form",
        slot: "form",
        description: {
          ko: "실제 form 요소입니다. Enter로 제출되고, 포커스가 들어오면 테두리가 strong 색으로 바뀝니다.",
          en: "The real form element. Enter submits it, and while focus is inside the border turns to the strong color.",
        },
      },
      {
        name: "Attach",
        slot: "onAttach",
        description: {
          ko: "왼쪽의 Plus 아이콘 버튼입니다. Composer는 아무것도 열지 않고 onAttach만 호출합니다.",
          en: "The Plus icon button on the left. The composer opens nothing itself; it only calls onAttach.",
        },
      },
      {
        name: "Field",
        slot: "input",
        description: {
          ko: "글자를 받는 input입니다. placeholder가 곧 aria-label이 되고, 값에 따라 마지막 버튼이 바뀝니다.",
          en: "The input that takes the text. Its placeholder doubles as the aria-label, and the last button follows the value.",
        },
      },
      {
        name: "Last action",
        slot: "motion-swap",
        description: {
          ko: "음성 버튼과 보내기 버튼이 겹쳐 있는 자리입니다. 입력이 비면 마이크, 글자가 있으면 primary 보내기 버튼이 보이고, 보이지 않는 쪽은 포커스도 받지 않습니다.",
          en: "The slot where the voice and send buttons overlap. The microphone shows while the field is empty and the primary send button once there is text, and the hidden one leaves the tab order.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "입력창과 두 아이콘 버튼의 높이, 글자 단계, 안쪽 여백입니다. 한 화면의 다른 필드와 같은 눈금을 씁니다.",
        en: "Height, text rung and padding of the field and both icon buttons. It shares the rung of the other fields on the screen.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "32px 높이에 body-sm 글자를 쓰고, 안쪽 여백이 6px입니다. 좁은 패널에 맞습니다.",
            en: "32px tall with body-sm text and 6px padding, for a narrow panel.",
          },
        },
        {
          name: "md",
          description: {
            ko: "40px 높이에 body-md 글자를 쓰고, 안쪽 여백이 8px입니다. 기본값입니다.",
            en: "40px tall with body-md text and 8px padding. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "48px 높이에 body-lg 글자를 쓰고, 안쪽 여백이 10px입니다. 화면의 주 입력에 맞습니다.",
            en: "48px tall with body-lg text and 10px padding, for the main input of a screen.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "입력창의 바탕입니다. 채팅이 놓이는 면에 맞춰 고릅니다.",
        en: "Fill of the field. Match it to the surface the conversation sits on.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 표면 바탕에 기본 테두리를 씁니다. 흰 카드나 페이지 위에 놓습니다. 기본값입니다.",
            en: "An opaque surface fill with a default border, for a white card or page. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil field 바탕을 씁니다. 이미지나 유리 패널 위에 띄울 때 씁니다.",
            en: "The veil field fill, for floating over imagery or a glass panel.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 입력과 두 아이콘 버튼이 모두 멈추고 글자가 disabled 색으로 흐려집니다. 레이아웃은 그대로라 입력창이 자리를 지킵니다. 응답이 생성 중인 동안처럼 잠깐 보낼 수 없을 때 씁니다.",
        en: "When true the field and both icon buttons stop and the text fades to the disabled color. The layout holds, so the composer keeps its place. Use it while sending is briefly impossible, such as during a response.",
      },
      example: "disabled",
    },
    {
      id: "placeholder",
      title: { ko: "placeholder", en: "placeholder" },
      description: {
        ko: "값이 비었을 때 보이는 문구이며 접근 가능한 이름도 겸합니다. 입력창에는 보이는 라벨이 없으므로 무엇을 쓸 수 있는 자리인지 이 문구가 알려야 합니다.",
        en: "The text shown while the field is empty, which also serves as its accessible name. The field has no visible label, so this string has to say what belongs there.",
      },
      example: "basic",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "제어 모드의 글자입니다. 주지 않으면 Composer가 값을 스스로 들고 onValueChange로 알립니다. 보낸 뒤 입력창은 비워집니다.",
        en: "The text in controlled mode. Without it the composer holds the value and reports through onValueChange. After a submit the field is cleared.",
      },
      example: "controlled",
    },
  ],
  guidelines: [
    {
      id: "submit-stays-in-caller",
      title: { ko: "보내는 일은 바깥에서", en: "Sending happens outside" },
      body: {
        ko: "Composer는 글자를 모아 onSubmit으로 넘기고 입력창을 비웁니다. 전송, 실패 처리, 재시도는 호출하는 쪽이 맡습니다. 공백만 있는 값은 제출되지 않고 입력 그대로 남으므로, 실수로 빈 메시지를 보내는 일은 없습니다.",
        en: "The composer collects the text, hands it to onSubmit and clears the field. Sending, failure handling and retry belong to the caller. Whitespace-only text never submits and stays in the field, so an empty message cannot slip out.",
      },
      do: {
        ko: "onSubmit에서 전송하고 실패하면 사용자가 다시 보낼 수 있게 둡니다.",
        en: "Send from onSubmit, and on failure let the person send again.",
      },
      dont: {
        ko: "Composer 안에서 전송 상태를 따로 들지 않습니다.",
        en: "Do not keep the sending state inside the composer.",
      },
      example: "basic",
    },
    {
      id: "attach-opens-the-source",
      title: { ko: "첨부는 호출하는 쪽이 엽니다", en: "The caller opens the attach source" },
      body: {
        ko: "Plus 버튼은 onAttach만 호출하고 어떤 창도 열지 않습니다. 파일 선택기, 메뉴, 다른 시트 중 무엇을 열지는 화면이 정합니다. 같은 자리에 다른 동작을 붙이려면 이 콜백을 그대로 쓰지 말고 Composer를 감싸는 별도 조합을 만듭니다.",
        en: "The Plus button only calls onAttach and opens nothing. The screen decides whether that is a file picker, a menu or a sheet. To put a different action in that slot, wrap the composer rather than reusing this callback.",
      },
      example: "basic",
    },
    {
      id: "one-composer-per-conversation",
      title: { ko: "대화 하나에 입력창 하나", en: "One composer per conversation" },
      body: {
        ko: "한 화면에 Composer를 여러 개 두면 Enter가 어느 대화로 가는지 알 수 없습니다. 대화를 나란히 보여 주는 화면이라면 활성 대화에만 입력창을 두고 나머지는 읽기 전용으로 보여 줍니다.",
        en: "Two composers on one screen leave Enter ambiguous. When conversations sit side by side, give the composer to the active one only and show the rest read-only.",
      },
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 뒤가 비치는 면에서만", en: "Glass only where something shows through" },
      body: {
        ko: "glass 바탕은 뒤에 이미지나 유리가 있을 때만 테두리와 바탕이 구분됩니다. 불투명한 페이지 위에서는 입력창 경계가 사라지므로 solid를 씁니다.",
        en: "The glass fill separates from its surroundings only over imagery or a glass panel. On an opaque page its edge disappears, so use solid there.",
      },
      do: {
        ko: "사이드바 유리 위에 떠 있는 입력창에 glass를 씁니다.",
        en: "Use glass for a composer floating over a glass sidebar.",
      },
      dont: {
        ko: "일반 대화 본문 아래에서 glass를 쓰지 않습니다.",
        en: "Do not use glass under a plain conversation body.",
      },
      example: "surfaces",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 괄호 안은 그 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; the parentheses give the pixels they produce.",
      },
      rows: [
        { state: "sm", slot: "Form", property: "padding", value: "p-1.5 (6px)" },
        { state: "sm", slot: "Form", property: "gap", value: "gap-1.5" },
        { state: "sm", slot: "Field", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Form", property: "padding", value: "p-2 (8px)" },
        { state: "md", slot: "Form", property: "gap", value: "gap-2" },
        { state: "md", slot: "Field", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Form", property: "padding", value: "p-2.5 (10px)" },
        { state: "lg", slot: "Form", property: "gap", value: "gap-2.5" },
        { state: "lg", slot: "Field", property: "font", value: "text-body-lg" },
        { state: "all", slot: "Form", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Form", property: "max width", value: "max-w-full" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "solid", slot: "Form", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Form", property: "border", value: "border-border-default" },
        { state: "glass", slot: "Form", property: "background", value: "veil-field" },
        { state: "focus", slot: "Form", property: "border", value: "border-border-strong" },
        { state: "empty", slot: "Last action", property: "visible button", value: "Voice input" },
        { state: "has text", slot: "Last action", property: "visible button", value: "Send, variant primary" },
        { state: "placeholder", slot: "Field", property: "text color", value: "text-text-placeholder" },
        { state: "disabled", slot: "Field", property: "text color", value: "text-text-disabled" },
        { state: "disabled", slot: "Attach", property: "state", value: "disabled" },
        { state: "all", slot: "Field", property: "background", value: "bg-transparent" },
        { state: "all", slot: "Field", property: "outline", value: "none" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        { state: "swap", slot: "Last action", property: "motion", value: "motion-swap" },
        {
          state: "swap",
          slot: "Last action",
          property: "transition",
          value: "opacity, scale 150ms ease-out-quint",
          note: {
            ko: "보이는 버튼이 150ms 동안 겹쳐 바뀌고, 동작 줄이기를 켜면 즉시 끝납니다.",
            en: "The visible button crossfades over 150ms, and finishes instantly with reduced motion.",
          },
        },
        { state: "focus", slot: "Form", property: "transition", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "placeholder가 입력창의 이름이 되는 기본 형태입니다. 붙인 동작은 아무것도 하지 않습니다.",
        en: "The default shape, where the placeholder names the field and the attached handlers do nothing yet.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어 값", en: "Controlled value" },
      description: {
        ko: "value와 onValueChange로 글자를 바깥에서 들고, onSubmit에서 받은 값을 아래에 남깁니다.",
        en: "Holding the text outside through value and onValueChange and keeping what onSubmit receives below.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 높이를 세로로 놓았습니다.",
        en: "The sm, md and lg heights stacked.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "surface", en: "Surfaces" },
      description: {
        ko: "solid 입력창과, 배경 위에 띄운 glass 입력창을 나란히 두었습니다.",
        en: "A solid composer beside a glass one floating over a backdrop.",
      },
    },
    {
      id: "disabled",
      title: { ko: "비활성", en: "Disabled" },
      description: {
        ko: "응답이 오는 동안 입력과 두 버튼이 함께 멈춘 모습입니다.",
        en: "The field and both buttons held while a response is on its way.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "입력창에는 보이는 라벨이 없으므로 placeholder가 aria-label 역할을 합니다. \"Message\"처럼 무엇을 쓰는 자리인지 드러나는 문구를 넘기고, 빈 문자열을 넘기지 않습니다.",
        en: "The field has no visible label, so the placeholder serves as the aria-label. Pass something that names the slot, such as \"Message\", never an empty string.",
      },
      {
        ko: "첨부와 음성·보내기 버튼은 아이콘만 있으므로 IconButton의 label이 접근 가능한 이름이 됩니다. 이 이름을 바꾸지 않고 아이콘만 갈아 끼우면 스크린 리더에서 동작을 알 수 없습니다.",
        en: "The attach and voice or send buttons are icon-only, so the IconButton label is their accessible name. Swapping the icon without changing the label leaves the action unnamed.",
      },
      {
        ko: "보이지 않는 쪽 버튼은 tabIndex -1과 inert를 함께 받아 포커스와 클릭에서 빠집니다. 겹쳐 있는 두 버튼 중 지금 쓸 수 있는 하나만 탭 순서에 남습니다.",
        en: "The hidden button takes both tabIndex -1 and inert, so it leaves focus and clicks. Only the usable one of the two overlapping buttons stays in the tab order.",
      },
      {
        ko: "포커스 표시는 아이콘 버튼마다 그려지고, 입력창은 포커스가 들어오면 테두리 색으로 상태를 알립니다. 테두리만으로는 부족하므로 키보드 사용자는 각 버튼의 outline을 그대로 봅니다.",
        en: "Each icon button draws its own focus ring, and the field reports focus through its border color. The border alone is not the cue, so keyboard users see the outline on each button as well.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter"],
        action: {
          ko: "글자가 있으면 메시지를 보내고, 없으면 아무 일도 일어나지 않습니다.",
          en: "Sends the message when there is text; does nothing when there is none.",
        },
      },
      {
        keys: ["Tab"],
        action: { ko: "첨부, 입력, 지금 보이는 마지막 버튼 순서로 이동합니다.", en: "Walks attach, the field, then the visible last button." },
      },
      {
        keys: ["Shift", "Tab"],
        action: { ko: "반대 순서로 돌아갑니다.", en: "Walks back in reverse order." },
      },
    ],
  },
};
