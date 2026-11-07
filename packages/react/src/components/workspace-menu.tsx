import { Check, GearSix, PlusCircle } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

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
  /** The element that opens the menu, such as the sidebar workspace button. */
  trigger: ComponentProps<typeof MenuTrigger>["render"];
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
 * import { WorkspaceMenu } from "@horon-ai/react";
 * import { useState } from "react";
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
 *       trigger={<button type="button">Acme</button>}
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
      <MenuTrigger render={trigger} className={triggerClassName}>
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
              <Check
                weight="bold"
                className={cn("transition-opacity duration-150", workspace.id === value ? "opacity-100" : "opacity-0")}
              />
            }
            onClick={() => onValueChange?.(workspace.id)}
          >
            {workspace.name}
          </MenuItem>
        ))}
        <MenuSeparator />
        <MenuItem icon={<PlusCircle />} onClick={onCreate}>
          New workspace
        </MenuItem>
        <MenuItem icon={<GearSix />} onClick={onSettings}>
          Workspace settings
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
