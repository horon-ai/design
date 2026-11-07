/**
 * Reference doc for `ChatControls`, written against
 * `packages/react/src/components/chat-controls.tsx` and
 * `packages/flutter/lib/src/components/chat_controls.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "chat-controls",
  anatomy: {
    description: {
      ko: "ChatControls는 대화 화면의 떠 있는 조작 세 가지입니다. 최신 메시지로 내려가는 원형 버튼, 새 메시지 알림 알약, 음성 입력 막대가 각각 독립된 컴포넌트입니다.",
      en: "ChatControls are the three floating controls of a conversation: a round jump-to-latest button, a new-messages pill and a voice input bar, each a separate component.",
    },
    parts: [
      {
        name: "JumpToLatest",
        slot: "JumpToLatest",
        description: {
          ko: "아래 화살표만 있는 44px 원형 버튼입니다. 스크롤을 최신 메시지로 되돌리는 동작을 호출자 핸들러가 맡습니다.",
          en: "A 44px round button with just a downward caret. The caller's handler performs the scroll to the newest message.",
        },
      },
      {
        name: "NewMessagesPill",
        slot: "NewMessagesPill",
        description: {
          ko: "화살표와 라벨이 있는 40px 알약입니다. 위쪽에 새 메시지가 있다는 사실을 알립니다.",
          en: "A 40px pill with a caret and a label, announcing that new messages sit above.",
        },
      },
      {
        name: "VoiceInput",
        slot: "VoiceInput",
        description: {
          ko: "녹음 중인 음성 입력 막대입니다. 빨간 정지 버튼, 18개 막대의 파형, 경과 시간이 한 줄로 놓입니다.",
          en: "A recording bar: a red stop button, an 18-bar waveform and the elapsed time in one row.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "glass 표면에서 컨트롤 안쪽에 한 겹 깔리는 유리 레이어입니다. 글자와 아이콘은 그 위에 놓입니다.",
          en: "The glass layer drawn inside a control with the glass surface. Text and icons sit above it.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "세 컴포넌트가 함께 받는 재질입니다. solid는 올라온 면 위에, glass는 이미지나 유리 패널 위에 씁니다.",
        en: "The material shared by all three components: solid on raised surfaces, glass over imagery and glass panels.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "표면 바탕에 기본 테두리, hover에서 보조 바탕, 눌림에서 secondary hover를 씁니다. 기본값입니다.",
            en: "A surface fill with the default border, the subtle fill on hover and the secondary hover on press. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "clear glass 바탕과 liquid 레이어를 씁니다. VoiceInput만 regular glass를 써서 파형 대비를 지킵니다.",
            en: "The clear glass fill with a liquid layer. VoiceInput alone uses regular glass to keep the waveform legible.",
          },
        },
      ],
      example: "jump-to-latest",
    },
    {
      id: "recording",
      title: { ko: "recording", en: "recording" },
      description: {
        ko: "VoiceInput의 파형 애니메이션을 켜고 끕니다. 녹음이 시작되면 켜 두고, 정지하면 끄면 막대가 마지막 높이에서 멈춥니다.",
        en: "Turns the VoiceInput waveform animation on and off. Leave it on while recording and off once stopped, so the bars hold their last heights.",
      },
      example: "voice-input",
    },
    {
      id: "levels",
      title: { ko: "levels", en: "levels" },
      description: {
        ko: "0과 1 사이 값의 배열입니다. 각 값은 4px에서 28px 사이 막대 높이로 바뀌고, 넘기지 않으면 Figma 파형을 씁니다.",
        en: "An array of values between 0 and 1. Each maps to a bar between 4px and 28px tall; without it the Figma waveform is used.",
      },
      example: "voice-input",
    },
  ],
  guidelines: [
    {
      id: "solid-versus-glass",
      title: { ko: "바탕 면에 맞춰 재질을 고릅니다", en: "Match the material to the surface" },
      body: {
        ko: "대화가 불투명한 면 위에 있으면 solid를, 이미지나 유리 패널 위에 떠 있으면 glass를 씁니다. 이미지 위의 solid 컨트롤은 테두리만 남아 배경에 묻힙니다.",
        en: "Use solid when the conversation sits on an opaque surface and glass when it floats over imagery or a glass panel. A solid control on imagery keeps only its border and sinks in.",
      },
      do: {
        ko: "이미지 위 채팅에서 glass 표면을 씁니다.",
        en: "Use the glass surface in a chat over imagery.",
      },
      dont: {
        ko: "유리 패널 위에서 solid 컨트롤을 섞지 않습니다.",
        en: "Do not mix solid controls into a glass panel.",
      },
      example: "footer",
    },
    {
      id: "one-recovery-control",
      title: { ko: "복귀 컨트롤은 하나만", en: "One way back to the latest" },
      body: {
        ko: "JumpToLatest와 NewMessagesPill은 같은 자리로 데려갑니다. 새 메시지가 있으면 알약을, 없으면 원형 버튼 하나만 띄웁니다.",
        en: "JumpToLatest and NewMessagesPill both return to the same place. Show the pill when messages are waiting and only the round button when none are.",
      },
      example: "footer",
    },
    {
      id: "count-in-the-label",
      title: { ko: "알약에는 개수를 적습니다", en: "Put the count in the pill" },
      body: {
        ko: "NewMessagesPill의 문구는 새 메시지가 몇 개인지 알려 줍니다. 3 new messages처럼 개수와 대상을 한 줄에 적고, 개수를 모를 때는 New messages로 줄입니다.",
        en: "The pill's label says how many messages wait. Keep the count and the subject on one line, as in 3 new messages, and shorten to New messages when the count is unknown.",
      },
      example: "new-messages",
    },
    {
      id: "waveform-is-decoration",
      title: { ko: "파형은 장식, 정지 버튼이 동작", en: "The waveform decorates; stop does the work" },
      body: {
        ko: "VoiceInput에서 누를 수 있는 것은 정지 버튼 하나입니다. 경과 시간은 사용자가 읽어야 하므로 보이게 두고, 파형은 보조 표시로만 씁니다.",
        en: "Only the stop button is pressable in VoiceInput. The elapsed time must stay readable; the waveform is a supporting mark.",
      },
      example: "voice-input",
    },
  ],
  specification: [
    {
      id: "controls",
      title: { ko: "두 복귀 컨트롤", en: "The two return controls" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "all", slot: "Control", property: "radius", value: "rounded-full" },
        { state: "all", slot: "Control", property: "motion", value: "motion-press motion-rise" },
        { state: "all", slot: "Control", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Control", property: "overflow", value: "overflow-clip" },
        { state: "glass", slot: "Control", property: "background", value: "bg-glass-clear" },
        { state: "glass · hover", slot: "Control", property: "background", value: "bg-glass-clear-hover" },
        { state: "glass · pressed", slot: "Control", property: "background", value: "bg-glass-clear-pressed" },
        { state: "solid", slot: "Control", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Control", property: "border", value: "border border-border-default" },
        { state: "solid · hover", slot: "Control", property: "background", value: "bg-bg-subtle" },
        { state: "solid · pressed", slot: "Control", property: "background", value: "bg-interactive-secondary-hover" },
        { state: "focus-visible", slot: "Control", property: "outline", value: "outline-2 outline-offset-2" },
        { state: "JumpToLatest", slot: "Button", property: "size", value: "size-11" },
        { state: "JumpToLatest", slot: "Caret", property: "size", value: "size-5" },
        { state: "NewMessagesPill", slot: "Button", property: "height", value: "h-10" },
        { state: "NewMessagesPill", slot: "Button", property: "padding", value: "pr-4 pl-3.5" },
        { state: "NewMessagesPill", slot: "Button", property: "gap", value: "gap-1.5" },
        { state: "NewMessagesPill", slot: "Button", property: "font", value: "text-label-md" },
        { state: "NewMessagesPill", slot: "Caret", property: "size", value: "size-4" },
      ],
    },
    {
      id: "voice-input",
      title: { ko: "음성 입력", en: "Voice input" },
      rows: [
        { state: "all", slot: "Pill", property: "height", value: "h-13" },
        { state: "all", slot: "Pill", property: "width", value: "w-60" },
        { state: "all", slot: "Pill", property: "padding", value: "px-2" },
        { state: "all", slot: "Pill", property: "gap", value: "gap-3" },
        { state: "all", slot: "Pill", property: "radius", value: "rounded-full" },
        { state: "solid", slot: "Pill", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Pill", property: "border", value: "border border-border-default" },
        { state: "glass", slot: "Pill", property: "background", value: "bg-glass-regular" },
        { state: "all", slot: "Stop", property: "size", value: "size-9" },
        { state: "all", slot: "Stop", property: "background", value: "bg-interactive-danger" },
        { state: "all", slot: "Stop mark", property: "size", value: "size-3 rounded-[3px]" },
        { state: "all", slot: "Stop mark", property: "fill", value: "bg-interactive-on-danger" },
        { state: "all", slot: "Bar", property: "width", value: "w-[3px]" },
        { state: "all", slot: "Bar", property: "radius", value: "rounded-[2px]" },
        { state: "all", slot: "Bar", property: "fill", value: "bg-interactive-primary-75" },
        { state: "all", slot: "Bar", property: "height", value: "4px to 28px" },
        { state: "recording", slot: "Bar", property: "motion", value: "animate-wave" },
        { state: "recording", slot: "Bar", property: "stagger", value: "120ms" },
        { state: "all", slot: "Elapsed", property: "width", value: "w-10" },
        { state: "all", slot: "Elapsed", property: "font", value: "text-label-md tabular-nums" },
        { state: "all", slot: "Elapsed", property: "text color", value: "text-text-secondary" },
      ],
    },
  ],
  examples: [
    {
      id: "jump-to-latest",
      title: { ko: "최신으로 이동", en: "Jump to latest" },
      description: {
        ko: "원형 버튼을 solid와 glass로 나란히 두었습니다. 아이콘만 있으므로 이름은 aria-label로 붙습니다.",
        en: "The round button in solid and in glass. It is icon-only, so its name comes from aria-label.",
      },
    },
    {
      id: "new-messages",
      title: { ko: "새 메시지 알약", en: "New messages pill" },
      description: {
        ko: "개수를 적은 알약 두 개입니다. 라벨 길이에 따라 폭이 늘어납니다.",
        en: "Two pills with counts. The width grows with the label.",
      },
    },
    {
      id: "voice-input",
      title: { ko: "음성 입력", en: "Voice input" },
      description: {
        ko: "기본 파형, 멈춘 상태, 직접 넘긴 levels와 glass 표면을 함께 보여 줍니다.",
        en: "The default waveform, a stopped one, caller-supplied levels and the glass surface.",
      },
    },
    {
      id: "footer",
      title: { ko: "대화 바닥글", en: "Conversation footer" },
      description: {
        ko: "복귀 컨트롤과 음성 입력을 한 자리에 모은 조합입니다.",
        en: "The return controls and voice input composed in one place.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "JumpToLatest는 아이콘만 있으므로 aria-label이 이름입니다. 기본값은 Jump to latest이고, 다른 곳으로 스크롤한다면 그 뜻으로 바꿉니다.",
        en: "JumpToLatest is icon-only, so its aria-label is its name. It defaults to Jump to latest; change it if the button scrolls somewhere else.",
      },
      {
        ko: "NewMessagesPill은 문구가 곧 이름입니다. 개수를 적으면 스크린 리더도 몇 개인지 함께 읽습니다.",
        en: "The pill's text is its name, so a count in the label is read aloud too.",
      },
      {
        ko: "VoiceInput의 파형은 aria-hidden이고, 정지 버튼의 stopLabel과 경과 시간만 접근성 트리에 남습니다. stopLabel 기본값은 Stop recording입니다.",
        en: "The waveform is aria-hidden; only the stop button, named by stopLabel, and the elapsed text reach the accessibility tree. stopLabel defaults to Stop recording.",
      },
      {
        ko: "파형은 900ms 주기로 움직이고 막대마다 120ms씩 늦게 시작합니다. 동작 줄이기를 켜면 반복 애니메이션이 멈춥니다.",
        en: "The waveform loops every 900ms with a 120ms stagger. Reduced motion stops the looping animation.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "컨트롤 사이를 이동합니다.", en: "Moves between the controls." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 있는 버튼을 누릅니다.", en: "Presses the focused button." },
      },
    ],
  },
};
