"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "cn"
import { Button } from "@horon/web/components/button"
import { Calendar } from "@horon/web/components/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@horon/web/components/popover"

type DatePickerProps = {
	value?: Date
	defaultValue?: Date
	onValueChange?: (date: Date | undefined) => void
	placeholder?: string
	disabled?: boolean
	className?: string
	align?: "start" | "center" | "end"
}

function DatePicker({
	value,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date",
	disabled,
	className,
	align = "start",
}: DatePickerProps) {
	const [internalValue, setInternalValue] = React.useState<Date | undefined>(
		defaultValue
	)
	const selected = value ?? internalValue

	const handleSelect = React.useCallback(
		(date: Date | undefined) => {
			setInternalValue(date)
			onValueChange?.(date)
		},
		[onValueChange]
	)

	return (
		<Popover>
			<PopoverTrigger
				disabled={disabled}
				render={
					<Button
						variant="outline"
						disabled={disabled}
						className={cn(
							"w-60 justify-start text-left font-normal",
							!selected && "text-muted-foreground",
							className
						)}
					/>
				}
			>
				<CalendarIcon />
				{selected ? format(selected, "PPP") : <span>{placeholder}</span>}
			</PopoverTrigger>
			<PopoverContent className="w-auto p-3" align={align}>
				<Calendar
					mode="single"
					selected={selected}
					onSelect={handleSelect}
					defaultMonth={selected}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	)
}

type DateRangePickerProps = {
	value?: DateRange
	defaultValue?: DateRange
	onValueChange?: (range: DateRange | undefined) => void
	placeholder?: string
	numberOfMonths?: number
	disabled?: boolean
	className?: string
	align?: "start" | "center" | "end"
}

function DateRangePicker({
	value,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date range",
	numberOfMonths = 2,
	disabled,
	className,
	align = "start",
}: DateRangePickerProps) {
	const [internalValue, setInternalValue] = React.useState<
		DateRange | undefined
	>(defaultValue)
	const range = value ?? internalValue

	const handleSelect = React.useCallback(
		(nextRange: DateRange | undefined) => {
			setInternalValue(nextRange)
			onValueChange?.(nextRange)
		},
		[onValueChange]
	)

	return (
		<Popover>
			<PopoverTrigger
				disabled={disabled}
				render={
					<Button
						variant="outline"
						disabled={disabled}
						className={cn(
							"w-72 justify-start text-left font-normal",
							!range?.from && "text-muted-foreground",
							className
						)}
					/>
				}
			>
				<CalendarIcon />
				{range?.from ? (
					range.to ? (
						<>
							{format(range.from, "LLL dd, y")} –{" "}
							{format(range.to, "LLL dd, y")}
						</>
					) : (
						format(range.from, "LLL dd, y")
					)
				) : (
					<span>{placeholder}</span>
				)}
			</PopoverTrigger>
			<PopoverContent className="w-auto p-3" align={align}>
				<Calendar
					mode="range"
					defaultMonth={range?.from}
					selected={range}
					onSelect={handleSelect}
					numberOfMonths={numberOfMonths}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	)
}

export { DatePicker, DateRangePicker }
export type { DateRange }
