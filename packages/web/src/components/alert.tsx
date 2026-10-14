import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
	"relative grid w-full grid-cols-[0_1fr] items-start gap-x-3 gap-y-1 rounded-md border px-4 py-3.5 text-[13px] has-[>svg]:grid-cols-[auto_1fr] [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
	{
		variants: {
			variant: {
				default: "border-border bg-card text-card-foreground",
				destructive:
					"border-destructive/30 bg-destructive/10 text-destructive *:data-[slot=alert-description]:text-destructive/90",
				success:
					"border-success/30 bg-success/10 text-success *:data-[slot=alert-description]:text-success/90",
				warning:
					"border-warning/30 bg-warning/10 text-warning *:data-[slot=alert-description]:text-warning/90",
				info: "border-info/30 bg-info/10 text-info *:data-[slot=alert-description]:text-info/90",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
)

function Alert({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return (
		<div
			data-slot="alert"
			data-variant={variant}
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	)
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"col-start-2 min-h-4 font-medium tracking-tight",
				className
			)}
			{...props}
		/>
	)
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"col-start-2 grid justify-items-start gap-1 text-muted-foreground [&_p]:leading-relaxed",
				className
			)}
			{...props}
		/>
	)
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
