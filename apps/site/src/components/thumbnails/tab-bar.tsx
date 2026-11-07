import { HoronIcon } from "@horon-ai/react";
import { Bell, Cube, User } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { Backdrop } from "../demo-backdrop";

/**
 * Static facsimile of the glass tab bar: `TabBar` measures the current tab to place its ink pill,
 * and the index never hydrates, so the pill is drawn inside the current tab here.
 */
const items: { value: string; label: string; icon: ReactNode }[] = [
  { value: "horon", label: "Horon", icon: <HoronIcon /> },
  { value: "inbox", label: "Inbox", icon: <Bell /> },
  { value: "artifacts", label: "Artifacts", icon: <Cube /> },
  { value: "me", label: "Me", icon: <User /> },
];

export default function TabBarThumbnail() {
  return (
    <div className="w-83">
      <Backdrop className="p-4">
        <nav
          aria-label="Main"
          className="relative flex w-fit items-center gap-1 rounded-full bg-glass-regular p-1.5"
        >
          {items.map((item, index) => {
            const current = index === 0;
            return (
              <span
                key={item.value}
                className={`relative flex h-12 w-16 items-center justify-center rounded-full [&_svg]:size-5.5 ${
                  current ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {current && <span aria-hidden className="absolute inset-0 rounded-full bg-glass-thick dark:bg-overlay-ink-10" />}
                <span className="relative flex">{item.icon}</span>
              </span>
            );
          })}
        </nav>
      </Backdrop>
    </div>
  );
}
