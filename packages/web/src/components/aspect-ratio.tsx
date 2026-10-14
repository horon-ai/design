import * as React from "react"
import { cn } from "cn"

function AspectRatio({
	ratio = 16 / 9,
	className,
	style,
	...props
}: React.ComponentProps<"div"> & { ratio?: number }) {
	return (
		<div
			data-slot="aspect-ratio"
			style={{ aspectRatio: ratio, ...style }}
			className={cn("relative w-full overflow-hidden", className)}
			{...props}
		/>
	)
}

export { AspectRatio }
