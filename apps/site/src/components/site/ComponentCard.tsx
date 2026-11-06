import { Button, Card } from "@horon-ai/react";
import type { ReactNode } from "react";

import type { Localized } from "@/i18n";

export interface ComponentCardProps {
  /** Docs route for the component. The whole card opens it. */
  href: string;
  title: Localized;
  description: Localized;
  /** The preview tile. Rendered inside the card below the description. */
  children?: ReactNode;
  /** Layout only: grid/flex placement on the card wrapper. */
  className?: string;
  /** Card material. `frost` is the home board's glass; `solid` stays the docs default. */
  surface?: "glass" | "frost" | "solid";
}

/**
 * Renders both locales as adjacent spans with the same
 * `data-locale-text` markup as `T.astro`, so `styles/i18n.css` hides the
 * inactive half without JavaScript.
 */
function LocalizedText({ m }: { m: Localized }) {
  return (
    <>
      <span data-locale-text="ko" lang="ko">
        {m.ko}
      </span>
      <span data-locale-text="en" lang="en">
        {m.en}
      </span>
    </>
  );
}

/**
 * A catalog card. `Card` only accepts React nodes for `title` and
 * `description`, which Astro cannot pass, so this static wrapper receives the
 * two strings and builds the localized nodes itself.
 *
 * The card link is a sibling that covers the wrapper instead of being the card
 * element: the preview tile holds real component markup, and two demos
 * (Breadcrumb, Breadcrumb Header) render their own anchors. An anchor inside
 * an anchor is invalid HTML, so the parser closes the outer one and the island
 * below it hydrates empty (React error #418).
 *
 * The wrapper carries `min-w-0` so a long unbroken title or description cannot
 * set its min-content width and overflow a narrow grid column. It only drops
 * the automatic minimum, so a column that already has a width renders the same.
 */
export function ComponentCard({ href, title, description, children, className, surface }: ComponentCardProps) {
  return (
    <div className={["relative h-full min-w-0", className].filter(Boolean).join(" ")}>
      <Card
        interactive
        title={<LocalizedText m={title} />}
        description={<LocalizedText m={description} />}
        surface={surface}
        className="h-full"
      >
        {children}
      </Card>
      <Button variant="link" href={href} aria-label={title.ko} className="absolute inset-0 z-10" />
    </div>
  );
}
