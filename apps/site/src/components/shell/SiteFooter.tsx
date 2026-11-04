import { Button, HoronIcon, HoronWordmark } from "@horon-ai/react";

import { externalLinks, foundationsNav, primaryNav } from "@/data/nav";
import type { Localized } from "@/i18n";

import { shellMessages as m } from "./messages";

/**
 * Renders both locales as adjacent spans with the same `data-locale-text`
 * markup as `T.astro`, so `styles/i18n.css` hides the inactive half without
 * JavaScript. The footer is server-rendered only, so this is the only way its
 * text switches with the header language button.
 */
function LocalizedText({ entry }: { entry: Localized }) {
  return (
    <>
      <span data-locale-text="ko" lang="ko">
        {entry.ko}
      </span>
      <span data-locale-text="en" lang="en">
        {entry.en}
      </span>
    </>
  );
}

function FooterLink({ link }: { link: { href: string; label: Localized } }) {
  const external = link.href.startsWith("http");
  return (
    <Button
      variant="link"
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <LocalizedText entry={link.label} />
    </Button>
  );
}

export interface SiteFooterProps {
  /** Current year, computed once in `Footer.astro`; a build-time constant. */
  year: number;
}

/**
 * Site footer: brand lockup, blurb, primary menu and the secondary links
 * column. Rendered statically (no client island) — links are library link
 * Buttons and the text carries both locales.
 */
export function SiteFooter({ year }: SiteFooterProps) {
  const more = [...externalLinks, ...foundationsNav.slice(0, 4)];

  return (
    <footer className="mt-12 border-t border-border-default pt-10">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5 text-text-primary">
            <HoronIcon size={24} />
            <HoronWordmark />
          </div>
          <p className="max-w-xs text-body-sm text-text-secondary">
            <LocalizedText entry={m.footerBlurb} />
          </p>
          <p className="text-caption text-text-secondary">© {year} HORON. All rights reserved.</p>
        </div>

        <nav aria-label={m.footerNav.ko} className="grid grid-cols-2 gap-x-12 gap-y-8">
          <div className="flex flex-col gap-3">
            <p className="text-caption text-text-secondary">
              <LocalizedText entry={m.footerMenu} />
            </p>
            <ul className="flex flex-col gap-2">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-caption text-text-secondary">
              <LocalizedText entry={m.footerMore} />
            </p>
            <ul className="flex flex-col gap-2">
              {more.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}
