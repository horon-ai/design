import { createContext, type ComponentType } from "react";

/** What the component in {@link MarkdownComponentContext} receives. */
export type MarkdownComponentProps = {
  /** The Markdown of a basic catalog `Text`. */
  markdown: string;
};

/**
 * Replaces how a basic catalog `Text` draws its Markdown, the counterpart of `@a2ui/react`'s
 * context of the same name. Without a provider, `Text` draws it with `RichText` in its `basic`
 * format (emphasis, lists, links and tables; no headings, images or HTML), which is the subset the
 * catalog allows.
 */
export const MarkdownComponentContext = createContext<ComponentType<MarkdownComponentProps> | undefined>(undefined);
