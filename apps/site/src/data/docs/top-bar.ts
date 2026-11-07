/**
 * Reference doc for `TopBar`, written against
 * `packages/react/src/components/top-bar.tsx` and
 * `packages/flutter/lib/src/components/top_bar.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "top-bar",
  anatomy: {
    description: {
      ko: "TopBar는 모바일 화면 상단의 알약 모양 바입니다. 뒤로 가기, 봇 아바타, 제목과 부제, 더보기 버튼이 한 줄에 놓입니다.",
      en: "The TopBar is the pill-shaped bar at the top of a mobile screen. Back, the bot avatar, title and subtitle, and a more button share one row.",
    },
    parts: [
      {
        name: "Bar",
        slot: "header",
        description: {
          ko: "바 표면입니다. 모서리가 완전히 둥글고 양쪽으로 8px 여백을 둡니다. glass 바는 위치가 잡힌 부모 안에 두어야 유리 레이어가 제자리에 깔립니다.",
          en: "The bar surface. It is fully rounded with 8px padding on each side. A glass bar belongs inside a positioned parent so its layer lands in place.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 첫 자식으로 놓이는 유리 레이어입니다.",
          en: "The glass layer mounted as the first child when surface is glass.",
        },
      },
      {
        name: "Back",
        slot: "onBack",
        description: {
          ko: "왼쪽의 뒤로 가기 아이콘 버튼입니다. onBack을 넘길 때만 나타납니다.",
          en: "The back IconButton on the left, shown only when onBack is passed.",
        },
      },
      {
        name: "Avatar",
        slot: "Avatar",
        description: {
          ko: "봇 아바타입니다. live가 참이면 오른쪽 아래에 상태 점이 붙습니다.",
          en: "The bot avatar. With live on, a status dot sits at its bottom right.",
        },
      },
      {
        name: "Live dot",
        slot: "live",
        description: {
          ko: "9px 상태 점입니다. 천천히 맥동하고 장식이라 aria-hidden으로 읽히지 않습니다.",
          en: "A 9px status dot that pulses slowly. It is decorative and hidden from assistive tech.",
        },
      },
      {
        name: "Text",
        slot: "title",
        description: {
          ko: "제목과 부제 두 줄입니다. 제목은 label-lg, 부제는 caption이고 둘 다 한 줄로 잘립니다.",
          en: "The title and subtitle lines. The title is label-lg and the subtitle caption, and both truncate to one line.",
        },
      },
      {
        name: "More",
        slot: "onMore",
        description: {
          ko: "오른쪽의 더보기 아이콘 버튼입니다. onMore를 넘길 때만 나타납니다.",
          en: "The more IconButton on the right, shown only when onMore is passed.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "바의 바탕입니다. 두 값 모두 완전히 둥근 알약 모양과 8px 여백을 공유합니다.",
        en: "The bar's ground. Both values share the fully rounded pill and the 8px padding.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 표면과 기본 테두리를 씁니다. 기본값이고 화면 본문 위에 놓을 때 맞습니다.",
            en: "The opaque surface with a default border. The default, for placement on the screen body.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "regular glass와 유리 레이어를 씁니다. 대화 내용이나 사진 위에 바를 겹칠 때 씁니다.",
            en: "The regular glass with its layer, for a bar layered over conversation content or a photo.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "live",
      title: { ko: "live", en: "live" },
      description: {
        ko: "아바타에 상태 점을 붙여 지금 활동 중이라는 것을 알립니다. 점은 천천히 맥동하고, 값을 빼면 아바타만 남습니다.",
        en: "Puts a status dot on the avatar to say the bot is active now. The dot pulses slowly; leave it out and only the avatar remains.",
      },
      example: "status",
    },
    {
      id: "subtitle",
      title: { ko: "subtitle", en: "subtitle" },
      description: {
        ko: "제목 아래 둘째 줄입니다. 상태 문구나 마지막 활동 시각처럼 짧은 정보를 담고, 제목과 함께 한 줄로 잘립니다.",
        en: "The second line under the title, for short information such as a status or a last-seen time. It truncates to one line with the title.",
      },
      example: "status",
    },
    {
      id: "onBack",
      title: { ko: "onBack", en: "onBack" },
      description: {
        ko: "넘기면 왼쪽에 뒤로 가기 버튼이 생깁니다. 넘기지 않으면 버튼 없이 아바타부터 시작해 읽기 전용 화면의 제목만 남습니다.",
        en: "Pass it and a back button appears on the left. Leave it out and the row starts at the avatar, leaving a bare title for read-only screens.",
      },
      example: "overflow",
    },
    {
      id: "onMore",
      title: { ko: "onMore", en: "onMore" },
      description: {
        ko: "넘기면 오른쪽에 더보기 버튼이 생깁니다. 이 버튼으로 메뉴를 여는 경우가 많고, 넘기지 않으면 자리가 비지 않습니다.",
        en: "Pass it and a more button appears on the right, usually to open a menu. Without it the slot is not reserved.",
      },
      example: "overflow",
    },
  ],
  guidelines: [
    {
      id: "conversation-header",
      title: { ko: "대화 머리말에", en: "For a conversation header" },
      body: {
        ko: "TopBar는 상대가 있는 화면, 특히 봇 대화의 머리말입니다. 화면 하나의 제목과 필터가 필요하면 PageHeader를, 경로와 검색이 필요하면 BreadcrumbHeader를 씁니다.",
        en: "A TopBar is the header of a screen about someone, most of all a bot conversation. When a screen needs a title and filters use PageHeader; when it needs a path and search use BreadcrumbHeader.",
      },
      do: {
        ko: "봇 대화 위에 TopBar를 둡니다.",
        en: "Put a TopBar above a bot conversation.",
      },
      dont: {
        ko: "목록 화면 머리말로 TopBar를 쓰지 않습니다.",
        en: "Do not use a TopBar as a list screen's header.",
      },
      example: "surfaces",
    },
    {
      id: "controls-on-demand",
      title: { ko: "버튼은 필요할 때만", en: "Only the controls you need" },
      body: {
        ko: "뒤로 가기와 더보기는 핸들러를 넘길 때만 그려집니다. 읽기 전용 화면에서는 둘 다 빼서 제목이 넓게 쓰이게 하고, 아무 동작도 하지 않는 버튼을 자리 채우기로 두지 않습니다.",
        en: "Back and more are drawn only when their handlers are passed. On a read-only screen drop both so the title has room, and never place a button that does nothing just to fill a slot.",
      },
      do: {
        ko: "기록 화면에서는 onMore만 넘깁니다.",
        en: "On a history screen pass only onMore.",
      },
      dont: {
        ko: "동작 없는 onBack={() => {}}를 남기지 않습니다.",
        en: "Do not leave onBack={() => {}} with nothing behind it.",
      },
      example: "overflow",
    },
    {
      id: "short-status",
      title: { ko: "부제는 짧은 상태로", en: "Keep the subtitle short" },
      body: {
        ko: "부제는 한 줄로 잘리므로 Online이나 Last active 2h ago처럼 몇 단어로 끝냅니다. 긴 설명은 본문 첫 줄이나 봇 소개 화면에 둡니다.",
        en: "The subtitle truncates to one line, so keep it to a few words such as Online or Last active 2h ago. A longer description belongs in the first line of the content or on the bot's own screen.",
      },
      example: "status",
    },
    {
      id: "glass-over-content",
      title: { ko: "glass는 내용 위에", en: "Glass over content" },
      body: {
        ko: "glass 바는 뒤에 스크롤되는 내용이 있어야 유리가 읽힙니다. 본문 위에 그대로 두면 표면이 배경색과 같아져 바의 경계가 사라집니다.",
        en: "A glass bar needs scrolling content behind it for the glass to read. On a plain body its fill matches the background and the bar's edge disappears.",
      },
      example: "surfaces",
    },
  ],
  specification: [
    {
      id: "bar",
      title: { ko: "바와 글자", en: "Bar and text" },
      rows: [
        { state: "any", slot: "Bar", property: "radius", value: "rounded-full" },
        { state: "any", slot: "Bar", property: "padding", value: "p-2" },
        { state: "any", slot: "Bar", property: "gap", value: "gap-2" },
        { state: "solid", slot: "Bar", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Bar", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Bar", property: "background", value: "bg-glass-regular" },
        { state: "glass", slot: "Bar", property: "background layer", value: "LiquidGlass" },
        { state: "any", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "any", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "any", slot: "Subtitle", property: "font", value: "text-caption" },
        { state: "any", slot: "Subtitle", property: "text color", value: "text-text-secondary" },
        { state: "title change", slot: "Text", property: "motion", value: "animate-fade-in" },
      ],
    },
    {
      id: "status",
      title: { ko: "상태 점", en: "Status dot" },
      rows: [
        { state: "live", slot: "Live dot", property: "size", value: "size-[9px]" },
        { state: "live", slot: "Live dot", property: "background", value: "bg-status-live" },
        { state: "live", slot: "Live dot", property: "motion", value: "animate-live-pulse" },
        { state: "live", slot: "Live dot wrapper", property: "motion", value: "animate-pop-in" },
        { state: "any", slot: "Avatar", property: "size", value: "md" },
      ],
    },
  ],
  examples: [
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "solid 바와 glass 바를 같은 내용으로 놓았습니다. glass는 뒤에 내용이 있어야 표면이 읽힙니다.",
        en: "The same bar on solid and on glass. The glass reads only over content behind it.",
      },
    },
    {
      id: "status",
      title: { ko: "상태 표시", en: "Status" },
      description: {
        ko: "활동 중인 봇과 마지막 활동 시각을 보여 주는 봇을 나란히 두었습니다. 상태 점은 live일 때만 붙습니다.",
        en: "An active bot next to one showing its last-seen time. The status dot appears only with live.",
      },
    },
    {
      id: "overflow",
      title: { ko: "긴 제목과 버튼 생략", en: "Long title and omitted buttons" },
      description: {
        ko: "긴 제목이 잘리는 모습과, 핸들러를 넘기지 않아 뒤로 가기와 더보기가 없는 바를 보여 줍니다.",
        en: "A long title truncating, and a bar with no back or more button because no handler was passed.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "바는 header 요소이고 제목은 텍스트로 읽힙니다. 아이콘만 있는 뒤로 가기와 더보기 버튼은 backLabel과 moreLabel이 접근 가능한 이름이 되므로 화면 언어로 넘깁니다.",
        en: "The bar is a header element and the title reads as text. The icon-only back and more buttons take their accessible names from backLabel and moreLabel, so pass them in the screen's language.",
      },
      {
        ko: "상태 점은 장식이라 aria-hidden으로 읽히지 않습니다. 활동 상태를 꼭 알려야 하면 subtitle에 같은 정보를 말로 적습니다.",
        en: "The status dot is decorative and hidden from assistive tech. Where the active state has to be known, say it in the subtitle too.",
      },
      {
        ko: "제목이나 부제가 바뀌면 텍스트 묶음이 fade-in으로 다시 나타납니다. 동작 줄이기를 켜면 이 전환은 즉시 끝납니다.",
        en: "When the title or subtitle changes the text block fades in again. With reduced motion on, that transition completes instantly.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "뒤로 가기, 더보기 버튼 순서로 포커스를 옮깁니다. 핸들러가 없는 버튼은 포커스를 받지 않습니다.",
          en: "Moves focus through the back and more buttons. A button with no handler takes no focus.",
        },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스한 버튼을 실행합니다.", en: "Runs the focused button." },
      },
    ],
  },
};
