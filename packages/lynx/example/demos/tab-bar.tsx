import { useState } from "@lynx-js/react";

import { Icon } from "../../src/icons";
import { TabBar, type TabBarItem } from "../../src/components/tab-bar";

import { Backdrop } from "./backdrop";

/**
 * Four destinations at the three rungs. The bar is fully controlled, so the demo
 * owns the value; each rung uses its own icon size (20/22/24px), which Lynx sets
 * on the glyph instead of through a `[&_svg]:size-*` class.
 */
const makeItems = (size: number): TabBarItem[] => [
  { value: "home", label: "Horon", icon: <Icon name="House" size={size} color="text-primary" /> },
  { value: "inbox", label: "Inbox", icon: <Icon name="Bell" size={size} color="text-primary" /> },
  { value: "artifacts", label: "Artifacts", icon: <Icon name="Cube" size={size} color="text-primary" /> },
  { value: "me", label: "Me", icon: <Icon name="User" size={size} color="text-primary" /> },
];

export default function TabBarDemo() {
  const [value, setValue] = useState("home");
  return (
    <Backdrop className="flex-col">
      <TabBar items={makeItems(20)} value={value} onValueChange={setValue} size="sm" />
      <TabBar items={makeItems(22)} value={value} onValueChange={setValue} />
      <TabBar items={makeItems(24)} value={value} onValueChange={setValue} size="lg" />
      <TabBar items={makeItems(22)} value={value} onValueChange={setValue} surface="flat" />
    </Backdrop>
  );
}
