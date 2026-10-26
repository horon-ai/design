import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

function Typography({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="typography"
      className={cn("flex flex-col gap-3 text-[13px] leading-relaxed text-foreground", className)}
      {...props}
    />
  );
}

const headingVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    level: {
      1: "text-display leading-tight",
      2: "text-heading leading-snug",
      3: "text-subtitle leading-snug",
      4: "text-lead leading-snug",
    },
  },
  defaultVariants: {
    level: 2,
  },
});

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
} as const;

function TypographyHeading({
  className,
  level = 2,
  ...props
}: React.ComponentProps<"h2"> & VariantProps<typeof headingVariants>) {
  const Tag: React.ElementType = headingTags[level ?? 2];
  return (
    <Tag
      data-slot="typography-heading"
      data-level={level}
      className={cn(headingVariants({ level }), className)}
      {...props}
    />
  );
}

function TypographyLead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="typography-lead"
      className={cn("text-lead leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

function TypographyMuted({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="typography-muted" className={cn("text-caption text-muted-foreground", className)} {...props} />;
}

function TypographyInlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="typography-inline-code"
      className={cn(
        "rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TypographyList({
  className,
  ordered = false,
  ...props
}: React.ComponentPropsWithoutRef<"ul"> & { ordered?: boolean }) {
  const Tag: React.ElementType = ordered ? "ol" : "ul";
  return (
    <Tag
      data-slot="typography-list"
      className={cn("ml-5 space-y-1.5 marker:text-muted-foreground", ordered ? "list-decimal" : "list-disc", className)}
      {...props}
    />
  );
}

export {
  Typography,
  TypographyHeading,
  TypographyLead,
  TypographyMuted,
  TypographyInlineCode,
  TypographyList,
  headingVariants,
};
