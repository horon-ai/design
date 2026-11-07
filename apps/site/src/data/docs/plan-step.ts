/**
 * Reference doc for `Plan Step`, written against
 * `packages/react/src/components/plan-step.tsx` and
 * `packages/flutter/lib/src/components/plan_step.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "plan-step",
  anatomy: {
    description: {
      ko: "Plan Step은 실행 계획의 한 단계를 세로 레일 위에 놓습니다. 왼쪽에 24px 표식과 그 아래로 이어지는 2px 레일, 오른쪽에 제목 줄, 설명과 도구 태그, 실패했을 때는 오류 블록이 놓입니다.",
      en: "Plan Step places one step of a plan on a vertical rail: a 24px marker with a 2px rail running below it, and on the right the title row, a description with a tool tag, and an error block when the step failed.",
    },
    parts: [
      {
        name: "Marker",
        slot: "status",
        description: {
          ko: "단계의 상태를 담은 24px 사각 표식입니다. 끝나면 체크, 진행 중이면 스피너, 실패면 느낌표, 아직이면 단계 번호를 그립니다.",
          en: "The 24px marker that carries the step's state: a check when done, a spinner while running, an exclamation when failed, and the step number while pending.",
        },
      },
      {
        name: "Rail",
        slot: "last",
        description: {
          ko: "표식 아래로 다음 단계까지 이어지는 2px 선입니다. 끝난 단계에서는 sky 색으로 채워져 어디까지 진행했는지 보여 줍니다.",
          en: "The 2px line running from the marker to the next step. On a finished step it fills with the sky color, showing how far the plan got.",
        },
      },
      {
        name: "Title row",
        slot: "title",
        description: {
          ko: "단계 이름과 걸린 시간입니다. pending이면 제목이 secondary 색으로 흐려지고, 시간은 done과 running에서만 나옵니다.",
          en: "The step name and its elapsed time. A pending title fades to secondary, and the time appears only while done or running.",
        },
      },
      {
        name: "Meta row",
        slot: "description · tool",
        description: {
          ko: "설명과 도구 태그가 한 줄에 놓입니다. 도구 태그는 stripe.query 같은 식별자를 mono 글꼴로 적습니다.",
          en: "The description and the tool tag on one line. The tag holds an identifier such as stripe.query in mono type.",
        },
      },
      {
        name: "Error block",
        slot: "error",
        description: {
          ko: "실패한 단계에서만 펼쳐지는 danger 문장과 Retry from here 버튼입니다. 다른 상태에서는 접힌 채 DOM에 남고 버튼만 inert가 됩니다.",
          en: "The danger sentence and Retry from here button, revealed only on a failed step. In other states it stays collapsed in the DOM and only the button turns inert.",
        },
      },
    ],
  },
  properties: [
    {
      id: "status",
      title: { ko: "status", en: "status" },
      description: {
        ko: "단계의 진행 상태입니다. 표식의 모양과 바탕, 레일 색, 제목 색을 함께 정합니다.",
        en: "Progress of the step. It picks the marker glyph and fill, the rail color and the title color.",
      },
      values: [
        {
          name: "done",
          description: {
            ko: "sky 바탕에 체크를 그리고 레일을 sky로 채웁니다. 지나온 구간을 한눈에 보여 줍니다.",
            en: "A check on the sky fill, with the rail filled to match, so the covered stretch reads at a glance.",
          },
        },
        {
          name: "running",
          description: {
            ko: "subtle 바탕 위에 20px 스피너가 돌고 레일은 기본 테두리 색으로 남습니다.",
            en: "A 20px spinner on the subtle fill, with the rail left at the default border color.",
          },
        },
        {
          name: "failed",
          description: {
            ko: "danger 바탕에 느낌표를 그리고 오류 블록을 펼칩니다. 레일은 진행되지 않은 것으로 남깁니다.",
            en: "An exclamation on the danger fill, with the error block revealed and the rail left as not progressed.",
          },
        },
        {
          name: "pending",
          description: {
            ko: "테두리만 있는 표식에 단계 번호를 넣고 제목을 secondary로 흐립니다. 아직 시작하지 않은 단계입니다.",
            en: "An outlined marker holding the step number, with the title faded to secondary. The step has not started.",
          },
        },
      ],
      example: "rail",
    },
    {
      id: "index",
      title: { ko: "index", en: "index" },
      description: {
        ko: "단계 번호입니다. pending일 때 표식 안에 그려지고, 나머지 상태에서는 자리를 비웁니다. 1부터 세어 계획의 순서를 사람의 말과 맞춥니다.",
        en: "The step number, drawn inside the marker while pending and hidden in other states. Count from 1 so the plan's order matches how people speak about it.",
      },
      example: "rail",
    },
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "단계 이름입니다. label-lg로 그리고 좁아지면 여러 줄로 접힙니다. 동작이 아니라 결과를 적습니다.",
        en: "The step name in label-lg, wrapping when narrow. Name the outcome rather than the action.",
      },
      example: "minimal",
    },
    {
      id: "tool",
      title: { ko: "tool", en: "tool" },
      description: {
        ko: "이 단계가 부르는 도구의 식별자입니다. mono 글꼴 태그로 그리므로 stripe.query처럼 짧게 적고, 도구를 부르지 않는 단계에는 넘기지 않습니다.",
        en: "The identifier of the tool this step calls, drawn as a mono tag. Keep it short, such as stripe.query, and leave it out for steps that call no tool.",
      },
      example: "rail",
    },
    {
      id: "error",
      title: { ko: "error", en: "error" },
      description: {
        ko: "실패 이유입니다. failed일 때만 펼쳐지므로 실패한 단계에만 넘깁니다. 접힌 블록도 DOM에 남아 화면 낭독기에는 읽히기 때문입니다.",
        en: "Why the step failed. Reveal it only by passing it on failed steps: the collapsed block stays in the DOM and is still read out.",
      },
      example: "failed",
    },
    {
      id: "onRetry",
      title: { ko: "onRetry", en: "onRetry" },
      description: {
        ko: "오류 블록의 Retry from here 버튼이 부르는 함수입니다. failed가 아니면 버튼에 inert가 붙어 눌리지 않습니다.",
        en: "Called by the Retry from here button in the error block. Outside the failed state the button is inert and cannot be pressed.",
      },
      example: "failed",
    },
    {
      id: "last",
      title: { ko: "last", en: "last" },
      description: {
        ko: "마지막 단계에서 레일을 감춥니다. 계획의 끝에서 선이 허공으로 이어지지 않게 하려면 마지막 단계에 반드시 넘깁니다.",
        en: "Hides the rail under the final step. Pass it on the last step so the line does not run into empty space.",
      },
      example: "rail",
    },
  ],
  guidelines: [
    {
      id: "last-on-the-final-step",
      title: { ko: "마지막 단계에는 last", en: "Mark the final step" },
      body: {
        ko: "레일은 다음 단계로 이어지도록 그려지므로, 마지막 단계에도 last를 넘기지 않으면 계획 아래로 선이 남습니다. 단계를 하나 더 붙일 때는 앞 단계에서 last를 뺍니다.",
        en: "The rail is drawn to reach the next step, so leaving last off the final one leaves a line hanging below the plan. Remove last from the previous step when you append another.",
      },
      do: {
        ko: "계획의 마지막 PlanStep에 last를 넘깁니다.",
        en: "Pass last on the closing PlanStep.",
      },
      dont: {
        ko: "모든 단계에 last를 넘겨 사이 레일을 모두 지우지 않습니다.",
        en: "Do not pass last on every step and erase the rails between them.",
      },
      example: "rail",
    },
    {
      id: "plan-card-for-the-shell",
      title: { ko: "카드가 필요하면 Plan Card", en: "Wrap in Plan Card" },
      body: {
        ko: "Plan Step은 레일과 줄만 그립니다. 제목, 단계 수, 상태 바닥글이 있는 카드가 필요하면 Plan Card 안에 단계를 쌓습니다. 단계를 카드 없이 늘어놓아도 되지만, 그때는 계획의 이름과 진행 상황을 다른 곳에서 보여 줘야 합니다.",
        en: "Plan Step draws only the rail and the row. When the plan needs a title, a step count and a status footer, stack steps inside Plan Card. Steps can stand alone, but then the plan's name and progress must live elsewhere.",
      },
      do: {
        ko: "계획의 이름과 상태 바닥글이 필요하면 PlanCard로 감쌉니다.",
        en: "Wrap in PlanCard when the plan needs a name and a status footer.",
      },
      dont: {
        ko: "PlanCard 없이 단계만 늘어놓고 화면 어디에도 진행 상황을 표시하지 않습니다.",
        en: "Do not show bare steps with progress reported nowhere.",
      },
      example: "failed",
    },
    {
      id: "error-on-failed-only",
      title: { ko: "오류는 실패한 단계에만", en: "Errors belong to failed steps" },
      body: {
        ko: "오류 블록은 접혀 있어도 DOM에 남습니다. 아직 실패하지 않은 단계에 error를 미리 넘기면 화면에는 보이지 않지만 화면 낭독기는 그 문장을 읽습니다. error와 onRetry는 그 단계가 failed가 된 뒤에 넘깁니다.",
        en: "The error block stays in the DOM while collapsed. Passing error on a step that has not failed hides it visually but still exposes the sentence to screen readers. Pass error and onRetry once the step is failed.",
      },
      do: {
        ko: "status가 failed일 때만 error와 onRetry를 넘깁니다.",
        en: "Pass error and onRetry only while status is failed.",
      },
      dont: {
        ko: "모든 단계에 미리 오류 문장을 넣어 두지 않습니다.",
        en: "Do not preload an error sentence onto every step.",
      },
      example: "failed",
    },
    {
      id: "tool-identifiers",
      title: { ko: "tool에는 식별자를 적습니다", en: "Put identifiers in tool" },
      body: {
        ko: "도구 태그는 mono 글꼴의 작은 태그입니다. 화면에 보이는 도구 이름이 아니라 호출 식별자를 적어 로그와 대조할 수 있게 하고, 도구가 없는 단계에는 태그를 만들지 않습니다.",
        en: "The tool tag is a small mono tag. Put the call identifier there rather than the product name, so it can be matched against logs, and skip the tag on steps that call no tool.",
      },
      do: {
        ko: "\"stripe.query\"처럼 호출 이름을 적습니다.",
        en: "Write the call name, such as \"stripe.query\".",
      },
      dont: {
        ko: "\"Stripe 대시보드 열기\"처럼 문장을 넣지 않습니다.",
        en: "Do not put a sentence like \"Open the Stripe dashboard\" there.",
      },
      example: "rail",
    },
  ],
  specification: [
    {
      id: "marker",
      title: { ko: "표식과 레일", en: "Marker and rail" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름이거나 클래스가 정한 리터럴입니다.",
        en: "Values are the token utility names in the component classes, or the literal the class sets.",
      },
      rows: [
        { state: "default", slot: "Marker", property: "size", value: "24px" },
        { state: "default", slot: "Marker", property: "radius", value: "rounded-md" },
        { state: "default", slot: "Marker", property: "font", value: "text-label-sm" },
        { state: "done", slot: "Marker", property: "background", value: "bg-status-live" },
        { state: "done", slot: "Marker", property: "text color", value: "text-interactive-on-primary" },
        { state: "running", slot: "Marker", property: "background", value: "bg-bg-subtle" },
        { state: "failed", slot: "Marker", property: "background", value: "bg-bg-danger" },
        { state: "failed", slot: "Marker", property: "text color", value: "text-text-danger" },
        { state: "pending", slot: "Marker", property: "border", value: "1px border-border-default" },
        { state: "pending", slot: "Marker", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Rail", property: "width", value: "2px" },
        { state: "default", slot: "Rail", property: "radius", value: "1px" },
        { state: "done", slot: "Rail", property: "background", value: "bg-status-live" },
        { state: "running, failed, pending", slot: "Rail", property: "background", value: "bg-border-default" },
        {
          state: "any change",
          slot: "Marker",
          property: "motion",
          value: "animate-pop-in",
          note: {
            ko: "표식 안의 글리프가 status를 key로 다시 pop-in 합니다.",
            en: "The glyph inside the marker is keyed by status, so it pops in again on each change.",
          },
        },
        { state: "any change", slot: "Marker, Rail", property: "motion", value: "motion-colors" },
      ],
    },
    {
      id: "content",
      title: { ko: "내용", en: "Content" },
      rows: [
        { state: "default", slot: "Row", property: "gap", value: "14px" },
        { state: "default", slot: "Content column", property: "padding", value: "pt-0.5 pb-4.5" },
        { state: "default", slot: "Title", property: "font", value: "text-label-lg" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "pending", slot: "Title", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Elapsed", property: "font", value: "text-caption" },
        { state: "default", slot: "Elapsed", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Description", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Tool tag", property: "background", value: "bg-bg-subtle" },
        { state: "default", slot: "Tool tag", property: "radius", value: "rounded-xs" },
        { state: "default", slot: "Tool tag", property: "padding", value: "px-2 py-0.5" },
        { state: "default", slot: "Tool tag", property: "font", value: "font-mono text-label-md" },
        { state: "failed", slot: "Error text", property: "font", value: "text-body-sm" },
        { state: "failed", slot: "Error text", property: "text color", value: "text-text-danger" },
        { state: "failed", slot: "Retry button", property: "height", value: "30px" },
        { state: "failed", slot: "Retry button", property: "background", value: "bg-overlay-ink-6" },
        { state: "failed", slot: "Retry button", property: "font", value: "text-label-sm" },
        { state: "failed · hover", slot: "Retry button", property: "background", value: "bg-overlay-ink-10" },
        { state: "failed · focus-visible", slot: "Retry button", property: "outline", value: "2px outline-text-brand" },
      ],
    },
  ],
  examples: [
    {
      id: "rail",
      title: { ko: "레일 위의 네 상태", en: "Four states on the rail" },
      description: {
        ko: "done, running, pending 두 개를 이어 놓고 마지막에 last를 넘겼습니다. 끝난 단계까지 레일이 sky로 채워집니다.",
        en: "Done, running and two pending steps in order, with last on the final one. The rail fills sky up to the finished step.",
      },
    },
    {
      id: "failed",
      title: { ko: "실패한 단계", en: "Failed step" },
      description: {
        ko: "가운데 단계가 실패해 느낌표 표식과 오류 블록, Retry from here 버튼이 펼쳐졌습니다.",
        en: "A failed step in the middle, with its exclamation marker, error block and Retry from here button revealed.",
      },
    },
    {
      id: "minimal",
      title: { ko: "제목만 있는 단계", en: "Title-only steps" },
      description: {
        ko: "status, index, title만 넘긴 단계입니다. 설명과 도구, 시간이 없어도 레일과 순서는 그대로 읽힙니다.",
        en: "Steps given only status, index and title. Without a description, tool or time, the rail still carries the order.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "pending 단계의 번호와 failed 단계의 느낌표는 표식 안의 글자로 읽힙니다. 단계 순서를 말로 알려 주므로 제목에 번호를 다시 붙이지 않아도 됩니다.",
        en: "The pending number and the failed exclamation are read as the marker's text, which states the order, so the title needs no number of its own.",
      },
      {
        ko: "오류 블록은 접혀 있어도 DOM에 남습니다. Retry from here 버튼에는 실패가 아닐 때 inert가 붙지만 오류 문장은 계속 읽히므로, error는 실패한 단계에만 넘깁니다.",
        en: "The error block stays in the DOM while collapsed. The retry button is inert outside the failed state, but the sentence is still read, so pass error only on failed steps.",
      },
      {
        ko: "레일과 표식은 장식이 아니라 상태를 담고 있습니다. 표식의 글리프가 체크, 스피너, 느낌표, 번호로 바뀌므로 색을 구별하지 못해도 상태를 알 수 있습니다.",
        en: "The rail and marker carry state rather than decoration: the glyph becomes a check, spinner, exclamation or number, so the state is legible without color.",
      },
      {
        ko: "동작 줄이기를 켜면 표식의 pop-in과 색 전환이 한 프레임 뒤 멈추고, 오류 블록도 즉시 펼쳐집니다.",
        en: "Under reduced motion the marker pop-in and color transitions stop after one frame and the error block opens instantly.",
      },
    ],
    keyboard: [
      { keys: ["Tab"], action: { ko: "실패한 단계의 Retry from here로 이동합니다.", en: "Moves to Retry from here on a failed step." } },
      { keys: ["Enter"], action: { ko: "Retry from here를 실행합니다.", en: "Runs Retry from here." } },
      { keys: ["Space"], action: { ko: "Retry from here를 실행합니다.", en: "Runs Retry from here." } },
    ],
  },
};
