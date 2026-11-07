/**
 * The code a reader copies from a preview.
 *
 * Demo and example files wrap their samples in `<Backdrop>` so the glass
 * surfaces sit over imagery on the page. That wrapper is scaffolding for the
 * stage, not part of the sample, so the code shows a fragment instead while the
 * rendered React tree stays exactly as written.
 */
const IMPORT_LINE = /^import \{[^}]*\bBackdrop\b[^}]*\} from "(?:\.\.\/)+demo-backdrop";\n\n?/m;

export function stripBackdrop(source: string): string {
  return source
    .replace(IMPORT_LINE, "")
    .replace(/<Backdrop[^>]*>\n?/g, "<>\n")
    .replace(/<\/Backdrop>/g, "</>")
    .replace(/\n{3,}/g, "\n\n");
}
