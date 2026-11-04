import { Check, Copy, WarningCircle } from "@phosphor-icons/react";
import { Button } from "@horon-ai/react";
import { useEffect, useRef, useState } from "react";

import { type Localized, pick, readLocale } from "@/i18n";
import { blockMessages } from "@/i18n/messages/blocks";

export interface CopyButtonProps {
  /** Exact text written to the clipboard; both locales when the sample is localized. */
  code: string | Localized;
}

type CopyStatus = "idle" | "copied" | "failed";

const RESET_MS = 1400;

/**
 * Copies a code sample and reports the result in the button label for 1.4s.
 *
 * The island mounts with `client:visible`, so the first HTML is what an English
 * reader sees until it scrolls into view. Both locales are therefore rendered as
 * `data-locale-text` spans and `styles/i18n.css` hides the inactive one; the
 * status change only swaps which phrases the two halves carry.
 */
export function CopyButton({ code }: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function copy() {
    window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(typeof code === "string" ? code : pick(code, readLocale()));
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    resetTimer.current = window.setTimeout(() => setStatus("idle"), RESET_MS);
  }

  const message =
    status === "copied"
      ? blockMessages.copied
      : status === "failed"
        ? blockMessages.copyFailed
        : blockMessages.copy;
  const Icon = status === "copied" ? Check : status === "failed" ? WarningCircle : Copy;

  return (
    <Button
      size="sm"
      variant="glass"
      onClick={() => {
        void copy();
      }}
      icon={<Icon aria-hidden />}
    >
      <span aria-live="polite">
        <span data-locale-text="ko" lang="ko">
          {message.ko}
        </span>
        <span data-locale-text="en" lang="en">
          {message.en}
        </span>
      </span>
    </Button>
  );
}
