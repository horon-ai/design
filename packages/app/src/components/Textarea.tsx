import { useState } from "react"
import { TextInput, type TextInputProps } from "react-native"
import { useTheme } from "../theme"

export type TextareaProps = TextInputProps & {
	invalid?: boolean
}

export function Textarea({
	style,
	invalid = false,
	editable = true,
	numberOfLines = 4,
	onFocus,
	onBlur,
	...rest
}: TextareaProps) {
	const t = useTheme()
	const [focused, setFocused] = useState(false)

	const borderColor = invalid
		? t.colors.destructive
		: focused
			? t.colors.ring
			: t.colors.input

	return (
		<TextInput
			multiline
			numberOfLines={numberOfLines}
			textAlignVertical="top"
			editable={editable}
			onFocus={(event) => {
				setFocused(true)
				onFocus?.(event)
			}}
			onBlur={(event) => {
				setFocused(false)
				onBlur?.(event)
			}}
			placeholderTextColor={t.colors["muted-foreground"]}
			{...rest}
			style={[
				{
					minHeight:
						t.fontSize.sm * t.lineHeight.normal * numberOfLines + t.space[4],
					paddingHorizontal: t.space[3],
					paddingVertical: t.space[2],
					borderRadius: t.radius.md,
					borderWidth: 1,
					borderColor,
					backgroundColor: t.colors.background,
					color: t.colors.foreground,
					fontSize: t.fontSize.sm,
					lineHeight: t.fontSize.sm * t.lineHeight.normal,
					opacity: editable ? 1 : 0.5,
				},
				style,
			]}
		/>
	)
}
