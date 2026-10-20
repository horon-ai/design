import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const markerVariants = cva(
  "inline-flex w-fit max-w-full shrink-0 items-center gap-1.5 text-[13px] font-medium [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
        info: "text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Marker({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof markerVariants>) {
  return (
    <span data-slot="marker" data-variant={variant} className={cn(markerVariants({ variant }), className)} {...props} />
  );
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      {...props}
    />
  );
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="marker-content" className={cn("truncate", className)} {...props} />;
}

export { Marker, MarkerIcon, MarkerContent, markerVariants };
