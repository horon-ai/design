import type { ReactNode } from "react"
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type RadioProps = {
	selected?: boolean
	onSelect?: () => void
	disabled?: boolean
	label?: ReactNode
	style?: StyleProp<ViewStyle>
}

const DOT_SIZE = 18

export function Radio({
	selected = false,
	onSelect,
	disabled = false,
	label,
	style,
}: RadioProps) {
	const t = useTheme()

	return (
		<Pressable
			accessibilityRole="radio"
			accessibilityState={{ checked: selected, disabled }}
			aria-checked={selected}
			aria-disabled={disabled}
			disabled={disabled}
			onPress={() => onSelect?.()}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					gap: t.space[2],
					opacity: disabled ? 0.5 : 1,
				},
				style,
			]}
		>
			<View
				style={{
					width: DOT_SIZE,
					height: DOT_SIZE,
					borderRadius: t.radius.full,
					borderWidth: 1,
					borderColor: selected ? t.colors.primary : t.colors.input,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{selected ? (
					<View
						style={{
							width: 9,
							height: 9,
							borderRadius: t.radius.full,
							backgroundColor: t.colors.primary,
						}}
					/>
				) : null}
			</View>
			{label == null ? null : typeof label === "string" ||
			  typeof label === "number" ? (
				<Text style={{ color: t.colors.foreground, fontSize: t.fontSize.sm }}>
					{label}
				</Text>
			) : (
				label
			)}
		</Pressable>
	)
}

export type RadioOption = {
	value: string
	label: ReactNode
	disabled?: boolean
}

export type RadioGroupProps = {
	value?: string
	onValueChange?: (value: string) => void
	options: RadioOption[]
	disabled?: boolean
	style?: StyleProp<ViewStyle>
}

export function RadioGroup({
	value,
	onValueChange,
	options,
	disabled = false,
	style,
}: RadioGroupProps) {
	const t = useTheme()

	return (
		<View
			accessibilityRole="radiogroup"
			style={[{ gap: t.space[3] }, style]}
		>
			{options.map((option) => (
				<Radio
					key={option.value}
					selected={option.value === value}
					disabled={disabled || option.disabled}
					label={option.label}
					onSelect={() => onValueChange?.(option.value)}
				/>
			))}
		</View>
	)
}
