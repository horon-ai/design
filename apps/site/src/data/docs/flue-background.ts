/**
 * Reference doc for `FlueBackground`, written against
 * `packages/react/src/components/flue-background.tsx` and
 * `packages/flutter/lib/src/glass/flue_background.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "flue-background",
  anatomy: {
    description: {
      ko: "FlueBackground는 화면 뒤에서 연기가 피어오르는 하늘을 그립니다. WebGL2 삼각형 하나에 프래그먼트 셰이더 하나로 칠하고, 그 위에 색조를 얹습니다.",
      en: "FlueBackground paints a sky of rising smoke behind a screen: one WebGL2 triangle and one fragment shader, with a tint laid over the result.",
    },
    parts: [
      {
        name: "Wrapper",
        slot: "div",
        description: {
          ko: "부모를 가득 채우는 래퍼입니다. absolute inset-0 -z-10에 pointer-events-none이고 aria-hidden이라 입력도 낭독도 가로채지 않습니다. 바탕색은 bgColor로 칠하며 WebGL2가 없을 때의 대체 색이기도 합니다.",
          en: "A wrapper that fills its parent: absolute inset-0 -z-10, pointer-events-none and aria-hidden, so it takes neither input nor reading order. Its background is bgColor, which doubles as the fallback when WebGL2 is missing.",
        },
      },
      {
        name: "Canvas",
        slot: "canvas",
        description: {
          ko: "셰이더를 그리는 캔버스입니다. 픽셀 비율은 maxDpr로 제한하고, 화면 밖으로 나가거나 탭이 숨겨지면 그리기를 멈춥니다.",
          en: "The canvas the shader draws into. Its pixel ratio is capped by maxDpr, and drawing pauses while it is off-screen or the tab is hidden.",
        },
      },
      {
        name: "Tint",
        slot: "div",
        description: {
          ko: "연기 위에 덮는 색조 레이어입니다. 변형마다 기본값이 다르고 tintClassName으로 바꿉니다.",
          en: "A tint laid over the smoke. Each variant has its own default, and tintClassName replaces it.",
        },
      },
    ],
  },
  properties: [
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "연기가 놓이는 자리입니다. 같은 셰이더에 배치별 조정값과 색조를 얹어 속도, 폭, 농도를 바꿉니다.",
        en: "Where the smoke is drawn. Each place layers its own tuning and tint over the same shader, changing speed, width and density.",
      },
      values: [
        {
          name: "default",
          description: {
            ko: "움직임을 덮어쓰지 않는 기본값입니다. 밝은 모드에서는 regular 유리 색조를 얹고 어두운 모드에서는 색조를 얹지 않습니다.",
            en: "The base with no motion overrides. Light mode lays a regular glass tint; dark mode lays none.",
          },
        },
        {
          name: "sidebar",
          description: {
            ko: "사이드바 유리 아래에 까는 좁고 긴 세로 column입니다. 유리가 세부를 흐리므로 연기를 더 느리고 크게 그리고 아래쪽에 모읍니다. 밝은 모드에서는 두꺼운 유리를 스스로 덮어 위쪽 라벨의 대비를 지킵니다.",
            en: "A narrow, tall column under the sidebar's glass. The glass blurs detail away, so the smoke is slower, larger and kept low in the column. Light mode lays thick glass over it to keep the labels at the top readable.",
          },
        },
        {
          name: "auth",
          description: {
            ko: "로그인 화면 전체를 덮는 변형입니다. 연기가 더 넓고 아래 가운데에서 올라와 가운데 카드를 감싸며, 색조는 얹지 않습니다.",
            en: "The whole sign-in screen. The plume is wider and rises from the bottom centre so it frames the centred card, and no tint is applied.",
          },
        },
      ],
      example: "sidebar",
    },
    {
      id: "config",
      title: { ko: "config", en: "config" },
      description: {
        ko: "변형의 조정값 위에 덮는 셰이더 값입니다. 색 다섯 개와 움직임 값으로 이루어지며, 바꾸면 프로그램을 다시 만듭니다.",
        en: "Shader values layered over the variant's tuning: five colors and the motion numbers. Changing it rebuilds the program.",
      },
      example: "default",
    },
    {
      id: "tintClassName",
      title: { ko: "tintClassName", en: "tintClassName" },
      description: {
        ko: "연기 위 색조의 클래스를 바꿉니다. 변형의 기본 색조를 그대로 두려면 넘기지 않습니다.",
        en: "Replaces the tint classes over the smoke. Leave it out to keep the variant's default tint.",
      },
    },
    {
      id: "cursor",
      title: { ko: "커서 추적", en: "Pointer following" },
      description: {
        ko: "config의 cursor는 셰이더 uniform이 아니라 엔진 값입니다. 0이면 느린 가상 포인터가 두 개의 사인파로 스스로 흔들리고, 1이면 실제 포인터를 따라갑니다. 기본값은 0입니다.",
        en: "config.cursor is an engine key rather than a shader uniform. At 0 a slow virtual pointer wanders on two sines; at 1 the plume follows the real pointer. The default is 0.",
      },
      example: "tuning",
    },
  ],
  guidelines: [
    {
      id: "parent-must-isolate",
      title: { ko: "부모가 자리를 만들어야 합니다", en: "The parent places it" },
      body: {
        ko: "래퍼는 absolute inset-0 -z-10이므로 부모에 relative와 isolate가 모두 있어야 합니다. relative가 없으면 화면 밖으로 나가고, isolate가 없으면 뒤로 내려가 보이지 않습니다.",
        en: "The wrapper is absolute inset-0 -z-10, so the parent needs both relative and isolate. Without relative it escapes the panel; without isolate it drops behind it.",
      },
      do: {
        ko: "relative isolate overflow-hidden 패널 안에 넣고 내용을 relative로 올립니다.",
        en: "Put it in a relative isolate overflow-hidden panel and lift the content with relative.",
      },
      dont: {
        ko: "정적 부모 안에 그냥 넣지 않습니다.",
        en: "Do not drop it into a static parent.",
      },
      example: "default",
    },
    {
      id: "one-per-screen",
      title: { ko: "화면마다 하나", en: "One per screen" },
      body: {
        ko: "배경은 화면의 바탕입니다. 한 화면에서 여러 개를 켜면 캔버스마다 셰이더가 돌아 비용이 늘고 시선도 갈라집니다. 사이드바와 본문이 나뉜 화면이라면 사이드바 쪽 하나만 씁니다.",
        en: "The background is the screen's ground. Two on one screen mean two shaders running and two competing horizons. On a screen split into sidebar and content, keep one, on the sidebar.",
      },
      example: "sidebar",
    },
    {
      id: "glass-tint",
      title: { ko: "유리 아래에서 대비를 지킵니다", en: "Keep contrast under glass" },
      body: {
        ko: "sidebar 변형은 유리가 세부를 흐리는 만큼 밝은 모드에서 두꺼운 유리를 스스로 덮습니다. 색조를 직접 바꾸면 그 위 텍스트의 대비를 함께 확인해야 합니다.",
        en: "The sidebar variant lays thick glass over the smoke in light mode because the glass blurs detail away. If you replace the tint, check the contrast of the text above it.",
      },
      example: "sidebar",
    },
    {
      id: "motion-budget",
      title: { ko: "동작을 줄인 사용자", en: "Reduced motion" },
      body: {
        ko: "동작 줄이기를 켜면 정지 프레임 하나를 그리고, 페이지를 연 채로 설정을 바꿔도 그 자리에서 멈추거나 다시 움직입니다. 이 처리는 컴포넌트가 하므로 따로 멈추는 코드를 넣지 않습니다.",
        en: "With reduced motion the component draws one still frame, and it freezes or resumes in place if the setting changes while the page is open. The component owns that, so add no pause logic of your own.",
      },
    },
  ],
  specification: [
    {
      id: "variants",
      title: { ko: "변형별 값", en: "Variant values" },
      note: {
        ko: "변형은 FLUE_SKY 또는 FLUE_NIGHT 위에 밝기와 어둡기 조정값을 얹습니다. 아래 값은 그 조정값입니다.",
        en: "A variant layers its light and dark tuning over FLUE_SKY or FLUE_NIGHT. These are the overrides.",
      },
      rows: [
        { state: "default", slot: "Tint", property: "light", value: "bg-glass-regular" },
        { state: "default", slot: "Tint", property: "dark", value: "bg-transparent" },
        { state: "sidebar", slot: "Tint", property: "light", value: "bg-glass-thick" },
        { state: "sidebar", slot: "Tint", property: "dark", value: "bg-transparent" },
        { state: "sidebar", slot: "Shader", property: "speed", value: "0.22" },
        { state: "sidebar", slot: "Shader", property: "smokeScale", value: "1.9" },
        { state: "sidebar", slot: "Shader", property: "density", value: "1.85" },
        { state: "sidebar", slot: "Shader", property: "contrast (light)", value: "1.45" },
        { state: "sidebar", slot: "Shader", property: "contrast (dark)", value: "1.5" },
        { state: "sidebar", slot: "Shader", property: "midpoint", value: "0.8" },
        { state: "sidebar", slot: "Shader", property: "glow (light)", value: "0.3" },
        { state: "sidebar", slot: "Shader", property: "glow (dark)", value: "0.22" },
        { state: "sidebar", slot: "Shader", property: "vignette", value: "0" },
        { state: "auth", slot: "Tint", property: "light and dark", value: "none" },
        { state: "auth", slot: "Shader", property: "width", value: "1.9" },
        { state: "auth", slot: "Shader", property: "spread", value: "1.3" },
        { state: "auth", slot: "Shader", property: "density (light)", value: "1.85" },
        { state: "auth", slot: "Shader", property: "density (dark)", value: "2.0" },
        { state: "auth", slot: "Shader", property: "midpoint (light)", value: "0.8" },
        { state: "auth", slot: "Shader", property: "midpoint (dark)", value: "0.76" },
        { state: "auth", slot: "Shader", property: "glow (light)", value: "0.3" },
        { state: "auth", slot: "Shader", property: "glow (dark)", value: "0.45" },
        { state: "auth", slot: "Shader", property: "vignette (light)", value: "0" },
        { state: "auth", slot: "Shader", property: "vignette (dark)", value: "0.45" },
      ],
    },
    {
      id: "palettes",
      title: { ko: "팔레트", en: "Palettes" },
      note: {
        ko: "FLUE_SKY와 FLUE_NIGHT가 바탕이 되고 변형이 그 위를 조정합니다. FLUE_NIGHT는 색 다섯 개와 glow만 바꿉니다.",
        en: "FLUE_SKY and FLUE_NIGHT are the base each variant tunes. FLUE_NIGHT changes only the five colors and glow.",
      },
      rows: [
        { state: "sky", slot: "FlueConfig", property: "bgColor", value: "#eef3f8" },
        { state: "sky", slot: "FlueConfig", property: "colorA", value: "#e3ecf6" },
        { state: "sky", slot: "FlueConfig", property: "colorB", value: "#c3d7ea" },
        { state: "sky", slot: "FlueConfig", property: "colorC", value: "#7fa3c6" },
        { state: "sky", slot: "FlueConfig", property: "colorD", value: "#1d3c5e" },
        { state: "sky", slot: "FlueConfig", property: "glow", value: "0.53" },
        { state: "night", slot: "FlueConfig", property: "bgColor", value: "#050608" },
        { state: "night", slot: "FlueConfig", property: "colorA", value: "#07090d" },
        { state: "night", slot: "FlueConfig", property: "colorB", value: "#0c1a2c" },
        { state: "night", slot: "FlueConfig", property: "colorC", value: "#1f4a78" },
        { state: "night", slot: "FlueConfig", property: "colorD", value: "#4f8fd0" },
        { state: "night", slot: "FlueConfig", property: "glow", value: "0.35" },
      ],
    },
    {
      id: "engine",
      title: { ko: "렌더링과 상태", en: "Rendering and state" },
      rows: [
        { state: "wrapper", slot: "Wrapper", property: "position", value: "absolute inset-0" },
        { state: "wrapper", slot: "Wrapper", property: "stacking", value: "-z-10" },
        { state: "wrapper", slot: "Wrapper", property: "pointer events", value: "pointer-events-none" },
        { state: "wrapper", slot: "Wrapper", property: "background", value: "settings.bgColor" },
        { state: "context", slot: "Canvas", property: "context", value: "webgl2" },
        {
          state: "no WebGL2",
          slot: "Wrapper",
          property: "fallback",
          value: "bgColor",
          note: {
            ko: "컨텍스트를 얻지 못하거나 이전 실행이 컨텍스트를 잃었으면 평평한 바탕색만 남습니다.",
            en: "If the context cannot be created, or a previous run lost it, only the flat ground color remains.",
          },
        },
        {
          state: "reduced motion",
          slot: "Canvas",
          property: "frame",
          value: "still",
          note: {
            ko: "시계를 12로 두고 프레임 하나만 그립니다.",
            en: "The clock sits at 12 and a single frame is drawn.",
          },
        },
        { state: "pixel ratio", slot: "Canvas", property: "cap", value: "maxDpr" },
        {
          state: "offscreen",
          slot: "Canvas",
          property: "drawing",
          value: "paused",
          note: {
            ko: "IntersectionObserver와 document.hidden이 그리기를 멈춥니다.",
            en: "An IntersectionObserver and document.hidden stop the loop.",
          },
        },
        {
          state: "cursor 0",
          slot: "Shader",
          property: "pointer",
          value: "virtual",
          note: {
            ko: "두 개의 사인파로 천천히 흔들리는 가상 포인터를 씁니다.",
            en: "A virtual pointer sways slowly on two incommensurate sines.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "default",
      title: { ko: "기본 배경", en: "Default" },
      description: {
        ko: "패널 하나를 연기로 채우고 내용을 그 위에 올립니다. 부모는 relative isolate입니다.",
        en: "One panel filled with smoke and content lifted above it. The parent is relative isolate.",
      },
    },
    {
      id: "sidebar",
      title: { ko: "사이드바", en: "Sidebar" },
      description: {
        ko: "좁은 세로 column에 사이드바 변형을 깔고 유리를 얹었습니다. 연기가 아래쪽에 모여 위쪽 라벨이 조용한 자리에 앉습니다.",
        en: "The sidebar variant in a narrow column under glass. The smoke gathers low so the labels at the top sit on the quiet part.",
      },
    },
    {
      id: "tuning",
      title: { ko: "값 조정", en: "Tuning" },
      description: {
        ko: "config로 속도와 커서 추적을 바꿉니다. cursor를 1로 두면 연기가 실제 포인터를 따라갑니다.",
        en: "config changes the speed and turns on pointer following, which lets the plume lean toward the real pointer.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "래퍼는 aria-hidden이고 pointer-events-none입니다. 배경은 장식이며 낭독되지 않고 입력도 가로채지 않습니다.",
        en: "The wrapper is aria-hidden and pointer-events-none. The background is decoration: it is never announced and never takes input.",
      },
      {
        ko: "동작 줄이기를 켠 사용자에게는 정지 프레임 하나만 그립니다. OS 설정이 바뀌면 페이지를 새로 고치지 않아도 그 자리에서 반영됩니다.",
        en: "A user with reduced motion gets a single still frame, and the change applies in place if the OS setting flips.",
      },
      {
        ko: "연기 위 텍스트의 대비는 배경이 아니라 변형과 색조가 책임집니다. 밝은 모드의 sidebar처럼 색조를 덮는 이유가 여기에 있습니다.",
        en: "Contrast over the smoke is the variant's and tint's responsibility, not the background's. That is why the light sidebar variant lays thick glass over it.",
      },
    ],
    keyboard: [],
  },
};
