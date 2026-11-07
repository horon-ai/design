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

export default function TabBarControlled() {
  const [value, setValue] = useState("inbox");
  return (
    <Backdrop className="flex-col gap-4">
      <TabBar aria-label="Main" items={items} value={value} onValueChange={setValue} />
      <p className="text-caption text-text-primary">Selected: {value}</p>
    </Backdrop>
  );
}
