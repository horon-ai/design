import type { ReactNode } from "react"
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type CheckboxProps = {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
	disabled?: boolean
	indeterminate?: boolean
	label?: ReactNode
	style?: StyleProp<ViewStyle>
}

const BOX_SIZE = 18

export function Checkbox({
	checked = false,
	onCheckedChange,
	disabled = false,
	indeterminate = false,
	label,
	style,
}: CheckboxProps) {
	const t = useTheme()
	const active = checked || indeterminate

	return (
		<Pressable
			accessibilityRole="checkbox"
			accessibilityState={{ checked: indeterminate ? "mixed" : checked, disabled }}
			aria-checked={indeterminate ? "mixed" : checked}
			aria-disabled={disabled}
			disabled={disabled}
			onPress={() => onCheckedChange?.(!checked)}
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
					width: BOX_SIZE,
					height: BOX_SIZE,
					borderRadius: t.radius.xs,
					borderWidth: 1,
					borderColor: active ? t.colors.primary : t.colors.input,
					backgroundColor: active ? t.colors.primary : "transparent",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{indeterminate ? (
					<View
						style={{
							width: 9,
							height: 2,
							borderRadius: 1,
							backgroundColor: t.colors["primary-foreground"],
						}}
					/>
				) : checked ? (
					<View
						style={{
							width: 4,
							height: 8,
							borderRightWidth: 2,
							borderBottomWidth: 2,
							borderColor: t.colors["primary-foreground"],
							transform: [{ rotate: "45deg" }],
							marginTop: -2,
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
