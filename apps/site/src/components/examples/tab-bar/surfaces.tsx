import { TabBar } from "@horon-ai/react";
import { Bell, Cube, House, User } from "@phosphor-icons/react";
import { useState } from "react";

import { Backdrop } from "../../demo-backdrop";

const items = [
  { value: "home", label: "Home", icon: <House /> },
  { value: "inbox", label: "Inbox", icon: <Bell /> },
  { value: "artifacts", label: "Artifacts", icon: <Cube /> },
  { value: "me", label: "Me", icon: <User /> },
];

export default function TabBarSurfaces() {
  const [value, setValue] = useState("home");
  return (
    <Backdrop className="flex-col gap-6">
      <TabBar aria-label="Main" items={items} value={value} onValueChange={setValue} surface="glass" />
      <TabBar aria-label="Main" items={items} value={value} onValueChange={setValue} surface="flat" />
    </Backdrop>
  );
}
