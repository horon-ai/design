import * as React from "react"
import { XIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const chipVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-[3px] text-[11px] font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				outline: "border-border text-foreground",
				accent: "border-transparent bg-accent text-accent-foreground",
				success: "border-transparent bg-success text-success-foreground",
				warning: "border-transparent bg-warning text-warning-foreground",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
)

type ChipProps = React.ComponentProps<"span"> &
	VariantProps<typeof chipVariants> & {
		onRemove?: React.MouseEventHandler<HTMLButtonElement>
		removeLabel?: string
	}

function Chip({
	className,
	variant = "default",
	children,
	onRemove,
	removeLabel = "Remove",
	...props
}: ChipProps) {
	return (
		<span
			data-slot="chip"
			data-variant={variant}
			className={cn(chipVariants({ variant }), className)}
			{...props}
		>
			{children}
			{onRemove ? (
				<button
					type="button"
					data-slot="chip-remove"
					aria-label={removeLabel}
					onClick={onRemove}
					className="-mr-1 inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
				>
					<XIcon aria-hidden="true" />
				</button>
			) : null}
		</span>
	)
}

export { Chip, chipVariants, type ChipProps }
