import { Collapsible } from "@base-ui/react/collapsible";
import { type ComponentProps, type ReactNode, useState } from "react";

import { cn } from "../lib/cn";
import { Button } from "./button";
import { LiquidGlass } from "./liquid-glass";

export type ListDetailItem = {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
};

export type ListDetailGroup = {
  id: string;
  label: ReactNode;
  items: ListDetailItem[];
};

export type ListDetailProps = Omit<ComponentProps<"div">, "className" | "children" | "onChange"> & {
  groups: ListDetailGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Renders the detail pane for the selected item. */
  children: (item: ListDetailItem) => ReactNode;
  className?: string;
};

/**
 * Paper `List and detail` (1W6P-0): a 16px-radius thick-glass shell with a 250px list on an inset surface
 * and a detail pane. Selecting a row fills it in 150ms and swaps the detail with a short rise.
 */
export function ListDetail({
  groups,
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  ...props
}: ListDetailProps) {
  const all = groups.flatMap((group) => group.items);
  const [inner, setInner] = useState(defaultValue ?? all[0]?.id);
  const selectedId = value ?? inner;
  const selected = all.find((item) => item.id === selectedId) ?? all[0];
  return (
    <div
      className={cn("relative flex w-full max-w-201.5 overflow-clip rounded-2xl bg-glass-thick", className)}
      {...props}
    >
      <LiquidGlass tier="thick" />
      <div
        role="listbox"
        aria-label="Items"
        className="relative flex w-62.5 shrink-0 flex-col gap-3 border-r border-border-default bg-bg-inset p-2.5"
      >
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-0.5">
            <span className="px-3 py-1 text-[11px]/[14px] font-semibold tracking-[0.4px] text-text-placeholder">
              {group.label}
            </span>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={item.id === selected?.id}
                data-selected={item.id === selected?.id ? "" : undefined}
                className="flex cursor-pointer flex-col gap-1 rounded-[10px] px-3 py-2.5 text-left motion-colors hover:bg-overlay-ink-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-selected:bg-interactive-secondary"
                onClick={() => {
                  setInner(item.id);
                  onValueChange?.(item.id);
                }}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden className="size-1.75 shrink-0 rounded-full bg-sky-500" />
                  <span className="min-w-0 truncate font-mono text-[13px]/[18px] font-medium text-text-primary">
                    {item.title}
                  </span>
                </span>
                {item.meta && <span className="pl-3.75 text-[12px]/[16px] text-text-placeholder">{item.meta}</span>}
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

export type ListDetailHeaderProps = Omit<ComponentProps<"div">, "className" | "title"> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Right-hand cluster: a state label, a `Switch`, an icon button. */
  actions?: ReactNode;
  className?: string;
};

/** Detail header: a 40px sky tile with an 18px icon, title and description, actions on the right. */
export function ListDetailHeader({ icon, title, description, actions, className, ...props }: ListDetailHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      {icon && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 [&_svg]:size-4.5">
          {icon}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-mono text-[16px]/[22px] font-semibold text-text-primary">{title}</span>
        {description && <span className="text-[13px]/[18px] text-text-secondary">{description}</span>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </div>
  );
}

export type ListDetailMetaProps = Omit<ComponentProps<"dl">, "className"> & {
  items: { id: string; label: ReactNode; value: ReactNode }[];
  className?: string;
};

/** Meta box: a neutral-50 12px-radius box with equal columns of a label over a 14/20 value. */
export function ListDetailMeta({ items, className, ...props }: ListDetailMetaProps) {
  return (
    <dl
      className={cn(
        "m-0 grid grid-cols-2 gap-x-4 gap-y-3 rounded-md bg-neutral-50 px-4 py-3.5 dark:bg-neutral-800",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <div key={item.id} className="flex min-w-0 flex-1 flex-col gap-0.5">
          <dt className="text-[12px]/[16px] font-medium text-text-placeholder">{item.label}</dt>
          <dd className="m-0 truncate text-[14px]/[20px] font-medium text-text-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export type ListDetailInstructionsProps = Omit<ComponentProps<"div">, "className" | "onChange"> & {
  title?: ReactNode;
  /** Small chip beside the title, such as the file name. */
  tag?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
      <div className="flex items-center gap-2">
        <span className="text-[13px]/[18px] font-semibold text-text-primary">{title}</span>
        {tag && (
          <span className="inline-flex h-5.5 items-center rounded-full bg-overlay-ink-6 px-2 text-[12px]/[16px] font-medium text-text-secondary">
            {tag}
          </span>
        )}
        <span className="flex-1" />
        <Button variant="glass" size="sm" aria-pressed={editing} onClick={() => setEditing((open) => !open)}>
          {editing ? "Done" : "Edit"}
        </Button>
      </div>
      <pre className="font-normal m-0 overflow-x-auto rounded-[10px] border border-border-default bg-neutral-50 px-4 py-3.5 font-mono text-[12px]/[19px] whitespace-pre text-syntax-string dark:bg-neutral-800">
        {renderInstructions(text)}
      </pre>
      <Collapsible.Root open={editing} onOpenChange={setEditing}>
        <Collapsible.Panel className="motion-collapse">
          <textarea
            aria-label="Edit instructions"
            value={text}
            rows={6}
            className="mt-1 block w-full resize-y rounded-[10px] border border-border-default bg-bg-inset px-4 py-3 font-mono text-[12px]/[19px] text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand"
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

export type ListDetailFilesProps = Omit<ComponentProps<"div">, "className"> & {
  label?: ReactNode;
  /** Chips, usually `Button` with `variant="glass"` and an icon. */
  children: ReactNode;
  className?: string;
};

/** Files row: a 13/18 label over a wrap of 32px glass chips, 6px apart. */
export function ListDetailFiles({ label = "Files", children, className, ...props }: ListDetailFilesProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="text-[13px]/[18px] font-semibold text-text-primary">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

/** Footer: a 1px top rule and 8px-spaced glass buttons; use `<span className="flex-1" />` as the spacer. */
export function ListDetailFooter({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & { className?: string }) {
  return <div className={cn("flex items-center gap-2 border-t border-border-default pt-3.5", className)} {...props} />;
}
