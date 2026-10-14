import * as React from "react"
import { cn } from "cn"

function List({ className, ...props }: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="list"
			className={cn(
				"flex w-full flex-col divide-y divide-border overflow-hidden rounded-md border border-border bg-card text-card-foreground",
				className
			)}
			{...props}
		/>
	)
}

function ListItem({
	className,
	interactive = false,
	...props
}: React.ComponentProps<"li"> & {
	interactive?: boolean
}) {
	return (
		<li
			data-slot="list-item"
			data-interactive={interactive ? "" : undefined}
			className={cn(
				"flex items-center gap-3 px-4 py-3 text-sm",
				interactive &&
					"cursor-pointer transition-colors hover:bg-muted/60 active:bg-muted",
				className
			)}
			{...props}
		/>
	)
}

function ListItemMedia({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="list-item-media"
			className={cn(
				"flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	)
}

function ListItemContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="list-item-content"
			className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
			{...props}
		/>
	)
}

function ListItemTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="list-item-title"
			className={cn("truncate font-medium text-foreground", className)}
			{...props}
		/>
	)
}

function ListItemDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="list-item-description"
			className={cn("truncate text-muted-foreground", className)}
			{...props}
		/>
	)
}

function ListItemTrailing({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="list-item-trailing"
			className={cn(
				"ml-auto flex shrink-0 items-center gap-2 text-muted-foreground",
				className
			)}
			{...props}
		/>
	)
}

export {
	List,
	ListItem,
	ListItemMedia,
	ListItemContent,
	ListItemTitle,
	ListItemDescription,
	ListItemTrailing,
}
