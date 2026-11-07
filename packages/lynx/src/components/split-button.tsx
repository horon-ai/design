import { Children, cloneElement, isValidElement, useState, type ReactNode } from "@lynx-js/react";

import { Icon, type IconProps } from "../icons";
import { cn } from "../lib/cn";
import { Menu, MenuContent, MenuTrigger } from "./menu";

/**
 * The button members react took from Base UI and, before that, from the DOM `button` element. Lynx has
 * no button element and no form, so the members a caller actually uses are declared here and forwarded
 * to the `view` that draws the control.
 */
type PortedButtonAttributes = {
  /** Runs when the primary half is tapped; a disabled pill never runs it. */
  onClick?: () => void;
  /** Blocks both halves, dims the pill to 40% and announces it as disabled. */
  disabled?: boolean;
  /** Kept for call-site parity. Lynx has no form submission, so it is inert. */
  type?: "button" | "submit" | "reset";
  /** Form field name. Accepted for call-site parity; Lynx has no form submission. */
  name?: string;
  /** Element id of the primary half, so a host or the gallery can address the native node. */
  id?: string;
  /** Accessible name of the primary half, replacing the one its label gives it. */
  "aria-label"?: string;
};

/**
 * Props of {@link SplitButton}: the button members react took from Base UI plus the label, icon and
 * menu the split pill adds. React's own type was `Omit<ComponentProps<typeof BaseButton>,
 * "className" | "children">` intersected with these members, so the shape stays one flat object.
 */
export type SplitButtonProps = Omit<PortedButtonAttributes, "className" | "children"> & {
  /** Primary action label, rendered at `label-md` inside the left half. */
  children: ReactNode;
  /** 16px leading icon. */
  icon?: ReactNode;
  /** Menu items (`MenuItem`, `MenuSeparator`) opened by the caret. Without it the pill is a single full-round button. */
  menu?: ReactNode;
  /** Accessible name of the caret trigger. @default "More actions" */
  menuLabel?: string;
  /** Extra classes on the pill container, which owns the fill, the press scale and the disabled dim. */
  className?: string;
};

/** The shared half classes: one hit area of the pill, its own rounding on the outer edge. */
const halfClass = "relative flex h-full flex-row items-center";

/** Sizes a caller's icon through the pill, as react's `[&_svg]:size-4` did. */
const tintIcon = (node: ReactNode): ReactNode =>
  isValidElement<IconProps>(node) && node.type === Icon ? cloneElement(node, { size: 16, color: "interactive-on-primary" }) : node;

/**
 * Paper `Split button` (1VGK-0): one primary pill on `Button`'s 32px rung, two hit areas split by a 1x18 bar.
 *
 * The container owns the primary fill, the 0.97 press scale and the 40% disabled dim, so both halves
 * stay one pill; the caret opens the menu aligned to the end and rotates while the popup is open.
 * Without `menu` there is no divider or caret and the button keeps a full round shape.
 *
 * On Lynx the caret half is a {@link MenuTrigger}, which paints one measuring wrapper and opens the
 * in-place fixed popup; the caret turns through an inline transform because there is no
 * `group-data-popup-open` selector. `type`, `name` and form submission stay accepted but inert, as on
 * {@link Button}.
 *
 * @example
 * ```tsx
 * import { MenuItem, SplitButton } from "@horon-ai/lynx";
 *
 * function Publish() {
 *   return (
 *     <SplitButton
 *       menuLabel="Publish options"
 *       onClick={() => publishNow()}
 *       menu={
 *         <>
 *           <MenuItem onClick={() => schedulePublish()}>Schedule</MenuItem>
 *           <MenuItem onClick={() => saveDraft()}>Save as draft</MenuItem>
 *         </>
 *       }
 *     >
 *       Publish
 *     </SplitButton>
 *   );
 * }
 * ```
 */
export function SplitButton({
  children,
  icon,
  menu,
  menuLabel = "More actions",
  disabled = false,
  className,
  onClick,
  type: _type,
  name: _name,
  id,
  "aria-label": ariaLabel,
}: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const isPlain = typeof children === "string" || typeof children === "number";
  const hasElementChild = Children.toArray(children).some((child) => typeof child !== "string" && typeof child !== "number");

  return (
    <view
      className={cn(
        "relative flex h-8 shrink-0 flex-row items-center rounded-full bg-interactive-primary text-interactive-on-primary",
        // The press and the disabled dim belong to the pill, not to one half: the fill is the container's,
        // so shrinking a half alone moves the label inside a fixed pill.
        disabled ? "opacity-40" : "motion-press",
        className,
      )}
    >
      <view
        className={cn(halfClass, "overflow-hidden", menu ? "gap-1.5 rounded-l-full pl-3 pr-2" : "gap-1.5 rounded-full px-3")}
        bindtap={disabled ? undefined : onClick}
        accessibility-element
        accessibility-traits={disabled ? "disabled" : "button"}
        accessibility-label={ariaLabel}
        {...(id === undefined ? {} : { id })}
      >
        {icon ? <view className="relative flex shrink-0 flex-row items-center">{tintIcon(icon)}</view> : null}
        <view className={cn("relative flex flex-row items-center", hasElementChild && "gap-1.5")}>
          {isPlain ? <text className="relative text-label-md text-interactive-on-primary text-trim">{children}</text> : children}
        </view>
      </view>
      {menu ? (
        <>
          <view className={cn("h-[18px] w-px shrink-0 bg-interactive-on-primary opacity-25")} accessibility-elements-hidden />
          <Menu open={open} onOpenChange={setOpen}>
            <MenuTrigger
              disabled={disabled}
              accessibility-label={menuLabel}
              // The container already dims the pill; MenuTrigger would dim this half a second time.
              className={cn("h-full rounded-r-full pl-2 pr-4", disabled && "opacity-100")}
            >
              <view
                className="flex flex-row items-center"
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transitionProperty: "transform",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                accessibility-elements-hidden
              >
                <Icon name="CaretDown" size={14} color="interactive-on-primary" />
              </view>
            </MenuTrigger>
            <MenuContent align="end">{menu}</MenuContent>
          </Menu>
        </>
      ) : null}
    </view>
  );
}
