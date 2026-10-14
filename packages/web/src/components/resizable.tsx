"use client"

import * as React from "react"
import { Group, Panel, Separator } from "react-resizable-panels"
import { GripVerticalIcon } from "lucide-react"
import { cn } from "cn"

function ResizablePanelGroup({
	className,
	...props
}: React.ComponentProps<typeof Group>) {
	return (
		<Group
			data-slot="resizable-panel-group"
			className={cn("rounded-md", className)}
			{...props}
		/>
	)
}

function ResizablePanel({
	className,
	...props
}: React.ComponentProps<typeof Panel>) {
	return (
		<Panel
			data-slot="resizable-panel"
			className={cn("bg-card text-card-foreground", className)}
			{...props}
		/>
	)
}

function ResizableHandle({
	withHandle = false,
	className,
	children,
	...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) {
	return (
		<Separator
			data-slot="resizable-handle"
			className={cn(
				"relative flex shrink-0 items-center justify-center bg-border outline-none transition-colors",
				"aria-[orientation=vertical]:w-px aria-[orientation=horizontal]:h-px",
				"after:absolute after:bg-transparent",
				"aria-[orientation=vertical]:after:inset-y-0 aria-[orientation=vertical]:after:-inset-x-1",
				"aria-[orientation=horizontal]:after:-inset-y-1 aria-[orientation=horizontal]:after:inset-x-0",
				"data-[separator=hover]:bg-ring/60 data-[separator=active]:bg-ring data-[separator=focus]:bg-ring",
				"focus-visible:ring-3 focus-visible:ring-ring/50",
				"aria-[orientation=vertical]:[&>span]:h-4 aria-[orientation=vertical]:[&>span]:w-3",
				"aria-[orientation=horizontal]:[&>span]:h-3 aria-[orientation=horizontal]:[&>span]:w-4",
				"aria-[orientation=horizontal]:[&>span>svg]:rotate-90",
				className
			)}
			{...props}
		>
			{withHandle ? (
				<span
					data-slot="resizable-handle-grip"
					className="z-10 flex items-center justify-center rounded-sm border border-border bg-muted text-muted-foreground"
				>
					<GripVerticalIcon className="size-2.5" />
				</span>
			) : null}
			{children}
		</Separator>
	)
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
