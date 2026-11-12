/**
 * Reference doc for `Progress`, written against
 * `packages/react/src/components/progress.tsx` and
 * `packages/flutter/lib/src/components/progress.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "progress",
  anatomy: {
    description: {
      ko: "Progress는 작업이 얼마나 진행됐는지 보여 주는 막대입니다. value를 주면 그 비율만큼 채워진 막대가 되고, value를 비우면 폭 3분의 1의 조각이 트랙을 지나가는 불확정 막대가 됩니다.",
      en: "A Progress bar shows how far a task has got. With a value the fill stops at that share of the track; without one a one-third-wide piece sweeps across the track instead.",
    },
    parts: [
      {
        name: "Root",
        slot: "Root",
        description: {
          ko: "progressbar 역할을 갖는 Base UI 루트입니다. 기본 폭 240px이고 className으로 폭을 바꿉니다.",
          en: "The Base UI root that carries the progressbar role. It is 240px wide by default; change the width with className.",
        },
      },
      {
        name: "Track",
        slot: "Track",
        description: {
          ko: "높이 6px의 둥근 트랙입니다. 8% 잉크 바탕으로 남은 양을 보여 줍니다.",
          en: "The 6px rounded track. Its 8% ink fill shows what is left to go.",
        },
      },
      {
        name: "Indicator",
        slot: "Indicator",
        description: {
          ko: "트랙 안에서 value만큼 차는 막대입니다. 불확정일 때는 3분의 1 폭으로 트랙을 가로지릅니다.",
          en: "The bar that fills the track up to value. When indeterminate it is a third of the width and crosses the track.",
        },
      },
    ],
  },
  properties: [
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "0에서 100 사이의 진행률입니다. 값을 주면 그 비율만큼 채워진 확정 막대가 되고, 생략하거나 null을 주면 불확정 막대가 됩니다.",
        en: "Progress from 0 to 100. A number gives a determinate bar filled to that share; omitting it or passing null gives the indeterminate bar.",
      },
      example: "determinate",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "루트에 병합되는 클래스입니다. 기본 240px 폭을 바꿀 때 씁니다. 예를 들어 w-full로 카드 폭을 채웁니다.",
        en: "Classes merged onto the root, used to change the default 240px width. w-full fills a card, for example.",
      },
      example: "width",
    },
    {
      id: "aria-label",
      title: { ko: "aria-label", en: "aria-label" },
      description: {
        ko: "진행 중인 작업의 이름입니다. 이 래퍼는 Progress.Label을 그리지 않으므로 화면에 이름을 따로 두지 않는다면 반드시 넘깁니다.",
        en: "The name of the task in progress. This wrapper draws no Progress.Label, so pass it whenever the name is not written on screen.",
      },
      example: "labeled",
    },
  ],
  guidelines: [
    {
      id: "name-the-task",
      title: { ko: "무엇이 진행 중인지 알립니다", en: "Name what is running" },
      body: {
        ko: "Progress는 이름을 스스로 그리지 않습니다. 화면에 Uploading처럼 작업 이름이 있으면 그 문구를 aria-label에도 넣고, 없으면 Progress에 aria-label을 붙여 스크린 리더가 무엇이 진행 중인지 알게 합니다.",
        en: "Progress draws no name of its own. When the screen already says Uploading, use that same wording for aria-label; otherwise put aria-label on the bar so a screen reader knows what is running.",
      },
      do: {
        ko: "화면 문구와 같은 aria-label=\"Uploading\"을 넘깁니다.",
        en: "Pass aria-label=\"Uploading\", matching the on-screen words.",
      },
      dont: {
        ko: "이름 없이 막대만 두지 않습니다.",
        en: "Do not leave a bare bar without a name.",
      },
      example: "labeled",
    },
    {
      id: "measurable-only",
      title: { ko: "진행률을 알 수 있을 때만 value를 씁니다", en: "Use value only when progress is known" },
      body: {
        ko: "value는 전체 양을 아는 작업에 씁니다. 끝나는 시점을 모르는 호출에는 value를 비워 불확정 막대를 쓰거나, 기다리는 자리가 짧으면 Spinner를 씁니다.",
        en: "value belongs to work with a known total. For a call whose end is unknown, leave value unset for the indeterminate bar, or use a Spinner where the wait is short.",
      },
      example: "indeterminate",
    },
    {
      id: "quota-vs-task",
      title: { ko: "할당량에는 UsageMeter를 씁니다", en: "Quotas use UsageMeter" },
      body: {
        ko: "Progress는 한 번의 작업 진행을 보여 줍니다. 월간 사용량처럼 남은 양과 초기화 시점을 함께 알리는 자리에는 라벨과 캡션을 갖춘 UsageMeter를 씁니다.",
        en: "Progress shows one task as it runs. For a monthly allowance that also needs the reset date, use UsageMeter, which carries a label and captions.",
      },
      example: "labeled",
    },
    {
      id: "width",
      title: { ko: "폭은 자리에 맞춥니다", en: "Fit the width to its place" },
      body: {
        ko: "기본 폭은 240px입니다. 카드나 대화상자의 폭을 채우려면 className에 w-full을 넘기고, 좁은 행 안에서는 폭을 줄여 막대가 행 밖으로 나가지 않게 합니다.",
        en: "The default width is 240px. Pass w-full in className to fill a card or dialog, and narrow it inside a tight row so the bar stays within the row.",
      },
      example: "width",
    },
  ],
  specification: [
    {
      id: "track-and-fill",
      title: { ko: "트랙과 채움", en: "Track and fill" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름입니다.",
        en: "Values are the token utilities from the component classes.",
      },
      rows: [
        { state: "default", slot: "Track", property: "height", value: "6px" },
        { state: "default", slot: "Track", property: "background", value: "bg-overlay-ink-8" },
        { state: "default", slot: "Track", property: "radius", value: "rounded-full" },
        { state: "default", slot: "Track", property: "overflow", value: "overflow-clip" },
        { state: "determinate", slot: "Indicator", property: "background", value: "bg-interactive-primary" },
        { state: "determinate", slot: "Indicator", property: "height", value: "100%" },
        { state: "determinate", slot: "Indicator", property: "radius", value: "rounded-full" },
        { state: "indeterminate", slot: "Indicator", property: "width", value: "33.333%" },
        { state: "indeterminate", slot: "Indicator", property: "background", value: "bg-interactive-primary" },
        { state: "responsive", slot: "Root", property: "width", value: "w-60" },
        { state: "responsive", slot: "Root", property: "width override", value: "className" },
      ],
    },
    {
      id: "motion",
      title: { ko: "움직임", en: "Motion" },
      rows: [
        {
          state: "determinate · value change",
          slot: "Indicator",
          property: "transition",
          value: "transition-[width] duration-400 ease-out-quint",
          note: {
            ko: "값이 바뀌면 폭이 400ms 동안 부드럽게 따라가 상태에서 온 값도 점프하지 않고 이동으로 읽힙니다.",
            en: "A new value moves the width over 400ms, so a value fed from state reads as movement rather than a jump.",
          },
        },
        {
          state: "indeterminate",
          slot: "Indicator",
          property: "animation",
          value: "animate-sweep",
          note: {
            ko: "1.4초 주기로 트랙을 가로질러 지나갑니다.",
            en: "It crosses the track on a 1.4s cycle.",
          },
        },
        {
          state: "reduced motion",
          slot: "Indicator",
          property: "animation",
          value: "0.01ms · 1회",
          note: {
            ko: "동작 줄이기를 켜면 애니메이션이 한 번만 즉시 실행되고 전환도 즉시 끝납니다.",
            en: "With reduced motion on, the animation runs once at once and transitions finish immediately.",
          },
        },
      ],
    },
    {
      id: "semantics",
      title: { ko: "의미", en: "Semantics" },
      rows: [
        { state: "default", slot: "Root", property: "role", value: "progressbar" },
        {
          state: "determinate",
          slot: "Root",
          property: "aria-valuenow",
          value: "value",
          note: {
            ko: "Base UI가 value를 aria-valuenow로 연결합니다.",
            en: "Base UI wires value into aria-valuenow.",
          },
        },
        {
          state: "indeterminate",
          slot: "Root",
          property: "aria-valuenow",
          value: "생략",
          note: {
            ko: "값이 없으면 현재 값을 알리지 않습니다.",
            en: "Without a value no current value is announced.",
          },
        },
        { state: "default", slot: "Root", property: "name", value: "aria-label" },
        {
          state: "default",
          slot: "Root",
          property: "inherited",
          value: "min, max, format, locale, getAriaValueText",
          note: {
            ko: "Base UI Progress.Root의 나머지 prop이 그대로 전달됩니다.",
            en: "The remaining Base UI Progress.Root props pass through.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "determinate",
      title: { ko: "확정 진행률", en: "Determinate" },
      description: {
        ko: "0, 40, 100처럼 값을 준 막대를 나란히 두었습니다.",
        en: "Bars at 0, 40 and 100 side by side.",
      },
    },
    {
      id: "indeterminate",
      title: { ko: "불확정", en: "Indeterminate" },
      description: {
        ko: "value를 비우면 3분의 1 폭 조각이 트랙을 지나갑니다.",
        en: "With no value a one-third piece sweeps across the track.",
      },
    },
    {
      id: "labeled",
      title: { ko: "이름이 있는 진행률", en: "Named progress" },
      description: {
        ko: "작업 이름과 퍼센트를 화면에 두고 같은 이름을 aria-label로 넘깁니다.",
        en: "The task name and percentage on screen, with the same wording passed as aria-label.",
      },
    },
    {
      id: "width",
      title: { ko: "폭 조정", en: "Width" },
      description: {
        ko: "기본 240px 폭과 w-full로 카드 폭을 채운 막대를 비교합니다.",
        en: "The default 240px width next to a bar that fills its card with w-full.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "Base UI가 progressbar 역할과 aria-valuenow를 연결합니다. 화면에 이름이 없으면 aria-label로 작업 이름을 반드시 넘깁니다.",
        en: "Base UI supplies the progressbar role and the aria-valuenow wiring. When the name is not on screen, pass it through aria-label.",
      },
      {
        ko: "불확정 막대는 현재 값을 알리지 않으므로 스크린 리더는 진행 중이라는 사실만 전달받습니다. 끝나는 시점을 아는 작업이면 value를 넘겨 남은 양을 알립니다.",
        en: "The indeterminate bar announces no current value, so a screen reader only learns that work is running. When the end is known, pass value so the remaining amount is announced.",
      },
      {
        ko: "동작 줄이기를 켜면 sweep 애니메이션이 한 번만 실행됩니다. 움직임이 멈춰도 작업이 멈춘 것은 아니므로 상태 문구를 함께 두어 구분합니다.",
        en: "With reduced motion the sweep runs only once. A still bar does not mean the work stopped, so keep the state in text beside it.",
      },
    ],
    keyboard: [],
  },
};
