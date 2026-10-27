import { Check, GearSix, PlusCircle } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTile, MenuTrigger } from "./menu";

export type WorkspaceMenuItem = {
  id: string;
  name: string;
  /** Caption under the name, such as "12 members". */
  meta?: ReactNode;
  /** Tile initial; defaults to the first letter of the name. */
  initial?: string;
};

export type WorkspaceMenuProps = {
  workspaces: WorkspaceMenuItem[];
  value: string;
  onValueChange?: (id: string) => void;
  onCreate?: () => void;
  onSettings?: () => void;
  /** The element that opens the menu, such as the sidebar workspace button. */
  trigger: ComponentProps<typeof MenuTrigger>["render"];
  triggerChildren?: ReactNode;
  triggerClassName?: string;
  label?: ReactNode;
  className?: string;
};

/** Paper `Workspace menu`: solid 256px menu listing workspaces with a check on the current one. */
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
            trailing={workspace.id === value ? <Check weight="bold" className="animate-pop-in" /> : undefined}
            className={workspace.id === value ? "bg-overlay-ink-6" : undefined}
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
