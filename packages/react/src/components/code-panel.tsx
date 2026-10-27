import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

export type CodePanelProps = Omit<ComponentProps<"pre">, "className"> & { className?: string };

/**
 * Paper `Code block` (1VV9-0), the light variant: a 10px-radius neutral-50 panel with a 1px hairline,
 * Geist Mono 12/19, no header bar or copy button. Wrap keys in `CodeKey`; plain text reads as the string color.
 * Chat surfaces keep the ink `CodeBlock` from message-extras.
 */
export function CodePanel({ className, ...props }: CodePanelProps) {
  return (
    <pre
      className={cn(
        "m-0 overflow-x-auto rounded-[10px] border border-border-default bg-neutral-50 px-4 py-3.5 font-mono text-[12px]/[19px] font-normal whitespace-pre text-syntax-string dark:bg-neutral-800",
        className,
      )}
      {...props}
    />
  );
}

/** A frontmatter key or other highlighted token inside a `CodePanel`. */
export function CodeKey({ className, ...props }: Omit<ComponentProps<"span">, "className"> & { className?: string }) {
  return <span className={cn("text-syntax-key", className)} {...props} />;
}
