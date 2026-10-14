import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "cn"

function NativeSelect({
	className,
	size = "default",
	...props
}: Omit<React.ComponentProps<"select">, "size"> & {
	size?: "sm" | "default"
}) {
	return (
		<div
			data-slot="native-select-wrapper"
			className="group/native-select relative w-fit has-[select:disabled]:opacity-50"
		>
			<select
				data-slot="native-select"
				data-size={size}
				className={cn(
					"w-full min-w-0 appearance-none rounded-sm border border-input bg-card text-sm text-foreground transition-colors outline-none selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
					"data-[size=default]:h-[37px] data-[size=default]:pr-9 data-[size=default]:pl-3 data-[size=sm]:h-7 data-[size=sm]:pr-7 data-[size=sm]:pl-2.5 data-[size=sm]:text-xs",
					className
				)}
				{...props}
			/>
			<ChevronDownIcon
				aria-hidden="true"
				className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
			/>
		</div>
	)
}

export { NativeSelect }
