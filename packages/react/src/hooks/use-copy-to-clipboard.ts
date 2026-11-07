import { useCallback, useEffect, useState } from "react";

export type CopyToClipboard = {
  copied: boolean;
  /** Writes `text`; a failed write leaves `copied` false instead of throwing. */
  copy: (text: string) => void;
};

/**
 * Clipboard writes with a self-clearing confirmation: `copied` turns true when
 * the write resolves and back to false after `resetMs`, so a button needs no
 * timer of its own.
 */
export function useCopyToClipboard(resetMs = 1500): CopyToClipboard {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), resetMs);
    return () => clearTimeout(timer);
  }, [copied, resetMs]);

  const copy = useCallback((text: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => setCopied(true),
      () => undefined,
    );
  }, []);

  return { copied, copy };
}
