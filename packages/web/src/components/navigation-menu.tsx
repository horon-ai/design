"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

function NavigationMenu({
	className,
	children,
	...props
}: NavigationMenuPrimitive.Root.Props) {
	return (
		<NavigationMenuPrimitive.Root
			data-slot="navigation-menu"
			className={cn("relative flex max-w-max flex-1 items-center justify-center", className)}
			{...props}
		>
			{children}
			<NavigationMenuPrimitive.Portal>
				<NavigationMenuPrimitive.Positioner
					sideOffset={8}
					className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-200 ease-out data-instant:transition-none"
				>
					<NavigationMenuPrimitive.Popup
						data-slot="navigation-menu-popup"
						className="relative isolate z-50 h-(--popup-height) w-(--popup-width) origin-(--transform-origin) glass-strong rounded-md text-sm text-foreground outline-none transition-[opacity,transform,width,height,scale] duration-200 ease-out data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-100"
					>
						<NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
					</NavigationMenuPrimitive.Popup>
				</NavigationMenuPrimitive.Positioner>
			</NavigationMenuPrimitive.Portal>
		</NavigationMenuPrimitive.Root>
	)
}

function NavigationMenuList({
	className,
	...props
}: NavigationMenuPrimitive.List.Props) {
	return (
		<NavigationMenuPrimitive.List
			data-slot="navigation-menu-list"
			className={cn(
				"group flex flex-1 list-none items-center justify-center gap-1",
				className
			)}
			{...props}
		/>
	)
}

function NavigationMenuItem({
	className,
	...props
}: NavigationMenuPrimitive.Item.Props) {
	return (
		<NavigationMenuPrimitive.Item
			data-slot="navigation-menu-item"
			className={cn("relative", className)}
			{...props}
		/>
	)
}

function NavigationMenuTrigger({
	className,
	children,
	...props
}: NavigationMenuPrimitive.Trigger.Props) {
	return (
		<NavigationMenuPrimitive.Trigger
			data-slot="navigation-menu-trigger"
			className={cn(
				"inline-flex h-9 w-max items-center justify-center gap-1 rounded-md px-3 text-sm font-medium whitespace-nowrap text-foreground transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-accent data-popup-open:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		>
			{children}
			<NavigationMenuPrimitive.Icon
				data-slot="navigation-menu-icon"
				className="relative top-px transition-transform duration-200 data-popup-open:rotate-180"
			>
				<ChevronDownIcon />
			</NavigationMenuPrimitive.Icon>
		</NavigationMenuPrimitive.Trigger>
	)
}

function NavigationMenuContent({
	className,
	...props
}: NavigationMenuPrimitive.Content.Props) {
	return (
		<NavigationMenuPrimitive.Content
			data-slot="navigation-menu-content"
			className={cn(
				"h-full w-full p-2 transition-[opacity,transform,translate] duration-200 ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-starting-style:data-[activation-direction=left]:-translate-x-1/2 data-starting-style:data-[activation-direction=right]:translate-x-1/2 data-ending-style:data-[activation-direction=left]:translate-x-1/2 data-ending-style:data-[activation-direction=right]:-translate-x-1/2",
				className
			)}
			{...props}
		/>
	)
}

function NavigationMenuLink({
	className,
	...props
}: NavigationMenuPrimitive.Link.Props) {
	return (
		<NavigationMenuPrimitive.Link
			data-slot="navigation-menu-link"
			className={cn(
				"block rounded-md p-2 text-sm text-foreground no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-active:bg-accent data-active:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	)
}

export {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuTrigger,
	NavigationMenuContent,
	NavigationMenuLink,
}
