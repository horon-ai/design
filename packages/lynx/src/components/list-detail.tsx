import { cloneElement, isValidElement, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";
import { primitives } from "@horon-ai/tokens";

import { useMediaQuery } from "../hooks/use-media-query";
import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { useHoronTheme } from "../provider";
import { Button } from "./button";
import { CodePanel } from "./code-panel";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx wrapper can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties; id?: string };
  /** React's `dl`; Lynx has no description list, so the meta box is a `view`. */
  dl: { className?: string; style?: CSSProperties; id?: string };
};

/** One selectable row of a {@link ListDetail} list. */
export type ListDetailItem = {
  /** Stable identifier; it is the value the selection reports and the list key. */
  id: string;
  /** Row title, drawn in mono and truncated to one line. */
  title: ReactNode;
  /** Secondary line under the title, in secondary colour. */
  meta?: ReactNode;
};

/** A captioned group of {@link ListDetailItem} rows. */
export type ListDetailGroup = {
  /** Stable identifier used as the group's key. */
  id: string;
  /** Caption above the rows, in 11px semibold secondary text. */
  label: ReactNode;
  /** Rows of this group, in display order. */
  items: ListDetailItem[];
};

/** Props for {@link ListDetail}: the groups and one render function for the selected item. */
export type ListDetailProps = Omit<PortedElementProps["div"], "className" | "children" | "onChange"> & {
  /** Groups rendered into the left list; the flat order also drives the selection fallback. */
  groups: ListDetailGroup[];
  /** Controlled selected id. Leave unset to let the component hold the selection itself. */
  value?: string;
  /** Initial selection when uncontrolled. Falls back to the first item of the first group. */
  defaultValue?: string;
  /** Fires with the new id whenever a row is tapped, controlled or not. */
  onValueChange?: (id: string) => void;
  /** Renders the detail pane for the selected item. */
  children: (item: ListDetailItem) => ReactNode;
  /** `solid` (default) is an opaque surface shell with a default border; `glass` is the thick glass shell. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes on the shell, merged after the built-in ones. */
  className?: string;
};

/** Text slots take a string so the component can put the token classes on a `<text>`; Lynx does not inherit type. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** Tailwind's `sm` rung: below it the two panes stack instead of squeezing the detail pane. */
const STACK_QUERY = "(max-width: 639px)";

/**
 * Paper `List and detail` (1W6P-0): a 16px-radius shell, solid or thick glass, with a 250px list on an inset
 * surface and a detail pane. Selecting a row fills it and swaps the detail with a short rise.
 *
 * Selection is controlled or uncontrolled like a native input: pass `value` to
 * own it, or `defaultValue` for the initial row. Below `sm` the two panes stack
 * instead of shrinking the list, which Lynx reads from `useMediaQuery` because it
 * has no media-query class variants. The list is a scroll-view whose rows are
 * `option`-role views announced as selected, and it scrolls when its host gives
 * it a height.
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
  style,
  id,
}: ListDetailProps) {
  const all = groups.flatMap((group) => group.items);
  const [inner, setInner] = useState(defaultValue ?? all[0]?.id);
  const selectedId = value ?? inner;
  const selected = all.find((item) => item.id === selectedId) ?? all[0];
  const stacked = useMediaQuery(STACK_QUERY);
  return (
    <view
      className={cn(
        // Below `sm` the two panes stack: the list would otherwise hold its 250px
        // and leave the detail pane nothing to render in.
        "relative flex w-full min-w-0 max-w-[806px] flex-col overflow-hidden rounded-2xl",
        stacked ? "" : "flex-row",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {surface === "glass" && <LiquidGlass />}
      <scroll-view
        scroll-y
        scroll-bar-enable={false}
        className={cn(
          "relative flex w-full shrink-0 flex-col gap-3 p-2.5",
          stacked ? "border-b border-border-default" : "w-[250px] border-r border-border-default",
          surface === "glass" ? "bg-transparent" : "bg-bg-inset",
        )}
        accessibility-element
        accessibility-role-description="listbox"
        accessibility-label="Items"
      >
        {groups.map((group) => (
          <view key={group.id} className="flex flex-col gap-0.5">
            <view className="px-3 py-1">
              {isPlainText(group.label) ? (
                <text className="text-label-sm font-semibold tracking-[0.04em] text-text-secondary">{group.label}</text>
              ) : (
                group.label
              )}
            </view>
            {group.items.map((item) => {
              const isSelected = item.id === selected?.id;
              return (
                <view
                  key={item.id}
                  className={cn(
                    "motion-colors relative flex flex-col gap-1 rounded-[10px] px-3 py-2.5",
                    isSelected ? "bg-overlay-ink-6 active:bg-overlay-ink-8" : "active:bg-overlay-ink-4",
                  )}
                  bindtap={() => {
                    setInner(item.id);
                    onValueChange?.(item.id);
                  }}
                  accessibility-element
                  accessibility-traits="button"
                  accessibility-role-description="option"
                  accessibility-value={isSelected ? "selected" : "unselected"}
                >
                  <view className="flex flex-row items-center gap-2">
                    {isPlainText(item.title) ? (
                      <text
                        className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-label-md text-text-primary"
                        text-maxline="1"
                      >
                        {item.title}
                      </text>
                    ) : (
                      item.title
                    )}
                  </view>
                  {item.meta ? (
                    isPlainText(item.meta) ? (
                      <text className="text-label-sm text-text-secondary">{item.meta}</text>
                    ) : (
                      item.meta
                    )
                  ) : null}
                </view>
              );
            })}
          </view>
        ))}
      </scroll-view>
      <view key={selected?.id} className="motion-rise relative flex min-w-0 flex-1 flex-col gap-5 px-6 py-[22px]">
        {selected && children(selected)}
      </view>
    </view>
  );
}

/** Props for {@link ListDetailHeader}: a tile icon, title, description and a right-hand action cluster. */
export type ListDetailHeaderProps = Omit<PortedElementProps["div"], "className" | "title"> & {
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

/** React sized the tile's glyph through `[&_svg]:size-5`; a Lynx `<Icon>` takes the px number. */
const HEADER_ICON_SIZE = 20;

/**
 * Detail header: a 40px sky tile with a 20px icon, title and description, actions on the right.
 *
 * React swapped the tile's sky tint with `dark:` variants; Lynx has no media-query variants, so the
 * scheme is read from {@link useHoronTheme} and the tile and its glyph take the matching pair.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailHeader({ icon, title, description, actions, className, style, id }: ListDetailHeaderProps) {
  const theme = useHoronTheme();
  const dark = theme.scheme === "dark";
  const glyph =
    isValidElement<IconProps>(icon) && icon.type === Icon
      ? cloneElement(icon, {
          size: HEADER_ICON_SIZE,
          color: dark ? primitives["sky-300"] : primitives["sky-700"],
        })
      : icon;

  return (
    <view
      className={cn("flex flex-row flex-wrap items-center gap-3", className)}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {icon ? (
        <view
          className={cn(
            "flex size-10 shrink-0 flex-row items-center justify-center rounded-[10px]",
            dark ? "bg-sky-900" : "bg-sky-100",
          )}
        >
          {glyph}
        </view>
      ) : null}
      <view className="flex min-w-0 flex-1 flex-col">
        {isPlainText(title) ? (
          <text className="font-mono text-label-lg font-semibold text-text-primary">{title}</text>
        ) : (
          title
        )}
        {description ? (
          isPlainText(description) ? (
            <text className="text-body-sm text-text-secondary">{description}</text>
          ) : (
            description
          )
        ) : null}
      </view>
      {actions ? <view className="relative flex shrink-0 flex-row items-center gap-3">{actions}</view> : null}
    </view>
  );
}

/** Props for {@link ListDetailMeta}: the label/value pairs of the meta box. */
export type ListDetailMetaProps = Omit<PortedElementProps["dl"], "className"> & {
  /** Pairs rendered as a two-column grid, label over value. */
  items: {
    /** Stable identifier of the pair; its key. */
    id: string;
    /** Term above the value, in `label-sm` secondary text. */
    label: ReactNode;
    /** Definition under the label, truncated to one line. */
    value: ReactNode;
  }[];
  /** Extra classes on the box, merged after the built-in ones. */
  className?: string;
};

/**
 * Meta box: a subtle-fill 12px-radius box with equal columns of a label over a 14/20 value.
 *
 * Lynx has no CSS grid, so the two columns are flex items grown from a half-width basis.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailMeta({ items, className, style, id }: ListDetailMetaProps) {
  return (
    <view
      className={cn("flex flex-row flex-wrap gap-x-4 gap-y-3 rounded-md bg-bg-subtle px-4 py-3.5", className)}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {items.map((item) => (
        <view key={item.id} className="flex min-w-0 flex-1 flex-col gap-0.5" style={{ flexBasis: "calc(50% - 8px)" }}>
          {isPlainText(item.label) ? (
            <text className="text-label-sm text-text-secondary">{item.label}</text>
          ) : (
            item.label
          )}
          {isPlainText(item.value) ? (
            <text
              className="overflow-hidden text-ellipsis whitespace-nowrap text-label-md text-text-primary"
              text-maxline="1"
            >
              {item.value}
            </text>
          ) : (
            item.value
          )}
        </view>
      ))}
    </view>
  );
}

/** Props for {@link ListDetailInstructions}: the block heading, the text and the edit callback. */
export type ListDetailInstructionsProps = Omit<PortedElementProps["div"], "className" | "onChange"> & {
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

/** The only part of a Lynx textarea event this block reads. */
type LynxTextEvent = { detail: { value: string } };

/** Colors the `key:` prefixes of a front-matter block, one line per array entry, keeping the line breaks. */
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
      <text key={start}>
        {key ? (
          <>
            <text className="text-syntax-key">{key[1]}</text>
            {key[2]}
          </>
        ) : (
          line
        )}
        {index < lines.length - 1 && "\n"}
      </text>
    );
  });
}

/**
 * Instructions block: header with an Edit button and a code panel. Edit opens a textarea under the panel.
 *
 * Lynx has no collapsible primitive and no measured height transition, so the editor is mounted only while
 * editing instead of sliding open over 240ms; the button's label still crossfades because it is re-keyed.
 */
export function ListDetailInstructions({
  title = "Instructions",
  tag,
  value,
  defaultValue = "",
  onValueChange,
  className,
  style,
  id,
}: ListDetailInstructionsProps) {
  const [inner, setInner] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const text = value ?? inner;
  return (
    <view className={cn("flex flex-col gap-2", className)} style={style} {...(id === undefined ? {} : { id })}>
      <view className="flex flex-row flex-wrap items-center gap-2">
        {isPlainText(title) ? <text className="text-label-md font-semibold text-text-primary">{title}</text> : title}
        {tag ? (
          <view className="flex h-[22px] flex-row items-center rounded-full bg-overlay-ink-6 px-2">
            {isPlainText(tag) ? <text className="text-label-sm text-text-secondary">{tag}</text> : tag}
          </view>
        ) : null}
        <view className="flex-1" />
        <Button
          variant="solid"
          size="sm"
          onClick={() => setEditing((open) => !open)}
          className="w-16 justify-center px-0"
        >
          <text
            key={editing ? "done" : "edit"}
            className="text-trim text-label-md text-text-primary"
            style={{
              animationName: "fade-in",
              animationDuration: "160ms",
              animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              animationFillMode: "both",
            }}
          >
            {editing ? "Done" : "Edit"}
          </text>
        </Button>
      </view>
      <CodePanel>{renderInstructions(text)}</CodePanel>
      {editing ? (
        <textarea
          accessibility-label="Edit instructions"
          className="h-[154px] w-full rounded-[10px] border border-border-default bg-bg-inset px-4 py-3.5 font-mono text-[12px]/[21px] text-text-primary"
          default-value={text}
          bindinput={(event: LynxTextEvent) => {
            setInner(event.detail.value);
            onValueChange?.(event.detail.value);
          }}
        />
      ) : null}
    </view>
  );
}

/** Props for {@link ListDetailFiles}: the row label and the chips it wraps. */
export type ListDetailFilesProps = Omit<PortedElementProps["div"], "className"> & {
  /** Heading above the chips.
   * @default "Files" */
  label?: ReactNode;
  /** Chips, usually a small `Button` with an icon. */
  children: ReactNode;
  /** Extra classes on the wrapper, merged after the built-in ones. */
  className?: string;
};

/**
 * Files row: a 13/18 label over a wrap of 32px glass chips, 6px apart.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailFiles({ label = "Files", children, className, style, id }: ListDetailFilesProps) {
  return (
    <view className={cn("flex flex-col gap-2", className)} style={style} {...(id === undefined ? {} : { id })}>
      {isPlainText(label) ? <text className="text-label-md font-semibold text-text-primary">{label}</text> : label}
      <view className="flex flex-row flex-wrap gap-1.5">{children}</view>
    </view>
  );
}

/**
 * Footer: a 1px top rule and 8px-spaced glass buttons; use `<view className="flex-1" />` as the spacer.
 *
 * Part of {@link ListDetail}.
 */
export function ListDetailFooter({
  className,
  children,
  style,
  id,
}: Omit<PortedElementProps["div"], "className"> & { className?: string; children?: ReactNode }) {
  return (
    <view
      className={cn("flex flex-row flex-wrap items-center gap-2 border-t border-border-default pt-3.5", className)}
      style={style}
      {...(id === undefined ? {} : { id })}
    >
      {children}
    </view>
  );
}
