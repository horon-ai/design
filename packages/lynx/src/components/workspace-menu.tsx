import type { ReactElement, ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTile, MenuTrigger } from "./menu";

/**
 * One workspace listed in {@link WorkspaceMenu}.
 */
export type WorkspaceMenuItem = {
  /** Stable identifier returned by `onValueChange` and compared with `value`. */
  id: string;
  /** Workspace name shown in the row. */
  name: string;
  /** Caption under the name, such as "12 members". */
  meta?: ReactNode;
  /** Tile initial; defaults to the first letter of the name. */
  initial?: string;
};

/**
 * Props for {@link WorkspaceMenu}.
 */
export type WorkspaceMenuProps = {
  /** Workspaces in menu order; the current one gets a check. */
  workspaces: WorkspaceMenuItem[];
  /** Id of the current workspace. */
  value: string;
  /** Called with the picked workspace id; pressing the current one calls it too. */
  onValueChange?: (id: string) => void;
  /** Called by the "New workspace" row; the row stays visible when omitted. */
  onCreate?: () => void;
  /** Called by the "Workspace settings" row; the row stays visible when omitted. */
  onSettings?: () => void;
  /**
   * The element that opens the menu, such as the sidebar workspace button. React
   * took it as `MenuTrigger` through the `"render"` prop, which made the caller
   * element the trigger and put `triggerChildren` inside it. Lynx cannot clone a
   * host element with children, so the element and `triggerChildren` are painted
   * side by side inside the measuring trigger wrapper and the wrapper owns the
   * press binding.
   */
  trigger: ReactElement;
  /** Content of the trigger when `trigger` renders a plain element rather than taking children. */
  triggerChildren?: ReactNode;
  /** Extra classes for the trigger element. */
  triggerClassName?: string;
  /** Menu heading above the workspace rows. @default "Workspaces" */
  label?: ReactNode;
  /** Extra classes for the menu popup. */
  className?: string;
};

/**
 * Paper `Workspace menu`: solid 256px menu listing workspaces with a check on the current one.
 *
 * Wraps the package {@link Menu} in a solid surface so the popup stays readable over any background.
 * Each row shows a tile with the workspace initial and fades a check in on the selected id; a separator
 * then offers "New workspace" and "Workspace settings". The menu is anchored to `trigger` and opens
 * below it, aligned to the start edge.
 *
 * @example
 * ```tsx
 * import { Button, WorkspaceMenu } from "@horon-ai/lynx";
 * import { useState } from "@lynx-js/react";
 *
 * function Example() {
 *   const [current, setCurrent] = useState("acme");
 *   return (
 *     <WorkspaceMenu
 *       workspaces={[
 *         { id: "acme", name: "Acme" },
 *         { id: "labs", name: "Labs", meta: "4 members" },
 *       ]}
 *       value={current}
 *       onValueChange={setCurrent}
 *       trigger={<Button variant="solid" />}
 *       triggerChildren="Acme"
 *     />
 *   );
 * }
 * ```
 */
export function WorkspaceMenu({
  workspaces,
  value,
  onValueChange,
  onCreate,
  onSettings,
  trigger,
  triggerChildren,
  triggerClassName,
  label = "Workspaces",
  className,
}: WorkspaceMenuProps) {
  return (
    <Menu>
      <MenuTrigger className={triggerClassName}>
        {trigger}
        {triggerChildren}
      </MenuTrigger>
      <MenuContent surface="solid" side="bottom" align="start" sideOffset={7} className={className}>
        <MenuLabel>{label}</MenuLabel>
        {workspaces.map((workspace) => (
          <MenuItem
            key={workspace.id}
            icon={<MenuTile>{workspace.initial ?? workspace.name.charAt(0).toUpperCase()}</MenuTile>}
            description={workspace.meta}
            selected={workspace.id === value}
            trailing={
              <view
                className={cn(
                  "flex flex-row items-center transition-opacity duration-150",
                  workspace.id === value ? "opacity-100" : "opacity-0",
                )}
              >
                <Icon name="Check" weight="bold" size={16} color="text-primary" />
              </view>
            }
            onClick={() => onValueChange?.(workspace.id)}
          >
            {workspace.name}
          </MenuItem>
        ))}
        <MenuSeparator />
        <MenuItem icon={<Icon name="PlusCircle" size={18} color="text-primary" />} onClick={onCreate}>
          New workspace
        </MenuItem>
        <MenuItem icon={<Icon name="GearSix" size={18} color="text-primary" />} onClick={onSettings}>
          Workspace settings
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
