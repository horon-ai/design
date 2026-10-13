import { useState } from "react"
import { TextInput, type TextInputProps } from "react-native"
import { useTheme } from "../theme"

export type InputProps = TextInputProps & {
	invalid?: boolean
}

export function Input({
	style,
	invalid = false,
	editable = true,
	onFocus,
	onBlur,
	...rest
}: InputProps) {
	const t = useTheme()
	const [focused, setFocused] = useState(false)

	const borderColor = invalid
		? t.colors.destructive
		: focused
			? t.colors.ring
			: t.colors.input

	return (
		<TextInput
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
					height: 36,
					paddingHorizontal: t.space[3],
					borderRadius: t.radius.md,
					borderWidth: 1,
					borderColor,
					backgroundColor: t.colors.background,
					color: t.colors.foreground,
					fontSize: t.fontSize.sm,
					opacity: editable ? 1 : 0.5,
				},
				style,
			]}
		/>
	)
}
