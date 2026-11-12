import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

/** Props for {@link CodePanel}: the `<pre>` attributes (`children` carries the code) plus a merged `className`. */
export type CodePanelProps = Omit<ComponentProps<"pre">, "className"> & {
  /** Extra classes on the `<pre>`, merged after the panel surface and type classes. */
  className?: string;
};

/**
 * Paper `Code block` (1VV9-0), the light variant: a 10px-radius neutral-50 panel with a 1px hairline,
 * Geist Mono 12px on a 21px line pitch (Paper rows are 19px with a 2px gap), no header bar or copy button. Wrap keys in `CodeKey`; plain text reads as the string color.
 * Chat surfaces keep the ink `CodeBlock` from message-extras.
 *
 * The `<pre>` scrolls horizontally instead of wrapping (`whitespace-pre`), and the dark theme swaps the
 * panel to neutral-800 with a stronger border.
 *
 * @example
 * ```tsx
 * <CodePanel>
 *   {"---\ntitle: Weekly digest\n---"}
 * </CodePanel>
 * ```
 */
export function CodePanel({ className, ...props }: CodePanelProps) {
  return (
    <pre
      className={cn(
        "font-normal m-0 max-w-full overflow-x-auto rounded-md border border-border-default bg-neutral-50 px-4 py-3.5 font-mono text-[12px]/[21px] whitespace-pre text-syntax-string dark:border-border-strong dark:bg-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A frontmatter key or other highlighted token inside a `CodePanel`.
 *
 * Part of {@link CodePanel}. Renders an inline `span` in the key colour, so it only changes the colour of
 * the text it wraps; extra classes can override or add weight.
 */
export function CodeKey({
  className,
  ...props
}: Omit<ComponentProps<"span">, "className"> & {
  /** Extra classes on the span, merged after the key colour. */
  className?: string;
}) {
  return <span className={cn("text-syntax-key", className)} {...props} />;
}
