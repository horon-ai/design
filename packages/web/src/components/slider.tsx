"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

function Slider({ className, ...props }: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none items-center gap-3 select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function SliderTrack({ className, children, ...props }: SliderPrimitive.Track.Props) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className="relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative h-1.5 w-full grow rounded-full bg-muted data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
          className,
        )}
        {...props}
      >
        {children}
      </SliderPrimitive.Track>
    </SliderPrimitive.Control>
  );
}

function SliderIndicator({ className, ...props }: SliderPrimitive.Indicator.Props) {
  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      className={cn(
        "absolute rounded-full bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
        className,
      )}
      {...props}
    />
  );
}

function SliderThumb({ className, ...props }: SliderPrimitive.Thumb.Props) {
  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      className={cn(
        "block size-4 shrink-0 rounded-full border-2 border-primary bg-background shadow-sm transition-[color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn("text-sm text-muted-foreground tabular-nums", className)}
      {...props}
    />
  );
}

export { Slider, SliderTrack, SliderIndicator, SliderThumb, SliderValue };
