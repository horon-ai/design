import * as React from "react"
import { cn } from "cn"

function Menu({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="menu"
			role="menu"
			className={cn(
				"flex w-[200px] flex-col gap-px rounded-md glass-strong p-1 text-foreground",
				className
			)}
			{...props}
		/>
	)
}

function MenuItem({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="menu-item"
			role="menuitem"
			className={cn(
				"flex w-full items-center gap-2 rounded-[5px] px-2.5 py-[7px] text-xs text-foreground outline-none select-none hover:bg-foreground/5 focus-visible:bg-foreground/5 data-disabled:pointer-events-none data-disabled:opacity-50",
				className
			)}
			{...props}
		/>
	)
}

function MenuLabel({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="menu-label"
			className={cn("px-2.5 py-1 text-[11px] text-muted-foreground", className)}
			{...props}
		/>
	)
}

function MenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="menu-separator"
			role="separator"
			className={cn("my-1 h-px bg-border", className)}
			{...props}
		/>
	)
}

export { Menu, MenuItem, MenuLabel, MenuSeparator }
