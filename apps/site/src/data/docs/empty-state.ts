/**
 * Reference doc for `EmptyState`, written against
 * `packages/react/src/components/empty-state.tsx` and the current Flutter empty set.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "empty-state",
  anatomy: {
    description: {
      ko: "EmptyState는 보여 줄 내용이 없을 때 그 자리에 들어가는 안내입니다. 그림, 제목, 설명, 동작 하나로 이루어지고 자체 배경이나 테두리 없이 카드나 패널 본문에 바로 놓입니다.",
      en: "An EmptyState is the message that fills a place with nothing to show. It holds an illustration, a title, a description and one action, and draws no surface of its own, so it drops straight into a card or a panel body.",
    },
    parts: [
      {
        name: "Column",
        slot: "div",
        description: {
          ko: "최대 폭 360px의 세로 열입니다. 가운데 정렬이고 나타날 때 220ms 동안 아래에서 올라옵니다.",
          en: "A column capped at 360px, centred, that rises into place over 220ms when it mounts.",
        },
      },
      {
        name: "Illustration",
        slot: "illustration",
        description: {
          ko: "140px 정사각형 자리입니다. 넘긴 요소를 그 크기로 늘려 채우며, 없으면 자리를 비웁니다.",
          en: "A 140px square. The element passed here is stretched to fill it; without one the space is left out.",
        },
      },
      {
        name: "Title",
        slot: "title",
        description: {
          ko: "제목 문단입니다. title-md 기본 텍스트로 그려지고 두 줄로 균형 있게 나뉩니다.",
          en: "The heading paragraph, drawn in title-md primary text and balanced across two lines.",
        },
      },
      {
        name: "Description",
        slot: "description",
        description: {
          ko: "제목 아래 설명입니다. body-md 보조 텍스트로 열 폭을 모두 쓰고 줄바꿈을 고르게 나눕니다.",
          en: "The description under the title. body-md secondary text across the full column, with even line breaks.",
        },
      },
      {
        name: "Action",
        slot: "action",
        description: {
          ko: "설명 아래 16px을 띄우고 놓이는 동작 하나입니다. 보통 Button을 넘깁니다.",
          en: "One action placed 16px under the text, usually a Button.",
        },
      },
    ],
  },
  properties: [
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "빈 상태의 제목입니다. 무엇이 없는지 또는 무엇을 시작할 수 있는지를 짧게 적습니다. 제목은 필수이고 이 문구가 화면에서 가장 먼저 읽힙니다.",
        en: "The heading of the empty state. Say briefly what is missing or what can begin; it is required and is the first thing read.",
      },
      example: "basic",
    },
    {
      id: "description",
      title: { ko: "description", en: "description" },
      description: {
        ko: "제목 아래 설명입니다. 다음에 무엇을 하면 되는지 한두 문장으로 적습니다. 제목을 다시 말하지 않고 행동을 알려 줍니다.",
        en: "The copy under the title. Say what to do next in one or two sentences; do not restate the title, tell the reader what happens next.",
      },
      example: "basic",
    },
    {
      id: "action",
      title: { ko: "action", en: "action" },
      description: {
        ko: "빈 상태에서 할 수 있는 동작 하나입니다. 목록을 채우는 주 동작을 Button으로 넘깁니다. 할 일이 여럿이면 하나를 남기고 나머지는 화면의 다른 자리에 둡니다.",
        en: "The one thing to do from here. Pass the main action that fills the list as a Button. When several things are possible, keep one and put the rest elsewhere on the screen.",
      },
      example: "basic",
    },
    {
      id: "illustration",
      title: { ko: "illustration", en: "illustration" },
      description: {
        ko: "제목 위의 140px 그림입니다. 마스코트처럼 상황을 부드럽게 만드는 그림을 넘기고, 장식이므로 alt를 빈 문자열로 두거나 aria-hidden으로 감쌉니다. 그림이 없으면 이 자리를 그리지 않습니다.",
        en: "The 140px picture above the title. Pass something that softens the situation, such as a mascot; it is decoration, so keep alt empty or wrap it in aria-hidden. With no illustration the space is not drawn.",
      },
      example: "in-card",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "열에 마지막으로 병합되는 클래스입니다. 폭, 여백, 정렬을 자리에 맞출 때 씁니다. 배경이나 테두리는 그리지 않으므로 표면이 필요하면 감싸는 Card나 패널이 맡습니다.",
        en: "Classes merged last onto the column, for width, spacing or alignment. The component draws no fill or border, so a wrapping Card or panel owns the surface.",
      },
      example: "in-card",
    },
  ],
  guidelines: [
    {
      id: "one-action",
      title: { ko: "동작은 하나만", en: "One action" },
      body: {
        ko: "빈 상태는 다음 한 걸음을 안내하는 자리입니다. 동작이 둘이면 사용자가 어느 쪽이 주된 길인지 판단해야 하므로, 목록을 채우는 동작 하나를 남기고 나머지는 화면의 다른 자리에 둡니다.",
        en: "An empty state points to the next step. Two actions make the reader choose which path is the main one, so keep the action that fills the list and move the rest elsewhere.",
      },
      do: {
        ko: "Create a bot 하나를 동작으로 둡니다.",
        en: "Offer Create a bot as the single action.",
      },
      dont: {
        ko: "Create와 Import를 나란히 두지 않습니다.",
        en: "Do not place Create and Import side by side.",
      },
      example: "basic",
    },
    {
      id: "explain-the-next-step",
      title: { ko: "다음 행동을 적습니다", en: "Say what to do next" },
      body: {
        ko: "제목은 상태를, 설명은 다음 행동을 맡습니다. 아직 아무것도 없다는 사실만 되풀이하면 사용자는 무엇을 해야 할지 알 수 없습니다.",
        en: "The title names the state and the description names the next step. Repeating that nothing is here yet leaves the reader without a way forward.",
      },
      do: {
        ko: "역할과 할 일을 정하면 노트북을 닫아도 계속 실행된다고 적습니다.",
        en: "Give it a role and a task; it keeps working after you close the laptop.",
      },
      dont: {
        ko: "아직 봇이 없습니다로 끝내지 않습니다.",
        en: "Do not stop at There are no bots yet.",
      },
      example: "basic",
    },
    {
      id: "no-surface",
      title: { ko: "표면은 감싸는 쪽이 맡습니다", en: "The wrapper owns the surface" },
      body: {
        ko: "EmptyState는 배경과 테두리를 그리지 않습니다. 카드나 패널 안에 넣어 그 표면을 쓰고, 화면 전체가 비었으면 페이지 본문에 바로 놓습니다.",
        en: "An EmptyState draws no fill or border. Put it inside a Card or a panel and let that surface carry it; for a wholly empty screen, place it directly in the page body.",
      },
      example: "in-card",
    },
    {
      id: "empty-vs-banner",
      title: { ko: "Banner와 구분합니다", en: "Distinct from a Banner" },
      body: {
        ko: "Banner는 방금 일어난 일을 알리는 띠입니다. EmptyState는 보여 줄 내용이 없는 자리를 채우므로, 목록이나 패널의 본문이 비었을 때 쓰고 알림에는 Banner를 씁니다.",
        en: "A Banner reports something that just happened. An EmptyState fills a place with nothing to show, so use it in an empty list or panel body and a Banner for a notice.",
      },
      example: "error",
    },
  ],
  specification: [
    {
      id: "metrics",
      title: { ko: "치수", en: "Metrics" },
      rows: [
        { state: "default", slot: "Column", property: "max width", value: "360px" },
        { state: "default", slot: "Column", property: "padding", value: "32px 24px" },
        { state: "default", slot: "Column", property: "gap", value: "12px" },
        { state: "default", slot: "Column", property: "align", value: "items-center text-center" },
        { state: "default", slot: "Illustration", property: "size", value: "140px" },
        { state: "default", slot: "Title", property: "font", value: "text-title-md" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Description", property: "font", value: "text-body-md" },
        { state: "default", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Action", property: "margin top", value: "16px" },
        { state: "default", slot: "Column", property: "background", value: "없음" },
        { state: "default", slot: "Column", property: "border", value: "없음" },
      ],
    },
    {
      id: "text-flow",
      title: { ko: "글자 배치", en: "Text flow" },
      rows: [
        {
          state: "title",
          slot: "Title",
          property: "wrap",
          value: "text-balance",
          note: {
            ko: "두 줄로 나뉠 때 두 줄의 길이를 고르게 맞춥니다.",
            en: "When it breaks, the two lines are balanced in length.",
          },
        },
        {
          state: "description",
          slot: "Description",
          property: "wrap",
          value: "text-pretty",
          note: {
            ko: "마지막 줄에 한 단어만 남지 않도록 줄바꿈을 고릅니다.",
            en: "Line breaks are chosen so the last line is not a single word.",
          },
        },
        { state: "description", slot: "Description", property: "width", value: "self-stretch" },
        {
          state: "default",
          slot: "Column",
          property: "motion",
          value: "motion-rise",
          note: {
            ko: "나타날 때 220ms 동안 아래에서 올라옵니다.",
            en: "It rises into place over 220ms when it mounts.",
          },
        },
        {
          state: "reduced motion",
          slot: "Column",
          property: "motion",
          value: "0.01ms",
          note: {
            ko: "동작 줄이기를 켜면 즉시 나타납니다.",
            en: "With reduced motion it appears at once.",
          },
        },
        { state: "illustration", slot: "Illustration", property: "child fit", value: "[&>*]:size-full" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Default" },
      description: {
        ko: "제목, 설명, 동작 하나로 첫 화면을 안내합니다.",
        en: "A title, a description and one action guide the first screen.",
      },
    },
    {
      id: "without-illustration",
      title: { ko: "그림 없이", en: "Without an illustration" },
      description: {
        ko: "그림을 비우면 제목부터 시작하는 좁은 안내가 됩니다.",
        en: "Without the illustration the message starts at the title and sits tighter.",
      },
    },
    {
      id: "in-card",
      title: { ko: "카드 안에서", en: "Inside a card" },
      description: {
        ko: "자체 배경이 없으므로 Card 안에 넣어 표면을 빌려 씁니다.",
        en: "It draws no surface, so a Card lends it one.",
      },
    },
    {
      id: "error",
      title: { ko: "불러오기 실패", en: "Load failure" },
      description: {
        ko: "내용을 불러오지 못한 자리에서 다시 시도 동작을 제공합니다.",
        en: "A place that failed to load offers a retry as its action.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "제목과 설명은 문단 텍스트라 순서대로 읽힙니다. 제목을 heading 요소로 만들지 않으므로 화면 구조상 제목이 필요하면 감싸는 패널이 제목을 갖습니다.",
        en: "The title and description are paragraph text and are read in order. The title is not a heading element, so a wrapping panel supplies the section heading when the outline needs one.",
      },
      {
        ko: "그림은 장식입니다. alt를 빈 문자열로 두거나 aria-hidden으로 감싸 스크린 리더가 마스코트 설명을 읽지 않게 합니다.",
        en: "The illustration is decoration. Keep alt empty or wrap it in aria-hidden so a screen reader does not describe the mascot.",
      },
      {
        ko: "동작이 하나뿐이므로 이름이 곧 다음 걸음입니다. Create a bot처럼 결과를 적고 자세히 보기 같은 모호한 문구를 쓰지 않습니다.",
        en: "With a single action its name is the next step. Name the result, as Create a bot, not a vague phrase such as Learn more.",
      },
    ],
    keyboard: [],
  },
};
