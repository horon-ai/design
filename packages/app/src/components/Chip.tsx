import { Pressable, View, type StyleProp, type ViewStyle } from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type ChipProps = {
	label: string
	selected?: boolean
	disabled?: boolean
	onPress?: () => void
	onDismiss?: () => void
	style?: StyleProp<ViewStyle>
}

export function Chip({
	label,
	selected = false,
	disabled = false,
	onPress,
	onDismiss,
	style,
}: ChipProps) {
	const t = useTheme()

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected, disabled }}
			aria-pressed={selected}
			aria-disabled={disabled}
			disabled={disabled || !onPress}
			onPress={onPress}
			style={[
				{
					flexDirection: "row",
					alignItems: "center",
					alignSelf: "flex-start",
					gap: t.space[1.5],
					paddingLeft: t.space[3],
					paddingRight: onDismiss ? t.space[1.5] : t.space[3],
					paddingVertical: t.space[1],
					borderRadius: t.radius.full,
					borderWidth: 1,
					borderColor: selected ? t.colors.primary : t.colors.border,
					backgroundColor: selected ? t.colors.primary : t.colors.card,
					opacity: disabled ? 0.5 : 1,
				},
				style,
			]}
		>
			<Text
				style={{
					color: selected
						? t.colors["primary-foreground"]
						: t.colors.foreground,
					fontSize: t.fontSize.xs,
					fontWeight: t.fontWeight.medium,
				}}
			>
				{label}
			</Text>
			{onDismiss ? (
				<Pressable
					accessibilityRole="button"
					accessibilityLabel={`Remove ${label}`}
					hitSlop={6}
					disabled={disabled}
					onPress={onDismiss}
					style={{
						width: 16,
						height: 16,
						borderRadius: t.radius.full,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<View
						style={{
							width: 8,
							height: 8,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							style={{
								color: selected
									? t.colors["primary-foreground"]
									: t.colors["muted-foreground"],
								fontSize: t.fontSize.sm,
								lineHeight: t.fontSize.sm,
							}}
						>
							×
						</Text>
					</View>
				</Pressable>
			) : null}
		</Pressable>
	)
}
