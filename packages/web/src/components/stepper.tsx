"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"

type StepperOrientation = "horizontal" | "vertical"
type StepperState = "active" | "complete" | "inactive"

type StepperContextValue = {
	value: string | undefined
	setValue: (value: string) => void
	steps: string[]
	orientation: StepperOrientation
}

type StepperItemContextValue = {
	step: string
	index: number
	state: StepperState
}

const StepperContext = React.createContext<StepperContextValue | null>(null)
const StepperItemContext = React.createContext<StepperItemContextValue | null>(
	null
)

function useStepperContext() {
	const context = React.useContext(StepperContext)
	if (context === null) {
		throw new Error("Stepper parts must be rendered inside <Stepper>.")
	}
	return context
}

function useStepperItemContext() {
	const context = React.useContext(StepperItemContext)
	if (context === null) {
		throw new Error(
			"StepperTrigger, StepperIndicator, StepperTitle and StepperSeparator must be rendered inside <StepperItem>."
		)
	}
	return context
}

function Stepper({
	value,
	defaultValue,
	onValueChange,
	orientation = "horizontal",
	className,
	children,
	...props
}: Omit<React.ComponentProps<"div">, "defaultValue"> & {
	value?: string
	defaultValue?: string
	onValueChange?: (value: string) => void
	orientation?: StepperOrientation
}) {
	const [internalValue, setInternalValue] = React.useState(defaultValue)
	const currentValue = value ?? internalValue

	const setValue = React.useCallback(
		(nextValue: string) => {
			setInternalValue(nextValue)
			onValueChange?.(nextValue)
		},
		[onValueChange]
	)

	const steps = React.useMemo(
		() =>
			React.Children.toArray(children).flatMap((child) => {
				if (!React.isValidElement(child)) {
					return []
				}
				const step = (child.props as { step?: unknown }).step
				return typeof step === "string" ? [step] : []
			}),
		[children]
	)

	const contextValue = React.useMemo(
		() => ({ value: currentValue, setValue, steps, orientation }),
		[currentValue, setValue, steps, orientation]
	)

	return (
		<StepperContext.Provider value={contextValue}>
			<div
				data-slot="stepper"
				data-orientation={orientation}
				className={cn(
					"flex w-full items-center gap-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
					className
				)}
				{...props}
			>
				{children}
			</div>
		</StepperContext.Provider>
	)
}

function StepperItem({
	step,
	className,
	children,
	...props
}: React.ComponentProps<"li"> & { step: string }) {
	const { value, steps, orientation } = useStepperContext()
	const index = steps.indexOf(step)
	const activeIndex = value === undefined ? -1 : steps.indexOf(value)
	const state: StepperState =
		index === -1 || activeIndex === -1
			? "inactive"
			: index === activeIndex
				? "active"
				: index < activeIndex
					? "complete"
					: "inactive"

	const contextValue = React.useMemo(
		() => ({ step, index, state }),
		[step, index, state]
	)

	return (
		<StepperItemContext.Provider value={contextValue}>
			<li
				data-slot="stepper-item"
				data-state={state}
				data-orientation={orientation}
				className={cn(
					"group/stepper-item flex items-center gap-2 data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start",
					className
				)}
				{...props}
			>
				{children}
			</li>
		</StepperItemContext.Provider>
	)
}

function StepperTrigger({
	className,
	onClick,
	...props
}: React.ComponentProps<"button">) {
	const { setValue } = useStepperContext()
	const { step, state } = useStepperItemContext()

	return (
		<button
			type="button"
			data-slot="stepper-trigger"
			data-state={state}
			className={cn(
				"group/stepper-trigger flex items-center gap-2.5 rounded-md p-1 text-left outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
				className
			)}
			onClick={(event) => {
				onClick?.(event)
				if (!event.defaultPrevented) {
					setValue(step)
				}
			}}
			{...props}
		/>
	)
}

function StepperIndicator({
	className,
	children,
	...props
}: React.ComponentProps<"span">) {
	const { index, state } = useStepperItemContext()

	return (
		<span
			data-slot="stepper-indicator"
			data-state={state}
			className={cn(
				"flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground tabular-nums transition-colors group-data-[state=active]/stepper-item:border-primary group-data-[state=active]/stepper-item:bg-primary group-data-[state=active]/stepper-item:text-primary-foreground group-data-[state=complete]/stepper-item:border-primary group-data-[state=complete]/stepper-item:text-primary [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		>
			{state === "complete" ? <CheckIcon /> : (children ?? index + 1)}
		</span>
	)
}

function StepperTitle({ className, ...props }: React.ComponentProps<"span">) {
	const { state } = useStepperItemContext()

	return (
		<span
			data-slot="stepper-title"
			data-state={state}
			className={cn(
				"text-sm font-medium text-muted-foreground transition-colors group-data-[state=active]/stepper-item:text-foreground group-data-[state=complete]/stepper-item:text-foreground",
				className
			)}
			{...props}
		/>
	)
}

function StepperSeparator({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { orientation } = useStepperContext()
	const { state } = useStepperItemContext()

	return (
		<div
			data-slot="stepper-separator"
			data-state={state}
			role="presentation"
			aria-hidden="true"
			className={cn(
				"shrink-0 rounded-full bg-border transition-colors data-[state=complete]:bg-primary",
				orientation === "vertical" ? "my-1 h-6 w-px" : "mx-1 h-px flex-1",
				className
			)}
			{...props}
		/>
	)
}

export {
	Stepper,
	StepperItem,
	StepperTrigger,
	StepperIndicator,
	StepperTitle,
	StepperSeparator,
}
