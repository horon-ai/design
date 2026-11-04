import { Meter } from "@base-ui/react/meter";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type UsageMeterProps = {
  label: ReactNode;
  /** 0-100. */
  value: number;
  /** Left caption, such as "6,420 of 10,000 tasks". */
  detail?: ReactNode;
  /** Right caption, such as "Resets Nov 1". */
  note?: ReactNode;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. */
  surface?: "solid" | "glass";
  className?: string;
};

/** Figma `Usage meter` (in Loading 109:733): a card with a 6px sky fill, solid or thick glass. */
export function UsageMeter({ label, value, detail, note, surface = "solid", className }: UsageMeterProps) {
  return (
    <Meter.Root
      value={value}
      className={cn(
        "relative flex w-75 flex-col gap-2 overflow-clip rounded-xl p-4",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <div className="relative flex w-full items-center gap-2 text-label-md">
        <Meter.Label className="min-w-0 flex-1 text-text-primary">{label}</Meter.Label>
        <Meter.Value className="shrink-0 text-text-secondary tabular-nums" />
      </div>
      <Meter.Track className="relative h-1.5 w-full overflow-clip rounded-full bg-overlay-ink-8">
        <Meter.Indicator className="h-full rounded-full bg-sky-500 transition-[width] duration-400 ease-out-quint" />
      </Meter.Track>
      {(detail || note) && (
        <div className="relative flex w-full items-center gap-2 text-caption text-text-secondary">
          <span className="min-w-0 flex-1">{detail}</span>
          {note && <span className="shrink-0 whitespace-nowrap">{note}</span>}
        </div>
      )}
    </Meter.Root>
  );
}
