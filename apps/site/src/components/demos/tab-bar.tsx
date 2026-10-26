import { HoronIcon, TabBar } from "@horon-ai/react";
import { Bell, Cube, User } from "@phosphor-icons/react";
import { useState } from "react";

import { Backdrop } from "../demo-backdrop";

const items = [
  { value: "horon", label: "Horon", icon: <HoronIcon /> },
  { value: "inbox", label: "Inbox", icon: <Bell /> },
  { value: "artifacts", label: "Artifacts", icon: <Cube /> },
  { value: "me", label: "Me", icon: <User /> },
];

export default function TabBarDemo() {
  const [value, setValue] = useState("horon");
  return (
    <Backdrop>
      <TabBar items={items} value={value} onValueChange={setValue} />
    </Backdrop>
  );
}
