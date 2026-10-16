"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "cn";

const CodeBlockContext = React.createContext<React.RefObject<HTMLPreElement | null> | null>(null);

function CodeBlock({ className, children, ...props }: React.ComponentProps<"figure">) {
  const contentRef = React.useRef<HTMLPreElement>(null);

  return (
    <CodeBlockContext.Provider value={contentRef}>
      <figure
        data-slot="code-block"
        className={cn(
          "flex w-full flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </figure>
    </CodeBlockContext.Provider>
  );
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="code-block-header"
      className={cn(
        "flex items-center justify-between gap-3 border-b border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlockContent({ className, ref, ...props }: React.ComponentProps<"pre">) {
  const contextRef = React.useContext(CodeBlockContext);

  return (
    <pre
      ref={ref ?? contextRef}
      data-slot="code-block-content"
      className={cn("overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground", className)}
      {...props}
    />
  );
}

function CodeBlockCopyButton({
  className,
  value,
  timeout = 2000,
  onClick,
  ...props
}: React.ComponentProps<"button"> & {
  value?: string;
  timeout?: number;
}) {
  const contextRef = React.useContext(CodeBlockContext);
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    const text = value ?? contextRef?.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setCopied(false), timeout);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      data-slot="code-block-copy-button"
      data-state={copied ? "copied" : "idle"}
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={handleClick}
      className={cn(
        "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

export { CodeBlock, CodeBlockHeader, CodeBlockContent, CodeBlockCopyButton };
