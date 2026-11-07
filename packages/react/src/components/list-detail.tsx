import { Collapsible } from "@base-ui/react/collapsible";
import { type ComponentProps, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { CodePanel } from "./code-panel";
import { LiquidGlass } from "./liquid-glass";

/** One selectable row of a {@link ListDetail} list. */
export type ListDetailItem = {
  /** Stable identifier; it is the value the selection reports and the React key. */
  id: string;
  /** Row title, drawn in mono and truncated to one line. */
  title: ReactNode;
  /** Secondary line under the title, in secondary colour. */
  meta?: ReactNode;
};

/** A captioned group of {@link ListDetailItem} rows. */
export type ListDetailGroup = {
  /** Stable identifier used as the group's React key. */
  id: string;
  /** Caption above the rows, in 11px semibold secondary text. */
  label: ReactNode;
  /** Rows of this group, in display order. */
  items: ListDetailItem[];
};

/** Props for {@link ListDetail}: the groups and one render function for the selected item. */
export type ListDetailProps = Omit<ComponentProps<"div">, "className" | "children" | "onChange"> & {
  /** Groups rendered into the left list; the flat order also drives the selection fallback. */
  groups: ListDetailGroup[];
  /** Controlled selected id. Leave unset to let the component hold the selection itself. */
  value?: string;
  /** Initial selection when uncontrolled. Falls back to the first item of the first group. */
  defaultValue?: string;
  /** Fires with the new id whenever a row is clicked, controlled or not. */
  onValueChange?: (id: string) => void;
  /** Renders the detail pane for the selected item. */
  children: (item: ListDetailItem) => ReactNode;
  /** `solid` (default) is an opaque surface shell with a default border; `glass` is the thick glass shell. */
  surface?: "solid" | "glass";
  /** Extra classes on the shell, merged after the built-in ones. */
  className?: string;
};

/**
 * Paper `List and detail` (1W6P-0): a 16px-radius shell, solid or thick glass, with a 250px list on an inset
 * surface and a detail pane. Selecting a row fills it in 150ms and swaps the detail with a short rise.
 *
 * Selection is controlled or uncontrolled like a native input: pass `value` to
 * own it, or `defaultValue` for the initial row. Below `sm` the two panes stack
 * instead of shrinking the list. The list is a `role="listbox"` whose rows are
 * `role="option"` buttons with `aria-selected`; they respond to clicks and the
 * keyboard's normal button activation.
 *
 * @example
 * ```tsx
 * <ListDetail
 *   groups={[
 *     {
 *       id: "sources",
 *       label: "Sources",
 *       items: [{ id: "readme", title: "README.md", meta: "2.1 KB" }],
 *     },
 *   ]}
 * >
 *   {(item) => (
 *     <>
 *       <ListDetailHeader title={item.title} description="Indexed 4 minutes ago" />
 *       <ListDetailMeta items={[{ id: "chunks", label: "Chunks", value: 42 }]} />
 *     </>
 *   )}
 * </ListDetail>
 * ```
 */
export function ListDetail({
  groups,
  value,
  defaultValue,
  onValueChange,
  children,
  surface = "solid",
  className,
  ...props
}: ListDetailProps) {
  const all = groups.flatMap((group) => group.items);
  const [inner, setInner] = useState(defaultValue ?? all[0]?.id);
  const selectedId = value ?? inner;
  const selected = all.find((item) => item.id === selectedId) ?? all[0];
  const mutedClass = "text-text-secondary";
  return (
    <div
      className={cn(
        // Below `sm` the two panes stack: the list would otherwise hold its 250px
        // and leave the detail pane nothing to render in.
        "relative flex w-full max-w-201.5 min-w-0 flex-col overflow-clip rounded-2xl sm:flex-row",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <div
        role="listbox"
        aria-label="Items"
        className={cn(
          "relative flex w-full shrink-0 flex-col gap-3 border-b border-border-default p-2.5 sm:w-62.5 sm:border-r sm:border-b-0",
          surface === "glass" ? "bg-transparent" : "bg-bg-inset",
        )}
      >
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-0.5">
            <span className={cn("px-3 py-1 text-label-sm font-semibold tracking-[0.04em]", mutedClass)}>
              {group.label}
            </span>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === selected?.id}
                data-selected={item.id === selected?.id ? "" : undefined}
                className="flex cursor-pointer flex-col gap-1 rounded-[10px] px-3 py-2.5 text-left motion-colors hover:bg-overlay-ink-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-selected:bg-overlay-ink-6 data-selected:hover:bg-overlay-ink-8"
                onClick={() => {
                  setInner(item.id);
                  onValueChange?.(item.id);
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="min-w-0 truncate font-mono text-label-md text-text-primary">{item.title}</span>
                </span>
                {item.meta && <span className={cn("text-label-sm", mutedClass)}>{item.meta}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div key={selected?.id} className="relative flex min-w-0 flex-1 motion-rise flex-col gap-5 px-6 py-5.5">
        {selected && children(selected)}
      </div>
    </div>
  );
}

/** Props for {@link ListDetailHeader}: a tile icon, title, description and a right-hand action cluster. */
export type ListDetailHeaderProps = Omit<ComponentProps<"div">, "className" | "title"> & {
  /** Glyph on the 40px sky tile; the tile only renders when this is set. */
  icon?: ReactNode;
  /** Detail title, drawn in mono at `label-lg` semibold. */
  title: ReactNode;
  /** One line under the title, in body-sm secondary colour. */
  description?: ReactNode;
  /** Right-hand cluster: a state label, a `Switch`, an icon button. */
  actions?: ReactNode;
  /** Extra classes on the row, merged after the built-in ones. */
  className?: string;
};

/** Detail header: a 40px sky tile with an 18px icon, title and description, actions on the right.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailHeader({ icon, title, description, actions, className, ...props }: ListDetailHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)} {...props}>
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 [&_svg]:size-5">
          {icon}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-mono text-label-lg font-semibold text-text-primary">{title}</span>
        {description && <span className="text-body-sm text-text-secondary">{description}</span>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}

/** Props for {@link ListDetailMeta}: the label/value pairs of the meta box. */
export type ListDetailMetaProps = Omit<ComponentProps<"dl">, "className"> & {
  /** Pairs rendered in a two-column grid, label over value. */
  items: {
    /** Stable identifier of the pair; its React key. */
    id: string;
    /** Term above the value, in `label-sm` secondary text. */
    label: ReactNode;
    /** Definition under the label, truncated to one line. */
    value: ReactNode;
  }[];
  /** Extra classes on the `dl`, merged after the built-in ones. */
  className?: string;
};

/** Meta box: a subtle-fill 12px-radius box with equal columns of a label over a 14/20 value.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailMeta({ items, className, ...props }: ListDetailMetaProps) {
  return (
    <dl
      className={cn("m-0 grid grid-cols-2 gap-x-4 gap-y-3 rounded-md bg-bg-subtle px-4 py-3.5", className)}
      {...props}
    >
      {items.map((item) => (
        <div key={item.id} className="flex min-w-0 flex-1 flex-col gap-0.5">
          <dt className="text-label-sm text-text-secondary">{item.label}</dt>
          <dd className="m-0 truncate text-label-md text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Props for {@link ListDetailInstructions}: the block heading, the text and the edit callback. */
export type ListDetailInstructionsProps = Omit<ComponentProps<"div">, "className" | "onChange"> & {
  /** Heading above the panel.
   * @default "Instructions" */
  title?: ReactNode;
  /** Small chip beside the title, such as the file name. */
  tag?: ReactNode;
  /** Controlled text. Leave unset to let the component hold the draft itself. */
  value?: string;
  /** Initial text when uncontrolled.
   * @default "" */
  defaultValue?: string;
  /** Fires with the full textarea value on every keystroke in edit mode. */
  onValueChange?: (value: string) => void;
  /** Extra classes on the wrapper, merged after the built-in ones. */
  className?: string;
};

function renderInstructions(text: string) {
  const lines = text.split("\n");
  let fences = 0;
  let offset = 0;
  return lines.map((line, index) => {
    const start = offset;
    offset += line.length + 1;
    if (line.trim() === "---") fences += 1;
    const key = fences === 1 ? /^([\w-]+:)(.*)$/.exec(line) : null;
    return (
      <span key={start}>
        {key ? (
          <>
            <span className="text-syntax-key">{key[1]}</span>
            {key[2]}
          </>
        ) : (
          line
        )}
        {index < lines.length - 1 && "\n"}
      </span>
    );
  });
}

/**
 * Instructions block: header with an Edit button and a code panel. Edit opens a textarea under the panel with
 * the 240ms collapse transition.
 */
export function ListDetailInstructions({
  title = "Instructions",
  tag,
  value,
  defaultValue = "",
  onValueChange,
  className,
  ...props
}: ListDetailInstructionsProps) {
  const [inner, setInner] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const text = value ?? inner;
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-label-md font-semibold text-text-primary">{title}</span>
        {tag && (
          <span className="inline-flex h-5.5 items-center rounded-full bg-overlay-ink-6 px-2 text-label-sm text-text-secondary">
            {tag}
          </span>
        )}
        <span className="flex-1" />
        <Button
          variant="solid"
          size="sm"
          aria-pressed={editing}
          onClick={() => setEditing((open) => !open)}
          className="w-16 justify-center px-0"
        >
          <span key={editing ? "done" : "edit"} className="animate-fade-in">
            {editing ? "Done" : "Edit"}
          </span>
        </Button>
      </div>
      <CodePanel>{renderInstructions(text)}</CodePanel>
      <Collapsible.Root open={editing} onOpenChange={setEditing}>
        <Collapsible.Panel className="motion-collapse">
          <textarea
            aria-label="Edit instructions"
            value={text}
            rows={6}
            className="block w-full resize-y rounded-[10px] border border-border-default bg-bg-inset px-4 py-3.5 font-mono text-[12px]/[21px] text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
            onChange={(event) => {
              setInner(event.target.value);
              onValueChange?.(event.target.value);
            }}
          />
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}

/** Props for {@link ListDetailFiles}: the row label and the chips it wraps. */
export type ListDetailFilesProps = Omit<ComponentProps<"div">, "className"> & {
  /** Heading above the chips.
   * @default "Files" */
  label?: ReactNode;
  /** Chips, usually a small `Button` with an icon. */
  children: ReactNode;
  /** Extra classes on the wrapper, merged after the built-in ones. */
  className?: string;
};

/** Files row: a 13/18 label over a wrap of 32px glass chips, 6px apart.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailFiles({ label = "Files", children, className, ...props }: ListDetailFilesProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="text-label-md font-semibold text-text-primary">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

/** Footer: a 1px top rule and 8px-spaced glass buttons; use `<span className="flex-1" />` as the spacer.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailFooter({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & {
  /** Extra classes on the row, merged after the built-in ones. */
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2 border-t border-border-default pt-3.5", className)}
      {...props}
    />
  );
}
