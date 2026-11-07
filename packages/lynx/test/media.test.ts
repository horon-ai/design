import { describe, expect, test } from "bun:test";

import { evaluateMediaQuery, type MediaSnapshot } from "../src/lib/media";

const desktop: MediaSnapshot = { width: 1280, height: 800, scheme: "light", reducedMotion: false, os: "macos" };
const phone: MediaSnapshot = { width: 390, height: 844, scheme: "dark", reducedMotion: true, os: "ios" };

describe("evaluateMediaQuery", () => {
  test("answers width bounds with or without spaces around the value", () => {
    expect(evaluateMediaQuery("(max-width: 767px)", phone)).toBe(true);
    expect(evaluateMediaQuery("(max-width:767px)", desktop)).toBe(false);
    expect(evaluateMediaQuery("( min-width :  768px  )", desktop)).toBe(true);
  });

  test("requires every condition joined by and", () => {
    expect(evaluateMediaQuery("(min-width: 768px) and (pointer: fine)", desktop)).toBe(true);
    expect(evaluateMediaQuery("(max-width: 767px) and (hover: hover)", phone)).toBe(false);
    expect(evaluateMediaQuery("(prefers-color-scheme: dark) and (prefers-reduced-motion: reduce)", phone)).toBe(true);
  });

  test("reports false for an empty value or an unparsable query", () => {
    expect(evaluateMediaQuery("(max-width:)", desktop)).toBe(false);
    expect(evaluateMediaQuery("(max-width:   )", desktop)).toBe(false);
    expect(evaluateMediaQuery("screen", desktop)).toBe(false);
  });

  test("stays linear on crafted queries (CodeQL polynomial-redos)", () => {
    const spaces = " ".repeat(50_000);
    const started = performance.now();
    expect(evaluateMediaQuery(`(-:${spaces}`, desktop)).toBe(false);
    expect(evaluateMediaQuery(`(-:(${spaces}`, desktop)).toBe(false);
    expect(evaluateMediaQuery(`(-:${"(-:(".repeat(20_000)}`, desktop)).toBe(false);
    expect(evaluateMediaQuery(`(max-width:${spaces}767px${spaces})`, phone)).toBe(true);
    expect(performance.now() - started).toBeLessThan(500);
  });
});
