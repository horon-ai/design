"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { cn } from "cn"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

const Combobox = ComboboxPrimitive.Root

function ComboboxInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      className={cn(
        "flex h-[37px] w-full min-w-0 items-center gap-1.5 rounded-sm border border-input bg-card px-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 has-[[aria-invalid]]:border-destructive has-[[aria-invalid]]:ring-3 has-[[aria-invalid]]:ring-destructive/20 dark:has-[[aria-invalid]]:border-destructive/50 dark:has-[[aria-invalid]]:ring-destructive/40",
        className
      )}
    >
      <ComboboxPrimitive.Input
        data-slot="combobox-input"
        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        {...props}
      />
      <ComboboxPrimitive.Trigger
        data-slot="combobox-trigger"
        className="-mr-1 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <ChevronDownIcon className="size-4" />
      </ComboboxPrimitive.Trigger>
    </ComboboxPrimitive.InputGroup>
  )
}

type ComboboxListChild = NonNullable<
  ComboboxPrimitive.List.Props["children"]
>
type ComboboxListChildren =
  | ComboboxListChild
  | readonly ComboboxListChild[]
type ComboboxListRender = Extract<
  ComboboxListChild,
  (...args: never[]) => unknown
>

function ComboboxList({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  ...props
}: Omit<ComboboxPrimitive.List.Props, "children"> & {
  children?: ComboboxListChildren
  side?: ComboboxPrimitive.Positioner.Props["side"]
  sideOffset?: number
  align?: ComboboxPrimitive.Positioner.Props["align"]
}) {
  const rawChildren: unknown[] = Array.isArray(children)
    ? [...children]
    : [children]
  const renderItem = rawChildren.find(
    (child): child is ComboboxListRender => typeof child === "function"
  )
  const popupBody = rawChildren.filter(
    (child) => typeof child !== "function"
  ) as React.ReactNode[]

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className="group/combobox-content relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-hidden glass-strong rounded-md text-foreground duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          {renderItem ? popupBody : null}
          <ComboboxPrimitive.List
            data-slot="combobox-list"
            className={cn(
              "max-h-(--available-height) scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
              className
            )}
            {...props}
          >
            {renderItem ?? popupBody}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span
            data-slot="combobox-item-indicator"
            className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
          />
        }
      >
        <CheckIcon className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center px-2 py-6 text-center text-xs text-muted-foreground group-data-empty/combobox-content:flex",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "flex min-h-[37px] w-full flex-wrap items-center gap-1.5 rounded-sm border border-input bg-card bg-clip-padding px-2.5 py-1.5 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-[[aria-invalid]]:border-destructive has-[[aria-invalid]]:ring-3 has-[[aria-invalid]]:ring-destructive/20 dark:has-[[aria-invalid]]:border-destructive/50 dark:has-[[aria-invalid]]:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  ...props
}: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent bg-secondary px-2.5 text-[11px] font-semibold whitespace-nowrap text-secondary-foreground transition-all select-none data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ChipRemove
        data-slot="combobox-chip-remove"
        className="-mr-1 inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <XIcon className="size-3" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  )
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
}
