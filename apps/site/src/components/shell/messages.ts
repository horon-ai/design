import { defineMessages } from "@/i18n";

/**
 * Strings owned by the site chrome.
 *
 * The shared i18n contract files every module's messages under
 * `src/i18n/messages/<module>.ts`; that directory belongs to the i18n node, so
 * this node keeps its messages next to the components it renders. Moving this
 * file to `src/i18n/messages/shell.ts` later only changes the import path.
 */
export const shellMessages = defineMessages({
  home: {
    ko: "Horon Design System 홈",
    en: "Horon Design System home",
  },
  navLabel: {
    ko: "주요 섹션",
    en: "Main sections",
  },
  menu: {
    ko: "메뉴",
    en: "Menu",
  },
  search: {
    ko: "검색",
    en: "Search",
  },
  searchPlaceholder: {
    ko: "컴포넌트와 문서 검색",
    en: "Search components and docs",
  },
  searchEmpty: {
    ko: "검색 결과가 없습니다",
    en: "No results found",
  },
  searchMove: {
    ko: "이동",
    en: "Move",
  },
  searchOpen: {
    ko: "열기",
    en: "Open",
  },
  theme: {
    ko: "테마 전환",
    en: "Switch theme",
  },
  language: {
    ko: "언어",
    en: "Language",
  },
  footerNav: {
    ko: "바닥글 링크",
    en: "Footer links",
  },
  footerMenu: {
    ko: "Menu",
    en: "Menu",
  },
  footerMore: {
    ko: "More",
    en: "More",
  },
  footerBlurb: {
    ko: "Horon은 데이터를 이해하는 데서 멈추지 않고 실행과 결과까지 이어 가는 AI입니다. 이곳은 Horon 화면을 만드는 디자인 시스템입니다.",
    en: "Horon is AI that carries data past understanding into execution and results. This is the design system behind its screens.",
  },
  brandLine: {
    ko: "Horus × ON",
    en: "Horus × ON",
  },
  footerAvailability: {
    ko: "macOS에서 쓸 수 있습니다. Windows와 Linux는 곧 나옵니다.",
    en: "Available on macOS · Windows and Linux soon",
  },
});
