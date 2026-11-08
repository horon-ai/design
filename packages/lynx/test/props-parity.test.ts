/**
 * The props parity gate: every prop a React component declares itself or takes
 * from Base UI must exist on its Lynx counterpart with the same optionality,
 * literal set and (for React's own props) default. `props-parity.ts` does the
 * reading; this file holds the differences the Lynx platform forces, each with
 * its reason, and fails on anything else, including an allowance that no longer
 * matches a real difference.
 */
import { describe, expect, test } from "bun:test";

import { compareProps } from "./props-parity";

/** Base UI props no Lynx component can have, whatever the component. */
const PLATFORM_PROPS = new Map([
  ["render", "Element swapping through Base UI's useRender needs DOM elements; Lynx draws fixed view/text nodes."],
  ["nativeButton", "Tells Base UI whether `render` produced a native <button>; Lynx has no button element."],
  ["ref", "A DOM element ref; Lynx components expose no element handle."],
  ["inputRef", "Ref to the hidden native <input> Base UI renders for forms; Lynx has none."],
  ["actionsRef", "Imperative Base UI handle tied to DOM focus and form reset; no Lynx equivalent."],
  ["form", "Associates a hidden input with a <form>; Lynx has no form element or submission."],
  ["name", "Form field name for submission; Lynx has no form submission."],
  ["value", "Hidden-input submission value of a toggle (Switch, Chip); Lynx has no form submission."],
  ["uncheckedValue", "Form value submitted when unchecked; Lynx has no form submission."],
  ["required", "Native constraint validation on the hidden input; Lynx has no constraint validation."],
  ["autoComplete", "Browser autofill hint on the hidden input; Lynx has no autofill."],
  ["initialFocus", "DOM focus management when a popup opens; Lynx has no programmatic focus for views."],
  ["finalFocus", "DOM focus restore when a popup closes; Lynx has no programmatic focus for views."],
  ["focusableWhenDisabled", "Keyboard tab-order behavior; Lynx has no keyboard focus traversal."],
  ["loopFocus", "Arrow-key focus wrapping; Lynx has no keyboard focus traversal."],
  ["activateOnFocus", "Keyboard focus activates a tab; Lynx has no keyboard focus traversal."],
  ["largeStep", "Page Up/Down and Shift+Arrow step size; Lynx has no keyboard input on a slider."],
  ["highlightItemOnHover", "Pointer hover highlight; Lynx has no hover."],
  ["nativeLabel", "Whether Base UI renders a native <label>; Lynx has no label element."],
  ["validate", "Base UI Field validation runs on the DOM constraint-validation API and form submit; Lynx has neither."],
  ["validationMode", "Part of Base UI Field's DOM-based validation; see validate."],
  ["validationDebounceTime", "Part of Base UI Field's DOM-based validation; see validate."],
  ["dirty", "Base UI Field form state tracked against the hidden input; Lynx has no form state."],
  ["touched", "Base UI Field form state tracked against the hidden input; Lynx has no form state."],
]);

/** Single props whose difference is forced, keyed `slug:Component.prop`. */
const ALLOWED = new Map([
  ["select:Select.itemToStringValue", "Only serializes the value Base UI writes into the hidden form input; Lynx has no form submission."],
  ["card:Card.render", "React's own `render` swaps the root element via useRender; Lynx has no element swapping."],
  ["checkbox:Checkbox.parent", "Marks the parent checkbox of a CheckboxGroup; the React package has no CheckboxGroup to pair it with."],
  ["select:Select.multiple", "React's Select renders a single `string | null` value, so `multiple` is not usable through it."],
  ["slider:Slider.minStepsBetweenValues", "Multi-thumb only; React's Slider renders one thumb."],
  ["slider:Slider.thumbCollisionBehavior", "Multi-thumb only; React's Slider renders one thumb."],
  ["slider:Slider.thumbAlignment", "`edge-client-only` defers measurement past server rendering; Lynx renders on the client only, so `edge` covers it."],
  [
    "menu:MenuContent.side",
    "The default `bottom` is Base UI's own default, which React leaves undocumented in its wrapper; Lynx states it with @default.",
  ],
  ["menu:MenuContent.alignOffset", "The default 0 is Base UI's own default, which React leaves undocumented in its wrapper; Lynx states it with @default."],
]);

/** An allowed difference keeps only the kinds it explains; `side` is allowed its default, not its literals. */
const ALLOWED_KINDS: Record<string, string> = {
  "menu:MenuContent.side": "default",
  "menu:MenuContent.alignOffset": "default",
};

const report = compareProps();

describe("@horon-ai/lynx ↔ @horon-ai/react props parity", () => {
  test("every React component has a Lynx component", () => {
    console.log(`components: react ${report.components.react}, lynx ${report.components.lynx}, matched ${report.components.matched}`);
    expect(report.components.matched).toBe(report.components.react);
  });

  test("every own and Base UI prop matches, apart from the documented platform differences", () => {
    for (const [source, count] of Object.entries(report.props)) console.log(`${source} props: react ${count.react}, matched ${count.matched}`);
    const unexplained = report.differences.filter((difference) => {
      const prop = difference.key.split(".").at(-1) ?? "";
      if (difference.source === "base-ui" && difference.kind === "missing-prop" && PLATFORM_PROPS.has(prop)) return false;
      const allowedKind = ALLOWED_KINDS[difference.key];
      return !ALLOWED.has(difference.key) || (allowedKind !== undefined && allowedKind !== difference.kind);
    });
    console.log(`allowed differences: ${report.differences.length - unexplained.length}`);
    if (unexplained.length > 0) console.log(`  ${unexplained.map((difference) => `${difference.key} [${difference.kind}] ${difference.detail}`).join("\n  ")}`);
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
