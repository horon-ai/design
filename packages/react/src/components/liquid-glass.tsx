import * as React from "react";
import { cn } from "cn";

function LiquidGlass({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="liquid-glass" className={cn("liquid-glass rounded-md text-foreground", className)} {...props} />
  );
}

export { LiquidGlass };
