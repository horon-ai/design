import { useMemo } from "@lynx-js/react";

import { Icon, useIconColor, type IconColor, type IconName } from "../icons";
import { cn } from "../lib/cn";

/**
 * Props of the React elements this port replaces, keyed by React's own tag. Each entry lists only what
 * the Lynx wrapper can honour, so the mapping from a DOM element to its Lynx counterpart is explicit
 * instead of implied.
 */
type PortedElementProps = {
  /** React's `svg`; Lynx draws one from a markup string, so only the wrapper's own class survives. */
  svg: { className?: string };
};

/**
 * Props for the Horon mark: React's `svg` attributes minus `children`, plus the size and the tint.
 *
 * React spread the remaining `svg` attributes onto the element; a Lynx `<svg content>` view takes only
 * markup and a box, so the accepted surface narrows to the class, the size and the colour.
 */
export type HoronIconProps = Omit<PortedElementProps["svg"], "children"> & {
  /**
   * Width and height together: a px number, or a CSS length such as `1em`. Lynx resolves a length against
   * the font size on the web engine only, so pass a number where the size must be exact.
   * @default "1em"
   */
  size?: number | string;
  /**
   * The colour. React's mark took `currentColor`; a Lynx `<svg content>` string cannot read a CSS
   * variable, so the fill is substituted here instead: a token name resolves through the active scheme,
   * a hex string is used as-is. Defaults to the primary text token.
   */
  color?: IconColor;
};

/** Figma `icon/horon` (256:9116): the falcon eye, drawn in a 22 x 22 box. */
const HORON_PATH =
  "M20.1444 5.12948C19.6411 5.2126 19.307 5.26623 17.0453 5.62287C16.2541 5.74889 15.3486 5.89369 15.0343 5.94464C14.72 5.99559 14.1221 6.09212 13.7045 6.15915C9.0054 6.918 6.10856 7.48379 3.04688 8.23996C1.89737 8.52419 1.98968 8.44911 1.05997 9.83005C0.251141 11.026 0.255537 11.0233 0.240152 11.0984C0.198391 11.2914 0.279714 11.5194 0.415984 11.5998C0.55665 11.6802 0.653358 11.6588 1.1347 11.4255C2.09079 10.9643 2.63807 10.7096 2.65345 10.7203C2.66005 10.7257 2.73038 10.8436 2.80511 10.9804C4.99202 14.9302 7.76138 16.9386 11.0231 16.9359C13.3616 16.9359 15.2892 16.0054 17.397 13.8603C18.1245 13.1229 19.6411 11.337 19.7246 11.1225C19.8191 10.8865 19.8015 10.6157 19.6828 10.4146C19.6059 10.2832 17.7179 8.63145 16.7376 7.84042C16.5992 7.7278 16.5003 7.63127 16.5178 7.62859C16.5354 7.62322 16.8981 7.56155 17.3201 7.48647C17.7443 7.41407 18.4674 7.28804 18.9311 7.20492C19.3949 7.12447 20.1686 6.99845 20.6521 6.92337C21.1356 6.85097 21.5466 6.77857 21.5686 6.76516C21.6851 6.6874 21.7708 6.50774 21.7708 6.34417C21.7708 6.2101 21.7159 6.10016 21.4258 5.64968C21.0191 5.02222 20.951 4.99541 20.1444 5.12948ZM14.9485 8.37403C16.0079 9.18919 18.0564 10.8865 18.0564 10.9482C18.0564 10.9616 17.9047 11.1627 17.7223 11.3933C15.4409 14.2464 13.4034 15.4879 11.0121 15.4825C8.2735 15.4745 5.93053 13.7932 4.1722 10.5701C3.97219 10.2001 3.84911 9.95608 3.8601 9.94267C3.91285 9.881 6.76134 9.25086 8.00096 9.02562C8.20756 8.98808 8.50428 8.93445 8.66033 8.90495C8.81858 8.87814 8.95924 8.85401 8.97683 8.85401C8.99221 8.85401 8.93506 8.94518 8.84935 9.0578C7.69984 10.5326 8.03173 12.911 9.51971 13.8469C11.0846 14.8336 12.966 13.5841 13.1572 11.4282C13.2583 10.2913 12.7396 9.08461 11.9066 8.51883C11.8209 8.45983 11.7484 8.4062 11.7484 8.39816C11.7484 8.38475 14.2606 7.97986 14.3771 7.97181C14.4013 7.96913 14.6584 8.15147 14.9485 8.37403Z";

/**
 * Figma `icon/horon` (256:9116): the line falcon eye that stands in for Horon in
 * navigation. Phosphor has no equivalent, so the path is copied from the Tab bar
 * (63:441) export. It fills with the theme colour and sizes like a Phosphor icon.
 *
 * React drew it with `fill="currentColor"` and `aria-hidden`; Lynx renders SVG from a markup string
 * that cannot resolve a CSS variable, so the fill comes from `color`, and the wrapper keeps the mark
 * out of the accessibility tree exactly as `aria-hidden` did.
 *
 * @example
 * ```tsx
 * import { HoronIcon } from "@horon-ai/lynx";
 *
 * function BrandMark() {
 *   return (
 *     <view className="flex size-10 items-center justify-center rounded-full bg-bg-subtle">
 *       <HoronIcon size={22} color="text-primary" />
 *     </view>
 *   );
 * }
 * ```
 */
export function HoronIcon({ size = "1em", color = "text-primary", className }: HoronIconProps) {
  const fill = useIconColor(color);
  const dimension = typeof size === "number" ? `${size}px` : size;

  const content = useMemo(
    () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="${fill}"><path d="${HORON_PATH}"/></svg>`,
    [fill],
  );

  return (
    <view
      className={cn("flex", className)}
      style={{ width: dimension, height: dimension }}
      accessibility-elements-hidden
    >
      <svg content={content} style={{ width: "100%", height: "100%" }} />
    </view>
  );
}

/**
 * Paper's icon contract: every icon is a component named `icon/<name>`. `iconNames` is that list in
 * Paper order. Paper draws three sizes (16 in small controls and captions, 20 in buttons and rows,
 * 24 in bars and empty states); 12, 14, 18 and 22 elsewhere in the code stay as they are.
 *
 * The tuple is the single source of the registry: `HoronIconName` derives from it and `phosphorGlyphs`
 * must map every entry except `horon`, so a name added here fails to type-check until it has a glyph.
 */
export const iconNames = [
  "plus",
  "x",
  "check",
  "minus",
  "chevron-down",
  "chevron-right",
  "chevron-left",
  "search",
  "send",
  "arrow-up",
  "arrow-right",
  "bot",
  "user",
  "settings",
  "bell",
  "info",
  "circle-alert",
  "circle-check",
  "triangle-alert",
  "inbox",
  "mail",
  "calendar",
  "paperclip",
  "mic",
  "ellipsis",
  "copy",
  "log-out",
  "sparkles",
  "eye",
  "trash",
  "globe",
  "question",
  "drop",
  "list-checks",
  "grid",
  "key",
  "external-link",
  "caret-up-down",
  "user-plus",
  "folder",
  "thumbs-up",
  "arrow-clockwise",
  "image",
  "plug",
  "thumbs-down",
  "chat-circle",
  "command",
  "enter",
  "wrench",
  "clock",
  "repeat",
  "house",
  "file-text",
  "git-pull-request",
  "upload",
  "archive",
  "stop",
  "sliders",
  "lightning",
  "pause",
  "play",
  "arrow-down",
  "scan",
  "file-pdf",
  "brain",
  "bookmark-simple",
  "files",
  "list",
  "horon",
  "cube",
  "code",
  "clipboard-text",
  "megaphone",
  "pen-nib",
  "chart-line-up",
  "flask",
  "users-three",
  "pencil-simple",
  "plus-circle",
] as const;

/** Every registered icon name: a literal union derived from `iconNames`. */
export type HoronIconName = (typeof iconNames)[number];

/**
 * Registry name → the phosphor component name the shared `<Icon>` draws. Lynx has no Phosphor
 * components to reference, so the map holds names instead of components; the generated glyph table
 * behind `Icon` owns the artwork.
 */
const phosphorGlyphs: Record<Exclude<HoronIconName, "horon">, IconName> = {
  plus: "Plus",
  x: "X",
  check: "Check",
  minus: "Minus",
  "chevron-down": "CaretDown",
  "chevron-right": "CaretRight",
  "chevron-left": "CaretLeft",
  search: "MagnifyingGlass",
  send: "PaperPlaneTilt",
  "arrow-up": "ArrowUp",
  "arrow-right": "ArrowRight",
  bot: "Robot",
  user: "User",
  settings: "Gear",
  bell: "Bell",
  info: "Info",
  "circle-alert": "WarningCircle",
  "circle-check": "CheckCircle",
  "triangle-alert": "Warning",
  inbox: "Tray",
  mail: "EnvelopeSimple",
  calendar: "CalendarBlank",
  paperclip: "Paperclip",
  mic: "Microphone",
  ellipsis: "DotsThree",
  copy: "Copy",
  "log-out": "SignOut",
  sparkles: "Sparkle",
  eye: "Eye",
  trash: "Trash",
  globe: "Globe",
  question: "Question",
  drop: "Drop",
  "list-checks": "ListChecks",
  grid: "SquaresFour",
  key: "Key",
  "external-link": "ArrowSquareOut",
  "caret-up-down": "CaretUpDown",
  "user-plus": "UserPlus",
  folder: "Folder",
  "thumbs-up": "ThumbsUp",
  "arrow-clockwise": "ArrowClockwise",
  image: "Image",
  plug: "Plug",
  "thumbs-down": "ThumbsDown",
  "chat-circle": "ChatCircle",
  command: "Command",
  enter: "ArrowElbowDownLeft",
  wrench: "Wrench",
  clock: "Clock",
  repeat: "Repeat",
  house: "House",
  "file-text": "FileText",
  "git-pull-request": "GitPullRequest",
  upload: "UploadSimple",
  archive: "Archive",
  stop: "Stop",
  sliders: "SlidersHorizontal",
  lightning: "Lightning",
  pause: "Pause",
  play: "Play",
  "arrow-down": "ArrowDown",
  scan: "Scan",
  "file-pdf": "FilePdf",
  brain: "Brain",
  "bookmark-simple": "BookmarkSimple",
  files: "Files",
  list: "List",
  cube: "Cube",
  code: "Code",
  "clipboard-text": "ClipboardText",
  megaphone: "Megaphone",
  "pen-nib": "PenNib",
  "chart-line-up": "ChartLineUp",
  flask: "Flask",
  "users-three": "UsersThree",
  "pencil-simple": "PencilSimple",
  "plus-circle": "PlusCircle",
};

/**
 * Props for `HoronGlyph`: React's `svg` attributes minus `children` and `ref`, plus the registry name,
 * the size and the tint. The same narrowing as {@link HoronIconProps} applies, because the glyph is
 * drawn through the same markup-string element.
 */
export type HoronGlyphProps = Omit<PortedElementProps["svg"], "children" | "ref"> & {
  /** Which registered glyph to draw; `horon` resolves to the Horon mark instead of a Phosphor icon. */
  name: HoronIconName;
  /** Paper sizes are 16, 20 and 24. A number is used as px; a length keeps its digits. @default 20 */
  size?: number | string;
  /** The colour, as a token name or a hex string. Defaults to the primary text token. */
  color?: IconColor;
};

/** Reads the px value out of a size that `Icon` needs as a number; a length falls back to its digits. */
const pxSize = (size: number | string, fallback: number): number => {
  if (typeof size === "number") return size;
  const parsed = Number.parseFloat(size);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Figma `icon/<name>`: resolves a registry name to its glyph. The parent's colour drives it through
 * `color`, which defaults to the primary text token.
 *
 * The runtime lookup behind an icon name stored as data (a tool's icon, a settings row): `horon`
 * returns {@link HoronIcon}, everything else the matching Phosphor glyph through the shared
 * `<Icon>`. The glyph stays out of the accessibility tree, as it did in React; put the meaning on the
 * surrounding button or label.
 *
 * @example
 * ```tsx
 * import { HoronGlyph, type HoronIconName } from "@horon-ai/lynx";
 *
 * function ToolIcon({ icon }: { icon: HoronIconName }) {
 *   return <HoronGlyph name={icon} size={20} color="text-secondary" />;
 * }
 * ```
 */
export function HoronGlyph({ name, size = 20, color = "text-primary", className }: HoronGlyphProps) {
  if (name === "horon") return <HoronIcon size={size} color={color} className={className} />;
  const glyph = phosphorGlyphs[name];
  return <Icon name={glyph} size={pxSize(size, 20)} weight="regular" color={color} className={className} />;
}
