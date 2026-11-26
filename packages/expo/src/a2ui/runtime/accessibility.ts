/** The v1.0 `accessibility` attributes of a component, read from its resolved props. */
export type A2uiAccessibility = {
  /** Accessible name, for the component's own control. */
  label?: string;
  /** Longer description, read after the name (React Native `accessibilityHint`). */
  description?: string;
  /** Hides the component and its subtree from assistive technology. */
  hidden: boolean;
  /** Announces changes politely or assertively (Android live region). */
  live?: "polite" | "assertive";
};

/** Reads `props.accessibility`, ignoring members of the wrong type. */
export function readAccessibility(props: { accessibility?: unknown }): A2uiAccessibility {
  const raw = props.accessibility;
  if (!raw || typeof raw !== "object") return { hidden: false };
  const label = "label" in raw && typeof raw.label === "string" && raw.label ? raw.label : undefined;
  const description =
    "description" in raw && typeof raw.description === "string" && raw.description ? raw.description : undefined;
  const live = "live" in raw && (raw.live === "polite" || raw.live === "assertive") ? raw.live : undefined;
  return { label, description, hidden: "hidden" in raw && raw.hidden === true, live };
}
