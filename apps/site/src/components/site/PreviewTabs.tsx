import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/react";
import type { ReactNode } from "react";

import type { Localized } from "@/i18n";

export interface PreviewTabsProps {
  previewLabel: Localized;
  codeLabel: Localized;
  /** Astro's `preview` slot: the live demo. */
  preview?: ReactNode;
  /** Astro's `code` slot: the highlighted source. */
  code?: ReactNode;
}

/** Both labels in the first HTML, so the static locale switch shows the right one before hydration. */
function Label({ entry }: { entry: Localized }) {
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

/**
 * A component page's Preview / Code switch on the library underline tabs. The
 * panels stay mounted: they hold server HTML from Astro slots, and the demo
 * inside the preview is its own island that must keep its state while hidden.
 */
export function PreviewTabs({ previewLabel, codeLabel, preview, code }: PreviewTabsProps) {
  return (
    <Tabs defaultValue="preview" size="lg" className="mt-8">
      <TabsList variant="underline">
        <TabsTab value="preview">
          <Label entry={previewLabel} />
        </TabsTab>
        <TabsTab value="code">
          <Label entry={codeLabel} />
        </TabsTab>
      </TabsList>
      <TabsPanel value="preview" keepMounted>
        {preview}
      </TabsPanel>
      <TabsPanel value="code" keepMounted>
        {code}
      </TabsPanel>
    </Tabs>
  );
}
