import type { ReactElement, ReactNode } from "react";
import { Check, GearSix, PlusCircle } from "phosphor-react-native";

import { useHoronTheme } from "../provider";
import { ACTIVE_ICON_WEIGHT } from "../lib/icon";
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
   * The element that opens the menu, such as the sidebar workspace button. React took it as the menu
   * trigger through `render`; here it is cloned with the press handler and measured for the anchor, so
   * `triggerChildren` paints inside it.
   */
  trigger: ReactElement;
  /** Content of the trigger when `trigger` renders a plain element rather than taking children. */
  triggerChildren?: ReactNode;
  /** Menu heading above the workspace rows. @default "Workspaces" */
  label?: ReactNode;
};

/**
 * Paper `Workspace menu`: solid 256pt menu listing workspaces with a check on the current one.
 *
 * Wraps the package {@link Menu} in a solid surface so the popup stays readable over any background.
 * Each row shows a tile with the workspace initial and fades a check in on the selected id; a separator
 * then offers "New workspace" and "Workspace settings". The menu is anchored to `trigger` and opens
 * below it, aligned to the start edge.
 *
 * @example
 * ```tsx
 * const [current, setCurrent] = useState("acme");
 *
 * <WorkspaceMenu
 *   workspaces={[
 *     { id: "acme", name: "Acme" },
 *     { id: "labs", name: "Labs", meta: "4 members" },
 *   ]}
 *   value={current}
 *   onValueChange={setCurrent}
 *   trigger={<Button variant="solid" />}
 *   triggerChildren="Acme"
 * />
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
  label = "Workspaces",
}: WorkspaceMenuProps) {
  const theme = useHoronTheme();
  return (
    <Menu>
      <MenuTrigger render={trigger}>{triggerChildren}</MenuTrigger>
      <MenuContent surface="solid" side="bottom" align="start" sideOffset={7}>
        <MenuLabel>{label}</MenuLabel>
        {workspaces.map((workspace) => (
          <MenuItem
            key={workspace.id}
            icon={<MenuTile>{workspace.initial ?? workspace.name.charAt(0).toUpperCase()}</MenuTile>}
            description={workspace.meta}
            selected={workspace.id === value}
            trailing={
              <Check
                size={16}
                weight={ACTIVE_ICON_WEIGHT}
                color={workspace.id === value ? theme.color("text-primary") : "transparent"}
              />
            }
            onClick={() => onValueChange?.(workspace.id)}
          >
            {workspace.name}
          </MenuItem>
        ))}
        <MenuSeparator />
        <MenuItem icon={<PlusCircle size={18} color={theme.color("text-primary")} />} onClick={onCreate}>
          New workspace
        </MenuItem>
        <MenuItem icon={<GearSix size={18} color={theme.color("text-primary")} />} onClick={onSettings}>
          Workspace settings
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
