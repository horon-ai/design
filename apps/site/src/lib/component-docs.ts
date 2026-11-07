/**
 * The content model behind the reference half of `/components/<slug>`.
 *
 * One file per component lives in `src/data/docs/<slug>.ts` and exports
 * `export const doc: ComponentDoc`; `component-docs-loader.ts` globs those files
 * for the page. Nothing here touches a bundler API, so `bun test` imports this
 * module directly and validates the copy with `validateDoc`.
 *
 * Every prose field is a `Localized` pair, and every id ends up in a heading
 * anchor (`#property-variant`, `#guideline-one-primary`), so ids are validated
 * rather than trusted.
 */
import type { Localized } from "@/i18n";

/** One numbered piece of the rendered markup. `slot` names the part in the API. */
export interface AnatomyPart {
  name: string;
  slot?: string;
  description: Localized;
}

/** One accepted value of an enumerated property. */
export interface PropertyValue {
  name: string;
  description: Localized;
}

/** One configurable property: `id` is the prop name, and the heading is `#property-<id>`. */
export interface PropertyDoc {
  id: string;
  title: Localized;
  description: Localized;
  values?: PropertyValue[];
  /** Example id rendered live under the description; must exist in `examples`. */
  example?: string;
}

/** One usage rule. `do` and `dont` render as the paired cards, and the heading is `#guideline-<id>`. */
export interface GuidelineDoc {
  id: string;
  title: Localized;
  body: Localized;
  do?: Localized;
  dont?: Localized;
  example?: string;
}

/** One row of a specification table. Repeated state/slot cells merge in the table. */
export interface SpecRow {
  state: string;
  slot: string;
  property: string;
  value: string;
  note?: Localized;
}

/** One specification table, headed `#spec-<id>`. */
export interface SpecTable {
  id: string;
  title: Localized;
  note?: Localized;
  rows: SpecRow[];
}

/** One example file: `src/components/examples/<slug>/<id>.tsx`, headed `#example-<id>`. */
export interface ExampleDoc {
  id: string;
  title: Localized;
  description: Localized;
}

/** One keyboard shortcut row of the accessibility table. */
export interface KeyboardRow {
  keys: string[];
  action: Localized;
}

export interface AccessibilityDoc {
  /** WAI-ARIA pattern the component follows, when one applies. */
  pattern?: { label: string; href: string };
  notes: Localized[];
  keyboard: KeyboardRow[];
}

/** Everything the page renders below the main preview. */
export interface ComponentDoc {
  slug: string;
  anatomy: { description: Localized; parts: AnatomyPart[] };
  properties: PropertyDoc[];
  guidelines: GuidelineDoc[];
  specification: SpecTable[];
  examples: ExampleDoc[];
  accessibility: AccessibilityDoc;
}

/** Kebab-case list ids; they become the tail of a heading anchor. */
const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Property ids are prop names, so they keep the library's camelCase. */
const PROPERTY_ID = /^[a-zA-Z][a-zA-Z0-9-]*$/;

/**
 * Checks one doc against the contract the page and the tests rely on. Returns
 * human-readable problems, and an empty array when the doc is usable.
 *
 * `exampleIds` are the example files found on disk for the slug and
 * `ownUnionProps` the component's own string-literal union props, so a doc can
 * neither reference a missing example nor leave a variant undocumented.
 */
export function validateDoc(doc: ComponentDoc, exampleIds: string[], ownUnionProps: string[]): string[] {
  const problems: string[] = [];

  const checkText = (where: string, entry: Localized | undefined): void => {
    // Both locales must carry real copy: a blank string would render an empty heading half.
    if (entry === undefined || entry.ko.trim().length === 0 || entry.en.trim().length === 0) {
      problems.push(`${where}: needs non-empty ko and en`);
    }
  };

  const checkIds = (where: string, ids: string[], pattern: RegExp): void => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (!pattern.test(id)) problems.push(`${where} "${id}": id is not kebab-case`);
      if (seen.has(id)) problems.push(`${where} "${id}": duplicate id`);
      seen.add(id);
    }
  };

  if (!KEBAB_CASE.test(doc.slug)) problems.push(`slug "${doc.slug}": slug is not kebab-case`);

  checkText("anatomy.description", doc.anatomy.description);
  if (doc.anatomy.parts.length === 0) problems.push("anatomy: needs at least one part");
  for (const [index, part] of doc.anatomy.parts.entries()) {
    if (part.name.trim().length === 0) problems.push(`anatomy.parts[${index}]: name is empty`);
    if (part.slot !== undefined && part.slot.trim().length === 0) {
      problems.push(`anatomy.parts[${index}]: slot is empty`);
    }
    checkText(`anatomy.parts[${index}].description`, part.description);
  }

  checkIds("properties", doc.properties.map((entry) => entry.id), PROPERTY_ID);
  for (const property of doc.properties) {
    checkText(`properties.${property.id}.title`, property.title);
    checkText(`properties.${property.id}.description`, property.description);
    for (const value of property.values ?? []) {
      if (value.name.trim().length === 0) problems.push(`properties.${property.id}: value name is empty`);
      checkText(`properties.${property.id}.values.${value.name}`, value.description);
    }
  }

  if (doc.guidelines.length < 2) problems.push("guidelines: needs at least two guidelines");
  checkIds("guidelines", doc.guidelines.map((entry) => entry.id), KEBAB_CASE);
  for (const guideline of doc.guidelines) {
    checkText(`guidelines.${guideline.id}.title`, guideline.title);
    checkText(`guidelines.${guideline.id}.body`, guideline.body);
    if (guideline.do !== undefined) checkText(`guidelines.${guideline.id}.do`, guideline.do);
    if (guideline.dont !== undefined) checkText(`guidelines.${guideline.id}.dont`, guideline.dont);
  }

  if (doc.specification.length === 0) problems.push("specification: needs at least one table");
  checkIds("specification", doc.specification.map((entry) => entry.id), KEBAB_CASE);
  for (const table of doc.specification) {
    checkText(`specification.${table.id}.title`, table.title);
    if (table.note !== undefined) checkText(`specification.${table.id}.note`, table.note);
    if (table.rows.length === 0) problems.push(`specification.${table.id}: table has no rows`);
    for (const [index, row] of table.rows.entries()) {
      for (const field of ["state", "slot", "property", "value"] as const) {
        if (row[field].trim().length === 0) {
          problems.push(`specification.${table.id}.rows[${index}]: ${field} is empty`);
        }
      }
      if (row.note !== undefined) checkText(`specification.${table.id}.rows[${index}].note`, row.note);
    }
  }

  if (doc.examples.length < 2) problems.push("examples: needs at least two examples");
  checkIds("examples", doc.examples.map((entry) => entry.id), KEBAB_CASE);
  for (const example of doc.examples) {
    checkText(`examples.${example.id}.title`, example.title);
    checkText(`examples.${example.id}.description`, example.description);
  }

  const exampleSet = new Set(doc.examples.map((entry) => entry.id));
  for (const property of doc.properties) {
    if (property.example !== undefined && !exampleSet.has(property.example)) {
      problems.push(`properties.${property.id}: example "${property.example}" is not in examples`);
    }
  }
  for (const guideline of doc.guidelines) {
    if (guideline.example !== undefined && !exampleSet.has(guideline.example)) {
      problems.push(`guidelines.${guideline.id}: example "${guideline.example}" is not in examples`);
    }
  }
  for (const example of doc.examples) {
    if (!exampleIds.includes(example.id)) {
      problems.push(`examples.${example.id}: no src/components/examples/${doc.slug}/${example.id}.tsx`);
    }
  }
  for (const id of exampleIds) {
    if (!exampleSet.has(id)) problems.push(`example file "${id}": not referenced by the doc`);
  }

  if (doc.accessibility.notes.length === 0) problems.push("accessibility: needs at least one note");
  for (const [index, note] of doc.accessibility.notes.entries()) {
    checkText(`accessibility.notes[${index}]`, note);
  }
  if (doc.accessibility.pattern !== undefined) {
    if (doc.accessibility.pattern.label.trim().length === 0) problems.push("accessibility.pattern: label is empty");
    if (!/^https?:\/\//.test(doc.accessibility.pattern.href)) {
      problems.push("accessibility.pattern: href is not an absolute URL");
    }
  }
  for (const [index, row] of doc.accessibility.keyboard.entries()) {
    if (row.keys.length === 0 || row.keys.some((key) => key.trim().length === 0)) {
      problems.push(`accessibility.keyboard[${index}]: keys are empty`);
    }
    checkText(`accessibility.keyboard[${index}].action`, row.action);
  }

  const documentedProps = new Set(doc.properties.map((entry) => entry.id));
  for (const prop of ownUnionProps) {
    if (!documentedProps.has(prop)) problems.push(`property "${prop}": enumerated prop has no property entry`);
  }

  return problems;
}
