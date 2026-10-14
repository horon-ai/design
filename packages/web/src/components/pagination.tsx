import * as React from "react"
import type { VariantProps } from "class-variance-authority"
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	MoreHorizontalIcon,
} from "lucide-react"
import { buttonVariants } from "@horon/web/components/button"
import { cn } from "cn"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			data-slot="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	)
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex flex-row items-center gap-1", className)}
			{...props}
		/>
	)
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
	return (
		<li
			data-slot="pagination-item"
			className={cn("flex", className)}
			{...props}
		/>
	)
}

function PaginationLink({
	className,
	isActive = false,
	size = "icon",
	...props
}: React.ComponentProps<"a"> &
	Pick<VariantProps<typeof buttonVariants>, "size"> & {
		isActive?: boolean
	}) {
	return (
		<a
			aria-current={isActive ? "page" : undefined}
			data-slot="pagination-link"
			data-active={isActive ? "" : undefined}
			className={cn(
				buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
				className
			)}
			{...props}
		/>
	)
}

function PaginationPrevious({
	className,
	text = "Previous",
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			size="default"
			className={cn("gap-1 px-2.5 sm:pl-2", className)}
			{...props}
		>
			<ChevronLeftIcon />
			<span className="hidden sm:block">{text}</span>
		</PaginationLink>
	)
}

function PaginationNext({
	className,
	text = "Next",
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			size="default"
			className={cn("gap-1 px-2.5 sm:pr-2", className)}
			{...props}
		>
			<span className="hidden sm:block">{text}</span>
			<ChevronRightIcon />
		</PaginationLink>
	)
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden="true"
			data-slot="pagination-ellipsis"
			className={cn(
				"flex size-8 items-center justify-center text-muted-foreground",
				className
			)}
			{...props}
		>
			<MoreHorizontalIcon className="size-4" />
			<span className="sr-only">More pages</span>
		</span>
	)
}

export {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
}
