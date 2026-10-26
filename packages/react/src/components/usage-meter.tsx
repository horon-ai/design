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
  className?: string;
};

/** Figma `Usage meter` (in Loading 109:733): a thick-glass card with a 6px sky fill. */
export function UsageMeter({ label, value, detail, note, className }: UsageMeterProps) {
  return (
    <Meter.Root
      value={value}
      className={cn(
        "relative flex w-75 flex-col gap-2.5 overflow-clip rounded-xl border border-glass-rim-strong bg-glass-thick p-4",
        className,
      )}
    >
      <LiquidGlass tier="thick" />
      <div className="relative flex w-full items-center gap-2 text-label-md">
        <Meter.Label className="min-w-0 flex-1 text-text-primary">{label}</Meter.Label>
        <Meter.Value className="shrink-0 text-text-secondary" />
      </div>
      <Meter.Track className="relative h-1.5 w-full overflow-clip rounded-full bg-overlay-ink-8">
        <Meter.Indicator className="h-full rounded-full bg-sky-500" />
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
