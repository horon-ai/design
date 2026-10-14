import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "cn"
import { Progress } from "@horon/web/components/progress"

function Questionnaire({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="questionnaire"
			className={cn("flex w-full min-w-0 flex-col gap-6", className)}
			{...props}
		/>
	)
}

function QuestionnaireProgress({
	className,
	value,
	max,
	children,
	...props
}: React.ComponentProps<"div"> & { value?: number; max?: number }) {
	return (
		<div
			data-slot="questionnaire-progress"
			className={cn(
				"flex w-full min-w-0 items-center gap-3",
				className
			)}
			{...props}
		>
			<span className="min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums">
				{children}
			</span>
			{typeof value === "number" ? (
				<Progress value={value} max={max} className="min-w-0 flex-1 gap-0" />
			) : null}
		</div>
	)
}

function QuestionnaireItem({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="questionnaire-item"
			className={cn(
				"flex min-w-0 flex-col gap-5 border-0 p-0 outline-none",
				className
			)}
			{...props}
		/>
	)
}

function QuestionnaireOptions({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="questionnaire-options"
			className={cn("group/questionnaire-options grid min-w-0 gap-3", className)}
			{...props}
		/>
	)
}

function QuestionnaireOption({
	className,
	type = "radio",
	children,
	...props
}: React.ComponentProps<"label"> & { type?: "radio" | "checkbox" }) {
	return (
		<label
			data-slot="questionnaire-option"
			data-type={type}
			className={cn(
				"group/questionnaire-option relative flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-input bg-input/20 px-4 py-3 text-start text-sm transition-colors outline-none select-none hover:bg-input/40 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/10 has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50",
				className
			)}
			{...props}
		>
			<input
				data-slot="questionnaire-option-input"
				type={type}
				className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
			/>
			<span
				aria-hidden="true"
				data-slot="questionnaire-option-indicator"
				className={cn(
					"pointer-events-none relative flex size-4 shrink-0 items-center justify-center border border-input bg-background text-primary-foreground transition-colors group-has-[:checked]/questionnaire-option:border-primary group-has-[:checked]/questionnaire-option:bg-primary",
					type === "radio" ? "rounded-full" : "rounded-sm"
				)}
			>
				{type === "radio" ? (
					<span
						data-slot="questionnaire-option-indicator-dot"
						className="hidden size-2 rounded-full bg-primary-foreground group-has-[:checked]/questionnaire-option:block"
					/>
				) : (
					<CheckIcon
						data-slot="questionnaire-option-indicator-check"
						className="hidden size-3.5 group-has-[:checked]/questionnaire-option:block"
					/>
				)}
			</span>
			<span
				data-slot="questionnaire-option-label"
				className="flex min-w-0 flex-1 flex-col gap-1 leading-snug"
			>
				{children}
			</span>
		</label>
	)
}

export {
	Questionnaire,
	QuestionnaireItem,
	QuestionnaireOptions,
	QuestionnaireOption,
	QuestionnaireProgress,
}
