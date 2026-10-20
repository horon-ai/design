import * as React from "react";
import { cn } from "cn";

function GlassSurface({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="glass-surface"
      className={cn("glass rounded-md px-4 py-3 text-[13px] text-foreground", className)}
      {...props}
    />
  );
}

export { GlassSurface };
