import { Button, HoronWordmark } from "@horon-ai/react";

import { externalLinks, foundationsNav, primaryNav } from "@/data/nav";
import { siteHref } from "@/lib/urls";
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
      href={siteHref(link.href)}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <LocalizedText entry={link.label} />
    </Button>
  );
}

/** Column titles are set in mono, uppercase: the website footer's label style. */
function ColumnLabel({ entry }: { entry: Localized }) {
  return (
    <p className="font-mono text-label-sm font-semibold tracking-[0.08em] uppercase">
      <LocalizedText entry={entry} />
    </p>
  );
}

export interface SiteFooterProps {
  /** Current year, computed once in `Footer.astro`; a build-time constant. */
  year: number;
}

/** Public terms live with the code, so the footer points at the repository copy. */
const LICENSE_HREF = "https://github.com/horon-ai/design/blob/main/LICENSE";

/**
 * Site footer: the website's footer band. The band paints `bg-bg-subtle` with a
 * top border, the wordmark is set at `h-8`, the brand line is the brand link,
 * and each column carries a mono uppercase label. The band is full-bleed like
 * the header; `.site-bar` caps the row at `--site-max` with the header's gutter,
 * so the content lines up with the logo and the docs frame. `.site-footer` adds
 * the bottom home-indicator
 * inset. Rendered statically (no client island) — links are library link
 * Buttons and the text carries both locales.
 */
export function SiteFooter({ year }: SiteFooterProps) {
  const more = [...externalLinks, ...foundationsNav.slice(0, 4)];

  return (
    <footer className="site-footer mt-12 border-t border-border-default bg-bg-subtle lg:mt-16">
      <div className="site-bar flex flex-col gap-8 pt-10 pb-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <Button
              variant="link"
              href="/"
              aria-label={m.home.ko}
              className="w-fit rounded-sm px-0 text-text-primary hover:text-text-primary [&_svg]:h-8 [&_svg]:w-auto"
            >
              <HoronWordmark title="" aria-hidden />
            </Button>
            <Button
              variant="link"
              href="/"
              className="w-fit px-0 text-title-md text-text-brand hover:text-text-brand hover:underline"
            >
              <LocalizedText entry={m.brandLine} />
            </Button>
            <p className="max-w-xs text-body-sm text-text-secondary">
              <LocalizedText entry={m.footerBlurb} />
            </p>
          </div>

          <nav aria-label={m.footerNav.ko} className="grid min-w-0 grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-3">
              <ColumnLabel entry={m.footerMenu} />
              <ul className="flex min-w-0 flex-col gap-2">
                {primaryNav.map((link) => (
                  <li key={link.href} className="min-w-0">
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex min-w-0 flex-col gap-3">
              <ColumnLabel entry={m.footerMore} />
              <ul className="flex min-w-0 flex-col gap-2">
                {more.map((link) => (
                  <li key={link.href} className="min-w-0">
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-border-default pt-4 lg:flex-row lg:items-center lg:gap-10">
          <p className="font-mono text-caption tracking-[0.04em] text-text-secondary">
            © {year} Horon. All rights reserved.
          </p>
          <p className="font-mono text-caption tracking-[0.04em] text-text-secondary">
            <LocalizedText entry={m.footerAvailability} />
          </p>
          <Button
            variant="link"
            href={LICENSE_HREF}
            target="_blank"
            rel="noreferrer"
            className="w-fit px-0 font-mono text-caption tracking-[0.04em] text-text-secondary hover:text-text-primary"
          >
            <LocalizedText entry={m.footerLicense} />
          </Button>
        </div>
      </div>
    </footer>
  );
}
