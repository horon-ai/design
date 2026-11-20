/**
 * The props parity gate: every prop a React component declares itself or takes
 * from Base UI must exist on its Expo counterpart with the same optionality,
 * literal set and (for React's own props) default. The repository's
 * `test/props-parity.ts` does the reading; this file holds the differences
 * React Native forces, each with its reason, and fails on anything else,
 * including an allowance that no longer matches a real difference.
 */
import { describe, expect, test } from "bun:test";

import { compareProps } from "../../../test/props-parity";

/**
 * A class-string prop (`className`, `inputClassName`, `triggerClassName`, …):
 * React Native has no class names, so the Expo components take `style` instead.
 * A `*ClassName` prop the port does interpret (a token named by a class, such as
 * `tileClassName`) stays and never reaches this rule.
 */
const CLASS_STRING_PROP = /(?:^c|C)lassName$/;

/** Props no React Native component can have, whatever the component: DOM, form and keyboard-focus plumbing. */
const PLATFORM_PROPS = new Map([
  ["render", "Element swapping through Base UI's useRender needs DOM elements; React Native draws fixed views."],
  ["nativeButton", "Tells Base UI whether `render` produced a native <button>; React Native has no button element."],
  ["ref", "A DOM element ref typed against HTMLElement; React Native refs point at native views."],
  ["inputRef", "Ref to the hidden native <input> Base UI renders for forms; React Native has none."],
  ["actionsRef", "Imperative Base UI handle tied to DOM focus and form reset; no React Native equivalent."],
  ["form", "Associates a hidden input with a <form>; React Native has no form element or submission."],
  ["name", "Form field name for submission; React Native has no form submission."],
  ["value", "Hidden-input submission value of a toggle (Switch, Chip); React Native has no form submission."],
  ["uncheckedValue", "Form value submitted when unchecked; React Native has no form submission."],
  ["required", "Native constraint validation on the hidden input; React Native has no constraint validation."],
  ["autoComplete", "Browser autofill hint on Base UI's input; React Native has no browser autofill."],
  ["highlightItemOnHover", "Pointer hover highlight; touch screens have no hover."],
  ["initialFocus", "DOM focus management when a popup opens; React Native moves accessibility focus itself."],
  ["finalFocus", "DOM focus restore when a popup closes; React Native moves accessibility focus itself."],
  ["focusableWhenDisabled", "Keyboard tab-order behavior; touch screens have no tab order."],
  ["loopFocus", "Arrow-key focus wrapping; touch screens have no keyboard focus traversal."],
  ["nativeLabel", "Whether Base UI renders a native <label>; React Native has no label element."],
  ["validate", "Base UI Field validation runs on the DOM constraint-validation API and form submit."],
  ["validationMode", "Part of Base UI Field's DOM-based validation; see validate."],
  ["validationDebounceTime", "Part of Base UI Field's DOM-based validation; see validate."],
  ["dirty", "Base UI Field form state tracked against the hidden input; React Native has no form state."],
  ["touched", "Base UI Field form state tracked against the hidden input; React Native has no form state."],
]);

/** Single props whose difference is forced, keyed `slug:Component.prop`. */
const ALLOWED = new Map([
  [
    "select:Select.multiple",
    "React's Select renders a single `string | null` value, so `multiple` is not usable through it.",
  ],
  [
    "select:Select.itemToStringValue",
    "Only serializes the value Base UI writes into the hidden form input; React Native has no form submission.",
  ],
  [
    "checkbox:Checkbox.parent",
    "Marks the parent checkbox of a CheckboxGroup; the React package has no CheckboxGroup to pair it with.",
  ],
  ["slider:Slider.largeStep", "Page Up/Down and Shift+Arrow step size; a touch slider has no keyboard input."],
  ["slider:Slider.minStepsBetweenValues", "Multi-thumb only; React's Slider renders one thumb."],
  ["slider:Slider.thumbCollisionBehavior", "Multi-thumb only; React's Slider renders one thumb."],
]);

const report = compareProps("expo");

describe("@horon-ai/expo ↔ @horon-ai/react props parity", () => {
  test("every React component has an Expo component", () => {
    console.log(
      `components: react ${report.components.react}, expo ${report.components.port}, matched ${report.components.matched}`,
    );
    expect(report.components.matched).toBe(report.components.react);
  });

  test("every own and Base UI prop matches, apart from the documented platform differences", () => {
    for (const [source, count] of Object.entries(report.props))
      console.log(`${source} props: react ${count.react}, matched ${count.matched}`);
    const unexplained = report.differences.filter((difference) => {
      const prop = difference.key.split(".").at(-1) ?? "";
      if (difference.kind === "missing-prop" && (CLASS_STRING_PROP.test(prop) || PLATFORM_PROPS.has(prop)))
        return false;
      return !ALLOWED.has(difference.key);
    });
    if (unexplained.length > 0)
      console.log(
        `  ${unexplained.map((difference) => `${difference.key} [${difference.kind}] ${difference.detail}`).join("\n  ")}`,
      );
    expect(unexplained).toEqual([]);
  });

  test("every allowance still matches a real difference", () => {
    const differing = new Set(report.differences.map((difference) => difference.key));
    const stale = [...ALLOWED.keys()].filter((key) => !differing.has(key));
    const usedPlatformProps = new Set(report.differences.map((difference) => difference.key.split(".").at(-1)));
    const unusedPlatform = [...PLATFORM_PROPS.keys()].filter((prop) => !usedPlatformProps.has(prop));
    expect([...stale, ...unusedPlatform]).toEqual([]);
  });
});
