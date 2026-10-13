import { View, type ViewProps } from "react-native"
import { Text } from "../primitives/Text"
import { useTheme } from "../theme"

export type BadgeVariant =
	| "default"
	| "secondary"
	| "outline"
	| "destructive"
	| "success"
	| "warning"

export type BadgeProps = ViewProps & {
	variant?: BadgeVariant
	label?: string
}

export function Badge({
	variant = "default",
	label,
	children,
	style,
	...rest
}: BadgeProps) {
	const t = useTheme()

	const palette = {
		default: { bg: t.colors.primary, fg: t.colors["primary-foreground"], border: "transparent" },
		secondary: { bg: t.colors.secondary, fg: t.colors["secondary-foreground"], border: "transparent" },
		outline: { bg: "transparent", fg: t.colors.foreground, border: t.colors.border },
		destructive: { bg: t.colors.destructive, fg: t.colors["destructive-foreground"], border: "transparent" },
		success: { bg: t.colors.success, fg: t.colors["success-foreground"], border: "transparent" },
		warning: { bg: t.colors.warning, fg: t.colors["warning-foreground"], border: "transparent" },
	}[variant]

	return (
		<View
			{...rest}
			style={[
				{
					alignSelf: "flex-start",
					flexDirection: "row",
					alignItems: "center",
					gap: t.space[1],
					paddingHorizontal: t.space[2],
					paddingVertical: t.space[0.5],
					borderRadius: t.radius.full,
					borderWidth: variant === "outline" ? 1 : 0,
					borderColor: palette.border,
					backgroundColor: palette.bg,
				},
				style,
			]}
		>
			{typeof children === "string" || typeof children === "number" || label ? (
				<Text
					style={{
						color: palette.fg,
						fontSize: t.fontSize.xs,
						fontWeight: t.fontWeight.medium,
						lineHeight: t.fontSize.xs * t.lineHeight.tight,
					}}
				>
					{children ?? label}
				</Text>
			) : (
				children
			)}
		</View>
	)
}
