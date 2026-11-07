/**
 * Reference doc for `ChatBubble`, written against
 * `packages/react/src/components/chat-bubble.tsx` and
 * `packages/flutter/lib/src/components/chat_bubble.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "chat-bubble",
  anatomy: {
    description: {
      ko: "ChatBubble은 대화의 한 마디를 담는 말풍선입니다. 캡슐 하나에 문구가 들어가고, 보낸 사람에 따라 오른쪽 잉크 바탕이나 왼쪽 보조 바탕으로 그려집니다.",
      en: "A ChatBubble holds one turn of a conversation. A single capsule carries the text and is drawn either as ink on the right or as the subtle fill on the left.",
    },
    parts: [
      {
        name: "Bubble",
        slot: "div",
        description: {
          ko: "말풍선 본체입니다. 폭은 내용에 맞추고 560px이나 부모 폭에서 멈춥니다.",
          en: "The bubble itself. It hugs its content and stops at 560px or the parent's width.",
        },
      },
      {
        name: "Text",
        slot: "children",
        description: {
          ko: "말풍선의 문구입니다. 긴 단어는 말풍선 안에서 끊어 다음 줄로 넘깁니다.",
          en: "The message text. Long words break inside the bubble rather than overflow.",
        },
      },
    ],
  },
  properties: [
    {
      id: "from",
      title: { ko: "from", en: "from" },
      description: {
        ko: "보낸 사람입니다. 정렬과 색을 함께 정하고, 같은 값이 data-from으로도 붙어 스타일 훅이 됩니다.",
        en: "Who sent the message. It sets alignment and colour together, and is mirrored to data-from as a styling hook.",
      },
      values: [
        {
          name: "me",
          description: {
            ko: "내가 보낸 메시지입니다. 오른쪽으로 붙고 잉크 바탕에 흰 글자를 씁니다. 기본값입니다.",
            en: "The message you sent: right-aligned, ink fill with light text. The default.",
          },
        },
        {
          name: "bot",
          description: {
            ko: "봇이 보낸 메시지입니다. 왼쪽에 남고 보조 바탕에 기본 글자를 씁니다.",
            en: "The bot's message: left-aligned on the subtle fill with the default text colour.",
          },
        },
      ],
      example: "senders",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "여백과 글자 단계입니다. 한 대화 안에서는 한 값을 유지합니다.",
        en: "Padding and text rung. Keep one value across a conversation.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "12/8px 여백에 body-sm을 씁니다. 짧은 확인이나 부가 설명에 맞습니다.",
            en: "12/8px padding with body-sm, for a short acknowledgement or aside.",
          },
        },
        {
          name: "md",
          description: {
            ko: "16/12px 여백에 body-md를 씁니다. 기본값입니다.",
            en: "16/12px padding with body-md. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "20/14px 여백에 body-lg를 씁니다. 대화를 여는 긴 메시지에 맞습니다.",
            en: "20/14px padding with body-lg, for the long message that opens a thread.",
          },
        },
      ],
      example: "sizes",
    },
  ],
  guidelines: [
    {
      id: "one-turn-per-bubble",
      title: { ko: "한 마디에 말풍선 하나", en: "One turn per bubble" },
      body: {
        ko: "여러 문단을 한 말풍선에 넣으면 상대가 어디까지 읽었는지 알기 어렵습니다. 문단이 갈리면 말풍선을 나누고, 목록이나 코드는 Attachment나 CodeBlock으로 옮깁니다.",
        en: "Several paragraphs in one bubble make the reading point hard to follow. Split the bubble, and move lists or code into an Attachment or a CodeBlock.",
      },
      example: "conversation",
    },
    {
      id: "alignment-is-sender",
      title: { ko: "정렬이 곧 보낸 사람", en: "Alignment is the sender" },
      body: {
        ko: "오른쪽 정렬은 나, 왼쪽 정렬은 봇입니다. 두 값은 색까지 함께 바뀌므로 대화 안에서 섞어 쓰지 않습니다.",
        en: "Right means you and left means the bot. The values change colour too, so do not mix their meaning inside one thread.",
      },
      do: {
        ko: "내 메시지는 오른쪽, 봇의 답은 왼쪽에 둡니다.",
        en: "Keep your messages on the right and the bot's replies on the left.",
      },
      dont: {
        ko: "봇의 답을 me로 그려 오른쪽에 붙이지 않습니다.",
        en: "Do not draw a bot reply with from=\"me\" on the right.",
      },
      example: "senders",
    },
    {
      id: "no-glass",
      title: { ko: "말풍선에는 유리를 쓰지 않습니다", en: "No glass on bubbles" },
      body: {
        ko: "말풍선은 읽는 면이라 잉크와 보조 바탕 두 가지로만 그립니다. 유리는 떠 있는 크롬에 속하고, 읽는 면에 깔면 대비가 흔들립니다.",
        en: "A bubble is a reading surface, so it uses only the ink and subtle fills. Glass belongs to floating chrome; behind text it makes contrast waver.",
      },
      example: "sizes",
    },
    {
      id: "size-stays",
      title: { ko: "한 대화에는 한 크기", en: "One size per conversation" },
      body: {
        ko: "크기는 여백과 글자 단계를 함께 바꾸므로 한 대화에서 섞으면 줄 길이가 들쭉날쭉해집니다. 크기가 다른 말풍선은 다른 맥락으로 읽힙니다.",
        en: "Size changes padding and text rung together, so mixing it in one thread makes line lengths jump, and a differently sized bubble reads as another context.",
      },
      example: "sizes",
    },
  ],
  specification: [
    {
      id: "senders",
      title: { ko: "보낸 사람별 색", en: "Colours per sender" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "me", slot: "Bubble", property: "background", value: "bg-interactive-primary" },
        { state: "me", slot: "Bubble", property: "text color", value: "text-interactive-on-primary" },
        { state: "me", slot: "Bubble", property: "alignment", value: "ml-auto" },
        { state: "bot", slot: "Bubble", property: "background", value: "bg-bg-subtle" },
        { state: "bot", slot: "Bubble", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Bubble", property: "radius", value: "rounded-xl" },
        { state: "all", slot: "Bubble", property: "max width", value: "max-w-[min(100%,560px)]" },
        { state: "all", slot: "Bubble", property: "width", value: "w-fit" },
        { state: "all", slot: "Bubble", property: "word break", value: "wrap-break-word" },
        { state: "all", slot: "Bubble", property: "motion", value: "motion-rise" },
      ],
    },
    {
      id: "sizes",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Bubble", property: "padding", value: "px-3 py-2" },
        { state: "sm", slot: "Bubble", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Bubble", property: "padding", value: "px-4 py-3" },
        { state: "md", slot: "Bubble", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Bubble", property: "padding", value: "px-5 py-3.5" },
        { state: "lg", slot: "Bubble", property: "font", value: "text-body-lg" },
        {
          state: "all",
          slot: "Bubble",
          property: "entrance",
          value: "220ms ease-out-quint",
          note: {
            ko: "동작 줄이기를 켜면 나타남이 즉시 끝납니다.",
            en: "With reduced motion on, the entrance finishes instantly.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "conversation",
      title: { ko: "대화", en: "Conversation" },
      description: {
        ko: "네 마디가 이어지는 대화입니다. 보낸 사람에 따라 정렬과 색이 바뀝니다.",
        en: "A four-turn thread. Alignment and colour follow the sender.",
      },
    },
    {
      id: "senders",
      title: { ko: "보낸 사람", en: "Senders" },
      description: {
        ko: "봇과 내 말풍선을 나란히 두어 정렬과 바탕 차이를 보여 줍니다.",
        en: "A bot bubble next to yours, showing the alignment and fill difference.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 여백과 글자 단계를 한자리에 놓았습니다.",
        en: "The sm, md and lg paddings and text rungs side by side.",
      },
    },
    {
      id: "long-message",
      title: { ko: "긴 메시지", en: "Long message" },
      description: {
        ko: "560px에서 폭이 멈추고 긴 단어도 말풍선 안에서 끊깁니다.",
        en: "The width stops at 560px and long words break inside the bubble.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "말풍선은 문구를 그대로 읽히는 div입니다. 보낸 사람은 정렬과 색으로만 드러나므로, 스크린 리더 사용자에게도 화자가 드러나게 대화 머리말이나 이름을 함께 둡니다.",
        en: "A bubble is a div whose text is read as is. The sender shows only through alignment and colour, so add a thread heading or a name for screen reader users.",
      },
      {
        ko: "data-from은 스타일 훅일 뿐 의미를 나르지 않습니다. 발화를 구분해야 하는 화면이라면 이름을 붙인 요소를 따로 둡니다.",
        en: "data-from is a styling hook and carries no meaning. Where turns must be distinguishable, add a named element of your own.",
      },
      {
        ko: "잉크 바탕의 흰 글자와 보조 바탕의 기본 글자 모두 본문 대비를 넘습니다. 색을 임의로 바꾸면 그 대비가 깨지므로 두 바탕을 그대로 씁니다.",
        en: "Light text on ink and default text on the subtle fill both clear body contrast. Overriding either colour breaks that, so keep the two fills as they are.",
      },
      {
        ko: "말풍선이 나타날 때 220ms 상승 애니메이션이 재생되고, 동작 줄이기를 켜면 생략됩니다.",
        en: "A bubble rises in over 220ms, and the rise is skipped when reduced motion is on.",
      },
    ],
    keyboard: [],
  },
};
