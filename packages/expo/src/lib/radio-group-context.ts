import { createContext } from "react";

/** What a radio, or a choice card, reads from the `RadioGroup` around it. */
export type RadioGroupState = {
  /** The value the group currently holds, or `undefined` before anything is picked. */
  value: string | undefined;
  /** Hands a radio's value to the group when it is tapped. */
  select: (value: string) => void;
  /** True when the group is disabled, which dims and locks every radio inside. */
  disabled: boolean;
  /** True when the group refuses a change without looking disabled. */
  readOnly: boolean;
};

/**
 * The group state `RadioGroup` provides and both `Radio` and `ChoiceCard` join,
 * so a choice card nested anywhere inside a group picks through it. It lives
 * here because neither component file may export a value React does not.
 */
export const RadioGroupContext = createContext<RadioGroupState | null>(null);
