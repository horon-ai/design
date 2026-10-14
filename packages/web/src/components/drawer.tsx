"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { cn } from "cn"

import { Button } from "@horon/web/components/button"
import { XIcon } from "lucide-react"

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

const drawerViewportSideClasses: Record<
  "top" | "right" | "bottom" | "left",
  string
> = {
  top: "items-start justify-center",
  bottom: "items-end justify-center",
  left: "items-stretch justify-start",
  right: "items-stretch justify-end",
}

function DrawerContent({
  className,
  children,
  side = "bottom",
  showCloseButton = true,
  ...props
}: DrawerPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <DrawerPrimitive.Portal data-slot="drawer-portal">
      <DrawerPrimitive.Backdrop
        data-slot="drawer-backdrop"
        className="fixed inset-0 z-50 bg-black/10 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs"
      />
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        className={cn("fixed inset-0 z-50 flex", drawerViewportSideClasses[side])}
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          data-side={side}
          className={cn(
            "glass-strong flex flex-col bg-clip-padding text-sm transition duration-300 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:w-full data-[side=bottom]:rounded-t-lg data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=top]:w-full data-[side=top]:rounded-b-lg data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:rounded-r-lg data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:rounded-l-lg data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
            className
          )}
          {...props}
        >
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className="flex w-full flex-col gap-2.5 overflow-y-auto overscroll-contain"
          >
            {children}
          </DrawerPrimitive.Content>
          {showCloseButton && (
            <DrawerPrimitive.Close
              data-slot="drawer-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute top-3 right-3"
                  size="icon-sm"
                />
              }
            >
              <XIcon
              />
              <span data-slot="drawer-close-text" className="sr-only">Close</span>
            </DrawerPrimitive.Close>
          )}
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-0.5 p-[18px]", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-[18px]", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-[13px] text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
}
