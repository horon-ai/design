/**
 * Reference doc for `BotMemoryPanel`, written against
 * `packages/react/src/components/bot-memory-panel.tsx` and
 * `packages/flutter/lib/src/components/bot_memory_panel.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "bot-memory-panel",
  anatomy: {
    description: {
      ko: "BotMemoryPanel은 봇이 기억하고 있는 내용을 묶음별로 보여 주고, 기억 사용량과 켜고 끄는 설정을 함께 둡니다. 새 기억이 저장되면 패널 안에 짧은 알약이 떠서 알려 줍니다.",
      en: "BotMemoryPanel shows what a bot remembers, grouped, beside the memory usage and the switches that govern it. A short pill inside the panel announces a newly saved memory.",
    },
    parts: [
      {
        name: "Panel",
        slot: "section",
        description: {
          ko: "패널 전체를 감싸는 section입니다. 20px 모서리와 표면 색을 쓰고 최대 너비가 560px입니다.",
          en: "The section wrapping the panel, with a 20px radius, the surface fill and a 560px maximum width.",
        },
      },
      {
        name: "Header",
        slot: "title",
        description: {
          ko: "제목과 부제, 그리고 오른쪽의 사용량 표시가 한 줄에 놓입니다. 사용량은 퍼센트 문구와 1.25px 높이의 미터로 함께 보여 줍니다.",
          en: "The title and subtitle share a row with the usage readout on the right: a percent label and a 1.25px meter.",
        },
      },
      {
        name: "Setting row",
        slot: "settings",
        description: {
          ko: "설정 하나를 나타내는 행입니다. 라벨과 설명, 오른쪽의 작은 Switch로 이루어지고, Switch의 접근 가능한 이름은 라벨을 그대로 씁니다.",
          en: "One setting row: a label and description with a compact Switch on the right. The Switch takes its accessible name from the label.",
        },
      },
      {
        name: "Filter tabs",
        slot: "PanelPillTabs",
        description: {
          ko: "All과 기억 묶음 이름으로 만든 알약 탭입니다. 묶음 이름은 memories에 처음 나온 순서대로 붙습니다.",
          en: "The pill tabs of All and each memory group, taken from the order groups first appear in memories.",
        },
      },
      {
        name: "Toast",
        slot: "toast",
        description: {
          ko: "먼저 들어온 기억을 알리는 짧은 알약입니다. 북마크 아이콘, 제목, 선택적인 설명, 닫기 버튼으로 이루어지고 role status로 읽힙니다.",
          en: "A short pill announcing a memory that just arrived: a bookmark icon, a title, an optional detail and a close button, exposed with role status.",
        },
      },
      {
        name: "Memory group",
        slot: "group",
        description: {
          ko: "같은 group 값을 가진 기억을 묶는 구획입니다. 머리에 묶음 이름과 개수가 붙고, 그 아래에 기억 행이 놓입니다.",
          en: "A section that collects memories sharing one group value, headed by the group name and its count.",
        },
      },
      {
        name: "Memory row",
        slot: "memories",
        description: {
          ko: "기억 하나의 행입니다. 기억 문장과 출처 줄로 이루어지고, fresh이면 하늘색 바탕이 붙어 방금 추가된 것임을 알립니다.",
          en: "One memory. It pairs the remembered text with a source line, and fresh paints a sky fill to show it was just added.",
        },
      },
      {
        name: "Add memory",
        slot: "onAdd",
        description: {
          ko: "패널 맨 아래의 추가 버튼입니다. 핸들러가 없어도 렌더링되므로 눌러도 반응하지 않을 수 있습니다.",
          en: "The add action at the very bottom. It renders even without a handler, so pressing it may do nothing.",
        },
      },
    ],
  },
  properties: [
    {
      id: "usage",
      title: { ko: "usage", en: "usage" },
      description: {
        ko: "기억 저장 공간이 얼마나 찼는지 0에서 100 사이 백분율로 받습니다. 범위를 벗어난 값은 0이나 100으로 잘리고, 미터와 퍼센트 문구에 같은 값이 쓰입니다.",
        en: "How full the memory store is, as a percentage from 0 to 100. A value outside the range is clamped to 0 or 100, and the meter and the percent label share the value.",
      },
      example: "memory",
    },
    {
      id: "settings",
      title: { ko: "settings", en: "settings" },
      description: {
        ko: "머리 아래에 놓이는 Switch 행입니다. 라벨과 설명을 받고, 첫 렌더 뒤에는 Switch가 스스로 상태를 들고 있으므로 나중에 defaultChecked를 바꿔도 화면이 따라가지 않습니다.",
        en: "The Switch rows under the header. Each takes a label and a description, and after the first render the Switch holds its own state, so a later defaultChecked change does not move it.",
      },
      example: "groups",
    },
    {
      id: "memories",
      title: { ko: "memories", en: "memories" },
      description: {
        ko: "보여 줄 기억의 전체 목록입니다. group 값으로 묶이고 필터 탭도 이 값에서 만들어집니다. 한 항목은 기억 문장과 출처, 묶음 이름을 함께 가집니다.",
        en: "Every memory to show. They group by the group value, which also builds the filter tabs. One item carries the remembered text, its source and its group name.",
      },
      example: "memory",
    },
    {
      id: "fresh",
      title: { ko: "fresh", en: "fresh" },
      description: {
        ko: "방금 추가된 기억에 붙이는 표시입니다. 하늘색 바탕으로 잠깐 구분해 주고, 다음 렌더에서 값이 빠지면 사라집니다.",
        en: "A mark for a memory that was just added. A sky fill sets it apart for a moment and disappears when the flag drops on a later render.",
      },
      example: "toast",
    },
    {
      id: "toast",
      title: { ko: "toast", en: "toast" },
      description: {
        ko: "패널 안에 띄우는 알림 알약입니다. 값을 넘기면 나타나고, 닫기 버튼을 누르면 퇴장 애니메이션을 재생한 뒤 onToastDismiss를 부릅니다. 새 객체를 넘기면 닫힌 뒤에도 다시 나타납니다.",
        en: "The notice pill inside the panel. A value makes it appear; its close button plays the exit and then calls onToastDismiss. Passing a new object brings it back after a dismissal.",
      },
      example: "toast",
    },
    {
      id: "onSettingChange",
      title: { ko: "onSettingChange", en: "onSettingChange" },
      description: {
        ko: "설정 Switch를 뒤집을 때 설정 id와 새 상태를 받습니다. 저장은 호출한 쪽이 맡습니다.",
        en: "Called with the setting id and the new state when a Switch is flipped. Persisting it is the caller's job.",
      },
      example: "groups",
    },
    {
      id: "onAdd",
      title: { ko: "onAdd", en: "onAdd" },
      description: {
        ko: "Add memory를 누를 때 호출됩니다. 새 기억을 어디서 받을지는 호출한 쪽이 정합니다.",
        en: "Called when Add memory is pressed. Where the new memory comes from is up to the caller.",
      },
      example: "groups",
    },
    {
      id: "onSearch",
      title: { ko: "onSearch", en: "onSearch" },
      description: {
        ko: "돋보기 버튼을 실제 버튼으로 만듭니다. 핸들러가 없으면 같은 자리에 장식 아이콘만 남고 aria-hidden이 붙습니다.",
        en: "Turns the magnifier into a real button. Without the handler the same spot holds a decorative icon marked aria-hidden.",
      },
      example: "groups",
    },
    {
      id: "subtitle",
      title: { ko: "subtitle", en: "subtitle" },
      description: {
        ko: "제목 아래 둘째 줄입니다. 무엇을 기억하는지 한 줄로 설명할 때 씁니다.",
        en: "The second line under the title, for a one line note on what the bot remembers.",
      },
      example: "memory",
    },
  ],
  guidelines: [
    {
      id: "usage-is-real",
      title: { ko: "사용량은 실제 값으로", en: "Feed the meter a real number" },
      body: {
        ko: "usage는 저장 공간이 얼마나 찼는지 보여 주는 값입니다. 자리만 채우려고 고정값을 넣으면 가득 찬 상태에서도 여유가 있어 보여 기억이 저장되지 않는 이유를 찾을 수 없습니다.",
        en: "usage reports how full the store is. A fixed placeholder value makes a full store look roomy, and then nobody can tell why a memory stops saving.",
      },
      do: {
        ko: "기억 개수와 한도로 계산한 값을 넘깁니다.",
        en: "Pass a value computed from the stored count and the limit.",
      },
      dont: {
        ko: "늘 40을 넘겨 여유가 있는 것처럼 보이게 하지 않습니다.",
        en: "Do not pass a constant 40 that always looks comfortable.",
      },
      example: "groups",
    },
    {
      id: "one-fact-per-memory",
      title: { ko: "기억 하나에 사실 하나", en: "One fact per memory" },
      body: {
        ko: "행 하나를 한 문장으로 유지합니다. 여러 사실을 한 줄에 몰면 일부만 지우거나 고칠 수 없고, 출처 줄도 어느 사실에 대한 것인지 흐려집니다.",
        en: "Keep one row to one sentence. Several facts in one line cannot be removed or corrected one at a time, and the source line stops matching the fact.",
      },
      do: {
        ko: "Lena Brunner handles invoices at Fjord Analytics처럼 하나만 적습니다.",
        en: "Write just one, such as Lena Brunner handles invoices at Fjord Analytics.",
      },
      dont: {
        ko: "연락처와 일정과 취향을 한 문장에 붙이지 않습니다.",
        en: "Do not weld a contact, a schedule and a preference into one sentence.",
      },
      example: "memory",
    },
    {
      id: "short-toast",
      title: { ko: "알약은 짧은 확인용", en: "Keep the pill to a short confirmation" },
      body: {
        ko: "toast는 방금 저장한 내용을 짧게 확인해 주는 자리입니다. 오류를 알리거나 여러 개를 한꺼번에 알리는 데 쓰면 곧 닫혀 버려 읽을 수 없습니다.",
        en: "toast confirms what was just saved, briefly. Using it for an error or a batch of changes means it closes before anyone can read it.",
      },
      do: {
        ko: "제목에 Memory updated, 설명에 저장한 문장을 짧게 적습니다.",
        en: "Title it Memory updated and keep the saved sentence short in the detail.",
      },
      dont: {
        ko: "실패한 다섯 건의 목록을 알약에 넣지 않습니다.",
        en: "Do not put a list of five failures in the pill.",
      },
      example: "toast",
    },
    {
      id: "fresh-then-clear",
      title: { ko: "fresh는 한 번만", en: "Fresh for one render only" },
      body: {
        ko: "fresh는 방금 추가된 기억 하나에만 붙입니다. 목록 전체에 남겨 두면 하늘색 바탕이 장식이 되어 새 기억이 눈에 띄지 않습니다.",
        en: "Set fresh on the one memory that just arrived. Left on the whole list, the sky fill becomes decoration and a new memory stops standing out.",
      },
      example: "toast",
    },
  ],
  specification: [
    {
      id: "header-meter",
      title: { ko: "머리와 미터", en: "Header and meter" },
      note: {
        ko: "값은 소스 클래스 그대로입니다.",
        en: "Values are the source classes as written.",
      },
      rows: [
        { state: "default", slot: "Panel", property: "radius", value: "rounded-xl" },
        { state: "default", slot: "Panel", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Panel", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Panel", property: "max width", value: "max-w-140" },
        { state: "default", slot: "Header", property: "padding", value: "px-5 pt-4 pb-3.5" },
        { state: "default", slot: "Header", property: "gap", value: "gap-x-2.5 gap-y-2" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg text-text-primary" },
        { state: "default", slot: "Subtitle", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Percent label", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Meter", property: "height", value: "h-1.25" },
        { state: "default", slot: "Meter", property: "width", value: "w-20" },
        { state: "default", slot: "Meter track", property: "background", value: "bg-overlay-ink-8" },
        { state: "default", slot: "Meter", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Meter fill", property: "background", value: "bg-interactive-primary" },
        {
          state: "usage change",
          slot: "Meter fill",
          property: "transition",
          value: "duration-280 ease-emphasized",
          note: {
            ko: "너비만 바뀌고 행은 다시 흐르지 않습니다.",
            en: "Only the width changes; the rows never reflow.",
          },
        },
        { state: "default", slot: "Divider", property: "background", value: "h-px bg-overlay-ink-8" },
      ],
    },
    {
      id: "settings-filter",
      title: { ko: "설정과 필터", en: "Settings and filter" },
      rows: [
        { state: "default", slot: "Setting row", property: "padding", value: "px-5 py-2.5" },
        { state: "default", slot: "Setting row", property: "gap", value: "gap-3" },
        { state: "default", slot: "Setting label", property: "font", value: "text-label-md text-text-primary" },
        { state: "default", slot: "Setting description", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Filter track", property: "background", value: "bg-overlay-ink-5" },
        { state: "default", slot: "Filter track", property: "padding", value: "p-[3px]" },
        { state: "default", slot: "Filter track", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Filter option", property: "height", value: "h-7.5" },
        { state: "default", slot: "Filter option", property: "padding", value: "px-3" },
        { state: "default", slot: "Filter option", property: "font", value: "text-label-md" },
        { state: "Filter · selected", slot: "Filter option", property: "text color", value: "text-text-primary" },
        { state: "Filter · rest", slot: "Filter option", property: "text color", value: "text-text-secondary" },
        { state: "Filter · selection", slot: "Filter track", property: "background", value: "bg-overlay-ink-10" },
        { state: "Search", slot: "Search button", property: "size", value: "size-7.5 rounded-full" },
        { state: "Search", slot: "Search button", property: "background", value: "bg-overlay-ink-6 text-text-secondary" },
        { state: "Search · hover", slot: "Search button", property: "background", value: "bg-overlay-ink-10" },
        { state: "focus-visible", slot: "Search button", property: "outline", value: "2px outline-text-brand" },
      ],
    },
    {
      id: "memories-toast",
      title: { ko: "기억과 알림", en: "Memories and the toast" },
      rows: [
        { state: "default", slot: "Toast pill", property: "height", value: "h-8" },
        { state: "default", slot: "Toast pill", property: "background", value: "bg-accent-sky-500-16" },
        { state: "default", slot: "Toast pill", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Toast title", property: "font", value: "text-label-sm text-text-primary" },
        { state: "default", slot: "Toast detail", property: "font", value: "text-caption text-text-secondary" },
        { state: "Toast · enter", slot: "Toast pill", property: "motion", value: "animate-pop-in" },
        { state: "Toast · leave", slot: "Toast pill", property: "motion", value: "animate-pop-out" },
        { state: "default", slot: "Group heading", property: "font", value: "text-label-sm text-text-secondary" },
        { state: "default", slot: "Group count", property: "font", value: "text-caption text-text-secondary" },
        { state: "default", slot: "Memory row", property: "padding", value: "px-5 py-2" },
        { state: "default", slot: "Memory text", property: "font", value: "text-body-sm text-text-primary" },
        { state: "default", slot: "Source", property: "font", value: "text-caption text-text-secondary" },
        { state: "Memory · fresh", slot: "Memory row", property: "background", value: "bg-accent-sky-500-10" },
        { state: "row entrance", slot: "Memory row", property: "motion", value: "motion-rise" },
        { state: "row entrance", slot: "Memory row", property: "stagger", value: "30ms per row" },
        { state: "default", slot: "Add memory", property: "padding", value: "px-5 pt-3 pb-4" },
        { state: "default", slot: "Add memory", property: "font", value: "text-label-md text-text-secondary" },
        { state: "Add · hover", slot: "Add memory", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Add icon", property: "size", value: "size-3.5" },
        { state: "pressed", slot: "Button", property: "motion", value: "motion-press" },
      ],
    },
  ],
  examples: [
    {
      id: "memory",
      title: { ko: "기본 구성", en: "Basic panel" },
      description: {
        ko: "사용량 42%와 두 개의 설정 행, 두 묶음의 기억을 함께 두었습니다.",
        en: "A 42% meter, two setting rows and memories in two groups.",
      },
    },
    {
      id: "toast",
      title: { ko: "새 기억 알림", en: "A memory update" },
      description: {
        ko: "방금 저장한 기억에 fresh를 붙이고 알림 알약을 띄웠습니다. 닫으면 알약이 빠지고 onToastDismiss가 불립니다.",
        en: "The just saved memory carries fresh under a notice pill. Closing it removes the pill and calls onToastDismiss.",
      },
    },
    {
      id: "groups",
      title: { ko: "묶음과 설정", en: "Groups and switches" },
      description: {
        ko: "세 묶음 다섯 개의 기억을 넣고 사용량을 88%로 올렸습니다. Switch와 검색 버튼과 Add memory를 누른 결과를 아래에 적습니다.",
        en: "Five memories in three groups at 88% usage. The Switch, search button and Add memory each report their press below.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "미터는 role progressbar이고 이름이 Memory used이며 0과 100과 현재 값을 함께 노출합니다. 퍼센트 문구는 미터 옆에 있어 눈으로도 같은 값을 읽습니다.",
        en: "The meter is a progressbar named Memory used and exposes its minimum, maximum and current value. The percent label beside it shows the same number visually.",
      },
      {
        ko: "설정 Switch는 라벨을 그대로 접근 가능한 이름으로 씁니다. 설명은 switch에 연결되지 않으므로, 설정을 이해하는 데 꼭 필요한 내용이면 라벨에도 담으십시오.",
        en: "Each setting Switch takes the label as its accessible name. The description is not attached to the switch, so put anything essential for understanding the setting in the label too.",
      },
      {
        ko: "검색 버튼은 아이콘만 있으므로 Search memories라는 aria-label을 스스로 붙입니다. onSearch가 없으면 같은 아이콘이 aria-hidden 장식으로만 남습니다.",
        en: "The search button is icon-only and supplies the aria-label Search memories itself. Without onSearch the icon stays as aria-hidden decoration.",
      },
      {
        ko: "알림 알약은 role status라 새 기억이 저장될 때 화면 낭독기가 알려 줍니다. 동작 줄이기를 켜면 등장과 퇴장이 즉시 끝나고 onToastDismiss는 그대로 불립니다.",
        en: "The pill has role status, so a screen reader announces a saved memory. With reduced motion the enter and exit finish at once and onToastDismiss still fires.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "설정 Switch, 필터 탭, 검색 버튼, 알약의 닫기 버튼, Add memory 순서로 이동합니다.",
          en: "Moves through the setting switches, the filter tabs, the search button, the pill's close button and Add memory.",
        },
      },
      {
        keys: ["Space"],
        action: { ko: "포커스가 닿은 Switch를 뒤집거나 버튼을 실행합니다.", en: "Flips the focused Switch or runs the focused button." },
      },
      {
        keys: ["ArrowLeft"],
        action: { ko: "필터 탭에서 이전 묶음을 고릅니다.", en: "Selects the previous group filter." },
      },
      {
        keys: ["ArrowRight"],
        action: { ko: "필터 탭에서 다음 묶음을 고릅니다.", en: "Selects the next group filter." },
      },
    ],
    pattern: {
      label: "WAI-ARIA Tabs Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
    },
  },
};
