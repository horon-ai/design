/**
 * Reference doc for `MessageExtras`, written against
 * `packages/react/src/components/message-extras.tsx` and
 * `packages/flutter/lib/src/components/message_extras.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "message-extras",
  anatomy: {
    description: {
      ko: "MessageExtras는 메시지 사이에 붙는 네 가지 조각입니다. 날짜 구분선, 동작 알약, 첨부 카드, 코드 블록이 각각 따로 쓰입니다.",
      en: "MessageExtras are the four pieces that sit around messages: a date divider, an action pill, an attachment card and a code block, each used on its own.",
    },
    parts: [
      {
        name: "DateSeparator",
        slot: "DateSeparator",
        description: {
          ko: "양쪽에 10% 잉크 선을 두고 가운데에 날짜를 적는 행입니다. role separator를 스스로 답니다.",
          en: "A row with a 10% ink rule on each side and the date in the middle, carrying role separator.",
        },
      },
      {
        name: "MessageActions",
        slot: "MessageActions",
        description: {
          ko: "메시지 아래에 붙는 동작 알약입니다. role toolbar 안에 30px 아이콘 버튼이 들어갑니다.",
          en: "An action pill under a message: 30px icon buttons inside a toolbar role.",
        },
      },
      {
        name: "Attachment",
        slot: "Attachment",
        description: {
          ko: "파일 한 개를 보여 주는 카드입니다. 40px 썸네일, 이름, 상세 문구, 제거 버튼이 한 줄에 놓입니다.",
          en: "A card for one file: a 40px thumbnail, the name, a detail line and a remove button in one row.",
        },
      },
      {
        name: "CodeBlock",
        slot: "CodeBlock",
        description: {
          ko: "잉크 바탕의 코드 상자입니다. 위 막대에 언어와 복사 버튼이 있고, 아래에 코드가 가로로 스크롤됩니다.",
          en: "A code box on ink. The header holds the language and a copy button; the code scrolls horizontally below.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "MessageActions의 재질입니다. solid는 테두리와 표면 바탕, glass는 regular 유리 바탕에 liquid 레이어를 씁니다.",
        en: "The MessageActions material: solid is a bordered surface fill, glass is the regular glass fill with a liquid layer.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "표면 바탕과 기본 테두리를 씁니다. 메시지 아래 본문 위에 붙일 때 맞고 기본값입니다.",
            en: "A surface fill with the default border, for sitting on the page under a message. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "regular 유리 바탕을 씁니다. 이미지나 유리 패널 위의 메시지에 붙일 때 맞습니다.",
            en: "The regular glass fill, for a message over imagery or a glass panel.",
          },
        },
      ],
      example: "actions",
    },
    {
      id: "thumbnail",
      title: { ko: "thumbnail", en: "thumbnail" },
      description: {
        ko: "Attachment의 이미지 주소입니다. 넘기면 40px 둥근 썸네일로 채우고, 없으면 하늘색 타일에 문서 아이콘을 그립니다.",
        en: "An image URL for the Attachment. With it the card fills a 40px rounded thumbnail; without it a document icon sits on a sky tile.",
      },
      example: "attachment",
    },
    {
      id: "onRemove",
      title: { ko: "onRemove", en: "onRemove" },
      description: {
        ko: "Attachment에 값을 주면 32px 제거 버튼이 나타납니다. 보낸 뒤에는 제거할 것이 없으므로 보내기 전 상태에만 씁니다.",
        en: "Passing it to an Attachment shows a 32px remove button. After sending there is nothing to remove, so use it only in the pre-send state.",
      },
      example: "attachment",
    },
    {
      id: "language",
      title: { ko: "language", en: "language" },
      description: {
        ko: "CodeBlock 위 막대의 caption입니다. 비워 두어도 자리는 남아 복사 버튼이 오른쪽 끝에 붙습니다.",
        en: "The caption in the CodeBlock header. The space stays even when empty, keeping the copy button at the right edge.",
      },
      example: "code-block",
    },
  ],
  guidelines: [
    {
      id: "actions-order",
      title: { ko: "동작 순서를 고정합니다", en: "Keep the action order fixed" },
      body: {
        ko: "동작 알약은 메시지마다 같은 자리에 붙습니다. 복사와 재생성처럼 자주 쓰는 동작을 앞에 두고, 순서를 바꾸지 않으면 손이 위치를 외웁니다.",
        en: "The pill sits in the same place on every message. Put frequent actions first, such as copy and regenerate, and keep the order so the hand learns the position.",
      },
      example: "actions",
    },
    {
      id: "unique-labels",
      title: { ko: "버튼마다 다른 이름을", en: "Give every button its own name" },
      body: {
        ko: "각 버튼의 label은 접근 가능한 이름이자 React key입니다. 같은 이름을 두 번 쓰면 key가 겹치고 스크린 리더에서도 구분되지 않습니다.",
        en: "Each button's label is both its accessible name and its React key. A duplicate name collides on the key and reads the same twice.",
      },
      example: "actions",
    },
    {
      id: "date-on-change",
      title: { ko: "날짜가 바뀔 때만 구분선", en: "A divider only when the day changes" },
      body: {
        ko: "날짜 구분선은 대화의 날짜가 바뀌는 자리에만 넣습니다. 모든 메시지 사이에 넣으면 구분선이 본문보다 눈에 띕니다.",
        en: "Place the divider only where the conversation crosses into another day. Between every message the rules compete with the text.",
      },
      example: "date-separator",
    },
    {
      id: "code-block-for-code",
      title: { ko: "코드에는 코드 블록", en: "Code goes in the code block" },
      body: {
        ko: "여러 줄 코드를 말풍선 안에 넣지 않고 CodeBlock으로 분리합니다. 잉크 바탕이 본문과 경계를 만들고, 복사 버튼이 그 한 줄을 대신합니다.",
        en: "Take multi-line code out of the bubble into a CodeBlock. The ink fill separates it from prose and the copy button replaces retyping.",
      },
      example: "code-block",
    },
  ],
  specification: [
    {
      id: "actions",
      title: { ko: "동작 알약", en: "Action pill" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "all", slot: "Pill", property: "padding", value: "p-[3px]" },
        { state: "all", slot: "Pill", property: "gap", value: "gap-0.5" },
        { state: "all", slot: "Pill", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Pill", property: "role", value: "toolbar" },
        { state: "solid", slot: "Pill", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Pill", property: "border", value: "border border-border-default" },
        { state: "glass", slot: "Pill", property: "background", value: "bg-glass-regular" },
        { state: "glass", slot: "Pill", property: "layer", value: "LiquidGlass" },
        { state: "all", slot: "Button", property: "size", value: "size-7.5" },
        { state: "all", slot: "Button", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Button", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Button", property: "background", value: "bg-overlay-ink-6" },
        { state: "focus-visible", slot: "Button", property: "outline", value: "outline-2 outline-offset-2" },
        { state: "all", slot: "Icon", property: "size", value: "size-4" },
      ],
    },
    {
      id: "divider-and-attachment",
      title: { ko: "구분선과 첨부", en: "Divider and attachment" },
      rows: [
        { state: "all", slot: "DateSeparator", property: "gap", value: "gap-3" },
        { state: "all", slot: "DateSeparator rule", property: "border", value: "h-px bg-overlay-ink-10" },
        { state: "all", slot: "DateSeparator caption", property: "font", value: "text-caption" },
        { state: "all", slot: "DateSeparator caption", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Attachment", property: "width", value: "w-full max-w-70" },
        { state: "all", slot: "Attachment", property: "padding", value: "py-2 pr-2 pl-2" },
        { state: "all", slot: "Attachment", property: "gap", value: "gap-2.5" },
        { state: "all", slot: "Attachment", property: "radius", value: "rounded-lg" },
        { state: "all", slot: "Attachment", property: "background", value: "bg-bg-subtle" },
        { state: "all", slot: "Attachment", property: "motion", value: "motion-rise" },
        { state: "thumbnail", slot: "Thumb", property: "size", value: "size-10" },
        { state: "thumbnail", slot: "Thumb", property: "radius", value: "rounded-md" },
        { state: "file", slot: "Thumb", property: "background", value: "bg-accent-sky-500-16" },
        { state: "file", slot: "Thumb", property: "text color", value: "text-text-brand" },
        { state: "file", slot: "Thumb icon", property: "size", value: "size-5" },
        { state: "all", slot: "Name", property: "font", value: "text-label-md" },
        { state: "all", slot: "Detail", property: "font", value: "text-caption" },
        { state: "all", slot: "Detail", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "code",
      title: { ko: "코드 블록", en: "Code block" },
      rows: [
        { state: "all", slot: "Block", property: "background", value: "bg-surface-ink" },
        { state: "all", slot: "Block", property: "radius", value: "rounded-lg" },
        { state: "all", slot: "Header", property: "background", value: "bg-bg-surface-6" },
        { state: "all", slot: "Header", property: "padding", value: "py-2 pr-3.5 pl-3.5" },
        { state: "all", slot: "Header", property: "font", value: "text-caption" },
        { state: "all", slot: "Header", property: "text color", value: "text-text-on-ink" },
        { state: "all", slot: "Language", property: "opacity", value: "70%" },
        { state: "all", slot: "Copy icon", property: "size", value: "size-3.5" },
        { state: "all", slot: "Copy label", property: "min width", value: "min-w-10" },
        { state: "copied", slot: "Copy label", property: "motion", value: "animate-fade-in" },
        { state: "all", slot: "Code", property: "font", value: "font-mono text-code" },
        { state: "all", slot: "Code", property: "text color", value: "text-text-on-ink" },
        { state: "all", slot: "Code", property: "padding", value: "px-3.5 pt-3 pb-3.5" },
        { state: "all", slot: "Code", property: "overflow", value: "overflow-x-auto" },
      ],
    },
  ],
  examples: [
    {
      id: "actions",
      title: { ko: "동작 알약", en: "Action pill" },
      description: {
        ko: "다섯 동작과 세 동작을 담은 알약입니다. 아래쪽은 이미지 위에서 glass 표면을 씁니다.",
        en: "A five-action pill and a three-action one, the second in glass over imagery.",
      },
    },
    {
      id: "date-separator",
      title: { ko: "날짜 구분선", en: "Date separator" },
      description: {
        ko: "날짜가 바뀌는 자리에 선 두 구분선입니다.",
        en: "Two dividers at the points where the day changes.",
      },
    },
    {
      id: "attachment",
      title: { ko: "첨부", en: "Attachments" },
      description: {
        ko: "제거 버튼이 있는 첨부와 없는 첨부를 함께 보여 줍니다. 이름과 상세 문구는 한 줄에서 잘립니다.",
        en: "Attachments with and without the remove button. Name and detail each truncate on their line.",
      },
    },
    {
      id: "code-block",
      title: { ko: "코드 블록", en: "Code block" },
      description: {
        ko: "명령과 TSX 두 블록입니다. 복사 문구를 바꾸면 상태 전환도 그 문구로 이어집니다.",
        en: "A command and a TSX block. Custom copy labels carry through the copied state.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "동작 알약은 role toolbar이고 각 버튼은 aria-label로 이름을 받습니다. 방향키 이동은 구현되어 있지 않으므로 Tab으로 버튼 사이를 옮깁니다.",
        en: "The pill is a toolbar and each button takes its name from aria-label. Arrow-key movement is not implemented, so Tab moves between buttons.",
      },
      {
        ko: "날짜 구분선은 role separator라 목록의 구획으로 읽힙니다. 날짜 문구를 제목으로 승격하지 않으므로, 날짜가 중요하면 메시지 흐름 안에서 문구로도 한 번 언급합니다.",
        en: "The divider carries role separator, so it reads as a break in the flow. It is not a heading, so mention the date in the flow when it matters.",
      },
      {
        ko: "첨부의 제거 버튼은 removeLabel로 이름을 받고 기본값은 Remove입니다. 아이콘만 보이는 버튼이므로 이름을 지우지 않습니다.",
        en: "The attachment's remove button is named by removeLabel, which defaults to Remove. Keep the name; only an icon is visible.",
      },
      {
        ko: "코드 블록의 복사 버튼은 복사가 끝나면 1500ms 동안 Copied 문구로 바뀝니다. 화면 낭독기 사용자에게도 결과가 글자로 전달됩니다.",
        en: "The code block's copy button shows the copied label for 1500ms after a successful copy, so the result arrives as text for screen readers too.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "동작 버튼, 제거 버튼, 복사 버튼 사이를 이동합니다.", en: "Moves between the action, remove and copy buttons." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 있는 버튼을 실행합니다.", en: "Runs the focused button." },
      },
    ],
  },
};
