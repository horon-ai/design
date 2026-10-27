import { Button as BaseButton } from "@base-ui/react/button";
import { CaretDown } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { Menu, MenuContent, MenuTrigger } from "./menu";

export type SplitButtonProps = Omit<ComponentProps<typeof BaseButton>, "className" | "children"> & {
  /** Primary action label. */
  children: ReactNode;
  /** 16px leading icon. */
  icon?: ReactNode;
  /** Menu items (`MenuItem`, `MenuSeparator`) opened by the caret. */
  menu?: ReactNode;
  menuLabel?: string;
  className?: string;
};

const halfClass =
  "relative inline-flex h-full cursor-pointer items-center motion-press select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40";

/** Paper `Split button` (1VGK-0): one primary pill, two hit areas split by a 1x18 bar. */
export function SplitButton({
  children,
  icon,
  menu,
  menuLabel = "More actions",
  disabled,
  className,
  ...props
}: SplitButtonProps) {
  return (
    <div
      className={cn(
        "inline-flex h-8 shrink-0 items-center rounded-full bg-interactive-primary text-label-md text-interactive-on-primary",
        className,
      )}
    >
      <BaseButton
        disabled={disabled}
        className={cn(halfClass, "gap-2 rounded-l-full pr-2 pl-4 [&_svg]:size-4")}
        {...props}
      >
        {icon && <span className="flex shrink-0">{icon}</span>}
        <span>{children}</span>
      </BaseButton>
      <span aria-hidden className="h-4.5 w-px shrink-0 bg-interactive-on-primary opacity-25" />
      <Menu>
        <MenuTrigger
          disabled={disabled}
          aria-label={menuLabel}
          className={cn(halfClass, "group rounded-r-full pr-4 pl-2")}
        >
          <CaretDown
            aria-hidden
            className="size-3.5 transition-transform duration-200 ease-out-quint group-data-popup-open:rotate-180"
          />
        </MenuTrigger>
        <MenuContent align="end">{menu}</MenuContent>
      </Menu>
    </div>
  );
}
