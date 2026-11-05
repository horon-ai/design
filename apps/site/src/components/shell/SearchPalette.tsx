import { CommandPalette, IconButton, Kbd, type CommandGroup } from "@horon-ai/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { searchIndex } from "@/data/search-index";
import { pick, type Locale } from "@/i18n";
import { useLocale } from "@/i18n/react";

import { shellMessages as m } from "./messages";

/**
 * Turns the flat search index into palette groups in the index's own order.
 * The localized group label is the key, so each locale gets its own stable
 * grouping while the first occurrence still fixes the order.
 */
function buildGroups(locale: Locale): CommandGroup[] {
  const groups: CommandGroup[] = [];
  const byLabel = new Map<string, CommandGroup>();
  for (const entry of searchIndex) {
    const label = pick(entry.group, locale);
    let group = byLabel.get(label);
    if (group === undefined) {
      group = { label, items: [] };
      byLabel.set(label, group);
      groups.push(group);
    }
    group.items.push({
      value: entry.href,
      label: pick(entry.title, locale),
      keywords: `${entry.title.ko} ${entry.title.en} ${entry.group.ko} ${entry.group.en}`,
      onSelect: () => window.location.assign(entry.href),
    });
  }
  return groups;
}

/**
 * Header search. The trigger is a library IconButton and the dialog is the
 * library CommandPalette, so the glass surface, grouping and keyboard handling
 * all come from the design system. Cmd/Ctrl+K opens it from anywhere on the page.
 *
 * `className` reaches the trigger only: the header passes the narrow-width size
 * rung so the row fits at 320px, and the palette dialog is unaffected.
 */
export function SearchPalette({ className }: { className?: string }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const groups = buildGroups(locale);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      setOpen((current) => !current);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <IconButton
        variant="ghost"
        icon={<MagnifyingGlass />}
        label={pick(m.search, locale)}
        aria-keyshortcuts="Meta+K Control+K"
        className={className}
        onClick={() => setOpen(true)}
      />
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={groups}
        placeholder={pick(m.searchPlaceholder, locale)}
        empty={pick(m.searchEmpty, locale)}
        hints={[
          [<Kbd key="move">↑↓</Kbd>, pick(m.searchMove, locale)],
          [<Kbd key="open">↵</Kbd>, pick(m.searchOpen, locale)],
        ]}
      />
    </>
  );
}
