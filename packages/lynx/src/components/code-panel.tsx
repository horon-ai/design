import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { cn } from "../lib/cn";
import { useHoronTheme } from "../provider";

/**
 * Props of the React elements this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx wrapper can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `pre`; on Lynx the panel is a `scroll-view` around one `<text>`. */
  pre: { className?: string; style?: CSSProperties };
  /** React's `span`; on Lynx an inline nested `<text>`. */
  span: { className?: string };
};

/** Props for {@link CodePanel}: the panel surface plus an optional copy affordance. */
export type CodePanelProps = Omit<PortedElementProps["pre"], "className"> & {
  /** Extra classes on the panel, merged after the surface and type classes. */
  className?: string;
  /**
   * The plain text of the code. React had no copy button on this panel; Lynx has the
   * {@link useCopyToClipboard} hook, so passing this string adds a small copy action
   * in the top-right corner. The action renders only where the engine exposes a
   * clipboard (`supported`), so a native build shows no dead button, and the flag
   * reads Copied for 1500ms after a successful write.
   */
  copyText?: string;
  /** The code, usually strings and {@link CodeKey} tokens; line breaks are kept as written. */
  children?: ReactNode;
};

/**
 * Paper `Code block` (1VV9-0), the light variant: a 10px-radius neutral-50 panel with a 1px hairline,
 * Geist Mono 12px on a 21px line pitch (Paper rows are 19px with a 2px gap). Wrap keys in `CodeKey`;
 * plain text reads as the string color.
 *
 * Lynx has no `<pre>`, so the code is one `<text>` with `whitespace-pre` inside a horizontal
 * `scroll-view`: the line breaks survive and an over-wide line scrolls instead of wrapping, exactly
 * as react's `overflow-x-auto whitespace-pre` pair did. The dark theme swaps the panel to
 * neutral-800 with a stronger border; the scheme is read from {@link useHoronTheme} instead of a
 * `dark:` variant because Lynx has no media-query or class variant engine for the generated CSS.
 *
 * @example
 * ```tsx
 * <CodePanel copyText={"---\ntitle: Weekly digest\n---"}>
 *   {"---\ntitle: Weekly digest\n---"}
 * </CodePanel>
 * ```
 */
export function CodePanel({ className, copyText, children, style }: CodePanelProps) {
  const theme = useHoronTheme();
  const { copied, copy, supported } = useCopyToClipboard(1500);
  const showCopy = copyText !== undefined && supported;

  return (
    <view className={cn("relative max-w-full", className)} style={style}>
      <scroll-view
        scroll-orientation="horizontal"
        className={cn(
          "overflow-hidden rounded-[10px] border py-3.5 pl-4",
          showCopy ? "pr-20" : "pr-4",
          theme.scheme === "dark"
            ? "border-border-strong bg-neutral-800"
            : "border-border-default bg-neutral-50",
        )}
        scroll-bar-enable={false}
      >
        <text className="font-mono text-[12px]/[21px] whitespace-pre text-syntax-string">{children}</text>
      </scroll-view>
      {showCopy ? (
        <view
          className="absolute right-2 top-2 flex flex-row rounded-sm bg-bg-surface px-2 py-1 active:opacity-70"
          bindtap={() => copy(copyText)}
          accessibility-element
          accessibility-traits="button"
          accessibility-label={copied ? "Copied" : "Copy"}
        >
          <text className="text-label-sm text-text-secondary">{copied ? "Copied" : "Copy"}</text>
        </view>
      ) : null}
    </view>
  );
}

/**
 * A frontmatter key or other highlighted token inside a `CodePanel`.
 *
 * Part of {@link CodePanel}. Renders an inline nested `<text>` in the key colour, so it only changes
 * the colour of the text it wraps; extra classes can override or add weight.
 */
export function CodeKey({ className, children }: Omit<PortedElementProps["span"], "className"> & {
  /** Extra classes on the token, merged after the key colour. */
  className?: string;
  /** The token text. */
  children?: ReactNode;
}) {
  return <text className={cn("text-syntax-key", className)}>{children}</text>;
}
