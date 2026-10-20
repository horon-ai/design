"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const toggleGroupVariants = cva(
  "group/toggle-group flex w-fit items-center gap-0.5 rounded-md p-0.5 data-[orientation=vertical]:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        outline: "border border-border bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const toggleGroupItemVariants = cva(
  "group/toggle inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-all outline-none select-none hover:text-foreground focus-visible:z-1 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-pressed:text-foreground group-data-[variant=default]/toggle-group:data-pressed:bg-background group-data-[variant=default]/toggle-group:data-pressed:shadow-sm group-data-[variant=outline]/toggle-group:data-pressed:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        default: "h-7 min-w-7 px-2.5",
        sm: "h-6 min-w-6 px-2",
        lg: "h-8 min-w-8 px-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function ToggleGroup({
  className,
  variant = "default",
  ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleGroupVariants>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      className={cn(toggleGroupVariants({ variant }), className)}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-size={size}
      className={cn(toggleGroupItemVariants({ size }), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants, toggleGroupItemVariants };
