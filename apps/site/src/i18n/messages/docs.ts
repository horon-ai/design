/**
 * Messages owned by the docs layout: the section sidebar, the page table of
 * contents, and the breadcrumb. Data-module labels (sections, groups, component
 * names) stay in `src/data`; this file holds only the layout's own chrome.
 */
import { defineMessages } from "@/i18n";

export const docsMessages = defineMessages({
  /** Visible label above the page table of contents. */
  tocLabel: { ko: "목차", en: "On this page" },
  /** Accessible name of the table of contents navigation. */
  tocNav: { ko: "이 페이지 목차", en: "Sections on this page" },
  /** Accessible name of the section sidebar. */
  sectionNav: { ko: "섹션 목차", en: "Section navigation" },
  /** Accessible name of the breadcrumb navigation. */
  breadcrumb: { ko: "현재 위치", en: "Breadcrumb" },
  /** Sidebar entry that opens the component catalog index. */
  overview: { ko: "개요", en: "Overview" },
  /** Label of the block that lists the top-level docs pages. */
  docs: { ko: "문서", en: "Docs" },
});
