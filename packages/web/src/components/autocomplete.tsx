"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { cn } from "cn"

const Autocomplete = AutocompletePrimitive.Root

function AutocompleteInput({
  className,
  ...props
}: AutocompletePrimitive.Input.Props) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(
        "h-[37px] w-full min-w-0 rounded-sm border border-input bg-card px-3 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

type AutocompleteListChild = NonNullable<
  AutocompletePrimitive.List.Props["children"]
>
type AutocompleteListChildren =
  | AutocompleteListChild
  | readonly AutocompleteListChild[]
type AutocompleteListRender = Extract<
  AutocompleteListChild,
  (...args: never[]) => unknown
>

function AutocompleteList({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  ...props
}: Omit<AutocompletePrimitive.List.Props, "children"> & {
  children?: AutocompleteListChildren
  side?: AutocompletePrimitive.Positioner.Props["side"]
  sideOffset?: number
  align?: AutocompletePrimitive.Positioner.Props["align"]
}) {
  const rawChildren: unknown[] = Array.isArray(children)
    ? [...children]
    : [children]
  const renderItem = rawChildren.find(
    (child): child is AutocompleteListRender => typeof child === "function"
  )
  const popupBody = rawChildren.filter(
    (child) => typeof child !== "function"
  ) as React.ReactNode[]

  return (
    <AutocompletePrimitive.Portal>
      <AutocompletePrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        className="isolate z-50"
      >
        <AutocompletePrimitive.Popup
          data-slot="autocomplete-content"
          className="group/autocomplete-content relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-hidden glass-strong rounded-md text-foreground duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          {renderItem ? popupBody : null}
          <AutocompletePrimitive.List
            data-slot="autocomplete-list"
            className={cn(
              "max-h-(--available-height) scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
              className
            )}
            {...props}
          >
            {renderItem ?? popupBody}
          </AutocompletePrimitive.List>
        </AutocompletePrimitive.Popup>
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  )
}

function AutocompleteItem({
  className,
  ...props
}: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn(
        "hidden w-full justify-center px-2 py-6 text-center text-xs text-muted-foreground group-data-empty/autocomplete-content:flex",
        className
      )}
      {...props}
    />
  )
}

export {
  Autocomplete,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
}
