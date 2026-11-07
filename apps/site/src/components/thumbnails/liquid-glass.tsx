import { HoronIcon, LiquidGlass } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function LiquidGlassThumbnail() {
  return (
    <div className="w-[330px]">
      <Backdrop className="relative h-[176px] overflow-hidden rounded-xl">
        <span aria-hidden className="absolute top-5 left-5 size-20 rounded-full bg-sky-700/55" />
        <span aria-hidden className="absolute top-4 right-7 size-16 rounded-full bg-neutral-900/30" />
        <span
          aria-hidden
          className="absolute right-12 bottom-1 size-16 rounded-full bg-sky-100/75 dark:bg-sky-500/25"
        />
        <div className="relative flex w-[240px] items-center gap-3 overflow-clip rounded-xl bg-glass-regular p-4 text-text-primary">
          <LiquidGlass />
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-overlay-ink-6">
            <HoronIcon size={20} />
          </span>
          <span className="relative flex min-w-0 flex-col">
            <span className="text-label-md">Flue</span>
            <span className="text-caption text-text-secondary">Glass over sky</span>
          </span>
        </div>
      </Backdrop>
    </div>
  );
}
