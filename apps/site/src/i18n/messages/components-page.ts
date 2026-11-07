import { defineMessages } from "@/i18n";

/** Copy for `/components/[slug]`: section headings, the missing-preview state, tables and paging. */
export const componentPageMessages = defineMessages({
  breadcrumbComponents: { ko: "Components", en: "Components" },
  previewTab: { ko: "Preview", en: "Preview" },
  codeTab: { ko: "Code", en: "Code" },
  previewMissingTitle: { ko: "미리보기 없음", en: "No preview" },
  previewMissingBody: {
    ko: "이 컴포넌트는 라이브 프리뷰를 아직 준비하지 않았습니다. Code 탭의 예시를 참고하세요.",
    en: "This component has no live preview yet. Use the example in the Code tab.",
  },
  previous: { ko: "← 이전", en: "← Previous" },
  next: { ko: "다음 →", en: "Next →" },
  /** Accessible name of the previous/next navigation. Static markup uses the Korean string. */
  paging: { ko: "컴포넌트 이동", en: "Component paging" },

  /** Section headings. Their ids are the English anchor names. */
  sectionInstallation: { ko: "설치", en: "Installation" },
  sectionAnatomy: { ko: "구성", en: "Anatomy" },
  sectionProperties: { ko: "속성", en: "Properties" },
  sectionGuidelines: { ko: "사용 지침", en: "Guidelines" },
  sectionSpecification: { ko: "사양", en: "Specification" },
  sectionProps: { ko: "Props", en: "Props" },
  sectionExamples: { ko: "예시", en: "Examples" },
  sectionAccessibility: { ko: "접근성", en: "Accessibility" },

  installPackage: { ko: "패키지를 설치합니다.", en: "Install the package." },
  installImport: { ko: "컴포넌트를 가져옵니다.", en: "Import the component." },
  installLynx: {
    ko: "Lynx 앱에서는 @horon-ai/lynx를 설치하고 같은 이름으로 가져옵니다.",
    en: "In a Lynx app, install @horon-ai/lynx and import the same names.",
  },

  /** Table headers and paired-card labels. */
  stateHeader: { ko: "상태", en: "State" },
  slotHeader: { ko: "슬롯", en: "Slot" },
  propertyHeader: { ko: "속성", en: "Property" },
  valueHeader: { ko: "값", en: "Value" },
  propHeader: { ko: "속성", en: "Prop" },
  typeHeader: { ko: "타입", en: "Type" },
  defaultHeader: { ko: "기본값", en: "Default" },
  descriptionHeader: { ko: "설명", en: "Description" },
  keyHeader: { ko: "키", en: "Key" },
  actionHeader: { ko: "동작", en: "Action" },
  doLabel: { ko: "권장", en: "Do" },
  dontLabel: { ko: "지양", en: "Don't" },
  /** Link from a property or guideline to its live example further down. */
  seeExample: { ko: "예시 보기", en: "See example" },
  patternPrefix: { ko: "따르는 패턴:", en: "Follows the pattern:" },
});
