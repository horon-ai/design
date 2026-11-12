/**
 * Reference doc for `FileDrop`, written against
 * `packages/react/src/components/file-drop.tsx` and
 * `packages/flutter/lib/src/components/file_drop.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "file-drop",
  anatomy: {
    description: {
      ko: "FileDrop은 파일을 끌어다 놓거나 눌러서 고르는 점선 영역입니다. label 요소 하나가 점선 테두리와 안쪽 아이콘·문구를 그리고, 그 안에 화면에서 감춘 파일 input이 들어 있습니다.",
      en: "A FileDrop is a dashed area that takes dropped files or a click. One label element draws the dashed edge and the icon and text inside it, with a file input hidden within.",
    },
    parts: [
      {
        name: "Target",
        slot: "label",
        description: {
          ko: "점선 테두리를 두른 실제 label입니다. 드래그와 클릭을 받고, 포커스 테두리는 안쪽 input의 포커스를 감지해 그립니다. 최대 550px이며 부모보다 넓어지지 않습니다.",
          en: "The real label that carries the dashed border. It takes drops and clicks, and draws its focus ring from the input inside. It caps at 550px and never grows past its parent.",
        },
      },
      {
        name: "Input",
        slot: "input",
        description: {
          ko: "화면에서 감춘 file input입니다. label이 가리키므로 클릭하면 브라우저 파일 선택기가 열리고, 고른 파일은 onFiles로 전달됩니다.",
          en: "The visually hidden file input. The label points at it, so a click opens the browser picker and the chosen files reach onFiles.",
        },
      },
      {
        name: "Icon",
        slot: "UploadSimple",
        description: {
          ko: "문구 앞의 16px 업로드 아이콘입니다. 업로드 중에는 Spinner로 바뀝니다.",
          en: "The 16px upload icon before the text. While uploading it is replaced by a Spinner.",
        },
      },
      {
        name: "Label text",
        slot: "label",
        description: {
          ko: "영역 가운데 놓이는 문구입니다. 기본값은 \"Drop files here or click to upload\"이며, 업로드 중에는 60% 불투명도로 흐려집니다.",
          en: "The text centered in the target. It defaults to \"Drop files here or click to upload\" and fades to 60% opacity while uploading.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "영역의 바탕입니다. 놓이는 면에 맞춰 고르고, 점선 테두리는 두 경우 모두 유지됩니다.",
        en: "Fill of the target. Match it to where the target sits; the dashed border stays in both cases.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "올라온 표면 바탕으로 채우고, 드래그 중에는 바탕이 subtle로 바뀝니다. 카드나 페이지 위에 놓습니다. 기본값입니다.",
            en: "Filled with the raised surface, and the fill shifts to subtle while dragging. For a card or a page. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil-drop 바탕을 씁니다. 점선 테두리가 유일한 윤곽이고, 이미지나 유리 패널 위에 띄울 때 씁니다.",
            en: "The veil-drop fill. The dashed edge is its only outline, for floating over imagery or a glass panel.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "uploading",
      title: { ko: "uploading", en: "uploading" },
      description: {
        ko: "참이면 아이콘이 Spinner로 바뀌고 문구가 흐려지며 input이 비활성됩니다. 그동안 들어온 드롭은 무시하고 aria-busy도 함께 켭니다. 전송이 끝날 때까지 이 값을 유지합니다.",
        en: "When true the icon becomes a Spinner, the text fades and the input is disabled. Drops that arrive meanwhile are ignored and aria-busy turns on. Hold this value until the transfer finishes.",
      },
      example: "states",
    },
    {
      id: "rejected",
      title: { ko: "rejected", en: "rejected" },
      description: {
        ko: "참이면 테두리와 문구가 위험 색으로 바뀌고 안쪽에 1px 위험 테두리가 한 겹 더 그려집니다. 형식이 맞지 않거나 너무 큰 파일을 거절했을 때 씁니다.",
        en: "When true the border and text turn to the danger color and a 1px danger rim is drawn inside. Use it after rejecting a file for its type or size.",
      },
      example: "states",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "영역 가운데의 문구입니다. 무엇을 놓을 수 있는지와 그것이 업로드로 이어진다는 것을 함께 적습니다. 상태에 따라 바꿔 \"Uploading report.pdf\"나 \"That file type isn't supported\"처럼 지금 일어나는 일을 말하게 합니다.",
        en: "The text in the center. Say both what can be dropped and that it will be uploaded, and swap it with the state so it reports what is happening, as in \"Uploading report.pdf\" or \"That file type isn't supported\".",
      },
      example: "states",
    },
    {
      id: "onFiles",
      title: { ko: "onFiles", en: "onFiles" },
      description: {
        ko: "드롭과 파일 선택 양쪽에서 고른 순서대로 File 배열로 호출됩니다. 실제 업로드는 호출하는 쪽이 맡고, 끝나면 uploading을 다시 내립니다.",
        en: "Called with a File array in pick order, from both a drop and the native picker. The caller performs the upload and clears uploading when it ends.",
      },
    },
  ],
  guidelines: [
    {
      id: "always-offer-the-click",
      title: { ko: "끌어다 놓기만 요구하지 않습니다", en: "Never rely on dragging alone" },
      body: {
        ko: "터치 화면과 키보드에는 끌어다 놓기가 없습니다. FileDrop은 label과 감춘 input으로 클릭과 키보드 선택을 함께 제공하므로, 안내 문구에도 \"click to upload\"처럼 두 방법을 함께 적습니다. 드롭만 가능한 영역으로 만들지 않습니다.",
        en: "Touch screens and keyboards have no drag. The label and hidden input already give a click and a keyboard path, so the text names both, as in \"click to upload\". Never make a drop-only zone.",
      },
      do: {
        ko: "\"Drop files here or click to upload\"로 두 방법을 알립니다.",
        en: "Say both paths: \"Drop files here or click to upload\".",
      },
      dont: {
        ko: "\"Drag files here\"만 적지 않습니다.",
        en: "Do not write only \"Drag files here\".",
      },
      example: "basic",
    },
    {
      id: "state-belongs-to-the-caller",
      title: { ko: "상태는 호출하는 쪽이 정합니다", en: "The caller owns the state" },
      body: {
        ko: "FileDrop은 uploading과 rejected를 스스로 판단하지 않습니다. 업로드 시작과 끝, 거절 판정은 전부 호출하는 쪽이 하고 컴포넌트에는 결과만 넘깁니다. 업로드가 끝난 뒤 rejected를 내리지 않으면 거절 표시가 남습니다.",
        en: "The component decides neither uploading nor rejected on its own. Start, finish and rejection all belong to the caller, which passes only the outcome. Forget to clear rejected after the upload and the danger rim stays.",
      },
      example: "states",
    },
    {
      id: "use-file-drop-versus-input",
      title: { ko: "한두 파일은 FileDrop, 여러 개는 목록과 함께", en: "One or two files, or a list" },
      body: {
        ko: "FileDrop은 파일을 하나 받는 자리에 맞습니다. 여러 파일을 받아 각각 진행률과 삭제를 보여 줘야 한다면 FileDrop을 첫 진입점으로 두고, 고른 파일은 별도 목록으로 나눠 보여 줍니다. 영역 안에 파일 목록을 겹쳐 넣으면 드롭 대상이 좁아집니다.",
        en: "A FileDrop fits one file per slot. When several files need their own progress and remove buttons, keep the target as the entry point and show the chosen files in a separate list; stacking the list inside the target narrows the drop area.",
      },
      example: "basic",
    },
    {
      id: "glass-over-imagery",
      title: { ko: "glass는 뒤가 비치는 면에서만", en: "Glass only where something shows through" },
      body: {
        ko: "glass 바탕은 점선 옆에 바탕색이 없으므로 뒤에 이미지나 유리가 있어야 영역이 구분됩니다. 불투명한 카드 안에서는 solid를 씁니다.",
        en: "The glass fill has no color of its own beyond the dashed edge, so the target reads as an area only over imagery or a glass panel. Inside an opaque card, use solid.",
      },
      example: "surfaces",
    },
  ],
  specification: [
    {
      id: "target",
      title: { ko: "영역", en: "Target" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 괄호 안은 그 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; the parentheses give the pixels they produce.",
      },
      rows: [
        { state: "all", slot: "Target", property: "width", value: "w-full max-w-[550px]" },
        { state: "all", slot: "Target", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Target", property: "border", value: "1.5px dashed border-border-dashed" },
        { state: "all", slot: "Target", property: "padding", value: "px-4 py-3" },
        { state: "all", slot: "Target", property: "gap", value: "gap-2" },
        { state: "all", slot: "Label text", property: "font", value: "text-label-md" },
        { state: "all", slot: "Label text", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Icon", property: "size", value: "size-4 (16px)" },
        { state: "all", slot: "Icon · uploading", property: "size", value: "Spinner size 16" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "solid", slot: "Target", property: "background", value: "bg-bg-surface" },
        { state: "glass", slot: "Target", property: "background", value: "veil-drop" },
        { state: "dragging", slot: "Target", property: "border", value: "border-border-brand" },
        { state: "dragging", slot: "Target", property: "inner rim", value: "inset 0 0 0 1px text-brand" },
        { state: "dragging · solid", slot: "Target", property: "background", value: "bg-bg-subtle" },
        { state: "rejected", slot: "Target", property: "border", value: "border-border-danger" },
        { state: "rejected", slot: "Target", property: "text color", value: "text-text-danger" },
        { state: "rejected", slot: "Target", property: "inner rim", value: "inset 0 0 0 1px border-danger" },
        { state: "uploading", slot: "Label text", property: "opacity", value: "60%" },
        { state: "disabled", slot: "Target", property: "opacity", value: "40%" },
        { state: "disabled", slot: "Target", property: "cursor", value: "not-allowed" },
        { state: "focus-visible", slot: "Target", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Target", property: "outline offset", value: "2px" },
        { state: "all", slot: "Target", property: "transition", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "기본 문구를 그대로 쓴 영역 하나입니다. 클릭하면 파일 선택기가 열립니다.",
        en: "One target with its default text. A click opens the file picker.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "기본, 업로드 중, 거절, 비활성 네 모습을 세로로 놓았습니다.",
        en: "The four looks stacked: default, uploading, rejected and disabled.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "surface", en: "Surfaces" },
      description: {
        ko: "solid 영역과, 배경 위에 띄운 glass 영역을 나란히 두었습니다.",
        en: "A solid target beside a glass one floating over a backdrop.",
      },
    },
    {
      id: "accepted-types",
      title: { ko: "받는 형식", en: "Accepted types" },
      description: {
        ko: "accept와 multiple로 받는 형식을 좁히고 여러 개를 받는 영역입니다.",
        en: "A target narrowed to certain types through accept, and taking more than one file through multiple.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "영역은 label이고 그 안의 input을 가리키므로, 클릭뿐 아니라 Tab으로 input에 포커스가 가면 label에 2px outline이 그려집니다. input 자체는 화면에서 감춰져 있어 보이지 않습니다.",
        en: "The target is a label pointing at the input inside, so focus reaching the input by Tab draws a 2px outline on the label. The input itself stays visually hidden.",
      },
      {
        ko: "input은 화면에서 감춘 것이지 aria-hidden이 아니므로 스크린 리더는 파일 선택 컨트롤로 읽고, Enter나 Space로 파일 선택기를 엽니다. label 문구가 그 컨트롤의 이름이 됩니다.",
        en: "The input is visually hidden, not aria-hidden, so a screen reader reads a file picker and Enter or Space opens it. The label text is that control's name.",
      },
      {
        ko: "업로드 중에는 aria-busy가 켜지고 문구를 \"Uploading report.pdf\"처럼 바꿔 진행 중임을 전달합니다. 아이콘만 Spinner로 바뀌면 화면을 보지 않는 사용자에게는 아무 변화도 없습니다.",
        en: "While uploading, aria-busy turns on and the text changes to something like \"Uploading report.pdf\". A spinner on its own tells a user who cannot see the screen nothing.",
      },
      {
        ko: "거절은 색만으로 알리지 않습니다. 테두리와 문구 색이 위험으로 바뀌는 것과 함께 label 문구를 \"That file type isn't supported\"처럼 바꿔 이유를 말합니다.",
        en: "Rejection never rests on color. Along with the danger border and text, the label says why, as in \"That file type isn't supported\".",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "감춘 파일 input으로 포커스를 옮기고 영역에 포커스 테두리를 그립니다.", en: "Moves focus to the hidden file input and draws the ring on the target." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "브라우저 파일 선택기를 엽니다.", en: "Opens the browser file picker." },
      },
    ],
  },
};
