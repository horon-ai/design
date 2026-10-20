import { cn } from "cn";

function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-[18px] shrink-0 animate-spin rounded-full border-2 border-foreground border-t-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Spinner };
