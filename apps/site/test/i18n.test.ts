import { describe, expect, test } from "bun:test";

import {
  defaultLocale,
  defineMessages,
  LOCALE_EVENT,
  LOCALE_STORAGE_KEY,
  localeLabels,
  locales,
  pick,
  readLocale,
} from "../src/i18n/index";
import {
  applyStoredLocale,
  listenForLocaleChanges,
  type LocaleDocument,
  LOCALE_RUNTIME_SCRIPT,
  LOCALE_TITLE_META_NAME,
  PREPAINT_SCRIPT,
} from "../src/i18n/prepaint";

const messages = defineMessages({
  greeting: { ko: "안녕하세요", en: "Hello" },
  save: { ko: "저장", en: "Save" },
});

interface FakePageOptions {
  title?: string;
  enTitle?: string | null;
  locale?: string;
  titleKo?: string;
}

function createPage(options: FakePageOptions = {}) {
  const dataset: Record<string, string> = {};
  if (options.locale !== undefined) {
    dataset.locale = options.locale;
  }
  if (options.titleKo !== undefined) {
    dataset.titleKo = options.titleKo;
  }
  const html = { lang: "ko", dataset };
  const listeners: { type: string; listener: () => void }[] = [];
  const enTitle = options.enTitle ?? null;
  const doc: LocaleDocument = {
    title: options.title ?? "HORON 디자인 시스템",
    documentElement: html,
    querySelector: (selector: string) => {
      if (enTitle === null || selector !== `meta[name="${LOCALE_TITLE_META_NAME}"]`) {
        return null;
      }
      return { getAttribute: (name: string) => (name === "content" ? enTitle : null) };
    },
    addEventListener: (type: string, listener: () => void) => {
      listeners.push({ type, listener });
    },
  };
  const dispatch = (type: string) => {
    for (const { type: registered, listener } of listeners) {
      if (registered === type) {
        listener();
      }
    }
  };
  return { doc, html, dataset, dispatch };
}

describe("i18n contract", () => {
  test("ships Korean and English with Korean as the default", () => {
    expect(locales).toEqual(["ko", "en"]);
    expect(defaultLocale).toBe("ko");
    expect(localeLabels).toEqual({ ko: "한국어", en: "English" });
  });

  test("pick returns the phrase for the requested locale", () => {
    expect(pick(messages.greeting, "ko")).toBe("안녕하세요");
    expect(pick(messages.greeting, "en")).toBe("Hello");
  });

  test("pick falls back to Korean for a locale outside the union", () => {
    expect(pick(messages.save, "fr")).toBe("저장");
  });

  test("defineMessages keeps every key and both locales", () => {
    expect(Object.keys(messages)).toEqual(["greeting", "save"]);
    expect(messages.save).toEqual({ ko: "저장", en: "Save" });
  });

  test("readLocale is Korean when there is no document", () => {
    expect(readLocale()).toBe("ko");
  });

  test("storage key and event names are the documented strings", () => {
    expect(LOCALE_STORAGE_KEY).toBe("horon-locale");
    expect(LOCALE_EVENT).toBe("horon:locale");
    expect(LOCALE_TITLE_META_NAME).toBe("horon:title-en");
  });
});

describe("pre-paint script", () => {
  test("keeps Korean when nothing is stored", () => {
    const page = createPage({ title: "HORON 디자인 시스템" });

    applyStoredLocale(page.doc, () => null, LOCALE_TITLE_META_NAME);

    expect(page.html.lang).toBe("ko");
    expect(page.dataset.locale).toBe("ko");
    expect(page.doc.title).toBe("HORON 디자인 시스템");
    expect(page.dataset.titleKo).toBe("HORON 디자인 시스템");
  });

  test("applies English and its title when English is stored", () => {
    const page = createPage({ title: "HORON 디자인 시스템", enTitle: "HORON Design System" });

    applyStoredLocale(page.doc, () => "en", LOCALE_TITLE_META_NAME);

    expect(page.html.lang).toBe("en");
    expect(page.dataset.locale).toBe("en");
    expect(page.doc.title).toBe("HORON Design System");
    expect(page.dataset.titleKo).toBe("HORON 디자인 시스템");
  });

  test("keeps the Korean title when the page has no English title", () => {
    const page = createPage({ title: "HORON 디자인 시스템" });

    applyStoredLocale(page.doc, () => "en", LOCALE_TITLE_META_NAME);

    expect(page.dataset.locale).toBe("en");
    expect(page.doc.title).toBe("HORON 디자인 시스템");
  });

  test("ignores a stored value outside the union", () => {
    const page = createPage();

    applyStoredLocale(page.doc, () => "fr", LOCALE_TITLE_META_NAME);

    expect(page.dataset.locale).toBe("ko");
    expect(page.html.lang).toBe("ko");
  });

  test("falls back to Korean when storage throws", () => {
    const page = createPage();

    applyStoredLocale(
      page.doc,
      () => {
        throw new Error("SecurityError");
      },
      LOCALE_TITLE_META_NAME,
    );

    expect(page.dataset.locale).toBe("ko");
    expect(page.html.lang).toBe("ko");
  });

  test("the inlined scripts carry the contract values, not module identifiers", () => {
    expect(PREPAINT_SCRIPT).toContain(LOCALE_STORAGE_KEY);
    expect(PREPAINT_SCRIPT).toContain(LOCALE_TITLE_META_NAME);
    expect(PREPAINT_SCRIPT).not.toContain("LOCALE_STORAGE_KEY");
    expect(LOCALE_RUNTIME_SCRIPT).toContain(LOCALE_EVENT);
    expect(LOCALE_RUNTIME_SCRIPT).toContain(LOCALE_TITLE_META_NAME);
    expect(LOCALE_RUNTIME_SCRIPT).not.toContain("LOCALE_EVENT");
  });
});

describe("locale event", () => {
  test("swaps the title when the locale changes both ways", () => {
    const page = createPage({
      title: "HORON 디자인 시스템",
      enTitle: "HORON Design System",
      locale: "ko",
      titleKo: "HORON 디자인 시스템",
    });

    listenForLocaleChanges(page.doc, LOCALE_TITLE_META_NAME, LOCALE_EVENT);
    expect(page.doc.title).toBe("HORON 디자인 시스템");

    page.dataset.locale = "en";
    page.dispatch(LOCALE_EVENT);
    expect(page.html.lang).toBe("en");
    expect(page.doc.title).toBe("HORON Design System");

    page.dataset.locale = "ko";
    page.dispatch(LOCALE_EVENT);
    expect(page.html.lang).toBe("ko");
    expect(page.doc.title).toBe("HORON 디자인 시스템");
  });

  test("leaves the Korean title in place for pages without an English one", () => {
    const page = createPage({ title: "HORON 디자인 시스템", locale: "en", titleKo: "HORON 디자인 시스템" });

    listenForLocaleChanges(page.doc, LOCALE_TITLE_META_NAME, LOCALE_EVENT);
    page.dispatch(LOCALE_EVENT);

    expect(page.html.lang).toBe("en");
    expect(page.doc.title).toBe("HORON 디자인 시스템");
  });
});
